// Requires
window.jQuery = $ = require('jquery');
var handlebars = require('handlebars');
var _ = require('underscore');
var bootstrap = require('bootstrap-sass/assets/javascripts/bootstrap.min.js');
var moment = require('moment');
var githubtoken = require('./githubtoken.js').token;

// AJAX

var username = "graysonhicks";
var userUrl   = 'https://api.github.com/users/' + username;
var repoUrl  = 'https://api.github.com/users/' + username + '/repos';

// Functions

if(typeof(githubtoken) !== "undefined"){
  $.ajaxSetup({
    headers: {
      'Authorization': 'token ' + githubtoken,
    }
  });
}

pageLoad();

function pageLoad(){
  getUserData();
  getUserRepos();
}

function getUserData(){
  $.getJSON(userUrl, buildHeader);
  $.getJSON(userUrl, buildSidebar);
  $.getJSON(userUrl, buildRepoHeader);
}

function getUserRepos(){
  $.getJSON(repoUrl, buildRepoList);
 }

function getDate(json){
  var createdDate = new Date(json.created_at);
  var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";
  var monthAbbreviation = month[createdDate.getMonth()];
  var dayCreated = createdDate.getDate();
  var yearCreated = createdDate.getFullYear();
  createdDate = monthAbbreviation + " " + dayCreated + ", " + yearCreated;
  return createdDate;
}

function mostRecent(json){
  json = _.sortBy(json, function(json) {
    return json.pushed_at;
  });
  json.reverse();

  json = _.map(json, function(json, index){
    var formattedDate = new Date(json.pushed_at);
    json.pushed_at = moment(formattedDate).startOf('hour').fromNow();
    return json;
  });
  return json;
}

// TEMPLATES

function buildHeader(json){

  var headerAvatarDropdownSource = $("#header-nav-avatar-and-dropdown").html();
  var headerAvatarDropdownTemplate = handlebars.compile(headerAvatarDropdownSource);
  var headerAvatarDropdownRenderedTemplate = headerAvatarDropdownTemplate(json);

  $('.header-icon-menu').append(headerAvatarDropdownRenderedTemplate);
}

function buildSidebar(json){
  console.log(json);
  json.created_at = getDate(json);
  var sidebarSource = $("#sidebar-content-template").html();
  var sidebarTemplate = handlebars.compile(sidebarSource);
  var sidebarRenderedTemplate = sidebarTemplate(json);

  $('.sidebar-content-container').html(sidebarRenderedTemplate);
}

function buildRepoHeader(json){

  var RepoHeaderSource = $("#repo-nav-template").html();
  var RepoHeaderTemplate = handlebars.compile(RepoHeaderSource);
  var RepoHeaderRenderedTemplate = RepoHeaderTemplate(json);

  $('#repo-nav-container').html(RepoHeaderRenderedTemplate);
}

function buildRepoList(json){
  console.log(json);
  json = mostRecent(json);
  var RepoListSource = $("#repo-list-template").html();
  var RepoListTemplate = handlebars.compile(RepoListSource);
  var RepoListRenderedTemplate = RepoListTemplate({'repo': json});

  $('#repo-list-container').html(RepoListRenderedTemplate);
}
