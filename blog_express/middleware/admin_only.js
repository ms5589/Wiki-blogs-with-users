"use strict"

// Only users with admin status can continue
// down the pipeline
function adminOnly(req, res, next) {
  if(req.user && req.user.admin) return next();
  else
  {
    res.writeHead(403, {"Content-Type":"text/html"});
    res.end("Sorry, Only admin has privileges to access this page!");
  }
}
module.exports = exports = adminOnly;
