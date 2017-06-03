proj4.defs("EPSG:32648", "+proj=utm +zone=48 +datum=WGS84 +units=m+no_defs");
proj4.defs("EPSG:326489", "+proj=tmerc +lat_0=0 +lon_0=108 +k=0.9999 +x_0=500000 +y_0=0 +datum=WGS84 +units=degree +no_defs");
var defaultWidthChart = 22.288050529180964;
var legendChart = false;
var data;
var dataPoints = [];
var source = null;
var tmpSource = null;
var layer = null;
var map = null;
Ext.define('tinh', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'tentinh', type: 'string' },
    ]
});

var storeTinh = Ext.create('Ext.data.Store', {
    model: 'tinh',
    proxy: {
        type: 'ajax',
        url: 'ajax/danhsachtinh',
        reader: {
            type: 'json',
        }
    },
    autoLoad: true
});

Ext.define('nam', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'tennam', type: 'string' },
    ]
});

var storeNam = Ext.create('Ext.data.Store', {
    model: 'nam',
    proxy: {
        type: 'ajax',
        url: 'ajax/danhsachnam',
        reader: {
            type: 'json',
        }
    },
    autoLoad: true
});

Ext.define('admission_type', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'admission_type_name', type: 'string' },
    ]
});

var storeAdmission = Ext.create('Ext.data.Store', {
    model: 'admission_type',
    proxy: {
        type: 'ajax',
        url: 'ajax/admission_type',
        reader: {
            type: 'json',
        }
    },
    autoLoad: true
});


Ext.define('PM.SubmitTKSVTinhThanhFilterForm', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.form-filter',

    getForm: function() {
        return this.getView().getForm();
    },

    onResetClick: function() {
        this.getForm().reset();
    },

    onCompleteClick: function() {
        var loadText = 'Loading... Please wait';
        Ext.getBody().mask(loadText, 'loading');
        var form = Ext.getCmp('form-filter').getForm();
        var field_tinh = form.getValues().field_tinh ? form.getValues().field_tinh : 0;
        var field_nam = form.getValues().field_nam ? form.getValues().field_nam : 0;
        var field_htxt = form.getValues().field_htxt ? form.getValues().field_htxt : 0;
        var field_type_chart = form.getValues().field_type_chart ? form.getValues().field_type_chart : 0;

        Ext.Ajax.request({
            url: 'ajax/field',
            method: "GET",
            async: false,
            params: {
                field_tinh: field_tinh,
                field_nam: field_nam,
                field_htxt: field_htxt,
                field_type_chart: field_type_chart
            },
            success: function(response) {
                if (response.responseText) {
                    data = JSON.parse(response.responseText);
                    if (data[field_tinh].length > 0) {
                        tmpSource = new ol.source.Vector({});
                        source.forEachFeature(function(feature) {
                            var madonvihanhchinh = feature.get('madonvihanhchinhtinh');
                            if (madonvihanhchinh == field_tinh) {
                                tmpSource.addFeature(feature);
                            }
                        });
                        map.getOverlays().clear();
                        layer.setSource(tmpSource);
                        var extent = tmpSource.getExtent();
                        map.getView().fit(extent, map.getSize());
                        map.getView().setZoom(9);
                        setTimeout(function() { Ext.getBody().unmask(); }, 1000);
                    } else {
                        Ext.getBody().unmask();
                        Ext.Msg.alert('Thông báo', 'không có dữ liệu ở tỉnh này');
                    }

                }
            },
            failure: function(response, opts) {
                Ext.Msg.alert('Thông báo', 'không thể tải dữ liệu từ server');
            }
        });

        //Ext.MessageBox.alert('Submitted Values', form);

        // pretty = pretty.join('<br>') +
        //     '<br><br><b>Raw values:</b>' +
        //     '<pre style="overflow:auto; margin-top:0;padding:8px;">' +
        //     Ext.htmlEncode(values) +
        //     '</pre>';

        // Ext.MessageBox.alert('Submitted Values', pretty);
    }

});

