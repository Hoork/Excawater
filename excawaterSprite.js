var excawaterSprite = function(game, cellX, cellY, cellSize){
	this.game = game;
	//this.phy = this.game.physics.arcade;
	this.cellSize = cellSize;
	this.bodySprite = game.add.sprite(0,0, "excawater");
	this.bodySprite.anchor.set(0.5, 0.5);
	this.height = (this.bodySprite.height * this.cellSize)/this.bodySprite.width;
	this.bodySprite.height = this.height;
	this.bodySprite.width = cellSize;

	this.bodySprite.animations.add("++", numArr(45, 59));
	this.bodySprite.animations.add("+-", numArr(30, 44));
	this.bodySprite.animations.add("-+", numArr(15, 29));
	this.bodySprite.animations.add("--", numArr(0, 14));
	this.bodySprite.animations.add("00", numArr(60, 74));

	this.handSprite = game.add.sprite(this.bodySprite.x, this.bodySprite.y, "hand");
	this.handSprite.anchor.set(0.5, 0.8);
	this.handSprite.width = (this.handSprite.width * this.cellSize)/this.handSprite.height;
	this.handSprite.height = cellSize;
	this.handSprite.animations.add("filling", numArr(0, 25));
	this.handSprite.animations.add("unfilling", numArr(26, 52));
	//this.phy.enable(this.bodySprite);

	this.setPosition(cellX, cellY, 0, 0);

	this.isMoving = false;
	this.moveDuration = 0;
	this.moveTimer = 0;
	this.speed = new Phaser.Point();
	this.rotation = 0;
	this.handRotation = 0;

	this.isHandFull = false;
}

excawaterSprite.prototype = {
	setPosition: function(cellX, cellY, bAngle, hAngle){
		this.bodySprite.position.set(cellX * this.cellSize + this.cellSize/2, cellY * this.cellSize + this.height/2);
		this.bodySprite.angle = bAngle;
		this.handSprite.angle = hAngle;
	},
	move: function(report, length){
		var positionReport = report.position,
			rotationReport = report.angle, 
			handRotationReport = report.handAngle;

		this.moveTimer = 0;
		this.setPosition(positionReport.from.x, positionReport.from.y, rotationReport.from.getAngle(), handRotationReport.from.getAngle());
		this.moveDuration = length;
		this.speed.set((this.cellSize * (positionReport.to.x - positionReport.from.x))/length, (this.cellSize * (positionReport.to.y - positionReport.from.y))/length);

		var rotationAngle = (rotationReport.to.value - rotationReport.from.value) * 45;
		if(rotationReport.direction == -1 && rotationAngle >= 0){
			rotationAngle -= 360;
		}
		if(rotationReport.direction == 1 && rotationAngle <= 0){
			rotationAngle += 360;
		}
		this.rotation = rotationAngle/length;

		var handRotationAngle = (handRotationReport.to.value - handRotationReport.from.value) * 45;
		if(handRotationReport.direction == -1 && handRotationAngle >= 0){
			handRotationAngle -= 360;
		}
		if(handRotationReport.direction == 1 && handRotationAngle <= 0){
			handRotationAngle += 360;
		}
		this.handRotation = handRotationAngle/length;
		
		this.isMoving = true;

		this.bodySprite.animations.play("00", 60, true);
		for(var i = 0; report.commands && i < report.commands.length;  i++){
			if(report.commands[i] == 6){
				if(report.trunkContent === null){
					this.handSprite.animations.play("unfilling", 60);
				}else{
					this.handSprite.animations.play("filling", 60);
				}
			}

			if(report.commands[i] == 0){
				this.bodySprite.animations.play("++", 60, true);
				break;
			}
			if(report.commands[i] == 1){
				this.bodySprite.animations.play("--", 60, true);
				break;
			}
			if(report.commands[i] == 2){
				this.bodySprite.animations.play("+-", 60, true);
				break;
			}
			if(report.commands[i] == 3){
				this.bodySprite.animations.play("-+", 60, true);
				break;
			}
		}
		//this.phy.velocityFromRotation(this.phy.angleToXY(this.bodySprite, to.x * this.cellSize + this.cellSize/2, to.y * this.cellSize + this.height/2), 50, this.bodySprite.body.velocity);
	},

	stop: function(){
		this.isMoving = false;
	},

	updateMovement: function(){
		if(this.isMoving){
			this.bodySprite.position.add(this.speed.x, this.speed.y);
			this.bodySprite.angle += this.rotation;
			this.handSprite.angle += this.handRotation;
			if(this.moveTimer < this.moveDuration){
				this.moveTimer++;
				if(this.moveTimer >= this.moveDuration){
					this.isMoving = false;
					this.bodySprite.animations.play("00", 60, true);
				}
			}
		}
		this.handSprite.position.set(this.bodySprite.x, this.bodySprite.y);
	}
}