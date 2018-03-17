var waterSprite = function (game, cellX, cellY, cellSize, parent, animTimer) {
	this.game = game;
	this.sprite = parent.addChild(game.add.sprite(cellX * cellSize, cellY * cellSize, "water"));
	this.sprite.width = cellSize;
	this.sprite.height = cellSize;
	this.anim = this.sprite.animations.add("move");
	this.anim.frame = animTimer;
	this.sprite.animations.play("move", 60, true);
}

waterSprite.prototype.destroy = function() {
	this.sprite.destroy();
	delete this;
};