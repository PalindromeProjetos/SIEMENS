//@charset UTF-8
Ext.define( 'Smart.data.proxy.AjaxBase', {
    extend: 'Ext.data.proxy.Ajax',

    alias: 'proxy.ajaxbase',
    
    actionMethods: {
        read: 'POST'
    },

    reader: {
        type: 'json',
        idProperty: 'id',
        rootProperty: 'rows',
        messageProperty: 'text',
        totalProperty: 'records',
        successProperty: 'success'
    },

    writer: {
        type: 'json',
        encode: true,
        idProperty: 'id',
        dateFormat: 'Y-m-d',
        rootProperty: 'rows',
        writeAllFields: false
    },

    constructor: function () {
        var me = this;

        me.callParent(arguments);

        me.on({
            exception: { fn: 'fnException', scope: me }
        });

    },

    setApiUrl: function() {
        var me = this;
        if(me.getUrl() !== undefined && !Ext.Object.getValues(me.getApi()).length) {
            me.setApi({
                create: me.getUrl()  + '?action=update',
                update: me.getUrl()  + '?action=update',
                destroy: me.getUrl() + '?action=delete'
            });
        }
    },

    fnException: function (proxy, response, operation, eOpts) {
        var result = operation.getResultSet();
    }

});