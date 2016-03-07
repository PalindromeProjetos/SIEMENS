//@charset UTF-8
Ext.define( 'Smart.data.TreeStoreBase', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'Smart.data.proxy.AjaxBaseTree'
    ],

    removeRootNode: false,

    proxy: {
        type: 'ajaxbasetree'
    },

    root: {
        text: '.',
        children: [],
        expanded: true
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

        me.onAfter( 'load', me.fnAfterLoad, me );
    },

    fnAfterLoad: function ( store, records, successful, eOpts ) {
        var me = this;

        if(me.removeRootNode == true) {
            store.remove(store.getAt(0));
        }
    },

    fnWrite: function (store, operation, eOpts) {
        var result = operation.getResultSet();

        if(result.getSuccess() === true) {
            return true;
        } else {
            return false;
        }
    },

    fnBeforeLoad: function (store, operation, eOpts) {
        var me = store;

        me.getProxy().setExtraParams(me.getExtraParams());
    }

});