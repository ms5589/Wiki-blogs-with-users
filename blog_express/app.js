var express = require('express'),
    app = express(),
    fs = require('fs'),
    sessions = require('client-sessions'),
    loadUser = require('./middleware/load_user'),
    noGuests = require('./middleware/no_guests'),
    adminOnly = require('./middleware/admin_only'),
    blockedUser = require('././middleware/block')
    encryption = require('./encryption');
    var data1 = fs.readFileSync('templates/blog/prism.css', {encoding: "utf-8"});
    var data2 = fs.readFileSync('templates/blog/prism.js', {encoding: "utf-8"});
    var img = fs.readFileSync('signup.jpg');
    var img2 = fs.readFileSync('login.jpg');

app.get('/prism.css', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/css'})
    res.end(data1);
});

app.get('/prism.js', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/javascript'})
    res.end(data2);
});

app.get('/signup.jpg', function(req, res){
    res.writeHead(200, {'Content-Type': 'image/*'})
    res.end(img);
});

app.get('/login.jpg', function(req, res){
    res.writeHead(200, {'Content-Type': 'image/*'})
    res.end(img2);
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
app.post('/block',adminOnly, session.block);

// Blog routes
var blog = require('./endpoints/blog');
app.get('/prism.css', blog.prismcss);
app.get('/prism.js', blog.prismjs);
app.get('/blog', blog.index);
app.get('/blog/new', noGuests, blockedUser, blog.new);
app.get('/blog/:id', blog.show);
app.get('/blog/:id/edit',noGuests, blockedUser, blog.edit);
app.post('/blog/:id', blog.change);
app.post('/blog/:id/add',noGuests, blockedUser, blog.add);
app.post('/blog', blockedUser, blog.create);
app.get('/blog/:id/preview', blog.preview);
app.get('/users', adminOnly, blog.users);
app.get('/blog/:id/delete', noGuests, blockedUser, blog.destroy);
app.get('/blog/:id/del', noGuests, blockedUser, blog.del);

// Reservation routes
var reservation = require('./endpoints/reservation');
app.get('/reservation/new', noGuests, reservation.new);

app.listen(8080, () => {
  console.log("Listening on port 8080...");
});
