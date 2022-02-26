
//As a server-side web framework for Node.js., Express is used to create and maintain web servers as well as manage HTTP requests. 
//Rather than using modules (e.g., the HTTP module), you can simply use Express to route requests/responses and interact with request data
const express = require('express'); //install Express using npm and then import the module declaring "const express" 
morgan = require('morgan'); //Morgan (logging middleware for Express) is first imported locally (the line const morgan = require('morgan');), then passed into the app.use() function below:
const app = express();      //and constant app = express()


app.use(morgan('common')); //'common' parameter here specifies that all requests should be logged using Morgan’s “common” format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response.

let topMovies = [ //json data about a list of movies which is returned by app.get('/movies', (req, res) below in the Get requests
    {
      Title: 'Jesus of Nazareth (1977)',
      Director: 'Franco Zeffirelli'
    },
    {
      Title: 'Peter and Paul (1981)',
      Director: 'Robert Day'
    },
    {
      Title: 'The Godfather (1972)',
      Director: 'Francis Ford Coppola'
    },
    {
      Title: 'The Shawshank Redemption (1994)',
      Director: 'Frank Darabont'
    },
    {
      Title: 'The Godfather II (1974)',
      Director: 'Francis Ford Coppola'
    },
    {
      Title: 'Star Wars (1977)',
      Director: 'George Lucas'
    },
    {
      Title: 'The Lord of the Rings: The Return of the King (2003)',
      Director: 'Peter Jackson'
    },
    {
      Title: 'Jaws (1975)',
      Director: 'Steven Spielberg'
    },
    {
      Title: 'Platoon (1986)',
      Director: 'Oliver Stone'
    },
    {
      Title: 'Braveheart (1995)',
      Director: 'Mel Gibson'
    }
  ];

  //GET Requests-These three app.get requests define the different URLs that requests can be sent to (also called endpoints or routes), as well as the different responses 
  //that should be returned for each URL.

    app.get('/', (req, res) => {
    res.send('Welcome to myFlix movies club!');
  });

  app.use(express.static('public')); //This function automatically routes all requests for static files to their corresponding files within a certain folder on the server (i.e. the “public” folder)

  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  //“error-handling” middleware functions. They operate in the same way as other middleware functions except: they take four arguments instead of three (err, req, res, next).
  //This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere). Information about the current error would be logged to the 
  //terminal using err.stack, which is a property of the error parameter for the middleware function. Error-handling middleware should always be defined last in a chain of middleware,
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error!');
  });

  // listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
