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
	let angle = radians(uniforms.params0.y);
	let dir = vec2f(cos(angle), sin(angle)) * (vec2f(1.0, 1.0) / uniforms.resolution);
	let texel = textureSample(input_texture, input_sampler, input.tex_coord);
	let low = textureSample(input_texture, input_sampler, input.tex_coord - dir).rgb;
	let high = textureSample(input_texture, input_sampler, input.tex_coord + dir).rgb;
	let emboss = dot(clamp((high - low) + vec3f(0.5), vec3f(0.0), vec3f(1.0)), vec3f(0.3333));
	let rgb = mix(texel.rgb, vec3f(emboss), amount);
	return vec4f(clamp(rgb, vec3f(0.0), vec3f(1.0)), texel.a);
}
