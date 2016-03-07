//@charset UTF-8
Ext.define( 'Smart.ux.login.LoginController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Smart.util.Message'
    ],

    onComeInSend: function() {
        var me = this,
            view = me.getView(),
            form = view.down('logincomein');

        if(!form.isValid()) {
            return false;
        }

        view.setLoading('Autenticando usuário...');

        form.submit({
            scope: me,
            url: me.url,
            clientValidation: true,
            params: {
                action: 'select',
                method: 'selectComein',
                fields: Ext.encode(['id','username','fullname','password','filedata','fileinfo','isactive'])
            },
            success: me.onComeInSendSuccess,
            failure: me.onFormSubmitFailure
        });

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
    },

    onFormSubmitFailure: function (form, action) {
        var me = this,
            view = me.getView();

        view.setLoading(false);

        Smart.Msg.submitFailure(form, action);
    },

    onComeInSendSuccess: function (form, action) {
        var me = this,
            view = me.getView();

        view.setLoading(false);

        localStorage.setItem(Smart.moduleName + 'In', true);

        view.destroy();

        Ext.create({ xtype: 'app-main' });

    }

});