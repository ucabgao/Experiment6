'use strict'

const express    = require('express');
const router     = express.Router();
const request    = require('request');
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
  res.json({ success: true, message: 'get api/' });
});

// TODO: need to populate mongodb with list of artists
// get a list of artists from database
router.get('/artists', (req, res) => {
  let myArtists = ['matchbox twenty', 'killers'];

  res.send(myArtists);
});

// returns an object with an 'id' (which can be searched on Spotify) and 'name'
router.get('/artistID/:artistName', (req, res) => {
  let artistName    = req.params.artistName;
  let formattedName = artistName.split(' ').join('+');

  let myURL = 'https://api.spotify.com/v1/search?q=' +
              formattedName + '&type=artist&limit=1';

  request(myURL, (error, response, body) => {
    if(!error && response.statusCode == 200) {

      let jsonData = JSON.parse(body)['artists']['items'][0];
      let artistID = undefined;

      // check if we received information from Spotify
      if(jsonData) {
        artistID = jsonData['id'];
      } else {
        console.log(artistName + '\'s id was not found.');
      }

      let data     = {};
      data['id']   = artistID;
      data['name'] = artistName;

      res.send(data);
    }
  });
});

// returns an array of objects, with keys of 'id', 'name' and 'image'
router.get('/albums/:artistID', (req, res) => {
  let artistID = req.params.artistID;

  let myUrl = 'https://api.spotify.com/v1/artists/' +
            artistID + '/albums?limit=10';

  // hit spotify API
  request(myUrl, (error, response, body) => {
    if(!error && response.statusCode == 200) {

      // jsonData will hold an array of albums
      let jsonData = JSON.parse(body)['items'];

      // myAlbums will hold an array of objects
      // Object will hold 'id', 'name' and 'image'
      let myAlbums = [];

      for(let i = 0, j = jsonData.length; i < j; i++) {
        let newAlbum = {};

        newAlbum['id']    = jsonData[i]['id'];
        newAlbum['name']  = jsonData[i]['name'];
        newAlbum['image'] = jsonData[i]['images'][1]['url'];

        myAlbums.push(newAlbum);
      }

      res.send(myAlbums);
    }
  });
});

// returns an array of objects, with keys of 'id', 'title', 'artist' & 'preview'
router.get('/tracks/:albumID', (req, res) => {
  let albumID = req.params.albumID;
  let image   = req.query.image;

  let myURL = 'https://api.spotify.com/v1/albums/' +
              albumID + '/tracks?limit=10';

  request(myURL, (error, response, body) => {
    if(!error && response.statusCode == 200) {
      let jsonData = JSON.parse(body)['items'];

      // myTracks will hold an array of objects
      // Object will hold 'id', 'title', 'artist' and 'preview'
      let myTracks = [];

      for(let i = 0, j = jsonData.length; i < j; i++) {
        let newTrack = {
          id: jsonData[i]['id'],
          title: jsonData[i]['name'],
          artist: jsonData[i]['artists'][0]['name'],
          preview: jsonData[i]['preview_url'],
          image: image
        };

        myTracks.push(newTrack);
      }
      console.log(myTracks);

      res.send(myTracks);
    }
  });
});

module.exports = router;
