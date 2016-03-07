//@charset UTF-8
Ext.define( 'Smart.data.field.Phone', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.phone',

    requires: [
        'Smart.ux.TextMaskCore'
    ],

    convert: function (value) {
        var maskValue = Smart.maskRenderer('(99) 9999-9999',false)(value);
        return ((value) && (value.length !== 0)) ? maskValue : value;
    }
    // Match U.S. phone numbers for example purposes
    //validators: {
    //    type: 'format',
    //    matcher: /\d{2}\-\d{4}\-\d{4}/
    //}
});