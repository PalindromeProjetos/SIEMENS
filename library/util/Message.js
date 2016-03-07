//@charset UTF-8
Ext.define( 'Smart.util.Message', {

    singleton: true,

    alternateClassName: ['Smart.Msg', 'Smart.Message'],

    get: function (id, msg) {
        return msg;
//        return Smart.App.getName()+'.'+msg;
    },

    getDate: function () {
        var dt = new Date(),
            addZero = function (i) { if (i < 10) { i = '0' + i; } return i; },
            y = addZero(dt.getUTCFullYear()),
            m = addZero(dt.getUTCMonth() + 1),
            d = addZero(dt.getUTCDate()),
            h = addZero(dt.getUTCHours()),
            n = addZero(dt.getUTCMinutes()),
            s = addZero(dt.getUTCSeconds()),
            strDate = Ext.String.format('{0}-{1}-{2} {3}:{4}:{5}', y, m, d, h, n, s);
        return new Date(Date.parse(strDate.replace(/-/g, " ")));
    },

    utf8_encode: function (argString) {

        if (argString === null || typeof argString === 'undefined') {
            return '';
        }

        var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = '',
            start, end, stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128
                );
            } else if ((c1 & 0xF800) != 0xD800) {
                enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            } else { // surrogate pairs
                if ((c1 & 0xFC00) != 0xD800) {
                    throw new RangeError('Unmatched trail surrogate at ' + n);
                }
                var c2 = string.charCodeAt(++n);
                if ((c2 & 0xFC00) != 0xDC00) {
                    throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                }
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.slice(start, stringl);
        }

        return utftext;
    },

    utf8_decode: function (str_data) {
        var tmp_arr = [],
            i = 0,
            ac = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0,
            c4 = 0;

        str_data += '';

        while (i < str_data.length) {
            c1 = str_data.charCodeAt(i);
            if (c1 <= 191) {
                tmp_arr[ac++] = String.fromCharCode(c1);
                i++;
            } else if (c1 <= 223) {
                c2 = str_data.charCodeAt(i + 1);
                tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                i += 2;
            } else if (c1 <= 239) {
                // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
                c2 = str_data.charCodeAt(i + 1);
                c3 = str_data.charCodeAt(i + 2);
                tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            } else {
                c2 = str_data.charCodeAt(i + 1);
                c3 = str_data.charCodeAt(i + 2);
                c4 = str_data.charCodeAt(i + 3);
                c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
                c1 -= 0x10000;
                tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
                tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
                i += 4;
            }
        }

        return tmp_arr.join('');
    },

    // =================== metodos retornando traduções ================== //

    prompt: function (msg,confirmFn, value, scope) {
        Ext.widget('exwindow', {
            title: Smart.Msg.get('msg.Confirmation', 'Confirmação!'),
            width: 500,
            layout: 'fit',
            buttonAlign: 'center',
            defaultFocus: 'promptText',
            buttons: [
                {
                    scope: scope,
                    text: 'Confirma',
                    handler: function(btn) {
                        var win = btn.up('window'),
                            frm = win.down('form'),
                            text = win.down('textfield').getValue();
                    
                        if(!frm.getForm().isValid()) {
                            Smart.Wakeful.showError(Smart.Msg.invalidFields());
                            return false;
                        }
                    
                        confirmFn(text);
                        win.close();
                    }
                }, {
                    text: 'Cancela',
                    handler: function(btn){
                        btn.up('window').close();
                    }
                }
            ],
            items: [
                {
                    xtype: 'form',
                    padding: 10,
                    layout: 'anchor',
                    items: [
                        {
                            fieldLabel: msg,
                            xtype: 'textfield',
                            value: value,
                            anchor: '100%',
                            itemId: 'promptText'
                        }
                    ]
                }
            ]
        }).show();
    },

    question: function (msg,confirmFn) {
        Ext.Msg.show({
            title: this.get('msg.Confirmation', 'Confirmação!'),
            msg: msg,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: confirmFn
        });
    },

    attention: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Attention', 'Atenção!'),
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    },

    warning: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Warning', 'Aviso!'),
            msg: msg,
            buttons: Ext.Msg.CANCEL,
            icon: Ext.Msg.WARNING
        });
    },

    error: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Error', 'Erro!'),
            msg: msg,
            buttons: Ext.Msg.CANCEL,
            icon: Ext.Msg.ERROR
        });
    },

    info: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Information', 'Informação!'),
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    },

    submitFailure: function (form, action) {
        switch (action.failureType) {
            case Ext.form.Action.CLIENT_INVALID:
                this.attention(this.invalidFieldsSubmitted());
                break;
            case Ext.form.Action.CONNECT_FAILURE:
                this.error(this.ajaxFailure());
                break;
            case Ext.form.Action.SERVER_INVALID:
                this.warning(action.result.text);
                break;
        }
    },

    invalidFields: function (args) {
        var msg = this.get('msg.InvalidFields', 'Existem campos que não foram corretamente preenchidos!');
        if (args) {
            this.attention(msg, args[0], args[1]);
            return true;
        } else {
            return msg;
        }
    },

    invalidServer: function () {
        return this.get('msg.InvalidServer', 'Servidor inválido!');
    },

    saving: function () {
        return this.get('msg.Saving', 'Salvando...!');
    },

    loading: function () {
        return this.get('msg.Loading', 'Carregando...!');
    },

    ajaxFailure: function () {
        return this.get('msg.AjaxFailure', 'A comunicação assincrona com o servidor falhou!');
    },

    loadingLibraries: function () {
        return this.get('msg.LoadingLibraries', 'Carregando classes...');
    },
            
    noRecordsToShow: function () {
        return this.get('msg.noRecordsToShow', 'Não há registros a serem exibidos...');
    },

    recordNoSelected: function () {
        return this.get('msg.RecordNoSelected', 'Não existe nenhum registro selecionado!');
    },

    modifyRecordSelected: function () {
        return this.get('msg.ModifyRecordSelected', 'Deseja realmente modificar esse registro?');
    },
    
    deleteRecordSelected: function () {
        return this.get('msg.DeleteRecordSelected', 'Deseja realmente remover esse registro?');
    },

    pleaseWait: function () {
        return this.get('msg.PleaseWait', 'Por favor aguarde');
    },
    
    pleaseInformDescription: function () {
        return this.get('msg.PleaseInformDescription', 'Por favor, informe a descrição!');
    },

    reRegistration: function () {
        return this.get('msg.Re-Registration', 'Você está tentando duplicar um registro que já foi lançado!');
    },

    invalidFieldsSubmitted: function () {
        return this.get('msg.InvalidValues', 'O formulário não pode ser enviado com campos inválidos!');
    },

    pagesLimitExceeded: function () {
        return this.get('msg.PagesLimitExceeded', 'Limite máximo de páginas excedido. Para abrir uma nova feche outra antes!');
    },

    fieldObservation: function () {
        return this.get('msg.fieldObservation', 'É importante o preenchimento da observação para esclarecimentos posteriores!');
    }

});