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
	let length_px = uniforms.params0.y;
	let dir = vec2f(cos(angle), sin(angle));
	let texel = vec2f(1.0, 1.0) / uniforms.resolution;
	let sigma = max(length_px, 0.001);

	var color = vec4f(0.0, 0.0, 0.0, 0.0);
	var total = 0.0;
	for (var i = -12; i <= 12; i = i + 1) {
		let offset = dir * texel * (sigma * (f32(i) / 12.0));
		let weight = 1.0 - abs(f32(i)) / 13.0;
		color = color + textureSample(input_texture, input_sampler, input.tex_coord + offset) * weight;
		total = total + weight;
	}
	return color / total;
}
