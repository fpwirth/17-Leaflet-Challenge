//API endpoint for earthquake, faults and oil basins data
var earthquakeurl='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
var faultsurl='https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
var oilbasinsurl='static/data/world oil basins.json';

//Get data and genrate map with features layers
d3.json(earthquakeurl,function(earthquakedata){
  d3.json(faultsurl,function(faultdata){
    d3.json(oilbasinsurl,function(oilbasindata){
      var earthquakes=L.geoJSON(earthquakedata.features,{
        onEachFeature:addPopup,
        pointToLayer:createmarker});
      var faults=L.geoJSON(faultdata,{
        style:{color:'magenta'}});
      var oilbasins=L.geoJSON(oilbasindata,{
        style:{color:'black',
          fillColor:'black',
          fillOpacity:.4,
          weight:.2}});
      createMap(earthquakes,faults,oilbasins);})})});

//Function to generate marker colors
function choosecolor(mag){
  switch(true){
    case (mag<=1):
      return 'Green';
    case (mag<=2):
      return 'greenyellow';
    case (mag<=3):
      return 'yellow';
    case (mag<=4):
      return 'orange';
    case (mag<=5):
      return 'orangered';
    case (mag>5):
      return 'darkred';
    default:
      return 'darkred'};}

//Function to generate circle markers that are sized according to magnitude of earthquakes
function createmarker(feature,location){
  var options={
    radius:feature.properties.mag*5,
    color:choosecolor(feature.properties.mag),
    fillColor:choosecolor(feature.properties.mag),
    weight:1,
    fillOpacity:.6}
  return L.circleMarker(location,options);}

//Function to add popup info to each earthquake marker
function addPopup(feature,layer){
  return layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<hr>${Date(feature.properties.time)}</p>`);}

//Function to receive a layer of markers and plot them on a map.
function createMap(earthquakes,faults,oilbasins){
  //Create basemap layers and basemap object
  var streetmap=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom:18,
    id:'mapbox.streets',
    accessToken:API_KEY});
  var satellitemap=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom:18,
    id:'mapbox.satellite',
    accessToken:API_KEY});
  var comicmap=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom:18,
    id:'mapbox.comic',
    accessToken:API_KEY});
  var outdoorsmap=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom:18,
    id:'mapbox.outdoors',
    accessToken:API_KEY});
  var basemaps={
    'Street Map':streetmap,
    'Satellite Map':satellitemap,
    'Comic Map':comicmap,
    'Outdoors Map':outdoorsmap};
  //Create feature objects
  var overlaymaps={
    'Earthquakes':earthquakes,
    'Fault Lines':faults,
    'Oil Basins':oilbasins};
  //Create map loading streetmap, earthquakes and fault layers on initialization
  var earthquakemap=L.map('map',{
    center:[37.09, -95.71],
    zoom:5,
    layers:[streetmap,earthquakes,faults]});
  //Create marker legend
  var legend=L.control({position:'bottomright'});
  legend.onAdd=function(){
    var div=L.DomUtil.create('div','info legend'),
      magnitude=[0,1,2,3,4,5];
      for (var i=0;i<magnitude.length;i++){
          div.innerHTML+='<i style="background:'+choosecolor(magnitude[i+1])+'"></i> '+magnitude[i]+(magnitude[i+1]?'&ndash;'+magnitude[i+1]+'<br>':'+');}
      return div;};
  legend.addTo(earthquakemap);
  //Create layer control
  L.control.layers(basemaps,overlaymaps,{
    collapsed:false})
    .addTo(earthquakemap)};