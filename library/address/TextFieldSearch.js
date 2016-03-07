//@charset UTF-8
Ext.define( 'Smart.address.TextFieldSearch', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.textfieldsearch',

    showFetch: true,

    initComponent: function () {
        var me = this;

        me.callParent();

        me.setTriggers(Ext.Object.merge(me.getTriggers(), {
            fetch: {
                cls: Ext.baseCSSPrefix + 'form-search-trigger',
                handler: function () {
                    var me = this,
                        view = me.up('window'),
                        store = view.down('gridpanel').getStore(),
                        query = view.down('textfield[name=search]');

                    store.load({
                        params: {
                            action: 'buscarCep',
                            query: query.getValue()
                        }
                    });
                }
            }
        }));
    }

});