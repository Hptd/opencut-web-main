use std::collections::HashMap;

use bytemuck::{Pod, Zeroable};
use gpu::{FULLSCREEN_SHADER_SOURCE, GpuContext};
use thiserror::Error;
use wgpu::util::DeviceExt;

use crate::{EffectPass, UniformValue};

/// Every fragment-shader-backed effect pass shares one fullscreen vertex shader
/// and one uniform buffer layout. Add an entry here to expose a new shader id to
/// the TypeScript side; the TS `EffectDefinition.renderer.passes[].shader` string
/// must match the first element. Keep this table in sync with the WGSL files.
const EFFECT_SHADER_SOURCES: &[(&str, &str)] = &[
    ("gaussian-blur", include_str!("shaders/gaussian_blur.wgsl")),
    ("brightness", include_str!("shaders/brightness.wgsl")),
    ("contrast", include_str!("shaders/contrast.wgsl")),
    ("saturation", include_str!("shaders/saturation.wgsl")),
    ("exposure", include_str!("shaders/exposure.wgsl")),
    ("hue", include_str!("shaders/hue.wgsl")),
    ("temperature", include_str!("shaders/temperature.wgsl")),
    ("tint", include_str!("shaders/tint.wgsl")),
    ("highlights", include_str!("shaders/highlights.wgsl")),
    ("shadows", include_str!("shaders/shadows.wgsl")),
    ("clarity", include_str!("shaders/clarity.wgsl")),
    ("sharpen", include_str!("shaders/sharpen.wgsl")),
    ("grayscale", include_str!("shaders/grayscale.wgsl")),
    ("sepia", include_str!("shaders/sepia.wgsl")),
    ("noise", include_str!("shaders/noise.wgsl")),
    ("glow", include_str!("shaders/glow.wgsl")),
    ("vignette", include_str!("shaders/vignette.wgsl")),
    ("pixelate", include_str!("shaders/pixelate.wgsl")),
    ("glitch", include_str!("shaders/glitch.wgsl")),
    ("distort", include_str!("shaders/distort.wgsl")),
    ("directional-blur", include_str!("shaders/directional_blur.wgsl")),
    ("radial-blur", include_str!("shaders/radial_blur.wgsl")),
    ("unsharp-mask", include_str!("shaders/unsharp_mask.wgsl")),
    ("gamma", include_str!("shaders/gamma.wgsl")),
    ("color-balance", include_str!("shaders/color_balance.wgsl")),
    ("color-pass", include_str!("shaders/color_pass.wgsl")),
    ("color-replace", include_str!("shaders/color_replace.wgsl")),
    ("find-edges", include_str!("shaders/find_edges.wgsl")),
    ("emboss", include_str!("shaders/emboss.wgsl")),
    ("color-emboss", include_str!("shaders/color_emboss.wgsl")),
    ("threshold", include_str!("shaders/threshold.wgsl")),
    ("posterize", include_str!("shaders/posterize.wgsl")),
    ("wave-warp", include_str!("shaders/wave_warp.wgsl")),
    ("spherize", include_str!("shaders/spherize.wgsl")),
    ("twirl", include_str!("shaders/twirl.wgsl")),
    ("mirror", include_str!("shaders/mirror.wgsl")),
    ("lens-distortion", include_str!("shaders/lens_distortion.wgsl")),
    ("magnify", include_str!("shaders/magnify.wgsl")),
    ("ramp", include_str!("shaders/ramp.wgsl")),
    ("grid", include_str!("shaders/grid.wgsl")),
    ("checkerboard", include_str!("shaders/checkerboard.wgsl")),
    ("invert", include_str!("shaders/invert.wgsl")),
    ("luma-key", include_str!("shaders/luma_key.wgsl")),
    ("chroma-key", include_str!("shaders/chroma_key.wgsl")),
    ("drop-shadow", include_str!("shaders/drop_shadow.wgsl")),
    ("bevel-alpha", include_str!("shaders/bevel_alpha.wgsl")),
];

/// Exposes the shader table for tooling/tests (e.g. WGSL validation).
pub fn effect_shader_sources() -> &'static [(&'static str, &'static str)] {
    EFFECT_SHADER_SOURCES
}

