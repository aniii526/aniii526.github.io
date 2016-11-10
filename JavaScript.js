function universalFilter(t, e)
{
    return!!t && (t.constructor == RegExp ? t.test(e) : t.constructor == Array ? t.indexOf(e) !=- 1 : t.constructor == Function ? t(e) : e == t)
}
function TimeoutChain()
{
    this.promise = null, this.lastTimeoutPromise = null
}
function Logger()
{
    this.records = [], this.console = window["chrome"] && window["console"]
}
function UserConfig()
{
    this.data = {};
    var t = function (t)
    {
        return void 0 !== this.data[t] ? this.data[t] : this.props[t]["default"];
    },
    e = function (t, e)
    {
        this.data[t] = e, this.props[t].savable && this.saveConfig();
    },
    i = {};
    for (var n in this.props)
    {
        this.props.hasOwnProperty(n) && (i[n] = {
            enumerable : true, get : t.bind(this, n), set : e.bind(this, n) 
        });
    }
    Object.defineProperties(this, i)
}
function GameConfig()
{
    this.data = {};
    var t = function (t)
    {
        return void 0 !== this.data[t] ? this.data[t] : this.defaultPropValues[t];
    },
    e = {};
    for (var i in this.defaultPropValues)
    {
        this.defaultPropValues.hasOwnProperty(i) && (e[i] = {
            enumerable : true, get : t.bind(this, i) 
        });
    }
    Object.defineProperties(this, e)
}
function GameEvent(t)
{
    this.type = t, this._isPropagating = false
}
function EventDispatcher()
{
    this.listeners = {}, this._currentIndex =- 1, this._eventsToDispatch = []
}
function UIComponent(t)
{
    EventDispatcher.call(this), this.dom = $(t), this.defineCachableProperty("visible", function (t)
    {
        this.dom[t ? "addClass" : "removeClass"]("visible"), this.onVisibilityChangeHandler && this.onVisibilityChangeHandler()
    }
    .bind(this), this.dom.hasClass("visible")), this.onVisibilityChangeHandler = null, this.clientUpdateHandler = null
}
function UILabel(t)
{
    UIComponent.call(this, t), this.defineCachableProperty("html", function (t)
    {
        this.dom[0].innerHTML = String(t)
    }
    .bind(this), this.dom.html()), this.defineCachableProperty("text", function (t)
    {
        this.dom[0].textContent = String(t)
    }
    .bind(this), this.dom.text())
}
function UIButton(t)
{
    UIComponent.call(this, t), this.onClickHandler = null, this.onLongTapHandler = null, this.longTapTimeout = null, 
    this.longTapped = false
}
function UISpinButton(t)
{
    UIButton.call(this, t), this.__auto = false, this.__attention = false, this.__stop = false, Object.defineProperties(this, 
    {
        auto : 
        {
            enumerable : true,
            get : function ()
            {
                return this.__auto;
            },
            set : function (t)
            {
                this.__auto = t, this.dom[this.__auto && !this.__stop ? "addClass" : "removeClass"]("auto");
            }
        },
        attention : 
        {
            enumerable : true,
            get : function ()
            {
                return this.__attention;
            },
            set : function (t)
            {
                this.__attention = t, this.dom[this.__attention ? "addClass" : "removeClass"]("attention");
            }
        },
        stop : 
        {
            enumerable : true,
            get : function ()
            {
                return this.__stop;
            },
            set : function (t)
            {
                this.__stop = t, this.__stop ? (this.dom.removeClass("auto"), this.dom.addClass("stop")) : (this.dom.removeClass("stop"), 
                this.dom[this.__auto ? "addClass" : "removeClass"]("auto"));
            }
        }
    }), this.counter = new UILabel(this.dom.find("> .counter"))
}
function UICheckbox(t)
{
    UIComponent.call(this, t), Object.defineProperties(this, 
    {
        checked : 
        {
            enumerable : true,
            get : function ()
            {
                return this.dom.hasClass("checked");
            },
            set : function (t)
            {
                this.dom[t ? "addClass" : "removeClass"]("checked"), !this.disabledEvents && this.onChangeHandler && this.onChangeHandler(this.checked)
            }
        }
    }), this.disabledEvents = false, this.onChangeHandler = null, this.dom.bind(ui.click, function ()
    {
        this.checked = !this.checked
    }
    .bind(this))
}
function UISlider(t)
{
    UIComponent.call(this, t), this.defineCachableProperty("min", function (t)
    {
        this.refresh()
    }
    .bind(this), 0), this.defineCachableProperty("max", function (t)
    {
        this.refresh()
    }
    .bind(this), 100), this.defineCachableProperty("value", function (t)
    {
        this.refresh(), !this.disabledEvents && this.onChangeHandler && this.onChangeHandler(this.value)
    }
    .bind(this), 0), this.defineCachableProperty("disabledEvents", function (t) {}.bind(this), false);
    var e = false, i = function (t, i)
    {
        e || (i.position.left /= ui.scale, i.position.top = 0, this.value = Math.max(this.min, Math.min(this.max, 
        this.offsetToValue(i.position.left))))
    }
    .bind(this);
    this.thumb = this.dom.find("> .thumb").draggable(
    {
        handle : ".handle", axis : "x", containment : "parent",
        start : function (t, e)
        {
            this.dragging = true
        }
        .bind(this), drag : i,
        stop : function (t, e)
        {
            this.dragging = false, this.refresh()
        }
        .bind(this)
    }).bind("touchstart mousedown", function (t)
    {
        t.stopPropagation()
    }), this.background = this.dom.find("> .background"), this.hitArea = this.dom.find("> .hit-area").bind(ui.touchstart, 
    function (t)
    {
        var i = (t.originalEvent || t).touches;
        if (i && i.length > 1 || this.dragging) {
            return void (e = true);
        }
        e = false;
        var n = ui.getCoord(t, "X") - this.dom.offset().left;
        n /= ui.scale, this.value = Math.max(this.min, Math.min(this.max, Math.round(this.offsetToValue(n)))), 
        this.refresh(true)
    }
    .bind(this)), ui.addEventListener(GameEvent.RESIZE, this.onResize, this), this.progress = this.dom.find("> .progress"), 
    this.onChangeHandler = null
}
function UIController()
{
    EventDispatcher.call(this), this.templateData = {}, this.window = null, this.document = null, this.body = null, 
    Object.defineProperties(this, 
    {
        click : {
            enumerable : true,
            get : function ()
            {
                return "ontouchstart"in document ? "touchend" : "click";
            }
        },
        touchstart : 
        {
            enumerable : true,
            get : function ()
            {
                return "ontouchstart"in document ? "touchstart" : "mousedown";
            }
        },
        touchend : 
        {
            enumerable : true,
            get : function ()
            {
                return "ontouchend"in document ? "touchend touchcancel" : "mouseup";
            }
        },
        touchmove : 
        {
            enumerable : true,
            get : function ()
            {
                return "ontouchmove"in document ? "touchmove" : "mousemove";
            }
        },
        scale : 
        {
            enumerable : true,
            get : function ()
            {
                var t = this.wrapper[0].style.transform || this.wrapper[0].style.webkitTransform;
                return t ? parseFloat(t.match(/scale\((.+?)\)/)[1]) : 1;
            }
        },
        canUseLowResolutionGraphics : 
        {
            enumerable : true,
            get : function ()
            {
                return this.isLowResolution && slotConfig.supportsLowResolutionGraphics;
            }
        },
        graphicsPrefix : 
        {
            enumerable : true,
            get : function ()
            {
                return this.canUseLowResolutionGraphics ? "res/img-low/" : "res/img/";
            }
        }
    }), UIComponent.prototype.defineCachableProperty.call(this, "giftsAvailable", function (t)
    {
        this.body[t ? "addClass" : "removeClass"]("gifts-available")
    }
    .bind(this), false), UIComponent.prototype.defineCachableProperty.call(this, "giftsActive", function (t)
    {
        this.body[t ? "addClass" : "removeClass"]("gifts-active")
    }
    .bind(this), false), UIComponent.prototype.defineCachableProperty.call(this, "pageWaitsForClick", 
    function (t)
    {
        this.body[t ? "addClass" : "removeClass"]("page-waits-for-click")
    }
    .bind(this), false), this.soundRequested = false, this.initialized = false, this.isLowResolution = ENV.iOSDevice && (ENV.isSmallScreenSize || ENV.iPadMini && !ENV.isRetina), 
    this.realityCheckGameStartCallback = null, this.isInRealityCheckMode = false, this.externalEvent = null, 
    this.soundEnable = true, this.uiReady = false, ENV.nativeAndroidBrowser && $(document.body).addClass("nativeAndroidBrowser"), 
    navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 5_\d/i) && $(document.body).addClass("iPad1"), 
    ENV.iOS8 && $("meta[name=apple-mobile-web-app-capable]").attr("content", "no"), ENV.isMobile || $(document.documentElement).addClass("tablet"), 
    ENV.iOSDevice && ($.fn.nodoubletapzoom = function ()
    {
        return $(this).on("touchstart", function t(e) {
            var i = e.timeStamp, n = $(this).data("lastTouch") || i, s = i - n, o = e.originalEvent.touches.length;
            $(this).data("lastTouch", i), !s || s > 500 || o > 1 || (e.preventDefault(), $(this).trigger("click").trigger("click"))
        }), this
    },
    $(window).nodoubletapzoom()), ENV.isUCBrowser ? $("body").addClass("ucbrowser") : ENV.isQQBrowser ? $("body").addClass("qqbrowser") : $("body").addClass("normalbrowser"), 
    ENV.iOSDevice ? $("body").addClass("iosdevice") : ENV.isAndroid ? $("body").addClass("androiddevice") : ENV.isWindows && $("body").addClass("windowsdevice")
}
function UIDialog(t)
{
    UIComponent.call(this, t), UIDialog.instances.push(this)
}
function UIInfoPopup(t)
{
    UIDialog.call(this, t), Object.defineProperty(this, "title", {
        enumerable : true,
        set : function (t)
        {
            this.titleLabel.html = t || "";
        }
    }), Object.defineProperty(this, "message", {
        enumerable : true,
        set : function (t)
        {
            this.messageLabel.html = t || "";
        }
    }), this.titleLabel = new UILabel(this.dom.find("> div [data-title]")), this.messageLabel = new UILabel(this.dom.find("> div [data-message]")), 
    this.textIdClasses = []
}
function UIConfirmPopup(t)
{
    UIDialog.call(this, t), Object.defineProperty(this, "title", 
    {
        enumerable : true,
        set : function (t)
        {
            this.titleLabel.html = t || "", this.titleLabel.dom.parent().css("display", t && t.length ? "block" : "none");
        }
    }), Object.defineProperty(this, "message", {
        enumerable : true,
        set : function (t)
        {
            this.messageLabel.html = t || "";
        }
    }), this.titleLabel = new UILabel(this.dom.find("> div [data-title]")), this.messageLabel = new UILabel(this.dom.find("> div [data-message]")), 
    this.okButton = new UIButton(this.dom.find(".buttons > .ok")), this.cancelButton = new UIButton(this.dom.find(".buttons > .cancel")), 
    this.textIdClasses = []
}
function UICurtain(t)
{
    UIComponent.call(this, t), this.showDuration = 500, this.hideDuration = 500
}
function UISettings(t)
{
    UIDialog.call(this, t), Object.defineProperties(this, 
    {
        musicLevel : 
        {
            enumerable : true,
            get : function ()
            {
                return this.musicLevelSlider.value;
            },
            set : function (t)
            {
                this.musicLevelSlider.value = t;
            }
        },
        sfxLevel : 
        {
            enumerable : true,
            get : function ()
            {
                return this.sfxLevelSlider.value;
            },
            set : function (t)
            {
                this.sfxLevelSlider.value = t;
            }
        },
        autoplayNumber : 
        {
            enumerable : true,
            get : function ()
            {
                return slotConfig.autoplayNumberRange.pickFromRange(this.autoplayNumberSlider.value) || slotConfig.autoplayNumberRange.firstHigher(-1);
            },
            set : function (t)
            {
                var e = 100 / (slotConfig.autoplayNumberRange.length - 1);
                this.autoplayNumberSlider.value = Math.min(100, Math.max(0, Math.round(slotConfig.autoplayNumberRange.indexOf(t) * e)));
            }
        },
        autoplayLossLimit : 
        {
            enumerable : true,
            get : function ()
            {
                var t = 100 / (slotConfig.autoplayLossLimitRange.length + 1), e = Math.round(this.autoplayLossLimitSlider.value / t);
                return e == slotConfig.autoplayLossLimitRange.length + 1 ? ClientData.AUTOPLAY_LOSS_LIMIT_OFF : 0 == e ? 0 : slotConfig.autoplayLossLimitRange[e - 1];
            },
            set : function (t)
            {
                if (t == ClientData.AUTOPLAY_LOSS_LIMIT_OFF) {
                    this.autoplayLossLimitSlider.value = 100;
                }
                else
                {
                    var e = 100 / (slotConfig.autoplayLossLimitRange.length + 1);
                    this.autoplayLossLimitSlider.value = Math.min(100, Math.max(0, Math.round((slotConfig.autoplayLossLimitRange.indexOf(t) + 1) * e)));
                }
            }
        },
        autoplaySingleWinLimit : 
        {
            enumerable : true,
            get : function ()
            {
                var t = 100 / (slotConfig.autoplaySingleWinLimitRange.length + 1), e = Math.round(this.autoplaySingleWinLimitSlider.value / t);
                return e == slotConfig.autoplaySingleWinLimitRange.length + 1 ?- 1 : 0 == e ? 0 : slotConfig.autoplaySingleWinLimitRange[e - 1];
            },
            set : function (t)
            {
                if (t ==- 1) {
                    this.autoplaySingleWinLimitSlider.value = 100;
                }
                else
                {
                    var e = 100 / (slotConfig.autoplaySingleWinLimitRange.length + 1);
                    this.autoplaySingleWinLimitSlider.value = Math.min(100, Math.max(0, Math.round((slotConfig.autoplaySingleWinLimitRange.indexOf(t) + 1) * e)));
                }
            }
        }
    }), this.dom.html(ui.applyTemplate("settings", ui.templateRenderData())), slotConfig.forceDisableSoundEngine && (this.spinSettingsControls = this.dom.find(".settings-group .group:eq(0)").addClass("hidden")), 
    this.spinSettingsControls = this.dom.find(".settings-group:eq(1),h1:eq(1)"), this.defineCachableProperty("spinSettingsVisible", 
    function (t)
    {
        this.spinSettingsControls[t ? "removeClass" : "addClass"]("hidden"), ui.mainMenu.selectedTab = ui.mainMenu.selectedTab
    }
    .bind(this), true), this.defineCachableProperty("autoplaySettingsVisible", function (t)
    {
        t != this._autoplaySettingsVisible && (this._autoplaySettingsVisible = t, this.autoplaySettingElements[t ? "show" : "hide"]())
    }
    .bind(this), true), this.defineCachableProperty("quickspinCheckboxVisible", function (t)
    {
        t != this._quickspinCheckboxVisible && (this._quickspinCheckboxVisible = t, this.quickspinElements[t ? "show" : "hide"]())
    }
    .bind(this), true), this.musicLevelSlider = new UISlider(".music.row .slider"), this.musicIsOnCheckbox = new UICheckbox(this.dom.find(".music.row .checkbox")), 
    this.sfxLevelSlider = new UISlider(".sfx.row > .slider"), this.sfxIsOnCheckbox = new UICheckbox(this.dom.find(".sfx.row .checkbox")), 
    this.quickspinCheckbox = new UICheckbox(this.dom.find(".quickspin.row .checkbox")), this.autoplayNumberLabel = new UILabel("#autoplay-number >  .value"), 
    this.autoplayNumberSlider = new UISlider("#autoplay-number > .slider-group > .slider"), this.autoplayLossLimitLabel = new UILabel(this.dom.find("#autoplay-loss-limit > .value")), 
    this.autoplayLossLimitSlider = new UISlider("#autoplay-loss-limit > .slider-group > .slider"), this.autoplaySingleWinLimitLabel = new UILabel(this.dom.find("#autoplay-single-win-limit > .value")), 
    this.autoplaySingleWinLimitSlider = new UISlider("#autoplay-single-win-limit > .slider-group > .slider"), 
    this.bonusAutoplayCheckbox = new UICheckbox(this.dom.find(".bonus-autoplay.row .checkbox")), this.startAutoplayButton = new UIButton("#start-autoplay-button").onClick(this.onClickStartAutoplayButton.bind(this)), 
    this.lossLimitSettingsGroup = this.dom.find("#autoplay-loss-limit"), this.autoplaySettingsGroup = this.dom.find("#autoplay-number"), 
    this.sfxLevelSlider.min = 0, this.sfxLevelSlider.max = 100, this.sfxLevelSlider.value = 0, this.sfxLevel = userConfig.sfxOn ? userConfig.sfxLevel : 0, 
    this.sfxIsOnCheckbox.checked = userConfig.sfxOn, this.musicLevelSlider.min = 0, this.musicLevelSlider.max = 100, 
    this.musicLevelSlider.value = 0, this.musicLevel = userConfig.musicOn ? userConfig.musicLevel : 0, 
    this.musicIsOnCheckbox.checked = userConfig.musicOn, this.quickspinCheckbox.checked = false, this.autoplayNumberSlider.min = 0, 
    this.autoplayNumberSlider.max = 100, this.autoplayLossLimitSlider.min = 0, this.autoplayLossLimitSlider.max = 100, 
    this.autoplaySingleWinLimitSlider.min = 0, this.autoplaySingleWinLimitSlider.max = 100, this.musicIsOnCheckbox.onChange(this.onMusicIsOnCheckboxToggled.bind(this)), 
    this.quickspinCheckbox.onChange(this.onQuickspinCheckboxToggled.bind(this)), this.sfxIsOnCheckbox.onChange(this.onSfxIsOnCheckboxToggled.bind(this)), 
    this.bonusAutoplayCheckbox.onChange(this.onBonusAutoplayCheckboxToggled.bind(this)), this.musicLevelSlider.onChange(this.onMusicLevelChanged.bind(this)), 
    this.sfxLevelSlider.onChange(this.onSfxLevelChanged.bind(this)), this.autoplayNumberSlider.onChange(this.onAutoplayNumberChanged.bind(this)), 
    this.autoplayLossLimitSlider.onChange(this.onLossLimitChanged.bind(this)), this.autoplaySingleWinLimitSlider.onChange(this.onSingleWinLimitChanged.bind(this)), 
    this.autoplaySettingElements = this.dom.find(".autoplay-settings"), this.quickspinElements = this.dom.find(".quickspin-group"), 
    this.onClientUpdate(this.doOnClientUpdate)
}
function UIGiftList(t)
{
    UIComponent.call(this, t), this.dom.html(ui.applyTemplate("giftSpins", ui.templateRenderData())), 
    this.offerListDom = this.dom.find("> .offers"), this.offerList = null, this.removeFadeDuration = 600, 
    this.highlightedDaysBeforeExpire = 3, serverData.addEventListener(GameEvent.GIFT_SPINS_ACTION, this.onGiftSpinActionComplete, 
    this), this.onClientUpdate(this.onClientUpdateHandler.bind(this))
}
function UIMainMenu(t)
{
    UIDialog.call(this, t), Object.defineProperty(this, "selectedTab", 
    {
        enumerable : true,
        get : function ()
        {
            return this._selectedTab;
        },
        set : function (t)
        {
            this.dom.attr("class", (this.dom.attr("class") || "").replace(/tab-\S+/, "").trim() + " tab-" + t), 
            this.rearrangeTab(t), t == UIMainMenu.TAB_GIFT_SPINS && this.visible && this.giftSpins.onShow(), 
            this._selectedTab = t;
        }
    });
    var e = 
    {
        preventDefault : true, probeType : 2, tap : true, scrollbars : "custom", resizeScrollbars : false, 
        interactiveScrollbars : false, mouseWheel : true, keyBindings : false, scrollX : false, scrollY : true, 
        HWCompositing : false, useTransition : false, useTransform : false
    };
    this.tabs = this.dom.find(".tabs"), this.tabs.find("li").bind(ui.click, this.onTabClick.bind(this)), 
    this.tabContents = this.dom.find(".tab-contents"), this.backButton = new UIButton(this.dom.find(".back-button")).onClick(this.onBackButtonClick.bind(this)), 
    this.settings = new UISettings(this.tabContents.find(".general-settings > .content")), this.infoContainerScrollable = new IScroll(this.tabContents.find(".info").get(0), 
    e), this.infoContainerScrollable.refresh(), this.infoContainerScrollable.disable(), this.infoContainer = this.tabContents.find(".info > .content").html(ui.applyTemplate("info", 
    ui.templateRenderData())), this.payTableContainerScrollable = new IScroll(this.tabContents.find(".paytable").get(0), 
    e), this.payTableContainerScrollable.refresh(), this.payTableContainerScrollable.disable(), this.payTableContainer = this.tabContents.find(".paytable > .content").html(ui.applyTemplate("payTable", 
    ui.templateRenderData())), this.giftSpinsContainerScrollable = new IScroll(this.tabContents.find(".gift-spins").get(0), 
    e), this.giftSpinsContainerScrollable.refresh(), this.giftSpinsContainerScrollable.disable(), this.giftSpins = new UIGiftList(this.tabContents.find(".gift-spins > .content")), 
    this.giftSpins.addEventListener(GameEvent.CONTENT_CHANGED, this.onGiftspinsContentChanged.bind(this)), 
    this.settingsContainerScrollable = new IScroll(this.tabContents.find(".general-settings").get(0), 
    $.extend(true, {}, e, {
        snap : "h1"
    })), this.settingsContainerScrollable.on("scroll", this.settings.refresh.bind(this.settings)), this.settingsContainerScrollable.on("scrollEnd", 
    this.settings.refresh.bind(this.settings)), this.settingsContainerScrollable.refresh(), this.settingsContainerScrollable.disable(), 
    ui.addEventListener(GameEvent.RESIZE, this.rearrangeTab.bind(this, null)), serverData.addEventListener(GameEvent.UPDATE, 
    this.onGameStart, this)
}
function UIBetLines(t)
{
    UIDialog.call(this, t), this.betLabel = new UILabel(this.dom.find(".info-bar > .bet-label > label")), 
    this.betLabel.text = locale.getText("ui", "BET_LINES_BET_LABEL"), this.linesLabel = new UILabel(this.dom.find(".info-bar > .lines-label > label")), 
    this.linesLabel.text = locale.getText("ui", "BET_LINES_LINES_LABEL"), this.betValueContainer = this.dom.find(".info-bar > .bet-label"), 
    this.betValue = new UILabel(this.betValueContainer.find("> .value")), this.linesValueContainer = this.dom.find(".info-bar > .lines-label"), 
    this.linesValue = new UILabel(this.linesValueContainer.find("> .value")), this.bet_indicator = this.dom.find("#bet-indicator"), 
    this.betIndicatorLabel = new UILabel(this.bet_indicator.find("> label")), this.betContainer = this.dom.find("#bet-container"), 
    this.bet_line = this.dom.find("#bet-line"), this.lines_indicator = this.dom.find("#lines-indicator"), 
    this.linesIndicatorLabel = new UILabel(this.lines_indicator.find("> label")), this.linesContainer = this.dom.find("#lines-container"), 
    this.lines_line = this.dom.find("#lines-line"), this.draggable_point = this.dom.find("#draggable-point"), 
    this.point_container = this.dom.find("#point-container"), this.minButton = this.dom.find(".drag-playground > .button-min"), 
    this.maxButton = this.dom.find(".drag-playground > .button-max"), this.bet_indicator.addClass("passive"), 
    this.lines_indicator.addClass("passive"), this.draggable_point.addClass("passive"), this.bet_line.addClass("off"), 
    this.lines_line.addClass("off"), this.aimRight = this.draggable_point.find("> .right"), this.aimLeft = this.draggable_point.find("> .left"), 
    this.aimTop = this.draggable_point.find("> .top"), this.aimBottom = this.draggable_point.find("> .bottom"), 
    this.backButton = new UIButton(this.dom.find("> .buttons > .back-button")).onClick(this.onBackButtonClick.bind(this));
    var e = function (t, e)
    {
        e.position.left = Math.max(0, e.position.left), e.position.top = Math.max(0, e.position.top), 
        e.position.left /= ui.scale, e.position.top /= ui.scale
    }
    .bind(this);
    this.draggable_point.bind(ui.touchstart, function ()
    {
        this.bet_indicator.removeClass("passive").addClass("active"), this.lines_indicator.removeClass("passive").addClass("active"), 
        this.draggable_point.removeClass("passive").addClass("active"), this.bet_line.removeClass("off passive").addClass("active"), 
        this.lines_line.removeClass("off passive").addClass("active"), this.betValueContainer.addClass("active"), 
        this.linesValueContainer.addClass("active")
    }
    .bind(this)).draggable(
    {
        containment : "parent", scroll : false,
        drag : function (t, i)
        {
            e(t, i), this.moveItems(null, i.position.left, i.position.top, true)
        }
        .bind(this),
        stop : function (t, e)
        {
            this.bet_indicator.removeClass("active").addClass("passive"), this.lines_indicator.removeClass("active").addClass("passive"), 
            this.draggable_point.removeClass("active").addClass("passive"), this.bet_line.removeClass("active").addClass("off"), 
            this.lines_line.removeClass("active").addClass("off"), this.betValueContainer.removeClass("active"), 
            this.linesValueContainer.removeClass("active"), this.moveItems(null, e.position.left, e.position.top, 
            true)
        }
        .bind(this)
    });
    var i = function ()
    {
        this.betContainer.css("top", ""), this.bet_indicator.removeClass("active").addClass("passive"), 
        this.bet_line.removeClass("active").addClass("off"), this.lines_line.removeClass("passive").addClass("off"), 
        this.draggable_point.removeClass("active").addClass("passive"), this.betValueContainer.removeClass("active")
    }
    .bind(this), n = function (t, e)
    {
        e.position.left = Math.max(0, e.position.left), e.position.left /= ui.scale, e.position.top /= ui.scale
    }
    .bind(this);
    this.betContainer.bind(ui.touchstart, function ()
    {
        this.bet_indicator.removeClass("passive").addClass("active"), this.bet_line.removeClass("off").addClass("active"), 
        this.lines_line.removeClass("off").addClass("passive"), this.draggable_point.removeClass("passive").addClass("active"), 
        this.betValueContainer.addClass("active")
    }
    .bind(this)).bind(ui.touchend, function ()
    {
        i()
    }).draggable(
    {
        handle : "#bet-indicator", containment : "parent", axis : "x", scroll : false, drag : function (t, 
        e) {
            n(t, e), this.moveItems(this.draggable_point, e.position.left, null, true)
        }
        .bind(this),
        stop : function (t, e)
        {
            i(), this.moveItems(this.draggable_point, e.position.left, null, true)
        }
        .bind(this)
    });
    var s = function ()
    {
        this.linesContainer.css("left", ""), this.lines_indicator.removeClass("active").addClass("passive"), 
        this.lines_line.removeClass("active").addClass("off"), this.bet_line.removeClass("passive").addClass("off"), 
        this.draggable_point.removeClass("active").addClass("passive"), this.linesValueContainer.removeClass("active")
    }
    .bind(this), o = function (t, e)
    {
        e.position.top = Math.max(0, e.position.top), e.position.top /= ui.scale, e.position.left /= ui.scale
    }
    .bind(this);
    this.linesContainer.bind(ui.touchstart, function ()
    {
        this.lines_indicator.removeClass("passive").addClass("active"), this.lines_line.removeClass("off").addClass("active"), 
        this.bet_line.removeClass("off").addClass("passive"), this.draggable_point.removeClass("passive").addClass("active"), 
        this.linesValueContainer.addClass("active")
    }
    .bind(this)).bind(ui.touchend, function ()
    {
        s()
    }).draggable(
    {
        handle : "#lines-indicator", containment : "parent", axis : "y", scroll : false, drag : function (t, 
        e) {
            o(t, e), this.moveItems(this.draggable_point, null, e.position.top, true)
        }
        .bind(this),
        stop : function (t, e)
        {
            s(), this.moveItems(this.draggable_point, null, e.position.top, true)
        }
        .bind(this)
    }), this.minButton.bind(ui.click, this.minButtonPress.bind(this)), this.maxButton.bind(ui.click, this.maxButtonPress.bind(this)), 
    this.pointAnimationObject = $({
        value : 0
    }), this.point_container.bind(ui.click, function (t)
    {
        var e = this.point_container.parent()[0].getBoundingClientRect(), i = getComputedStyle(this.point_container[0]), 
        n = ui.getCoord(t, "X") - e.left - parseFloat(i.borderLeftWidth) * ui.scale, s = ui.getCoord(t, 
        "Y") - e.top - parseFloat(i.borderTopWidth) * ui.scale;
        n /= ui.scale, s /= ui.scale, n = Math.min(Math.max(0, n), this.point_container.width()), s = Math.min(Math.max(0, 
        s), this.point_container.height()), n > this.draggable_point.width() / 2 && s > this.draggable_point.height() / 2 && n < this.point_container.width() - this.draggable_point.width() / 2 && s < this.point_container.height() - this.draggable_point.height() / 2 && this.slideItems(n - this.draggable_point.width() / 2, 
        s - this.draggable_point.height() / 2)
    }
    .bind(this)), ui.window.resize(this.onResize.bind(this))
}
function UIBetSettings(t)
{
    UIDialog.call(this, t), Object.defineProperties(this, 
    {
        betValue : 
        {
            enumerable : true,
            get : function ()
            {
                return 0 == this.betSlider.value ? this.minButton.dom.addClass("extreme") : this.minButton.dom.removeClass("extreme"), 
                100 == this.betSlider.value ? this.maxButton.dom.addClass("extreme") : this.maxButton.dom.removeClass("extreme"), 
                this.betSlider.value
            },
            set : function (t)
            {
                this.betSlider.value = t, 0 == this.betValue ? this.minButton.dom.addClass("extreme") : this.minButton.dom.removeClass("extreme"), 
                100 == this.betValue ? this.maxButton.dom.addClass("extreme") : this.maxButton.dom.removeClass("extreme");
            }
        }
    }), this.dom.bind(ui.click, function (t)
    {
        var e = (t.originalEvent || t).changedTouches;
        e && e.length && (t.originalEvent || t).touches.length || ui.controlActions.proxy(function ()
        {
            this.onBackButtonClick()
        }
        .bind(this))
    }
    .bind(this)), this.dom.find(".drag-playground").bind(ui.click, function (t)
    {
        t.stopPropagation()
    }
    .bind(this)), this.infoTextLabel = new UILabel(this.dom.find(".info-bar > label")), this.infoTextLabel.text = locale.getText("ui", 
    "BET_SETTINGS_INFO"), this.totalBetValueLabel = new UILabel(this.dom.find(".drag-playground > .totalbet-value")), 
    this.totalBetLabel = new UILabel(this.dom.find(".drag-playground > .totalbet-label")), this.totalBetLabel.text = locale.getText("ui", 
    "BET_SETTINGS_TOTAL_BET_LABEL"), this.lineBetValueLabel = new UILabel(this.dom.find(".drag-playground > .linebet-value")), 
    this.addExtraText(), this.betSlider = new UISlider(".drag-playground > .bet-slider-group > .slider"), 
    this.betSlider.dom.bind(ui.touchstart, function ()
    {
        this.totalBetValueLabel.dom.addClass("active")
    }
    .bind(this)).bind(ui.touchend, function ()
    {
        var t = Math.round(this.betSlider.value / 100 * (slotConfig.coins.length - 1));
        0 == t ? (this.betSlider.disabledEvents = true, this.betSlider.value = this.betSlider.min, this.betSlider.disabledEvents = false, 
        this.minButton.dom.addClass("extreme")) : t == slotConfig.coins.length - 1 && (this.betSlider.disabledEvents = true, 
        this.betSlider.value = this.betSlider.max, this.betSlider.disabledEvents = false, this.maxButton.dom.addClass("extreme")), 
        setTimeout(function ()
        {
            this.totalBetValueLabel.dom.removeClass("active")
        }
        .bind(this), 100)
    }
    .bind(this)), this.betSlider.onChange(this.updateBetSlider.bind(this)), this.minButton = new UIButton(this.dom.find("> .drag-playground > .bet-slider-group > .button-min")).onClick(function ()
    {
        var t = Math.round(this.betValue / 100 * (slotConfig.coins.length - 1));
        t > 0 && t--, this.setBet(slotConfig.coins[t]), this.onResize()
    }
    .bind(this)).onLongTap(function ()
    {
        function t()
        {
            i > 0 && !e.minButton.stop ? (i--, e.setBet(slotConfig.coins[i]), e.onResize()) : clearInterval(n)
        }
        var e = this, i = Math.round(this.betValue / 100 * (slotConfig.coins.length - 1)), n = setInterval(t.bind(this), 
        30)
    }
    .bind(this)), this.minButton.stop = false, this.minButton.dom.bind(ui.touchstart, function ()
    {
        this.totalBetValueLabel.dom.addClass("active"), this.minButton.stop = false
    }
    .bind(this)).bind(ui.touchend, function ()
    {
        this.minButton.stop = true, setTimeout(function ()
        {
            this.totalBetValueLabel.dom.removeClass("active")
        }
        .bind(this), 200)
    }
    .bind(this)), this.maxButton = new UIButton(this.dom.find("> .drag-playground > .bet-slider-group > .button-max")).onClick(function ()
    {
        var t = Math.round(this.betValue / 100 * (slotConfig.coins.length - 1));
        t < slotConfig.coins.length - 1 && t++, this.setBet(slotConfig.coins[t]), this.onResize()
    }
    .bind(this)).onLongTap(function ()
    {
        function t()
        {
            e < slotConfig.coins.length - 1 && !i.maxButton.stop ? (e++, i.setBet(slotConfig.coins[e]), 
            i.onResize()) : clearInterval(n)
        }
        var e = Math.round(this.betValue / 100 * (slotConfig.coins.length - 1)), i = this, n = setInterval(t.bind(this), 
        30)
    }
    .bind(this)), this.maxButton.stop = false, this.maxButton.dom.bind(ui.touchstart, function ()
    {
        this.totalBetValueLabel.dom.addClass("active"), this.maxButton.stop = false
    }
    .bind(this)).bind(ui.touchend, function ()
    {
        this.maxButton.stop = true, setTimeout(function ()
        {
            this.totalBetValueLabel.dom.removeClass("active")
        }
        .bind(this), 200)
    }
    .bind(this)), this.backButton = new UIButton(this.dom.find("> .buttons > .back-button")).onClick(this.onBackButtonClick.bind(this)), 
    this.betValue = 0
}
function UIAutoplaySettings(t)
{
    UIDialog.call(this, t), Object.defineProperties(this, 
    {
        autoplayNumber : 
        {
            enumerable : true,
            get : function ()
            {
                return slotConfig.autoplayNumberRange.pickFromRange(this.autoplayNumberSlider.value) || slotConfig.autoplayNumberRange.firstHigher(-1);
            },
            set : function (t)
            {
                var e = 100 / (slotConfig.autoplayNumberRange.length - 1);
                this.autoplayNumberSlider.value = Math.min(100, Math.max(0, Math.round(slotConfig.autoplayNumberRange.indexOf(t) * e)));
            }
        },
        autoplayLossLimit : 
        {
            enumerable : true,
            get : function ()
            {
                var t = 100 / (slotConfig.autoplayLossLimitRange.length + 1), e = Math.round(this.autoplayLossLimitSlider.value / t);
                return e == slotConfig.autoplayLossLimitRange.length + 1 ? ClientData.AUTOPLAY_LOSS_LIMIT_OFF : 0 == e ? 0 : slotConfig.autoplayLossLimitRange[e - 1];
            },
            set : function (t)
            {
                if (t == ClientData.AUTOPLAY_LOSS_LIMIT_OFF) {
                    this.autoplayLossLimitSlider.value = 100;
                }
                else
                {
                    var e = 100 / (slotConfig.autoplayLossLimitRange.length + 1);
                    this.autoplayLossLimitSlider.value = Math.min(100, Math.max(0, Math.round((slotConfig.autoplayLossLimitRange.indexOf(t) + 1) * e)));
                }
            }
        }
    }), this.dom.bind(ui.touchstart, function (t)
    {
        this.isInputDown = true
    }
    .bind(this)), this.dom.bind(ui.click, function (t)
    {
        var e = (t.originalEvent || t).changedTouches;
        e && e.length && (t.originalEvent || t).touches.length || !this.isInputDown || (this.isInputDown = false, 
        this.onBackButtonClick())
    }
    .bind(this)), this.dom.children().bind(ui.touchstart + " " + ui.touchend, function (t)
    {
        this.isInputDown = false, t.preventDefault()
    }
    .bind(this)), this.infoTextLabel = new UILabel(this.dom.find(".info-bar > label")), this.infoTextLabel.text = locale.getText("ui", 
    "AUTOPLAY_SETTINGS_INFO"), this.advancedSettingsLable = new UILabel(this.dom.find(".drag-playground > .buttons-group > .advanced-settings-lable")), 
    this.advancedSettingsLable.text = locale.getText("ui", "AUTOPLAY_SETTINGS_ADVANCED_BUTTON_LABEL"), 
    this.autoplayLabel = new UILabel(this.dom.find(".drag-playground > .autoplay-label")), this.autoplayLabel.text = locale.getText("ui", 
    "AUTOPLAY_SETTINGS_LABEL"), this.autoplaySettingsGroup = this.dom.find("#autoplay-number-setting"), 
    this.lossLimitSettingsGroup = this.dom.find("#loss-limit-setting"), this.autoplayNumberLabel = new UILabel(this.dom.find("#autoplay-number-setting > .slider-group > .label")), 
    this.autoplayNumberLabel.text = locale.getText("ui", "AUTOPLAY_SETTINGS_NUMBER_LABEL"), this.autoplayLossLimitLabel = new UILabel(this.dom.find("#loss-limit-setting > .slider-group > .label")), 
    this.autoplayLossLimitLabel.text = locale.getText("ui", "AUTOPLAY_SETTINGS_LOSS_LIMIT_LABEL"), this.autoplayNumberValueLabel = new UILabel(this.dom.find("#autoplay-number-setting > .value")), 
    this.autoplayNumberValueLabel.text = 100, this.lossLimitValueLabel = new UILabel(this.dom.find("#loss-limit-setting > .value")), 
    this.lossLimitValueLabel.text = 100, this.autoplayNumberSlider = new UISlider("#autoplay-number-setting > .slider-group > .slider"), 
    this.autoplayNumberSlider.onChange(this.onAutoplayNumberChanged.bind(this)), this.autoplayLossLimitSlider = new UISlider("#loss-limit-setting > .slider-group > .slider"), 
    this.autoplayLossLimitSlider.onChange(this.onLossLimitChanged.bind(this)), this.autoplayNumberSlider.min = 0, 
    this.autoplayNumberSlider.max = 100, this.autoplayLossLimitSlider.min = 0, this.autoplayLossLimitSlider.max = 100, 
    this.advancedButton = new UIButton(this.dom.find(".drag-playground > .buttons-group").children()).onClick(this.onAdvancedButtonClick.bind(this)), 
    this.helpButton = new UIButton(this.dom.find(".drag-playground > .buttons-group > .help")).onClick(this.onHelpButtonClick.bind(this)), 
    this.helpButton.visible = false, this.startAutoplayButton = new UIButton(this.dom.find("> .buttons > .start-autoplay-button")).onClick(this.onAutoplayButtonClick.bind(this)), 
    this.backButton = new UIButton(this.dom.find("> .buttons > .back-button")).onClick(this.onBackButtonClick.bind(this)), 
    this.onClientUpdate(this.doOnClientUpdate.bind(this)), this.ignoreNewGiftOffer = false
}
function UISpinMenu(t, e, i, n)
{
    UIDialog.call(this, t), this.onShowHandler = null, this.onHideHandler = null, this.startConfig = 
    {
        quick : false, auto : false,
        toString : function ()
        {
            return (this.auto ? "<b>auto</b>" : "auto") + " " + (this.quick ? "<b>quick</b>" : "quick");
        }
    },
    this.tapStyle = !!i, this.withoutAutoQuickButton = !!n, this.defineCachableProperty("quickVisible", 
    function (t)
    {
        this.dom[t ? "addClass" : "removeClass"]("quick")
    }
    .bind(this), this.dom.hasClass("quick")), this.defineCachableProperty("autoVisible", function (t)
    {
        this.spinButton.auto = t, this.dom[t ? "addClass" : "removeClass"]("auto")
    }
    .bind(this), this.dom.hasClass("quick")), this.defineCachableProperty("attentionVisible", function (t)
    {
        this.spinButton.attention = t, this.dom[t ? "addClass" : "removeClass"]("attention")
    }
    .bind(this), this.dom.hasClass("quick")), this.defineCachableProperty("expanded", function (t)
    {
        this.dom[t ? "addClass" : "removeClass"]("expanded"), t || (this.dom.attr("class", this.dom.attr("class").split(/\s+/).filter(function (t)
        {
            return!/step-\d+/.test(t)
        }).join(" ")), this.dom.removeClass("non-animated"))
    }
    .bind(this), this.dom.hasClass("expanded")), this.config = $.extend(true, {},
    this.startConfig), this.spinButton = new UISpinButton(e).onClick(function (t)
    {
        (this.expanded || this.attentionVisible) && this.doHide(), t && t.preventDefault(), userConfig.autoSpinEnabled && clientData.autoplayActive ? (this.stopAutoPlay(), 
        this.soundAutoSpinStop()) : userConfig.autoSpinEnabled ? (clientData.startAutoplay(), this.soundAutoSpin(), 
        systemLoader.sendAnalyticsData("spin", userConfig.quickSpinEnabled ? "quick_auto" : "auto")) : (clientData.spin(), 
        this.soundSpin(), systemLoader.sendAnalyticsData("spin", userConfig.quickSpinEnabled ? "quick" : "common"))
    }
    .bind(this)).onLongTap(this.show.bind(this)), this.onClientUpdate(function (t)
    {
        if (!this.expanded)
        {
            t.diff && void 0 != t.diff.autoplayActive && (userConfig.autoSpinEnabled = clientData.autoplayActive || serverData.hasBonusWins() && clientData.autoplayRemains > 0, 
            this.spinButton.stop = clientData.autoplayActive && userConfig.autoSpinEnabled), this.autoVisible = userConfig.autoSpinEnabled, 
            this.showIfNeeded();
            var e = $.extend(true, {
                showCounter : true
            },
            this.customParams());
            this.spinButton.counter.text = e.showCounter ? clientData.getCurrentGiftOffer() ? clientData.getCurrentGiftOffer().spinsLeft : clientData.autoplayRemains : "";
        }
    }
    .bind(this)), this.quickVisible = userConfig.quickSpinEnabled, this.autoVisible = userConfig.autoSpinEnabled, 
    this.autoButton = this.dom.find(".auto.button"), this.quickButton = this.dom.find(".quick.button"), 
    this.autoQuickButton = this.dom.find(".auto-quick.button"), this.satelliteButtons = [this.autoButton[0], 
    this.quickButton[0]], this.withoutAutoQuickButton ? this.dom.addClass("no-plus") : this.satelliteButtons.push(this.autoQuickButton[0]), 
    this.touchDown = false, this.dom.bind(ui.touchmove, function (t)
    {
        if (this.touchDown && this.expanded && (!ui.uiTutorial || !ui.uiTutorial.opened))
        {
            var e = this.elementFromPoint(t);
            "undefined" != typeof e && this.checkElement(e), t.preventDefault()
        }
    }
    .bind(this)), this.dom.bind(ui.touchend, function (t)
    {
        if ((!ui.uiTutorial || !ui.uiTutorial.opened) && (this.spinButton.unlock(null, 500), !(!this.expanded || this.tapStyle && this.touchDown) && this.dom.hasClass("non-animated")))
        {
            var e = this.elementFromPoint(t);
            "undefined" != typeof e && this.checkElement(e);
            var i = this.getConfigDiff();
            this.expanded && (i.auto ? this.hide(true) : this.hide())
        }
    }
    .bind(this))
}
function UIInfoBar(t)
{
    UIComponent.call(this, t), this.messageLabel = null, Object.defineProperties(this, {
        message : {
            enumerable : true,
            set : function (t)
            {
                this.messageLabel.text = t || "";
            }
        }
    }), this.messageQueue = [], this.maxBetMessage = {}, this.enabledQuickSpinMessage = null, this.textIdClasses = [], 
    this.timeout = null, this.moveTimeout = null
}
function UIBottomBar(t)
{
    UIComponent.call(this, t), this.balanceValue = null, this.totalBetValue = null, Object.defineProperties(this, 
    {
        balance : {
            enumerable : true,
            set : function (t)
            {
                this.balanceValue.text = t;
            }
        },
        totalBet : {
            enumerable : true,
            set : function (t)
            {
                this.totalBetValue.text = t;
            }
        }
    }), this.timeout = null, this.balanceValue = new UILabel(this.dom.find("> .balance > label")), this.totalBetValue = new UILabel(this.dom.find("> .total-bet > label"))
}
function UITutorial(t)
{
    UIComponent.call(this, t)
}
function UIFullscreen(t, e)
{
    iNoBounce.disable(), this.data = {
        doNotResize : false
    },
    this.promise = e, this.screenfullInit(), this.preventFS = false, this.prevents = 
    {
        global : window.gameConfig && window.gameConfig.nofullscreen || !ENV.isMobile, browser :!(ENV.iOSDevice && ENV.isSafari || ENV.isAndroid && ENV.isChrome && this.screenfull.enabled || ENV.isWindows && this.screenfull.enabled)
    };
    for (var i in this.prevents) {
        this.prevents.hasOwnProperty(i) && (this.preventFS |= this.prevents[i]);
    }
    return this.config = 
    {
        delay : 500, lock : true, lockDelay : 50, unlockDelay : 300, fps : 30, barDeadZone : 20, panelTriggHeight : 40, 
        heightIncr : 2e4
    },
    this.preventFS ? ($(t).remove(), iNoBounce.enable(), this.data.fullscreen = true, $("#advice").remove(), 
    this.promise && this.promise.resolve(), null) : ($("body").css({
        height : this.config.heightIncr
    }), this.adviceElement = $(t), "object" == typeof ui && (this.currentAdvice = false), this.config.debug && ($("body").prepend('<div id="' + this.config.debug + '"></div>'), 
    $("head").append("<style>#" + this.config.debug + " {position: fixed;left: 20px;top: 20px;font-size: 10px;color: #ccc;background: rgba(0,0,0,0.8);z-index: 11;}#" + this.config.debug + " > * {display: block;}</style>"), 
    this.debugDom = document.getElementById(this.config.debug)), this.data = 
    {
        i : 0, times : 0, ptsY : [], ptsX : [], currentHeight : 0, tempHeight : 0, tempOrientation : window.orientation, 
        mode : "emulate", doNotResize : false
    },
    Object.defineProperties(this, 
    {
        currentAdvice : 
        {
            enumerable : true,
            set : function (t)
            {
                return t && setTimeout(function ()
                {
                    window.scrollTo(0, 0)
                }, 100), this.adviceElement.attr("class", t ? "visible " + t : "")
            },
            get : function ()
            {
                return (this.adviceElement.attr("class") || "").replace(/visible/, "").trim() || false;
            }
        }
    }), void this.checkSupporting())
}
function Locale(t)
{
    this.overridenLocale = null, Object.defineProperty(this, "locale", 
    {
        enumerable : true,
        get : function ()
        {
            return this.overridenLocale || gameConfig.lang;
        },
        set : function (t)
        {
            this.overridenLocale = t;
        }
    }), this.data = $("<strings><game/><ui/></strings>")
}
function ImageLoader()
{
    EventDispatcher.call(this), this.loaded = 0, this.toLoadCount = 0, this.queue = [], this.resources = {},
    this.generatedNamesCount = 0, this.defaultStreams = 0, this.failRequestTimeout = 3e3, this.queueLength = 0, 
    slotConfig.notCachingImage = !(!ENV.isQQBrowser && !ENV.iOSDevice) || slotConfig.notCachingImage
}
function Hosts(t)
{
    if (this.path = t && t.path ? t.path : "", this.domains = t && t.domains && "object" == typeof t.domains ? t.domain : [], 
    this.currentId = 0, this.ip = t.ip || "localhost", this.port = t.port || 8080, this.streams = 1, !this.domains.length) for (var e = 0;
    e < this.streams;
    e++) this.domains.push("http://" + this.ip + ":" + (this.port + e) + "/" + this.path)
}
function FPSCounter(t)
{
    UILabel.call(this, t), this.counter = 0
}
function SlotShifter(t)
{
    this.view = $(t), this.combinations = [], this.combinationEditor = null, this.editedCombinationId = null, 
    this.init()
}
function Match3Symbol(t, e, i, n)
{
    Object.defineProperties(this, 
    {
        shifter : {
            enumerable : false, writable : true
        },
        __modifier : {
            enumerable : false, writable : true
        },
        modifier : 
        {
            enumerable : true,
            get : function ()
            {
                return this.__modifier;
            },
            set : function (t)
            {
                if (this.__modifier !== t)
                {
                    switch (this.__modifier = t, this.__modifier) 
                    {
                        case "e":
                            this.coeff = Array.range(1, 4).sample();
                            break;
                        case "s":
                            this.coeff = this.shifter.modifiableSymbols.without(this.id).sample();
                            break;
                        case "m":
                            this.coeff = 2;
                            break;
                        default:
                            this.coeff = null;
                    }
                }
            }
        },
        isModifiable : {
            enumerable : true,
            get : function ()
            {
                return this.shifter.isSymbolModifiable(this.id);
            }
        }
    }), this.shifter = t;
    var s = /(\d+)(?:(\w)(\d+))?/;
    if ("string" == typeof e && s.test(e))
    {
        var o = e.match(s);
        this.id = parseInt(o[1], 10), this.modifier = o[2] || null, this.coeff = parseInt(o[3], 10) || null
    }
    else {
        this.id = e, this.modifier = i, this.coeff = n;
    }
}
function Match3Shifter(t)
{
    this.dom = $(t), this.fieldData = [], this.field = {}, this.allSymbols = Array.range(1, 11), this.editorSymbolsTypes = this.allSymbols.without(11), 
    this.seedableSymbols = Array.range(2, 10), this.modifiableSymbols = Array.range(2, 7), this.modifiers = [null, 
    "s", "f", "m"], this.symbolTypes = {}, this.symbolModifiers = {}, this.selectedSymbols = [], Object.defineProperties(this, 
    {
        symbolTypesEnabled : 
        {
            enumerable : true,
            get : function ()
            {
                return!this.symbolTypesContainer.hasClass("disabled")
            },
            set : function (t)
            {
                this.symbolTypesContainer[t ? "removeClass" : "addClass"]("disabled")
            }
        },
        symbolModifiersEnabled : 
        {
            enumerable : true,
            get : function ()
            {
                return!this.symbolModifiersContainer.hasClass("disabled")
            },
            set : function (t)
            {
                this.symbolModifiersContainer[t ? "removeClass" : "addClass"]("disabled")
            }
        }
    }), this.init()
}
function ErrorReporter() {}
function OriginErrorReporter() {}
function WebAudioPlayer() {}
function StubPlayer() {}
function GameAPI() {}
function DisplayObject()
{
    EventDispatcher.call(this), this.debug = false, this.debugColor = "#00ff00", this.alpha = 1, this.visible = true, 
    this.enabled = true, this.x = 0, this.y = 0, this.rotate = 0, this.tPointX = 0, this.tPointY = 0, 
    this.scaleX = 1, this.scaleY = 1, this.parent = null, this.stage = null, this.blendMode = DisplayObject.BLEND_MODES.NORMAL, 
    this.onClientUpdateCallback = null, this.onResizeCallback = null
}
function DisplayObjectContainer()
{
    DisplayObject.call(this), this.children = []
}
function AbstractButton()
{
    DisplayObjectContainer.call(this), this.hitArea = {
        x : 0, y : 0, width : 0, height : 0
    },
    this.pressed = false, this.enabled = true, this.onClickCallback = null
}
function Sprite(t, e, i)
{
    DisplayObject.call(this), this.sources = [], this.frames = 0, this.frame = 0, this.width = imageLoader.get(t).width / (e || 1) * this.scaleFactor, 
    this.height = imageLoader.get(t).height / (i || 1) * this.scaleFactor, this.startTime =- 1, this.addImage(t, 
    e, i)
}
function Rectangle(t, e, i, n, s)
{
    DisplayObject.call(this), this.x = t, this.y = e, this.width = i, this.height = n, this.fillStyle = s
}
function Stage(t)
{
    EventDispatcher.call(this), this.canvas = null, this.context = null, this.root = new DisplayObjectContainer, 
    this.root.setStage(this), this.time = 0, this.deltaTime = 0, this.realTime = 0, this.playbackRate = 1, 
    this.onPause = true, this.canvasId = t || "game", Stage.instances.push(this), this.canvas = h5game.getCanvas(this.canvasId), 
    this.context = this.canvas.getContext("2d"), this.disabled = true, this.dontPauseSound = false, this.fps = 60, 
    this.now = null, this.then = (new Date).getTime(), this.interval = 1e3 / this.fps, this.delta = null, 
    this.reducedFPS = ENV.isQQBrowser && ENV.compareVersions(ENV.androidVersion, "4.4.4") <= 0 && window.navigator.userAgent.search(/huaweig7/gi) > -1, 
    this.fps = this.reducedFPS ? 20 : this.fps
}
function Connection()
{
    EventDispatcher.call(this), this.syncTime = 5e3, this.timeout = 15e3, this.longWaitTimeout = 1250, 
    this.attempts = 1, this.session = null, this.queue = [], this.currentRequest = null, this.syncTimeout = null, 
    this.message = null, this.longWaitTimer = null
}
function ServerData()
{
    EventDispatcher.call(this), this.parsers = []
}
function Locker()
{
    this.locked = false
}
function ClientData()
{
    EventDispatcher.call(this), this.data = {}, this.transitionLocker = new Locker, this.diffLocker = new Locker, 
    this.delayedTransitions = null, this.transitions = {}, this.transitionCallbacks = [], this.haveServerResponse = false, 
    this.haveClientResponse = false
}
function StateController(t)
{
    EventDispatcher.call(this), this.startTime = 0, this.started = false, this.state = t, Object.defineProperties(this, 
    {
        elapsedTime : {
            enumerable : true,
            get : function ()
            {
                return stage.time - this.startTime;
            }
        }
    })
}
function TextFieldObject(t, e, i)
{
    this.id = t, this.leftMargin = e, this.rightMargin = i
}
function TextField(t)
{
    DisplayObject.call(this), this.id = null, this.tokens = {}, this.objects = {},
    this._static = false, this.buffer = null, this.lines = [], Object.defineProperties(this, {
        colorOverlap : {
            writable : true, enumerable : true
        }
    }), t && this.setId(t)
}
function ProgressBar()
{
    DisplayObject.call(this), this.progress = 0, this.percents = null, this.backgroundImage = null, this.lineImage = null, 
    this.linePosition = {
        x : 0, y : 0
    }
}
function Preloader()
{
    DisplayObjectContainer.call(this), this.stage = new Stage("preloader"), this.stage.dontPauseSound = true, 
    this.stage.root.addChild(this), this.backgroundContainer = new DisplayObjectContainer, this.progressBar = new ProgressBar, 
    this.customContainer = new DisplayObjectContainer, this.addChild(this.backgroundContainer), this.addChild(this.progressBar), 
    this.addChild(this.customContainer)
}
function Game()
{
    DisplayObjectContainer.call(this), this.name = "", this.stage = stage
}
function Tween(t, e, i)
{
    this.object = t, this.setter = "function" == typeof e ? e : function (t, i)
    {
        t[e] = i;
    },
    this.motions = [ {
        value : i, time : 0
    }]
}
function SpriteTween(t)
{
    this.object = t, this.motions = []
}
function MovieClip(t)
{
    EventDispatcher.call(this), this.time = 0, this._stage = t || stage, this.playing = false, this.attributes = {},
    this.tweens = [], this.actions = [], this.labels = {}
}
function ParticleEmitter(t)
{
    MovieClip.call(this), this.container = t, this.particles = []
}
function Particle(t, e, i, n)
{
    Sprite.call(this, t.spriteSheet, t.spriteColumns, t.spriteRows), this.config = t, this.startTiming = e, 
    this.duration = i, this.timeOffset = n, this.tPointX = this.width / 2, this.tPointY = this.height / 2
}
function Symbol(t, e)
{
    DisplayObjectContainer.call(this), this.id = t || 0, this.height = e || 1, this.states = {},
    this.states.normal = new DisplayObjectContainer, this.addChild(this.states.normal), this.states.blur = new DisplayObjectContainer, 
    this.addChild(this.states.blur), this.states.blackout = new DisplayObjectContainer, this.addChild(this.states.blackout), 
    this.states.animation = new DisplayObjectContainer, this.addChild(this.states.animation), this.movie = null, 
    this.stateWidth = 0, this.stateHeight = 0, this.normal()
}
function Reel(t, e)
{
    DisplayObject.call(this), this.reels = t, this.column = e;
    for (var i = 0; i < slotConfig.rows + 2; i++) {
        this [i] = Symbol.get(1);
    }
    this.dy = 0, this.symbolsFeeder = new SymbolsFeeder(e), this.t = 0, this.T = 0, this.a = 2, this.v = 20, 
    this.state = Reel.STOPPED, this.b = 0, this.c = 0, stage.addEventListener(GameEvent.ENTER_FRAME, this.update, 
    this), Object.defineProperties(this, 
    {
        resultingOffset : 
        {
            enumerable : true,
            get : function ()
            {
                return {
                    x : this.originOffset.x, y : this.dy + this.originOffset.y
                }
            }
        },
        originOffset : 
        {
            enumerable : true,
            get : function ()
            {
                return t.symbolAnchorCenter && this [0].stateWidth > 0 && this [0].stateHeight > 0 ? 
                {
                    x : Symbol.width / 2 - this [0].stateWidth / 2, y :- Symbol.height / 2 - this [0].stateHeight / 2
                }
                 : {
                    x : 0, y :- Symbol.height
                }
            }
        }
    })
}
function Reels()
{
    DisplayObjectContainer.call(this), this.gap = 0, this.topMargin = 0, this.bottomMargin = 0, this.leftMargin = 0, 
    this.rightMargin = 0, this.symbolAnchorCenter = false, this.quickStop = false, this.skipAdditionalRotating = false, 
    this.additionalRotatingFrame = [], this.additionalCustomFrame = [], Object.defineProperties(this, 
    {
        width : {
            get : function ()
            {
                return (Symbol.width + this.gap) * slotConfig.columns;
            }
        },
        height : {
            get : function ()
            {
                return Symbol.height * slotConfig.rows;
            }
        }
    })
}
function SymbolsFeeder(t)
{
    this.column = t, this.queue = [], this.rowsToStop =- 1
}
function Paylines()
{
    DisplayObject.call(this), this.data = [], this.shownLines = [], this.highlight = false, this.lineWidth = 4, 
    this.lineRoundness = 0, this.symbolBoxesEnabled = true, this.symbolBoxRoundness = 0, this.symbolBoxOutside = false, 
    this.buffer = null
}
function WinPanel()
{
    DisplayObjectContainer.call(this), this.underlayer = new Rectangle(0, 0, 1440, 600, "rgba(0,0,0,0.77)"), 
    this.underlayer.alpha = 0, this.addChild(this.underlayer), this.hidingContainer = new DisplayObjectContainer, 
    this.hidingContainer.x = 400, this.hidingContainer.y = 600, this.addChild(this.hidingContainer), this.background = new DisplayObjectContainer, 
    this.hidingContainer.addChild(this.background), this.particleContainer = new DisplayObjectContainer, 
    this.hidingContainer.addChild(this.particleContainer), this.panel = new Sprite("win-panel/panel.png"), 
    this.panel.x = 46, this.panel.y = 0, this.hidingContainer.addChild(this.panel), this.textWin = new TextField("WIN_PANEL_WIN"), 
    this.hidingContainer.addChild(this.textWin), this.counter = new TextField("WIN_PANEL_COUNTER"), this.hidingContainer.addChild(this.counter), 
    this.titles = new DisplayObjectContainer, this.hidingContainer.addChild(this.titles), this._movie = new ParticleEmitter(this.particleContainer), 
    this.createCustomDecorations(), this.sizeType = ServerData.NORMAL_WIN, this._isRolling = false, this.totalSum = null, 
    this.startSum = null, this.currentSum = null, this.afterMegaWinLeftSum = 0, this.afterMegaWinAcceleration = 0, 
    this.rollSoundID = "winRollSound", this.rollSound = null, this.rollStoped = false, Object.defineProperties(this, 
    {
        counterValue : 
        {
            enumerable : true,
            set : function (t)
            {
                this.currentSum = t, this.counter.tokens["value"] = h5game.formatMeter(t);
            }
        },
        timingBeforeHide : 
        {
            enumerable : true,
            get : function ()
            {
                if (this.forcedTimingBeforeHide) {
                    return this.forcedTimingBeforeHide;
                }
                switch (this.sizeType)
                {
                    case ServerData.MEGA_WIN:
                        return this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + this.timingConfig.megaWinTiming + this.timingConfig.afterMegaWinTiming + this.stillTiming;
                    case ServerData.BIG_WIN:
                        return this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + this.stillTiming;
                    default:
                        return this.timingConfig.normalWinTiming + this.stillTiming;
                }
            }
        },
        counterRollDuration : 
        {
            enumerable : true,
            get : function ()
            {
                switch (this.sizeType)
                {
                    case ServerData.MEGA_WIN:
                        return this.totalSum && this.totalSum > this.afterMegaWinSum ? this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + this.timingConfig.megaWinTiming + this.timingConfig.afterMegaWinTiming : this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + Math.round((this.totalSum - this.megaWinSum) / this.megaWinVelocity);
                    case ServerData.BIG_WIN:
                        return this.timingConfig.normalWinTiming + Math.round((this.totalSum - this.bigWinSum) / this.bigWinVelocity);
                    default:
                        return this.timingConfig.normalWinTiming;
                }
            }
        },
        stillTiming : 
        {
            enumerable : true,
            get : function ()
            {
                switch (this.sizeType)
                {
                    case ServerData.MEGA_WIN:
                        return this.timingConfig.bigWinStillTiming;
                    case ServerData.BIG_WIN:
                        return this.timingConfig.bigWinStillTiming;
                    default:
                        return this.timingConfig.normalWinStillTiming;
                }
            }
        },
        currentStageDuration : 
        {
            enumerable : true,
            get : function ()
            {
                return [0, this.forcedTimingBeforeHide || this.timingConfig.normalWinTiming, this.timingConfig.bigWinTiming, 
                this.timingConfig.megaWinTiming, this.timingConfig.afterMegaWinTiming, slotConfig.winPanel.hideTime][this.currentStage]
            }
        },
        currentStage : 
        {
            enumerable : true,
            get : function ()
            {
                switch (true)
                {
                    case this._movie.time < this.timingConfig.normalWinTiming:
                        return 1;
                    case this.sizeType > ServerData.NORMAL_WIN && this._movie.time < this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming:
                        return 2;
                    case this.sizeType > ServerData.BIG_WIN && this._movie.time < this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + this.timingConfig.megaWinTiming:
                        return 3;
                    case this.sizeType > ServerData.BIG_WIN && this.timingConfig.afterMegaWinTiming && this._movie.time < this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + this.timingConfig.megaWinTiming + this.timingConfig.afterMegaWinTiming:
                        return 4;
                    default:
                        return 5;
                }
            }
        },
        isShown : 
        {
            enumerable : true,
            get : function ()
            {
                return this._movie && this._movie.time && this._movie.time <= this.timingBeforeHide;
            }
        },
        isHiding : 
        {
            enumerable : true,
            get : function ()
            {
                return this._movie && this._movie.time && this._movie.time >= this.timingBeforeHide && this._movie.time < this.timingBeforeHide + slotConfig.winPanel.hideTime;
            }
        },
        isRolling : 
        {
            set : function (t)
            {
                this._isRolling != t && (this._isRolling = t, this._isRolling || this.dispatchEvent(new GameEvent(GameEvent.WIN_PANEL_ROLLING_STOP)));
            },
            get : function ()
            {
                return this._isRolling;
            }
        },
        isVisibled : 
        {
            enumerable : true,
            get : function ()
            {
                return this.hidingContainer.y == 600 - this.deltaHeight;
            }
        }
    }), this.deltaHeight = this.panel.height
}
function ReelsSpinController()
{
    StateController.call(this, "spin.start")
}
function ReelsStopController()
{
    StateController.call(this, "spin.stop"), this.additionalRotatingTimings = []
}
function FreegamesIntroController()
{
    StateController.call(this, "freespins.start")
}
function FreegamesSummaryController()
{
    StateController.call(this, "freespins.stop")
}
function FreegamesController(t)
{
    StateController.call(this, "bet.idle"), this.currentWinNumber =- 1, this.gameType = t || "freeSpins", 
    this.wins = [], this.winSound = null
}
function FreeWinController()
{
    StateController.call(this, "bet.freewin")
}
function SkipController(t)
{
    StateController.call(this, t)
}
function TotalWinController()
{
    StateController.call(this, "bet.win")
}
function AutoplayController(t)
{
    StateController.call(this, "bet.idle"), this.currentWinNumber =- 1, this.gameType = t || "auto", this.wins = []
}
function hasThiefActions()
{
    return serverData.thief_action.length > 0
}
function WinningsController(t)
{
    StateController.call(this, "bet.idle"), this.currentWinNumber =- 1, this.gameType = t || "main"
}
function Rays()
{
    DisplayObjectContainer.call(this), this._normal = new Sprite("thief/rays.png", 6, 7), this._normal.scaleX = 2, 
    this._normal.scaleY = 2, this.addChild(this._normal), this._movie = new MovieClip, this._movie.addTween(new SpriteTween(this._normal).move("0-41,16-0,0", 
    4e3)), this._movie.addTween(new Tween(this, Tween.ALPHA_FUNC, .4).move(-.4, 4e3, Tween.JUMP)), this._movie.addAction(this._movie.play, 
    2800, 1133), this._movie.addAction(this._movie.stop, 4e3), this._movie.stop(4e3)
}
function Thief()
{
    DisplayObjectContainer.call(this), this.step = 0, this.skipMove = false, this.head = new Sprite("thief/robber.png"), 
    this.head.tPointX = this.head.width / 2, this.head.tPointY = this.head.height / 2, this.head.scaleX = this.head.scaleY = 0, 
    this.addChild(this.head), this.headPositionX = [220, 400, 580, 760, 940, 1130, 945, 765, 585, 405, 
    220, 400, 580, 760, 940, 1180], this.headPositionY = [120, 120, 120, 120, 120, 275, 275, 275, 275, 
    275, 435, 435, 435, 435, 435, 435]
}
function createThiefPath()
{
    for (var t = new DisplayObjectContainer, e = [], i = t.movie = new MovieClip, n = 0; n < 40; n++)
    {
        var s = e[n] = new Sprite("main-game/arrow.png");
        s.x = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 760, 760, 700, 640, 580, 520, 
        460, 400, 340, 280, 220, 160, 100, 60, 60, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 
        720, 780][n] + 312, s.y = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 46, 114, 200, 200, 200, 200, 200, 
        200, 200, 200, 200, 200, 200, 204, 272, 327, 327, 327, 327, 327, 327, 327, 327, 327, 327, 327, 
        327, 327][n] + 161, s.rotate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 
        2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0][n] * Math.PI / 2, t.addChild(s), i.addTween(new Tween(s, 
        Tween.ALPHA_FUNC, 0).move(0, 2500 + 30 * (n + 1)).move(1, 300).move(0, 500).move(-1, 500))
    }
    i.addTween(new Tween(reels, Tween.ALPHA_FUNC, 0).move(0, 4800).move(1, 200)), i.addTween(new Tween(game.background.rays, 
    Tween.ALPHA_FUNC, 0).move(0, 4800).move(.4, 200)), i.addTween(new Tween(game.main.arrest, Tween.ALPHA_FUNC, 
    0).move(0, 4800).move(1, 200)), i.addAction(function ()
    {
        i.play(2500), o = sound.play("pathway");
    }, 1e3), i.addAction(i.stop, 5e3), i.stop(5e3);
    var o = null;
    return t.onClientUpdate(function (t)
    {
        "init" != t.diff.state || "bet.idle" != clientData.state || clientData.freegamesActive ? t.diff.state && "spin.start" == clientData.state && (o && (o.stop(), 
        o = null), i.stop(5e3)) : i.play(0);
    }), t
}
function createAccumulatedFreespins()
{
    var t = new DisplayObjectContainer, e = new Sprite("main-game/fs_counter.png", 4, 2);
    e.x = 278, e.y =- 10, e.alpha = 0, t.addChild(e);
    var i = new TextField("VALUE_ACCUMULATED_FREESPINS");
    i.tokens["value"] = 10, t.addChild(i);
    var n = new Sprite("main-game/diamond.png");
    n.x = 325, n.y = 38, n.alpha = 0, t.addChild(n);
    var s = null, o;
    return t.animate = function (t)
    {
        s && s.stop(), s = new MovieClip, o = 1e3;
        var a = reels.x + reels[t.column].x + 130 - 325, r = reels.y + (t.row - 1) * Symbol.height + 130 - 38;
        1 == serverData.add_freespins ? (s.addTween(new SpriteTween(e).move("0", o + 300).move("0-6", 
        500)), s.addTween(new Tween(e, Tween.ALPHA_FUNC, 0).move(1, o + 300, Tween.JUMP).move(-1, 500, 
        Tween.JUMP)), s.addTween(new Tween(n, Tween.ALPHA_FUNC, 0).move(1, o, Tween.JUMP).move(-1, 300, 
        Tween.JUMP)), s.addTween(new Tween(n, Tween.X_FUNC, 325).move(a, o, Tween.JUMP).move(-a, 300)), 
        s.addTween(new Tween(n, Tween.Y_FUNC, 38).move(r, o, Tween.JUMP).move(-r, 300)), s.addAction(function ()
        {
            sound.play("diamond")
        }, o), s.addAction(function ()
        {
            i.tokens["value"] = serverData.accumulated_freespins + 10;
        },
        o + 300), s.addAction(s.stop, o + 800)) : (s.addTween(new SpriteTween(e).move("0", o + 300).move("0-6", 
        500).move("0", 300).move("0-6", 500)), s.addTween(new Tween(e, Tween.ALPHA_FUNC, 0).move(1, o + 300, 
        Tween.JUMP).move(-1, 500, Tween.JUMP).move(1, 300, Tween.JUMP).move(-1, 500, Tween.JUMP)), s.addTween(new Tween(n, 
        Tween.ALPHA_FUNC, 0).move(1, o, Tween.JUMP).move(-1, 300, Tween.JUMP).move(1, 500, Tween.JUMP).move(-1, 
        300, Tween.JUMP)), s.addTween(new Tween(n, Tween.X_FUNC, 325).move(a, o, Tween.JUMP).move(-a, 
        300).move(a, 500, Tween.JUMP).move(-a, 300)), s.addTween(new Tween(n, Tween.Y_FUNC, 38).move(r, 
        o, Tween.JUMP).move(-r, 300).move(r, 500, Tween.JUMP).move(-r, 300)), s.addAction(function ()
        {
            sound.play("diamond")
        }, o), s.addAction(function ()
        {
            i.tokens["value"] = serverData.accumulated_freespins + 9;
        },
        o + 300), s.addAction(function ()
        {
            sound.play("diamond")
        },
        o + 800), s.addAction(function ()
        {
            i.tokens["value"] = serverData.accumulated_freespins + 10;
        },
        o + 1100), s.addAction(s.stop, o + 1600)), s.play(0)
    },
    t.skip = function ()
    {
        i.tokens["value"] = serverData.accumulated_freespins + 10, s.stop(1 == serverData.add_freespins ? o + 800 : o + 1600);
    },
    t.onClientUpdate(function (t)
    {
        "init" == t.diff.state || "giftspins.activate" == t.diff.state || "giftspins.summary" == t.diff.state || "giftspins.remove" == t.diff.state || "giftspins.interrupted" == t.diff.state ? i.tokens["value"] = serverData.accumulated_freespins - serverData.add_freespins + 10 : "freespins.stop" == t.diff.state && (i.tokens["value"] = 10);
    }), t
}
function Paylines()
{
    DisplayObjectContainer.call(this), this.data = [], this.shownLines = [], this.highligth = false
}
function ThiefBonusController()
{
    StateController.call(this, "thief.bonus"), this._skipped = false
}
function ThiefCopController()
{
    StateController.call(this, "thief.cop"), this._skipped = false
}
function ThiefMoveController()
{
    StateController.call(this, "thief.move"), this._steps =- 1, this._finalStep =- 1, this._skipped = false
}
function ThiefMummyController()
{
    StateController.call(this, "thief.mummy"), this._skipped = false, this._finalStep =- 1
}
function ThiefReleaseController()
{
    StateController.call(this, "thief.release")
}
function ThiefStartController()
{
    StateController.call(this, "thief.start")
}
function ThiefStopController()
{
    StateController.call(this, "thief.stop")
}
function ThiefWildController()
{
    StateController.call(this, "thief.wild"), this._skipped = false
}
function Interior(t)
{
    DisplayObjectContainer.call(this), this.room = t, void 0 !== t.type && this.fill()
}
function Room(t, e)
{
    AbstractButton.call(this), this.id = t, this.bonus = e, this.onClientUpdate(this.performOnClientUpdate), 
    this.onClick(this.onSelect)
}
function BonusMap(t)
{
    DisplayObjectContainer.call(this), this.bonus = t, this.moved = false, ui.addEventListener(GameEvent.RESIZE, 
    this.onResize, this), this.onClientUpdate(this.performOnClientUpdate)
}
function BonusThief(t)
{
    DisplayObjectContainer.call(this), this.bonus = t, this.sprite = new Sprite("thief/robber.png"), this.sprite.tPointX = this.sprite.width / 2, 
    this.sprite.tPointY = this.sprite.height / 2, this.sprite.y = 20, this.addChild(this.sprite)
}
function Bonus()
{
    DisplayObjectContainer.call(this), this.background = this.createBackground(), this.addChild(this.background), 
    this.roomsContainer = new BonusMap(this), this.roomsContainer.x = 40, this.roomsContainer.y = 5, this.addChild(this.roomsContainer), 
    this.roomsCount = 15, this.rooms = new Array(this.roomsCount);
    for (var t = 0; t < this.roomsCount; t++) {
        var e = this.rooms[t] = new Room(t, this);
        this.roomsContainer.addChild(e)
    }
    this.superprizeRoom = this.createSuperprizeRoom(), this.roomsContainer.addChild(this.superprizeRoom), 
    this.currentRoom = null, this.thief = new BonusThief(this), this.roomsContainer.addChild(this.thief), 
    this.arrowLeft = this.createLeftArrow(), this.addChild(this.arrowLeft), this.arrowRight = this.createRightArrow(), 
    this.addChild(this.arrowRight), this.arrowUp = this.createUpArrow(), this.addChild(this.arrowUp), 
    this.arrowDown = this.createDownArrow(), this.addChild(this.arrowDown);
    var i = this.movie = new MovieClip;
    i.addTween(new Tween(this.arrowLeft, "alpha", .2).move(.3, 1e3).move(-.3, 1e3)), i.addTween(new Tween(this.arrowRight, 
    "alpha", .2).move(.3, 1e3).move(-.3, 1e3)), i.addTween(new Tween(this.arrowUp, "alpha", .2).move(.3, 
    1e3).move(-.3, 1e3)), i.addTween(new Tween(this.arrowDown, "alpha", .2).move(.3, 1e3).move(-.3, 1e3)), 
    i.addAction(i.play, 2e3, 0), i.play(0), this.addPanel();
    var n = this.bgShadow = new Rectangle(0, 0, 1440, 1200, "rgba(0,0,0,0.7)");
    n.visible = false, this.roomsContainer.addChild(n);
    for (var s = this.pictures = [], t = 0; t < 9; t++)
    {
        s[t] = new Sprite("paytable/pictures/" + (t + 1) + ".png"), this.addChild(s[t]), s[t].visible = false;
    }
    var o = this.text = new TextField("BONUS_SUPERPRIZE_TEXT");
    this.addChild(o), o.visible = false;
    var a = this.counter = new TextField("BONUS_SUPERPRIZE_COUNTER");
    this.addChild(a), a.visible = false, this.bonusStart = this.createBonusStart(), this.bonusStart && this.addChild(this.bonusStart), 
    this.bonusSummary = this.createBonusSummary(), this.bonusSummary && this.addChild(this.bonusSummary)
}
function BonusIntroController()
{
    StateController.call(this, "bonus.intro"), this._skipped = false
}
function BonusResultController()
{
    StateController.call(this, "bonus.result")
}
function BonusStartController()
{
    StateController.call(this, "bonus.start")
}
function BonusSummaryController()
{
    StateController.call(this, "bonus.summary")
}
function BonusWaitController()
{
    StateController.call(this, "bonus.wait")
}
function CombinationEditorSymbol(t, e, i)
{
    var n = "ontouchstart"in window ? "touchstart" : "click";
    this.editor = t, this.column = e, this.row = i, this.view = $("<div class='symbol'>            <canvas class='symbol-canvas'></canvas>            <div class='spin prev'></div>             <div class='spin next'></div>             <div class='spin prev-current'></div>            <div class='spin next-current'></div>            <div class='id'/>         </div>"), 
    this.view.find("canvas").attr("width", Symbol.width), this.view.find("canvas").attr("height", Symbol.height), 
    this.context = this.view.find("canvas")[0].getContext("2d"), this.view.find("canvas").on(n, this, 
    function (t)
    {
        var e = t.data;
        e.editor.edit(e)
    }), this.view.find(".spin.prev").on(n, this, function (t)
    {
        var e = t.data;
        e.editor[e.column].shiftToNextSymbol(e.row, false)
    }), this.view.find(".spin.next").on(n, this, function (t)
    {
        var e = t.data;
        e.editor[e.column].shiftToNextSymbol(e.row, true)
    }), this.view.find(".spin.prev-current").on(n, this, function (t)
    {
        var e = t.data;
        e.editor[e.column].shiftToNextCurrentSymbol(e.row, false)
    }), this.view.find(".spin.next-current").on(n, this, function (t)
    {
        var e = t.data;
        e.editor[e.column].shiftToNextCurrentSymbol(e.row, true)
    })
}
function CombinationEditorReel(t, e)
{
    this.column = e, this.strip = [0, 0, 0, 0, 0, 0], this.offset = 0, this.view = $("<div class='reel'/>");
    for (var i = 1; i <= slotConfig.rows; i++) {
        this [i] = new CombinationEditorSymbol(t, e, i), this [i].view.appendTo(this.view);
    }
}
function CombinationEditor()
{
    this.view = $("<div class='combination-editor'><select class='reelset-selector'></select></div>"), 
    this.selector = this.view.find(".reelset-selector"), this.editedSymbol = null;
    for (var t = 1; t <= slotConfig.columns; t++) {
        this [t] = new CombinationEditorReel(this, t), this [t].view.appendTo(this.view);
    }
    for (var e in serverData.reelSets)
    {
        if (serverData.reelSets.hasOwnProperty(e)) {
            var i = $("<option/>");
            i.append(String(e)), this.selector.append(i) 
        }
        this.selector.on("change", this, function (t) 
        {
            var e = t.data;
            e.setReelSetId(parseInt(e.selector.val(), 10)) 
        }), this.setReelSetId(1);
    }
}
window.ENV = {}, ENV.compareVersions = function (t, e)
{
    t = (t || "").split("."), e = (e || "").split(".");
    for (var i = 0; i < Math.max(t.length, e.length); i++) {
        var n = parseInt(t[i] || 0, 10), s = parseInt(e[i] || 0, 10);
        if (n != s) {
            return n - s;
        }
    }
    return 0;
},
ENV.screenSize = 
{
    width : window.screen.width || window.screen.availWidth || window.innerWidth, height : window.screen.height || window.screen.availHeight || window.innerHeight
},
ENV.isSmallScreenSize = Math.min(ENV.screenSize.height, ENV.screenSize.width) <= 320 && ENV.screenSize.height / ENV.screenSize.width < 1.7125, 
ENV.devicePixelRatio = window["devicePixelRatio"] || 1, ENV.isOpera = /Presto|OPR|OPiOS/.test(navigator.userAgent), 
ENV.isUCBrowser = /UCBrowser/.test(navigator.userAgent), ENV.isQQBrowser = /QQBrowser/.test(navigator.userAgent), 
ENV.isMaxthonBrowser = /mxios|mxbrowser/gi.test(navigator.userAgent), ENV.isYa = /yabrowser/gi.test(navigator.userAgent), 
ENV.isBaidu = /bdbrowser/gi.test(navigator.userAgent), ENV.is360 = /360browser/gi.test(navigator.userAgent), 
ENV.isFirefox = navigator.userAgent.search(/Firefox|FxiOS/i) > -1, ENV.isWindows = /Microsoft/.test(navigator.userAgent), 
ENV.iOSDevice = !ENV.isWindows &&/iPad|iPhone|iPod/i.exec(navigator.userAgent), ENV.isAndroid = !ENV.isWindows &&/android/i.test(navigator.userAgent), 
ENV.iOSDevice && (ENV.iOSDevice = ENV.iOSDevice[0], ENV.iOS8 = /8_\d/i.test(navigator.userAgent), ENV.iOS7 = /7_1_\d/i.test(navigator.userAgent), 
ENV.iOSVersion = navigator.userAgent.match(/\d+_\d+/)[0].replace("_", "."), ENV.iPad = navigator.userAgent.toLowerCase().indexOf("ipad") !=- 1, 
ENV.iPadMini = ENV.iPad && (768 == screen.availWidth && 1004 == screen.availHeight || 1 == ENV.devicePixelRatio)), 
ENV.isAndroid && (ENV.androidVersion = function (t)
{
    var t = t || navigator.userAgent, e = t.match(/Android\s([0-9\.]*)/);
    return!!e && e[1]
}
()), ENV.mobileOnly = ENV.is360, ENV.isMobile = !!(!ENV.iOSDevice &&/Mobile/.test(navigator.userAgent) || ENV.iOSDevice && "iPad" != ENV.iOSDevice), 
ENV.isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent) && !ENV.mobileOnly, 
ENV.isTablet = !ENV.isMobile && !ENV.isDesktop, ENV.browsers = 
{
    whiteList : {
        isChrome : false, isSafari : false
    },
    grayList : 
    {
        isUCBrowser : /UCBrowser/.test(navigator.userAgent), isQQBrowser : /QQBrowser/.test(navigator.userAgent), 
        nativeAndroidBrowser : false, isSafariDefault : false
    },
    blackList : 
    {
        isMaxthonBrowser : /mxios|mxbrowser/gi.test(navigator.userAgent), isYa : /yabrowser/gi.test(navigator.userAgent), 
        isBaidu : /bdbrowser/gi.test(navigator.userAgent), is360 : /360browser/gi.test(navigator.userAgent), 
        isFirefox : navigator.userAgent.search(/Firefox|FxiOS/i) > -1, isOpera : /Presto|OPR|OPiOS/.test(navigator.userAgent)
    },
    isFromList : function (t)
    {
        t = t ? t + "List" : "whiteList";
        var e = false;
        for (var i in this [t]) {
            this [t].hasOwnProperty(i) && (e |= this [t][i]);
        }
        return e;
    },
    isBrowser : function (t)
    {
        if (!t) {
            return false;
        }
        for (var e = false, i = ["whiteList", "grayList", "blackList"], n = 0; n < i.length; n++)
        {
            var s = i[n];
            for (var o in this [s])
            {
                this [s].hasOwnProperty(o) && o.toLowerCase().indexOf(t.toLowerCase()) > - 1 && (e = this [s][o]);
            }
        }
        return e;
    }
},
ENV.isChrome = ENV.browsers.whiteList.isChrome = (!ENV.isMobile && navigator.userAgent.search(/(crios|chrome)\/.+ Safari\/[0-9\.]*(\s\(|$)/gi) > -1 || ENV.isMobile && navigator.userAgent.search(/(crios|chrome)\/.+ mobile\/?.* Safari\/[0-9\.]*(\s\(|$)/gi) > -1) && !(ENV.browsers.isFromList("black") || ENV.browsers.isFromList("gray")), 
ENV.likeChrome = !ENV.isQQBrowser && !ENV.isUCBrowser && !ENV.isWindows && !ENV.isOpera && navigator.userAgent.search(/(CriOS|Chrome)/i) > -1, 
ENV.isSafari = ENV.browsers.whiteList.isSafari = /Apple/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent) && (navigator.userAgent.search(/safari\/[0-9\.]+(\s\()?$/gi) > -1 || navigator.userAgent.search("Twitter for iPhone") > -1) && !(ENV.browsers.isFromList("black") || ENV.browsers.isFromList("gray")), 
ENV.isSafariDefault = ENV.browsers.grayList.isSafariDefault = ENV.iOSDevice && ENV.isSafari && !/Version/.test(navigator.userAgent), 
ENV.isRetina = ENV.iPad && ENV.devicePixelRatio >= 2, ENV.isChrome && (ENV.chromeVersion = function (t)
{
    var t = t || navigator.userAgent, e = t.match(/Chrome\/([0-9\.]*)/);
    return!!e && e[1]
}
()), ENV.nativeAndroidBrowser = ENV.browsers.grayList.nativeAndroidBrowser = ENV.isAndroid && !(ENV.browsers.isFromList("black") || ENV.browsers.isFromList("gray")) && (/Version\//.test(navigator.appVersion) && (!ENV.isChrome && ENV.compareVersions(ENV.androidVersion, 
"4.4.4") < 0 || ENV.compareVersions(ENV.chromeVersion, "46.0") <= 0) || ENV.isChrome &&/SamsungBrowser/.test(navigator.userAgent)), 
ENV.nativeAndroidBrowser && (ENV.nativeAndroidBrowser442 = 0 == ENV.compareVersions(ENV.androidVersion, 
"4.4.2"), ENV.nativeAndroidBrowser40 = ENV.compareVersions(ENV.androidVersion, "4") >= 0 && ENV.compareVersions(ENV.androidVersion, 
"5") < 0, ENV.nativeAndroidBrowser43 = ENV.compareVersions(ENV.androidVersion, "4.3") >= 0 && ENV.compareVersions(ENV.androidVersion, 
"4.4") < 0, ENV.isChrome = ENV.browsers.whiteList.isChrome = false), ENV.isCSSCalcSupported = function ()
{
    var t = document.createElement("div");
    document.body.appendChild(t), t.style.width = "calc(100px / 10)";
    var e = getComputedStyle(t).width;
    return document.body.removeChild(t), "10px" == e
}(),
ENV.isNecessaryTechologiesSupports = true, ENV.techsStack = 
{
    isCanvasSupported : function ()
    {
        var t = document.createElement("canvas");
        return!!(t.getContext && t.getContext("2d"))
    }(),
    isCSSTransformSupported : function ()
    {
        for (var t = "transform WebkitTransform MozTransform OTransform msTransform".split(" "), e = document.createElement("div"), 
        i = 0;
        i < t.length;
        i++) if (e && void 0 !== e.style[t[i]]) return!!t[i];
        return false
    }(),
    isTouchOrMouseSupported : function ()
    {
        return!!("ontouchstart"in document.documentElement || "onmousedown"in document.documentElement)
    }
    ()
};
for (var key in ENV.techsStack)
{
    ENV.techsStack.hasOwnProperty(key) && (ENV.isNecessaryTechologiesSupports &= ENV.techsStack[key]);
}
Math.sign || (Math.sign = function (t)
{
    return 0 == t ? 0 : t < 0 ?- 1 : 1;
}), Array.prototype.find || (Array.prototype.find = function (t, e)
{
    var i = [];
    e && (t = t.bind(e));
    for (var n = 0; n < this.length; n++) {
        if (t(this [n], n, this)) {
            return this [n];
        }
    }
}), Array.prototype.findIndex || (Array.prototype.findIndex = function (t, e)
{
    e && (t = t.bind(e));
    for (var i = 0; i < this.length; i++) {
        if (t(this [i], i, this)) {
            return i;
        }
        return - 1;
    }
}), Array.copiesOf = function (t, e)
{
    for (var i = [], n = 0; n < e; n++) {
        i[n] = t;
    }
    return i;
},
Array.prototype.max = function ()
{
    return Math.max.apply(Math, this);
},
Array.prototype.min = function ()
{
    return Math.min.apply(Math, this);
},
Array.prototype.sorted = function ()
{
    var t = this.clone();
    return t.sort.apply(t, Array.prototype.sort.call(arguments)), t;
},
Array.prototype.sample = function (t)
{
    if (void 0 === t) {
        return this [Math.round(Math.random() * (this.length - 1))];
    }
    var e = [], i;
    for (i = 0; i < t; i++)
    {
        var n;
        do n = Math.round(Math.random() * (this.length - 1));
        while (e.indexOf(n) !=- 1 && e.length < this.length);
        e.push(n)
    }
    for (i = 0; i < e.length; i++) {
        e[i] = this [e[i]];
    }
    return e;
},
Array.prototype.clone = function ()
{
    return this.slice(0);
},
Array.prototype.flatten = function (t)
{
    for (var e = [], i = 0; i < this.length; i++)
    {
        this [i] && this [i].constructor == Array ? e.push.apply(e, t ? this [i] : this [i].flatten()) : e.push(this [i]);
    }
    return e;
},
Array.prototype.remove = function (t)
{
    var e = this.indexOf(t);
    e !==- 1 && this.splice(e, 1)
},
Array.prototype.removeAll = function (t)
{
    return this.filter(function (e)
    {
        return!universalFilter(t, e)
    })
},
Array.prototype.without = function (t)
{
    return this.filter(function (e, i, n)
    {
        return e != t;
    })
},
Array.prototype.unique = function (t)
{
    var e = [], i;
    if (t)
    {
        for (i = 0; i < this.length; i++) 
        {
            for (var n = false, s = 0; s < e.length; s++) {
                if (n = n || t(this [i], e[s])) {
                    break;
                }
                n || e.push(this [i]) ;
            }
        }
    }
    else {
        for (i = 0; i < this.length; i++) {
            e.indexOf(this [i]) !=- 1 && e.push(this [i]);
        }
    }
    return e;
},
Array.prototype.sum = function ()
{
    for (var t = 0, e = 0; e < this.length; e++) {
        t += this [e];
    }
    return t;
},
Array.prototype.split = function (t)
{
    for (var e = [], i = 0; i < this.length; i++) {
        var n = Math.floor(i / t);
        void 0 == e[n] && (e[n] = []), e[n].push(this [i])
    }
    return e;
},
Array.prototype.pluck = function ()
{
    var t = Array.prototype.slice.apply(arguments);
    return this.map(function (e)
    {
        return t.length > 1 ? t.reduce(function (t, i)
        {
            return t[i] = e[i], t;
        },
        {}) : e[t[0]]
    })
},
Array.prototype.mul = function (t)
{
    return this.map(function (e)
    {
        return e * t;
    })
},
Array.prototype.equals = function (t)
{
    return JSON.stringify(this) == JSON.stringify(t);
},
Array.range = function (t, e)
{
    for (var i = t > e ?- 1 : 1, n = [], s = t; s != e; s += i) {
        n.push(s);
    }
    return n.push(s), n;
},
Array.fromObject = function (t)
{
    var e = [];
    if ("undefined" != typeof t.length) {
        for (var i = 0; i < t.length; i++) {
            e[i] = t[i];
        }
    }
    return e;
},
Array.prototype.isTheSame = function (t)
{
    if (this.length != t.length) {
        return false;
    }
    for (var e = 0; e < this.length; e++) {
        if (this [e] != t[e]) {
            return false;
        }
        return true;
    }
},
Array.prototype.last = function ()
{
    return this.length ? this [this.length - 1] : void 0;
},
Array.prototype.indexOfArray = function (t)
{
    for (var e = 0; e < this.length - t.length + 1; e++) {
        for (var i = true, n = 0; n < t.length; n++) {
            i = i && this [e + n] === t[n];
        }
        if (i) {
            return e;
        }
    }
    return - 1;
},
Array.prototype.pickFromRange = function (t)
{
    return t < 0 && (t = 0), t > 100 && (t = 100), this [Math.round(t / 100 * (this.length - 1))];
},
Array.prototype.firstHigher = function (t)
{
    for (var e = 0, i = 0; i < this.length; i++) {
        if (e = Math.max(t, this [i]), e > t) {
            break;
        }
        return e;
    }
},
Number.prototype.px = function ()
{
    return String.format("{0}px", this);
},
Number.prototype.pc = function ()
{
    return String.format("{0}%", this);
},
Number.prototype.times = function (t)
{
    for (var e = 0; e < this; e++) {
        t(e);
    }
},
Number.prototype.within = function (t, e)
{
    return this >= t && this <= e;
},
Number.prototype.inside = function (t, e)
{
    return this > t && this < e;
},
Number.prototype.toZeroLeadedString = function (t, e)
{
    var i = this.toString(e || 10);
    while (i.length < t) {
        i = "0" + i;
    }
    return i;
},
String.prototype.substituteTokens = function (t)
{
    return this.replace(/\${([^}]*)}/g, function (e, i)
    {
        return i in t ? t[i] : e;
    })
},
Date.now || (Date.now = function t()
{
    return (new Date).getTime();
}), Date.prototype.format = function (t)
{
    var e = this.getDate(), i = this.getMonth() + 1, n = this.getFullYear(), s = this.getHours(), o = this.getMinutes(), 
    a = this.getSeconds(), r = Handlebars.compile(t);
    return r(
    {
        d : e, dd : TextUtils.widthedNumber(e, 2), M : i, MM : TextUtils.widthedNumber(i, 2), y : n, yy : TextUtils.widthedNumber(n, 
        2), yyyy : TextUtils.widthedNumber(n, 4), h : s, hh : TextUtils.widthedNumber(s, 2), m : o, mm : TextUtils.widthedNumber(o, 
        2), s : a, ss : TextUtils.widthedNumber(a, 2)
    })
},
Object.pickValues || Object.defineProperty(Object.prototype, "pickValues", 
{
    writable : false, enumerable : false,
    value : function (t)
    {
        return Object.keys(this).filter(universalFilter.bind(null, t)).reduce(function (t, e)
        {
            return t[e] = this [e], t
        }
        .bind(this), {})
    }
}), Object.assign || Object.defineProperty(Object, "assign", 
{
    enumerable : false, configurable : true, writable : true,
    value : function (t, e)
    {
        "use strict";
        if (void 0 === t || null === t) {
            throw new TypeError("Cannot convert first argument to object");
        }
        for (var i = Object(t), n = 1; n < arguments.length; n++)
        {
            var s = arguments[n];
            if (void 0 !== s && null !== s) for (var o = Object.keys(Object(s)), a = 0, r = o.length;
            a < r;
            a++)
            {
                var l = o[a], h = Object.getOwnPropertyDescriptor(s, l);
                void 0 !== h && h.enumerable && (i[l] = s[l]);
            }
        }
        return i;
    }
}), Math.getRandomInt = function (t, e)
{
    return Math.floor(Math.random() * (e - t + 1)) + t;
},
Math.getRandomArbitary = function (t, e)
{
    return Math.random() * (e - t) + t;
};
var TextUtils = 
{
    widthedNumber : function (t, e)
    {
        var i = String(t);
        while (i.length < e) {
            i = "0" + i;
        }
        return i;
    },
    px : function (t)
    {
        return String.format("{0}px", t);
    }
};
String.format = function ()
{
    var t = arguments[0];
    if (1 == arguments.length) {
        return arguments[0];
    }
    var e, i;
    if (null != arguments[1])
    {
        switch (arguments[1].constructor) 
        {
            case Array:
                e = arguments[1];
                break;
            case Object:
                e = [];
                for (i in arguments[1]) {
                    e.push(arguments[1][i]);
                }
                break;
            default : e = $(arguments).slice(1).toArray() 
        }
    }
    else {
        e = $(arguments).slice(1).toArray();
    }
    for (i = 0; i < e.length; i++)
    {
        var n = "{" + i + "}", s = null == e[i] ? "" : e[i].toString(), o = 0;
        while ((o = t.indexOf(n, o)) !=- 1) {
            t = t.replace(n, s), o += s.length;
        }
    }
    return t;
},
String.formatAll = function (t, e, i)
{
    return Array.range(t, e).map(String.format.bind(null, i));
},
String.formatRange = function (t, e)
{
    return t.map(String.format.bind(null, e));
},
TimeoutChain.newInstance = function ()
{
    return new TimeoutChain;
},
TimeoutChain.prototype.constructor = TimeoutChain, TimeoutChain.prototype.waitFor = function (t)
{
    var e, i = $.Deferred();
    return e = setTimeout(function ()
    {
        i.resolve()
    }, t), i.then(function ()
    {
        clearTimeout(e)
    },
    function ()
    {
        clearTimeout(e)
    }), i
},
TimeoutChain.prototype.append = function (t, e)
{
    return this.promise = this.promise || $.when(), this.promise = this.promise.then(function ()
    {
        return this.lastTimeoutPromise = this.waitFor(t)
    }
    .bind(this)), e && (this.promise = this.promise.then(function ()
    {
        e && e()
    }
    .bind(this))), this
},
TimeoutChain.prototype.build = function ()
{
    return this.promise;
},
TimeoutChain.prototype.kill = function ()
{
    this.lastTimeoutPromise && this.lastTimeoutPromise.reject()
},
Logger.MAX_RECORDS_COUNT = 1e3, Logger.ERROR = 1, Logger.WARN = 2, Logger.INFO = 3, Logger.DEBUG = 4, 
Logger.REQUEST = 5, Logger.RESPONSE = 6, Logger.prototype.constructor = Logger, Logger.prototype.log = function (t, 
e)
{
    if (gameConfig.debug)
    {
        e = Array.prototype.slice.call(arguments), arguments.length > 1 ? e.shift() : t = Logger.DEBUG;
        var i = {
            time : (new Date).getTime(), message : e, level : t
        };
        if (this.records.push(i), this.records.length > Logger.MAX_RECORDS_COUNT && this.records.shift(), 
        this.console) switch (t)
        {
            case Logger.REQUEST:
            case Logger.RESPONSE:
            this.console.dirxml.apply(this.console, e.map(function (t)
            {
                return $(t)[0];
            }));
            break;
            case Logger.ERROR:
            this.console.error.apply(this.console, e);
            break;
            case Logger.WARN:
            this.console.warn.apply(this.console, e);
            break;
            case Logger.INFO:
            this.console.info.apply(this.console, e);
            break;
            case Logger.DEBUG:
            this.console.log.apply(this.console, e)
        }
    }
},
Logger.prototype.debug = function (t)
{
    this.log.apply(this, [Logger.DEBUG].concat(Array.prototype.slice.call(arguments)))
},
Logger.prototype.error = function (t)
{
    this.log.apply(this, [Logger.ERROR].concat(Array.prototype.slice.call(arguments)))
},
Logger.prototype.warn = function (t)
{
    this.log.apply(this, [Logger.WARN].concat(Array.prototype.slice.call(arguments)))
},
Logger.prototype.info = function (t)
{
    this.log.apply(this, [Logger.INFO].concat(Array.prototype.slice.call(arguments)))
};
var logger = new Logger;
UserConfig.prototype.props = 
{
    shifterConfig : {
        savable : true, "default" : []
    },
    musicOn : {
        savable : true, "default" : true
    },
    musicLevel : {
        savable : true, "default" : 100
    },
    sfxOn : {
        savable : true, "default" : true
    },
    sfxLevel : {
        savable : true, "default" : 100
    },
    autoSpinEnabled : {
        savable : false, "default" : false
    },
    quickSpinEnabled : {
        savable : true, "default" : false
    },
    tutorialPassed : {
        savable : true, "default" : false
    }
},
UserConfig.prototype.constructor = UserConfig, UserConfig.prototype.isLocalStorageAvailable = function ()
{
    try
    {
        return localStorage.setItem("testItem", "1"), localStorage.removeItem("testItem"), "localStorage"in window && null !== window["localStorage"]
    }
    catch (t) {
        return false;
    }
},
UserConfig.prototype.loadConfig = function ()
{
    if (this.isLocalStorageAvailable())
    {
        var t;
        t = JSON.parse(localStorage.getItem(gameConfig.name)), t || (t = {}), $.extend(true, this.data, 
        t)
    }
},
UserConfig.prototype.saveConfig = function ()
{
    if (this.isLocalStorageAvailable())
    {
        var t = {};
        Object.keys(this.data).filter(function (t)
        {
            return!!this.props[t] && this.props[t].savable
        }
        .bind(this)).forEach(function (e)
        {
            t[e] = this.data[e]
        }
        .bind(this)), localStorage.setItem(gameConfig.name, JSON.stringify(t));
    }
};
var userConfig = new UserConfig;
GameConfig.prototype.defaultPropValues = 
{
    autoplayDelay : 3, autoplayNumber : 20, autoAdjust : true, autoplayLossLimit : 0, autoplaySingleWinLimit : 0, 
    autoplayNumberRange : [5, 10, 25, 50, 100, 250, 500, 999], autoplayLossLimitRange : [5, 10, 25, 50, 
    100, 250, 500, 999], autoplaySingleWinLimitRange : [5, 10, 25, 50, 100, 250, 500, 999], showBonusAutoplay : false, 
    cashier_url : "", customErrorReporter : "OriginErrorReporter", customShifter : "SlotShifter", debug : false, 
    decimal_separator : "", denum : 100, cutMoneyFractional : false, cutMoneyZeroFractional : false, error_url : "", 
    exit_url : "", gameVersion : "", grouping_separator : "", guid : "", hideServerLogs : true, lang : "en", 
    loaded : false, lobby_active : true, name : "", nofullscreen : false, performRetry : true, report_url : "./report.php", 
    rtp : "", server_url : "", session : "", shifter_enabled : false, showCopyright : false, showGambleInfo : false, 
    showRtp : false, showVersion : false, originSpinner : false, timeOut : 1e4, timeOutAttempts : 3, longWaitTimeout : 4e3, 
    useCurrencyName : false, useCurrencySymbol : false, useExternalBalance : false, wl : "", noGiftSpins : false, 
    disableTabWindowVisibilityManager : false, isLowResolutionGraphics : false, realityCheckEnabled : false, 
    realityCheckURL : "", big_money_format : false, currency : null
},
GameConfig.prototype.constructor = GameConfig, GameConfig.prototype.loadConfig = function (t)
{
    $.extend(true, this.data, t)
};
var gameConfig = new GameConfig, slotConfig = 
{
    reelsStartSequence : null, reelsStopSequence : null, reelsStandardSpeed : 20, reelsHighSpeed : 60, 
    certified : false, forceDisableSoundEngine : false, supportsLowResolutionGraphics : false, notCachingImage : false, 
    autoplayLossLimit : 0, autoplaySingleWinLimit :- 1, winPanel : 
    {
        showTime : 500, hideTime : 200, gameTypes : 
        {
            main : 
            {
                counterIsRolling : true, normalWinForNormalTiming : 1500, normalWinStillTiming : 1e3, 
                normalWinForBigWinTiming : 750, bigWinTiming : 5e3, bigWinStillTiming : 5e3, megaWinTiming : 5e3
            },
            gamble : 
            {
                counterIsRolling : false, normalWinForNormalTiming : 1500, normalWinStillTiming : 0, normalWinForBigWinTiming : 750, 
                bigWinTiming : null, bigWinStillTiming : null, megaWinTiming : null
            },
            freeSpins : 
            {
                counterIsRolling : true, normalWinForNormalTiming : 1500, normalWinStillTiming : 1e3, 
                normalWinForBigWinTiming : 750, bigWinTiming : 5e3, bigWinStillTiming : 3e3, megaWinTiming : 5e3
            },
            auto : 
            {
                counterIsRolling : true, normalWinForNormalTiming : 1500, normalWinStillTiming : 1e3, 
                normalWinForBigWinTiming : 750, bigWinTiming : 5e3, bigWinStillTiming : 3e3, megaWinTiming : 5e3
            },
            bonus : 
            {
                counterIsRolling : true, normalWinForNormalTiming : 1500, normalWinStillTiming : 1e3, 
                normalWinForBigWinTiming : 750, bigWinTiming : 5e3, bigWinStillTiming : 3e3, megaWinTiming : 5e3
            }
        },
        afterMegaWinAccMaxTotalBets : 500, afterMegaWinAccMaxTiming : 2e4
    },
    showPartialAnimations : 
    {
        main : {
            quick : true, regular : true
        },
        freeSpins : {
            quick : false, regular : true
        },
        auto : {
            quick : false, regular : true
        }
    },
    gamePopups : {
        autoCloseTimeout : 5e3, minSkipTimeout : 1e3
    },
    bigWinTotalBets : 15, megaWinTotalBets : 30, afterMegaWinTotalBets : 45, giftSpinsSavingProgress : false, 
    noGiftSpins : false, gameTitle : ""
};
GameEvent.INIT = "init", GameEvent.START = "start", GameEvent.PROGRESS = "progress", GameEvent.COMPLETE = "complete", 
GameEvent.RESOURCES_COMPLETE = "resourcesComplete", GameEvent.INIT_COMPLETE = "initComplete", GameEvent.ENTER_FRAME = "enterFrame", 
GameEvent.UPDATE = "update", GameEvent.TOUCH_START = "touchstart", GameEvent.TOUCH_END = "touchend", GameEvent.TOUCH_MOVE = "touchmove", 
GameEvent.TOUCH_LEAVE = "touchleave", GameEvent.TOUCH_CANCEL = "touchcancel", GameEvent.UI_ON_SCREEN_TOUCH = "uionscreentouch", 
GameEvent.CLICK = "click", GameEvent.CONNECT = "connect", GameEvent.ERROR = "error", GameEvent.SESSION_LOST = "sessionlost", 
GameEvent.EXCESS = "excess", GameEvent.RESPONSE = "response", GameEvent.LONG_WAIT_RESPONSE = "longwaitresponse", 
GameEvent.CASH = "cash", GameEvent.GIFT_SPINS = "giftspins", GameEvent.GIFT_SPINS_ACTION = "giftspinsaction", 
GameEvent.SERVER_BALANCE = "serverbalance", GameEvent.TIMEOUT = "timeout", GameEvent.ENTER_STATE = "enterState", 
GameEvent.EXIT_STATE = "exitState", GameEvent.RESIZE = "resize", GameEvent.ORIENTATION = "onorientationchange", 
GameEvent.SETTING_CHANGED = "settingchanged", GameEvent.CONTENT_CHANGED = "contentchanged", GameEvent.WIN_PANEL_ROLLING_STOP = "winpanelrollingstop", 
GameEvent.WIN_PANEL_HIDE = "winpanelhide", GameEvent.prototype.stopPropagation = function ()
{
    this._isPropagating = false;
},
EventDispatcher.prototype._DISABLED_STUB = {}, EventDispatcher.prototype.addEventListener = function (t, 
e, i, n)
{
    if (!t || !e) {
        throw new Error("Wrong arguments: type=" + t + ", listener=" + e + ".");
    }
    i = i || window, isNaN(n) && (n = 0), this.listeners[t] || (this.listeners[t] = []);
    for (var s = this.listeners[t], o = this._eventsToDispatch.length > 0 && this._eventsToDispatch[0].type == t ? this._currentIndex + 1 : 0; o < s.length && s[o].priority < n; o++); s.splice(o, 
    0, {
        listener : e, context : i, priority : n
    })
},
EventDispatcher.prototype.addEventListenerOnce = function (t, e, i, n)
{
    var s = function (n)
    {
        this.removeEventListener(t, s, this), e.call(i, n)
    };
    this.addEventListener(t, s, this, n)
},
EventDispatcher.prototype.removeEventListener = function (t, e, i)
{
    if (!t || !e) {
        throw new Error("Wrong arguments: type=" + t + ", listener=" + e + ".");
    }
    i = i || window;
    var n = this.listeners[t];
    if (!n) {
        return false;
    }
    for (var s = 0; s < n.length; s++)
    {
        var o = n[s];
        if (o.listener == e && o.context == i) {
            return n[s] = EventDispatcher.prototype._DISABLED_STUB, true;
        }
    }
},
EventDispatcher.prototype.dispatchEvent = function (t)
{
    if (!t) {
        throw new Error("Wrong event");
    }
    this._eventsToDispatch.push(t), this._currentIndex ==- 1 && this.doDispatch()
},
EventDispatcher.prototype.doDispatch = function ()
{
    while (this._eventsToDispatch.length > 0)
    {
        var t = this._eventsToDispatch[0], e = this.listeners[t.type];
        if (e)
        {
            for (t.target = this, t._isPropagating = true, this._currentIndex = 0; this._currentIndex < e.length && t._isPropagating; this._currentIndex++)
            {
                var i = e[this._currentIndex];
                i !== EventDispatcher.prototype._DISABLED_STUB && i.listener.call(i.context, t)
            }
            this.listeners[t.type] = e.filter(function (t)
            {
                return t !== EventDispatcher.prototype._DISABLED_STUB;
            }).sort(function (t, e)
            {
                return t.priority - e.priority;
            })
        }
        this._eventsToDispatch.shift()
    }
    this._currentIndex =- 1
},
UIComponent.prototype = Object.create(EventDispatcher.prototype), UIComponent.prototype.constructor = UIComponent, 
UIComponent.prototype.defineCachableProperty = function (t, e, i)
{
    var n = {
        enumerable : true,
        get : function ()
        {
            return s;
        },
        set : function (t)
        {
            s !== t && (s = t, e(s));
        }
    },
    s = i;
    return Object.defineProperty(this, t, n), this;
},
UIComponent.prototype.initDOM = function ()
{
    return this;
},
UIComponent.prototype.onClientUpdate = function (t)
{
    return this.clientUpdateHandler && clientData.removeEventListener(GameEvent.UPDATE, this.clientUpdateHandler, 
    this), this.clientUpdateHandler = t, clientData.addEventListener(GameEvent.UPDATE, this.clientUpdateHandler, 
    this), this;
},
UIComponent.prototype.onVisibilityChange = function (t)
{
    return this.onVisibilityChangeHandler = t.bind(this), this;
},
UIComponent.prototype.waitFor = function (t)
{
    var e = $.Deferred();
    return setTimeout(function ()
    {
        e.resolve()
    }, t), e.promise()
},
UILabel.prototype = Object.create(UIComponent.prototype), UILabel.prototype.constructor = UILabel, UIButton.LONG_TAP_TIMEOUT = 300, 
UIButton.prototype = Object.create(UIComponent.prototype), UIButton.prototype.constructor = UIButton, 
UIButton.prototype.lock = function ()
{
    return this.locked = true, this;
},
UIButton.prototype.unlock = function (t, e)
{
    return "number" != typeof e && (e = 0), setTimeout(function () {
        this.locked = false, "function" == typeof t && t()
    }
    .bind(this), e), this;
},
UIButton.prototype.onClick = function (t)
{
    return this.onClickHandler && this.dom.unbind(ui.click), this.onClickHandler = function (t, e)
    {
        return this.locked ? void e.preventDefault() : void ui.controlActions.proxy(function ()
        {
            if (e.preventDefault(), this.longTapped) {
                return void (this.longTapped = false);
            }
            var i = false;
            /touch/.test(e.type) && (i = (e.originalEvent || e).touches.length > 0), i || t(e)
        }
        .bind(this))
    }
    .bind(this, t.bind(this)), this.dom.bind(ui.click, this.onClickHandler), this
},
UIButton.prototype.triggerClick = function ()
{
    this.onClickHandler && this.onClickHandler()
},
UIButton.prototype.onLongTap = function (t)
{
    return this.onLongTapHandler && this.dom.unbind(ui.touchstart).unbind(ui.touchend), this.onLongTapHandler = function (t)
    {
        this.locked || (this.longTapTimeout = null, this.longTapped = true, t())
    }
    .bind(this, t.bind(this)), this.dom.bind(ui.touchstart, this.onMouseDown.bind(this)).bind(ui.touchend, 
    this.onMouseUp.bind(this)), this;
},
UIButton.prototype.onMouseDown = function (t)
{
    if (this.locked) {
        return void t.preventDefault();
    }
    var e;
    return / touch / .test(t.type) && (e = Array.fromObject((t.originalEvent || t).touches)), (!e || e.length < 2) && (this.longTapped = false, 
    void (this.longTapTimeout = setTimeout(this.onLongTapHandler, UIButton.LONG_TAP_TIMEOUT)));
},
UIButton.prototype.onMouseUp = function (t)
{
    if (!this.locked)
    {
        var e;
        /touch/.test(t.type) && (e = Array.fromObject((t.originalEvent || t).touches)), (!e || e.length < 2) && this.longTapTimeout && (clearTimeout(this.longTapTimeout), 
        this.longTapTimeout = null);
    }
},
UISpinButton.prototype = Object.create(UIButton.prototype), UISpinButton.prototype.constructor = UISpinButton, 
UICheckbox.prototype = Object.create(UIComponent.prototype), UICheckbox.prototype.constructor = UICheckbox, 
UICheckbox.prototype.onChange = function (t)
{
    return this.onChangeHandler = t.bind(this), this;
},
UICheckbox.prototype.triggerClick = function ()
{
    this.onChangeHandler && this.onChangeHandler()
},
UISlider.prototype = Object.create(UIComponent.prototype), UISlider.prototype.constructor = UISlider, 
UISlider.prototype.offsetToValue = function (t)
{
    return Math.round(t / this.dom.width() * (this.max - this.min) + this.min);
},
UISlider.prototype.onResize = function ()
{
    setTimeout(function ()
    {
        var t = this.background[0].getBoundingClientRect();
        if (ENV.iOSDevice && ENV.isUCBrowser)
        {
            var e = this.background.offset();
            t = {
                left : e.left, top : e.top, width : this.background.width() * ui.scale
            }
        }
        this.thumb.draggable("option", "containment", [t.left, t.top, t.left + t.width, t.top])
    }
    .bind(this), 500)
},
UISlider.prototype.refresh = function ()
{
    var t = Math.round(100 * (this.value - this.min) / (this.max - this.min)).pc(), e = {
        left : t, top : ""
    };
    this.dragging && (e.top = "0px"), this.thumb.css(e), this.progress.css("width", t);
},
UISlider.prototype.onChange = function (t)
{
    return this.onChangeHandler = t.bind(this), this;
},
UIController.baseScreenSize = 720, UIController.prototype = Object.create(EventDispatcher.prototype), 
UIController.prototype.constructor = UIController, UIController.prototype.initDialogs = function ()
{
    var t = $.Deferred();
    return this.restarted ? t.resolve() : (this.infoDialog = new UIInfoPopup("#popups > .info-popup"), 
    this.confirmDialog = new UIConfirmPopup("#popups > .confirm-popup"), this.confirmDialog.visible = true, 
    setTimeout(function ()
    {
        this.confirmDialog.visible = false, t.resolve()
    }
    .bind(this))), t.promise();
},
UIController.prototype.initPreloadDOM = function ()
{
    this.window = $(window), this.document = $(document), this.body = $(document.body), this.body.addClass("lang-" + locale.locale), 
    this.gameOrientationMarker = $("#orient-marker > .game"), this.uiOrientationMarker = $("#orient-marker > .ui"), 
    this.root = $("#ui"), this.wrapper = $("#root-wrapper"), this.awaitor = new UIComponent("#awaitor"), 
    this.clickAwaitor = $("#click-awaitor"), this.generalControls = new UIComponent("#general-controls"), 
    preloader = new Preloader, this.actionsWatcher(), this.spinner = $("#spinner"), this.preloader = $("#preloader-container");
},
UIController.prototype.start = function (t)
{
    return this.restarted = t, logger.debug("UIController is starting"), systemLoader.debugMessage("UIController is starting"), 
    this.loadGameLocale().then(this.initDialogs.bind(this)).then(this.setGameResolutionByConfig.bind(this)).then(this.loadUILocale.bind(this)).then(this.loadRequiredUIFonts.bind(this)).then(this.loadPreloaderResources.bind(this)).then(systemLoader.loadStyles.bind(systemLoader)).then(this.initPreloadDOM.bind(this)).then(this.hideSpinner.bind(this)).then(this.checkDeviceCompatibility.bind(this)).then(this.showAndStartPreloader.bind(this)).then(this.loadGameSounds.bind(this)).then(this.loadTemplates.bind(this)).then(this.prepareTemplates.bind(this)).then(this.initDOM.bind(this)).then(this.loadRealityCheckScript.bind(this)).then(this.initDebugTools.bind(this)).then(this.setInitialized.bind(this)).then(this.loadImages.bind(this)).then(this.connectToServer.bind(this)).then(this.onConnectedToServer.bind(this)).then(this.customAfterLoadActions.bind(this)).then(this.initFullscreen.bind(this)).then(this.startWithCurtain.bind(this)).then(this.launchGame.bind(this)).then(this.hidePreloader.bind(this)).then(this.drawGame.bind(this)).then(this.pauseGame.bind(this)).then(this.soundEnableConfirm.bind(this)).then(this.tutorialInit.bind(this)).then(this.resumeGame.bind(this)).then(this.showGiftWin.bind(this)).then(this.showNewGiftOffersConfirm.bind(this)).done(this.loadDone.bind(this)).fail(this.restart.bind(this));
},
UIController.prototype.loadGameSounds = function ()
{
    this.soundEnable && (logger.debug("UIController.loadGameSounds"), sound.load())
},
UIController.prototype.restart = function ()
{
    setTimeout(function ()
    {
        systemLoader.debugMessage("Try to restart UILoader"), this.start(true)
    }
    .bind(this), 3e3), systemLoader.debugMessage("<div>Connection lost</div><div>Trying to restart UILoader (" + SystemLoader.tryReconnect + ")</div>")
},
UIController.prototype.initFullscreen = function ()
{
    var t = $.Deferred();
    return this.fullscreen = new UIFullscreen($("#advice"), t), t.promise();
},
UIController.prototype.loadRealityCheckScript = function ()
{
    systemLoader.debugMessage("loadRealityCheckScript"), systemLoader.loadScriptChain([gameConfig.realityCheckURL]).then(this.onRealityCheckScriptLoaded.bind(this))
},
UIController.prototype.onRealityCheckScriptLoaded = function ()
{
    logger.debug("Reality check init!");
    var t = 
    {
        freeze : this.onRealityCheckPause.bind(this), unfreeze : this.onRealityCheckResume.bind(this), 
        popup : function (t, e)
        {
            switch (t) {
                case "ignore":
                    this.onPopupIgnore(e);
                    break;
                case "close":
                    this.onPopupClose(e)
            }
            console.log("game unfreeze")
        }
        .bind(this), container : this.realityCheckContainer
    };
    this.externalEvent = externalEvent, this.externalEvent("game", "subscribe", t);
},
UIController.prototype.onPopupIgnore = function (t)
{
    var e = function ()
    {
        document.location = gameConfig.exit_url;
    };
    switch (t.statusErrorCode)
    {
        case "FATAL_ERROR":
            ui.infoDialog.showById("ui", false, "FATAL_ERROR", e);
            break;
        default:
            if ("fail" == serverData.status)
            {
                var i = clientData.freegamesActive || serverData.gamble_round !=- 1 || serverData.bonus_round !=- 1 ? "POPUP_SESSION_DATA_CRASHED" : "POPUP_OOPS";
                ui.infoDialog.showById("ui", "", i, function ()
                {
                    clientData.act("close")
                }, 4e3)
            }
            else
            {
                gameConfig.autoAdjust && clientData.getTotalBet() <= clientData.getAvailableBalance() ? ui.infoDialog.showById("ui", 
                "", "POPUP_BET_REDUCED", function () 
                {
                    clientData.act("close") 
                }, 4e3) : ui.infoDialog.showById("ui", "", "POPUP_NO_MONEY", function () 
                {
                    h5game.cashier(), clientData.act("close") 
                }, 4e3);
            }
    }
},
UIController.prototype.onPopupClose = function (t)
{
    var e = function ()
    {
        document.location = gameConfig.exit_url;
    };
    switch (t.statusErrorCode)
    {
        case "MAX_BET_EXCEED":
        case "NOT_ENOUGH_MONEY":
            h5game.cashier(), clientData.act("close");
            break;
        case "FATAL_ERROR":
            e()
    }
},
UIController.prototype.onRealityCheckPause = function (t)
{
    console.log("Reality check show!"), this.isInRealityCheckMode = true, Stage.pauseAll(), t && t();
},
UIController.prototype.onRealityCheckResume = function (t)
{
    console.log("Reality check hide!"), this.isInRealityCheckMode = false, this.canResume() && Stage.resumeAll(), 
    t && t();
},
UIController.prototype.setInitialized = function ()
{
    this.initialized = true;
},
UIController.prototype.setGameResolutionByConfig = function ()
{
    this.isLowResolution = this.isLowResolution || gameConfig.isLowResolutionGraphics;
},
UIController.prototype.canResume = function ()
{
    return (this.fullscreen && this.fullscreen.data.fullscreen || !this.fullscreen) && !this.isInRealityCheckMode;
},
UIController.prototype.deployNewDOM = function ()
{
    var t = $("#root-wrapper");
    t.append($(this.newDOMText).children())
},
UIController.prototype.initDOM = function ()
{
    var t = this;
    ENV.isAndroid && ENV.isUCBrowser && $(window).on("orientationchange.ui", function ()
    {
        var t = ui.spinMenu.visible;
        ui.spinMenu.visible = false, setTimeout(function ()
        {
            t && (ui.spinMenu.visible = true);
        }, 50)
    }
    .bind(this)), window.addEventListener("ontouchstart"in window ? "touchstart" : "click", this.onScreenTouch.bind(this), 
    true), gameConfig.disableTabWindowVisibilityManager || this.window.TabWindowVisibilityManager(
    {
        onFocusCallback : function ()
        {
            Stage.recreateAll(), Stage.redrawAll(), this.canResume() ? Stage.resumeAll() : Stage.pauseAll(), 
            this.preloader = $("#preloader-container")
        }
        .bind(this),
        onBlurCallback : function ()
        {
            Stage.pauseAll()
        }
    }), this.homeButton = new UIButton("#home-button").onClick(this.onHomeButtonClick.bind(this)), this.betButton = new UIButton("#bet-button").onClientUpdate(function ()
    {
        this.visible = clientData.betSettingsActive();
    }).onClick(this.onBetButtonClick.bind(this)), this.settingsButton = new UIButton("#settings-button").onClientUpdate(function ()
    {
        this.visible = clientData.menuActive();
    }).onClick(this.onSettingsButtonClick.bind(this)), this.gambleButton = new UIButton("#gamble-button").onClientUpdate(function ()
    {
        this.visible = clientData.isActionAvailable("gamble.start") && !clientData.autoplayActive && gameConfig.showGambleInfo;
    }).onClick(function ()
    {
        t.soundGambleClick(), clientData.startGamble(), systemLoader.sendAnalyticsData("main", "gamble")
    }), this.gambleTakeOutButton = new UIButton("#gamble-take-out-button").onClientUpdate(function ()
    {
        this.visible = clientData.isActionAvailable("gamble.stop");
    }).onClick(function ()
    {
        clientData.act("gamble.stop")
    }), this.debugButton = new UIButton("#debug-button").onClientUpdate(function ()
    {
        this.visible = gameConfig.debug && clientData.state && !clientData.state.match(/^init/);
    }).onClick(function (t)
    {
        switch (true)
        {
            case t.ctrlKey:
                return void window.open("http://qrcoder.ru/code/?" + encodeURIComponent(location.href) + "&4&0");
            case t.shiftKey:
                return void this.shifterClass.instance.send();
            default:
                this.shifterClass.instance.open()
        }
    }
    .bind(this)), new UIComponent("#debug-stage-speed-buttons").onClientUpdate(function ()
    {
        this.visible = gameConfig.debug && clientData.state && !clientData.state.match(/^init/);
    }), $("#debug-stage-speed-buttons > div").map(function (t, e)
    {
        e = $(e), "1" == e.attr("speed") && e.addClass("selected"), new UIButton(e).onClick(function (t)
        {
            if (stage)
            {
                var e = $(t.target);
                stage.playbackRate = parseFloat(e.attr("speed")), e.addClass("selected"), e.siblings("div").removeClass("selected");
            }
        }
        .bind(this))
    }
    .bind(this)), clientData.addEventListener(GameEvent.UPDATE, this.onClientUpdate, this), serverData.addEventListener(GameEvent.UPDATE, 
    this.onServerUpdate, this), this.spinMenu = new UISpinMenu("#spin-menu", "#spin-button", true, true).onShow(function ()
    {
        ui.body.addClass("spin-menu")
    }
    .bind(this)).onHide(function (t)
    {
        this.onHideCustom(t), ui.body.removeClass("spin-menu"), void 0 !== t.quick && (this.spinMenu.quickVisible = userConfig.quickSpinEnabled = t.quick, 
        userConfig.quickSpinEnabled && "bet.idle" == clientData.state && ui.gameInfoBar.enabledQuickSpinMessage && (ui.gameInfoBar.messageQueue.push(ui.gameInfoBar.enabledQuickSpinMessage), 
        ui.gameInfoBar.nextMessage())), void 0 !== t.auto ? (userConfig.autoSpinEnabled == t.auto || t.auto || this.spinMenu.stopAutoPlay(), 
        this.spinMenu.autoVisible = t.auto, t.auto ? (this.spinMenu.autoVisible = false, clientData.areAutoplayLimitsDisabled() || clientData.isAutoplayNumberUnlimited() || clientData.giftspinsActive ? (clientData.giftspinsActive && (clientData.autoplayNumber = clientData.getCurrentGiftOffer().spinsLeft), 
        clientData.autoplayRemains = clientData.autoplayNumber, userConfig.autoSpinEnabled = true) : this.autoplaySettings.visible = true) : (clientData.stopAutoplay(), 
        this.showNewGiftOffersConfirm())) : this.showNewGiftOffersConfirm(), clientData.diff(), this.spinMenu.spinButton.stop = clientData.autoplayActive && userConfig.autoSpinEnabled
    }
    .bind(this)), this.mainMenu = new UIMainMenu("#main-menu"), this.mainMenu.onVisibilityChange(function ()
    {
        this.mainMenu.visible ? this.body.addClass("main-menu") : ([this.mainMenu.settings, this.mainMenu.giftSpins].forEach(function (t)
        {
            return!t.onClose()
        }), this.body.removeClass("main-menu"), this.showNewGiftOffersConfirm(), this.mainMenu.selectedTab = null)
    }
    .bind(this)), (gameConfig.noGiftSpins || slotConfig.noGiftSpins) && this.body.addClass("no-gift-spins"), 
    this.gameInfoBar = new UIInfoBar("#in-game > .info-bar").initDOM(), this.uiTutorial = new UITutorial("#tutorial-overlay").initDom(), 
    this.bottomBar = new UIBottomBar("#bottom-bar"), this.bottomBar.onClientUpdate(function (t)
    {
        void 0 != t.diff.balance && this.updateBalanceField(), void 0 == t.diff.bet && void 0 == t.diff.gamble_bet && "gamble.stop" != t.diff.state && "gamble.start" != clientData.state || this.updateTotalBetField()
    }
    .bind(this)), this.curtain = new UICurtain("#curtain"), window.oncontextmenu = function (t)
    {
        return t.preventDefault(), t.stopPropagation(), false;
    },
    (ENV.isUCBrowser || ENV.isQQBrowser) && $(window).on("touchstart touchend touchmove touchcancel", 
    function (t)
    {
        t.preventDefault()
    }), slotConfig.linesSet.length > 1 ? (this.betSettings = new UIBetLines("#bet-line-settings"), $("#bet-settings").remove()) : (this.betSettings = new UIBetSettings("#bet-settings"), 
    $("#bet-line-settings").remove()), this.betSettings.onVisibilityChange(this.onBetSettingsVisibilityChange.bind(this)), 
    this.autoplaySettings = new UIAutoplaySettings("#autoplay-settings"), this.autoplaySettings.onVisibilityChange(this.onAutoplaySettingsVisibilityChange.bind(this)), 
    stage = window["stage"] = new Stage, this.window.resize(this.onResize.bind(this)), this.fireOnResizeEvent(), 
    this.addEventListener(GameEvent.RESIZE, stage.onResize, stage), ENV.iOSDevice && ($(document.head).append($("<link/>").attr(
    {
        rel : "apple-touch-icon", href : systemLoader.inGamePath("res/img/apple-touch-icon.jpg")
    })), $(document.head).append($("<meta/>").attr({
        name : "apple-mobile-web-app-title", content : slotConfig.gameTitle
    }))), this.realityCheckContainer = $("#reality-check-container"), connection.addEventListener(GameEvent.LONG_WAIT_RESPONSE, 
    ui.startWaitResponse.bind(ui));
},
UIController.prototype.actionsWatcher = function ()
{
    this.controlActions = 
    {
        entryPt : {
            x : null, y : null
        },
        exitPt : {
            x : null, y : null
        },
        diff : 20, indentity : true,
        proxy : function (t)
        {
            setTimeout(function ()
            {
                "function" == typeof t && this.controlActions.identity && t.call(), this.controlActions.reset()
            }
            .bind(this))
        }
        .bind(this),
        reset : function ()
        {
            this.controlActions.entryPt = {
                x : null, y : null
            },
            this.controlActions.exitPt = {
                x : null, y : null
            },
            this.controlActions.identity = true
        }
        .bind(this)
    },
    this.wrapper.on(ui.touchstart, function (t)
    {
        var e = (t.originalEvent || t).changedTouches, i = {
            x : 0, y : 0
        },
        n = null;
        e && e.length && (i.x = e[0].clientX, i.y = e[0].clientY), this.controlActions.entryPt = i
    }
    .bind(this)), this.wrapper.on(ui.touchend, function (t)
    {
        var e = (t.originalEvent || t).changedTouches, i = {
            x : 0, y : 0
        };
        e && e.length && (i.x = e[0].clientX, i.y = e[0].clientY), this.controlActions.exitPt = i, this.controlActions.identity = Math.abs(this.controlActions.entryPt.x - this.controlActions.exitPt.x) <= this.controlActions.diff && Math.abs(this.controlActions.entryPt.y - this.controlActions.exitPt.y) <= this.controlActions.diff
    }
    .bind(this));
},
UIController.prototype.fireOnResizeEvent = function ()
{
    try {
        window.dispatchEvent(new Event("resize"))
    }
    catch (t) {
        this.onResize(), logger.error("No support for triggering window.resize")
    }
},
UIController.prototype.checkDeviceCompatibility = function ()
{
    var t = $.Deferred(), e = [], i = function ()
    {
        gameConfig.exit_url && (window.location.href = gameConfig.exit_url);
    },
    n = "4.4.4+", s = "29+", o = "8.0+", a = ENV.isUCBrowser || ENV.isQQBrowser || ENV.isChrome && ENV.iOSDevice || ENV.nativeAndroidBrowser;
    if (ENV.isAndroid && ENV.isChrome && ENV.compareVersions(ENV.androidVersion, n) >= 0 && ENV.compareVersions(ENV.chromeVersion, 
    s) >= 0 || ENV.iOSDevice && ENV.isSafari && ENV.compareVersions(ENV.iOSVersion, parseFloat(o).toString()) >= 0 || ENV.isDesktop && ENV.isNecessaryTechologiesSupports && (ENV.browsers.isFromList() || ENV.browsers.isFromList("gray"))) t.resolve();
    else if (ENV.isAndroid && ENV.isChrome && (ENV.compareVersions(ENV.androidVersion, n) < 0 || ENV.compareVersions(ENV.chromeVersion, 
    s) < 0) || ENV.iOSDevice && ENV.isSafari && ENV.compareVersions(ENV.iOSVersion, o) < 0 || (ENV.isAndroid || ENV.iOSDevice) && a) this.confirmDialog.textIdClasses.push("graylist-warning"), 
    this.confirmDialog.show(false, ENV.isAndroid ? String.format(locale.getText("ui", "DEVICE_TEST_GREY_LIST_ANDROID"), 
    n, s) : String.format(locale.getText("ui", "DEVICE_TEST_GREY_LIST_IOS"), o), function ()
    {
        t.resolve()
    },
    function ()
    {
        t.reject()
    });
    else if (ENV.isNecessaryTechologiesSupports)
    {
        var r = ENV.iOSDevice ? "_IOS" : ENV.isAndroid ? "_ANDROID" : "_BOTH";
        ENV.isWindows || (window.gameConfig.nofullscreen = true), this.confirmDialog.textIdClasses.push("blacklist-warning"), 
        this.confirmDialog.show(false, String.format(locale.getText("ui", "DEVICE_TEST_BLACK_LIST_BY_REQUIREMENTS" + r), 
        n, s, o), function ()
        {
            t.resolve()
        },
        function ()
        {
            t.reject()
        })
    }
    else
    {
        this.infoDialog.textIdClasses.push("blacklist-warning"), this.infoDialog.show(false, locale.getText("ui", 
        "DEVICE_TEST_BLACK_LIST_BY_REQUIREMENTS"), function () 
        {
            t.reject() 
        });
    }
    return t.promise().fail(i);
},
UIController.prototype.updateBalanceField = function ()
{
    this.bottomBar.balance = h5game.formatMeter(clientData.balance);
},
UIController.prototype.updateTotalBetField = function ()
{
    this.bottomBar.totalBet = h5game.formatMeter(clientData.getTotalBet());
},
UIController.prototype.resizeTimeout = null, UIController.prototype.onResize = function (t)
{
    clearTimeout(this.resizeTimeout);
    var e = new GameEvent(GameEvent.RESIZE);
    e.uiScale = this.scale, this.body[Math.min(window.innerHeight, window.innerWidth) < 400 ? "addClass" : "removeClass"]("lores"), 
    e.isUILandscape = this.isUILandscape(), e.isGameLandscape = this.isGameLandscape(), e.gameViewport = this.getGameViewport(), 
    this.dispatchEvent(e), this.controlActions.reset();
},
UIController.prototype.getGameViewport = function ()
{
    var t = Math.min(stage.canvas.width, this.wrapper.width());
    return {
        left : (stage.canvas.width - t) / 2, top : 0, width : t, height : 600
    }
},
UIController.prototype.onAutoPlayFinished = function ()
{
    var t = $.Deferred();
    return this.confirmDialog.showById("ui", "AUTOPLAY_REPEAT_TITLE", "AUTOPLAY_REPEAT_QUESTION", function ()
    {
        this.spinMenu.spinButton.stop = false, this.autoplaySettings.visible = true, userConfig.autoSpinEnabled = false, 
        clientData.act("close"), t.resolve()
    }
    .bind(this), function ()
    {
        userConfig.autoSpinEnabled = false, clientData.act("close"), t.resolve()
    }
    .bind(this)), t.promise();
},
UIController.prototype.onClientUpdate = function (t)
{
    if (this.giftsAvailable = clientData.giftOffers.some(function (t)
    {
        return ["deleted", "overdue", "finished"].indexOf(t.status) ==- 1;
    }), this.showNewGiftOffersConfirm(), t.diff.state && t.diff.state != clientData.state)
    {
        switch (clientData.state)
        {
            case "bet.autoplay":
                this.giftsActive && !!clientData.getFinishedGiftOffer() || this.onAutoPlayFinished();
                break;
            case "spin.start":
                clientData.giftspinsActive && clientData.autoplayActive && void 0 != t.diff.autoplayRemains && this.gameInfoBar.nextMessage();
                break;
            case "bet.idle":
                this.showNewGiftOffersConfirm(), !this.giftsActive && clientData.giftspinsActive ? (this.mainMenu.visible && (this.mainMenu.visible = false), 
                this.gameInfoBar.nextMessage()) : this.giftsActive && !clientData.giftspinsActive && this.gameInfoBar.nextMessage(), 
                clientData.giftspinsInterrupted && clientData.isActionAvailable("giftspins.interrupt") && !clientData.freegamesActive && clientData.act("giftspins.interrupt");
                break;
            case "giftspins.interrupted":
                this.spinMenu.attentionVisible = true, this.gameInfoBar.showById("ui", "GIFTSPINS_OFFER_REMOVED_BY_OPERATOR");
                var e = clientData.getCurrentGiftOffer();
                e && (e.status = "deleted"), this.pageWaitForClick(function ()
                {
                    this.spinMenu.attentionVisible = false, this.giftsActive = clientData.giftspinsActive = false, 
                    this.gameInfoBar.nextMessage(), this.mainMenu.showAndJumpTab(UIMainMenu.TAB_GIFT_SPINS), 
                    clientData.act("close")
                }
                .bind(this));
                break;
            case "giftspins.summary":
                this.showGiftWin();
                break;
            default:
                "gamble.start" == clientData.state ? ui.body.addClass("gamble") : "gamble.stop" == t.diff.state && ui.body.removeClass("gamble")
        }
        this.giftsActive = clientData.giftspinsActive;
    }
},
UIController.prototype.pageWaitForClick = function (t)
{
    this.pageWaitsForClick = true, this.clickAwaitor.one(ui.touchstart, function ()
    {
        t && t(), this.pageWaitsForClick = false
    }
    .bind(this));
},
UIController.prototype.showGiftWin = function ()
{
    if ("giftspins.summary" == clientData.state && this.soundRequested)
    {
        var t = clientData.getFinishedGiftOffer(), e = t.cashWinTotal ? slotConfig.giftSpinsSavingProgress ? "GIFT_SPINS_FINISH_WIN_WITH_PROGRESS" : "GIFT_SPINS_FINISH_WIN" : slotConfig.giftSpinsSavingProgress ? "GIFT_SPINS_FINISH_LOSE_WITH_PROGRESS" : "GIFT_SPINS_FINISH_LOSE";
        this.infoDialog.showById("ui", "", e, function ()
        {
            this.curtain.showAndHide(function ()
            {
                clientData.act("close")
            })
        }
        .bind(this), null, 
        {
            totalWin : currencyFormatter.format(t.cashWinTotal), totalBet : currencyFormatter.format(t.totalBet), 
            lines : t.lines, spins : t.spinsTotal - t.spinsLeft
        })
    }
},
UIController.prototype.showNewGiftOffersConfirm = function ()
{
    var t = $.Deferred();
    return this.spinMenu.expanded || clientData.freegamesActive || clientData.autoplayActive || userConfig.autoSpinEnabled || !this.soundRequested || this.autoplaySettings.visible || this.confirmDialog.visible || this.infoDialog.visible || this.betSettings.visible || !clientData.giftspinsNewOffers || this.mainMenu.visible || !clientData || "bet.idle" != clientData.state || clientData.giftspinsActive || clientData.giftspinsInterrupted ? t.resolve() : (this.confirmDialog.showById("ui", 
    null, "GIFTSPINS_CONFIRM_DISCOVER", function ()
    {
        this.mainMenu.showAndJumpTab(UIMainMenu.TAB_GIFT_SPINS), t.resolve()
    }
    .bind(this), function ()
    {
        t.resolve()
    }), clientData.giftspinsNewOffers = false), t.promise();
},
UIController.prototype.onServerUpdate = function (t)
{
    var e = t.response && t.response.attr("command") ? t.response.attr("command") : null;
},
UIController.prototype.initDebugTools = function ()
{
    this.fpsCounter = new FPSCounter("#fps-counter");
    var shifterClass = gameConfig.customShifter;
    this.shifterClass = eval(shifterClass), this.shifterClass.init("#shifter");
},
UIController.prototype.loadUILocale = function ()
{
    systemLoader.debugMessage("loadUILocale");
    var t = $.Deferred();
    return locale.load("ui", systemLoader.inUIPath("locales/" + locale.locale + ".xml")).then(function ()
    {
        t.resolve()
    },
    function ()
    {
        locale.locale = Locale["default"], locale.load("ui", systemLoader.inUIPath("locales/" + locale.locale + ".xml")).done(function ()
        {
            t.resolve()
        })
    }), t.promise()
},
UIController.prototype.loadGameLocale = function ()
{
    var t = $.Deferred();
    return locale.load("game", systemLoader.inGamePath("locales/strings-" + locale.locale + ".xml")).then(function ()
    {
        t.resolve()
    },
    function ()
    {
        locale.locale = Locale["default"], locale.load("game", systemLoader.inGamePath("locales/strings-" + locale.locale + ".xml")).done(function ()
        {
            t.resolve()
        }).fail(function ()
        {
            t.reject()
        })
    }), t.promise()
},
UIController.prototype.loadRequiredUIFonts = function ()
{
    systemLoader.debugMessage("loadRequiredUIFonts");
    var t = locale.extractFonts(), e = $.Deferred(), i = "";
    if (t.length)
    {
        for (var n = 0; n < t.length; n++)
        {
            var s = String($(t[n]).attr("name")), o = systemLoader.inUIPath("res/fonts/" + String($(t[n]).attr("src"))), 
            a = $(t[n]).attr("bold");
            i += '@font-face {\n\tfont-family: "' + s + '";\n' + (a ? "\tfont-weight: bold;\n" : "") + '\tsrc: url("' + o + '") format("truetype");\n}\n'
        }
        return $("head").prepend("<style type='text/css'>" + i + "</style>"), t.length ? window["WebFont"]["load"]( {
            timeout : 6e5,
            active : function ()
            {
                e.resolve()
            },
            inactive : function (t)
            {
                e.resolve()
            },
            custom : {
                families : t.map(function (t, e)
                {
                    return String($(e).attr("name"));
                })
            },
            fontactive : function (t, i)
            {
                e.resolve()
            }
        }) : e.resolve(), e.promise()
    }
},
UIController.prototype.loadPreloaderResources = function ()
{
    return systemLoader.debugMessage("loadPreloaderResources"), this.isLowResolution && logger.debug("Load low resolution graphics."), 
    Sprite.prototype.scaleFactor = this.canUseLowResolutionGraphics ? 2 : 1, imageLoader.addMultiple(Preloader.prototype.getResourceList()), 
    imageLoader.start();
},
UIController.prototype.loadImages = function ()
{
    logger.debug("UIController.loadImages"), systemLoader.debugMessage("loadImages"), imageLoader.addEventListener(GameEvent.PROGRESS, 
    this.onImageProcess, this);
    var t = game.getMainResourceList();
    t = t.map(function (t)
    {
        return [systemLoader.inGamePath(this.graphicsPrefix + t), t]
    }
    .bind(this)), this.body.addClass("main-menu");
    var e = this.collectDOMImagePaths(this.generalControls.dom);
    this.body.removeClass("main-menu"), this.awaitor.visible = true;
    var i = this.collectDOMImagePaths(this.awaitor.dom);
    return this.awaitor.visible = false, this.mainMenu.giftSpins.mockup(), this.mainMenu.giftSpins.update(), 
    imageLoader.addMultiple(Array.prototype.concat.call(this.collectDOMImagePaths(this.generalControls.dom), 
    this.collectDOMImagePaths(this.bottomBar.dom), this.collectDOMImagePaths(this.mainMenu.dom), this.collectDOMImagePaths(this.spinMenu.dom), 
    this.collectDOMImagePaths(this.betSettings.dom), this.collectDOMImagePaths(this.autoplaySettings.dom), 
    this.collectDOMImagePaths(this.confirmDialog.dom), this.collectDOMImagePaths(this.infoDialog.dom), 
    e, i, t)), this.mainMenu.giftSpins.unMockup(), imageLoader.start();
},
UIController.prototype.onImageProcess = function (t)
{
    preloader.setProgress(t.progress, Preloader.GAME_DATA)
},
UIController.prototype.collectDOMImagePaths = function (t)
{
    t.constructor == jQuery && (t = t[0]);
    for (var e = t.getElementsByTagName("*"), i = [], n = 0; n < e.length; n++)
    {
        var s = e[n], o = getComputedStyle(s), a;
        if (o["background-image"] && o["background-image"].match(/url\((.+)\)/))
        {
            var r = /url\((["']?)(.+?)\1\)/g, l;
            while (l = r.exec(o["background-image"])) {
                a = l[2], a && i.indexOf(a) ==- 1 && i.push(a);
            }
        }
        if ("IMG" == s.tagName)
        {
            var h = s.getAttributeNode("src");
            h && h.nodeValue && (a = h.nodeValue, a && i.indexOf(a) ==- 1 && i.push(a));
        }
    }
    return i;
},
UIController.prototype.customTemplates = function ()
{
    return{}
},
UIController.prototype.loadDOM = function ()
{
    return systemLoader.loadTemplateChain(
    {
        dom : systemLoader.inUIPath("index.html")
    }).pipe(function (t)
    {
        this.newDOMText = t.dom
    }
    .bind(this));
},
UIController.prototype.loadTemplates = function ()
{
    return logger.debug("UIController.loadTemplates"), systemLoader.debugMessage("loadTemplates"), systemLoader.loadTemplateChain($.extend(
    {
        slotShifter : systemLoader.inUIPath("templates/slot-shifter.html"), match3shifter : systemLoader.inUIPath("templates/match-3-shifter.html"), 
        settings : systemLoader.inUIPath("templates/settings.html"), giftSpins : systemLoader.inUIPath("templates/gift-spins.html"), 
        tutorial : systemLoader.inUIPath("templates/tutorial.html"), giftOffer : systemLoader.inUIPath("templates/gift-offer.html"), 
        info : systemLoader.inGamePath("templates/info.html"), payTable : systemLoader.inGamePath("templates/paytable.html")
    },
    this.customTemplates()), this.onLoadTemplateProgress.bind(this)).pipe(function (t)
    {
        this.templateData = t
    }
    .bind(this));
},
UIController.prototype.onLoadTemplateProgress = function (t)
{
    preloader.setProgress(t, Preloader.CORE)
},
UIController.prototype.prepareTemplates = function ()
{
    for (var t in this.templateData)
    {
        this.templateData.hasOwnProperty(t) && (this.templateData[t] = Handlebars.compile(this.templateData[t]));
    }
    Handlebars.registerHelper(
    {
        locale : function (t)
        {
            for (var e = "", i = 1; i < arguments.length - 1; i++) {
                e += arguments[i];
            }
            return locale.getText(t, e);
        },
        times : function (t, e)
        {
            for (var i = "", n = 0; n < t; ++n) {
                i += e.fn(n);
            }
            return i;
        },
        "for" : function (t, e, i)
        {
            for (var n = "", s = t; s < e; s++) {
                n += i.fn(s);
            }
            return n;
        },
        ternary : function (t, e, i)
        {
            return t ? e : i;
        },
        if_eq : function (t, e, i)
        {
            return t == e ? i.fn(this) : i.inverse(this);
        }
    })
},
UIController.prototype.showAndStartPreloader = function ()
{
    preloader.start()
},
UIController.prototype.hideSpinner = function ()
{
    this.spinner.addClass("hidden")
},
UIController.prototype.connectToServer = function ()
{
    systemLoader.debugMessage("connectToServer");
    var t = Date.now() - systemLoader.startTime;
    systemLoader.sendAnalyticsData("start", "resourcesLoaded", "load", t), connection.init(), serverData.start(), 
    clientData.start();
    var e = $.Deferred();
    return clientData.addEventListener(GameEvent.UPDATE, function (t)
    {
        t.diff.state && "init.ready" == clientData.state && e.resolve()
    }), e.promise()
},
UIController.prototype.onConnectedToServer = function ()
{
    var t = Date.now() - systemLoader.startTime;
    systemLoader.sendAnalyticsData("start", "connectSuccess", "load", t), serverData.userId && systemLoader.setAnalyticsUserId(serverData.userId), 
    currencyFormatter.init()
},
UIController.prototype.customAfterLoadActions = function ()
{
    return this.hasBeenDisconnect && $("link[rel=stylesheet]").each(function (t, e)
    {
        var i = $(e).attr("href"), n = $(e).clone();
        $(e).after(n), n.attr("href", systemLoader.urlUnify(i)).on("load", function ()
        {
            $(e).remove()
        })
    }), preloader.customAfterLoadActions()
},
UIController.prototype.hidePreloader = function ()
{
    preloader.stop(), this.preloader.addClass("hidden"), this.bottomBar.visible = true, this.updateBalanceField(), 
    this.updateTotalBetField(), this.gameInfoBar.visible = true, this.generalControls.visible = true, 
    this.spinMenu.showIfNeeded();
},
UIController.prototype.launchGame = function ()
{
    systemLoader.sendAnalyticsData("start", "tap_to_continue"), this.fireOnResizeEvent(), game.start(), 
    this.fpsCounter.attach(game.stage)
},
UIController.prototype.onHomeButtonClick = function ()
{
    this.spinMenu.expanded || ui.confirmDialog.showById("ui", false, "EXIT_DIALOG", function ()
    {
        gameConfig.exit_url && (ui.fullscreen && (ui.fullscreen.data.exit = true), window.location.href = gameConfig.exit_url);
    },
    this.showNewGiftOffersConfirm.bind(this))
},
UIController.prototype.onBetButtonClick = function ()
{
    this.spinMenu.expanded || this.mainMenu.visible || ui.confirmDialog.visible || ui.infoDialog.visible || (systemLoader.sendAnalyticsData("main", 
    "bet_settings_menu"), this.betSettings.visible = true);
},
UIController.prototype.onBetSettingsVisibilityChange = function ()
{
    this.betSettings.visible ? (this.body.addClass("bet-settings"), this.betSettings.onResize()) : (ui.gameInfoBar.maxBetMessage && clientData.bet === slotConfig.coins.max() ? (ui.gameInfoBar.messageQueue.push(ui.gameInfoBar.maxBetMessage), 
    ui.gameInfoBar.maxBetMessage = {}, ui.gameInfoBar.nextMessage()) : ui.gameInfoBar.clearAndNextMessage(), 
    this.body.removeClass("bet-settings"), this.showNewGiftOffersConfirm())
},
UIController.prototype.onAutoplaySettingsVisibilityChange = function ()
{
    this.autoplaySettings.visible ? (this.body.addClass("autoplay-settings"), this.autoplaySettings.onResize()) : (this.body.removeClass("autoplay-settings"), 
    this.autoplaySettings.ignoreNewGiftOffer ? this.autoplaySettings.ignoreNewGiftOffer = false : this.showNewGiftOffersConfirm());
},
UIController.prototype.onSettingsButtonClick = function ()
{
    this.spinMenu.expanded || this.betSettings.visible || ui.confirmDialog.visible || ui.infoDialog.visible || ui.autoplaySettings.visible || (systemLoader.sendAnalyticsData("main", 
    "settings_menu"), this.mainMenu.showAndJumpTab(UIMainMenu.TAB_GENERAL_SETTINGS))
},
UIController.prototype.soundEnableConfirm = function ()
{
    $("#ui").addClass("loaded"), this.uiReady = true;
    var t = $.Deferred(), e = function ()
    {
        this.mainMenu.settings.musicIsOnCheckbox.checked = true, this.mainMenu.settings.sfxIsOnCheckbox.checked = true, 
        systemLoader.sendAnalyticsData("start", "sound", "on"), this.soundRequested = true, t.resolve()
    }
    .bind(this), i = function ()
    {
        this.mainMenu.settings.musicIsOnCheckbox.checked = false, this.mainMenu.settings.sfxIsOnCheckbox.checked = false, 
        systemLoader.sendAnalyticsData("start", "sound", "off"), this.soundRequested = true, t.resolve()
    }
    .bind(this);
    return slotConfig.forceDisableSoundEngine || !this.soundEnable ? i() : this.confirmDialog.showById("ui", 
    null, "SOUND_DIALOG_HEADER", e, i), t.promise()
},
UIController.prototype.tutorialInit = function ()
{
    var t = $.Deferred();
    return "object" == typeof this.uiTutorial ? this.uiTutorial.show(false, function () {
        t.resolve()
    }) : t.resolve(), t.promise()
},
UIController.prototype.startWithCurtain = function ()
{
    systemLoader.debugDone();
    var t = $.Deferred();
    return ui.curtain.showAndHide(function ()
    {
        t.resolve()
    }), t.promise()
},
UIController.prototype.drawGame = function ()
{
    game.stage.newFrame()
},
UIController.prototype.pauseGame = function ()
{
    game.pause()
},
UIController.prototype.resumeGame = function ()
{
    game.resume(), this.externalEvent && this.externalEvent("game", "loaded")
},
UIController.prototype.loadDone = function ()
{
    logger.debug("UIController succeeded")
},
UIController.prototype.applyTemplate = function (t, e)
{
    return (this.templateData[t] ? this.templateData[t] : Handlebars.compile(t))(e);
},
UIController.prototype.isGameLandscape = function ()
{
    return Boolean(parseInt(this.gameOrientationMarker.css("width"), 10));
},
UIController.prototype.isUILandscape = function ()
{
    return Boolean(parseInt(this.uiOrientationMarker.css("width"), 10));
},
UIController.prototype.customTemplateRenderData = function ()
{
    return{}
},
UIController.prototype.templateRenderData = function ()
{
    return $.extend(true, {
        gameName : gameConfig.name, gameURL : systemLoader.inGamePath(""), commonURL : systemLoader.inCommonPath(""), 
        uiURL : systemLoader.inUIPath(""), showCopyright : gameConfig.showCopyright, showGambleInfo : gameConfig.showGambleInfo, 
        showBonusAutoplay : gameConfig.showBonusAutoplay, locale : {
            ui : locale.getKeyAsObject("ui"), game : locale.getKeyAsObject("game")
        },
        gameVersion : gameConfig.showVersion && gameConfig.gameVersion ? gameConfig.gameVersion : null, 
        rtp : gameConfig.showRtp && gameConfig.rtp ? gameConfig.rtp : null, slotConfig : slotConfig
    },
    this.customTemplateRenderData())
},
UIController.prototype.remcalc = function (t)
{
    return String(t) + "rem";
},
UIController.prototype.realPixelsToVirtual = function (t)
{
    return t / parseFloat(ui.body.css("font-size"));
},
UIController.prototype.onScreenTouch = function (t)
{
    if ($(t.target).is(".info-bar,.info-bar *,#bottom-bar,#bottom-bar *,#game,#root-wrapper"))
    {
        switch (true)
        {
            case clientData && clientData.state && 0 == clientData.state.indexOf("spin."):
                reels.stop(), systemLoader.sendAnalyticsData("main", "skip");
                break;
            case clientData && clientData.state && !!clientData.state.match(/(wild|bet|bonus)\.win/) && game.winPanel.isShown:
                game.winPanel.isRolling ? game.winPanel.stopRolling() : game.winPanel.isHiding || game.winPanel.rewindToTheEnd()
        }
        game.dispatchEvent(new GameEvent(GameEvent.UI_ON_SCREEN_TOUCH))
    }
},
UIController.prototype.soundGambleClick = function () {}, UIController.prototype.soundAutoSpin = function () {},
UIController.prototype.getCoord = function (t, e)
{
    if (/touch/.test(t.type))
    {
        var i = Array.fromObject((t.originalEvent || t).changedTouches), n = i.length ? i.reduce(function (t, 
        e) {
            return Math.min(t.identifier, e.identifier);
        }) : null;
        return n ? n["page" + e] : null
    }
    return t["page" + e];
},
UIController.prototype.showSettingsAndJumpToAutoplay = function ()
{
    this.mainMenu.showAndJumpTab(UIMainMenu.TAB_GENERAL_SETTINGS), this.mainMenu.settingsContainerScrollable.next()
},
UIController.prototype.startWaitResponse = function ()
{
    this.awaitor.visible = !(this.infoDialog.visible && ~(this.infoDialog.dom.attr("class") || "").indexOf("id-CONNECTION_LOST")), 
    connection.addEventListener(GameEvent.RESPONSE, this.endWaitResponse.bind(this))
},
UIController.prototype.endWaitResponse = function ()
{
    this.awaitor.visible = false, connection.removeEventListener(GameEvent.RESPONSE, this.endWaitResponse.bind(this));
},
UIController.prototype.onErrorLoading = function ()
{
    this.dispatchEvent(new GameEvent(GameEvent.ERROR))
},
UIController.prototype.onHideCustom = function (t) {};
var ui = new UIController;
UIDialog.prototype = Object.create(UIComponent.prototype), UIDialog.prototype.constructor = UIDialog, 
UIDialog.instances = [], UIDialog.rearrangeAll = function ()
{
    for (var t = 0; t < this.instances.length; t++) {
        this.instances[t].rearrange();
    }
},
UIDialog.prototype.initDOM = function ()
{
    return UIComponent.prototype.initDOM.call(this), this;
},
UIDialog.prototype.rearrange = function ()
{
    return this;
},
UIInfoPopup.prototype = Object.create(UIDialog.prototype), UIInfoPopup.prototype.constructor = UIInfoPopup, 
UIInfoPopup.prototype.showById = function (t, e, i, n, s, o)
{
    return this.textIdClasses = [i], e && locale.getText(t, e) && this.textIdClasses.push(e), this.show(e ? o ? locale.getText(t, 
    e).substituteTokens(o) : locale.getText(t, e) : null, o ? locale.getText(t, i).substituteTokens(o) : locale.getText(t, 
    i), n, s, i);
},
UIInfoPopup.prototype.show = function (t, e, i, n, s)
{
    this.dom.unbind(ui.click), this.title = t, this.message = e, this.visible = true, this.dom.attr("class", 
    this.dom.attr("class").replace(/id-\S+\s?/g, "").trim()), this.textIdClasses.length && this.dom.addClass(this.textIdClasses.map(function (t)
    {
        return "id-" + t;
    }).join(" ")), this.soundShow(s);
    var o;
    n && (o = setTimeout(function ()
    {
        this.visible = false, "function" == typeof i && i.call()
    }
    .bind(this), n)), this.dom.one(ui.click, function ()
    {
        o && clearTimeout(o), this.visible = false, "function" == typeof i && i.call()
    }
    .bind(this)), this.textIdClasses = [];
},
UIInfoPopup.prototype.soundShow = function (t) {}, UIConfirmPopup.prototype = Object.create(UIDialog.prototype), 
UIConfirmPopup.prototype.constructor = UIConfirmPopup, UIConfirmPopup.prototype.showById = function (t, 
e, i, n, s)
{
    return this.textIdClasses = [i], e && locale.getText(t, e) && this.textIdClasses.push(e), this.show(e ? locale.getText(t, 
    e) : null, locale.getText(t, i), n, s, e);
},
UIConfirmPopup.prototype.show = function (t, e, i, n, s)
{
    this.dom.unbind(ui.click), this.title = t, this.message = e, this.visible = true, this.dom.attr("class", 
    this.dom.attr("class").replace(/id-\S+\s?/g, "").trim()), this.textIdClasses.length && this.dom.addClass(this.textIdClasses.map(function (t)
    {
        return "id-" + t;
    }).join(" ")), this.soundShow(s), this.okButton.onClick(function ()
    {
        this.visible = false, this.soundOkButton(), "function" == typeof i && i.call()
    }
    .bind(this)), this.cancelButton.onClick(function ()
    {
        this.visible = false, this.soundCancelButton(), "function" == typeof n && n.call()
    }
    .bind(this)), this.dom.on(ui.click, function (t)
    {
        $(t.target).hasClass("popup-content") || $(t.target).parents(".popup-content").length || ui.controlActions.proxy(function ()
        {
            this.visible = false, "function" == typeof n && n.call()
        }
        .bind(this))
    }
    .bind(this)), this.textIdClasses = [];
},
UIConfirmPopup.prototype.soundOkButton = function () {}, UIConfirmPopup.prototype.soundCancelButton = function () {},
UIConfirmPopup.prototype.soundShow = function (t) {}, UICurtain.prototype = Object.create(UIComponent.prototype), 
UICurtain.prototype.constructor = UICurtain, UICurtain.prototype.showAndHide = function (t, e)
{
    return this.show().then(function ()
    {
        t && t()
    }).then(this.hide.bind(this)).then(function ()
    {
        e && e()
    })
},
UICurtain.prototype.show = function ()
{
    var t = $.Deferred();
    return this.dom.animate(
    {
        opacity : 1
    },
    this.showDuration, function ()
    {
        t.resolve()
    }), t.promise()
},
UICurtain.prototype.hide = function ()
{
    var t = $.Deferred();
    return this.dom.animate(
    {
        opacity : 0
    },
    this.hideDuration, function ()
    {
        t.resolve()
    }), t.promise()
},
UISettings.prototype = Object.create(UIDialog.prototype), UISettings.prototype.constructor = UISettings, 
UISettings.prototype.update = function ()
{
    this.updateAutoplayNumberView(), this.updateAutoplayLossLimitView(), this.updateAutoplaySingleWinLimitView(), 
    this.quickspinCheckbox.checked = userConfig.quickSpinEnabled;
},
UISettings.prototype.onMusicIsOnCheckboxToggled = function (t)
{
    this.musicLevelSlider.disabledEvents = true, t ? this.musicLevel = userConfig.musicLevel || 100 : this.musicLevel = 0, 
    this.musicLevelSlider.disabledEvents = false, userConfig.musicOn = t, t ? sound.setMusicLevel(this.musicLevel / 100) : sound.setMusicLevel(0);
},
UISettings.prototype.doOnClientUpdate = function (t)
{
    void 0 != t.diff.autoplayNumber && (this.autoplayNumberSlider.disabledEvents = true, this.autoplayNumber = clientData.autoplayNumber, 
    this.autoplayNumberSlider.disabledEvents = false, this.updateAutoplayNumberView()), void 0 != t.diff.autoplayLossLimit && (this.autoplayLossLimitSlider.disabledEvents = true, 
    this.autoplayLossLimit = clientData.autoplayLossLimit, this.autoplayLossLimitSlider.disabledEvents = false, 
    this.updateAutoplayLossLimitView()), void 0 != t.diff.autoplaySingleWinLimit && (this.autoplaySingleWinLimitSlider.disabledEvents = true, 
    this.autoplaySingleWinLimit = clientData.autoplaySingleWinLimit, this.autoplaySingleWinLimitSlider.disabledEvents = false, 
    this.updateAutoplaySingleWinLimitView()), this.spinSettingsVisible = clientData.spinSettingsVisible(), 
    this.autoplaySettingsVisible = clientData.autoplaySettingsVisible(), this.quickspinCheckboxVisible = clientData.quickspinCheckboxVisible();
},
UISettings.prototype.onSfxIsOnCheckboxToggled = function (t)
{
    this.sfxLevelSlider.disabledEvents = true, t ? this.sfxLevel = userConfig.sfxLevel || 100 : this.sfxLevel = 0, 
    this.sfxLevelSlider.disabledEvents = false, userConfig.sfxOn = t, t ? sound.setSfxLevel(this.sfxLevel / 100) : sound.setSfxLevel(0);
},
UISettings.prototype.onQuickspinCheckboxToggled = function (t)
{
    ui.spinMenu.quickVisible = userConfig.quickSpinEnabled = t;
},
UISettings.prototype.onBonusAutoplayCheckboxToggled = function (t) {}, UISettings.prototype.onMusicLevelChanged = function ()
{
    this.musicIsOnCheckbox.checked && (userConfig.musicLevel = this.musicLevel), this.musicIsOnCheckbox.disabledEvents = true, 
    this.musicLevel && !this.musicIsOnCheckbox.checked ? this.musicIsOnCheckbox.checked = true :!this.musicLevel && this.musicIsOnCheckbox.checked && (this.musicIsOnCheckbox.checked = false), 
    this.musicIsOnCheckbox.disabledEvents = false, sound.setMusicLevel(this.musicLevel / 100);
},
UISettings.prototype.onSfxLevelChanged = function ()
{
    this.sfxIsOnCheckbox.checked && (userConfig.sfxLevel = this.sfxLevel), this.sfxIsOnCheckbox.disabledEvents = true, 
    this.sfxLevel && !this.sfxIsOnCheckbox.checked ? this.sfxIsOnCheckbox.checked = true :!this.sfxLevel && this.sfxIsOnCheckbox.checked && (this.sfxIsOnCheckbox.checked = false), 
    this.sfxIsOnCheckbox.disabledEvents = false, sound.setSfxLevel(this.sfxLevel / 100);
},
UISettings.prototype.onAutoplayNumberChanged = function ()
{
    this.updateAutoplayNumberView()
},
UISettings.prototype.onLossLimitChanged = function ()
{
    this.updateAutoplayLossLimitView()
},
UISettings.prototype.onSingleWinLimitChanged = function ()
{
    this.updateAutoplaySingleWinLimitView()
},
UISettings.prototype.actualizeSoundLevels = function ()
{
    sound.setSfxLevel(userConfig.sfxOn ? userConfig.sfxLevel / 100 : 0), sound.setMusicLevel(userConfig.musicOn ? userConfig.musicLevel / 100 : 0)
},
UISettings.prototype.onClickStartAutoplayButton = function ()
{
    var t = true;
    ui.soundAutoSpin(), 0 == this.autoplayLossLimit && (this.lossLimitSettingsGroup.addClass("active"), 
    this.lossLimitSettingsGroup.isActive = true, t = false), 0 == this.autoplayNumber && (this.autoplaySettingsGroup.addClass("active"), 
    this.autoplaySettingsGroup.isActive = true, t = false), t && (userConfig.autoSpinEnabled = true, clientData.autoplayNumber = clientData.autoplayRemains = this.autoplayNumber, 
    clientData.autoplayLossLimit = this.autoplayLossLimit, clientData.autoplaySingleWinLimit = this.autoplaySingleWinLimit, 
    clientData.diff(), clientData.startAutoplay(), ui.mainMenu.visible = false, systemLoader.sendAnalyticsData("spin", 
    userConfig.quickSpinEnabled ? "quick_auto" : "auto"));
},
UISettings.prototype.refresh = function ()
{
    this.musicLevelSlider.onResize(), this.sfxLevelSlider.onResize(), this.autoplayNumberSlider.onResize(), 
    this.autoplayLossLimitSlider.onResize(), this.autoplaySingleWinLimitSlider.onResize()
},
UISettings.prototype.updateAutoplayNumberView = function (t)
{
    if (this.autoplayNumberLabel.text = this.autoplayNumber, this.autoplaySettingsGroup.isActive && (this.autoplaySettingsGroup.isActive = false, 
    this.autoplaySettingsGroup.removeClass("active")), !t)
    {
        var e = ui.autoplaySettings;
        e.autoplayNumberSlider.disabledEvents = true, e.autoplayNumber = this.autoplayNumber, e.autoplayNumberSlider.disabledEvents = false, 
        e.updateAutoplayNumberView(true);
    }
},
UISettings.prototype.updateAutoplayLossLimitView = function (t)
{
    if (0 == this.autoplayLossLimit ? this.autoplayLossLimitLabel.text = locale.getText("ui", "AUTOPLAY_SETTINGS_CHOOSE") : this.autoplayLossLimit == ClientData.AUTOPLAY_LOSS_LIMIT_OFF ? this.autoplayLossLimitLabel.text = locale.getText("ui", 
    "AUTOPLAY_SETTINGS_UNLIMITED") : this.autoplayLossLimitLabel.text = h5game.formatMeter(this.autoplayLossLimit * clientData.getTotalBet()), 
    this.lossLimitSettingsGroup.isActive && (this.lossLimitSettingsGroup.isActive = false, this.lossLimitSettingsGroup.removeClass("active")), 
    !t)
    {
        var e = ui.autoplaySettings;
        e.autoplayLossLimitSlider.disabledEvents = true, e.autoplayLossLimit = this.autoplayLossLimit, 
        e.autoplayLossLimitSlider.disabledEvents = false, e.updateAutoplayLossLimitView(true);
    }
},
UISettings.prototype.updateAutoplaySingleWinLimitView = function ()
{
    0 == this.autoplaySingleWinLimit ? this.autoplaySingleWinLimitLabel.text = locale.getText("ui", "AUTOPLAY_SETTINGS_ANY") : this.autoplaySingleWinLimit ==- 1 ? this.autoplaySingleWinLimitLabel.text = locale.getText("ui", 
    "AUTOPLAY_SETTINGS_UNLIMITED") : this.autoplaySingleWinLimitLabel.text = h5game.formatMeter(this.autoplaySingleWinLimit * clientData.getTotalBet());
},
UISettings.prototype.onClose = function ()
{
    clientData.autoplayNumber == this.autoplayNumber && clientData.autoplayLossLimit == this.autoplayLossLimit && clientData.autoplaySingleWinLimit == this.autoplaySingleWinLimit || clientData.autoplayActive || !userConfig.autoSpinEnabled ?!slotConfig.certified || clientData.autoplayActive || userConfig.autoSpinEnabled ? slotConfig.certified || clientData.autoplayActive || userConfig.autoSpinEnabled || (clientData.autoplayNumber = clientData.autoplayRemains = this.autoplayNumber, 
    clientData.autoplayLossLimit = this.autoplayLossLimit, clientData.autoplaySingleWinLimit = this.autoplaySingleWinLimit, 
    !clientData.giftspinsActive && clientData.diff()) : (this.autoplayNumber = slotConfig.autoplayNumber, 
    this.autoplayLossLimit = slotConfig.autoplayLossLimit, this.autoplaySingleWinLimit = slotConfig.autoplaySingleWinLimit) : (userConfig.autoSpinEnabled = false, 
    clientData.autoplayNumber != this.autoplayNumber && (clientData.autoplayNumber = this.autoplayNumber), 
    clientData.stopAutoplay(), this.doOnClientUpdate(
    {
        diff : 
        {
            autoplayNumber : clientData.autoplayNumber, autoplaySingleWinLimit : clientData.autoplaySingleWinLimit, 
            autoplayLossLimit : clientData.autoplayLossLimit
        }
    }))
},
UIGiftList.prototype = Object.create(UIComponent.prototype), UIGiftList.prototype.constructor = UIGiftList, 
UIGiftList.prototype.mockup = function ()
{
    this.mockupObjects = [
    {
        id : 1, spinsTotal : 1, spinsLeft : 1, cashWinTotal : 1, status : "new", extraClass : "", expires : new Date, 
        bet : 1, lines : 1, coin : 1, totalBet : 1
    }]
},
UIGiftList.prototype.unMockup = function ()
{
    this.offerList = null, this.mockupObjects = null;
},
UIGiftList.prototype.onClientUpdateHandler = function ()
{
    if ("giftspins.activate.removed" == clientData.state)
    {
        ui.awaitor.visible = false;
        var t = clientData.giftspinIdActivating;
        clientData.giftspinIdActivating = null, ui.infoDialog.showById("ui", null, "GIFTSPINS_OFFER_NO_LONGER_AVAILABLE", 
        function ()
        {
            clientData.removeGiftOfferById(t), clientData.actualizeGiftspinsParams(), clientData.diff();
            var e = new GameEvent(GameEvent.GIFT_SPINS_ACTION);
            e.action = "remove", e.data = t, this.onGiftSpinActionComplete(e)
        }
        .bind(this));
    }
},
UIGiftList.prototype.update = function ()
{
    this.offerListDom.empty(), this.offerList || (this.offerList = gameConfig.noGiftSpins || slotConfig.noGiftSpins ? [] : this.mockupObjects && this.mockupObjects.length ? this.mockupObjects : clientData.giftOffers.slice()), 
    clientData.sortGiftspins(this.offerList), this.offerList.length ? (this.dom.removeClass("empty"), 
    this.dom[clientData.giftspinsActive ? "addClass" : "removeClass"]("started"), this.offerList.filter(function (t)
    {
        return ["finished"].indexOf(t.status) ==- 1;
    }).forEach(function (t)
    {
        var e = t.expires.getTime() < Date.now() + 24 * this.highlightedDaysBeforeExpire * 3600 * 1e3;
        t = $.extend(true, {}, t, 
        {
            totalLines : slotConfig.lines, expires : t.expires.format("{{dd}}.{{MM}}.{{yyyy}} {{hh}}:{{mm}}"), 
            totalBet : currencyFormatter.format(t.totalBet), cashWinTotal : currencyFormatter.format(t.cashWinTotal), 
            extraClass : []
        }), e && t.extraClass.push("soon-expires"), 1 == slotConfig.linesSet.length && t.extraClass.push("fixed-lines"), 
        t.extraClass = t.extraClass.join(" "), "deleted" == t.status && (t.customHeader = "GIFTSPINS_OFFER_REMOVED_BY_OPERATOR");
        var i = $(ui.applyTemplate("giftOffer", t));
        i.find(".activate-button").bind(ui.click, this.onActivateButtonClick.bind(this, t.id)), i.find(".remove-button").bind(ui.click, 
        this.onRemoveButtonClick.bind(this, t.id)), this.offerListDom.append(i)
    }
    .bind(this))) : this.dom.addClass("empty").removeClass("started")
},
UIGiftList.prototype.onShow = function ()
{
    var t = this.offerList.filter(function (t)
    {
        return "new" == t.status;
    });
    t.length && serverData.markGiftOffersRead.apply(serverData, t.pluck("id")), t.forEach(function (t)
    {
        t.status = "suspended";
    }), clientData.actualizeGiftspinsParams()
},
UIGiftList.prototype.onActivateButtonClick = function (t)
{
    clientData.giftspinIdActivating = t, ui.awaitor.visible = true, clientData.act("giftspins.activate");
},
UIGiftList.prototype.onRemoveButtonClick = function (t)
{
    ui.confirmDialog.showById("ui", null, "GIFTSPINS_CONFIRM_REMOVAL", function ()
    {
        clientData.giftspinIdDeleting = t, ui.awaitor.visible = true, clientData.act("giftspins.remove")
    }
    .bind(this));
},
UIGiftList.prototype.onGiftSpinActionComplete = function (t)
{
    switch (t.action)
    {
        case "remove":
            var e = t.data, i = $("#gift-offer-" + e);
            i.animate({
                opacity : 0
            },
            this.removeFadeDuration, function (t)
            {
                i.remove(), this.offerList = this.offerList.removeAll(function (t)
                {
                    return t.id == e;
                }), this.update(), this.dispatchEvent(new GameEvent(GameEvent.CONTENT_CHANGED))
            }
            .bind(this))
    }
    ui.awaitor.visible = false;
},
UIGiftList.prototype.onClose = function ()
{
    this.mockupObjects || (clientData.giftOffers = clientData.giftOffers.filter(function (t)
    {
        return "deleted" != t.status;
    }), this.offerList = null);
},
UIMainMenu.TAB_GENERAL_SETTINGS = "general-settings", UIMainMenu.TAB_INFO = "info", UIMainMenu.TAB_PAYTABLE = "paytable", 
UIMainMenu.TAB_GIFT_SPINS = "gift-spins", UIMainMenu.prototype = Object.create(UIDialog.prototype), UIMainMenu.prototype.constructor = UIMainMenu, 
UIMainMenu.prototype.onBackButtonClick = function ()
{
    this.visible = false;
},
UIMainMenu.prototype.onTabClick = function (t)
{
    var e = $(t.currentTarget), i = e.attr("class");
    this.selectedTab = i;
},
UIMainMenu.prototype.rearrangeTab = function (t)
{
    var e = function ()
    {
        this.settingsContainerScrollable.disable(), this.infoContainerScrollable.disable(), this.payTableContainerScrollable.disable(), 
        this.giftSpinsContainerScrollable.disable()
    }
    .bind(this);
    if (t = t || this.selectedTab, void 0 != this.selectedTab && t != this.selectedTab) {
        switch (this.selectedTab) {
            case UIMainMenu.TAB_GIFT_SPINS:
                this.giftSpins.onClose() 
        }
    }
    switch (t)
    {
        case UIMainMenu.TAB_GENERAL_SETTINGS:
            t != this.selectedTab && this.settings.update(), this.settings.refresh(), e(), this.settingsContainerScrollable.enable(), 
            this.settingsContainerScrollable.refresh();
            break;
        case UIMainMenu.TAB_INFO:
            e(), this.infoContainerScrollable.enable(), this.infoContainerScrollable.refresh(), systemLoader.sendAnalyticsData("settings", 
            "rules"), this.refreshInfoData();
            break;
        case UIMainMenu.TAB_PAYTABLE:
            e(), this.payTableContainerScrollable.enable(), this.payTableContainerScrollable.refresh(), systemLoader.sendAnalyticsData("settings", 
            "paytable"), this.refreshPaytableData();
            break;
        case UIMainMenu.TAB_GIFT_SPINS:
            t != this.selectedTab && this.giftSpins.update(), e(), this.giftSpinsContainerScrollable.enable(), 
            this.giftSpinsContainerScrollable.refresh()
    }
},
UIMainMenu.prototype.onGameStart = function (t)
{
    var e = t.response && t.response.attr("command") ? t.response.attr("command") : null;
    "start" != e && "reconnect" != e || (serverData.removeEventListener(GameEvent.UPDATE, this.onGameStart, 
    this), this.onServerDataPrepared())
},
UIMainMenu.prototype.showAndJumpTab = function (t)
{
    this.visible || (this.visible = true, this.selectedTab = t);
},
UIMainMenu.prototype.onServerDataPrepared = function () {}, UIMainMenu.prototype.onGiftspinsContentChanged = function (t)
{
    this.rearrangeTab(UIMainMenu.TAB_GIFT_SPINS)
},
UIMainMenu.prototype.refreshPaytableData = function () {}, UIMainMenu.prototype.refreshInfoData = function () {},
UIBetLines.prototype = Object.create(UIDialog.prototype), UIBetLines.prototype.constructor = UIBetLines, 
UIBetLines.prototype.minButtonPress = function ()
{
    this.slideItems(0, this.point_container.height() - this.draggable_point.height()), systemLoader.sendAnalyticsData("bet_settings", 
    "min")
},
UIBetLines.prototype.maxButtonPress = function ()
{
    this.slideItems(this.point_container.width() - this.draggable_point.width(), 0), systemLoader.sendAnalyticsData("bet_settings", 
    "max")
},
UIBetLines.prototype.slideItems = function (t, e)
{
    this.pointAnimationObject.value = 0;
    var i = this.draggable_point.position().left / ui.scale, n = this.draggable_point.position().top / ui.scale, 
    s = Math.sqrt((t - i) * (t - i) + (e - n) * (e - n));
    this.pointAnimationObject.stop().animate({
        value : s
    },
    {
        easing : "linear", duration : 300,
        start : function ()
        {
            this.bet_indicator.removeClass("passive").addClass("active"), this.lines_indicator.removeClass("passive").addClass("active"), 
            this.draggable_point.removeClass("passive").addClass("active"), this.betValueContainer.addClass("active"), 
            this.linesValueContainer.addClass("active")
        }
        .bind(this),
        progress : function (s, o, a)
        {
            this.moveItems(this.draggable_point, i + (t - i) * o, n + (e - n) * o, true)
        }
        .bind(this),
        done : function ()
        {
            this.bet_indicator.removeClass("active").addClass("passive"), this.lines_indicator.removeClass("active").addClass("passive"), 
            this.draggable_point.removeClass("active").addClass("passive"), this.betValueContainer.removeClass("active"), 
            this.linesValueContainer.removeClass("active")
        }
        .bind(this)
    })
},
UIBetLines.prototype.onResize = function ()
{
    if (this.visible)
    {
        var t = this.point_container[0].getBoundingClientRect(), e = getComputedStyle(this.point_container[0]), 
        i = parseFloat(e.width), n = parseFloat(e.height), s = parseFloat(e.borderLeftWidth), o = parseFloat(e.borderRightWidth), 
        a = parseFloat(e.borderTopWidth), r = parseFloat(e.borderBottomWidth);
        this.draggable_point.draggable("option", "containment", [t.left + s * ui.scale, t.top + a * ui.scale, 
        t.left + (i - o - this.draggable_point.width()) * ui.scale, t.top + (n - r - this.draggable_point.height()) * ui.scale]);
        var l = [t.left + s * ui.scale, t.top - (a + r + this.betContainer.height() / 2) * ui.scale, t.right - (s + o + this.draggable_point.width() / 2) * ui.scale, 
        0];
        l[3] = l[1], this.betContainer.draggable("option", "containment", l);
        var h = [t.right - (s + o + this.linesContainer.width() / 2) * ui.scale, t.top + s * ui.scale, 
        0, t.bottom - (a + r + this.draggable_point.height() / 2) * ui.scale];
        h[2] = h[0], this.linesContainer.draggable("option", "containment", h), this.gridStepX = (this.point_container.width() - this.draggable_point.width()) / slotConfig.coins.length, 
        this.gridStepY = (this.point_container.height() - this.draggable_point.height()) / slotConfig.linesSet.length;
        var u = slotConfig.coins.indexOf(clientData.bet) < 1 ? 0 : slotConfig.coins.indexOf(clientData.bet) + 1, 
        d = 1 == clientData.lines ? 0 : clientData.lines, c = u * this.gridStepX, p = (slotConfig.linesSet.length - d) * this.gridStepY;
        this.moveItems(this.draggable_point, c, p, false)
    }
    this.setBetLinesValues()
},
UIBetLines.prototype.moveItems = function (t, e, i, n)
{
    t && ("number" == typeof e && this.draggable_point.css("left", e.px()), "number" == typeof i && this.draggable_point.css("top", 
    i.px())), "number" == typeof e && (this.betContainer.css("left", e.px()), e / this.point_container.width() * 100 < 65 ? this.betContainer.removeClass("alternative") : this.betContainer.addClass("alternative"), 
    this.aimRight.css("right", (e + this.draggable_point.width() - this.point_container.width()).px()), 
    this.aimLeft.css("left", (-e).px())), "number" == typeof i && (this.linesContainer.css("top", i.px()), 
    this.aimBottom.css("bottom", (i + this.draggable_point.height() - this.point_container.height()).px()), 
    this.aimTop.css("top", (-i).px())), n && this.setBetLinesValues(e, i)
},
UIBetLines.prototype.onBackButtonClick = function ()
{
    this.visible = false;
},
UIBetLines.prototype.setBetLinesValues = function (t, e)
{
    var i = null;
    (t || 0 == t) && (i = Math.floor(t / this.gridStepX), i = Math.min(slotConfig.coins.length - 1, Math.max(0, 
    i)), clientData.bet = slotConfig.coins[i]), (e || 0 == e) && (i = slotConfig.linesSet.length - 1 - Math.floor(e / this.gridStepY), 
    i = Math.min(slotConfig.linesSet.length - 1, Math.max(0, i)), clientData.lines = slotConfig.linesSet[i]), 
    this.betIndicatorLabel.text = this.betValue.text = h5game.formatMeter(slotConfig.coins.indexOf(clientData.bet) ==- 1 ? slotConfig.coins.min() : clientData.bet), 
    this.linesIndicatorLabel.text = this.linesValue.text = clientData.lines;
},
UIBetSettings.prototype = Object.create(UIDialog.prototype), UIBetSettings.prototype.constructor = UIBetSettings, 
UIBetSettings.prototype.setBet = function (t)
{
    var e = clientData.bet;
    clientData.bet = t, e != t && (slotConfig.coins[0] == t ? systemLoader.sendAnalyticsData("bet_settings", 
    "min") : slotConfig.coins.last() == t && systemLoader.sendAnalyticsData("bet_settings", "max"), !clientData.autoplayActive && userConfig.autoSpinEnabled && (userConfig.autoSpinEnabled = false, 
    clientData.stopAutoplay()));
},
UIBetSettings.prototype.onResize = function ()
{
    this.betSlider.onResize(), this.betSlider.disabledEvents = true, this.betSlider.min = 0, this.betSlider.max = 100, 
    this.betSlider.disabledEvents = false, this.betValue = 100 * slotConfig.coins.indexOf(clientData.bet) / (slotConfig.coins.length - 1), 
    this.updateBetSlider();
},
UIBetSettings.prototype.updateBetSlider = function ()
{
    if (clientData.bet)
    {
        var t = Math.round(this.betValue / 100 * (slotConfig.coins.length - 1));
        this.setBet(slotConfig.coins[t]), this.totalBetValueLabel.text = h5game.formatMeter(clientData.getTotalBet()), 
        this.lineBetValueLabel.text = locale.getText("ui", "BET_SETTINGS_LINE_BET_LABEL") + h5game.formatMeter(clientData.bet), 
        clientData.diff();
    }
},
UIBetSettings.prototype.onBackButtonClick = function ()
{
    this.visible = false;
},
UIBetSettings.prototype.addExtraText = function () {}, UIAutoplaySettings.prototype = Object.create(UIDialog.prototype), 
UIAutoplaySettings.prototype.constructor = UIAutoplaySettings, UIAutoplaySettings.prototype.onResize = function ()
{
    this.autoplayNumberSlider.onResize(), this.autoplayLossLimitSlider.onResize(), this.updateAutoplayNumberView(), 
    this.updateAutoplayLossLimitView()
},
UIAutoplaySettings.prototype.doOnClientUpdate = function (t)
{
    void 0 != t.diff.autoplayNumber && (this.autoplayNumberSlider.disabledEvents = true, this.autoplayNumber = clientData.autoplayNumber, 
    this.autoplayNumberSlider.disabledEvents = false, this.updateAutoplayNumberView()), void 0 != t.diff.autoplayLossLimit && (this.autoplayLossLimitSlider.disabledEvents = true, 
    this.autoplayLossLimit = clientData.autoplayLossLimit, this.autoplayLossLimitSlider.disabledEvents = false, 
    this.updateAutoplayLossLimitView());
},
UIAutoplaySettings.prototype.onAutoplayNumberChanged = function ()
{
    this.updateAutoplayNumberView()
},
UIAutoplaySettings.prototype.onLossLimitChanged = function ()
{
    this.updateAutoplayLossLimitView()
},
UIAutoplaySettings.prototype.updateAutoplayNumberView = function (t)
{
    if (this.autoplayNumberValueLabel.text = this.autoplayNumber, this.autoplaySettingsGroup.isActive && (this.autoplaySettingsGroup.isActive = false, 
    this.autoplaySettingsGroup.removeClass("active")), !t)
    {
        var e = ui.mainMenu.settings;
        e.autoplayNumberSlider.disabledEvents = true, e.autoplayNumber = this.autoplayNumber, e.autoplayNumberSlider.disabledEvents = false, 
        e.updateAutoplayNumberView(true);
    }
},
UIAutoplaySettings.prototype.updateAutoplayLossLimitView = function (t)
{
    if (0 == this.autoplayLossLimit ? this.lossLimitValueLabel.text = locale.getText("ui", "AUTOPLAY_SETTINGS_CHOOSE") : this.autoplayLossLimit == ClientData.AUTOPLAY_LOSS_LIMIT_OFF ? this.lossLimitValueLabel.text = locale.getText("ui", 
    "AUTOPLAY_SETTINGS_UNLIMITED") : this.lossLimitValueLabel.text = h5game.formatMeter(this.autoplayLossLimit * clientData.getTotalBet()), 
    this.lossLimitSettingsGroup.isActive && (this.lossLimitSettingsGroup.isActive = false, this.lossLimitSettingsGroup.removeClass("active")), 
    !t)
    {
        var e = ui.mainMenu.settings;
        e.autoplayLossLimitSlider.disabledEvents = true, e.autoplayLossLimit = this.autoplayLossLimit, 
        e.autoplayLossLimitSlider.disabledEvents = false, e.updateAutoplayLossLimitView(true);
    }
},
UIAutoplaySettings.prototype.onAutoplayButtonClick = function (t)
{
    var e = true;
    ui.soundAutoSpin(), 0 == this.autoplayLossLimit && (this.lossLimitSettingsGroup.addClass("active"), 
    this.lossLimitSettingsGroup.isActive = true, e = false), 0 == this.autoplayNumber && (this.autoplaySettingsGroup.addClass("active"), 
    this.autoplaySettingsGroup.isActive = true, e = false), e && (userConfig.autoSpinEnabled = true, clientData.autoplayNumber = clientData.autoplayRemains = this.autoplayNumber, 
    clientData.autoplayLossLimit = this.autoplayLossLimit, clientData.diff(), clientData.startAutoplay(), 
    this.visible = false, systemLoader.sendAnalyticsData("spin", userConfig.quickSpinEnabled ? "quick_auto" : "auto")), 
    t.preventDefault();
},
UIAutoplaySettings.prototype.onBackButtonClick = function ()
{
    slotConfig.certified && !clientData.autoplayActive ? (this.autoplayNumber = slotConfig.autoplayNumber, 
    this.autoplayLossLimit = slotConfig.autoplayLossLimit) : slotConfig.certified || clientData.autoplayActive || userConfig.autoSpinEnabled || (clientData.autoplayNumber = clientData.autoplayRemains = this.autoplayNumber, 
    clientData.autoplayLossLimit = this.autoplayLossLimit, clientData.diff()), this.visible = false;
},
UIAutoplaySettings.prototype.onAdvancedButtonClick = function ()
{
    this.ignoreNewGiftOffer = true, this.visible = false, ui.showSettingsAndJumpToAutoplay();
},
UIAutoplaySettings.prototype.onHelpButtonClick = function ()
{
    this.visible = false, ui.mainMenu.showAndJumpTab(UIMainMenu.TAB_INFO);
},
UISpinMenu.prototype = Object.create(UIDialog.prototype), UISpinMenu.prototype.constructor = UISpinMenu, 
UISpinMenu.holdTapDelay = 400, UISpinMenu.minimumDistance = 10, UISpinMenu.angleRange = Math.PI / 180 * 90, 
UISpinMenu.prototype.stopAutoPlay = function ()
{
    clientData.stopAutoplay(), userConfig.autoSpinEnabled = false, this.spinButton.counter.text = 0, this.spinButton.counter.visible = false;
},
UISpinMenu.prototype.customParams = function ()
{
    return{}
},
UISpinMenu.prototype.showIfNeeded = function ()
{
    this.visible = clientData.isActionAvailable("spin") && !clientData.giftspinsInterrupted && !(clientData.getCurrentGiftOffer() && !clientData.getCurrentGiftOffer().spinsLeft) && !clientData.getFinishedGiftOffer() && !this.isVisibilityProhibited() || clientData.autoplayActive || "giftspins.interrupted" == clientData.state;
},
UISpinMenu.prototype.canShow = function ()
{
    return "bet.idle" == clientData.state;
},
UISpinMenu.prototype.isVisibilityProhibited = function ()
{
    return false;
},
UISpinMenu.prototype.show = function (t)
{
    if ("number" == typeof t && void 0 !== t || (t = 100), this.canShow() && !clientData.autoplayActive && !this.expanded && !ui.autoplaySettings.visible)
    {
        this.startConfig.quick = userConfig.quickSpinEnabled, this.startConfig.auto = userConfig.autoSpinEnabled, 
        this.config = $.extend(true, {}, this.startConfig), this.updateButtons();
        var e = false;
        this.expanded = true, this.dom.addClass("step-1");
        var i, n = TimeoutChain.newInstance().append(t, function ()
        {
            this.dom.addClass("step-2")
        }
        .bind(this)).append(t, function ()
        {
            this.dom.addClass("step-3")
        }
        .bind(this)).append(.1 * t, function ()
        {
            this.dom.addClass("step-4")
        }
        .bind(this)).append(t, function ()
        {
            this.dom.addClass("step-5")
        }
        .bind(this)).append(2 * t, function ()
        {
            this.dom.addClass("step-6")
        }
        .bind(this)).append(t, function ()
        {
            this.dom.addClass("non-animated"), this.touchDown = true
        }
        .bind(this));
        n.build().done(function ()
        {
            i && clearTimeout(i), this.touchDown = true, this.config.auto || (this.spinButton.counter.text = ""), 
            this.tapStyle || (this.spinButton.dom.addClass("active"), this.checkElement(this.spinButton.dom))
        }
        .bind(this)).fail(function ()
        {
            this.touchDown = false, this.hide(true)
        }
        .bind(this)), this.dom.one("mouseup touchend touchcancel", function (t)
        {
            var e = this.getConfigDiff();
            this.touchDown = false, "pending" == n.build().state() ? n.kill() : (!this.tapStyle || this.tapStyle && this.hoveredElement) && this.expanded && (e.auto ? this.hide(true) : this.hide())
        }
        .bind(this)), this.hoveredElement = null, this.onShowHandler && this.onShowHandler();
    }
},
UISpinMenu.prototype.hide = function (t)
{
    var e = this.getConfigDiff();
    (!this.tapStyle || this.tapStyle && Object.keys(e).length || this.tapStyle && !this.hoveredElement || t) && !this.tapStyle && this.hoveredElement && this.hoveredElement[0] == this.spinButton.dom[0] && this.spinButton.triggerClick(), 
    this.doHide(e, t)
},
UISpinMenu.prototype.getConfigDiff = function ()
{
    var t = {};
    for (var e in this.startConfig)
    {
        this.startConfig.hasOwnProperty(e) && this.startConfig[e] != this.config[e] && (t[e] = this.config[e]);
    }
    return t;
},
UISpinMenu.prototype.doHide = function (t, e)
{
    if (t = t || {}, this.spinButton.dom.removeClass("active hovered"), e) this.expanded = false, this.onHideHandler && this.onHideHandler(t), 
    this.spinButton.unlock(null, 500);
    else if (this.expanded)
    {
        this.dom.removeClass("non-animated step-6");
        var i = TimeoutChain.newInstance().append(100, function ()
        {
            this.dom.removeClass("step-5")
        }
        .bind(this)).append(200, function ()
        {
            this.dom.removeClass("step-4")
        }
        .bind(this)).append(100, function ()
        {
            this.dom.removeClass("step-3")
        }
        .bind(this)).append(10, function ()
        {
            this.dom.removeClass("step-2 step-1"), this.expanded = false
        }
        .bind(this));
        i.build().done(function ()
        {
            this.onHideHandler && this.onHideHandler(t), this.showIfNeeded(), this.spinButton.unlock(null, 
            500)
        }
        .bind(this))
    }
},
UISpinMenu.prototype.onShow = function (t)
{
    return this.onShowHandler = t.bind(this), this;
},
UISpinMenu.prototype.onHide = function (t)
{
    return this.onHideHandler = t.bind(this), this;
},
UISpinMenu.prototype.elementFromPoint = function (t)
{
    var e = ui.getCoord(t, "X"), i = ui.getCoord(t, "Y");
    if (null != e && null != i)
    {
        var n = this.spinButton.dom.offset(), s = this.spinButton.dom.width() / 2, o = n.left + s, a = n.top + s, 
        r = Math.sqrt((e - o) * (e - o) + (i - a) * (i - a)), l = Math.atan2(i - a, e - o);
        if (l < 0 && (l += 2 * Math.PI), r < s) {
            return this.spinButton.dom;
        }
        for (var h = [this.autoButton, this.quickButton].concat(this.withoutAutoQuickButton ? [] : [this.autoQuickButton]), 
        u = 0;
        u < h.length;
        u++)
        {
            var d = h[u], c = d.offset(), p = d.width() / 2, m = c.left + p, f = c.top + p, g = Math.sqrt((m - o) * (m - o) + (f - a) * (f - a)), 
            b = g + p, y = b - s, v = s + y * UISpinMenu.minimumDistance / 100, C = b + y * UISpinMenu.minimumDistance / 100, 
            w = Math.atan2(f - a, m - o);
            if (w < 0 && (w += 2 * Math.PI), r >= v && r < C && l > w - UISpinMenu.angleRange / 2 && l < w + UISpinMenu.angleRange / 2) {
                return d;
            }
        }
        return null;
    }
},
UISpinMenu.prototype.updateButtons = function ()
{
    this.autoVisible = this.config.auto, this.quickVisible = this.config.quick;
},
UISpinMenu.prototype.checkElement = function (t)
{
    t ? (t = $(t), t.length && t.is("#spin-button,#spin-menu *") ? t.is(".bar") && (t = t.parent()) : t = null) : t = null, 
    !this.hoveredElement && !t || this.hoveredElement && t && this.hoveredElement[0] == t[0] || (this.config = $.extend(true, 
    {}, this.startConfig), t && this.satelliteButtons.indexOf(t[0]) !=- 1 ? (t[0] != this.autoQuickButton[0] || this.withoutAutoQuickButton ? t[0] == this.autoButton[0] ? this.config.auto = !this.config.auto : t[0] == this.quickButton[0] && (this.config.quick = !this.config.quick) : (this.config.auto = !this.config.auto, 
    this.config.quick = !this.config.quick), this.hoveredElement && this.hoveredElement.removeClass("hovered")) : (this.hoveredElement && this.hoveredElement.removeClass("hovered"), 
    !t || this.tapStyle && t[0] == this.spinButton.dom[0] || t.addClass("hovered")), this.updateButtons()), 
    this.hoveredElement = t;
},
UISpinMenu.prototype.soundSpin = function () {}, UISpinMenu.prototype.soundAutoSpin = function () {},
UISpinMenu.prototype.soundAutoSpinStop = function () {}, UIInfoBar.prototype = Object.create(UIComponent.prototype), 
UIInfoBar.prototype.constructor = UIInfoBar, UIInfoBar.prototype.initDOM = function ()
{
    return UIComponent.prototype.initDOM.call(this), this.messageLabel = new UILabel(this.dom.find("> label")), 
    this;
},
UIInfoBar.prototype.show = function (t, e, i)
{
    if (this.moveTimeout && (clearTimeout(this.moveTimeout), this.moveTimeout = null, this.messageLabel.dom.css("margin-left", 
    "")), this.message = t, this.messageLabel.dom.width() > this.dom.width())
    {
        var n = this.messageLabel.dom.width() - this.dom.width(), s = function ()
        {
            n =- n, this.messageLabel.dom.css("margin-left", TextUtils.px(n > 0 ? 0 : n)), this.moveTimeout = setTimeout(s, 
            1e3)
        }
        .bind(this);
        s()
    }
    this.dom.attr("class", this.dom.attr("class").replace(/id-\S+\s?/g, "").trim()), this.textIdClasses.length && this.dom.addClass(this.textIdClasses.map(function (t)
    {
        return "id-" + t;
    }).join(" ")), this.timeout && clearTimeout(this.timeout), e && (this.timeout = setTimeout(i ? this.nextMessage.bind(this) : this.clearAndNextMessage.bind(this), 
    e));
},
UIInfoBar.prototype.showById = function (t, e, i, n, s)
{
    this.textIdClasses = [e];
    var o = locale.getText(t, e);
    return n && (o = o.substituteTokens(n || {})), this.show(o, i, s);
},
UIInfoBar.prototype.clearAndNextMessage = function ()
{
    this.message = "", this.timeout && clearTimeout(this.timeout), this.timeout = setTimeout(this.nextMessage.bind(this), 
    4e3);
},
UIInfoBar.prototype.nextMessage = function ()
{
    logger.info("UIInfoBar.nextMessage()")
},
UIBottomBar.prototype = Object.create(UIComponent.prototype), UIBottomBar.prototype.constructor = UIBottomBar, 
UITutorial.prototype = Object.create(UIComponent.prototype), UITutorial.prototype.constructor = UITutorial, 
UITutorial.prototype.initDom = function ()
{
    return UIComponent.prototype.initDOM.call(this), ui.spinMenu && ui.spinMenu.dom.append(ui.applyTemplate("tutorial", 
    ui.templateRenderData())), this
},
UITutorial.prototype.show = function (t, e)
{
    var i = this, n = !!t || !this.check();
    ui && ui.spinMenu && n && "bet.idle" === clientData.state || t ? (Stage.pauseAll(), ui.gameInfoBar.showById("ui", 
    "TUTORIAL_TAP_CONTINUE"), ui.spinMenu.show(0), ui.body.addClass("tutorial").removeClass("spin-menu"), 
    this.opened = true, this.dom.one(ui.click, function ()
    {
        "function" == typeof e && e(), i.hide()
    })) : "function" == typeof e && e()
},
UITutorial.prototype.hide = function (t)
{
    if (Stage.resumeAll(), ui.body.removeClass("tutorial"), ui.gameInfoBar.clearAndNextMessage(), ENV.isAndroid && ENV.isUCBrowser)
    {
        var e = ui.spinMenu.visible;
        ui.spinMenu.visible = false, setTimeout(function ()
        {
            e && (ui.spinMenu.visible = true);
        }, 50)
    }
    ui.spinMenu.hide(), userConfig.tutorialPassed = true, $("#tutorial-overlay, .tutorial-touch-overlay").remove(), 
    "function" == typeof t && t(), setTimeout(function ()
    {
        ui && ui.uiTutorial && (delete ui.uiTutorial, ui.uiTutorial = null);
    }, 1e3)
},
UITutorial.prototype.check = function ()
{
    var t = false;
    return t = !(userConfig && !userConfig.tutorialPassed);
},
UIFullscreen.prototype.constructor = UIFullscreen, UIFullscreen.prototype.debugWrite = function ()
{
    if (this.config.debug)
    {
        var t = "", e = this.data;
        for (var i in e) {
            e.hasOwnProperty(i) && (t += "<span>" + i + ": " + e[i] + "</span>");
        }
        this.debugDom.innerHTML = t
    }
    return this;
},
UIFullscreen.prototype.checkSupporting = function ()
{
    var t = this.windowHeight() > this.getDeviceHeight() - 25 && !(this.windowHeight() === this.getDeviceHeight());
    setTimeout(function ()
    {
        ENV.iOS7 && ENV.isSafari ? this.initMinimalUi() : this.screenfull.enabled && (ENV.isAndroid && ENV.isChrome || ENV.isWindows) ? this.initNative() :!ENV.iOSDevice || !ENV.isSafari && !ENV.isChrome || ENV.isSafariDefault || t ? this.initFail() : this.initEmulation(), 
        this.promise && this.promise.resolve()
    }
    .bind(this), this.config.unlockDelay)
},
UIFullscreen.prototype.initEmulation = function ()
{
    this.unlock(), this.initRequestAnim(), this.getDeviceHeight(), this.sizes = 
    {
        portrait : {
            height : [Math.max(this.getDeviceHeight(), this.getDeviceWidth()), 0]
        },
        landscape : {
            height : [Math.max(this.getDeviceHeight(), this.getDeviceWidth()), 0]
        }
    },
    this.data.i = 0, this.data.fullscreen = true, this.data.tempHeight = 0, this.data.maxHeight = this.windowHeight(), 
    this.debugWrite(), this.applyEventListeners(), this.data.doNotResize = true, this.unlock(function ()
    {
        this.getDeviceHeight(), this.initLoop(), this.applyEventListeners()
    }
    .bind(this)), $(window).TabWindowVisibilityManager({
        onBlurCallback : function ()
        {
            ENV.iOSDevice && ENV.isChrome && this.unlock()
        }
        .bind(this)
    })
},
UIFullscreen.prototype.initNative = function ()
{
    this.data.doNotResize = false, this.unlock(), this.data.mode = "native", iNoBounce.enable(), this.applyEventListenersNative();
},
UIFullscreen.prototype.initMinimalUi = function ()
{
    this.data.doNotResize = false, this.data.mode = "minimal-ui", $(this.adviceElement).hide(), iNoBounce.enable(), 
    this.data.fullscreen = true, this.lock(), $(window).on("orientationchange", function (t)
    {
        window.scrollTo(0, 0), this.lock()
    }
    .bind(this))
},
UIFullscreen.prototype.initFail = function ()
{
    this.adviceElement[0].style.display = "none", this.data.doNotResize = false, this.data.mode = "fail", 
    this.data.fullscreen = true, iNoBounce.enable(), clearInterval(this.checkInterval), this.removeEventListeners(), 
    this.removeEventListenersNative(), this.lock();
},
UIFullscreen.prototype.initLoop = function ()
{
    var t = this.config.fps, e = Math.round(t / 2), i, n = (new Date).getTime(), s = 1e3 / t, o, a = function ()
    {
        this.loop = window.requestAnimFrame(a, window.element), i = (new Date).getTime(), o = i - n, this.data.maxHeight = Math.max(this.windowHeight(), 
        this.data.maxHeight), o > s && (this.data.i++, this.data.times++, this.data.currentHeight = this.windowHeight(), 
        this.data.sizesPortrait = this.sizes.portrait.height, this.data.sizesLandscape = this.sizes.landscape.height, 
        this.sizes[this.data.orientation].height[0] = Math.min(this.sizes[this.data.orientation].height[0], 
        this.windowHeight()), this.sizes[this.data.orientation].height[1] = Math.max(this.sizes[this.data.orientation].height[1], 
        this.windowHeight()), $(document).scrollTop() > 20 && this.data.maxHeight === this.data.startH && (this.data.fullscreen = false, 
        this.triggerMode(), this.initFail()), this.data.tapped || (this.data.currentHeight === this.data.tempHeight ? this.data.times < e ? this.data.times++: (this.windowHeight() > this.sizes[this.data.orientation].height[0] && this.sizes[this.data.orientation].height[1] !== this.sizes[this.data.orientation].height[0] ? (this.data.fullscreen || (this.data.fullscreen = true, 
        this.triggerMode()), this.data.mmm = "1") : this.windowHeight() < this.sizes[this.data.orientation].height[1] && this.sizes[this.data.orientation].height[1] !== this.sizes[this.data.orientation].height[0] && (this.data.fullscreen && (this.data.fullscreen = false, 
        this.triggerMode()), this.data.mmm = "2"), this.data.times = 0) : (this.getDeviceHeight() === this.data.currentHeight ? this.data.fullscreen || (this.data.fullscreen = true, 
        this.triggerMode()) : this.data.fullscreen && (this.data.fullscreen = false, this.triggerMode()), 
        this.data.times = 0), this.data.tempHeight = this.data.currentHeight, n = i - o % s)), this.debugWrite()
    }
    .bind(this);
    this.data.timesForWatch = e, a();
},
UIFullscreen.prototype.initRequestAnim = function ()
{
    window.requestAnimFrame = function ()
    {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (t, 
        e) {
            window.setTimeout(t, 1e3 / 60)
        }
    }(),
    window.cancelRequestAnimFrame = function ()
    {
        return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
    }
    ()
},
UIFullscreen.prototype.triggerMode = function ()
{
    this.data.checkMode = false, this.data.fullscreen ? this.lock() : this.unlock();
},
UIFullscreen.prototype.showbar = function (t)
{
    window.scrollTo(0, - 1), "function" == typeof t && setTimeout(function ()
    {
        t()
    }
    .bind(this), 400)
},
UIFullscreen.prototype.lock = function (t)
{
    this.postLock(), $("body").css({
        height : this.windowHeight() + this.config.heightIncr
    }), clearTimeout(this.lockDelayTimeout), this.lockDelayTimeout = setTimeout(function ()
    {
        iNoBounce.enable(), this.resizeGame(), "object" == typeof ui ? this.currentAdvice = false : this.adviceElement[0].style.display = "none", 
        ui && ui.canResume() && Stage.resumeAll(), ENV && ENV.isMobile && ENV.isSafari && window.scrollTo(0, 
        0)
    }
    .bind(this), this.config.lockDelay);
},
UIFullscreen.prototype.lockNative = function (t)
{
    this.data.fullscreen = true, "object" == typeof ui ? this.currentAdvice = false : this.adviceElement[0].style.display = "none", 
    ui && ui.canResume() && Stage.resumeAll(), this.postLock();
},
UIFullscreen.prototype.unlock = function (t)
{
    this.data.exit || (this.data.fullscreen = false, "object" == typeof ui ? this.currentAdvice = "swipe-up" : this.adviceElement[0].style.display = "block", 
    $("body").css({
        height : this.windowHeight() + this.config.heightIncr
    }), iNoBounce.disable(), clearInterval(this.unlockTimeout), this.unlockTimeout = setTimeout(function ()
    {
        this.resizeGame(), Stage.pauseAll(), this.showbar(function ()
        {
            "function" == typeof t && t()
        }
        .bind(this))
    }
    .bind(this), this.config.unlockDelay))
},
UIFullscreen.prototype.unlockNative = function (t)
{
    this.screenfull.exit(), this.data.fullscreen = false, "object" == typeof ui ? this.currentAdvice = "swipe-up" : this.adviceElement[0].style.display = "block", 
    Stage.pauseAll(), this.showbar();
},
UIFullscreen.prototype.postLock = function (t)
{
    var e = "fs-fail";
    switch (this.data.mode)
    {
        case "native":
            e = "fs-native";
            break;
        case "emulate":
            e = "fs-emulate";
            break;
        case "minimal-ui":
            e = "fs-minimal-ui"
    }
    $("body").removeClass("fs-fail fs-native fs-emulate fs-minimal-ui").addClass(e);
},
UIFullscreen.prototype.resizeGame = function ()
{
    window.forceWindowResize(), ui.onResize(), ui.mainMenu.rearrangeTab()
},
UIFullscreen.prototype.launchNativeFullscreen = function (t)
{
    var e = false;
    this.toggleModeTimer = setTimeout(function ()
    {
        if (this.screenfull.enabled) {
            try {
                this.screenfull.request() 
            }
            catch (t) {
                e = true ;
            }
        }
        setTimeout(function ()
        {
            this.screenfull.element && !e || e || this.screenfull.exit()
        }
        .bind(this), this.config.unlockDelay)
    }
    .bind(this), 100)
},
UIFullscreen.prototype.getDeviceHeight = function ()
{
    return "landscape" === this.deviceOrientation() ? this.data.deviceHeight = Math.min(window.screen.availWidth, 
    window.screen.availHeight) : this.data.deviceHeight = Math.max(window.screen.availWidth, window.screen.availHeight), 
    this.debugWrite(), this.data.deviceHeight;
},
UIFullscreen.prototype.getDeviceWidth = function ()
{
    return this.data.deviceWidth = "landscape" === this.deviceOrientation() ? Math.max(window.screen.availWidth, 
    window.screen.availHeight) : Math.min(window.screen.availWidth, window.screen.availHeight), this.data.deviceWidth;
},
UIFullscreen.prototype.windowHeight = function ()
{
    return this.data.windowHeight = "landscape" === this.deviceOrientation() ? Math.min(window.innerHeight || document.documentElement.clientHeight, 
    window.innerWidth || document.documentElement.clientWidth) : Math.max(window.innerHeight || document.documentElement.clientHeight, 
    window.innerWidth || document.documentElement.clientWidth), this.data.windowHeight;
},
UIFullscreen.prototype.deviceHeight = function ()
{
    return 90 === Math.abs(window.orientation) ? window.screen.height : window.screen.width;
},
UIFullscreen.prototype.deviceOrientation = function ()
{
    var t = 90 === Math.abs(window.orientation) ? "landscape" : "portrait";
    return this.data.orientation = t, t;
},
UIFullscreen.prototype.touchStartEvent = function (t)
{
    t = t && t.originalEvent || t, ui && !ui.uiReady && (t.preventDefault(), t.stopPropagation()), clearInterval(this.tappedTimeout), 
    this.data.tapped = true, this.data.startH = this.windowHeight(), this.data.checkMode && (this.data.fullscreen || (this.data.ptsY[0] = t.touches[0].pageY - window.pageYOffset));
},
UIFullscreen.prototype.touchEndEvent = function (t)
{
    t = t && t.originalEvent || t, this.data.tapped = false, clearInterval(this.tappedTimeout), this.tappedTimeout = setTimeout(function ()
    {
        this.data.tapped = false, this.data.endH = this.windowHeight(), this.debugWrite()
    }
    .bind(this), 200);
},
UIFullscreen.prototype.touchMoveEvent = function (t)
{
    t = t && t.originalEvent || t, this.data.ptsY[0] - this.data.ptsY[1] < 0 ? (this.data.direction = false, 
    t.preventDefault()) : this.data.direction = true, !this.data.fullscreen && this.data.checkMode && (this.data.ptsY[1] = t.touches[0].pageY - window.pageYOffset, 
    this.data.ptsX = t.touches[0].pageX - window.pageXOffset, this.data.ptsY[0] - this.data.ptsY[1] < 0 ? (this.data.direction = false, 
    t.preventDefault()) : this.data.direction = true, this.data.diff = this.data.startH - this.windowHeight() - window.pageYOffset, 
    this.data.diff2 = this.data.ptsY[1] - this.data.ptsY[0]), this.debugWrite();
},
UIFullscreen.prototype.resizeChangeEvent = function (t)
{
    clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function ()
    {
        var t = function ()
        {
            this.data.focused = false
        }
        .bind(this);
        this.data.focused ? this.data.focused = false : (this.deviceOrientation(), this.getDeviceHeight(), 
        this.config.resetOnRotation ? this.unlock(function ()
        {
            t()
        }
        .bind(this)) : t()), setTimeout(function ()
        {
            this.resizeGame()
        }
        .bind(this), 200)
    }
    .bind(this), 100)
},
UIFullscreen.prototype.applyEventListeners = function ()
{
    $(window).on("orientationchange.fs", function (t)
    {
        this.resizeChangeEvent(t)
    }
    .bind(this)), $(this.adviceElement).on("touchstart.fs", function (t)
    {
        this.touchStartEvent(t)
    }
    .bind(this)).on("touchend.fs", function (t)
    {
        this.touchEndEvent(t)
    }
    .bind(this)).on("touchmove.fs", function (t)
    {
        this.touchMoveEvent(t)
    }
    .bind(this))
},
UIFullscreen.prototype.removeEventListeners = function ()
{
    $(window).off("resize.fs"), $(this.adviceElement).off("touchstart.fs touchend.fs touchmove.fs")
},
UIFullscreen.prototype.touchStartEventNative = function (t)
{
    if (t = t && t.originalEvent || t, this.data.checkMode && (this.data.fullscreen || (this.data.ptsY[0] = t.touches[0].pageY - window.pageYOffset)), 
    this.data.fullscreen) return t.preventDefault(), false;
},
UIFullscreen.prototype.touchEndEventNative = function (t)
{
    this.data.direction && this.data.ptsX < this.getDeviceWidth() - this.config.barDeadZone && (ENV.isWindows ? this.screenfull.request() : this.launchNativeFullscreen(t)), 
    this.data.direction = false;
},
UIFullscreen.prototype.orientationChangeEventNative = function ()
{
    this.config.resetOnRotation && setTimeout(function ()
    {
        this.showbar(), this.screenfull.exit()
    }
    .bind(this), this.config.unlockDelay)
},
UIFullscreen.prototype.applyEventListenersNative = function ()
{
    $(this.adviceElement).on("touchstart.fs", function (t)
    {
        this.touchStartEventNative(t)
    }
    .bind(this)).on("touchmove.fs", function (t)
    {
        this.touchMoveEvent(t)
    }
    .bind(this)).on("touchend.fs", function (t)
    {
        this.touchEndEventNative(t)
    }
    .bind(this)), $(window).on("orientationchange.fs", function (t)
    {
        this.orientationChangeEventNative(t)
    }
    .bind(this)), $(document).on(this.screenfull.raw.fullscreenchange, function ()
    {
        this.screenfull.isFullscreen ? this.lockNative() : this.unlockNative()
    }
    .bind(this)), $(window).on("hashchange", function ()
    {
        clearTimeout(this.toggleModeTimer)
    }
    .bind(this))
},
UIFullscreen.prototype.removeEventListenersNative = function ()
{
    $(this.adviceElement).off("touchstart.fs touchmove.fs touchend.fs"), $(window).off("orientationchange.fs"), 
    this.screenfull.enabled && $(document).off(this.screenfull.raw.fullscreenchange)
},
UIFullscreen.prototype.screenfullInit = function ()
{
    var t = this;
    !function ()
    {
        var e = "undefined" != typeof module && module.exports, i = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT"in Element, 
        n = function ()
        {
            for (var t, e, i = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", 
            "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", 
            "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], 
            ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", 
            "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", 
            "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], 
            ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", 
            "MSFullscreenChange", "MSFullscreenError"]], n = 0, s = i.length, o = {};
            n < s;
            n++) if (t = i[n], t && t[1]in document) {
                for (n = 0, e = t.length; n < e; n++) {
                    o[i[0][n]] = t[n];
                }
                return o
            }
            return false
        }(),
        s = 
        {
            request : function (t)
            {
                var e = n.requestFullscreen;
                t = t || document.documentElement, /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? t[e]() : t[e](i && Element.ALLOW_KEYBOARD_INPUT);
            },
            exit : function ()
            {
                document[n.exitFullscreen]()
            },
            toggle : function (t)
            {
                this.isFullscreen ? this.exit() : this.request(t)
            },
            raw : n
        };
        return n ? (Object.defineProperties(s, 
        {
            isFullscreen : {
                get : function ()
                {
                    return Boolean(document[n.fullscreenElement]);
                }
            },
            element : {
                enumerable : true,
                get : function ()
                {
                    return document[n.fullscreenElement];
                }
            },
            enabled : {
                enumerable : true,
                get : function ()
                {
                    return Boolean(document[n.fullscreenEnabled]);
                }
            }
        }), void (e ? module.exports = s : t.screenfull = s)) : void (e ? module.exports = false : t.screenfull = false)
    }
    ();
},
Locale.prototype.constructor = Locale, Locale["default"] = "en", Locale.prototype.load = function (t, 
e)
{
    return $.ajax( {
        url : e, dataType : "text"
    }).pipe(function (e)
    {
        this.parseServerData(t, e)
    }
    .bind(this))
},
Locale.prototype.parseServerData = function (t, e)
{
    this.data.find(t).append($(e))
},
Locale.prototype.getText = function (t, e)
{
    var i = this.data.find(t + " string[id='" + e + "']");
    return 0 == i.length ? null : i.html();
},
Locale.prototype.getKeyAsObject = function (t)
{
    var e = {}, i = this.data.find(t + " string[id]");
    return i.each(function (t, i)
    {
        var n = i.attributes.id.nodeValue, s = i.innerHTML;
        e[n] = s;
    }), e
},
Locale.prototype.getStringElement = function (t, e)
{
    return this.data.find(t + " string[id='" + e + "']");
},
Locale.prototype.extractFonts = function ()
{
    return this.data.find("font");
},
Locale.prototype.getUnicodeRanges = function (t)
{
    var e = [ {
        from : 8352, to : 8368
    }];
    return ( {
        en : [ {
            from : 0, to : 126
        }]
    }
    [t] || []).concat(e)
};
var locale = new Locale;
ImageLoader.prototype = Object.create(EventDispatcher.prototype), ImageLoader.prototype.constructor = ImageLoader, 
ImageLoader.prototype.STUB = {}, ImageLoader.imageToCanvas = function (t)
{
    if (ENV.iOSDevice && ENV.isSmallScreenSize || slotConfig.notCachingImage || ENV.isChrome && ENV.compareVersions(ENV.chromeVersion, 
    "49") >= 0) return t;
    var e = document.createElement("canvas");
    e.width = t.width, e.height = t.height;
    var i = e.getContext("2d");
    return i.drawImage(t, 0, 0), e;
},
ImageLoader.prototype.add = function (t, e, i)
{
    if ("number" != typeof this.maxStreams && (this.maxStreams = 0), "string" == typeof t)
    {
        var n = {
            source : t, name : e || this.generateName()
        };
        return this.queue.push(n), this.queueLength++, this.maxStreams++, n.name
    }
    var s = this, o = t.toDataURL(i || "image/png"), a = new Image;
    return a.name = e || this.generateName(), a.onload = function (t)
    {
        var e = t.target;
        s.resources[e.name] = ImageLoader.imageToCanvas(e);
    },
    a.src = o, this.resources[a.name] = t, a.name;
},
ImageLoader.prototype.addMultiple = function (t)
{
    for (var e = [], i = 0; i < t.length; i++) {
        e.push(this.add[t[i].constructor == Array ? "apply" : "call"](this, t[i]));
    }
    return e;
},
ImageLoader.prototype.get = function (t)
{
    var e = this.resources[t];
    if (!e) {
        throw new Error('Image "' + t + '" is not found.');
    }
    return e;
},
ImageLoader.tryReconnect = 0, ImageLoader.prototype.start = function (t, e)
{
    if (e || (this.loadPromise = $.Deferred()), this.defaultStreams < 1 ? this.streams = this.maxStreams : this.streams = this.defaultStreams, 
    t && (this.loaded = 0, this.queueLength = this.queue.length), this.waitingSrc = [], 0 == this.queue.length) return void console.log("ImageLoader.start: nothing to preload");
    this.promises = [];
    for (var i = 0; i < this.streams; i++)
    {
        this.queue.length && this.promises.length < this.streams && this.promises.push(function (t) 
        {
            var e = $.Deferred(), i = function (i) 
            {
                ui.hasBeenDisconnect = true, systemLoader.debugMessage("<div>Connection lost</div>"), 
                t.waitingSrc.push(i), e.resolve();
            },
            n = function (e) 
            {
                var n = t.queue[0], s = new Image;
                s.crossOrigin = "anonymous", s.name = n.name || t.generateName(), $(s).on( 
                {
                    load : function () 
                    {
                        if ("naturalHeight"in this) {
                            if (this.naturalHeight + this.naturalWidth === 0) {
                                return void i(n) ;
                            }
                        }
                        else if (this.width + this.height == 0) {
                            return void i(n);
                        }
                        t.resources[n.name] = ImageLoader.imageToCanvas(s), t.onProgress(), systemLoader.debugMessage('<div class="white">Loading...</div>'), 
                        e.resolve();
                    },
                    error : function () 
                    {
                        i(n) 
                    }
                }).attr("src", n.source), t.resources[n.name] = s, t.queue.splice(0, 1);
            };
            return n(e), e.promise() 
        }
        (this));
    }
    return $.when.apply($, this.promises).promise().done(this.loadCheck.bind(this)), $.when.apply($, [this.loadPromise]).promise().done(this.onLoaded.bind(this));
},
ImageLoader.prototype.loadCheck = function ()
{
    if (this.waitingSrc.length)
    {
        this.queue = this.waitingSrc.slice(), systemLoader.debugMessage("<div>Connection lost</div>");
        var t = this, e = function ()
        {
            $.ajax(
            {
                url : t.waitingSrc[0].source,
                complete : function (e, i)
                {
                    "success" === i && (systemLoader.debugMessage('<div class="green">Connection restored</div>'), 
                    t.start(null, true), setTimeout(function ()
                    {
                        ImageLoader.tryReconnect = 0, systemLoader.debugMessage("");
                    },
                    t.failRequestTimeout))
                },
                error : function (i, n)
                {
                    setTimeout(function ()
                    {
                        systemLoader.debugMessage("<div>No connection</div><div>Ping server. Try " + ImageLoader.tryReconnect + "</div>"), 
                        e(), ImageLoader.tryReconnect++
                    },
                    t.failRequestTimeout)
                }
            })
        };
        e()
    }
    else {
        this.loadPromise.resolve();
    }
},
ImageLoader.prototype.onLoaded = function ()
{
    this.queue = [];
},
ImageLoader.prototype.onProgress = function ()
{
    if (!this.connectionLost)
    {
        this.loaded++;
        var t = new GameEvent(GameEvent.PROGRESS);
        t.progress = this.loaded / this.queueLength, this.dispatchEvent(t);
    }
},
ImageLoader.prototype.createBuffer = function (t, e)
{
    var i = document.createElement("canvas");
    return i.width = t, i.height = e, i;
},
ImageLoader.prototype.generateName = function ()
{
    return "--gen-" + this.generatedNamesCount++;
},
ImageLoader.prototype.createImageGradiend = function (t, e, i)
{
    var n = imageLoader.get(t), s = imageLoader.createBuffer(e.width, e.height), o = s.getContext("2d"), 
    a = 0, r = 0, l, h, u, d;
    for (i || (i = o.createLinearGradient(0, 0, 0, e.height), i.addColorStop(0, "transparent"), i.addColorStop(1, 
    "#000")), o.fillStyle = i, o.fillRect(0, 0, e.width, e.height), l = o.getImageData(0, 0, e.width, 
    e.height), o.drawImage(n, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height), h = o.getImageData(0, 
    0, e.width, e.height), u = h.data, d = l.data, a = u.length, r = 0;
    r < a;
    r += 4) u[r + 3] = d[r + 3];
    return o.putImageData(h, 0, 0), imageLoader.add(s);
},
Hosts.prototype.next = function ()
{
    this.currentId++, this.currentId > this.domains.length - 1 && (this.currentId = 0);
},
Hosts.prototype.get = function (t)
{
    var e = this.currentId, i = "";
    return t && t < this.domains.length ? i = this.domains[t] : (i = this.domains[e], this.next()), i;
};
var hosts = new Hosts({
    ip : "10.100.4.40", port : 8080, path : "UUI/branches/fullscreen/src/"
}), imageLoader = new ImageLoader;
FPSCounter.prototype = Object.create(UILabel.prototype), FPSCounter.prototype.constructor = FPSCounter, 
FPSCounter.prototype.attach = function (t)
{
    this.stage = t, gameConfig.debug && (this.visible = true, this.stage.addEventListener(GameEvent.ENTER_FRAME, 
    this.onEnterFrame, this));
},
FPSCounter.prototype.onEnterFrame = function ()
{
    this.counter++, Math.floor(this.stage.time / 1e3) > Math.floor((this.stage.time - this.stage.deltaTime) / 1e3) && (this.text = Math.floor(this.counter * this.stage.playbackRate), 
    this.counter = 0);
},
SlotShifter.instance = null, SlotShifter.init = function (t)
{
    clientData.addEventListener(GameEvent.UPDATE, function (e)
    {
        !SlotShifter.instance && "init" == e.diff.state && gameConfig.debug && (SlotShifter.instance = new SlotShifter(t));
    })
},
$.extend(SlotShifter.prototype, 
{
    CombinationEditor : null,
    initControlButtons : function ()
    {
        var t = this, e = this.view.find(".okBtn"), i = this.view.find(".reconnectBtn"), n = this.view.find(".closeBtn"), 
        s = this.view.find(".addComb"), o = this.view.find(".clearCombs"), a = this.view.find(".sendCombs");
        s.hide(), n.on(ui.click, function ()
        {
            t.close()
        }), e.on(ui.click, function ()
        {
            var e = t.view.find(".combText").val();
            t.addCombination(e.split(",").map(function (t)
            {
                return t.trim();
            }))
        }), i.on(ui.click, function ()
        {
            game.reconnect(), t.close()
        }), o.on(ui.click, function ()
        {
            t.combinations = [], t.saveCombinations(), t.renderCombinations();
        }), s.on(ui.click, function ()
        {
            t.openCombinationEditor(null)
        }), a.on(ui.click, t.send.bind(t))
    },
    saveCombinations : function ()
    {
        userConfig.shifterConfig = this.combinations;
    },
    send : function ()
    {
        serverData.sendShiftCombinations(this.combinations), this.close()
    },
    loadCombinations : function ()
    {
        this.combinations = userConfig.shifterConfig;
    },
    renderCombinations : function ()
    {
        for (var t = this.view.find(".combList ul"), e = "", i = 0; i < this.combinations.length; i++) {
            e += '<li data-combination-id="' + i + '">' + this.combinations[i].join(", ") + "</li>";
        }
        t.html(e), this.saveCombinations()
    },
    addCombination : function (t)
    {
        var e = t.map(function (t)
        {
            return t.toString();
        });
        this.editedCombinationId ? this.combinations[this.editedCombinationId] = e : this.combinations.push(e), 
        this.renderCombinations(), this.combinationEditor && this.closeCombinationEditor();
    },
    editCombination : function (t)
    {
        if (this.combinationEditor)
        {
            this.editedCombinationId = t;
            var e = this.combinations[t];
            this.openCombinationEditor(e)
        }
    },
    openCombinationEditor : function (t)
    {
        t && this.combinationEditor.setCombination(t), this.combinationEditorView.removeClass("hidden")
    },
    closeCombinationEditor : function ()
    {
        this.combinationEditorView.addClass("hidden"), this.editedCombinationId = null;
    },
    init : function ()
    {
        var t = this;
        this.view.addClass("slot").html(ui.applyTemplate("slotShifter", {})), this.initControlButtons(), 
        this.loadCombinations(), this.renderCombinations(), this.initCombinationEditor();
        var e = this.view.find(".combList");
        e.delegate("li", ui.click, function (e)
        {
            e.stopPropagation();
            var i = $(e.currentTarget).attr("data-combination-id");
            t.editCombination()
        })
    },
    initCombinationEditor : function ()
    {
        var t = this;
        if (this.CombinationEditor)
        {
            this.combinationEditor = new this.CombinationEditor, this.combinationEditorView = this.view.find("#combinationEditor"), 
            this.combinationEditorView.find(".container").append(this.combinationEditor.view);
            var e = this.combinationEditorView.find(".okCombBtn"), i = this.combinationEditorView.find(".cancelCombBtn");
            e.on(ui.click, function (e)
            {
                e.stopPropagation();
                var i = t.combinationEditor.getCombination();
                t.addCombination(i)
            }), i.on(ui.click, function ()
            {
                t.closeCombinationEditor()
            }), this.view.find(".addComb").show()
        }
    },
    open : function ()
    {
        stage.pause(), $(stage.canvas).hide(), this.view.removeClass("hidden"), gameConfig.shifter_enabled = true;
    },
    close : function ()
    {
        this.view.addClass("hidden"), $(stage.canvas).show(), stage.resume(), gameConfig.shifter_enabled = false;
    }
}), Match3Symbol.create = function (t)
{
    function e()
    {
        return Math.random()
    }
    function i(t, e)
    {
        var i;
        for (i = 0; i < e.length; i++) {
            var n = e[i].probability;
            if (t < n) {
                break;
            }
            t -= n
        }
        return e[i].key
    }
    var n = [ {
        key : 2, probability : .16
    },
    {
        key : 3, probability : .16
    },
    {
        key : 4, probability : .165
    },
    {
        key : 5, probability : .165
    },
    {
        key : 6, probability : .16
    },
    {
        key : 7, probability : .16
    },
    {
        key : 8, probability : .01
    },
    {
        key : 9, probability : .01
    },
    {
        key : 10, probability : .01
    }], s = [ {
        key : "f", probability : .04
    },
    {
        key : "m", probability : .03
    },
    {
        key : "s", probability : .18
    },
    {
        key : null, probability : .75
    }], o = null, a = null, r = i(e(), n);
    if (t.isSymbolModifiable(r))
    {
        switch (o = i(e(), s)) {
            case "s":
                a = t.modifiableSymbols.without(r).sample();
                break;
            case "m":
                a = 2 ;
        }
    }
    return new Match3Symbol(t, r, o, a);
},
Match3Symbol.prototype.getFrontURL = function ()
{
    return this.getURL("s" == this.modifier ? this.id : this.toString());
},
Match3Symbol.prototype.getBackURL = function ()
{
    return this.getURL(this.coeff);
},
Match3Symbol.prototype.getURL = function (t)
{
    return "url(" + systemLoader.inGamePath(String.format("res/img/symbols/{0}.png", t)) + ")";
},
Match3Symbol.prototype.toString = function ()
{
    return this.id + (this.modifier || "") + (this.coeff || "");
},
Match3Shifter.instance = null, Match3Shifter.init = function (t)
{
    clientData.addEventListener(GameEvent.UPDATE, function (e)
    {
        !Match3Shifter.instance && "init" == e.diff.state && gameConfig.debug && (Match3Shifter.instance = new Match3Shifter(t));
    })
},
Match3Shifter.prototype.isSymbolModifiable = function (t)
{
    return this.modifiableSymbols.indexOf(t) !=- 1;
},
Match3Shifter.prototype.init = function ()
{
    this.dom.addClass("match-3").html(ui.applyTemplate("match3shifter", 
    {
        colsCount : slotConfig.columns, rowsCount : slotConfig.rows, symbolTypes : this.editorSymbolsTypes, 
        symbolModifiers : this.modifiers.map(function (t)
        {
            return {
                name : String(t), value : t
            }
        })
    }));
    for (var t = 0; t < slotConfig.columns; t++)
    {
        this.fieldData.push([]), this.field[t] = {};
        for (var e = 0; e < slotConfig.rows; e++)
        {
            this.fieldData[t][e] = 0, this.field[t][e] = this.dom.find(String.format("#shifter-cell-{0}-{1}", 
            t, e)).click(this.onFieldCellClick.bind(this, t, e));
        }
    }
    this.layoutInput = this.dom.find("input.layout").bind(ui.click, this.onLayoutInputClick.bind(this)), 
    this.dom.find("button.from-layout").bind(ui.click, this.fromLayout.bind(this)), this.dom.find("button.clear").bind(ui.click, 
    this.clear.bind(this)), this.dom.find("button.send").bind(ui.click, this.send.bind(this)), this.dom.find("button.randomize").bind(ui.click, 
    this.randomize.bind(this)), this.dom.find("button.close").bind(ui.click, this.close.bind(this)), this.dom.find("button.reconnect").bind(ui.click, 
    this.reconnect.bind(this)), this.symbolTypesContainer = this.dom.find(".symbol-types"), this.editorSymbolsTypes.forEach(function (t, 
    e, i)
    {
        this.symbolTypes[t] = $("#shifter-symbol-type-" + t).bind(ui.click, this.onSymbolTypeClick.bind(this, 
        t)), this.symbolTypes[t].find("> .front").css({
            "background-image" : new Match3Symbol(this, t).getFrontURL()
        })
    }, this), this.symbolModifiersContainer = this.dom.find(".symbol-modifiers"), this.modifiers.forEach(function (t, 
    e, i)
    {
        this.symbolModifiers[String(t)] = $("#shifter-symbol-modifier-" + t).bind(ui.click, this.onSymbolModifierClick.bind(this, 
        t))
    }, this), this.testLog = this.dom.find(".test-log"), this.loadFieldData(), this.redrawField(), this.onFieldCellClick(-1, 
     - 1);
},
Match3Shifter.prototype.onFieldCellClick = function (t, e, i)
{
    var n = void 0 != this.fieldData[t] && void 0 != this.fieldData[t][e] ? this.fieldData[t][e] : null;
    this.forEachCell(function (t, e)
    {
        this.field[t][e].removeClass("selected")
    }
    .bind(this)), this.symbolTypesContainer.children().removeClass("selected"), this.symbolModifiersContainer.children().removeClass("selected"), 
    n ? (i && i.ctrlKey ? this.selectedSymbols.push(n) : this.selectedSymbols = [n], this.forEachCell(function (t, 
    e)
    {
        this.selectedSymbols.indexOf(this.fieldData[t][e]) !=- 1 && this.field[t][e].addClass("selected")
    }
    .bind(this)), this.symbolTypesEnabled = true, this.symbolModifiersEnabled = 1 == this.selectedSymbols.length && this.selectedSymbols[0].isModifiable, 
    this.symbolTypes[n.id].siblings().removeClass("selected"), this.symbolTypes[n.id].addClass("selected"), 
    this.symbolModifiers[String(n.modifier || null)].siblings().removeClass("selected"), this.symbolModifiers[String(n.modifier || null)].addClass("selected")) : (this.symbolTypesEnabled = false, 
    this.symbolModifiersEnabled = false, this.selectedSymbols = []);
},
Match3Shifter.prototype.onSymbolTypeClick = function (t)
{
    this.symbolModifiersEnabled = this.isSymbolModifiable(t), this.symbolModifiersEnabled || this.symbolModifiersContainer.children().removeClass("selected"), 
    this.selectedSymbols.forEach(function (e, i, n)
    {
        e.id = t, 1 == t ? e.modifier = "e" : e.isModifiable && "e" != e.modifier || (e.modifier = null);
    }), this.symbolTypes[t].siblings().removeClass("selected"), this.symbolTypes[t].addClass("selected"), 
    this.redrawField()
},
Match3Shifter.prototype.onSymbolModifierClick = function (t)
{
    this.selectedSymbols.forEach(function (e, i, n)
    {
        n[i].modifier = t;
    }), this.symbolModifiers[String(t || null)].siblings().removeClass("selected"), this.symbolModifiers[String(t || null)].addClass("selected"), 
    this.redrawField()
},
Match3Shifter.prototype.clear = function ()
{
    this.forEachCell(function (t, e)
    {
        this.fieldData[t][e] = null
    }
    .bind(this)), this.onFieldCellClick(-1, - 1), this.redrawField();
},
Match3Shifter.prototype.fieldToString = function ()
{
    var t = [];
    return this.forEachCell(function (e, i)
    {
        void 0 == t[i] && (t[i] = []), t[i][e] = this.fieldData[e][i]
    }
    .bind(this)), t.map(function (t)
    {
        return t.join("\t");
    }).join("\n")
},
Match3Shifter.prototype.onLayoutInputClick = function ()
{
    this.layoutInput[0].selectionStart = 0, this.layoutInput[0].selectionEnd = this.layoutInput[0].value.length;
},
Match3Shifter.prototype.fromLayout = function ()
{
    var t = this.layoutInput.val(), e = t.split(",").map(function (t)
    {
        return t.trim();
    });
    (slotConfig.columns * slotConfig.rows - e.length).times(function ()
    {
        e.push("0")
    }), e = e.split(slotConfig.columns), this.forEachCell(function (t, i)
    {
        var n = e[i][t];
        this.fieldData[t][i] = "0" != n ? new Match3Symbol(this, n) : null
    }
    .bind(this)), this.redrawField();
},
Match3Shifter.prototype.send = function ()
{
    serverData.sendShiftCombinations(this.exportField()), this.close()
},
Match3Shifter.prototype.exportField = function ()
{
    return this.transposeMatrix(this.fieldData).flatten();
},
Match3Shifter.prototype.reconnect = function ()
{
    game.reconnect(), this.close()
},
Match3Shifter.prototype.randomize = function ()
{
    this.forEachCell(function (t, e)
    {
        this.fieldData[t][e] = Match3Symbol.create(this)
    }
    .bind(this)), this.layoutInput.val(this.transposeMatrix(this.fieldData).flatten()), this.redrawField();
},
Match3Shifter.prototype.forEachCell = function (t)
{
    for (var e = 0; e < slotConfig.rows; e++) {
        for (var i = 0; i < slotConfig.columns; i++) {
            t(i, e);
        }
    }
},
Match3Shifter.prototype.redrawField = function ()
{
    this.forEachCell(function (t, e)
    {
        var i = this.fieldData[t][e], n = this.field[t][e];
        return i ? (n.find("> .label").text(i.toString()), n.find("> .front").css(
        {
            "background-image" : this.fieldData[t][e] ? this.fieldData[t][e].getFrontURL() : ""
        }), void ("s" == i.modifier ? (n.addClass("stack"), n.find("> .back").css({
            "background-image" : this.fieldData[t][e].getBackURL()
        })) : (n.removeClass("stack"), n.find("> .back").css({
            "background-image" : ""
        })))) : (n.find("> *").css({
            "background-image" : ""
        }).text(""), void n.removeClass("stack"))
    }
    .bind(this)), this.saveFieldData()
},
Match3Shifter.prototype.open = function ()
{
    stage.pause(), $(stage.canvas).hide(), this.dom.removeClass("hidden"), gameConfig.shifter_enabled = true;
},
Match3Shifter.prototype.close = function ()
{
    this.dom.addClass("hidden"), $(stage.canvas).show(), stage.resume(), gameConfig.shifter_enabled = false;
},
Match3Shifter.prototype.loadFieldData = function ()
{
    var t = userConfig.shifterConfig || [];
    (slotConfig.rows * slotConfig.columns - t.length).times(function ()
    {
        t.push(null)
    }), this.fieldData = this.transposeMatrix(t.map(function (t)
    {
        return t ? new Match3Symbol(this, t) : 0
    }
    .bind(this)).split(slotConfig.columns)), this.layoutInput.val(userConfig.shifterConfig.join(","))
},
Match3Shifter.prototype.saveFieldData = function ()
{
    userConfig.shifterConfig = this.exportField().map(function (t)
    {
        return t ? t.toString() : t;
    })
},
Match3Shifter.prototype.transposeMatrix = function (t)
{
    for (var e = [], i = 0; i < t.length; i++) {
        for (var n = 0; n < t[i].length; n++) {
            e[n] || (e[n] = []), e[n][i] = t[i][n];
        }
    }
    return e;
},
ErrorReporter.INTERNAL_ERROR = "INTERNAL ERROR", ErrorReporter.prototype.constructor = ErrorReporter, 
ErrorReporter.prototype.attachHandlers = function () {}, OriginErrorReporter.requestTimeout = 3e3, OriginErrorReporter.prototype = Object.create(ErrorReporter.prototype), 
OriginErrorReporter.prototype.constructor = OriginErrorReporter, OriginErrorReporter.prototype.reportError = function (t, 
e, i)
{
    $.ajax(
    {
        type : "POST", url : "undefined" != typeof gameConfig ? gameConfig.report_url : "", data : 
        {
            code : t, message : e, details : JSON.stringify(i), session : String(gameConfig.session), 
            gameId : String(gameConfig.name), configId : (window.location.search.match(/config_id=([^&=]+)/) || ["", 
            ""])[1]
        },
        dataType : "text", timeout : OriginErrorReporter.requestTimeout
    })
},
OriginErrorReporter.prototype.attachHandlers = function ()
{
    connection.addEventListener(GameEvent.ERROR, function ()
    {
        ui.awaitor.visible = false, ui.infoDialog.showById("ui", false, "CONNECTION_LOST", function ()
        {
            gameConfig.performRetry ? connection.retry() : location.reload()
        })
    }), ui.addEventListener(GameEvent.ERROR, function ()
    {
        ui.infoDialog.showById("ui", false, "ERROR_LOADING", function ()
        {
            location.reload()
        })
    }), clientData.addEventListener(GameEvent.UPDATE, function (t)
    {
        var e = function ()
        {
            document.location = gameConfig.exit_url;
        };
        if (t.diff.state)
        {
            switch (clientData.state) 
            {
                case "error.exit":
                    serverData.statusErrorCode &&/^ERROR_(HOURLY|WEEKLY|MONTHLY|TRIAL|DAILY)_WAGER_LIMIT_EXCEEDED$/.test(serverData.statusErrorCode) ? ui.infoDialog.showById("ui", 
                    "", "POPUP_EERROR_HOURLY_WAGER_LIMIT_EXCEEDED", e) : "sessionlost" == serverData.status ? ui.infoDialog.showById("ui", 
                    false, "SESSION_LOST", e) : "init.connect" == t.diff.state ? ui.externalEvent ? ui.externalEvent("info", 
                    "popup", {
                        statusErrorCode : "FATAL_ERROR" 
                    }) : ui.onPopupIgnore({
                        statusErrorCode : "FATAL_ERROR" 
                    }) : clientData.freegamesActive || serverData.gamble_round !=- 1 || serverData.bonus_round !=- 1 ? ui.infoDialog.showById("ui", 
                    false, "POPUP_SESSION_DATA_CRASHED", e) : ui.infoDialog.showById("ui", false, "SERVER_ERROR", 
                    e);
                    break;
                case "spin.warning":
                    serverData.statusErrorCode && ui.externalEvent && (clientData.getTotalBet() > clientData.getAvailableBalance() || "fail" == serverData.status) ? ui.externalEvent("info", 
                    "popup", {
                        statusErrorCode : serverData.statusErrorCode 
                    }) : ui.onPopupIgnore({
                        statusErrorCode : "ERROR" 
                    });
                    break;
                case "gamble.excess":
                    ui.infoDialog.showById("ui", "", "POPUP_NO_MONEY", function () 
                    {
                        h5game.cashier(), clientData.act("close") 
                    }, 4e3) 
            }
        }
    }), window.onerror = function (t, e, i, n, s)
    {
        this.reportError(ErrorReporter.INTERNAL_ERROR, t, {
            url : e, lineNumber : i, symbolNumber : n, errorObj : s
        }), ENV.isQQBrowser && t.indexOf("topCandidate") > -1 || (ui.infoDialog.show(false, "INTERNAL ERROR", 
        function ()
        {
            gameConfig && (gameConfig.error_url ? document.location = gameConfig.error_url + "?key=" + encodeURIComponent(gameConfig.guid) : document.location = gameConfig.exit_url);
        }), void 0 != logger && logger.error(t))
    }
    .bind(this)
};
var soundDispatcher = new EventDispatcher;
WebAudioPlayer.prototype.init = function (t, e)
{
    var i = this;
    this.ready = true, this._context = t;
    var n = ENV.isAndroid && ENV.isMobile && ENV.isChrome && ENV.compareVersions(ENV.chromeVersion, "43") <= 0;
    this.hasOwnSuspend = !("function" != typeof this._context.suspend || "function" != typeof this._context.resume || n || ENV.isChrome && ENV.compareVersions(ENV.chromeVersion, 
    "52") >= 0 && ENV.compareVersions(ENV.chromeVersion, "53") < 0 && (ENV.isAndroid || ENV.isDesktop)), 
    this._destination = t.destination, this._musicGain = t.createGain(), this._music2Gain = t.createGain(), 
    this._masterGain = t.createGain(), this._sfxGain = t.createGain(), this._sfxSlaveGain = t.createGain(), 
    this.isIOS && (this.isLocked = true, window.addEventListener("touchend", i.unlock.bind(this), false)), 
    e ? i.unmute() : i.mute();
},
WebAudioPlayer.prototype.ready = false, WebAudioPlayer.prototype._buffers = [], WebAudioPlayer.prototype._destination = null, 
WebAudioPlayer.prototype._context = null, WebAudioPlayer.prototype._musicGain = null, WebAudioPlayer.prototype._music2Gain = null, 
WebAudioPlayer.prototype._masterGain = null, WebAudioPlayer.prototype._sfxGain = null, WebAudioPlayer.prototype._sfxSlaveGain = null, 
WebAudioPlayer.prototype.gains = [], WebAudioPlayer.prototype._postponedTracks = [], WebAudioPlayer.prototype.playback = null, 
WebAudioPlayer.prototype.playbacks = [], WebAudioPlayer.prototype.playbacksToResume = [], WebAudioPlayer.prototype.isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent), 
WebAudioPlayer.prototype.isLocked = false, WebAudioPlayer.prototype.hasOwnSuspend = false, WebAudioPlayer.prototype.paused = false, 
WebAudioPlayer.prototype.unlock = function ()
{
    if (this.isLocked)
    {
        var t = this._context.createBuffer(1, 1, 22050), e = this._context.createBufferSource();
        e.buffer = t, e.connect(this._context.destination), e.start(0), this.isLocked = false;
    }
},
WebAudioPlayer.prototype.createPlayback = function (t)
{
    var e = 
    {
        parent : this, file : t.file, source : this.createSource(t), currentTrack : t, startTime : 0, 
        pausedTime : 0, paused : false, finished : false,
        stop : function ()
        {
            if (!this.finished)
            {
                if (this.finished = true, this.source && (this.source.stop(0), this.source = null), !this.parent.hasOwnSuspend && this.parent.paused)
                {
                    for (var t = 0; t < this.parent.playbacksToResume.length; t++)
                    {
                        this == this.parent.playbacksToResume[t] && this.parent.playbacksToResume.splice(t, 
                        1);
                    }
                }
                else {
                    this.parent.removeTrack(this);
                }
            }
        }
    };
    return Object.defineProperty(e, "currentTime", 
    {
        set : function (t)
        {
            this.source && (this.source.context.currentTime = t);
        },
        get : function ()
        {
            return this.source ? this.source.context.currentTime : 0;
        }
    }), e
},
WebAudioPlayer.prototype.postpone = function (t, e, i)
{
    this._postponedTracks.push({
        track : t, stream : e, startTime : this._context.currentTime, playback : i
    })
},
WebAudioPlayer.prototype.checkPostponedTracks = function (t)
{
    var e = this, i = this._postponedTracks.filter(function (e)
    {
        return t == e.track.file;
    });
    i.forEach(function (t)
    {
        var i = t.startTime, n = t.track, s = e.getTrackDuration(n);
        !t.playback.finished && (s > e._context.currentTime - i && !n.loop || n.loop) && e._play(n, t.stream, 
        0, t.playback)
    })
},
WebAudioPlayer.prototype.getTrackDuration = function (t)
{
    var e, i = this._buffers[t.file] || {};
    return e = i.duration || 0, void 0 !== t.start && void 0 !== t.end ? e = t.end - t.start : void 0 !== t.end ? e = t.end : void 0 !== t.start && (e = i.duration - t.start), 
    e > 0 ? e : 0;
},
WebAudioPlayer.prototype.removeTrack = function (t)
{
    for (var e = 0; e < this.playbacks.length; e++) {
        t == this.playbacks[e] && this.playbacks.splice(e, 1);
    }
},
WebAudioPlayer.prototype.createSource = function (t)
{
    var e = this._context.createBufferSource();
    return this._buffers[t.file] ? (e.buffer = this._buffers[t.file], t.music ? e.connect(this._musicGain) : t.music2 ? e.connect(this._music2Gain) : e.connect(this._sfxSlaveGain), 
    this._musicGain.connect(this._masterGain), this._music2Gain.connect(this._masterGain), this._masterGain.connect(this._destination), 
    this._sfxSlaveGain.connect(this._sfxGain), this._sfxGain.connect(this._destination), e) : 0;
},
WebAudioPlayer.prototype.play = function (t, e, i)
{
    return this._play(t, e, i);
},
WebAudioPlayer.prototype._play = function (t, e, i, n)
{
    var s = 0, o = this;
    return n = n || {}, i = i || 0, $.extend(n, this.createPlayback(t)), e || t.loop || (e = true), 0 == n.source ? this.postpone(t, 
    e, n) : (n.currentTrack && (n.startTime = this._context.currentTime - i, n.source.loop = !!t.loop, 
    true === t.loop ? (n.source.loopStart = void 0 != t.start ? t.start : 0, n.source.loopEnd = void 0 != t.end ? t.end : n.source.buffer.duration, 
    n.source.start(s, i + (void 0 != t.start ? t.start : 0))) : void 0 != t.start && void 0 != t.end ? n.source.start(s, 
    t.start + i, t.end - t.start) : n.source.start(s, i)), n.source["onended"] = function ()
    {
        o.removeTrack(n)
    },
    e && this.playbacks.push(n), !this.hasOwnSuspend && this.paused && (e && this.playbacksToResume.push(n), 
    this._pausePlayback(n))), n.stream = e, e ? n : (this.stop(), this.playback = n, true);
},
WebAudioPlayer.prototype.stop = function ()
{
    this.playback && (this.playback.source && this.playback.currentTrack && this.playback.source.stop(0), 
    this.playback.currentTrack = null, this.playback.source = null, this.playback.paused = false, this.playback.startTime = 0, 
    this.playback.finished = true, this.playback.pausedTime = 0);
},
WebAudioPlayer.prototype._pausePlayback = function (t)
{
    var e = this;
    t && true !== t.paused && t.currentTrack && (this._context.currentTime - t.startTime >= this.getTrackDuration(t.currentTrack) && !t.currentTrack.loop || (t.pausedTime = this._context.currentTime, 
    t.paused = true, t.source ? (t.source.stop(0), setTimeout(function ()
    {
        e.removeTrack(t), t && t.source && (t.source["onended"] = function () {})
    }, 0)) : this.removeTrack(t)))
},
WebAudioPlayer.prototype._resumePlayback = function (t, e)
{
    if (t && t && t.paused && t.currentTrack)
    {
        var i = t.pausedTime - t.startTime, n = this.getTrackDuration(t.currentTrack), s = Math.floor(i / n);
        i -= n * s, t.paused = false;
        var o = this._play(t.currentTrack, e, i, t);
        e && (t.source = o.source);
    }
},
WebAudioPlayer.prototype.pause = function ()
{
    var t = this;
    if (this.hasOwnSuspend) {
        this._context.suspend();
    }
    else
    {
        if (this.paused) {
            return false;
        }
        this.playbacksToResume = [], this.playbacks.forEach(function (e)
        {
            t.playbacksToResume.push(e), t._pausePlayback(e)
        }), this.playback && this.playback.currentTrack && !this.playback.paused && !this.playback.finished && (this._pausePlayback(this.playback), 
        t.playbacksToResume.push(this.playback), this.playback = null), this.paused = true;
    }
},
WebAudioPlayer.prototype.resume = function ()
{
    var t = this;
    if (this.hasOwnSuspend) {
        this._context.resume();
    }
    else
    {
        if (!this.paused) {
            return;
        }
        this.paused = false, this.playbacksToResume.forEach(function (e)
        {
            t._resumePlayback(e, e.stream)
        }), this.playbacksToResume = [];
    }
},
WebAudioPlayer.prototype.setGainLevel = function (t, e)
{
    t && (t.gain.value = e || .001);
},
WebAudioPlayer.prototype.cancelScheduledValues = function (t)
{
    var e = t.gain.value;
    t.gain.cancelScheduledValues(0), t.gain.value = e;
},
WebAudioPlayer.prototype.setMusicLevel = function (t)
{
    this.setGainLevel(this._masterGain, t)
},
WebAudioPlayer.prototype.debugInfo = function ()
{
    console.group("%cGain levels", "color: #f44; font-weight: bold;"), console.info("_musicGain value", 
    this._musicGain.gain.value), console.info("_music2Gain value", this._music2Gain.gain.value), console.info("_masterGain value", 
    this._masterGain.gain.value), console.groupEnd()
},
WebAudioPlayer.prototype.setMusicChannelLevel = function (t)
{
    this.setGainLevel(this._musicGain, t)
},
WebAudioPlayer.prototype.setMusic2ChannelLevel = function (t)
{
    this.setGainLevel(this._music2Gain, t)
},
WebAudioPlayer.prototype.setSfxLevel = function (t)
{
    this.sfxLevel = t, this._sfxGain && (this.setGainLevel(this._sfxGain, t), this.setGainLevel(this._sfxSlaveGain, 
    t));
},
WebAudioPlayer.prototype.setSfxSlaveLevel = function (t)
{
    this._sfxSlaveGain && this.setGainLevel(this._sfxSlaveGain, t)
},
WebAudioPlayer.prototype.mute = function ()
{
    this.setMusicLevel(0), this.setSfxLevel(0)
},
WebAudioPlayer.prototype.unmute = function ()
{
    this.setSfxLevel(1)
},
WebAudioPlayer.prototype.fade = function (t, e, i)
{
    t.gain.setTargetAtTime(e, this._context.currentTime, i)
},
WebAudioPlayer.prototype.fadeSFX = function (t, e)
{
    this.fade(this._sfxSlaveGain, t, e)
},
WebAudioPlayer.prototype.fadeMusic = function (t, e)
{
    this.fade(this._musicGain, t, e)
},
WebAudioPlayer.prototype.fadeMusic2 = function (t, e)
{
    this.fade(this._music2Gain, t, e)
},
WebAudioPlayer.prototype.updateBuffers = function (t)
{
    this._buffers = t;
},
WebAudioPlayer.prototype.getAllSounds = function (t, e)
{
    var i = {}, n = this, s = $.map(t, function (t)
    {
        return n.getSound(t).then(function (e)
        {
            return n.decodeBuffer(e, t);
        },
        function (e)
        {
            return console.log("error", t, e.statusText), $.Deferred();
        }).then(function (e)
        {
            return i[t] = e, n.updateBuffers(i), n.checkPostponedTracks(t), i;
        },
        function (e)
        {
            console.log(t, e.message)
        })
    });
    return $.when.apply($, s).then(function (t) {
        console.log("All sound loaded and decoded", t), console.log("Total buffer length", Object.keys(t).map(function (e)
        {
            return t[e].length;
        }).sum()), "function" == typeof e && e.call(null, n)
    })
},
WebAudioPlayer.prototype.getSound = function (t)
{
    return t = systemLoader.inGamePath(t), $.ajax(
    {
        url : t, dataType : "binary", responseType : "arraybuffer", processData : false
    })
},
WebAudioPlayer.prototype.decodeBuffer = function (t, e)
{
    var i = $.Deferred();
    return this._context.decodeAudioData(t, function (t)
    {
        return i.resolve(t), t;
    },
    function ()
    {
        i.reject(Error("Error decoding file"))
    }), i.promise()
},
StubPlayer.prototype.play = function (t, e) {}, StubPlayer.prototype.stop = function () {},
StubPlayer.prototype.pause = function () {}, StubPlayer.prototype.resume = function (t) {},
StubPlayer.prototype.mute = function () {}, StubPlayer.prototype.unmute = function () {},
StubPlayer.prototype.getTrackDuration = function () {}, StubPlayer.prototype.setMusicLevel = function () {},
StubPlayer.prototype.setMusicChannelLevel = function () {}, StubPlayer.prototype.setMusic2ChannelLevel = function () {},
StubPlayer.prototype.setSfxLevel = function () {}, StubPlayer.prototype.setSfxSlaveLevel = function () {},
StubPlayer.prototype.fadeSFX = function () {}, StubPlayer.prototype.fadeMusic = function () {},
StubPlayer.prototype.fadeMusic2 = function () {};
var sound = window["sound"] = function ()
{
    var t = new StubPlayer, e = {}, i;
    return {
        player : t, config : e,
        load : function (t)
        {
            this.player.getAllSounds(this.config.resources, t)
        },
        init : function (n, s)
        {
            e = $.extend(e, n), e.tracks = e.tracks || {}, this.config = e, window.AudioContext = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["oAudioContext"] || window["msAudioContext"];
            var o = navigator.userAgent.indexOf("Mobile") !==- 1 && navigator.appVersion.indexOf("Version/") !==- 1 && navigator.appVersion.indexOf("Android 4.4.2") !==- 1;
            !window.AudioContext || o || false || ui.isLowResolution && ENV.isMobile ? (console.log("web audio not supported"), 
            $("html").addClass("no-sound"), $(".sound-el").remove(), ui.soundEnable = false) : (console.log("sound init"), 
            this.player = t = new WebAudioPlayer, i = new window.AudioContext, t.init(i, false, h5game.getSoundActive()), 
            ui.soundEnable = true);
        },
        play : function (i, n, s)
        {
            try {
                return t.play(e.tracks[i], n, s)
            }
            catch (o) {}
        },
        getTrackDuration : function (i)
        {
            return t.getTrackDuration(e.tracks[i]);
        },
        stop : function ()
        {
            t.stop()
        },
        pause : function ()
        {
            t.pause()
        },
        resume : function ()
        {
            t.resume(0)
        },
        mute : function ()
        {
            h5game.setSoundActive(false), t.mute()
        },
        unmute : function ()
        {
            h5game.setSoundActive(true), t.unmute()
        },
        fadeSFX : function (e, i)
        {
            t.fadeSFX(e, i)
        },
        fadeMusic : function (e, i)
        {
            t.fadeMusic(e, i)
        },
        fadeMusic2 : function (e, i)
        {
            t.fadeMusic2(e, i)
        },
        setSfxLevel : function (e)
        {
            t.setSfxLevel(e)
        },
        setSfxSlaveLevel : function (e)
        {
            t.setSfxSlaveLevel(e)
        },
        setMusicLevel : function (e)
        {
            t.setMusicLevel(e)
        },
        setMusicChannelLevel : function (e)
        {
            t.setMusicChannelLevel(e)
        },
        setMusic2ChannelLevel : function (e)
        {
            t.setMusic2ChannelLevel(e)
        },
        unlock : function ()
        {
            t.unlock()
        }
    }
}();
sound["testPlay"] = function (t)
{
    t.call()
},
GameAPI.prototype.getCanvas = function (t)
{
    return document.getElementById(t);
},
GameAPI.prototype.bindEvents = function ()
{
    this.bindPreloaderEvents(), this.bindClientEvents()
},
GameAPI.prototype.bindPreloaderEvents = function ()
{
    preloader.addEventListener(GameEvent.START, this.onPreloadingStarted, this), preloader.addEventListener(GameEvent.PROGRESS, 
    function (t)
    {
        this.onPreloadingProgressUpdated(100 * t.progress)
    }, this), preloader.addEventListener(GameEvent.COMPLETE, this.onPreloadingEnded, this)
},
GameAPI.prototype.bindClientEvents = function () {}, GameAPI.prototype.getString = function (t)
{
    return TextField.getText(t);
},
GameAPI.prototype.onPreloadingStarted = function () {}, GameAPI.prototype.onPreloadingProgressUpdated = function (t) {},
GameAPI.prototype.onPreloadingEnded = function () {}, GameAPI.prototype.onServerResponseHandled = function () {},
GameAPI.prototype.onErrorOccurred = function (t) {}, GameAPI.prototype.onInitialized = function () {},
GameAPI.prototype.onSoundStatusChanged = function (t) {}, GameAPI.prototype.onBalanceUpdated = function (t) {},
GameAPI.prototype.getLobbyActive = function ()
{
    return Boolean(gameConfig.lobby_active);
},
GameAPI.prototype.setSoundActive = function (t)
{
    setTimeout(function ()
    {
        clientData.sound = t, clientData.diff();
    }, 0)
},
GameAPI.prototype.getSoundActive = function ()
{
    return clientData.sound;
},
GameAPI.prototype.setBalance = function (t)
{
    clientData.balance = t, clientData.diff();
},
GameAPI.prototype.getBalance = function () {}, GameAPI.prototype.start = function ()
{
    this.bindEvents(), game.start()
},
GameAPI.prototype.exit = function () {}, GameAPI.prototype.cashier = function () {},
GameAPI.prototype.reconnect = function ()
{
    game.reconnect()
},
GameAPI.prototype.retry = function ()
{
    connection.retry()
},
GameAPI.prototype.formatMeter = function (t)
{
    return currencyFormatter.format(t);
},
GameAPI.prototype.sortBy = function (t, e, i)
{
    for (var n = t.length, s = 0; s < n - 1; s++)
    {
        for (var o = 0; o < n - 1 - s; o++)
        {
            if (t[o + 1][e] < t[o][e] && i) {
                var a = t[o + 1];
                t[o + 1] = t[o], t[o] = a 
            }
            else if (t[o + 1][e] > t[o][e] && !i) {
                var a = t[o + 1];
                t[o + 1] = t[o], t[o] = a 
            }
            return t;;
        }
    }
},
GameAPI.prototype.bindClientEvents = function ()
{
    clientData.addEventListener(GameEvent.UPDATE, function (t)
    {
        var e = t.diff;
        "init" == e.state && (this.onInitialized(), this.onSettlePlay(), clientData.isActionAvailable("spin") || (this.onTotalWinUpdated(0), 
        this.onOpenPlay(), this.onTotalWinUpdated(0), "bet.win" != clientData.state && "bet.idle" != clientData.state || !clientData.freegamesActive || this.onTotalWinUpdated(serverData.paid))), 
        e.state && "spin.start" == clientData.state && !clientData.freegamesActive && (this.onTotalWinUpdated(0), 
        this.onOpenPlay(), this.onTotalWinUpdated(0)), "spin.stop" == e.state && (this.onTotalWinUpdated(serverData.paid), 
        this.onResultsShown()), e.state && "init" != e.state && 0 != e.state.indexOf("bet.") && e.actions && !e.actions["spin"] && clientData.isActionAvailable("spin") && (this.onTotalWinUpdated(serverData.paid), 
        this.onSettlePlay()), (e.lines || e.bet || "init" == e.state) && this.onTotalBetUpdated(clientData.getTotalBet()), 
        e.display && (clientData.display != Game.SETTINGS && e.display != Game.SETTINGS || this.onSettingsPanelStatusChange(e.display != Game.SETTINGS), 
        clientData.display != Game.PAYTABLE && e.display != Game.PAYTABLE || this.onPaytableStatusChange(e.display != Game.PAYTABLE)), 
        void 0 === t.diff.sound && "init" != e.state || this.onSoundStatusChanged(clientData.sound)
    }, this)
},
GameAPI.prototype.onTotalBetUpdated = function (t) {}, GameAPI.prototype.onTotalWinUpdated = function (t) {},
GameAPI.prototype.onOpenPlay = function () {}, GameAPI.prototype.onSettlePlay = function () {},
GameAPI.prototype.onResultsShown = function () {}, GameAPI.prototype.onSettingsPanelStatusChange = function (t) {},
GameAPI.prototype.onPaytableStatusChange = function (t) {}, GameAPI.prototype.setSettingsPanelStatus = function (t)
{
    t ? (clientData.isActionAvailable("menu") && clientData.act("menu"), clientData.switchDisplay(Game.SETTINGS)) : "bet.menu" == clientData.state && clientData.act("close")
},
GameAPI.prototype.setPaytableStatus = function (t)
{
    t ? (clientData.isActionAvailable("menu") && clientData.act("menu"), clientData.switchDisplay(Game.PAYTABLE)) : "bet.menu" == clientData.state && clientData.act("close")
},
GameAPI.prototype.getShifterCombinations = function ()
{
    return null;
};
var h5game = window["h5game"] = new GameAPI;
DisplayObject.BLEND_MODES = 
{
    NORMAL : "source-over", ADD : "lighter", MULTIPLY : "multiply", SCREEN : "screen", OVERLAY : "overlay", 
    DARKEN : "darken", LIGHTEN : "lighten", COLOR_DODGE : "color-dodge", COLOR_BURN : "color-burn", HARD_LIGHT : "hard-light", 
    SOFT_LIGHT : "soft-light", DIFFERENCE : "difference", EXCLUSION : "exclusion", HUE : "hue", SATURATION : "saturate", 
    COLOR : "color", LUMINOSITY : "luminosity"
},
DisplayObject.prototype = Object.create(EventDispatcher.prototype), DisplayObject.prototype.constructor = DisplayObject, 
DisplayObject.prototype.draw = function (t)
{
    this.visible && this.alpha > 0 && (t.save(), t.translate(this.x + this.tPointX, this.y + this.tPointY), 
    this.alpha < 1 ? t.globalAlpha *= this.alpha : 1 === t.globalAlpha && (t.globalAlpha = .99), t.scale(this.scaleX, 
    this.scaleY), t.rotate(this.rotate), t.translate(-this.tPointX, - this.tPointY), t.globalCompositeOperation = this.blendMode, 
    this.performDraw(t), this.debug && (this.performDebugDraw(t), t.fillStyle = "red", t.fillRect(this.tPointX - 1, 
    this.tPointY - 1, 3, 3)), t.restore());
},
DisplayObject.prototype.performDraw = function (t)
{
    throw new Error("Should be implemented.")
},
DisplayObject.prototype.performDebugDraw = function (t) {}, DisplayObject.prototype.getBoundingRect = function ()
{
    return {
        x : this.x, y : this.y, width : 0, height : 0
    }
},
DisplayObject.prototype.handleTouch = function (t, e, i)
{
    return true;
},
DisplayObject.prototype.setStage = function (t)
{
    this.stage && this.onResizeCallback && this.stage.removeEventListener(GameEvent.RESIZE, this.onResizeCallback, 
    this), this.stage = t, this.stage && this.onResizeCallback && this.stage.addEventListener(GameEvent.RESIZE, 
    this.onResizeCallback, this);
},
DisplayObject.prototype.setEnabled = function (t)
{
    this.enabled = t;
},
DisplayObject.prototype.onClientUpdate = function (t)
{
    this.onClientUpdateCallback && clientData.removeEventListener(GameEvent.UPDATE, this.onClientUpdateCallback, 
    this), this.onClientUpdateCallback = t, clientData.addEventListener(GameEvent.UPDATE, this.onClientUpdateCallback, 
    this);
},
DisplayObject.prototype.onResize = function (t)
{
    this.stage && this.onResizeCallback && this.stage.removeEventListener(GameEvent.RESIZE, this.onResizeCallback, 
    this), this.onResizeCallback = t, this.stage && this.onResizeCallback && this.stage.addEventListener(GameEvent.RESIZE, 
    this.onResizeCallback, this);
},
DisplayObjectContainer.prototype = Object.create(DisplayObject.prototype), DisplayObjectContainer.prototype.constructor = DisplayObjectContainer, 
DisplayObjectContainer.prototype.addChild = function (t, e)
{
    if (!(t instanceof DisplayObject)) {
        throw new Error("Wrong type of child.");
    }
    e = e || 0, this.children.splice(e, 0, t), t.parent = this, t.setStage(this.stage);
},
DisplayObjectContainer.prototype.moveChild = function (t, e)
{
    for (var i = 0; i < this.children.length; i++) if (this.children[i] == t) {
        this.children.splice(i, 1), this.children.splice(i + e, 0, t);
        break
    }
},
DisplayObjectContainer.prototype.removeChild = function (t)
{
    for (var e = 0; e < this.children.length; e++)
    {
        if (this.children[e] == t) {
            return t.parent = null, t.setStage(null), void this.children.splice(e, 1);
        }
    }
},
DisplayObjectContainer.prototype.clearChildren = function ()
{
    this.children = [];
},
DisplayObjectContainer.prototype.setStage = function (t)
{
    DisplayObject.prototype.setStage.call(this, t);
    for (var e = 0; e < this.children.length; e++) {
        this.children[e].setStage(t);
    }
},
DisplayObjectContainer.prototype.performDraw = function (t)
{
    try {
        this.mask(t)
    }
    catch (e) {}
    if (this.children)
    {
        for (var i = this.children.length - 1; i >= 0; i--) {
            this.children[i] && this.children[i].draw(t);
        }
    }
},
DisplayObjectContainer.prototype.handleTouch = function (t, e, i, n)
{
    for (var s = 0; s < this.children.length; s++)
    {
        var o = this.children[s];
        if (o && o.visible && o.enabled && !o.handleTouch(t, e - o.x, i - o.y, n)) {
            return false;
        }
    }
    return true;
},
DisplayObjectContainer.prototype.mask = function (t) {}, AbstractButton.UP = 0, AbstractButton.DOWN = 1, 
AbstractButton.DISABLED = 2, AbstractButton.prototype = Object.create(DisplayObjectContainer.prototype), 
AbstractButton.prototype.constructor = AbstractButton, AbstractButton.prototype.handleTouch = function (t, 
e, i)
{
    if (this.enabled)
    {
        if (e >= this.hitArea.x && e <= this.hitArea.x + this.hitArea.width && i >= this.hitArea.y && i <= this.hitArea.y + this.hitArea.height) 
        {
            var n = new GameEvent(t);
            switch (n.x = e, n.y = i, this.dispatchEvent(n), t) 
            {
                case GameEvent.TOUCH_END:
                    return!this.pressed || (this.setState(AbstractButton.UP), this.pressed = false, n = new GameEvent(GameEvent.CLICK), 
                    n.x = e, n.y = i, this.dispatchEvent(n), false);
                case GameEvent.TOUCH_MOVE:
                    this.pressed && this.setState(AbstractButton.DOWN);
                    break;
                case GameEvent.TOUCH_CANCEL:
                case GameEvent.TOUCH_LEAVE:
                    this.pressed = false;
                    break;
                case GameEvent.TOUCH_START:
                    return this.setState(AbstractButton.DOWN), this.pressed = true, false;
            }
        }
        else
        {
            switch (t) 
            {
                case GameEvent.TOUCH_END:
                case GameEvent.TOUCH_CANCEL:
                case GameEvent.TOUCH_LEAVE:
                    this.pressed = false;
                case GameEvent.TOUCH_MOVE:
                    this.setState(AbstractButton.UP) 
            }
        }
        return true;
    }
},
AbstractButton.prototype.setEnabled = function (t)
{
    this.enabled != t && (this.enabled = t, this.setState(this.enabled ? AbstractButton.UP : AbstractButton.DISABLED));
},
AbstractButton.prototype.setState = function (t) {}, AbstractButton.prototype.onClick = function (t)
{
    this.onClickCallback && this.removeEventListener(GameEvent.CLICK, this.onClickCallback, this), this.onClickCallback = t, 
    this.addEventListener(GameEvent.CLICK, this.onClickCallback, this);
},
Sprite.prototype = Object.create(DisplayObject.prototype), Sprite.prototype.constructor = Sprite, Sprite.prototype.scaleFactor = 1, 
Sprite.prototype.performDraw = function (t)
{
    var e = this.sources[this.frame];
    if (!e) {
        throw new Error("There isn't frame with index: " + this.frame);
    }
    t.drawImage(imageLoader.get(e.src), e.column * this.width / this.scaleFactor, e.row * this.height / this.scaleFactor, 
    this.width / this.scaleFactor, this.height / this.scaleFactor, 0, 0, this.width, this.height)
},
Sprite.prototype.performDebugDraw = function (t)
{
    var e = this.sources[this.frame];
    if (!e) {
        throw new Error("There isn't frame with index: " + this.frame);
    }
    t.lineWidth = 1, t.strokeStyle = this.debugColor, t.strokeRect(0, 0, this.width, this.height);
},
Sprite.prototype.addImage = function (t, e, i)
{
    e = e || 1, i = i || 1;
    for (var n = 0; n < i; n++) {
        for (var s = 0; s < e; s++) {
            this.sources.push({
                src : t, column : s, row : n 
            });
        }
    }
    return this.frames += e * i, this;
},
Sprite.prototype.getBoundingRect = function ()
{
    return {
        x : this.x, y : this.y, width : this.width, height : this.height
    }
},
Rectangle.prototype = Object.create(DisplayObject.prototype), Rectangle.prototype.constructor = Rectangle, 
Rectangle.prototype.performDraw = function (t)
{
    t.fillStyle = this.fillStyle, t.fillRect(0, 0, this.width, this.height);
},
Rectangle.prototype.performDebugDraw = function (t)
{
    t.strokeStyle = this.debugColor, t.strokeRect(0, 0, this.width, this.height);
},
Stage.prototype = Object.create(EventDispatcher.prototype), Stage.prototype.constructor = Stage, Stage.prototype.fromMouseToTouch = 
{
    mousedown : "touchstart", mousemove : "touchmove", mouseleave : "touchcancel", mouseup : "touchend"
},
Stage.instances = [], Stage.pauseAll = function ()
{
    for (var t = 0; t < this.instances.length; t++) {
        this.instances[t] && !this.instances[t].disabled && this.instances[t].pause();
    }
},
Stage.resumeAll = function ()
{
    for (var t = 0; t < this.instances.length; t++) {
        this.instances[t] && !this.instances[t].disabled && this.instances[t].resume();
    }
},
Stage.recreateAll = function ()
{
    for (var t = 0; t < this.instances.length; t++) {
        this.instances[t] && this.instances[t].recreateCanvas();
    }
},
Stage.redrawAll = function ()
{
    for (var t = 0; t < this.instances.length; t++) {
        this.instances[t] && this.instances[t].drawCurrentFrame();
    }
},
Stage.prototype.start = function ()
{
    this.width = this.canvas.width, this.height = this.canvas.height, this.attachHandlers(), this.time = 0, 
    this.requestId = 0, this.resume();
},
Stage.prototype.attachHandlers = function ()
{
    function t(t)
    {
        if (!i.onPause)
        {
            var e = t.type, n = t.changedTouches[0], s = i.getCanvasCoordinates(n.pageX, n.pageY);
            i.root.handleTouch(e, s.x, s.y, n.identifier), "touchstart" == e && navigator.userAgent.match(/Android/i) && t.preventDefault()
        }
    }
    function e(t)
    {
        if (!i.onPause)
        {
            var e = i.fromMouseToTouch[t.type], n = i.getCanvasCoordinates(t.pageX, t.pageY);
            i.root.handleTouch(e, n.x, n.y, 0)
        }
    }
    var i = this;
    "ontouchstart"in window ? (this.canvas.addEventListener("touchstart", t), this.canvas.addEventListener("touchend", 
    t), this.canvas.addEventListener("touchcancel", t), this.canvas.addEventListener("touchleave", t), 
    this.canvas.addEventListener("touchmove", t)) : (this.canvas.addEventListener("mousemove", e), this.canvas.addEventListener("mousedown", 
    e), this.canvas.addEventListener("mouseup", e), this.canvas.addEventListener("mouseleave", e))
},
Stage.prototype.pause = function ()
{
    this.onPause || (this.onPause = true, this.requestId && window["cancelAnimationFrame"](this.requestId), 
    !this.dontPauseSound && sound.pause());
},
Stage.prototype.resume = function ()
{
    this.onPause && (this.onPause = false, this.realTime = (new Date).getTime(), this.newFrame(), !this.dontPauseSound && sound.resume());
},
Stage.prototype.recreateCanvas = function ()
{
    var t = document.createElement("canvas"), e = this.canvas;
    $(e).before(t), t.width = e.width, t.height = e.height, $(e).remove(), t.id = e.id, $(t).attr("class", 
    $(e).attr("class") || ""), this.canvas = t, this.context = this.canvas.getContext("2d"), this.attachHandlers();
},
Stage.prototype.stop = function ()
{
    this.pause(), this.time = 0;
},
Stage.prototype.unregisterInstance = function ()
{
    for (var t = 0; t < Stage.instances.length; t++) {
        if (Stage.instances[t] == this) {
            return void Stage.instances.splice(t, 1);
        }
    }
},
Stage.prototype.newFrame = function ()
{
    if (this.requestId = 0, !this.onPause && (this.requestId = window["requestAnimationFrame"](this.newFrame.bind(this)), 
    this.now = (new Date).getTime(), this.delta = this.now - this.then, this.delta > this.interval))
    {
        var t = (new Date).getTime(), e = new GameEvent(GameEvent.ENTER_FRAME);
        e.deltaTime = Math.ceil((t - this.realTime) * this.playbackRate), this.deltaTime = e.deltaTime, 
        this.time += e.deltaTime, this.realTime = t, this.dispatchEvent(e), this.drawCurrentFrame(), this.then = this.now - this.delta % this.interval;
    }
},
Stage.prototype.drawCurrentFrame = function ()
{
    this.context.clearRect(0, 0, this.width, this.height), this.root.draw(this.context)
},
Stage.prototype.onResize = function (t)
{
    this.dispatchEvent(t)
},
Stage.prototype.getCanvasCoordinates = function (t, e)
{
    var i = this.canvas.getBoundingClientRect(), n = i.width / this.canvas.width;
    return t = Math.round((t - i.left) / n), e = Math.round((e - i.top - window.scrollY) / n), 
    {
        x : t, y : e
    }
},
window["requestAnimationFrame"] = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || function (t)
{
    return setTimeout(t, 0);
},
window["cancelAnimationFrame"] = window["cancelAnimationFrame"] || window["mozCancelAnimationFrame"] || window["oCancelAnimationFrame"] || window["msCancelAnimationFrame"] || window["webkitCancelAnimationFrame"] || clearTimeout;
var stage;
Connection.prototype = Object.create(EventDispatcher.prototype), Connection.prototype.constructor = Connection, 
Connection.prototype.init = function ()
{
    this.reset(), this.timeout = gameConfig.timeOut, this.attempts = gameConfig.timeOutAttempts, this.longWaitTimeout = gameConfig.longWaitTimeout || 1500;
},
Connection.prototype.reset = function ()
{
    this.session = String(gameConfig.session || "") || null, this.queue = [], this.message = null, this.currentRequest && (this.currentRequest.abort(), 
    this.currentRequest = null), this.syncTimeout && (clearTimeout(this.syncTimeout), this.syncTimeout = null), 
    this.clearLongWaitTimer();
},
Connection.prototype.createMessage = function (t)
{
    var e = $("<client/>");
    return this.session && e.attr("session", this.session), e.attr("rnd", getRandom()), e.attr("command", 
    t), clientData.giftspinsActive && e.append($("<gift2-spins/>").attr({
        id : clientData.giftspinId
    })), e
},
Connection.prototype.send = function (t)
{
    this.queue.push(t), this.message || this.doSend()
},
Connection.prototype.retry = function ()
{
    this.message || this.doSend()
},
Connection.prototype.doSend = function ()
{
    var t = this, e = gameConfig.server_url + "&r=" + getRandom(), i = 1;
    this.message = this.queue.shift(), gameConfig.hideServerLogs || logger.log(Logger.REQUEST, this.message[0].outerHTML), 
    function n()
    {
        t.clearLongWaitTimer(), t.longWaitTimer = setTimeout(t.onLongWaitResponse.bind(t), t.longWaitTimeout);
        var s = $("<div></div>").append(t.message), o = (new Date).getTime();
        this.currentRequest = $.ajax({
            type : "POST", url : e, data : s.html(), dataType : "text", timeout : t.timeout
        }).done(function (e)
        {
            t.done(e)
        }).fail(function (e, s)
        {
            if (i++< t.attempts) {
                var a = t.timeout - ((new Date).getTime() - o);
                "timeout" != s && a > 0 ? setTimeout(n, a) : n()
            }
            else {
                t.error();
            }
        })
    }
    ()
},
Connection.prototype.done = function (t)
{
    if (this.clearLongWaitTimer(), t)
    {
        gameConfig.hideServerLogs || logger.log(Logger.RESPONSE, t), t = $(t), t.attr("command", this.message.attr("command")), 
        this.message = null, "sync" == t.attr("command").toLowerCase() && (this.syncTimeout = setTimeout(this.sendSync.bind(this), 
        this.syncTime));
        var e = new GameEvent(GameEvent.RESPONSE);
        e.response = t, this.dispatchEvent(e), this.queue.length > 0 && !this.message && this.doSend()
    }
    else {
        this.error();
    }
},
Connection.prototype.error = function (t)
{
    gameConfig.performRetry ? (this.queue.unshift(this.message), this.message = null) : this.reset(), 
    this.dispatchEvent(new GameEvent(GameEvent.ERROR));
},
Connection.prototype.sendSync = function ()
{
    var t = this.createMessage("sync");
    this.send(t)
},
Connection.prototype.clearLongWaitTimer = function ()
{
    this.longWaitTimer && (clearTimeout(this.longWaitTimer), this.longWaitTimer = null);
},
Connection.prototype.onLongWaitResponse = function ()
{
    this.clearLongWaitTimer(), this.dispatchEvent(new GameEvent(GameEvent.LONG_WAIT_RESPONSE))
};
var connection = new Connection;
ServerData.prototype = Object.create(EventDispatcher.prototype), ServerData.prototype.constructor = ServerData, 
ServerData.prototype.defaultData = {}, ServerData.prototype.defaultData.currency = null, ServerData.prototype.defaultData.balance = 0, 
ServerData.prototype.defaultData.status = "bet", ServerData.prototype.defaultData.restored = false, ServerData.prototype.defaultData.coins = null, 
ServerData.prototype.defaultData.defaultBet = null, ServerData.prototype.defaultData.userId = null, ServerData.prototype.start = function ()
{
    for (var t in this.defaultData)
    {
        this.defaultData[t]instanceof Array ? this [t] = this.defaultData[t].slice() : this [t] = this.defaultData[t];
    }
    connection.removeEventListener(GameEvent.RESPONSE, this.onResponse, this), connection.addEventListener(GameEvent.RESPONSE, 
    this.onResponse, this)
},
ServerData.prototype.addParser = function (t, e)
{
    if ("string" != typeof t && !(t instanceof RegExp))
    {
        throw new Error("ServerData::addParser Wrong type of command. Should be String or RegExp.");
    }
    if (!(e instanceof Function)) {
        throw new Error("ServerData::addParser Wrong type of parser. Should be Function.");
    }
    this.parsers.push({
        command : t, parser : e, type : "parse"
    })
},
ServerData.prototype.addErrorParser = function (t, e)
{
    if ("string" != typeof t && !(t instanceof RegExp))
    {
        throw new Error("ServerData::addErrorParser Wrong type of command. Should be String or RegExp.");
    }
    if (!(e instanceof Function)) {
        throw new Error("ServerData::addErrorParser Wrong type of parser. Should be Function.");
    }
    this.parsers.push({
        command : t, parser : e, type : "error"
    })
},
ServerData.prototype.onResponse = function (t)
{
    var e = t.response, i = e.attr("command"), n = e.attr("status");
    switch (i.toLowerCase()) {
        case "sync":
        case "pool":
            break;
        case "test":
            n = "ok";
            break;
        default:
            this.status = n
    }
    try
    {
        for (var s = 0; s < this.parsers.length; s++)
        {
            var o = this.parsers[s].command, a = this.parsers[s].parser, r = this.parsers[s].type;
            if (o instanceof RegExp && o.test(i) || o === i)
            {
                var l = "error" == n || "exit" == n || "fail" == n || "sessionlost" == n || "excess" == n || "wrongbet" == n;
                ("error" == r && l || "parse" == r && !l) && a.call(this, e)
            }
        }
    }
    catch (h) {
        throw new Error("Response parsing failed.")
    }
    var u = new GameEvent(GameEvent.UPDATE);
    u.response = e, this.dispatchEvent(u);
},
ServerData.prototype.parseCurrency = function (t)
{
    this.currency = t.find("[currency-id]").attr("currency-id");
},
ServerData.prototype.parseNewBalance = function (t)
{
    if (t.find(">user_new").length > 0)
    {
        this.balance = Number(t.find(">user_new").attr("cash"));
        var e = new GameEvent(GameEvent.CASH);
        e.sync = "sync" == t.attr("command"), this.dispatchEvent(e);
    }
},
ServerData.prototype.sendShiftCombinations = function (t)
{
    var e = this.createShiftMessage(t);
    connection.send(e)
},
ServerData.prototype.createShiftMessage = function (t)
{
    throw new Error("Should be implemented")
},
ServerData.prototype.sendTest = function ()
{
    var t = connection.createMessage("test");
    connection.send(t)
},
ServerData.prototype.sendConnect = function ()
{
    var t = connection.createMessage("connect");
    t.attr("playerguid", gameConfig.guid || "TEST1000"), t.attr("lang", "en"), t.attr("verid", "WIN 11,7,700,202"), 
    t.attr("gameid", gameConfig.name), gameConfig.wl && t.attr("wl", gameConfig.wl), gameConfig.noGiftSpins || slotConfig.noGiftSpins || t.append('<gift version="1.5"/>'), 
    connection.send(t), connection.sendSync()
},
ServerData.prototype.sendReconnect = function ()
{
    var t = connection.createMessage("reconnect");
    connection.send(t)
},
ServerData.prototype.sendLeave = function ()
{
    var t = connection.createMessage("leave");
    connection.send(t)
},
ServerData.prototype.sendStart = function ()
{
    var t = connection.createMessage("start");
    t.append('<game level="1" table="1" privacy="private"/><hc generate="1" game="all" />'), t.find("game").attr("id", 
    gameConfig.name), connection.send(t)
};
var serverData = new ServerData;
serverData.addParser("connect", function (t)
{
    gameConfig.loadConfig({
        session : connection.session = t.attr("session")
    }), this.userId = t.find("user").attr("id");
    var e = t.find("game");
    this.mode = 0 == e.length ? "start" : gameConfig.name == e.attr("name") ? "reconnect" : "leave", this.coins = t.find("extra stakeIncrement").text(), 
    this.defaultBet = t.find("extra defaultbet").text(), this.defaultBet ? slotConfig.defaultBet = this.defaultBet = parseInt(this.defaultBet, 
    10) : this.defaultBet = null, this.coins ? slotConfig.coins = this.coins = this.coins.split(",").map(Number) : this.coins = null;
}), serverData.addParser(/.+/, serverData.parseNewBalance), serverData.addErrorParser(/.+/, serverData.parseNewBalance), 
serverData.addErrorParser(/sync/, function (t)
{
    this.status = t.attr("status");
}), Locker.prototype.enter = function ()
{
    if (this.isLocked()) {
        throw new Error("Already locked");
    }
    this.locked = true;
},
Locker.prototype.exit = function ()
{
    this.locked = false;
},
Locker.prototype.isLocked = function ()
{
    return this.locked;
},
ClientData.prototype = Object.create(EventDispatcher.prototype), ClientData.prototype.constructor = ClientData, 
ClientData.prototype.defaultData = {}, ClientData.prototype.defaultData.microround = false, ClientData.prototype.defaultData.balance = 0, 
ClientData.prototype.defaultData.state = "init.start", ClientData.prototype.defaultData.actions = {},
ClientData.prototype.defaultData.action = "", ClientData.prototype.defaultData.display = "", ClientData.prototype.start = function ()
{
    this.data = $.extend(true, {}, this.defaultData), $.extend(true, this, this.defaultData), this.exitState(), 
    serverData.addEventListener(GameEvent.UPDATE, this.onServerResponse, this), this.onGiftsUpdate && serverData.addEventListener(GameEvent.GIFT_SPINS, 
    this.onGiftsUpdate, this), this.onGiftsSpinsAction && serverData.addEventListener(GameEvent.GIFT_SPINS_ACTION, 
    this.onGiftsSpinsAction, this), stage.addEventListener(GameEvent.ENTER_FRAME, function ()
    {
        this.updateActions(), this.diff()
    }, this)
},
ClientData.prototype.addTransition = function (t)
{
    var e = t.from;
    if (this.transitions[e] || (this.transitions[e] = {
        action : [], server : [], auto : []
    }), ["action", "server", "auto"].indexOf(t.type) ==- 1) throw new Error("Unknown type of transition.");
    var i = this.transitions[e][t.type];
    i.push(
    {
        id : t.to, guard : t.guard || function ()
        {
            return true;
        },
        priority : t.priority || 0, action : t.action, type : t.type, mixed : t.mixed || false, excess : t.excess || "", 
        error : t.error || "error.exit", fail : t.fail || "error.exit", sessionlost : t.sessionlost || "error.exit"
    }), i.sort(function (t, e)
    {
        return e.priority - t.priority;
    })
},
ClientData.prototype.removeTransition = function (t, e, i, n)
{
    var s = this.transitions[t];
    if (s)
    {
        var o = i ? [i] : ["action", "server", "auto"];
        o.forEach(function (t)
        {
            if (s[t])
            {
                var i = 0;
                while (i < s[t].length) {
                    e && s[t][i].id != e || n && s[t][i].action != n ? i++: s[t].splice(i, 1);
                }
            }
        })
    }
},
ClientData.prototype.notifyStateChangeListeners = function (t, e)
{
    for (var i = 0; i < this.transitionCallbacks.length; i++) if (this.transitionCallbacks[i].from.test(t) && this.transitionCallbacks[i].to.test(e))
    {
        var n = this.transitionCallbacks[i].callback, s = this.transitionCallbacks[i].context;
        n.call(s)
    }
},
ClientData.prototype.setTransitionCallback = function (t, e, i, n)
{
    var s = this.transitionCallbacks.find(function (i)
    {
        return i.from.source == t.source && i.to.source == e.source;
    });
    s && console.warn("Transition callback already defined at", t, e, "trying to redefine it with", i);
    for (var o = {
        from : t, to : e, callback : i, context : n || this
    },
    a = 0;
    a < this.transitionCallbacks.length;
    a++) if (this.transitionCallbacks[a].from.source == t.source && this.transitionCallbacks[a].to.source == e.source) return void (this.transitionCallbacks[a] = o);
    this.transitionCallbacks.push(o)
},
ClientData.prototype.updateActions = function ()
{
    var t = this.transitions[this.state].action;
    this.actions = {};
    for (var e = 0; e < t.length; e++) {
        t[e].action && t[e].guard() && (this.actions[t[e].action] = true);
    }
},
ClientData.prototype.sendRequest = function ()
{
    var t = this.transitions[this.state].server;
    if (t.length) {
        var e = t[0].action;
        e.call(serverData)
    }
},
ClientData.prototype.isActionAvailable = function (t)
{
    return Boolean(clientData.actions[t]);
},
ClientData.prototype.act = function (t)
{
    this.action = t;
    var e = function (e)
    {
        return e.action == t;
    },
    i = this.transitions[this.state].action.filter(e);
    this.handleTransition(i)
},
ClientData.prototype.exitState = function ()
{
    this.haveClientResponse = true, this.transitions[this.state].server.length > 0 && this.haveServerResponse ? this.handleServerTransition() : this.handleTransition(this.transitions[this.state].auto);
},
ClientData.prototype.onServerResponse = function (t)
{
    var e = t.response ? t.response.attr("command").toLowerCase() : "stub";
    "sync" == e ? "sessionlost" == serverData.status ? this.handleTransition([ {
        id : "error.exit", type : "server.sessionlost",
        guard : function ()
        {
            return true;
        }
    }]) : clientData.microround || (this.balance = serverData.balance, this.diff()) : "pool" != e && "shifter" != e && (this.haveServerResponse = true, 
    this.transitions[this.state].server[0] || logger.warn("ClientData.onServerResponse: WARNING No server transition."), 
    !this.transitions[this.state].server[0] || this.transitions[this.state].server[0].mixed && !this.haveClientResponse || this.handleServerTransition());
},
ClientData.prototype.handleServerTransition = function ()
{
    var t = this.transitions[this.state].server[0];
    "excess" == serverData.status ? this.handleTransition([ {
        id : t.excess, type : "server.excess",
        guard : function ()
        {
            return true;
        }
    }]) : "error" == serverData.status || "exit" == serverData.status || "wrongbet" == serverData.status ? this.handleTransition([ {
        id : t.error, type : "server.error",
        guard : function ()
        {
            return true;
        }
    }]) : "fail" == serverData.status ? this.handleTransition([ {
        id : t.fail, type : "server.fail",
        guard : function ()
        {
            return true;
        }
    }]) : "sessionlost" == serverData.status ? this.handleTransition([ {
        id : t.sessionlost, type : "server.sessionlost",
        guard : function ()
        {
            return true;
        }
    }]) : this.handleTransition(this.transitions[this.state].server)
},
ClientData.prototype.handleTransition = function (t)
{
    if (this.transitionLocker.isLocked()) {
        this.delayedTransitions = t;
    }
    else
    {
        for (var e = 0; e < t.length; e++)
        {
            if (this.doTransition(t[e]))
            {
                return void (this.delayedTransitions && (t = this.delayedTransitions, this.delayedTransitions = null, 
                this.handleTransition(t)));
            };
        }
    }
},
ClientData.prototype.doTransition = function (t)
{
    if (t.guard.call(this))
    {
        this.transitionLocker.enter(), this.dispatchEvent(new GameEvent(GameEvent.EXIT_STATE));
        var e = this.state, i = t.id;
        return this.state = i, this.haveClientResponse = false, this.haveServerResponse = false, this.sendRequest(), 
        this.notifyStateChangeListeners(e, i), this.updateActions(), logger.info("%c " + e + " %c => %c " + i + " %c type=%c " + t.type + " ", 
        "background: #f88; color: #000;", "background: #fff; color: #000;", "background: #8f8; color: #000;", 
        "background: #fff; color: #000;", "background: #88f; color: #fff;"), this.diff(), this.dispatchEvent(new GameEvent(GameEvent.ENTER_STATE)), 
        this.transitionLocker.exit(), true
    }
    return false;
},
ClientData.prototype.diff = function ()
{
    if (this.diffLocker.isLocked()) {
        throw new Error("Unexpected call of diff inside other diff");
    }
    gameConfig.useExternalBalance && (this.balance = h5game.getBalance());
    var t = {};
    for (var e in this.data) if (this.data[e]instanceof Array)
    {
        for (var i = this.data[e], n = this [e], s = Math.max(i.length, n.length), o = 0; o < s; o++) if (i[o] != n[o]) {
            t[e] = i, this.data[e] = n;
            break
        }
    }
    else if (this.data[e]instanceof Object)
    {
        for (var a = this.data[e], r = this [e], l = Object.keys(a).concat(Object.keys(r)), o = 0; o < l.length; o++) {
            var h = l[o];
            if (a[h] != r[h]) {
                t[e] = a, this.data[e] = r;
                break 
            }
        }
    }
    else {
        this.data[e] != this [e] && (t[e] = this.data[e], this.data[e] = this [e]);
    }
    if (Object.keys(t).length > 0)
    {
        this.diffLocker.enter();
        var u = new GameEvent(GameEvent.UPDATE);
        u.diff = t, this.dispatchEvent(u), this.diffLocker.exit();
    }
},
ClientData.prototype.switchDisplay = function (t)
{
    this.display = t, this.diff();
};
var clientData = new ClientData;
clientData.addTransition({
    from : "init.start", to : "init.test", type : "auto"
}), clientData.addTransition({
    from : "init.test", to : "init.connect", type : "server", action : serverData.sendTest
}), clientData.addTransition({
    from : "init.connect", to : "init.session", type : "server", action : serverData.sendConnect
}), clientData.addTransition(
{
    from : "init.session", to : "init.start", type : "auto",
    guard : function ()
    {
        return "start" == serverData.mode;
    }
}), clientData.addTransition(
{
    from : "init.session", to : "init.reconnect", type : "auto",
    guard : function ()
    {
        return "reconnect" == serverData.mode;
    }
}), clientData.addTransition(
{
    from : "init.session", to : "init.leave", type : "auto",
    guard : function ()
    {
        return "leave" == serverData.mode;
    }
}), clientData.addTransition(
{
    from : "init.reconnect", to : "init.ready", type : "server", action : serverData.sendReconnect
}), clientData.addTransition({
    from : "init.leave", to : "init.start", type : "server", action : serverData.sendLeave
}), clientData.addTransition({
    from : "init.start", to : "init.ready", type : "server", action : serverData.sendStart
}), clientData.addTransition({
    from : "init.ready", to : "init", type : "action", action : "start"
}), clientData.addTransition({
    from : "error.exit", to : "", type : "auto"
}), clientData.addEventListener(GameEvent.ENTER_STATE, function ()
{
    "init.session" != clientData.state && "init" != clientData.state || clientData.exitState(), "error.exit" == clientData.state && connection.reset()
}), StateController.prototype = Object.create(EventDispatcher.prototype), StateController.prototype.constructor = StateController, 
StateController.prototype.activate = function ()
{
    return clientData.addEventListener(GameEvent.ENTER_STATE, function (t)
    {
        clientData.state == this.state && this.start()
    }, this), clientData.addEventListener(GameEvent.EXIT_STATE, function (t)
    {
        clientData.state == this.state ? this.stop(true) : "init" == clientData.state && this.onInit()
    }, this), this
},
StateController.prototype.start = function ()
{
    this.started || (this.startTime = stage.time, this.started = true, stage.addEventListener(GameEvent.ENTER_FRAME, 
    this.onEnterFrameWrapper, this), this.onStart());
},
StateController.prototype.stop = function (t)
{
    this.started && (this.startTime = 0, this.started = false, stage.removeEventListener(GameEvent.ENTER_FRAME, 
    this.onEnterFrameWrapper, this), "init" != clientData.state && this.onStop(), this.dispatchEvent(new GameEvent(GameEvent.COMPLETE)), 
    t || clientData.exitState());
},
StateController.prototype.hasElapsedTimeStamp = function (t)
{
    return stage.time - stage.deltaTime - this.startTime < t && stage.time - this.startTime >= t;
},
StateController.prototype.onEnterFrameWrapper = function (t)
{
    this.onEnterFrame(t)
},
StateController.prototype.onInit = function () {}, StateController.prototype.onStart = function () {},
StateController.prototype.onStop = function () {}, StateController.prototype.onEnterFrame = function (t) {},
TextField.prototype = $.extend(new DisplayObject, 
{
    setId : function (t)
    {
        if (this.id !== t)
        {
            this.id = t;
            var e = locale.getStringElement("game", this.id);
            if (0 == e.length) {
                throw new Error("String with id " + t + " not found.");
            }
            this.parseXml(e[0])
        }
    },
    performDraw : function (t)
    {
        this.buffer ? t.drawImage(imageLoader.get(this.buffer.image), this.buffer.x, this.buffer.y) : this.drawText(t)
    },
    drawText : function (t)
    {
        for (var e = 0; e < this.lines.length; e++)
        {
            var i = this.lines[e], n = this.getLineHeight(i) + i.n;
            t.translate(0, n);
            for (var s = 0; s < i.length; s++) for (var o = i[s], a = this.getAlignedLineWidth(o, t), 
            r = "left" == o[0].align ? o[0].lSide : "right" == o[0].align ? o[0].rSide - a : (o[0].lSide + o[0].rSide - a) / 2, 
            l = 0;
            l < o.length;
            l++)
            {
                var h = o[l];
                if (h instanceof TextFieldObject)
                {
                    r += h.leftMargin;
                    var u = this.objects[h.id];
                    u && (t.save(), t.translate(r, - n), u.draw(t), t.restore(), r += u.width * u.scaleX), 
                    r += h.rightMargin
                }
                else
                {
                    var d = h.text.substituteTokens(this.tokens);
                    if (t.font = (h.bold ? "bold " : "") + (h.italic ? "italic " : "") + h.size + "px " + h.font, 
                    t.fillStyle = this.colorOverlap || h.color, t.lineJoin = "round", h.stroke) for (var c = h.stroke.split(","), 
                    p = c.length - 1;
                    p >= 0;
                    p--)
                    {
                        var m = c[p];
                        t.strokeStyle = m.split(" ")[0], t.lineWidth = parseInt(m.split(" ")[1], 10), 
                        t.strokeText(d, r, h.dy || 0)
                    }
                    t.fillText(d, r, h.dy || 0), a = t.measureText(d).width, h.underline && (t.lineWidth = Math.min(Math.floor(h.size / 10), 
                    3), t.strokeStyle = h.color, t.beginPath(), t.moveTo(r, h.underline), t.lineTo(r + a, 
                    h.underline), t.stroke()), r += a;
                }
            }
        }
    },
    getRect : function ()
    {
        for (var t = 0, e = 0, i = 0, n = 0, s = 0; s < this.lines.length; s++)
        {
            var o = this.lines[s];
            n += this.getLineHeight(o) * (s == this.lines.length - 1 ? 1.3 : 1) + o.n;
            for (var a = 0; a < o.length; a++)
            {
                var r = o[a], l = this.getAlignedLineWidth(r), h = "left" == r[0].align ? r[0].lSide : "right" == r[0].align ? r[0].rSide - l : (r[0].lSide + r[0].rSide - l) / 2;
                t = Math.min(t, h), i = Math.max(i, h + l);
            }
        }
        return {
            x : t - 3, y : e, width : i - t + 6, height : n - e
        }
    },
    getLineHeight : function (t)
    {
        for (var e = 0, i = 0; i < t.length; i++)
        {
            for (var n = t[i], s = 0; s < n.length; s++)
            {
                e = Math.max(n[s]instanceof TextFieldObject ? this.objects[n[s].id] ? this.objects[n[s].id].height * this.objects[n[s].id].scaleY : 0 : n[s].size, 
                e);
            }
        }
        return e;
    },
    getAlignedLineWidth : function (t)
    {
        for (var e = 0, i = (this.stage || stage).context, n = 0; n < t.length; n++)
        {
            var s = t[n];
            if (s instanceof TextFieldObject) {
                var o = this.objects[s.id];
                e += (o ? o.width * o.scaleX : 0) + s.leftMargin + s.rightMargin
            }
            else
            {
                var a = s.text.substituteTokens(this.tokens);
                i.font = (s.bold ? "bold " : "") + (s.italic ? "italic " : "") + s.size + "px " + s.font, 
                e += i.measureText(a).width
            }
        }
        return e;
    },
    setAttributes : function (t, e)
    {
        function i(t)
        {
            return true === t || false !== t && "true" === t
        }
        t.font = e.attr("font") || t.font, t.bold = i(e.attr("bold") || t.bold), t.italic = i(e.attr("italic") || t.italic), 
        t.color = e.attr("color") || t.color, t.stroke = e.attr("stroke") || t.stroke, t.size = parseInt(e.attr("size") || t.size, 
        10), t.align = e.attr("align") || t.align, t.lSide = parseInt(e[0].getAttribute("lSide") || t.lSide, 
        10), t.rSide = parseInt(e[0].getAttribute("rSide") || t.rSide, 10), t.lineSpacing = parseInt(e[0].getAttribute("lineSpacing") || t.lineSpacing, 
        10), t.dx = parseInt(e.attr("dx") || t.dx, 10), t.dy = parseInt(e.attr("dy") || t.dy, 10), t.underline = parseInt(e.attr("underline") || t.underline, 
        10);
    },
    parseXml : function (t)
    {
        this.lines = [];
        var e = 
        {
            font : "Arial", bold : false, italic : false, color : "#000000", stroke : "", size : 10, align : "left", 
            rSide : 0, lSide : 0, lineSpacing : 0, dx : 0, dy : 0, underline : 0
        };
        if (this.parseNode(t, e), isNaN(parseInt($(t).attr("x"), 10)) || (this.x = parseInt($(t).attr("x"), 
        10)), isNaN(parseInt($(t).attr("y"), 10)) || (this.y = parseInt($(t).attr("y"), 10)), "true" == $(t).attr("static") ? this._static = true : "false" == $(t).attr("static") && (this._static = false), 
        this._static)
        {
            var i = this.getRect(), n = imageLoader.createBuffer(i.width, i.height), s = n.getContext("2d");
            s.translate(-i.x, - i.y), this.drawText(s), this.buffer = {
                image : imageLoader.add(n), x : i.x, y : i.y
            }
        }
    },
    parseNode : function (t, e)
    {
        var i = 3, n = 1;
        if (t.nodeType == i)
        {
            for (var s = $(t).text().split("\n"), o = 0; o < s.length; o++) {
                this.addFormatLine(s[o], e), o != s.length - 1 && this.addLine(e.lineSpacing);
            }
        }
        else if (t.nodeType == n && "n" == t.nodeName.toLowerCase()) {
            this.addLine(parseInt($(t).attr("y") || 0, 10) + e.lineSpacing);
        }
        else if (t.nodeType == n && "object" == t.nodeName.toLowerCase())
        {
            var a = $(t).attr("id");
            if (a)
            {
                var r = new TextFieldObject(a, parseInt($(t).attr("leftMargin") || 0, 10), parseInt($(t).attr("rightMargin") || 0, 
                10));
                this.addFormatLine(r, e)
            }
        }
        else if (t.nodeType == n && "string" == t.nodeName.toLowerCase())
        {
            e = $.extend({}, e), this.setAttributes(e, $(t));
            for (var l = 0; l < $(t).contents().length; l++) {
                var h = $(t).contents()[l];
                this.parseNode(h, e)
            }
        }
    },
    addFormatLine : function (t, e)
    {
        this.lines.length || this.addLine();
        var i = this.lines.last(), n = i.last();
        i.length && (!n || n[0].align == e.align && n[0].lSide == e.lSide && n[0].rSide == e.rSide) || (n = [], 
        i.push(n)), t instanceof TextFieldObject ? (n.push($.extend({
            text : ""
        }, e)), n.push(t)) : n.push($.extend({
            text : t
        }, e))
    },
    addLine : function (t)
    {
        var e = [];
        e.n = t || 0, this.lines.push(e);
    },
    setObject : function (t, e)
    {
        this.objects[t] = e;
    }
}), TextField.getText = function (t)
{
    return locale.getText("game", t);
},
ProgressBar.prototype = Object.create(DisplayObject.prototype), ProgressBar.prototype.constructor = ProgressBar, 
ProgressBar.prototype.performDraw = function (t)
{
    if (this.backgroundImage && t.drawImage(this.backgroundImage, 0, 0, this.backgroundImage.width, this.backgroundImage.height, 
    0, 0, this.backgroundImage.width * Sprite.prototype.scaleFactor, this.backgroundImage.height * Sprite.prototype.scaleFactor), 
    this.lineImage)
    {
        var e = Math.max(Math.round(this.lineImage.width * this.progress), 1), i = this.lineImage.height;
        t.drawImage(this.lineImage, 0, 0, e, i, this.linePosition.x, this.linePosition.y, e * Sprite.prototype.scaleFactor, 
        i * Sprite.prototype.scaleFactor)
    }
    this.percents && (this.percents.stage = this.stage, this.percents.tokens["value"] = Math.round(100 * this.progress), 
    this.percents.draw(t));
},
Preloader.prototype = Object.create(DisplayObjectContainer.prototype), Preloader.prototype.constructor = Preloader, 
Preloader.CORE = 0, Preloader.GAME_DATA = 1, Preloader.CONNECTION = 2, Preloader.prototype.getResourceList = function ()
{
    return [];
},
Preloader.prototype.prepare = function () {}, Preloader.prototype.start = function ()
{
    this.prepare(), this.stage.disabled = false, this.stage.start();
},
Preloader.prototype.stop = function ()
{
    this.stage.stop(), this.stage.disabled = true;
},
Preloader.prototype.setProgress = function (t, e)
{
    switch (e)
    {
        case Preloader.CORE:
            t *= .1;
            break;
        case Preloader.GAME_DATA:
            t = .1 + .7 * t;
            break;
        case Preloader.CONNECTION:
            t = .8 + .2 * t
    }
    if (this.progressBar.progress != t)
    {
        this.progressBar.progress = t;
        var i = new GameEvent(GameEvent.PROGRESS);
        i.progress = t, this.dispatchEvent(i);
    }
},
Preloader.prototype.customAfterLoadActions = function () {};
var preloader, currencyFormatter = function ()
{
    function t()
    {
        var t = a[serverData.currency || "USD"] || {
            symbol : "", name : ""
        },
        e = gameConfig.currency ? gameConfig.currency[serverData.currency || "USD"] : null;
        e && gameConfig.loadConfig(e), m = t.denum || (isNaN(gameConfig.denum) ? 100 : parseInt(gameConfig.denum, 
        10)), u = Boolean(void 0 != t.useCurrencySymbol ? t.useCurrencySymbol : gameConfig.useCurrencySymbol), 
        d = Boolean(void 0 != t.useCurrencyName ? t.useCurrencyName : gameConfig.useCurrencyName), v = gameConfig.cutMoneyFractional, 
        C = gameConfig.cutMoneyZeroFractional, void 0 != t.fullFormat && (g = t.fullFormat), void 0 != t.shortFormat && (b = t.shortFormat), 
        f = u ? t.symbol : d ? t.name : "", c = String(t.decimalSeparator || gameConfig.decimalSeparator || "."), 
        p = String(t.groupingSeparator || gameConfig.groupingSeparator || "")
    }
    function e(t, e)
    {
        var n = false, s = "", a = Math.abs(t), r, l, h, u = "", d = "";
        return e.indexOf("a") > -1 && (a < Math.pow(10, 12) && a >= Math.pow(10, 9) ? (s += o.billion, 
        t /= Math.pow(10, 9)) : a < Math.pow(10, 9) && a >= Math.pow(10, 6) ? (s += o.million, t /= Math.pow(10, 
        6)) : a < Math.pow(10, 6) && a >= Math.pow(10, 3) && (s += o.thousand, t /= Math.pow(10, 3))), 
        e.indexOf("k") > -1 && (s += o.thousand, t /= Math.pow(10, 3)), e.indexOf("[.]") > -1 && (n = true, 
        e = e.replace("[.]", c)), l = t.toString().split(".")[0], h = e.split(".")[1], r = e.indexOf(","), 
        h ? (h.indexOf("[") > -1 ? (h = h.replace("]", ""), h = h.split("["), d = i(t, h[0].length + h[1].length, 
        h[1].length)) : d = i(t, h.length), l = d.split(".")[0], d.split(".")[1].length ? (u = c, d = d.split(".")[1]) : d = "", 
        n && 0 === Number(d.slice(1)) && (d = "")) : l = i(t, 0), r > -1 && (l = l.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, 
        "$1" + p)), 0 === e.indexOf(".") && (l = ""), {
            intPart : l, fracPart : d, abbr : s || "", delimiter : u
        }
    }
    function i(t, e, i)
    {
        var n = Math.pow(10, e), s, o;
        return o = (Math.round(t * n) / n).toFixed(e), i && (s = new RegExp("0{1," + i + "}$"), o = o.replace(s, 
        "")), o
    }
    function n(t)
    {
        if (gameConfig.big_money_format) {
            var i = e(Math.floor(t / 100), y);
            return f + i.intPart + i.delimiter + i.fracPart + i.abbr
        }
        if (100 == m)
        {
            var i = e(t / 100, g);
            return f + i.intPart + (!v || v && C &&/[1-9]+/.test(i.fracPart) ? i.delimiter + i.fracPart : "")
        }
        return f + String(t)
    }
    function s(t)
    {
        var i = e(t / m, b);
        return i.intPart = f + i.intPart, i
    }
    var o = {
        thousand : "k", million : "M", billion : "B"
    },
    a = 
    {
        EUR : {
            symbol : "€", name : "€"
        },
        USD : {
            symbol : "$", name : "$"
        },
        TRY : {
            symbol : "₺", name : "₺"
        },
        GBP : {
            symbol : "£", name : "P"
        },
        RUB : {
            symbol : "₽", name : "R"
        },
        CHF : {
            symbol : "₣", name : "₣"
        },
        CAD : {
            symbol : "C$", name : "$"
        },
        AUD : {
            symbol : "$", name : "$"
        },
        UAH : {
            symbol : "₴", name : "H"
        },
        PLN : {
            symbol : "zł", name : "zł"
        },
        NOK : {
            symbol : "kr", name : "kr"
        },
        CZK : {
            symbol : "Kč", name : "Kč"
        },
        SIT : {
            symbol : "SIT ", name : "SIT "
        },
        SEK : {
            symbol : "kr", name : "kr"
        },
        NGN : {
            symbol : "₦", name : "₦"
        },
        LBP : {
            symbol : "ل.ل", name : "P"
        },
        GEL : {
            symbol : "ლ", name : "G"
        },
        CNY : {
            symbol : "¥", name : "Y"
        },
        JPY : {
            symbol : "¥", name : "Y"
        },
        TL : {
            symbol : "₺", name : "L"
        },
        KZT : {
            symbol : "₸", name : "₸"
        },
        KRW : {
            symbol : "원", name : "원"
        },
        IRR : {
            symbol : "﷼", name : "﷼"
        },
        GHS : {
            symbol : "₵", name : "₵"
        },
        BTC : {
            symbol : "Ƀ", name : "Ƀ"
        },
        VND : {
            symbol : "₫", name : "₫"
        },
        VEF : {
            symbol : "Bs", name : "Bs"
        },
        UGX : {
            symbol : "USh", name : "USh"
        },
        TMT : {
            symbol : "m", name : "m"
        },
        TJS : {
            symbol : "S", name : "S"
        },
        SGD : {
            symbol : "S$", name : "S$"
        },
        RSD : {
            symbol : "din.", name : "din."
        },
        LVL : {
            symbol : "Ls", name : "Ls"
        },
        LTL : {
            symbol : "Lt", name : "Lt"
        },
        MDL : {
            symbol : "L", name : "L"
        },
        MYR : {
            symbol : "RM", name : "RM"
        },
        HUF : {
            symbol : "Ft", name : "Ft"
        },
        IDR : {
            symbol : "Rp", name : "Rp"
        },
        KGS : {
            symbol : "Som", name : "Som"
        },
        CFA : {
            symbol : "FCFA", name : "FCFA"
        },
        BYR : {
            symbol : "Br", name : "Br"
        },
        BRL : {
            symbol : "$", name : "$"
        },
        AZN : {
            symbol : "₼", name : "₼"
        },
        AMD : {
            symbol : "֏", name : "֏"
        },
        PNT : 
        {
            symbol : "", name : "", denum : 100, decimalSeparator : "", groupingSeparator : "", useCurrencySymbol : false, 
            useCurrencyName : false, fullFormat : "0", shortFormat : "0a"
        }
    },
    r = "0,0.00", l = "0,0.[000]k", h = "0.[00]a", u, d, c, p, m = 100, f, g = r, b = h, y = l, v = false, 
    C = false;
    return {
        abbreviations : o, init : t, format : n, getShortCurrencyFormat : s,
        formatShortCurrencyString : function (t)
        {
            var e = s(t);
            return e.intPart + e.delimiter + e.fracPart + e.abbr;
        }
    }
}();
Game.MAIN = "main", Game.prototype = Object.create(DisplayObjectContainer.prototype), Game.prototype.constructor = Game, 
Game.prototype.start = function ()
{
    this.stage || (this.stage = stage), this.stage.disabled = false, this.stage.start("game"), this.stage.root.addChild(this), 
    this.dispatchEvent(new GameEvent(GameEvent.INIT)), this.init(), this.dispatchEvent(new GameEvent(GameEvent.INIT_COMPLETE)), 
    clientData.act("start"), gameConfig.loaded = true;
},
Game.prototype.pause = function ()
{
    this.stage.disabled = true, this.stage.pause();
},
Game.prototype.resume = function ()
{
    this.stage.disabled = false, this.stage.resume();
},
Game.prototype.init = function () {}, Game.prototype.getMainResourceList = function ()
{
    return [];
},
Game.prototype.playSoundByWinComb = function () {}, Game.prototype.settingsButtonPermitted = function ()
{
    return false;
};
var game = new Game, getRandom = function ()
{
    var t = 0;
    return function ()
    {
        var e = (new Date).getTime();
        return t = e <= t ? t + 1 : e;
    }
}();
Tween.POW = function (t, e, i, n, s)
{
    return t /= n, s = s || 1, e + i * (s >= 0 ? Math.pow(t, s) : 1 - Math.pow(1 - t, - s));
},
Tween.OUT_QUAD = function (t, e, i, n)
{
    return t /= n, - i * t * (t - 2) + e;
},
Tween.IN_QUINT = function (t, e, i, n)
{
    return t /= n, i * t * t * t * t * t + e;
},
Tween.OUT_QUINT = function (t, e, i, n)
{
    return t /= n, t--, i * (t * t * t * t * t + 1) + e;
},
Tween.OUT_QUART = function (t, e, i, n)
{
    return t /= n, t--, - i * (t * t * t * t - 1) + e;
},
Tween.OUT_CUBIC = function (t, e, i, n)
{
    return t /= n, t--, i * (t * t * t + 1) + e;
},
Tween.OUT_SINE = function (t, e, i, n)
{
    return i * Math.sin(t / n * (Math.PI / 2)) + e;
},
Tween.OUT_EXPO = function (t, e, i, n)
{
    return i * (-Math.pow(2, - 10 * t / n) + 1) + e;
},
Tween.OUT_CIRC = function (t, e, i, n)
{
    return t /= n, t--, i * Math.sqrt(1 - t * t) + e;
},
Tween.JUMP = function (t, e, i, n)
{
    return t == n ? e + i : e;
},
Tween.SCALE_FUNC = function (t, e)
{
    t.scaleX = e, t.scaleY = e;
},
Tween.SCALEX_FUNC = function (t, e)
{
    t.scaleX = e;
},
Tween.SCALEY_FUNC = function (t, e)
{
    t.scaleY = e;
},
Tween.ALPHA_FUNC = function (t, e)
{
    t.alpha = e;
},
Tween.X_FUNC = function (t, e)
{
    t.x = e;
},
Tween.Y_FUNC = function (t, e)
{
    t.y = e;
},
Tween.SCALE_X_FUNC = function (t, e)
{
    t.scaleX = e;
},
Tween.SCALE_Y_FUNC = function (t, e)
{
    t.scaleY = e;
},
Tween.MOVIE_FUNC = function (t, e)
{
    t.stop(Math.round(e))
},
Tween.prototype.move = function (t, e, i, n)
{
    if (!e) {
        return this;
    }
    for (var s = [], o = 3; o < arguments.length; o++) {
        s.push(arguments[o]);
    }
    return this.motions.push(
    {
        value : t, time : e, func : i || Tween.POW, args : s
    }), this
},
Tween.prototype.delay = function (t)
{
    return this.move(0, t), this;
},
Tween.prototype.apply = function (t)
{
    for (var e = this.motions[0].value, i = 1; i < this.motions.length; ++i) {
        if (t <= this.motions[i].time) {
            break;
        }
        e += this.motions[i].value, t -= this.motions[i].time
    }
    if (i < this.motions.length) {
        var n = this.motions[i];
        e = n.func.apply(this, [t, e, n.value, n.time].concat(n.args))
    }
    this.setter.apply(this, [this.object, e]);
},
SpriteTween.prototype.parsePattern = function (t)
{
    for (var e = [], i = t.split(","), n = 0; n < i.length; n++)
    {
        var s = i[n];
        if (s.indexOf("-") > -1)
        {
            for (var o = s.split("-").map(Number), a = o[0] > o[1] ?- 1 : 1, r = 0; r <= Number(Math.abs(o[0] - o[1])); r++) {
                e.push(o[0] + r * a);
            }
        }
        else {
            e.push(parseInt(s, 10));
        }
    }
    return e;
},
SpriteTween.prototype.move = function (t, e)
{
    for (var i = this.parsePattern(t), n = e / i.length, s = 0; s < i.length; ++s) {
        this.motions.push({
            value : i[s], time : n 
        });
    }
    return this;
},
SpriteTween.prototype.apply = function (t)
{
    for (var e = t, i = 0; i < this.motions.length; ++i) {
        if (e <= this.motions[i].time) {
            break;
        }
        e -= this.motions[i].time
    }
    i = Math.min(this.motions.length - 1, i), this.object.frame = this.motions[i].value;
},
MovieClip.prototype = Object.create(EventDispatcher.prototype), MovieClip.prototype.constructor = MovieClip, 
MovieClip.prototype.addTween = function (t)
{
    this.tweens.push(t)
},
MovieClip.prototype.createTween = function (t, e, i)
{
    var n = new Tween(t, e, i);
    return this.tweens.push(n), n;
},
MovieClip.prototype.createSpriteTween = function (t)
{
    var e = new SpriteTween(t);
    return this.tweens.push(e), e;
},
MovieClip.prototype.addAction = function (t, e, i)
{
    var n = [], s;
    for (e = this.convertToTime(e), s = 2; s < arguments.length; s++) {
        n.push(arguments[s]);
    }
    for (s = 0; s < this.actions.length; ++s)
    {
        if (this.actions[s].time == e) {
            this.actions[s].func = t;
            break 
        }
        s == this.actions.length && this.actions.push({
            func : t, time : e || e + .001, args : n 
        }), this.actions.sort(function (t, e) 
        {
            return t.time - e.time;
        });
    }
},
MovieClip.prototype.addLabel = function (t, e)
{
    this.labels || (this.labels = {}), "string" == typeof t && (this.labels[t] = e || 0);
},
MovieClip.prototype.play = function (t)
{
    var e = false;
    "undefined" != typeof t && (t = this.convertToTime(t)), "undefined" != typeof t && (e = this.time != t, 
    this.time = t), this.playing ? e && this.update() : (this._stage.addEventListener(GameEvent.ENTER_FRAME, 
    this.onEnterFrame, this), this.playing = true, this.dispatchEvent(new GameEvent(GameEvent.START)));
},
MovieClip.prototype.stop = function (t)
{
    "undefined" != typeof t && (t = this.convertToTime(t)), this.time = "undefined" == typeof t ? this.time : t, 
    this.playing && (this._stage.removeEventListener(GameEvent.ENTER_FRAME, this.onEnterFrame, this), 
    this.playing = false, this.dispatchEvent(new GameEvent(GameEvent.COMPLETE))), this.update();
},
MovieClip.prototype.onEnterFrame = function (t)
{
    this.doActions(t.deltaTime), this.update(), this.dispatchEvent(t)
},
MovieClip.prototype.hasElapsedTimeStamp = function (t, e)
{
    return this.time - e.deltaTime < t && this.time >= t;
},
MovieClip.prototype.update = function ()
{
    for (var t = 0; t < this.tweens.length; t++) {
        this.tweens[t].apply(Math.max(0, this.time));
    }
},
MovieClip.prototype.doActions = function (t)
{
    for (var e = 0; e < this.actions.length; ++e)
    {
        if (this.actions[e].time > this.time && this.actions[e].time <= this.time + t) 
        {
            var i = this.actions[e].time - this.time;
            if (t -= i, this.time += i, this.doAction(this.actions[e])) {
                if (!this.playing) {
                    return;
                }
                e =- 1 
            }
        }
        this.time += t;
    }
},
MovieClip.prototype.doAction = function (t)
{
    var e = this.time, i = this.playing;
    return t.func.apply(this, t.args), e != this.time || i != this.playing;
},
MovieClip.prototype.convertToTime = function (t)
{
    return "string" == typeof t ? t = this.labels[t] || 0 : "number" == typeof t ? t : 0;
},
MovieClip.prototype.timeScale = function (t)
{
    var e = this.tweens, i = {}, n = {}, s = {};
    if ("undefined" != typeof t && 0 !== t || (t = 1), this.labels) {
        for (var o in this.labels) {
            this.labels.hasOwnProperty(o) && (this.labels[o] *= t);
        }
    }
    for (var a = 0; a < e.length; a++)
    {
        if (i = e[a], i.motions) {
            for (var r = 0; r < i.motions.length; r++) {
                i.motions[r].time *= t;
            }
        }
        if (i.actions) {
            for (var r = 0; r < i.actions.length; r++) {
                i.actions[r].time *= t;
            }
        }
    }
    this.time *= t
},
ParticleEmitter.deviate = function (t, e)
{
    return t + (Math.random() - .5) * e * 2;
},
ParticleEmitter.prototype = Object.create(MovieClip.prototype), ParticleEmitter.prototype.constructor = ParticleEmitter, 
ParticleEmitter.prototype.spawn = function (t, e, i)
{
    t = $.extend(true, 
    {
        spawnPointX : 0, spawnPointXDeviation : 0, spawnPointY : 0, spawnPointYDeviation : 0, spawnSpeed : 5, 
        startSpeed : 100, startSpeedDeviation : 0, endSpeed : 100, endSpeedDeviation : 0, scale : 1, scaleDeviation : 0, 
        angle : 0, angleDeviation : 0, rotation : 0, rotationDeviation : 0, rotationSpeed : 0, rotationSpeedDeviation : 0, 
        opacity : 1, opacityDeviation : 0, opacityLowsFromDistance : 100, opacityLowsTillDistance : 200, 
        spriteColumns : 1, spriteRows : 1
    },
    t || {});
    var n = Math.floor(i / 1e3 * t.spawnSpeed), s = Math.floor(i / n);
    n.times(function (n)
    {
        this.spawnParticle(t, e, i, s, n)
    }
    .bind(this)), this.particles.sort(function (t, e)
    {
        return t.alpha - e.alpha;
    })
},
ParticleEmitter.prototype.spawnParticle = function (t, e, i, n, s)
{
    var o = new Particle(t, e, i, n);
    if (this.particles.push(o), this.container.addChild(o), o.spawn(s), t.spritePattern)
    {
        var a = Math.ceil(o.fullTravelTime / t.spritePatternDuration), r = Array.copiesOf(t.spritePattern, 
        a).join(",");
        this.addTween(new SpriteTween(o).move("0", o.startTime).move(r, a * t.spritePatternDuration))
    }
    else
    {
        o.frame = void 0 != t.spriteFrame ? t.spriteFrame : Array.range(0, t.spriteColumns * t.spriteRows - 1).sample();
    }
    return o;
},
ParticleEmitter.prototype.update = function ()
{
    this.oldTimeUpdate || (this.oldTimeUpdate = this.time);
    for (var t = this.time - this.oldTimeUpdate, e, i = 0; i < this.particles.length; i += 1)
    {
        e = this.particles[i], e instanceof Particle && (!e.started && e.startTime <= this.time && (e.start(), 
        e.update(this.time, t)), e.started && e.isLive && e.update(this.time, t));
    }
    for (var i = 0; i < this.tweens.length; i += 1) {
        this.tweens[i].apply(Math.max(0, this.time));
    }
    this.oldTimeUpdate = this.time;
},
Particle.prototype = Object.create(Sprite.prototype), Particle.constructor = Sprite, Particle.prototype.spawn = function (t)
{
    var e = this.startTiming + this.timeOffset * t, i = ParticleEmitter.deviate(this.config.startSpeed, 
    this.config.startSpeedDeviation), n = Math.min(Math.floor(this.config.opacityLowsTillDistance / i * 1e3), 
    this.startTiming + this.duration - e), s = Math.max(0, n - Math.floor((this.config.opacityLowsTillDistance - this.config.opacityLowsFromDistance) / i * 1e3)), 
    o = ParticleEmitter.deviate(this.config.angle, this.config.angleDeviation), a = ParticleEmitter.deviate(this.config.scale, 
    this.config.scaleDeviation), r = ParticleEmitter.deviate(this.config.rotation, this.config.rotationDeviation), 
    l = ParticleEmitter.deviate(this.config.opacity, this.config.opacityDeviation), h = ParticleEmitter.deviate(this.config.rotationSpeed, 
    this.config.rotationSpeedDeviation);
    this.startTime = e, this.fullTravelTime = n, this.timingToStartLowingOpacity = s, this.startX = ParticleEmitter.deviate(this.config.spawnPointX, 
    this.config.spawnPointXDeviation), this.startY = ParticleEmitter.deviate(this.config.spawnPointY, 
    this.config.spawnPointYDeviation), this.endX = this.startX + i * Math.cos(o) * this.fullTravelTime / 1e3, 
    this.endY = this.startY + i * Math.sin(o) * this.fullTravelTime / 1e3, this.rotationSpeed = h / 1e3, 
    this.startAlpha = l, this.endAlpha = this.startAlpha - l, this.x = this.startX, this.y = this.startY, 
    this.scaleX = [ - 1, 1].sample() * a, this.scaleY = [ - 1, 1].sample() * a, this.alpha = this.startAlpha, 
    this.rotate = r, this.visible = false, this.started = false, this.age = 0, this.ageAlpha = 0, this.oneOverLife = 1 / this.fullTravelTime, 
    this.oneOverLifeAlpha = 1 / (this.fullTravelTime - this.timingToStartLowingOpacity);
},
Particle.prototype.start = function ()
{
    this.isLive = true, this.visible = true, this.started = true;
},
Particle.prototype.kill = function ()
{
    this.isLive = false, this.visible = false;
},
Particle.prototype.update = function (t, e)
{
    var i = 0;
    return this.age = t - this.startTime, this.age >= this.fullTravelTime ? (this.x = this.endX, this.y = this.endY, 
    this.alpha = this.endAlpha, void this.kill()) : (i = this.age * this.oneOverLife, this.x = (this.endX - this.startX) * i + this.startX, 
    this.y = (this.endY - this.startY) * i + this.startY, this.rotate += this.rotationSpeed * e, void (this.age > this.timingToStartLowingOpacity && (this.ageAlpha = t - (this.startTime + this.timingToStartLowingOpacity), 
    this.alpha = (this.endAlpha - this.startAlpha) * (this.ageAlpha * this.oneOverLifeAlpha) + this.startAlpha)));
},
ServerData.prototype.defaultData.bet = 1, ServerData.prototype.defaultData.lines = 1, ServerData.prototype.defaultData.paid = 0, 
ServerData.prototype.defaultData.freePaid = 0, ServerData.prototype.defaultData.roundPaid = 0, ServerData.prototype.defaultData.payouts = [], 
ServerData.prototype.defaultData.paylines = [], ServerData.prototype.defaultData.roundWin = false, ServerData.prototype.defaultData.matrix = [[1, 
1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]], ServerData.prototype.defaultData.wins = [], ServerData.prototype.defaultData.reelSet = 1, 
ServerData.prototype.defaultData.freegamesNumber = 0, ServerData.prototype.defaultData.freegamesActive = false, 
ServerData.prototype.defaultData.freegamesAwarded = 0, ServerData.prototype.defaultData.freeGamesWinMultiplier = 1, 
ServerData.prototype.defaultData.freegamesCompleteSpins = 0, ServerData.prototype.defaultData.freegamesSpinsLimit = 0, 
ServerData.prototype.defaultData.gamble_round =- 1, ServerData.prototype.defaultData.bonus_round =- 1, 
ServerData.prototype.defaultData.giftOffers = [], ServerData.prototype.defaultData.giftspins = "", ServerData.prototype.defaultData.giftspins_total_number = 0, 
ServerData.prototype.defaultData.giftspins_number = 0, ServerData.prototype.defaultData.giftspins_total_win = 0, 
ServerData.prototype.defaultData.giftspins_lines = 0, ServerData.prototype.defaultData.giftspins_bet = 0, 
ServerData.NORMAL_WIN = 0, ServerData.BIG_WIN = 1, ServerData.MEGA_WIN = 2, ServerData.prototype.getWinLevel = function (t)
{
    var t = t || this.roundPaid;
    switch (true)
    {
        case t >= slotConfig.megaWinTotalBets * this.bet * this.lines:
            return ServerData.MEGA_WIN;
        case t >= slotConfig.bigWinTotalBets * this.bet * this.lines:
            return ServerData.BIG_WIN;
        default:
            return ServerData.NORMAL_WIN;
    }
},
ServerData.prototype.hasSpecialWins = function ()
{
    return false;
},
ServerData.prototype.hasBonusWins = function ()
{
    return this.freegamesAwarded > 0;
},
ServerData.prototype.createBetMessage = function (t, e, i)
{
    var n = Array.range(1, e).join(","), s = connection.createMessage("next" == serverData.status ? "next" : "bet");
    return s.append('<bet coin="1" shift="0,0,0,0,0"/>'), s.find("bet").attr("cash", t), s.find("bet").attr("lines", 
    n), s.append("<debug />"), s.find("debug").attr("user_cash", serverData.balance), s.find("debug").attr("bet_cash", 
    clientData.getTotalBet()), s
},
ServerData.prototype.spin = function (t, e, i, n)
{
    var s = h5game.getShifterCombinations();
    s && connection.send(this.createSpinShiftMessage(s)), n = clientData.freegamesActive ? "free" : "normal", 
    connection.send(this.createBetMessage(clientData.bet, clientData.lines, n));
},
ServerData.prototype.parseStart = function (t)
{
    this.parseCurrency(t), slotConfig.defaultBet = slotConfig.defaultBet > -1 && slotConfig.defaultBet < slotConfig.coins.length ? slotConfig.defaultBet : 0, 
    this.bet = slotConfig.coins[slotConfig.defaultBet], this.lines = slotConfig.lines;
    for (var e = t.find("combinations combination"), i = 0; i < e.length; i++) {
        this.payouts.push($(e[i]));
    }
    for (var n = t.find("paylines payline"), i = 0; i < n.length; i++) {
        var s = $(n[i]).attr("path").split(",");
        this.paylines.push(s)
    }
    this.reelSet = Number(t.find("shift").attr("reel_set")), this.reelSets = [];
    for (var o = t.find("reels,reels2,reels3,reels4,reels5,reels6,reels7,reels8,reels_b"), i = 0; i < o.length; i++)
    {
        var a = Number($(o[i]).attr("id"));
        this.reelSets[a] = [];
        for (var r = $(o[i]).find("reel"), l = 0; l < r.length; l++)
        {
            var h = $(r[l]).attr("layout") || $(r[l]).attr("symbols");
            if (h) {
                var u = h.split(",").map(Number);
                this.reelSets[a][$(r[l]).attr("id")] = u;
            }
        }
    }
    this.parseMatrix(t), this.defaultData.matrix = this.matrix.slice(), this.freegamesSpinsLimit = Math.max(0, 
    Number(t.find('limit[id="freespins_seq"]').attr("max") || 0));
},
ServerData.prototype.parseReconnect = function (t)
{
    this.parseStart(t);
    var e = t.find("spin_cmd");
    e.length > 0 && (this.status = e.attr("status"), this.parseBet(e));
},
ServerData.prototype.parseBet = function (t)
{
    this.bet = Number(t.find("game").attr("line-bet")), this.lines = Number(t.find("game").attr("lines").split(",").pop()), 
    this.reelSet = Number(t.find("shift").attr("reel_set")), this.wins = [], this.roundWin = t.find(">wins").length > 0, 
    this.gamble_round =- 1;
    for (var e = t.find(">wins>win"), i = 0; i < e.length; i++)
    {
        var n = $(e[i]), s = n.attr("layout").split("").map(Number), o = n.attr("comb_symbols").split(",").map(Number), 
        a = Number(n.attr("line")) - 1;
        this.wins.push(
        {
            number : a, layout : s, paid : Number(n.attr("cash")), comb : Number(n.attr("comb")) || 0, 
            comb_symbols : o
        })
    }
    this.wins = this.wins.sort(function (t, e)
    {
        return t.paid === e.paid ? t.number - e.number : t.paid - e.paid;
    });
    for (var r = t.find(">wins>newwin"), i = 0; i < r.length; i++)
    {
        var n = $(r[i]), l = n.attr("layout");
        if (l)
        {
            var s = n.attr("layout").split("").map(Number);
            this.wins.push({
                layout : s, paid : Number(n.attr("cash") || 0), comb : n.attr("comb")
            })
        }
    }
    this.freegamesActive = 0 == Number(t.find("game").attr("cash-bet") || 0), this.freegamesNumber = Number(t.find("game").attr("bonus_games") || 0), 
    this.freegamesCompleteSpins = Number(t.find("game").attr("completed_bonus_games") || 0), this.freegamesSpinsLimit = Math.max(this.freegamesSpinsLimit, 
    Number(t.find("game").attr("original_bonus_games") || 0)), this.freePaid = Number(t.find("game").attr("free-win") || 0), 
    this.roundPaid = Number(t.find("game").attr("cash-win")), this.paid = this.freegamesActive ? this.freePaid : this.roundPaid, 
    this.parseFreegamesAwarded(t), this.parseMatrix(t);
},
ServerData.prototype.parseFreegamesAwarded = function (t)
{
    var e = t.find("wins newwin[comb=freespin]");
    this.freegamesAwarded = e.length > 0 ? Number(e.attr("freespins")) : 0;
},
ServerData.prototype.parseShifter = function (t)
{
    var e = t.find("status");
    this.status = e.attr("result");
},
ServerData.prototype.parseMatrix = function (t)
{
    var e = t.find("shift:eq(0)");
    if (e.attr("reel1"))
    {
        for (var i = 1; i <= slotConfig.columns; i++) 
        {
            this.matrix[i - 1] = e.attr("reel" + i).split(",");
            for (var n = 1; n <= slotConfig.rows; n++)
            {
                if (this.matrix[i - 1][n - 1] = Number(this.matrix[i - 1][n - 1]), isNaN(this.matrix[i - 1][n - 1])) {
                    throw new Error("Incorrect matrix received from server.") ;
                }
            }
        }
    }
    else {
        this.matrix = this.defaultData.matrix.slice();
    }
},
ServerData.prototype.createShiftMessage = function (t)
{
    for (var e = t.slice(), i = [], n = [], s = [], o = [], a = 0; a < e.length; a++)
    {
        var r = e[a].slice();
        r[0].indexOf("b:") !=- 1 ? (r[0] = r[0].replace("b:", ""), s.push(r)) : r[0].indexOf("g:") !=- 1 ? (r[0] = r[0].replace("g:", 
        ""), n.push(r)) : r[0].indexOf("s:") !=- 1 ? (r[0] = r[0].replace("s:", ""), o.push(r)) : i.push(r)
    }
    return s.length && this.sendBonusShiftMessage(s), n.length && this.sendGambleShiftMessage(n), o.length && this.sendSpecialShiftMessage(o), 
    this.createSpinShiftMessage(i);
},
ServerData.prototype.createSpinShiftMessage = function (t)
{
    var e = game.doubleReel && (1 == this.reelSet || 3 == this.reelSet), i = e && 2 !== this.reelSet ? 'game="doublereel"' : "", 
    n = connection.createMessage("pool"), s = $('<game id="' + gameConfig.name + '" ' + i + " />");
    n.append(s);
    for (var o = 0; o < t.length; o++) {
        var a = t[o], r = a.join(", ") + (e ? ", 0, 0, 0, 0, 0" : "");
        s.append('<shift value="' + r + '" />')
    }
    return n;
},
ServerData.prototype.sendBonusShiftMessage = function (t)
{
    throw Error("Should be implemented")
},
ServerData.prototype.sendGambleShiftMessage = function (t)
{
    var e = connection.createMessage("shifter"), i = $('<game game="chance"/>'), n = $('<shift value="' + t.join(",") + '"/>');
    i.append(n), e.append(i), connection.send(e)
},
serverData.addParser("start", serverData.parseStart), serverData.addParser("bet", serverData.parseBet), 
serverData.addParser("reconnect", serverData.parseReconnect), serverData.addErrorParser("bet", function (t)
{
    if (this.paid = 0, this.roundPaid = 0, this.wins = [], this.matrix = this.defaultData.matrix.slice(), 
    this.statusErrorCode = null, this.statusErrorCode = t.find("extra error").attr("code"), "exit" == this.status)
    {
        var e = t.find("extra");
        e && e.length > 0 && (this.statusErrorCode = e.find("statuserrorcode").html());
    }
}), ClientData.prototype.defaultData.autoplayActive = false, ClientData.prototype.defaultData.autoplayNumber =- 1, 
ClientData.AUTOPLAY_LOSS_LIMIT_OFF = 9999, ClientData.prototype.defaultData.autoplayLossLimit =- 2, ClientData.prototype.defaultData.autoplaySingleWinLimit =- 2, 
ClientData.prototype.defaultData.autoplayBetCounter = 0, ClientData.prototype.defaultData.autoplayPaidCounter = 0, 
ClientData.prototype.defaultData.autoplayRemains = 0, ClientData.prototype.defaultData.autoplayFinished = false, 
ClientData.prototype.defaultData.bet = 1, ClientData.prototype.defaultData.paid = 0, ClientData.prototype.defaultData.lines = 1, 
ClientData.prototype.defaultData.freegamesActive = false, ClientData.prototype.defaultData.freegamesNumber = 0, 
ClientData.prototype.defaultData.freegamesSpinLimitReached = false, ClientData.prototype.defaultData.freegamesCompleteSpins = 0, 
ClientData.prototype.defaultData.freeGamesWinMultiplier = 1, ClientData.prototype.defaultData.spinStartTime =- 1e8, 
ClientData.prototype.defaultData.betIdleTime = ClientData.prototype.defaultData.spinStartTime + 1, ClientData.prototype.defaultData.mustPlaySoundWinComb = false, 
ClientData.prototype.defaultData.showTotalWinOnStart = false, ClientData.prototype.defaultData.winPanelStartsFromRollEndedCustom = false, 
ClientData.prototype.autoplayHasToBeTerminated = function ()
{
    return false;
},
ClientData.prototype.initAutoPlay = function ()
{
    this.freegamesActive || (this.freegamesActive = true, this.freegamesSpinLimitReached = false, this.freegamesCompleteSpins = 0, 
    this.paid = 0), this.freegamesNumber = serverData.freegamesNumber, serverData.wins = [];
},
ClientData.prototype.autoplayHasToBePaused = function ()
{
    return false;
},
ClientData.prototype.adjustBet = function ()
{
    for (var t = {
        bet : this.bet, lines : this.lines
    },
    e = slotConfig.coins.length - 1;
    e >= 0;
    e--) if (this.bet = slotConfig.coins[e], this.getTotalBet() <= this.getAvailableBalance()) break;
    for (var e = slotConfig.linesSet.length - 1; e >= 0; e--)
    {
        if (this.lines = slotConfig.linesSet[e], this.getTotalBet() <= this.getAvailableBalance()) {
            break;
        }
        return this.getTotalBet() > this.getAvailableBalance() && (this.bet = t.bet, this.lines = t.lines), 
        this.diff(), this.getTotalBet() <= this.getAvailableBalance();
    }
},
ClientData.prototype.getTotalBet = function ()
{
    return this.bet * this.lines;
},
ClientData.prototype.getAvailableBalance = function ()
{
    return gameConfig.useExternalBalance ? 99999999 : serverData.balance;
},
ClientData.prototype.increaseBet = function ()
{
    var t = slotConfig.coins.indexOf(this.bet);
    t = Math.min(t + 1, slotConfig.coins.length - 1), this.bet = slotConfig.coins[t], this.diff();
},
ClientData.prototype.decreaseBet = function ()
{
    var t = slotConfig.coins.indexOf(this.bet);
    t = Math.max(t - 1, 0), this.bet = slotConfig.coins[t], this.diff();
},
ClientData.prototype.increaseLines = function ()
{
    var t = slotConfig.linesSet.indexOf(this.lines);
    t = Math.min(t + 1, slotConfig.linesSet.length - 1), this.lines = slotConfig.linesSet[t], this.diff();
},
ClientData.prototype.decreaseLines = function ()
{
    var t = slotConfig.linesSet.indexOf(this.lines);
    t = Math.max(t - 1, 0), this.lines = slotConfig.linesSet[t], this.diff();
},
ClientData.prototype.spin = function ()
{
    this.act("spin")
},
ClientData.prototype.startAutoplay = function ()
{
    this.autoplayActive = true, this.autoplayFinished = false, this.betIdleTime = this.defaultData.betIdleTime, 
    this.autoplayRemains = this.autoplayRemains > 0 ? this.autoplayRemains - 1 : this.autoplayNumber - 1, 
    userConfig.autoSpinEnabled ? this.autoplayBetCounter += this.getTotalBet() : (this.autoplayBetCounter = this.getTotalBet(), 
    this.autoplayPaidCounter = 0), this.act("spin");
},
ClientData.prototype.areAutoplayLimitsDisabled = function ()
{
    return false;
},
ClientData.prototype.isAutoplayNumberUnlimited = function ()
{
    return false;
},
ClientData.prototype.proceedAutoplay = function ()
{
    logger.debug("(bet=" + h5game.formatMeter(this.autoplayBetCounter) + ")-(paid=" + h5game.formatMeter(this.autoplayPaidCounter) + ") = (loss=" + h5game.formatMeter(this.autoplayBetCounter - this.autoplayPaidCounter) + ")"), 
    this.checkAutoplayLossLimitReached() || (this.autoplayBetCounter += this.getTotalBet(), this.isAutoplayNumberUnlimited() || (this.autoplayRemains -= 1), 
    this.act("spin"))
},
ClientData.prototype.checkAutoplaySingleWinLimitReached = function (t)
{
    if (this.giftspinsActive || this.areAutoplayLimitsDisabled()) {
        return false;
    }
    var e = t || this.paid;
    return this.autoplaySingleWinLimit > 0 && this.autoplaySingleWinLimit * this.getTotalBet() <= e || 0 == this.autoplaySingleWinLimit && e > 0;
},
ClientData.prototype.checkAutoplayLossLimitReached = function ()
{
    return!this.giftspinsActive && !this.areAutoplayLimitsDisabled() && (this.autoplayLossLimit > 0 && this.autoplayLossLimit != ClientData.AUTOPLAY_LOSS_LIMIT_OFF && this.autoplayBetCounter + this.getTotalBet() - this.autoplayPaidCounter > this.autoplayLossLimit * this.getTotalBet() && (this.autoplayFinished = true, 
    true));
},
ClientData.prototype.stopAutoplay = function ()
{
    this.autoplayBetCounter = 0, this.autoplayPaidCounter = 0, this.autoplayRemains = 0, this.autoplayActive = false, 
    this.autoplayFinished = false, slotConfig.certified && (this.autoplayNumber = slotConfig.autoplayNumber, 
    this.autoplayLossLimit = slotConfig.autoplayLossLimit, this.autoplaySingleWinLimit = slotConfig.autoplaySingleWinLimit);
},
ClientData.prototype.startGamble = function ()
{
    this.act("gamble.start")
},
ClientData.prototype.spinDelay = function ()
{
    var t = this.autoplayActive ? this.freegamesActive ? slotConfig.delay_auto_freespin : slotConfig.delay_auto_spin : this.freegamesActive ? slotConfig.delay_main_freespin : slotConfig.delay_main_spin, 
    e = this.freegamesActive ? serverData.paid > 0 ? slotConfig.pause_free_spin_win : slotConfig.pause_free_spin_lose : this.autoplayActive ? serverData.paid > 0 ? slotConfig.pause_auto_spin_win : slotConfig.pause_auto_spin_lose : 0;
    return stage.time >= Math.max(clientData.spinStartTime + t, clientData.betIdleTime + e);
},
ClientData.prototype.menuActive = function ()
{
    return "bet.idle" == this.state && !this.freegamesActive && !this.autoplayActive || game.settingsButtonPermitted();
},
ClientData.prototype.spinSettingsVisible = function ()
{
    return "bet.idle" == this.state && !this.freegamesActive && !this.autoplayActive && !clientData.giftspinsActive;
},
ClientData.prototype.betSettingsActive = function ()
{
    return "bet.idle" == this.state && !this.freegamesActive && !this.autoplayActive;
},
ClientData.prototype.autoplaySettingsVisible = function ()
{
    return true;
},
ClientData.prototype.quickspinCheckboxVisible = function ()
{
    return true;
},
clientData.addTransition({
    from : "init", to : "bet.idle", type : "auto", priority :- 2
}), clientData.addTransition(
{
    from : "bet.idle", to : "spin.start", type : "action", action : "spin",
    guard : function ()
    {
        return!clientData.freegamesActive && clientData.spinDelay()
    }
}), clientData.addTransition(
{
    from : "bet.idle", to : "spin.start", type : "action", action : "free.spin",
    guard : function ()
    {
        return clientData.freegamesActive && clientData.spinDelay();
    }
}), clientData.addTransition(
{
    from : "bet.idle", to : "freespins.limit", type : "auto", priority : 3,
    guard : function ()
    {
        return clientData.freegamesActive && clientData.freegamesSpinLimitReached;
    }
}), clientData.addTransition({
    from : "freespins.limit", to : "freespins.stop", type : "auto"
}), clientData.addTransition(
{
    from : "bet.idle", to : "freespins.stop", type : "auto", priority : 1,
    guard : function ()
    {
        return clientData.freegamesActive && 0 == clientData.freegamesNumber;
    }
}), clientData.addTransition(
{
    from : "bet.idle", to : "bet.autoplay", type : "auto", priority : 2,
    guard : function ()
    {
        return clientData.autoplayFinished;
    }
}), clientData.addTransition({
    from : "bet.autoplay", to : "bet.idle", type : "action", action : "close"
}), clientData.addTransition(
{
    from : "spin.start", to : "spin.stop", fail : "spin.fail", excess : "spin.warning", type : "server", 
    mixed : true, action : serverData.spin
}), clientData.addTransition(
{
    from : "spin.fail", to : "error.exit", type : "auto",
    guard : function ()
    {
        return clientData.freegamesActive;
    },
    priority : 1
}), clientData.addTransition({
    from : "spin.fail", to : "spin.warning", type : "auto"
}), clientData.addTransition({
    from : "spin.warning", to : "spin.stop", type : "action", action : "close"
}), clientData.addTransition(
{
    from : "spin.stop", to : "bet.win", type : "auto",
    guard : function ()
    {
        return serverData.wins.length > 0;
    },
    priority : 0
}), clientData.addTransition({
    from : "spin.stop", to : "bet.idle", type : "auto", priority :- 1
}), clientData.addTransition({
    from : "bet.win", to : "bet.idle", type : "auto", priority :- 1
}), clientData.addTransition(
{
    from : "bet.win", to : "bet.freewin", type : "auto", priority : 2,
    guard : function ()
    {
        return serverData.freegamesAwarded > 0;
    }
}), clientData.addTransition(
{
    from : "bet.win", to : "bet.skip.spin", type : "action", action : "spin",
    guard : function ()
    {
        return!serverData.hasSpecialWins() && !clientData.freegamesActive && clientData.spinDelay() && (!(game.winPanel.sizeType > ServerData.NORMAL_WIN) || !game.winPanel.isRolling)
    }
}), clientData.addTransition({
    from : "bet.skip.spin", to : "spin.start", type : "auto"
}), clientData.addTransition({
    from : "bet.freewin", to : "freespins.start", type : "auto"
}), clientData.addTransition({
    from : "freespins.start", to : "bet.idle", type : "auto"
}), clientData.addTransition({
    from : "freespins.stop", to : "bet.idle", type : "auto"
}), clientData.setTransitionCallback(/.+/, /(bet|spin|freespins).+/, function ()
{
    this.display = Game.MAIN;
}), clientData.setTransitionCallback(/init/, /bet\.win/, function ()
{
    this.winPanelStartsFromRollEnded = true;
}), clientData.setTransitionCallback(/bet\.win/, /.+/, function ()
{
    this.winPanelStartsFromRollEnded = false, this.showTotalWinOnStart = false;
}), clientData.setTransitionCallback(/bet.(win|idle)/, /.+/, function ()
{
    this.showTotalWinOnStart = false;
}), clientData.setTransitionCallback(/^init$/, /.+/, function ()
{
    if (this.balance = serverData.balance, this.bet = slotConfig.coins.indexOf(serverData.bet) ==- 1 && serverData.freegamesAwarded <= 0 && !serverData.freegamesActive && serverData.bonus_round < 0 && serverData.status.indexOf("bonus") ==- 1 ? slotConfig.coins[slotConfig.defaultBet] : serverData.bet, 
    this.lines = serverData.lines, this.paid = serverData.gamble_round ==- 1 && serverData.bonus_round ==- 1 ? serverData.paid - serverData.roundPaid : serverData.paid, 
    this.freegamesActive = serverData.freegamesActive && !(serverData.gamble_round > -1), this.freegamesNumber = serverData.freegamesNumber - serverData.freegamesAwarded, 
    this.freegamesActive && (this.showTotalWinOnStart = serverData.freePaid > 0, this.freegamesCompleteSpins = serverData.freegamesCompleteSpins, 
    serverData.freegamesSpinsLimit && this.freegamesCompleteSpins >= serverData.freegamesSpinsLimit && (this.freegamesNumber = 0, 
    this.freegamesSpinLimitReached = true)), void 0 != this.freegamesLives && (this.freegamesLives = serverData.freegamesLives), 
    this.autoplayNumber = slotConfig.autoplayNumber, this.autoplayLossLimit = slotConfig.autoplayLossLimit, 
    this.autoplaySingleWinLimit = slotConfig.autoplaySingleWinLimit, this.giftspinsActive && (this.bet = this.getCurrentGiftOffer().bet, 
    this.saveAutoplayParams()), this.giftspinsFinished = !!this.getFinishedGiftOffer(), this.giftspinsActive && !this.giftspinsFinished && this.freegamesActive) {
        var t = this.getCurrentGiftOffer();
        t && 0 == t.spinsLeft && (this.giftspinsFinished = true);
    }
}), clientData.setTransitionCallback(/.+/, /^spin.start/, function ()
{
    if (this.paid = 0, this.balance = serverData.balance, this.freegamesActive && !this.respinActive ? this.freegamesNumber = serverData.freegamesNumber - 1 : this.balance - this.getTotalBet() >= 0 && !this.giftspinsActive && (this.balance -= this.getTotalBet()), 
    this.microround = true, this.spinStartTime = stage.time, this.giftspinsActive && !this.freegamesActive) {
        var t = this.getCurrentGiftOffer();
        t && !--t.spinsLeft && (this.giftspinsFinished = true);
    }
}), clientData.setTransitionCallback(/spin.stop/, /.+/, function ()
{
    slotConfig.extendedSpinRound || (this.balance = serverData.balance, this.microround = false), this.autoplayActive && (this.getTotalBet() > this.getAvailableBalance() && !this.giftspinsActive ? this.stopAutoplay() : clientData.autoplayHasToBeTerminated() ? this.stopAutoplay() : 0 != this.autoplayRemains || this.isAutoplayNumberUnlimited() ? clientData.autoplayHasToBePaused() && (this.autoplayActive = false) : (this.autoplayFinished = true, 
    clientData.autoplayHasToBePaused() && (this.autoplayActive = false)));
}), clientData.setTransitionCallback(/bet.win/, /.+/, function ()
{
    this.paid = serverData.roundPaid, this.mustPlaySoundWinComb = true, userConfig.autoSpinEnabled && (this.autoplayPaidCounter += this.paid, 
    this.checkAutoplaySingleWinLimitReached() && (this.autoplayFinished = true));
}), clientData.setTransitionCallback(/init|bet.idle/, /bet.autoplay/, function ()
{
    this.stopAutoplay()
}), clientData.setTransitionCallback(/freespins.start/, /bet.idle/, function ()
{
    this.initAutoPlay()
}), clientData.setTransitionCallback(/.+/, /freespins.stop/, function ()
{
    this.autoplayActive = false, this.autoplayRemains = 0, this.autoplayBetCounter = 0, this.autoplayPaidCounter = 0, 
    userConfig.autoSpinEnabled = false;
}), clientData.setTransitionCallback(/freespins.stop/, /.+/, function ()
{
    this.freegamesActive = false, this.bet = slotConfig.coins.indexOf(this.bet) ==- 1 ? slotConfig.coins[slotConfig.defaultBet] : this.bet, 
    serverData.wins = [];
}), clientData.setTransitionCallback(/.+/, /bet.idle/, function ()
{
    this.betIdleTime < this.spinStartTime && (this.betIdleTime = stage.time), this.giftspinsFinished && !this.freegamesActive && (this.giftspinsFinished = false, 
    this.act("giftspins.summary"));
}), clientData.setTransitionCallback(/bet.idle/, /.+/, function ()
{
    this.mustPlaySoundWinComb = false;
}), clientData.setTransitionCallback(/spin.start/, /spin.warning/, function ()
{
    this.balance = serverData.balance, this.microround = false, gameConfig.autoAdjust && this.adjustBet(), 
    this.stopAutoplay();
}), clientData.setTransitionCallback(/spin\.stop/, /bet\.(win|idle)/, function ()
{
    this.freegamesActive && (this.freegamesCompleteSpins = serverData.freegamesCompleteSpins, serverData.freegamesSpinsLimit && this.freegamesCompleteSpins >= serverData.freegamesSpinsLimit && (this.freegamesNumber = 0, 
    this.freegamesSpinLimitReached = true));
}), clientData.addEventListener(GameEvent.ENTER_STATE, function ()
{
    "spin.fail" == clientData.state && clientData.exitState()
}), Symbol.width = 0, Symbol.height = 0, Symbol.number = 0, Symbol.get = function (t, e) {},
Symbol.prototype = Object.create(DisplayObjectContainer.prototype), Symbol.prototype.constructor = Symbol, 
Symbol.prototype.reset = function ()
{
    this.states.normal.visible = false, this.states.blur.visible = false, this.states.blackout.visible = false, 
    this.states.animation.visible = false, this.movie && this.movie.stop();
},
Symbol.prototype.animate = function (t, e, i)
{
    this.reset(), this.states.animation.visible = true, this.movie.attributes.win = t, this.movie.attributes.column = e, 
    this.movie.attributes.row = i, this.movie.play(0), this.updateStateSize();
},
Symbol.prototype.blackout = function ()
{
    this.reset(), this.states.blackout.visible = true, this.updateStateSize();
},
Symbol.prototype.normal = function ()
{
    this.reset(), this.states.normal.visible = true, this.updateStateSize();
},
Symbol.prototype.blur = function ()
{
    this.reset(), this.states.blur.visible = true, this.updateStateSize();
},
Symbol.prototype.updateStateSize = function ()
{
    var t = {}, e = {};
    t = this.states.animation.visible ? this.states.animation : this.states.normal.visible ? this.states.normal : this.states.blackout.visible ? this.states.blackout : this.states.blur.visible ? this.states.blur : this.states.normal, 
    this.stateWidth = 0, this.stateHeight = 0;
    for (var i = 0; i < t.children.length; i += 1)
    {
        e = t.children[i], this.stateWidth = Math.max(this.stateWidth, e.width), this.stateHeight = Math.max(this.stateHeight, 
        e.height);
    }
},
Reel.STOPPED = "stopped", Reel.SPINNING = "spinning", Reel.STOPPING = "stopping", Reel.prototype = Object.create(DisplayObject.prototype), 
Reel.prototype.constructor = Reel, Reel.prototype.performDraw = function (t)
{
    var e = this.resultingOffset, i;
    for (t.translate(e.x, e.y), t.save(), i = this [0].height - 1; i >= 0 && this [i] != this [0]; i--) {
        t.translate(0, - Symbol.height);
    }
    for ((this.state != Reel.STOPPED || this [0] && this [0].height > 1) && this [0].draw(t), t.restore(), 
    i = 1;
    i < slotConfig.rows + 2;
    i++) t.translate(0, Symbol.height), this [i] != this [i - 1] && (i == slotConfig.rows + 1 && this.state == Reel.SPINNING ? this [i].draw(t) : i != slotConfig.rows + 1 && this [i].draw(t))
},
Reel.prototype.start = function ()
{
    this.v = slotConfig.reelsStandardSpeed, this.dy = 0, this.state = Reel.SPINNING;
    for (var t = 0; t < slotConfig.rows + 2; t++) {
        this [t].blur();
    }
},
Reel.prototype.stop = function (t)
{
    if (this.state == Reel.STOPPING || this.state == Reel.STOPPED && 2 != t || this.symbolsFeeder.pushServerData(), 
    2 == t)
    {
        this.move(this.symbolsFeeder.rowsToStop * Symbol.height - this.dy), this.state = Reel.STOPPED;
        var e = new GameEvent(GameEvent.COMPLETE);
        e.mode = t, this.dispatchEvent(e)
    }
    else
    {
        this.state == Reel.SPINNING && (this.v = 1 == t ? 2 * slotConfig.reelsStandardSpeed : slotConfig.reelsStandardSpeed, 
        this.state = Reel.STOPPING, this.T = (this.symbolsFeeder.rowsToStop * Symbol.height - this.dy) * (this.a + 1)  / (this.v * Symbol.height  / 1e3), 
        this.t = 0, this.b = this.dy, this.c = this.symbolsFeeder.rowsToStop * Symbol.height - this.dy);
    }
},
Reel.prototype.move = function (t)
{
    for (this.dy += t; this.dy >= Symbol.height; this.dy -= Symbol.height)
    {
        for (var e = slotConfig.rows + 1; e > 0; e--) {
            this [e] = this [e - 1];
        }
        this [0] = this.symbolsFeeder.next(), this.state == Reel.SPINNING && this [0].blur();
    }
},
Reel.prototype.insert = function (t, e)
{
    for (var i = 0; i < t.height; i++) {
        this [Math.min(Math.max(e + i, 1), slotConfig.rows)] = t;
    }
},
Reel.prototype.update = function (t)
{
    var e = 0;
    if (this.state == Reel.SPINNING) {
        e = Math.round(t.deltaTime * Symbol.height * this.v  / 1e3), this.move(e);
    }
    else if (this.state == Reel.STOPPING)
    {
        var i = Math.min(this.t + t.deltaTime, this.T);
        e = Math.round(this.tween(i) - this.tween(this.t)), this.t = i, this.move(e), this.t == this.T && (0 != this.dy && (this.dy > 50 ? this.move(Symbol.height - this.dy) : this.move(-this.dy)), 
        this.state = Reel.STOPPED, this.dispatchEvent(new GameEvent(GameEvent.COMPLETE)));
    }
},
Reel.prototype.tween = function (t)
{
    var e = t, i = this.b, n = this.c, s = this.T, o = (e /= s) * e, a = o * e;
    return i + n * (1.6326530612244934 * a * o +- 6.265306122448983 * o * o + 11.26530612244898 * a +- 11.26530612244898 * o + 5.63265306122449 * e);
},
Reel.prototype.possibleGain = function ()
{
    return false;
},
Reel.prototype.setRandomSymbols = function ()
{
    for (var t = 0; t < slotConfig.rows + 2; t++) {
        this [t] = Symbol.get(this.symbolsFeeder.getRandom(), this.column);
    }
},
Reel.prototype.setRandomSymbolsById = function (t)
{
    for (var e = 0; e < slotConfig.rows + 2; e++) {
        this [e] = Symbol.get(t, this.column);
    }
},
Reels.TYPE = "default", Reels.prototype = Object.create(DisplayObjectContainer.prototype), Reels.prototype.constructor = Reels, 
Reels.prototype.init = function ()
{
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        if ("default" == Reels.TYPE) {
            var e = new Reel(this, t);
        }
        else {
            var e = new FallingReel(this, t);
        }
        e.x = (t - 1) * (Symbol.width + this.gap);
        var i = this.createFrame(e.x), n = this.createCumstomFrame(e.x);
        i.visible = false, n.visible = true, n.alpha = 0, this.addChild(i), this.addChild(n), this.additionalRotatingFrame[t - 1] = i, 
        this.additionalCustomFrame[t - 1] = n, this.addChild(e), this [t] = e;
    }
},
Reels.prototype.each = function (t)
{
    for (var e = 1; e <= slotConfig.columns; e++) {
        for (var i = 1; i <= slotConfig.rows; i++) {
            t(this [e][i], e, i);
        }
    }
},
Reels.prototype.createFrame = function (t)
{
    return new Rectangle(t, 0, 0, 0);
},
Reels.prototype.createCumstomFrame = function (t)
{
    return new Rectangle(t, 0, 0, 0);
},
Reels.prototype.handleTouch = function (t, e, i)
{
    return t != GameEvent.TOUCH_END || !/spin.(start|stop)/.test(clientData.state) || (this.skipAdditionalRotating = true, 
    false);
},
Reels.prototype.performDraw = function (t)
{
    try {
        this.mask(t)
    }
    catch (e) {}
    if (t.beginPath(), t.rect(-this.leftMargin, - this.topMargin, (Symbol.width + this.gap) * slotConfig.columns + this.leftMargin + this.rightMargin, 
    Symbol.height * slotConfig.rows + this.topMargin + this.bottomMargin), t.clip(), t.save(), t.restore(), 
    this.children) for (var i = this.children.length - 1;
    i >= 0;
    i--) this.children[i] && this.children[i].draw(t)
},
Reels.prototype.stop = function ()
{
    this.quickStop = true;
};
var reels = new Reels;
SymbolsFeeder.prototype.currentSymbol = Array.copiesOf(0, 6), SymbolsFeeder.prototype.next = function ()
{
    if (0 == this.queue.length)
    {
        var t = serverData.reelSets[serverData.reelSet][this.column], e = this.currentSymbol[this.column], 
        i;
        i = true === [t.last()].concat(t).reduce(function (t, i)
        {
            return true === t || t === e && i === e || i;
        }, false) ? t.sample() : t.without(e).sample(), this.push(i), this.currentSymbol[this.column] = i
    }
    return this.rowsToStop > 0 && this.rowsToStop--, this.queue.shift();
},
SymbolsFeeder.prototype.getRandom = function ()
{
    return serverData.reelSets[serverData.reelSet][this.column].sample();
},
SymbolsFeeder.prototype.push = function (t)
{
    for (var e = Symbol.get(t, this.column), i = 0; i < e.height; i++) {
        this.queue.push(e);
    }
    return e;
},
SymbolsFeeder.prototype.pushServerData = function ()
{
    for (var t = slotConfig.rows - 1; t >= 0; )
    {
        for (var e = serverData.matrix[this.column - 1], i = e[t], n = this.push(i), s = n.height - 1; s >= 0 && e[t] == i; s--)
        {
            if (0 == t--) {
                this.rowsToStop = this.queue.length - s + 1;
                break 
            }
            serverData.matrix[this.column - 1] && serverData.matrix[this.column - 1].length && (this.currentSymbol[this.column] = serverData.matrix[this.column - 1][0]);;
        }
    }
},
Paylines.prototype = Object.create(DisplayObject.prototype), Paylines.prototype.constructor = Paylines, 
Paylines.prototype.drawCurvedLine = function (t, e, i)
{
    t.moveTo(e[0].x, e[0].y);
    for (var n = 1; n < e.length; n++)
    {
        var s = e[n - 1], o = e[n];
        if (n != e.length - 1 && i)
        {
            var a = e[n + 1], r = Math.sqrt((o.x - s.x) * (o.x - s.x) + (o.y - s.y) * (o.y - s.y)), l = Math.sqrt((a.x - o.x) * (a.x - o.x) + (a.y - o.y) * (a.y - o.y));
            if (r > i && l > i)
            {
                var h = {
                    x : (r - i) * (o.x - s.x) / r + s.x, y : (r - i) * (o.y - s.y) / r + s.y
                },
                u = {
                    x : i * (a.x - o.x) / l + o.x, y : i * (a.y - o.y) / l + o.y
                };
                t.lineTo(h.x, h.y), t.bezierCurveTo(h.x, h.y, o.x, o.y, u.x, u.y), t.lineTo(u.x, u.y)
            }
            else {
                t.lineTo(o.x, o.y);
            }
        }
        else {
            t.lineTo(o.x, o.y);
        }
    }
},
Paylines.prototype.strokeRoundedRect = function (t, e, i, n, s, o)
{
    o ? (n > 2 * o && (t.moveTo(e + o, i), t.lineTo(e + n - o, i)), o > 0 && t.arc(e + n - o, i + o, o, 
     - Math.PI / 2, 0, false), s > 2 * o && (t.moveTo(e + n, i + o), t.lineTo(e + n, i + s - o)), o > 0 && t.arc(e + n - o, 
    i + s - o, o, 0, Math.PI / 2, false), n > 2 * o && (t.moveTo(e + n - o, i + s), t.lineTo(e + o, i + s)), 
    o > 0 && t.arc(e + o, i + s - o, o, Math.PI / 2, Math.PI, false), s > 2 * o && (t.moveTo(e, i + s - o), 
    t.lineTo(e, i + o)), o > 0 && t.arc(e + o, i + o, o, Math.PI, 3 * Math.PI / 2, false)) : t.rect(e, 
    i, n, s)
},
Paylines.prototype.fillRoundedRect = function (t, e, i, n, s, o)
{
    o ? (t.arc(e + n - o, i + o, o, - Math.PI / 2, 0, false), t.arc(e + n - o, i + s - o, o, 0, Math.PI / 2, 
    false), t.arc(e + o, i + s - o, o, Math.PI / 2, Math.PI, false), t.arc(e + o, i + o, o, Math.PI, 3 * Math.PI / 2, 
    false)) : t.rect(e, i, n, s)
},
Paylines.prototype.performDraw = function (t)
{
    if (this.shownLines.length)
    {
        this.buffer || (this.buffer = imageLoader.createBuffer(this.stage.width, this.stage.height), this.bufferContext = this.buffer.getContext("2d"));
        var e = this.bufferContext, i = [];
        e.clearRect(0, 0, this.buffer.width, this.buffer.height), slotConfig.columns.times(function (t)
        {
            i[t] = Array.copiesOf(-1, slotConfig.rows);
        });
        for (var n = 0; n < this.shownLines.length; n++)
        {
            for (var s = this.shownLines[n].number, o = this.shownLines[n].layout, a = 0; a < o.length; a++) 
            {
                var r = o[a], l = a + 1;
                if (r > 0) {
                    for (var h = reels[l][r], u = 1; u <= slotConfig.rows; u++) {
                        reels[l][u] == h && (i[l - 1][u - 1] = s) ;
                    }
                }
            }
            e.lineWidth = this.lineWidth, e.lineJoin = this.lineRoundness ? "round" : "miter";
        }
        for (var n = 0; n < this.shownLines.length; n++)
        {
            var s = this.shownLines[n].number, d = this.data[s];
            e.strokeStyle = d.color, e.beginPath(), this.drawCurvedLine(e, d.line, this.lineRoundness), 
            e.stroke()
        }
        if (this.symbolBoxesEnabled)
        {
            e.lineJoin = this.symbolBoxRoundness ? "round" : "miter";
            for (var n = 0; n < slotConfig.columns; n++) for (var a = 0; a < slotConfig.rows; a++) if (i[n][a] !=- 1)
            {
                var h = reels[n + 1][a + 1];
                if (0 == a || reels[n + 1][a] != h)
                {
                    var c = reels.x + reels[n + 1].x, p = reels.y + a * Symbol.height, m = Symbol.width, 
                    f = h.height * Symbol.height;
                    e.save(), e.beginPath(), this.symbolBoxOutside ? (c -= Math.round(this.lineWidth / 2), 
                    p -= Math.round(this.lineWidth / 2), m += this.lineWidth, f += this.lineWidth) : (c += Math.round(this.lineWidth / 2), 
                    p += Math.round(this.lineWidth / 2), m -= this.lineWidth, f -= this.lineWidth), this.fillRoundedRect(e, 
                    c, p, m, f, this.symbolBoxRoundness), e.clip(), e.clearRect(c, p, m, f), e.restore(), 
                    this.drawRim(e, c, p, m, f, this.data[i[n][a]].color)
                }
            }
        }
        t.drawImage(this.buffer, 0, 0)
    }
},
Paylines.prototype.drawRim = function (t, e, i, n, s, o)
{
    t.strokeStyle = this.highlight ? "#ffffff" : o, t.beginPath(), this.strokeRoundedRect(t, e, i, n, 
    s, this.symbolBoxRoundness), t.stroke();
},
Paylines.prototype.customize = function () {}, Paylines.prototype.debugLine = 1, Paylines.prototype.debugOneLine = false, 
Paylines.prototype.performDebugDraw = function (t)
{
    var e = null;
    if (this.debugOneLine) {
        e = this.data[this.debugLine - 1], e && this.drawLine(t, e);
    }
    else {
        for (var i = 0; i < this.data.length; i += 1) {
            this.drawLine(t, this.data[i]);
        }
    }
},
Paylines.prototype.drawLine = function (t, e)
{
    t.strokeStyle = e.color, t.beginPath(), t.moveTo(e.line[0].x, e.line[0].y);
    for (var i = 1; i < e.line.length; i += 1) {
        t.lineTo(e.line[i].x, e.line[i].y);
    }
    t.stroke()
};
var paylines = new Paylines;
Game.GAMBLE = "gamble", Game.BONUS = "bonus", Game.BONUS2 = "bonus2", Game.prototype.doubleReel = false, 
Game.prototype.init = function ()
{
    this.main = this.createMain(), this.addChild(this.main), paylines.customize(), this.gamble = this.createGamble(), 
    this.addChild(this.gamble), this.bonus = this.createBonus(), this.addChild(this.bonus), this.bonus2 = this.createBonus2(), 
    this.addChild(this.bonus2), this.winPanel = new WinPanel, this.addChild(this.winPanel), this.onClientUpdate(function (t)
    {
        this.main.visible = clientData.display == Game.MAIN, this.gamble.visible = clientData.display == Game.GAMBLE, 
        this.bonus.visible = clientData.display == Game.BONUS, this.bonus2.visible = clientData.display == Game.BONUS2;
    })
},
Game.prototype.createMain = function ()
{
    var t = new DisplayObjectContainer;
    return this.background = new DisplayObjectContainer, t.addChild(this.background), t.addChild(reels), 
    reels.init(), t.addChild(paylines), this.paylinesEnd = this.createPayLinesEnd(), this.paylinesEnd && t.addChild(this.paylinesEnd), 
    this.freegamesIntro = this.createFreegamesIntro(), this.freegamesIntro && t.addChild(this.freegamesIntro), 
    this.freegamesLimitPopup = this.createFreegamesLimitPopup(), this.freegamesLimitPopup && t.addChild(this.freegamesLimitPopup), 
    this.freegamesSummary = this.createFreegamesSummary(), this.freegamesSummary && t.addChild(this.freegamesSummary), 
    this.freegamesPanel = this.createFreegamesPanel(), this.freegamesPanel && t.addChild(this.freegamesPanel), 
    t;
},
Game.prototype.createGamble = function ()
{
    return new DisplayObject;
},
Game.prototype.createBonus = function ()
{
    return new DisplayObject;
},
Game.prototype.createBonus2 = function ()
{
    return new DisplayObject;
},
Game.prototype.createFreegamesIntro = function () {}, Game.prototype.createFreegamesLimitPopup = function () {},
Game.prototype.createFreegamesSummary = function () {}, Game.prototype.createFreegamesPanel = function () {},
Game.prototype.createPayLinesEnd = function () {}, Game.prototype.handleSounds = function () {},
game.addEventListener(GameEvent.INIT_COMPLETE, function ()
{
    clientData.addEventListener(GameEvent.UPDATE, Game.handleSounds)
}), WinPanel.prototype = Object.create(DisplayObjectContainer.prototype), WinPanel.prototype.constructor = WinPanel, 
WinPanel.prototype.createCustomDecorations = function () {}, WinPanel.prototype.animateCustomDecorations = function () {},
WinPanel.prototype.customOnEnterFrame = function (t) {}, WinPanel.prototype.customBeforeHide = function () {},
WinPanel.prototype.customBeforeStopRolling = function () {}, WinPanel.prototype.renderMovie = function (t)
{
    this.particleContainer.clearChildren(), this._movie = new ParticleEmitter(this.particleContainer), 
    this.sizeType > ServerData.NORMAL_WIN && this._movie.addTween(new Tween(this.underlayer, "alpha", 
    0).move(1, this.timingConfig.normalWinTiming).move(0, this.timingBeforeHide - this.timingConfig.normalWinTiming).move(-1, 
    slotConfig.winPanel.hideTime)), this.deltaHeight = t.height || this.panel.height, this._movie.addTween(new Tween(this.hidingContainer, 
    "y", 600 + (t.dontPopup ?- this.deltaHeight : 0)).move(t.dontPopup ? 0 :- this.deltaHeight, slotConfig.winPanel.showTime, 
    Tween.POW, 2).move(0, this.timingBeforeHide - slotConfig.winPanel.showTime).move(t.dontHide ? 0 : this.deltaHeight, 
    slotConfig.winPanel.hideTime)), true === this.stopCondition && this._movie.addAction(function ()
    {
        this._movie.stop()
    }
    .bind(this), slotConfig.winPanel.showTime), this._movie.addAction(function ()
    {
        this.isRolling = false
    }
    .bind(this), this.counterRollDuration), this._movie.addAction(function ()
    {
        this._movie.stop(), this.stopCondition && "function" == typeof this.stopCondition && this.stopCondition()
    }
    .bind(this), this.timingBeforeHide), this._movie.addAction(this._movie.stop, this.timingBeforeHide + slotConfig.winPanel.hideTime), 
    this._movie.addAction(function ()
    {
        this.dispatchEvent(new GameEvent(GameEvent.WIN_PANEL_HIDE))
    }
    .bind(this), this.timingBeforeHide + slotConfig.winPanel.hideTime), this._movie.stop(0), this._movie.addEventListener(GameEvent.ENTER_FRAME, 
    this.onEnterFrame, this), this.animateCustomDecorations()
},
WinPanel.prototype.onEnterFrame = function (t)
{
    var e = 0, i = 50, n = 10 * gameConfig.denum;
    if (this.isRolling && this.totalSum)
    {
        var s, o = this._movie.time, a;
        switch (this.currentStage)
        {
            case 0:
                e = 0;
                break;
            case 1:
                a = o, this.totalSum >= n && (a = Math.ceil(a / i) * i), s = Math.min(a / this.currentStageDuration, 
                1), e = Math.round(Math.min(this.bigWinSum, this.totalSum) * s);
                break;
            case 2:
                this.totalSum > this.bigWinSum ? (a = o - this.timingConfig.normalWinTiming, this.totalSum >= n && (a = Math.ceil(a / i) * i), 
                this.totalSum < this.megaWinSum ? e = Math.round(Math.min(this.totalSum, this.bigWinSum + a * this.bigWinVelocity)) : (s = Math.min(a / this.currentStageDuration, 
                1), e = Math.round(this.bigWinSum + (Math.min(this.totalSum, this.megaWinSum) - this.bigWinSum) * s))) : e = this.totalSum;
                break;
            case 3:
                this.totalSum > this.megaWinSum ? (a = o - this.timingConfig.normalWinTiming - this.timingConfig.bigWinTiming, 
                this.totalSum >= n && (a = Math.ceil(a / i) * i), this.totalSum < this.afterMegaWinSum ? e = Math.round(Math.min(this.totalSum, 
                this.megaWinSum + a * this.megaWinVelocity)) : (s = Math.min(a / this.currentStageDuration, 
                1), e = Math.round(this.megaWinSum + (Math.min(this.totalSum, this.afterMegaWinSum) - this.megaWinSum) * s))) : e = this.totalSum;
                break;
            case 4:
                this.totalSum > this.afterMegaWinSum ? (a = o - this.timingConfig.normalWinTiming - this.timingConfig.bigWinTiming - this.timingConfig.megaWinTiming, 
                this.totalSum >= n && (a = Math.ceil(a / i) * i), e = this.afterMegaWinSum + Math.round(this.megaWinVelocity * a + this.afterMegaWinAcceleration * a * a / 2)) : e = this.totalSum;
                break;
            default:
                e = this.totalSum
        }
        this.rollSound || (this.rollSound = sound.play(this.rollSoundID, true))
    }
    else {
        e = this.totalSum;
    }
    this.rollSound && e == this.totalSum && (this.rollSound.stop(), this.rollSound = null, this.rollStoped || (this.sizeType > ServerData.NORMAL_WIN && sound.play("BWCountStop", 
    true), this.rollStoped = true)), this.counterValue = this.startSum + e, this.customOnEnterFrame(t);
},
WinPanel.prototype.show = function (t, e, i, n)
{
    n = n || {}, this.rollStoped = false, this.sizeType = t, this.startSum = n.addMode ? (this.totalSum || 0) + this.startSum : 0, 
    this.totalSum = isNaN(Number(e)) ? null : Number(e), this.timingConfig = $.extend({},
    slotConfig.winPanel.gameTypes[n.gameType || "main"]), this.timingConfig.normalWinTiming = t == ServerData.NORMAL_WIN ? this.timingConfig.normalWinForNormalTiming : this.timingConfig.normalWinForBigWinTiming, 
    this.forcedTimingBeforeHide = n.timingBeforeHide || null, this.totalBet = serverData.bet * serverData.lines, 
    this.bigWinSum = slotConfig.bigWinTotalBets * this.totalBet, this.megaWinSum = slotConfig.megaWinTotalBets * this.totalBet, 
    this.afterMegaWinSum = slotConfig.afterMegaWinTotalBets * this.totalBet, this.bigWinVelocity = (this.megaWinSum - this.bigWinSum) / this.timingConfig.bigWinTiming, 
    this.megaWinVelocity = (this.afterMegaWinSum - this.bigWinSum) / this.timingConfig.megaWinTiming, 
    this.totalSum && this.totalSum > this.afterMegaWinSum ? (this.afterMegaWinLeftSum = this.totalSum - this.afterMegaWinSum, 
    this.afterMegaWinAcceleration = function (t, e, i)
    {
        return 2 * (t - e * i) / (i * i)
    }
    (slotConfig.winPanel.afterMegaWinAccMaxTotalBets * this.totalBet, this.megaWinVelocity, slotConfig.winPanel.afterMegaWinAccMaxTiming), 
    this.timingConfig.afterMegaWinTiming = function (t, e, i)
    {
        return Math.floor((Math.sqrt(t * t + 2 * e * i) - t) / e)
    }
    (this.megaWinVelocity, this.afterMegaWinAcceleration, this.afterMegaWinLeftSum)) : (this.timingConfig.afterMegaWinTiming = 0, 
    this.afterMegaWinLeftSum = 0, this.afterMegaWinAcceleration = 0), this.isRolling = !clientData.winPanelStartsFromRollEnded && (n.isRolling || this.timingConfig.counterIsRolling && this.totalSum && this.totalSum >= this.totalBet), 
    this._movie && this._movie.stop(0), this.stopCondition = i, this.textWin.setId(n.textWinId || "WIN_PANEL_WIN"), 
    this.counter.setId(n.counterId || "WIN_PANEL_COUNTER"), this.renderMovie(n), this._movie.play(clientData.winPanelStartsFromRollEnded && (this.sizeType > ServerData.NORMAL_WIN || clientData.winPanelStartsFromRollEndedCustom) ? this.counterRollDuration : 0);
},
WinPanel.prototype.hide = function ()
{
    this.customBeforeHide(), this._movie.play(this.timingBeforeHide)
},
WinPanel.prototype.stopRolling = function ()
{
    this.customBeforeStopRolling(), this.isRolling = false, this._movie.play(this.timingBeforeHide - this.stillTiming);
},
WinPanel.prototype.rewindToTheEnd = function ()
{
    this.stopCondition && "function" == typeof this.stopCondition && this.stopCondition(), this._movie.time < this.timingBeforeHide && this.hide(), 
    this.customAfterRewind()
},
WinPanel.prototype.customAfterRewind = function () {}, WinPanel.prototype.getDuration = function (t, e, 
i, n)
{
    return n = n || {}, this.rollStoped = false, this.sizeType = t, this.startSum = n.addMode ? (this.totalSum || 0) + this.startSum : 0, 
    this.totalSum = isNaN(Number(e)) ? null : Number(e), this.timingConfig = $.extend({},
    slotConfig.winPanel.gameTypes[n.gameType || "main"]), this.timingConfig.normalWinTiming = t == ServerData.NORMAL_WIN ? this.timingConfig.normalWinForNormalTiming : this.timingConfig.normalWinForBigWinTiming, 
    this.forcedTimingBeforeHide = n.timingBeforeHide || null, this.totalBet = serverData.bet * serverData.lines, 
    this.bigWinSum = slotConfig.bigWinTotalBets * this.totalBet, this.megaWinSum = slotConfig.megaWinTotalBets * this.totalBet, 
    this.afterMegaWinSum = slotConfig.afterMegaWinTotalBets * this.totalBet, this.bigWinVelocity = (this.megaWinSum - this.bigWinSum) / this.timingConfig.bigWinTiming, 
    this.megaWinVelocity = (this.afterMegaWinSum - this.bigWinSum) / this.timingConfig.megaWinTiming, 
    this.totalSum && this.totalSum > this.afterMegaWinSum ? (this.afterMegaWinLeftSum = this.totalSum - this.afterMegaWinSum, 
    this.afterMegaWinAcceleration = function (t, e, i)
    {
        return 2 * (t - e * i) / (i * i)
    }
    (slotConfig.winPanel.afterMegaWinAccMaxTotalBets * this.totalBet, this.megaWinVelocity, slotConfig.winPanel.afterMegaWinAccMaxTiming), 
    this.timingConfig.afterMegaWinTiming = function (t, e, i)
    {
        return Math.floor((Math.sqrt(t * t + 2 * e * i) - t) / e)
    }
    (this.megaWinVelocity, this.afterMegaWinAcceleration, this.afterMegaWinLeftSum)) : (this.timingConfig.afterMegaWinTiming = 0, 
    this.afterMegaWinLeftSum = 0, this.afterMegaWinAcceleration = 0), this.isRolling = false, this._movie && this._movie.stop(0), 
    this.renderMovie(n), this.timingBeforeHide + slotConfig.winPanel.hideTime - (clientData.winPanelStartsFromRollEnded && (this.sizeType > ServerData.NORMAL_WIN || clientData.winPanelStartsFromRollEndedCustom) ? this.counterRollDuration : 0);
},
ReelsSpinController.prototype = Object.create(StateController.prototype), ReelsSpinController.prototype.constructor = ReelsSpinController, 
ReelsSpinController.prototype.onStart = function ()
{
    reels.quickStop = userConfig.quickSpinEnabled, this.reelsStartSequence = slotConfig.reelsStartSequence || Array.range(1, 
    slotConfig.columns), reels[this.reelsStartSequence[0]].start();
},
ReelsSpinController.prototype.onEnterFrame = function ()
{
    for (var t = 1; t < slotConfig.columns; t++)
    {
        this.hasElapsedTimeStamp(t * slotConfig.game_reel_start_interval) && reels[this.reelsStartSequence[t]].start();
    }
    var e = stage.time - this.startTime - slotConfig.game_reel_start_interval * (slotConfig.columns - 1);
    (e >= slotConfig.game_reelset_move_time || reels.quickStop && e >= slotConfig.game_reelset_min_move_time) && this.stop()
},
(new ReelsSpinController).activate(), ReelsStopController.prototype = Object.create(StateController.prototype), 
ReelsStopController.prototype.constructor = ReelsStopController, ReelsStopController.prototype.onInit = function ()
{
    for (var t = 1; t <= slotConfig.columns; t++) {
        reels[t].stop(2), this.additionalRotatingTimings[t - 1] = 0;
    }
},
ReelsStopController.prototype.onStart = function ()
{
    this.reelsStopSequence = slotConfig.reelsStopSequence || Array.range(1, slotConfig.columns), reels[this.reelsStopSequence.last()].addEventListenerOnce(GameEvent.COMPLETE, 
    this.onReelStop, this);
},
ReelsStopController.prototype.calculateAdditionalTimers = function ()
{
    for (var t = 1; t <= slotConfig.columns; t++) {
        this.additionalRotatingTimings[t - 1] = 0;
    }
},
ReelsStopController.prototype.onEnterFrame = function (t)
{
    this.calculateAdditionalTimers();
    for (var e = stage.time - this.startTime, i = 0; i < slotConfig.columns; i++)
    {
        var n = reels.quickStop ? slotConfig.game_reel_stop_interval / 2 : slotConfig.game_reel_stop_interval, 
        s = this.reelsStopSequence[i];
        i <= e / n && (reels[s].v = this.additionalRotatingTimings[s - 1] > 0 ? slotConfig.reelsHighSpeed : slotConfig.reelsStandardSpeed, 
        e > this.additionalRotatingTimings[s - 1] + e / n + 1 && reels[s].stop(reels.quickStop ? 1 : 0));
    }
},
ReelsStopController.prototype.onReelStop = function (t)
{
    reels.skipAdditionalRotating = false;
    for (var e = 1; e <= slotConfig.columns; e++) {
        this.additionalRotatingTimings[e - 1] = 0;
    }
    this.stop()
},
(new ReelsStopController).activate(), FreegamesIntroController.prototype = Object.create(StateController.prototype), 
FreegamesIntroController.prototype.constructor = FreegamesIntroController, FreegamesIntroController.prototype.duration = 4e3, 
FreegamesIntroController.prototype.onInit = function ()
{
    game.freegamesIntro && (game.freegamesIntro.visible = false);
},
FreegamesIntroController.prototype.onStart = function ()
{
    game.freegamesIntro && (game.freegamesIntro.visible = true);
},
FreegamesIntroController.prototype.onStop = function ()
{
    game.freegamesIntro && (game.freegamesIntro.visible = false);
},
FreegamesIntroController.prototype.onEnterFrame = function (t)
{
    var e = stage.time - this.startTime;
    e > this.duration && this.stop()
},
(new FreegamesIntroController).activate(), FreegamesSummaryController.prototype = Object.create(StateController.prototype), 
FreegamesSummaryController.prototype.constructor = FreegamesSummaryController, FreegamesSummaryController.prototype.duration = 4e3, 
FreegamesSummaryController.prototype.onInit = function ()
{
    game.freegamesSummary && (game.freegamesSummary.visible = false);
},
FreegamesSummaryController.prototype.onStart = function ()
{
    game.freegamesSummary && parseFloat(serverData.paid) > 0 && (game.freegamesSummary.visible = true);
},
FreegamesSummaryController.prototype.onStop = function ()
{
    game.freegamesSummary && (game.freegamesSummary.visible = false);
},
FreegamesSummaryController.prototype.onEnterFrame = function (t)
{
    var e = stage.time - this.startTime;
    (e > this.duration || 0 == parseFloat(serverData.paid)) && this.stop()
},
(new FreegamesSummaryController).activate(), FreegamesController.prototype = Object.create(StateController.prototype), 
FreegamesController.prototype.constructor = FreegamesController, FreegamesController.prototype.mandatoryRoundDelay = 0, 
FreegamesController.prototype.onStart = function ()
{
    this.currentWinNumber =- 1, this.wins = serverData.wins, this.partialAnimationsConfig = slotConfig.showPartialAnimations[this.gameType], 
    this.showPartialAnimations = userConfig.quickSpinEnabled ? this.partialAnimationsConfig.quick : this.partialAnimationsConfig.regular;
},
FreegamesController.prototype.onEnterFrame = function (t)
{
    if (clientData.freegamesActive) if (this.showPartialAnimations && this.wins.length)
    {
        var e = Math.floor((stage.time - this.startTime) / 1500);
        if (e != this.currentWinNumber)
        {
            var i = this.wins.shift();
            void 0 !== i.number ? paylines.shownLines = [i] : paylines.shownLines = [], this.winSound = game.playSoundByWinComb(i.comb), 
            game.main.paidPanel.visible = true;
            var n = Math.min(i.layout.map(function (t, e)
            {
                return t ? e : 0;
            }).max() + 1, 3), s = i.layout[n - 1];
            game.main.paidPanel.x = reels.x + Symbol.width * (n - .5) + reels.gap * (n - 1), game.main.paidPanel.y = reels.y + Symbol.height * (s - 1), 
            game.main.paidPanel.value.tPointY = 15;
            var o = game.main.paidPanel.value;
            o.tokens["value"] = h5game.formatMeter(i.paid * (clientData.freegamesActive ? serverData.freeGamesWinMultiplier || 1 : 1));
            var a = o.getRect().width;
            o.scaleX = o.scaleY = a <= 120 ? 1 : 120 / a, reels.each(function (t, e, n)
            {
                n == i.layout[e - 1] ? game.main.animatedSymbols ? (t.reset(), game.main.animatedSymbols[e][n].animate()) : t.animate() : (t.blackout(), 
                game.main.animatedSymbols && game.main.animatedSymbols[e][n] && game.main.animatedSymbols[e][n].reset())
            }), this.currentWinNumber = e;
        }
    }
    else if (clientData.freegamesActive && clientData.isActionAvailable("free.spin"))
    {
        var r = stage.time - this.startTime;
        r > this.mandatoryRoundDelay + 1500 * (this.currentWinNumber + 1) && (0 == clientData.freegamesNumber || clientData.freegamesSpinLimitReached ? this.stop() : clientData.act("free.spin"))
    }
},
FreegamesController.prototype.onStop = function ()
{
    this.winSound && this.winSound.stop()
},
(new FreegamesController).activate(), FreeWinController.prototype = Object.create(StateController.prototype), 
FreeWinController.prototype.constructor = FreeWinController, FreeWinController.prototype.onStart = function ()
{
    serverData.wins.forEach(function (t)
    {
        "freespin" == t.comb && reels.each(function (e, i, n)
        {
            n == t.layout[i - 1] ? e.animate() : e.blackout()
        })
    })
},
FreeWinController.prototype.onEnterFrame = function ()
{
    this.hasElapsedTimeStamp(2e3) && this.stop()
},
FreeWinController.prototype.onStop = function ()
{
    reels.each(function (t, e, i)
    {
        t.normal()
    })
},
(new FreeWinController).activate(), SkipController.prototype = Object.create(StateController.prototype), 
SkipController.prototype.constructor = SkipController, SkipController.prototype.onEnterFrame = function ()
{
    this.hasElapsedTimeStamp(1e3) && this.stop()
},
SkipController.prototype.onStop = function ()
{
    paylines.shownLines = [], !game.winPanel.isHiding && game.winPanel.isShown && game.winPanel.rewindToTheEnd(), 
    reels.each(function (t, e, i)
    {
        t.normal()
    })
},
new SkipController("bet.skip.spin").activate(), new SkipController("bet.skip.gamble").activate(), TotalWinController.prototype = Object.create(StateController.prototype), 
TotalWinController.prototype.constructor = TotalWinController, TotalWinController.prototype.onStart = function ()
{
    return 0 == serverData.roundPaid ? void this.stop() : (game.winPanel.show(serverData.getWinLevel(), 
    this.getWinSum(), this.stop.bind(this), this.getWinPanelOptions()), paylines.shownLines = serverData.wins.filter(function (t)
    {
        return void 0 != t.number;
    }), void this.animateSymbols())
},
TotalWinController.prototype.onStop = function ()
{
    paylines.shownLines = [], this.hidePanel(), this.deanimateSymbols();
},
TotalWinController.prototype.animateSymbols = function ()
{
    reels.each(function (t, e, i)
    {
        for (var n = false, s = 0; s < serverData.wins.length; s++) {
            n = n || i == serverData.wins[s].layout[e - 1];
        }
        n ? t.normal() : t.blackout()
    })
},
TotalWinController.prototype.deanimateSymbols = function () {}, TotalWinController.prototype.getWinPanelOptions = function ()
{
    return {
        gameType : userConfig.autoSpinEnabled ? "auto" : "main"
    }
},
TotalWinController.prototype.hidePanel = function ()
{
    game.winPanel.isVisibled && game.winPanel.hide()
},
TotalWinController.prototype.getWinSum = function ()
{
    return serverData.roundPaid;
},
(new TotalWinController).activate(), ServerData.prototype.parseGifts = function (t)
{
    var e = t.find("> gift2-spins");
    if (e.length)
    {
        this.giftOffers = e.toArray().map(function (e)
        {
            e = $(e);
            var i = e.attr("date-expire").match(/(\d+)-(\d+)-(\d+)/).slice(1).map(function (t)
            {
                return parseInt(t, 10);
            }), n = 
            {
                id : parseInt(e.attr("gift-id"), 10), spinsTotal : parseInt(e.attr("count-total"), 10), 
                spinsLeft : parseInt(e.attr("count-left"), 10), cashWinTotal : parseInt(e.attr("cash-win-total"), 
                10), status : e.attr("status"), expires : new Date(Date.UTC(i[0], i[1] - 1, i[2])), bet : parseInt(e.find("> bet").attr("cash"), 
                10), lines : Math.min(slotConfig.lines, e.find("> bet").attr("lines").split(",").max()), 
                coin : parseInt(e.find("> bet").attr("coin"), 10)
            };
            return n.totalBet = n.bet * n.lines * n.coin, "finished" != n.status && "deleted" != n.status || (this.giftspinsLastProgress = t.find("reconnect" == t.attr("command") ? ">game" : "game_type")), 
            n
        }
        .bind(this));
        var i = new GameEvent(GameEvent.GIFT_SPINS);
        i.data = this.giftOffers, this.dispatchEvent(i);
    }
},
ServerData.prototype.parseGiftActivate = function (t)
{
    var e = new GameEvent(GameEvent.GIFT_SPINS_ACTION);
    e.action = "activate", e.data = clientData.giftspinIdActivating, e.status = "ok" == this.status, clientData.giftspinIdActivating = null, 
    this.dispatchEvent(e);
},
ServerData.prototype.parseGiftRemove = function (t)
{
    var e = new GameEvent(GameEvent.GIFT_SPINS_ACTION);
    e.action = "remove", e.data = clientData.giftspinIdDeleting, e.status = "ok" == this.status, clientData.giftspinIdDeleting = null, 
    this.dispatchEvent(e);
},
ServerData.prototype.activateGiftOffer = function ()
{
    var t = connection.createMessage("gift2-activate");
    t.append($("<gift />", {
        id : clientData.giftspinIdActivating
    })), connection.send(t)
},
ServerData.prototype.removeGiftOffer = function ()
{
    var t = connection.createMessage("gift2-delete");
    t.append($("<gift />", {
        id : clientData.giftspinIdDeleting
    })), connection.send(t)
},
ServerData.prototype.markGiftOffersRead = function (t)
{
    if (arguments.length)
    {
        var e = connection.createMessage("gift2-postpone"), i = Array.fromObject(arguments);
        i.forEach(function (t)
        {
            e.append($("<gift />", {
                id : t
            }))
        }), connection.send(e)
    }
},
serverData.addParser(/.+/, serverData.parseGifts), serverData.addParser("gift2-activate", serverData.parseGiftActivate), 
serverData.addParser("gift2-delete", serverData.parseGiftRemove), ClientData.prototype.defaultData.giftspinsActive = false, 
ClientData.prototype.defaultData.giftspinsNewOffers = false, ClientData.prototype.defaultData.giftspinsInterrupted = false, 
ClientData.prototype.defaultData.giftspinsFinished = false, ClientData.prototype.defaultData.giftOffers = [], 
ClientData.prototype.defaultData.autoplayParamsSaves = [], ClientData.prototype.onGiftsSpinsAction = function (t)
{
    switch (t.action)
    {
        case "activate":
            t.status && (this.giftspinId = t.data, this.giftOffers.find(function (e)
            {
                return e.id == t.data;
            }).status = "started", this.bet = this.getCurrentGiftOffer().bet, this.actualizeGiftspinsParams(), 
            this.diff());
            break;
        case "remove":
            t.status && (this.removeGiftOfferById(t.data), this.giftspinId == t.data && (this.giftspinId = null), 
            this.actualizeGiftspinsParams(), this.diff());
    }
},
ClientData.prototype.onGiftsUpdate = function (t)
{
    var e = this.giftOffers.pluck("id");
    t.data.forEach(function (t)
    {
        if (e.indexOf(t.id) ==- 1) {
            this.giftOffers.push(t);
        }
        else
        {
            var i = this.giftOffers[this.giftOffers.findIndex(function (e)
            {
                return e.id == t.id;
            })];
            $.extend(true, i, t)
        }
    }
    .bind(this)), this.actualizeGiftspinsParams(), this.diff()
},
ClientData.prototype.actualizeGiftspinsParams = function ()
{
    this.sortGiftspins();
    var t = this.getCurrentGiftOffer();
    this.findGiftOffersByStatus("deleted").pluck("id").indexOf(this.giftspinId) !=- 1 && (this.giftspinsInterrupted = true, 
    this.isActionAvailable("giftspins.interrupt") && !clientData.freegamesActive && this.act("giftspins.interrupt")), 
    this.giftspinsActive = !!t, this.giftspinId = t ? t.id : null, this.giftspinsNewOffers = this.giftOffers.some(function (t)
    {
        return "new" == t.status;
    })
},
ClientData.prototype.sortGiftspins = function (t)
{
    var e = ["deleted", "overdue", "new", "started", "suspended", "finished"];
    (t || this.giftOffers).sort(function (t, i)
    {
        return t.status == i.status ? t.expires - i.expires : e.indexOf(t.status) - e.indexOf(i.status);
    })
},
ClientData.prototype.findGiftOfferById = function (t)
{
    return this.giftOffers.find(function (e)
    {
        return e.id == t;
    })
},
ClientData.prototype.removeGiftOfferById = function (t)
{
    this.giftOffers = this.giftOffers.filter(function (e)
    {
        return e.id != t;
    })
},
ClientData.prototype.findGiftOffersByStatus = function (t)
{
    return this.giftOffers.filter(function (e)
    {
        return e.status == t;
    })
},
ClientData.prototype.getCurrentGiftOffer = function ()
{
    return this.giftOffers.find(function (t)
    {
        return "started" == t.status;
    })
},
ClientData.prototype.getFinishedGiftOffer = function ()
{
    return this.giftOffers.find(function (t)
    {
        return "finished" == t.status;
    })
},
ClientData.prototype.saveAutoplayParams = function ()
{
    this.autoplayParamsSaves.push(
    {
        autoplayNumber : this.autoplayNumber, autoplayLossLimit : this.autoplayLossLimit, autoplaySingleWinLimit : this.autoplaySingleWinLimit
    })
},
ClientData.prototype.restoreAutoplayParams = function ()
{
    if (this.autoplayParamsSaves.length)
    {
        var t = this.autoplayParamsSaves.pop();
        this.autoplayNumber = t.autoplayNumber, this.autoplayLossLimit = t.autoplayLossLimit, this.autoplaySingleWinLimit = t.autoplaySingleWinLimit;
    }
},
clientData.addTransition({
    from : "bet.idle", to : "giftspins.activate", type : "action", action : "giftspins.activate"
}), clientData.addTransition(
{
    from : "giftspins.activate", to : "bet.idle", fail : "giftspins.activate.removed", type : "server", 
    action : serverData.activateGiftOffer
}), clientData.addTransition({
    from : "giftspins.activate.removed", to : "bet.idle", type : "auto"
}), clientData.addTransition({
    from : "bet.idle", to : "giftspins.remove", type : "action", action : "giftspins.remove"
}), clientData.addTransition(
{
    from : "giftspins.remove", to : "bet.idle", fail : "bet.idle", type : "server", action : serverData.removeGiftOffer
}), clientData.addTransition(
{
    from : "spin.fail", to : "giftspins.removed", type : "auto",
    guard : function ()
    {
        return clientData.giftspinsActive;
    },
    priority : 10
}), clientData.addTransition({
    from : "giftspins.removed", to : "spin.stop", type : "auto"
}), clientData.addTransition(
{
    from : "bet.idle", to : "giftspins.interrupted", type : "action", action : "giftspins.interrupt"
}), clientData.addTransition(
{
    from : "spin.stop", to : "giftspins.interrupted", type : "auto",
    guard : function ()
    {
        return clientData.giftspinsInterrupted && !clientData.freegamesActive;
    }
}), clientData.addTransition({
    from : "giftspins.interrupted", to : "bet.idle", type : "action", action : "close"
}), clientData.addTransition(
{
    from : "init", to : "giftspins.summary", type : "auto",
    guard : function ()
    {
        return clientData.getFinishedGiftOffer() && !serverData.freegamesActive && !serverData.freegamesNumber;
    },
    priority : 10
}), clientData.addTransition({
    from : "bet.win", to : "giftspins.summary", type : "action", action : "giftspins.summary"
}), clientData.addTransition({
    from : "bet.idle", to : "giftspins.summary", type : "action", action : "giftspins.summary"
}), clientData.addTransition({
    from : "giftspins.summary", to : "bet.idle", type : "action", action : "close"
}), clientData.addEventListener(GameEvent.ENTER_STATE, function ()
{
    "bet.idle" == clientData.state && clientData.giftspinsFinished || ("giftspins.removed" == clientData.state && (clientData.giftspinsInterrupted = true, 
    clientData.autoplayActive = false), ["giftspins.removed", "giftspins.activate.removed"].indexOf(clientData.state) !=- 1 && clientData.exitState());
}), clientData.setTransitionCallback(/^giftspins.activate$/, /bet.idle/, function ()
{
    this.stopAutoplay(), this.saveAutoplayParams(), userConfig.autoSpinEnabled = false;
}), clientData.setTransitionCallback(/giftspins.interrupted/, /.+/, function ()
{
    this.giftspinsInterrupted = false, this.actualizeGiftspinsParams();
}), clientData.setTransitionCallback(/.+/, /giftspins.(summary|interrupted|removed)/, function ()
{
    this.giftspinsActive || (this.autoplayActive && this.stopAutoplay(), this.giftspinsFinished = false, 
    this.restoreAutoplayParams());
}), clientData.setTransitionCallback(/giftspins.remove/, /.+/, function ()
{
    this.giftspinsActive || this.restoreAutoplayParams()
}), clientData.setTransitionCallback(/giftspins.summary/, /bet.idle/, function ()
{
    this.stopAutoplay(), this.removeGiftOfferById(this.getFinishedGiftOffer().id), this.actualizeGiftspinsParams()
}), AutoplayController.prototype = Object.create(StateController.prototype), AutoplayController.prototype.constructor = AutoplayController, 
AutoplayController.prototype.onStart = function ()
{
    this.currentWinNumber =- 1, this.wins = serverData.wins, this.partialAnimationsConfig = slotConfig.showPartialAnimations[this.gameType], 
    this.showPartialAnimations = userConfig.quickSpinEnabled ? this.partialAnimationsConfig.quick : this.partialAnimationsConfig.regular;
},
AutoplayController.prototype.onEnterFrame = function (t)
{
    if (this.showPartialAnimations && this.wins.length > 0 && clientData.autoplayActive)
    {
        var e = Math.floor((stage.time - this.startTime) / 1500);
        if (e != this.currentWinNumber)
        {
            var i = this.wins.shift();
            paylines.shownLines = [i], void 0 !== i.number ? (paylines.shownLines = [i], paylines.show()) : (paylines.shownLines = [], 
            paylines.hide()), game.main.paidPanel.visible = true, game.main.paidPanel.y = [reels.y + Symbol.height / 2 - 60, 
            reels.y + 3 * Symbol.height / 2 - 60, reels.y + 5 * Symbol.height / 2 - 60][i.layout[2] - 1];
            var n = game.main.paidPanel.value;
            n.tokens["value"] = h5game.formatMeter(i.paid);
            var s = n.getRect().width;
            n.scaleX = n.scaleY = s <= 120 ? 1 : 120 / s, reels.each(function (t, e, n)
            {
                n == i.layout[e - 1] ? (t.reset(), game.main.animatedSymbols[e][n].animate()) : (t.blackout(), 
                game.main.animatedSymbols[e][n] && game.main.animatedSymbols[e][n].reset())
            }), this.currentWinNumber = e;
        }
    }
    else if (clientData.autoplayActive && clientData.isActionAvailable("spin"))
    {
        var o = stage.time - this.startTime;
        o > 1500 * (this.currentWinNumber + 1) && (clientData.autoplayFinished ? this.stop() : clientData.proceedAutoplay())
    }
},
(new AutoplayController).activate(), ServerData.prototype.defaultData.thief_pos = 0, ServerData.prototype.defaultData.thief_action = [], 
ServerData.prototype.defaultData.thief_hold = 0, ServerData.prototype.defaultData.add_freespins = 0, ServerData.prototype.defaultData.accumulated_freespins = 0, 
ServerData.prototype.defaultData.bonus_round =- 1, ServerData.prototype.defaultData.bonus_pick =- 1, ServerData.prototype.defaultData.bonusKeys = 7, 
ServerData.prototype.defaultData.bonusCops = 4, ServerData.prototype.defaultData.superprizeWin = 0, ServerData.prototype.defaultData.bonusRooms = [], 
ServerData.prototype.defaultData.bonusRoomType =- 1, ServerData.prototype.defaultData.currentRoom = null, 
ServerData.prototype.defaultData.bonusPaid = 0, ServerData.prototype.defaultData.allBonusWins = 0, ServerData.prototype.defaultData.bonusGamesFinished = 0, 
ServerData.prototype.defaultData.freespinsBet = 0, ServerData.prototype.defaultData.lastSpinBet = 0, ServerData.prototype.defaultData.keysSpent =- 1, 
ServerData.prototype.defaultData.giftspinsLastProgress = null, ServerData.prototype.hasSpecialWins = function ()
{
    return this.thief_action.length > 0;
},
ServerData.prototype.hasBonusWins = function ()
{
    return this.freegamesAwarded > 0 || 6 == this.thief_action[this.thief_action.length - 1];
},
ServerData.prototype.stopFreespins = function ()
{
    this.wins = [], this.matrix = this.defaultData.matrix.slice(), this.dispatchEvent(new GameEvent(GameEvent.UPDATE));
},
ServerData.prototype.stopGiftspins = function ()
{
    this.restoreProgress(), this.wins = [];
},
ServerData.prototype.restoreProgress = function ()
{
    this.thief_action = [], this.thief_pos = Number(this.giftspinsLastProgress.attr("thief_pos")), this.thief_hold = Number(this.giftspinsLastProgress.attr("thief_hold")), 
    this.add_freespins = 0, this.accumulated_freespins = Number(this.giftspinsLastProgress.attr("accum_bonus_games"));
},
ServerData.prototype.parseFailedGiftspins = function (t)
{
    this.parseGifts(t), clientData.giftspins >= 0 && this.giftspinsLastProgress.length > 0 && this.restoreProgress()
},
ServerData.prototype.startBonus = function ()
{
    var t = connection.createMessage("bonus"), e = $("<action/>");
    if (e.attr("round", 0), t.append(e), clientData.giftspins >= 0) {
        var i = $("<gift2-spins/>");
        i.attr("id", clientData.giftspins), t.append(i)
    }
    connection.send(t), this.bonusRooms = [], this.bonus_round = 0, this.superprizeWin = 0, this.currentRoom = null;
},
ServerData.prototype.pickBonus = function ()
{
    this.bonus_pick = clientData.bonusPick;
    var t = connection.createMessage("bonus"), e = $("<action/>");
    if (e.attr("round", this.bonus_round + 1), e.attr("type", 300 + this.bonus_pick), t.append(e), clientData.giftspins >= 0) {
        var i = $("<gift2-spins/>");
        i.attr("id", clientData.giftspins), t.append(i)
    }
    connection.send(t)
},
ServerData.prototype.sendBonusShiftMessage = function (t)
{
    var e = connection.createMessage("shifter"), i = $('<game game="bonus"/>'), n = $('<shift value="' + t.join(",") + '"/>');
    i.append(n), e.append(i), connection.send(e)
},
ServerData.prototype.sendSpecialShiftMessage = function (t)
{
    for (var e = connection.createMessage("shifter"), i = $('<game game="thief_steps"/>'), n = t.join(",").split(","), 
    s = 0;
    s < n.length;
    s++) {
        var o = $('<shift value="' + n[s] + '"/>');
        i.append(o)
    }
    e.append(i), connection.send(e)
},
serverData.addParser("start", function (t)
{
    this.thief_pos = Number(t.find("game_type").attr("thief_pos")), this.thief_hold = Number(t.find("game_type").attr("thief_hold")), 
    this.accumulated_freespins = Number(t.find("game_type").attr("accum_bonus_games")), this.allBonusWins = Number(t.find("game_type").attr("bonus_total_winnings")), 
    this.bonusGamesFinished = Number(t.find("game_type").attr("bonus_games_complete")), this.defaultData.matrix = this.matrix.slice();
}), serverData.addParser("reconnect", function (t)
{
    var e = t.find("game");
    this.allBonusWins = Number(e.attr("bonus_total_winnings")), this.bonusGamesFinished = Number(e.attr("bonus_games_complete"));
    var i = t.find("spin_cmd");
    if (i.length > 0)
    {
        this.thief_pos = Number(i.find("game").attr("thief_pos")), this.thief_action = i.find("game").attr("thief_action"), 
        this.thief_action = this.thief_action ? this.thief_action.split(",").map(Number) : [], this.thief_hold = Number(i.find("game").attr("thief_hold")) - 1, 
        this.accumulated_freespins = Number(i.find("game").attr("accum_bonus_games")), this.add_freespins = Number(i.find("game").attr("add_bonus_games")), 
        this.freespinsBet = Number(i.find("game").attr("freegame_bet")) || 0, this.lastSpinBet = Number(i.find("game").attr("lastspin_bet")) || 0;
        var n = i.find("wins newwin[comb=freespin]");
        this.freegamesAwarded = n.length > 0 ? Number(n.attr("freespins")) : this.freegamesActive ? 0 : this.freegamesNumber
    }
    else
    {
        this.thief_pos = Number(t.find("game").attr("thief_pos")), this.thief_action = t.find("game").attr("thief_action"), 
        this.thief_action = this.thief_action ? this.thief_action.split(",").map(Number) : [], this.thief_hold = Number(t.find("game").attr("thief_hold")), 
        this.accumulated_freespins = Number(t.find("game").attr("accum_bonus_games")), this.add_freespins = Number(t.find("game").attr("add_bonus_games") || 0), 
        this.freespinsBet = Number(t.find("game").attr("freegame_bet")) || 0, this.lastSpinBet = Number(t.find("game").attr("lastspin_bet")) || 0;
    }
    var s = t.find("game_cmd");
    if (s.length > 0)
    {
        var o = e.find("bonus"), a = o.find("room");
        this.bonus_round = Number(o.attr("round")), this.roundPaid = 0, this.bonus_round > 0 && (this.thief_pos = Number(e.attr("thief_pos")), 
        this.thief_action = e.attr("thief_action"), this.thief_action = this.thief_action ? this.thief_action.split(",").map(Number) : [], 
        this.thief_hold = Number(e.attr("thief_hold")), this.accumulated_freespins = Number(e.attr("accum_bonus_games")), 
        this.add_freespins = Number(i.find("game").attr("add_bonus_games"))), this.bonusKeys = Number(o.attr("keys")), 
        this.bonusCops = Number(o.attr("cops")), this.bonusPaid = Number(o.attr("win")), this.keysSpent = 0;
        for (var r = 0; r < a.length; r++)
        {
            var l = 
            {
                id : Number($(a[r]).attr("id")), column : Number($(a[r]).attr("column")), row : Number($(a[r]).attr("row")), 
                width : Number($(a[r]).attr("width")), status : Number($(a[r]).attr("status")), random : Number($(a[r]).attr("random")), 
                win : Number($(a[r]).attr("win") ||- 1), type : Number($(a[r]).attr("type") ||- 1)
            };
            switch (this.bonusRooms.push(l), 1 == l.type && (this.superprizeWin = l.win), 2 == l.status && (this.currentRoom = l, 
            l.win > 0 && (this.roundPaid = l.win)), l.type) {
                case 1:
                case 4:
                this.keysSpent++;
                break;
                case 2:
                this.keysSpent += 2
            }
        }
    }
}), serverData.addParser("bet", function (t)
{
    var e = t.find("game");
    if (this.freespinsBet = Number(e.attr("freegame_bet")) || 0, this.lastSpinBet = Number(e.attr("lastspin_bet")) || 0, 
    this.bonus_round =- 1, Number(e.attr("cash-bet")) > 0)
    {
        this.thief_pos = Number(e.attr("thief_pos")), this.thief_action = e.attr("thief_action"), this.thief_action = this.thief_action ? this.thief_action.split(",").map(Number) : [], 
        this.thief_hold = Number(e.attr("thief_hold")), this.accumulated_freespins = Number(e.attr("accum_bonus_games")), 
        this.add_freespins = Number(e.attr("add_bonus_games"));
        var i = t.find("wins newwin[comb=freespin]");
        this.freegamesAwarded = i.length > 0 ? Number(i.attr("freespins")) : this.freegamesActive ? 0 : this.freegamesNumber
    }
    else {
        this.thief_pos = 0, this.thief_action = [], this.thief_hold = 0, this.add_freespins = 0;
    }
}), serverData.addParser("bonus", function (t)
{
    var e = t.find("bonus"), i = e.find("room");
    this.bonus_round = Number(e.attr("round")) || 0, this.bonusKeys = Number(e.attr("keys")), this.bonusCops = Number(e.attr("cops")), 
    this.bonusPaid = Number(e.attr("win")), this.roundPaid = 0;
    for (var n = 0; n < i.length; n++)
    {
        for (var s = false, o = 0; o < this.bonusRooms.length; o++)
        {
            this.bonusRooms[o].id == Number($(i[n]).attr("id")) && (s = true, this.bonusRooms[o].status = Number($(i[n]).attr("status")), 
            $(i[n]).attr("type") && (this.bonusRooms[o].type = Number($(i[n]).attr("type")), this.bonusRoomType = this.bonusRooms[o].type, 
            1 == this.bonusRooms[o].type && (this.superprizeWin = Number($(i[n]).attr("win")), this.roundPaid = this.superprizeWin)), 
            $(i[n]).attr("win") && (this.bonusRooms[o].win = Number($(i[n]).attr("win")), this.roundPaid = this.bonusRooms[o].win));
        }
        if (!s)
        {
            var a = 
            {
                id : Number($(i[n]).attr("id")), column : Number($(i[n]).attr("column")), row : Number($(i[n]).attr("row")), 
                width : Number($(i[n]).attr("width")), status : Number($(i[n]).attr("status")), random : Number($(i[n]).attr("random")), 
                type : Number($(i[n]).attr("type") ||- 1)
            };
            this.bonusRooms.push(a)
        }
    }
    (0 == this.bonusKeys || this.superprizeWin > 0) && (this.allBonusWins = Number(e.attr("bonus_total_winnings")), 
    this.bonusGamesFinished = Number(e.attr("bonus_games_complete")));
}), serverData.addErrorParser("bet", function (t)
{
    this.parseFailedGiftspins(t), this.paid = 0, this.roundPaid = 0, this.wins = [], this.matrix = this.defaultData.matrix.slice(), 
    this.thief_action = [], this.add_freespins = 0;
}), serverData.addErrorParser("gift2-activate", serverData.parseFailedGiftspins), serverData.addParser("gift2-delete", 
function (t)
{
    this.giftspinsLastProgress = t.find("game_type"), this.giftspinsLastProgress.length > 0 && (this.paid = 0, 
    this.roundPaid = 0, this.wins = [], this.restoreProgress());
}), serverData.addParser("sync", function (t)
{
    t.find("game_type").length > 0 && (this.giftspinsLastProgress = t.find("game_type"), this.restoreProgress());
}), ClientData.prototype.defaultData.thief_action_number = 0, ClientData.prototype.defaultData.bonusPaid = 0, 
ClientData.prototype.defaultData.bonusSuperprizePaid = 0, ClientData.prototype.defaultData.bonusKeys = 7, 
ClientData.prototype.defaultData.bonusCops = 4, ClientData.prototype.defaultData.allBonusWins = 0, ClientData.prototype.defaultData.bonusGamesFinished = 0, 
ClientData.prototype.defaultData.bonusRound =- 1, ClientData.prototype.defaultData.bonusRoomType =- 1, 
ClientData.prototype.defaultData.freespinsBet = 0, ClientData.prototype.defaultData.freePaid = 0, ClientData.prototype.getFreespinsBet = function ()
{
    return this.freespinsBet * this.lines;
},
ClientData.prototype.autoplayHasToBeTerminated = function ()
{
    return "bonus" == serverData.status || serverData.freegamesAwarded > 0;
},
clientData.removeTransition("bet.win", "bet.freewin"), clientData.addTransition(
{
    from : "init", to : "bet.win", type : "auto",
    guard : function ()
    {
        return serverData.wins.length > 0;
    },
    priority : 2
}), clientData.addTransition({
    from : "init", to : "thief.start", type : "auto", guard : hasThiefActions, priority : 1
}), clientData.addTransition(
{
    from : "init", to : "bonus.result", type : "auto",
    guard : function ()
    {
        return serverData.bonus_round > 0 && (serverData.superprizeWin > 0 || 0 == serverData.bonusKeys);
    },
    priority : 3
}), clientData.addTransition(
{
    from : "init", to : "bonus.pick", type : "auto",
    guard : function ()
    {
        return serverData.bonus_round > 0;
    },
    priority : 3
}), clientData.addTransition({
    from : "spin.stop", to : "thief.start", type : "auto", guard : hasThiefActions, priority :- .5
}), clientData.addTransition({
    from : "bet.win", to : "thief.start", type : "auto", guard : hasThiefActions
}), clientData.addTransition(
{
    from : "thief.start", to : "thief.move", type : "auto",
    guard : function ()
    {
        return 1 == serverData.thief_action[clientData.thief_action_number] || 7 == serverData.thief_action[clientData.thief_action_number] || 8 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.start", to : "thief.release", type : "auto",
    guard : function ()
    {
        return 3 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.start", to : "thief.wild", type : "auto",
    guard : function ()
    {
        return 5 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.start", to : "thief.bonus", type : "auto",
    guard : function ()
    {
        return 6 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.release", to : "thief.move", type : "auto",
    guard : function ()
    {
        return 1 == serverData.thief_action[clientData.thief_action_number] || 7 == serverData.thief_action[clientData.thief_action_number] || 8 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.release", to : "thief.wild", type : "auto",
    guard : function ()
    {
        return 5 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.release", to : "thief.bonus", type : "auto",
    guard : function ()
    {
        return 6 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.move", to : "thief.move", type : "auto",
    guard : function ()
    {
        return 1 == serverData.thief_action[clientData.thief_action_number] || 7 == serverData.thief_action[clientData.thief_action_number] || 8 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.move", to : "thief.cop", type : "auto",
    guard : function ()
    {
        return 2 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.move", to : "thief.mummy", type : "auto",
    guard : function ()
    {
        return 4 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.move", to : "thief.wild", type : "auto",
    guard : function ()
    {
        return 5 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.move", to : "thief.bonus", type : "auto",
    guard : function ()
    {
        return 6 == serverData.thief_action[clientData.thief_action_number];
    }
}), clientData.addTransition(
{
    from : "thief.move", to : "freespins.start", type : "auto",
    guard : function ()
    {
        return serverData.freegamesAwarded > 0;
    },
    priority :- 1
}), clientData.addTransition({
    from : "thief.move", to : "thief.stop", type : "auto", priority :- 2
}), clientData.addTransition({
    from : "thief.wild", to : "thief.stop", type : "auto"
}), clientData.addTransition({
    from : "thief.cop", to : "thief.stop", type : "auto"
}), clientData.addTransition({
    from : "thief.mummy", to : "thief.stop", type : "auto"
}), clientData.addTransition({
    from : "thief.release", to : "thief.stop", type : "auto", priority :- 2
}), clientData.addTransition(
{
    from : "freespins.stop", to : "thief.stop", type : "server", action : serverData.stopFreespins, mixed : true, 
    priority : 1
}), clientData.addTransition({
    from : "thief.stop", to : "bet.idle", type : "auto"
}), clientData.addTransition({
    from : "thief.bonus", to : "bonus.start", type : "auto"
}), clientData.addTransition(
{
    from : "bonus.start", to : "bonus.intro", type : "server", mixed : true, action : serverData.startBonus
}), clientData.addTransition({
    from : "bonus.intro", to : "bonus.pick", type : "auto"
}), clientData.addTransition({
    from : "bonus.pick", to : "bonus.wait", type : "action", action : "pick"
}), clientData.addTransition(
{
    from : "bonus.wait", to : "bonus.result", type : "server", mixed : true, action : serverData.pickBonus
}), clientData.addTransition(
{
    from : "bonus.result", to : "bonus.pick", type : "auto",
    guard : function ()
    {
        return serverData.bonusKeys > 0 && 0 == serverData.superprizeWin;
    }
}), clientData.addTransition(
{
    from : "bonus.result", to : "bonus.summary", type : "auto",
    guard : function ()
    {
        return serverData.bonusKeys <= 0 || serverData.superprizeWin > 0;
    }
}), clientData.addTransition({
    from : "bonus.summary", to : "thief.stop", type : "auto"
}), clientData.removeTransition("init", "giftspins.summary"), clientData.addTransition(
{
    from : "init", to : "giftspins.summary", type : "auto",
    guard : function ()
    {
        return clientData.getFinishedGiftOffer() && !serverData.freegamesActive && !serverData.freegamesNumber;
    },
    priority : .5
}), clientData.setTransitionCallback(/init/, /thief.start/, function ()
{
    this.display = Game.MAIN;
}), clientData.setTransitionCallback(/^init$/, /.+.*/, function ()
{
    this.allBonusWins = serverData.allBonusWins, this.bonusGamesFinished = serverData.bonusGamesFinished, 
    serverData.bonus_round !=- 1 && 0 != serverData.bonus_round && (this.paid = 0), this.freespinsBet = serverData.freespinsBet, 
    this.bet = clientData.freegamesActive ? this.freespinsBet : this.bet;
}), clientData.setTransitionCallback(/init/, /bonus.pick/, function ()
{
    this.display = Game.BONUS, this.bet = serverData.bet, this.bonusPaid = serverData.bonusPaid, this.balance = serverData.balance + this.bonusPaid, 
    this.bonusKeys = serverData.bonusKeys, this.bonusCops = serverData.bonusCops, this.bonusRound = serverData.bonus_round, 
    this.microround = true;
}), clientData.setTransitionCallback(/init/, /bonus.result/, function ()
{
    this.display = Game.BONUS, this.bet = serverData.bet, this.bonusPaid = serverData.bonusPaid, this.balance = serverData.balance - serverData.roundPaid, 
    this.bonusKeys = serverData.bonusKeys, this.bonusCops = serverData.bonusCops, this.bonusRound = serverData.bonus_round, 
    this.microround = true;
}), clientData.setTransitionCallback(/.+/, /spin.stop/, function ()
{
    this.freespinsBet = serverData.freespinsBet;
}), clientData.setTransitionCallback(/.+/, /bet.(win|idle)/, function ()
{
    this.balance = serverData.balance, this.freePaid = serverData.freePaid, this.microround = false;
}), clientData.setTransitionCallback(/.+/, /thief.start/, function ()
{
    this.thief_action_number = 0;
}), clientData.setTransitionCallback(/thief.(start|move|release)/, /thief.+/, function ()
{
    this.thief_action_number++
}), clientData.setTransitionCallback(/.*/, /freespins.start/, function ()
{
    this.freegamesNumber = serverData.freegamesNumber, this.freespinsBet = serverData.freespinsBet, this.bet = this.freespinsBet, 
    this.freePaid = serverData.freePaid, this.autoplayActive && (this.autoplayActive = false, this.autoplayFinished = false);
}), clientData.setTransitionCallback(/.*/, /freespins.stop/, function ()
{
    this.freePaid = serverData.freePaid;
}), clientData.setTransitionCallback(/freespins.stop/, /.*/, function ()
{
    this.freegamesActive = false, this.paid = 0, this.bet = slotConfig.coins.indexOf(serverData.lastSpinBet) ==- 1 ? slotConfig.coins[slotConfig.defaultBet] : serverData.lastSpinBet, 
    this.freespinsBet = 0;
}), clientData.setTransitionCallback(/bonus.start/, /.+/, function ()
{
    this.bonusSuperprizePaid = 0, this.bonusPaid = 0, this.bonusKeys = serverData.bonusKeys, this.bonusCops = serverData.bonusCops, 
    this.microround = true, this.bonusRound = 0, this.autoplayActive && (this.autoplayActive = false, 
    this.autoplayFinished = false);
}), clientData.setTransitionCallback(/.+/, /bonus.result/, function ()
{
    this.bonusRoomType = serverData.bonusRoomType, this.allBonusWins = serverData.allBonusWins, this.bonusGamesFinished = serverData.bonusGamesFinished;
}), clientData.setTransitionCallback(/bonus.result/, /.+/, function ()
{
    this.bonusKeys = serverData.bonusKeys, this.bonusCops = serverData.bonusCops, this.bonusPaid = serverData.bonusPaid, 
    this.bonusSuperprizePaid = serverData.superprizeWin, this.bonusSuperprizePaid > 0 && (this.bonusPaid -= this.bonusSuperprizePaid), 
    this.balance += serverData.roundPaid;
}), clientData.setTransitionCallback(/bonus.summary/, /.+/, function ()
{
    this.microround = false, this.bonusRound =- 1, this.bet = slotConfig.coins.indexOf(this.bet) ==- 1 ? slotConfig.coins[slotConfig.defaultBet] : this.bet;
}), clientData.setTransitionCallback(/giftspins.summary/, /.+/, function ()
{
    serverData.stopGiftspins()
}), clientData.addEventListener(GameEvent.UPDATE, function (t)
{
    "init" != t.diff.state && void 0 == t.diff.freegamesActive && "bonus.intro" != clientData.state && "bonus.summary" != t.diff.state || (game.bg_sound && game.bg_sound.stop(), 
    game.bg_sound = sound.play(/bonus/.test(clientData.state) ? "bonus_ambience" : clientData.freegamesActive ? "freespin_ambience" : "main_ambience", 
    true));
}), WinningsController.prototype = Object.create(StateController.prototype), WinningsController.prototype.constructor = WinningsController, 
WinningsController.prototype.onStart = function ()
{
    this.currentWinNumber =- 1, this.partialAnimationsConfig = slotConfig.showPartialAnimations[this.gameType], 
    this.showPartialAnimations = userConfig.quickSpinEnabled ? this.partialAnimationsConfig.quick : this.partialAnimationsConfig.regular, 
    reels.each(function (t, e, i)
    {
        for (var n = false, s = 0; s < serverData.wins.length; s++) {
            n = n || i == serverData.wins[s].layout[e - 1] && "bonus" != serverData.wins[s].comb;
        }
        if (n)
        {
            var o = game.main.animatedSymbols[e][i] = Symbol.get(t.id, e);
            game.main.animatedSymbols[e].addChild(o), o.y = Symbol.height * (i - 1), o.reset();
        }
    })
},
WinningsController.prototype.onEnterFrame = function ()
{
    if (!clientData.freegamesActive && !clientData.autoplayActive && this.showPartialAnimations && serverData.wins.length > 0 && serverData.bonus_round ==- 1)
    {
        var t = Math.floor((stage.time - this.startTime) / 1500);
        if (t != this.currentWinNumber)
        {
            var e = serverData.wins[t % serverData.wins.length];
            t < serverData.wins.length && game.playSoundByWinComb(e.comb), void 0 !== e.number ? (paylines.shownLines = [e], 
            paylines.show()) : (paylines.shownLines = [], paylines.hide()), game.main.paidPanel.visible = true;
            var i = game.main.paidPanel.value;
            i.tokens["value"] = h5game.formatMeter(e.paid);
            var n = i.getRect().width, s = i.getRect().height;
            i.scaleX = i.scaleY = n <= 178 ? 1 : 178 / n, "scat" == e.comb ? game.main.paidPanel.y = reels.y + (3 * Symbol.height - s * i.scaleY) / 2 : game.main.paidPanel.y = [reels.y + (Symbol.height - s * i.scaleY) / 2, 
            reels.y + (3 * Symbol.height - s * i.scaleY) / 2, reels.y + (5 * Symbol.height - s * i.scaleY) / 2][e.layout[2] - 1], 
            reels.each(function (t, i, n)
            {
                n == e.layout[i - 1] ? (t.reset(), game.main.animatedSymbols[i][n].animate()) : (t.blackout(), 
                game.main.animatedSymbols[i][n] && game.main.animatedSymbols[i][n].reset())
            }), this.currentWinNumber = t;
        }
    }
},
WinningsController.prototype.onStop = function ()
{
    paylines.shownLines = [], paylines.hide(), reels.each(function (t)
    {
        t.normal()
    }), game.main.paidPanel.visible = false, reels.skipBstopAnimation = false;
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t].clearChildren();
        for (var e = 1; e <= slotConfig.rows; e++) {
            game.main.animatedSymbols[t][e] = null;
        }
    }
},
(new WinningsController).activate(), Rays.prototype = Object.create(DisplayObjectContainer.prototype), 
Rays.prototype.constructor = Rays, Rays.prototype.applyRaysPosition = function (t, e)
{
    if (void 0 === t && (t = game.main.thief.step), void 0 === e && (e = true), t > 0 && t < 16)
    {
        var i = t;
        this.x = 235, this.y = 35, this.x = [235, 413, 591, 769, 947, 947, 769, 591, 413, 235, 235, 413, 
        591, 769, 947][i - 1], this.y = [40, 40, 40, 40, 40, 201, 201, 201, 201, 201, 362, 362, 362, 362, 
        362][i - 1], this.visible = true, this._movie.play(0), e && sound.play("rays_on")
    }
    else {
        this.visible = false;
    }
},
Rays.prototype.disable = function ()
{
    this._movie.play(2801), sound.play("rays_off")
},
Thief.prototype = Object.create(DisplayObjectContainer.prototype), Thief.prototype.constructor = Thief, 
Thief.prototype.appear = function (t)
{
    this.applyPosition(this.step + 1);
    var e = this.movieAppear = new MovieClip;
    e.addTween(new Tween(this.head, "scaleX", 0).move(1, 250).move(0, 500).move(-1, 250)), e.addTween(new Tween(this.head, 
    "scaleY", 0).move(1, 250).move(0, 500).move(-1, 250)), e.addAction(e.stop, 1001), t && e.addEventListenerOnce(GameEvent.COMPLETE, 
    t), e.play(0)
},
Thief.prototype.appearQuick = function ()
{
    this.movieAppear && this.movieAppear.play(1e3)
},
Thief.prototype.disappear = function ()
{
    this.head.scaleX = this.head.scaleY = 0;
},
Thief.prototype.moveHead = function (t, e)
{
    var i = Math.min(this.step + t, 16), n = this.movieHead = new MovieClip, s = [1, 1, 1, 1, 1, - 1, 
     - 1, - 1, - 1, - 1, 1, 1, 1, 1, 1, 1][this.step - 1], o = [1, 1, 1, 1, 1, - 1, - 1, - 1, - 1, - 1, 
    1, 1, 1, 1, 1, 1][i - 1];
    n.addTween(new Tween(this.head, "scaleX", 0).move(s, 250).move(0, 250).move(-s, 250).move(0, 250).move(o, 
    250).move(0, 500).move(-o, 250)), n.addTween(new Tween(this.head, "scaleY", 0).move(1, 250).move(0, 
    250).move(-1, 250).move(0, 250).move(1, 250).move(0, 500).move(-1, 250)), n.addAction(function ()
    {
        this.applyPosition(i)
    }
    .bind(this), 1e3), n.addAction(n.stop, 2001), e && n.addEventListenerOnce(GameEvent.COMPLETE, e), 
    n.play(0)
},
Thief.prototype.moveHeadQuick = function (t)
{
    if (this.movieHead) {
        this.movieHead.play(2e3);
    }
    else
    {
        var e = Math.min(this.step + t, 16);
        this.applyPosition(e), this.head.scaleX = this.head.scaleY = 0;
    }
},
Thief.prototype.windUp = function (t)
{
    var e = this.movieWindUp = new MovieClip, i = [1, 1, 1, 1, 1, - 1, - 1, - 1, - 1, - 1, 1, 1, 1, 1, 
    1][this.step - 1], n = [1, 1, 1, 1, 1, - 1, - 1, - 1, - 1, - 1, 1, 1, 1, 1, 1][this.step > 2 ? this.step - 3 : 0];
    e.addTween(new Tween(this.head, "scaleX", 0).move(-i, 250).move(0, 250).move(i, 250).move(0, 250).move(-n, 
    250).move(0, 500).move(n, 250)), e.addTween(new Tween(this.head, "scaleY", 0).move(1, 250).move(0, 
    250).move(-1, 250).move(0, 250).move(1, 250).move(0, 500).move(-1, 250)), e.addAction(function ()
    {
        this.applyPosition(this.step > 2 ? this.step - 2 : this.step - 1)
    }
    .bind(this), 1e3), e.addAction(e.stop, 2001), t && e.addEventListenerOnce(GameEvent.COMPLETE, t), 
    e.play()
},
Thief.prototype.windUpQuick = function ()
{
    this.movieWindUp && this.movieWindUp.play(2e3)
},
Thief.prototype.arrest = function (t)
{
    var e = game.main.arrest;
    e.visible = true, e.x = [0, 267, 415, 595, 773, 953, 1170, 953, 773, 595, 415, 269, 415, 593, 773, 
    953][this.step], e.y = [0, 138, 138, 138, 138, 138, 300, 300, 300, 300, 300, 472, 472, 472, 472, 472][this.step], 
    e.scaleX = [0, 1, 1, 1, 1, 1, - 1, 1, 1, 1, 1, 1, 1, 1, 1, 1][this.step], e.text.setId([1, 11].indexOf(this.step) >= 0 ? "SPINS_TO_RELEASE_LEFT_SIDE" : 6 == this.step ? "SPINS_TO_RELEASE_RIGHT_SIDE" : "SPINS_TO_RELEASE_FRONT"), 
    e.text.scaleX = e.scaleX, e.text.tokens["value"] = 3, e.val = 3, e.front.visible = e.side.visible = false;
    var i = [1, 6, 11].indexOf(this.step) >= 0 ? e.side : e.front;
    i.visible = true;
    var n = this.arrestMovie = new MovieClip;
    n.addTween(new SpriteTween(i).move("0-5", 500)), n.addTween(new Tween(e.text, "alpha", 0).move(0, 
    400).move(1, 100)), n.addAction(n.stop, 501), t && n.addEventListenerOnce(GameEvent.COMPLETE, t), 
    n.play(0)
},
Thief.prototype.arrestQuick = function ()
{
    var t = game.main.arrest;
    t.visible = true, t.x = [0, 267, 415, 595, 773, 953, 1170, 953, 773, 595, 415, 269, 415, 593, 773, 
    953][this.step], t.y = [0, 138, 138, 138, 138, 138, 300, 300, 300, 300, 300, 472, 472, 472, 472, 472][this.step], 
    t.scaleX = [0, 1, 1, 1, 1, 1, - 1, 1, 1, 1, 1, 1, 1, 1, 1, 1][this.step], t.text.setId([1, 11].indexOf(this.step) >= 0 ? "SPINS_TO_RELEASE_LEFT_SIDE" : 6 == this.step ? "SPINS_TO_RELEASE_RIGHT_SIDE" : "SPINS_TO_RELEASE_FRONT"), 
    t.text.scaleX = t.scaleX, t.text.tokens["value"] = 3, t.text.alpha = 1, t.val = 3, t.front.visible = t.side.visible = false;
    var e = [1, 6, 11].indexOf(this.step) >= 0 ? t.side : t.front;
    e.visible = true, e.frame = 5;
},
Thief.prototype.restoreArrest = function ()
{
    var t = game.main.arrest;
    if (serverData.thief_hold > 0 || 3 == serverData.thief_action[clientData.thief_action_number] && t.visible)
    {
        t.visible = true, t.x = [0, 267, 415, 595, 773, 953, 1170, 953, 773, 595, 415, 269, 415, 593, 
        773, 953][this.step], t.y = [0, 138, 138, 138, 138, 138, 300, 300, 300, 300, 300, 472, 472, 472, 
        472, 472][this.step], t.scaleX = [0, 1, 1, 1, 1, 1, - 1, 1, 1, 1, 1, 1, 1, 1, 1, 1][this.step], 
        t.text.setId([1, 11].indexOf(this.step) >= 0 ? "SPINS_TO_RELEASE_LEFT_SIDE" : 6 == this.step ? "SPINS_TO_RELEASE_RIGHT_SIDE" : "SPINS_TO_RELEASE_FRONT"), 
        t.text.scaleX = t.scaleX, t.text.tokens["value"] = serverData.thief_hold, t.text.alpha = serverData.thief_hold > 0 ? 1 : 0, 
        t.val = serverData.thief_hold, t.front.visible = t.side.visible = false;
        var e = [1, 6, 11].indexOf(this.step) >= 0 ? t.side : t.front;
        e.visible = true, e.frame = 5
    }
    else {
        t.visible = false;
    }
},
Thief.prototype.release = function (t)
{
    var e = game.main.arrest;
    e.visible = true, e.x = [0, 267, 415, 595, 773, 953, 1170, 953, 773, 595, 415, 269, 415, 593, 773, 
    953][this.step], e.y = [0, 138, 138, 138, 138, 138, 300, 300, 300, 300, 300, 472, 472, 472, 472, 472][this.step], 
    e.scaleX = [0, 1, 1, 1, 1, 1, - 1, 1, 1, 1, 1, 1, 1, 1, 1, 1][this.step], e.text.scaleX = e.scaleX, 
    e.front.visible = e.side.visible = false;
    var i = [1, 6, 11].indexOf(this.step) >= 0 ? e.side : e.front;
    i.visible = true;
    var n = new MovieClip;
    n.addTween(new SpriteTween(i).move("5-0", 500)), n.addAction(function ()
    {
        n.stop(), e.visible = false;
    }, 500), t && n.addEventListenerOnce(GameEvent.COMPLETE, t), n.play(0)
},
Thief.prototype.getPosition = function (t)
{
    void 0 === t && (t = this.step);
    var e = {};
    return e.column = [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5][t], e.row = [0, 1, 1, 1, 1, 1, 
    2, 2, 2, 2, 2, 3, 3, 3, 3, 3][t], e;
},
Thief.prototype.applyPosition = function (t)
{
    void 0 === t && (t = this.step), t > 0 && (this.head.x = this.headPositionX[t - 1], this.head.y = this.headPositionY[t - 1]);
},
clientData.addEventListener(GameEvent.UPDATE, function (t)
{
    ("init" == t.diff.state || "giftspins.activate" == t.diff.state || "giftspins.summary" == t.diff.state || "giftspins.interrupted" == t.diff.state || "giftspins.remove" == t.diff.state && serverData.giftspinsLastProgress.length > 0) && (game.main.thief.step = serverData.thief_pos, 
    game.main.thief.applyPosition(game.main.thief.step), game.main.thief.disappear(), game.background.rays.applyRaysPosition(game.main.thief.step, 
    false), game.main.thief.restoreArrest()), t.diff.state && "bet.idle" == clientData.state && (game.main.thief.skipMove = false), 
    t.diff.state && "spin.start" == t.diff.state && "spin.stop" == clientData.state && (game.main.arrest.val--, 
    game.main.arrest.text.tokens["value"] = game.main.arrest.val, 0 == game.main.arrest.val && (game.main.arrest.text.alpha = 0)), 
    "freespins.stop" == t.diff.state && (game.main.thief.step = 0);
}), sound.init(
{
    path : "sound", resources : ["res/sounds/game_ambience.mp3", "res/sounds/reel_spin.mp3", "res/sounds/reel_stop.mp3", 
    "res/sounds/spin_click.mp3", "res/sounds/stop_click.mp3", "res/sounds/auto_popup.mp3", "res/sounds/big_win_counter.mp3", 
    "res/sounds/big_win_counter_stop.mp3", "res/sounds/big_win_start.mp3", "res/sounds/bonus_ambience.mp3", 
    "res/sounds/bonus_item_click.mp3", "res/sounds/bonus_key_add.mp3", "res/sounds/bonus_key_lose.mp3", 
    "res/sounds/bonus_popup.mp3", "res/sounds/bonus_popup_win.mp3", "res/sounds/bonus_robber_move.mp3", 
    "res/sounds/bonus_video_steals.mp3", "res/sounds/counter.mp3", "res/sounds/diamond.mp3", "res/sounds/freespin_ambience.mp3", 
    "res/sounds/freespin_popup.mp3", "res/sounds/freespin_popup_win.mp3", "res/sounds/low_cash.mp3", "res/sounds/mega_win_start.mp3", 
    "res/sounds/pathway.mp3", "res/sounds/redlines_off.mp3", "res/sounds/redlines_on.mp3", "res/sounds/robber_mummy.mp3", 
    "res/sounds/robber_security.mp3", "res/sounds/win_bonus_short.mp3", "res/sounds/win_combinations.mp3", 
    "res/sounds/win_cop_short.mp3", "res/sounds/win_move_open.mp3", "res/sounds/win_move_short.mp3", "res/sounds/win_mumie_short.mp3", 
    "res/sounds/win_museum_short.mp3", "res/sounds/win_small1_short.mp3", "res/sounds/win_small2_short.mp3", 
    "res/sounds/win_small3_short.mp3", "res/sounds/win_small4_short.mp3", "res/sounds/win_venus_short.mp3", 
    "res/sounds/win_crown_short.mp3", "res/sounds/win_wild_freespins.mp3", "res/sounds/win_wild_short.mp3"], 
    tracks : 
    {
        main_ambience : {
            file : "res/sounds/game_ambience.mp3", loop : true, music : true
        },
        spin : {
            file : "res/sounds/reel_spin.mp3", loop : true
        },
        reels_stop : {
            file : "res/sounds/reel_stop.mp3"
        },
        spin_click : {
            file : "res/sounds/spin_click.mp3"
        },
        autoplay_click : {
            file : "res/sounds/spin_click.mp3"
        },
        autoplay_stop : {
            file : "res/sounds/stop_click.mp3"
        },
        auto_popup : {
            file : "res/sounds/auto_popup.mp3"
        },
        dialog_low_balance : {
            file : "res/sounds/low_cash.mp3"
        },
        pathway : {
            file : "res/sounds/pathway.mp3"
        },
        pult : {
            file : "res/sounds/win_move_short.mp3"
        },
        pult_move : {
            file : "res/sounds/win_move_open.mp3"
        },
        weight : {
            file : "res/sounds/robber_security.mp3"
        },
        wind_up : {
            file : "res/sounds/robber_mummy.mp3"
        },
        J : {
            file : "res/sounds/win_small4_short.mp3"
        },
        Q : {
            file : "res/sounds/win_small3_short.mp3"
        },
        K : {
            file : "res/sounds/win_small2_short.mp3"
        },
        A : {
            file : "res/sounds/win_small1_short.mp3"
        },
        museum : {
            file : "res/sounds/win_museum_short.mp3"
        },
        mumie : {
            file : "res/sounds/win_mumie_short.mp3"
        },
        cop : {
            file : "res/sounds/win_cop_short.mp3"
        },
        venus : {
            file : "res/sounds/win_venus_short.mp3"
        },
        crown : {
            file : "res/sounds/win_crown_short.mp3"
        },
        wild : {
            file : "res/sounds/win_wild_short.mp3"
        },
        wild_free : {
            file : "res/sounds/win_wild_freespins.mp3"
        },
        bonus : {
            file : "res/sounds/win_bonus_short.mp3"
        },
        total_win : {
            file : "res/sounds/win_combinations.mp3"
        },
        winRollSound : {
            file : "res/sounds/counter.mp3", loop : true
        },
        bigWinRollSound : {
            file : "res/sounds/big_win_counter.mp3", loop : true
        },
        BWCountStop : {
            file : "res/sounds/big_win_counter_stop.mp3"
        },
        popup_bigwin : {
            file : "res/sounds/big_win_start.mp3"
        },
        popup_megawin : {
            file : "res/sounds/mega_win_start.mp3"
        },
        freespins_start : {
            file : "res/sounds/freespin_popup.mp3"
        },
        freespin_ambience : {
            file : "res/sounds/freespin_ambience.mp3", loop : true, music : true
        },
        freespins_stop : {
            file : "res/sounds/freespin_popup_win.mp3"
        },
        bonus_ambience : {
            file : "res/sounds/bonus_ambience.mp3", loop : true, music : true
        },
        bonus_start : {
            file : "res/sounds/bonus_popup.mp3"
        },
        bonus_stop : {
            file : "res/sounds/bonus_popup_win.mp3"
        },
        bonus_pick : {
            file : "res/sounds/bonus_item_click.mp3"
        },
        bonus_add_key : {
            file : "res/sounds/bonus_key_add.mp3"
        },
        bonus_remove_key : {
            file : "res/sounds/bonus_key_lose.mp3"
        },
        bonus_superprize_room : {
            file : "res/sounds/big_win_start.mp3"
        },
        bonus_cop_room : {
            file : "res/sounds/bonus_robber_move.mp3"
        },
        bonus_steal_room : {
            file : "res/sounds/bonus_video_steals.mp3"
        },
        rays_on : {
            file : "res/sounds/redlines_on.mp3"
        },
        rays_off : {
            file : "res/sounds/redlines_off.mp3"
        },
        diamond : {
            file : "res/sounds/diamond.mp3"
        }
    }
}), TotalWinController.prototype.onStart = function ()
{
    var t = TotalWinController.prototype.onStart;
    return function ()
    {
        t.call(this), this.bigwinInfoTextShown = false, serverData.roundPaid > 0 && sound.play("total_win");
    }
}(),
Game.handleSounds = function (t)
{
    if (t.diff.state)
    {
        "spin.stop" == t.diff.state && sound.stop();
        var e = {
            "spin.start" : "spin"
        }
        [clientData.state];
        e && sound.play(e)
    }
},
Reels.prototype.handleTouch = function (t, e, i)
{
    return t != GameEvent.TOUCH_END || !/spin.(start|stop)/.test(clientData.state) || (this.skipAdditionalRotating || reels.blink.play(0), 
    this.skipAdditionalRotating = true, false);
},
Reels.prototype.createFrame = function (t)
{
    var e = imageLoader.createBuffer(1, 1).getContext("2d"), i = e.createLinearGradient(0, 0, Symbol.width, 
    0);
    i.addColorStop(0, "transparent"), i.addColorStop(.1, "#8EE6FF"), i.addColorStop(.9, "#8EE6FF"), i.addColorStop(1, 
    "transparent");
    var n = new Rectangle(t, 0, Symbol.width, Symbol.height * slotConfig.rows, i), s = n.movie = new MovieClip;
    return s.addTween(new Tween(n, "alpha", 0).move(.1, 100).move(.2, 500).move(-.2, 500)), s.addAction(s.play, 
    1100, 100), s.play(0), n
},
Symbol.width = 178, Symbol.height = 161, Symbol.number = 13, slotConfig.gameTitle = "ART OF THE HEIST", 
slotConfig.columns = 5, slotConfig.rows = 3, slotConfig.lines = 21, slotConfig.linesSet = [21], slotConfig.coins = [1, 
2, 3, 4, 5, 7, 10, 15, 20, 25, 40, 50, 100, 200, 300], slotConfig.defaultBet = 4, slotConfig.noGiftSpins = true, 
slotConfig.notCachingImage = !ENV.isAndroid, slotConfig.supportsLowResolutionGraphics = true, slotConfig.extendedSpinRound = true, 
slotConfig.showPartialAnimations.freeSpins.regular = slotConfig.showPartialAnimations.freeSpins.quick = slotConfig.showPartialAnimations.auto.regular = slotConfig.showPartialAnimations.auto.quick = false, 
slotConfig.winPanel.gameTypes.main.normalWinStillTiming = slotConfig.winPanel.gameTypes.bonus.normalWinStillTiming = slotConfig.winPanel.gameTypes.freeSpins.normalWinStillTiming = slotConfig.winPanel.gameTypes.auto.normalWinStillTiming = 1e3, 
slotConfig.analyticsTrackingID = "UA-70459305-7", reels.gap = 0, reels.x = 275, reels.y = 82, Game.prototype.playSoundByWinComb = function (t)
{
    switch (t)
    {
        case 13:
            return sound.play("pult");
        case 12:
            return sound.play("J");
        case 11:
            return sound.play("Q");
        case 10:
            return sound.play("K");
        case 9:
            return sound.play("A");
        case 8:
            return sound.play("museum");
        case 7:
            return sound.play("mumie");
        case 6:
            return sound.play("cop");
        case 5:
            return sound.play("venus");
        case 4:
            return sound.play("crown");
        case 3:
            return sound.play("wild");
        case 2:
            return sound.play("wild_free");
        case "scat":
            return sound.play("bonus");
    }
},
Game.prototype.getMainResourceList = function ()
{
    return ["symbols.png", "symbols_blur.png", "bonus/background.png", "bonus/arrow.png", "bonus/robber.png", 
    "bonus/animation/rob_hide.png", "bonus/animation/rob_steals.png", "bonus/animation/sec_front_1.png", 
    "bonus/animation/sec_front_2.png", "bonus/animation/sec_side.png", "bonus/interior/icons/coin_little.png", 
    "bonus/interior/icons/key_minus.png", "bonus/interior/icons/key_plus.png", "bonus/interior/objects/box.png", 
    "bonus/interior/objects/crown.png", "bonus/interior/objects/console.png", "bonus/interior/objects/helmet.png", 
    "bonus/interior/objects/plinth.png", "bonus/interior/objects/vase.png", "bonus/interior/objects/vordrobes_1.png", 
    "bonus/interior/objects/vordrobes_2.png", "bonus/interior/objects/back/b_g.png", "bonus/interior/objects/back/b_r.png", 
    "bonus/interior/objects/back/b_y.png", "bonus/interior/objects/back/box_1.png", "bonus/interior/objects/back/box_2.png", 
    "bonus/interior/objects/back/box_3.png", "bonus/interior/objects/back/box_4.png", "bonus/interior/objects/back/broom.png", 
    "bonus/interior/objects/back/bucket.png", "bonus/interior/objects/back/chair.png", "bonus/interior/objects/front/boxes_front_1.png", 
    "bonus/interior/objects/front/boxes_front_2.png", "bonus/interior/objects/front/bucket.png", "bonus/interior/objects/front/ni_left.png", 
    "bonus/interior/objects/front/ni_right.png", "bonus/interior/objects/front/pipes.png", "bonus/interior/objects/front/start.png", 
    "bonus/interior/pictures/0.png", "bonus/interior/pictures/1.png", "bonus/interior/pictures/2.png", 
    "bonus/interior/pictures/3.png", "bonus/interior/pictures/4.png", "bonus/interior/pictures/5.png", 
    "bonus/interior/pictures/6.png", "bonus/interior/pictures/7.png", "bonus/interior/wallpapers/0_long.png", 
    "bonus/interior/wallpapers/0_short.png", "bonus/interior/wallpapers/1_long.png", "bonus/interior/wallpapers/1_short.png", 
    "bonus/interior/wallpapers/2_long.png", "bonus/interior/wallpapers/2_short.png", "bonus/interior/wallpapers/3_long.png", 
    "bonus/interior/wallpapers/3_short.png", "bonus/interior/wallpapers/blackout_long.png", "bonus/interior/wallpapers/blackout_short.png", 
    "bonus/interior/wallpapers/start.png", "bonus/interior/wallpapers/superprize.png", "bonus/left_bar/bar_bg.png", 
    "bonus/left_bar/h.png", "bonus/left_bar/k.png", "bonus/rooms/icons/hand_glow.png", "bonus/rooms/icons/handcaffs.png", 
    "bonus/rooms/icons/key.png", "bonus/rooms/icons/lock.png", "bonus/rooms/icons/money.png", "bonus/rooms/long/closed_disabled.png", 
    "bonus/rooms/long/closed_enabled.png", "bonus/rooms/long/interior_frame.png", "bonus/rooms/long/opened_current.png", 
    "bonus/rooms/long/opened_disabled.png", "bonus/rooms/long/superprize.png", "bonus/rooms/short/closed_disabled.png", 
    "bonus/rooms/short/closed_enabled.png", "bonus/rooms/short/interior_frame.png", "bonus/rooms/short/opened_current.png", 
    "bonus/rooms/short/opened_disabled.png", "bonus/rooms/short/superprize.png", "main-game/background.png", 
    "main-game/fog.png", "main-game/logo.png", "main-game/produced.png", "main-game/arrow.png", "main-game/fs_counter.png", 
    "main-game/diamond.png", "main-game/arrow.png", "thief/arrest_front.png", "thief/arrest_side.png", 
    "thief/rays.png", "thief/robber.png", "freespins/background.jpg", "freespins/logo.png", "freespins/produced.png", 
    "sym01.png", "sym02_1.png", "sym02_2.png", "sym02_3.png", "sym03.png", "sym04.png", "sym05.png", "sym06.png", 
    "sym07.png", "sym08.png", "sym09.png", "sym10.png", "sym11.png", "sym12.png", "sym13.png", "wild.png", 
    "lines/1.png", "lines/2.png", "lines/3.png", "lines/4.png", "lines/5.png", "lines/6.png", "lines/7.png", 
    "lines/8.png", "lines/9.png", "lines/10.png", "lines/11.png", "lines/12.png", "lines/13.png", "lines/14.png", 
    "lines/15.png", "lines/16.png", "lines/17.png", "lines/18.png", "lines/19.png", "lines/20.png", "lines/21.png", 
    "paytable/pictures/1.png", "paytable/pictures/2.png", "paytable/pictures/3.png", "paytable/pictures/4.png", 
    "paytable/pictures/5.png", "paytable/pictures/6.png", "paytable/pictures/7.png", "paytable/pictures/8.png", 
    "paytable/pictures/9.png", "popups/fs_start.png", "popups/fs_summary.png", "popups/bonus_start.png", 
    "popups/bonus_summary.png", "win-panel/panel.png", "win-panel/coin.png", "win-panel/coin-static.png", 
    "win-panel/dollar.png", "win-panel/big-win-background-1.png", "win-panel/big-win-background-2.png", 
    "win-panel/mega-win-background.png", "win-panel/title-big-win.png", "win-panel/title-mega-win.png", 
    "win-panel/mega-rays.png"]
},
SymbolsFeeder.prototype._getRandom = SymbolsFeeder.prototype.getRandom, SymbolsFeeder.prototype.getRandom = function ()
{
    var t = this._getRandom();
    return 2 == t ? 4 : t;
},
Symbol.get = function (t, e)
{
    var i, n;
    if (void 0 === e && (e = 1), t < 14)
    {
        var s = {
            1 : 1, 2 : 2, 3 : 2, 4 : 3, 5 : 4, 6 : 5, 7 : 6, 8 : 7, 9 : 8, 10 : 9, 11 : 10, 12 : 11, 13 : 12
        }
        [t] - 1;
        if (i = new Symbol(t, 2 == t ? [1, 1, 2, 3, 3][e - 1] : 1), 2 == t)
        {
            n = new Sprite("sym02_" + [1, 1, 2, 3, 3][e - 1] + ".png", [4, 4, 5, 6, 6][e - 1], [5, 5, 
            4, 3, 3][e - 1]), n.frame = 0, n.scaleX = 2, n.scaleY = 2, n.x = Math.floor((this.width - 2 * n.width)  / 2), 
            n.y = Math.floor((this.height * [1, 1, 2, 3, 3][e - 1] - 2 * n.height)  / 2), i.states.normal.addChild(n), 
            n = new Sprite("sym02_" + [1, 1, 2, 3, 3][e - 1] + ".png", [4, 4, 5, 6, 6][e - 1], [5, 5, 
            4, 3, 3][e - 1]), n.frame = 0, n.alpha = .5, n.scaleX = 2, n.scaleY = 2, n.x = Math.floor((this.width - 2 * n.width)  / 2), 
            n.y = Math.floor((this.height * [1, 1, 2, 3, 3][e - 1] - 2 * n.height)  / 2), i.states.blackout.addChild(n), 
            n = new Sprite("sym02_" + [1, 1, 2, 3, 3][e - 1] + ".png", [4, 4, 5, 6, 6][e - 1], [5, 5, 
            4, 3, 3][e - 1]), n.frame = 16, n.scaleX = 2, n.scaleY = 2, n.x = Math.floor((this.width - 2 * n.width)  / 2), 
            n.y = Math.floor((this.height * [1, 1, 2, 3, 3][e - 1] - 2 * n.height)  / 2), i.states.blur.addChild(n), 
            i.movie = new MovieClip, n = i.states.animation.sprite = new Sprite("sym02_" + [1, 1, 2, 3, 
            3][e - 1] + ".png", [4, 4, 5, 6, 6][e - 1], [5, 5, 4, 3, 3][e - 1]), n.scaleX = 2, n.scaleY = 2, 
            n.x = Math.floor((this.width - 2 * n.width)  / 2), n.y = Math.floor((this.height * [1, 1, 
            2, 3, 3][e - 1] - 2 * n.height)  / 2), i.movie.addTween(new SpriteTween(n).move("0-15", 1500)), 
            i.movie.addAction(i.movie.stop, 1500), i.states.animation.addChild(n), i.wilds = [], 1 == e || 2 == e ? (i.wilds[0] = new Sprite("wild.png", 
            4, 4), i.wilds[0].x = Math.floor((this.width - i.wilds[0].width)  / 2), i.wilds[0].y = Math.floor((this.height - i.wilds[0].height)  / 2), 
            i.wilds[0].alpha = 0, i.states.animation.addChild(i.wilds[0])) : 3 == e ? (i.wilds[0] = new Sprite("wild.png", 
            4, 4), i.wilds[0].x = Math.floor((this.width - i.wilds[0].width)  / 2), i.wilds[0].y = Math.floor((this.height - i.wilds[0].height)  / 2), 
            i.wilds[0].alpha = 0, i.states.animation.addChild(i.wilds[0]), i.wilds[1] = new Sprite("wild.png", 
            4, 4), i.wilds[1].x = Math.floor((this.width - i.wilds[1].width)  / 2), i.wilds[1].y = Math.floor((this.height - i.wilds[1].height)  / 2) + this.height, 
            i.wilds[1].alpha = 0, i.states.animation.addChild(i.wilds[1])) : (i.wilds[0] = new Sprite("wild.png", 
            4, 4), i.wilds[0].x = Math.floor((this.width - i.wilds[0].width)  / 2), i.wilds[0].y = Math.floor((this.height - i.wilds[0].height)  / 2), 
            i.wilds[0].alpha = 0, i.states.animation.addChild(i.wilds[0]), i.wilds[1] = new Sprite("wild.png", 
            4, 4), i.wilds[1].x = Math.floor((this.width - i.wilds[1].width)  / 2), i.wilds[1].y = Math.floor((this.height - i.wilds[1].height)  / 2) + this.height, 
            i.wilds[1].alpha = 0, i.states.animation.addChild(i.wilds[1]), i.wilds[2] = new Sprite("wild.png", 
            4, 4), i.wilds[2].x = Math.floor((this.width - i.wilds[1].width)  / 2), i.wilds[2].y = Math.floor((this.height - i.wilds[1].height)  / 2) + 2 * this.height, 
            i.wilds[2].alpha = 0, i.states.animation.addChild(i.wilds[2]));
        }
        else
        {
            switch (n = new Sprite("symbols.png", 3, 4), n.frame = s, n.x = Math.floor((this.width - n.width) / 2), 
            n.y = Math.floor((this.height - n.height) / 2), i.states.normal.addChild(n), n = new Sprite("symbols.png", 
            3, 4), n.frame = s, n.alpha = .5, n.x = Math.floor((this.width - n.width) / 2), n.y = Math.floor((this.height - n.height) / 2), 
            i.states.blackout.addChild(n), n = new Sprite("symbols_blur.png", 3, 4), n.frame = s, n.x = Math.floor((this.width - n.width) / 2), 
            n.y = Math.floor((this.height - n.height) / 2), i.states.blur.addChild(n), i.movie = new MovieClip, 
            true)
            {
                case 1 == t:
                n = i.states.animation.sprite = new Sprite("sym01.png", 3, 4), n.x = Math.floor((this.width - n.width) / 2), 
                n.y = Math.floor((this.height - n.height) / 2), i.movie.addTween(new SpriteTween(n).move("0-9", 
                1500)), i.movie.addAction(i.movie.stop, 1500);
                break;
                case 8 == t:
                n = i.states.animation.sprite = new Sprite("sym08.png", 4, 5), n.scaleX = 2, n.scaleY = 2, 
                n.x = Math.floor((this.width - 2 * n.width) / 2), n.y = Math.floor((this.height - 2 * n.height) / 2), 
                i.movie.addTween(new SpriteTween(n).move("1-18", 1500)), i.movie.addAction(i.movie.stop, 
                1500);
                break;
                case 13 == t:
                n = i.states.animation.sprite = new Sprite("sym13.png", 7, 8), n.scaleX = 2, n.scaleY = 2, 
                n.x = Math.floor((this.width - 2 * n.width) / 2), n.y = Math.floor((this.height - 2 * n.height) / 2), 
                i.steps = new TextField("VALUE_PULT_STEPS"), i.steps.visible = false, i.movie.addTween(new SpriteTween(n).move("0-16", 
                1500).move("17", 200).move("17-43", 1866).move("43", 1100).move("43-55", 866)), i.movie.addTween(new Tween(i.steps, 
                Tween.ALPHA_FUNC, 0).move(0, 1500).move(1, 1e3, Tween.JUMP).move(0, 200).move(-1, 1e3)), 
                i.movie.addTween(new Tween(i.steps, Tween.SCALE_FUNC, 1).move(0, 1500).move(0, 1200).move(2, 
                1e3)), i.movie.addAction(i.movie.stop, 1500), i.movie.addAction(i.movie.stop, 5500);
                break;
                default:
                n = i.states.animation.sprite = new Sprite(String.format("sym{0}.png", TextUtils.widthedNumber(t, 
                2)), 4, 5), n.scaleX = 2, n.scaleY = 2, n.x = Math.floor((this.width - 2 * n.width) / 2), 
                n.y = Math.floor((this.height - 2 * n.height) / 2), i.movie.addTween(new SpriteTween(n).move("0-16", 
                1500)), i.movie.addAction(i.movie.stop, 1500)
            }
            i.states.animation.addChild(n), 13 == t && i.states.animation.addChild(i.steps);
        }
    }
    return i;
},
Symbol.prototype.animate = function (t, e, i)
{
    if (this.reset(), this.states.animation.visible = true, this.movie.attributes.win = t, this.movie.attributes.column = e, 
    this.movie.attributes.row = i, 13 == this.id) this.steps.visible = false;
    else if (2 == this.id && "bet.win" == clientData.state)
    {
        for (var n = null, e = 1; e <= slotConfig.columns; e++)
        {
            for (var s = game.main.animatedSymbols[e], i = 1; i <= slotConfig.rows; i++)
            {
                if (s[i] == this)
                {
                    if (null == n && 1 == i) {
                        n = i + 1 - this.height;
                    }
                    else {
                        if (null == n) {
                            n = i;
                            break 
                        }
                        n++ 
                    }
                    if (null != n) {
                        break;
                    };
                }
            }
        }
        for (var o = 0; o < this.height; o++)
        {
            for (var a = false, r = 0; r < serverData.wins.length && n + o > 0; r++) {
                a = a || n + o == serverData.wins[r].layout[e - 1];
            }
            a && this.wilds ? (this.movie.addTween(new Tween(this.wilds[o], "alpha", 1).move(-1, 1500, 
            Tween.JUMP)), this.movie.addTween(new SpriteTween(this.wilds[o]).move("0-15", 1500))) : this.wilds && (this.wilds[o].alpha = 0);
        }
    }
    this.movie.play(0), this.updateStateSize()
},
Symbol.prototype.special = function ()
{
    this.reset(), this.states.animation.visible = true, 13 == this.id && (this.steps.visible = true, this.steps.tokens["value"] = 1 == serverData.thief_action[clientData.thief_action_number - 1] ? 1 : 7 == serverData.thief_action[clientData.thief_action_number - 1] ? 2 : 3, 
    this.steps.x = this.states.animation.sprite.x + this.states.animation.sprite.width, this.steps.y = this.states.animation.sprite.y + (2 * this.states.animation.sprite.height - this.steps.getRect().height) / 2, 
    this.movie.play(1501));
},
game.addEventListener(GameEvent.INIT_COMPLETE, function ()
{
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        reels[t].addEventListener(GameEvent.COMPLETE, function (t) 
        {
            return function () 
            {
                sound.play("reels_stop") 
            }
        }
        (t));
    }
    var e = game.background.bg = new Sprite("main-game/background.png"), i = game.background.fbg = new Sprite("freespins/background.jpg");
    game.background.addChild(e), game.background.addChild(i);
    var n = new Sprite("main-game/fog.png");
    n.x = 270, n.y = 78, game.background.addChild(n);
    var s = game.background.rays = new Rays;
    game.background.addChild(s);
    var o = new Sprite("main-game/logo.png");
    o.x = 405, o.y =- 12, game.main.addChild(o);
    var a = imageLoader.createBuffer(1, 1).getContext("2d"), r = a.createLinearGradient(0, 0, reels.width, 
    0);
    r.addColorStop(0, "transparent"), r.addColorStop(.03, "#8EE6FF"), r.addColorStop(.97, "#8EE6FF"), 
    r.addColorStop(1, "transparent");
    var l = new Rectangle(0, 0, reels.width, reels.height, r);
    l.alpha = 0;
    var h = l.movie = new MovieClip;
    h.addTween(new Tween(l, "alpha", 0).move(.24, 100).move(-.24, 100)), reels.blink = h, reels.addChild(l), 
    reels.moveChild(l, 10);
    var u = game.main.animatedSymbols = new DisplayObjectContainer;
    u.x = reels.x, u.y = reels.y;
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t] = new DisplayObjectContainer, game.main.animatedSymbols[t].x = reels[t].x, 
        game.main.animatedSymbols[t].y = reels[t].y, game.main.animatedSymbols.addChild(game.main.animatedSymbols[t]);
    }
    game.main.addChild(u), u._performDraw = u.performDraw, u.performDraw = function (t)
    {
        clientData.freegamesActive && (t.beginPath(), t.rect(0, 0, Symbol.width * slotConfig.columns, 
        Symbol.height * slotConfig.rows), t.clip()), this._performDraw(t)
    };
    var d = game.main.thief = new Thief;
    game.main.addChild(game.main.thief);
    var c = game.main.arrest = new DisplayObjectContainer;
    c.visible = false, c.front = new Sprite("thief/arrest_front.png", 3, 2), c.addChild(c.front), c.side = new Sprite("thief/arrest_side.png", 
    3, 2), c.addChild(c.side), c.text = new TextField, c.addChild(c.text), c.val = 0, game.main.addChild(c);
    var p = game.main.paidPanel = new DisplayObjectContainer;
    p.value = new TextField("VALUE_LINE_WIN"), p.addChild(p.value), p.x = reels.x + 5 * Symbol.width / 2, 
    p.y = reels.y + Symbol.height / 2, p.visible = false, game.main.addChild(p), ui.gameInfoBar.nextMessage = function ()
    {
        if (this.messageQueue.length > 0) {
            var t = this.messageQueue.shift();
            this.showById("game", t.id, t.timeOut)
        }
        else
        {
            clientData.autoplayActive ? this.showById("game", "INFO_MAIN_" + Math.floor(10 * Math.random() + 1), 
            6e3) : this.showById("game", "INFO_MAIN_" + Math.floor(9 * Math.random() + 1), 6e3);
        }
    },
    ui.gameInfoBar.onClientUpdate(function (t)
    {
        if ("init" == t.diff.state && this.showById("game", "ACTION_MAIN_START", 2e3), t.diff.state)
        {
            if ("bonus.start" != clientData.state && "freespins.start" != clientData.state || this.showById("game", 
            "ACTION_BONUS_WIN_EMPTY", 0), clientData.display == Game.BONUS && ("bonus.summary" == clientData.state ? this.showById("game", 
            "ACTION_BONUS_END", 6e3) : "bonus.pick" == clientData.state && (clientData.bonusPaid > 0 ? this.showById("game", 
            "ACTION_BONUS_WIN", 0, {
                value : h5game.formatMeter(clientData.bonusPaid)
            }) : this.showById("game", "ACTION_BONUS_WIN_EMPTY", 0))), clientData.freegamesActive) switch (clientData.state)
            {
                case "bet.win":
                serverData.getWinLevel(serverData.roundPaid) == ServerData.NORMAL_WIN && "bonus" != serverData.status && this.showById("game", 
                "ACTION_MAIN_WIN", 0, {
                    value : h5game.formatMeter(serverData.roundPaid)
                });
                break;
                case "freespins.stop":
                this.showById("game", "ACTION_FREE_END", 7e3);
                break;
                case "spin.start":
                this.showById("game", "INFO_FREE", 0)
            }
            else
            {
                switch (clientData.state) 
                {
                    case "thief.mummy":
                        this.showById("game", "ACTION_MAIN_MUMMY", 11e3);
                        break;
                    case "thief.cop":
                        this.showById("game", "ACTION_MAIN_COP", 6e3);
                        break;
                    case "bet.win":
                        serverData.getWinLevel(serverData.roundPaid) == ServerData.NORMAL_WIN && "bonus" != serverData.status && this.showById("game", 
                        "ACTION_MAIN_WIN", 6e3, {
                            value : h5game.formatMeter(serverData.roundPaid) 
                        });
                        break;
                    case "bonus.summary":
                        this.showById("game", "ACTION_BONUS_END", 6e3) 
                }
            }
            void 0 !== t.diff.autoplayActive && clientData.autoplayActive && this.showById("game", "ACTION_AUTO", 
            2e3)
        }
        else (t.diff.bet || t.diff.lines) && "bet.idle" == clientData.state && (this.maxBetMessage = clientData.bet == slotConfig.coins.max() ? {
            id : "ACTION_MAIN_MAX_BET", timeOut : 3e3
        }
         : {})
    });
    var m = false;
    game.winPanel.addEventListener(GameEvent.WIN_PANEL_ROLLING_STOP, function ()
    {
        "bet.win" == clientData.state && game.winPanel.sizeType > ServerData.NORMAL_WIN && !m && (game.winPanel.sizeType > ServerData.BIG_WIN ? ui.gameInfoBar.showById("game", 
        "ACTION_MAIN_MEGA_WIN", 0, {
            value : h5game.formatMeter(serverData.roundPaid)
        }) : ui.gameInfoBar.showById("game", "ACTION_MAIN_BIG_WIN", 0, {
            value : h5game.formatMeter(serverData.roundPaid)
        }), m = true);
    }), game.winPanel.addEventListener(GameEvent.WIN_PANEL_HIDE, function ()
    {
        m && (m = false, ui.gameInfoBar.clearAndNextMessage());
    }), game.main.thiefPath = createThiefPath(), game.main.addChild(game.main.thiefPath);
    var f = game.main.accumulatedFreespins = createAccumulatedFreespins();
    game.main.addChild(f);
    var g = game.main.freespinsCounter = new TextField("VALUE_FREESPINS");
    game.main.addChild(g), g.onClientUpdate(function (t)
    {
        g.tokens["value"] = clientData.freegamesNumber;
    });
    var b = game.main.freeTotalWinText = new TextField("FREESPINS_TOTAL_WIN_TEXT");
    game.main.addChild(b), b.onClientUpdate(function (t)
    {
        if (t.diff.state)
        {
            switch (clientData.state) 
            {
                case "init":
                    this.tokens["value"] = currencyFormatter.format(clientData.freePaid);
                    break;
                case "freespins.start":
                    this.tokens["value"] = currencyFormatter.format(0);
            }
        }
    }), clientData.addEventListener(GameEvent.UPDATE, function (t)
    {
        e.visible = n.visible = o.visible = f.visible = !clientData.freegamesActive, i.visible = g.visible = b.visible = clientData.freegamesActive;
    });
    var y = game.main.bgShadow = new Rectangle(0, 0, 1440, 720, "rgba(0,0,0,0.7)");
    y.visible = false, game.main.addChild(y), game.main.removeChild(game.freegamesIntro), game.main.addChild(game.freegamesIntro), 
    game.main.removeChild(game.freegamesSummary), game.main.addChild(game.freegamesSummary), game.background.handleTouch = function (t)
    {
        t == GameEvent.TOUCH_START && this.dispatchEvent(new GameEvent(GameEvent.CLICK))
    }
}), WinPanel.prototype.createCustomDecorations = function ()
{
    this.customDecorations = 
    {
        bigWinBackground1 : new Sprite("win-panel/big-win-background-1.png"), bigWinBackground2 : new Sprite("win-panel/big-win-background-2.png"), 
        megaWinBackground : new Sprite("win-panel/mega-win-background.png"), megaRays1 : new Sprite("win-panel/mega-rays.png"), 
        megaRays2 : new Sprite("win-panel/mega-rays.png"), bigWinTitle : new Sprite("win-panel/title-big-win.png"), 
        megaWinTitle : new Sprite("win-panel/title-mega-win.png"), coinsSound : null
    },
    this.customDecorations.bigWinBackground1.x =- 274, this.customDecorations.bigWinBackground1.y =- 438, 
    this.customDecorations.bigWinBackground1.tPointX = this.customDecorations.bigWinBackground1.width / 2, 
    this.customDecorations.bigWinBackground1.tPointY = this.customDecorations.bigWinBackground1.height, 
    this.customDecorations.bigWinBackground1.alpha = 0, this.background.addChild(this.customDecorations.bigWinBackground1), 
    this.customDecorations.bigWinBackground2.x =- 274, this.customDecorations.bigWinBackground2.y =- 438, 
    this.customDecorations.bigWinBackground2.tPointX = 574, this.customDecorations.bigWinBackground2.tPointY = 560, 
    this.customDecorations.bigWinBackground2.alpha = 0, this.background.addChild(this.customDecorations.bigWinBackground2), 
    this.customDecorations.megaRays1.x =- 274, this.customDecorations.megaRays1.y =- 438, this.customDecorations.megaRays1.tPointX = 574, 
    this.customDecorations.megaRays1.tPointY = 560, this.customDecorations.megaRays1.alpha = 0, this.background.addChild(this.customDecorations.megaRays1), 
    this.customDecorations.megaRays2.x =- 274, this.customDecorations.megaRays2.y =- 438, this.customDecorations.megaRays2.tPointX = 574, 
    this.customDecorations.megaRays2.tPointY = 560, this.customDecorations.megaRays2.scaleX =- 1, this.customDecorations.megaRays2.alpha = 0, 
    this.background.addChild(this.customDecorations.megaRays2), this.customDecorations.megaWinBackground.x =- 200, 
    this.customDecorations.megaWinBackground.y =- 411, this.customDecorations.megaWinBackground.alpha = 0, 
    this.customDecorations.megaWinBackground.blendMode = DisplayObject.BLEND_MODES.ADD, this.background.addChild(this.customDecorations.megaWinBackground), 
    this.customDecorations.bigWinTitle.x = 75, this.customDecorations.bigWinTitle.y =- this.customDecorations.bigWinTitle.height / 2 - 30, 
    this.customDecorations.bigWinTitle.tPointX = this.customDecorations.bigWinTitle.width / 2, this.customDecorations.bigWinTitle.tPointY = this.customDecorations.bigWinTitle.height / 2, 
    this.customDecorations.bigWinTitle.alpha = 0, this.titles.addChild(this.customDecorations.bigWinTitle), 
    this.customDecorations.megaWinTitle.x = 26, this.customDecorations.megaWinTitle.y =- this.customDecorations.megaWinTitle.height / 2 - 30, 
    this.customDecorations.megaWinTitle.tPointX = this.customDecorations.megaWinTitle.width / 2, this.customDecorations.megaWinTitle.tPointY = this.customDecorations.megaWinTitle.height / 2, 
    this.customDecorations.megaWinTitle.alpha = 0, this.titles.addChild(this.customDecorations.megaWinTitle);
},
WinPanel.prototype.animateCustomDecorations = function ()
{
    if (this.rollSoundID = this.sizeType > 0 ? "bigWinRollSound" : "winRollSound", this.sizeType != ServerData.NORMAL_WIN)
    {
        var t = 
        {
            spawnPointX : 320, spawnPointXDeviation : 100, spawnPointY : 0, spawnPointYDeviation : 0, 
            spawnSpeed : 15, startSpeed : 210, startSpeedDeviation : 25, endSpeed : 100, endSpeedDeviation : 50, 
            scale : 1.2, scaleDeviation : .2, angle :- Math.PI / 2, angleDeviation : Math.PI / 4, rotation : 0, 
            rotationDeviation : Math.PI / 4, rotationSpeed : 0, rotationSpeedDeviation : Math.PI / 12, 
            opacity : .7, opacityDeviation : .3, opacityLowsFromDistance : 200, opacityLowsTillDistance : 300, 
            spriteSheet : "win-panel/coin.png", spriteColumns : 32, spriteRows : 1, spritePattern : "0-31", 
            spritePatternDuration : 1200
        },
        e = 
        {
            spawnPointX : 320, spawnPointXDeviation : 300, spawnPointY : 0, spawnPointYDeviation : 0, 
            spawnSpeed : 20, startSpeed : 175, startSpeedDeviation : 25, endSpeed : 100, endSpeedDeviation : 50, 
            scale : 1.2, scaleDeviation : .5, angle :- Math.PI / 2, angleDeviation : Math.PI / 8, rotation : 0, 
            rotationDeviation : Math.PI / 4, rotationSpeed : 0, rotationSpeedDeviation : Math.PI / 12, 
            opacity : .5, opacityDeviation : .3, opacityLowsFromDistance : 150, opacityLowsTillDistance : 250, 
            spriteSheet : "win-panel/coin-static.png"
        };
        if (this._movie.spawn(t, this.timingConfig.normalWinTiming, this.timingBeforeHide - this.timingConfig.normalWinTiming), 
        this._movie.spawn(e, this.timingConfig.normalWinTiming, this.timingBeforeHide - this.timingConfig.normalWinTiming), 
        this.sizeType > ServerData.BIG_WIN)
        {
            var i = [
            {
                spawnPointX : 170, spawnPointXDeviation : 170, spawnPointY : 0, spawnPointYDeviation : 0, 
                spawnSpeed : 3, startSpeed : 175, startSpeedDeviation : 25, endSpeed : 100, endSpeedDeviation : 50, 
                scale : 2, scaleDeviation : .2, angle :- 120 * Math.PI / 180, angleDeviation : 30 * Math.PI / 180, 
                rotation : 0, rotationDeviation : Math.PI, rotationSpeed : 0, rotationSpeedDeviation : 30 * Math.PI / 180, 
                opacity : .7, opacityDeviation : 0, opacityLowsFromDistance : 150, opacityLowsTillDistance : 250, 
                spriteSheet : "win-panel/dollar.png", spriteColumns : 7, spriteRows : 1, spritePattern : "0-6", 
                spritePatternDuration : 450
            },
            {
                spawnPointX : 470, spawnPointXDeviation : 170, spawnPointY : 0, spawnPointYDeviation : 0, 
                spawnSpeed : 3, startSpeed : 175, startSpeedDeviation : 25, endSpeed : 100, endSpeedDeviation : 50, 
                scale : 2, scaleDeviation : .2, angle :- 60 * Math.PI / 180, angleDeviation : 30 * Math.PI / 180, 
                rotation : 0, rotationDeviation : Math.PI, rotationSpeed : 0, rotationSpeedDeviation : 30 * Math.PI / 180, 
                opacity : .7, opacityDeviation : 0, opacityLowsFromDistance : 150, opacityLowsTillDistance : 250, 
                spriteSheet : "win-panel/dollar.png", spriteColumns : 7, spriteRows : 1, spritePattern : "0-6", 
                spritePatternDuration : 450
            },
            {
                spawnPointX : 320, spawnPointXDeviation : 20, spawnPointY : 0, spawnPointYDeviation : 0, 
                spawnSpeed : 1, startSpeed : 175, startSpeedDeviation : 25, endSpeed : 100, endSpeedDeviation : 50, 
                scale : 2, scaleDeviation : .2, angle :- 90 * Math.PI / 180, angleDeviation : 20 * Math.PI / 180, 
                rotation : 0, rotationDeviation : Math.PI, rotationSpeed : 0, rotationSpeedDeviation : 30 * Math.PI / 180, 
                opacity : .7, opacityDeviation : 0, opacityLowsFromDistance : 150, opacityLowsTillDistance : 250, 
                spriteSheet : "win-panel/dollar.png", spriteColumns : 7, spriteRows : 1, spritePattern : "0-6", 
                spritePatternDuration : 450
            }];
            i.forEach(function (t)
            {
                this._movie.spawn(t, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming, 
                this.timingBeforeHide - (this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming))
            }
            .bind(this))
        }
        var n = 300, s = 300, o = 300, a = 300;
        this.sizeType == ServerData.BIG_WIN ? (this._movie.addTween(new Tween(this.customDecorations.bigWinBackground1, 
        "alpha", 0).move(0, this.timingConfig.normalWinTiming).move(1, n).move(0, this.timingConfig.bigWinTiming + this.stillTiming - n).move(-1, 
        slotConfig.winPanel.hideTime)), this._movie.addTween(new Tween(this.customDecorations.bigWinBackground2, 
        "alpha", 0).move(0, this.timingConfig.normalWinTiming).move(1, n).move(-1, (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(1, 
        (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(-1, (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(1, 
        (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(-1, (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(1, 
        (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(-1, (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(1, 
        (this.timingConfig.bigWinTiming + this.stillTiming - n) / 8).move(-1, slotConfig.winPanel.hideTime)), 
        this._movie.addTween(new Tween(this.customDecorations.bigWinBackground2, "rotate", 0).move(0, 
        this.timingConfig.normalWinTiming).move(12 / 180 * Math.PI, (this.timingConfig.bigWinTiming + this.stillTiming) / 4).move(-12 / 180 * Math.PI, 
        (this.timingConfig.bigWinTiming + this.stillTiming) / 4).move(12 / 180 * Math.PI, (this.timingConfig.bigWinTiming + this.stillTiming) / 4).move(-12 / 180 * Math.PI, 
        (this.timingConfig.bigWinTiming + this.stillTiming) / 4))) : (this._movie.addTween(new Tween(this.customDecorations.bigWinBackground1, 
        "alpha", 0).move(0, this.timingConfig.normalWinTiming).move(1, n).move(0, this.timingConfig.bigWinTiming - n).move(-1, 
        s)), this._movie.addTween(new Tween(this.customDecorations.bigWinBackground2, "alpha", 0).move(0, 
        this.timingConfig.normalWinTiming).move(1, n).move(-1, (this.timingConfig.bigWinTiming - n) / 4).move(1, 
        (this.timingConfig.bigWinTiming - n) / 4).move(-1, (this.timingConfig.bigWinTiming - n) / 4).move(1, 
        (this.timingConfig.bigWinTiming - n) / 4).move(-1, s)), this._movie.addTween(new Tween(this.customDecorations.bigWinBackground2, 
        "rotate", 0).move(0, this.timingConfig.normalWinTiming).move(12 / 180 * Math.PI, this.timingConfig.bigWinTiming / 2).move(-12 / 180 * Math.PI, 
        this.timingConfig.bigWinTiming / 2)));
        var r = new Tween(this.customDecorations.bigWinTitle, "alpha", 0).move(0, this.timingConfig.normalWinTiming).move(1, 
        .6 * n);
        r = this.sizeType == ServerData.BIG_WIN ? r.move(0, this.timingConfig.bigWinTiming + this.stillTiming - slotConfig.winPanel.hideTime).move(-1, 
        slotConfig.winPanel.hideTime) : r.move(0, this.timingConfig.bigWinTiming - s).move(-1, s), this._movie.addTween(r);
        var l = new Tween(this.customDecorations.bigWinTitle, Tween.SCALE_FUNC, 1.4).move(0, this.timingConfig.normalWinTiming).move(-.4, 
        .6 * n).move(.1, .2 * n).move(-.1, .2 * n);
        this.sizeType == ServerData.MEGA_WIN && (l = l.move(0, this.timingConfig.bigWinTiming - n).move(-.9, 
        s)), this._movie.addTween(l);
        var h = 500, u = 1, d = 3, c = this.timingConfig.bigWinTiming, p = Math.round((c - h * u) / (u + 1)), 
        m = new Tween(this.customDecorations.bigWinTitle, "rotate", 0).move(0, this.timingConfig.normalWinTiming + p);
        u.times(function (t)
        {
            this._movie.addAction(function () {}, this.timingConfig.normalWinTiming + p + (p + h) * t), 
            d.times(function ()
            {
                m = m.move(-5 * Math.PI / 180, h / 4 / d).move(10 * Math.PI / 180, h / 2 / d).move(-5 * Math.PI / 180, 
                h / 4 / d);
            }), m = m.move(0, p)
        }
        .bind(this)), this._movie.addTween(m), this._movie.addTween(new Tween(this.textWin, Tween.SCALE_FUNC, 
        1).move(0, this.timingConfig.normalWinTiming).move(-1, s));
        var f = new Tween(this.counter, function (t, e)
        {
            Tween.SCALE_FUNC(t, e), t.tPointY = t.getRect().height / 2;
        }, 1).move(0, this.timingConfig.normalWinTiming).move(.3, n);
        if (this.sizeType == ServerData.MEGA_WIN && (f = f.move(0, this.timingConfig.bigWinTiming - n).move(.5, 
        o)), this._movie.addTween(f), this.sizeType == ServerData.MEGA_WIN)
        {
            this._movie.addTween(new Tween(this.customDecorations.megaWinTitle, "alpha", 0).move(0, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming).move(1, 
            .6 * o).move(0, this.timingBeforeHide - (this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming) - .6 * o - a).move(-1, 
            a)), this._movie.addTween(new Tween(this.customDecorations.megaWinTitle, Tween.SCALE_FUNC, 
            1.4).move(0, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming).move(-.6, 
            .6 * o).move(.4, .2 * o).move(-.2, .2 * o));
            var g = 500, b = 2, y = 3, v = this.timingConfig.megaWinTiming + this.timingConfig.afterMegaWinTiming, 
            C = Math.round((v - g * b) / (b + 1)), w = new Tween(this.customDecorations.megaWinTitle, 
            "rotate", 0).move(0, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + C);
            b.times(function (t)
            {
                this._movie.addAction(function () {}, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + C + (C + g) * t), 
                y.times(function ()
                {
                    w = w.move(-5 * Math.PI / 180, g / 4 / y).move(10 * Math.PI / 180, g / 2 / y).move(-5 * Math.PI / 180, 
                    g / 4 / y);
                }), w = w.move(0, C)
            }
            .bind(this)), this._movie.addTween(w), this._movie.addTween(new Tween(this.customDecorations.megaWinBackground, 
            "alpha", 0).move(0, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming).move(1, 
            o).move(0, this.timingBeforeHide - (this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming) - o - a).move(-1, 
            a));
            var S = this.timingBeforeHide - (this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming) - o - a;
            this._movie.addTween(new Tween(this.customDecorations.megaRays1, "alpha", 0).move(0, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming).move(1, 
            o).move(-1, S / 6).move(1, S / 6).move(-1, S / 6).move(1, S / 6).move(-1, S / 6).move(1, S / 6).move(-1, 
            a)), this._movie.addTween(new Tween(this.customDecorations.megaRays1, "rotate", 0).move(0, 
            this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming).move(Math.PI / 24 / (S / 6) * o, 
            o).move(Math.PI / 24, S / 6).move(-Math.PI / 12, 0, Tween.JUMP).move(Math.PI / 12, S / 3).move(-Math.PI / 12, 
            0, Tween.JUMP).move(Math.PI / 12, S / 3).move(-Math.PI / 12, 0, Tween.JUMP).move(Math.PI / 24, 
            S / 6)), this._movie.addTween(new Tween(this.customDecorations.megaRays2, "alpha", 0).move(0, 
            this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + o).move(1, S / 6).move(-1, 
            S / 6).move(1, S / 6).move(-1, S / 6).move(1, S / 6).move(-1, S / 6)), this._movie.addTween(new Tween(this.customDecorations.megaRays2, 
            "rotate", - Math.PI / 12).move(0, this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming + o).move(Math.PI / 12, 
            S / 3).move(-Math.PI / 12, 0, Tween.JUMP).move(Math.PI / 12, S / 3).move(-Math.PI / 12, 0, 
            Tween.JUMP).move(Math.PI / 12, S / 3))
        }
        this._movie.addAction(function ()
        {
            game.winPanel.sizeType > ServerData.NORMAL_WIN && (this.bigWinSound = sound.play("popup_bigwin"))
        }
        .bind(this), this.timingConfig.normalWinTiming), this._movie.addAction(function ()
        {
            game.winPanel.sizeType == ServerData.MEGA_WIN && (this.megaWinSound = sound.play("popup_megawin"))
        }
        .bind(this), this.timingConfig.normalWinTiming + this.timingConfig.bigWinTiming);
    }
},
WinPanel.prototype.customOnEnterFrame = function (t)
{
    this.sizeType != ServerData.NORMAL_WIN && (this.rollStoped && (this.customDecorations.coinsSound && this.customDecorations.coinsSound.stop(), 
    this.customDecorations.coinsSound = null, this.bigWinSound && this.bigWinSound.stop(), this.megaWinSound && this.megaWinSound.stop()), 
    this._movie.hasElapsedTimeStamp(this.timingConfig.normalWinTiming, t) && (this.customDecorations.coinsSound = sound.play("coinsSound", 
    true)));
},
WinPanel.prototype.customBeforeHide = function ()
{
    this.customDecorations.coinsSound && this.customDecorations.coinsSound.stop(), this.customDecorations.coinsSound = null;
},
UISpinMenu.prototype.soundSpin = function ()
{
    sound.play("spin_click")
},
UISpinMenu.prototype.soundAutoSpin = function ()
{
    sound.play("autoplay_click")
},
UISpinMenu.prototype.soundAutoSpinStop = function ()
{
    sound.play("autoplay_stop")
},
UIConfirmPopup.prototype.soundShow = function (t)
{
    ["AUTOPLAY_REPEAT_TITLE"].indexOf(t) !=- 1 && sound.play("auto_popup")
},
UIInfoPopup.prototype.soundShow = function (t)
{
    ["POPUP_BET_REDUCED", "POPUP_NO_MONEY"].indexOf(t) !=- 1 && sound.play("dialog_low_balance")
},
UIController.prototype.soundGambleClick = function ()
{
    sound.play("gamble_click")
},
UIMainMenu.prototype.onBackButtonClick = function ()
{
    this.visible = false;
},
TotalWinController.prototype._onStart = TotalWinController.prototype.onStart, TotalWinController.prototype.onStart = function ()
{
    this._onStart(), clientData.freegamesActive && (game.main.freeTotalWinText.tokens["value"] = currencyFormatter.format(clientData.freePaid - serverData.roundPaid)), 
    0 != serverData.roundPaid && (game.winPanel.show(serverData.getWinLevel(), serverData.roundPaid, function ()
    {
        paylines.shownLines = [], paylines.hide(), game.winPanel.hide(), this.stop()
    }
    .bind(this), {
        gameType : userConfig.autoSpinEnabled ? "auto" : "main"
    }), paylines.show());
    for (var t = 1; t <= slotConfig.columns; t++) for (var e = reels[t], i = 1; i <= slotConfig.rows; i++)
    {
        var n = false, s = e[i], o = null;
        while (i <= slotConfig.rows)
        {
            for (var a = 0; a < serverData.wins.length; a++) {
                n = n || i == serverData.wins[a].layout[t - 1];
            }
            if (e[i + 1] != s) {
                break;
            }
            i++
        }
        if (o = 3 == s.height && 4 == i && e[2] != s ? 3 : i - s.height + 1, n)
        {
            for (var r = Symbol.get(s.id, t), a = 0; a < r.height; a++) {
                o + a <= 3 && o + a >= 1 && (game.main.animatedSymbols[t][o + a] = r);
            }
            r.y = Symbol.height * (o - 1), game.main.animatedSymbols[t].addChild(r), 2 == r.id ? r.animate() : r.normal(), 
            s.reset()
        }
        else {
            s.blackout();
        }
    }
},
TotalWinController.prototype.onEnterFrame = function ()
{
    if (serverData.freegamesActive)
    {
        var t = clientData.freePaid - serverData.roundPaid + game.winPanel.currentSum;
        game.main.freeTotalWinText.tokens["value"] = currencyFormatter.format(t);
    }
},
TotalWinController.prototype.onStop = function ()
{
    reels.each(function (t, e, i)
    {
        t.normal()
    }), paylines.shownLines = [], paylines.hide();
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t].clearChildren();
        for (var e = 1; e <= slotConfig.rows; e++) {
            game.main.animatedSymbols[t][e] = null;
        }
    }
    serverData.freegamesActive && (game.main.freeTotalWinText.tokens["value"] = currencyFormatter.format(clientData.freePaid));
},
Tween.ALPHA_FUNC = function (t, e)
{
    t.alpha = e;
},
Tween.X_FUNC = function (t, e)
{
    t.x = e;
},
Tween.Y_FUNC = function (t, e)
{
    t.y = e;
},
Paylines.prototype = Object.create(DisplayObjectContainer.prototype), Paylines.prototype.constructor = Paylines, 
Paylines.prototype.customize = function ()
{
    for (var t = 0; t < slotConfig.lines; t++) {
        this.data[t] = new Sprite("lines/" + (t + 1) + ".png"), this.addChild(this.data[t]);
    }
    this.data[0].x = 245, this.data[0].y = 266, this.data[1].x = 238, this.data[1].y = 136, this.data[2].x = 244, 
    this.data[2].y = 446, this.data[3].x = 300, this.data[3].y = 124, this.data[4].x = 291, this.data[4].y = 110, 
    this.data[5].x = 242, this.data[5].y = 144, this.data[6].x = 302, this.data[6].y = 294, this.data[7].x = 297, 
    this.data[7].y = 201, this.data[8].x = 245, this.data[8].y = 200, this.data[9].x = 302, this.data[9].y = 245, 
    this.data[10].x = 242, this.data[10].y = 169, this.data[11].x = 302, this.data[11].y = 149, this.data[12].x = 298, 
    this.data[12].y = 113, this.data[13].x = 239, this.data[13].y = 177, this.data[14].x = 297, this.data[14].y = 315, 
    this.data[15].x = 240, this.data[15].y = 136, this.data[16].x = 300, this.data[16].y = 280, this.data[17].x = 240, 
    this.data[17].y = 121, this.data[18].x = 243, this.data[18].y = 298, this.data[19].x = 245, this.data[19].y = 175, 
    this.data[20].x = 244, this.data[20].y = 193, this.hide();
},
Paylines.prototype.show = function ()
{
    this.hide();
    for (var t = 0; t < this.shownLines.length; t++) {
        this.data[this.shownLines[t].number].visible = true;
    }
},
Paylines.prototype.hide = function ()
{
    for (var t = 0; t < this.data.length; t++) {
        this.data[t].visible = false;
    }
};
var paylines = new Paylines;
Preloader.prototype.getResourceList = function ()
{
    return [[systemLoader.inGamePath(ui.graphicsPrefix + "preloader/background.jpg"), "preloader.background"], 
    [systemLoader.inGamePath(ui.graphicsPrefix + "preloader/progressbar-background.png"), "preloader.progressbar-background"], 
    [systemLoader.inGamePath(ui.graphicsPrefix + "preloader/progressbar-line.png"), "preloader.progressbar-line"]]
},
Preloader.prototype.prepare = function ()
{
    this.backgroundContainer.addChild(new Sprite("preloader.background")), this.progressBar.backgroundImage = imageLoader.get("preloader.progressbar-background"), 
    this.progressBar.lineImage = imageLoader.get("preloader.progressbar-line"), this.progressBar.percents = new TextField("PRELOADER_PERCENTS"), 
    this.progressBar.x = (1440 - this.progressBar.backgroundImage.width * Sprite.prototype.scaleFactor) / 2, 
    this.progressBar.y = 621, this.tapToContinueLabel = new TextField("TAP_TO_CONTINUE"), this.customContainer.addChild(this.tapToContinueLabel), 
    this.tapToContinueLabel.visible = false, this.customContainer.addChild(new TextField("PRELOADER_TEXT_1")), 
    this.customContainer.addChild(new TextField("PRELOADER_TEXT_2")), this.customContainer.addChild(new TextField("PRELOADER_TEXT_3"));
},
Preloader.prototype.customAfterLoadActions = function ()
{
    this.progressBar.visible = false, this.tapToContinueLabel.visible = true;
    var t = $.Deferred();
    return this.handleTouch = function (e, i, n)
    {
        ["mousedown", "touchstart", "mouseup", "touchend"].indexOf(e) !=- 1 && (delete this.handleTouch, 
        t.resolve())
    }
    .bind(this), t.promise()
},
ThiefBonusController.prototype = Object.create(StateController.prototype), ThiefBonusController.prototype.constructor = ThiefBonusController, 
ThiefBonusController.prototype.onInit = function ()
{
    game.background.addEventListener(GameEvent.CLICK, function ()
    {
        this._skipped = stage.time > this.startTime;
    }, this)
},
ThiefBonusController.prototype.onStart = function ()
{
    this._skipped = false;
    var t = game.main.thief.getPosition();
    reels.each(function (e, i, n)
    {
        if (t.row == n && t.column == i)
        {
            e.reset();
            var s = game.main.animatedSymbols[i][n] = Symbol.get(e.id);
            game.main.animatedSymbols[i].addChild(s), s.y = Symbol.height * (n - 1), s.animate()
        }
        else {
            e.blackout();
        }
    }), this.sound = sound.play("bonus");
},
ThiefBonusController.prototype.onEnterFrame = function ()
{
    (this._skipped || this.hasElapsedTimeStamp(1500)) && (this.sound && this.sound.stop(), this.stop())
},
ThiefBonusController.prototype.onStop = function ()
{
    reels.each(function (t, e, i)
    {
        t.normal()
    });
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t].clearChildren();
        for (var e = 1; e <= slotConfig.rows; e++) {
            game.main.animatedSymbols[t][e] = null;
        }
    }
},
(new ThiefBonusController).activate(), ThiefCopController.prototype = Object.create(StateController.prototype), 
ThiefCopController.prototype.constructor = ThiefCopController, ThiefCopController.prototype.onInit = function ()
{
    game.background.addEventListener(GameEvent.CLICK, function ()
    {
        this._skipped = stage.time > this.startTime;
    }, this)
},
ThiefCopController.prototype.onStart = function ()
{
    this._skipped = false;
    var t = game.main.thief.getPosition();
    reels.each(function (e, i, n)
    {
        if (t.row == n && t.column == i)
        {
            e.reset();
            var s = game.main.animatedSymbols[i][n] = Symbol.get(e.id);
            game.main.animatedSymbols[i].addChild(s), s.y = Symbol.height * (n - 1), s.animate()
        }
        else {
            e.blackout();
        }
    }), this.sound = sound.play("cop");
},
ThiefCopController.prototype.onEnterFrame = function ()
{
    this._skipped ? (game.main.thief.arrestQuick(), this.sound && this.sound.stop(), this.soundWeight && this.soundWeight.stop(), 
    this.stop()) : this.hasElapsedTimeStamp(1500) && (game.main.thief.arrest(function ()
    {
        this.stop()
    }
    .bind(this)), this.soundWeight = sound.play("weight"));
},
ThiefCopController.prototype.onStop = function ()
{
    reels.each(function (t, e, i)
    {
        t.normal()
    });
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t].clearChildren();
        for (var e = 1; e <= slotConfig.rows; e++) {
            game.main.animatedSymbols[t][e] = null;
        }
    }
},
(new ThiefCopController).activate(), ThiefMoveController.prototype = Object.create(StateController.prototype), 
ThiefMoveController.prototype.constructor = ThiefMoveController, ThiefMoveController.prototype.onInit = function ()
{
    game.background.addEventListener(GameEvent.CLICK, function ()
    {
        this._skipped = stage.time > this.startTime;
    }, this)
},
ThiefMoveController.prototype.onStart = function ()
{
    if (this._skipped = false, this._steps = 1 == serverData.thief_action[clientData.thief_action_number - 1] ? 1 : 7 == serverData.thief_action[clientData.thief_action_number - 1] ? 2 : 3, 
    this._finalStep = game.main.thief.step + this._steps, game.main.thief.skipMove) this.stop();
    else if (0 == game.main.thief.step) game.main.thief.appear(function ()
    {
        this.stop()
    }
    .bind(this));
    else
    {
        var t = game.main.thief.getPosition();
        reels.each(function (e, i, n)
        {
            if (t.row == n && t.column == i)
            {
                e.reset();
                var s = game.main.animatedSymbols[i][n] = Symbol.get(e.id);
                game.main.animatedSymbols[i].addChild(s), s.y = Symbol.height * (n - 1), s.special()
            }
            else {
                e.blackout();
            }
        }), ui.gameInfoBar.showById("game", "ACTION_MAIN_MOVE", 3e3), this.sound = sound.play("pult_move");
    }
},
ThiefMoveController.prototype.onEnterFrame = function ()
{
    game.main.thief.skipMove || this._skipped ? (game.main.thief.skipMove = true, 0 == game.main.thief.step ? game.main.thief.appearQuick() : game.main.thief.moveHeadQuick(), 
    this.sound && this.sound.stop(), this.stop()) : this.hasElapsedTimeStamp(700) && 0 != game.main.thief.step ? game.background.rays.disable() : this.hasElapsedTimeStamp(1834) && game.main.thief.moveHead(this._steps, 
    function ()
    {
        this.stop()
    }
    .bind(this))
},
ThiefMoveController.prototype.onStop = function ()
{
    game.main.thief.step = this._finalStep, game.main.thief.applyPosition(), game.background.rays.applyRaysPosition(void 0, 
    true), reels.each(function (t, e, i)
    {
        t.normal()
    });
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t].clearChildren();
        for (var e = 1; e <= slotConfig.rows; e++) {
            game.main.animatedSymbols[t][e] = null;
        }
    }
},
(new ThiefMoveController).activate(), ThiefMummyController.prototype = Object.create(StateController.prototype), 
ThiefMummyController.prototype.constructor = ThiefMummyController, ThiefMummyController.prototype.onInit = function ()
{
    game.background.addEventListener(GameEvent.CLICK, function ()
    {
        this._skipped = stage.time > this.startTime;
    }, this)
},
ThiefMummyController.prototype.onStart = function ()
{
    this._skipped = false;
    var t = game.main.thief.getPosition();
    this._finalStep = game.main.thief.step > 1 ? game.main.thief.step - 2 : 0, reels.each(function (e, 
    i, n)
    {
        if (t.row == n && t.column == i)
        {
            e.reset();
            var s = game.main.animatedSymbols[i][n] = Symbol.get(e.id);
            game.main.animatedSymbols[i].addChild(s), s.y = Symbol.height * (n - 1), s.animate()
        }
        else {
            e.blackout();
        }
    }), this.sound = sound.play("mumie");
},
ThiefMummyController.prototype.onEnterFrame = function ()
{
    this._skipped ? (game.main.thief.windUpQuick(), this.soundWindUp && this.soundWindUp.stop(), this.sound && this.sound.stop(), 
    this.stop()) : this.hasElapsedTimeStamp(1500) && (game.main.thief.windUp(function ()
    {
        this.stop()
    }
    .bind(this)), this.soundWindUp = sound.play("wind_up"));
},
ThiefMummyController.prototype.onStop = function ()
{
    game.main.thief.step = this._finalStep, game.main.thief.applyPosition(), game.background.rays.applyRaysPosition(), 
    reels.each(function (t, e, i)
    {
        t.normal()
    });
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t].clearChildren();
        for (var e = 1; e <= slotConfig.rows; e++) {
            game.main.animatedSymbols[t][e] = null;
        }
    }
},
(new ThiefMummyController).activate(), ThiefReleaseController.prototype = Object.create(StateController.prototype), 
ThiefReleaseController.prototype.constructor = ThiefReleaseController, ThiefReleaseController.prototype.onStart = function ()
{
    game.main.arrest.visible ? game.main.thief.release(function ()
    {
        this.stop()
    }
    .bind(this)) : this.stop()
},
(new ThiefReleaseController).activate(), ThiefStartController.prototype = Object.create(StateController.prototype), 
ThiefStartController.prototype.constructor = ThiefStartController, ThiefStartController.prototype.onStart = function ()
{
    this.stop()
},
(new ThiefStartController).activate(), ThiefStopController.prototype = Object.create(StateController.prototype), 
ThiefStopController.prototype.constructor = ThiefStopController, ThiefStopController.prototype.onStart = function ()
{
    this.stop()
},
(new ThiefStopController).activate(), ThiefWildController.prototype = Object.create(StateController.prototype), 
ThiefWildController.prototype.constructor = ThiefWildController, ThiefWildController.prototype.onInit = function ()
{
    game.background.addEventListener(GameEvent.CLICK, function ()
    {
        this._skipped = stage.time > this.startTime;
    }, this)
},
ThiefWildController.prototype.onStart = function ()
{
    this._skipped = false;
    var t = game.main.thief.getPosition();
    game.main.accumulatedFreespins.animate(t), reels.each(function (e, i, n)
    {
        if (t.row == n && t.column == i)
        {
            e.reset();
            var s = game.main.animatedSymbols[i][n] = Symbol.get(e.id);
            game.main.animatedSymbols[i].addChild(s), s.y = Symbol.height * (n - 1), s.animate()
        }
        else {
            e.blackout();
        }
    }), this.sound = sound.play("wild");
},
ThiefWildController.prototype.onEnterFrame = function ()
{
    this._skipped ? (game.main.accumulatedFreespins.skip(), this.sound && this.sound.stop(), this.stop()) : this.hasElapsedTimeStamp(2e3) && this.stop()
},
ThiefWildController.prototype.onStop = function ()
{
    reels.each(function (t, e, i)
    {
        t.normal()
    });
    for (var t = 1; t <= slotConfig.columns; t++)
    {
        game.main.animatedSymbols[t].clearChildren();
        for (var e = 1; e <= slotConfig.rows; e++) {
            game.main.animatedSymbols[t][e] = null;
        }
    }
},
(new ThiefWildController).activate(), FreegamesIntroController.prototype.duration = 7e3, FreegamesIntroController.prototype.clickedTime = null, 
FreegamesIntroController.prototype.onInit = function ()
{
    game.freegamesIntro.addEventListener(GameEvent.CLICK, function ()
    {
        this.clickedTime = stage.time - this.startTime, sound.stop();
    }, this)
},
FreegamesIntroController.prototype.onStart = function ()
{
    game.main.thief.step = 0, game.main.thief.applyPosition(game.main.thief.step), ui.curtain.showAndHide(function ()
    {
        game.main.bgShadow.visible = true, game.background.bg.visible = false, game.background.fbg.visible = true, 
        clientData.freegamesActive = true, game.freegamesIntro.visible = true, game.freegamesIntro.text.tokens["value1"] = serverData.freegamesAwarded, 
        game.freegamesIntro.text.tokens["value2"] = currencyFormatter.format(clientData.getFreespinsBet()), 
        this.clickedTime = null, game.bg_sound && game.bg_sound.stop(), this.sound = sound.play("freespins_start");
        for (var t = 1; t <= slotConfig.columns; t++)
        {
            for (var e = 0; e <= slotConfig.rows + 1; e++)
            {
                0 == e || 4 == e ? reels[t][e] = Symbol.get([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13][Math.floor(11 * Math.random())]) : reels[t][e] = Symbol.get(serverData.defaultData.matrix[t - 1][e - 1]), 
                reels[t][e].normal();
            }
        }
    }
    .bind(this)), serverData.wins = [];
},
FreegamesIntroController.prototype.onStop = function ()
{
    game.freegamesIntro.visible = false, game.main.bgShadow.visible = false, this.clickedTime = null, 
    this.sound && this.sound.stop();
},
FreegamesIntroController.prototype.onEnterFrame = function ()
{
    this.hasElapsedTimeStamp(this.clickedTime ? this.clickedTime + 50 : this.duration) && this.stop()
},
Game.prototype.createFreegamesIntro = function ()
{
    var t = new DisplayObjectContainer;
    return t.addChild(new Sprite("popups/fs_start.png")), t.text = new TextField("FREEGAMES_INTRO_TEXT"), 
    t.addChild(t.text), t.x = 416, t.y = 100, t.visible = false, t.handleTouch = function (e)
    {
        e == GameEvent.TOUCH_START && t.dispatchEvent(new GameEvent(GameEvent.CLICK))
    },
    t
},
Game.prototype.createFreegamesSummary = function ()
{
    var t = new DisplayObjectContainer;
    return t.winPopup = new Sprite("popups/fs_summary.png"), t.addChild(t.winPopup), t.losePopup = new Sprite("popups/fs_start.png"), 
    t.addChild(t.losePopup), t.winText = new TextField("FREEGAMES_WIN_SUMMARY_TEXT"), t.addChild(t.winText), 
    t.loseText = new TextField("FREEGAMES_LOSE_SUMMARY_TEXT"), t.addChild(t.loseText), t.y = 100, t.visible = false, 
    t.handleTouch = function (e)
    {
        e == GameEvent.TOUCH_START && t.dispatchEvent(new GameEvent(GameEvent.CLICK))
    },
    t
},
FreegamesSummaryController.prototype.duration = 7e3, FreegamesSummaryController.prototype.clickedTime = null, 
FreegamesSummaryController.prototype.onInit = function ()
{
    game.freegamesSummary.addEventListener(GameEvent.CLICK, function ()
    {
        this.clickedTime = stage.time - this.startTime;
    }, this)
},
FreegamesSummaryController.prototype.onStart = function ()
{
    this.clickedTime = null, game.freegamesSummary.visible = true, game.main.bgShadow.visible = true, 
    game.freegamesSummary.winPopup.visible = game.freegamesSummary.winText.visible = serverData.freePaid > 0, 
    game.freegamesSummary.losePopup.visible = game.freegamesSummary.loseText.visible = 0 == serverData.freePaid, 
    game.freegamesSummary.x = serverData.freePaid > 0 ? 402 : 416, game.freegamesSummary.winText.tokens["value"] = currencyFormatter.format(serverData.freePaid), 
    game.bg_sound && game.bg_sound.stop(), this.sound = sound.play(serverData.freePaid > 0 ? "freespins_stop" : "freespins_start");
},
FreegamesSummaryController.prototype.onEnterFrame = function ()
{
    this.hasElapsedTimeStamp(this.clickedTime ? this.clickedTime + 50 : this.duration) && ui.curtain.showAndHide(function ()
    {
        game.background.bg.visible = true, game.background.fbg.visible = false, game.main.bgShadow.visible = false, 
        game.freegamesSummary.visible = false;
        for (var t = 1; t <= slotConfig.columns; t++)
        {
            for (var e = 0; e <= slotConfig.rows + 1; e++)
            {
                0 == e || 4 == e ? reels[t][e] = Symbol.get([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13][Math.floor(12 * Math.random())]) : reels[t][e] = Symbol.get(serverData.defaultData.matrix[t - 1][e - 1]), 
                reels[t][e].normal();
            }
        }
        clientData.freegamesActive = false, this.sound && this.sound.stop(), this.stop()
    }
    .bind(this));
},
Interior.prototype = Object.create(DisplayObjectContainer.prototype), Interior.prototype.constructor = Interior, 
Interior.prototype.fill = function ()
{
    0 == this.room.type ? (this.wallpaper = new Sprite("bonus/interior/wallpapers/start.png"), this.addChild(this.wallpaper), 
    this.addDoors(2), this.front = new Sprite("bonus/interior/objects/front/start.png"), this.front.y = 224, 
    this.addChild(this.front), this.room.bonus.superprizeRoom.x = this.room.x, this.room.bonus.superprizeRoom.y = this.room.y + 187) : (this.addWallpapers(this.room.size), 
    this.addBackObjects(this.room.size, this.room.type), this.addDoors(this.room.size), this.addThief(this.room.size), 
    this.addFrontObjects(this.room.size, this.room.type), this.addIcons(this.room.size)), 1 == this.room.size ? this.blackout = new Sprite("bonus/interior/wallpapers/blackout_short.png") : this.blackout = new Sprite("bonus/interior/wallpapers/blackout_long.png"), 
    this.blackout.alpha = .8, this.blackout.visible = false, this.addChild(this.blackout);
},
Interior.prototype.addWallpapers = function (t)
{
    this.wallpaperNumber = this.room.random % 4, 1 == t ? (this.wallpaper = new Sprite("bonus/interior/wallpapers/" + this.wallpaperNumber + "_short.png"), 
    this.addChild(this.wallpaper)) : (this.wallpaper = new Sprite("bonus/interior/wallpapers/" + this.wallpaperNumber + "_long.png"), 
    this.addChild(this.wallpaper));
},
Interior.prototype.addDoors = function (t)
{
    var e = this.doors = new DisplayObjectContainer;
    this.addChild(e), 1 == t ? (e.leftDoor = new Sprite("bonus/animation/sec_side.png", 5, 6), e.leftDoor.x = 387, 
    e.leftDoor.y =- 20, e.leftDoor.scaleX =- 2, e.leftDoor.scaleY = 2, e.addChild(e.leftDoor), e.rightDoor = new Sprite("bonus/animation/sec_side.png", 
    5, 6), e.rightDoor.scaleX = 2, e.rightDoor.scaleY = 2, e.rightDoor.x = 4, e.rightDoor.y =- 20, e.addChild(e.rightDoor)) : (e.leftDoor = new Sprite("bonus/animation/sec_side.png", 
    5, 6), e.leftDoor.x = 387, e.leftDoor.y =- 20, e.leftDoor.scaleX =- 2, e.leftDoor.scaleY = 2, e.addChild(e.leftDoor), 
    e.leftMiddleDoor = new Sprite("bonus/animation/sec_front_1.png", 4, 5).addImage("bonus/animation/sec_front_2.png", 
    4, 4), e.leftMiddleDoor.scaleX = 2, e.leftMiddleDoor.scaleY = 2, e.leftMiddleDoor.x = 10, e.leftMiddleDoor.y = 0, 
    e.addChild(e.leftMiddleDoor), e.rightMiddleDoor = new Sprite("bonus/animation/sec_front_1.png", 4, 
    5).addImage("bonus/animation/sec_front_2.png", 4, 4), e.rightMiddleDoor.x = 790, e.rightMiddleDoor.y = 0, 
    e.rightMiddleDoor.scaleX =- 2, e.rightMiddleDoor.scaleY = 2, e.addChild(e.rightMiddleDoor), e.rightDoor = new Sprite("bonus/animation/sec_side.png", 
    5, 6), e.rightDoor.scaleX = 2, e.rightDoor.scaleY = 2, e.rightDoor.x = 413, e.rightDoor.y =- 20, e.addChild(e.rightDoor));
},
Interior.prototype.addThief = function (t)
{
    var e = this.thief = new DisplayObjectContainer;
    this.addChild(e), e.thiefLoose = new Sprite("bonus/animation/rob_hide.png", 8, 6), e.thiefLoose.scaleX = 2, 
    e.thiefLoose.scaleY = 2, e.thiefLoose.x = 1 == t ? 135 : 325, e.thiefLoose.y = 99, e.thiefLoose.visible = false, 
    e.addChild(e.thiefLoose), e.thiefSteals = new Sprite("bonus/animation/rob_steals.png", 6, 8), e.thiefSteals.scaleX = 2, 
    e.thiefSteals.scaleY = 2, e.thiefSteals.x = 1 == t ? 37 : 243, e.thiefSteals.y = 86, e.thiefSteals.visible = false, 
    e.addChild(e.thiefSteals);
},
Interior.prototype.addIcons = function (t)
{
    var e = this.icons = new DisplayObjectContainer;
    this.addChild(e), e.iconDecreaseKey = new Sprite("bonus/interior/icons/key_minus.png"), e.iconDecreaseKey.visible = false, 
    e.iconDecreaseKey.x = 1 == t ? 165 : 370, e.iconDecreaseKey.y = 60, e.iconDecreaseKey.tPointX = e.iconDecreaseKey.width / 2, 
    e.iconDecreaseKey.tPointY = e.iconDecreaseKey.height / 2, e.addChild(e.iconDecreaseKey), e.iconIncreaseKey = new Sprite("bonus/interior/icons/key_plus.png"), 
    e.iconIncreaseKey.visible = false, e.iconIncreaseKey.x = 1 == t ? 165 : 370, e.iconIncreaseKey.y = 60, 
    e.iconIncreaseKey.tPointX = e.iconIncreaseKey.width / 2, e.iconIncreaseKey.tPointY = e.iconIncreaseKey.height / 2, 
    e.addChild(e.iconIncreaseKey), e.winContainer = new DisplayObjectContainer, e.winContainer.visible = false, 
    e.winContainer.y = 40, e.iconWin = new Sprite("bonus/interior/icons/coin_little.png"), e.winContainer.addChild(e.iconWin), 
    e.valueWin = new TextField("BONUS_ROOM_ICON_WIN"), e.valueWin.y = 20, e.winContainer.addChild(e.valueWin), 
    e.addChild(e.winContainer);
},
Interior.prototype.addBackObjects = function (t, e)
{
    var i = this.backObjects = new DisplayObjectContainer;
    if (this.addChild(i), 3 == e || 4 == e)
    {
        1 == t ? (this.pictureNumber = (this.room.random - this.wallpaperNumber) / 4 % 8, i.picture = new Sprite("bonus/interior/pictures/" + this.pictureNumber + ".png"), 
        i.picture.x = 116, i.picture.y = 100 - i.picture.height / 2, i.addChild(i.picture)) : (this.pictureNumber = (this.room.random - this.wallpaperNumber) / 4 % 56, 
        this.picture1Number = this.pictureNumber % 7, this.picture2Number = (this.pictureNumber - this.picture1Number) / 7, 
        this.picture1Number >= this.picture2Number && this.picture1Number++, i.picture1 = new Sprite("bonus/interior/pictures/" + this.picture1Number + ".png"), 
        i.picture1.x = 280, i.picture1.y = 100 - i.picture1.height / 2, i.addChild(i.picture1), i.picture2 = new Sprite("bonus/interior/pictures/" + this.picture2Number + ".png"), 
        i.picture2.x = 441, i.picture2.y = 110 - i.picture2.height / 2, i.addChild(i.picture2));
        var n = new Sprite("bonus/interior/objects/box.png");
        n.x = 1 == t ? 164 : 368, n.y = 145;
        var s = new Sprite("bonus/interior/objects/crown.png");
        s.x = 1 == t ? 166 : 371, s.y = 140;
        var o = new Sprite("bonus/interior/objects/helmet.png");
        o.x = 1 == t ? 167 : 371, o.y = 124;
        var a = new Sprite("bonus/interior/objects/vase.png");
        a.x = 1 == t ? 170 : 375, a.y = 132, i.exhibits = [n, s, o, a], i.plinth = new Sprite("bonus/interior/objects/plinth.png"), 
        i.plinth.x = 1 == t ? 163 : 368, i.plinth.y = 193, i.addChild(i.plinth), i.randomExhibit = i.exhibits[1 == t ? ((this.room.random - this.wallpaperNumber) / 4 - this.pictureNumber) / 8 % 4 : ((this.room.random - this.wallpaperNumber) / 4 - this.pictureNumber) / 56 % 4], 
        i.addChild(i.randomExhibit)
    }
    if (2 == e)
    {
        var r = new DisplayObjectContainer, l = new Sprite("bonus/interior/objects/back/chair.png");
        l.x = 85, l.scaleX =- 1, r.addChild(l);
        var h = new DisplayObjectContainer, u = new Sprite("bonus/interior/objects/back/box_1.png");
        u.x =- 10, u.y = 5, h.addChild(u);
        var d = new DisplayObjectContainer, c = new Sprite("bonus/interior/objects/back/box_2.png");
        c.y = 10, d.addChild(c);
        var p = new DisplayObjectContainer, m = new Sprite("bonus/interior/objects/back/box_3.png");
        m.scaleX =- 1, m.x = 90, m.y =- 10, p.addChild(m);
        var f = new DisplayObjectContainer, g = new Sprite("bonus/interior/objects/back/box_4.png");
        g.y = 10, f.addChild(g);
        var b = new DisplayObjectContainer, y = new Sprite("bonus/interior/objects/back/broom.png");
        y.y =- 67, y.x =- 5;
        var v = new Sprite("bonus/interior/objects/back/bucket.png");
        v.x = 33, v.y = 46, b.addChild(y), b.addChild(v);
        var C = new DisplayObjectContainer, w = new Sprite("bonus/interior/objects/back/broom.png");
        w.x = 10, w.y =- 67, C.addChild(w);
        var S = new DisplayObjectContainer, T = new Sprite("bonus/interior/objects/back/b_g.png");
        T.x = 5, T.y = 53;
        var D = new Sprite("bonus/interior/objects/back/b_r.png");
        D.x = 28, D.y = 52, S.addChild(D), S.addChild(T);
        var E = new DisplayObjectContainer, _ = new Sprite("bonus/interior/objects/back/b_g.png");
        _.x = 5, _.y = 53;
        var I = new Sprite("bonus/interior/objects/back/b_y.png");
        I.x = 28, I.y = 57, E.addChild(I), E.addChild(_);
        var L = new DisplayObjectContainer, A = new Sprite("bonus/interior/objects/back/b_r.png");
        A.x = 5, A.y = 53;
        var P = new Sprite("bonus/interior/objects/back/b_y.png");
        P.x = 31, P.y = 57, L.addChild(P), L.addChild(A);
        var k = new DisplayObjectContainer, x = new Sprite("bonus/interior/objects/back/b_g.png");
        x.x = 30, x.y = 51;
        var M = new Sprite("bonus/interior/objects/back/b_r.png");
        M.x = 5, M.y = 53;
        var N = new Sprite("bonus/interior/objects/back/b_y.png");
        N.x = 30, N.y = 62, k.addChild(x), k.addChild(M), k.addChild(N);
        var O = new DisplayObjectContainer;
        i.randomObjects = [r, h, d, p, f, b, C, S, E, L, k, O], i.vordrobe = new Sprite(1 == t ? "bonus/interior/objects/vordrobes_1.png" : "bonus/interior/objects/vordrobes_2.png"), 
        i.addChild(i.vordrobe), 1 == t ? (this.objectsNumber = (this.room.random - this.wallpaperNumber) / 4 % 11, 
        this.seqDoorNumber = ((this.room.random - this.wallpaperNumber) / 4 - this.objectsNumber) / 11 % 2, 
        i.randomObject = i.randomObjects[this.objectsNumber], i.addChild(i.randomObject), 0 == this.seqDoorNumber ? (i.randomObject.x = 230, 
        i.randomObject.y = 175, i.vordrobe.x = 60, i.vordrobe.y = 28) : (i.randomObject.x = 161, i.randomObject.y = 175, 
        i.randomObject.scaleX =- 1, i.vordrobe.x = 331, i.vordrobe.y = 28, i.vordrobe.scaleX =- 1)) : (this.objectsNumber = (this.room.random - this.wallpaperNumber) / 4 % 132, 
        this.objectsNumber1 = this.objectsNumber % 11, this.objectsNumber2 = (this.objectsNumber - this.objectsNumber1) / 11, 
        this.objectsNumber1 == this.objectsNumber2 && this.objectsNumber2++, this.objectsNumber1 >= 7 && this.objectsNumber2 >= 7 && 11 != this.objectsNumber2 && (this.objectsNumber1 = 0), 
        1 == this.objectsNumber2 && (this.objectsNumber2 = 4 == this.objectsNumber1 ? 3 : 4), i.randomObject1 = i.randomObjects[this.objectsNumber1], 
        i.addChild(i.randomObject1), i.randomObject2 = i.randomObjects[this.objectsNumber2], i.addChild(i.randomObject2), 
        this.seqDoorNumber = ((this.room.random - this.wallpaperNumber) / 4 - this.objectsNumber) / 132 % 4 + 2, 
        2 != this.seqDoorNumber && 3 != this.seqDoorNumber || (i.randomObject1.x = 450, i.randomObject1.y = 175, 
        i.randomObject2.x = 640, i.randomObject2.y = 175, i.vordrobe.x = 240, i.vordrobe.y = 30), 4 != this.seqDoorNumber && 5 != this.seqDoorNumber || (i.randomObject1.x = 350, 
        i.randomObject1.y = 175, i.randomObject1.scaleX =- 1, i.randomObject2.x = 160, i.randomObject2.y = 175, 
        i.randomObject2.scaleX =- 1, i.vordrobe.x = 560, i.vordrobe.y = 30, i.vordrobe.scaleX =- 1))
    }
    1 == e && (i.console = new Sprite("bonus/interior/objects/console.png"), i.console.x = 1 == t ?- 205 : 0, 
    i.addChild(i.console));
},
Interior.prototype.addFrontObjects = function (t, e)
{
    var i = this.front = new DisplayObjectContainer;
    this.addChild(i);
    var n = new Sprite("bonus/interior/objects/front/boxes_front_1.png");
    n.scaleX =- 1, n.x = n.width, n.y = this.wallpaper.height - n.height;
    var s = new Sprite("bonus/interior/objects/front/boxes_front_2.png");
    s.y = this.wallpaper.height - s.height;
    var o = new Sprite("bonus/interior/objects/front/ni_left.png");
    o.y = this.wallpaper.height - o.height;
    var a = new Sprite("bonus/interior/objects/front/ni_right.png");
    a.scaleX =- 1, a.x = a.width, a.y = this.wallpaper.height - a.height;
    var r = new Sprite("bonus/interior/objects/front/pipes.png");
    r.y = this.wallpaper.height - r.height;
    var l = new Sprite("bonus/interior/objects/front/bucket.png");
    if (l.y = this.wallpaper.height - l.height, i.randomObjects = [n, s, o, a, r, l], 2 == e) if (1 == t)
    {
        var h = (this.room.random - this.wallpaperNumber) / 4 % 6;
        if (i.addChild(i.randomObjects[h]), h < 4)
        {
            var u = ((this.room.random - this.wallpaperNumber) / 4 - h) / 6 % 2 + 4;
            i.addChild(i.randomObjects[u])
        }
        else
        {
            var u = ((this.room.random - this.wallpaperNumber) / 4 - h) / 6 % 6;
            u == h && (u = 0 == u ? u + 1 : u - 1), i.addChild(i.randomObjects[u])
        }
        0 == u || 3 == u ? (i.randomObjects[u].x = this.wallpaper.width - i.randomObjects[u].width, i.randomObjects[u].scaleX = 1) : (i.randomObjects[u].x = this.wallpaper.width, 
        i.randomObjects[u].scaleX =- 1)
    }
    else
    {
        var h = (this.room.random - this.wallpaperNumber) / 4 % 6;
        i.addChild(i.randomObjects[h]);
        var u = ((this.room.random - this.wallpaperNumber) / 4 - h) / 6 % 6;
        u == h && (u = 0 == u ? u + 1 : u - 1), i.addChild(i.randomObjects[u]), 0 == u || 3 == u ? (i.randomObjects[u].x = this.wallpaper.width - i.randomObjects[u].width, 
        i.randomObjects[u].scaleX = 1) : (i.randomObjects[u].x = this.wallpaper.width, i.randomObjects[u].scaleX =- 1);
    }
},
Room.prototype = Object.create(AbstractButton.prototype), Room.prototype.constructor = Room, Room.prototype.init = function ()
{
    this.serverId = serverData.bonusRooms[this.id].id, this.size = serverData.bonusRooms[this.id].width, 
    this.random = serverData.bonusRooms[this.id].random, this.type = serverData.bonusRooms[this.id].type, 
    this.column = serverData.bonusRooms[this.id].column, this.row = serverData.bonusRooms[this.id].row, 
    this.win = serverData.bonusRooms[this.id].win, this.status = serverData.bonusRooms[this.id].status, 
    this.x = 227 * this.column, this.y = 187 * this.row, this.interior = new Interior(this), this.interior.x = 6, 
    this.interior.y = 5, this.interior.scaleX = this.interior.scaleY = .55, this.addChild(this.interior), 
    1 == this.size ? (this.closedDisabled = new Sprite("bonus/rooms/short/closed_disabled.png"), this.closedEnabled = new Sprite("bonus/rooms/short/closed_enabled.png"), 
    this.openedCurrent = new Sprite("bonus/rooms/short/opened_current.png"), this.openedDisabled = new Sprite("bonus/rooms/short/opened_disabled.png")) : (this.closedDisabled = new Sprite("bonus/rooms/long/closed_disabled.png"), 
    this.closedEnabled = new Sprite("bonus/rooms/long/closed_enabled.png"), this.openedCurrent = new Sprite("bonus/rooms/long/opened_current.png"), 
    this.openedDisabled = new Sprite("bonus/rooms/long/opened_disabled.png")), this.addChild(this.closedDisabled), 
    this.addChild(this.closedEnabled), this.addChild(this.openedCurrent), this.addChild(this.openedDisabled), 
    this.pickButton = new DisplayObjectContainer, this.addChild(this.pickButton), this.pickButton.handStatic = new Sprite("bonus/rooms/icons/hand_glow.png"), 
    this.pickButton.handStatic.x = (this.closedDisabled.width - this.pickButton.handStatic.width) / 2, 
    this.pickButton.handStatic.y = (this.closedDisabled.height - this.pickButton.handStatic.height) / 2, 
    this.pickButton.addChild(this.pickButton.handStatic);
    var t = this.idleMovie = new MovieClip;
    t.addTween(new Tween(this.pickButton, "alpha", 1).move(-.5, 500).move(.5, 1500)), t.addAction(t.play, 
    2e3, 0), this.iconDecreaseKey = new Sprite("bonus/rooms/icons/handcaffs.png"), this.iconDecreaseKey.visible = false, 
    this.iconDecreaseKey.x = (this.closedDisabled.width - this.iconDecreaseKey.width) / 2, this.iconDecreaseKey.y = (this.closedDisabled.height - this.iconDecreaseKey.height) / 2, 
    this.addChild(this.iconDecreaseKey), this.iconKey = new Sprite("bonus/rooms/icons/key.png"), this.iconKey.visible = false, 
    this.iconKey.x = (this.closedDisabled.width - this.iconKey.width) / 2, this.iconKey.y = (this.closedDisabled.height - this.iconKey.height) / 2, 
    this.addChild(this.iconKey), this.iconMoney = new Sprite("bonus/rooms/icons/money.png"), this.iconMoney.visible = false, 
    this.iconMoney.x = (this.closedDisabled.width - this.iconMoney.width) / 2, this.iconMoney.y = (this.closedDisabled.height - this.iconMoney.height) / 2 - 10, 
    this.addChild(this.iconMoney), this.valueWin = new TextField("BONUS_ICON_WIN"), this.valueWin.visible = false, 
    this.valueWin.x = this.closedDisabled.width / 2, this.valueWin.y = this.iconMoney.y + 50, this.addChild(this.valueWin), 
    this.hitArea.x = 5, this.hitArea.y = 5, this.hitArea.width = 1 == this.size ? 217 : 443, this.hitArea.height = 177, 
    this.updateStatus();
},
Room.prototype.reset = function ()
{
    this.children = [], this.serverId =- 1, this.size =- 1, this.random =- 1, this.type =- 1, this.column =- 1, 
    this.row =- 1, this.win =- 1;
},
Room.prototype.updateStatus = function ()
{
    switch (this.status = serverData.bonusRooms[this.id].status, this.interior.visible = this.interior.blackout.visible = false, 
    this.closedDisabled.visible = this.closedEnabled.visible = this.openedCurrent.visible = this.openedDisabled.visible = this.pickButton.visible = false, 
    this.status)
    {
        case 0:
        this.closedDisabled.visible = true;
        break;
        case 1:
        this.closedEnabled.visible = true;
        break;
        case 2:
        switch (this.openedCurrent.visible = true, this.interior.visible = true, this.type = serverData.bonusRooms[this.id].type, 
        this.type)
        {
            case 2:
            this.interior.icons.iconDecreaseKey.visible = true;
            break;
            case 3:
            this.interior.icons.iconIncreaseKey.visible = true;
            break;
            case 4:
            this.interior.icons.winContainer.visible = true, this.win = serverData.bonusRooms[this.id].win, 
            this.interior.icons.valueWin.tokens["value"] = currencyFormatter.format(this.win), this.interior.icons.iconWin.x =- (this.interior.icons.iconWin.width / 2), 
            this.interior.icons.winContainer.x = 1 == this.size ? 195 : 400, this.interior.icons.winContainer.tPointY = (this.interior.icons.valueWin.getRect().height + this.interior.icons.iconWin.height) / 2, 
            this.interior.icons.winContainer.scaleX = 1.5, this.interior.icons.winContainer.scaleY = 1.5
        }
        break;
        case 3:
        this.openedDisabled.visible = true, this.interior.visible = true, this.interior.blackout.visible = true, 
        this.showIcon();
    }
},
Room.prototype.showIcon = function ()
{
    switch (this.type)
    {
        case 2:
            this.iconDecreaseKey.visible = true;
            break;
        case 3:
            this.iconKey.visible = true;
            break;
        case 4:
            this.iconMoney.visible = true, this.valueWin.visible = true, void 0 !== this.win && (this.valueWin.tokens["value"] = currencyFormatter.format(this.win));
    }
},
Room.prototype.performOnClientUpdate = function (t)
{
    if ("bonus.start" == t.diff.state && this.init(), t.diff.state)
    {
        switch (clientData.state) 
        {
            case "bonus.pick":
                "init" == t.diff.state && this.init(), this.updateStatus(), 1 == this.status && (this.pickButton.visible = true, 
                this.idleMovie.play(0));
                break;
            case "bonus.wait":
                this.idleMovie.stop(2e3);
                break;
            case "bonus.result":
                "init" == t.diff.state && this.init(), this.updateStatus() 
        }
    }
},
Room.prototype.onSelect = function ()
{
    1 == this.status && "bonus.pick" == clientData.state && this.bonus.pick(this.serverId)
},
BonusMap.prototype = Object.create(DisplayObjectContainer.prototype), BonusMap.prototype.constructor = BonusMap, 
BonusMap.prototype.onInputDown = function (t, e, i)
{
    this.isInputDown || (this.isInputDown = true, this.downPosition = {
        x : t, y : e
    },
    this.downTouchID = i, this.deltaPos = {
        x : 0, y : 0
    })
},
BonusMap.prototype.onInputUp = function (t)
{
    this.isInputDown && (this.isInputDown = false, this.downTouchID = null);
},
BonusMap.prototype.handleTouch = function (t, e, i, n)
{
    if (null == this.downTouchID || null === this.downTouchID || this.downTouchID == n)
    {
        switch (t)
        {
            case GameEvent.TOUCH_START:
                this.moved = false, this.onInputDown(e, i, n), this.dispatchEvent(new GameEvent(GameEvent.CLICK)), 
                stage.canvas.addEventListener("touchmove", function (t)
                {
                    t.preventDefault()
                });
                break;
            case GameEvent.TOUCH_MOVE:
                this.isInputDown && this.moveMap(e - this.downPosition.x, i - this.downPosition.y);
                break;
            case GameEvent.TOUCH_CANCEL:
                this.onInputUp(n), stage.canvas.removeEventListener("touchmove", function (t)
                {
                    t.preventDefault()
                });
                break;
            case GameEvent.TOUCH_END:
                this.onInputUp(n), stage.canvas.removeEventListener("touchmove", function (t)
                {
                    t.preventDefault()
                })
        }
        return this.downPosition = 
        {
            x : e, y : i
        },
        this.moved || DisplayObjectContainer.prototype.handleTouch.call(this, t, e, i), true
    }
},
BonusMap.prototype.performOnClientUpdate = function (t)
{
    if ("init" == t.diff.state && ("bonus.pick" == clientData.state || "bonus.result" == clientData.state))
    {
        for (var e = 0; e < game.bonus.roomsCount; e++) {
            2 == game.bonus.rooms[e].status && (game.bonus.currentRoom = game.bonus.rooms[e]);
        }
        var i = this.centerMap(game.bonus.currentRoom.serverId);
        this.x = i.x, this.y = i.y, this.bonus.thief.upplyPosition(), this.bonus.thief.visible = "bonus.pick" == clientData.state, 
        this.onResize(), this.bonus.superprizeRoom.hideMovie.play(999)
    }
    if ("bonus.start" == t.diff.state)
    {
        var i = this.centerMap();
        this.x = i.x, this.y = i.y, this.bonus.thief.visible = true, this.bonus.thief.upplyPosition();
    }
},
BonusMap.prototype.moveMap = function (t, e)
{
    var i = Math.min(stage.width, ui.getGameViewport().width), n = (1382 - i) / 2;
    this.deltaPos.x += t, this.deltaPos.y += e, i < 1382 ? this.deltaPos.x >= 6 ? (this.moved = true, 
    this.x + this.deltaPos.x >= n + 32 ? this.x = n + 32 : this.x += this.deltaPos.x) : this.deltaPos.x <=- 6 && (this.moved = true, 
    this.x + this.deltaPos.x <=- n + 45 ? this.x =- n + 45 : this.x += this.deltaPos.x) : this.x = 40, 
    Math.abs(this.deltaPos.y) >= 6 && (this.moved = true, this.y + this.deltaPos.y >= 5 ? this.y = 5 : this.y + this.deltaPos.y <=- 340 ? this.y =- 340 : this.y += this.deltaPos.y);
},
BonusMap.prototype.onResize = function ()
{
    var t = Math.min(stage.width, ui.getGameViewport().width), e = (1382 - t) / 2;
    t < 1382 ? (this.x > e + 32 ? this.x = e + 32 : this.x <- e + 45 && (this.x =- e + 45), this.bonus.arrowLeft.x = (1382 - t) / 2 + 5, 
    this.bonus.arrowRight.x = (1382 + t) / 2 - this.bonus.arrowRight.width + 50, this.bonus.arrowLeft.visible = this.bonus.arrowRight.visible = true) : (this.x = 40, 
    this.bonus.arrowLeft.visible = this.bonus.arrowRight.visible = false), this.bonus.panel.x = (1440 + t) / 2 - this.bonus.panel.bg.width;
},
BonusMap.prototype.centerMap = function (t)
{
    var e = Math.min(stage.width, ui.getGameViewport().width), i = (1382 - e) / 2;
    if (null == t)
    {
        if (1 == clientData.bonusRoomType)
        {
            for (var n = 0; n < this.bonus.roomsCount; n++) if (0 == this.bonus.rooms[n].type) {
                var s = this.bonus.rooms[n];
                break
            }
        }
        else for (var n = 0;
        n < this.bonus.roomsCount;
        n++) if (2 == this.bonus.rooms[n].status) {
            var s = this.bonus.rooms[n];
            break
        }
    }
    else
    {
        for (var n = 0; n < this.bonus.roomsCount; n++)
        {
            if (this.bonus.rooms[n].serverId == t) {
                var s = this.bonus.rooms[n];
                break 
            }
            this.bonus.currentRoom = s;;
        }
    }
    var o = 300 - 187 * (s.row + .5), a = (1440 - e) / 2 + (e / 2 - 227 * (s.size / 2 + s.column));
    return e < 1382 ? a > i + 32 ? a = i + 32 : a <- i + 45 && (a =- i + 45) : a = 40, o >= 5 ? o = 5 : o <=- 340 && (o =- 340), 
    {
        x : a, y : o
    }
},
Game.prototype.createBonus = function ()
{
    var t = new Bonus;
    return t;
},
BonusThief.prototype = Object.create(DisplayObjectContainer.prototype), BonusThief.prototype.constructor = BonusThief, 
BonusThief.prototype.disappear = function (t)
{
    var e = new MovieClip;
    e.addTween(new Tween(this.sprite, "scaleX", 1).move(-1, 300)), e.addTween(new Tween(this.sprite, "scaleY", 
    1).move(-1, 300)), e.addAction(function ()
    {
        t && t(), this.stop()
    }, 301), e.play(0)
},
BonusThief.prototype.appear = function (t)
{
    var e = new MovieClip;
    e.addTween(new Tween(this.sprite, "scaleX", 0).move(1, 300)), e.addTween(new Tween(this.sprite, "scaleY", 
    0).move(1, 300)), e.addAction(function ()
    {
        t && t(), this.stop()
    }, 301), e.play(0)
},
BonusThief.prototype.show = function ()
{
    this.sprite.scaleX = this.sprite.scaleY = 1;
},
BonusThief.prototype.upplyPosition = function ()
{
    this.x = this.bonus.currentRoom.x + (this.bonus.currentRoom.closedDisabled.width - this.sprite.width) / 2, 
    this.y = this.bonus.currentRoom.y + (this.bonus.currentRoom.closedDisabled.height - this.sprite.height) / 2;
},
Bonus.prototype = Object.create(DisplayObjectContainer.prototype), Bonus.prototype.constructor = Bonus, 
Bonus.prototype.createBackground = function ()
{
    var t = new DisplayObjectContainer, e = new Sprite("bonus/background.png");
    return t.addChild(e), t;
},
Bonus.prototype.createSuperprizeRoom = function ()
{
    var t = new DisplayObjectContainer, e = t.interior = new Sprite("bonus/interior/wallpapers/superprize.png");
    e.x = 5, e.y = 5, e.scaleX = e.scaleY = 1.45, t.addChild(e);
    var i = new Sprite("bonus/interior/wallpapers/blackout_long.png");
    i.x = 5, i.y = 5, i.scaleX = i.scaleY = .57, i.alpha = 0, t.addChild(i);
    var n = new Sprite("bonus/rooms/long/superprize.png");
    t.addChild(n);
    var s = new Sprite("bonus/rooms/icons/lock.png");
    s.alpha = 0, s.x = 186, s.y = 45, t.addChild(s);
    var o = t.hideMovie = new MovieClip;
    o.addTween(new Tween(i, "alpha", 0).move(.7, 500)), o.addTween(new Tween(s, "alpha", 0).move(0, 500).move(1, 
    500)), o.addAction(o.stop, 1e3);
    var a = t.openMovie = new MovieClip;
    return a.addTween(new Tween(i, "alpha", .7).move(0, 500).move(-.7, 500)), a.addTween(new Tween(s, 
    "alpha", 1).move(-1, 500)), a.addAction(a.stop, 1e3), t
},
Bonus.prototype.createLeftArrow = function ()
{
    var t = new Sprite("bonus/arrow.png");
    return t.tPointX = t.width / 2, t.tPointY = t.height / 2, t.x = (1382 - ui.getGameViewport().width) / 2 + 5, 
    t.y = 300 - t.height / 2, t.rotate = Math.PI / 2, t;
},
Bonus.prototype.createRightArrow = function ()
{
    var t = new Sprite("bonus/arrow.png");
    return t.tPointX = t.width / 2, t.tPointY = t.height / 2, t.x = (1382 + ui.getGameViewport().width) / 2 - t.width + 50, 
    t.y = 300 - t.height / 2, t.rotate = 3 * Math.PI / 2, t;
},
Bonus.prototype.createUpArrow = function ()
{
    var t = new Sprite("bonus/arrow.png");
    return t.tPointX = t.width / 2, t.tPointY = t.height / 2, t.x = 720 - t.width / 2, t.rotate = Math.PI, 
    t;
},
Bonus.prototype.createDownArrow = function ()
{
    var t = new Sprite("bonus/arrow.png");
    return t.x = 720 - t.width / 2, t.y = 600 - t.height, t;
},
Bonus.prototype.addPanel = function ()
{
    var t = this.panel = new DisplayObjectContainer;
    this.panel.bg = new Sprite("bonus/left_bar/bar_bg.png"), t.addChild(this.panel.bg);
    var e = Math.min(stage.width, ui.getGameViewport().width);
    this.panel.x = (1440 + e) / 2 - this.panel.bg.width, this.panel.keys = new Sprite("bonus/left_bar/k.png"), 
    t.addChild(this.panel.keys), this.panel.keys.x = 22, this.panel.keys.y = 10, this.panel.keysValue = new TextField("BONUS_KEYS_VALUE"), 
    t.addChild(this.panel.keysValue), this.panel.keysValue.onClientUpdate(function (t)
    {
        !t.diff.state || "bonus.intro" != clientData.state && "bonus.pick" != clientData.state || (this.tokens["value"] = clientData.bonusKeys), 
        "init" == t.diff.state && "bonus.result" == clientData.state && (2 == serverData.currentRoom.type && (clientData.bonusKeys = 8 - serverData.keysSpent), 
        this.tokens["value"] = clientData.bonusKeys);
    }), this.panel.handcuffs = new Sprite("bonus/left_bar/h.png"), t.addChild(this.panel.handcuffs), this.panel.handcuffs.x = 22, 
    this.panel.handcuffs.y = 110, this.panel.handcuffsValue = new TextField("BONUS_HANDCUFFS_VALUE"), 
    t.addChild(this.panel.handcuffsValue), this.panel.handcuffsValue.tokens["value"] = clientData.bonusCops, 
    this.panel.handcuffsValue.onClientUpdate(function (t)
    {
        !t.diff.state || "bonus.intro" != clientData.state && "bonus.pick" != clientData.state || (this.tokens["value"] = clientData.bonusCops), 
        "init" == t.diff.state && "bonus.result" == clientData.state && (2 == serverData.currentRoom.type && clientData.bonusCops++, 
        this.tokens["value"] = clientData.bonusCops);
    }), this.addChild(t)
},
Bonus.prototype.createBonusStart = function ()
{
    var t = new DisplayObjectContainer, e = new Sprite("popups/bonus_start.png");
    t.addChild(e);
    var i = new TextField("BONUS_START_TEXT");
    return t.addChild(i), clientData.addEventListener(GameEvent.UPDATE, function (t)
    {
        i.tokens["value"] = currencyFormatter.format(clientData.getTotalBet());
    }), t.x = (1440 - e.width) / 2, t.y = 150, t.visible = false, t.handleTouch = function (e)
    {
        e == GameEvent.TOUCH_START && t.dispatchEvent(new GameEvent(GameEvent.CLICK))
    },
    t
},
Bonus.prototype.createBonusSummary = function ()
{
    var t = new DisplayObjectContainer, e = new Sprite("popups/bonus_summary.png"), i = new Sprite("popups/bonus_start.png");
    t.addChild(e), t.addChild(i);
    for (var n = [], s = 0; s < 5; s++) {
        n[s] = new TextField("BONUS_SUMMARY_SUPERPRIZE" + (s + 1)), t.addChild(n[s]);
    }
    var o = new TextField("BONUS_SUMMARY_WIN1"), a = new TextField("BONUS_SUMMARY_WIN2"), r = new TextField("BONUS_SUMMARY_LOSE");
    t.addChild(o), t.addChild(a), t.addChild(r);
    for (var l = t.superprizeMovie = new MovieClip, s = 0; s < 5; s++) {
        l.addTween(new Tween(n[s], "alpha", 0).move(0, 500 * s).move(1, 500));
    }
    l.addAction(l.stop, 2500);
    var h = t.winMovie = new MovieClip;
    return h.addTween(new Tween(o, "alpha", 0).move(1, 500)), h.addTween(new Tween(a, "alpha", 0).move(0, 
    500).move(1, 1e3)), h.addAction(h.stop, 1500), clientData.addEventListener(GameEvent.UPDATE, function (s)
    {
        if (s.diff.state && "bonus.summary" == clientData.state) if (clientData.bonusSuperprizePaid > 0)
        {
            for (var l = 0; l < 5; l++) {
                n[l].visible = true;
            }
            e.visible = true, i.visible = r.visible = o.visible = a.visible = false, t.x = (1440 - e.width) / 2, 
            t.y = 50;
            var h = clientData.bonusKeys * clientData.getTotalBet();
            n[1].tokens["value"] = currencyFormatter.format(clientData.bonusPaid + clientData.bonusSuperprizePaid), 
            n[2].tokens["value"] = currencyFormatter.format(clientData.bonusSuperprizePaid - h), n[3].tokens["value"] = currencyFormatter.format(clientData.bonusPaid), 
            n[4].tokens["value"] = currencyFormatter.format(h)
        }
        else if (clientData.bonusPaid > 0)
        {
            i.visible = o.visible = a.visible = true, e.visible = r.visible = false;
            for (var l = 0; l < 5; l++) {
                n[l].visible = false;
            }
            t.x = (1440 - i.width) / 2, t.y = 150, a.tokens["value"] = currencyFormatter.format(clientData.bonusPaid)
        }
        else
        {
            e.visible = o.visible = a.visible = false, i.visible = r.visible = true;
            for (var l = 0; l < 5; l++) {
                n[l].visible = false;
            }
            t.x = (1440 - i.width) / 2, t.y = 150;
        }
    }), t.visible = false, t.handleTouch = function (e)
    {
        e == GameEvent.TOUCH_START && t.dispatchEvent(new GameEvent(GameEvent.CLICK))
    },
    t
},
Bonus.prototype.pick = function (t)
{
    clientData.bonusPick = t, clientData.act("pick"), sound.play("bonus_pick");
    for (var e = 0; e < this.roomsCount; e++)
    {
        2 == this.rooms[e].status && this.rooms[e].status++, this.rooms[e].serverId == t && (this.rooms[e].status = 2), 
        this.rooms[e].updateStatus();
    }
},
BonusIntroController.prototype = Object.create(StateController.prototype), BonusIntroController.prototype.constructor = BonusIntroController, 
BonusIntroController.prototype.duration = 7e3, BonusIntroController.prototype.onStart = function ()
{
    game.bonus.bonusStart && (game.bonus.bonusStart.visible = true, game.bonus.bgShadow.visible = true), 
    ui.curtain.hide().then(function ()
    {
        game.bonus.bonusStart.addEventListener(GameEvent.CLICK, function ()
        {
            this._skipped = stage.time > this.startTime;
        }, this), this.sound = sound.play("bonus_start"), this._skipped = false
    }
    .bind(this));
    var t = this.movie = new MovieClip;
    t.addAction(function ()
    {
        game.bonus.superprizeRoom.hideMovie.play(0)
    }, 1), t.addAction(function ()
    {
        t.stop(), this.stop()
    }
    .bind(this), 1e3)
},
BonusIntroController.prototype.onStop = function ()
{
    game.bonus.bonusStart && (game.bonus.bonusStart.visible = false, game.bonus.bgShadow.visible = false, 
    this.sound && this.sound.stop()), this._skipped = false, game.bonus.bonusStart.removeEventListener(GameEvent.CLICK, 
    function ()
    {
        this._skipped = stage.time > this.startTime;
    }, this)
},
BonusIntroController.prototype.onEnterFrame = function ()
{
    (this._skipped || this.hasElapsedTimeStamp(this.duration + 300)) && (game.bonus.bonusStart.removeEventListener(GameEvent.CLICK, 
    function ()
    {
        this._skipped = stage.time > this.startTime;
    }, this), game.bonus.bonusStart && (game.bonus.bonusStart.visible = false, game.bonus.bgShadow.visible = false), 
    this.movie.play(0), this._skipped = false);
},
(new BonusIntroController).activate(), BonusResultController.prototype = Object.create(StateController.prototype), 
BonusResultController.prototype.constructor = BonusResultController, BonusResultController.prototype.onStart = function ()
{
    this.clickedTime = this.clickedTime2 = null, this.skiped = false;
    for (var t = 0; t < game.bonus.roomsCount; t++)
    {
        if (2 == game.bonus.rooms[t].status) {
            var e = this.currentRoom = game.bonus.rooms[t];
            game.bonus.currentRoom = e 
        }
        switch (game.bonus.thief.upplyPosition(), e.interior.fill(), game.bonus.roomsContainer.removeChild(e), 
        game.bonus.roomsContainer.addChild(e), e.type) 
        {
            case 1:
            this.duration = 1e3;
            break;
            case 2:
            var i = this.thiefAnim = e.interior.thief.thiefLoose;
            this.duration = 3800;
            break;
            case 3:
            var i = this.thiefAnim = e.interior.thief.thiefSteals;
            this.duration = 4100;
            break;
            case 4:
            var i = this.thiefAnim = e.interior.thief.thiefSteals;
            this.duration = 4100 
        }
        var n = this.movie = new MovieClip;
        if (n.addAction(function () 
        {
            game.bonus.roomsContainer.addEventListenerOnce(GameEvent.CLICK, function () 
            {
                this.clickedTime = stage.time - this.startTime, this.skiped = true;
            }, this), 1 != e.type && (this.eventSound = sound.play(["bonus_superprize_room", "bonus_cop_room", 
            "bonus_steal_room", "bonus_steal_room"][e.type - 1])) 
        }
        .bind(this), 300), 4 == e.type && (i.visible = true, n.addTween(new Tween(i, "alpha", 1).move(0, 
        3800).move(-1, 300)), n.addTween(new SpriteTween(i).move("0", 300).move("0-42", 3e3)), n.addTween(new Tween(e.interior.backObjects.randomExhibit, 
        "alpha", 1).move(0, 1300).move(-1, 500)), e.interior.icons.winContainer.visible = true, e.interior.icons.valueWin.tokens["value"] = currencyFormatter.format(e.win), 
        e.interior.icons.iconWin.x =- (e.interior.icons.iconWin.width  / 2), e.interior.icons.winContainer.x = 1 == e.size ? 195 : 400, 
        e.interior.icons.winContainer.tPointY = (e.interior.icons.valueWin.getRect().height + e.interior.icons.iconWin.height)  / 2, 
        n.addTween(new Tween(e.interior.icons.winContainer, Tween.ALPHA_FUNC, 0).move(1, 1300, Tween.JUMP)), 
        n.addTween(new Tween(e.interior.icons.winContainer, Tween.SCALE_FUNC, 1).move(0, 1300).move(.5, 
        500)), n.addAction(function () 
        {
            ui.gameInfoBar.showById("game", "ACTION_BONUS_WIN", 0, {
                value : h5game.formatMeter(serverData.bonusPaid) 
            }) 
        }, 1300)), 3 == e.type && (i.visible = true, n.addTween(new Tween(i, "alpha", 1).move(0, 3800).move(-1, 
        300)), n.addTween(new SpriteTween(i).move("0", 300).move("0-42", 3e3)), n.addTween(new Tween(e.interior.backObjects.randomExhibit, 
        "alpha", 1).move(0, 1300).move(-1, 500)), e.interior.icons.iconIncreaseKey.visible = true, n.addTween(new Tween(e.interior.icons.iconIncreaseKey, 
        Tween.ALPHA_FUNC, 0).move(1, 1300, Tween.JUMP)), n.addTween(new Tween(e.interior.icons.iconIncreaseKey, 
        Tween.SCALE_FUNC, .5).move(0, 1300).move(.5, 500)), n.addAction(function () 
        {
            game.bonus.panel.keysValue.tokens["value"] = serverData.bonusKeys, sound.play("bonus_add_key");
        }, 1300)), 2 == e.type) 
        {
            i.visible = true;
            var s = e.interior.seqDoorNumber;
            switch (e.interior.moveChild(e.interior.doors, - 1), s) 
            {
                case 0:
                    e.interior.doors.removeChild(e.interior.doors.leftDoor), e.interior.doors.addChild(e.interior.doors.leftDoor), 
                    n.addTween(new SpriteTween(e.interior.doors.leftDoor).move("0", 300).move("0-25,0", 1700));
                    break;
                case 1:
                    e.interior.thief.thiefLoose.scaleX =- 2, e.interior.thief.thiefLoose.x += 121, e.interior.doors.removeChild(e.interior.doors.rightDoor), 
                    e.interior.doors.addChild(e.interior.doors.rightDoor), n.addTween(new SpriteTween(e.interior.doors.rightDoor).move("0", 
                    300).move("0-25,0", 1700));
                    break;
                case 2:
                    e.interior.doors.removeChild(e.interior.doors.leftDoor), e.interior.doors.addChild(e.interior.doors.leftDoor), 
                    n.addTween(new SpriteTween(e.interior.doors.leftDoor).move("0", 300).move("0-25,0", 1700));
                    break;
                case 3:
                    e.interior.doors.removeChild(e.interior.doors.leftMiddleDoor), e.interior.doors.addChild(e.interior.doors.leftMiddleDoor), 
                    n.addTween(new SpriteTween(e.interior.doors.leftMiddleDoor).move("0", 300).move("0-35,0", 
                    2400));
                    break;
                case 4:
                    e.interior.thief.thiefLoose.scaleX =- 2, e.interior.thief.thiefLoose.x += 150, e.interior.doors.removeChild(e.interior.doors.rightMiddleDoor), 
                    e.interior.doors.addChild(e.interior.doors.rightMiddleDoor), n.addTween(new SpriteTween(e.interior.doors.rightMiddleDoor).move("0", 
                    300).move("0-35,0", 2400));
                    break;
                case 5:
                    e.interior.thief.thiefLoose.scaleX =- 2, e.interior.thief.thiefLoose.x += 150, e.interior.doors.removeChild(e.interior.doors.rightDoor), 
                    e.interior.doors.addChild(e.interior.doors.rightDoor), n.addTween(new SpriteTween(e.interior.doors.rightDoor).move("0", 
                    300).move("0-25,0", 1700));
                    break;
                default:
                    throw new Error("BonusResultController.onStart: wrong door number.") 
            }
            n.addTween(new SpriteTween(e.interior.thief.thiefLoose).move("0", 300).move("0-40", 2700)), 
            n.addTween(new Tween(e.interior.thief.thiefLoose, Tween.ALPHA_FUNC, 1).move(0, 3500).move(-1, 
            300)), e.interior.icons.iconDecreaseKey.visible = true, n.addTween(new Tween(e.interior.icons.iconDecreaseKey, 
            Tween.ALPHA_FUNC, 0).move(1, 1e3, Tween.JUMP)), n.addTween(new Tween(e.interior.icons.iconDecreaseKey, 
            Tween.SCALE_FUNC, .5).move(0, 1e3).move(.5, 1e3)), n.addAction(function () 
            {
                game.bonus.panel.keysValue.tokens["value"] = serverData.bonusKeys, game.bonus.panel.handcuffsValue.tokens["value"] = serverData.bonusCops, 
                sound.play("bonus_remove_key");
            }, 1e3) 
        }
        if (1 == e.type) 
        {
            var o = {
                x : game.bonus.roomsContainer.x, y : game.bonus.roomsContainer.y 
            },
            a = game.bonus.roomsContainer.centerMap();
            a.y -= 187;
            var r = Math.floor(Math.sqrt((o.x - a.x) * (o.x - a.x) + (o.y - a.y) * (o.y - a.y)));
            r > 0 && (n.addTween(new Tween(game.bonus.roomsContainer, "x", o.x).move(0, this.duration).move(a.x - o.x, 
            r)), n.addTween(new Tween(game.bonus.roomsContainer, "y", o.y).move(0, this.duration).move(a.y - o.y, 
            r)), this.duration += r), n.addAction(function () 
            {
                game.bonus.superprizeRoom.openMovie.play(0) 
            },
            this.duration), this.duration += 1e3, game.bonus.roomsContainer.removeChild(game.bonus.bgShadow), 
            game.bonus.roomsContainer.addChild(game.bonus.bgShadow);
            var l = (clientData.bonusGamesFinished - 1) % 9, h = game.bonus.pictures[l];
            h.visible = true;
            var u = h.x = a.x + game.bonus.superprizeRoom.x + game.bonus.superprizeRoom.interior.x + 1.45 * game.bonus.superprizeRoom.interior.width  / 2, 
            d = h.y = a.y + game.bonus.superprizeRoom.y + game.bonus.superprizeRoom.interior.y + 1.45 * game.bonus.superprizeRoom.interior.height  / 2, 
            c = Math.min(300  / h.height, 400  / h.width), p = game.bonus.text;
            p.visible = true, p.x = 720, p.y = (600 - h.height * c)  / 2 - p.getRect().height;
            var m = game.bonus.counter;
            m.visible = true, m.x = 720, m.y = (600 + h.height * c)  / 2, n.addTween(new Tween(p, "alpha", 
            0).move(1, this.duration + 300, Tween.JUMP).move(-1, 8e3, Tween.JUMP)), n.addTween(new Tween(m, 
            "alpha", 0).move(1, this.duration + 300, Tween.JUMP).move(-1, 8e3, Tween.JUMP)), n.addTween(new Tween(m, 
            function (t, e) 
            {
                m.tokens["value"] = currencyFormatter.format(Math.round(e));
            }, 0).move(0, this.duration + 300).move(20 * clientData.getTotalBet(), 5e3)), n.addTween(new Tween(h, 
            "alpha", 0).move(1, this.duration, Tween.JUMP).move(-1, 8600, Tween.JUMP)), n.addTween(new Tween(h, 
            "x", u).move(0, this.duration, Tween.JUMP).move((1440 - h.width * c)  / 2 - u, 300).move(0, 
            8e3).move(u - (1440 - h.width * c)  / 2, 300)), n.addTween(new Tween(h, "y", d).move(0, this.duration, 
            Tween.JUMP).move((600 - h.height * c)  / 2 - d, 300).move(0, 8e3).move(d - (600 - h.height * c)  / 2, 
            300)), n.addTween(new Tween(h, "scaleX", 0).move(0, this.duration, Tween.JUMP).move(c, 300).move(0, 
            8e3).move(-c, 300)), n.addTween(new Tween(h, "scaleY", 0).move(0, this.duration, Tween.JUMP).move(c, 
            300).move(0, 8e3).move(-c, 300)), n.addAction(function () 
            {
                ui.gameInfoBar.showById("game", "ACTION_BONUS_WIN", 0, {
                    value : h5game.formatMeter(serverData.bonusPaid) 
                }), game.bonus.bgShadow.visible = true, this.eventSound = sound.play("bonus_superprize_room"), 
                this.rollSound = sound.play("winRollSound", true) 
            }
            .bind(this), this.duration + 300), n.addAction(function () 
            {
                this.rollSound && this.rollSound.stop() 
            }
            .bind(this), this.duration + 5300), this.duration += 8600, n.addAction(function () 
            {
                game.bonus.roomsContainer.removeChild(game.bonus.thief), game.bonus.roomsContainer.addChild(game.bonus.thief), 
                h.visible = p.visible = m.visible = false, n.stop(), this.stop() 
            }
            .bind(this), this.duration), n.play(0) 
        }
        1 != e.type && (n.addTween(new Tween(e.openedCurrent, "x", e.openedCurrent.x).move((1440 - 1.83 * e.openedCurrent.width)  / 2 - (e.x + game.bonus.roomsContainer.x), 
        300).move(0, this.duration - 600).move(e.x + game.bonus.roomsContainer.x - (1440 - 1.83 * e.openedCurrent.width)  / 2, 
        300)), n.addTween(new Tween(e.openedCurrent, "y", e.openedCurrent.y).move((600 - 1.83 * e.openedCurrent.height)  / 2 - (e.y + game.bonus.roomsContainer.y), 
        300).move(0, this.duration - 600).move(e.y + game.bonus.roomsContainer.y - (600 - 1.83 * e.openedCurrent.height)  / 2, 
        300)), n.addTween(new Tween(e.openedCurrent, "scaleX", 1).move(.83, 300).move(0, this.duration - 600).move(-.83, 
        300)), n.addTween(new Tween(e.openedCurrent, "scaleY", 1).move(.83, 300).move(0, this.duration - 600).move(-.83, 
        300)), n.addTween(new Tween(e.interior, "x", e.interior.x).move((1440 - e.interior.wallpaper.width)  / 2 - (e.x + game.bonus.roomsContainer.x) - 4, 
        300).move(0, this.duration - 600).move(e.x + game.bonus.roomsContainer.x - (1440 - e.interior.wallpaper.width)  / 2 + 4, 
        300)), n.addTween(new Tween(e.interior, "y", e.interior.y).move((600 - e.interior.wallpaper.height)  / 2 - (e.y + game.bonus.roomsContainer.y) - 4, 
        300).move(0, this.duration - 600).move(e.y + game.bonus.roomsContainer.y - (600 - e.interior.wallpaper.height)  / 2 + 4, 
        300)), n.addTween(new Tween(e.interior, "scaleX", .55).move(.45, 300).move(0, this.duration - 600).move(-.45, 
        300)), n.addTween(new Tween(e.interior, "scaleY", .55).move(.45, 300).move(0, this.duration - 600).move(-.45, 
        300)), n.addAction(function () 
        {
            n.stop(), game.bonus.roomsContainer.removeChild(game.bonus.thief), game.bonus.roomsContainer.addChild(game.bonus.thief), 
            game.bonus.thief.appear(this.stop.bind(this)) 
        }
        .bind(this), this.duration)), n.play(0);
    }
},
BonusResultController.prototype.onEnterFrame = function ()
{
    this.skiped && this.clickedTime < this.duration - 300 && this.hasElapsedTimeStamp(this.clickedTime + 1) ? (1 == this.currentRoom.type && 4 == this.currentRoom.type && ui.gameInfoBar.showById("game", 
    "ACTION_BONUS_WIN", 0, {
        value : h5game.formatMeter(serverData.bonusPaid)
    }), game.bonus.panel.keysValue.tokens["value"] = serverData.bonusKeys, game.bonus.panel.handcuffsValue.tokens["value"] = serverData.bonusCops, 
    this.eventSound && this.eventSound.stop(), 1 == this.currentRoom.type ? (this.rollSound && this.rollSound.stop(), 
    stage.time - this.startTime < this.duration - 3300 ? (game.bonus.bgShadow.visible = true, this.movie.play(this.duration - 3300), 
    this.skiped = false, game.bonus.roomsContainer.addEventListenerOnce(GameEvent.CLICK, function ()
    {
        this.clickedTime2 = stage.time - this.startTime;
    }, this)) : (game.bonus.bgShadow.visible = true, this.movie.play(this.duration - 300))) : this.hasElapsedTimeStamp(this.duration - 300) || this.movie.play(this.duration - 800)) : this.clickedTime2 && this.clickedTime2 < this.clickedTime + 3e3 && this.hasElapsedTimeStamp(this.clickedTime2 + 1) && (game.bonus.bgShadow.visible = true, 
    this.movie.play(this.duration - 300));
},
BonusResultController.prototype.onStop = function ()
{
    this.thiefAnim && (this.thiefAnim.visible = false), game.bonus.roomsContainer.removeEventListener(GameEvent.CLICK, 
    function ()
    {
        this.clickedTime = stage.time - this.startTime;
    }, this), game.bonus.roomsContainer.removeEventListener(GameEvent.CLICK, function ()
    {
        this.clickedTime2 = stage.time - this.startTime;
    }, this)
},
(new BonusResultController).activate(), BonusStartController.prototype = Object.create(StateController.prototype), 
BonusStartController.prototype.constructor = BonusStartController, BonusStartController.prototype.onStart = function ()
{
    ui.curtain.show().then(function ()
    {
        this.stop(), clientData.display = Game.BONUS
    }
    .bind(this));
},
(new BonusStartController).activate(), BonusSummaryController.prototype = Object.create(StateController.prototype), 
BonusSummaryController.prototype.constructor = BonusSummaryController, BonusSummaryController.prototype.duration = 7e3, 
BonusSummaryController.prototype.clickedTime = 0, BonusSummaryController.prototype.onInit = function ()
{
    game.bonus.bonusSummary.addEventListener(GameEvent.CLICK, function ()
    {
        this.clickedTime = stage.time - this.startTime;
    }, this)
},
BonusSummaryController.prototype.onStart = function ()
{
    game.bonus.bonusSummary && (game.bonus.roomsContainer.removeChild(game.bonus.bgShadow), game.bonus.roomsContainer.addChild(game.bonus.bgShadow), 
    game.bonus.bonusSummary.visible = true, game.bonus.bgShadow.visible = true, clientData.bonusSuperprizePaid > 0 ? (game.bonus.bonusSummary.superprizeMovie.play(0), 
    this.sound = sound.play("bonus_stop")) : clientData.bonusPaid > 0 && 0 == clientData.bonusSuperprizePaid ? (game.bonus.bonusSummary.winMovie.play(0), 
    this.sound = sound.play("bonus_stop")) : this.sound = sound.play("bonus_start")), this.clickedTime = 0;
},
BonusSummaryController.prototype.onStop = function ()
{
    clientData.bonusSuperprizePaid > 0 && game.bonus.bonusSummary.superprizeMovie.stop(2500), clientData.bonusPaid > 0 && 0 == clientData.bonusSuperprizePaid && game.bonus.bonusSummary.winMovie.stop(1500), 
    game.bonus.bonusSummary && (game.bonus.bonusSummary.visible = false, game.bonus.bgShadow.visible = false);
    for (var t = 0; t < game.bonus.roomsCount; t++) {
        game.bonus.rooms[t].reset();
    }
    game.bonus.thief.show(), this.clickedTime = 0, this.sound && this.sound.stop();
},
BonusSummaryController.prototype.onEnterFrame = function ()
{
    var t = stage.time - this.startTime, e = 200;
    this.hasElapsedTimeStamp(this.clickedTime ? this.clickedTime + 50 : this.duration) && ui.curtain.showAndHide(function ()
    {
        game.bonus.bonusSummary && (game.bonus.bonusSummary.visible = false, game.bonus.bgShadow.visible = false), 
        clientData.display = Game.MAIN, this.stop()
    }
    .bind(this));
},
(new BonusSummaryController).activate(), BonusWaitController.prototype = Object.create(StateController.prototype), 
BonusWaitController.prototype.constructor = BonusWaitController, BonusWaitController.prototype.onStart = function ()
{
    this.currentRoom = game.bonus.currentRoom;
    var t = {
        x : game.bonus.roomsContainer.x, y : game.bonus.roomsContainer.y
    },
    e = game.bonus.roomsContainer.centerMap(clientData.bonusPick), i = Math.floor(Math.sqrt((t.x - e.x) * (t.x - e.x) + (t.y - e.y) * (t.y - e.y)));
    game.bonus.thief.disappear(function ()
    {
        if (i > 0)
        {
            var n = this.movie = new MovieClip;
            n.addTween(new Tween(game.bonus.roomsContainer, "x", t.x).move(e.x - t.x, i)), n.addTween(new Tween(game.bonus.roomsContainer, 
            "y", t.y).move(e.y - t.y, i)), n.addAction(function ()
            {
                n.stop(), this.stop()
            }
            .bind(this), i), n.play(0)
        }
        else {
            this.stop();
        }
    }
    .bind(this))
},
BonusWaitController.prototype.onStop = function ()
{
    this.currentRoom.interior && this.currentRoom.interior.icons && (this.currentRoom.interior.icons.visible = false), 
    game.bonus.panel.keysValue.tokens["value"] = clientData.bonusKeys - 1;
},
(new BonusWaitController).activate(), $.extend(CombinationEditorSymbol.prototype, 
{
    setId : function (t)
    {
        this.context.clearRect(0, 0, Symbol.width, Symbol.height), Symbol.get(t).states.normal.draw(this.context), 
        this.view.children(".id").html(t)
    }
}), UIController.prototype.customTemplates = function ()
{
    return {
        simpleSymbolCoeffs : systemLoader.inGamePath("templates/simpleSymbolCoeffs.html")
    }
},
UIController.prototype.customTemplateRenderData = function ()
{
    return {
        simpleSymbols : [ {
            id : 4
        },
        {
            id : 5
        },
        {
            id : 6
        },
        {
            id : 7
        },
        {
            id : 8
        },
        {
            id : 9
        },
        {
            id : 10
        },
        {
            id : 11
        },
        {
            id : 12
        },
        {
            id : 13
        }], specialSymbols : [ {
            id : 1
        },
        {
            id : 3
        }]
    }
},
UIMainMenu.prototype.onServerDataPrepared = function ()
{
    for (var t = {}, e = ui.customTemplateRenderData().simpleSymbols.map(function (t)
    {
        return t.id;
    }), i, n = 0;
    n < serverData.payouts.length;
    n++)
    {
        var s = serverData.payouts[n];
        if (i = parseInt(s.attr("symbol"), 10), e.indexOf(i) !=- 1)
        {
            var o = parseInt(s.attr("count"), 10), a = parseInt(s.attr("coef"), 10);
            o && a && (void 0 == t[i] && (t[i] = []), t[i].push({
                count : o, coeff : a
            }))
        }
    }
    for (i in t)
    {
        t.hasOwnProperty(i) && (t[i].sort(function (t, e) 
        {
            return e.count - t.count;
        }), this.payTableContainer.find(".simple-symbols .symbol-" + i + " .coeffs").html(ui.applyTemplate("simpleSymbolCoeffs", 
        t[i])));
    }
    for (var r = {}, l = ui.customTemplateRenderData().specialSymbols.map(function (t)
    {
        return t.id;
    }), i, n = 0;
    n < serverData.payouts.length;
    n++)
    {
        var s = serverData.payouts[n];
        if (i = parseInt(s.attr("symbol"), 10), l.indexOf(i) !=- 1)
        {
            var o = parseInt(s.attr("count"), 10), a = 1 == i ? parseInt(s.attr("coef"), 10) + " " + locale.getText("game", 
            "RULES_TB") : parseInt(s.attr("coef"), 10);
            o && a && (void 0 == r[i] && (r[i] = []), r[i].push({
                count : o, coeff : a
            }))
        }
    }
    for (i in r)
    {
        r.hasOwnProperty(i) && (r[i].sort(function (t, e) 
        {
            return e.count - t.count;
        }), this.payTableContainer.find(".special-symbols .symbol-" + i + " .coeffs").html(ui.applyTemplate("simpleSymbolCoeffs", 
        r[i])));
    }
},
UIBetSettings.prototype.addExtraText = function ()
{
    this.dom.find(".drag-playground").append('<div class="averagebet-label"></div>'), this.averageBetLabel = new UILabel(this.dom.find(".drag-playground > .averagebet-label")), 
    this.averageBetLabel.onClientUpdate(function ()
    {
        this.text = clientData.getFreespinsBet() ? locale.getText("game", "BET_SETTINGS_AVERAGE_BET_LABEL") + h5game.formatMeter(clientData.getFreespinsBet()) : locale.getText("game", 
        "BET_SETTINGS_AVERAGE_BET_LABEL") + "--.--";
    })
},
UIMainMenu.prototype.refreshPaytableData = function ()
{
    this.bonusWin = new UILabel(this.dom.find(".val")), this.bonusWin.text = h5game.formatMeter(clientData.allBonusWins), 
    this.bonusWinLabel = new UILabel(this.dom.find(".win_label")), clientData.allBonusWins > 0 ? ($(".val").show(), 
    $(".win_label").show()) : ($(".val").hide(), $(".win_label").hide());
    for (var t = 0; t < 9; t++)
    {
        clientData.bonusGamesFinished > t ? $(".pictures .pic" + (t + 1)).show() : $(".pictures .pic" + (t + 1)).hide();
    }
},
$.extend(CombinationEditorReel.prototype, 
{
    setStrip : function (t)
    {
        this.strip = t, this.update();
    },
    setOffset : function (t)
    {
        this.offset = this.correct(t), this.update();
    },
    correct : function (t)
    {
        return (t % this.strip.length + this.strip.length) % this.strip.length;
    },
    update : function ()
    {
        for (var t = 1; t <= slotConfig.rows; t++) {
            this [t].setId(this.getSymbolId(this.offset, t));
        }
    },
    shift : function (t, e)
    {
        e = this.correct(this.offset + (t ? 1 :- 1 * (e || 1))), this.setOffset(e);
    },
    getSymbolId : function (t, e)
    {
        return this.strip[this.correct(e - t - 1)];
    },
    shiftToNextSymbol : function (t, e)
    {
        for (var i = 1; i < Symbol.number; i++)
        {
            var n = (this.getSymbolId(this.offset, t) + i * (e ? 1 :- 1) - 1 + Symbol.number) % Symbol.number + 1, 
            s = this.getNextSymbolPosition(n, this.offset, t, e);
            if (null !== s) {
                return void this.setOffset(s);
            }
        }
    },
    shiftToNextCurrentSymbol : function (t, e)
    {
        var i = this.getNextSymbolPosition(this.getSymbolId(this.offset, t), this.offset, t, e);
        null !== i && this.setOffset(i)
    },
    getNextSymbolPosition : function (t, e, i, n)
    {
        for (var s = 1; s < this.strip.length; s++) {
            var o = e + s * (n ? 1 :- 1);
            if (this.getSymbolId(o, i) == t) {
                return o;
            }
        }
        return null;
    }
}), $.extend(CombinationEditor.prototype, 
{
    setCombination : function (t)
    {
        for (var e = 1; e <= slotConfig.columns; e++) {
            this [e].setOffset(t[e - 1]);
        }
    },
    getCombination : function ()
    {
        for (var t = [], e = 1; e <= slotConfig.columns; e++) {
            t[e - 1] = this [e].offset;
        }
        return t;
    },
    edit : function (t)
    {
        this.editedSymbol && this.editedSymbol.view.removeClass("edited"), this.editedSymbol == t ? (this.view.removeClass("edited"), 
        this.editedSymbol = null) : ($(".combination-editor").addClass("edited"), this.editedSymbol = t, 
        this.editedSymbol.view.addClass("edited"));
    },
    setReelSetId : function (t)
    {
        for (var e = 1; e <= slotConfig.columns; e++) {
            this [e].setStrip(serverData.reelSets[t][e]);
        }
    }
}), SlotShifter.prototype.CombinationEditor = CombinationEditor;