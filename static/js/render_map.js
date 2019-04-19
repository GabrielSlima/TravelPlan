var map;

// MODEL OF OUR MAP
var mapModel ={
    actualMapMarkers: [],
    collectionOfMarkers: [],
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

    getInitialLocation: function(){
        return mapModel.mapConfigs.initial_location;
    },

    getZoom: function(){
        return mapModel.mapConfigs.zoom;
    },
    getActualMapMarkers: function(){
        var actualMapMarkers = mapModel.actualMapMarkers;
        return actualMapMarkers;
    },
    getCollectionOfMarkers: function() {
        var collectionOfMarkers = mapModel.collectionOfMarkers;
        return collectionOfMarkers;
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
        
        var actualMapMarkers = mapController.getActualMapMarkers();

        map = new google.maps.Map(mapContainer, {
            center: initial_location,
            zoom: zoom
        });

        if (actualMapMarkers.length > 0 ) this.renderMarkers();
    },

    // THIS IS THE FUNCTION THAT WILL RENDER THE MARKERS ON OUR MAP
    renderMarkers: function() {
        var markers = [];
        
        var locations = mapController.getActualMapMarkers();
        
        var bounds = new google.maps.LatLngBounds();

        var largeInfoWindow = new google.maps.InfoWindow();

        var collectionOfMarkers = mapController.getCollectionOfMarkers();

        var id;

        for(var i =0; i < locations.length; i++) {

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
            
            bounds.extend(marker.position);
            
            marker.addListener('click', function(){
                populateInfoWindow(this, largeInfoWindow);
            });

            id =  markers.length - 1;
            collectionOfMarkers.push( {
                id: '#' + id,
                marker: marker});

            $(collectionOfMarkers[markers.length-1].id).on('click', function(event) {
                new google.maps.event.trigger(collectionOfMarkers[event.currentTarget.id].marker, 'click' );
            });
            // THIS CREATE INFOWINDOWS FOR EACH MARKER
            var populateInfoWindow = function(marker, infoWindow){
                
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

        map.fitBounds(bounds);
    }
}

// THIS IS THE MODEL FOR OU PLACES
function MyFavoritePlace(name, location) {
    self = this;
    self.name = name;
    self.location = location;
}

// THIS IS THE VIEWMODEL FOR HTML
function ListViewModel(){
    var self = this;
    self.filterValue = ko.observable('');
    self.places = ko.observableArray([
            new MyFavoritePlace("Dubai, United Arab Emirates", {lat: 25.238317, lng: 55.272560}),
            new MyFavoritePlace("Dublin, Ireland", {lat:  53.350418, lng: -6.256612 }),
            new MyFavoritePlace("Madrid, Spain", {lat:  40.432754, lng: -3.701094 }),
            new MyFavoritePlace("Barcelona, Spain", {lat: 41.386752, lng: 2.170314 }),
            new MyFavoritePlace("CN Tower, Canada", {lat:  43.642729, lng: -79.387743 }),
            new MyFavoritePlace("Moraine Lake, Canada", {lat:  51.322650, lng: -116.186015 }),
            new MyFavoritePlace("Gramado, Brazil", {lat:  -29.373412, lng: -50.876430 }),
            new MyFavoritePlace("Burbank, USA", {lat: 49.342805, lng: -123.114882 }),
            new MyFavoritePlace("Horseshoe Falls, Canada", {lat:  43.079570, lng: -79.075073 }),
            new MyFavoritePlace("Lake Louise, Canada", {lat:  51.429395, lng: -116.175532 }),
            new MyFavoritePlace("Skylon Tower, Canada", {lat: 43.085422, lng: -79.079026 }),
            new MyFavoritePlace("Sunshine Village, Canada", {lat: 51.115341, lng: -115.761881 }),
            new MyFavoritePlace("Suomenlinna - Helsinki, Finland", {lat: 60.148162, lng: 24.987430  }),
            new MyFavoritePlace("Milford Sound, New Zeland", {lat:-44.636473, lng: 167.898747})
        ]);

    // THIS FILTER THE LIST BASED ON THE INPUT DATA
    self.filteredList = ko.computed(function (){

        var filter = self.filterValue();
        
        // HOLD THE OBJECTS IN WHICH YOUR NAMES HAS THE STRING DATA FROM INPUT
        var newValues = self.places().filter(place => place.name.includes(filter));
        
        // SET THE ALCTUAL LIST OF DATA
        mapModel.actualMapMarkers = newValues;
        
        // REFRESH THE MARKERS
        if(map) mapController.refreshMap();

        // RETURN THE NEW LIST TO THE HTML
        return newValues;
    }, this);

}

ko.applyBindings(new ListViewModel());