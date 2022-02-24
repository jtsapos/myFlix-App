const express = require('express');
const app = express();

app.use(express.static('public'));

let topMovies = [
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling'
    },
    {
      title: 'Lord of the Rings',
      author: 'J.R.R. Tolkien'
    },
    {
      title: 'Twilight',
      author: 'Stephanie Meyer'
    }
  ];

  //GET Requests

    app.get('/', (req, res) => {
    res.send('Welcome to myFlix movies club!');
  });

  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  // listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
