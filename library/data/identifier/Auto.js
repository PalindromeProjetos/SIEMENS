//@charset UTF-8
Ext.define( 'Smart.data.identifier.Auto', {
    extend: 'Ext.data.identifier.Sequential',

    alias: 'data.identifier.auto',

    requires: [
        'Ext.data.identifier.Sequential'
    ],

    config: {
        id: 'auto',
        prefix: 'SMART_',
        seed: 0
    }

});