// Requires
window.jQuery = $ = require('jquery');
var handlebars = require('handlebars');
var _ = require('underscore');
var bootstrap = require('bootstrap-sass/assets/javascripts/bootstrap.min.js');
var moment = require('moment');
var githubtoken;
// = require('./githubtoken.js').token; removed for gh-pages
//
// AJAX
//
var username = "graysonhicks";
var userUrl = function (){
  return 'https://api.github.com/users/' + username;
};
var repoUrl = function (){
  return 'https://api.github.com/users/' + username + '/repos';
};
var orgUrl = function(){
  return 'https://api.github.com/users/' + username + '/orgs';
};
var orgJSON = [];

// if(typeof(githubtoken) !== "undefined"){
//   $.ajaxSetup({
//     headers: {
//       'Authorization': 'token ' + githubtoken,
//     }
//   });
// }

pageLoad();

function pageLoad(){
  getUserData();
  getUserRepos();
  getOrgData();
}

function getUserData(){
  $.getJSON(userUrl(), buildHeader);
  $.getJSON(userUrl(), buildSidebar);
  $.getJSON(userUrl(), buildRepoHeader);
}

function getOrgData(){
  $.getJSON(orgUrl(), setOrgJSON);
}

function setOrgJSON(json){

  orgJSON = json;

  return orgJSON;
}

function getUserRepos(){
  $.getJSON(repoUrl(), buildRepoList);
 }

//
// OAUTH
//
//
// $.get("https://github.com/login/oauth/authorize", function(data){
//   var code = window.location.href.match(/\?code=(.*)/)[1];
// });
//
// $.getJSON('http://localhost:9999/authenticate/'+code, function(data) {
//  console.log(data.token);
// });

//
// functions
//

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
    json.pushed_at = moment(formattedDate).startOf('minute').fromNow();
    return json;
  });
  return json;
}

$("#user-search-form").submit(newUserInputHandler);

function newUserInputHandler(event){
  event.preventDefault();
  console.log(username);
  username = $("#header-search-input").val();
  console.log(username);
  pageLoad();
}

function searchReposButtonHandler(event){
  event.preventDefault();
  $.getJSON(repoUrl(), searchRepos);
}

function searchRepos(json){
  var searchTerm = $('#repo-search-field').val();
  json = _.filter(json, function(repo){
    var checkName = repo.name.indexOf(searchTerm) != -1;
    var checkLanguage = repo.language == searchTerm;
    var checkDesc = repo.description.indexOf(searchTerm) != -1;
    return (checkName || checkLanguage || checkDesc);
  });
  $.getJSON(userUrl(), buildRepoHeader);
  buildRepoList(json);
}

  // FIlter Handlers
function allReposFilterHandler(event){
  event.preventDefault();
  $(".repo-nav-bar-list-links").removeClass("active");
  $(this).toggleClass("active");
  $.getJSON(repoUrl(), allReposFilter);
}

function privateReposFilterHandler(event){
  event.preventDefault();
  $(".repo-nav-bar-list-links").removeClass("active");
  $(this).toggleClass("active");
  $.getJSON(repoUrl(), privateReposFilter);
}

function publicReposFilterHandler(event){
  event.preventDefault();
  $(".repo-nav-bar-list-links").removeClass("active");
  $(this).toggleClass("active");
  $.getJSON(repoUrl(), publicReposFilter);
}

function sourceReposFilterHandler(event){
  event.preventDefault();
  $(".repo-nav-bar-list-links").removeClass("active");
  $(this).toggleClass("active");
  $.getJSON(repoUrl(), sourceReposFilter);
}

function forkReposFilterHandler(event){
  event.preventDefault();
  $(".repo-nav-bar-list-links").removeClass("active");
  $(this).toggleClass("active");
  $.getJSON(repoUrl(), forkReposFilter);
}

function mirrorsReposFilterHandler(event){
  event.preventDefault();
  $(".repo-nav-bar-list-links").removeClass("active");
  $(this).toggleClass("active");
  $.getJSON(repoUrl(), mirrorsReposFilter);
}
  // Filter Functions

function allReposFilter(repoData){
  buildRepoList(json);
}

function privateReposFilter(repoData){
  json = _.filter(repoData, function(repo){
    return repo.private;
  });
  buildRepoList(json);
}

function publicReposFilter(repoData){
  json = _.filter(repoData, function(repo){
    return !repo.private;
  });
  buildRepoList(json);
}

function sourceReposFilter(repoData){
  json = _.filter(repoData, function(repo){
    return !repo.fork;
  });
  buildRepoList(json);
}

function forkReposFilter(repoData){
  json = _.filter(repoData, function(repo){
    return repo.fork;
  });
  buildRepoList(json);
}

function mirrorsReposFilter(repoData){
  json = _.filter(repoData, function(repo){
    return repo.mirror_url;
  });
  buildRepoList(json);
}

//
// TEMPLATES
//

function buildHeader(json){

  var headerAvatarDropdownSource = $("#header-nav-avatar-and-dropdown").html();
  var headerAvatarDropdownTemplate = handlebars.compile(headerAvatarDropdownSource);
  var headerAvatarDropdownRenderedTemplate = headerAvatarDropdownTemplate(json);

  $('.header-icon-menu').html(headerAvatarDropdownRenderedTemplate);
}

function buildSidebar(json){

  json.created_at = getDate(json);
  console.log(orgJSON);
  var sidebarSource = $("#sidebar-content-template").html();
  var sidebarTemplate = handlebars.compile(sidebarSource);
  var sidebarRenderedTemplate = sidebarTemplate({
      "json": json,
      "orgJSON": orgJSON
  });


  $('.sidebar-content-container').html(sidebarRenderedTemplate);
}

function buildRepoHeader(json){

  var RepoHeaderSource = $("#repo-nav-template").html();
  var RepoHeaderTemplate = handlebars.compile(RepoHeaderSource);
  var RepoHeaderRenderedTemplate = RepoHeaderTemplate(json);

  $('#repo-nav-container').html(RepoHeaderRenderedTemplate);
  $('#repo-search-button').click(searchReposButtonHandler);
  $('#all-repos-button').click(allReposFilterHandler);
  $('#public-repos-button').click(publicReposFilterHandler);
  $('#private-repos-button').click(privateReposFilterHandler);
  $('#sources-repos-button').click(sourceReposFilterHandler);
  $('#fork-repos-button').click(forkReposFilterHandler);
  $('#mirrors-repos-button').click(mirrorsReposFilterHandler);

}

function buildRepoList(json){
  console.log(json);
  json = mostRecent(json);
  var RepoListSource = $("#repo-list-template").html();
  var RepoListTemplate = handlebars.compile(RepoListSource);
  var RepoListRenderedTemplate = RepoListTemplate({'repo': json});

  $('#repo-list-container').html(RepoListRenderedTemplate);
}
