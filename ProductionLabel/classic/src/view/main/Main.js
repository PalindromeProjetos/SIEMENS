//@charset UTF-8
/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('ProductionLabel.view.main.Main', {
    extend: 'Ext.form.Panel',

    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'ProductionLabel.view.main.MainController',
        'ProductionLabel.view.production.Parameter'
        //'ProductionAdmin.view.admin.ProductionLineSearch'
    ],

    controller: 'main',

    layout: 'card',

    items: [
        {
            xtype: 'parameter'
        }, {
            xtype: 'panel',
            title: 'Pagina 2'
        }
    ],
    buttons: [
        {
            text: 'Voltar'
        }, {
            text: 'Avançar',
            handler: function(btn){
                var layout = btn.up('app-main').getLayout(),
                    active = 0;
                ++active;
                layout.setActiveItem(active);
                //active = main.items.indexOf(layout.getActiveItem());
            }
        }
    ]

});
