//@charset UTF-8
Ext.define( 'Ext.overrides.form.Panel', {
    override: 'Ext.form.Panel',

    initComponent: function () {
        var me = this;
        
        if(me.showSmartTransparent === true) {
            me.bodyStyle = Ext.apply({backgroundColor: 'transparent'},me.bodyStyle);
        }

        me.callParent(arguments);
    }

});