//@charset UTF-8
Ext.define( 'Ext.overrides.form.field.Time', {
    override: 'Ext.form.field.Time',

    maskRe: /[0-9\/]/,
    submitValue: true,
    hideTrigger: true,
    format: 'H:i',
    submitFormat: 'H:i'

});