pub struct ApplyEffectsOptions<'a> {
    pub source: &'a wgpu::Texture,
    pub width: u32,
    pub height: u32,
    pub passes: &'a [EffectPass],
}

pub struct EffectPipeline {
    uniform_bind_group_layout: wgpu::BindGroupLayout,
    pipelines: HashMap<String, wgpu::RenderPipeline>,
}

#[derive(Debug, Error)]
pub enum EffectsError {
    #[error("At least one effect pass is required")]
    MissingEffectPasses,
    #[error("Unknown effect shader '{shader}'")]
    UnknownEffectShader { shader: String },
    #[error("Missing uniform '{uniform}' for shader '{shader}'")]
    MissingUniform { shader: String, uniform: String },
    #[error("Uniform '{uniform}' for shader '{shader}' must be a number")]
    InvalidNumberUniform { shader: String, uniform: String },
    #[error(
        "Uniform '{uniform}' for shader '{shader}' must be a vector of length {expected_length}"
    )]
    InvalidVectorUniform {
        shader: String,
        uniform: String,
        expected_length: usize,
    },
    #[error("Shader '{shader}' does not support uniform '{uniform}'")]
    UnsupportedUniform { shader: String, uniform: String },
}

/// Shared uniform layout for every effect shader. Mirrors the `EffectUniforms`
/// struct declared in each WGSL file. Keep the field order in sync.
#[repr(C)]
#[derive(Clone, Copy, Pod, Zeroable)]
struct EffectUniformBuffer {
    resolution: [f32; 2],
    direction: [f32; 2],
    color: [f32; 4],
    params0: [f32; 4],
    params1: [f32; 4],
    color2: [f32; 4],
}

