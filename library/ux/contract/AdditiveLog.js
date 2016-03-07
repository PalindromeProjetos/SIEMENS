//@charset UTF-8
Ext.define( 'Smart.ux.contract.AdditiveLog', {
    extend: 'Ext.window.Window',

    title: 'Aditivos do Contrato',

    modal: true,
    autoShow: false,
    showAnimate: true,

    layout: {
        type: 'fit'
    },

    width: 350,
    height: 450,

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                xtype: 'form',
                layout: 'fit',
                bodyStyle: 'padding: 10px 10px 0 10px;',
                items: [
                    {
                        rowLines: false,
                        xtype: 'gridpanel',
                        store: 'additive',
                        columns: [
                            {
                                width: 40,
                                header: '<span style="font-size: 14px;"><i class="icon-lock"></i></span>',
                                renderer: function (value, meta, rec) {
                                    var additivestatus = rec.get('additivestatus');
                                    meta.style = 'height: 25px;';

                                    switch(additivestatus) {
                                        case 'P':
                                            meta.innerCls = 'additive-status-p';
                                            break;
                                        case 'A':
                                            meta.innerCls = 'additive-status-a';
                                            break;
                                        case 'I':
                                            meta.innerCls = 'additive-status-i';
                                            break;
                                    }
                                }
                            }, {
                                flex: 1,
                                header: 'Aditivo',
                                dataIndex: 'additivenumber',
                                renderer: function (value, meta, rec) {
                                    return Smart.maskRenderer('999/9999', false)(rec.get('contractnumber')) + '-' + value;
                                }
                            }, {
                                flex: 1,
                                header: 'Status',
                                dataIndex: 'additivestatusdescription'
                            }, {
                                header: 'Cadastro',
                                width: 80,
                                cls: 'smart-widgetcolumn',
                                xtype: 'widgetcolumn',
                                widget: {
                                    width: 70,
                                    xtype: 'button',
                                    text: 'Editar',
                                    glyph: 0xe85e,
                                    showSmartTheme: 'red',
                                    handler: 'onViewEdit'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },

    buttonAlign: 'center',

    buttons: [
        {
            glyph: 0xe83f,
            showSmartTheme: 'red',
            text: 'Fechar',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ]

});