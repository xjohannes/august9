var home = require('../controllers/home'),
		forms = require('../controllers/forms'),
		persistenceLayer = require('../controllers/persistenceLayer'),
		logger = require('morgan');
    //contacts = require('../controllers/contacts');

module.exports.initialize = function(app, query) {
    app.use(logger('dev'));
    app.get('/', home.index);
    app.get('/upload', forms.uploadForm);
    app.get('/newProject', forms.createProjectForm);
    app.get('/project/', persistenceLayer.getProjects);
    app.get('/project/:projectName', persistenceLayer.getProjectSongs);
    app.get('/project/:projectName/:songTitle', persistenceLayer.getSong);
    app.get('/test', home.testGet);


    app.post('/upload/:projectName', persistenceLayer.uploadSong);
    app.post('/project/', persistenceLayer.saveProject );
    app.post('/test', home.testPost);

    app.put('/project/:projectName', persistenceLayer.updateProject);
    app.put('/test', home.testPut);

    app.delete('/test', home.testDelete);
    
    //app.get('/api/contacts', contacts.index);
   
    //app.post('/api/contacts', contacts.add);
    //app.put('/api/contacts', contacts.update);
    //app.delete('/api/contacts/:id', contacts.delete);
};
