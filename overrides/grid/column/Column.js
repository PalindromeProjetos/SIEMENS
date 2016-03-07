//@charset UTF-8
Ext.define( 'Ext.overrides.grid.column.Column', {
    override: 'Ext.grid.column.Column',

    initComponent: function () {
        var me = this;

        //me.sortable = false;
        me.hideable = false;
        me.menuDisabled = true;

        me.callParent();
    }

});