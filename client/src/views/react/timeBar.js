//var React = require('react'),
  //  ReactDOM = require('react-dom');
var $ = require('jquery'),
    Dragable = require('jquery-ui/draggable');

module.exports = function() {
    // private variables:
    var self = this;

    this.initialize = function(options) {
       // $('progressbar')
        console.log("Initializing timeBar");
        self.playedBar = document.getElementById("playedBar");
        self.playedTime = document.getElementById("playedTime");
        self.slider =  document.getElementById("slider");
        self.dragBox =  document.getElementById("dragBox");
        self.duration =  document.getElementById("duration");
        self.currentAudio;

        $( "#slider" ).draggable({
            axis: "x",
            containment: self.dragBox
        });
        $("#slider").on("start", function(event) {
            self.seeking = true;
        });
        $("#slider").on("drag", function(event) {
            var percentPlayed = (((event.clientX - self.dragBox.getBoundingClientRect().left) * 100)/self.dragBox.offsetWidth), currentTime;
            self.playedBar.style.width = percentPlayed + "%";
            //currentTime = (percentPlayed * self.currentAudio.duration /100);
            self.currentAudio.currentTime = percentPlayed * self.currentAudio.duration /100;
        });
        $("#slider").on("stop", function(event) {
            self.seeking = false;
        });
        $("#progressBar").on("click", function(event) {
            if(self.currentAudio) {
                var percentPlayed = (((event.clientX - self.dragBox.getBoundingClientRect().left) * 100) / self.dragBox.offsetWidth), currentTime;
                if (percentPlayed <= 100) {
                    self.playedBar.style.width = percentPlayed + "%";
                    //currentTime = (percentPlayed * self.currentAudio.duration /100);
                    self.currentAudio.currentTime = percentPlayed * self.currentAudio.duration /100;
                }
            }
        });
    };


    this.play = function( currentSong ) {
        var playedTime = $('playedTime');
        self.currentAudio = currentSong.audioObj;
        self.setUpAudio(self.currentAudio);

    };
    this.resetProgressBar = function() {
        self.playedTime.innerText = "0:00";
        self.playedBar.style.width = "0%";
        self.slider.style.left =  "0px";

    };
    this.renderProgressbar = function(event) {
        self.interval = setInterval(function() {
            self.currentTime = self.cutDecimals(self.currentAudio.currentTime);
            self.timeString = self.parseTime(self.currentTime);
            self.playedTime.innerText = self.timeString;
        }, 1000);
        self.interval2 = setInterval(function() {
            /*progressBar fill*/
            if (!self.seeking) {
                var percentPlayed = (self.currentAudio.currentTime * 100) / self.currentAudio.duration, pixlesMoved;
                self.playedBar.style.width = percentPlayed.toString() + "%";

                /* Slider move*/
                pixlesMoved = (percentPlayed * self.dragBox.offsetWidth) / 100;
                self.slider.style.left = pixlesMoved + "px";
            }
        }, 250);
    }
    this.setUpAudio = function(audio) {
        audio.addEventListener("playing", self.renderProgressbar );
        audio.addEventListener("loadedmetadata", function() {
            self.playedTime.className = "visible";
            self.duration.className = "visible";
            self.slider.className = "visible";
            self.duration.innerText = self.parseTime(self.cutDecimals(audio.duration));
        });

        audio.addEventListener("pause", function(event) {
            clearInterval(self.interval);
            clearInterval(self.interval2);
        });
        audio.addEventListener("ended", function(event) {
            //console.log("ENDED2");
            clearInterval(self.interval);
            clearInterval(self.interval2);
            self.currentAudio.removeEventListener("playing", self.renderProgressbar);
            self.currentAudio.currentTime = 0;
            setTimeout(function() {
                self.resetProgressBar();
            }, 1001);



        });
    };
    this.tearDownAudio = function(audio) {

    };

    this.parseTime = function(time) {
        var sec = this.parseSeconds(time) + 1;
        return this.parseMinutes(time) + ":" + (sec<10?"0" + sec : sec);
    };
    this.parseMinutes = function(time) {
        return self.cutDecimals(time/60);
    }
    this.cutDecimals = function(time) {
        return time | 0;
    };
    this.parseSeconds = function(time) {
        return time%60;
    };
    /*this.setTimeCounters = function(audio) {
     self.currentTime = self.cutDecimals(audio.currentTime);
     self.timeString = self.parseTime(self.currentTime);
     self.playedTime.innerText = self.timeString;
     };

     this.performance = function() {
     var t0 = performance.now();
     self.setTimeCounters(audio);
     var t1 = performance.now();
     console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
     };*/

};