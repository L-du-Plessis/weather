var latitude;
var longitude;
var panel;

function main_panel() {
  // display main panel
  panel = $.jsPanel({
    theme:       'info',
    draggable:   'disabled',
    resizable:   'disabled',
    contentSize: { width: 320, height: 300 },
    content: function(){
        $(this).css('padding', '30px');
        return $("<div id='wait'><img src='wait.gif'/><br>Loading...</div>").css({padding:'30px', textAlign:'center'});  // display loader
    },            
    headerTitle: 'Weather App',
    headerControls: { controls: 'none' },
    footerToolbar: [
        {
            item:     "<button type='button'></button>",
            btnclass: "btn btn-success",
            btntext:  "Refresh",
            callback: function(){
                panel.contentReload();
                display_weather();
            }
        }
    ],
    callback: function(){
        display_weather();
    }
  });        
}

function get_location(_callback) {
  if ("geolocation" in navigator) {
    // try to get user's current location using getCurrentPosition() method (latitude and longitude)
    navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
    
    function foundLocation( position ) { 
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      _callback();
    }
    function noLocation() {  // error handler: location not found
      display_alert("Could not find location");
    }
  } else {  // error handler: geolocation not available 
    display_alert("Browser doesn't support geolocation!");
  }
}

function display_weather() { 
  get_location(function() {
    // try to get weather information using the jQuery getJSON method
    $.getJSON( "http://api.openweathermap.org/data/2.5/weather", { lat: latitude, lon: longitude, format: "json", units: "metric", APPID: "53f9d8e4213222cf517d86dc406d67fc" } )
      .done(function( data ) {
        // display weather information
        var info = 
          "<div class='well'>" + 
          "  <div class='row bigfont'>" + 
          "    <div class='col-xs-5'>Country: </div><div class='col-xs-7 text-success'>" + data.sys.country + "</div>" + 
          "    <div class='col-xs-5'>City: </div><div class='col-xs-7 text-success'>" + data.name + "</div>" + 
          "  </div><br>" + 
          "  <div class='row'>" + 
          "    <div class='col-xs-5'>Temperature: </div><div class='col-xs-7 bigfont text-primary'>" + data.main.temp + " °C </div>" + 
          "    <div class='col-xs-5'>Maximum: </div><div class='col-xs-7'>" + data.main.temp_max + " °C </div>" + 
          "    <div class='col-xs-5'>Minimum: </div><div class='col-xs-7'>" + data.main.temp_min + " °C </div>" + 
          "    <div class='col-xs-12 text-capitalize text-primary bigfont'>" + data.weather[0].description + "</div>" + 
          "  </div>" + 
          "</div>";
          
        $("#wait").css("display", "none");
        panel.content.append( info );
      })
      .fail(function( jqxhr, textStatus, error ) {  // error handler: request failed
        var err = textStatus + ", " + error;
        
        display_alert("Request Failed: " + err);
      });
  });
}

function display_alert(message) {
  // display alert message
  var info = "<div class='alert alert-danger'>" + message + "</div>";
  
  $("#wait").css("display", "none");
  panel.content.append( info );
}