
// As a server-side web framework for Node.js., Express is used to create and maintain web servers as well as manage HTTP requests.
// Rather than using modules (e.g., the HTTP module), you can simply use Express to route requests/responses and interact with request data
const express = require('express'), // install Express using npm and then import the module declaring "const express"
bodyParser = require('body-parser'),
morgan = require('morgan'), // Morgan (logging middleware for Express) is first imported locally (the line const morgan = require('morgan');), then passed into the app.use() function below:
uuid = require('uuid'); 

const app = express() // and constant app = express()

app.use(bodyParser.json());

let users =  [
  {
    username: 'johnt',
    email: 'johnt@gmail.com',
    password: 'hellothere',
    birthday: '11/06/1990',
    favorites: [
      'Jesus of Nazareth',
      'Peter and Paul',
      'The Shawshank Redemption'
    ]
  }
]
let movies = [
  {
    name: 'Jesus of Nazareth', 
    title: 'Jesus of Nazareth', 
    year: '1977', 
    genre: {
      name: 'Religious',
      description: 'Religious films are generally drama that provokes spiritual and psychological emotions. '
    }, 
    director: {
      name: 'Franco Zeffirelli', 
      birth: '1968',
      death: '-',
      bio: ''
    },
    actors: {

    },
    
  }
];

app.use(morgan('common')); // 'common' parameter here specifies that all requests should be logged using Morgan’s “common” format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response.

// GET Requests-These three app.get requests define the different URLs that requests can be sent to (also called endpoints or routes), as well as the different responses
// that should be returned for each URL.

app.get('/', (req, res) => {
  res.send('Welcome to myFlix movies club!')
});


app.get('/movies', (req, res) => {
  res.json(movies);
});

//Responds with a json of the specific movie asked for (2)-
  app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
      return movie.title === req.params.title
    }));
  });

  //Responds with a json of all movies within specified genre (3)-
app.get('/movies/genres/:genre', (req, res) => {
  const genre = movies.find((movie) => movie.genre.name === req.params.genre).genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('Genre not found.');
  }
});

//Responds with a json with all information about the specified director (4)-
app.get('/movies/directors/:name', (req, res) => {
  const director = movies.find((movie) => movie.director.name === req.params.name).director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('Director not found.')
  }
});

//Creates a user in the platform (5)-
app.post('/users', (req, res) => {
  const newUser = req.body;
  if (newUser.username) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    const message = 'Missing username in request';
    res.status(400).send(message);
  }
});

//Changes user's username (6)-
app.put('/users/:username', (req, res) => {
  const newUsername = req.body;
  let user = users.find((user) => { return user.username === req.params.username });
  if (user) {
    user.username = newUsername.username;
    res.status(201).json(user)
  } else {
    res.status(404).send('User not found.')
  }
});

//Adds a movie to user's favorites list (7)-
app.post('/users/:username/:movie', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });
  if (user) {
    user.favorites.push(req.params.movie);
    res.status(200).send(req.params.movie + ' was added to ' + user.username + '\'s favorites list.');
  } else {
    res.status(404).send('User not found.');
  }
});

//Removes a movie from user's favorites list (8)-
app.delete('/users/:username/:movie', (req,res) => {
  let user = users.find((user) => { return user.username === req.params.username });
  
  if (user) {
    user.favorites = user.favorites.filter((mov) => { return mov !== req.params.movie });
    res.status(200).send(req.params.movie + ' was removed from ' + user.username + '\'s favorites list.');
  } else {
    res.status(404).send('User not found.')
  }
});

//Deletes user (9)-
app.delete('/users/:username', (req,res) => {
  let user = users.find((user) => { return user.username === req.params.username });
  if (user) {
    users = users.filter((user) => { return user.username !== req.params.username });
    res.status(201).send(req.params.username + ' was deleted.');
  } else {
    res.status(404).send('User not found.')
  }
})

app.use(express.static('public')) // This function automatically routes all requests for static files to their corresponding files within a certain folder on the server (i.e. the “public” folder)


// “error-handling” middleware functions. They operate in the same way as other middleware functions except: they take four arguments instead of three (err, req, res, next).
// This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere). Information about the current error would be logged to the
// terminal using err.stack, which is a property of the error parameter for the middleware function. Error-handling middleware should always be defined last in a chain of middleware,
app.use((err, req, res) => {
  console.error(err.stack)
  res.status(500).send('Error!')
})

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.')
})
