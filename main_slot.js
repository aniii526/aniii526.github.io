var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MainSlot = (function () {
    function MainSlot() {
        this.testServer = false;
        this.isMobile = true;
        this.pixelRatio = 1;
        this.isMobileBrowser = function () {
            if (window["orientation"] != undefined) {
                return true;
            }
            var check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|ad|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    check = true;
            })(navigator.userAgent || navigator.vendor || window["opera"]);
            return check;
        };
    }
    MainSlot.prototype.startSlot = function (gameId, partnerid, currency, userid, demo, token, BackUrl) {
        var _this = this;
        this.model = new ModelSlot();
        this.model.gameId = gameId;
        this.model.partnerid = partnerid;
        this.model.currency = currency;
        this.model.userid = userid;
        this.model.demo = demo;
        this.model.Token = token;
        this.model.BackUrl = BackUrl;
        if (demo == 1) {
            this.model.path_server = this.model.path_server_demo;
        }
        this.isMobile = this.isMobileBrowser();
        if (this.isMobile) {
            Constants.ASSETS_WIDTH = 1300;
            Constants.ASSETS_HEIGHT = 820;
        }
        soundManager = new SoundManager();
        var size = (this.isMobile) ? [Constants.ASSETS_WIDTH, Constants.ASSETS_HEIGHT] : [Constants.ASSETS_WIDTH, Constants.ASSETS_HEIGHT];
        this.ratio = size[0] / size[1];
        this.renderer = PIXI.autoDetectRenderer(size[0], size[1], null);
        this.renderer.backgroundColor = 0x000000;
        document.body.children["viewporter"].appendChild(this.renderer.view);
        if (this.renderer.maskManager)
            this.renderer.maskManager.enableScissor = false;
        this.mainStage = new PIXI.Container();
        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = "fixed";
        this.stats.domElement.style.top = "0px";
        if (!this.isMobile) {
            window.addEventListener('resize', function () { _this.resize(); }, false);
            this.resize();
        }
        else {
            if (viewporter.ACTIVE) {
                window.addEventListener('viewportready', function () { _this.onOrientationChanged(); }, false);
                window.addEventListener('viewportchange', function () { _this.onOrientationChanged(); }, false);
                document.body.appendChild(this.stats.domElement);
            }
            else {
                window.addEventListener('orientationchange', function () { _this.onOrientationChanged(); }, false);
            }
            this.onOrientationChanged();
        }
        this.animate();
        var qc = new InitCommand();
        qc.addEventListener(EVENT_COMPLETE, function () { _this.completeInitCommad(); });
        qc.execute();
    };
    MainSlot.prototype.callback = function () {
        var sp = new PIXI.Sprite(PIXI.loader.resources["fon_main_scene"].texture);
        var fon = new PIXI.Sprite(PIXI.loader.resources["fon_main_scene2"].texture);
        fon.anchor.x = 0.7;
        sp.anchor.x = 0.2;
        sp.addChild(fon);
        this.mainStage.addChild(sp);
    };
    MainSlot.prototype.onOrientationChanged = function () {
        this.resize();
    };
    MainSlot.prototype.hideAddressBar = function () {
        setTimeout(function () {
            document.body.style.height = window.outerHeight + 'px';
            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 1100);
        }, 1000);
        return false;
    };
    MainSlot.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.animate(); });
        this.renderer.render(this.mainStage);
        this.stats.update();
    };
    MainSlot.prototype.getTexturesForName = function (atlasName, nameTextures, countTextures, nameResolution) {
        if (nameResolution === void 0) { nameResolution = '.png'; }
        var texrures = [];
        var indexName = '';
        for (var i = 1; i <= countTextures; i++) {
            indexName = i.toString();
            texrures.push(PIXI.loader.resources[atlasName].textures[nameTextures + indexName + nameResolution]);
        }
        return texrures;
    };
    MainSlot.prototype.resize = function () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var scale = Math.min(w / Constants.ASSETS_WIDTH, h / Constants.ASSETS_HEIGHT);
        this.renderer.view.style.width = (w / this.pixelRatio) + "px";
        this.renderer.view.style.height = (h / this.pixelRatio) + "px";
        this.renderer.resize(w, h);
        if (this.panel) {
            this.panel.resize(w, h);
        }
        if (!!/iPad|iPhone|iPod/i.exec(navigator.userAgent)) {
            document.body.style.height = h + 60 + 'px';
            setTimeout(function () {
                document.body.style.width = '100%';
            }, 100);
        }
    };
    MainSlot.prototype.completeInitCommad = function () {
        this.panel.panel.getContainer().addChild(this.slot);
        this.model.init();
    };
    MainSlot.prototype.setSlot = function (slot) {
        this.slot = slot;
    };
    MainSlot.prototype.getHashSize = function () {
        return "" + window.innerWidth + window.innerHeight;
    };
    MainSlot.prototype.tickHandler = function () {
    };
    MainSlot.prototype.bindSetter = function (host, property, callback) {
        if (!host[property + "_bindings"]) {
            host[property + "_bindings"] = [];
            host["_" + property] = host[property];
            Object.defineProperty(host, property, {
                get: function () {
                    return host["_" + property];
                },
                set: function (newValue) {
                    host["_" + property] = newValue;
                    host[property + "_bindings"].forEach(function (callback) {
                        callback(newValue);
                    });
                }
            });
        }
        host[property + "_bindings"].push(callback);
        callback(host[property]);
    };
    MainSlot.prototype.unbindSetter = function (host, property, callback) {
        var bindings = host[property + "_bindings"];
        if (bindings) {
            var index = bindings.indexOf(callback);
            if (index > -1) {
                bindings.splice(index, 1);
            }
        }
    };
    return MainSlot;
}());
var SoundManager = (function () {
    function SoundManager() {
        this.volume = 0.5;
        this._isMute = false;
        this.soundsList = new Array();
    }
    SoundManager.prototype.loadSounds = function (sounds) {
        createjs.Sound.addEventListener("fileload", this.handleFileLoad);
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerSounds(sounds);
    };
    SoundManager.prototype.handleFileLoad = function (event) {
    };
    SoundManager.prototype.playSound = function (name_sound, isRemove, loop, volume) {
        var _this = this;
        if (isRemove === void 0) { isRemove = true; }
        if (loop === void 0) { loop = 1; }
        if (volume === void 0) { volume = -1; }
        if (this._isMute)
            volume = 0;
        if (volume < 0)
            volume = this.volume;
        if (isRemove) {
            this.stopSound(name_sound);
        }
        var s = new SoundEnity(name_sound, loop, volume);
        s.addEventListener(SoundEnity.COMPLETE_SOUND, function (e) { _this.onCompleteSound(e); });
        this.soundsList.push(s);
        return s;
    };
    SoundManager.prototype.onCompleteSound = function (e) {
        var s = e.currentTarget;
        var ind = this.soundsList.indexOf(s);
        if (ind != -1) {
            this.soundsList.splice(ind, 1);
        }
    };
    SoundManager.prototype.stopSound = function (name_sound) {
        var ar = new Array();
        for (var i = 0; i < this.soundsList.length; i++) {
            if (this.soundsList[i].name_sound == name_sound)
                ar.push(this.soundsList[i]);
        }
        for (i = 0; i < ar.length; i++) {
            ar[i].completeSound();
        }
    };
    SoundManager.prototype.stopAllSound = function () {
        while (this.soundsList.length) {
            this.soundsList[0].completeSound();
        }
    };
    Object.defineProperty(SoundManager.prototype, "isMute", {
        get: function () {
            return this._isMute;
        },
        set: function (value) {
            this._isMute = value;
            if (this._isMute)
                this.stopAllSound();
        },
        enumerable: true,
        configurable: true
    });
    SoundManager.SOUND_BONUS = "bonus";
    SoundManager.SOUND_CARD_OPEN = "card_dealer_open";
    SoundManager.SOUND_CARDWIN = "cardwin";
    SoundManager.SOUND_KEY_PRESS = "key_press";
    SoundManager.SOUND_MONEY_MOVE = "money_move";
    SoundManager.SOUND_ROUTESTART = "route1time";
    SoundManager.SOUND_ROUTESTOP = "routestop";
    SoundManager.SOUND_ADDLINE = "addline";
    return SoundManager;
}());
var SoundEnity = (function (_super) {
    __extends(SoundEnity, _super);
    function SoundEnity(name_sound, loop, volume) {
        if (loop === void 0) { loop = 1; }
        if (volume === void 0) { volume = 1; }
        _super.call(this);
        this.name_sound = name_sound;
        this.volume = volume;
        this.loop = loop;
        this.startSound();
    }
    SoundEnity.prototype.startSound = function () {
        var _this = this;
        this.isPlayed = true;
        this.sound = createjs.Sound.play(this.name_sound, "none", 0, 0, this.loop - 1, this.volume);
        this.sound.addEventListener(EVENT_COMPLETE, function () { _this.onCompleteSound(); });
    };
    SoundEnity.prototype.onCompleteSound = function () {
        var _this = this;
        this.isPlayed = false;
        this.sound.removeEventListener(EVENT_COMPLETE, function () { _this.onCompleteSound(); });
        this.sound = null;
        this.dispatchEvent(SoundEnity.COMPLETE_SOUND);
    };
    SoundEnity.prototype.completeSound = function () {
        if (this.sound != null) {
            this.sound.stop();
            this.onCompleteSound();
        }
    };
    SoundEnity.COMPLETE_SOUND = "complete_sound";
    return SoundEnity;
}(createjs.EventDispatcher));
EVENT_COMPLETE = "complete";
EVENT_ONLOAD = "onload";
EVENT_CLICK = "click";
EVENT_MOUSEDOWN = "mousedown ";
EVENT_PRESSUP = "pressup";
EVENT_ROLLOVER = "rollover";
EVENT_ROLLOUT = "rollout ";
mainSlot = new MainSlot();
loadJS = function (path, callback) {
    var js_load = document.createElement("script");
    js_load.type = "text/javascript";
    js_load.src = path;
    js_load.onload = function (script) {
        if (callback)
            callback.call(this);
    };
    document.getElementsByTagName('head')[0].appendChild(js_load);
};
loadJSManifest = function (path, callback) {
    loadJS(path, function () {
        loadManifest(function () {
            callback();
        });
    });
};
loadManifest = function (callback) {
    var _this = this;
    var loader = new createjs["LoadQueue"]();
    loader.addEventListener("fileload", function (evt) {
        if (evt.item.type == "image")
            images[evt.item.id] = evt.result;
    });
    loader.addEventListener("complete", function () {
        var ssMetadata = lib.ssMetadata;
        if (ssMetadata != null) {
            for (var i = 0; i < ssMetadata.length; i++) {
                var t = images[ssMetadata[i].name];
                var g = ssMetadata[i].frames;
                var sp = new createjs.SpriteSheet({ "images": [t], "frames": g });
                ss[ssMetadata[i].name] = sp;
            }
        }
        callback.call(_this);
    });
    loader.loadManifest(lib.properties.manifest);
};
//# sourceMappingURL=main_slot.js.map