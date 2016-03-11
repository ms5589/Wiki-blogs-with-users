"use strict"

// Only users with admin status can continue
// down the pipeline
function blockedUser(req, res, next) {
  if(req.user && req.user.blocked)
  {
    res.writeHead(403, {"Content-Type":"text/html"});
    res.end("Sorry, you no longer have access for requested action!");
  }
  else
  {
    return next();
  }
}
module.exports = exports = blockedUser;
