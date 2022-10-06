const Faces = preload("./Faces.gd")
const VoxData = preload("./VoxFormat/VoxData.gd")
const vox_to_godot = Basis(Vector3.RIGHT, Vector3.FORWARD, Vector3.UP)

# Names for the faces by orientation
enum FaceOrientation {
	Top = 0,
	Bottom = 1,
	Left = 2,
	Right = 3,
	Front = 4,
	Back = 5,
}

# An Array(FaceOrientation) of all possible face orientations
const face_orientations :Array = [
	FaceOrientation.Top,
	FaceOrientation.Bottom,
	FaceOrientation.Left,
	FaceOrientation.Right,
	FaceOrientation.Front,
	FaceOrientation.Back
]

# An Array(int) of the depth axis by orientation
const depth_axis :Array = [
	Vector3.AXIS_Z,
	Vector3.AXIS_Z,
	Vector3.AXIS_X,
	Vector3.AXIS_X,
	Vector3.AXIS_Y,
	Vector3.AXIS_Y,
]

# An Array(int) of the width axis by orientation
const width_axis :Array = [
	Vector3.AXIS_Y,
	Vector3.AXIS_Y,
	Vector3.AXIS_Z,
	Vector3.AXIS_Z,
	Vector3.AXIS_X,
	Vector3.AXIS_X,
]

# An Array(int) of height axis by orientation
const height_axis :Array = [
	Vector3.AXIS_X,
	Vector3.AXIS_X,
	Vector3.AXIS_Y,
	Vector3.AXIS_Y,
	Vector3.AXIS_Z,
	Vector3.AXIS_Z,
]

# An Array(Vector3) describing what vectors to use to check for face occlusion
# by orientation
const face_checks :Array = [
	Vector3(0, 0, 1),
	Vector3(0, 0, -1),
	Vector3(-1, 0, 0),
	Vector3(1, 0, 0),
	Vector3(0, -1, 0),
	Vector3(0, 1, 0),
]

# An array of the face meshes by orientation
const face_meshes :Array = [
	Faces.Front,
	Faces.Back,
	Faces.Left,
	Faces.Right,
	Faces.Bottom,
	Faces.Top,
]

# The SurfaceTool the object will use to generate the mesh
var st :SurfaceTool = SurfaceTool.new()

# A Dictonary[Vector3]int of the voxel data for the visible faces of the
# current slice
var faces :Dictionary

# Minimum extends of the volume
var mins :Vector3 = Vector3(1000000, 1000000, 1000000)

# Maximum extends of the volume
var maxs :Vector3 = Vector3(-1000000,-1000000,-1000000)

# Generate a mesh for the given voxel_data with single-pass greedy face merging
# Primary Reference: https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/
# Secondary Reference: https://www.gedge.ca/dev/2014/08/17/greedy-voxel-meshing
# voxel_data is a dict[Vector3]int
func generate(vox :VoxData, voxel_data :Dictionary, scale :float, snaptoground : bool):
	# Remeber, MagicaVoxel thinks Y is the depth axis. We convert to the correct
	# coordinate space when we generate the faces.
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	
	# Short-circut empty models
	if voxel_data.size() == 0:
		return st.commit()
	
	# Convert voxel data to raw color values
	for v in voxel_data:
		voxel_data[v] = vox.colors[voxel_data[v]]
	
	# Find bounds
	for v in voxel_data:
		mins.x = min(mins.x, v.x)
		mins.y = min(mins.y, v.y)
		mins.z = min(mins.z, v.z)
		maxs.x = max(maxs.x, v.x)
		maxs.y = max(maxs.y, v.y)
		maxs.z = max(maxs.z, v.z)
	
	# Itterate over all face orientations to reduce problem to 3 dimensions
	for o in face_orientations:
		generate_geometry_for_orientation(voxel_data, o, scale, snaptoground)

	# Finish the mesh and material and return
	st.generate_normals()
	var material = SpatialMaterial.new()
	material.vertex_color_is_srgb = true
	material.vertex_color_use_as_albedo = true
	material.roughness = 1
	st.set_material(material)
	return st.commit()

