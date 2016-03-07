//@charset UTF-8
Ext.define( 'Ext.overrides.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    minChars: 1,
    pageSize: 10,

    //typeAhead: true,
    selectRecord: false,
    hiddenNameId: false,
    defaultSelect: false,
    selectOnFocus: false,
    readOnlyColor: false,
    triggerAction: 'all',

    collapseOnSelect: false,

    valueField: 'id',
    displayField: 'description',

	configPaging: null,
		
    initComponent: function () {
        var me = this;

        me.callParent();

        me.onAfter( 'focus', me.fnFocus, me);
        me.onBefore( 'select', me.fnSelect, me);
        me.onAfter( 'afterrender', me.fnAfterRender, me);
    },

    fnFocus: function () {
        var me = this;

        me.getEl().frame("yellowgreen");
    },

    fnSelect: function (combo, record, eOpts) {
        var comp = combo.up('component'),
            name = combo.hiddenNameId;

        if (name) {
            comp.down('hiddenfield[name=' + name + ']').setValue(combo.getValue());
        }

    },

    fnAfterRender: function (combo, eOpts) {
        var me = this,
            name = combo.hiddenNameId,
            comp = combo.up('component');

        if (name) {
            comp.add(Ext.widget('hiddenfield', { name: name }));
        }

		if(me.configPaging) {
			try {
				var toolbar = me.getPicker().pagingToolbar;
				if (me.configPaging.hideFirstButton) 		toolbar.down("#first").hide();
				if (me.configPaging.hidePrevButton) 		toolbar.down("#prev").hide();
				if (me.configPaging.hideInputItem) 			toolbar.down("#inputItem").hide();
				if (me.configPaging.hideNextButton) 		toolbar.down("#next").hide();
				if (me.configPaging.hideLastButton) 		toolbar.down("#last").hide();
				if (me.configPaging.hideRefreshButton) 		toolbar.down("#refresh").hide();
				if (me.configPaging.beforePageText != null) toolbar.down("tbtext").setText(me.beforePageText);
			} catch (e) {
				console.info('Nao foi possivel aplicar a configuracao na paginacao!');
			}
		}
		
    },
    
    setValue: function (value, doSelect) {
        var me = this.callParent(arguments);

        if(Ext.isString(value) & !Ext.isNumeric(value)) {
            me.setRawValue(value);
            me.validate();
        }

        return me;
    },

    foundRecord: function () {
        var me = this;
        return me.findRecord(me.valueField,me.getValue());
    }

});