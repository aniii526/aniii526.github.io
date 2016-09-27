var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SlotGnome = (function (_super) {
    __extends(SlotGnome, _super);
    function SlotGnome() {
        _super.call(this);
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    }
    SlotGnome.prototype.getPathViewJS = function () {
        return "gnome/gnome.js";
    };
    SlotGnome.prototype.getResourseImg = function (callback) {
        this.loader = PIXI.loader.add('fon_main_scene', 'gnome/images/fon_main_scene.png?1').add('gnome/images/line_mc.json');
        this.loader.once("complete", callback, this);
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
        rollVO.step_y = 97;
        rollVO.step_x = 112;
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
    return SlotGnome;
}(SlotEnity));
//-------------------------------------------------------------------------------------------
var MainSceneGnome = (function (_super) {
    __extends(MainSceneGnome, _super);
    function MainSceneGnome() {
        var _this = this;
        //TO DO надо разобраться с этими мувиками, где я их буду собирать, прямо тут или где то еще
        //super(new lib.main_scene());
        _super.call(this, new PIXI.Sprite(PIXI.loader.resources["fon_main_scene"].texture));
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
        this.addRoll(48, 33);
        this.x = 3;
        // перенес это внутрь LinesEnity файла slot_enity
        //let line_mc = new PIXI.extras.MovieClip(mainSlot.getTexturesForName('gnome/images/line_mc.json', "line_mc00", 30));
        this.addWinLine(0, 35, null);
        this.showWinLines([0, 1, 2, 3, 4, 5, 6, 7, 8], true, function () { _this.completeShowLines(); });
        //soundManager.loadSounds(this.soundsManifest);
    }
    MainSceneGnome.prototype.initDisplay = function () {
        console.log('initDisplay');
        /*let sp = new PIXI.Sprite(PIXI.loader.resources["fon_middle_btn0001.png"]);
        sp.x = 800 - sp.width;
        sp.y = 600 - sp.height;
        this.mc.addChild(sp);*/
        /*this.addChild(this.mc["anim_main"]);*/
        this.infoPanel = new PanelInfoMain(this.mc["mInfo"]);
        /*mainSlot.bindSetter(this.modelSlot, "balance", (value: number) => { this.updateBalance(value) });
        mainSlot.bindSetter(this.modelSlot, "typeBet", (value: number) => { this.updateBetLine(value) });
        mainSlot.bindSetter(this.modelSlot, "modeLine", (value: number) => { this.updateBetLine(value) });
        mainSlot.bindSetter(mainSlot.slot, "modeLine", (value: boolean) => { this.updateShield(value) });
        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", (value: string) => { this.exchangeMode(value) });*/
    };
    MainSceneGnome.prototype.completeShowLines = function () {
    };
    MainSceneGnome.prototype.exchangeMode = function (value) {
        if (value == ModelSlot.MODE_READY) {
            this.mc["info_stat_txt"].text = "LINES";
            this.updateBetLine(1);
            this.infoPanel.setMode(PanelInfoMain.MODE_ANIM);
        }
        else if (value == ModelSlot.MODE_ROUTE_WIN && this.modelSlot.lastAction.Action == ModelSlot.ID_WIN_ROUTE) {
            this.infoPanel.setMode(PanelInfoMain.MODE_WIN, "" + this.modelSlot.lastAction.Summ);
            this.mc["info_stat_txt"].text = "WIN";
            this.mc["line_txt"].text = this.modelSlot.lastAction.Summ;
        }
        else if (value == ModelSlot.MODE_DEBIT) {
            this.infoPanel.setMode(PanelInfoMain.MODE_TAKE);
        }
    };
    MainSceneGnome.prototype.updateBalance = function (value) {
        this.mc["credit_txt"].text = value;
    };
    MainSceneGnome.prototype.updateBetLine = function (type) {
        this.mc["bet_txt"].text = "" + this.modelSlot.totalBet;
        this.mc["line_txt"].text = "" + this.modelSlot.modeLine;
        this.mc["bet1_txt"].text = this.modelSlot.amountBet;
        this.mc["bet2_txt"].text = this.modelSlot.amountBet;
    };
    MainSceneGnome.prototype.updateShield = function (value) {
        this.mc["shield_mc"].visible = value;
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
//-------------------------------------------------------------------------------------------
var HelpSceneGnome = (function (_super) {
    __extends(HelpSceneGnome, _super);
    function HelpSceneGnome() {
        _super.call(this, new lib.help_scene());
    }
    return HelpSceneGnome;
}(HelpScene));
//-------------------------------------------------------------------------------------------
var GambleSceneGnome = (function (_super) {
    __extends(GambleSceneGnome, _super);
    function GambleSceneGnome() {
        _super.call(this, new lib.gamble_scene());
        //чтобы "1" Максова не торчала.
        this.mc["step_txt"].visible = false;
        this.createCards(CardDefault);
        this.addChild(this.pick_mc = this.mc["pick_mc"]);
    }
    GambleSceneGnome.prototype.initDisplay = function () {
        var _this = this;
        this.infoPanel = new PanelInfoGamble(this.mc["info_table"]);
        //this.mc["step_txt"].visible = false;
        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", function (value) { _this.exchangeMode(value); });
        this.showMsgDouble();
    };
    GambleSceneGnome.prototype.exchangeMode = function (value) {
        if (value == ModelSlot.MODE_GAMBLE_LOSE) {
            // anim.setMode(AnimMain.MODE_LOSE);
            this.infoPanel.setMode(PanelInfoGamble.MODE_MSG, "YOU LOSE");
        }
        else if (value == ModelSlot.MODE_GAMBLE_WIN) {
            //anim.setMode(AnimMain.MODE_WIN);
            this.showMsgDouble();
        }
        else if (value == ModelSlot.MODE_DEBIT) {
            this.infoPanel.setMode(PanelInfoGamble.MODE_MSG, "TAKE...");
        }
    };
    GambleSceneGnome.prototype.showMsgDouble = function () {
        if (this.infoPanel != null)
            this.infoPanel.setMode(PanelInfoGamble.MODE_DOUBLE, "" + this.modelSlot.lastAction.Summ * 2);
    };
    GambleSceneGnome.prototype.setSelectValue = function (type) {
        _super.prototype.setSelectValue.call(this, type);
        this.pick_mc.x = this.mc["card" + type].x + 45;
        this.pick_mc.visible = true;
    };
    GambleSceneGnome.prototype.resetGamble = function () {
        var _this = this;
        _super.prototype.resetGamble.call(this);
        this.mc["bet_txt"].text = "" + this.modelSlot.totalBet;
        setTimeout(function () { _this.mc["step_mc"].gotoAndStop("_" + _this.modelSlot.getStepGamble(), 1); });
        this.showMsgDouble();
    };
    GambleSceneGnome.prototype.updatePrize = function () {
        this.mc["prize_txt"].text = "" + this.modelSlot.summInput;
        this.mc["win_txt"].text = "" + this.modelSlot.lastAction.Summ;
    };
    return GambleSceneGnome;
}(GambleScene));
//-------------------------------------------------------------------------------------------
var AnimBonus = (function (_super) {
    __extends(AnimBonus, _super);
    function AnimBonus() {
        _super.call(this);
        this.animName = ["Stand", "shield1", "lose1", "waslose1", "shieldlose1", "open1", "win1", "waswin1"];
        //TODO разобраться с текстом
        /*
        this.prize_txt = new PIXI.Text("100", "28px 'BIP'", "#CCFF00");
        this.prize_txt.name = "prize_txt";
        this.prize_txt.textAlign = "center";
        this.prize_txt.lineHeight = 41;
        this.prize_txt.lineWidth = 96;
        this.prize_txt.parent = this;
        this.prize_txt.setTransform(55, 60);
        this.addChild(this.prize_txt);
        */
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
            ar_anim[1].anims.push(new AnimationItemVO({ an: this.getWithShield("&lose1"), startAnim: this.startAnim }));
            ar_anim[1].setCompletAnimation(this.getWithShield("&lose1"), 2);
            ar_anim[2].anims.push(new AnimationItemVO({ an: "waslose1" }));
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
        //TODO разобраться с текстом
        /*
        this.prize_txt = new PIXI.Text("111", "bold 30px 'NewBaskervilleC'", "#E6FF81");
        this.prize_txt.name = "prize_txt";
        this.prize_txt.textAlign = "center";
        this.prize_txt.lineHeight = 35;
        this.prize_txt.lineWidth = 100;
        this.prize_txt.parent = this;
        this.prize_txt.setTransform(165.3, 49.3);
        this.addChild(this.prize_txt);*/
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
        _super.call(this, new lib.bonus_scene());
        this.anims = new Array();
        this.X_ANIM = 30;
        this.animBonus = new AnimBonus();
        this.mc.addChild(this.animBonus);
        setTimeout(function () {
            _this.animBonus.x = _this.X_ANIM;
            for (var i = 1; i <= 5; i++) {
                var an = new AnimBonus();
                _this.anims.push(an);
                //an.addEventListener(EVENT_COMPLETE, () => { this.onCompleteAnimation() });
                an.on(EVENT_COMPLETE, function () { _this.onCompleteAnimation(); });
                _this.mc.addChild(an);
                an.x = (i - 1) * 129;
            }
        }, 1);
    }
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
        this.mc["bet_txt"].text = "" + this.modelSlot.totalBet;
        this.mc["credit_txt"].text = "" + this.modelSlot.balance;
        this.mc["win_txt"].text = "0";
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
//-------------------------------------------------------------------------------------------
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
            //b.addEventListener(EVENT_COMPLETE, () => { this.onCompleteAnimation() });
            b.on(EVENT_COMPLETE, function () { _this.onCompleteAnimation(); });
        }
        this.addChild(this.anim = new AnimBonus());
        this.anim.x = 284; //this.mc["an_main"].x;
        this.anim.y = 11; //this.mc["an_main"].y;
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
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//TO DO
var slotGnome = new SlotGnome();
mainSlot.setSlot(slotGnome);
//loadJSManifest("gnome/gnome.js", () => { mainSlot.initSlot(slotGnome) });*/ 
//# sourceMappingURL=slot_gnome.js.map