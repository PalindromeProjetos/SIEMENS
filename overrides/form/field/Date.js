//@charset UTF-8
Ext.define( 'Ext.overrides.form.field.Date', {
    override: 'Ext.form.field.Date',

    maskRe: /[0-9\/]/,
    submitValue: true,
    hideTrigger: true,

    format: 'd/m/Y',
    submitFormat: 'Y-m-d'

});