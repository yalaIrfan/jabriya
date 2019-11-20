module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated())
            return next();
            req.flash('error_msg', 'Please login to enter dashboard.');
            res.redirect('/');
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/dashboard');      
      }
}