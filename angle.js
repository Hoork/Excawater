var angle = function(value){
	//7 0 1
	//6   2
	//5 4 3
	if(value === undefined){
		this.value = 0;
	}else{
		this.value = value;
	}
}

angle.prototype = {
	set: function(value){
		while(value >= 8){
			value -= 8;
		}
		while(value < 0){
			value += 8;
		}

		this.value = value;
		return this.value;
	},

	add: function(val){
		return this.set(this.value + val);
	},

	getPosition: function(){
		switch(this.value){
			case 0:
				return new Phaser.Point(0,-1);
			break;
			case 1:
				return new Phaser.Point(1,-1);
			break;
			case 2:
				return new Phaser.Point(1,0);
			break;
			case 3:
				return new Phaser.Point(1,1);
			break;
			case 4:
				return new Phaser.Point(0,1);
			break;
			case 5:
				return new Phaser.Point(-1,1);
			break;
			case 6:
				return new Phaser.Point(-1,0);
			break;
			case 7:
				return new Phaser.Point(-1,-1);
			break;
		}
	},

	getAngle: function(){
		return this.value * 45;
	}
}