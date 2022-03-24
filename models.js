const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //to hash users’ passwords and compare hashed passwords every time users log in in order to ensure a more secure login authentication process.

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
  });
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  //function which does the actual hashing of submitted passwords.
  userSchema.statics.hashPassword = (password) => { 
    return bcrypt.hashSync(password, 10);
  };
  //function that compares submitted hashed passwords with the hashed passwords stored in your database
  //Don't use arrow functions when defining instance methods. validatePassword is an example of an instance method, 
  //a method that can be called on each object/document created (each individual object/document). 
  //Arrow functions bind the 'this' keyword to the object that owns that function, which in this case, is userSchema.methods—NOT user, even when validatePassword is being called on user within the line:
  //if(!!user.validatePassword(password))
  userSchema.methods.validatePassword = function(password) { 
    return bcrypt.compareSync(password, this.Password);
  };

  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;  