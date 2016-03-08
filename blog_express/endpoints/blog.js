"use strict"

var db = require('../db'),
    formidable = require('formidable');

// A controller for the equipment resource
// This should have methods for all the RESTful actions
class Blog {

  index(req, res) {
    var blog = db.all('SELECT * FROM Post', function(err, blog){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.render('blog/index', {blog: blog, user: req.user});
    });
  }

  show(req, res) {
    var blog = db.get('SELECT * FROM Post WHERE PostId=?', req.params.id, function(err, item){
      if(err) {
        console.error(err);
        return res.sendStatus(400);
      }
      res.render('blog/show', {blog: item, user: req.user});
    });
  }

  new(req, res) {
    res.render('blog/new', {user: req.user});
  }

  create(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('INSERT INTO Post (title, body) values (?,?)',
        fields.title,
        fields.body
      );
      res.redirect('/blog');
    });
  }

  destroy(req, res) {
    db.run('DELETE FROM Post WHERE PostId=?', req.params.id);
    res.redirect('/blog');
  }

  redirect(req, res) {
    res.writeHead(301, {"Content-Type":"text/html", "Location":"/blog"});
    res.end("This page has moved to <a href='/equipment'>Blog</a>");
  }

  autocomplete(req, res) {
    db.all('SELECT DISTINCT title FROM Post WHERE title LIKE ?', req.params.token + '%', function(err, data){
      if(err) {
        console.error(err);
        res.writeHead(400, {"Content-Type":"text/json"});
        res.end("[]");
        return;
      }
      res.writeHead(200, {"Content-Type":"text/json"});
      res.end(JSON.stringify( data.map( function(pair) {return pair.name}) ));
    });
  }
}

module.exports = exports = new Blog();
