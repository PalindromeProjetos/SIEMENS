//@charset UTF-8
Ext.define( 'Ext.overrides.picker.Date', {
    override: 'Ext.picker.Date',

    startDay: 1,

    pickerView: 'vwWeek',

    initComponent: function () {

        this.callParent();

        this.on('afterinitevent', this.afterDatePickerInitFn, this);
        this.on('pickerview', this.onPickerViewFn, this);
        this.on('select', this.onSelectFn, this);
    },

    getPickerView: function () {
        return this.pickerView;
    },

    setPickerView: function (pickerView) {
        this.pickerView = pickerView;
        this.afterDatePickerInitFn();
        this.fireEvent('pickerview', this);
    },

    getPickerPeriod: function () {
        var me = this,
            period = {},
            endDate = Ext.Date.format(me.endDate, 'Y-m-d'),
            startDate = Ext.Date.format(me.startDate, 'Y-m-d');

        period.dateOf = startDate;
        period.dateTo = endDate;

        return period;
    },

    afterDatePickerInitFn: function () {
        var dp = undefined;
        this.onSelectFn(dp, this.value);
    },

    onPickerViewFn: function (picker) {
    },

    onSelectFn: function (dp, date) {
        var pv = this.getPickerView(),
            w = date.getDay(),
            d = date.getDate(),
            m = date.getMonth(),
            y = date.getUTCFullYear(),
            toDay = new Date(y, m, d),
            toNex = new Date(y, m, d);

        switch (pv) {
            case 'vwDay':
                toDay.setDate(d);
                toNex.setDate(d);
                break;
            case 'vwWeek':
                toDay.setDate(d - w +1);
                toNex.setDate(d + (6 - w) +1);
                break;
            case 'vwMonth':
                d = Ext.Date.getDaysInMonth(date);
                toDay.setDate(1);
                toNex.setDate(d);
                break;
            default:
                break;
        }

        this.updateDatePicker(toDay, toNex);
    },

    afterRender: function () {
        this.callParent();
        this.fireEvent('afterinitevent', this);
    },

    setRange: function (startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    },

    update: function(date, forceRefresh) {
        var me = this,
            active = me.activeDate;

        if (me.rendered) {
            me.activeDate = date;
            if(!forceRefresh && active && me.el && active.getMonth() == date.getMonth() && active.getFullYear() == date.getFullYear()){
                me.selectedUpdate(date, active);
            } else {
                me.fullUpdate(date, active);
            }
        }

        me.updateRange();

        return me;
    },

    updateRange: function () {
        if (this.startDate && this.endDate) {
            var st = (Ext.Date.clearTime(this.startDate)).getTime();
            var et = (Ext.Date.clearTime(this.endDate)).getTime();

            this.cells.each(function (c) {
                var dt = c.dom.firstChild.dateValue;
                if (st <= dt && dt <= et) {
                    c.addCls('smart-datepicker-selected');
                } else {
                    c.removeCls('smart-datepicker-selected');
                }
            });
        }
    },

    updateDatePicker: function (fromDate, toDate) {
        this.setRange(fromDate, toDate);

        if (fromDate && toDate) {
            var vDate = Ext.Date,
                from = vDate.format(fromDate, 'Y-m-d'),
                dnum = this.getDayOffset(fromDate, toDate);

            if (7 < dnum) {
                var fd = vDate.getFirstDateOfMonth(fromDate);
                var fday = vDate.format(fd, 'Y-m-d');
                from = vDate.format(fromDate, 'Y-m-d');
                if (from != fday) {
                    fd = vDate.add(vDate.getLastDateOfMonth(fromDate), Ext.Date.DAY, 1);
                }
                this.setValue(fd);
            } else {
                this.setValue(fromDate);
            }
        }
    },

    getLastDayOfMonth: function (syear, smonth) {
        return new Date((new Date(syear, smonth, 1)) - 1);
    },

    getDayOffset: function (sday, eday) {
        var vDate = Ext.Date;
        if (!(sday instanceof Date)) {
            sday = vDate.parseDate(sday, 'Y-m-d');
        }
        if (!(eday instanceof Date)) {
            eday = vDate.parseDate(eday, 'Y-m-d');
        }
        var offset = vDate.getElapsed(sday, eday);

        return Math.round(offset / (3600000 * 24));
    }

});