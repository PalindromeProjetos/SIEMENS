//@charset UTF-8
Ext.define( 'Smart.login.LoginComeIn', {
    extend: 'Ext.form.Panel',

    xtype: 'logincomein',

    layout: 'anchor',

    requires: [
        'Ext.form.Panel',
        'Smart.plugins.FormEnter'
    ],

    defaults: {
        anchor: '100%'
    },

    plugins:'formenter',

    listeners: {
        afterrender: function () {
            this.down('textfield[name=username]').focus(false, 200);
        }
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
                xtype: 'label',
                text: 'Login ...',
                style: {
                    fontSize: '46px;',
                    display: 'table-cell;',
                    textAlign: 'center;',
                    lineHeight: '50px;'
                }
            }, {
                height: 20,
                xtype: 'container'
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    {
                        width: 37,
                        margin: '30 0 0 0',
                        xtype: 'image',
                        glyph: 0xe80d,
                        style: {
                            color: 'rgb(102,205,170)',
                            fontSize: '40px',
                            textShadow: '1px 0px 1px #008B8B, 0px 1px 1px #eee, 2px 1px 1px #008B8B'
                        }
                    }, {
                        xtype: 'splitter'
                    }, {
                        flex: 1,
                        xtype: 'textfield',
                        name: 'username',
                        fieldLabel: 'Nome do usuário',
                        allowBlank: false
                    }
                ]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    {
                        width: 37,
                        margin: '30 0 0 0',
                        xtype: 'image',
                        glyph: 0xea6b,
                        style: {
                            color: 'rgb(102,205,170)',
                            fontSize: '40px',
                            textShadow: '1px 0px 1px #008B8B, 0px 1px 1px #eee, 2px 1px 1px #008B8B'
                        }
                    }, {
                        xtype: 'splitter'
                    }, {
                        flex: 1,
                        xtype: 'textfield',
                        name: 'password',
                        inputType: 'password',
                        fieldLabel: 'Senha de acesso',
                        allowBlank: false
                    }
                ]
            }
        ];
    },

    dockedItems: [
        {
            xtype: 'panel',
            dock: 'bottom',
            layout: 'anchor',
            bodyStyle: 'padding-top: 20px;',
            style: {
                borderTop: 'dotted 1px #cecece'
            },
            defaultType: 'button',
            defaults: {
                anchor: '100%',
                scale: 'large'
            },
            items: [
                {
                    xtype: 'container'
                }, {
                    text: 'Login',
                    formBind: true,
                    listeners: {
                        click: 'onComeInSend'
                    }
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'label',
                    text: 'Esqueci minha senha!',
                    listeners: {
                        click: 'onForgotGoView'
                    },
                    style: {
                        cursor: 'pointer;',
                        textDecoration: 'underline;'
                    }
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'label',
                    text: 'Gerar código de ativação',
                    listeners: {
                        click: 'onInviteGoView'
                    },
                    style: {
                        cursor: 'pointer;',
                        textDecoration: 'underline;'
                    }
                }
            ]
        }
    ]

});