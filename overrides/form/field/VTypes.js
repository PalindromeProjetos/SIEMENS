//@charset UTF-8
Ext.define( 'Ext.overrides.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',

    time: function (val, field) {
        return /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/.test(val);
    },
    timeText: 'N&#227o &#233 um hor&#225rio v&#225lido. Deve estar no formato "23:59"',
    timeMask: /[\d\s:amp]/i,
    
    IPAddress:  function(val, field) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val);
    },
    IPAddressText: 'Deve ser um endere&#231o IP num&#233rico',
    IPAddressMask: /[\d\.]/i,

    cpf: function (val, field) {
        var Soma, Resto;

        Soma = 0;
        if (val == "00000000000") return false;
        if (val == "11111111111") return false;
        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(val.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(val.substring(9, 10))) return false;
        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(val.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(val.substring(10, 11))) return false;

        return true;
    },
    cpfText: 'Sem CPF v&#225lido. Deve ser um CPF no formato "000.000.000-00"',


    //http://workblog.neteos.eu/180/javascript/extjs/extjs-datefield-select-date-range
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    }

});