//@charset UTF-8
Ext.define( 'Ext.overrides.grid.column.Date', {
    override: 'Ext.grid.column.Date',

    format: 'd/m/Y',

    renderer: function (value) {
        var readValue = Ext.util.Format.date(Ext.Date.parse(value,'Y-m-d'),'d/m/Y');
        return (readValue.length != 0) ? readValue: value;
    }

});