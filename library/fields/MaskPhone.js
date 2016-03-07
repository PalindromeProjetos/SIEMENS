//@charset UTF-8
Ext.define( 'Smart.fields.MaskPhone', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.maskphone',

    requires: [
        'Smart.plugins.TextMask'
    ],

    money: false,
    plugins: 'textmask',
    mask: '99999-9999'

});