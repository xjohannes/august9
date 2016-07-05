var Backbone = require('Backbone'),
    $ = require('jQuery'),
    PlayerView = require('../views/collectionViews/playerView'),
    CurrentSongView = require('../views/collectionViews/currentSongView'),
    PlayerControlsView = require('../views/collectionViews/playerControlsView'),
    DurationsView = require('../views/collectionViews/durationsView'),
    TimeBar = require('../views/react/timeBar');

module.exports = function () {
    // private variables:
    var self = this;
    this.initialize = function (options) {
        self.options = options || {};
        self.loop = false;
        self.playThrough = true;
        self.projectList = self.options.projectList;
        self.queueCollection = self.options.collection;
        self.currentSong = self.queueCollection.getQueueTop();
        self.currentTime = null;
        self.playerControls = new PlayerControlsView({model: self.currentSong, controller: self});
        $('#musicPlayer').html(self.playerControls.render().el);
        self.timeBar = new TimeBar();
        self.timeBar.initialize();
    };
    this.playNext = function () {
        self.currentTime = null;
        if (self.loop) {
            self.play(self.currentSong);
        } else if (self.playThrough) {
            //self.currentSong.audioObj.off("ended", self.playNext);
            self.play(self.queueCollection.nextTrack());
        }
    };
    this.play = function (songModel) {
        if (songModel) {
            self.currentSong = songModel;
        } else {
            self.currentSong = self.queueCollection.getQueueTop();
        }
        if (self.currentSong.isPlaying()) {
            self.currentSong.stop();
        }
        else {
            self.playerControls.registerNewModel(self.currentSong);
            self.currentSong.play(self.currentTime);
            self.timeBar.play(self.currentSong);
            self.currentSong.audioObj.addEventListener('ended', self.playNext);
            self.currentSong.audioObj.addEventListener('pause', self.pause);
        }
    };
    this.pause = function() {
        console.log("Player. Pause: " + self.currentSong.audioObj.currentTime);
        self.currentTime = self.currentSong.audioObj.currentTime;
    };
    /*this.initializePlay = function() {
     self.playerControls.registerNewModel(self.currentSong);
     self.currentSong.on('ended', self.playNext);
     self.currentSong.play();
     self.timeBar.play(self.currentSong);
     },*/
    this.stop = function (songModel) {
        songModel.stop();
        console.log("Player: Stop");
    };
    this.playFromList = function (songModel) {
        if (songModel.isPlaying()) {
            self.stop(songModel);
        } else if (self.currentSong.isPlaying()) {
            self.currentSong.stop();
            self.currentSong = songModel;
            self.playerControls.registerNewModel(songModel);
            songModel.play();
        } else {
            self.currentSong = songModel;
            self.playerControls.registerNewModel(songModel);
            self.currentSong.play();
        }
    };
    this.previousTrack = function () {
        var songModel = self.queueCollection.previousTrack();
        self.playFromList(songModel);
    };
    this.nextTrack = function () {
        var songModel = self.queueCollection.nextTrack();

        self.playFromList(songModel);
    };
};