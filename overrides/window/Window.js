//@charset UTF-8
Ext.define( 'Ext.overrides.window.Window', {
    override: 'Ext.window.Window',

    shadow: false,

    showAnimate: false,

    animateClsIn: 'animated jello',

    initComponent: function () {
        var me = this;

        me.callParent();

        me.addCls('panel-frame');

        me.on({
            beforerender: { fn: 'fnBeforeRender', scope: me }
        });

    },

    fnBeforeRender: function () {
        var me = this;

        if(me.showAnimate) {
            var audio = document.getElementById("audio");

            me.addCls(me.animateClsIn);

            if(audio) {
                audio.play();
            }
        }

    }

});