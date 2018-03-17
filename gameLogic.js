var gameLogic = function(game, levelData, excawaterX, excawaterY, excawaterAngle){
	this.game = game;

	//0 - вперед
	//1 - назад
	//2 - по часовой
	//3 - против часовой
	//4 - башня по часовой
	//5 - башня против часовой
	//6 - копать


	this.levelData = levelData;//2d array
	this.excawater = {
		position: new Phaser.Point(excawaterX, excawaterY),
		angle: new angle(excawaterAngle),
		handAngle: new angle(excawaterAngle),
		trunkContent: null,
		acceleration: new Phaser.Point(0, 0)
	}
	this.commandList = [];
	this.currentCommand = 0;

	this.maxSpeed = 2;
}

gameLogic.prototype = {
	nextStep: function(){
		var report = 
		{
			excawater:{
				commands: this.commandList[this.currentCommand],
				position:{
					from: new Phaser.Point().copyFrom(this.excawater.position), 
					to: new Phaser.Point(),
				},
				angle:{
					from: new angle(this.excawater.angle.value),
					to: new angle()
				},
				handAngle:{
					from: new angle(this.excawater.handAngle.value),
					to: new angle()
				}
			},
			tileChange:[]
		};

		//console.log("1)", this.excawater.acceleration);
		var isMoving = false;
		if(this.currentCommand < this.commandList.length){
			for(var i = 0; i < this.commandList[this.currentCommand].length; i++){
				switch(this.commandList[this.currentCommand][i]){
					case 0:
						isMoving = true;
						//if(this.levelData[this.excawater.position.y][this.excawater.position.x] === 0){
							Phaser.Point.add(this.excawater.acceleration, this.excawater.angle.getPosition(), this.excawater.acceleration);
						//}
						//Phaser.Point.add(this.excawater.position, this.excawater.angle.getPosition(), this.excawater.position);
					break;
					case 1:
						//isMoving = true;
						//if(this.levelData[this.excawater.position.y][this.excawater.position.x] === 0){
							Phaser.Point.add(this.excawater.acceleration, this.excawater.angle.getPosition().multiply(-1,-1), this.excawater.acceleration);
						//}
						//Phaser.Point.add(this.excawater.position, this.excawater.angle.getPosition().multiply(-1, -1), this.excawater.position);
					break;
					case 2:
						this.excawater.angle.add(1);
						this.excawater.handAngle.add(1);
						report.excawater.angle.direction = 1;
						report.excawater.handAngle.direction = 1;
					break;
					case 3:
						this.excawater.angle.add(-1);
						this.excawater.handAngle.add(-1);
						report.excawater.angle.direction = -1;
						report.excawater.handAngle.direction = -1;
					break;
					case 4:
						this.excawater.handAngle.add(1);
						report.excawater.handAngle.direction = 1;
					break;
					case 5:
						this.excawater.handAngle.add(-1);
						report.excawater.handAngle.direction = -1;
					break;
					case 6:
						//1(земля) закапывает
						//0(вода) выкапывает
						var digPoint = Phaser.Point.add(this.excawater.position, this.excawater.handAngle.getPosition()),
							digTile = this.levelData[digPoint.y][digPoint.x];
						if(this.excawater.trunkContent === null && digTile != 0){
							this.levelData[digPoint.y][digPoint.x] = 0;
							this.excawater.trunkContent = this.levelData[digPoint.y][digPoint.x];
							report.tileChange.push({point:digPoint, type:0});
						}else if(this.excawater.trunkContent !== null){
							this.levelData[digPoint.y][digPoint.x] = this.excawater.trunkContent;
							this.excawater.trunkContent = null;
							report.tileChange.push({point:digPoint, type:1});
						}
						report.excawater.trunkContent = this.excawater.trunkContent;
					break;
				}
			}
			this.currentCommand++;
		}
		//console.log("2)", this.excawater.acceleration);
		if(this.levelData[this.excawater.position.y][this.excawater.position.x] === 0 && !isMoving){
			//this.excawater.acceleration.add(-1,-1);
			if(this.excawater.acceleration.x > 0){
				this.excawater.acceleration.x -= 1;
			}else if(this.excawater.acceleration.x < 0){
				this.excawater.acceleration.x += 1;
			}

			if(this.excawater.acceleration.y > 0){
				this.excawater.acceleration.y -= 1;
			}else if(this.excawater.acceleration.y < 0){
				this.excawater.acceleration.y += 1;
			}
		}
		//console.log("3)",this.excawater.acceleration);

		//console.log("4)",this.excawater.acceleration);
		if(this.excawater.acceleration.x < -this.maxSpeed){
			this.excawater.acceleration.x = -this.maxSpeed;
		}
		if(this.excawater.acceleration.y < -this.maxSpeed){
			this.excawater.acceleration.y = -this.maxSpeed;
		}
		if(this.excawater.acceleration.x > this.maxSpeed){
			this.excawater.acceleration.x = this.maxSpeed;
		}
		if(this.excawater.acceleration.y > this.maxSpeed){
			this.excawater.acceleration.y = this.maxSpeed;
		}
		//console.log(" --- ");

		if(this.levelData[this.excawater.position.y][this.excawater.position.x] !== 0){
			if(isMoving){
				if(this.excawater.acceleration.x > 1){
					this.excawater.acceleration.x = 1;
				}else if(this.excawater.acceleration.x < -1){
					this.excawater.acceleration.x = -1;
				}

				if(this.excawater.acceleration.y > 1){
					this.excawater.acceleration.y = 1;
				}else if(this.excawater.acceleration.y < -1){
					this.excawater.acceleration.y = -1;
				}
			}else{
				this.excawater.acceleration.set(0);
			}
		}

		console.log("5)",this.excawater.acceleration);
		this.excawater.position.add(this.excawater.acceleration.x, this.excawater.acceleration.y);

		if(this.excawater.position.x < 0){
			this.excawater.position.x = 0;
		}
		if(this.excawater.position.y < 0){
			this.excawater.position.y = 0;
		}
		if(this.excawater.position.x >= this.levelData[0].length){
			this.excawater.position.x = this.levelData[0].length - 1;
		}
		if(this.excawater.position.y >= this.levelData.length){
			this.excawater.position.x = this.levelData.length - 1;
		}

		report.excawater.position.to.copyFrom(this.excawater.position);
		report.excawater.angle.to.set(this.excawater.angle.value);
		report.excawater.handAngle.to.set(this.excawater.handAngle.value);

		return report;
	},

	setProgram: function(a){
		this.commandList = a;
	}
}

//Animal.apply(this, arguments); //Внутри конструктора Rabbit
//Rabbit.prototype = Object.create(Animal.prototype);
//Rabbit.prototype.constructor = Rabbit;