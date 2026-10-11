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
	let texel_size = vec2f(1.0, 1.0) / uniforms.resolution;
	let radius = max(uniforms.params0.y, 1.0);
	let amount = uniforms.params0.x;
	let threshold = uniforms.params0.z;
	let texel = textureSample(input_texture, input_sampler, input.tex_coord);

	var acc = vec3f(0.0);
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(1.0, 0.0) * texel_size * radius).rgb;
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(-1.0, 0.0) * texel_size * radius).rgb;
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(0.0, 1.0) * texel_size * radius).rgb;
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(0.0, -1.0) * texel_size * radius).rgb;
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(0.7, 0.7) * texel_size * radius).rgb;
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(-0.7, 0.7) * texel_size * radius).rgb;
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(0.7, -0.7) * texel_size * radius).rgb;
	acc = acc + textureSample(input_texture, input_sampler, input.tex_coord + vec2f(-0.7, -0.7) * texel_size * radius).rgb;

	let blur = acc / 8.0;
	let bright = max(blur - vec3f(threshold), vec3f(0.0));
	let rgb = texel.rgb + bright * amount;
	return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), texel.a);
}
