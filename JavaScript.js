var allowFullScreen = true;
var niceMode = false;
function SetUAgentAndroid()
{
    UAGENT_IE = undefined;
    UAGENT_CHROME = navigator.userAgent.toLowerCase().indexOf("chrome") !=- 1;
    UAGENT_ANDROID_CHROME = navigator.userAgent.toLowerCase().indexOf("android") !=- 1 && UAGENT_CHROME;
    UAGENT_SAMSUNG_BROWSER = navigator.userAgent.toLowerCase().indexOf("samsungbrowser") !=- 1 && UAGENT_CHROME;
    if (UAGENT_CHROME && UAGENT_CMOBILE || UAGENT_ANDROID_CHROME) {
        UAGENT_CMOBILE = true;
        UAGENT_CHROME = false
    }
    else {
        UAGENT_CMOBILE = false;
    }
    UAGENT_ANDROID = navigator.userAgent.toLowerCase().indexOf("android") !=- 1;
    UAGENT_ANDROID_4 = false;
    if (/Android[\/\s](\d+\.\d+)/.test(navigator.userAgent))
    {
        if (new Number(RegExp.$1) >= 4) {
            UAGENT_ANDROID_4 = true;
        }
        UAGENT_ANDROID_422 = false;
        if (/Android[\/\s](\d+\.\d+)/.test(navigator.userAgent))
        {
            if (new Number(RegExp.$1) == 4.2) {
                UAGENT_ANDROID_422 = true;
            }
            UAGENT_ANDROID = navigator.userAgent.toLowerCase().match(/htc/) && UAGENT_IE == false ? true : UAGENT_ANDROID;
            UAGENT_SGS3 = false;
            UAGENT_SGS3_1 = navigator.userAgent.toLowerCase().match("sgh-t999") ? true : false;
            UAGENT_SGS3_2 = navigator.userAgent.toLowerCase().match("gt-i9300") ? true : false;
            if (UAGENT_SGS3_1 || UAGENT_SGS3_2) {
                UAGENT_SGS3 = true;
            }
            UAGENT_ANDROID_23 = navigator.userAgent.toLowerCase().indexOf("android 2.3") !=- 1;
            UAGENT_ANDROID_31 = navigator.userAgent.toLowerCase().indexOf("android 3.1") !=- 1;
            UAGENT_ANDROID_32 = navigator.userAgent.toLowerCase().indexOf("android 3.2") !=- 1;
            UAGENT_NEXUS7 = navigator.userAgent.toLowerCase().indexOf("nexus 7") !=- 1;
            UAGENT_NEXUS10 = navigator.userAgent.toLowerCase().indexOf("nexus 10") !=- 1;
            UAGENT_NOTE3 = navigator.userAgent.toLowerCase().indexOf("sm-n900t") != - 1;
            UAGENT_STS = navigator.userAgent.toLowerCase().indexOf("sm-t800") !=- 1;
            UAGENT_SAMSUNG_G_TAB = false;
            var tmp = screen.availWidth == 800 && screen.availHeight == 1280 || screen.availWidth == 1280 && screen.availHeight == 800;
            if (UAGENT_ANDROID_31 && tmp || UAGENT_ANDROID_32 && tmp) {
                UAGENT_SAMSUNG_G_TAB = true;
            }
            UAGENT_ARCHOSA7 = navigator.userAgent.toLowerCase().indexOf("a70s") !=- 1;
            UAGENT_ANDROID3MINUS = false;
            UAGENT_ANDROID3PLUS = false;
            if (/Android[\/\s](\d+\.\d+)/.test(navigator.userAgent)) 
            {
                if (new Number(RegExp.$1) < 3) {
                    UAGENT_ANDROID3MINUS = true;
                }
                if (new Number(RegExp.$1) > 3) {
                    UAGENT_ANDROID3PLUS = true ;
                }
            }
            UAGENT_ONEX = navigator.userAgent.toLowerCase().indexOf("htc_one_x") !=- 1;;
        }
    }
}
function SetUAgentIOS()
{
    UAGENT_IPAD = navigator.userAgent.toLowerCase().indexOf("ipad") !=- 1;
    UAGENT_IPAD3 = UAGENT_IPAD && window.devicePixelRatio == 2;
    UAGENT_IPHONE = navigator.userAgent.toLowerCase().indexOf("iphone") !=- 1 || navigator.userAgent.toLowerCase().indexOf("ipod") !=- 1 || navigator.userAgent.toLowerCase().indexOf("iphone simulator") !=- 1;
    UAGENT_IPHONE4 = UAGENT_IPHONE && window.screen.height == 480;
    UAGENT_IPHONE5 = UAGENT_IPHONE && window.screen.height == 568;
    UAGENT_IPHONE3 = UAGENT_IPHONE && window.devicePixelRatio == 1;
    UAGENT_IOS5 = navigator.userAgent.match(/(iPad|iPhone|iPhone Simulator);.*CPU.*OS 5_\d/i) ? true : false;
    UAGENT_IOS6 = navigator.userAgent.match(/(iPad|iPhone|iPhone Simulator);.*CPU.*OS 6_\d/i) ? true : false;
    UAGENT_IOS7 = navigator.userAgent.match(/(iPad|iPhone|iPhone Simulator);.*CPU.*OS 7_\d/i) ? true : false;
    UAGENT_IOS8 = navigator.userAgent.match(/(iPad|iPhone|iPhone Simulator);.*CPU.*OS 8_\d/i) ? true : false;
    UAGENT_IOS9 = navigator.userAgent.match(/(iPad|iPhone|iPhone Simulator);.*CPU.*OS 9_\d/i) ? true : false;
    UAGENT_IOS10 = navigator.userAgent.match(/(iPad|iPhone|iPhone Simulator);.*CPU.*OS 10_\d/i) ? true : false;
    UAGENT_IOS = false;
    if (UAGENT_IOS10) {
        UAGENT_IOS9 = true;
    }
    if (UAGENT_IOS9) {
        UAGENT_IOS8 = true;
    }
    if (UAGENT_IOS8) {
        UAGENT_IOS7 = true;
    }
    if (UAGENT_IOS7) {
        UAGENT_IOS6 = true;
    }
    if (UAGENT_IOS6) {
        UAGENT_IOS = true;
    }
}
function SetUAgentWindowsPhone()
{
    UAGENT_IE = navigator.userAgent.toLowerCase().indexOf("msie") !=- 1;
    UAGENT_IE10 = navigator.userAgent.toLowerCase().indexOf("msie 10") !=- 1;
    UAGENT_IE_10 = UAGENT_IE10;
    UAGENT_IE11 = UAGENT_IE_11 = false;
    var ie11Reg = /Trident\/(\d+)\.?(\d*)/;
    var bTridentFound = navigator.userAgent.toLowerCase().indexOf("mozilla") !=- 1 && ie11Reg.test(navigator.userAgent);
    if (bTridentFound)
    {
        var tridentVersion = RegExp.$1;
        switch (tridentVersion)
        {
            case "6":
                UAGENT_IE10 = UAGENT_IE_10 = true;
                break;
            case "7":
                UAGENT_IE11 = UAGENT_IE_11 = true;
                break
        }
    }
    UAGENT_IE = bTridentFound || UAGENT_IE;
    if (UAGENT_IE) {
        UAGENT_IE = true;
        UAGENT_IPHONE = false;
        UAGENT_ANDROID = false;
    }
}
function SetUAgentOther()
{
    UAGENT_FIREFOX = navigator.userAgent.toLowerCase().indexOf("firefox") !=- 1;
    UAGENT_CMOBILE = navigator.userAgent.toLowerCase().indexOf("mobile") !=- 1;
    UAGENT_BLACKBERRY = navigator.userAgent.toLowerCase().indexOf("blackberry") !=- 1;
    UAGENT_BLACKBERRY_9930 = UAGENT_BLACKBERRY && navigator.userAgent.match(/9930/)
}
SetUAgentOther();
SetUAgentAndroid();
SetUAgentIOS();
SetUAgentWindowsPhone();
if ("ontouchstart"in document.documentElement && !UAGENT_IE) {
    var UAGENT_NO_TOUCH_SUPPORT = false;
}
else {
    var UAGENT_NO_TOUCH_SUPPORT = true;
}
var UA_DEVICES2 = [UAGENT_IPHONE, UAGENT_IPAD, UAGENT_SAMSUNG_G_TAB, UAGENT_BLACKBERRY, UAGENT_IE];
var UA_DEVICES_STR2 = ["UAGENT_IPHONE", "UAGENT_IPAD", "UAGENT_SAMSUNG_G_TAB", "UAGENT_BLACKBERRY", "UAGENT_IE"];
var DEVICE_USED_STR2 = "";
var UA_DEVICES = [UAGENT_IPHONE, UAGENT_IPAD, UAGENT_SAMSUNG_G_TAB, UAGENT_BLACKBERRY, UAGENT_IE];
var UA_DEVICES_STR = ["UAGENT_IPHONE", "UAGENT_IPAD", "UAGENT_SAMSUNG_G_TAB", "UAGENT_BLACKBERRY", "UAGENT_IE"];
var DEVICE_USED_STR = "";
var UAGENT_SLOW_DEVICE = navigator.userAgent.toLowerCase().match(/zte-blade|htc hero/) || UAGENT_SAMSUNG_G_TAB;
for (var devi = 0; devi < UA_DEVICES2.length; devi++) if (UA_DEVICES2[devi]) {
    DEVICE_USED_STR2 = UA_DEVICES_STR2[devi];
    break
}
for (var devi = 0; devi < UA_DEVICES.length; devi++) if (UA_DEVICES[devi]) {
    DEVICE_USED_STR = UA_DEVICES_STR[devi];
    break
}
var CANVAS_SCRATCH_SUPPORT = false;
if (!UAGENT_IE && !UAGENT_SLOW_DEVICE && !UAGENT_NO_TOUCH_SUPPORT) {
    CANVAS_SCRATCH_SUPPORT = true;
}
DEVICE = 
{
    orientation : orientation = "", override : override = false, pt : pt = {
        w : 0, h : 0, scale : 0, set : false
    },
    ls : ls = {
        w : 0, h : 0, scale : 0, set : false
    },
    desktop : desktop = UAGENT_FIREFOX || UAGENT_CHROME && !UAGENT_CMOBILE, loaded : loaded = false;
};
DEVICE_IPHONE4 = 
{
    name : name = "iphone4", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 834, scale : 0, set : false
    },
    ls : ls = {
        w : 960, h : 538, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE4_IOS7_WITH_SCROLLING = 
{
    name : name = "iphone4ios7", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 890, scale : 0, set : false
    },
    ls : ls = {
        w : 960, h : 645, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE5_IOS7_WITH_SCROLLING = 
{
    name : name = "iphone5ios7", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 1070, scale : 0, set : false
    },
    ls : ls = {
        w : 1136, h : 645, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE4_ios7_with_bars = 
{
    name : name = "iphone4", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 744, scale : 0, set : false
    },
    ls : ls = {
        w : 960, h : 430, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE4_WEBVIEW = 
{
    name : name = "iphone", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 920, scale : 0, set : false
    },
    ls : ls = {
        w : 960, h : 600, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE5 = 
{
    name : name = "iphone5", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 1010, scale : 0, set : false
    },
    ls : ls = {
        w : 1136, h : 536, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE5_WEBVIEW = 
{
    name : name = "iphone", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 1096, scale : 0, set : false
    },
    ls : ls = {
        w : 1136, h : 600, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE3GS = 
{
    name : name = "iphone3gs", override : override = true, orientation : orientation = "", pt : pt = {
        w : 320, h : 416, scale : 0, set : false
    },
    ls : ls = {
        w : 480, h : 268, scale : 0, set : false
    },
    fullscreen : fullscreen = false, desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPHONE3GS_WEBVIEW = 
{
    name : name = "iphone3gs", override : override = true, orientation : orientation = "", pt : pt = {
        w : 320, h : 460, scale : 0, set : false
    },
    ls : ls = {
        w : 480, h : 300, scale : 0, set : false
    },
    fullscreen : fullscreen = false, desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPAD = 
{
    name : name = "ipad", override : override = true, orientation : orientation = "", pt : pt = {
        w : 768, h : 928, scale : 0, set : false
    },
    ls : ls = {
        w : 1024, h : 672, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPAD_BOOKMARKS = 
{
    name : name = "ipad", override : override = true, orientation : orientation = "", pt : pt = {
        w : 768, h : 900, scale : 0, set : false
    },
    ls : ls = {
        w : 1024, h : 644, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPAD_WEBVIEW = 
{
    name : name = "ipad", override : override = true, orientation : orientation = "", pt : pt = {
        w : 768, h : 1004, scale : 0, set : false
    },
    ls : ls = {
        w : 1024, h : 748, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPAD_MINI = 
{
    name : name = "ipadmini", override : override = true, orientation : orientation = "", pt : pt = {
        w : 768, h : 927, scale : 0, set : false
    },
    ls : ls = {
        w : 1024, h : 671, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPAD_MINI_WEBVIEW = 
{
    name : name = "ipadmini", override : override = true, orientation : orientation = "", pt : pt = {
        w : 768, h : 1004, scale : 0, set : false
    },
    ls : ls = {
        w : 1024, h : 748, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_IPAD_MINI_BOOKMARKS = 
{
    name : name = "ipadmini", override : override = true, orientation : orientation = "", pt : pt = {
        w : 768, h : 904, scale : 0, set : false
    },
    ls : ls = {
        w : 1024, h : 648, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_ONEX = 
{
    name : name = "onex", override : override = true, orientation : orientation = "", pt : pt = {
        w : 640, h : 1001, scale : 0, set : false
    },
    ls : ls = {
        w : 960, h : 502, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_GTAB_small = 
{
    name : name = "gtab10", override : override = true, orientation : orientation = "", pt : pt = {
        w : 400, h : 564, scale : 0, set : false
    },
    ls : ls = {
        w : 640, h : 348, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_GTAB = 
{
    name : name = "gtab10", override : override = true, orientation : orientation = "", pt : pt = {
        w : 800, h : 1128, scale : 0, set : false
    },
    ls : ls = {
        w : 1280, h : 696, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
DEVICE_CUSTOM = 
{
    name : name = "custom", override : override = true, orientation : orientation = "", pt : pt = {
        w : 0, h : 0, scale : 0, set : false
    },
    ls : ls = {
        w : 0, h : 0, scale : 0, set : false
    },
    desktop : desktop = false, loaded : loaded = true;
};
Scale.ORIENTATIONCHANGE = undefined;
Scale.MainloopPollRate = 10;
function Scale(gameID, gameRes, paramwidth, paramheight, wrappermode, fullscreenmode)
{
    if (this.constructor !== arguments.callee)
    {
        return new Scale(gameID, gameRes, paramwidth, paramheight, wrappermode, fullscreenmode);
    }
    var that = this;
    if (this.OldGame(gameID)) {
        DEVICE.loaded = true;
        OldScale(gameID, gameRes, paramwidth, paramheight);
        return
    }
    if (paramwidth == "") {
        paramwidth = undefined;
    }
    if (paramheight == "") {
        paramheight = undefined;
    }
    if (wrappermode == "") {
        wrappermode = undefined;
    }
    if (typeof sjs !== undefined && sjs.isPixi && typeof force320Regex !== "undefined" && force320Regex.test(gameID))
    {
        this.m_OverriddenDevices = [DEVICE_IPHONE3GS, DEVICE_IPHONE5, DEVICE_IPHONE5_IOS7_WITH_SCROLLING, 
        DEVICE_IPAD_MINI, DEVICE_IPAD];
    }
    else
    {
        this.m_OverriddenDevices = [DEVICE_IPHONE3GS, DEVICE_IPHONE4, DEVICE_IPHONE5, DEVICE_IPHONE4_IOS7_WITH_SCROLLING, 
        DEVICE_IPHONE5_IOS7_WITH_SCROLLING, DEVICE_IPAD_MINI, DEVICE_IPAD];
    }
    if (paramwidth != undefined && paramheight != undefined)
    {
        DEVICE_CUSTOM.pt.w = paramwidth;
        DEVICE_CUSTOM.pt.h = paramheight;
        DEVICE_CUSTOM.ls.w = paramheight;
        DEVICE_CUSTOM.ls.h = paramwidth;
        this.m_OverriddenDevices = [DEVICE_CUSTOM]
    }
    this.m_SjsDom = null;
    this.m_InvertCheckDelayTimer = 0;
    this.m_InvertCheckDurationTimer = 0;
    this.INVERTCHECK_DELAY = 500;
    this.INVERTCHECK_DURATION = 5E3;
    this.m_GBDom = document.getElementById("game_base");
    this.m_CheckCorrectSize = false;
    this.MainLoop();
    this.setSjsProperties();
    if (UAGENT_IOS && (typeof force320Regex !== "undefined" && force320Regex.test(gameID) || !UAGENT_IPHONE4)) {
        this.createFullscreenElements();
    }
    if (DEVICE.desktop) {
        this.DesktopMode(gameRes);
        return
    }
    this.m_InnerHeights = [];
    this.m_InnerWidths = [];
    this.m_TickerCounter = 0;
    this.m_ResizeDevices = [UAGENT_IE, UAGENT_FIREFOX, UAGENT_CHROME];
    var onOrientationChange = function (e)
    {
        if (HandleKeyboard()) {
            return;
        }
        setTimeout(function ()
        {
            window.scrollTo(0, 1)
        }, 800);
        if ((!DEVICE.pt.set || !DEVICE.ls.set) && !DEVICE.override)
        {
            if (!UAGENT_IOS8) {
                that.setSjsH(2E3);
            }
            that.m_CheckCorrectSize = true;
            Scale.MainloopPollRate = 10;
            return
        }
        switch (window.orientation)
        {
            case 0:
            case 180:
                DEVICE.orientation = "pt";
                break;
            case 90:
            case - 90:
                DEVICE.orientation = "ls";
                break;
            case "":
                window.innerHeight < window.innerWidth ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
                break
        }
        if (DEVICE.override)
        {
            if (UAGENT_IOS && !window.navigator.standalone) {
                that.CheckFullScreenMode();
            }
            if (!DEVICE.pt.set || !DEVICE.ls.set) {
                DEVICE[DEVICE.orientation].set = true;
                setValues()
            }
        }
        that.setSjsW(DEVICE[DEVICE.orientation].w);
        that.setSjsH(DEVICE[DEVICE.orientation].h);
        that.m_InvertCheckDurationTimer = getTimer() + that.INVERTCHECK_DURATION;
        that.m_InvertCheckDelayTimer = getTimer() + that.INVERTCHECK_DELAY;
        var orientationTimeout = null;
        if (this.m_SjsDom == null) {
            this.m_SjsDom = document.getElementById("sjs");
        }
        if (this.m_SjsDom != null)
        {
            setValues();
            if (orientationTimeout != null) {
                clearTimeout(orientationTimeout);
            }
            Orientation.ChangeOrientation(DEVICE.orientation)
        }
        else {
            orientationTimeout = setTimeout(function () 
            {
                onOrientationChange(e) 
            }, 500);
        }
    };
    this._onOrientationChange = onOrientationChange;
    var HandleKeyboard = function ()
    {
        if (DEVICE.loaded && KeyBoard.Showing)
        {
            if (UAGENT_ANDROID3PLUS)
            {
                viewport = document.querySelector("meta[name=viewport]");
                viewport.setAttribute("content", "width=device-width, target-densitydpi=high-dpi, initial-scale=2.6, minimum-scale=2.6, maximum-scale=2.6");
                viewport.setAttribute("content", "width=device-width, target-densitydpi=high-dpi, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5")
            }
            else if (UAGENT_ANDROID3MINUS) {
                Scale.setDefaultScale();
            }
            else if (UAGENT_IPHONE || UAGENT_IPAD)
            {
                var inputfields = document.getElementsByClassName("form_style");
                for (var i = 0; i < inputfields.length; i++) {
                    inputfields[i].blur();
                }
            }
            else if (UAGENT_IE) {
                return true;
            }
            return false;
        }
    };
    var onOrientationChangeIE = function (e)
    {
        window.innerHeight < window.innerWidth ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
        if (!DEVICE.pt.set || !DEVICE.ls.set)
        {
            if (DEVICE.orientation == "ls")
            {
                DEVICE[DEVICE.orientation].w = window.innerWidth;
                DEVICE[DEVICE.orientation].h = window.innerHeight - 75
            }
            else
            {
                DEVICE[DEVICE.orientation].w = window.innerWidth;
                DEVICE[DEVICE.orientation].h = window.innerHeight + 7
            }
            DEVICE[DEVICE.orientation].set = true;
            DEVICE.loaded = true;
            setValues()
        }
        that.setSjsW(DEVICE[DEVICE.orientation].w);
        that.setSjsH(DEVICE[DEVICE.orientation].h);
        Orientation.ChangeOrientation(DEVICE.orientation)
    };
    if (UAGENT_IE && !UAGENT_IE10 && !UAGENT_IE_11) {
        onOrientationChange = onOrientationChangeIE;
    }
    if (!wrappermode) {
        this.OverriddenDevice();
    }
    onOrientationChange();
    this.CheckInvertedDevices();
    var supportsOrientationChange = this.OrientationChangeEvent();
    window.addEventListener(supportsOrientationChange, onOrientationChange, false);
    if (fullscreenmode)
    {
        document.addEventListener("webkitfullscreenchange", function ()
        {
            that.m_CheckCorrectSize = true;
        }, false);
        if (UAGENT_CMOBILE)
        {
            document.addEventListener("touchend", function () 
            {
                launchFullscreen(document.documentElement) 
            }, false);
        }
        else
        {
            document.addEventListener("click", function () 
            {
                launchFullscreen(document.documentElement) 
            }, false);
        }
    }
    if (UAGENT_CMOBILE || UAGENT_IE_11 || UAGENT_IOS8)
    {
        if (DEVICE.name == "iphone4ios7" || DEVICE.name == "iphone4") {
            return;
        }
        DEVICE.orientation = "ls";
        setInterval(function ()
        {
            that.PollCorrectSize()
        }, 1E3)
    }
    Scale.ORIENTATIONCHANGE = onOrientationChange
}
Scale.prototype.constructor = Scale;
Scale.prototype.PollCorrectSize = function ()
{
    var that = this;
    if (DEVICE[DEVICE.orientation].w != this.getWidth() || DEVICE[DEVICE.orientation].h != this.getHeight())
    {
        var width = this.getWidth();
        var height = this.getHeight();
        var oldOrientation = DEVICE.orientation;
        height < width ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
        if (oldOrientation == DEVICE.orientation && UAGENT_IOS9) {
            this._onOrientationChange();
        }
        DEVICE[DEVICE.orientation].h = height;
        DEVICE[DEVICE.orientation].w = width;
        this.setSjsW(DEVICE[DEVICE.orientation].w);
        this.setSjsH(DEVICE[DEVICE.orientation].h);
        setValues();
        Orientation.ChangeOrientation(DEVICE.orientation);
        return
    }
};
Scale.prototype.CheckInvertedDevices = function ()
{
    var width = this.getWidth();
    var height = this.getHeight();
    var correctOrientation = true;
    if (DEVICE.orientation == "pt" && height < width) {
        correctOrientation = false;
    }
    else if (DEVICE.orientation == "ls" && width < height) {
        correctOrientation = false;
    }
    if (!correctOrientation && UAGENT_ANDROID)
    {
        height < width ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
        DEVICE[DEVICE.orientation].h = height;
        DEVICE[DEVICE.orientation].w = width;
        DEVICE[DEVICE.orientation].set = true;
        this.setSjsW(DEVICE[DEVICE.orientation].w);
        this.setSjsH(DEVICE[DEVICE.orientation].h);
        DEVICE.loaded = true;
        setValues();
        Orientation.ChangeOrientation(DEVICE.orientation)
    }
};
Scale.prototype.CheckFullScreenMode = function ()
{
    var that = this;
    if (DEVICE.orientation == "ls")
    {
        if (that.getWidth() == 480 && that.getHeight() == 320)
        {
            DEVICE.fullscreen = true;
            DEVICE.ls = {
                w : 480, h : 320, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
        if (that.getWidth() == 960 && that.getHeight() == 520)
        {
            DEVICE.fullscreen = true;
            DEVICE.ls = {
                w : 960, h : 640, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
        if (that.getWidth() == 1136 && (that.getHeight() == 640 || that.getHeight() == 642))
        {
            DEVICE.fullscreen = true;
            DEVICE.ls = {
                w : 1136, h : 640, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
    }
    var fullscreenmode = function (e)
    {
        if (that.getWidth() == 480 && that.getHeight() == 320)
        {
            DEVICE.fullscreen = true;
            DEVICE.ls = {
                w : 480, h : 320, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
        else if (that.getWidth() == 480 && that.getHeight() == 208)
        {
            setTimeout(function ()
            {
                window.scrollTo(0, 1)
            }, 10);
            DEVICE.fullscreen = false;
            DEVICE.ls = {
                w : 480, h : 268, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
        if (that.getWidth() == 960 && that.getHeight() == 602)
        {
            setTimeout(function ()
            {
                window.scrollTo(0, 1)
            }, 10);
            DEVICE.fullscreen = true;
            DEVICE.ls = {
                w : 960, h : 640, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
        else if (that.getWidth() == 960 && that.getHeight() == 416)
        {
            setTimeout(function ()
            {
                window.scrollTo(0, 1)
            }, 10);
            DEVICE.fullscreen = false;
            DEVICE.ls = {
                w : 960, h : 538, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
        if (that.getWidth() == 1136 && (that.getHeight() == 602 || that.getHeight() == 640))
        {
            setTimeout(function ()
            {
                window.scrollTo(0, 1)
            }, 10);
            DEVICE.fullscreen = true;
            DEVICE.ls = {
                w : 1136, h : 640, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
        else if (that.getWidth() == 1136 && that.getHeight() == 416)
        {
            setTimeout(function ()
            {
                window.scrollTo(0, 1)
            }, 10);
            DEVICE.fullscreen = false;
            DEVICE.ls = {
                w : 1136, h : 538, scale : 0, set : true
            };
            setValues();
            Orientation.ChangeOrientation(DEVICE.orientation);
            that.setSjsW(DEVICE[DEVICE.orientation].w);
            that.setSjsH(DEVICE[DEVICE.orientation].h)
        }
    };
    window.addEventListener("resize", fullscreenmode, false)
};
Scale.prototype.OrientationChangeEvent = function ()
{
    var l = this.m_ResizeDevices.length;
    for (var i = 0; i < l; i++) {
        if (this.m_ResizeDevices[i] === true) {
            return "resize";
        }
        return "orientationchange";
    }
};
Scale.prototype.OldGame = function (gameid)
{
    var OldGames = [100001, 100004, 100005, 100031, 100016, 100017, 100018, 100047, 100211, 100056, 100093, 
    100094, 100099, 100105, 100106, 100107, 100108, 100235];
    var l = OldGames.length;
    for (var i = 0; i < l; i++) {
        if (gameid == OldGames[i]) {
            return true;
        }
        return false;
    }
};
Scale.prototype.OverriddenDevice = function ()
{
    var l = this.m_OverriddenDevices.length;
    for (var i = 0; i < l; i++)
    {
        if (UAGENT_IPAD && (this.m_OverriddenDevices[i].name == "ipadmini" || this.m_OverriddenDevices[i].name == "ipad"))
        {
            var that = this;
            if (window.navigator.standalone) {
                DEVICE = DEVICE_IPAD_MINI_WEBVIEW;
            }
            else
            {
                switch (that.getHeight())
                {
                    case 928:
                        DEVICE = DEVICE_IPAD;
                        break;
                    case 900:
                        DEVICE = DEVICE_IPAD_BOOKMARKS;
                        break;
                    case 927:
                        DEVICE = DEVICE_IPAD_MINI;
                        break;
                    case 904:
                        DEVICE = DEVICE_IPAD_MINI_BOOKMARKS;
                        break;
                    case 672:
                        DEVICE = DEVICE_IPAD;
                        break;
                    case 644:
                        DEVICE = DEVICE_IPAD_BOOKMARKS;
                        break;
                    case 671:
                        DEVICE = DEVICE_IPAD_MINI;
                        break;
                    case 648:
                        DEVICE = DEVICE_IPAD_MINI_BOOKMARKS;
                        break
                }
                this._onOrientationChange()
            }
            return true
        }
        if (UAGENT_IPHONE4 && this.m_OverriddenDevices[i].name == "iphone4" && !UAGENT_IOS7)
        {
            if (window.navigator.standalone) {
                DEVICE = DEVICE_IPHONE4_WEBVIEW;
            }
            else {
                DEVICE = this.m_OverriddenDevices[i];
            }
            return true
        }
        if (UAGENT_IPHONE4 && this.m_OverriddenDevices[i].name == "iphone4ios7")
        {
            if (window.navigator.standalone) {
                DEVICE = DEVICE_IPHONE4_WEBVIEW;
            }
            else {
                DEVICE = this.m_OverriddenDevices[i];
            }
            return true
        }
        if (UAGENT_IPHONE5 && this.m_OverriddenDevices[i].name == "iphone5ios7")
        {
            if (window.navigator.standalone) {
                DEVICE = DEVICE_IPHONE5_WEBVIEW;
            }
            else {
                DEVICE = this.m_OverriddenDevices[i];
            }
            return true
        }
        if (UAGENT_IPHONE5 && this.m_OverriddenDevices[i].name == "iphone5" && !UAGENT_IOS7)
        {
            if (window.navigator.standalone) {
                DEVICE = DEVICE_IPHONE5_WEBVIEW;
            }
            else {
                DEVICE = this.m_OverriddenDevices[i];
            }
            return true
        }
        if (UAGENT_IPAD && this.m_OverriddenDevices[i].name == "ipad") {
            DEVICE = this.m_OverriddenDevices[i];
            return true
        }
        if (UAGENT_IPHONE3 && this.m_OverriddenDevices[i].name == "iphone3gs")
        {
            if (window.navigator.standalone) {
                DEVICE = DEVICE_IPHONE3GS_WEBVIEW;
            }
            else {
                DEVICE = this.m_OverriddenDevices[i];
            }
            return true
        }
        if (UAGENT_SAMSUNG_G_TAB && this.m_OverriddenDevices[i].name == "gtab10") {
            DEVICE = this.m_OverriddenDevices[i];
            return true
        }
        if (this.m_OverriddenDevices[i].name == "custom") {
            DEVICE = this.m_OverriddenDevices[i];
            return true;
        }
    }
};
Scale.prototype.DesktopMode = function (gameres)
{
    var that = this;
    window.innerHeight < window.innerWidth ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
    if (DEVICE.orientation == "pt")
    {
        if (gameres == 320) 
        {
            DEVICE[DEVICE.orientation].w = 320;
            DEVICE[DEVICE.orientation].h = 417;
            that.setSjsW(320);
            that.setSjsH(417);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation) 
        }
        else 
        {
            DEVICE[DEVICE.orientation].w = 640;
            DEVICE[DEVICE.orientation].h = 834;
            that.setSjsW(640);
            that.setSjsH(834);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation) 
        }
    else if (gameres == 320) 
        {
            DEVICE[DEVICE.orientation].w = 480;
            DEVICE[DEVICE.orientation].h = 269;
            that.setSjsW(480);
            that.setSjsH(269);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation) 
        }
    else 
    {
            DEVICE[DEVICE.orientation].w = 960;
        DEVICE[DEVICE.orientation].h = 538;
        that.setSjsW(960);
        that.setSjsH(538);
        setValues();
        DEVICE.loaded = true;
        Orientation.ChangeOrientation(DEVICE.orientation) 
    }
    var onRezize = function (e) 
    {
        if (niceMode) 
        {
            DEVICE[DEVICE.orientation].w = window.innerWidth;
            DEVICE[DEVICE.orientation].h = window.innerHeight;
            that.setSjsW(window.innerWidth);
            that.setSjsH(window.innerHeight);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation);
            window.innerHeight < window.innerWidth ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
            return 
        }
        window.innerHeight < window.innerWidth ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
        if (DEVICE.orientation == "pt") if (gameres == 320) 
        {
            DEVICE[DEVICE.orientation].set = true;
            DEVICE[DEVICE.orientation].w = 320;
            DEVICE[DEVICE.orientation].h = 417;
            that.setSjsW(320);
            that.setSjsH(417);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation) 
        }
        else 
        {
            DEVICE[DEVICE.orientation].set = true;
            DEVICE[DEVICE.orientation].w = 640;
            DEVICE[DEVICE.orientation].h = 834;
            that.setSjsW(640);
            that.setSjsH(834);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation) 
        }
        else if (gameres == 320) 
        {
            DEVICE[DEVICE.orientation].set = true;
            DEVICE[DEVICE.orientation].w = 480;
            DEVICE[DEVICE.orientation].h = 269;
            that.setSjsW(480);
            that.setSjsH(269);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation) 
        }
        else 
        {
            DEVICE[DEVICE.orientation].w = 960;
            DEVICE[DEVICE.orientation].h = 538;
            that.setSjsW(960);
            that.setSjsH(538);
            setValues();
            DEVICE.loaded = true;
            Orientation.ChangeOrientation(DEVICE.orientation) 
        }
    };
    var supportsOrientationChange = "onorientationchange"in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    window.addEventListener(orientationEvent, onRezize, false);
}
};
Scale.prototype.getWidth = function ()
{
    if (UAGENT_ANDROID3PLUS) {
        return document.documentElement.clientWidth;
    }
    else {
        return window.innerWidth;
    }
};
Scale.prototype.getHeight = function ()
{
    if (UAGENT_ANDROID3PLUS) {
        return document.documentElement.clientHeight;
    }
    else {
        return window.innerHeight;
    }
};
Scale.prototype.MainLoop = function ()
{
    var time = getTimer();
    if (this.m_InvertCheckDelayTimer > 0 && this.m_InvertCheckDelayTimer <= time && this.m_InvertCheckDurationTimer > time)
    {
        this.CheckInvertedDevices();
        this.m_InvertCheckDelayTimer = time + this.INVERTCHECK_DELAY
    }
    else if (this.m_InvertCheckDurationTimer < time && this.m_InvertCheckDurationTimer != 0) {
        this.m_InvertCheckDelayTimer = 0;
        this.m_InvertCheckDurationTimer = 0
    }
    if (this.m_CheckCorrectSize) {
        this.CheckCorrectSize();
    }
    var that = this;
    setTimeout(function ()
    {
        that.MainLoop()
    },
    Scale.MainloopPollRate)
};
Scale.prototype.CheckCorrectSize = function ()
{
    var that = this;
    if (this.m_InnerHeights[this.m_TickerCounter - 100] == this.getHeight() && this.m_InnerWidths[this.m_TickerCounter - 100] == this.getWidth())
    {
        var width = this.getWidth();
        var height = this.getHeight();
        height < width ? DEVICE.orientation = "ls" : DEVICE.orientation = "pt";
        DEVICE[DEVICE.orientation].h = height;
        DEVICE[DEVICE.orientation].w = width;
        DEVICE[DEVICE.orientation].set = true;
        this.setSjsW(DEVICE[DEVICE.orientation].w);
        this.setSjsH(DEVICE[DEVICE.orientation].h);
        DEVICE.loaded = true;
        setValues();
        Orientation.ChangeOrientation(DEVICE.orientation);
        this.m_InnerHeights = [];
        this.m_InnerWidths = [];
        this.m_CheckCorrectSize = false;
        Scale.MainloopPollRate = 100;
        return
    }
    this.m_InnerHeights[this.m_TickerCounter] = this.getHeight();
    this.m_InnerWidths[this.m_TickerCounter] = this.getWidth();
    this.m_TickerCounter++
};
Scale.prototype.setSjsProperties = function ()
{
    var properties = ["transform", "WebkitTransform", "MozTransform", "OTransform"];
    var p = false;
    while (p = properties.shift()) {
        if (typeof document.body.style[p] !== "undefined") {
            this.tproperty = p;
        }
    }
};
Scale.prototype.setSjsY = function (value)
{
    var that = this;
    var value = value;
    var m_SjsDom = document.getElementById("sjs");
    if (m_SjsDom == null) {
        setTimeout(function ()
        {
            that.setSjsH(value)
        }, 100);
        return
    }
    if (m_SjsDom != undefined) {
        m_SjsDom.style.top = value + "px";
    }
};
Scale.prototype.setSjsH = function (value, scrollhack)
{
    var that = this;
    var value = value;
    var m_SjsDom = document.getElementById("sjs");
    if (m_SjsDom == null) {
        setTimeout(function ()
        {
            that.setSjsH(value)
        }, 100);
        return
    }
    if (scrollhack) {
        this.m_GBDom.style.height = value + 100 + "px";
    }
    else {
        this.m_GBDom.style.height = null;
    }
    if (UAGENT_CMOBILE && !UAGENT_SAMSUNG_BROWSER) {
        value = value + 100;
    }
    if (m_SjsDom != undefined) {
        m_SjsDom.style.height = value + "px";
    }
    sjs.setH(value)
};
Scale.prototype.setSjsW = function (value)
{
    var that = this;
    var value = value;
    var m_SjsDom = document.getElementById("sjs");
    if (m_SjsDom == null) {
        setTimeout(function ()
        {
            that.setSjsW(value)
        }, 100);
        return
    }
    if (m_SjsDom != undefined) {
        m_SjsDom.style.width = value + "px";
    }
    sjs.setW(value)
};
Scale.prototype.SetSjsScale = function (scale)
{
    var that = this;
    var scale = scale;
    var m_SjsDom = document.getElementById("sjs");
    if (m_SjsDom == null) {
        setTimeout(function ()
        {
            that.SetSjsScale(scale)
        }, 100);
        return
    }
    var scale = scale;
    var style = m_SjsDom.style;
    var trans = "";
    trans += " scale(" + scale + ", " + scale + ")";
    if (UAGENT_ANDROID_4) {
        setTimeout(function () 
        {
            style[that.tproperty] = trans;
        }, 1);
    }
    else if (UAGENT_IE) {
        style["-ms-transform"] = trans;
    }
    else {
        style[this.tproperty] = trans;
    }
    if (scale == 1) {
        style.left = 0 + "px";
        style.top = 0 + "px"
    }
    else
    {
        var w = style.width;
        var h = style.height;
        var re = /px$/;
        w = w.replace(re, "");
        h = h.replace(re, "");
        var newX =- (w - w * scale) / 2;
        var newY =- (h - h * scale) / 2;
        style.left = newX + "px";
        style.top = newY + "px";
    }
};
Scale.setDefaultScale = function ()
{
    var viewport = undefined;
    if (document.querySelector("meta[name=viewport]") != undefined) {
        viewport = document.querySelector("meta[name=viewport]");
    }
    else
    {
        viewport = document.createElement("meta");
        viewport.name = "viewport";
        document.getElementsByTagName("head")[0].appendChild(viewport)
    }
    if (UAGENT_IPAD)
    {
        viewport.setAttribute("content", "width=640, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
    }
    else if (UAGENT_IPHONE && UAGENT_IPHONE4 && typeof force320Regex !== "undefined" && force320Regex.test(gameID))
    {
        viewport.setAttribute("content", "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1");
    }
    else if (UAGENT_IPHONE) if (UAGENT_IOS8 && screen.width == 375 && screen.height == 667) viewport.setAttribute("content", 
    "width=device-width, initial-scale=0.6, minimum-scale=0.6, maximum-scale=0.6, user-scalable=no");
    else if (window.devicePixelRatio >= 2 && window.devicePixelRatio < 3) viewport.setAttribute("content", 
    "width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=no");
    else if (window.devicePixelRatio >= 3) viewport.setAttribute("content", "width=device-width, initial-scale=0.6, minimum-scale=0.6, maximum-scale=0.6, user-scalable=no");
    else viewport.setAttribute("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
    else if (UAGENT_ANDROID)
    {
        var height = screen.availHeight;
        var width = screen.availWidth;
        var size = Math.max(width, height);
        var dp = Math.min(2, window.devicePixelRatio);
        var scale = 640 / size * dp;
        if (scale > 1) {
            scale = 1  / scale;
        }
        viewport.setAttribute("content", "width=device-width, initial-scale=" + scale + ", minimum-scale=" + scale + ", maximum-scale=" + scale + "");
        if (!UAGENT_CMOBILE)
        {
            viewport.setAttribute("content", "width=device-width, target-densitydpi=high-dpi, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5");
        }
    }
    else if (UAGENT_BLACKBERRY)
    {
        viewport.setAttribute("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
    }
    else if (UAGENT_IE && !UAGENT_IE_11)
    {
        widthToUse = 640;
        viewport.setAttribute("content", "width=" + widthToUse + ", initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0")
    }
    else {
        if (UAGENT_IE_11) {
            return;
        }
        viewport.setAttribute("content", "width=device-width")
    }
};
Scale.prototype.createFullscreenElements = function ()
{
    var gameContainer = document.createElement("div");
    gameContainer.setAttribute("id", "game_container");
    var scrollFiller = document.createElement("div");
    scrollFiller.setAttribute("id", "scroll_filler");
    var parent;
    if (document.getElementById("game_base"))
    {
        var gameBase = document.getElementById("game_base");
        var elements = [];
        elements.push(document.getElementById("quickmenu_cover"));
        elements.push(document.getElementById("gamble_base"));
        elements.push(document.getElementById("spinbutton_container"));
        elements.push(document.getElementById("menu"));
        elements.push(document.getElementById("gamepanel"));
        elements.push(document.getElementById("modalwin_container"));
        parent = gameBase.parentElement;
        gameContainer.appendChild(gameBase);
        for (var i = 0; i < elements.length; i++)
        {
            if (elements[i]) {
                gameContainer.appendChild(elements[i]);
            }
            parent.appendChild(gameContainer);
            parent.appendChild(scrollFiller);
        }
    }
    else if (document.getElementById("gameContainer"))
    {
        var gameCont = document.getElementById("gameContainer");
        gameContainer.appendChild(gameCont);
        parent = gameCont.parentElement
    }
    parent.appendChild(gameContainer);
    parent.appendChild(scrollFiller);
    var startY;
    document.addEventListener("touchstart", function (e)
    {
        startY = e.changedTouches[0].clientY;
    });
    document.addEventListener("touchend", function (e)
    {
        var endY = e.changedTouches[0].clientY;
        var diff = endY - startY;
        if (diff <- 10) {
            window.scrollTo(0, 100);
        }
    });
    gameContainer.style.position = "fixed";
    scrollFiller.style.height = window.innerHeight * 2 + "px";
    parent.style.overflow = "hidden";
};
Scale.setDefaultScale();
function OldScale(GameID, GameRes)
{
    var m_GameId = GameID;
    var m_OldGames = [100001, 100004, 100005, 100031, 100016, 100017, 100018, 100047, 100211, 100056, 
    100093, 100094, 100099, 100105, 100106, 100107, 100108, 100235];
    var m_NewGame = true;
    var m_InitCheckHasBeenMade = false;
    var IE_LANDSCAPE_SCALE = 0.85;
    var IPAD_LANDSCAPE_SIZE = 576;
    var m_GameRes = GameRes;
    var m_GameWidth;
    var m_GameHeight;
    if (m_GameRes == 640) {
        m_GameWidth = 640;
        m_GameHeight = 834
    }
    else if (m_GameRes == 320) {
        m_GameWidth = 320;
        m_GameHeight = 417
    }
    var m_LastOrientation;
    var that = this;
    this.m_IsPortrait = true;
    var m_LandscapeIsDefault = false;
    var m_DeviceLongSide = 0;
    var m_DeviceShortSide = 0;
    var m_CurrentLongSide = 0;
    var m_CurrentShortSide = 0;
    var m_PortraitScale;
    var m_LandscapeScale;
    var m_LastUsedScale = 1;
    var m_UseLastScale = false;
    var m_AndroidWidths = [240, 320, 480, 510, 760, 800, 960, 1024, 1280];
    var m_AndroidWidthInterval = 10;
    var m_AndroidDpi = "medium-dpi";
    var m_GameContainer = document.getElementById("gameContainer");
    var m_GameBaseContainer = document.getElementById("game_base");
    var m_SjsDom = document.getElementById("sjs");
    var m_ScaleAdjLand = 0;
    var m_ScaleAdjPort = 0;
    var m_SpecialLeftMarginPort = undefined;
    var m_SpecialLeftMarginLand = undefined;
    var m_SpecialTopMarginPort = "0px";
    var m_SpecialTopMarginLand = "0px";
    var tproperty = null;
    this.m_IEorFlag = undefined;
    if (!UAGENT_IPHONE && !UAGENT_IPAD && !UAGENT_ANDROID_422)
    {
        if (screen.availHeight < screen.availWidth && (window.orientation == 0 || window.orientation == 180)) {
            m_LandscapeIsDefault = true;
        }
        if (screen.availHeight > screen.availWidth && (window.orientation == 90 || window.orientation ==- 90)) {
            m_LandscapeIsDefault = true;
        }
    }
    this.createFullscreenElements = function ()
    {
        var gameContainer = document.createElement("div");
        gameContainer.setAttribute("id", "game_container");
        var scrollFiller = document.createElement("div");
        scrollFiller.setAttribute("id", "scroll_filler");
        var parent;
        if (document.getElementById("gameContainer"))
        {
            var gameCont = document.getElementById("gameContainer");
            parent = gameCont.parentElement;
            gameContainer.appendChild(gameCont)
        }
        parent.appendChild(gameContainer);
        parent.appendChild(scrollFiller);
        var startY;
        document.addEventListener("touchstart", function (e)
        {
            if (gameContainer.style.position != "fixed") {
                return;
            }
            startY = e.changedTouches[0].clientY;
        });
        document.addEventListener("touchend", function (e)
        {
            if (gameContainer.style.position != "fixed") {
                return;
            }
            var endY = e.changedTouches[0].clientY;
            var diff = endY - startY;
            if (diff < 10) {
                window.scrollTo(0, 100);
            }
        });
        gameContainer.style.position = "fixed";
        scrollFiller.style.height = window.innerHeight * 2 + "px";
        document.body.style.overflow = "hidden";
    };
    this.init = function ()
    {
        setAdjustmentVars();
        checkNewGame();
        setDefaultScale();
        this.addOrientationListener();
        if (UAGENT_IE) {
            this.IeInitOrientation();
        }
        else {
            this.initOrientationCheck();
        }
    };
    this.IeInitOrientation = function ()
    {
        var that = this;
        if (window.innerHeight < window.innerWidth) {
            this.m_IEorFlag = false;
        }
        else {
            this.m_IEorFlag = true;
        }
        this.initOrientationCheck(false, !this.m_IEorFlag);
        this.IeOrientationLoop()
    };
    this.IeOrientation = function (o)
    {
        if (m_LastOrientation == o) {
            return;
        }
        if (o == "ls")
        {
            this.m_IsPortrait = false;
            if (m_GameHeight == 417) {
                scaleGame(480, 269);
            }
            else {
                scaleGame(960, 538);
            }
            m_LastOrientation = "ls"
        }
        else
        {
            this.m_IsPortrait = true;
            if (m_GameWidth == 320) {
                scaleGame(320, 417);
            }
            else {
                scaleGame(640, 834);
            }
            m_LastOrientation = "pt";
        }
    };
    this.IeOrientationLoop = function ()
    {
        if (this.m_IEorFlag != undefined)
        {
            if (window.innerHeight < window.innerWidth)
            {
                if (this.m_IEorFlag) {
                    this.m_IEorFlag = false;
                    this.IeOrientation("ls") 
                }
                else {
                    this.m_IEorFlag = true;
                    this.IeOrientation("ls") 
                }
            else if (window.innerHeight > window.innerWidth)
                {
                    if (!this.m_IEorFlag) {
                        this.m_IEorFlag = true;
                        this.IeOrientation("pt") 
                    }
                    else {
                        this.m_IEorFlag = false;
                        this.IeOrientation("pt") 
                    }
                    setTimeout(this.IeOrientationLoop, 75);;;
                }
            }
        }
    };
    var checkNewGame = function ()
    {
        for (var i = 0; i < m_OldGames.length; i++) {
            if (m_OldGames[i] == m_GameId) {
                m_NewGame = false;
            }
            if (m_NewGame) {
                IPAD_LANDSCAPE_SIZE = 660;
            }
        }
    };
    this.setDefaultScale = function ()
    {
        var viewport = undefined;
        if (document.querySelector("meta[name=viewport]") != undefined) {
            viewport = document.querySelector("meta[name=viewport]");
        }
        else {
            viewport = document.createElement("meta");
            viewport.name = "viewport"
        }
        if (UAGENT_IPAD)
        {
            if (m_NewGame)
            {
                viewport.setAttribute("content", "width=640, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
            }
            else
            {
                viewport.setAttribute("content", "width=640, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no");
            }
        else if (UAGENT_IPHONE)
            {
                if (window.devicePixelRatio >= 2 && window.devicePixelRatio < 3)
                {
                    viewport.setAttribute("content", "width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=no");
                }
                else if (window.devicePixelRatio >= 3)
                {
                    viewport.setAttribute("content", "width=device-width, initial-scale=0.6, minimum-scale=0.6, maximum-scale=0.6, user-scalable=no");
                }
                else
                {
                    viewport.setAttribute("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
                }
            else if (UAGENT_ANDROID)
                {
                    if (window.devicePixelRatio >= 2)
                    {
                        viewport.setAttribute("content", "width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5");
                    }
                    else
                    {
                        viewport.setAttribute("content", "width=320, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
                    }
                else if (UAGENT_BLACKBERRY)
                    {
                        viewport.setAttribute("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
                    }
                else {
                        viewport.setAttribute("content", "width=device-width");
                };;
            }
        }
    }
};
var checkLastScaleAndSize = function (w)
{
    var newWidth = compareAndroidWidth(w * m_LastUsedScale);
    if (that.m_IsPortrait) {
        if (newWidth == m_DeviceShortSide) {
            m_UseLastScale = true;
        }
    }
    else if (newWidth == m_DeviceLongSide) {
        m_UseLastScale = true;
    }
    if (m_UseLastScale) {
        return newWidth;
    }
    else {
        return w;
    }
};
var compareAndroidWidth = function (w)
{
    var widthFound = false;
    var width = w;
    var pixelRatioWidth = w * window.devicePixelRatio;
    for (var i = 0; i < m_AndroidWidths.length; i++)
    {
        if (width > m_AndroidWidths[i] - m_AndroidWidthInterval && width < m_AndroidWidths[i] + m_AndroidWidthInterval) {
            width = m_AndroidWidths[i];
            widthFound = true;
            break 
        }
        if (!widthFound)
        {
            for (var j = 0; j < m_AndroidWidths.length; j++)
            {
                if (pixelRatioWidth > m_AndroidWidths[i] - m_AndroidWidthInterval && pixelRatioWidth < m_AndroidWidths[i] + m_AndroidWidthInterval) {
                    width = m_AndroidWidths[i];
                    widthFound = true;
                    break 
                }
                return width;;
            }
        }
    }
};
var hideAddressBar = function ()
{
    if (navigator.userAgent.toLowerCase().indexOf("blackberry") > 0) {
        setTimeout("window.scrollTo(0,1)", 800);
    }
    else {
        setTimeout("window.scrollTo(0,1)", 800);
    }
};
this.IEorientationChange = function (o)
{
    if (m_InitCheckHasBeenMade) {
        onOrientationChange(o);
    }
};
var onOrientationChange = function (o)
{
    if (UAGENT_IE) {
        window.orientation = o;
    }
    if (window.orientation == m_LastOrientation && window.orientation != undefined) {
        return;
    }
    if (!m_LandscapeIsDefault)
    {
        switch (window.orientation) 
        {
            case 0:
                that.m_IsPortrait = true;
                if (m_GameWidth == 320) {
                    scaleGame(320, 417);
                }
                else {
                    scaleGame(640, 834);
                }
                m_LastOrientation = 0;
                break;
            case 180:
                that.m_IsPortrait = true;
                if (m_GameWidth == 320) {
                    scaleGame(320, 417);
                }
                else {
                    scaleGame(640, 834);
                }
                m_LastOrientation = 180;
                break;
            case 90:
                that.m_IsPortrait = false;
                if (m_GameHeight == 417) {
                    scaleGame(480, 269);
                }
                else {
                    scaleGame(960, 538);
                }
                m_LastOrientation = 90;
                break;
            case - 90:
                that.m_IsPortrait = false;
                if (m_GameHeight == 417) {
                    scaleGame(480, 269);
                }
                else {
                    scaleGame(960, 538);
                }
                m_LastOrientation =- 90;
                break 
        }
    }
    else
    {
        switch (window.orientation) 
        {
            case 90:
                that.m_IsPortrait = true;
                if (m_GameWidth == 320) {
                    scaleGame(320, 417);
                }
                else {
                    scaleGame(640, 834);
                }
                m_LastOrientation = 90;
                break;
            case - 90:
                that.m_IsPortrait = true;
                if (m_GameWidth == 320) {
                    scaleGame(320, 417);
                }
                else {
                    scaleGame(640, 834);
                }
                m_LastOrientation =- 90;
                break;
            case 0:
                that.m_IsPortrait = false;
                if (m_GameHeight == 417) {
                    scaleGame(480, 269);
                }
                else {
                    scaleGame(960, 538);
                }
                m_LastOrientation = 0;
                break;
            case 180:
                that.m_IsPortrait = false;
                if (m_GameHeight == 417) {
                    scaleGame(480, 269);
                }
                else {
                    scaleGame(960, 538);
                }
                m_LastOrientation = 180;
                break 
        }
    }
};
var scaleGame = function (newWidth, newHeight)
{
    if (that.m_IsPortrait) {
        m_CurrentLongSide = newHeight;
        m_CurrentShortSide = newWidth
    }
    else {
        m_CurrentLongSide = newWidth;
        m_CurrentShortSide = newHeight
    }
    this.setSjsW(newWidth);
    this.setSjsH(newHeight);
    if (UAGENT_IPAD && !that.m_IsPortrait) {
        this.setSjsH(IPAD_LANDSCAPE_SIZE);
        m_CurrentShortSide = IPAD_LANDSCAPE_SIZE
    }
    fitGameToDevice();
};
var fitGameToDevice = function ()
{
    if (UAGENT_IPAD || UAGENT_IPHONE)
    {
        var time = 10;
        setTimeout(function ()
        {
            setGameTableSize()
        }, 1);
        if (m_NewGame && UAGENT_IPAD) {
            setTimeout(function ()
            {
                scaleGameForIpad()
            }, 200);
            time = 200
        }
        else if (!UAGENT_IPAD) {
            setTimeout(function () 
            {
                getScreenSize() 
            }, 600);
        }
        setTimeout(function ()
        {
            hideAddressBar()
        }, time)
    }
    else {
        setTimeout(function () 
        {
            getScreenSize() 
        }, 600);
    }
};
var getScreenSize = function ()
{
    var width;
    var height;
    var string = "screen...";
    if (window.innerWidth) {
        width = window.innerWidth;
        height = window.innerHeight;
        string = "innerW/H"
    }
    else if (document.documentElement)
    {
        if (document.documentElement.clientWidth && document.documentElement.clientHeight)
        {
            width = document.documentElement.clientWidth;
            height = document.documentElement.clientHeight;
            string = "doc.docElem.clientW/H";
        }
    }
    else {
        width = screen.width;
        height = screen.height
    }
    if (UAGENT_ANDROID)
    {
        width = checkLastScaleAndSize(width);
        m_UseLastScale = false;
        width = compareAndroidWidth(width);
        if (width > 540 && height < 320) {
            width = 540;
        }
        if (width == 800 && height != 1280 && height > 1024) {
            height = 1280;
        }
        if (width == 1280 && height != 800 && height < width) {
            height = 800;
        }
        if (width == 768 && height != 1024 && height > 960) {
            height = 1024;
        }
        if (width == 1024 && height != 768 && height < width) {
            height = 768;
        }
        if (width == 540 && height != 960 && height > 540) {
            height = 960;
        }
        if (width == 960 && height != 540 && height < width) {
            height = 540;
        }
        if (width == 480 && height != 800 && height > 480 && height < 854) {
            height = 800;
        }
        if (width == 800 && height != 480 && height < width) {
            height = 480;
        }
        if (width == 320 && height != 480 && height > 420) {
            height = 480;
        }
        if (width == 480 && height != 320 && height < width) {
            height = 320;
        }
        if (width == 240 && height != 320 && height > 300) {
            height = 320;
        }
        if (width == 320 && height != 240 && height < width) {
            height = 240;
        }
    }
    if (height < width) {
        m_DeviceLongSide = width;
        m_DeviceShortSide = height
    }
    else {
        m_DeviceShortSide = width;
        m_DeviceLongSide = height
    }
    setTimeout(function ()
    {
        scaleGameForDevice()
    }, 1)
};
var scaleGameForIpad = function ()
{
    if (that.m_IsPortrait) {
        this.SetSjsScale(1.175);
    }
    else {
        this.SetSjsScale(1.065);
    }
};
var scaleGameForDevice = function ()
{
    var viewport = document.querySelector("meta[name=viewport]");
    var calculatedViewport = calculateViewport();
    var scaleToSet = calculatedViewport.scale;
    var widthToSet = calculatedViewport.width;
    if (UAGENT_SAMSUNG_G_TAB)
    {
        scaleToSet = 1;
        m_LastUsedScale = scaleToSet;
        viewport.setAttribute("content", "width=device-width, initial-scale=" + scaleToSet + ", minimum-scale=" + scaleToSet + ", maximum-scale=" + scaleToSet)
    }
    else if (UAGENT_IE)
    {
        if (that.m_IsPortrait) {
            this.SetSjsScale(1);
        }
        else {
            this.SetSjsScale(IE_LANDSCAPE_SCALE);
        }
    else if (UAGENT_ANDROID) 
        {
            if (scaleToSet < 1 && window.devicePixelRatio >= 1 && window.devicePixelRatio < 2) {
                scaleToSet = 1;
            }
            if (scaleToSet < 1.11 && !that.m_IsPortrait && window.devicePixelRatio > 1) {
                scaleToSet = 1.11;
            }
            if (that.m_IsPortrait) {
                scaleToSet += m_ScaleAdjPort;
            }
            else {
                scaleToSet += m_ScaleAdjLand;
            }
            if (window.devicePixelRatio >= 2 && m_GameWidth == 640) 
            {
                scaleToSet /= window.devicePixelRatio;
                if (!that.m_IsPortrait && UAGENT_SGS3 || !that.m_IsPortrait && UAGENT_ANDROID_422) {
                    widthToSet = 1025;
                }
                if (UAGENT_CMOBILE && UAGENT_ANDROID_4)
                {
                    if (that.m_IsPortrait) {
                        scaleToSet = 0.56;
                    }
                    else {
                        scaleToSet = 640  / (widthToSet + 120);
                    }
                    m_LastUsedScale = scaleToSet;
                    if (UAGENT_CMOBILE)
                    {
                        viewport.setAttribute("content", "width=" + widthToSet + ", initial-scale=" + scaleToSet + ", minimum-scale=" + scaleToSet + ", maximum-scale=" + scaleToSet);
                    }
                    else {
                        viewport.setAttribute("content", "width=" + widthToSet) ;
                    }
                }
            }
            else 
            {
                m_LastUsedScale = scaleToSet;
                viewport.setAttribute("content", "width=" + widthToSet + ", initial-scale=" + scaleToSet + ", minimum-scale=" + scaleToSet + ", maximum-scale=" + scaleToSet) 
            }
        }
    else if (UAGENT_BLACKBERRY)
        {
            if (UAGENT_BLACKBERRY_9930) {
                this.SetSjsScale(0.87);
            }
            else if (that.m_IsPortrait) {
                this.SetSjsScale(1);
            }
            else {
                var scale = 0.9;
                if (m_PortraitScale != undefined) {
                    scale = 0.94;
                }
                this.SetSjsScale(scale) 
            }
        else if (UAGENT_IPHONE)
            {
                if (window.devicePixelRatio >= 3)
                {
                    if (that.m_IsPortrait)
                    {
                        viewport.setAttribute("content", "width=device-width, initial-scale=0.645, minimum-scale=0.645, maximum-scale=0.645, user-scalable=no");
                    }
                    else
                    {
                        viewport.setAttribute("content", "width=device-width, initial-scale=0.75, minimum-scale=0.75, maximum-scale=0.75, user-scalable=no");
                    }
                else 
                {
                        if (window.devicePixelRatio >= 2 && window.devicePixelRatio < 3)
                    {
                        if (that.m_IsPortrait)
                        {
                            if (window.innerWidth == 750 || window.innerWidth == 551 || window.innerWidth == 749 || window.innerWidth == 552 && window.navigator.standalone)
                            {
                                viewport.setAttribute("content", "width=device-width, initial-scale=0.58, minimum-scale=0.58, maximum-scale=0.58, user-scalable=no");
                            }
                            else if (window.innerWidth == 640 || window.innerWidth == 552 || window.innerWidth == 553)
                            {
                                viewport.setAttribute("content", "width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=no");
                            }
                            else 
                            {
                                if (window.innerWidth == 553 || window.innerWidth == 640 || window.innerWidth == 822)
                                {
                                    viewport.setAttribute("content", "width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=no") ;
                                }
                            }
                        else if (window.innerWidth == 1334 || window.innerWidth == 1332 || window.innerWidth == 1140 || window.innerWidth == 1150)
                            {
                                viewport.setAttribute("content", "width=device-width, initial-scale=0.68, minimum-scale=0.68, maximum-scale=0.68, user-scalable=no");
                            }
                        else if (window.innerWidth == 1136 || window.innerWidth == 971)
                            {
                                viewport.setAttribute("content", "width=device-width, initial-scale=0.58, minimum-scale=0.58, maximum-scale=0.58, user-scalable=no");
                            }
                        else if (window.innerWidth == 960 || window.innerWidth == 821 || window.innerWidth == 822)
                            {
                                viewport.setAttribute("content", "width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=no") ;
                            };
                        }
                    }
                }
                else {
                    viewport.setAttribute("content", "width=" + widthToSet);
                }
                setTimeout(function () 
                {
                    setGameTableSize() 
                }, 1);;;;
            }
        }
    }
}
};
var setGameTableSize = function ()
{
    if (m_GameBaseContainer != undefined)
    {
        if (that.m_IsPortrait && m_SpecialLeftMarginPort != undefined)
        {
            m_GameBaseContainer.style.marginLeft = m_SpecialLeftMarginPort;
            m_GameBaseContainer.style.marginTop = m_SpecialTopMarginPort
        }
        else if (!that.m_IsPortrait && m_SpecialLeftMarginLand != undefined)
        {
            m_GameBaseContainer.style.marginLeft = m_SpecialLeftMarginLand;
            m_GameBaseContainer.style.marginTop = m_SpecialTopMarginLand
        }
        if (!UAGENT_IPAD && !UAGENT_IE)
        {
            if (that.m_IsPortrait) 
            {
                m_GameBaseContainer.style.width = String(m_CurrentShortSide) + "px";
                document.body.style.height = String(m_CurrentLongSide) + "px" 
            }
            else 
            {
                m_GameBaseContainer.style.width = String(m_CurrentLongSide) + "px";
                document.body.style.height = String(m_CurrentShortSide) + "px" 
            }
            m_GameBaseContainer.style.display = "none";
            var tmp = m_GameBaseContainer.offsetHeight;
            m_GameBaseContainer.style.display = "table";
        }
    }
    setTimeout(function ()
    {
        hideAddressBar()
    }, 1)
};
var calculateViewport = function ()
{
    var obj = new Object;
    var scaleToSet = 1;
    var widthToSet = "320";
    if (that.m_IsPortrait)
    {
        scaleToSet = m_DeviceShortSide / m_CurrentShortSide;
        if (m_PortraitScale == undefined) {
            m_PortraitScale = scaleToSet;
        }
        scaleToSet = m_PortraitScale;
        widthToSet = m_CurrentShortSide;
        if (window.devicePixelRatio >= 1 && m_LandscapeScale < 1.5)
        {
            if (m_DeviceShortSide == 480 && m_DeviceLongSide >= 540) {
                scaleToSet = 1;
            }
            if (window.devicePixelRatio == 0.75) {
                if (m_DeviceShortSide == 480 && m_DeviceLongSide > 540) {
                    scaleToSet = 1;
                };
            }
        }
    }
    else
    {
        if (m_LastUsedScale > 1.3) {
            scaleToSet = Math.floor(m_DeviceLongSide * m_LastUsedScale)  / m_CurrentLongSide;
        }
        else {
            scaleToSet = m_DeviceLongSide  / m_CurrentLongSide;
        }
        if (m_LandscapeScale == undefined) {
            m_LandscapeScale = scaleToSet;
        }
        scaleToSet = m_LandscapeScale;
        widthToSet = m_CurrentLongSide;
        if (window.devicePixelRatio > 1) {
            if (m_DeviceShortSide == 480 && m_DeviceLongSide >= 540) {
                scaleToSet = 1.11;
            }
        }
    }
    m_LastUsedScale = scaleToSet;
    obj.scale = scaleToSet;
    obj.width = widthToSet;
    return obj;
};
var setAdjustmentVars = function ()
{
    switch (DEVICE_USED_STR2)
    {
        case "UAGENT_SAMSUNG_G_TAB":
            m_SpecialLeftMarginLand = "158px";
            m_SpecialLeftMarginPort = "80px";
            break;
        case "UAGENT_IPAD":
            m_SpecialLeftMarginPort = "7px";
            break;
        case "UAGENT_IE":
            break;
        case "UAGENT_BLACKBERRY":
            m_SpecialLeftMarginLand = "0px";
            m_SpecialLeftMarginPort = "0px";
            break
    }
};
this.initOrientationCheck = function (desktopBrowser, landscape)
{
    m_InitCheckHasBeenMade = true;
    if (desktopBrowser) if (landscape)
    {
        that.m_IsPortrait = false;
        if (m_GameHeight == 417) {
            scaleGame(480, 269);
        }
        else {
            scaleGame(960, 538);
        }
    }
    else
    {
        that.m_IsPortrait = true;
        if (m_GameWidth == 320) {
            scaleGame(320, 417);
        }
        else {
            scaleGame(640, 834);
        }
    }
    else
    {
        if (UAGENT_IE)
        {
            if (landscape)
            {
                that.m_IsPortrait = false;
                if (m_GameHeight == 417) {
                    scaleGame(480, 269);
                }
                else {
                    scaleGame(960, 538);
                }
            }
            else
            {
                that.m_IsPortrait = true;
                if (m_GameWidth == 320) {
                    scaleGame(320, 417);
                }
                else {
                    scaleGame(640, 834);
                }
            }
            return
        }
        onOrientationChange()
    }
};
this.addOrientationListener = function ()
{
    var supportsOrientationChange = "onorientationchange"in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    window.addEventListener(orientationEvent, onOrientationChange, false)
};
var orientationHasBeenSet = false;
var m_BrowserInLandscape;
if (window.innerWidth >= 960) {
    m_BrowserInLandscape = true;
}
else {
    m_BrowserInLandscape = false;
}
var onResize = function (event)
{
    if (window.innerWidth >= 960 && !m_BrowserInLandscape || window.innerWidth >= 960 && !orientationHasBeenSet)
    {
        m_BrowserInLandscape = true;
        callInitOrientationCheck(true);
        orientationHasBeenSet = true
    }
    else if (window.innerWidth < 960 && m_BrowserInLandscape || window.innerWidth < 960 && !orientationHasBeenSet)
    {
        m_BrowserInLandscape = false;
        callInitOrientationCheck(false);
        orientationHasBeenSet = true;
    }
};
if (UAGENT_FIREFOX || UAGENT_IE) {
    window.addEventListener("resize", onResize, false);
}
var callInitOrientationCheck = function (b)
{
    this.initOrientationCheck(true, b)
};
var setSjsProperties = function ()
{
    var properties = ["transform", "WebkitTransform", "MozTransform", "OTransform"];
    var p = false;
    while (p = properties.shift()) {
        if (typeof document.body.style[p] !== "undefined") {
            tproperty = p;
        }
    }
};
setSjsProperties();
this.setSjsH = function (value)
{
    var that = this;
    var value = value;
    m_SjsDom = document.getElementById("sjs");
    if (m_SjsDom == null) {
        setTimeout(function ()
        {
            that.setSjsH(value)
        }, 100);
        return
    }
    if (m_SjsDom != undefined) {
        m_SjsDom.style.height = value + "px";
    }
};
this.setSjsW = function (value)
{
    var that = this;
    var value = value;
    m_SjsDom = document.getElementById("sjs");
    if (m_SjsDom == null) {
        setTimeout(function ()
        {
            that.setSjsW(value)
        }, 100);
        return
    }
    if (m_SjsDom != undefined) {
        m_SjsDom.style.width = value + "px";
    }
};
this.SetSjsScale = function (scale)
{
    var that = this;
    var scale = scale;
    m_SjsDom = document.getElementById("sjs");
    if (m_SjsDom == null) {
        setTimeout(function () 
        {
            that.SetSjsScale(scale) 
        }, 100);
    }
    var scale = scale;
    var style = m_SjsDom.style;
    var trans = "";
    trans += " scale(" + scale + ", " + scale + ")";
    if (UAGENT_ANDROID_4) {
        setTimeout(function () 
        {
            style[tproperty] = trans;
        }, 1);
    }
    else if (UAGENT_IE) {
        style["-ms-transform"] = trans;
    }
    else {
        style[tproperty] = trans;
    }
    if (scale == 1) {
        style.left = 0 + "px";
        style.top = 0 + "px"
    }
    else
    {
        var w = style.width;
        var h = style.height;
        var re = /px$/;
        w = w.replace(re, "");
        h = h.replace(re, "");
        var newX =- (w - w * scale) / 2;
        var newY =- (h - h * scale) / 2;
        style.left = newX + "px";
        style.top = newY + "px";
    }
};
this.init();
if (UAGENT_IOS && !UAGENT_IPHONE4) {
    this.createFullscreenElements();
}
}
function launchFullscreen(element)
{
    if (allowFullScreen)
    {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
};