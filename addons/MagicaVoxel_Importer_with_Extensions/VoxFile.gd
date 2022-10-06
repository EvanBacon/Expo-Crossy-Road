var file: File;
var chunk_size = 0;

func _init(file: File):
	self.file = file;
	self.chunk_size = 0;

func has_data_to_read(): return file.get_position() < file.get_len()

func set_chunk_size(size):
	chunk_size = size;

func get_8():
	chunk_size -= 1;
	return file.get_8();
func get_32(): 
	chunk_size -= 4;
	return file.get_32();
func get_buffer(length):
	chunk_size -= length;
	return file.get_buffer(length);

func read_remaining():
	get_buffer(chunk_size);
	chunk_size = 0;

func get_string(length):
	return get_buffer(length).get_string_from_ascii()

func get_vox_string():
	var length = get_32();
	return get_string(length);

func get_vox_dict():
	var result = {};
	var pairs = get_32();
	for _p in range(pairs):
		var key = get_vox_string();
		var value = get_vox_string();
		result[key] = value;
	return result;