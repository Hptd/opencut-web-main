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
	let radius = max(uniforms.params0.y, 1.0);
	let texel_size = vec2f(1.0, 1.0) / uniforms.resolution;

	let center = textureSample(input_texture, input_sampler, input.tex_coord);
	var average = vec3f(0.0);
	var samples = 0.0;
	for (var y = -1; y <= 1; y = y + 1) {
		for (var x = -1; x <= 1; x = x + 1) {
			let offset = vec2f(f32(x), f32(y)) * texel_size * radius;
			average = average + textureSample(input_texture, input_sampler, input.tex_coord + offset).rgb;
			samples = samples + 1.0;
		}
	}
	average = average / samples;
	let detail = center.rgb - average;
	let rgb = center.rgb + detail * amount;
	return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), center.a);
}
