

module.exports = {
	capitalize: function(string) {
		console.log("string: " + string);
		var names = string.split(" "),
				capatlizedName = "";
		console.log("string: " + names);
		for(var i = 0; i < names.length; i++) {
			capatlizedName += (names[i].charAt(0).toUpperCase() + names[i].slice(1).toLowerCase()) + " ";
		}
		console.log("capatlizedName: " + capatlizedName);
		return capatlizedName;
	},
	secret: 'august99tsugua'
};