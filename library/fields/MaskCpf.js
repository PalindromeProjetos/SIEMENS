//@charset UTF-8
Ext.define( 'Smart.fields.MaskCpf', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.maskcpf',

    requires: [
        'Ext.form.field.VTypes',
        'Smart.plugins.TextMask'
    ],

    vtype: 'cpf',
    money: false,
    plugins: 'textmask',
    mask: '999.999.999-99'

});