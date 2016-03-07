//@charset UTF-8
Ext.define( 'Ext.overrides.form.field.Text', {
    override: 'Ext.form.field.Text',

    showFetch: false,
    showClear: false,
    paramName: 'query',

    initComponent: function () {
        var me = this,
            clear = {
                clear: {
                    hidden: true,
                    cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    handler: function (field) {
                        field.reset();
                        if (field.hiddenNameId) {
                            field.ownerCt.down('hiddenfield[name=' + field.hiddenNameId + ']').reset();
                        }
                    }
                }
            },
            fetch = {
                fetch: {
                    handler: 'fetchField',
                    cls: Ext.baseCSSPrefix + 'form-search-trigger'
                }
            };

        me.callParent();

        if(me.showClear === true ) {
            me.setTriggers(Ext.Object.merge(me.getTriggers(), clear));
            me.on({
                change: { fn: 'clearState', scope: me }
            });
        }

        if(me.showFetch === true ) {
            me.itemId = me.getName();
            me.emptyText = 'Pesquisar';
            me.setTriggers(Ext.Object.merge(me.getTriggers(), Ext.Object.merge(clear, fetch)));
            me.on({
                change: { fn: 'clearState', scope: me },
                specialkey: { fn: 'fetchStart', scope: me }
            });
        }
    },

    fetchStart: function (field, e, eOpts) {
        if (e.getKey() === e.ENTER) {
            field.getTriggers().fetch.onClick();
        }
    },

    clearState: function (field, newValue, oldValue, eOpts) {
        if(newValue && newValue.length > 0) {
            field.getTrigger('clear').show();
        } else {
            field.getTrigger('clear').hide();
        }

        field.updateLayout();
    }

});