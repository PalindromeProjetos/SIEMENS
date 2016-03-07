//@charset UTF-8
Ext.define( 'Smart.util.Format', {

    singleton: true,

    alternateClassName: ['Smart.Format'],

    requires: [
        'Smart.TextMaskCore'
    ],

    maskDateSubmit: function () {
        return 'Y-m-d';
    },

    maskTimeFormat: function () {
        return 'g:i a';
    },
    
    maskDateFormat: function () {
        return 'd/m/Y';
    },

    maskDateTimeFormat: function () {
        return this.maskDateFormat() +' '+ this.maskTimeFormat();
    },
    
    maskPhone: function () {
        return '(99) 9999-9999';
    },

    maskDoc01: function () {
        return '999.999.999-99';
    },

    maskDoc03: function () {
        return '99.999.999-9';
    },

    maskDoc04: function () {
        return 'LLL-LL';
    },

    maskFederalunit: function () {
        return 'LL';
    },

    maskZipcode: function () {
        return '99.999-999';
    },
    
    maskRegistrynumber: function () {
        return '999.999-99';
    },
    maskCodeNationalCPF: function () {
        return '999.999.999-99';
    },
    maskCodeNational: function () {
        return '99.999.999/9999-99';
    },
    maskCodeCity: function () {
        return '99.999.999/9999-99';
    },
    maskPercent: function () {
        return '% #0.00';
    },

    document01: function (value, record) {
        var mask = new Smart.TextMask(Smart.Format.maskDoc01(), false);
        return mask.mask(value);
    },

    document03: function (value, record) {
        var mask = new Smart.TextMask(Smart.Format.maskDoc03(), false);
        return mask.mask(value);
    },

    document04: function (value, record) {
        var maskFormat = Smart.Format.maskDoc04(),
            mask = new Smart.TextMask(maskFormat, false);
        return mask.mask(value);
    },

    federalunit: function (value, record) {
        var mask = new Smart.TextMask(Smart.Format.maskFederalunit(), false);
        return mask.mask(value);
    },

    zipcode: function (value, record) {
        var mask = new Smart.TextMask(Smart.Format.maskZipcode(), false);
        return mask.mask(value);
    },

    registrynumber: function (value, record) {
        var mask = new Smart.TextMask(record.get('maskregistrynumber'), false);
        return mask.mask(value);
    },

    phone: function (value, record) {
        var maskFormat = Smart.Format.maskPhone(),
            mask = new Smart.TextMask(maskFormat, false);
        return mask.mask(value);
    },

    id: function(value, record) {
        return Ext.util.Format.leftPad(value,7,'0');
    },

    dateFormat: function(value, record) {
        var me = this;
        //    haveTime = ( value && value.length === 10 ) ? false : true,
        //    dateReadFormat = ( haveTime ) ? me.dateReadFormat +' g:i A' : me.dateReadFormat;
        //
        //if (!value) return '';
        //
        //var dateTime = ( haveTime ) ? value.substring(0, 16) : value.substring(0, 10);
        //
        //return Ext.util.Format.date(Smart.Format.stringToDate(dateTime), dateReadFormat);

        return Ext.util.Format.date(Ext.Date.parse(value,me.dateWriteFormat),me.dateReadFormat);
    },
    
    unmaskZipcode: function (value, record) {
        var mask = new Smart.TextMask(Smart.Format.maskZipcode(), false);
        return mask.unmask(value);
    },
    
    unmaskRegistrynumber: function (value, record) {
        var mask = new Smart.TextMask(record.get('maskregistrynumber'), false);
        return mask.unmask(value);
    },
    
    unmaskPhone: function (value, record) {
        var mask = new Smart.TextMask(Smart.Format.maskPhone(), false);
        return mask.unmask(value);
    },
    
    operatorProduct: function (value, record) {
        var operatorProduct = record.get('operator') + ' - ' + record.get('product');
        return operatorProduct;
    },

    validarCPF: function (cnpj) {
        
    },
    
    dateRenderer: function (format) {
        return function(value) {
            if (!Ext.isString(value)) {
                return null;
            }
            //var aDate = value.split("-"),
            //    nDate = new Date(aDate[0], aDate[1]-1,aDate[2]);
            var nDate = Smart.Format.stringToDate(value);
            return Ext.Date.format(nDate, format);
        };
    },

    /**
    * @website http://www.geradorcnpj.com/javascript-validar-cnpj.htm
    */
    validarCNPJ: function (cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g,'');

        if(cnpj === '') return false;

        if (cnpj.length !== 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (cnpj === "00000000000000" || 
            cnpj === "11111111111111" || 
            cnpj === "22222222222222" || 
            cnpj === "33333333333333" || 
            cnpj === "44444444444444" || 
            cnpj === "55555555555555" || 
            cnpj === "66666666666666" || 
            cnpj === "77777777777777" || 
            cnpj === "88888888888888" || 
            cnpj === "99999999999999")
            return false;

        // Valida DVs
        tamanho = cnpj.length - 2;
        numeros = cnpj.substring(0,tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2) 
              pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== digitos.charAt(0))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== digitos.charAt(1))
              return false;

        return true;

    },

    /**
    * @author Joey Mazzarelli
    * @website http://bitbucket.org/mazzarelli/js-date/
    * @website http://joey.mazzarelli.com/2008/11/25/easy-date-parsing-with-javascript/
    * @copyright Joey Mazzarelli
    * @license BSD license
    */
    stringToDate: (function () {

        var defaults = {
            order: 'MDY',
            strict: false
        };

        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        var abs = ["AM", "PM", "AFTERNOON", "MORNING"];

        var mark = function (str, val) {
            var lval = val.toLowerCase();
            var regex = new RegExp('^' + lval + '|(.*[^:alpha:])' + lval, 'g');
            return str.replace(regex, '$1' + val);
        };

        var normalize = function (str) {
            str = str.toLowerCase();
            str = str.replace(/[^:a-z0-9]/g, '-');
            for (var i = 0; i < months.length; i++) str = mark(str, months[i]);
            for (var i = 0; i < abs.length; i++) str = mark(str, abs[i]);
            str = str.replace(/[a-z]/g, '');
            str = str.replace(/([0-9])([A-Z])/g, '$1-$2');
            str = ('-' + str + '-').replace(/-+/g, '-');
            return str;
        };

        var find_time = function (norm) {
            var obj = { date: norm, time: '' };
            obj.time = norm.replace(
            /^.*-(\d\d?(:\d\d){1,2}(:\d\d\d)?(-(AM|PM))?)-.*$/, '$1');
            if (obj.time === obj.date)
                obj.time = norm.replace(/^.*-(\d\d?-(AM|PM))-.*$/, '$1');
            if (obj.time === obj.date) obj.time = '';
            obj.date = norm.replace(obj.time, '');
            obj.time = ('-' + obj.time + '-').replace(/-+/g, '-');
            obj.date = ('-' + obj.date + '-').replace(/-+/g, '-');
            return obj;
        };

        var find_year = function (norm) {
            var year = null;

            // Check for a 4-digit year
            year = norm.replace(/^.*-(\d\d\d\d)-.*$/, '$1');
            if (year !== norm) return year; else year = null;

            // Check for a 2-digit year, over 32.
            year = norm.replace(/^.*-((3[2-9])|([4-9][0-9]))-.*$/, '$1');
            if (year !== norm) return year; else year = null;

            // Day is always by month, so check for explicit months in
            // first or third spot
            year = norm.replace(/^.*-[A-Z]{3}-\d\d?-(\d\d?)-.*$/, '$1');
            if (year !== norm) return year; else year = null;
            year = norm.replace(/^.*-(\d\d?)-\d\d?-[A-Z]{3}-.*$/, '$1');
            if (year !== norm) return year; else year = null;

            // If all else fails, use the setting for the position of the year.
            var pos = '$3';
            if (defaults.opts.order.charAt(0) === 'Y') pos = '$1';
            else if (defaults.opts.order.charAt(1) === 'Y') pos = '$2';
            year = norm.replace(/^.*-(\d\d?)-([A-Z]{3}|\d{1,2})-(\d\d?)-.*$/, pos);
            if (year !== norm) return year; else year = null;

            return year;
        };

        var find_month = function (norm, year) {
            // Check for an explicity month
            var matches = norm.match(/[A-Z]{3}/);
            if (matches && matches.length) return matches[0];

            // Remove the year, and unless obviously wrong, use order
            // to chose which one to use for month.
            var parts = norm.replace(year + '-', '').split('-');
            if (parts.length !== 4) return null;
            var order = defaults.opts.order;
            var md = order.indexOf('M') < order.indexOf('D') ? 1 : 2;
            return (parseInt(parts[md], 10) <= 12) ? parts[md] : parts[md === 1 ? 2 : 1];
        };

        var find_day = function (norm, year, month) {
            return norm.replace(year, '').replace(month, '').replace(/-/g, '');
        };

        var create_absolute = function (obj) {

            var time = obj.time.replace(/[-APM]/g, '');
            var parts = time.split(':');
            parts[1] = parts[1] || 0;
            parts[2] = parts[2] || 0;
            parts[3] = parts[3] || 0;
            var ihr = parseInt(parts[0], 10);
            if (obj.time.match(/-AM-/) && ihr === 12) parts[0] = 0;
            else if (obj.time.match(/-PM-/) && ihr < 12) parts[0] = ihr + 12;
            parts[0] = ("0" + parts[0]).substring(("0" + parts[0]).length - 2);
            parts[1] = ("0" + parts[1]).substring(("0" + parts[1]).length - 2);
            parts[2] = ("0" + parts[2]).substring(("0" + parts[2]).length - 2);
            time = parts[0] + ":" + parts[1] + ":" + parts[2];
            var millisecs = parts[3];

            var strict = defaults.opts.strict;
            if (!obj.year && !strict) obj.year = (new Date()).getFullYear();
            var year = parseInt(obj.year, 10);
            if (year < 100) {
                year += (year < 70 ? 2000 : 1900);
            }

            if (!obj.month && !strict) obj.month = (new Date()).getMonth() + 1;
            var month = String(obj.month);
            if (month.match(/[A-Z]{3}/)) {
                month = "JAN-FEB-MAR-APR-MAY-JUN-JUL-AUG-SEP-OCT-NOV-DEC-"
              .indexOf(month) / 4 + 1;
            }
            month = ("0" + month).substring(("0" + month).length - 2);
            if (!obj.day && !strict) obj.day = (new Date()).getDate();
            var day = ("0" + obj.day).substring(("0" + obj.day).length - 2);

            var date = new Date();
            date.setTime(Date.parse(year + '/' + month + '/' + day + ' ' + time));
            date.setMilliseconds(millisecs);
            return date;
        };

        var parse = function (norm) {
            return absolute(norm);
        };

        var absolute = function (norm) {
            var obj = find_time(norm);
            obj.norm = norm;
            obj.year = find_year(obj.date);
            obj.month = find_month(obj.date, obj.year);
            obj.day = find_day(obj.date, obj.year, obj.month);
            return create_absolute(obj);
        };

        return function (fuzz, opts) {
            defaults.opts = { order: defaults.order, strict: defaults.strict };
            if (opts && opts.order) defaults.opts.order = opts.order;
            if (opts && opts.strict !== undefined) defaults.opts.strict = opts.strict;
            var date = parse(normalize(fuzz));
            return date;
        };

    })()

});