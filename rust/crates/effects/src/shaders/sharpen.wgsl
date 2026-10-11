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
	let texel_size = vec2f(1.0, 1.0) / uniforms.resolution;
	let center = textureSample(input_texture, input_sampler, input.tex_coord);

	let up = textureSample(input_texture, input_sampler, input.tex_coord + vec2f(0.0, -texel_size.y));
	let down = textureSample(input_texture, input_sampler, input.tex_coord + vec2f(0.0, texel_size.y));
	let left = textureSample(input_texture, input_sampler, input.tex_coord + vec2f(-texel_size.x, 0.0));
	let right = textureSample(input_texture, input_sampler, input.tex_coord + vec2f(texel_size.x, 0.0));

	let laplacian = center.rgb * 4.0 - (up.rgb + down.rgb + left.rgb + right.rgb);
	let rgb = center.rgb + laplacian * amount;
	return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), center.a);
}
