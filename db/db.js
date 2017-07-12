var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://simon:simon@ds127492.mlab.com:27492/simon');
var sha256 = require('sha256');

var now = new Date();
var users = db.collection("users");
var posts = db.collection("posts");
var comments = db.collection("comments");

function init_db(){
  users.insert({username:"simonwallin", password: sha256("sw0049sw"), email:"simonwallin1@gmail.com", admin: true});
};

//init_db();
users.ensureIndex( { "email": 1 }, { unique: true } );

exports.users = users;
exports.db = db;
