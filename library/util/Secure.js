//@charset UTF-8
Ext.define( 'Smart.util.Secure', {

    singleton: true,

    alternateClassName: ['Smart.Secure'],
    
    requires: [
    ],
       
    login: null,    
    
    init: function () {
        var me = this;
        
        me.login = Ext.create('Ext.panel.Panel', {
            width: '100%',
            height: '100%',
            renderTo: 'metro-login',
            bodyStyle: 'background-color: #FF6347;'
        });

        me.hideLogin();
    },
    
    showLogin: function () {
        var me = this;
        
        Ext.getBody().getById('metro-login').show();        

        me.login.getEl().slideIn('t', {
            easing: 'easeOut',
            duration: 200
        });        
    },

    hideLogin: function () {
        var me = this;

        me.login.getEl().slideOut('t', {
            easing: 'easeOut',
            duration: 200,
            remove: false,
            useDisplay: false
        });
        
        Ext.getBody().getById('metro-login').hide();
    }    

});