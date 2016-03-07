//@charset UTF-8
Ext.define( 'Smart.form.field.SmartTimeField', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.smarttimefield',

    requires: [
        'Smart.plugins.TextMask'
    ],

    vtype: 'time',
    plugins: 'textmask',
    returnWithMask: true,
    money: false,
    mask: '99:99'

});