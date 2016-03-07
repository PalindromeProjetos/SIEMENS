//@charset UTF-8
Ext.define( 'Smart.ux.contract.AdditiveNew', {
    extend: 'Ext.window.Window',

    requires: [
        'Smart.form.field.*',
        'Ext.form.RadioGroup'
    ],

    title: 'Novo Aditivo',

    modal: true,
    autoShow: false,
    showAnimate: true,

    layout: {
        type: 'fit'
    },

    width: 450,

    defaultFocus : 'additivenumber',

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                padding: 10,
                xtype: 'form',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'contractid'
                    }, {
                        flex: 1,
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        fieldLabel: 'Estrutura',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            allowBlank: false,
                            useReadColor: true
                        },
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                fieldLabel: 'Contrato n.o',
                                name: 'contractnumber',
                                plugins: 'textmask',
                                mask: '999/9999'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                xtype: 'datefield',
                                fieldLabel: 'Contrato data',
                                name: 'contractdate',
                                plugins: 'textmask'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                useReadColor: false,
                                xtype: 'textfield',
                                plugins: 'textmask',
                                fieldLabel: 'Aditivo n.o',
                                name: 'additivenumber',
                                itemId: 'additivenumber',
                                mask: '999'
                            }
                        ]
                    }, {
                        fieldLabel: 'Celebrado entre as partes',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        defaultType: 'textfield',
                        defaults: {
                            anchor: '100%',
                            useReadColor: true
                        },
                        items: [
                            {
                                name: 'legalentity',
                                fieldLabel: 'Empresa Contratada'
                            }, {
                                name: 'contractor',
                                fieldLabel: 'Mantenedora'
                            }
                        ]
                    }, {
                        fieldLabel: 'Vigência',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            allowBlank: false
                        },
                        items: [
                            {
                                flex: 1,
                                fieldLabel: 'De',
                                xtype: 'datefield',
                                plugins: 'textmask',
                                name: 'periodof'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                fieldLabel: 'Até',
                                xtype: 'datefield',
                                plugins: 'textmask',
                                name: 'periodto'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                xtype: 'datefield',
                                plugins: 'textmask',
                                fieldLabel: 'Assinou em',
                                name: 'datesign'
                            }
                        ]
                    }, {
                        allowBlank: false,
                        fieldLabel: 'Descrição',
                        xtype: 'textfield',
                        name: 'description'
                    }, {
                        fieldLabel: 'Arquivo',
                        xtype: 'filefield',
                        name: 'filedata',
                        useReadColor: true,
                        tableName: 'additive',
                        accept: 'application/pdf',
                        buttonText: Ext.emptyText,
                        buttonConfig: {
                            width: 34,
                            minWidth: 34,
                            iconCls: "fa fa-envelope",
                            showSmartTheme: 'red'
                        }
                    }, {
                        allowBlank: false,
                        fieldLabel: 'Nota',
                        xtype: 'textareafield',
                        name: 'note'
                    }
                ]
            }
        ]
    },

    buttonAlign: 'center',

    buttons: [
        {
            iconCls: "fa fa-upload",
            showSmartTheme: 'red',
            text: 'Confirmar',
            handler: 'updateAdditiveNew'
        }, {
            iconCls: "fa fa-times",
            showSmartTheme: 'red',
            text: 'Cancelar',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ]

});