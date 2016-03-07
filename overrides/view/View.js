//@charset UTF-8
Ext.define( 'Ext.overrides.view.View', {
    override: 'Ext.view.View',

    loadingText: 'Carregando...!',
    emptyText: '<div>Nenhum dado disponivel...</div>',

    getWidgetRecord: function () {
        var me = this,
            sm = me.getSelectionModel(),
            records = sm.getSelection();

        return records.length ? records[0] : null;
    }

});