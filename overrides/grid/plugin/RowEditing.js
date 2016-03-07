//@charset UTF-8
Ext.define('Ext.grid.plugin.override.RowEditing', {
    override: 'Ext.grid.plugin.RowEditing',

    onEnterKey: function(e) {
        if (e.getKey() == e.ENTER){
            e.stopEvent();
        }
    }

});