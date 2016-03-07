//@charset UTF-8
Ext.define( 'Ext.overrides.container.Container', {
    override: 'Ext.container.Container',

    xdata: null,

    showSmartPanel: false,
    showSmartTheme: false,
    showSmartOpacity: false,
    showSmartAnimate: false,
    showSmartTransparent: false,

    animateClsIn: 'animated fadeInLeft',
    animateClsOut: 'animated fadeOutLeft',

    initComponent: function () {
        var me = this;

        if(me.showSmartPanel === true) {
            me.cls = 'theme-smart-panel';
            me.bodyCls = 'smart-panel-body';
        }

        if(me.showSmartAnimate) {
            me.listeners = {
                afterrender: function ( panel, eOpts ) {
                    panel.addCls(me.animateClsIn);
                }
            };
        }

        if(me.showSmartOpacity === true) {
            me.addCls('theme-smart-opacity');
        }
        
        if(me.showSmartTransparent === true) {
            me.style = Ext.apply({
                'background-color': 'transparent'
            }, me.style);
        }

        if(me.frame === true) {
            me.style = Ext.apply({
                '-webkit-border-radius': '5px;',
                '-moz-border-radius': '5px;',
                'border-radius': '5px;'
            }, me.style);
        }

        me.callParent();
		
		me.onAfter('afterrender', me.fnAfterRender, me);

    },

	fnAfterRender: function (panel, eOpts) {
        var me = this;
		
		me.getEl().on('keydown', me.fnElKeyDown, me);
	},
	
	fnElKeyDown: function(e) {
        var me = this;
		
		me.fireEvent('keydown', me, e, {});
    }

});