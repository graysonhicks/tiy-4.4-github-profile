
window.jQuery = $ = require('jquery');
var handlebars = require('handlebars');
var _ = require('underscore');
var bootstrap = require('bootstrap-sass/assets/javascripts/bootstrap.min.js');

console.log(bootstrap);

var username = "graysonhicks";
var requri   = 'https://api.github.com/users/'+username;
var repouri  = 'https://api.github.com/users/'+username+'/repos';
var repositories;

$.getJSON(requri, function(json){
  user = json;
  console.log(user);
});
