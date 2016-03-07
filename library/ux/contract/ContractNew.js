//@charset UTF-8
Ext.define( 'Smart.ux.contract.ContractNew', {
    extend: 'Ext.window.Window',

    requires: [
        'Smart.form.field.*',
        'Ext.form.RadioGroup'
    ],

    title: 'Novo Contrato',

    modal: true,
    autoShow: true,
    showAnimate: true,

    layout: {
        type: 'fit'
    },

    width: 450,

    defaultFocus : 'contractnumber',

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
                    anchor: '100%',
                    allowBlank: false
                },
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        flex: 1,
                        fieldLabel: 'Estrutura',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            allowBlank: false
                        },
                        items: [
                            {
                                flex: 1,
                                itemId: 'contractnumber',
                                fieldLabel: 'Contrato n.o',
                                xtype: 'textfield',
                                name: 'contractnumber',
                                plugins: 'textmask',
                                mask: '999/9999'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                xtype: 'datefield',
                                plugins: 'textmask',
                                fieldLabel: 'Contrato data',
                                name: 'contractdate'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                allowBlank: true,
                                useReadColor: true,
                                xtype: 'textfield',
                                plugins: 'textmask',
                                fieldLabel: 'Aditivo n.o',
                                name: 'additivenumber',
                                mask: '000',
                                value: 0
                            }
                        ]
                    }, {
                        fieldLabel: 'Celebrado entre as partes',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        defaults: {
                            pageSize: 0,
                            anchor: '100%',
                            allowBlank: false,
                            submitValue: false
                        },
                        items: [
                            {
                                fieldLabel: 'Empresa Contratada',
                                xtype: 'combosearch',
                                store: 'iContract.store.legalentity.LegalEntity',
                                displayField: 'shortname',
                                hiddenNameId: 'legalentityid'
                            }, {
                                fieldLabel: 'Mantenedora',
                                xtype: 'combosearch',
                                store: 'iContract.store.contractor.Contractor',
                                displayField: 'shortname',
                                hiddenNameId: 'contractorid'
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
                        fieldLabel: 'Descrição',
                        xtype: 'textfield',
                        name: 'description'
                    }, {
                        fieldLabel: 'Arquivo',
                        xtype: 'filefield',
                        name: 'filedata',
                        useReadColor: true,
                        tableName: 'contract',
                        accept: 'application/pdf',
                        buttonText: Ext.emptyText,
                        buttonConfig: {
                            width: 34,
                            minWidth: 34,
                            glyph: 0xeef8,
                            showSmartTheme: 'red'
                        }
                    }, {
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
            text: 'Salvar',
            handler: 'updateContractNew'
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