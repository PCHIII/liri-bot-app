require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios"); 
var moment = require("moment");
var fs = require("fs");

var action = process.argv[2];


switch (action) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifythisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        dowhatitSays();
        break;

    default:
        console.log ('sorry, wrong command')
        break;
};

function concertThis () {
    var artist = process.argv.slice(3).join(" ");

    var apiUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(apiUrl).then(function(response){
        // console.log(response.data);
        for (var i = 0; i < response.length; i++) {
            console.log("---------------------------");
            console.log("Artist: " + artist);
            
            var venueName = response.data[i].venue.name;
            console.log("Venue: " + venueName);
            
            var venueLocation = response.data[i].venue.city;
            console.log("Location: " + venueLocation);
            
            var date = moment(response.data[i].datetime).format("MM/DD/YYYY");
            console.log("Date: " + date);
            console.log("---------------------------");

        // var jsonData = response.data;
        // console.log(jsonData)
        }
    })

// axios errors docs?????? using promises from stack
.catch((error) => {
    // Error 😨
    if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log(error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        console.log('Error', error.message);
    }
    console.log(error.config);
});

}

