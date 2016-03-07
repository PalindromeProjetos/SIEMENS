//@charset UTF-8
Ext.define( 'Smart.login.LoginController', {
    extend: 'Ext.app.ViewController',

    onComeInSend: function() {
    },

    onForgotSend: function() {
    },

    onInviteSend: function() {
    },

    onInviteGoView: function () {
        var me = this,
            layout = me.getView().down('container[name=userlogin]').getLayout();
        layout.setActiveItem(2);
    },

    onForgotGoView: function () {
        var me = this,
            layout = me.getView().down('container[name=userlogin]').getLayout();
        layout.setActiveItem(1);
    },

    onComeInGoView: function () {
        var me = this,
            layout = me.getView().down('container[name=userlogin]').getLayout();
        layout.setActiveItem(0);
    }

});