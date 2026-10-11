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
	let amount = uniforms.params0.x;
	let thickness = max(uniforms.params0.y, 1.0);
	let texel_size = vec2f(1.0, 1.0) / uniforms.resolution;
	let texel = textureSample(input_texture, input_sampler, input.tex_coord);
	let left = textureSample(input_texture, input_sampler, input.tex_coord - vec2f(texel_size.x * thickness, 0.0)).a;
	let up = textureSample(input_texture, input_sampler, input.tex_coord - vec2f(0.0, texel_size.y * thickness)).a;
	let right = textureSample(input_texture, input_sampler, input.tex_coord + vec2f(texel_size.x * thickness, 0.0)).a;
	let down = textureSample(input_texture, input_sampler, input.tex_coord + vec2f(0.0, texel_size.y * thickness)).a;
	let edge = ((left + up) - (right + down)) * 0.5;
	let factor = clamp(1.0 + edge * amount, 0.0, 2.0);
	return vec4f(clamp(texel.rgb * factor, vec3f(0.0), vec3f(1.0)), texel.a);
}
