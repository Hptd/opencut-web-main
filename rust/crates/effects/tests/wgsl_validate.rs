use naga::valid::{Capabilities, ValidationFlags, Validator};

#[test]
fn every_effect_shader_parses_and_validates() {
    let mut validator = Validator::new(ValidationFlags::all(), Capabilities::all());
    for (id, source) in effects::effect_shader_sources() {
        let module = naga::front::wgsl::parse_str(source)
            .unwrap_or_else(|error| panic!("shader '{id}' failed to parse: {error:?}"));
        validator
            .validate(&module)
            .unwrap_or_else(|error| panic!("shader '{id}' failed to validate: {error:?}"));
    }
}
