//@charset UTF-8
Ext.define( 'Smart.data.proxy.AjaxBaseTree', {
    extend: 'Smart.data.proxy.AjaxBase',

    alias: 'proxy.ajaxbasetree',

    reader: {
        type: 'json',
        rootProperty: 'children'
    },

    writer: {
        type: 'json',
        rootProperty: 'children'
    }

});