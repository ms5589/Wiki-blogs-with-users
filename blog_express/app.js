var express = require('express'),
    app = express(),
    fs = require('fs'),
    sessions = require('client-sessions'),
    loadUser = require('./middleware/load_user'),
    noGuests = require('./middleware/no_guests'),
    adminOnly = require('./middleware/admin_only'),
    encryption = require('./encryption');
    var data1 = fs.readFileSync('templates/blog/prism.css', {encoding: "utf-8"});
    var data2 = fs.readFileSync('templates/blog/prism.js', {encoding: "utf-8"});

app.get('/prism.js', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/javascript'})
    res.end(data2);
});

app.get('/prism.css', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/css'})
    res.end(data1);
});

// Enable template engine
app.set('view engine', 'ejs');
app.set('views', './templates');

// Enable sessions
app.use(sessions({
  cookieName: 'session',
  secret: 'somerandomstring',
  duration: 24*60*60*1000,
  activeDuration: 1000*60*5
}));

// Load the user (if there is one)
app.use(loadUser);

// Serve static files
app.use(express.static('public'));

// Login routes
var session = require('./endpoints/session');
app.get('/login', session.new);
app.post('/login', session.create);
app.get('/signup', session.sign);
app.post('/signup', session.signup);
app.get('/logout', session.destroy);

// Blog routes
var blog = require('./endpoints/blog');
app.get('/blog', blog.index);
app.get('/blog/new', noGuests, blog.new);
app.get('/blog/:id', blog.show);
app.get('/blog/:id/edit',noGuests, blog.edit);
app.post('/blog/:id', blog.change);
app.post('/blog/:id/add',noGuests, blog.add);
app.post('/blog', blog.create);
app.get('/blog/:id/preview', blog.preview);
app.get('/users', adminOnly, blog.users);
app.get('/blog/:id/delete', noGuests, blog.destroy);
app.get('/blog/:id/del', noGuests, blog.del);

// Reservation routes
var reservation = require('./endpoints/reservation');
app.get('/reservation/new', noGuests, reservation.new);

app.listen(9090, () => {
  console.log("Listening on port 9090...");
});
