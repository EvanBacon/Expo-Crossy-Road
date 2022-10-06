const Model = preload("./Model.gd");

var models = {0: Model.new()};
var current_index = -1;
#warning-ignore:unused_class_variable
var colors = null;
#warning-ignore:unused_class_variable
var nodes = {};
#warning-ignore:unused_class_variable
var materials = {};

func get_model():
	if (!models.has(current_index)):
		models[current_index] = Model.new();
	return models[current_index];