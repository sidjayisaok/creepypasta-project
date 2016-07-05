$(document).ready(function(){

 //array for the buttons
 var categories =["The Blair Witch Project", "Succubus", "Santa Muerte", "Mermaid", "Moroi", "La Llorona", "Bell Witch", "Gorgon", "Loch Ness Monster", "Bigfoot", "Xana", "Medusa", "Banshee", "Patasola", "Deer Woman", "Acheri", "Werewoman"];
  //function to create buttons
  function makeButtons(){
    for(var i=0; i < categories.length; i++){
      var buttons = $("<button>");
      buttons.addClass('btn-submit');
      buttons.data('let', categories[i]);
      buttons.text(categories[i]);
      $("#buttons").append(buttons);
  };
  }
  //create buttons with this function
  makeButtons();

  //function to make buttons return APIs

    $("#buttons").unbind().on('click', 'button', function(){
      var search = $(this).text();

      //first API: OMDb
      var imdbURL = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&r=json";
      //OMDb API call
      $.ajax({
        url: imdbURL,
        method: 'GET'
      })
      .done(function(response) {
        //clear fields
        $("#movieTitle").empty();
        $("#movieActors").empty();
        $("#movieRated").empty();
        $("#movieRelease").empty();
        $("#movieRuntime").empty();
        //add fields
        $("#movieTitle").html(response.Title);
        $("#movieActors").html(response.Actors);
        $("#movieRated").html(response.Rated);
        $("#movieRelease").html(response.Released);
        $("#movieRuntime").html(response.Runtime);

        //poster div
        var imageUrl = response.Poster;
        var img = $("<img>");

        //last minute fly by night hack to fix broken pictures
        if (search){
          var errorPic = "http://i.imgur.com/fWLfmKp.jpg";
          img.error(function(){
            img.attr('src', errorPic);
          })
          .attr('src', imageUrl);
          img.attr('alt', 'poster');
          $("#moviePoster").empty();
          $('#moviePoster').prepend(img);
        }

        else if (search === "Patasola"){
          var PataPic = "https://upload.wikimedia.org/wikipedia/commons/f/f5/Patasola.jpg";
          img.attr('src', PataPic);
          $("#moviePoster").empty();
          $('#moviePoster').prepend(img);

        }

        else if (search === "Deer Woman"){
          var DeerPic = "http://img09.deviantart.net/3729/i/2012/024/0/8/the_deer_woman_by_closol-d4nimnz.jpg";
          img.attr('src', DeerPic);
          $("#moviePoster").empty();
          $('#moviePoster').prepend(img);
        }

        else if (search === "Acheri"){
          var AcheriPic = "https://upload.wikimedia.org/wikipedia/commons/3/35/Acheri.jpg";
          img.attr('src', AcheriPic);
          $("#moviePoster").empty();
          $('#moviePoster').prepend(img);
        }

        else if (search === "Werewoman"){
          var WerePic = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Broadside_of_Werewolves_from_J%C3%BClich%2C_Germany._Georg_Kress%2C_1591..jpg/350px-Broadside_of_Werewolves_from_J%C3%BClich%2C_Germany._Georg_Kress%2C_1591..jpg";
          img.attr('src', WerePic);
          $("#moviePoster").empty();
          $('#moviePoster').prepend(img);
        }

        else{
          return false;
        }

        });

        //wikipedia API implementation
        var wikiURL ="http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + search + "&callback=?";
          //wikipedia API call
          $.ajax({
              method: "GET",
              url: wikiURL,
              contentType: "application/json; charset=utf-8",
              async: false,
              dataType: "jsonp",
              success: function (data, textStatus, jqXHR) {
                $("#movieWiki").empty();
                  var markup = data.parse.text["*"];
                  var div = $("<div>").html(markup);
                  // remove links as they will not work
                  div.find('a').each(function() {
                 $(this).replaceWith($(this).html());
               });
              // remove any references
              div.find('sup').remove();
              // remove cite error
              div.find('.mw-ext-cite-error').remove();
              //final wiki data scrape
              $("#movieWiki").html($(div).find('p'));
              //in case wikipedia returns too little info, default to IMDB
              if($("#movieWiki").text().length <= 100) {
                $("#movieWiki").empty();
                  $.ajax({
                    url: imdbURL,
                    method: 'GET'
                  })
                  .done(function(response){
                    $("#movieWiki").html(response.Plot);
                  });
              }
            },
            //for any error messages
            error: function (errorMessage) {
              }
            });

        //giphy api call
        var giphyURL = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + search;
          $.ajax({
            url: giphyURL,
            method: 'GET'
          })
          .done(function(response) {
            var imageMP4 = response.data.image_mp4_url
            $('#moviePoster').on('click', 'img', function(){
              var giphyVideo = $("<video>");
              var p = $("<p>");
              giphyVideo.attr('src', imageMP4);
              giphyVideo.attr('type', 'video/MP4');
              giphyVideo.prop('autoplay', true);
              giphyVideo.prop('loop', true);
              giphyVideo.prop('controls', true);
              $("#moviePoster").empty();
              $("#moviePoster").prepend(p);
              $('#moviePoster').prepend(giphyVideo);
            });
          });
    return false;
    });


  //function to execute the buttons
  $(document).on('click', 'input');
});
