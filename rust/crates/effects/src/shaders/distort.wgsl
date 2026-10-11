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
}

@group(0) @binding(0) var input_texture: texture_2d<f32>;
@group(0) @binding(1) var input_sampler: sampler;
@group(1) @binding(0) var<uniform> uniforms: EffectUniforms;

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
	let amount = uniforms.params0.x;
	let frequency = uniforms.params0.y;
	let phase = uniforms.params0.z;
	let uv = input.tex_coord;

	let wave_x = sin((uv.y * frequency + phase) * 6.2831853) * amount * 0.05;
	let wave_y = cos((uv.x * frequency + phase) * 6.2831853) * amount * 0.05;

	return textureSample(input_texture, input_sampler, uv + vec2f(wave_x, wave_y));
}
