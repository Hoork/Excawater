var grassSprite = function (game, cellX, cellY, cellSize, parent) {
	this.game = game;
	this.sprite = parent.addChild(game.make.sprite(cellX * cellSize, cellY * cellSize, "grass"));
	this.sprite.width = cellSize;
	this.sprite.height = cellSize;
}

grassSprite.prototype.destroy = function() {
	this.sprite.destroy();
	delete this;
};