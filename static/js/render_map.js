var map;

// MODEL OF OUR MAP
var mapModel ={
    markers :[],
    listOfItemsInsideNav: [],
    collectionOfMarkersWithId: [],
    mapConfigs: {
        initial_location: {lat: -23.550270, lng: -46.636672},
        zoom: 8
    }
};

// CONTROLLER OF OUR MAP
var mapController = {
    init: function() {
        view.init();
    },
    getInitialLocation: function() {
        return mapModel.mapConfigs.initial_location;
    },
    getZoom: function(){
        return mapModel.mapConfigs.zoom;
    },
    getlistOfItemsInsideNav: function() {
        var listOfItemsInsideNav = mapModel.listOfItemsInsideNav;
        return listOfItemsInsideNav;
    },
    getcollectionOfMarkersWithId: function() {
        var collectionOfMarkersWithId = mapModel.collectionOfMarkersWithId;
        return collectionOfMarkersWithId;
    },
    getMarkers: function() {
        var markers = mapModel.markers;
        return markers;
    },
    setcollectionOfMarkersWithId : function(collectionOfMarkersWithId) {
        mapModel.collectionOfMarkersWithId = collectionOfMarkersWithId;
    },
    resetcollectionOfMarkersWithId: function (){
        mapModel.collectionOfMarkersWithId = [];
    },
    resetMarkers: function() {
        mapModel.markers = [];
    },
    clearMap: function() {
        for (var i = 0; i < mapModel.markers.length; i++ ) mapModel.markers[i].setMap(null);
    },
    refreshMap: function(){
        view.renderMarkers();
    }
}

// VIEW OF OUR MAP
var view = {
    init: function() {
        this.mapContainer = document.getElementById('map');
        this.render();
    },

    render: function(){

        var mapContainer = this.mapContainer;

        var initial_location = mapController.getInitialLocation();
        
        var zoom = mapController.getZoom();
        
        var listOfItemsInsideNav = mapController.getlistOfItemsInsideNav();

        map = new google.maps.Map(mapContainer, {
            center: initial_location,
            zoom: zoom
        });

        if (listOfItemsInsideNav.length > 0 ) this.renderMarkers();
    },

    // THIS IS THE FUNCTION THAT WILL RENDER THE MARKERS ON OUR MAP
    renderMarkers: function() {

        mapController.resetMarkers();

        var markersWithoutId = mapController.getMarkers();
        
        var markers = [];

        var locations = mapController.getlistOfItemsInsideNav();

        var bounds = new google.maps.LatLngBounds();

        var largeInfoWindow = new google.maps.InfoWindow();

        mapController.resetcollectionOfMarkersWithId();

        var collectionOfMarkersWithId = mapController.getcollectionOfMarkersWithId();
        
        for(var i =0; i < locations.length; i++) {
            
            var id = '#' + locations[i].id;

            var position = locations[i].location;
            
            var title = locations[i].name;
                        
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                map: map,
                animation: google.maps.Animation.DROP,
                id: 1
            });

            markers.push(marker);

            markersWithoutId.push(marker);
            
            bounds.extend(marker.position);
            
            marker.addListener('click', function(){
                populateInfoWindow(this, largeInfoWindow);
            });

            collectionOfMarkersWithId.push( {
                id: id,
                marker: marker});

            // THIS CREATE INFOWINDOWS FOR EACH MARKER
            var populateInfoWindow = function(marker, infoWindow){
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                  } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                  }
                if(infoWindow.marker != marker) {
                    
                    infoWindow.setContent('');
                    
                    infoWindow.marker = marker;

                    infoWindow.addListener('closeClick', function(){
                        
                        infoWindow.setMarker(null);
                    });
                    
                    // THIS CREATE A NEW STREETVIEW INSTANCE
                    var streetViewService = new google.maps.StreetViewService();
                    
                    var radius = 50;
                    
                    function getStreetView(data, status) {
                        
                        if(status == google.maps.StreetViewStatus.OK) {
                            
                            var nearStreetViewLocation = data.location.latLng;
                            
                            var heading = google.maps.geometry.spherical.computeHeading (nearStreetViewLocation, marker.position);
                            
                            infoWindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                            
                            var panoramaOptions = {
                                position: nearStreetViewLocation,
                                pov: {
                                    heading: heading,
                                    pitch: 30
                                }
                            }
                            
                            var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
                        } else {
                            infoWindow.setContent('<div>' + marker.title + '</div>' +'<div>No Street View Found</div>');
                        }
                    }
                    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                    
                    infoWindow.open(map, marker);

                }
            }
        }
        mapController.setcollectionOfMarkersWithId(collectionOfMarkersWithId);
        map.fitBounds(bounds);
    }
}

