extends KinematicBody


# Declare member variables here. Examples:
var gravity = 9.8

# Called when the node enters the scene tree for the first time.
func _ready():
	pass

func _physics_process(delta):
	var offset = Vector3()
	
	if Input.is_action_just_pressed("ui_up"):
		offset.x += 1
	elif Input.is_action_just_pressed("ui_down"):
		offset.x -= 1
	elif Input.is_action_just_pressed("ui_left"):
		offset.z -= 1
	elif Input.is_action_just_pressed("ui_right"):
		offset.z += 1
	
	self.translate(offset)
		

# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass
