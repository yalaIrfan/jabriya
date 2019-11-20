const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const passport = require('passport');

//Load user model
const User = require('../model/user');



module.exports = function (passport) {
    passport.use(new LocalStrategy(
        { usernameField: 'email' }, (email, password, done) => {
            //Match user 
            User.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "That user is not registered" })
                    }
                    //Match password
                    bycrypt.compare(password, user.password, (err, isMatched) => {
                        if (err)
                            throw err;
                        if (isMatched) {
                            return done(null, user)
                        }
                        else
                            return done(null, false, { message: "Pasword incorrect" })

                    })

                })
                .catch(err => console.log(err))
        }
    ))

    //Add serialize and deserialize...

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

};