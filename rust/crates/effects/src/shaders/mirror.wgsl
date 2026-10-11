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
	let is_vertical = uniforms.params0.x > 0.5;
	let position = uniforms.params0.y;
	var sampled = input.tex_coord;
	if (is_vertical) {
		if (input.tex_coord.y > position) {
			sampled.y = 2.0 * position - input.tex_coord.y;
		}
	} else {
		if (input.tex_coord.x > position) {
			sampled.x = 2.0 * position - input.tex_coord.x;
		}
	}
	return textureSample(input_texture, input_sampler, sampled);
}
