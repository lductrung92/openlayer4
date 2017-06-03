var format = 'image/png';
proj4.defs("EPSG:32648", "+proj=utm +zone=48 +datum=WGS84 +units=m+no_defs");
var content = document.getElementById('content');

var source_vn = new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/provn/wms',
    params: {
        'FORMAT': format,
        'VERSION': '1.1.1',
        STYLES: '',
        LAYERS: 'provn:province',
        tiled: true
    }

});

vietnam = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://localhost:8080/geoserver/provn/wms',
        params: {
            'FORMAT': format,
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'provn:province',
        }
    })
});

var layer_vn = new ol.layer.Tile({
    source: source_vn
});

var view = new ol.View({
    center: [12200000, 1870000],
    zoom: 6
});


// ABC
var earthquakeFill = new ol.style.Fill({
    color: 'rgba(255, 153, 0, 0.8)'
});
var earthquakeStroke = new ol.style.Stroke({
    color: 'rgba(255, 204, 0, 0.2)',
    width: 1
});
var textFill = new ol.style.Fill({
    color: '#fff'
});
var textStroke = new ol.style.Stroke({
    color: 'rgba(0, 0, 0, 0.6)',
    width: 3
});
var invisibleFill = new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.01)'
});

function createEarthquakeStyle(feature) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it
    // from the Placemark's name instead.
    var name = feature.get('name');
    var magnitude = parseFloat(name);
    var radius = 5 + 20 * (magnitude - 5);

    return new ol.style.Style({
        geometry: feature.getGeometry(),
        image: new ol.style.RegularShape({
            radius1: radius,
            radius2: 3,
            points: 5,
            angle: Math.PI,
            fill: earthquakeFill,
            stroke: earthquakeStroke
        })
    });
}

var maxFeatureCount, vector;

function calculateClusterInfo(resolution) {
    maxFeatureCount = 0;
    var features = vector.getSource().getFeatures();
    var feature, radius;
    for (var i = features.length - 1; i >= 0; --i) {
        feature = features[i];
        var originalFeatures = feature.get('features');
        var extent = ol.extent.createEmpty();
        var j, jj;
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
            ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
        }
        maxFeatureCount = Math.max(maxFeatureCount, jj);
        radius = 0.25 * (ol.extent.getWidth(extent) + ol.extent.getHeight(extent)) /
            resolution;
        feature.set('radius', radius);
    }
}

var currentResolution;

function styleFunction(feature, resolution) {
    if (resolution != currentResolution) {
        calculateClusterInfo(resolution);
        currentResolution = resolution;
    }
    var style;
    var size = feature.get('features').length;
    if (size > 1) {
        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: feature.get('radius'),
                fill: new ol.style.Fill({
                    color: [255, 153, 0, Math.min(0.8, 0.4 + (size / maxFeatureCount))]
                })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: textFill,
                stroke: textStroke
            })
        });
    } else {
        var originalFeature = feature.get('features')[0];
        style = createEarthquakeStyle(originalFeature);
    }
    return style;
}

function selectStyleFunction(feature) {
    var styles = [new ol.style.Style({
        image: new ol.style.Circle({
            radius: feature.get('radius'),
            fill: invisibleFill
        })
    })];
    return styles;
}

vector = new ol.layer.Vector({
    source: new ol.source.Cluster({
        distance: 40,
        source: new ol.source.Vector({
            url: 'http://localhost/gis/public/data/tinh',
            format: new ol.format.GeoJSON({
                defaultDataProjection: 'EPSG:32648'
            })
        })
    }),
    style: styleFunction
});



// ABC


var styleIcon = new ol.style.Style({
    image: new ol.style.Icon({
        opacity: 1,
        src: 'http://localhost/gis/public/icons/college-11.svg'
    })
});
var vectorLayerTHPT = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'http://localhost/gis/public/data/tinh',
        format: new ol.format.GeoJSON({
            defaultDataProjection: 'EPSG:32648'
        }),

    }),
    style: styleIcon
});

var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});

var openSeaMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM({})
});

var map = new ol.Map({
    controls: new ol.control.defaults({ attribution: false }).extend([mousePositionControl]),
    interactions: ol.interaction.defaults().extend([new ol.interaction.Select({
        condition: function(evt) {
            return evt.originalEvent.type == 'mousemove' ||
                evt.type == 'singleclick';
        },
        style: selectStyleFunction
    })]),
    layers: [openSeaMapLayer, layer_vn, vectorLayerTHPT],
    view: view,
    target: 'map'
});




var item_truong;

