var properties = null;
var material: SpatialMaterial = null;

var type setget ,get_type;
func get_type(): return properties["_type"];

var weight setget ,get_weight;
func get_weight(): return float(properties["_weight"]);

var specular setget ,get_specular;
func get_specular(): return float(properties["_spec"]);

var roughness setget ,get_roughness;
func get_roughness(): return float(properties["_rough"]);

var flux setget ,get_flux;
func get_flux(): return float(properties["_flux"]);

var refraction setget ,get_refraction;
func get_refraction(): return float(properties["_ior"]);

func _init(properties):
	self.properties = properties;

func is_glass():
	return self.type == "_glass";

func get_material(color: Color):
	if (material != null): return material;
	
	material = SpatialMaterial.new();
	material.vertex_color_is_srgb = true;
	material.vertex_color_use_as_albedo = true;
	
	match (self.type):
		"_metal":
			material.metallic = self.weight;
			material.metallic_specular = self.specular;
			material.roughness = self.roughness;
		"_emit":
			material.emission_enabled = true;
			material.emission = Color(color.r, color.g, color.b, self.weight);
			material.emission_energy = self.flux;
		"_glass":
			material.flags_transparent = true;
			material.albedo_color = Color(1, 1, 1, 1 - self.weight);
			material.refraction_enabled = true;
			material.refraction_scale = self.refraction * 0.01;
			material.roughness = self.roughness;
		"_diffuse", _:
			material.roughness = 1;
	return material;