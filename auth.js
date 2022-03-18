//With the code you write in this file, you’ll be able to create a new endpoint for registered users to log in. 
//This code will authenticate login requests using basic HTTP authentication and generate a JWT for the user.

const jwtSecret = 'your_jwt_secret'; //This has to be the same key used in the JWTStrategy
const jwt = require('jsonwebtoken'),
  passport = require('passport');
const { User } = require('./models');
require('./passport'); //Your local passport file

//Creates the JWT (Json web token)
//using the LocalStrategy from passport.js we first check that username/password in the body of the request exists in the database.
let generateJWTToken = (user) => { //If it does, you use 'generateJWTToken' function to create a JWT based on the username and password, which you then send back as a response to the client. 
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username you’re encoding in the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
    });
}
/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
      passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
            user: user
          });
        }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWTToken(user.toJSON());
          return res.json({ user, token }); //This is, ES6 shorthand for res.json({ user: user, token: token }). With ES6, if your keys are the same as your values, you can use this shorthand.
        });
      })(req, res);
    });
  }