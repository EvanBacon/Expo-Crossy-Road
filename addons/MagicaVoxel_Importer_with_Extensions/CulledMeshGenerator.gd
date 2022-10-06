const Faces = preload("./Faces.gd");
const vox_to_godot = Basis(Vector3.RIGHT, Vector3.FORWARD, Vector3.UP);

func generate(vox, voxel_data, scale, snaptoground):
	var generator = VoxelMeshGenerator.new(vox, voxel_data, scale, snaptoground);

	return generator.generate_mesh();

class MeshGenerator:
	var surfaces = {};

	func ensure_surface_exists(surface_index: int, color: Color, material: Material):
		if (surfaces.has(surface_index)): return;

		var st = SurfaceTool.new();
		st.begin(Mesh.PRIMITIVE_TRIANGLES);
		st.add_color(color);
		st.set_material(material);
		surfaces[surface_index] = st;

	func add_vertex(surface_index: int, vertex: Vector3):
		var st = surfaces[surface_index] as SurfaceTool;
		st.add_vertex(vertex);

	func combine_surfaces():
		var mesh = null;
		for surface_index in surfaces:
			var surface = surfaces[surface_index] as SurfaceTool;
			surface.index();
			surface.generate_normals();
			mesh = surface.commit(mesh);

			var new_surface_index = mesh.get_surface_count() - 1;
			var name = str(surface_index);
			mesh.surface_set_name(new_surface_index, name);
		return mesh;

class VoxelMeshGenerator:
	var vox;
	var voxel_data = {};
	var scale:float;
	var snaptoground:bool;

	func _init(vox, voxel_data, scale, snaptoground):
		self.vox = vox;
		self.voxel_data = voxel_data;
		self.scale = scale;
		self.snaptoground = snaptoground;

	func get_material(voxel):
		var surface_index = voxel_data[voxel];
		return vox.materials[surface_index]

	func face_is_visible(voxel, face):
		if (not voxel_data.has(voxel + face)):
			return true;
		var local_material = get_material(voxel);
		var adj_material = get_material(voxel + face);
		return adj_material.is_glass() && !local_material.is_glass();

	func generate_mesh():

		# Minimum extends of the volume
		var mins :Vector3 = Vector3(1000000, 1000000, 1000000)
		# Maximum extends of the volume
		var maxs :Vector3 = Vector3(-1000000,-1000000,-1000000)	

		# Find bounds
		for v in voxel_data:
			mins.x = min(mins.x, v.x)
			mins.y = min(mins.y, v.y)
			mins.z = min(mins.z, v.z)
			maxs.x = max(maxs.x, v.x)
			maxs.y = max(maxs.y, v.y)
			maxs.z = max(maxs.z, v.z)	

		var vox_to_godot = Basis(Vector3.RIGHT, Vector3.FORWARD, Vector3.UP);
		var yoffset = Vector3(0,0,0);
		if snaptoground : yoffset = Vector3(0, -mins.z * scale, 0);
		var gen = MeshGenerator.new();

		for voxel in voxel_data:
			var voxelSides = []
			if face_is_visible(voxel, Vector3.UP): voxelSides += Faces.Top
			if face_is_visible(voxel, Vector3.DOWN): voxelSides += Faces.Bottom
			if face_is_visible(voxel, Vector3.LEFT): voxelSides += Faces.Left
			if face_is_visible(voxel, Vector3.RIGHT): voxelSides += Faces.Right
			if face_is_visible(voxel, Vector3.BACK): voxelSides += Faces.Front
			if face_is_visible(voxel, Vector3.FORWARD): voxelSides += Faces.Back

			var surface_index = voxel_data[voxel];
			var color = vox.colors[surface_index];
			var material = vox.materials[surface_index].get_material(color);
			gen.ensure_surface_exists(surface_index, color, material);

			for t in voxelSides:
				gen.add_vertex(surface_index, yoffset + vox_to_godot.xform((t + voxel) * scale));

		return gen.combine_surfaces();