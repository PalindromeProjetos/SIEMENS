//@charset UTF-8
Ext.define( 'Smart.login.Login', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.panel.Panel',
        'Ext.plugin.Viewport',
        'Ext.container.Container',
        'Smart.login.LoginComeIn',
        'Smart.login.LoginForgot'
    ],

    plugins: 'viewport',
    title: 'Login de Acesso',
    headerPosition: 'bottom',

    layout: {
        type: 'vbox',
        align: 'center'
    },

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                flex: 1,
                xtype: 'container'
            }, {
                xtype: 'container',
                name: 'userlogin',
                width: 300,
                layout: 'card',
                items: [
                    {
                        xtype: 'logincomein'
                    }, {
                        xtype: 'loginforgot'
                    }
                ]
            }, {
                flex: 1,
                xtype: 'container'
            }
        ];
    }

});