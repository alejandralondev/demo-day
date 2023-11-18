// how we handle different requests coming in routes
// our api's

module.exports = function(app, passport, db) { // all 

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user, // user information on every page
            messages: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('messages').save(
        { name: req.body.name, 
          dateBought: req.body.dateBought,
          expirationDate: req.body.expirationDate,
          msg: req.body.msg,
          price: req.body.price,
          thumbUp: 0, 
          thumbDown:0
          }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/messages', (req, res) => { // update
      db.collection('messages')
      .findOneAndUpdate(
        {
          name: req.body.name, 
          dateBought: req.body.dateBought,
          expirationDate: req.body.expirationDate,
          msg: req.body.msg,
          price: req.body.price
        }, 
        { $set: { thumbUp: req.body.subtract ? req.body.thumbUp - 1 : req.body.thumbUp + 1 },  },
        {
          sort: {_id: -1}, // specifies the sort order for the query. sorting the documents based on the _id field in descending order (-1), so the most recently created document will be considered first
          upsert: true
        }, (err, result) => 
        {
          if (err) return res.send(err)
          res.send(result)
        }
      )
    })

    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate(
        { 
          name: req.body.name, 
          msg: req.body.msg 
        }, 
        { $inc: { thumbUp: - 1} }, 
        {
          sort: {_id: -1}, 
          upsert: true
        }, (err, result) => 
        {
          if (err) return res.send(err)
          res.send(result)
        }
      )
    })

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({
        name: req.body.name, 
        dateBought: req.body.dateBought,
        expirationDate: req.body.expirationDate,
        msg: req.body.msg,
        price: req.body.price,
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
