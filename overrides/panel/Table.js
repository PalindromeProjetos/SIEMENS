//@charset UTF-8
Ext.define( 'Ext.overrides.panel.Table', {
    override: 'Ext.panel.Table',

    rowLines: false,
    hideHeaders: true,
    recordsRenderer: false,
    columnsRenderer: false,

    initComponent: function () {
        var me = this;

        me.viewConfig = {
            deferEmptyText: false,
            loadMask: { msg: 'Carregando...!' },
            emptyText:  [
                '<div style="text-align: center;">Nenhum dado disponível...</div>',
                (me.recordsRenderer ? '<div style="text-align: center;"><i style="color: red; cursor: pointer;" onclick="Ext.panel.Table._insertRecord()">Inserir Registro</i></div>' : '')
            ]
        };

        me.callParent();

        Ext.panel.Table._insertRecord = function () {
            me.fireEvent('insertrecord', me, me.getStore(), {});
        };

        me.on({
            beforerender: { fn: 'fnBeforeRender', scope: me }
        });

    },

    fnBeforeRender: function (view, eOpts) {
        var me = this;

        if(me.columnsRenderer) {
            Ext.each(me.columns,function(column) {
                if(column.renderer === false) {
                    column.renderer = me.columnsRenderer;
                };
            });
        }
    }

});