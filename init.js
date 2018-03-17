(function(){
	var GameProperties = {
			width: 800,
			height: 600,
			renderer: Phaser.CANVAS,
			antialias: true,
			parent: "canvas",
			transparent: false
		};

	var game = new Phaser.Game(GameProperties);

	game.state.add("level", level);

	game.state.start("level");
})();

function numArr(from, to){
	var res = [];
	for(var i = from; i <= to; i++){
		res.push(i);
	}
	return res;
}