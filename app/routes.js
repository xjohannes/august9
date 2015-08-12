var home = require('../controllers/home'),
		forms = require('../controllers/forms'),
		//persistenceLayer = require('../controllers/persistenceLayer'),
		logger = require('morgan'),
        project = require('../controllers/api/project'),
        song = require('../controllers/api/song');
    //contacts = require('../controllers/contacts');

module.exports.initialize = function(app) {
    app.use(logger('dev'));
    app.get('/', home.index);
    app.get('/upload', forms.uploadForm);
    app.get('/play', home.play);
    
    // project:
    app.get('/project/', project.getAll);
    app.get('/project/:id', project.get);
    app.post('/project/' , project.post);
    app.put('/project/:id', project.put);
    app.delete('/project/:id', project.delete);

    //song
    app.get('/project/:id/song/', project.get);
    app.get('/project/:projectid/song/:id', song.get);
    app.post('/project/:projectid' , song.post);
    app.put('/project/:projectid/song/:id', song.put);
    app.delete('/project/:projectid/song/:id', song.delete);

    //play 
    app.get('/project/:projectid/song/:id/play', song.play);





    //app.get('/project/:id/:songId', persistenceLayer.getSong);
    //app.get('/test', home.testGet);


    //app.post('/upload/:projectName', persistenceLayer.uploadSong);
    //app.post('/project/', persistenceLayer.saveProject );
    //app.post('/test', home.testPost);

    //app.put('/project/:projectName', persistenceLayer.updateProject);
   // app.put('/test', home.testPut);

   // app.delete('/test', home.testDelete);
    
    //app.get('/api/contacts', contacts.index);
   
    //app.post('/api/contacts', contacts.add);
    //app.put('/api/contacts', contacts.update);
    //app.delete('/api/contacts/:id', contacts.delete);
};
