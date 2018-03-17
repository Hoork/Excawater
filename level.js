var level = function(game){
	this.game = game;
	this.cellSize = 50;
	this.turnDuration = 50;
	this.turnTimer = this.turnDuration;

	this.isStepMode = false;

	this.globalWaterTimer = 0;
}

level.prototype = {
	preload: function(){
		this.game.load.image("grass", "assets/grass.jpg");
		this.game.load.spritesheet("water", "assets/water.png", 300, 300);
		this.game.load.spritesheet("excawater", "assets/excawaterBody.png", 290, 247);
		this.game.load.spritesheet("hand", "assets/hand.png", 80, 170);
	},

	create: function(){
		this.floor = this.game.add.sprite(0,0);


		this.gameLogic = new gameLogic(this.game, 
			[
				[0,0,0,0,0,0,0,0,0,0],
				[1,0,1,0,1,0,1,0,1,0],
				[1,1,0,0,0,0,0,0,0,0],
				[1,1,1,1,1,1,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
			],
			0, 2, 0
		);


		this.waterAnimTimer = new waterSprite(this.game, this.cellSize * -2, this.cellSize * -2, this.cellSize, this.floor, 0);
		this.visualTile = [];
		for(var i = 0; i < this.gameLogic.levelData.length; i++){
			this.visualTile.push([]);
			for(var j = 0; j < this.gameLogic.levelData[i].length; j++){
				switch(this.gameLogic.levelData[i][j]){
					case 0:
						this.visualTile[i].push(new waterSprite(this.game, j, i, this.cellSize, this.floor, 0));
					break;
					case 1:
						this.visualTile[i].push(new grassSprite(this.game, j, i, this.cellSize, this.floor));
					break;
				}
			}
		}

		this.info = this.game.add.text(0,0, "kekeke", {fill:'red'});

		this.excawater = new excawaterSprite(this.game, this.gameLogic.excawater.position.x, this.gameLogic.excawater.position.y, this.cellSize);

		var keys = this.game.input.keyboard.addKeys(
			{ 
				'up': Phaser.KeyCode.W, 
				'down': Phaser.KeyCode.S, 
				'left': Phaser.KeyCode.A, 
				'right': Phaser.KeyCode.D,
				'run':  Phaser.KeyCode.O,
				'restart':  Phaser.KeyCode.P,
				'focus': Phaser.KeyCode.C,
				'onestep': Phaser.KeyCode.I
			}
		);
		this.game.camera.bounds = null
		keys.up.onHoldCallback = (function(){this.game.camera.y -= 5});
		keys.up.onHoldContext = this;
		keys.down.onHoldCallback = (function(){this.game.camera.y += 5});
		keys.down.onHoldContext = this;
		keys.left.onHoldCallback = (function(){this.game.camera.x -= 5});
		keys.left.onHoldContext = this;
		keys.right.onHoldCallback = (function(){this.game.camera.x += 5});
		keys.right.onHoldContext = this;

		this.game.camera.bounds = null
		keys.focus.onDown.add(
			function(){
				if(this.game.camera.target === null){
					this.game.camera.follow(this.excawater.bodySprite);
				}else{
					this.camera.unfollow();
				}
			}, this);

		this.isRunning = false;
		this.isStepMode = false;
		keys.onestep.onDown.add(function(){
			if(!this.isRunning){
				this.isStepMode = true;
				this.isRunning = true;
				this.gameLogic.setProgram(codeParser(document.getElementById("codeInput").value));
			}
			this.turnTimer = this.turnDuration-1;
		}, this);

		keys.run.onDown.add(
			function(){
				if(!this.isRunning){
					this.isRunning = true;
					this.gameLogic.setProgram(codeParser(document.getElementById("codeInput").value));
				}
				this.turnTimer = this.turnDuration-1;
			}, this);
		keys.restart.onDown.add(
			function(){
				this.turnTimer = this.turnDuration;
				this.game.state.restart();
			}, this);


	},

	update: function(){
		if(this.turnTimer < this.turnDuration){
			this.turnTimer++;
			if(this.turnTimer >= this.turnDuration){
				this.updateAnimation(this.gameLogic.nextStep());
				if(this.isStepMode){
					this.turnTimer = this.turnDuration;
				}else{
					this.turnTimer = 0;
				}
			}
		}

		this.excawater.updateMovement();

		this.info.setText("Скорость X: " + this.gameLogic.excawater.acceleration.x + "; Y: " + this.gameLogic.excawater.acceleration.y);

		this.globalWaterTimer++;
		if(this.globalWaterTimer > 29){
			this.globalWaterTimer = 0;
		}
	},

	updateAnimation: function(report){
		for(var i = 0; i < report.tileChange.length; i++){
			this.visualTile[report.tileChange[i].point.y][report.tileChange[i].point.x].destroy();
			switch(report.tileChange[i].type){
				case 0:
					this.visualTile[report.tileChange[i].point.y][report.tileChange[i].point.x] = new waterSprite(this.game, report.tileChange[i].point.x, report.tileChange[i].point.y, this.cellSize, this.floor, this.waterAnimTimer.anim.frame);
				break;
				case 1:
					this.visualTile[report.tileChange[i].point.y][report.tileChange[i].point.x] = new grassSprite(this.game, report.tileChange[i].point.x, report.tileChange[i].point.y, this.cellSize, this.floor);
				break;
			}
		}
		this.excawater.move(report.excawater, this.turnDuration);
	}
}