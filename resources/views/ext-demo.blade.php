<!DOCTYPE html>
<html>
   <head>
    <link href="assets/ext-6.0.1/build/classic/theme-crisp/resources/theme-crisp-all.css" rel="stylesheet" />
    <link rel="stylesheet" href="assets/openlayers3/ol.css" type="text/css" />
    <script type="text/javascript" src="assets/ext-6.0.1/build/ext-all.js"></script>
    <script src="assets/openlayers3/ol.js"></script>
    <script src="assets/proj4js/lib/proj4.js"></script>
    <script src="https://code.jquery.com/jquery-1.12.3.min.js" type="text/javascript"></script>
    <script src="assets/canvasjs/canvasjs.min.js" type="text/javascript"></script>
   </head>
   <body>
        <div id="info">&nbsp;</div>
        <div id="description">
                <div id="mouse-position"></div>
                <div id="video">
                    <iframe width="100%" height="150" src="https://www.youtube.com/embed/wJjDD8F-WJs" frameborder="0" allowfullscreen></iframe>
                </div>
        </div>
        <div id="content"></div>
        
        <script>
            Ext.Loader.setConfig({
                enabled: true,
                paths: {
                    'GeoExt': 'assets/geoext3/src/'
                }
            });
        </script>
        <script src="demo/map.js"></script>
   </body>
</html>

