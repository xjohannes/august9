var home = require('../controllers/home'),
		forms = require('../controllers/forms'),
		//persistenceLayer = require('../controllers/persistenceLayer'),
		logger = require('morgan'),
        project = require('../controllers/api/project'),
        song = require('../controllers/api/song'),
        user = require('../controllers/api/user'),
        config = require('./config'),
        jwt        = require('jsonwebtoken'),
        favicon = require('serve-favicon');
    //contacts = require('../controllers/contacts');

module.exports.initialize = function(app) {
    app.use(logger('dev'));
    app.use(favicon(__dirname + '/../public/favicon.ico'));

    // Public routes:
    app.get('/', home.index);
    app.get('/project/', project.getAll);
    app.get('/project/:id', project.get);
    app.get('/project/:id/song/', project.get);
    app.get('/project/:projectid/song/:id', song.get);

    app.get('/login', forms.login);
    app.post('/login', user.authenticate);
    

    // Autentication middleware
    app.use(function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if(token) {
            jwt.verify(token, config.secret, function(err, decode) {
                if(err) {
                    return res.status(401).json({success: false, message: "Failed to authenticate"});
                } else {
                    req.decoded = decode;
                    next();
                }
            });
        } else {
           return res.status(403).json({success: false, message: "No token provided"});
        }
    });
    
    // Admin/autenticated routes:
    app.get('/upload', forms.uploadForm);
    //app.get('/play', home.play);
    
    // project:
    app.post('/project/' , project.post);
    app.put('/project/:id', project.put);
    app.delete('/project/:id', project.delete);

    // song:
    app.get('/project/:projectid/song/:id', song.get);
    app.post('/project/:projectid' , song.post);
    app.put('/project/:projectid/song/:id', song.put);
    app.delete('/project/:projectid/song/:id', song.delete);

    //user:
    app.get('/user/', user.getAll);
    app.get('/user/:id', user.get);
    app.post('/user/' , user.post);
    app.put('/user/:id', user.put);
    app.delete('/user/:id', user.delete);


    //play 
    //app.get('/project/:projectid/song/:id/play', song.play);
    
};
