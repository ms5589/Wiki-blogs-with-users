"use strict"

var encryption = require('../encryption'),
    db = require('../db'),
    formidable = require('formidable');

// An endpoint for logging in and out users
class Session {

  // Renders a login form with no error message
  new(req, res) {
    req.session.reset();
    res.render('session/new', {message: "", user: {username: "Guest"}});
  }

  msg(req,res){
    res.render('session/msg', {msg: "", user: req.user});
  }
  sign(req, res) {
    req.session.reset();
    res.render('session/signup', {message: "", user: {username: "Guest"}});
  }

  check(req,res){
    var users = db.all('SELECT * FROM users', function(err, item){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
      res.render('session/check', {users: item, user: req.user});
    });
  }

  // Method that lets user to create an account
  signup(req,res,next) {
    var salt = encryption.salt();
    var form = new formidable.IncomingForm();
    req.session.reset();
    //user = "Guest";
    //res.render("session/delete", {user: {username: "Guest"}});
    form.parse(req, (err, fields, files) => {
      if(err) return res.sendStatus(500);
      console.log("username: ",fields.username," Pwrd", fields.password);
      db.run("INSERT INTO users (username, admin, blocked, password_digest, salt) values (?,?,?,?,?)",
       fields.username,
       false,
       false,
       encryption.digest(fields.password + salt),
       salt, function(err, user) {
         if(err) {console.log(err); return res.render('session/signup', {message: "Username is already taken.  Please try other username.", user: req.user});}
         //if(!user) return res.render('session/new', {message: "Username is already taken.  Please try other username.", user: req.user});
         else { return res.render('session/new', {message: "Account has been created, Please login now.", user: req.user});}
         return res.redirect('/login');
       });
    });
  }

  // Creates a new session, provided the username and password match one in the database,
  // If not, renders the login form with an error message.
  create(req, res, next) {
    req.session.reset();
    //res.render("session/delete", {user: {username: "Guest"}});
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if(err) return res.sendStatus(500);
      db.get("SELECT * FROM users WHERE username = ?", fields.username, (err, user) => {
        if(err) return res.render('session/new', {message: "Username/Password not found.  Please try again.", user: req.user});
        if(!user) return res.render('session/new', {message: "Username/Password not found.  Please try again.", user: req.user});
        if(user.password_digest != encryption.digest(fields.password + user.salt)) return res.render('session/new', {message: "Username/Password not found.  Please try again.", user: req.user});
        req.session.user_id = user.id;
        return res.redirect('/blog');
      });
    });
  }

   block(req, res) {
       var form = new formidable.IncomingForm();
       var temp = req.url.split('/')[2]
       form.parse(req, function(err, fields, files) {
       db.run('UPDATE users SET blocked= ? WHERE username = ?',true, fields.blockUser);
       /*'UPDATE Post SET title = ?, body = ? WHERE postId = ?', fields.title, fields.body, temp */
       console.log("User blocked", temp);
       res.redirect('/users');
    });
  }

  // Ends a user session by flushing the session cookie.
  destroy(req, res) {
    req.session.reset();
    res.render("session/delete", {user: {username: "Guest"}});
  }

}

module.exports = exports = new Session();
