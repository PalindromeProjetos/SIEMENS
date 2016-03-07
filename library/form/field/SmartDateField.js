//@charset UTF-8
Ext.define( 'Smart.form.field.SmartDateField', {
    extend: 'Ext.form.field.Date',

    alias: 'widget.smartdatefield',

    requires: [
        'Smart.plugins.TextMask'
    ],

    hideTrigger: false,
    plugins: 'textmask'

});