Ext.define('PM.TKSVTinhThanhFilterForm', {
    extend: 'Ext.form.Panel',
    xtype: 'form-filter',
    id: 'form-filter',
    controller: 'form-filter',
    title: new Ext.panel.Title({
        text: ' Bộ Lọc',
        style: {
            color: '#157fcc',
        },
        iconCls: 'fa fa-filter'
    }),
    width: '100%',
    frame: true,
    layout: 'form',
    viewModel: {},
    style: {
        'border-left': '3px solid #f5f5f5'
    },
    items: [{
        xtype: 'fieldset',
        layout: 'anchor',
        border: 0,
        items: [{
                xtype: 'combobox',
                width: '100%',
                name: 'field_tinh',
                margin: '0 0 15 0',
                fieldLabel: 'Tỉnh/TP',
                displayField: 'tentinh',
                valueField: 'id',
                store: storeTinh,
            },
            {
                xtype: 'combobox',
                width: '100%',
                name: 'field_nam',
                fieldLabel: 'Năm',
                displayField: 'tennam',
                valueField: 'id',
                margin: '0 0 15 0',
                store: storeNam,
            },
            {
                xtype: 'combobox',
                width: '100%',
                name: 'field_htxt',
                margin: '0 0 15 0',
                fieldLabel: 'HT xét tuyển',
                displayField: 'admission_type_name',
                valueField: 'id',
                store: storeAdmission,
            },
            {
                xtype: 'combobox',
                width: '100%',
                name: 'field_type_chart',
                margin: '0 0 15 0',
                fieldLabel: 'Biểu đồ',
                store: [
                    [1, 'pie'],
                    [2, 'bar'],
                    [3, 'area'],
                ],
            }
        ]
    }],
    buttons: [{
            text: 'Lọc',
            renderTo: Ext.getBody(),
            userCls: 'btn btn-danger',
            handler: 'onCompleteClick',
        },
        {
            text: 'Làm mới',
            renderTo: Ext.getBody(),
            userCls: 'btn btn-primary',
            handler: 'onResetClick'
        }
    ],
});

Ext.define('PM.Notes', {
    extend: 'Ext.form.Panel',
    xtype: 'form-notes',
    title: new Ext.panel.Title({
        text: ' Ghi Chú',
        style: {
            color: '#157fcc',
        },
        iconCls: 'fa fa-sticky-note'
    }),
    width: '100%',
    frame: true,
    layout: 'form',
    viewModel: {},
    style: {
        'border-left': '3px solid #f5f5f5'
    },
    html: '<div id="legend-chart" style="padding: 10px;"><div class="row"><div class="col-md-1" }=""><div class="w3-col m7" style="background-color: #FFA500; height: 15px;width:15px;"></div></div><div class="col-md-10">Năm 2011</div></div><div class="row"><div class="col-md-1" }=""><div class="w3-col m7" style="background-color: #DC143C; height: 15px;width:15px;"></div></div><div class="col-md-10">Năm 2012</div></div><div class="row"><div class="col-md-1" }=""><div class="w3-col m7" style="background-color: #87CEFA; height: 15px;width:15px;"></div></div><div class="col-md-10">Năm 2013</div></div><div class="row"><div class="col-md-1" }=""><div class="w3-col m7" style="background-color: #F0E68C; height: 15px;width:15px;"></div></div><div class="col-md-10">Năm 2014</div></div><div class="row"><div class="col-md-1" }=""><div class="w3-col m7" style="background-color: #00CED1; height: 15px;width:15px;"></div></div><div class="col-md-10">Năm 2015</div></div><div class="row"><div class="col-md-1" }=""><div class="w3-col m7" style="background-color: #FFFF00; height: 15px;width:15px;"></div></div><div class="col-md-10">Năm 2016</div></div></div>',
});

