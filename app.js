const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
 
//Passport config
require('./config/passport')(passport); 

//DB config
const db = require('./config/keys').MONGO_URI

//MongoDb
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set("view engine", 'ejs');

//bodyparser
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(
    session({
        secret: 'jabriya',
        resave: true,
        saveUninitialized: true
    })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect flash 
app.use(flash());

//Set global variable for error msgs so that we can use it in whole application for each request 
app.use(function(req,res,next ){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

