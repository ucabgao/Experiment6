'use strict'

let app = angular.module('Roulette', []);

app.controller('RouletteController', function($http, $interval, $timeout) {

  this.currentlyPlaying = false;

  this.currentSong = {
    title:  '',
    artist: '',
    image:  ''
  };

  // likedSongs will be an array of Song objects, which have...
  // keys of "title" and "artist"
  this.likedSongs = [];
  this.loggedIn = false;

  this.buttonName = function() {
    return this.currentlyPlaying ? 'Pause' : 'Play';
  };

  this.playSong = function() {
    this.currentlyPlaying = !this.currentlyPlaying;

    $http.get('/player/play');
  };

  // update current song information
  this.getSong = function() {
    if(!this.currentlyPlaying) return false;
    let myUrl = '/player/currentSong';

    $http.get(myUrl)
      .then((response) => {
        let myTitle   = response.data.title;
        let myArtist  = response.data.artist;
        let myImage   = response.data.image;

        this.updateCurrentSong(myTitle, myArtist, myImage);
      });
  };

  this.updateCurrentSong = function(title, artist, image) {
    this.currentSong['title']   = title;
    this.currentSong['artist']  = artist;
    this.currentSong['image']   = image;
  };

  this.likeSong = function() {
    let myUrl = '/player/like';

    let title  = this.currentSong['title'];
    let artist = this.currentSong['artist'];
    let user   = localStorage['user'];

    // check if we already have song favorited
    for(let i = 0, j = this.likedSongs.length; i < j; i++) {
      let sameTitle  = this.likedSongs[i]['title'] === title;
      let sameArtist = this.likedSongs[i]['artist'] === artist;

      if(sameTitle & sameArtist) return false;
    }

    let data = {
      title:  title,
      artist: artist,
      user:   user
    };

    $http.post(myUrl, data)
      .then((response) => {
        this.likedSongs = response.data;
      });
  };

  this.deleteSong = function(index) {
    // delete song from our database
    let myUrl = 'player/dislike';

    let title  = this.likedSongs[index]['title'];
    let artist = this.likedSongs[index]['artist'];
    let user   = localStorage['user'];

    let data = {
      title:  title,
      artist: artist,
      user:   user
    }

    $http.post(myUrl, data)
      .then((response) => {
        // delete song from controller's array
        this.likedSongs.splice(index, 1);
      });
  };

  this.stopSong = function() {
    this.currentlyPlaying = false;

    $http.get('player/stop');
  }

  this.login = function() {
    let name = this.login_name;
    let password = this.login_password;

    let data = {
      name: name,
      password: password
    };

    this.authenticateUser(data);
  };

  this.logout = function() {
    this.loggedIn = false;

    localStorage.setItem('token', undefined);
    localStorage.setItem('user', undefined);

    this.stopSong();
    this.likedSongs = [];
  };

  this.signup = function() {
    let name     = this.signup_name;
    let password = this.signup_password;

    let data = {
      name:     name,
      password: password
    }

    let myUrl = '/user/new';

    $http.post(myUrl, data)
      .then((response) => {
        if(response.data.success) {
          let data = response.data;

          // generate token with newly created user
          let name     = data.name;
          let password = data.password;

          let userData = {
            name:     name,
            password: password
          };

          this.authenticateUser(userData);
        }
      });
  };

  this.getFavoriteSongs = function() {
    let myUrl = '/player/favorites';

    let data = {
      user: localStorage['user']
    };

    $http.post(myUrl, data)
      .then((response) => {
        this.likedSongs = response.data;
      });
  };

  this.authenticateUser = function(data) {
    let myUrl = '/user/authenticate';

    $http.post(myUrl, data)
      .then((response) => {
        let data = response.data;

        if(data['success']) {
          // if login was successful, then show the player and hide login page
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', data.user.name);

          // show favorite songs from user
          this.loggedIn = true;
          this.getFavoriteSongs();

          // clear out DOM login screen username and password
          this.login_name      = '';
          this.login_password  = '';
          this.signup_name     = '';
          this.signup_password = '';
        }
      });
  }

  // Check for song title every second
  $interval(() => {
    this.getSong();
  }, 1000);

});
