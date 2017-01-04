var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SlotGnome = (function (_super) {
    __extends(SlotGnome, _super);
    function SlotGnome() {
        _super.call(this);
        SlotEnity.NAME_ATLAS_GAMBLE_SCENE = 'games/gnome/images/gamble_card2.json';
        SlotEnity.NAME_ATLAS_ICONS = 'games/gnome/images/img_v2/game/iconsss.json';
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    }
    SlotGnome.prototype.getResourseImg = function (callback) {
        this.loader = PIXI.loader
            .add('mainback', 'games/gnome/images/img_v2/game/mainback_madluck.jpg?2')
            .add('double', 'games/gnome/images/img_v2/gamble/double.jpg?1')
            .add('help_bg', 'games/gnome/images/img_v2/help/help.jpg?1')
            .add('mainback_number', 'games/gnome/images/img_v2/game/mainback_number.png?1')
            .add('games/gnome/images/line_mc.json')
            .add(SlotEnity.NAME_ATLAS_GAMBLE_SCENE)
            .add(SlotEnity.NAME_ATLAS_ICONS);
        this.currProcNumLoadedObj = 100 / 10;
        this.loader.once("complete", callback, this);
        this.loader.on('progress', function (loader, res) {
            if (loader.progress === 100) {
                this.tempNumLoadedObj++;
                $("#preloader_text").html("" + this.tempNumLoadedObj * this.currProcNumLoadedObj + '%');
            }
        }, this);
        this.loader.load();
    };
    SlotGnome.prototype.getStateSlotManager = function () {
        return new StateSlotManagerDefault();
    };
    SlotGnome.prototype.getSettingRoll = function () {
        var rollVO = new RollVO();
        rollVO.count_roll = 5;
        rollVO.count_icon = 9;
        rollVO.count_row = 3;
        rollVO.step_y = 195;
        rollVO.step_x = 215;
        rollVO.width_mask = 195;
        return rollVO;
    };
    SlotGnome.prototype.initGame = function () {
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    };
    SlotGnome.prototype.getHelpScene = function () {
        if (this.help == null)
            this.help = new HelpSceneGnome();
        return this.help;
    };
    SlotGnome.prototype.getGambleScene = function () {
        if (this.gamble == null)
            this.gamble = new GambleSceneGnome();
        return this.gamble;
    };
    SlotGnome.prototype.getBonusScene = function () {
        if (this.bonus == null)
            this.bonus = new BonusSceneGnome();
        return this.bonus;
    };
    SlotGnome.prototype.getSuperbonusScene = function () {
        if (this.superbonus == null)
            this.superbonus = new SuperbonusSceneGnome();
        return this.superbonus;
    };
    SlotGnome.prototype.getMainScene = function () {
        if (this.mainScene == null)
            this.mainScene = new MainSceneGnome();
        return this.mainScene;
    };
    SlotGnome.prototype.getIsShield = function () {
        return mainSlot.model.shield;
    };
    return SlotGnome;
}(SlotEnity));
var MainSceneGnome = (function (_super) {
    __extends(MainSceneGnome, _super);
    function MainSceneGnome() {
        _super.call(this, new PIXI.Sprite());
        this.soundsManifest = [
            { src: "games/gnome/sounds/addline.ogg?1473506394550", id: "addline" },
            { src: "games/gnome/sounds/card_dealer_open.ogg?1473506394550", id: "card_dealer_open" },
            { src: "games/gnome/sounds/cardwin.ogg?1473506394550", id: "cardwin" },
            { src: "games/gnome/sounds/key_press.ogg?1473506394550", id: "key_press" },
            { src: "games/gnome/sounds/money_move.ogg?1473506394550", id: "money_move" },
            { src: "games/gnome/sounds/route1time.ogg?1473506394551", id: "route1time" },
            { src: "games/gnome/sounds/routestop.ogg?1473506394551", id: "routestop" },
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
        soundManager.loadSounds(this.soundsManifest);
    }
    MainSceneGnome.prototype.initDisplay = function () {
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
    MainSceneGnome.prototype.getAnimIconVOForId = function (id) {
        var animIconVO = new AnimIconVO();
        animIconVO.anim_speed = 2 / 60;
        switch (id) {
            case 1:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_1_", 2);
                animIconVO.loop = true;
                break;
            case 2:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_2_", 2);
                animIconVO.loop = true;
                break;
            case 3:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_3_", 2);
                animIconVO.loop = true;
                break;
            case 4:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_4_", 2);
                animIconVO.loop = true;
                break;
            case 5:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_5_", 2);
                animIconVO.loop = true;
                break;
            case 6:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_6_", 20);
                animIconVO.loop = false;
                animIconVO.anim_speed = 10 / 60;
                break;
            case 7:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_7_", 20);
                animIconVO.loop = false;
                animIconVO.anim_speed = 10 / 60;
                break;
            case 8:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_8_", 14);
                animIconVO.loop = false;
                animIconVO.anim_speed = 7 / 60;
                break;
            case 9:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_9_", 20);
                animIconVO.loop = false;
                animIconVO.anim_speed = 10 / 60;
                break;
        }
        return animIconVO;
    };
    MainSceneGnome.prototype.completeShowLines = function () {
    };
    MainSceneGnome.prototype.onCompleteRolls = function () {
        _super.prototype.onCompleteRolls.call(this);
    };
    MainSceneGnome.prototype.exchangeMode = function (value) {
        if (value == ModelSlot.MODE_READY) {
            this.updateBetLine(1);
        }
        else if (value == ModelSlot.MODE_ROUTE_WIN && this.modelSlot.lastAction.Action == ModelSlot.ID_WIN_ROUTE) {
            mainSlot.panel.panel.setTxtTotalWin("" + this.modelSlot.lastAction.Summ);
            mainSlot.panel.panel.setTxtInfo('WIN ' + this.modelSlot.lastAction.Summ);
        }
        else if (value == ModelSlot.MODE_DEBIT) {
            this.tmm.startMove([mainSlot.panel.panel.getTotalWin()]);
        }
    };
    MainSceneGnome.prototype.onCompleteMoveText = function () {
        console.log('close');
    };
    MainSceneGnome.prototype.updateBalance = function (value) {
        mainSlot.panel.panel.setTxtBalance("" + value);
    };
    MainSceneGnome.prototype.updateBetLine = function (type) {
        mainSlot.panel.panel.setTxtTotalBet("" + this.modelSlot.totalBet);
        mainSlot.panel.panel.setTxtTotalWin("0");
        mainSlot.panel.panel.setTxtBet("" + this.modelSlot.amountBet);
        this.index_bets = this.modelSlot.typeBet;
        this.index_lines = this.modelSlot.modeLine;
        this.updateShield();
    };
    MainSceneGnome.prototype.updateShield = function () {
        if (this.index_bets >= 2 && this.index_lines >= 5) {
            this.modelSlot.shield = true;
        }
        else {
            this.modelSlot.shield = false;
        }
    };
    MainSceneGnome.prototype.getNumBonus = function () {
        var countInd = this.getContIndex(9);
        if (countInd >= 3)
            return 9;
        else
            return 1;
    };
    return MainSceneGnome;
}(MainScene));
var HelpSceneGnome = (function (_super) {
    __extends(HelpSceneGnome, _super);
    function HelpSceneGnome() {
        _super.call(this, new PIXI.Sprite());
        var help_bg = new PIXI.Sprite(PIXI.loader.resources["help_bg"].texture);
        help_bg.x = 53;
        help_bg.y = 112;
        help_bg.cacheAsBitmap = true;
        this.mc.addChild(help_bg);
    }
    return HelpSceneGnome;
}(HelpScene));
var GambleSceneGnome = (function (_super) {
    __extends(GambleSceneGnome, _super);
    function GambleSceneGnome() {
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
            fontSize: '30px',
            fontFamily: 'heliosblackcregular',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            letterSpacing: 1
        };
        var dealer_card = new PIXI.Sprite();
        dealer_card.position.x = 170;
        dealer_card.position.y = 330;
        this.mc.addChild(dealer_card);
        this.mc["dealer_card"] = dealer_card;
        var dealer = new PIXI.Sprite(PIXI.loader.resources['games/gnome/images/gamble_card2.json'].textures["dealer_icon.png"]);
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
        this.pick_mc = new PIXI.Sprite(PIXI.loader.resources['games/gnome/images/gamble_card2.json'].textures["pick_icon.png"]);
        this.pick_mc.anchor.set(0.5, 0);
        this.pick_mc.position.y = 560;
        this.pick_mc.position.x = this.mc["card1"].x + 82;
        this.mc.addChild(this.pick_mc);
    }
    GambleSceneGnome.prototype.initDisplay = function () {
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
    GambleSceneGnome.prototype.exchangeMode = function (value) {
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
    GambleSceneGnome.prototype.showMsgDouble = function () {
        mainSlot.panel.panel.setTxtInfo("SELECT CARD OR START");
    };
    GambleSceneGnome.prototype.setSelectValue = function (type) {
        _super.prototype.setSelectValue.call(this, type);
        this.pick_mc.x = this.mc["card" + type].x + 82;
        this.pick_mc.visible = true;
    };
    GambleSceneGnome.prototype.resetGamble = function () {
        var _this = this;
        _super.prototype.resetGamble.call(this);
        mainSlot.panel.panel.setTxtTotalBet("" + this.modelSlot.totalBet);
        setTimeout(function () { _this.mc['step_txt'].text = 'RISK STEP : ' + _this.modelSlot.getStepGamble().toString(); });
        this.showMsgDouble();
    };
    GambleSceneGnome.prototype.updatePrize = function () {
        mainSlot.panel.panel.setTxtTotalWin("" + this.modelSlot.lastAction.Summ);
    };
    return GambleSceneGnome;
}(GambleScene));
var AnimBonus = (function (_super) {
    __extends(AnimBonus, _super);
    function AnimBonus() {
        _super.call(this);
        this.animName = ["Stand", "shield1", "lose1", "waslose1", "shieldlose1", "open1", "win1", "waswin1"];
        var styleLabelIndex = {
            align: 'center',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#D1CAA0',
            letterSpacing: 1
        };
        this.prize_txt = new PIXI.Text();
        this.prize_txt.text = 'PRIZE';
        this.prize_txt.style = styleLabelIndex;
        this.prize_txt.anchor.set(0.5, 0.5);
        this.addChild(this.prize_txt);
    }
    AnimBonus.getMcLib = function (nameMc) {
        if (AnimBonus.b == null) {
            AnimBonus.b = new lib.anim_bonus();
        }
        return Object.create(AnimBonus.b[nameMc]);
    };
    AnimBonus.prototype.createMc = function (nameMc) {
        return AnimBonus.getMcLib(nameMc);
    };
    AnimBonus.prototype.reset = function () {
        this.prize_txt.text = "";
        _super.prototype.reset.call(this);
    };
    AnimBonus.prototype.setMode = function (value, isHasShield, valuePrize) {
        var _this = this;
        if (valuePrize === void 0) { valuePrize = 0; }
        this.isHasShield = isHasShield;
        this.prize = valuePrize;
        var ar_anim;
        this.curMode = value;
        if (value == AnimBonus.MODE_WAIT) {
            ar_anim = this.generateAnim(1);
            ar_anim[0].anims.push(new AnimationItemVO({ an: "Stand" }));
            if (isHasShield)
                ar_anim[0].anims.push(new AnimationItemVO({ an: "shield1" }));
        }
        else if (value == AnimBonus.MODE_LOSE) {
            this.isPlayAnimation = true;
            ar_anim = this.generateAnim(3);
            ar_anim[0].anims.push(new AnimationItemVO({ an: "open1" }));
            if (isHasShield)
                ar_anim[0].anims.push(new AnimationItemVO({ an: "shield1" }));
            ar_anim[0].setCompletAnimation("open1", 1);
            ar_anim[1].anims.push(new AnimationItemVO({ an: this.getWithShield("&lose1"), startAnim: function (nameAnim, mcAnim) { _this.startAnim(nameAnim, mcAnim); } }));
            ar_anim[1].setCompletAnimation(this.getWithShield("&lose1"), 2);
            ar_anim[2].anims.push(new AnimationItemVO({ an: "waslose1", dispatchComplete: true, startAnim: function (nameAnim, mcAnim) { _this.startAnim(nameAnim, mcAnim); } }));
        }
        else if (value == AnimBonus.MODE_WIN) {
            this.isPlayAnimation = true;
            ar_anim = this.generateAnim(2);
            ar_anim[0].anims.push(new AnimationItemVO({ an: this.getWithShield("win1"), startAnim: function (nameAnim, mcAnim) { _this.startAnim(nameAnim, mcAnim); } }));
            if (isHasShield)
                ar_anim[0].anims.push(new AnimationItemVO({ an: "shield1" }));
            ar_anim[0].setCompletAnimation(this.getWithShield("win1"), 1);
            ar_anim[1].anims.push(new AnimationItemVO({ an: "waswin1", dispatchComplete: true, startAnim: function (nameAnim, mcAnim) { _this.startAnim(nameAnim, mcAnim); } }));
        }
        this.showAnim(ar_anim);
    };
    AnimBonus.prototype.startAnim = function (nameAnim, mcAnim) {
        if (nameAnim == "waswin1") {
            this.prize_txt.text = "" + this.prize;
        }
        if (nameAnim == this.getWithShield("win1")) {
            soundManager.playSound("b1_win");
        }
        if (nameAnim == this.getWithShield("&lose1")) {
            soundManager.playSound("b1_loss");
        }
    };
    AnimBonus.prototype.getWithShield = function (str) {
        if (this.isHasShield)
            return str.replace("&", "shield");
        else
            return str.replace("&", "");
    };
    AnimBonus.MODE_WAIT = "wait";
    AnimBonus.MODE_LOSE = "lose";
    AnimBonus.MODE_WIN = "win";
    return AnimBonus;
}(AnimEnity));
var AnimSuperbonus = (function (_super) {
    __extends(AnimSuperbonus, _super);
    function AnimSuperbonus(mc) {
        _super.call(this);
        this.animName = ["superlose1", "superwin1", "superopen1"];
    }
    AnimSuperbonus.getMcLib = function (nameMc) {
        if (AnimSuperbonus.b == null) {
            AnimSuperbonus.b = new lib.anim_sbonus();
        }
        return Object.create(AnimSuperbonus.b[nameMc]);
    };
    AnimSuperbonus.prototype.createMc = function (nameMc) {
        return AnimSuperbonus.getMcLib(nameMc);
    };
    AnimSuperbonus.prototype.reset = function () {
        this.prize_txt.text = "";
        this.prize_txt.y = 47;
        _super.prototype.reset.call(this);
    };
    AnimSuperbonus.prototype.setMode = function (value, valuePrize) {
        var _this = this;
        if (valuePrize === void 0) { valuePrize = 0; }
        this.curMode = value;
        this.prize = valuePrize;
        var ar_anim;
        if (value == AnimSuperbonus.MODE_LOSE) {
            this.isPlayAnimation = true;
            ar_anim = this.generateAnim(2);
            ar_anim[0].anims.push(new AnimationItemVO({ an: "superopen1" }));
            ar_anim[0].setCompletAnimation("superopen1", 1);
            ar_anim[1].anims.push(new AnimationItemVO({ an: "superlose1", completeStop: true, dispatchComplete: true }));
        }
        else if (value == AnimSuperbonus.MODE_WIN) {
            this.isPlayAnimation = true;
            ar_anim = this.generateAnim(2);
            ar_anim[0].anims.push(new AnimationItemVO({ an: "superopen1" }));
            ar_anim[0].setCompletAnimation("superopen1", 1);
            ar_anim[1].anims.push(new AnimationItemVO({ an: "superwin1", completeStop: true, dispatchComplete: true, completeAnim: function (nameAnim, mcAnim) { _this.completeAnim(nameAnim, mcAnim); } }));
        }
        this.showAnim(ar_anim);
    };
    AnimSuperbonus.prototype.completeAnim = function (nameAnim, mcAnim) {
        this.prize_txt.text = "" + this.prize;
        createjs.Tween.get(this.prize_txt, { override: true }).to({ y: -34 }, 500);
    };
    AnimSuperbonus.MODE_WAIT = "wait";
    AnimSuperbonus.MODE_LOSE = "lose";
    AnimSuperbonus.MODE_WIN = "win";
    return AnimSuperbonus;
}(AnimEnity));
var BonusSceneGnome = (function (_super) {
    __extends(BonusSceneGnome, _super);
    function BonusSceneGnome() {
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
    BonusSceneGnome.prototype.initDisplay = function () {
    };
    BonusSceneGnome.prototype.onCompleteAnimation = function () {
        this.setPositionGnome(this.selectID + 1);
        if (this.isLose || this.arBonuses.length == 0) {
            this.completeBonus(this.arTextPrizes);
        }
        else {
            this.nextAction();
        }
    };
    BonusSceneGnome.prototype.resetBonus = function (summ, isSb, completeCallback) {
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
    BonusSceneGnome.prototype.setPositionGnome = function (pos) {
        this.animBonus.x = this.anims[pos - 1].x;
        this.animBonus.y = this.anims[pos - 1].y;
        this.animBonus.visible = true;
        this.animBonus.setMode(AnimBonus.MODE_WAIT, this.isHasShield);
    };
    BonusSceneGnome.prototype.selectBonus = function (nom) {
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
    BonusSceneGnome.prototype.setBombForShield = function (isRand) {
        if (isRand === void 0) { isRand = true; }
        if ((!isRand || Math.random() < 0.4) && !this.isAddBombForShild && this.isHasShield) {
            this.arBonuses.push(0);
            this.isAddBombForShild = true;
        }
    };
    return BonusSceneGnome;
}(BonusScene));
var SuperbonusSceneGnome = (function (_super) {
    __extends(SuperbonusSceneGnome, _super);
    function SuperbonusSceneGnome() {
        var _this = this;
        _super.call(this, new lib.superbonus_scene());
        this.arBtn = [0, 4];
        this.anims = new Array();
        for (var i = 1; i <= 2; i++) {
            var b = new AnimSuperbonus(this.mc["sb" + i]);
            b.x = 63 + 260 * (i - 1);
            b.y = 172;
            this.anims.push(b);
            this.addChild(b);
            b.on(EVENT_COMPLETE, function () { _this.onCompleteAnimation(); });
        }
        this.addChild(this.anim = new AnimBonus());
        this.anim.x = 284;
        this.anim.y = 11;
    }
    SuperbonusSceneGnome.prototype.onCompleteAnimation = function () {
        if (!this.isWin)
            soundManager.playSound("sb_loss");
        this.completeBonus([this.prizeTxt]);
    };
    SuperbonusSceneGnome.prototype.resetBonus = function (summ, isSb, completeCallback) {
        _super.prototype.resetBonus.call(this, summ, isSb, completeCallback);
        this.mc["bet_txt"].text = "" + this.modelSlot.totalBet;
        this.mc["credit_txt"].text = "" + this.modelSlot.balance;
        this.mc["win_txt"].text = "" + this.modelSlot.currentWin;
        for (var i = 0; i < this.anims.length; i++) {
            this.anims[i].reset();
        }
        this.anim.setMode(AnimBonus.MODE_WAIT, mainSlot.slot.getIsShield());
    };
    SuperbonusSceneGnome.prototype.selectBonus = function (nom) {
        _super.prototype.selectBonus.call(this, nom);
        this.selectID = nom;
        var animPrize = this.anims[this.arBtn.indexOf(this.selectID)];
        animPrize.setMode(this.isWin ? AnimSuperbonus.MODE_WIN : AnimSuperbonus.MODE_LOSE, this.summ);
        this.prizeTxt = animPrize.prize_txt;
        this.anim.reset();
    };
    return SuperbonusSceneGnome;
}(SuperbonusScene));
var slotGnome = new SlotGnome();
mainSlot.setSlot(slotGnome);
//# sourceMappingURL=slot_gnome.js.map