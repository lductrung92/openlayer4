/*
    @chuyen de sinh vien trung hoc pho thong
*/
Ext.define('PM.TKSVTinhThanhFilterForm', {
    extend: 'Ext.FormPanel',
    alias: 'widget.TKSVTinhThanhFilterForm',
    initComponent: function() {
        context = this;
        this.buttons = context.createButtons();
        this.map = this.initialConfig.map;
        this.border = 0;
        this.layersource = this.initialConfig.layersource;
        this.sourceLines = this.initialConfig.sourceLines;
        this.title = APP.lang.region.east.filterTitle;
        this.bodyStyle = { "padding": "15px" };
        this.id = "filterform";
        var layersource = this.layersource;
        this.tools = [{
            type: 'pin',
            handler: function() {}
        }];
        this.callParent(arguments);
        this.createSpecialItems(context);
    },
    createSpecialItems: function(context) {
        Ext.define('Tinh', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'madonvihanhchinhtinh', type: 'string' },
                { name: 'diadanh', type: 'string' }

            ]
        });
        Ext.define('Years', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'academic_intake_id', type: 'string' },
                { name: 'application_end_date', type: 'string' }
            ]
        });
        Ext.define('typets', {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'admission_type_id', type: 'string' },
                { name: 'admission_type_name', type: 'string' }
            ]
        });

        this.add({
            fieldLabel: APP.lang.region.east.filterForm.provinceLabel,
            labelSeparator: '',
            xtype: 'combobox',
            name: 'tinh_id',
            id: 'tinh_id',
            labelAlign: 'top',
            anchor: '100%',
            displayField: 'diadanh',
            valueField: 'madonvihanhchinhtinh',
            queryMode: 'local',
            store: new Ext.data.Store({
                model: 'Tinh',
                proxy: {
                    type: 'ajax',
                    url: './api/v2/hctinh',
                    reader: {
                        type: 'json',
                        root: 'tinhs'
                    }
                },
                listeners: {
                    load: function(store) {
                        store.insert(0, {
                            madonvihanhchinhtinh: "0",
                            diadanh: 'Toàn Tỉnh/TP',
                        });
                        Ext.getCmp('tinh_id').setValue(0);
                    }
                },
                autoLoad: true
            }),
            listeners: {
                select: function(combo, record, index) {
                    Ext.getCmp('huyen_id').setValue('');
                    var huyenCombo = Ext.getCmp('huyen_id');
                    if (record.data.madonvihanhchinhtinh != 0) {
                        Ext.define('Huyen', {
                            extend: 'Ext.data.Model',
                            fields: [
                                { name: 'madonvihanhchinhhuyen', type: 'string' },
                                { name: 'diadanh', type: 'string' }

                            ]
                        });
                        storeHuyen = new Ext.data.Store({
                            model: 'Huyen',
                            proxy: {
                                type: 'ajax',
                                url: './api/v2/hchuyen/' + record.data.madonvihanhchinhtinh,
                                reader: {
                                    type: 'json',
                                    root: 'huyens'
                                }
                            },
                            listeners: {
                                load: function(store) {
                                    store.insert(0, {
                                        madonvihanhchinhhuyen: "0",
                                        diadanh: 'Toàn Quận/Huyện',
                                    });
                                }
                            },
                            autoLoad: true
                        });
                        Ext.getCmp('huyen_id').bindStore(storeHuyen);
                        huyenCombo.setDisabled(false);
                    } else {
                        huyenCombo.setDisabled(true);
                    }
                }
            }
        }, {
            fieldLabel: APP.lang.region.east.filterForm.districtLabel,
            labelSeparator: '',
            xtype: 'combobox',
            name: 'huyen_id',
            id: 'huyen_id',
            disabled: true,
            labelAlign: 'top',
            //emptyText: 'Select District',
            anchor: '100%',
            displayField: 'diadanh',
            valueField: 'madonvihanhchinhhuyen',
            queryMode: 'local',
            listeners: {
                select: function(combo, record, index) {

                }
            }
        }, {
            fieldLabel: APP.lang.region.east.filterForm.yearLabel,
            labelSeparator: '',
            xtype: 'combobox',
            name: 'nam_ts[]',
            multiSelect: true,
            forceSelection: true,
            labelAlign: 'top',
            anchor: '100%',
            displayField: 'academic_timespan_name',
            valueField: 'timespan_id',
            queryMode: 'local',
            store: new Ext.data.Store({
                model: 'Years',
                proxy: {
                    type: 'ajax',
                    url: './api/v2/getTimeSpan',
                    reader: {
                        type: 'json',
                        root: 'years'
                    }
                },
                autoLoad: true
            }),
        }, {
            fieldLabel: APP.lang.region.east.filterForm.admtypeLabel,
            labelSeparator: '',
            xtype: 'combobox',
            name: 'type_ts[]',
            id: 'type_ts',
            labelAlign: 'top',
            anchor: '100%',
            //multiSelect: true, 
            displayField: 'admission_type_name',
            valueField: 'admission_type_id',
            queryMode: 'local',
            store: new Ext.data.Store({
                model: 'typets',
                proxy: {
                    type: 'ajax',
                    url: './api/v2/getListAdmType',
                    reader: {
                        type: 'json',
                        root: 'typets'
                    }
                },
                listeners: {
                    load: function(store) {
                        store.insert(0, {
                            admission_type_id: "0",
                            admission_type_name: 'Tất cả',
                        });
                        Ext.getCmp('type_ts').setValue(0);
                    }
                },
                autoLoad: true
            })
        }, {
            fieldLabel: APP.lang.region.east.filterForm.chartLabel,
            labelSeparator: '',
            labelAlign: 'top',
            xtype: 'combobox',
            id: 'bieudo',
            name: 'bieudo',
            anchor: '100%',
            queryMode: 'local',
            store: ['column', 'line', 'stepLine', 'spline', 'stepArea', 'area', 'splineArea', 'bar', 'pie',
                'doughnut', 'stackedColumn', 'stackedArea', 'stackedBar'
            ],
            listeners: {
                render: function(combo, record, index) {
                    combo.setRawValue('pie');
                },
                select: function(combo, record, index) {
                    webgis_duytan.app.globals.typeChart = record.data.field1;
                }
            }
        });
    },
    createButtons: function() {
        var layersource = this.layersource;
        var sourceLines = this.sourceLines;
        var context = this;
        var buttons = [{
            text: APP.lang.region.east.filterBtn,
            text: APP.lang.region.east.filterBtn,
            cls: 'filter-button',
            // handler: function() {
            //     if (this.up('form').getForm().isValid()) {
            //         if (this.up('form').getForm().getFieldValues().huyen_id != null) {
            //             webgis_duytan.app.globals.filterDistrict = true;
            //         } else {
            //             webgis_duytan.app.globals.filterDistrict = false;
            //         }
            //         var variables = this.up('form').getForm().getFieldValues();
            //         if (variables.tinh_id == null || variables.tinh_id == 0) {
            //             urlArea = './api/v2/geotinhs';
            //         } else if (variables.huyen_id == 0) {
            //             urlArea = './api/v2/geohuyens/' + variables.tinh_id;
            //         } else if (variables.huyen_id == null) {
            //             urlArea = './api/v2/geotinhs/' + variables.tinh_id;
            //         } else {
            //             urlArea = './api/v2/geohuyens/' + variables.tinh_id + '/' + variables.huyen_id;
            //         } //  End
            //         var sourceArea = null;
            //         if (variables.tinh_id == null || variables.tinh_id == 0) {
            //             sourceArea = webgis_duytan.app.globals.mapSourceArea;
            //         } else {
            //             sourceArea = new ol.source.Vector({
            //                 url: urlArea,
            //                 format: new ol.format.GeoJSON({
            //                     defaultDataProjection: 'PRJAPP'
            //                 }),
            //             });
            //             webgis_duytan.app.globals.mapLayerArea.getSource().clear();
            //         }
            //         webgis_duytan.app.globals.mapLayerArea.setSource(sourceArea);
            //         webgis_duytan.app.globals.drap.clearSource();

            //         //
            //         Ext.Ajax.request({
            //             url: 'api/v2/getDataTKTinhThanh',
            //             method: 'GET',
            //             params: {
            //                 tinh_id: variables.tinh_id,
            //                 huyen_id: variables.huyen_id,
            //                 "nam_ts[]": variables['nam_ts[]'],
            //                 "type_ts[]": variables['type_ts[]']
            //             },
            //             success: function(response) {
            //                 var text = response.responseText;
            //                 var objs = Ext.decode(text, true);
            //                 var data = objs.data;
            //                 var totalStudent = objs.total_students;
            //                 webgis_duytan.app.globals.statData = data;
            //                 webgis_duytan.app.globals.totalStudent = totalStudent;
            //                 webgis_duytan.app.globals.receivedofstat = true;
            //                 webgis_duytan.app.globals.changeFeature();
            //             }
            //         });
            //         Ext.Ajax.request({
            //             url: 'api/v2/getDataTKTinhThanh4Years',
            //             method: 'GET',
            //             params: {
            //                 tinh_id: variables.tinh_id,
            //                 huyen_id: variables.huyen_id,
            //                 "nam_ts[]": variables['nam_ts[]'],
            //                 "type_ts[]": variables['type_ts[]']
            //             },
            //             success: function(response) {
            //                 var text = response.responseText;
            //                 var objs = Ext.decode(text, true);
            //                 var data = objs.data;
            //                 webgis_duytan.app.globals.yearsData = data;
            //                 webgis_duytan.app.globals.receivedofyear = true;
            //                 webgis_duytan.app.globals.changeFeature();
            //             }
            //         });
            //         if (variables['nam_ts[]'].length == 1) {
            //             webgis_duytan.app.globals.oneYear = true;
            //             Ext.Ajax.request({
            //                 url: './api/v2/getListAdmTypeTK',
            //                 method: 'GET',
            //                 params: {
            //                     tinh_id: variables.tinh_id,
            //                     huyen_id: variables.huyen_id,
            //                     "type_ts[]": variables['type_ts[]']
            //                 },
            //                 success: function(response) {
            //                     var text = response.responseText;
            //                     var objs = Ext.decode(text, true);
            //                     var data = objs.data;
            //                     webgis_duytan.app.globals.admData = data;
            //                     webgis_duytan.app.globals.receivedofadm = true;
            //                     webgis_duytan.app.globals.changeFeature();
            //                 }
            //             });
            //         } else {
            //             webgis_duytan.app.globals.oneYear = false;
            //         }
            //         this.up('form').getForm().submit({
            //             url: 'api/v2/getDataTKTinhThanh4Re',
            //             method: "GET",
            //             params: {

            //             },
            //             waitMsg: 'Processing...',
            //             success: function(fp, o) {
            //                 context.destroyPopup(context.layersource);
            //                 layersource.clear();
            //                 sourceLines.clear();
            //                 var data = o.result.data;
            //                 var format = new ol.format.GeoJSON();
            //                 var features = format.readFeatures(data, {
            //                     dataProjection: 'PRJAPP',
            //                     featureProjection: 'EPSG:32648',
            //                 });
            //                 webgis_duytan.app.globals.regionData = features;
            //                 webgis_duytan.app.globals.receivedofregion = true;
            //                 webgis_duytan.app.globals.changeFeature();
            //                 var extent = layersource.getExtent();
            //                 if (extent[0] != "Infinity") {
            //                     //olMap.getView().setCenter(ol.extent.getCenter(extent));
            //                     if (features.length > 1) {
            //                         olMap.getView().fit(extent, olMap.getSize());
            //                     } else {
            //                         olMap.getView().setCenter(ol.extent.getCenter(extent));
            //                         if (olMap.getView().getZoom() < 6) {
            //                             olMap.getView().setZoom(6);
            //                         }
            //                     }
            //                 } else {

            //                 }
            //             },
            //             failure: function() {
            //                 //Ext.Msg.alert(APP.lang.region.others.titleMsg, APP.lang.region.others.msgRegProblem);
            //                 console.log(APP.lang.region.others.msgRegProblem);
            //             }
            //         });
            //     } else {}
            // }
        }, {
            text: APP.lang.region.east.resetBtn,
            handler: function() {
                this.up('form').getForm().reset();
                Ext.getCmp('huyen_id').disable();
            }
        }]
        return buttons;
    },
    destroyPopup: function(layersource) {
        // olMap.getOverlays().clear();
    }
});