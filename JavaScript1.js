function SystemLoader() {
    this.pageArguments = this.parseQueryString(window.location.search), this.uiScripts = [], this.gameScripts = [],
    this.configData = {}, this.startTime = 0, this.isStartedUI = false, this.debug = false, this.debug && (this.debugContainer = document.getElementById("loader-msg"),
    this.debugContainer || (document.getElementById("root-wrapper").innerHTML += '<div id="loader-msg"></div>',
    this.debugContainer = document.getElementById("loader-msg")), this.debugMessage("SystemLoader starting..."))
}
SystemLoader.prototype.constructor = SystemLoader, SystemLoader.prototype.debugDone = function () {
    this.debug && document.getElementById("root-wrapper").removeChild(this.debugContainer)
},
SystemLoader.prototype.debugMessage = function (e) {
    this.debug && (this.debugContainer.innerHTML = e);
},
SystemLoader.prototype.start = function (e, t, o) {
    console.log("SystemLoader.prototype.start"), this.enginePath = e, this.gamePath = t, this.gameListAttrs = o,
    this.startTime = Date.now(), this.debugMessage("Starting system loader");
    var i = document.createElement("script");
    i.type = "text/javascript", i.src = this.inUIPath("js/thirdparty/jquery.min.js"), document.body.appendChild(i),
    i.addEventListener("load", function () {
        this.attachLibraryScripts().then(this.attachPageOnLoad.bind(this)).then(this.initDefaultErrorMessage.bind(this)).then(this.setDefaultScriptPaths.bind(this)).then(this.loadConfig.bind(this)).then(this.loadUIScript.bind(this)).then(this.loadGameScript.bind(this)).then(this.applyConfig.bind(this)).then(this.attachErrorReporter.bind(this)).done(function () {
            this.debugMessage("SystemLoader succeeded"), $(".inserted").removeAttr("class"), this.forwardToUI()
        }
        .bind(this)).fail(this.onError.bind(this))
    }
    .bind(this))
},
SystemLoader.prototype.inGamePath = function (e) {
    var t = this.gamePath, o = function (e) {
        return encodeURI(t + e + (e ? "?r=1478256094188" : ""))
    }
    .bind(this);
    return e.constructor == String ? o(e) : e.map(o);
},
SystemLoader.prototype.inCommonPath = function (e) {
    var t = this.enginePath, o = function (e) {
        return encodeURI(t + "common/" + e + (e ? "?r=1478256094188" : ""));
    };
    return e.constructor == String ? o(e) : e.map(o);
},
SystemLoader.prototype.inUIPath = function (e) {
    var t = this.enginePath, o = function (e) {
        return encodeURI(t + "ui/" + e + (e ? "?r=1478256094188" : ""));
    };
    return e.constructor == String ? o(e) : e.map(o);
},
SystemLoader.prototype.inToolsPath = function (e) {
    var t = this.enginePath, o = function (e) {
        return encodeURI(t + "tools/" + e + (e ? "?r=1478256094188" : ""));
    };
    return e.constructor == String ? o(e) : e.map(o);
},
SystemLoader.prototype.forwardToUI = function () {
    return this.debugMessage("SystemLoader.forwardToUI"), this.isStartedUI = true, ui.start();
},
SystemLoader.prototype.setDefaultScriptPaths = function () {
    this.debugMessage("SystemLoader.setDefaultScriptPaths"), this.uiScripts = [], this.gameScripts = [this.inGamePath("game.js")];
},
SystemLoader.prototype.loadUIScript = function () {
    return this.debugMessage("SystemLoader.loadUIScript"), this.loadScriptChain(this.uiScripts);
},
SystemLoader.prototype.loadGameScript = function () {
    return this.debugMessage("SystemLoader.loadGameScript"), this.loadScriptChain(this.gameScripts);
},
SystemLoader.prototype.loadStyles = function () {
    this.debugMessage("SystemLoader.loadStyles");
    var e = $.Deferred(), t = function () {
        e.reject()
    },
    o = function () {
        e.resolve()
    };
    return this.loadStyleChain([this.inUIPath("styles.css"), this.inGamePath("styles.css")]).done(o).fail(t),
    e.promise()
},
SystemLoader.prototype.parseQueryString = function (e) {
    return e.match(/\??(.*)/)[1].split("&").reduce(function (e, t) {
        var o = t.split("=");
        return e[o[0]] = decodeURIComponent(o[1]), e;
    },
    {})
},
SystemLoader.prototype.loadChain = function (e, t, o, i) {
    for (var n = [], r = 0, a = e.length, s = 0; s < e.length; s++) {
        n.push(function (e, n) {
            var a = t(e, n), s = $.Deferred();
            return a.onload = function () {
                s.resolve(), i && i(e, n), r += 1
            },
            a.onerror = function () {
                $($(".inserted").get().reverse()).remove(), s.reject()
            },
            o.appendChild(a), s.promise()
        }
        (s, e[s]));
    }
    return $.when.apply($, n).promise();
},
SystemLoader.prototype.loadAjaxGetChain = function (e, t, o) {
    o = o || function () { };
    var i = [], n = {
        type: "GET", dataType: "text"
    },
    r = 0, a = e.length;
    t = $.extend(true, {}, n, t || {});
    for (var s = 0; s < e.length; s++) {
        i.push(function (e, i) {
            var n = $.ajax($.extend({}, t, {
                url: i
            })).pipe(function (t) {
                return [e, i, t];
            }).fail(function () {
                console.error("failing", i)
            }).done(function () {
                r += 1, o.call(this, r / a)
            });
            return n
        }
        (s, e[s]));
    }
    return $.when.apply($, i).promise();
},
SystemLoader.prototype.urlUnify = function (e) {
    return e.indexOf("data:image") > -1 ? e : e = e.indexOf("rel") > -1 ? e.replace(/rel=.*/gi, "rel=" + (new Date).getTime()) : e.indexOf("?") > -1 ? e + "&rel=" + (new Date).getTime() : e + "?rel=" + (new Date).getTime();
},
SystemLoader.prototype.loadScriptChain = function (e) {
    return this.loadChain(e, function (e, t) {
        var o = document.createElement("script");
        return o.async = false, o.type = "text/javascript", o.src = t, o.className = "inserted", o
    }
    .bind(this), document.body);
},
SystemLoader.prototype.loadStyleChain = function (e) {
    var t = $.Deferred();
    return this.loadAjaxGetChain(e, false).fail(function () {
        t.reject()
    }).pipe(function () {
        for (var e = arguments.length, o = 0, i = null, n = 0; n < arguments.length; n++) {
            i = document.createElement("link"), i.rel = "stylesheet", i.type = "text/css", i.href = arguments[n][1],
            i.onload = function () {
                o += 1, o == e && t.resolve()
            },
            document.head.appendChild(i);
        }
    }), t.promise()
},
SystemLoader.prototype.loadTemplateChain = function (e, t) {
    var o = [], i = [];
    for (var n in e) {
        e.hasOwnProperty(n) && (o.push(n), i.push(e[n]));
    }
    return this.loadAjaxGetChain(i, false, t).pipe(function () {
        for (var e = {}, t = 0; t < arguments.length; t++) {
            var i = arguments[t][0], n = arguments[t][2];
            e[o[i]] = n
        }
        return e;
    })
},
SystemLoader.prototype.attachLibraryScripts = function () {
    return this.loadScriptChain(this.inUIPath(["js/thirdparty/jquery-ui.min.js", "js/thirdparty/jquery.ui.touch-punch.min.js",
    "js/thirdparty/handlebars.min.js", "js/thirdparty/iscroll.js", "js/thirdparty/webfont.js", "js/thirdparty/TabWindowVisibilityManager.js",
    "js/thirdparty/ajaxTransport.js", "js/thirdparty/inobounce.min.js"]))
},
SystemLoader.prototype.attachPageOnLoad = function () {
    var e = $.Deferred();
    return "object" == typeof iNoBounce && iNoBounce.enable(), window.addEventListener("load", function () {
        systemLoader.pageLoaded = true, e.resolve()
    }
    .bind(this)), systemLoader.pageLoaded && e.resolve(), e.promise();
},
SystemLoader.prototype.initDefaultErrorMessage = function () {
    this.debugMessage("SystemLoader.initDefaultErrorMessage");
    var e = {
        en: "Something went wrong with loading of the game resources.<br>Please reload the page."
    },
    t = e[this.pageArguments.lang] || e["en"];
    $("#default-error-message .title").html(t)
},
SystemLoader.tryReconnect = 0, SystemLoader.prototype.onError = function () {
    setTimeout(function () {
        this.debugMessage("Try to restart SystemLoader"), systemLoader.start()
    }
    .bind(this), 3e3), SystemLoader.tryReconnect++, this.debugMessage("<div>Connection lost</div><div>Waiting for connection restore")
},
SystemLoader.prototype.loadConfig = function () {
    var e = $.Deferred();
    return this.debugMessage("SystemLoader.loadConfig"), "true" === this.pageArguments.debugConfig ? this.loadScriptChain([this.inGamePath("debug.js"),
    this.inUIPath("files.js")]).then(function () {
        this.configData = debug.getCustomConfig()
    }
    .bind(this)) : this.pageArguments.config_id ? ($.ajax(
    {
        type: "GET", url: "ui/configs/" + this.pageArguments.config_id + ".json?r=" + (new Date).getTime(),
        contentType: "application/json", dataType: "json", timeout: 2e3
    }).then(function (t) {
        this.configData = t, e.resolve()
    }
    .bind(this)).fail(function () {
        return $.ajax({
            type: "GET", url: "configs/" + this.pageArguments.config_id + ".json?r=" + (new Date).getTime(),
            contentType: "application/json", dataType: "json", timeout: 2e3
        }).then(function (t) {
            this.configData = t, e.resolve()
        }
        .bind(this))
    }
    .bind(this)), e.promise()) : void 0;
},
SystemLoader.prototype.applyConfig = function () {
    this.debugMessage("SystemLoader.applyConfig");
    var e = this.configData, t = this.pageArguments, o = this.gameListAttrs;
    $.ajax({
        url: this.inUIPath("../../../BUILD-INFO.txt"), timeout: 2e3, dataType: "text"
    }).done(function (e) {
        gameConfig.loadConfig({
            gameVersion: (e.match(/#BUILD NUMBER#\s((?:\S+\.)+\d+)/) || [void 0, void 0])[1]
        })
    });
    var i =
    {
        gameVersion: void 0, revision: "1478256094188", name: o.name, server_url: (t.server_url || window.location.origin + "/ih_proxy.php") + "?server_id=" + t.server_id,
        exit_url: t.exit_url || e.exit_url || "", cashier_url: t.cashier_url || e.cashier_url || "",
        error_url: t.error_url || e.error_url || "", report_url: e.report_url || t.report_url || this.inUIPath("report.php"),
        guid: t.key || "", session: t.session || "", denum: parseInt(t.denum || e.denum || 100, 10),
        wl: t.wl || "", lang: t.lang || e.lang || "en", debug: e.debug || false, hideServerLogs: "true" == t.hideServerLogs || e.hideServerLogs || false,
        nofullscreen: "true" == t.nofullscreen, useCurrencySymbol: void 0 != e.useCurrencySymbol && Boolean(e.useCurrencySymbol),
        useCurrencyName: void 0 != e.useCurrencyName && Boolean(e.useCurrencyName), decimalSeparator: e.decimalSeparator || ".",
        groupingSeparator: "", cutMoneyFractional: void 0 != e.cutMoneyFractional ? Boolean(e.cutMoneyFractional) : "true" == t.cutMoneyFractional,
        cutMoneyZeroFractional: void 0 != e.cutMoneyZeroFractional ? Boolean(e.cutMoneyZeroFractional) : "true" == t.cutMoneyZeroFractional,
        timeOut: parseInt(e.timeOut || 1e4, 10), timeOutAttempts: parseInt(e.timeOutAttempts || 3, 10),
        longWaitTimeout: e.server_request_waiting_time ? parseInt(e.server_request_waiting_time, 10) : gameConfig.longWaitTimeout,
        showRtp: Boolean(e.showRtp), showBonusAutoplay: Boolean(e.showBonusAutoplay), rtp: o.rtp, showVersion: Boolean(e.showVersion),
        showGambleInfo: void 0 != e.showGambleInfo ? Boolean(e.showGambleInfo) : gameConfig.showGambleInfo,
        showCopyright: Boolean("true" == t.show_copyright || e.showCopyright || false), originSpinner: void 0 != t.logo ? Boolean("ps" == t.logo) : Boolean(e.originSpinner || false),
        gametable: t.gametable || 1, performRetry: Boolean(void 0 == e.performRetry || e.performRetry),
        customErrorReporter: e.customErrorReporter || "OriginErrorReporter", autoAdjust: void 0 === e.autoAdjust || Boolean(e.autoAdjust),
        noGiftSpins: Boolean(e.noGiftSpins) || false, disableTabWindowVisibilityManager: "true" == t.disableTabWindowVisibilityManager || Boolean(e.disableTabWindowVisibilityManager || false),
        isLowResolutionGraphics: !!t.lowResolutionGraphics && "true" == t.lowResolutionGraphics, realityCheckEnabled: !!(void 0 != t.realityCheck || e.realityCheck),
        realityCheckURL: t.realityCheckURL || e.realityCheckURL || "../../../../gm/lib/external.js",
        big_money_format: Boolean(e.big_money_format || false), currency: e.currency || null
    };
    gameConfig.loadConfig(i), userConfig.loadConfig(), userConfig.quickSpinEnabled = "true" == t.quickSpinByDefault || e.quickSpinByDefault || userConfig.quickSpinEnabled || false,
    slotConfig.coins = e.coins && (e.coins[o.name] || e.coins.slots) ? e.coins[o.name] || e.coins.slots : slotConfig.coins,
    slotConfig.defaultBet = e.defaultBets ? void 0 !== e.defaultBets[o.name] ? e.defaultBets[o.name] : void 0 !== e.defaultBets["default"] ? e.defaultBets["default"] : slotConfig.defaultBet : slotConfig.defaultBet,
    slotConfig.autoplayNumberRange = e.autoplayNumberRange || [5, 10, 25, 50, 100, 250, 500, 999], slotConfig.autoplayLossLimitRange = e.autoplayLossLimitRange || [5,
    10, 25, 50, 100, 250, 500, 999], slotConfig.autoplaySingleWinLimitRange = e.autoplaySingleWinLimitRange || [5,
    10, 25, 50, 100, 250, 500, 999], slotConfig.certified = void 0 !== e.certified ? Boolean(e.certified) : slotConfig.certified,
    slotConfig.certified ? slotConfig.autoplayLossLimit = 0 : slotConfig.autoplayLossLimit = ClientData.AUTOPLAY_LOSS_LIMIT_OFF,
    void 0 !== e.autoplaySingleWinLimit && (slotConfig.autoplaySingleWinLimit = Number(e.autoplaySingleWinLimit)),
    slotConfig.autoplaySingleWinLimit >= 0 && (slotConfig.autoplaySingleWinLimit = slotConfig.autoplaySingleWinLimitRange.indexOf(slotConfig.autoplaySingleWinLimit) != -1 ? slotConfig.autoplaySingleWinLimitRange[slotConfig.autoplaySingleWinLimitRange.indexOf(slotConfig.autoplaySingleWinLimit)] : slotConfig.autoplaySingleWinLimitRange.firstHigher(slotConfig.autoplaySingleWinLimit)),
    slotConfig.autoplaySingleWinLimit > slotConfig.autoplaySingleWinLimitRange.last() && (slotConfig.autoplaySingleWinLimit = slotConfig.autoplaySingleWinLimitRange.last()),
    slotConfig.autoplayNumber = Number(void 0 !== e.autoplayNumber ? e.autoplayNumber : 50), slotConfig.autoplayNumber = slotConfig.autoplayNumberRange.indexOf(slotConfig.autoplayNumber) != -1 ? slotConfig.autoplayNumberRange[slotConfig.autoplayNumberRange.indexOf(slotConfig.autoplayNumber)] : slotConfig.autoplayNumberRange.firstHigher(slotConfig.autoplayNumber),
    slotConfig.autoplayNumber > slotConfig.autoplayNumberRange.last() && (slotConfig.autoplayNumber = slotConfig.autoplayNumberRange.last()),
    slotConfig.extendedSpinRound = Boolean(slotConfig.extendedSpinRound), slotConfig.delay_main_spin = "number" == typeof e.delay_main_spin ? e.delay_main_spin : 0,
    slotConfig.delay_main_freespin = "number" == typeof e.delay_main_freespin ? e.delay_main_freespin : 0,
    slotConfig.delay_auto_spin = "number" == typeof e.delay_auto_spin ? e.delay_auto_spin : 0, slotConfig.delay_auto_freespin = "number" == typeof e.delay_auto_freespin ? e.delay_auto_freespin : 0,
    slotConfig.pause_auto_spin_win = "number" == typeof e.pause_auto_spin_win ? e.pause_auto_spin_win : 300,
    slotConfig.pause_auto_spin_lose = "number" == typeof e.pause_auto_spin_lose ? e.pause_auto_spin_lose : 300,
    slotConfig.pause_free_spin_win = "number" == typeof e.pause_free_spin_win ? e.pause_free_spin_win : 300,
    slotConfig.pause_free_spin_lose = "number" == typeof e.pause_free_spin_lose ? e.pause_free_spin_lose : 300,
    slotConfig.game_reel_start_interval = "number" == typeof e.game_reel_start_interval ? e.game_reel_start_interval : 100,
    slotConfig.game_reel_stop_interval = "number" == typeof e.game_reel_stop_interval ? e.game_reel_stop_interval : 600,
    slotConfig.game_reelset_move_time = "number" == typeof e.game_reelset_move_time ? e.game_reelset_move_time : 250,
    slotConfig.game_reelset_min_move_time = "number" == typeof e.game_reelset_min_move_time ? e.game_reelset_move_time : 250,
    gameConfig.originSpinner && document.getElementById("spinner").classList.add("origin");
    var n = t.ping_url || e.ping_url;
    if (n) {
        var r = 1e3 * parseInt(t.ping_interval || e.ping_interval || 30, 10);
        setInterval(function () {
            var e = new XMLHttpRequest;
            e.open("GET", n + (n.indexOf("?") >= 0 ? "&" : "?") + "t=" + (new Date).getTime(), true),
            e.send()
        }, r)
    }
    (new Image).src = "//tracknson.com/c/?cmd=0051&e=gamestart&gametitle=" + t.game + "&p=cont-" + o.name + "&pc=c1-ps-rm-ow&ts=" + (new Date).getTime(),
    gameConfig.cashier_url && (h5game.cashier = function () {
        window.location.href = gameConfig.cashier_url;
    }), slotConfig.analyticsTrackingID && this.initAnalyticsTracker(slotConfig.analyticsTrackingID)
},
SystemLoader.prototype.attachErrorReporter = function () {
    this.debugMessage("SystemLoader.attachErrorReporter");
    var errorReporterClass = gameConfig.customErrorReporter;
    errorReporterClass = eval(errorReporterClass), this.errorHandler = new errorReporterClass, "function" == typeof this.errorHandler.attachHandlers && this.errorHandler.attachHandlers();
},
SystemLoader.prototype.initAnalyticsTracker = function (e) { }, SystemLoader.prototype.sendAnalyticsData = function (e,
t, o, i) { }, SystemLoader.prototype.setAnalyticsUserId = function (e) { };
var systemLoader = window["systemLoader"] = new SystemLoader;