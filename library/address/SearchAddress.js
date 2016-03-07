//@charset UTF-8
Ext.define( 'Smart.address.SearchAddress', {
    extend: 'Ext.window.Window',

    alias: 'widget.searchaddress',

    requires: [
        'Smart.ux.TextMaskCore',
        'Smart.data.proxy.AjaxBase',
        'Smart.address.TextFieldSearch'
    ],

    title: 'Pesquisar logradouros e localidades',

    width: 880,
    height: 520,
    
    glyph: 0xe804,

    modal: true,
    layout: 'fit',
    autoShow: true,
    showAnimate: true,

    url: null,

    cls: 'panel-frame',

    findedAddress: Ext.emptyFn,
    
    defaultFocus: 'search',

    initComponent: function () {
    	var me = this;

    	me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this,
            store = Ext.create('Ext.data.Store', {
                fields: [
                    { name: 'Localidade' },
                    { name: 'Logradouro' },
                    { name: 'Bairro' },
                    { name: 'CEP' },
                    { name: 'UF' }
                ],

                proxy: {
                    type: 'ajaxbase',
                    url: me.url,
                    extraParams: {
                        query: '',
                        action: 'buscarCep',
                        rows: '{"id":"0"}'
                    }
                }
            });
        
        me.items = [
            {
                xtype: 'gridpanel',
                headerBorders: false,
                hideHeaders: false,
                store: store,
                cls: 'search-grid',
                columns: [
                    {
                        text: 'Logradouro',
                        dataIndex: 'Logradouro',
                        flex: 2
                    }, {
                        text: 'Bairro',
                        dataIndex: 'Bairro',
                        flex: 1
                    }, {
                        text: 'CEP',
                        dataIndex: 'CEP',
                        width: 110,
                        renderer: function (value, metaData, record) {
                            return Smart.TextMask.setMask('99.999-999').mask(value);
                        }
                    }, {
                        text: 'Localidade',
                        dataIndex: 'Localidade',
                        width: 160,
                        renderer: function (value, metaData, record) {
                            return record.get('Localidade') +'-'+ record.get('UF');
                        }
                    }, {
                        xtype: 'actioncolumn',
                        width: 60,
                        align: 'center',
                        iconCls: "fa fa-cloud-download action-delete-color",
                        handler: function (grid, rowIndex, colIndex, actionItem, event, record, row) {
                            var win = grid.up('window');
                            Ext.callback(win.findedAddress, win.scope, [win,record]);
                        }
                    }
                ],
                dockedItems: [
                    {
                        xtype:  'panel',
                        layout: 'hbox',
                        bodyStyle: 'padding: 0 10px 10px 10px;',
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfieldsearch',
                                name: 'search',
                                fieldLabel: 'Buscar'
                            }
                        ]
                    }, {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ]
            }
        ];
    }

});