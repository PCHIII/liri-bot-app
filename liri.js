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
        console.log ('sorry, wrong command');
        break;
};

function concertThis() {
    var artistName = process.argv.slice(3).join(" ");

    // if no artist enter madonna by default
    if (!artistName) {
        artistName = 'Madonna';
    }

    var apiUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";


    axios.get(apiUrl).then(function(response){
        // console.log(response.data);

        for (var i = 0; i < response.data.length; i++) {
            console.log("")
            console.log("Artist: " + artistName.toUpperCase());
            
            var venueName = response.data[i].venue.name;
            console.log("Venue: " + venueName);
            
            var venueLocation = response.data[i].venue.city;
            console.log("Location: " + venueLocation);
            
            var date = moment(response.data[i].datetime).format("MM/DD/YYYY");
            console.log("Date: " + date);
            // console.log(JSON.stringify(response, null, 2));
            console.log("")
        // var jsonData = response.data;
        // console.log(jsonData)
        
        var result = ("Artist: " + artistName + "\n" + "Venue: " + venueName + "\n" + "Location: " + venueLocation + "\n" + "Date: " + date);
        writeData(action, result);


        }
    })

    

// axios errors docs?????? using promises cut/paste from stack
.catch((error) => {
    console.log(error);
   
});

}

function spotifythisSong() {
    var songInput = process.argv.slice(3).join(" ");

    // if user doesn't input a song, default to 'Wake Me Up Before You Go-Go' by wham.
    
    if (!songInput) {
        songInput = 'Wake Me Up Before You Go-Go';
    }

    // search spotify

    //parse JSON 

    spotify.search({ type: 'track', query: songInput }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return; 
        } 
        
        else {

        console.log("");
        // artist name
        
        var spotInfo = data.tracks.items[0];

        var artist = spotInfo.album.artists[0].name;
        console.log("Artist: " + artist);
        // song name

        var songTitle = spotInfo.name;
        console.log("Song: " + songTitle);

        // song on spotify
        var spotifyURL = spotInfo.external_urls.spotify;
        console.log("Preview " + songInput + " on Spotify: " + spotifyURL);
        
                
        // album
        var albumTitle = spotInfo.album.name;
        console.log("Album: " + albumTitle);
        console.log("");

    };
    });
}

function movieThis() {
    var movie = process.argv.slice(3).join(" ");

    if (!movie) {
        movie = "Mr.Nobody";
    }

    //  OMDB via documentation (http://omdbapi.com/)
    var qURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
    
    // console.log(qURL);

    // axios 
    axios.get(qURL).then(function (response) {
        // console.log(response.data);

        console.log("");

        // title 
        var movieTitle = response.data.Title;
        console.log("Title: " + movieTitle);

        // year 
        var releaseYear = response.data.Year;
        console.log("Release Year: " + releaseYear);

        // IMDB rating
        var rateIMDB = response.data.imdbRating;
        console.log("IMDB Rating: " + rateIMDB);

        // Rotten Tomatoes rating
        var rateRotten = response.data.Ratings[1].Value;
        console.log("Rotten Tomatoes Rating: " + rateRotten);

        // Country movie was produced 
        var country = response.data.Country;
        console.log("Produced in: " + country);

        // language of the movie
        var language = response.data.Language;
        console.log("Language: " + language);

        // plot of the movie
        var plot = response.data.Plot;
        console.log("Plot: " + plot);

        //  main actors
        var actors = response.data.Actors;
        console.log("Actors: " + actors);
        
        console.log("");

        
    })
// grabbed from stack
    .catch((error) => {
        console.log(error);
        
    });

}

function dowhatitSays () {

    // var fs = require("fs");

    fs.readFile("random.txt", "utf8", function(error, data) { 

        if (error) {
            return console.log(error);
        }
        var addTxt = data.split(",");
        
        process.argv[3] = addTxt[1]; 

        if (addTxt[0] === 'spotify-this-song') {
            spotifythisSong(process.argv[3]);
        }
    });
}

function writeData (action, result) {
    var fs = require("fs");
    var text = ("" + "\n" + "Command: " + action + "\n" + result + "\n" + "" + "\n");

    fs.appendFile("log.txt", text, function(error) {
        if (error) {
            console.log(error);
        } else {
            console.log("End of Search");
        }
    })
}
