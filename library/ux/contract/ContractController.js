//@charset UTF-8
Ext.define( 'Smart.ux.contract.ContractController', {
    extend: 'Smart.app.ViewControllerBase',

    init: function() {
        var me = this;

        me.listen({
            store: {
                '#additivetable': {
                    load: 'onLoadStore',
                    update: 'onUpdateStore'
                }
            }
        });

    },

    routes: {
        'contractview/:id': {
            action: 'getAdditiveId'
        }
    },

    url: '../iContract/business/Calls/contract.php',

    //routes ===================================>>

    getAdditiveId: function (id) {
        var app = Smart.moduleApp.getController('App'),
            record = Ext.getStore('additive').findRecord('id',id);

        app.onMainPageView({xtype: 'contractview', xdata: record});
    },

    //routes ===================================>>

    fetchField: function (search, button) {
        Ext.getStore('contract').setParams({
            query: search.getValue()
        }).load();
    },

    onAfterRenderView: function (panel) {
        var me = this,
            form = panel.down('form');

        if(!panel.xdata) return false;

        me.showAdditiveData();
        form.loadRecord(panel.xdata);
    },

    insertViewNew: function () {
        Ext.widget('contractnew');
    },

    onContractNew: function () {
        Ext.widget('contractnew');
    },

    onSubUnitTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        var me = this;

        me.getView().down('button[name=updateView]').setDisabled(newCard.pageIndex != 2);

        switch(newCard.pageIndex) {
            case 0:
                me.showAdditiveData();
                break;
            case 1:
                me.showContractUnit();
                break;
            case 2:
                me.showContractData();
                break;
        }
    },

    onAdditiveItem: function (gridpanel, id) {
        var me = this,
            actId = id.substr(7,3),
            store = gridpanel.store,
            model = store.findRecord('contractnumber',id.substr(0,7),0,false,true,true);

        switch(id.length) {
            case 9:
                me.additiveItemView(model,actId);
                break;
            case 10:
                me.additiveItemEdit(model,actId);
                break;
        }
    },

    additiveItemView: function (model,actId) {
        var me = this,
            store = Ext.create('iContract.store.contract.Additive'),
            additive = parseInt(actId) == 1 ? Ext.widget('additivenew') : Ext.widget('additivelog');

        store.setParams({
            query: model.get('id'),
            method: parseInt(actId) == 1 ? 'selectNew' : 'selectLog'
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                additive.show(null, function () {
                    if(parseInt(actId) == 1) {
                        additive.down('form').loadRecord(record);
                        additive.down('form').down('hiddenfield[name=id]').reset();
                        additive.down('form').down('hiddenfield[name=contractid]').setValue(model.get('id'));
                    }
                });
            }
        });
    },

    additiveItemEdit: function (model,actId) {
        var me = this,
            store = Ext.getStore('additive') || Ext.create('iContract.store.contract.Additive');

        store.setParams({
            method: 'selectCode',
            additivenumber: actId,
            contractid: model.get('id')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                me.redirectTo( 'contractview/' + record.get('id'));
            }
        });

    },

    onAdditiveTableEdit: function (editor, context, eOpts) {
        var me = this,
            record = context.record,
            store = editor.grid.store;

        if ( record.get('isactive') == false ) record.set('id','');

        store.sync({
            scope: me,
            success: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                if(resultSet.records.length != 0) {
                    var rec = resultSet[0];
                    record.set('isactive',true);
                    record.set('id',rec.get('id'));
                    record.commit();
                }
            },
            failure: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                if(resultSet) {
                    Ext.Msg.show({
                        title: 'Operação falhou!',
                        msg: resultSet.getMessage(),
                        buttons: Ext.Msg.CANCEL,
                        icon: Ext.Msg.WARNING
                    });
                }
            }
        });

        record.commit();
    },

    showAdditiveData: function () {
        var me = this;

        Ext.getStore('additivetable').setParams({
            method: 'selectCode',
            additiveid: me.getView().xdata.get('id')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                if(records.length != 0) {
                }
            }
        });
    },

    showContractUnit: function () {
        var me = this,
            view = me.getView(),
            xdata = view.xdata,
            additiveshift = view.down('treepanel'),
            showfilter = view.down('radiogroup').getValue().showfilter;

        additiveshift.setLoading('Carregando unidades!');

        Ext.Ajax.request({
            scope: me,
            url: '../iContract/business/Calls/additiveshift.php',
            params: {
                action: 'select',
                method: 'selectTree',
                showfilter: showfilter,
                additiveid: xdata.get('id'),
                contractid: xdata.get('contractid')
            },
            success: function(response){
                var root = Ext.decode(response.responseText);
                additiveshift.setRootNode(root);
                additiveshift.setLoading(false);
                Ext.getStore('additiveshift').removeAll();
                Ext.getStore('contractorsubunit').removeAll();
            },
            failure: function(response){
                additiveshift.setLoading(false);
            }
        });
    },

    showContractData: function () {
        var me = this,
            xdata = me.getView().xdata;

        Ext.getStore('contractdata').setParams({
            method: 'selectCode',
            contractid: xdata.get('contractid')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                if(records.length != 0) {
                }
            }
        });
    },

    onLoadStore: function ( store, records, successful, eOpts ) {
        var me = this,
            amount = 0,
            shiftvalue = 0.00,
            view = me.getView(),
            shiftamount = view.down('textfield[name=shiftamount]'),
            totalshiftvalue = view.down('textfield[name=totalshiftvalue]');

        store.each(function (record,index) {
            amount += parseFloat(record.get('shiftamount'));
            shiftvalue += parseFloat(record.get('shiftamount')) * parseFloat(record.get('shiftvalue'));
        });

        shiftamount.setValue(amount);
        totalshiftvalue.setValue(shiftvalue);
    },

    onUpdateStore: function ( store, record, operation, modifiedFieldNames, details, eOpts ) {
        var me = this;
        me.onLoadStore(store);
    },

    onUnitSelect: function (rowModel, record, index, eOpts) {
        var me = this,
            view = me.getView(),
            subunit = view.down('gridpanel[name=subunit]'),
            column = subunit.getColumnManager().getFirst();

        column.setText('SubUnidades: <b>' + record.get('text').toUpperCase() + '</b>');

        Ext.getStore('contractorsubunit').setParams({
            method: 'selectCodeAdditive',
            contractorunitid: record.get('id'),
            additiveid: record.get('additiveid')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                if(records.length != 0) {
                    subunit.getSelectionModel().select(0);
                }
                Ext.getStore('additiveshift').removeAll();
            }
        })
    },

    onSubUnitSelect: function (rowModel, record, index, eOpts) {
        var me = this,
            view = me.getView();

        Ext.getStore('additiveshift').setParams({
            additiveid: view.down('#id').getValue(),
            contractorsubunitid: record.get('id'),
            method: 'selectCode'
        }).load();
    },

    onChangeShowFilter: function (field,newValue,oldValue,epts) {
        this.showContractUnit();
    },

    onSubUnitEdit: function (editor, context, eOpts) {
        var me = this,
            record = context.record,
            store = editor.grid.store;

        if ( record.get('isactive') == false ) record.set('id','');

        store.sync({
            scope: me,
            success: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                me.onUpdateView(record);

                if(resultSet.records.length != 0) {
                    var data = resultSet.records[0];
                    record.set('isactive',true);
                    record.set('id',data.id);
                    record.commit();
                }
            },
            failure: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                if(resultSet) {
                    Ext.Msg.show({
                        title: 'Operação falhou!',
                        msg: resultSet.getMessage(),
                        buttons: Ext.Msg.CANCEL,
                        icon: Ext.Msg.WARNING
                    });
                }
            }
        });

        record.commit();
    },

    onUpdateView: function (record) {
        var me = this,
            view = me.getView(),
            xdata = me.getView().xdata,
            subunitStore = Ext.getStore('contractorsubunit'),
            treepanelStore = view.down('treepanel').getStore(),
            subunitModel = subunitStore.findRecord('id',record.get('contractorsubunitid'));

        Ext.Ajax.request({
            scope: me,
            url: '../iContract/business/Calls/additiveshift.php',
            params: {
                action: 'select',
                method: 'updateView',
                additiveid: xdata.get('id'),
                contractid: xdata.get('contractid'),
                contractorunitid: subunitModel.get('contractorunitid'),
                contractorsubunitid: record.get('contractorsubunitid')
            },
            success: function(response){
                var shiftstotal = 0.00,
                    result = Ext.decode(response.responseText),
                    recordRoot = treepanelStore.findRecord('id',result.rows[0].contractnumber),
                    recordUnit = treepanelStore.findRecord('id',subunitModel.get('contractorunitid'));

                subunitModel.set('shiftstotal',result.rows[0].totaladditiveshift);
                subunitModel.commit();

                recordRoot.set('released',result.rows[0].totalreleased);
                recordRoot.commit();

                subunitStore.each(function (rec,index) {
                    shiftstotal += parseFloat(rec.get('shiftstotal'));
                });

                recordUnit.set('released',shiftstotal);
                recordUnit.commit();
            },
            failure: function(response){
            }
        });
    },

    onItemDblClick: function (dataView, record, item, index, e, eOpts) {
        var downData = "../iContract/business/Calls/contractdata.php?action=getfile&method=loadFile&tableName={0}&id={1}";

        window.open(Ext.String.format(downData, record.get('tablename'), record.get('id').substring(0,4)));
    },

    updateView: function () {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=contractdata]');

        form.down('hiddenfield[name=contractid]').setValue(view.xdata.get('contractid'));

        me.setModuleData('contractdata');
        me.setModuleForm(form);

        me._success = function () {
            form.reset();
            Ext.getStore('contractdata').load();
        }

        me.updateModule();
    },

    updateContractNew: function () {
        var me = this,
            view = me.getView();

        me.setModuleData('contract');
        me.setModuleForm(view.down('form'));

        me._success = function () {
            view.close();
            Ext.getStore('contract').load();
        }

        me.updateModule();
    },

    updateAdditiveNew: function () {
        var me = this,
            view = me.getView();

        me.setModuleData('additive');
        me.setModuleForm(view.down('form'));

        me._success = function () {
            view.close();
            Ext.getStore('contract').load();
        }

        me.updateModule();
    }

});