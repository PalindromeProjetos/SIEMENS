//@charset UTF-8
Ext.define( 'Ext.overrides.data.field.Field', {
    override: 'Ext.data.field.Field',

    serializeType: null,

    constructor: function () {
        var me = this;
        me.callParent(arguments);
        me.setSerializeType();
    },

    setSerializeType: function () {
        var me = this;

        switch (me.serializeType) {
            case 'auto':
                me.serialize = function ( value, record ) {
                    return ((isNaN(value)) || (value.length == 0)) ? '' : value;
                }
                break;
            case 'date':
                me.serialize = function ( value, record ) {
                    var postValue = Ext.util.Format.date(Ext.Date.parse(value,'d/m/Y'),'Y-m-d');
                    return (postValue.length != 0) ? postValue: value;
                }
                break;
        }
    }

});