//@charset UTF-8
Ext.define( 'Smart.ux.main.Main', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.list.Tree',
        'Ext.plugin.Viewport'
    ],

    plugins: 'viewport',

    layout: 'border',

    titleModule: '<a style="color: rgb(11, 72, 107);">{0}</a>',

    viewModel: new Ext.app.ViewModel({
        formulas: {
            selectionText: function(get) {
                var path,
                    selection = get('treelist.selection');

                if (selection) {
                    path = selection.getPath('text');
                    path = path.replace(/^\/Root/, '');
                    return '...' + path;
                } else {
                    return 'Nenhum item selecionado!';
                }

            }
        }
    }),

    bind: {
        html: '<div style="text-align: right; padding-right: 20px; padding-top: 60px;">{selectionText}</div>'
    },

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this,
            title = Ext.String.format(me.titleModule, Smart.moduleName);

        me.items = [
            {
                region: 'west',
                xtype: 'panel',
                name: 'westpage',
                width: 250,

                iconCls: "fa fa-quote-right header-icon",
                title: title,
                header: {
                    cls: 'panel-shadow header-height'
                },
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                scrollable: 'y',
                bodyStyle: 'background-color: #32404e;',
                items: [
                    {
                        ui: 'nav',
                        xtype: 'treelist',
                        store: 'modulemenutree'
                    }
                ]
            }, {
                region: 'center',
                xtype: 'panel',
                name: 'centerpage',
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        cls: 'panel-shadow main-toolbar-height',
                        defaults: {
                            scale: 'medium',
                            showSmartTheme: 'noborder'
                        },
                        items: [
                            {
                                iconCls: 'fa fa-indent',
                                enableToggle: true,
                                reference: 'navBtn',
                                toggleHandler: 'onToggleNav'
                            }, {
                                iconCls: 'fa fa-bars',
                                enableToggle: true,
                                toggleHandler: 'onToggleMicro'
                            }, {
                                xtype: 'tbfill'
                            }, {
                                iconCls: "fa fa-cog",
                                menu: [
                                    {
                                        text: 'Expander Only',
                                        checked: true,
                                        handler: 'onToggleConfig',
                                        config: 'expanderOnly'
                                    }, {
                                        text: 'Single Expand',
                                        checked: false,
                                        handler: 'onToggleConfig',
                                        config: 'singleExpand'
                                    }
                                ]
                            }, {
                                iconCls: 'fa fa-times',
                                showSmartTheme: 'darkred',
                                handler: 'onComeLogOut'
                            }, {
                                xtype: 'splitter'
                            }, {
                                xtype: 'tbtext',
                                name: 'username'
                            }, {
                                xtype: 'splitter'
                            }, {
                                width: 36,
                                height: 36,
                                xtype: 'image',
                                name: 'filedata',
                                src: '',
                                style: {
                                    borderRadius: '50%'
                                }
                            }
                        ]
                    }
                ],
                layout: 'fit',
                cls: 'smart-background',
                bodyStyle: 'padding: 20px 20px 20px 20px',
                defaults: {
                    bodyPadding: 10
                }
            }
        ]

    },

    listeners: {
        afterrender: 'onAfterRenderPanel'
    }

});