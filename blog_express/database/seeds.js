var sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('wiki.sqlite3'),
    encryption = require('../encryption');

// Create the database schema and populate
db.serialize(function() {

  // Create the users table
  db.run("CREATE TABLE if not exists users (id INTEGER PRIMARY KEY, username TEXT UNIQUE  COLLATE NOCASE, admin BOOLEAN, blocked BOOLEAN, password_digest TEXT, salt TEXT)");
  // Create a default user
  var salt = encryption.salt();
   db.run("INSERT INTO users (username, admin, blocked, password_digest, salt) values (?,?,?,?,?)",
    'admin',
    true,
    false,
    encryption.digest('123456' + salt),
    salt
  );

  db.each("SELECT * FROM users", function(err, row){
    if(err) return console.error(err);

  });


  db.run("CREATE TABLE if not exists Post(postId INTEGER PRIMARY KEY, title VARCHAR(25) NOT NULL, body TEXT NOT NULL)");
  db.run("CREATE TABLE if not exists Comment(comntId INTEGER PRIMARY KEY, postid INTEGER NOT NULL, body TEXT, FOREIGN KEY(postid) REFERENCES Post(postId))");

  for(var i=1;i<6;i++){
  console.log(i);
  db.run("INSERT INTO Post (title, body) VALUES ('Title "+i+" ', 'Body of post "+i+" ')");
  db.run("INSERT INTO Comment (postid, body) VALUES (1, 'Comment number "+i+" of comment 1')");
}

  // Log contents of equipment table to the console
  db.each("SELECT * FROM users", function(err, row){
    if(err) return console.error(err);
    console.log(row);
  });

});