# Generates all of the geometry for a given face orientation
func generate_geometry_for_orientation(voxel_data :Dictionary, o :int, scale :float, snaptoground :bool) -> void:
	# Sweep through the volume along the depth reducing the problem to 2 dimensional
	var da :int = depth_axis[o]
	for slice in range(mins[da], maxs[da]+1):
		var faces :Dictionary = query_slice_faces(voxel_data, o, slice)
		if faces.size() > 0:
			generate_geometry(faces, o, slice, scale, snaptoground)

# Returns the voxels in the set voxel_data with a visible face along the slice
# for the given orientation
func query_slice_faces(voxel_data :Dictionary, o :int, slice :float) -> Dictionary:
	var ret :Dictionary = Dictionary()
	var da = depth_axis[o]
	for v in voxel_data:
		if v[da] == slice and voxel_data.has(v + face_checks[o]) == false:
			ret[v] = voxel_data[v]
	return ret

# Generates geometry for the given orientation for the set of faces
func generate_geometry(faces :Dictionary, o :int, slice :float, scale :float, snaptoground :bool) -> void:
	var da :int = depth_axis[o]
	var wa :int = width_axis[o]
	var ha :int = height_axis[o]
	var v :Vector3 = Vector3()
	v[da] = slice
	
	# Itterate the rows of the sparse volume
	v[ha] = mins[ha]
	while v[ha] <= maxs[ha]:
		# Itterate over the voxels of the row
		v[wa] = mins[wa]
		while v[wa] <= maxs[wa]:
			if faces.has(v):
				generate_geometry_for_face(faces, v, o, scale, snaptoground)
			v[wa] += 1.0
		v[ha] += 1.0

# Generates the geometry for the given face and orientation and scale and returns
# the set of remaining faces
func generate_geometry_for_face(faces :Dictionary, face :Vector3, o :int, scale :float, snaptoground :bool) -> Dictionary:
	var da :int = depth_axis[o]
	var wa :int = width_axis[o]
	var ha :int = height_axis[o]
	
	# Greedy face merging
	var width :int = width_query(faces, face, o)
	var height :int = height_query(faces, face, o, width)
	var grow :Vector3 = Vector3(1, 1, 1)
	grow[wa] *= width
	grow[ha] *= height
	
	# Generate geometry
	var yoffset = Vector3(0,0,0);
	if snaptoground : yoffset = Vector3(0, -mins.z * scale, 0);

	st.add_color(faces[face])
	for vert in face_meshes[o]:
		st.add_vertex(yoffset + vox_to_godot.xform(((vert * grow) + face) * scale))
	
	# Remove these faces from the pool
	var v :Vector3 = Vector3()
	v[da] = face[da]
	for iy in range(height):
		v[ha] = face[ha] + float(iy)
		for ix in range(width):
			v[wa] = face[wa] + float(ix)
			faces.erase(v)
	
	return faces

# Returns the number of voxels wide the run starting at face is with respect to
# the set of faces and orientation
func width_query(faces :Dictionary, face :Vector3, o :int) -> int:
	var wd :int = width_axis[o]
	var v :Vector3 = face
	while faces.has(v) and faces[v] == faces[face]:
		v[wd] += 1.0
	return int(v[wd] - face[wd])

# Returns the number of voxels high the run starting at face is with respect to
# the set of faces and orientation, with the given width
func height_query(faces :Dictionary, face :Vector3, o :int, width :int) -> int:
	var hd :int = height_axis[o]
	var c :Color = faces[face]
	var v :Vector3 = face
	v[hd] += 1.0
	while faces.has(v) and faces[v] == c and width_query(faces, v, o) >= width:
		v[hd] += 1.0
	return int(v[hd] - face[hd])
