//@charset UTF-8
Ext.define( 'Ext.overrides.data.Model', {
    override: 'Ext.data.Model',

    validadeForm: function(formBasic) {
        var me = this,
            errors = me.getBusinessErrors().getItems();

        Ext.each(errors,function(item,index) {
            var field = formBasic.findField(item.field);

            if(field) {
                me.fieldErrors.items[index].fieldLabel = field.fieldLabel;
                field.blankText = item.message;
                field.allowBlank = false;
                field.validate();
                field.allowBlank = true;
            }
        },me);

        if ( errors.length !== 0 ) me.validadeShow();

        return (errors.length === 0) ? true : false;
    },

    toDate: function (value) {
        var parts = value.split('/');
        return new Date(parts[2],parts[1]-1,parts[0]);
    },

    validadeShow: function() {
        var me = this,
            listInvalids = [],
            errorMessage = "",
            message = "<span>{0}{1}</span> <br/>",
            errors = me.fieldErrors.getField();

        Ext.each(errors,function(error) {
            errorMessage += errorMessage.length !== 0 ? "<br/>" : "";
            errorMessage += '<b>'+Ext.String.format(message,error.fieldLabel)+'</b>';
            listInvalids = me.fieldErrors.getByField(error.field);
            Ext.each(listInvalids,function(field) {
                errorMessage += Ext.String.format(message,"  - "+field.message,field.bound.length !== 0 ? "<br/>  - "+field.bound : "");
            });
        });

        Ext.Msg.show({
            width: 400,
            cls: 'smart-theme',
            title: 'Campos inválidos!',
            msg: errorMessage,
            buttons: Ext.Msg.CANCEL,
            icon: Ext.Msg.ERROR
        });
    },

    fieldErrors: new Object({

        length: 0,

        items: [],

        add: function (item) {
            this.length++;
            this.items.push(item);
        },

        getItems: function () {
            return this.items;
        },

        reset: function () {
            this.length = 0;
            this.items = [];
        },

        isValid: function() {
            return this.length === 0;
        },

        getField: function() {
            var me = this,
                item = [],
                temp = [],
                list = me.getItems();

            //criando lista simples
            Ext.each(list,function(each) {
                temp.push(each.field);
            });

            //ordenando lista
            temp.sort();

            //removendo repetidos
            for(i=0;i<list.length;i++){
                if(temp[i] === temp[i+1]) {continue}
                item[item.length] = temp[i];
            }

            //criando lista complexa
            Ext.each(item,function(each,index) {
                Ext.each(list,function(e){
                    if(item[index] === e.field) {
                        item[index] = new Object({ field: e.field, fieldLabel: e.fieldLabel || e.field, bound: e.bound });
                    }
                });
            });

            return item;
        },

        getByField: function(fieldName) {
            var errors = [],
                error, i;

            for (i = 0; i < this.length; i++) {
                error = this.items[i];

                if (error.field === fieldName) {
                    errors.push(error);
                }
            }
            return errors;
        }
    }),

    isBusinessValid: function () {
        return this.getBusinessErrors().isValid();
    },

    getBusinessErrors: function() {
        var me = this,
            validations = me.business,
            validators  = me.checkBusiness,
            length, validation, field, valid, type, i;

        me.fieldErrors.reset();

        if (validations) {
            length = validations.length;

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                valid = validators[type](validation, me.get(field));

                if (!valid) {
                    me.fieldErrors.add({
                        field  : field,
                        bound  : validators[type + 'Bound'](validation),
                        message: validation.message || validators[type + 'Message']
                    });
                }
            }
        }
        return me.fieldErrors;
    },

    checkBusiness: {
        presenceMessage: 'Deve estar presente',
        lengthMessage: 'Está no tamanho errado',
        formatMessage: 'Está no formato errado',
        inclusionMessage: 'Não está incluido na lista de valores aceitáveis',
        exclusionMessage: 'Não forneceu um valor aceitável',
        emailMessage: 'Não forneceu um e-mail válido',
        emailRe: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        presence: function(config, value) {
            if (arguments.length === 1) {
                value = config;
            }
            return !!value || value === 0 || value === false || value === undefined;
        },
        length: function(config, value) {
            if (value === undefined || value === null) {
                return false;
            }
            var length = value.length,
                min    = config.min,
                max    = config.max;
            if ((min && length < min) || (max && length > max)) {
                return false;
            } else {
                return true;
            }
        },
        email: function(config, email) {
            return this.emailRe.test(email);
        },
        format: function(config, value) {
            return !!(config.matcher && config.matcher.test(value));
        },
        inclusion: function(config, value) {
            return config.list && Ext.Array.indexOf(config.list,value) !== -1;
        },
        exclusion: function(config, value) {
            return config.list && Ext.Array.indexOf(config.list,value) === -1;
        },

        emailBound: function (config) {
            return '';
        },
        formatBound: function (config) {
            return '';
        },
        presenceBound: function (config) {
            return '';
        },
        lengthBound: function (config) {
            return Ext.String.format("Tamanho limite: mínimo {0}, máximo {1}",config.min,config.max);
        },
        inclusionBound: function (config) {
            return Ext.String.format("Valores aceitáveis: [{0}]",config.list.toString());
        },
        exclusionBound: function (config) {
            return Ext.String.format("Valores excluidos: [{0}]",config.list.toString());
        }
    }

});