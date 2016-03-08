var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    loadUser = require('./middleware/load_user'),
    noGuests = require('./middleware/no_guests'),
    adminOnly = require('./middleware/admin_only'),
    encryption = require('./encryption');

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
app.get('/logout', session.destroy);

// Equipment routes
var blog = require('./endpoints/blog');
app.get('/blog', blog.index);
app.get('/blog/new', blog.new);
app.get('/blog/:id', blog.show);
app.post('/blog', blog.create);
app.get('/blog/:id/delete', blog.destroy);

// Reservation routes
var reservation = require('./endpoints/reservation');
app.get('/reservation/new', noGuests, reservation.new);

app.listen(9090, () => {
  console.log("Listening on port 9090...");
});
