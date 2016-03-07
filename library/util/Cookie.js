//@charset UTF-8
Ext.define( 'Smart.util.Cookie', {

    singleton: true,

    alternateClassName: ['Smart.Cookie'],

    requires: [
        'Ext.util.Cookies',
        'Ext.state.CookieProvider'
    ],
    
    _expire: new Date(new Date().getTime()+(1000*60*60*24*30)),

    _params: {
        username: null
    },

    getUsername: function () {
        return Ext.util.Cookies.get('username');
    },

    setClearCookie: function () {
        var me = this, key;
        for (key in me._params) {
            Ext.util.Cookies.clear(key);
        }
    },

    setCookie: function () {
        var me = this, key, value;
        for (key in me._params) {
            value = me._params[key];
            Ext.util.Cookies.set(key, value, me._expire);
        }
    },

    setParams: function (cfg) {
        var me = this, key;
        for (key in cfg) {
            me._params[key] = cfg[key];
        }
        return me;
    }
});