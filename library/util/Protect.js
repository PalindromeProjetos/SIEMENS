//@charset UTF-8
Ext.define( 'Smart.util.Protect', {

    singleton: true,

    alternateClassName: ['Smart.Protect'],
    
    requires: [
        'Smart.util.Cookie',
        'Smart.util.Wakeful'
    ],

    logout: null,
    locked: false,
    
    second: 600, // 10 minutos = 60s * 10
    
    init: function (refresh,timeout,logout) {
        var me = this;

        me.logout = logout;
        me.createCookie();
        me.allowTimeout(timeout);        
    },
    
    setLocked: function () {
        var me = this;
        me.locked = true;
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: me.logout,
            params: { action: 'locked' }
        });
    },

    setLockedUser: function () {
        window._idleSeconds = 600;
    },

    setAccess: function (password) {
        var me = this, result = {};
        Ext.Ajax.request({
            async: false,
            method: 'POST',
            url: me.logout,
            params: { action: 'access', password: password },
            callback: function (options, success, response) {
                result = Ext.decode(response.responseText);
            }
        });
        return result;
    },

    setLogout: function () {
        var me = this;
        Ext.Ajax.request({
            method: 'POST',
            url: me.logout,
            params: { action: 'logout' },
            callback: function() {
                location.reload(true);
            }
        });
    },
    
    createCookie: function () {
        var me = this;
        Ext.Ajax.request({
            scope: me,
            async: false,
            method: 'POST',
            url: me.logout,
            params: { action: 'cookie' },
            callback: function (options, success, response) {
                var result = Ext.decode(response.responseText);
                Smart.Cookie.setParams(result.rows).setCookie();
            }
        });
    },

    allowRefresh: function (refresh) {
        if (!refresh) {
            new Ext.KeyMap(document, {
                key: Ext.EventObject.F5,
                fn: function (keyCode, e) {
                    if (Ext.isIE && !Ext.isIE8) {
                        e.browserEvent.keyCode = 8;
                    }
                    e.stopEvent();
                }
            });
        }
    },
    
    allowTimeout: function (timeout) {
        var me = this;
            window._idleSeconds = 0;
            window._idleTIMEOUT = timeout || me.second;
            setPrompt = function () {
                me.setLocked();
                Smart.Wakeful.showAccess('Seu usuário foi bloqueado, informe a sua senha de acesso!',
                function (e,password) {
                    var result;
                    if (e) {
                        result = me.setAccess(password);
                        if (result.success) {
                            me.locked = false;
                            window._idleSeconds = 0;
                        } else {
                            if (result.errors['attempts'] > 3) {
                                me.setLogout();
                            } else {
                                Ext.defer(setPrompt, 1000);
                            }
                        };
                    } else me.setLogout();
                });
            };
		
        window.setInterval(
            function () {
                window._idleSeconds++;
                if (window._idleSeconds >= window._idleTIMEOUT) {
                    window._idleSeconds = 0;
                    if (!me.locked) {
                        var timerOpt = { startTime: '00:05', timerEnd: setPrompt };
                        Smart.Wakeful.showLogout("Seu usuário será bloqueado em poucos segundos!",
                        function (e) {
                            if (e) {
                                Ext.defer(setPrompt, 1000);
                            } else window._idleSeconds = 0;
                        }, timerOpt);
                    }
                }
            }, 1000
        );
		
        document.onclick = function () {
            window._idleSeconds = 0;
        };

        document.onmousemove = function () {
            window._idleSeconds = 0;
        };

        document.onkeypress = function () {
            window._idleSeconds = 0;
        };
    }

});