module.exports = {
    index: function(req, res) {
        res.render('index');
    },
    play: function(req, res) {
        res.render('layouts/musicPlayer');
    }
};


