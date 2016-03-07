//@charset UTF-8
Ext.define( 'Ext.overrides.button.Button', {
    override: 'Ext.button.Button',

    showSmartTheme: null,

    initComponent: function () {
        var me = this,
            theme = me.showSmartTheme;

        if(theme) {
            me.cls = Ext.String.format('smart-btn-{0}', theme);
            me.overCls = Ext.String.format('smart-btn-{0}-over', theme);
        }
        
        me.callParent();
    }

});