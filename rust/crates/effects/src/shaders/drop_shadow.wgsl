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
	let texel_size = vec2f(1.0, 1.0) / uniforms.resolution;
	let offset = vec2f(uniforms.params0.x, uniforms.params0.y) * texel_size;
	let softness = max(uniforms.params0.z, 0.0);
	let texel = textureSample(input_texture, input_sampler, input.tex_coord);

	var shadow = 0.0;
	if (softness < 0.5) {
		shadow = textureSample(input_texture, input_sampler, input.tex_coord - offset).a;
	} else {
		var acc = 0.0;
		for (var y = -2; y <= 2; y = y + 1) {
			for (var x = -2; x <= 2; x = x + 1) {
				let sample_uv = input.tex_coord - offset + vec2f(f32(x), f32(y)) * texel_size * softness;
				acc = acc + textureSample(input_texture, input_sampler, sample_uv).a;
			}
		}
		shadow = acc / 25.0;
	}

	let shadow_contrib = uniforms.color.a * shadow;
	let out_a = texel.a + shadow_contrib * (1.0 - texel.a);
	let out_rgb = (texel.rgb * texel.a + uniforms.color.rgb * shadow_contrib * (1.0 - texel.a)) / max(out_a, 0.0001);
	return vec4f(clamp(out_rgb, vec3f(0.0), vec3f(1.0)), out_a);
}