Ext.application({
    name: 'tksvtt',
    launch: function() {
        /*
            DEFINE
        */
        source = new ol.source.Vector({
            url: 'http://localhost/gis/public/data/tksvtt',
            format: new ol.format.GeoJSON({
                defaultDataProjection: 'EPSG:32648'
            })
        });

        function getMaxPoly(polys) {
            var polyObj = [];
            //now need to find which one is the greater and so label only this
            for (var b = 0; b < polys.length; b++) {
                polyObj.push({ poly: polys[b], area: polys[b].getArea() });
            }
            polyObj.sort(function(a, b) { return a.area - b.area });

            return polyObj[polyObj.length - 1].poly;
        }


        Ext.Ajax.request({
            url: 'ajax/data_chart',
            method: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(response) {
                data = JSON.parse(response.responseText);

            },
            failure: function(response, opts) {
                Ext.Msg.alert('Thông báo', 'không thể tải dữ liệu từ server');
            }
        });

        source.once('change', function(evt) {
            source.forEachFeature(function(feature) {
                var madonvihanhchinh = feature.get('madonvihanhchinhtinh');
                if (data[madonvihanhchinh] != null) {
                    dataPoints[madonvihanhchinh] = data[madonvihanhchinh];
                }
            });
        });

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
            var madonvihanhchinh = feature.get('madonvihanhchinhtinh');
            if (dataPoints[madonvihanhchinh].length > 0) {
                var resolution = map.getView().getResolution();
                var zoomlevel = map.getView().getZoom();

                var anchor = document.getElementById('map');
                var element = document.getElementById('chartContainer' + madonvihanhchinh);

                if (element != null) {
                    element.remove();
                }

                anchor.innerHTML = '<div id="chartContainer' + madonvihanhchinh + '"></div>';
                containerPopup = document.getElementById('chartContainer' + madonvihanhchinh);

                var tmp = feature.getGeometry().getExtent();
                var center = ol.extent.getCenter(tmp);

                var base_value;
                if (zoomlevel < 8) {
                    base_value = 1.4;
                } else {
                    base_value = 1.5;
                }
                var size = defaultWidthChart / 5;
                var min_size = size * Math.pow(base_value, zoomlevel);
                var chart_width = min_size;
                var chart_height = min_size;

                if (chart_height > 300) {
                    chart_width = 300;
                    chart_height = 300;
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

                var propertiesChart = {
                    type: "pie",
                    showInLegend: legendChart,
                    dataPoints: dataPoints[madonvihanhchinh],
                    toolTipContent: "<span style='\"'color: {color};'\"'><strong>{label}</strong></span>: {y}%",
                }
                if (min_size > 80) {
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
                chart = new CanvasJS.Chart("chartContainer" + madonvihanhchinh, {
                    title: title_chart,
                    animationEnabled: false,
                    width: chart_width,
                    height: chart_height,
                    backgroundColor: "transparent",
                    data: dataChart
                });
                chart.render();
                var style = new ol.style.Style({});
                return style;
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

        layer = new ol.layer.Vector({
            name: 'Phân bố sinh viên theo tỉnh',
            source: source,
            visible: true,
            style: fstyle
        });

        var group = new ol.layer.Group({
            name: 'Chuyên đề',
            layers: [layer],
            visible: true // true check group or false not check
        });


        var view = new ol.View({
            center: [12000000, 1700000],
            zoom: 8,
            minZoom: 6,
        });

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
            visible: true
        });

        var group_nen = new ol.layer.Group({
            name: 'Bản đồ nền',
            layers: [layer_nen],
            visible: true // true check group or false not check
        });

        map = new ol.Map({
            controls: ol.control.defaults().extend([
                new ol.control.FullScreen()
            ]),
            layers: [group_nen, group],
            target: 'map',
            view: view,
        });

        mapComponent = Ext.create('GeoExt.component.Map', {
            map: map,
        });

        var treeStore = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: map.getLayerGroup()
        });

        var treePanel = Ext.create('Ext.tree.Panel', {
            title: new Ext.panel.Title({
                text: 'Các lớp biểu đồ',
                style: {
                    color: '#157fcc'
                },
                iconCls: 'fa fa-map-marker'
            }),
            style: {
                'border-right': '3px solid #f5f5f5'
            },
            width: '100%',
            frame: true,
            layout: 'form',
            viewModel: {},
            border: 0,

            rootVisible: false,
            store: treeStore,
            listeners: {
                itemclick: function(s, r) {}
            }
        });
        treePanel.getRootNode().expand(true);
        /*
            CONFIG
        */

        Ext.create('Ext.Viewport', {
            layout: 'border',
            items: [{
                    xtype: 'panel',
                    region: 'west',
                    width: '20%',
                    header: false,
                    border: 0,
                    items: [{
                        xtype: 'panel',
                        layout: 'vbox',
                        bodyPadding: 2,
                        margin: 10,
                        border: 0,
                        items: [
                            treePanel
                        ]
                    }]
                }, {
                    xtype: 'panel',
                    region: 'center',
                    width: '60%',
                    border: 0,
                    defaults: {
                        bodyPadding: 5,
                        border: false
                    },
                    items: [
                        mapComponent
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'east',
                    width: '20%',
                    header: false,
                    border: 0,
                    id: "plus-min",
                    items: [{
                        xtype: 'panel',
                        layout: 'vbox',
                        bodyPadding: 2,
                        margin: 0,
                        border: 0,
                        items: [{
                                xtype: 'form-filter',
                                margin: 10,
                                border: 0
                            },
                            { xtype: 'form-notes', margin: 10, border: 0 }
                        ]
                    }]
                }

            ]
        });
    }
});