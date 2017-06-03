proj4.defs("EPSG:32648", "+proj=utm +zone=48 +datum=WGS84 +units=m+no_defs");
proj4.defs("EPSG:326489", "+proj=tmerc +lat_0=0 +lon_0=108 +k=0.9999 +x_0=500000 +y_0=0 +datum=WGS84 +units=degree +no_defs");

var defaultWidthChart = 22.288050529180964;
var legendChart = false;
var data;

Ext.application({
    name: 'Demo02',
    globals: {
        bgChart: false,
        typeChart: 'pie', //0-default pie, 1-column
        bgChartColor: 'transparent',
        legendChart: false,
        defResolution: 369.1869350009766,
        checkedTKTinhThanh: true,
        zoomToShown: 2,
        defaultWidthChart: 22.288050529180964,
        defaultHeightChart: 22.288050529180964,

        defaultWidthChartDistrict: 3.3118445266356957,
        defaultHeightChartDistrict: 10.624751178914721,
        filterDistrict: false,

        yearsData: [],
        regionData: [],
        statData: [],
        totalStudent: 0,

        receivedofyear: false,
        receivedofregion: false,
        receivedofstat: false,
        receivedofadm: false,
        oneYear: false,

        moveChart: false,

        buildData4Chart: function(region, years, ap, stat) {},
        changeFeature: function() {},
        // initcolorChart: function(number){},
        confTitleChart: function(feature, sizechart, zoomlevel, percent_region) {},
        confAxisXChart: function(sizechart, zoomlevel) {},
        confAxisYChart: function(sizechart, zoomlevel) {}
    },
    launch: function() {

        // Quang Nam - DN - Hue

        var layer_nen = new ol.layer.Tile({
            name: 'Việt Nam',
            source: new ol.source.TileWMS({
                url: 'http://10.8.0.62:8081/geoserver/webgis/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    tiled: true,
                    LAYERS: 'webgis:province1',
                    STYLES: '',
                }
            }),
            visible: false
        });

        var layer_vanson = new ol.layer.Tile({
            name: 'Địa danh vân sơn',
            source: new ol.source.TileWMS({
                url: 'http://10.8.0.62:8081/geoserver/webgis/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    tiled: true,
                    LAYERS: 'webgis:DiaDanhSonVan_Merge1',
                    STYLES: '',
                }
            }),
            visible: false
        });

        var layer_bien = new ol.layer.Tile({
            name: 'Biển Huế - Đà Nẵng - Quảng Nam',
            source: new ol.source.TileWMS({
                url: 'http://10.8.0.62:8081/geoserver/webgis/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    tiled: true,
                    LAYERS: 'Bien3Tinh',
                }
            }),
            visible: false
        });

        var layer_songsuoi = new ol.layer.Tile({
            name: 'Mạng lưới sông suối Quảng Nam - Huế - Đà Nẵng',
            source: new ol.source.TileWMS({
                url: 'http://10.8.0.62:8081/geoserver/webgis/wms',
                params: {
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    tiled: true,
                    LAYERS: 'SongSuoiA3Tinh'
                }
            }),
            visible: false
        });

        var group_nen = new ol.layer.Group({
            name: 'Bản đồ nền',
            layers: [layer_nen, layer_vanson, layer_bien, layer_songsuoi],
            visible: false // true check group or false not check
        });

        // ------------------------------------------------------------------------- ABCD ---------------------------------------------------------

        function getMaxPoly(polys) {
            var polyObj = [];
            //now need to find which one is the greater and so label only this
            for (var b = 0; b < polys.length; b++) {
                polyObj.push({ poly: polys[b], area: polys[b].getArea() });
            }
            polyObj.sort(function(a, b) { return a.area - b.area });

            return polyObj[polyObj.length - 1].poly;
        }

        var maxArea = function(feature) {
            var retPoint;
            if (feature.getGeometry().getType() === 'MultiPolygon') {
                retPoint = getMaxPoly(feature.getGeometry().getPolygons());
            } else if (feature.getGeometry().getType() === 'Polygon') {
                retPoint = feature.getGeometry();
            }
            return retPoint;
        }

        var fstyle = function(feature, resolution) {
            var text = new ol.style.Text({
                text: feature.get('tentinh') || feature.get('diadanh'),
                font: '12px Calibri,sans-serif',
                scale: 1.3,
                fill: new ol.style.Fill({
                    color: 'red'
                }),

            });

            var style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'orange'
                }),

                geometry: maxArea(feature),

                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 0.1
                }),
                text: text
            });
            var scale = 1000 / resolution;
            if (scale <= 0.7) {
                text.setText('');
            } else if (scale >= 1.6) {
                scale = 1.6;
            } else {
                text.setScale(scale);
            }
            return style;
        }

        var layer_vn = new ol.layer.Vector({
            name: 'Bản đồ Việt Nam',
            source: new ol.source.Vector({
                url: 'http://localhost/gis/public/data/vietnam',
                format: new ol.format.GeoJSON({
                    defaultDataProjection: 'EPSG:32648'
                }),
            }),
            style: fstyle,
            visible: false
        });

        // THPT
        var styleIcon = new ol.style.Style({
            image: new ol.style.Icon({
                opacity: 1,
                src: 'http://localhost/gis/public/icons/college-11.svg'
            })
        });
        var vectorLayerTHPT = new ol.layer.Vector({
            name: 'Danh sách trường THPT',
            source: new ol.source.Vector({
                url: 'http://localhost/gis/public/data/tinh',
                format: new ol.format.GeoJSON({
                    defaultDataProjection: 'EPSG:32648'
                }),

            }),
            style: styleIcon,
            visible: false
        });




        var layer_QHD = new ol.layer.Vector({
            name: 'Thống kê danh sách sinh viên 3 tỉnh Quảng Nam - Huế - Đà Nẵng',
            source: new ol.source.Vector({
                url: 'http://localhost/gis/public/data/qhd',
                format: new ol.format.GeoJSON({
                    defaultDataProjection: 'EPSG:326489'
                })
            }),
            visible: true
        });



        var group = new ol.layer.Group({
            name: 'Module',
            layers: [layer_vn, vectorLayerTHPT, layer_QHD],
            visible: true // true check group or false not check
        });



        var view = new ol.View({
            center: [12000000, 1800000],
            zoom: 9,
            minZoom: 8,
            maxZoom: 10
        });

        map = new ol.Map({
            layers: [group, group_nen],
            target: 'map',
            view: view
        });

        Ext.Ajax.request({
            url: 'data/sinhvientheovung',
            method: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(response) {
                data = JSON.parse(response.responseText);
                console.log(data);
            },
            failure: function(response, opts) {
                Ext.Msg.alert('Thông báo', 'không thể tải dữ liệu từ server');
            }
        });


        function styleCanvas(feature, resolution) {

            var zoomlevel = map.getView().getZoom();

            var anchor = document.getElementById('map');
            var madonvihanhchinh = feature.get('madonvihan');
            var element = document.getElementById('chartContainer' + madonvihanhchinh);
            if (element != null) {
                element.remove();
            }

            anchor.innerHTML = '<div id="chartContainer' + madonvihanhchinh + '"></div>';
            containerPopup = document.getElementById('chartContainer' + madonvihanhchinh);
            var tmp = feature.getGeometry().getExtent();
            var center = ol.extent.getCenter(tmp);

            var base_value = 1.5;
            var size = defaultWidthChart / 5;
            var min_size = size * Math.pow(base_value, map.getView().getZoom());
            var chart_width = min_size;
            var chart_height = min_size;

            if (chart_height > 200) {
                chart_width = 200;
                chart_height = 200;
            }
            var title_chart = confTitleChart(feature, min_size, zoomlevel, '');

            var overlayPopup = new ol.Overlay(({
                element: containerPopup,
                autoPan: false,
                // position: center,
                autoPanAnimation: {
                    duration: 250
                },
                offset: [-chart_width / 2, -chart_height / 2],
                positioning: 'center-center',
            }));

            map.addOverlay(overlayPopup);


            feature.set('overlay_id', 'chartContainer' + madonvihanhchinh);
            overlayPopup.setPosition(center);


            var dataPoints = data[madonvihanhchinh];

            var propertiesChart = {
                type: "pie",
                showInLegend: legendChart,
                dataPoints: dataPoints,
                toolTipContent: "<span style='\"'color: {color};'\"'><strong>{label}</strong></span>: {y}%",
            }

            if (min_size > 50) {
                propertiesChart.indexLabel = "{y}";
                propertiesChart.indexLabelFontColor = '#3a3a3a';
                propertiesChart.indexLabelPlacement = 'outside';
                propertiesChart.indexLabelFontFamily = 'Arial,Helvetica,sans-serif';
            } else {
                propertiesChart.indexLabel = "{y}";
                propertiesChart.indexLabelFontColor = 'transparent';
                propertiesChart.indexLabelPlacement = 'inside';
                propertiesChart.indexLabelFontFamily = 'Arial,Helvetica,sans-serif';
            }

            var dataChart = [propertiesChart];

            var chart = new CanvasJS.Chart("chartContainer" + madonvihanhchinh, {
                title: title_chart,
                animationEnabled: false,
                width: chart_width,
                height: chart_height,
                backgroundColor: "transparent",
                data: dataChart
            });
            chart.render();

        }

        function setColor(feature) {
            if (feature.get('madonvihan') == 49) {
                return 'red';
            } else if (feature.get('madonvihan') == 48) {
                return 'green';
            } else {
                return 'yellow';
            }
        }

        var confTitleChart = function(feature, sizechart, zoomlevel, percent_region) {
            var title = {};
            if (sizechart > 80) {
                title = {
                    text: feature.get('diadanh') + ' (' + percent_region + '%)',
                    fontFamily: "Arial,Helvetica,sans-serif",
                    titleFontWeight: "bold"
                };
            }
            return title;
        }

        var confAxisXChart = function(sizechart, zoomlevel) {
            var axisX = {};
            if (sizechart > 200) {
                axisX = {
                    gridThickness: 0,
                    lineThickness: 1,
                    lineColor: 'black',
                    tickColor: 'black',
                    tickThickness: 1,
                    //tickLength: 3,

                    labelFontFamily: 'Arial,Helvetica,sans-serif',
                    labelFontWeight: "normal",
                    labelFontColor: "black",
                };
                if (zoomlevel == 8) {
                    axisX.labelFontSize = 12;
                }
            } else {
                axisX = {
                    gridThickness: 0,
                    lineThickness: 1,
                    lineColor: 'black',
                    tickColor: 'black',
                    tickThickness: 1,
                    tickLength: 3,

                    labelFontFamily: 'Arial,Helvetica,sans-serif',
                    labelFontWeight: "normal",
                    labelFontColor: "black",
                    labelFontSize: 6
                }
                if (sizechart < 80) {
                    axisX = {
                        valueFormatString: " ",
                        gridThickness: 0,
                        tickLength: 0,
                        lineThickness: 1, //0,
                        lineColor: 'black', //"transparent",
                        labelFontColor: 'transparent'
                    }
                }
            }
            return axisX;
        }

        var confAxisYChart = function(sizechart, zoomlevel, maximum) {
            var axisY = {};
            if (sizechart > 200) {
                axisY = {
                    //title:"Sinh viên"
                    gridThickness: 0,
                    lineThickness: 1,
                    lineColor: 'black',
                    tickColor: 'black',
                    tickThickness: 1,
                    //tickLength: 3,

                    labelFontFamily: 'Arial,Helvetica,sans-serif',
                    labelFontWeight: "normal",
                    labelFontColor: "black",
                    maximum: maximum
                };
                if (zoomlevel >= 8) {
                    //axisY.interval = 500;
                }
            } else {
                axisY = {
                    gridThickness: 0,
                    lineThickness: 1,
                    lineColor: 'black',
                    tickColor: 'black',
                    tickThickness: 1,
                    tickLength: 3,

                    labelFontFamily: 'Arial,Helvetica,sans-serif',
                    labelFontWeight: "normal",
                    labelFontColor: "black",
                    labelFontSize: 6,
                    maximum: maximum
                }
                if (sizechart < 80) {
                    axisY = {
                        valueFormatString: " ",
                        gridThickness: 0,
                        tickLength: 0,

                        lineThickness: 1,
                        lineColor: 'black',
                        maximum: maximum
                    }
                }
            }
            return axisY;
        }


        var qhdstyle = function(feature, resolution) {
            styleCanvas(feature, resolution);
            var style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: setColor(feature)
                }),
                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 1
                }),
            });
            return style;
        }

        layer_QHD.setStyle(qhdstyle);


        mapComponent = Ext.create('GeoExt.component.Map', {
            map: map,
        });


        // left panel

        treeStore = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: map.getLayerGroup()
        });

        treePanel = Ext.create('Ext.tree.Panel', {
            title: 'Chọn module',
            viewConfig: {
                plugins: { ptype: 'treeviewdragdrop' }
            },
            store: treeStore,
            rootVisible: false,
            flex: 1,
            border: false,
            listeners: {
                itemclick: function(s, r) {}
            }
        });


        // right panel

        var right_panel = Ext.create('Ext.panel.Panel', {
            title: 'Right panel',
            border: false
        });



        Ext.create('Ext.Viewport', {
            layout: 'border',
            items: [{
                    xtype: 'panel',
                    region: 'west',
                    width: '20%',
                    defaults: {
                        bodyPadding: 5,
                        border: false
                    },
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        treePanel
                    ]
                },
                {
                    region: 'center',
                    width: '80%',
                    height: '100%',
                    defaults: {
                        bodyPadding: 5,
                        border: false
                    },
                    items: [
                        mapComponent
                    ]
                }
            ]
        });
    }
});