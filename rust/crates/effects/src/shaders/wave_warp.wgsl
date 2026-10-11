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
	let uv = input.tex_coord;
	let amplitude = uniforms.params0.x;
	let wavelength = max(uniforms.params0.y, 1.0);
	let phase = uniforms.params0.z;
	let is_vertical = uniforms.params0.w > 0.5;
	let axis = select(uv.x, uv.y, is_vertical);
	let offset = sin((axis * wavelength + phase) * 6.2831853) * amplitude * 0.05;
	let direction = select(vec2f(0.0, 1.0), vec2f(1.0, 0.0), is_vertical);
	return textureSample(input_texture, input_sampler, uv + direction * offset);
}