// THIS IS THE MODEL FOR OU PLACES
function MyFavoritePlace( id, name, location, articles) {
    self = this;
    self.id = id;
    self.name = name;
    self.location = location;
    self.articles = articles;
}

// THIS IS THE VIEWMODEL FOR HTML
function ListViewModel(){
    var self = this;

    self.defaultHtml = '<a href="#" id="btn-menu" onclick="openMenu();">Menu</a>';
    
    self.filterValue = ko.observable('');

    self.places = ko.observableArray([
            new MyFavoritePlace(1, "Dubai, United Arab Emirates", {lat: 25.238317, lng: 55.272560}, []),
            new MyFavoritePlace(2, "Dublin, Ireland", {lat:  53.350418, lng: -6.256612 }, []),
            new MyFavoritePlace(3, "Madrid, Spain", {lat:  40.432754, lng: -3.701094 }, []),
            new MyFavoritePlace(4, "Barcelona, Spain", {lat: 41.386752, lng: 2.170314 }, []),
            new MyFavoritePlace(5, "CN Tower, Canada", {lat:  43.642729, lng: -79.387743 }, []),
            new MyFavoritePlace(6, "Moraine Lake, Canada", {lat:  51.322650, lng: -116.186015 }, []),
            new MyFavoritePlace(7, "Gramado, Brazil", {lat:  -29.373412, lng: -50.876430 }, []),
            new MyFavoritePlace(8, "Burbank, USA", {lat: 49.342805, lng: -123.114882 }, []),
            new MyFavoritePlace(9, "Horseshoe Falls, Canada", {lat:  43.079570, lng: -79.075073 }, []),
            new MyFavoritePlace(10, "Lake Louise, Canada", {lat:  51.429395, lng: -116.175532 }, []),
            new MyFavoritePlace(11, "Skylon Tower, Canada", {lat: 43.085422, lng: -79.079026 }, []),
            new MyFavoritePlace(12, "Sunshine Village, Canada", {lat: 51.115341, lng: -115.761881 }, []),
            new MyFavoritePlace(13, "Suomenlinna - Helsinki, Finland", {lat: 60.148162, lng: 24.987430  }, []),
            new MyFavoritePlace(14, "Milford Sound, New Zeland", {lat:-44.636473, lng: 167.898747}, [])
        ]);

    self.setDefaultHtml = function() {
        $('#header-map').removeClass('scroll-text');
        $('#header-map').addClass('header-map');
        $('#header-map').html(self.defaultHtml);}
    
    self.getItemArticles = function(item) {
        var location = item.name;
        $.ajax({
            type: 'GET',
            processData: false,
            url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + location + '&api-key=pdcnycvY5voepeY1l4ec0nVQVZWcUeNz',
            success: function(data){
                console.log('Success');
                var html = '<h4>What NYTimes is talking about this place:</h4>';
                for(var i = 0; i < data.response.docs.length; i++) {
                    if(i == 3) break;
                    console.log('<p>' + data.response.docs[i].snippet + '</p><br/>');
                    html+='<p>' + data.response.docs[i].snippet + '</p><br/>';
                }
                $('#header-map').html(html);
                $('#header-map').removeClass('header-map');
                $('#header-map').addClass('scroll-text');

            },
            error: function() {
                $('#header-map').html('Error while trying to fetch data');
            }
        });
    }
    self.openInfoWindow = function(element){

        // CLOSE ALL OPENED INFOWINDOWS
        for (var j = 0; j < mapModel.markers.length; j++ ) new google.maps.event.trigger(mapModel.markers[j], 'closeClick' );

        var item = mapModel.collectionOfMarkersWithId.filter(item => item.id === '#' + element.id);
   
        new google.maps.event.trigger(item[0].marker, 'click' );
    }

    self.clearMap = function() {
        for (var i = 0; i < mapModel.markers.length; i++ ) mapModel.markers[i].setMap(null);
    }
    // THIS FILTER THE LIST BASED ON THE INPUT DATA
    self.filteredList = ko.computed(function (){

        
        self.clearMap();
        
        var filter = self.filterValue();
        
        // HOLD THE OBJECTS IN WHICH YOUR NAMES HAS THE STRING DATA FROM INPUT
        var newValues = self.places().filter(place => place.name.includes(filter));
        
        // SET THE ALCTUAL LIST OF DATA
        mapModel.listOfItemsInsideNav = newValues;
        
        // REFRESH THE MARKERS
        if(map) mapController.refreshMap();

        // RETURN THE NEW LIST TO THE HTML
        return newValues;
    }, this);

}

ko.applyBindings(new ListViewModel());