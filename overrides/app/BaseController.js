//@charset UTF-8
Ext.define( 'Ext.overrides.app.BaseController', {
    override: 'Ext.app.BaseController',
    
    selectDownFile: function (btn) {
        var me = this,
            rec = btn.getWidgetRecord(),
            str = "{0}?action=select&method=selectDownFile&tableName={1}&queryCode={2}";
        document.location.href = Ext.String.format(str, me.url, btn.tableName, rec.get('id'));
    },

    /**
     * Para submmit form com imagem/arquivo, portrait/filefield
     * @param params
     * @param url
     * @returns {*}
     */
    updateModule: function (params,url) {
        var me = this,
            fm = me.getModuleForm(),
            md = me.getModuleData(),
            values = fm.getValues(),
            record = fm.getRecord(),
            idName = md.getProxy().getIdParam(),
            idValue = fm.getForm().findField(idName).getValue(),
            defaultParams = { action: 'update', rows: Ext.encode(values) };

        if(fm.isValid() === false) {
            Ext.Msg.show({
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.CANCEL,
                title: 'Campos inválidos!',
                msg: 'Existem campos que não foram corretamente preenchidos...'
            });
            return false;
        }

        //if (o.clientValidation === false || fm.isValid()) {
        //    fm.items.each(function (f) {
        //        if (f.el.getValue() == f.emptyText) {
        //            f.el.dom.value = '';
        //        }
        //    });
        //}

        fm.setLoading('Salvando alterações...');

        if(idValue) {
            record.set(values);
            if(md.getModifiedRecords().length === 0) {
                fm.setLoading(false);
                return false;
            }
        } else {
            record = Ext.create(md.getProxy().getModel().getName());
            record.set(values);
            md.add(record);
        }

        if( record.validadeForm(fm.getForm()) === false ) {
            fm.setLoading(false);
            return false;
        }

        return fm.submit({
            scope: me,
            submitEmptyText: false,
            url: url || md.getUrl() || me.url,
            params: Ext.Object.merge(defaultParams,params),
            success: function(form, action) {
                record.commit();
                fm.setLoading(false);
                me._success(form, action);
                me._success = Ext.emptyFn;
            },
            failure: function(form, action) {
                fm.setLoading(false);
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                        break;
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        Ext.Msg.alert('Failure', 'Ajax communication failed');
                        break;
                    case Ext.form.action.Action.SERVER_INVALID:
                        Ext.Msg.alert('Failure', action.result.text);
                        break;
                }
                me._failure(form, action);
                me._failure = Ext.emptyFn;
            }
        });
        
    },

    /**
     * * Para submmit form sem imagem/arquivo, portrait/filefield
     * @returns {*}
     */
    updateRecord: function () {
        var me = this,
            fm = me.getModuleForm(),
            md = me.getModuleData(),
            values = fm.getValues(),
            //values = fm.getValues(false,true),
            record = fm.getForm().getRecord(),
            idName = md.getProxy().getIdParam(),
            idValue = fm.getForm().findField(idName).getValue();

        if(fm.isValid() === false) {

            Ext.Msg.show({
                title: 'Campos inválidos!',
                msg: 'Existem campos que não foram corretamente preenchidos...',
                buttons: Ext.Msg.CANCEL,
                icon: Ext.Msg.WARNING
            });

            return false;
        }

        idValue = (idValue.indexOf('SMART_') == -1) ? idValue : '';

        fm.setLoading('Salvando alterações...');

        if(idValue) {
            record.set(values);
            if(md.getModifiedRecords().length === 0) {
                fm.setLoading(false);
                return false;
            }
        } else {
            record = Ext.create(md.getProxy().getModel().getName());
            record.set(values);
            record.set(idName,idValue);
            md.add(record);
        }

        if( !record.validadeForm(fm.getForm()) ) {
            fm.setLoading(false);
            md.rejectChanges();
            return false;
        }

        return md.sync({
            scope: me,
            success: function (batch, options) {
                var resultSet = batch.getOperations().length != 0 ? batch.operations[0].getResultSet() : null;

                fm.setLoading(false);

                if(options.operations.destroy) {
                    fm.reset();
                }
                
                if(options.operations.create) {
                    var opr = batch.getOperations()[0],
                        rec = opr.getRecords()[0];
                    fm.loadRecord(rec);
                }
                
                if((resultSet !== null) && (resultSet.success)) {
                    me._success(batch, options);
                    me._success = Ext.emptyFn;
                } else {
                    me._failure(batch, options);
                    me._failure = Ext.emptyFn;                    
                }
            },
            failure: function (batch, options) {
                var resultSet = batch.getOperations().length != 0 ? batch.operations[0].getResultSet() : null;

                if(options.operations.create) {
                    md.remove(record);
                }

                fm.setLoading(false);
                me._failure(batch, options);
                me._failure = Ext.emptyFn;
                
                if(resultSet) {
                    Ext.Msg.show({
                        title: 'Operação falhou!',
                        msg: resultSet.getMessage(),
                        buttons: Ext.Msg.CANCEL,
                        icon: Ext.Msg.WARNING
                    });
                }
            }
        });
    },
	
    onHistoryBack: function () {
        history.back();
    },

    /**
    * Private Methods
    */
    _success: Ext.emptyFn,
    _failure: Ext.emptyFn,

    /**
     * @private
     * Retorna um Metodo Get para o selector informado
     * @param {String} selector
     */
    refName: function (selector) {
        var lStr = selector.slice(1),
            fStr = selector.charAt(0);
        return 'get' + fStr.toUpperCase() + lStr;
    },

    /**
     * @private
     * Handle changes in the form's validity. If there are any sub components with
     * formBind=true then they are enabled/disabled based on the new validity.
     * @param {Boolean} valid
     */
    getModuleForm: function () {
        var me = this;
        return me.moduleForm;
    },

    getModuleData: function () {
        var me = this;
        return me.moduleData;
    },
    
    setModuleForm: function (form) {
        var me = this;

        me.moduleForm = form;
        return me.getModuleForm();
    },

    setModuleData: function (data) {
        var me = this;
        me.moduleData = data.isStore ? data : Ext.getStore(data);
        return me.getModuleData();
    }
	
});