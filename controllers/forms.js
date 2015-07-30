module.exports = {

	uploadForm: function(req, res) {
    res.render('layouts/upload');
  },
  createProjectForm: function(req, res) {
  	res.render('layouts/createProject');
  }
};