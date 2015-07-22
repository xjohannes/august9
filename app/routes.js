var home = require('../controllers/home'),
		upload = require('../controllers/upload'),
		persistenceLayer = require('../controllers/persistenceLayer'),
		logger = require('morgan');
    //contacts = require('../controllers/contacts');

module.exports.initialize = function(app, query) {
    app.use(logger('dev'));
    app.get('/', home.index);
    app.get('/upload', upload);
    app.get('/:projectName', persistenceLayer.getProject);


    app.post('/upload/:projectName', persistenceLayer.upploadSong);
    
    //app.get('/api/contacts', contacts.index);
   
    //app.post('/api/contacts', contacts.add);
    //app.put('/api/contacts', contacts.update);
    //app.delete('/api/contacts/:id', contacts.delete);
};