Ext.application({
    name: 'Viet Nam Que Huong Toi',
    launch: function() {
        mapComponent = Ext.create('GeoExt.component.Map', {
            map: map,
        });



        map.on('singleclick', function(evt) {

            document.getElementById('info').innerHTML = "Loading... please wait...";
            var view = map.getView();
            var viewResolution = view.getResolution();
            var source = vietnam.getSource();
            var url = source.getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
            if (url) {
                Ext.Ajax.request({
                    url: url,
                    method: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    params: "danang",
                    success: function(response) {
                        var content = "";
                        var obj = JSON.parse(response.responseText);
                        var n = obj["features"];
                        for (var i = 0; i < n.length; i++) {
                            var feature = n[i];
                            var featureAttr = feature["properties"];
                            content += "<br />Tên tỉnh: " + featureAttr["TENTINH"] +
                                "<br />Mã ĐVHC: " + featureAttr["MADVHC"] +
                                "<br />Area: " + featureAttr["SHAPE_Area"] +
                                "<br />Leng: " + featureAttr["SHAPE_Leng"];
                        }
                        $("#info").html(content);
                    },

                    failure: function(response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }
        });

        map.on("click", function(e) {
            var c = '';
            jsonObj = [];
            var unit_id;
            map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                if (feature.get("recruitment_source_unit_id")) {
                    unit_id = feature.get("recruitment_source_unit_id");
                    $.ajax({
                        url: 'thongtintruong/' + unit_id,
                        type: 'GET',
                        success: function(data) {
                            var obj = JSON.parse(data);
                            if (obj["thongtin"].length > 0) {
                                if (obj["thongtin"][0]) {
                                    c = '<br />Tên Trường: ' + obj["thongtin"][0]["ten_truong"] +
                                        '<br />Tên Đường: ' + obj["thongtin"][0]["duong"] +
                                        '<br />Thành phố: ' + obj["thongtin"][0]["thanh_pho"] +
                                        '<div id="chartContainer" style="height: 300px; width: 100%;"></div>';

                                    for (var i = 0; i < obj["data"].length; i++) {
                                        item = {};
                                        item["y"] = obj["data"][i]["count"];
                                        item["indexLabel"] = obj["data"][i]["nam"];
                                        jsonObj.push(item);
                                    }
                                }
                            }
                            content.innerHTML = c;
                            if ($("#chartContainer").length) {
                                var chart = new CanvasJS.Chart("chartContainer", {
                                    title: {
                                        text: "Số lượng sinh viên qua các năm"
                                    },
                                    legend: {
                                        maxWidth: 350,
                                        itemWidth: 120
                                    },
                                    data: [{
                                        type: "pie",
                                        showInLegend: true,
                                        legendText: "{indexLabel}",
                                        dataPoints: jsonObj
                                    }]
                                });
                                chart.render();
                            }
                        },
                        error: function() {

                        }
                    });
                    return;
                }
            })

        });

        Ext.define('thpt', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'id', type: 'string' },
                { name: 'tentruong', type: 'string' },
            ]
        });

        var myStore = Ext.create('Ext.data.Store', {
            model: 'thpt',
            proxy: {
                type: 'ajax',
                url: 'danhsachtinh',
                reader: {
                    type: 'json',
                }
            },
            autoLoad: true
        });
        var viewForm = Ext.create('Ext.form.Panel', {
            title: 'Lọc theo tỉnh',
            bodyPadding: 5,
            defaults: {
                xtype: 'combobox',
                listeners: {
                    select: function(ele, rec, idx) {
                        var value = this.getValue(); // getRawValue();
                        vectorLayerTHPT.setSource(new ol.source.Vector({
                            url: 'http://localhost/gis/public/data/tinh/' + value,
                            format: new ol.format.GeoJSON({
                                defaultDataProjection: 'EPSG:32648'
                            }),
                        }));
                    }
                }
            },
            items: [{
                fieldLabel: 'tentruong',
                displayField: 'tentruong',
                store: myStore,
                valueField: 'id'
            }]
        });

        var description = Ext.create('Ext.panel.Panel', {
            contentEl: 'description',
            title: 'Description',
        });

        var info_school = Ext.create('Ext.panel.Panel', {
            contentEl: 'content',
            title: 'Thông tin trường',
            height: 450,
        });

        var info = Ext.create('Ext.panel.Panel', {
            contentEl: 'info',
            title: 'Thông tin tỉnh',
            height: 300,
        });


        Ext.create('Ext.Viewport', {
            layout: 'border',
            items: [
                mapComponent, {
                    region: 'east',
                    width: 300,
                    defaults: {
                        bodyPadding: 5,
                        border: false
                    },
                    items: [
                        viewForm, description, info_school, info
                    ]
                },

            ]
        });

    }
});