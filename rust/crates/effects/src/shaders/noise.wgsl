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

fn hash21(p: vec2f) -> f32 {
	var q = fract(p * vec2f(123.34, 456.21));
	q = q + vec2f(dot(q, q + vec2f(45.32, 45.32)));
	return fract(q.x * q.y);
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
	let texel = textureSample(input_texture, input_sampler, input.tex_coord);
	let amount = uniforms.params0.x;
	let seed = uniforms.params0.y;
	let grain = hash21(input.tex_coord * uniforms.resolution + vec2f(seed)) - 0.5;
	let rgb = texel.rgb + vec3f(grain * amount);
	return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), texel.a);
}
