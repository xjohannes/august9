var express = require('express'); 
var router = express.Router(); 
var util = require("util"); 


router.get('/upload', function(req, res) { 
  //res.render("uploadPage", {title: "I love files!"}); 
  console.log("upload page");
}); 

router.post('/upload', function( req, res, next ) {
	if( req.files) {
		console.log(util.inspect( req.files) );
		if (req.files.track.size === 0 ) {
			return next( new Error("No file selected") );
		}

		fs.exists(req.files.track.path, function ( exists ) {
			if(exists) {
				res.end('Got the file');
			}
			else {
				res.end("File upload did not succeed");
			}
		});	
	}
});

module.exports = router;