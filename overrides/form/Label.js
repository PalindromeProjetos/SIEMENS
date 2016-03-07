//@charset UTF-8
Ext.define( 'Ext.overrides.form.Label', {
    override: 'Ext.form.Label',

    labelAlign: 'top',
    labelSeparator: '',

    initComponent: function () {
        var me = this;

        me.callParent();

        me.on({
            afterrender: { fn: 'fnAfterRender', scope: me }
        });

    },

    fnAfterRender: function (label, eOpts) {
        var me = this,
            eOpts = {},
            el = me.getEl();

        el.on('click', function(){ me.fireEvent('click', me, el, eOpts); }, me);

    }

});