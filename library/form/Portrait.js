//@charset UTF-8
Ext.define( 'Smart.form.Portrait', {
    extend: 'Ext.form.Panel',
    
    alias: 'widget.portrait',

    requires: [
        'Smart.util.*',
        'Ext.form.field.*'
    ],

    config: {
        url: null,
        tableName: null
    },

    layout: 'border',

    bodyCls: 'smart-portrait',
    cls: 'smart-background-transparent',

    fileImage: 'smart',

    beFileData: function (image) {
        var me = this,
            fileData = image || Smart.Rss.getFileImage(me.fileImage);

        me.down('image').setSrc(fileData);
    },

    initComponent: function () {
    	var me = this;
        me.buildItems();
        me.callParent();
        me.beFileData();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                region: 'center',
                xtype: 'image'
            }, {
                margin: '5 0 0 0',
                region: 'south',
                xtype: 'container',
                layout: 'hbox',
                defaultType: 'button',
                defaults: {
                    scale: 'small',
                    showSmartTheme: 'sepia'
                },
                items: [
                    {
                        flex: 1,
                        xtype: 'filefield',
                        name: 'filedata',
                        hideLabel: true,
                        buttonOnly: true,
                        buttonConfig: {
                            iconCls: "fa fa-file-image-o",
                            scale: 'small',
                            showSmartTheme: 'sepia',
                            style: {
                                width: "100% !important;"
                            }
                        },
                        accept: 'image/*',
                        buttonText: Ext.emptyText
                    }, {
                        width: 5,
                        xtype: 'splitter'
                    }, {
                        flex: 1,
                        scope: me,
                        iconCls: "fa fa-trash-o",
                        handler: me.removePortrait
                    }
                ]
            }
        ];
    },

    afterRender: function () {
        var me = this;

        if (me.tableName) {
            me.add(Ext.widget('hiddenfield', {name: 'fieldData', value: undefined}));
            me.add(Ext.widget('hiddenfield', {name: 'tableName', value: me.tableName}));
        }

        me.callParent(arguments);
    },

    getRecordId: function () {
        var me = this;

        return me.up('form').down('hiddenfield[name=id]').getValue();
    },

    submitPortrait: function () {
        var me = this;

        if(!me.down('filefield').isModified) return false;

        me.submit({
            scope: me,
            url: me.url,
            params: {
                action: 'upload',
                method: 'saveFile'
            },
            success: function(form, action) {
                me.down('filefield').reset();
                me.down('filefield').isModified = false;
            },
            failure: Smart.Msg.submitFailure
        });
    },

    removePortrait: function () {
        var me = this;

        Ext.Msg.show({
            scope: me,
            title:'Remover conteúdo!',
            message: 'Confirma a operação de remoção?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {

                    me.submit({
                        scope: me,
                        url: me.url,
                        params: {
                            action: 'upload',
                            method: 'nullFile',
                            id: me.getRecordId(),
                            tableName: me.getTableName()
                        },
                        success: function(form, action) {
                            me.down('filefield').reset();
                            me.down('filefield').isModified = false;
                            me.down('image').setSrc(Smart.Rss.getFileImage(me.fileImage));
                        },
                        failure: function(form, action) {
                            console.info(action.result.text);
                        }
                    });
                } 
            }
        });
    }

});