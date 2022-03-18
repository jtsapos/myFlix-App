// As a server-side web framework for Node.js., Express is used to create and maintain web servers as well as manage HTTP requests.
// Rather than using modules (e.g., the HTTP module), you can simply use Express to route requests/responses and interact with request data

//Load Express Framework
const express = require('express') // install Express using npm and then import the module declaring "const express"
const app = express(); // and constant app = express()

// Import middleware libraries: Morgan, body-parser, and uuid
const morgan = require('morgan'), // Morgan (logging middleware for Express) is first imported locally (the line const morgan = require('morgan');), then passed into the app.use() function below:
bodyParser = require('body-parser'),
uuid = require('uuid'); 

// Use body-parser middleware function
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Mongoose, models.js and respective models
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// Import auth.js file
let auth = require('./auth')(app); //the app argument you're passing here ensures that Express is available in your “auth.js” file as well.

// Require passport module & import passport.js file
const passport = require('passport');
require('./passport');

/* Connecting to MongoDB myFlixDB */
// a) Connect to Local DB
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Log basic request data in terminal using Morgan middleware library
app.use(morgan('common')); // 'common' parameter here specifies that all requests should be logged using Morgan’s “common” format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response.

// GET Requests-These three app.get requests define the different URLs that requests can be sent to (also called endpoints or routes), as well as the different responses
// that should be returned for each URL.

app.get('/', (req, res) => {
  res.send('Welcome to myFlix movies club!')
});


// READ: Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => { //Now, any request to the “movies” endpoint will require a JWT from the client. The JWT will be decoded and checked by the JWT authentication strategy in Passport.js, which will authenticate the request.
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});

// READ: Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title}) // Find the movie by title
    .then((movie) => {
      if(movie){ // If movie was found, return json, else throw error
        res.status(200).json(movie);
      } else {
        res.status(400).send('Movie not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});

// READ: Return data about a genre (description) by name/title (e.g., “Drama”)
app.get('/movies/genre/:Name', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name}) // Find one movie with the genre by genre name
    .then((movie) => {
      if(movie){ // If a movie with the genre was found, return json of genre info, else throw error
        res.status(200).json(movie.Genre);
      } else {
        res.status(400).send('Genre not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});

// READ: Return data about a director (bio, birth year, death year) by name
app.get('/movies/director/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name}) // Find one movie with the director by name
    .then((movie) => {
      if(movie){ // If a movie with the director was found, return json of director info, else throw error
        res.status(200).json(movie.Director);
      } else {
        res.status(400).send('Director not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});

// Get all users
app.get('/Users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Get a user by username
app.get('/Users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/Users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Allow users to Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/Users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/Users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { // Find user by username
     $push: { FavoriteMovies: req.params.MovieID } // Add movie to the list
   },
   { new: true }) // Returns the updated document
      .then((updatedUser) => {
      res.json(updatedUser); // Return json object of updatedUser
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// DELETE: Allow users to remove a movie from their list of favorites
app.delete('/Users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username : req.params.Username}, // Find user by username
    {$pull: { FavoriteMovies: req.params.MovieID}}, // Remove movie from the list
    { new : true }) // Return the updated document
    .then((updatedUser) => {
        res.json(updatedUser); // Return json object of updatedUser
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Delete a user by username (Allow user to deregister)
app.delete('/Users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username }) // Find user by username
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Serve static content for the app from the 'public' directory
app.use(express.static('public')) // This function automatically routes all requests for static files to their corresponding files within a certain folder on the server (i.e. the “public” folder)


// “error-handling” middleware functions. They operate in the same way as other middleware functions except: they take four arguments instead of three (err, req, res, next).
// This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere). Information about the current error would be logged to the
// terminal using err.stack, which is a property of the error parameter for the middleware function. Error-handling middleware should always be defined last in a chain of middleware,
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error!')
})

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.')
})

