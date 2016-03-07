//@charset UTF-8
Ext.define( 'Ext.overrides.data.TreeStore', {
    override: 'Ext.data.TreeStore',

    urlRoute: false,
    autoLoad: false,

    config: {
        url: null,
        extraParams: {
            query: '',
            rows: '{"id":""}',
            fields: Ext.encode([]),
            params: Ext.encode(['text']),
            action: 'select',
            method: 'selectTree'
        }
    },

    getUrl: function() {
        var me = this;

        return me.urlRoute ? (me.urlRoute + me.url) : me.url;
    },

    setUrl: function( value ) {
        var me = this;

        me.url = value;
        me.urlRoute = false;
        me.getProxy().setUrl(value);
        me.getProxy().setApiUrl();

        return me;
    },

    setParams: function (params) {
        var me = this,
            extraParams = me.getExtraParams();

        me.currentPage = 1;
        me.setExtraParams(Ext.Object.merge(extraParams,params));

        return me;
    }

});