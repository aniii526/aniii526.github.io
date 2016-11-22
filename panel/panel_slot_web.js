var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PanelSlotWeb = (function (_super) {
    __extends(PanelSlotWeb, _super);
    function PanelSlotWeb() {
        _super.call(this);
        this.indexlines = [1, 3, 5, 7, 9];
        this.dictBtn = new Object();
        this.dictNewBtn = new Object();
        this.styleLabelIndex = {
            fontSize: '28px',
            fontFamily: 'heliosblackcregular',
            fill: '#FF8E00',
            letterSpacing: 1
        };
        this.dictBtnType = function () {
            var map = {
                "fullscr_btn": PanelEvent.FULL_SCREEN,
                "info_btn": PanelEvent.HELP,
                "select_btn": PanelEvent.SELECT_GAME,
                "auto_btn": PanelEvent.AUTO,
                "betone_btn": PanelEvent.BETONE,
                "maxbet_btn": PanelEvent.MAXBET,
                "start_btn": PanelEvent.START,
                "mute_btn": PanelEvent.MUTE
            };
            return map;
        }();
        this.dictNewBtnType = function () {
            var map = {
                "start_spin": PanelEvent.START_SPIN,
                "gamble_bet": PanelEvent.GAMBLE_BET,
                "auto_stop": PanelEvent.AUTO_STOP,
                "btn_home": PanelEvent.AUTO_STOP,
                "btn_menu": PanelEvent.AUTO_STOP
            };
            return map;
        }();
        PanelSlotWeb.nameResoursPanel = './panel/web_panel.json';
        this.init();
    }
    PanelSlotWeb.prototype.hideLoader = function () {
        if (document["preloader"])
            document["preloader"].style.display = 'none';
        this.uniqueShow();
        if (this.txt_fon)
            this.txt_fon.visible = true;
        if (this._txt_info)
            this._txt_info.visible = true;
        if (this._txt_total_bet)
            this._txt_total_bet.visible = true;
        if (this._txt_total_win)
            this._txt_total_win.visible = true;
        if (this._txt_balance)
            this._txt_balance.visible = true;
        if (this._txt_bet)
            this._txt_bet.visible = true;
    };
    PanelSlotWeb.prototype.uniqueShow = function () {
        if (this.mute_btn)
            this.mute_btn.visible = true;
        for (var s in this.dictBtn) {
            this.dictBtn[s].visible = true;
        }
    };
    PanelSlotWeb.prototype.init = function () {
        this.loader = PIXI.loader.add(PanelSlotWeb.nameResoursPanel);
        this.loader.once("complete", this.completeLoad, this);
        this.loader.load();
    };
    PanelSlotWeb.prototype.completeLoad = function () {
        var _this = this;
        this.nameBtns = [
            new BtnInfo("auto_btn", "btn_autostart.png", -19, 806, "btn_autostart_down.png"),
            new BtnInfo("info_btn", "btn_info.png", 181, 809),
            new BtnInfo("betone_btn", "btn_betone.png", 802, 810),
            new BtnInfo("maxbet_btn", "btn_maxbet.png", 911, 810),
            new BtnInfo("start_btn", "btn_start.png", 1011, 726)
        ];
        this.linesBtn = [
            new BtnInfo("line1_btn", "btn_1lines.png", 259, 807, "btn_1lines_down.png"),
            new BtnInfo("line2_btn", "btn_3lines.png", 367, 807, "btn_3lines_down.png"),
            new BtnInfo("line3_btn", "btn_5lines.png", 475, 807, "btn_5lines_down.png"),
            new BtnInfo("line4_btn", "btn_7lines.png", 584, 807, "btn_7lines_down.png"),
            new BtnInfo("line5_btn", "btn_9lines.png", 693, 807, "btn_9lines_down.png")
        ];
        mainSlot.atlasPanel = PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures;
        this.preloader = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(PanelSlotWeb.nameResoursPanel, "preloader_mc", 24));
        this.preloader.animationSpeed = 0.5;
        this.preloader.anchor.set(0.5, 0.5);
        this.preloader.position.x = Constants.ASSETS_WIDTH / 2;
        this.preloader.position.y = Constants.ASSETS_HEIGHT / 2;
        this.preloader.play();
        this.containerGame = new PIXI.Sprite();
        this.addChild(this.containerGame);
        this.txt_fon = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["mainback_screen.png"]);
        this.txt_fon.position.x = -19;
        this.txt_fon.position.y = 700;
        this.txt_fon.cacheAsBitmap = true;
        this.txt_fon.visible = false;
        this.addChild(this.txt_fon);
        this.mute_btn = new BtnMute();
        this.mute_btn.position.x = 1124;
        this.mute_btn.position.y = 46;
        this.mute_btn.on(BtnMute.EXCHANGE_MUTE, function () { _this.onMute(); });
        this.mute_btn.visible = false;
        this.addChild(this.mute_btn);
        this.wnd_settings = new PIXI.Sprite();
        this.wnd_settings.position.x = 0;
        this.wnd_settings.position.y = 0;
        this.addChild(this.wnd_settings);
        this.createBtnsOnName(this.nameBtns, true);
        this.setComboBtns(this.linesBtn);
        this._txt_info = new PIXI.Text();
        this._txt_info.text = '111';
        this._txt_info.style = this.styleLabelIndex;
        this._txt_info.position.x = 220;
        this._txt_info.position.y = 760;
        this._txt_info.anchor.set(0.5, 0);
        this._txt_info.visible = false;
        this.addChild(this._txt_info);
        this._txt_total_bet = new PIXI.Text();
        this._txt_total_bet.text = '111';
        this._txt_total_bet.style = this.styleLabelIndex;
        this._txt_total_bet.position.x = 520;
        this._txt_total_bet.position.y = 760;
        this._txt_total_bet.anchor.set(0.5, 0);
        this._txt_total_bet.visible = false;
        this.addChild(this._txt_total_bet);
        this._txt_total_win = new PIXI.Text();
        this._txt_total_win.text = '111';
        this._txt_total_win.style = this.styleLabelIndex;
        this._txt_total_win.position.x = 682;
        this._txt_total_win.position.y = 760;
        this._txt_total_win.anchor.set(0.5, 0);
        this._txt_total_win.visible = false;
        this.addChild(this._txt_total_win);
        this._txt_balance = new PIXI.Text();
        this._txt_balance.text = '111';
        this._txt_balance.style = this.styleLabelIndex;
        this._txt_balance.position.x = 845;
        this._txt_balance.position.y = 760;
        this._txt_balance.anchor.set(0.5, 0);
        this._txt_balance.visible = false;
        this.addChild(this._txt_balance);
        this._txt_bet = new PIXI.Text();
        this._txt_bet.text = '111';
        this._txt_bet.style = this.styleLabelIndex;
        this._txt_bet.position.x = 975;
        this._txt_bet.position.y = 760;
        this._txt_bet.anchor.set(0.5, 0);
        this._txt_bet.visible = false;
        this.addChild(this._txt_bet);
        this.emit(EVENT_ONLOAD);
    };
    PanelSlotWeb.prototype.createBtnsOnName = function (ar, isAddListener) {
        var _this = this;
        var btns = new Array();
        for (var i = 0; i < ar.length; i++) {
            var btnAnimate = new BtnPanel(ar[i].skin, ar[i].name, ar[i].down_state);
            this.dictBtn[ar[i].name] = btnAnimate;
            btns.push(btnAnimate);
            if (isAddListener) {
                btnAnimate.on(BtnPanel.CLICK_BTN, function (nameBtn) { _this.onBtn(nameBtn); });
            }
            btnAnimate.position.x = ar[i].x;
            btnAnimate.position.y = ar[i].y;
            btnAnimate.visible = false;
            this.wnd_settings.addChild(btnAnimate);
        }
        return btns;
    };
    PanelSlotWeb.prototype.setComboBtns = function (ar) {
        var _this = this;
        var arComboBtns = this.createBtnsOnName(ar, false);
        for (var i = 0; i < ar.length; i++)
            arComboBtns[i].setLabel("" + this.indexlines[i]);
        this.comboBtns = new ComboBtns(arComboBtns);
        this.comboBtns.on(ComboBtns.EXCHANGE_SELECT, function (e) { _this.onSelectLine(e); });
        this.comboBtns.selectBtnOnData(1, false);
    };
    PanelSlotWeb.prototype.getNameEventByBtn = function (nameBtn) {
        return this.dictBtnType[nameBtn];
    };
    PanelSlotWeb.prototype.getNameBtnByTypeEvent = function (nameEvent) {
        for (var s in this.dictBtnType) {
            if (this.dictBtnType[s] == nameEvent)
                return s;
        }
        return null;
    };
    PanelSlotWeb.prototype.onMute = function () {
        this.emit(PanelEvent.PANEL_EVENT, new PanelEvent(PanelEvent.MUTE, this.mute_btn.isMute ? 0 : 1));
    };
    PanelSlotWeb.prototype.onBtn = function (nameBtn) {
        this.onActionBtn(nameBtn);
    };
    PanelSlotWeb.prototype.onSelectLine = function (e) {
        this.emit(PanelEvent.PANEL_EVENT, new PanelEvent(PanelEvent.SELECT_LINE, this.comboBtns.selectIndex));
    };
    PanelSlotWeb.prototype.onActionBtn = function (nameBtn) {
        this.emit(PanelEvent.PANEL_EVENT, new PanelEvent(this.getNameEventByBtn(nameBtn)));
    };
    PanelSlotWeb.prototype.getContainer = function () {
        return this.containerGame;
    };
    PanelSlotWeb.prototype.setModeComboBet = function (nom) {
        this.comboBtns.selectBtnOnData(nom, false);
    };
    PanelSlotWeb.prototype.blockBtnByType = function (nameBtn, isBlock) {
        var nb = this.getNameBtnByTypeEvent(nameBtn);
        if (nb != null && this.dictBtn[nb] != null)
            this.dictBtn[nb].enabled = !isBlock;
    };
    PanelSlotWeb.prototype.blockLineBtn = function (nom, isBlock) {
        if (this.dictBtn && this.dictBtn[this.linesBtn[nom].name])
            this.dictBtn[this.linesBtn[nom].name].enabled = !isBlock;
    };
    PanelSlotWeb.prototype.blockAll = function () {
        for (var s in this.dictBtn)
            this.dictBtn[s].enabled = false;
        this.blockComboBtns();
    };
    PanelSlotWeb.prototype.unBlockAll = function () {
        for (var s in this.dictBtn)
            this.dictBtn[s].enabled = true;
        this.comboBtns.enabled = true;
    };
    PanelSlotWeb.prototype.blockComboBtns = function () {
        this.comboBtns.enabled = false;
    };
    PanelSlotWeb.prototype.setModeSelector = function (value) {
        this.comboBtns.modeSelector = value;
    };
    PanelSlotWeb.prototype.setLabelBtn = function (typeBtn, str) {
    };
    PanelSlotWeb.prototype.setTotalBet = function (value) {
    };
    PanelSlotWeb.prototype.setStateAuto = function (value) {
        if (this.dictBtn["auto_btn"] != null)
            this.dictBtn["auto_btn"].setActivNoActiv(value);
    };
    PanelSlotWeb.prototype.setTxtInfo = function (value) {
        if (this._txt_info)
            this._txt_info.text = value;
    };
    PanelSlotWeb.prototype.setTxtTotalBet = function (value) {
        if (this._txt_total_bet)
            this._txt_total_bet.text = value;
    };
    PanelSlotWeb.prototype.setTxtTotalWin = function (value) {
        if (this._txt_total_win)
            this._txt_total_win.text = value;
    };
    PanelSlotWeb.prototype.setTxtBalance = function (value) {
        if (this._txt_balance)
            this._txt_balance.text = value;
    };
    PanelSlotWeb.prototype.setTxtBet = function (value) {
        if (this._txt_bet)
            this._txt_bet.text = value;
    };
    PanelSlotWeb.prototype.setAllBtnNoActiv = function (value) {
        this.comboBtns.activ = value;
    };
    PanelSlotWeb.prototype.hideBtnByType = function (nameBtn, isHide) {
        var nb = this.getNameNewBtnByTypeEvent(nameBtn);
        if (nb != null && this.dictNewBtn[nb] != null)
            this.dictNewBtn[nb].visible = !isHide;
    };
    PanelSlotWeb.prototype.getNameEventByNewBtn = function (nameBtn) {
        return this.dictNewBtnType[nameBtn];
    };
    PanelSlotWeb.prototype.getNameNewBtnByTypeEvent = function (nameEvent) {
        for (var s in this.dictNewBtnType) {
            if (this.dictNewBtnType[s] == nameEvent)
                return s;
        }
        return null;
    };
    PanelSlotWeb.prototype.showAll = function () {
        for (var s in this.dictNewBtn)
            this.dictNewBtn[s].visible = true;
    };
    PanelSlotWeb.prototype.hideAll = function () {
        for (var s in this.dictNewBtn)
            this.dictNewBtn[s].visible = false;
    };
    PanelSlotWeb.prototype.showhelp = function () {
    };
    PanelSlotWeb.prototype.hidehelp = function () {
    };
    return PanelSlotWeb;
}(PIXI.Sprite));
var PanelSlotMob = (function (_super) {
    __extends(PanelSlotMob, _super);
    function PanelSlotMob() {
        _super.apply(this, arguments);
        this.openWndSettings = false;
        this.openWndSettingsForCloseInfo = false;
    }
    PanelSlotMob.prototype.init = function () {
        PanelSlotWeb.nameResoursPanel = './panel/mob_panel.json';
        _super.prototype.init.call(this);
    };
    PanelSlotMob.prototype.uniqueShow = function () {
        if (this.start_spin)
            this.start_spin.visible = true;
        if (this.btn_home)
            this.btn_home.visible = true;
        if (this.btn_menu)
            this.btn_menu.visible = true;
        for (var s in this.dictBtn) {
            this.dictBtn[s].visible = true;
        }
        if (this.wnd_settings)
            this.wnd_settings.visible = false;
    };
    PanelSlotMob.prototype.completeLoad = function () {
        var _this = this;
        this.nameBtns = [
            new BtnInfo("info_btn", "btn_info_mobile.png", 200, 450),
            new BtnInfo("betone_btn", "btn_betone_mobile.png", 400, 450),
            new BtnInfo("maxbet_btn", "btn_maxbet_mobile.png", 600, 450),
            new BtnInfo("auto_btn", "btn_autostart_mobile.png", 800, 450, "btn_autostart_down_mobile.png")
        ];
        this.linesBtn = [
            new BtnInfo("line1_btn", "btn_1lines_mobile.png", 100, 250, "btn_1lines_down_mobile.png"),
            new BtnInfo("line2_btn", "btn_3lines_mobile.png", 300, 250, "btn_3lines_down_mobile.png"),
            new BtnInfo("line3_btn", "btn_5lines_mobile.png", 500, 250, "btn_5lines_down_mobile.png"),
            new BtnInfo("line4_btn", "btn_7lines_mobile.png", 700, 250, "btn_7lines_down_mobile.png"),
            new BtnInfo("line5_btn", "btn_9lines_mobile.png", 900, 250, "btn_9lines_down_mobile.png")
        ];
        mainSlot.atlasPanel = PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures;
        this.preloader = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(PanelSlotWeb.nameResoursPanel, "preloader_mc", 24));
        this.preloader.animationSpeed = 0.5;
        this.preloader.anchor.set(0.5, 0.5);
        this.preloader.position.x = Math.round(1170 / 2);
        this.preloader.position.y = Math.round(623 / 2);
        this.preloader.play();
        this.containerGame = new PIXI.Sprite();
        this.addChild(this.containerGame);
        this.txt_fon = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["mainback_screen_mobile.png"]);
        this.txt_fon.position.x = 20;
        this.txt_fon.position.y = 719;
        this.txt_fon.cacheAsBitmap = true;
        this.txt_fon.visible = false;
        this.addChild(this.txt_fon);
        this.wnd_settings = new PIXI.Sprite();
        this.wnd_settings.position.x = 0;
        this.wnd_settings.position.y = 0;
        this.wnd_settings.visible = false;
        this.addChild(this.wnd_settings);
        var for_wnd_for_click = new PIXI.Graphics();
        for_wnd_for_click.beginFill(0xFF3300);
        for_wnd_for_click.drawRect(0, 0, 1800, 900);
        for_wnd_for_click.endFill();
        for_wnd_for_click.x = -300;
        for_wnd_for_click.alpha = 0;
        for_wnd_for_click.cacheAsBitmap = true;
        for_wnd_for_click.interactive = true;
        for_wnd_for_click.on("mousedown", function (e) { _this.onBtnMenu(); });
        for_wnd_for_click.on("touchstart", function (e) { _this.onBtnMenu(); });
        this.wnd_settings.addChild(for_wnd_for_click);
        this.start_spin = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_start_mobile.png"]);
        this.start_spin.position.x = 1073;
        this.start_spin.position.y = 322;
        this.start_spin.cacheAsBitmap = true;
        this.start_spin.visible = false;
        this.start_spin.interactive = true;
        this.start_spin.on("mousedown", function (e) { _this.onStartSpin(e); });
        this.start_spin.on("touchstart", function (e) { _this.onStartSpin(e); });
        this.addChild(this.start_spin);
        this.dictNewBtn['start_spin'] = this.start_spin;
        this.gamble_bet = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_x2.png"]);
        this.gamble_bet.position.x = -74;
        this.gamble_bet.position.y = 322;
        this.gamble_bet.cacheAsBitmap = true;
        this.gamble_bet.visible = false;
        this.gamble_bet.interactive = true;
        this.gamble_bet.on("mousedown", function (e) { _this.onGambleBet(); });
        this.gamble_bet.on("touchstart", function (e) { _this.onGambleBet(); });
        this.addChild(this.gamble_bet);
        this.dictNewBtn['gamble_bet'] = this.gamble_bet;
        this.auto_stop = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_stop.png"]);
        this.auto_stop.position.x = 1073;
        this.auto_stop.position.y = 322;
        this.auto_stop.cacheAsBitmap = true;
        this.auto_stop.visible = false;
        this.auto_stop.interactive = true;
        this.auto_stop.on("mousedown", function (e) { _this.onBtnAuto(); });
        this.auto_stop.on("touchstart", function (e) { _this.onBtnAuto(); });
        this.addChild(this.auto_stop);
        var fon_wnd_settings = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["main_back_mobile.png"]);
        fon_wnd_settings.position.x = 65;
        fon_wnd_settings.position.y = 122;
        fon_wnd_settings.cacheAsBitmap = true;
        fon_wnd_settings.interactive = true;
        this.wnd_settings.addChild(fon_wnd_settings);
        this.btn_home = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_home.png"]);
        this.btn_home.position.x = -60;
        this.btn_home.position.y = 660;
        this.btn_home.cacheAsBitmap = true;
        this.btn_home.visible = false;
        this.btn_home.interactive = true;
        this.btn_home.on("mousedown", function (e) { _this.onBtnHome(); });
        this.btn_home.on("touchstart", function (e) { _this.onBtnHome(); });
        this.addChild(this.btn_home);
        this.btn_menu = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_menu.png"]);
        this.btn_menu.position.x = 1096;
        this.btn_menu.position.y = 660;
        this.btn_menu.cacheAsBitmap = true;
        this.btn_menu.visible = false;
        this.btn_menu.interactive = true;
        this.btn_menu.on("mousedown", function (e) { _this.onBtnMenu(); });
        this.btn_menu.on("touchstart", function (e) { _this.onBtnMenu(); });
        this.addChild(this.btn_menu);
        var btns = this.createBtnsOnName(this.nameBtns, true);
        this.setComboBtns(this.linesBtn);
        this._txt_info = new PIXI.Text();
        this._txt_info.text = '111';
        this._txt_info.style = this.styleLabelIndex;
        this._txt_info.position.x = 300;
        this._txt_info.position.y = 760;
        this._txt_info.anchor.set(0.5, 0);
        this._txt_info.visible = false;
        this.addChild(this._txt_info);
        this._txt_total_bet = new PIXI.Text();
        this._txt_total_bet.text = '111';
        this._txt_total_bet.style = this.styleLabelIndex;
        this._txt_total_bet.position.x = 610;
        this._txt_total_bet.position.y = 760;
        this._txt_total_bet.anchor.set(0.5, 0);
        this._txt_total_bet.visible = false;
        this.addChild(this._txt_total_bet);
        this._txt_total_win = new PIXI.Text();
        this._txt_total_win.text = '111';
        this._txt_total_win.style = this.styleLabelIndex;
        this._txt_total_win.position.x = 772;
        this._txt_total_win.position.y = 760;
        this._txt_total_win.anchor.set(0.5, 0);
        this._txt_total_win.visible = false;
        this.addChild(this._txt_total_win);
        this._txt_balance = new PIXI.Text();
        this._txt_balance.text = '111';
        this._txt_balance.style = this.styleLabelIndex;
        this._txt_balance.position.x = 938;
        this._txt_balance.position.y = 760;
        this._txt_balance.anchor.set(0.5, 0);
        this._txt_balance.visible = false;
        this.addChild(this._txt_balance);
        this._txt_bet = new PIXI.Text();
        this._txt_bet.text = '111';
        this._txt_bet.style = this.styleLabelIndex;
        this._txt_bet.position.x = 1065;
        this._txt_bet.position.y = 760;
        this._txt_bet.anchor.set(0.5, 0);
        this._txt_bet.visible = false;
        this.addChild(this._txt_bet);
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRect(-300, 820, 1800, 80);
        graphics.endFill();
        this.addChild(graphics);
        this.dictBtn["auto_btn"].on("mousedown", function (e) { _this.checkCloseWnd(); });
        this.dictBtn["auto_btn"].on("touchstart", function (e) { _this.checkCloseWnd(); });
        this.dictBtn["info_btn"].on("mousedown", function (e) { _this.checkCloseWnd(); });
        this.dictBtn["info_btn"].on("touchstart", function (e) { _this.checkCloseWnd(); });
        this.emit(EVENT_ONLOAD);
    };
    PanelSlotMob.prototype.setAllBtnNoActiv = function (value) {
        _super.prototype.setAllBtnNoActiv.call(this, value);
    };
    PanelSlotMob.prototype.setStateAuto = function (value) {
        _super.prototype.setStateAuto.call(this, value);
        this.checkCloseWnd();
        if (this.auto_stop)
            this.auto_stop.visible = value;
    };
    PanelSlotMob.prototype.onBtnAuto = function () {
        this.checkCloseWnd();
        this.onActionBtn("auto_btn");
    };
    PanelSlotMob.prototype.onBtnMenu = function () {
        this.wnd_settings.visible = this.openWndSettings = !this.openWndSettings;
    };
    PanelSlotMob.prototype.onBtnHome = function () {
        this.onActionBtn("select_btn");
    };
    PanelSlotMob.prototype.onStartSpin = function (e) {
        this.checkCloseWnd();
        this.onActionBtn("start_btn");
        e.stopPropagation();
        e.stopped = true;
    };
    PanelSlotMob.prototype.onGambleBet = function () {
        this.checkCloseWnd();
        this.onActionBtn("betone_btn");
    };
    PanelSlotMob.prototype.checkCloseWnd = function () {
        if (this.openWndSettings)
            this.onBtnMenu();
    };
    PanelSlotMob.prototype.showhelp = function () {
        var _this = this;
        this.openWndSettingsForCloseInfo = this.openWndSettings;
        this.checkCloseWnd();
        this.btn_menu.alpha = 0;
        this.btn_menu.interactive = false;
        this.start_spin.alpha = 0;
        this.start_spin.interactive = false;
        this.gamble_bet.alpha = 0;
        this.gamble_bet.interactive = false;
        this.auto_stop.alpha = 0;
        this.auto_stop.interactive = false;
        if (!this.btn_back_info) {
            this.btn_back_info = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_back.png"]);
            this.btn_back_info.position.x = 1096;
            this.btn_back_info.position.y = 660;
            this.btn_back_info.cacheAsBitmap = true;
            this.btn_back_info.on("mousedown", function (e) { _this.onStartSpin(e); });
            this.btn_back_info.on("touchstart", function (e) { _this.onStartSpin(e); });
        }
        this.btn_back_info.interactive = true;
        this.addChild(this.btn_back_info);
        if (!this.btn_select_info) {
            this.btn_select_info = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_left.png"]);
            this.btn_select_info.position.x = 1073;
            this.btn_select_info.position.y = 322;
            this.btn_select_info.cacheAsBitmap = true;
            this.btn_select_info.on("mousedown", function (e) { _this.helpnextpage(e); });
            this.btn_select_info.on("touchstart", function (e) { _this.helpnextpage(e); });
        }
        this.btn_select_info.interactive = true;
        this.addChild(this.btn_select_info);
    };
    PanelSlotMob.prototype.helpnextpage = function (e) {
        this.comboBtns.selectBtnOnData(4);
        e.stopPropagation();
        e.stopped = true;
    };
    PanelSlotMob.prototype.hidehelp = function () {
        if (this.btn_back_info) {
            this.btn_back_info.interactive = false;
            this.removeChild(this.btn_back_info);
        }
        if (this.btn_select_info) {
            this.btn_select_info.interactive = false;
            this.removeChild(this.btn_select_info);
        }
        this.btn_menu.alpha = 1;
        this.btn_menu.interactive = true;
        this.start_spin.alpha = 1;
        this.start_spin.interactive = true;
        this.gamble_bet.alpha = 1;
        this.gamble_bet.interactive = true;
        this.auto_stop.alpha = 1;
        this.auto_stop.interactive = true;
        this.onBtnMenu();
    };
    return PanelSlotMob;
}(PanelSlotWeb));
var BtnInfo = (function () {
    function BtnInfo(name, skin, x, y, down_state) {
        if (down_state === void 0) { down_state = ''; }
        this.name = name;
        this.skin = skin;
        this.x = x;
        this.y = y;
        if (down_state) {
            this.down_state = down_state;
        }
    }
    return BtnInfo;
}());
var BtnMute = (function (_super) {
    __extends(BtnMute, _super);
    function BtnMute() {
        var _this = this;
        _super.call(this);
        this.isMute = false;
        this.fon = new PIXI.extras.MovieClip([PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_sound_on.png"], PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_sound_off.png"]]);
        this.fon.interactive = true;
        this.fon.on("mousedown", function (e) { _this.onBtn(); });
        this.fon.on("touchstart", function (e) { _this.onBtn(); });
        this.addChild(this.fon);
        this.setMute(false);
    }
    BtnMute.prototype.onBtn = function () {
        this.setMute(!this.isMute);
        this.emit(BtnMute.EXCHANGE_MUTE);
    };
    BtnMute.prototype.setMute = function (value) {
        this.isMute = value;
        this.fon.gotoAndStop(this.isMute ? 1 : 0);
    };
    BtnMute.EXCHANGE_MUTE = "exchange_mute";
    return BtnMute;
}(PIXI.Sprite));
var BtnPanel = (function (_super) {
    __extends(BtnPanel, _super);
    function BtnPanel(skinName, nameBtn, down_state) {
        var _this = this;
        _super.call(this);
        this._isModeCB = false;
        this.creatLabel = false;
        this.name = nameBtn;
        var textures = [];
        textures.push(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures[skinName]);
        if (down_state)
            textures.push(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures[down_state]);
        this.fon = new PIXI.extras.MovieClip(textures);
        this.fon.interactive = true;
        this.fon.on("mousedown", function (e) { _this.onUpBtn(e); });
        this.fon.on("touchstart", function (e) { _this.onUpBtn(e); });
        this.addChild(this.fon);
    }
    BtnPanel.prototype.setMode = function (newState) {
        this.state = newState;
    };
    BtnPanel.prototype.onPressBtn = function () {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
    };
    BtnPanel.prototype.onUpBtn = function (e) {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
        this.emit(BtnPanel.CLICK_BTN, this.name);
    };
    BtnPanel.prototype.onOverBtn = function () {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
    };
    BtnPanel.prototype.onOutBtn = function () {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
    };
    Object.defineProperty(BtnPanel.prototype, "dataIndex", {
        get: function () {
            return this._dataIndex;
        },
        set: function (value) {
            this._dataIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BtnPanel.prototype, "isModeCB", {
        get: function () {
            return this._isModeCB;
        },
        set: function (value) {
            this._isModeCB = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BtnPanel.prototype, "enabled", {
        set: function (value) {
            this.setMode(value ? BtnPanel.STATE_UP : BtnPanel.STATE_DISABLED);
            this.alpha = value ? 1 : 0.5;
        },
        enumerable: true,
        configurable: true
    });
    BtnPanel.prototype.setPosition = function (newState) {
        if (newState)
            this.fon.gotoAndStop(BtnPanel.STATE_DOWN);
        else
            this.fon.gotoAndStop(BtnPanel.STATE_UP);
        this.setMode(newState);
    };
    BtnPanel.prototype.setActivNoActiv = function (value) {
        if (value)
            this.fon.gotoAndStop(BtnPanel.STATE_DOWN);
        else
            this.fon.gotoAndStop(BtnPanel.STATE_UP);
    };
    BtnPanel.prototype.setLabel = function (str) {
        if (this.labelIndex != null) {
            this.labelIndex.text = str;
        }
    };
    BtnPanel.prototype.visibled = function (value) {
        this.visible = value;
    };
    BtnPanel.CLICK_BTN = "click_btn";
    BtnPanel.STATE_UP = 0;
    BtnPanel.STATE_DOWN = 1;
    BtnPanel.STATE_DISABLED = 3;
    return BtnPanel;
}(PIXI.Sprite));
var ComboBtns = (function (_super) {
    __extends(ComboBtns, _super);
    function ComboBtns(btns) {
        var _this = this;
        _super.call(this);
        this.modeSelector = false;
        this.btns = btns;
        for (var i = 0; i < btns.length; i++) {
            var btn = btns[i];
            btn.isModeCB = true;
            btn.dataIndex = i;
            btn.on(BtnPanel.CLICK_BTN, function (nameBtn) { _this.onBtn(nameBtn); });
        }
    }
    ComboBtns.prototype.onBtn = function (nameBtn) {
        for (var i = 0; i < this.btns.length; i++) {
            if (this.btns[i].name == nameBtn) {
                this.selectBtnOnData(this.btns[i].dataIndex);
                return;
            }
        }
    };
    ComboBtns.prototype.selectBtnOnData = function (dataIndex, isDispatch) {
        if (isDispatch === void 0) { isDispatch = true; }
        if (this.modeSelector) {
            for (var i = 0; i < this.btns.length; i++) {
                var an = this.btns[i];
                if (mainSlot.panel.ishelp == false) {
                    if (an.dataIndex == dataIndex) {
                        an.setPosition(BtnPanel.STATE_DOWN);
                        mainSlot.panel.indexActivLine = dataIndex;
                    }
                    else
                        an.setPosition(BtnPanel.STATE_UP);
                }
            }
        }
        else {
            this.btns[dataIndex].setPosition(BtnPanel.STATE_UP);
        }
        this.selectIndex = dataIndex;
        if (isDispatch) {
            this.emit(ComboBtns.EXCHANGE_SELECT);
        }
    };
    Object.defineProperty(ComboBtns.prototype, "enabled", {
        set: function (value) {
            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].enabled = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComboBtns.prototype, "activ", {
        set: function (value) {
            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].setActivNoActiv(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    ComboBtns.EXCHANGE_SELECT = "exchange_select";
    return ComboBtns;
}(PIXI.utils.EventEmitter));
//# sourceMappingURL=panel_slot_web.js.map