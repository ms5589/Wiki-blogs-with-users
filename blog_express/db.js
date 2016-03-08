"use strict"

var sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('./database/wiki.sqlite3');

module.exports = exports = db;
