//@charset UTF-8
Ext.define( 'Smart.ux.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.Ajax',
        'Ext.app.ViewController'
    ],

    onAfterRenderPanel: function (panel, eOpts) {
        var me = this,
            button = me.lookupReference('navBtn'),
            menutree = Ext.getStore('modulemenutree');

        button.setPressed();

        me.onToggleNav(button,true);

        menutree.load({
            scope: me,
            params: { module: Smart.moduleName },
            callback: me.callbackUser
        });

    },

    callbackUser: function (options, success, response) {
        var me = this,
            view = me.getView();

        if(success) {
            Ext.Ajax.request({
                scope: me,
                method: 'post',
                url: '../iSterilization/business/Calls/users.php',
                params: {
                    action: 'select',
                    method: 'selectOpened',
                    module: Smart.moduleName
                },
                callback: function (options, success, response) {
                    var result = Ext.decode(response.responseText);

                    if(success && result.success) {
                        var rows = result.rows[0],
                            type = Ext.decode(rows.fileinfo),
                            image = Ext.String.format("data:{0};base64,{1}",type.fileType,rows.filedata);
                        view.down('image[name=filedata]').setSrc(image);
                        view.down('tbtext[name=username]').update(Ext.String.format('<a>{0}</a>',rows.fullname));
                    } else {
                        localStorage.removeItem(Smart.moduleName + 'In');
                        window.location.reload();
                    }
                }

            });
        }
    },

    onComeLogOut: function (button, pressed) {
        var me = this;

        Ext.Msg.confirm('Encerrar a aplicação!', 'Esta aplicação será encerrada após a confirmação! Confirma?',
            function (choice) {
                if (choice === 'yes') {
                    Ext.Ajax.request({
                        scope: me,
                        url: '../iSterilization/business/Calls/users.php',
                        method: 'post',
                        params: {
                            action: 'select',
                            method: 'selectLogout'
                        },
                        callback: function (options, success, response) {
                            if(success) {
                                localStorage.removeItem(Smart.moduleName + 'In');
                                me.redirectTo(Smart.moduleName.toLowerCase());
                                window.location.reload();
                            }
                        }
                    });
                }
            }
        );

    },

    onToggleConfig: function (menuitem) {
        var me = this,
            view = me.getView(),
            treelist = view.down('treelist');

        treelist.setConfig(menuitem.config, menuitem.checked);
    },

    onToggleMicro: function (button, pressed) {
        var me = this,
            view = me.getView(),
            treelist = view.down('treelist'),
            navBtn = this.lookupReference('navBtn'),
            ct = treelist.ownerCt;

        treelist.setMicro(pressed);

        if (pressed) {
            navBtn.setPressed(true);
            navBtn.disable();
            this.oldWidth = ct.width;
            ct.setWidth(44);
        } else {
            ct.setWidth(this.oldWidth);
            navBtn.enable();
        }

        // IE8 has an odd bug with handling font icons in pseudo elements;
        // it will render the icon once and not update it when something
        // like text color is changed via style addition or removal.
        // We have to force icon repaint by adding a style with forced empty
        // pseudo element content, (x-sync-repaint) and removing it back to work
        // around this issue.
        // See this: https://github.com/FortAwesome/Font-Awesome/issues/954
        // and this: https://github.com/twbs/bootstrap/issues/13863
        if (Ext.isIE8) {
            this.repaintList(treelist, pressed);
        }
    },

    onToggleNav: function (button, pressed) {
        var me = this,
            view = me.getView(),
            treelist = view.down('treelist'),
            ct = view.down('panel[name=westpage]');

        treelist.setExpanderFirst(!pressed);
        treelist.setUi(pressed ? 'nav' : null);
        treelist.setHighlightPath(pressed);
        ct[pressed ? 'addCls' : 'removeCls']('treelist-with-nav');

        if (Ext.isIE8) {
            this.repaintList(treelist);
        }
    },

    repaintList: function(treelist, microMode) {
        treelist.getStore().getRoot().cascadeBy(function(node) {
            var item, toolElement;

            item = treelist.getItem(node);

            if (item && item.isTreeListItem) {
                if (microMode) {
                    toolElement = item.getToolElement();

                    if (toolElement && toolElement.isVisible(true)) {
                        toolElement.syncRepaint();
                    }
                }
                else {
                    if (item.element.isVisible(true)) {
                        item.iconElement.syncRepaint();
                        item.expanderElement.syncRepaint();
                    }
                }
            }
        });
    }

});