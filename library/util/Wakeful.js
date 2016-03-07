//@charset UTF-8
Ext.define( 'Smart.util.Wakeful', {

    alternateClassName: ['Smart.Wakeful'],

    constructor : function() {
        "use strict";

        var me = this,
            alerts = new function () {
                var wakeful   = {},
                    dialogs   = {},
                    isopen    = false,
                    keys      = { ENTER: 13, ESC: 27, SPACE: 32 },
                    queue     = [],
                    getId, btnCancel, btnOK, btnReset, btnResetBack, btnFocus, elCallee, elCover, elDialog, elLog, form, input, getTransitionEvent, counter;

                /**
                 * Markup pieces
                 * @type {Object}
                 */
                dialogs = {
                    buttons : {
                        ok     : "<button class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\">{{ok}}</button>",
                        cancel : "<button class=\"alertify-button alertify-button-cancel\" id=\"alertify-cancel\">{{cancel}}</button>",
                        holder : "<nav class=\"alertify-buttons\">{{buttons}}</nav>",
                        submit : "<button type=\"submit\" class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\">{{ok}}</button>"
                    },
                    login   : "<div class=\"alertify-text-wrapper\"><input type=\"password\" class=\"alertify-text\" id=\"alertify-text\"></div>",
                    input   : "<div class=\"alertify-text-wrapper\"><input type=\"text\" class=\"alertify-text\" id=\"alertify-text\"></div>",
                    count   : "<table width=\"100%\"><tr><td align=center><table><tr><td><div id=\"counter\"></div></td></tr></table></td></tr></table>",
                    message : "<p class=\"alertify-message\">{{message}}</p>",
                    log     : "<article class=\"alertify-log{{class}}\">{{message}}</article>"
                };

                /**
                 * Return the proper transitionend event
                 * @return {String}    Transition type string
                 */
                getTransitionEvent = function () {
                    var t,
                        type,
                        supported   = false,
                        el          = document.createElement("fakeelement"),
                        transitions = {
                            "WebkitTransition" : "webkitTransitionEnd",
                            "MozTransition"    : "transitionend",
                            "OTransition"      : "otransitionend",
                            "transition"       : "transitionend"
                        };

                    for (t in transitions) {
                        if (el.style[t] !== undefined) {
                            type      = transitions[t];
                            supported = true;
                            break;
                        }
                    }

                    return {
                        type      : type,
                        supported : supported
                    };
                };

                /**
                 * Shorthand for document.getElementById()
                 *
                 * @param  {String} id    A specific element ID
                 * @return {Object}       HTML element
                 */
                getId = function (id) {
                    return document.getElementById(id);
                };

                /**
                 * Alerts private object
                 * @type {Object}
                 */
                wakeful = {

                    /**
                     * Labels object
                     * @type {Object}
                     */
                    labels : {
                        ok     : "OK",
                        cancel : "Cancela"
                    },

                    /**
                     * Delay number
                     * @type {Number}
                     */
                    delay : 5000,

                    /**
                     * Whether buttons are reversed (default is secondary/primary)
                     * @type {Boolean}
                     */
                    buttonReverse : false,

                    /**
                     * Which button should be focused by default
                     * @type {String}	"ok" (default), "cancel", or "none"
                     */
                    buttonFocus : "ok",

                    /**
                     * Set the transition event on load
                     * @type {[type]}
                     */
                    transition : undefined,

                    setStyleSheet: function (themeName) {
                        var href = '',
                            toggleCSS = document.getElementById('toggleCSS');

                        if(toggleCSS) {
                            href = toggleCSS ? toggleCSS.href : '';
                            toggleCSS.href = href.replace(/alertify+\.[\w]+\.+css/, 'alertify.'+themeName+'.css');;
                        }
                    },

                    /**
                     * Set the proper button click events
                     *
                     * @param {Function} fn    [Optional] Callback function
                     *
                     * @return {undefined}
                     */
                    addListeners : function (fn) {
                        var hasOK     = (typeof btnOK !== "undefined"),
                            hasCancel = (typeof btnCancel !== "undefined"),
                            hasInput  = (typeof input !== "undefined"),
                            val       = "",
                            self      = this,
                            ok, cancel, common, key, reset;

                        // ok event handler
                        ok = function (event) {
                            if (typeof event.preventDefault !== "undefined") event.preventDefault();
                            common(event);
                            if (typeof input !== "undefined") val = input.value;
                            if (typeof fn === "function") {
                                if (typeof input !== "undefined") {
                                    fn(true, val);
                                }
                                else fn(true);
                            }
                            return false;
                        };

                        // cancel event handler
                        cancel = function (event) {
                            if (typeof event.preventDefault !== "undefined") event.preventDefault();
                            common(event);
                            if (typeof fn === "function") fn(false);
                            return false;
                        };

                        // common event handler (keyup, ok and cancel)
                        common = function (event) {
                            self.hide();
                            self.unbind(document.body, "keyup", key);
                            self.unbind(btnReset, "focus", reset);
                            if (hasOK) self.unbind(btnOK, "click", ok);
                            if (hasCancel) self.unbind(btnCancel, "click", cancel);
                        };

                        // keyup handler
                        key = function (event) {
                            var keyCode = event.keyCode;
                            if ((keyCode === keys.SPACE && !hasInput) || (hasInput && keyCode === keys.ENTER)) ok(event);
                            if (keyCode === keys.ESC && hasCancel) cancel(event);
                        };

                        // reset focus to first item in the dialog
                        reset = function (event) {
                            if (hasInput) input.focus();
                            else if (!hasCancel || self.buttonReverse) btnOK.focus();
                            else btnCancel.focus();
                        };

                        // handle reset focus link
                        // this ensures that the keyboard focus does not
                        // ever leave the dialog box until an action has
                        // been taken
                        this.bind(btnReset, "focus", reset);
                        this.bind(btnResetBack, "focus", reset);
                        // handle OK click
                        if (hasOK) this.bind(btnOK, "click", ok);
                        // handle Cancel click
                        if (hasCancel) this.bind(btnCancel, "click", cancel);
                        // listen for keys, Cancel => ESC
                        this.bind(document.body, "keyup", key);
                        if (!this.transition.supported) this.setFocus();
                    },

                    /**
                     * Bind events to elements
                     *
                     * @param  {Object}   el       HTML Object
                     * @param  {Event}    event    Event to attach to element
                     * @param  {Function} fn       Callback function
                     *
                     * @return {undefined}
                     */
                    bind : function (el, event, fn) {
                        if (typeof el.addEventListener === "function") {
                            el.addEventListener(event, fn, false);
                        } else if (el.attachEvent) {
                            el.attachEvent("on" + event, fn);
                        }
                    },

                    /**
                     * Use alertify as the global error handler (using window.onerror)
                     *
                     * @return {boolean} success
                     */
                    handleErrors : function () {
                        if (typeof document.onerror !== "undefined") {
                            var self = this;
                            document.onerror = function (msg, url, line) {
                                self.error("[" + msg + " on line " + line + " of " + url + "]", 0);
                            };
                            return true;
                        } else {
                            return false;
                        }
                    },

                    /**
                     * Append button HTML strings
                     *
                     * @param {String} secondary    The secondary button HTML string
                     * @param {String} primary      The primary button HTML string
                     *
                     * @return {String}             The appended button HTML strings
                     */
                    appendButtons : function (secondary, primary) {
                        return this.buttonReverse ? primary + secondary : secondary + primary;
                    },

                    /**
                     * Build the proper message box
                     *
                     * @param  {Object} item    Current object in the queue
                     *
                     * @return {String}         An HTML string of the message box
                     */
                    build : function (item) {
                        var html    = "",
                            type    = item.type,
                            message = item.message,
                            css     = item.cssClass || "";

                        html += "<div class=\"alertify-dialog\">";
                        html += "<a id=\"alertify-resetFocusBack\" class=\"alertify-resetFocus\" href=\"#\">Reset Focus</a>";

                        if (wakeful.buttonFocus === "none") html += "<a href=\"#\" id=\"alertify-noneFocus\" class=\"alertify-hidden\"></a>";

                        // doens't require an actual form
                        if (type === "prompt") html += "<div id=\"alertify-form\">";
                        if (type === "access") html += "<div id=\"alertify-form\">";

                        html += "<article class=\"alertify-inner\">";
                        html += dialogs.message.replace("{{message}}", message);

                        if (type === "prompt") html += dialogs.input;
                        if (type === "access") html += dialogs.login;
                        if (type === "logout") html += dialogs.count+"<div class=\"alertify-message\" ></div>";

                        html += dialogs.buttons.holder;
                        html += "</article>";

                        if (type === "prompt") html += "</div>";
                        if (type === "access") html += "</div>";

                        html += "<a id=\"alertify-resetFocus\" class=\"alertify-resetFocus\" href=\"#\">Reset Focus</a>";
                        html += "</div>";

                        switch (type) {
                            case "alert":
                                html = html.replace("{{buttons}}", dialogs.buttons.ok);
                                html = html.replace("{{ok}}", this.labels.ok);
                                break;
                            case "confirm":
                                html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.ok));
                                html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                                break;
                            case "logout":
                                html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.ok));
                                html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                                break;
                            case "prompt":
                                html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.submit));
                                html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                                break;
                            case "access":
                                html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.submit));
                                html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                            default:
                                break;
                        }

                        elDialog.className = "alertify alertify-" + type + " " + css;
                        elCover.className  = "alertify-cover";
                        return html;
                    },

                    /**
                     * Close the log messages
                     *
                     * @param  {Object} elem    HTML Element of log message to close
                     * @param  {Number} wait    [optional] Time (in ms) to wait before automatically hiding the message, if 0 never hide
                     *
                     * @return {undefined}
                     */
                    close : function (elem, wait) {
                        // Unary Plus: +"2" === 2
                        var timer = (wait && !isNaN(wait)) ? +wait : this.delay,
                            self  = this,
                            hideElement, transitionDone;

                        // set click event on log messages
                        this.bind(elem, "click", function () {
                            hideElement(elem);
                        });
                        // Hide the dialog box after transition
                        // This ensure it doens't block any element from being clicked
                        transitionDone = function (event) {
                            event.stopPropagation();
                            // unbind event so function only gets called once
                            self.unbind(this, self.transition.type, transitionDone);
                            // remove log message
                            elLog.removeChild(this);
                            if (!elLog.hasChildNodes()) elLog.className += " alertify-logs-hidden";
                        };
                        // this sets the hide class to transition out
                        // or removes the child if css transitions aren't supported
                        hideElement = function (el) {
                            // ensure element exists
                            if (typeof el !== "undefined" && el.parentNode === elLog) {
                                // whether CSS transition exists
                                if (self.transition.supported) {
                                    self.bind(el, self.transition.type, transitionDone);
                                    el.className += " alertify-log-hide";
                                } else {
                                    elLog.removeChild(el);
                                    if (!elLog.hasChildNodes()) elLog.className += " alertify-logs-hidden";
                                }
                            }
                        };
                        // never close (until click) if wait is set to 0
                        if (wait === 0) return;
                        // set timeout to auto close the log message
                        setTimeout(function () { hideElement(elem); }, timer);
                        self.setStyleSheet('default');
                    },

                    /**
                     * Create a dialog box
                     *
                     * @param  {String}   message        The message passed from the callee
                     * @param  {String}   type           Type of dialog to create
                     * @param  {Function} fn             [Optional] Callback function
                     * @param  {String}   placeholder    [Optional] Default value for prompt input field
                     * @param  {String}   cssClass       [Optional] Class(es) to append to dialog box
                     *
                     * @return {Object}
                     */
                    dialog : function (message, type, fn, placeholder, cssClass) {
                        this.setStyleSheet('bootstrap');
                        // set the current active element
                        // this allows the keyboard focus to be resetted
                        // after the dialog box is closed
                        elCallee = document.activeElement;
                        // check to ensure the alertify dialog element
                        // has been successfully created
                        var check = function () {
                            if ((elLog && elLog.scrollTop !== null) && (elCover && elCover.scrollTop !== null)) return;
                            else check();
                        };
                        // error catching
                        if (typeof message !== "string") throw new Error("message must be a string");
                        if (typeof type !== "string") throw new Error("type must be a string");
                        if (typeof fn !== "undefined" && typeof fn !== "function") throw new Error("fn must be a function");
                        // initialize alertify if it hasn't already been done
                        this.init();
                        check();

                        queue.push({ type: type, message: message, callback: fn, placeholder: placeholder, cssClass: cssClass });
                        if (!isopen) this.setup();

                        if(type === 'logout') this.flipClock(placeholder);

                        return this;
                    },

                    flipClock: function(configs) {
                        var me = this,
                            config = {},
                            digits = [];

                        // Default options
                        var options = {
                            stepTime: 60,
                            // startTime and format MUST follow the same format.
                            // also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
                            format: "dd:hh:mm:ss",
                            startTime: "01:12:32:55",
                            digitImages: 6,
                            digitHeight: 77,
                            digitWidth: 53,
                            timerEnd: function(){},
                            image: "data:image/png;base64,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"
                        };

                        for(config in configs) options[config] = configs[config];

                        // Draw digits in given container
                        var createDigits = function(where)  {
                            var c = 0;

                            // Iterate each startTime digit, if it is not a digit
                            // we'll asume that it's a separator
                            for (var i = 0; i < options.startTime.length; i++) {
                                if (parseInt(options.startTime[i]) >= 0) {
                                    document.elem = document.createElement("div");
                                    document.elem.className = 'cntDigit';
                                    document.elem.id="cnt_" + i;
                                    document.elem.style.height = (options.digitHeight * options.digitImages * 10)+'px';
                                    document.elem.style.cssFloat = 'left';
                                    document.elem.style.background = "url('" + options.image + "')";
                                    document.elem.style.width = options.digitWidth+"px";

                                    digits.push(document.elem);
                                    margin(c, -((parseInt(options.startTime[i]) * options.digitHeight * options.digitImages)));
                                    digits[c].__max = 9;
                                    // Add max digits, for example, first digit of minutes (mm) has 
                                    // a max of 5. Conditional max is used when the left digit has reach
                                    // the max. For example second "hours" digit has a conditional max of 4 
                                    switch (options.format[i]) {
                                        case 'h':
                                            digits[c].__max = (c % 2 === 0) ? 2: 9;
                                            if (c % 2 === 0) digits[c].__condmax = 4;
                                            break;
                                        case 'd': 
                                            digits[c].__max = 9;
                                            break;
                                        case 'm':
                                        case 's':
                                            digits[c].__max = (c % 2 === 0) ? 5: 9;
                                    }
                                    ++c;
                                } else { 
                                    document.elem = document.createElement("div");
                                    document.elem.className = 'cntSeparator';
                                    document.elem.style.cssFloat = 'left';  
                                    document.elem.innerHTML = options.startTime[i];
                                }

                                where.appendChild(document.elem);
                            }
                        };

                        // Set or get element margin
                        var margin = function (elem, val) {
                            if (val !== undefined) return digits[elem].style.marginTop = val + 'px';
                            return parseInt(digits[elem].style.marginTop.replace('px',''));
                        };

                        // Makes the movement. This is done by "digitImages" steps.
                        var moveStep = function(elem,me)  {
                            digits[elem]._digitInitial = -(digits[elem].__max * options.digitHeight * options.digitImages);
                            return function _move() {
                                var mtop = margin(elem) + options.digitHeight;
                                if (mtop === options.digitHeight) {
                                    margin(elem, digits[elem]._digitInitial);
                                    if (elem > 0) moveStep((elem - 1),me)();
                                    else {
                                        clearInterval(document.interval);
                                        for (var i=0; i < digits.length; i++) margin(i, 0);
                                        options.timerEnd();
                                        me.hide();
                                        return;
                                    }
                                    if ((elem > 0) && (digits[elem].__condmax !== undefined) && (digits[elem - 1]._digitInitial === margin(elem - 1)))
                                        margin(elem, -(digits[elem].__condmax * options.digitHeight * options.digitImages));
                                    return;
                                }

                                margin(elem, mtop);

                                if (margin(elem) / options.digitHeight % options.digitImages !== 0) setTimeout(_move, options.stepTime);

                                if (mtop === 0) digits[elem].__ismax = true;
                            };
                        };

                        counter.style.height = options.digitHeight+'px';
                        counter.style.overflow = 'hidden';
                        createDigits(counter);
                        document.interval = setInterval(moveStep((digits.length - 1),me), 1000);
                    },

                    /**
                     * Extend the log method to create custom methods
                     *
                     * @param  {String} type    Custom method name
                     *
                     * @return {Function}
                     */
                    custom : function (type) {
                        if (typeof type !== "string") throw new Error("custom method must have exactly one parameter");
                        return function (message, wait) {
                            this.log(message, type, wait);
                            return this;
                        };
                    },

                    /**
                     * Hide the dialog and rest to defaults
                     *
                     * @return {undefined}
                     */
                    hide : function () {
                        var transitionDone,
                            self = this;
                        // remove reference from queue
                        queue.splice(0,1);
                        // if items remaining in the queue
                        if (queue.length > 0) this.setup(true);
                        else {
                            isopen = false;
                            // Hide the dialog box after transition
                            // This ensure it doens't block any element from being clicked
                            transitionDone = function (event) {
                                event.stopPropagation();
                                // unbind event so function only gets called once
                                self.unbind(elDialog, self.transition.type, transitionDone);
                            };
                            // whether CSS transition exists
                            if (this.transition.supported) {
                                this.bind(elDialog, this.transition.type, transitionDone);
                                elDialog.className = "alertify alertify-hide alertify-hidden";
                            } else {
                                elDialog.className = "alertify alertify-hide alertify-hidden alertify-isHidden";
                            }
                            elCover.className  = "alertify-cover alertify-cover-hidden";
                            // set focus to the last element or body
                            // after the dialog is closed
                            elCallee.focus();

                            // encerra cotagem regressiva
                            if (document.interval) clearInterval(document.interval);
                        }
                    },

                    /**
                     * Initialize Alerts
                     * Create the 2 main elements
                     *
                     * @return {undefined}
                     */
                    init : function () {
                        // ensure legacy browsers support html5 tags
                        document.createElement("nav");
                        document.createElement("article");
                        document.createElement("section");
                        // cover
                        if (getId("alertify-cover") === null) {
                            elCover = document.createElement("div");
                            elCover.setAttribute("id", "alertify-cover");
                            elCover.className = "alertify-cover alertify-cover-hidden";
                            document.body.appendChild(elCover);
                        }
                        // main element
                        if (getId("alertify") === null) {
                            isopen = false;
                            queue = [];
                            elDialog = document.createElement("section");
                            elDialog.setAttribute("id", "alertify");
                            elDialog.className = "alertify alertify-hidden";
                            document.body.appendChild(elDialog);
                        }
                        // log element
                        if (getId("alertify-logs") === null) {
                            elLog = document.createElement("section");
                            elLog.setAttribute("id", "alertify-logs");
                            elLog.className = "alertify-logs alertify-logs-hidden";
                            document.body.appendChild(elLog);
                        }
                        // set tabindex attribute on body element
                        // this allows script to give it focus
                        // after the dialog is closed
                        document.body.setAttribute("tabindex", "0");
                        // set transition type
                        this.transition = getTransitionEvent();
                    },

                    /**
                     * Show a new log message box
                     *
                     * @param  {String} message    The message passed from the callee
                     * @param  {String} type       [Optional] Optional type of log message
                     * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding the log
                     *
                     * @return {Object}
                     */
                    log : function (message, type, wait) {
                        // check to ensure the alertify dialog element
                        // has been successfully created
                        var check = function () {
                            if (elLog && elLog.scrollTop !== null) return;
                            else check();
                        };
                        // initialize alertify if it hasn't already been done
                        this.init();
                        check();

                        elLog.className = "alertify-logs";
                        this.notify(message, type, wait);
                        return this;
                    },

                    /**
                     * Add new log message
                     * If a type is passed, a class name "alertify-log-{type}" will get added.
                     * This allows for custom look and feel for various types of notifications.
                     *
                     * @param  {String} message    The message passed from the callee
                     * @param  {String} type       [Optional] Type of log message
                     * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding
                     *
                     * @return {undefined}
                     */
                    notify : function (message, type, wait) {
                        var log = document.createElement("article");
                        log.className = "alertify-log" + ((typeof type === "string" && type !== "") ? " alertify-log-" + type : "");
                        log.innerHTML = message;
                        // append child
                        elLog.appendChild(log);
                        // triggers the CSS animation
                        setTimeout(function() { log.className = log.className + " alertify-log-show"; }, 50);
                        this.close(log, wait);
                    },

                    /**
                     * Set properties
                     *
                     * @param {Object} args     Passing parameters
                     *
                     * @return {undefined}
                     */
                    set : function (args) {
                        var k;
                        // error catching
                        if (typeof args !== "object" && args instanceof Array) throw new Error("args must be an object");
                        // set parameters
                        for (k in args) {
                            if (args.hasOwnProperty(k)) {
                                this[k] = args[k];
                            }
                        }
                    },

                    /**
                     * Common place to set focus to proper element
                     *
                     * @return {undefined}
                     */
                    setFocus : function () {
                        if (input) {
                            input.focus();
                            input.select();
                        }
                        else btnFocus.focus();
                    },

                    /**
                     * Initiate all the required pieces for the dialog box
                     *
                     * @return {undefined}
                     */
                    setup : function (fromQueue) {
                        var item = queue[0],
                            self = this,
                            transitionDone;

                        // dialog is open
                        isopen = true;
                        // Set button focus after transition
                        transitionDone = function (event) {
                            event.stopPropagation();
                            self.setFocus();
                            // unbind event so function only gets called once
                            self.unbind(elDialog, self.transition.type, transitionDone);
                        };
                        // whether CSS transition exists
                        if (this.transition.supported && !fromQueue) {
                            this.bind(elDialog, this.transition.type, transitionDone);
                        }
                        // build the proper dialog HTML
                        elDialog.innerHTML = this.build(item);
                        // assign all the common elements
                        btnReset  = getId("alertify-resetFocus");
                        btnResetBack  = getId("alertify-resetFocusBack");
                        btnOK     = getId("alertify-ok")     || undefined;
                        btnCancel = getId("alertify-cancel") || undefined;
                        btnFocus  = (wakeful.buttonFocus === "cancel") ? btnCancel : ((wakeful.buttonFocus === "none") ? getId("alertify-noneFocus") : btnOK),
                        input     = getId("alertify-text")   || undefined;
                        form      = getId("alertify-form")   || undefined;
                        counter   = getId("counter")         || undefined;
                        // add placeholder value to the input field
                        if (typeof item.placeholder === "string" && item.placeholder !== "") input.value = item.placeholder;
                        if (fromQueue) this.setFocus();
                        this.addListeners(item.callback);
                    },

                    /**
                     * Unbind events to elements
                     *
                     * @param  {Object}   el       HTML Object
                     * @param  {Event}    event    Event to detach to element
                     * @param  {Function} fn       Callback function
                     *
                     * @return {undefined}
                     */
                    unbind : function (el, event, fn) {
                        if (typeof el.removeEventListener === "function") {
                            el.removeEventListener(event, fn, false);
                        } else if (el.detachEvent) {
                            el.detachEvent("on" + event, fn);
                        }
                    }
                };

                return {
                    alert   : function (message, fn, cssClass) { wakeful.dialog(message, "alert", fn, "", cssClass); return this; },
                    confirm : function (message, fn, cssClass) { wakeful.dialog(message, "confirm", fn, "", cssClass); return this; },
                    logout  : function (message, fn, placeholder, cssClass) { wakeful.dialog(message, "logout", fn, placeholder, cssClass); return this; },
                    prompt  : function (message, fn, placeholder, cssClass) { wakeful.dialog(message, "prompt", fn, placeholder, cssClass); return this; },
                    access  : function (message, fn, placeholder, cssClass) { wakeful.dialog(message, "access", fn, placeholder, cssClass); return this; },
                    success : function (message, wait) { wakeful.log(message, "success", wait); return this; },
                    error   : function (message, wait) { wakeful.log(message, "error", wait); return this; },
                    warning : function (message, wait) { wakeful.log(message, "warning", wait); return this; },
                    log     : function (message, type, wait) { wakeful.log(message, type, wait); return this; },
                    set     : function (args) { wakeful.set(args); },
                    init    : wakeful.init,
                    custom  : wakeful.custom,
                    labels  : wakeful.labels,
                    debug   : wakeful.handleErrors,
                    setStyleSheet : wakeful.setStyleSheet
                };
            };

        // public methods
        me.set = alerts.set;
        me.custom = alerts.custom;
        me.labels = alerts.labels;
        me.setStyleSheet = alerts.setStyleSheet;
        me.showLog = alerts.log;
        me.showAlert = alerts.alert;
        me.showError = alerts.error;
        me.showWarning = alerts.warning;
        me.showLogout = alerts.logout;
        me.showAccess = alerts.access;
        me.showPrompt = alerts.prompt;
        me.showSuccess = alerts.success;
        me.showConfirm = alerts.confirm;
    }

});