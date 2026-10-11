struct VertexOutput {
	@builtin(position) position: vec4f,
	@location(0) tex_coord: vec2f,
}

struct EffectUniforms {
	resolution: vec2f,
	direction: vec2f,
	color: vec4f,
	params0: vec4f,
	params1: vec4f,
	color2: vec4f,
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var input_sampler: sampler;
@group(1) @binding(0) var<uniform> uniforms: EffectUniforms;

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
	let cells = max(uniforms.params0.x, 1.0);
	let thickness = max(uniforms.params0.y, 0.001);
	let background = textureSample(input_texture, input_sampler, input.tex_coord);
	let grid = abs(fract(input.tex_coord * cells - 0.5) - 0.5) / thickness;
	let line = 1.0 - min(min(grid.x, grid.y), 1.0);
	let rgb = mix(background.rgb, uniforms.color.rgb, line);
	return vec4f(rgb, background.a);
}
