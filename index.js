const express = require('express');
   morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

let topMovies = [
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

  //GET Requests

    app.get('/', (req, res) => {
    res.send('Welcome to myFlix movies club!');
  });

  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });

  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error!');
  });

  // listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
