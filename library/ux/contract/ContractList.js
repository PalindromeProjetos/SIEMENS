//@charset UTF-8
Ext.define( 'Smart.ux.contract.ContractList', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.grid.Panel',
        'Ext.panel.Panel',
        'Ext.grid.column.*'
    ],

    frame: true,
    layout: 'fit',

    cls: 'panel-frame',
    iconCls: "fa fa-users",
    title: 'Listar Contratos',

    tools: [
        {
            type: 'pin',
            handler: 'onHistoryBack'
        }
    ],

    listeners: {
        afterrender: 'onFocusSearch'
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
                xtype: 'gridpanel',
                store: 'contract',
                hideHeaders: false,
                headerBorders: false,
                cls: 'contract-list',
                listeners: {
                    itemdblclick: 'onViewEdit',
                    additiveitem: 'onAdditiveItem'
                },
                columns: [
                    {
                        text: 'Contrato',
                        dataIndex: 'contractnumber',
                        width: 150,
                        renderer: function (value, meta, rec) {
                            meta.style = 'line-height: 45px; text-align: center; font-family: Monda; height: 100%; ' +
                                         'color: #0000cc; font-size: 32px;';
                            return Smart.maskRenderer('999/9999', false)(value);
                        }
                    }, {
                        text: 'Aditivos',
                        dataIndex: 'additivelist',
                        width: 130,
                        renderer: function (value, meta, rec) {
                            var me = this;

                            Ext.additiveitem = function (id) {
                                me.fireEvent('additiveitem', me, id);
                            };

                            return Ext.String.format('<div style="height: 45px; width: 100%;" class="data">{0}</div>',value);
                        }
                    }, {
                        text: 'Contratada/Contratante/Aditivo',
                        flex: 1,
                        renderer: function (value, meta, rec) {
                            var legalentity = rec.get('legalentity'),
                                contractor = rec.get('contractor'),
                                description = rec.get('description'),
                                cnpjnumber = Smart.maskRenderer('99.999.999/9999-99', false)(rec.get('cnpjnumber')),
                                html =  '<div class="line">' +
                                        '<div style="width:100%;" class="data">' + contractor + '<br/>' + legalentity + '<br/>' + description + '</div>' +
                                        '</div>';

                            return html;
                        }
                    }, {
                        width: 80,
                        dataIndex: 'periodto',
                        renderer: function (value, meta, rec) {
                            var html =  '<div class="line">' +
                                        '<div style="width:100%;" class="data">Expira em:<br/> <b>' + Ext.util.Format.date(Ext.Date.parse(value,"Y-m-d"),'d/m/Y') + '</b></div>' +
                                        '</div>';

                            return html;
                        }
                    }
                ],
                dockedItems: [
                    {
                        xtype:  'panel',
                        layout: 'hbox',
                        bodyStyle: 'padding-bottom: 10px;',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                name: 'search',
                                reference: 'search',
                                showFetch: true
                            }, {
                                xtype: 'splitter'
                            }, {
                                xtype: 'button',
                                iconCls: "fa fa-file-o",
                                handler: 'insertViewNew',
                                tooltip: 'Novo cadastro de enumerador!'
                            }
                        ]
                    }, {
                        xtype: 'pagingtoolbar',
                        store: 'contract',
                        dock: 'bottom',
                        displayInfo: true
                    }
                ]
            }
        ]
    }

});