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
	let texel = textureSample(input_texture, input_sampler, input.tex_coord);
	let amount = uniforms.params0.x;
	let luma = dot(texel.rgb, vec3f(0.2126, 0.7152, 0.0722));
	let mask = 1.0 - smoothstep(0.0, 0.5, luma);
	let rgb = texel.rgb + vec3f(amount * mask);
	return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), texel.a);
}
