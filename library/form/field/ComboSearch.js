//@charset UTF-8
Ext.define( 'Smart.form.field.ComboSearch', {
    extend: 'Ext.form.field.ComboBox',
    
    alias: 'widget.combosearch',

    requires: [
        'Smart.data.StoreBase'
    ],

    config: {
        url: null,
        model: null,
        fields: null,
        clearField: false,
        params: {
            query: '%',
            action: 'select',
            method: 'selectLike',
            field: 'description'
        }
    },

    initComponent: function () {
        var me = this;

        me.initConfig();
        me.buildStore();
        me.callParent();
    },

    buildStore: function () {
        var me = this;

        if(me.store) {
            me.store = Ext.create(me.store).setParams(me.getParams());
        } else {
            me.store = Ext.create(
                Ext.define( me.getName(), {
                    extend: 'Smart.data.StoreBase',
                    url: me.getUrl(),
                    storeId: me.getName(),
                    fields: me.getFields()
                })
            ).setParams(me.params);
        }
    }

});