impl EffectPipeline {
    pub fn new(context: &GpuContext) -> Self {
        let uniform_bind_group_layout =
            context
                .device()
                .create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                    label: Some("effects-uniform-bind-group-layout"),
                    entries: &[wgpu::BindGroupLayoutEntry {
                        binding: 0,
                        visibility: wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Buffer {
                            ty: wgpu::BufferBindingType::Uniform,
                            has_dynamic_offset: false,
                            min_binding_size: None,
                        },
                        count: None,
                    }],
                });
        let vertex_shader_module =
            context
                .device()
                .create_shader_module(wgpu::ShaderModuleDescriptor {
                    label: Some("effects-fullscreen-shader"),
                    source: wgpu::ShaderSource::Wgsl(FULLSCREEN_SHADER_SOURCE.into()),
                });
        let pipeline_layout =
            context
                .device()
                .create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                    label: Some("effects-pipeline-layout"),
                    bind_group_layouts: &[
                        Some(context.texture_sampler_bind_group_layout()),
                        Some(&uniform_bind_group_layout),
                    ],
                    immediate_size: 0,
                });

        let mut pipelines = HashMap::new();
        for (shader_id, shader_source) in EFFECT_SHADER_SOURCES {
            let shader_module =
                context
                    .device()
                    .create_shader_module(wgpu::ShaderModuleDescriptor {
                        label: Some(shader_id),
                        source: wgpu::ShaderSource::Wgsl((*shader_source).into()),
                    });
            let pipeline =
                context
                    .device()
                    .create_render_pipeline(&wgpu::RenderPipelineDescriptor {
                        label: Some(shader_id),
                        layout: Some(&pipeline_layout),
                        vertex: wgpu::VertexState {
                            module: &vertex_shader_module,
                            entry_point: Some("vertex_main"),
                            buffers: &[wgpu::VertexBufferLayout {
                                array_stride: std::mem::size_of::<[f32; 2]>() as u64,
                                step_mode: wgpu::VertexStepMode::Vertex,
                                attributes: &[wgpu::VertexAttribute {
                                    format: wgpu::VertexFormat::Float32x2,
                                    offset: 0,
                                    shader_location: 0,
                                }],
                            }],
                            compilation_options: wgpu::PipelineCompilationOptions::default(),
                        },
                        fragment: Some(wgpu::FragmentState {
                            module: &shader_module,
                            entry_point: Some("fragment_main"),
                            targets: &[Some(wgpu::ColorTargetState {
                                format: context.texture_format(),
                                blend: None,
                                write_mask: wgpu::ColorWrites::ALL,
                            })],
                            compilation_options: wgpu::PipelineCompilationOptions::default(),
                        }),
                        primitive: wgpu::PrimitiveState::default(),
                        depth_stencil: None,
                        multisample: wgpu::MultisampleState::default(),
                        multiview_mask: None,
                        cache: None,
                    });
            pipelines.insert((*shader_id).to_string(), pipeline);
        }

        Self {
            uniform_bind_group_layout,
            pipelines,
        }
    }

    pub fn apply(
        &self,
        context: &GpuContext,
        ApplyEffectsOptions {
            source,
            width,
            height,
            passes,
        }: ApplyEffectsOptions<'_>,
    ) -> Result<wgpu::Texture, EffectsError> {
        let mut encoder =
            context
                .device()
                .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                    label: Some("effects-command-encoder"),
                });
        let output = self.apply_with_encoder(
            context,
            &mut encoder,
            ApplyEffectsOptions {
                source,
                width,
                height,
                passes,
            },
        )?;
        context.queue().submit([encoder.finish()]);
        Ok(output)
    }

    pub fn apply_with_encoder(
        &self,
        context: &GpuContext,
        encoder: &mut wgpu::CommandEncoder,
        ApplyEffectsOptions {
            source,
            width,
            height,
            passes,
        }: ApplyEffectsOptions<'_>,
    ) -> Result<wgpu::Texture, EffectsError> {
        let mut current_texture: Option<wgpu::Texture> = None;

        for pass in passes {
            let input_texture = current_texture.as_ref().unwrap_or(source);
            let output_texture =
                context.create_render_texture(width, height, "effects-pass-output");
            let input_view = input_texture.create_view(&wgpu::TextureViewDescriptor::default());
            let output_view = output_texture.create_view(&wgpu::TextureViewDescriptor::default());
            let texture_bind_group =
                context
                    .device()
                    .create_bind_group(&wgpu::BindGroupDescriptor {
                        label: Some("effects-texture-bind-group"),
                        layout: context.texture_sampler_bind_group_layout(),
                        entries: &[
                            wgpu::BindGroupEntry {
                                binding: 0,
                                resource: wgpu::BindingResource::TextureView(&input_view),
                            },
                            wgpu::BindGroupEntry {
                                binding: 1,
                                resource: wgpu::BindingResource::Sampler(context.linear_sampler()),
                            },
                        ],
                    });
            let uniform_buffer =
                context
                    .device()
                    .create_buffer_init(&wgpu::util::BufferInitDescriptor {
                        label: Some("effects-uniform-buffer"),
                        contents: bytemuck::bytes_of(&pack_effect_uniforms(pass, width, height)?),
                        usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
                    });
            let uniform_bind_group =
                context
                    .device()
                    .create_bind_group(&wgpu::BindGroupDescriptor {
                        label: Some("effects-uniform-bind-group"),
                        layout: &self.uniform_bind_group_layout,
                        entries: &[wgpu::BindGroupEntry {
                            binding: 0,
                            resource: uniform_buffer.as_entire_binding(),
                        }],
                    });
            let pipeline = self.pipelines.get(&pass.shader).ok_or_else(|| {
                EffectsError::UnknownEffectShader {
                    shader: pass.shader.clone(),
                }
            })?;

            {
                let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                    label: Some("effects-render-pass"),
                    color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                        view: &output_view,
                        resolve_target: None,
                        depth_slice: None,
                        ops: wgpu::Operations {
                            load: wgpu::LoadOp::Clear(wgpu::Color::TRANSPARENT),
                            store: wgpu::StoreOp::Store,
                        },
                    })],
                    depth_stencil_attachment: None,
                    occlusion_query_set: None,
                    timestamp_writes: None,
                    multiview_mask: None,
                });
                render_pass.set_pipeline(pipeline);
                render_pass.set_vertex_buffer(0, context.fullscreen_quad().slice(..));
                render_pass.set_bind_group(0, &texture_bind_group, &[]);
                render_pass.set_bind_group(1, &uniform_bind_group, &[]);
                render_pass.draw(0..6, 0..1);
            }

            current_texture = Some(output_texture);
        }

        current_texture.ok_or(EffectsError::MissingEffectPasses)
    }
}

