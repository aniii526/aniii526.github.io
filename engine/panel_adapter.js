var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PanelAdapter = (function (_super) {
    __extends(PanelAdapter, _super);
    function PanelAdapter() {
        _super.call(this);
        this.indexlines = [1, 3, 5, 7, 9];
        this.dictBlockBtns = new Object();
        this.ishelp = false;
        this.modelSlot = mainSlot.model;
    }
    PanelAdapter.prototype.setPanel = function (panel) {
        this.panel = panel;
        this.panel.x = 300;
        mainSlot.mainStage.addChild(this.panel);
        this.setBlocks();
    };
    Object.defineProperty(PanelAdapter.prototype, "panelMc", {
        get: function () {
            return this["panel"];
        },
        enumerable: true,
        configurable: true
    });
    PanelAdapter.prototype.hidePanelLoader = function () {
        this.panel.hideLoader();
    };
    PanelAdapter.prototype.setBlocks = function () {
        var linesBtn = [0, 1, 2, 3, 4];
        this.setBlockTypeBtn(ModelSlot.MODE_HELP, new ModePanelShow([PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3], 'PLEASE PRESS START', [PanelEvent.GAMBLE_BET]));
        this.setBlockTypeBtn(ModelSlot.MODE_ERROR, new ModePanelShow([PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], linesBtn, 'error', [PanelEvent.GAMBLE_BET]));
        this.setBlockTypeBtn(ModelSlot.MODE_READY, new ModePanelShow([], [], 'PLEASE PRESS START', [PanelEvent.GAMBLE_BET]));
        this.setBlockTypeBtn(ModelSlot.MODE_ROUTE, new ModePanelShow([PanelEvent.HELP, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], linesBtn, 'GOOD LUCK', [PanelEvent.START_SPIN, PanelEvent.GAMBLE_BET]));
        this.setBlockTypeBtn(ModelSlot.MODE_ROUTE_WIN, new ModePanelShow([PanelEvent.SELECT_GAME, PanelEvent.AUTO], linesBtn, 'GAMBLE OR COLLECT'));
        this.setBlockTypeBtn(ModelSlot.MODE_GAMBLE, new ModePanelShow([PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET], [0], 'SELECT CARD OR START', [PanelEvent.GAMBLE_BET]));
        this.setBlockTypeBtn(ModelSlot.MODE_GAMBLE_CHOICE, new ModePanelShow([PanelEvent.HELP, PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], linesBtn, 'CARD IS SELECTED', [PanelEvent.GAMBLE_BET]));
        this.setBlockTypeBtn(ModelSlot.MODE_BONUS, new ModePanelShow([PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], linesBtn));
        this.setBlockTypeBtn(ModelSlot.MODE_BONUS_CHOICE, new ModePanelShow([PanelEvent.HELP, PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], []));
        this.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [0, 2, 4]));
        this.setBlockTypeBtn(ModelSlot.MODE_BONUS_SPEC, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
        this.setBlockTypeBtn(ModelSlot.MODE_DEBIT, new ModePanelShow([PanelEvent.HELP, PanelEvent.SELECT_GAME, PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], linesBtn, 'COLLECT WIN', [PanelEvent.START_SPIN, PanelEvent.GAMBLE_BET]));
    };
    PanelAdapter.prototype.initPanel = function () {
        var _this = this;
        this.panel.on(PanelEvent.PANEL_EVENT, function (e) { _this.onPanelEvent(e); });
        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", function (value) { _this.blockMode(value); });
        mainSlot.bindSetter(this.modelSlot, "modeLine", function (value) { _this.updateBetLine(value); });
        mainSlot.bindSetter(this.modelSlot, "typeBet", function (value) { _this.updateBetLine(value); });
    };
    PanelAdapter.prototype.setBlockTypeBtn = function (mode, m) {
        this.dictBlockBtns[mode] = m;
    };
    PanelAdapter.prototype.updateBetLine = function (type) {
        this.panel.setTotalBet(this.modelSlot.maxBet);
    };
    PanelAdapter.prototype.blockMode = function (mode) {
        this.blockOnMode(mode);
        this.panel.setModeSelector(mode == ModelSlot.MODE_READY);
    };
    PanelAdapter.prototype.outClickBtn = function (e) {
        this.onPanelEvent(e);
    };
    PanelAdapter.prototype.onPanelEvent = function (e) {
        soundManager.playSound(SoundManager.SOUND_KEY_PRESS);
        if (this.ishelp) {
            switch (e.eventBtn) {
                case PanelEvent.START:
                    mainSlot.slot.hideHelp();
                    this.ishelp = false;
                    this.reBlock(this.lastArBlockCombo);
                    this.setModeComboBet(this.indexActivLine);
                    this.panel.hidehelp();
                    break;
                case PanelEvent.SELECT_LINE:
                    mainSlot.slot.getHelpScene().selectBtn(e.line);
                    break;
            }
            return;
        }
        switch (e.eventBtn) {
            case PanelEvent.FULL_SCREEN:
                toggleFullScreen();
                break;
            case PanelEvent.HELP:
                this.showhelp();
                this.panel.showhelp();
                break;
            case PanelEvent.SELECT_GAME:
                if (this.modelSlot.BackUrl)
                    window.top.location.href = this.modelSlot.BackUrl;
                break;
            case PanelEvent.AUTO:
                this.modelSlot.isAutoMode = !this.modelSlot.isAutoMode;
                break;
            case PanelEvent.BETONE:
                this.modelSlot.stateSlotManager.getCurrent().downGamble1();
                break;
            case PanelEvent.MAXBET:
                this.modelSlot.stateSlotManager.getCurrent().downGamble2();
                break;
            case PanelEvent.START:
                this.modelSlot.stateSlotManager.getCurrent().downStart();
                break;
            case PanelEvent.MUTE:
                soundManager.isMute = e.line == 0 ? true : false;
                break;
            case PanelEvent.SELECT_LINE:
                this.modelSlot.stateSlotManager.getCurrent().downSelectBtn(e.line);
                break;
        }
    };
    PanelAdapter.prototype.showhelp = function () {
        if (this.ishelp)
            return;
        this.blockAll();
        this.blockLineBtn(0, false);
        this.blockLineBtn(4, false);
        this.blockBtnByType(PanelEvent.START, false);
        mainSlot.slot.showHelp();
        this.ishelp = true;
        this.panel.setAllBtnNoActiv(false);
    };
    PanelAdapter.prototype.setModeComboBet = function (nom) {
        this.panel.setModeComboBet(nom);
    };
    PanelAdapter.prototype.blockBtnByType = function (nameBtn, isBlock) {
        if (isBlock === void 0) { isBlock = true; }
        this.panel.blockBtnByType(nameBtn, isBlock);
    };
    PanelAdapter.prototype.hideBtnByType = function (nameBtn, isHide) {
        if (isHide === void 0) { isHide = true; }
        this.panel.hideBtnByType(nameBtn, isHide);
    };
    PanelAdapter.prototype.blockLineBtn = function (nom, isBlock) {
        if (isBlock === void 0) { isBlock = true; }
        this.panel.blockLineBtn(nom, isBlock);
    };
    PanelAdapter.prototype.blockAll = function () {
        this.panel.blockAll();
    };
    PanelAdapter.prototype.hideAll = function () {
        this.panel.hideAll();
    };
    PanelAdapter.prototype.blockComboBtns = function () {
        this.panel.blockComboBtns();
    };
    PanelAdapter.prototype.reBlock = function (arBlockCombo) {
        if (arBlockCombo === void 0) { arBlockCombo = null; }
        this.lastArBlockCombo = arBlockCombo;
        if (this.ishelp)
            return;
        this.blockOnMode(this.modelSlot.stateSlotManager.currentMode);
        if (arBlockCombo != null) {
            for (var i = 0; i < arBlockCombo.length; i++)
                this.blockLineBtn(arBlockCombo[i]);
        }
    };
    PanelAdapter.prototype.getNomBtnLine = function (countLine) {
        return this.indexlines.indexOf(countLine);
    };
    PanelAdapter.prototype.getIndexline = function (ind) {
        return this.indexlines[ind];
    };
    PanelAdapter.prototype.setTextToPanelInfoTxt = function (txt) {
        this.panel.setTxtInfo(txt);
    };
    PanelAdapter.prototype.blockOnMode = function (mode) {
        var m = this.dictBlockBtns[mode];
        if (m != null) {
            this.panel.unBlockAll();
            if (m.buttons) {
                for (var i = 0; i < m.buttons.length; i++)
                    this.blockBtnByType(m.buttons[i]);
            }
            for (var i = 0; i < m.lines.length; i++)
                this.blockLineBtn(m.lines[i]);
            this.panel.showAll();
            if (m.buttonsNew) {
                for (var i = 0; i < m.buttonsNew.length; i++)
                    this.hideBtnByType(m.buttonsNew[i]);
            }
            if (mode == ModelSlot.MODE_GAMBLE)
                this.panel.setAllBtnNoActiv(false);
            this.setTextToPanelInfoTxt(m.txt_info);
        }
    };
    PanelAdapter.prototype.resize = function (w, h) {
        var scale = Math.min(w / Constants.ASSETS_WIDTH, h / Constants.ASSETS_HEIGHT);
        this.panel.scale.x = this.panel.scale.y = scale;
        this.panel.x = (w - Constants.ASSETS_WIDTH * scale) / 2 + (((Constants.ASSETS_WIDTH - 1200) / 2) * scale);
        this.panel.y = (h - Constants.ASSETS_HEIGHT * scale) / 2;
    };
    return PanelAdapter;
}(PIXI.utils.EventEmitter));
var Constants = (function () {
    function Constants() {
    }
    Constants.ASSETS_WIDTH = 1200;
    Constants.ASSETS_HEIGHT = 900;
    Constants.PIXEL_RATIO = 1;
    Constants.SCREEN_SCALE = 1;
    Constants.DPI = -1;
    return Constants;
}());
var ModePanelShow = (function () {
    function ModePanelShow(buttons, lines, txt_info, buttonsNew) {
        if (txt_info === void 0) { txt_info = ''; }
        this.buttons = buttons;
        this.lines = lines;
        this.txt_info = txt_info;
        this.buttonsNew = buttonsNew;
    }
    return ModePanelShow;
}());
var PanelEvent = (function (_super) {
    __extends(PanelEvent, _super);
    function PanelEvent(eventBtn, line) {
        if (line === void 0) { line = 0; }
        _super.call(this);
        this.eventBtn = eventBtn;
        this.line = line;
    }
    PanelEvent.FULL_SCREEN = "fullString";
    PanelEvent.HELP = "help";
    PanelEvent.SELECT_GAME = "selectGame";
    PanelEvent.AUTO = "auto";
    PanelEvent.BETONE = "betone";
    PanelEvent.MAXBET = "maxbet";
    PanelEvent.START = "start";
    PanelEvent.MUTE = "mute";
    PanelEvent.SELECT_LINE = "select_line";
    PanelEvent.START_SPIN = "start_spin";
    PanelEvent.GAMBLE_BET = "gamble_bet";
    PanelEvent.AUTO_STOP = "auto_stop";
    PanelEvent.BTN_HOME = "btn_home";
    PanelEvent.BTN_MENU = "btn_menu";
    PanelEvent.PANEL_EVENT = "panel_event";
    return PanelEvent;
}(PIXI.interaction.InteractionData));
//# sourceMappingURL=panel_adapter.js.map