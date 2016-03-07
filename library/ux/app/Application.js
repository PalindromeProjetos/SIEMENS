//@charset UTF-8
Ext.define( 'Smart.ux.app.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'Ext.app.Application'
    ],

    init: function() {
        var me = this;
        me.initQuickTips();

        Smart.moduleApp = me;
        Smart.moduleName = me.getName();

        Ext.USE_NATIVE_JSON = true;
        Ext.enableAriaButtons = false;
        Ext.setGlyphFontFamily('fontello');
        me.setDefaultToken(Smart.moduleName.toLowerCase());
    },

    launch: function () {
        var me = this,
            loggedIn;

        loggedIn = localStorage.getItem(Smart.moduleName + 'In');

        me.redirectTo(Smart.moduleName.toLowerCase());

        Ext.create({
            xtype: loggedIn ? 'app-main' : 'login'
        });
    },

    onAppUpdate: function () {
        var me = this;
        Ext.Msg.confirm('Atualizar a aplicação', 'Esta aplicação não está atualizada, recarregar?',
            function (choice) {
                if (choice === 'yes') {
                    me.redirectTo(Smart.moduleName.toLowerCase());
                    window.location.reload();
                }
            }
        );
    }

});