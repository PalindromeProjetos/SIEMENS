//@charset UTF-8
Ext.define( 'Smart.app.ViewControllerBase', {
    extend: 'Ext.app.ViewController',

    /**
     * For use in afterrender, from ContainerList(pesquisa)
     * @param panel
     * @param eOpts
     */
    onFocusSearch: function (container, eOpts) {
        var me = this;
        me.lookupReference('search').focus(false, 200);
    },

    getDateFormated: function (date, mask) {
        var stringDate = '{0} de {1} de {2}',
            monthNames = [
                "Janeiro", "Fevereiro", "Março",
                "Abril", "Maio", "Junho", "Julho",
                "Agosto", "Setembro", "Outubro",
                "Novembro", "Dezembro"
            ],
            dayNames = [
                "Domingo", "Segunda-Feira", "Terça-Feira",
                "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"
            ],
            day = date.getDate(),
            year = date.getFullYear(),
            monthIndex = date.getMonth();

        return ((mask == 'DAY_NAME') ? (dayNames[date.getDay()] + ', ') : '' ) + Ext.String.format(stringDate, day, monthNames[monthIndex], year);
    },

    onAddressSearchClick: function (search, button) {
        var me = this;

        Ext.widget('searchaddress', {
            url: me.url,
            findedAddress: me.findedAddress, scope: me
        });
    }

});