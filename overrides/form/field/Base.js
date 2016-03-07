//@charset UTF-8
Ext.define( 'Ext.overrides.form.field.Base', {
    override: 'Ext.form.field.Base',

    msgTarget: 'qtip',
    labelAlign: 'top',
    labelSeparator: '',

    useLabelBold: true,
    useMondaFont: false,
    useReadColor: false,

    initComponent: function () {
        var me = this;

        me.callParent();

        me.setLabelBold(me.useLabelBold);

        if (me.getXType() == 'displayfield') {
            return false;
        }

        me.setMondaFont(me.useMondaFont);
        me.setReadColor(me.useReadColor);
    },

    /**
     * Muda o Label para Style Bold
     *
     * @param value boolean
     */
    setLabelBold: function ( value ) {
        var me = this,
            labelBold = 'font-weight: bold;';

        if(value) {
            me.labelStyle = me.labelStyle ? (me.labelStyle + labelBold) : labelBold;
        }
    },

    /**
     * Usa Monda Font no componente
     *
     * @param value boolean
     */
    setMondaFont: function ( value ) {
        var me = this;

        if(me.fieldStyle) {
            var fieldStyle = Ext.Object.merge(me.fieldStyle, ( value === true ? { 'font-family' : 'Monda' } : me.fieldStyle ));
            me.setFieldStyle(fieldStyle);
        }
    },

    objectMerge: function (target, source) {
        var me = this;

        if ( typeof target !== 'object' ) {
            target = {};
        }

        for (var property in source) {

            if ( source.hasOwnProperty(property) ) {

                var sourceProperty = source[ property ];

                if ( typeof sourceProperty === 'object' ) {
                    target[ property ] = me.fieldStyleMerge( target[ property ], sourceProperty );
                    continue;
                }

                target[ property ] = sourceProperty;

            }

        }

        for (var a = 2, l = arguments.length; a < l; a++) {
            merge(target, arguments[a]);
        }

        return target;
    },

    /**
     * Atribui ReadOnly e muda a cor de fundo
     *
     * @param value boolean
     */
    setReadColor: function ( value ) {
        var me = this,
            fieldStyle = me.objectMerge(me.fieldStyle,{ 'background-color' : ( value === true ? 'rgba(227, 230, 88, .4)' : '#FFFFFF' ) });

        me.setReadOnly(value);
        me.setFieldStyle(fieldStyle);
    }

});