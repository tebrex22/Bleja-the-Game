extends Area2D

export var speed = 300
var screen_size

signal hit

# Called when the node enters the scene tree for the first time.
func _ready():
	screen_size = get_viewport_rect().size
	position.x = 960
	position.y = 540

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var velocity = Vector2()
	
	if Input.is_action_pressed("move_up"):
		velocity.y -= 1
		$AnimatedSprite.animation = "trcanje-napred"
	if Input.is_action_pressed("move_down"):
		velocity.y += 1
		$AnimatedSprite.animation = "trcanje-napred"
	if Input.is_action_pressed("move_left"):
		velocity.x -= 1
		$AnimatedSprite.animation = "trcanje-napred"
	if Input.is_action_pressed("move_right"):
		velocity.x += 1
		$AnimatedSprite.animation = "trcanje-napred"
	
	if velocity.x != 0:
		$AnimatedSprite.animation = "trcanje-napred"
		$AnimatedSprite.flip_h = velocity.x < 0
	
	if velocity.length() > 0:
		velocity = velocity.normalized() * speed
		$AnimatedSprite.play()
	else:
		$AnimatedSprite.animation = "stajanje"
		$AnimatedSprite.play()
	
	position += velocity * delta
	# Watches for the PC not to go out of the screen 
	position.x = clamp(position.x, 0, screen_size.x)
	position.y = clamp(position.y, 0, screen_size.y)


func _on_PC__body_entered(body):
	pass
