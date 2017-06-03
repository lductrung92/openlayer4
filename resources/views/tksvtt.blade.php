<!DOCTYPE html>
<html>
   <head>
    <base href="{{ asset('/') }}" />
    <title>Thống kê sinh viên theo tỉnh thành</title>
    <link href="assets/ext-6.0.1/build/classic/theme-crisp/resources/theme-crisp-all.css" rel="stylesheet" />
    <link rel="stylesheet" href="assets/openlayers3/ol.css" type="text/css" />
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <script type="text/javascript" src="assets/ext-6.0.1/build/ext-all.js"></script>
    <script src="assets/openlayers3/ol.js"></script>
    <script src="assets/proj4js/lib/proj4.js"></script>
    <script src="https://code.jquery.com/jquery-1.12.3.min.js" type="text/javascript"></script>
    <script src="assets/canvasjs/canvasjs.min.js" type="text/javascript"></script>
    <style type="text/css">
        .canvasjs-chart-credit {
            display: none;
        }
        .fa{
            margin-right: 5px;
            color: #157fcc;
        }

        .x-panel-header-default-vertical{
             cursor: pointer;
        }
        #plus-min-placeholder-innerCt{
            display: none;
        }

        .x-toolbar-footer {
             padding-right: 12px;
             padding-bottom: <1></1>5px;
             background-color: #ffffff;
        }
        .ext-el-mask { color:gray; cursor:default; opacity:0.6; background-color:grey; }

        .ext-el-mask-msg div {
        background-color: #EEEEEE;
        border-color: #A3BAD9;
        color: #222222;
        font: 1.2em tahoma,arial,helvetica,sans-serif;
        }

        .ext-el-mask-msg {
        padding: 10px;

        }
    </style>
   </head>
   <body>
        <div id="control"></div>
        <div id="map"></div>
        <script>
            Ext.Loader.setConfig({
                enabled: true,
                paths: {
                    'GeoExt': 'assets/geoext3/src/'
                }
            });
        </script>
        <script src="demo/tksvtt.js"></script>
        <script>
            $(".x-splitter-vertical").css({'margin': '3px'})
        </script>
   </body>
</html>

