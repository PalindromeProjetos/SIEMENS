//@charset UTF-8
Ext.define( 'Smart.login.LoginForgot', {
    extend: 'Ext.form.Panel',

    xtype: 'loginforgot',

    layout: 'anchor',

    requires: [
        'Ext.form.Panel',
        'Smart.form.field.SmartDateField'
    ],

    defaults: {
        anchor: '100%'
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
                text: 'Esqueci ...',
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
                        glyph: 0xebe5,
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
                        name: 'mainmail',
                        fieldLabel: 'Email',
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
                        glyph: 0xec2c,
                        style: {
                            color: 'rgb(102,205,170)',
                            fontSize: '40px',
                            textShadow: '1px 0px 1px #008B8B, 0px 1px 1px #eee, 2px 1px 1px #008B8B'
                        }
                    }, {
                        xtype: 'splitter'
                    }, {
                        flex: 1,
                        xtype: 'smartdatefield',
                        name: 'birthdate',
                        fieldLabel: 'Data de nascimento',
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
                    text: 'Enviar',
                    formBind: true,
                    showSmartTheme: 'red',
                    listeners: {
                        click: 'onForgotSend'
                    }
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'label',
                    text: 'Login de acesso!',
                    listeners: {
                        click: 'onComeInGoView'
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