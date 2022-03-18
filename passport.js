const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
Models = require('./models.js'),
passportJWT = require('passport-jwt');

let Users = Models.User,
   JWTStrategy = passportJWT.Strategy,
   ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy ({ //“LocalStrategy,” defines your basic HTTP authentication for login requests (username/password) then uses Mongoose to check your database for a user with the same username
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne( { Username: username }, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }
        if (!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'}); //if the username can’t be found within the database, an error message is passed to the callback:
        }
        console.log('finished');
    return callback(null, user);
    });
}));

passport.use(new JWTStrategy ({ //creates the JWT code to be used in the auth.js file where the actual JWT will be created.
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //In the code above, the JWT is extracted from the header of the HTTP request. This JWT is called the “bearer token”
    secretOrKey: 'your_jwt_secret' //uses a “secret” key to verify the signature of the JWT. This signature verifies that the sender of the JWT (the client) is who it says it is—and that the JWT hasn’t been altered
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then ((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));