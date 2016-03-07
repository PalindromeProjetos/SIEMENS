//@charset UTF-8
Ext.define( 'Ext.overrides.data.field.Date', {
    override: 'Ext.data.field.Date',

    dateReadFormat : 'd/m/Y',
    dateWriteFormat: 'Y-m-d',

    convert: function (value) {
        return Ext.util.Format.date(Ext.Date.parse(value,'Y-m-d'),'d/m/Y');
    }

});