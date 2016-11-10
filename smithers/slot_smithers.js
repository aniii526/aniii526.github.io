var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SlotSmithers = (function (_super) {
    __extends(SlotSmithers, _super);
    function SlotSmithers() {
        _super.call(this);
        SlotEnity.NAME_ATLAS_ICON = 'smithers/images/img_v2/game/prokrut_main/icon_main.json';
        SlotEnity.NAME_ATLAS_ICON_ANIM = 'smithers/images/img_v2/game/prokrut_main/icon_main.json';
        SlotEnity.NAME_ATLAS_HELP_SCENE = 'smithers/images/img_v2/game/prokrut_main/icon_main.json';
        SlotEnity.NAME_ATLAS_MAIN_SCENE = 'smithers/images/img_v2/game/prokrut_main/icon_main.json';
        SlotEnity.NAME_ATLAS_GAMBLE_SCENE = 'gnome/images/gamble_card2.json';
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    }
    SlotSmithers.prototype.getResourseImg = function (callback) {
        this.loader = PIXI.loader
            .add('mainback', 'smithers/images/img_v2/game/mainback_Smithers.jpg?2')
            .add('smithers/images/img_v2/game/prokrut_main/icon_main.json')
            .add('double', 'smithers/images/img_v2/gamble/double.jpg?1')
            .add('help_bg', 'smithers/images/img_v2/help/help.jpg?1')
            .add('help_scene_0', 'smithers/images/img_v2/help/help0.jpg?1')
            .add('help_scene_1', 'smithers/images/img_v2/help/help1.jpg?1')
            .add('help_scene_2', 'smithers/images/img_v2/help/help2.jpg?1')
            .add('mainback_number', 'gnome/images/img_v2/game/mainback_number.png?1')
            .add('gnome/images/line_mc.json')
            .add('gnome/images/gamble_card2.json');
        this.loader.once("complete", callback, this);
        this.loader.load();
    };
    SlotSmithers.prototype.getStateSlotManager = function () {
        return new StateSlotManagerDefault();
    };
    SlotSmithers.prototype.getSettingRoll = function () {
        var rollVO = new RollVO();
        rollVO.count_roll = 5;
        rollVO.count_icon = 9;
        rollVO.count_row = 3;
        rollVO.step_y = 195;
        rollVO.step_x = 215;
        rollVO.width_mask = 195;
        return rollVO;
    };
    SlotSmithers.prototype.initGame = function () {
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    };
    SlotSmithers.prototype.getHelpScene = function () {
        if (this.help == null)
            this.help = new HelpSceneSmithers();
        return this.help;
    };
    SlotSmithers.prototype.getGambleScene = function () {
        if (this.gamble == null)
            this.gamble = new GambleSceneSmithers();
        return this.gamble;
    };
    SlotSmithers.prototype.getMainScene = function () {
        if (this.mainScene == null)
            this.mainScene = new MainSceneSmithers();
        return this.mainScene;
    };
    SlotSmithers.prototype.getIsShield = function () {
        return mainSlot.model.shield;
    };
    return SlotSmithers;
}(SlotEnity));
var MainSceneSmithers = (function (_super) {
    __extends(MainSceneSmithers, _super);
    function MainSceneSmithers() {
        _super.call(this, new PIXI.Sprite());
        this.soundsManifest = [
            { src: "gnome/sounds/addline.mp3?1473506394550", id: "addline" },
            { src: "gnome/sounds/b1_loss.mp3?1473506394550", id: "b1_loss" },
            { src: "gnome/sounds/b1_open.mp3?1473506394550", id: "b1_open" },
            { src: "gnome/sounds/b1_win.mp3?1473506394550", id: "b1_win" },
            { src: "gnome/sounds/bonus.mp3?1473506394550", id: "bonus" },
            { src: "gnome/sounds/card_dealer_open.mp3?1473506394550", id: "card_dealer_open" },
            { src: "gnome/sounds/cardwin.mp3?1473506394550", id: "cardwin" },
            { src: "gnome/sounds/key_press.mp3?1473506394550", id: "key_press" },
            { src: "gnome/sounds/money_move.mp3?1473506394550", id: "money_move" },
            { src: "gnome/sounds/route1time.mp3?1473506394551", id: "route1time" },
            { src: "gnome/sounds/routestop.mp3?1473506394551", id: "routestop" },
            { src: "gnome/sounds/sb_loss.mp3?1473506394551", id: "sb_loss" }
        ];
        var mainback = new PIXI.Sprite(PIXI.loader.resources["mainback"].texture);
        mainback.x = -300;
        mainback.cacheAsBitmap = true;
        this.mc.addChild(mainback);
        var mainback_number = new PIXI.Sprite(PIXI.loader.resources["mainback_number"].texture);
        mainback_number.x = -36;
        mainback_number.y = 108;
        mainback_number.cacheAsBitmap = true;
        this.mc.addChild(mainback_number);
        this.addRoll(72, 132);
        this.addWinLine(-36, 108, null);
    }
    MainSceneSmithers.prototype.initDisplay = function () {
        var _this = this;
        var styleLabelIndex = {
            align: 'left',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#FFFF00',
            letterSpacing: 1
        };
        mainSlot.panel.panel.setTxtInfo('PLEASE PRESS START');
        mainSlot.bindSetter(this.modelSlot, "balance", function (value) { _this.updateBalance(value); });
        mainSlot.bindSetter(this.modelSlot, "typeBet", function (value) { _this.updateBetLine(value); });
        mainSlot.bindSetter(this.modelSlot, "modeLine", function (value) { _this.updateBetLine(value); });
        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", function (value) { _this.exchangeMode(value); });
        mainSlot.panel.panel.setModeComboBet(0);
    };
    MainSceneSmithers.prototype.getAnimIconVOForId = function (id) {
        return new AnimIconVO();
    };
    MainSceneSmithers.prototype.completeShowLines = function () {
    };
    MainSceneSmithers.prototype.onCompleteRolls = function () {
        _super.prototype.onCompleteRolls.call(this);
    };
    MainSceneSmithers.prototype.exchangeMode = function (value) {
        if (value == ModelSlot.MODE_READY) {
            this.updateBetLine(1);
        }
        else if (value == ModelSlot.MODE_ROUTE_WIN && this.modelSlot.lastAction.Action == ModelSlot.ID_WIN_ROUTE) {
            mainSlot.panel.panel.setTxtTotalWin("" + this.modelSlot.lastAction.Summ);
            mainSlot.panel.panel.setTxtInfo('WIN ' + this.modelSlot.lastAction.Summ);
        }
        else if (value == ModelSlot.MODE_DEBIT) {
        }
    };
    MainSceneSmithers.prototype.updateBalance = function (value) {
        mainSlot.panel.panel.setTxtBalance("" + value);
    };
    MainSceneSmithers.prototype.updateBetLine = function (type) {
        mainSlot.panel.panel.setTxtTotalBet("" + this.modelSlot.totalBet);
        mainSlot.panel.panel.setTxtTotalWin("0");
        mainSlot.panel.panel.setTxtBet("" + this.modelSlot.amountBet);
        this.index_bets = this.modelSlot.typeBet;
        this.index_lines = this.modelSlot.modeLine;
        this.updateShield();
    };
    MainSceneSmithers.prototype.updateShield = function () {
        if (this.index_bets >= 2 && this.index_lines >= 5) {
            this.modelSlot.shield = true;
        }
        else {
            this.modelSlot.shield = false;
        }
    };
    MainSceneSmithers.prototype.getNumBonus = function () {
        var countInd = this.getContIndex(9);
        if (countInd >= 3)
            return 9;
        else
            return 1;
    };
    return MainSceneSmithers;
}(MainScene));
var HelpSceneSmithers = (function (_super) {
    __extends(HelpSceneSmithers, _super);
    function HelpSceneSmithers() {
        _super.call(this, new PIXI.Sprite());
        var help_bg = new PIXI.Sprite(PIXI.loader.resources["help_bg"].texture);
        help_bg.x = 53;
        help_bg.y = 111;
        help_bg.cacheAsBitmap = true;
        this.mc.addChild(help_bg);
        this.mc["anim"] = new PIXI.extras.MovieClip([
            PIXI.loader.resources["help_scene_0"].texture,
            PIXI.loader.resources["help_scene_1"].texture,
            PIXI.loader.resources["help_scene_2"].texture
        ]);
        this.mc["anim"].x = 70;
        this.mc["anim"].y = 123;
        this.mc["anim"].visible = false;
        this.mc.addChild(this.mc["anim"]);
    }
    return HelpSceneSmithers;
}(HelpScene));
var GambleSceneSmithers = (function (_super) {
    __extends(GambleSceneSmithers, _super);
    function GambleSceneSmithers() {
        _super.call(this, new PIXI.Sprite());
        var mainback = new PIXI.Sprite(PIXI.loader.resources["mainback"].texture);
        mainback.x = -300;
        mainback.cacheAsBitmap = true;
        this.mc.addChild(mainback);
        var mainback_number = new PIXI.Sprite(PIXI.loader.resources["mainback_number"].texture);
        mainback_number.x = -36;
        mainback_number.y = 108;
        mainback_number.cacheAsBitmap = true;
        this.mc.addChild(mainback_number);
        var gamble_scene = new PIXI.Sprite(PIXI.loader.resources["double"].texture);
        gamble_scene.x = 53;
        gamble_scene.y = 112;
        gamble_scene.cacheAsBitmap = true;
        this.mc.addChild(gamble_scene);
        var styleLabelIndex = {
            align: 'left',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#FFFF00',
            letterSpacing: 1
        };
        var dealer_card = new PIXI.Sprite();
        dealer_card.position.x = 170;
        dealer_card.position.y = 330;
        this.mc.addChild(dealer_card);
        this.mc["dealer_card"] = dealer_card;
        var dealer = new PIXI.Sprite(PIXI.loader.resources['gnome/images/gamble_card2.json'].textures["dealer_icon.png"]);
        dealer.position.x = 146;
        dealer.position.y = 310;
        this.mc.addChild(dealer);
        this.mc["dealer"] = dealer;
        var card;
        for (var i = 1; i <= 4; i++) {
            card = new PIXI.Sprite();
            card.position.x = 400 + 163 * (i - 1);
            card.position.y = 330;
            this.mc.addChild(card);
            this.mc["card" + i] = card;
        }
        card = null;
        this.step_txt = new PIXI.Text();
        this.step_txt.text = 'RISK STEP:';
        this.step_txt.style = styleLabelIndex;
        this.step_txt.position.x = 600;
        this.step_txt.position.y = 230;
        this.step_txt.anchor.set(0.5, 0);
        this.mc.addChild(this.step_txt);
        this.mc["step_txt"] = this.step_txt;
        this.createCards(CardDefault);
        this.pick_mc = new PIXI.Sprite(PIXI.loader.resources['gnome/images/gamble_card2.json'].textures["pick_icon.png"]);
        this.pick_mc.anchor.set(0.5, 0);
        this.pick_mc.position.y = 560;
        this.pick_mc.position.x = this.mc["card1"].x + 82;
        this.mc.addChild(this.pick_mc);
    }
    GambleSceneSmithers.prototype.initDisplay = function () {
        var _this = this;
        var styleLabelIndex = {
            align: 'left',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#FFFF00',
            letterSpacing: 1
        };
        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", function (value) { _this.exchangeMode(value); });
        this.showMsgDouble();
    };
    GambleSceneSmithers.prototype.exchangeMode = function (value) {
        if (value == ModelSlot.MODE_GAMBLE_LOSE) {
            mainSlot.panel.panel.setTxtInfo("YOU LOSE");
        }
        else if (value == ModelSlot.MODE_GAMBLE_WIN) {
            mainSlot.panel.panel.setTxtInfo("YOU WIN");
        }
        else if (value == ModelSlot.MODE_DEBIT) {
            mainSlot.panel.panel.setTxtInfo("TAKE...");
        }
    };
    GambleSceneSmithers.prototype.showMsgDouble = function () {
        mainSlot.panel.panel.setTxtInfo("SELECT CARD OR START");
    };
    GambleSceneSmithers.prototype.setSelectValue = function (type) {
        _super.prototype.setSelectValue.call(this, type);
        this.pick_mc.x = this.mc["card" + type].x + 82;
        this.pick_mc.visible = true;
    };
    GambleSceneSmithers.prototype.resetGamble = function () {
        var _this = this;
        _super.prototype.resetGamble.call(this);
        mainSlot.panel.panel.setTxtTotalBet("" + this.modelSlot.totalBet);
        setTimeout(function () { _this.mc['step_txt'].text = 'RISK STEP : ' + _this.modelSlot.getStepGamble().toString(); });
        this.showMsgDouble();
    };
    GambleSceneSmithers.prototype.updatePrize = function () {
        mainSlot.panel.panel.setTxtTotalWin("" + this.modelSlot.lastAction.Summ);
    };
    return GambleSceneSmithers;
}(GambleScene));
var BonusSceneSmithers = (function (_super) {
    __extends(BonusSceneSmithers, _super);
    function BonusSceneSmithers() {
        var _this = this;
        _super.call(this, new PIXI.Sprite(PIXI.loader.resources["bonus_scene"].texture));
        this.anims = new Array();
        this.X_ANIM = 30;
        var styleLabelIndex = {
            align: 'left',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#D1CAA0',
            letterSpacing: 1
        };
        this.total_bet_stat = new PIXI.Text();
        this.total_bet_stat.text = 'TOTAL BET';
        this.total_bet_stat.style = styleLabelIndex;
        this.total_bet_stat.position.x = 12;
        this.total_bet_stat.position.y = 11;
        this.mc.addChild(this.total_bet_stat);
        this.info_stat_txt = new PIXI.Text();
        this.info_stat_txt.text = 'TOTAL WIN';
        this.info_stat_txt.style = styleLabelIndex;
        this.info_stat_txt.position.x = 280;
        this.info_stat_txt.position.y = 11;
        this.mc.addChild(this.info_stat_txt);
        this.credit_stat = new PIXI.Text();
        this.credit_stat.text = 'CREDIT';
        this.credit_stat.style = styleLabelIndex;
        this.credit_stat.position.x = 560;
        this.credit_stat.position.y = 11;
        this.mc.addChild(this.credit_stat);
        this.bet_txt = new PIXI.Text();
        this.bet_txt.text = '9999';
        this.bet_txt.style = styleLabelIndex;
        this.bet_txt.style.align = 'right';
        this.bet_txt.position.x = 260;
        this.bet_txt.position.y = 11;
        this.bet_txt.anchor.set(1, 0);
        this.mc.addChild(this.bet_txt);
        this.win_txt = new PIXI.Text();
        this.win_txt.text = '9999';
        this.win_txt.style = styleLabelIndex;
        this.win_txt.style.align = 'right';
        this.win_txt.position.x = 540;
        this.win_txt.position.y = 11;
        this.win_txt.anchor.set(1, 0);
        this.mc.addChild(this.win_txt);
        this.credit_txt = new PIXI.Text();
        this.credit_txt.text = '9999';
        this.credit_txt.style = styleLabelIndex;
        this.credit_txt.style.align = 'right';
        this.credit_txt.position.x = 780;
        this.credit_txt.position.y = 11;
        this.credit_txt.anchor.set(1, 0);
        this.mc.addChild(this.credit_txt);
        setTimeout(function () {
            _this.animBonus = new AnimBonus();
            _this.mc.addChild(_this.animBonus);
            _this.animBonus.x = _this.X_ANIM;
            var an;
            for (var i = 1; i <= 5; i++) {
                an = new AnimBonus();
                _this.anims.push(an);
                an.on(EVENT_COMPLETE, function () { _this.onCompleteAnimation(); });
                _this.mc.addChild(an);
                an.x = (i - 1) * 129;
            }
            an = null;
        }, 1);
    }
    BonusSceneSmithers.prototype.initDisplay = function () {
    };
    BonusSceneSmithers.prototype.onCompleteAnimation = function () {
        this.setPositionGnome(this.selectID + 1);
        if (this.isLose || this.arBonuses.length == 0) {
            this.completeBonus(this.arTextPrizes);
        }
        else {
            this.nextAction();
        }
    };
    BonusSceneSmithers.prototype.resetBonus = function (summ, isSb, completeCallback) {
        _super.prototype.resetBonus.call(this, summ, isSb, completeCallback);
        this.bet_txt.text = "" + this.modelSlot.totalBet;
        this.win_txt.text = "0";
        this.credit_txt.text = "" + this.modelSlot.balance;
        this.arTextPrizes = new Array();
        for (var i = 0; i < 5; i++) {
            this.anims[i].reset();
        }
        var countPrizes = isSb ? (this.isHasShield ? 4 : 5) : Math.round(Math.random() * 2) + 1;
        this.arPrizes = this.getPrizes(summ, countPrizes);
        this.setBombForShield();
        for (i = 0; i < this.arPrizes.length; i++) {
            this.arBonuses.push(1);
            this.setBombForShield();
        }
        this.setBombForShield(false);
        if (this.arBonuses.length < 5) {
            var count = 5 - this.arBonuses.length;
            for (var j = 0; j < count; j++) {
                this.arBonuses.push(0);
            }
        }
        this.selectID = -1;
        this.setPositionGnome(1);
    };
    BonusSceneSmithers.prototype.setPositionGnome = function (pos) {
        this.animBonus.x = this.anims[pos - 1].x;
        this.animBonus.y = this.anims[pos - 1].y;
        this.animBonus.visible = true;
        this.animBonus.setMode(AnimBonus.MODE_WAIT, this.isHasShield);
    };
    BonusSceneSmithers.prototype.selectBonus = function (nom) {
        _super.prototype.selectBonus.call(this, nom);
        this.selectID = nom;
        var b = this.arBonuses.shift() == 1;
        this.currentPrize = -1;
        if (b)
            this.currentPrize = Math.random() < 0.5 ? this.arPrizes.pop() : this.arPrizes.shift();
        this.animBonus.visible = false;
        soundManager.playSound("b1_open");
        this.anims[this.selectID].setMode(b ? AnimBonus.MODE_WIN : AnimBonus.MODE_LOSE, this.isHasShield, this.currentPrize);
        this.arTextPrizes.push(this.anims[this.selectID].prize_txt);
        if (!b) {
            if (this.isHasShield)
                this.isHasShield = false;
            else
                this.isLose = true;
        }
    };
    BonusSceneSmithers.prototype.setBombForShield = function (isRand) {
        if (isRand === void 0) { isRand = true; }
        if ((!isRand || Math.random() < 0.4) && !this.isAddBombForShild && this.isHasShield) {
            this.arBonuses.push(0);
            this.isAddBombForShild = true;
        }
    };
    return BonusSceneSmithers;
}(BonusScene));
var slotSmithers = new SlotSmithers();
mainSlot.setSlot(slotSmithers);
//# sourceMappingURL=slot_smithers.js.map