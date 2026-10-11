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
	let texel_size = vec2f(1.0, 1.0) / uniforms.resolution;
	let uv = input.tex_coord;
	let tl = textureSample(input_texture, input_sampler, uv + vec2f(-texel_size.x, -texel_size.y)).rgb;
	let tr = textureSample(input_texture, input_sampler, uv + vec2f(texel_size.x, -texel_size.y)).rgb;
	let bl = textureSample(input_texture, input_sampler, uv + vec2f(-texel_size.x, texel_size.y)).rgb;
	let br = textureSample(input_texture, input_sampler, uv + vec2f(texel_size.x, texel_size.y)).rgb;
	let gx = (tr + br) - (tl + bl);
	let gy = (bl + br) - (tl + tr);
	let edge = vec3f(clamp(length(gx) + length(gy), 0.0, 1.0));
	let texel = textureSample(input_texture, input_sampler, uv);
	let rgb = mix(texel.rgb, vec3f(1.0) - edge, amount);
	return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), texel.a);
}
