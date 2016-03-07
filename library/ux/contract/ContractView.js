//@charset UTF-8
Ext.define( 'Smart.ux.contract.ContractView', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Smart.form.field.*',
        'Ext.form.RadioGroup',
        'Smart.util.Resource',
        'Smart.plugins.TreeFilter',
        'Smart.plugins.SmartRegion',
        'Ext.grid.plugin.RowEditing'
    ],

    frame: true,
    layout: 'border',

    cls: 'panel-frame',
    iconCls: "icon-shield",
    title: 'Contrato/Aditivos',

    tools: [
        {
            type: 'pin',
            handler: 'onHistoryBack'
        }
    ],

    listeners: {
        afterrender: 'onAfterRenderView'
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
                split: true,
                xtype: 'form',
                region: 'west',
                scrollable: 'y',
                cls: "smart-background-transparent",
                plugins: [
                    'smartregion'
                ],
                responsiveConfig: {
                    'width >= 200': {
                        region: 'west',
                        flex: 1
                    }
                },
                smartregionConfig: {
                    source: 'west',
                    target: 'north',
                    width: 200,
                    flex: 3
                },
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%',
                    useLabelBold: true
                },
                items: [
                    {
                        xtype: 'label',
                        cls: 'title-label',
                        text: 'Cadastro do Contrato'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'id',
                        itemId: 'id'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'contractid'
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        defaultType: 'textfield',
                        defaults: {
                            useReadColor: true,
                            fieldCls: 'smart-field-style'
                        },
                        items: [
                            {
                                flex: 2,
                                fieldLabel: 'Contrato',
                                name: 'contractnumber',
                                plugins: 'textmask',
                                mask: '999/9999'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 2,
                                fieldLabel: 'Data',
                                name: 'contractdate',
                                xtype: 'datefield',
                                plugins: 'textmask'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                name: 'additivenumber',
                                fieldLabel: 'Aditivo',
                                plugins: 'textmask',
                                mask: '999'
                            }
                        ]
                    }, {
                        xtype: 'container',
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        },
                        items: [
                            {
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
                                    useReadColor: true
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
                                useReadColor: true,
                                fieldLabel: 'Descrição',
                                xtype: 'textfield',
                                name: 'description'
                            }, {
                                fieldLabel: 'Nota',
                                name: 'note',
                                useReadColor: true,
                                useMondaFont: true,
                                xtype: 'textareafield',
                                fieldStyle: {
                                    color: '#C02942;',
                                    fontSize: '16px;'
                                }
                            }
                        ]
                    }, {
                        margin: '20 0 0 0',
                        xtype: 'container',
                        layout: 'hbox',
                        defaultType: 'button',
                        defaults: {
                            scale: 'large',
                            showSmartTheme: 'red'
                        },
                        items: [
                            {
                                flex: 1,
                                iconCls: "fa fa-upload",
                                text: 'Salvar',
                                name: 'updateView',
                                handler: 'updateView'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                disabled: true,
                                iconCls: "fa fa-file-o",
                                text: 'Novo',
                                handler: 'insertView'
                            }
                        ]
                    }
                ]
            }, {
                flex: 3,
                plain: true,
                region: 'center',
                xtype: 'tabpanel',
                focusOnToFront: false,
                deferredRender: false,
                listeners: {
                    tabchange: 'onSubUnitTabChange'
                },
                items: [
                    {
                        pageIndex: 0,
                        cls: 'additivetable-edit list-grid',
                        iconCls: "fa fa-list-ol",
                        title: 'Tabela de Preços',
                        overflowY: 'auto',
                        xtype: 'gridpanel',
                        hideHeaders: false,
                        store: 'additivetable',
                        columns: [
                            {
                                flex: 1,
                                text: 'Tipo de plantão',
                                dataIndex: 'shifttypedescription',
                                renderer: function (value, metaData, record) {
                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda; background: rgb(246, 246, 246);';
                                    return '<div class="shift-label">'+value+'</div>';
                                }
                            }, {
                                width: 120,
                                align: 'right',
                                text: 'Quantidade',
                                dataIndex: 'shiftamount',
                                editor: {
                                    xtype: 'textfield',
                                    plugins: 'textmask',
                                    mask: '9.999.990,00',
                                    money: true,
                                    cls: 'additivetable-edit'
                                },
                                renderer: function (value, metaData, record) {
                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda;';
                                    return Smart.maskRenderer('9.999.990,00',true)(value);
                                }
                            }, {
                                width: 140,
                                align: 'right',
                                text: 'Valor Unitário',
                                dataIndex: 'shiftvalue',
                                editor: {
                                    xtype: 'textfield',
                                    plugins: 'textmask',
                                    mask: '9.999.990,00',
                                    money: true,
                                    cls: 'additivetable-edit'
                                },
                                renderer: function (value, metaData, record) {
                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda;';
                                    return Smart.maskRenderer('9.999.990,00',true)(value);
                                }
                            }, {
                                width: 140,
                                align: 'right',
                                text: 'Valor Total',
                                renderer: function (value, metaData, record) {
                                    var totalshiftvalue = parseFloat(record.get('shiftvalue')) * parseFloat(record.get('shiftamount'));
                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda; color: #C02942;';
                                    return Smart.maskRenderer('9.999.990,00',true)(totalshiftvalue);
                                }
                            }
                        ],
                        selModel: 'rowmodel',
                        plugins: {
                            ptype: 'rowediting',
                            clicksToEdit: 2
                        },
                        listeners: {
                            edit: 'onAdditiveTableEdit'
                        },
                        dockedItems: [
                            {
                                dock: 'bottom',
                                xtype: 'pagingtoolbar',
                                store: 'additivetable',
                                displayInfo: false,
                                items: [
                                    {
                                        xtype: 'tbfill'
                                    }, {
                                        width: 100,
                                        name: 'shiftamount',
                                        xtype: 'textfield',
                                        plugins: 'textmask',
                                        mask: '9.999.990,00',
                                        money: true,
                                        useReadColor: true,
                                        fieldCls: 'smart-field-style'
                                    }, {
                                        width: 120,
                                        xtype: 'container'
                                    }, {
                                        width: 140,
                                        name: 'totalshiftvalue',
                                        xtype: 'textfield',
                                        plugins: 'textmask',
                                        mask: '9.999.990,00',
                                        money: true,
                                        useReadColor: true,
                                        fieldCls: 'smart-field-style'
                                    }
                                ]
                            }
                        ]
                    }, {
                        pageIndex: 1,
                        cls: 'list-grid',
                        iconCls: "fa fa-list-ol",
                        title: 'Plantões por Unidades',
                        overflowY: 'auto',
                        xtype: 'form',
                        layout: 'border',
                        items: [
                            {
                                split: true,
                                region: 'west',
                                width: 350,
                                xtype: 'panel',
                                dockedItems: [
                                    {
                                        xtype:  'panel',
                                        layout: 'anchor',
                                        bodyStyle: 'padding: 10px 0 4px 10px',
                                        defaults: {
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                xtype: 'label',
                                                text: 'Unidades e Turnos do Aditivo',
                                                style: {
                                                    color: 'blue;',
                                                    fontSize: '14px;'
                                                }
                                            }, {
                                                xtype: 'radiogroup',
                                                columns: 1,
                                                items: [
                                                    { boxLabel: 'Todas as unidades', name: 'showfilter', inputValue: 1, checked: true },
                                                    { boxLabel: 'Unidades com lançamentos', name: 'showfilter', inputValue: 2 },
                                                    { boxLabel: 'Unidades sem lançamentos', name: 'showfilter', inputValue: 3 }
                                                ],
                                                listeners: {
                                                    change: 'onChangeShowFilter'
                                                }
                                            }, {
                                                height: 33,
                                                xtype: 'textfield',
                                                cls: 'search-tree',
                                                emptyText: 'Filtrar unidades',
                                                listeners: {
                                                    change: function (field, newValue, oldValue, eOpts) {
                                                        var tree = field.up('contractview').down('treepanel');

                                                        tree.getSelectionModel().select(0);
                                                        tree.filter(newValue);
                                                        Ext.getStore('additiveshift').removeAll();
                                                        Ext.getStore('contractorsubunit').removeAll();
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ],
                                xtype: 'treepanel',
                                cls: 'appanest-tree',
                                useArrows: true,
                                singleExpand: true,
                                rootVisible: false,
                                plugins: [
                                    {
                                        ptype: 'treefilter',
                                        allowParentFolders: true
                                    }
                                ],
                                columns: [
                                    {
                                        xtype: 'treecolumn',
                                        flex: 1,
                                        sortable: true,
                                        dataIndex: 'text',
                                        renderer: function (value, metaData, record) {
                                            var leaf = record.get('leaf'),
                                                released = parseFloat(record.get('released')),
                                                color = ((leaf) && (released == 0.00)) ? '' : 'style="color: blue;"',
                                                glyph = ((leaf) && (released == 0.00)) ? record.get('glyph') : ((leaf) ? 'icon-certificate-1' : record.get('glyph') ),
                                                recordValue = Ext.String.format('<i {0} class="{1} size-medium"></i><span style="font-family: Monda;">{2}</span>',color,glyph,value),
                                                releasedValue =
                                                    '<div style="height: 70%; font-family: Monda;">' +
                                                    '<div style="float: left; padding-left: 44px; color: #0066cc;">Plantões</div>' +
                                                    '<div style="float: right; color: #0016b0;">' + Smart.MoneyMask.setMask('9.999.990,00').mask(released) +'</div>' +
                                                    '</div>';

                                            metaData.style = 'line-height: 20px;';

                                            return recordValue + ((leaf) ? ((released != 0.00) ? releasedValue : '') : releasedValue);
                                        }
                                    }
                                ],
                                listeners: {
                                    select: 'onUnitSelect'
                                }
                            }, {
                                region: 'center',
                                layout: 'border',
                                items: [
                                    {
                                        height: 124,
                                        region: 'north',
                                        xtype: 'gridpanel',
                                        split: true,
                                        rowLines: false,
                                        hideHeaders: false,
                                        cls: 'subunit-list',
                                        name: 'subunit',
                                        store: 'contractorsubunit',
                                        columns: [
                                            {
                                                text: 'SubUnidades',
                                                dataIndex: 'subunitdescription',
                                                flex: 1,
                                                renderer: function (value, metaData, record) {
                                                    metaData.style = 'font-size: 14px; font-family: Monda; line-height: 20px;';
                                                    return value;
                                                }
                                            }, {
                                                width: 120,
                                                text: 'Quantidade',
                                                dataIndex: 'shiftstotal',
                                                align: 'right',
                                                renderer: function (value, metaData, record) {
                                                    metaData.style = 'font-size: 14px; font-family: Monda; line-height: 20px;';
                                                    return Smart.maskRenderer('9.999.990,00',true)(value);
                                                }
                                            }
                                        ],
                                        listeners: {
                                            select: 'onSubUnitSelect'
                                        }
                                    }, {
                                        region: 'center',
                                        xtype: 'gridpanel',
                                        hideHeaders: false,
                                        cls: 'additiveshift-edit',
                                        store: 'additiveshift',
                                        columnsRenderer: function (value, metaData, record) {
                                            metaData.style = 'padding-top: 14px; font-size: 16px; font-family: Monda;';
                                            return value;
                                        },
                                        columns: [
                                            {
                                                text: 'Turnos',
                                                width: 88,
                                                renderer: function (value, metaData, record) {
                                                    var hours = record.get('hours'),
                                                        validityof = record.get('validityof').substr(0,5),
                                                        validityto = record.get('validityto').substr(0,5),
                                                        shiftdescription = record.get('shiftdescription');

                                                    metaData.style = 'font-size: 10px; font-family: Monda; background: #e6e6e6;';
                                                    return  '<div class="shift-label"><b>'+ shiftdescription +'</b><br/>'+ validityof + ' - ' + validityto +'</div>' +
                                                        Ext.String.format('<div style="width: 100%;" class="data"><span class="additive-status-l">{0}h</span></div>',hours);
                                                }
                                            }, {
                                                flex: 1,
                                                text: 'SEG',
                                                align: 'right',
                                                dataIndex: 'amountmon',
                                                editor: {
                                                    minValue: 1,
                                                    hideTrigger: true,
                                                    xtype: 'numberfield',
                                                    cls: 'additiveshift-edit'
                                                }
                                            }, {
                                                flex: 1,
                                                text: 'TER',
                                                align: 'right',
                                                dataIndex: 'amounttue',
                                                editor: {
                                                    minValue: 1,
                                                    hideTrigger: true,
                                                    xtype: 'numberfield',
                                                    cls: 'additiveshift-edit'
                                                }
                                            }, {
                                                flex: 1,
                                                text: 'QUA',
                                                align: 'right',
                                                dataIndex: 'amountwed',
                                                editor: {
                                                    minValue: 1,
                                                    hideTrigger: true,
                                                    xtype: 'numberfield',
                                                    cls: 'additiveshift-edit'
                                                }
                                            }, {
                                                flex: 1,
                                                text: 'QUI',
                                                align: 'right',
                                                dataIndex: 'amountthu',
                                                editor: {
                                                    minValue: 1,
                                                    hideTrigger: true,
                                                    xtype: 'numberfield',
                                                    cls: 'additiveshift-edit'
                                                }
                                            }, {
                                                flex: 1,
                                                text: 'SEX',
                                                align: 'right',
                                                dataIndex: 'amountfri',
                                                editor: {
                                                    minValue: 1,
                                                    hideTrigger: true,
                                                    xtype: 'numberfield',
                                                    cls: 'additiveshift-edit'
                                                }
                                            }, {
                                                flex: 1,
                                                text: 'SAB',
                                                align: 'right',
                                                dataIndex: 'amountsat',
                                                editor: {
                                                    minValue: 1,
                                                    hideTrigger: true,
                                                    xtype: 'numberfield',
                                                    cls: 'additiveshift-edit'
                                                }
                                            }, {
                                                flex: 1,
                                                text: 'DOM',
                                                align: 'right',
                                                dataIndex: 'amountsun',
                                                editor: {
                                                    minValue: 1,
                                                    hideTrigger: true,
                                                    xtype: 'numberfield',
                                                    cls: 'additiveshift-edit'
                                                }
                                            }
                                        ],
                                        selModel: 'rowmodel',
                                        plugins: {
                                            ptype: 'rowediting',
                                            clicksToEdit: 2
                                        },
                                        listeners: {
                                            edit: 'onSubUnitEdit'
                                        }
                                    }
                                ]
                            }
                        ]
                    }, {
                        pageIndex: 2,
                        layout: 'fit',
                        xtype: 'panel',
                        cls: 'list-grid',
                        iconCls: "fa fa-list-ol",
                        title: 'Arquivos Anexos',
                        overflowY: 'auto',
                        dockedItems: [
                            {
                                xtype: 'form',
                                name: 'contractdata',
                                layout: 'anchor',
                                bodyStyle: 'padding: 10px 10px 4px 10px',
                                defaults: {
                                    anchor: '100%'
                                },
                                items: [
                                    {
                                        xtype: 'label',
                                        text: 'Arquivos do Contrato / Aditivo',
                                        style: {
                                            color: 'blue;',
                                            fontSize: '14px;'
                                        }
                                    }, {
                                        xtype: 'hiddenfield',
                                        name: 'id'
                                    }, {
                                        xtype: 'hiddenfield',
                                        name: 'contractid'
                                    }, {
                                        fieldLabel: 'Arquivo',
                                        xtype: 'filefield',
                                        name: 'filedata',
                                        useReadColor: true,
                                        tableName: 'contractdata',
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
                                        maxLength: 8,
                                        xtype: 'textfield',
                                        fieldLabel: 'Nome abreviado (8 caracteres no máximo)',
                                        name: 'description'
                                    }, {
                                        allowBlank: false,
                                        fieldLabel: 'Observações',
                                        xtype: 'textareafield',
                                        name: 'observation'
                                    }, {
                                        xtype: 'label',
                                        text: 'Anexos',
                                        style: {
                                            color: 'blue;',
                                            fontSize: '14px;'
                                        }
                                    }
                                ]
                            }
                        ],
                        items: [
                            {
                                xtype: 'dataview',
                                cls: 'contractdata',
                                store: 'contractdata',
                                tpl: new Ext.XTemplate(
                                    '<tpl for=".">',
                                        '<div style="margin-bottom: 10px;" class="thumb-wrap">',
                                            '<img src="{filetype}"/><br/>',
                                        '<span>{contractcode}<br/><b style="color: brown;">{additivecode}</b></span>',
                                        '</div>',
                                    '</tpl>'
                                ),
                                trackOver: true,
                                autoScroll: true,
                                multiSelect: false,
                                overItemCls: 'x-item-over',
                                itemSelector: 'div.thumb-wrap',
                                prepareData: function (data) {
                                    if(data.fileinfo) {
                                        Ext.apply(data, {
                                            filetype: Smart.Resource.getIconFile(data.tablename)
                                        });
                                    }
                                    return data;
                                },
                                listeners: {
                                    itemdblclick: 'onItemDblClick',
                                    render: function (view, eOpts) {
                                        view.tip = Ext.create('Ext.tip.ToolTip', {
                                            target: view.el,
                                            delegate: view.itemSelector,
                                            trackMouse: true,
                                            minWidth: 300,
                                            maxWidth: 500,
                                            dismissDelay: 0,
                                            showDelay: 800,
                                            renderTo: Ext.getBody(),
                                            listeners: {
                                                beforeshow: function updateTipBody(tip) {
                                                    var data = view.getRecord(tip.triggerElement),
                                                        fileinfo = Ext.decode(data.get('fileinfo')),
                                                        fileName = fileinfo.fileName,
                                                        observation = data.get('observation'),
                                                        description = Ext.String.format('<div style="font-family: Monda;"><b>{0}</b><br/>Observações<br/>{1}</div>', fileName, observation);
                                                    tip.update(description);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ];

    }

});