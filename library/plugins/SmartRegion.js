//@charset UTF-8
Ext.define( 'Smart.plugins.SmartRegion', {
    extend: 'Ext.plugin.Responsive',

    alias: "plugin.smartregion",

    requires: [
        'Ext.plugin.Responsive'
    ],

    init: function (panel) {
        var me = this;
        panel.onResize = me.onResize;
    },

    //smartregionConfig: {
    //    source: 'west',
    //    target: 'north',
    //    width: 200,
    //    flex: 3
    //},

    onResize: function (width) {
        var me = this;

        if(me.smartregionConfig) {
            if(me.region == me.smartregionConfig.source && width < me.smartregionConfig.width) {
                me.setFlex(me.smartregionConfig.flex);
                me.setRegion(me.smartregionConfig.target);
            }
        }

    }

});