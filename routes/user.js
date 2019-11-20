const express = require('express');
const User = require('../model/user');
const bycrypt = require('bcryptjs')
const router = express.Router();
const { forwardAuthenticated } = require('../config/auth');
const passport = require('passport');

//Register page
router.post('/register', (req, res) => {
    let errors = validateRegistration(req);
    const { name, email, mobile, password, password2 } = req.body;
    console.log(errors)
    if (errors.length > 0) {
        res.render('sign', {
            errors, name, email, mobile, password, password2
        })
    } else {
        //Validation passed
        User.findOne({ email })
            .then(user => {
                if (user) {
                    errors.push({ msg: "Email is already registered" })
                    res.render('sign', {
                        errors, name, email, mobile, password, password2
                    })
                }
                else {
                    const newuser = new User({
                        name,
                        email,
                        mobile,
                        password
                    });
                    console.log(newuser);

                    //Hash the password
                    bycrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bycrypt.hash(newuser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //setting new hashed password
                            newuser.password = hash;
                            //save user to db
                            newuser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can login!')
                                    res.redirect('/')
                                })
                                .catch(err => console.log(err))
                        })
                    })

                    // res.send('pass')
                }
            })
    }
})

//Login Page
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  });
  

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

function validateRegistration(req) {
    const { name, email, mobile, password, password2 } = req.body;
    let p = "/^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
        + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$/";
    const errors = [];
    //all check
    if (!name || !email || !mobile || !password)
        errors.push({ msg: 'Please in all the fields' });
    if (email && !/[^@]+@[^\.]+\..+/.test(email))
        errors.push({ msg: 'Please enter valid email' });
    if (password !== password2)
        errors.push({ msg: `Passwords do not match` });
    if (password.length < 6)
        errors.push({ msg: `Password should be atleast 6 characters` });


    return errors;
}

module.exports = router;