function codeParser(source){
	var toFind = new RegExp(/[+-0.]{3}[+-.][0-9]*.?/, 'g'),
		findDigit = new RegExp(/\d+/, "g");
		matches = source.match(toFind),
		result = [],
		pointer = 0;
	for(var i = 0; matches && i < matches.length; i++){
		result.push([]);
		if(matches[i][0] == "+" && matches[i][1] == "+"){
			result[pointer].push(0);
		}
		if(matches[i][0] == "-" && matches[i][1] == "-"){
			result[pointer].push(1);
		}
		if(matches[i][0] == "+" && matches[i][1] == "-"){
			result[pointer].push(2);
		}
		if(matches[i][0] == "-" && matches[i][1] == "+"){
			result[pointer].push(3);
		}
		switch(matches[i][2]){
			case '+':
				result[pointer].push(4);
			break;
			case '-':
				result[pointer].push(5);
			break;
		}
		if(matches[i][3] == "+"){
			result[pointer].push(6);
		}
		if(matches[i].match(findDigit)){
			var delayAmount = Number.parseInt(matches[i].match(findDigit)[0]) - 1;
			for(var q = 0; q < delayAmount; q++){
				var clone = [];
				for(var z = 0; z < result[pointer].length; z++){
					clone.push(result[pointer][z]);
				}
				result.push(clone);
				pointer++;
			}
		}
		pointer++;
	}
	return result;
}