//@charset UTF-8
Ext.define( 'Smart.form.field.ComboEnum', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.comboenum',

    requires: [
        'Smart.form.field.ComboSearch'
    ],

    fields: [],

    pageSize: 0,
    editable: false,
    fieldLabel: null,
    submitValue: true,

    config: {
        url: '../iContract/business/Calls/enumtype.php',
        params: {
            action: 'select',
            method: 'selectEnum'
        }
    },

    valueField: null,
    displayField: null,

    filterField: null,

    buildCombo: function () {
        var me = this,
            name = me.getName(),
            hiddenName = name.replace('description','');

        me.displayField = name;
        me.valueField   = hiddenName;
        me.params.type  = hiddenName;
        me.hiddenNameId = hiddenName;
        me.fields.push(name,hiddenName);
    },

    initComponent: function () {
        var me = this;

        me.initConfig();
        me.buildCombo();
        me.callParent();

        if(me.filterField) {
            me.store.clearFilter();
            me.store.filter(me.filterField.field,me.filterField.regex);
        }

        me.on({
            beforeselect: { fn: 'fnBeforeSelect', scope: me }
        });

    },

    fnBeforeSelect: function ( combo, record, index, eOpts ) {
        combo.setDisplayTpl(record.get(combo.displayField));
    }

});