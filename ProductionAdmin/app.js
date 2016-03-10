//@charset UTF-8
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Smart.ux': '../library/ux',
        'Smart.app': '../library/app',
        'Smart.plugins': '../library/plugins',
        'Smart.class': '../library/util',
        'Smart.data': '../library/data',
        'Smart.data.field': '../library/data/field',
        'Smart.form': '../library/form',
        'Smart.form.field': '../library/form/field'
    }
});

Ext.application({
    name: 'ProductionAdmin',

    extend: 'ProductionAdmin.Application',

    requires: [
        'ProductionAdmin.view.main.Main'
    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView: 'ProductionAdmin.view.main.Main'
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to ProductionAdmin.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
