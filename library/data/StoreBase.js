//@charset UTF-8
Ext.define( 'Smart.data.StoreBase', {
    extend: 'Ext.data.Store',

    pageSize: 10,

    requires: [
        'Smart.data.proxy.AjaxBase'
    ],

    proxy: {
        type: 'ajaxbase'
    },

    constructor: function () {
        var me = this;
        me.callParent();
        me.getProxy().setUrl(me.getUrl());
        me.getProxy().setApiUrl();

        me.on({
            write: { fn: 'fnWrite', scope: me },
            beforeload: { fn: 'fnBeforeLoad', scope: me }
        });
    },

    fnBeforeLoad: function (store, operation, eOpts) {
        var me = store;
        me.removeAll();
        me.getProxy().setExtraParams(me.getExtraParams());
    },

    fnWrite: function (store, operation, eOpts) {
        var result = operation.getResultSet();

        return result.getSuccess();
    }

});