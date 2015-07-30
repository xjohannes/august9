module.exports = {
    index: function(req, res) {
        res.render('index');
    },
    testGet: function(req, res) {
    	res.json({title:"GET"});
    	console.log("Test: GET");

    },
    testPost: function(req, res) {
    	console.log("Test: POST");
    },
    testPut: function(req, res) {
    	console.log("Test: PUT");
    },
    testDelete: function(req, res) {
    	console.log("Test: DELETE");
    }
};


