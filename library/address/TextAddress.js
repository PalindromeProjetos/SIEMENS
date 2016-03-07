//@charset UTF-8
Ext.define( 'Smart.address.TextAddress', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.textaddress',

    initComponent: function () {
        var me = this;

        me.callParent();

        me.setTriggers({
            search: {
                cls: Ext.baseCSSPrefix + 'form-search-trigger',
                handler: 'onAddressSearchClick'
            }
        });
    }

});