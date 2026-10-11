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
	let radius = max(uniforms.params0.y, 0.01);
	let centered = input.tex_coord - vec2f(0.5);
	let distance_from_center = length(centered);
	let angle = amount * (1.0 - smoothstep(0.0, radius, distance_from_center));
	let s = sin(angle);
	let c = cos(angle);
	let rotated = vec2f(centered.x * c - centered.y * s, centered.x * s + centered.y * c);
	return textureSample(input_texture, input_sampler, vec2f(0.5) + rotated);
}