/// Maps the TypeScript-provided named uniforms into the shared uniform buffer.
///
/// Reserved names:
/// - `u_direction` (vec2)
/// - `u_color` (vec3 or vec4)
/// - `u_params` (vec1..vec4) -> params0, zero padded
/// - `u_params2` (vec1..vec4) -> params1, zero padded
/// - `u_sigma` / `u_step` (scalars) -> params0.x / params0.y (legacy blur)
fn pack_effect_uniforms(
    pass: &EffectPass,
    width: u32,
    height: u32,
) -> Result<EffectUniformBuffer, EffectsError> {
    let mut uniforms = EffectUniformBuffer {
        resolution: [width as f32, height as f32],
        direction: [0.0, 0.0],
        color: [0.0, 0.0, 0.0, 0.0],
        params0: [0.0, 0.0, 0.0, 0.0],
        params1: [0.0, 0.0, 0.0, 0.0],
        color2: [0.0, 0.0, 0.0, 0.0],
    };

    for (name, value) in &pass.uniforms {
        match name.as_str() {
            "u_direction" => uniforms.direction = read_vec2(pass, name, value)?,
            "u_color" => uniforms.color = read_vec4(pass, name, value, true)?,
            "u_color2" => uniforms.color2 = read_vec4(pass, name, value, true)?,
            "u_params" => uniforms.params0 = read_vec4(pass, name, value, false)?,
            "u_params2" => uniforms.params1 = read_vec4(pass, name, value, false)?,
            "u_sigma" => uniforms.params0[0] = read_number(pass, name, value)?,
            "u_step" => uniforms.params0[1] = read_number(pass, name, value)?,
            other => {
                return Err(EffectsError::UnsupportedUniform {
                    shader: pass.shader.clone(),
                    uniform: other.to_string(),
                });
            }
        }
    }

    Ok(uniforms)
}

fn read_number(pass: &EffectPass, uniform: &str, value: &UniformValue) -> Result<f32, EffectsError> {
    match value {
        UniformValue::Number(value) => Ok(*value),
        UniformValue::Vector(_) => Err(EffectsError::InvalidNumberUniform {
            shader: pass.shader.clone(),
            uniform: uniform.to_string(),
        }),
    }
}

fn read_vector<'a>(
    pass: &EffectPass,
    uniform: &str,
    value: &'a UniformValue,
) -> Result<&'a [f32], EffectsError> {
    match value {
        UniformValue::Vector(values) => Ok(values.as_slice()),
        UniformValue::Number(_) => Err(EffectsError::InvalidVectorUniform {
            shader: pass.shader.clone(),
            uniform: uniform.to_string(),
            expected_length: 2,
        }),
    }
}

fn read_vec2(
    pass: &EffectPass,
    uniform: &str,
    value: &UniformValue,
) -> Result<[f32; 2], EffectsError> {
    let values = read_vector(pass, uniform, value)?;
    if values.len() != 2 {
        return Err(EffectsError::InvalidVectorUniform {
            shader: pass.shader.clone(),
            uniform: uniform.to_string(),
            expected_length: 2,
        });
    }
    Ok([values[0], values[1]])
}

fn read_vec4(
    pass: &EffectPass,
    uniform: &str,
    value: &UniformValue,
    allow_three: bool,
) -> Result<[f32; 4], EffectsError> {
    let values = read_vector(pass, uniform, value)?;
    let valid = if allow_three {
        values.len() == 3 || values.len() == 4
    } else {
        values.len() >= 1 && values.len() <= 4
    };
    if !valid {
        return Err(EffectsError::InvalidVectorUniform {
            shader: pass.shader.clone(),
            uniform: uniform.to_string(),
            expected_length: if allow_three { 4 } else { 4 },
        });
    }

    Ok([
        values[0],
        values.get(1).copied().unwrap_or(0.0),
        values.get(2).copied().unwrap_or(0.0),
        values.get(3).copied().unwrap_or(1.0),
    ])
}
