//@charset UTF-8
Ext.define( 'Ext.overrides.panel.Panel', {
    override: 'Ext.panel.Panel',

    slideSwap: function () {
        if(this.collapsed === false) {
            this.slideHide();
        } else {
            this.slideShow();
        }
    },

    slideHide: function () {
        var me = this,
            slideInDirection,
            ownerCt = me.ownerCt,
            collapseDir = me.collapseDirection,
            floatCls = Ext.baseCSSPrefix + 'border-region-slide-in',
            placeholder = me.getPlaceholder(collapseDir);

        me.isCollapsingOrExpanding = 1;

        me.setHiddenState(true);
        me.collapsed = collapseDir;

        if (placeholder.rendered) {
            if (placeholder.el.dom.parentNode !== me.el.dom.parentNode) {
                me.el.dom.parentNode.insertBefore(placeholder.el.dom, me.el.dom);
            }

            placeholder.hidden = false;
            placeholder.setHiddenState(false);
            placeholder.el.show();
            ownerCt.updateLayout();
        } else {
            ownerCt.insert(ownerCt.items.indexOf(me), placeholder);
        }

        if (me.rendered) {
            me.el.setVisibilityMode(me.placeholderCollapseHideMode);
            me.el.addCls(floatCls);
            placeholder.el.hide();
            placeholder.hide();
            slideInDirection = me.convertCollapseDir(collapseDir);

            me.el.slideOut(slideInDirection, {
                preserveScroll: true,
                duration: Ext.Number.from(true, Ext.fx.Anim.prototype.duration),
                listeners: {
                    afteranimate: function() {
                        me.isCollapsingOrExpanding = 0;
                        me.el.removeCls(floatCls);
                    }
                }
            });
        } else {
            me.isCollapsingOrExpanding = 0;
            if (!me.preventCollapseFire) {
                me.fireEvent('collapse', me);
            }
        }

        return me;
    },

    slideShow: function () {
        var me = this,
            finalPos,
            floatedPos,
            collapseDir = me.collapsed,
            floatCls = Ext.baseCSSPrefix + 'border-region-slide-in',
            center = me.ownerLayout ? me.ownerLayout.centerRegion: null;

        if (me.floatedFromCollapse) {
            floatedPos = me.getPosition(true);
            me.slideOutFloatedPanelBegin();
            me.slideOutFloatedPanelEnd();
            me.floated = false;
        }

        Ext.suspendLayouts();
        me.placeholder.hide();
        me.el.show();
        me.collapsed = false;
        me.setHiddenState(false);

        if (center && !floatedPos) {
            center.hidden = true;
        }

        Ext.resumeLayouts(true);
        center.hidden = false;
        me.el.addCls(floatCls);
        me.isCollapsingOrExpanding = 2;

        if (floatedPos) {
            finalPos = me.getXY();
            me.setLocalXY(floatedPos[0], floatedPos[1]);
            me.setXY([finalPos[0], finalPos[1]], {
                duration: Ext.Number.from(true, Ext.fx.Anim.prototype.duration),
                listeners: {
                    afteranimate: function() {
                        me.el.removeCls(floatCls);
                        me.isCollapsingOrExpanding = 0;
                        me.fireEvent('expand', me);
                    }
                }
            });
        }
        else {
            me.el.hide();
            me.placeholder.hidden = false;
            me.setHiddenState(false);
            me.el.slideIn(me.convertCollapseDir(collapseDir), {
                preserveScroll: true,
                duration: Ext.Number.from(true, Ext.fx.Anim.prototype.duration),
                listeners: {
                    afteranimate: function() {
                        me.el.removeCls(floatCls);
                        me.placeholder.hide();
                        me.updateLayout();
                        me.isCollapsingOrExpanding = 0;
                        me.fireEvent('expand', me);
                    }
                }
            });
        }
        return me;
    }

});