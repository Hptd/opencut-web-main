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
	let angle = radians(uniforms.params0.x);
	let direction = vec2f(cos(angle), sin(angle));
	let position = clamp(dot(input.tex_coord - vec2f(0.5), direction) + 0.5, 0.0, 1.0);
	let rgb = mix(uniforms.color.rgb, uniforms.color2.rgb, position);
	return vec4f(rgb, 1.0);
}
