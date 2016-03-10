/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('ProductionLabel.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.MessageBox',
        'ProductionLabel.view.main.MainController'
    ],

    controller: 'main',
    viewModel: 'main',

    defaults: {
        tab: {
            iconAlign: 'top'
        },
        styleHtmlContent: true
    },

    tabBarPosition: 'bottom',

    items: [

    ]
});
