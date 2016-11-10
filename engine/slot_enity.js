var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SlotEnity = (function (_super) {
    __extends(SlotEnity, _super);
    function SlotEnity() {
        _super.call(this);
    }
    SlotEnity.prototype.showScene = function (scene) {
        if (this.currentScene != null)
            this.removeChild(this.currentScene);
        this.addChild(scene);
        this.currentScene = scene;
    };
    SlotEnity.prototype.removeScene = function (scene) {
        if (this.currentScene != null)
            this.removeChild(this.currentScene);
        this.showScene(this.mainScene);
    };
    SlotEnity.prototype.getIsShield = function () {
        return false;
    };
    SlotEnity.prototype.showHelp = function () {
        this.addChild(this.getHelpScene());
    };
    SlotEnity.prototype.hideHelp = function () {
        this.removeChild(this.getHelpScene());
    };
    SlotEnity.prototype.getHelpScene = function () {
        return null;
    };
    return SlotEnity;
}(PIXI.Sprite));
var SceneSlot = (function (_super) {
    __extends(SceneSlot, _super);
    function SceneSlot(mc) {
        var _this = this;
        _super.call(this);
        this.mc = mc;
        this.addChild(mc);
        this.modelSlot = mainSlot.model;
        createjs.Tween.get(this).wait(1).call(function () { _this.initDisplay(); });
    }
    SceneSlot.prototype.initDisplay = function () {
    };
    return SceneSlot;
}(PIXI.Sprite));
var BScene = (function (_super) {
    __extends(BScene, _super);
    function BScene(mc) {
        _super.call(this, mc);
        this.isBlockSelectedBtn = true;
    }
    BScene.prototype.initTM = function () {
        var _this = this;
        this.tmm = new TextMoneyMove(this.mc["win_txt"]);
        this.tmm.addEventListener(EVENT_COMPLETE, function () { _this.onCompleteMoveText(); });
    };
    BScene.prototype.getWinTxt = function () {
        return this.mc["win_txt"];
    };
    BScene.prototype.bindProperties = function () {
    };
    BScene.prototype.onCompleteMoveText = function () {
        var _this = this;
        createjs.Tween.get(this).wait(this.timeoutComplete).call(function () { _this.completeCallback(); });
    };
    BScene.prototype.resetBonus = function (summ, isSb, completeCallback) {
        this.summ = summ;
        this.isWin = isSb;
        this.completeCallback = completeCallback;
        this.arSelected = new Array();
    };
    BScene.prototype.selectBonus = function (nom) {
        this.arSelected.push(nom);
        mainSlot.panel.blockComboBtns();
    };
    BScene.prototype.nextAction = function () {
        this.reBlockBtn();
    };
    BScene.prototype.completeBonus = function (arText, time) {
        var _this = this;
        if (time === void 0) { time = 1000; }
        this.timeoutComplete = time;
        if (arText)
            createjs.Tween.get(this).wait(300).call(function () {
                _this.tmm.startMove(arText);
            });
        else
            createjs.Tween.get(this).wait(this.timeoutComplete).call(function () { _this.completeCallback(); });
    };
    BScene.prototype.reBlockBtn = function () {
        if (this.isBlockSelectedBtn)
            mainSlot.panel.reBlock(this.arSelected);
        else
            mainSlot.panel.reBlock();
    };
    return BScene;
}(SceneSlot));
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene(mc) {
        _super.call(this, mc);
    }
    MainScene.prototype.addRoll = function (px, py) {
        var _this = this;
        this.mc.addChild(this.rolls = new Rolls(this.modelSlot.settingRoll));
        this.rolls.on(Rolls.COMPLETE_ROLLS, function () { _this.onCompleteRolls(); });
        this.rolls.x = px;
        this.rolls.y = py;
    };
    MainScene.prototype.onCompleteRolls = function () {
        if (this.callbackCompleteRoll != null)
            this.callbackCompleteRoll();
    };
    MainScene.prototype.addWinLine = function (px, py, LineClass) {
        var _this = this;
        this.fon = new PIXI.Graphics();
        this.fon.beginFill(0x000000, 0.5);
        this.fon.drawRect(0, 0, 1095, 625);
        this.fon.endFill();
        this.fon.x = 53;
        this.fon.y = 112;
        this.fon.visible = false;
        this.addChild(this.fon);
        this.lines = new LinesWin(LineClass);
        this.addChild(this.lines);
        this.lines.on(LinesWin.END_BLINK, function () { _this.onCompleteShowLine(); });
        this.lines.x = px;
        this.lines.y = py;
        this.animlayers = new AnimWin();
        this.animlayers.x = 53;
        this.animlayers.y = 112;
        this.addChild(this.animlayers);
    };
    MainScene.prototype.onCompleteShowLine = function () {
        if (this.callbackCompleteLines != null)
            this.callbackCompleteLines();
    };
    MainScene.prototype.showRollCombination = function (comb, callbackCompleteRoll) {
        this.callbackCompleteRoll = callbackCompleteRoll;
        this.rolls.setCombs(comb);
    };
    MainScene.prototype.showWinLines = function (ar, isAnimate, callbackCompleteLines) {
        if (isAnimate === void 0) { isAnimate = true; }
        if (callbackCompleteLines === void 0) { callbackCompleteLines = null; }
        this.callbackCompleteLines = callbackCompleteLines;
        if (ar != null && ar.length) {
            this.lines.showLines(ar, isAnimate);
            if (this.callbackCompleteLines) {
                this.fon.visible = true;
                this.animlayers.show();
            }
        }
        else {
            this.fon.visible = false;
            this.lines.clear();
            this.animlayers.clear();
        }
    };
    MainScene.prototype.showWinBonus = function () {
        this.rolls.showWinBonus(this.getNumBonus());
    };
    MainScene.prototype.getNumBonus = function () {
        if (this.getContIndex(1) >= 3)
            return 1;
        else
            return 2;
    };
    MainScene.prototype.getContIndex = function (ind) {
        if (this.modelSlot.lastAction)
            return this.modelSlot.lastAction.getCountIndex(ind);
        else
            return 0;
    };
    MainScene.prototype.showWin = function (value) {
    };
    return MainScene;
}(SceneSlot));
var HelpScene = (function (_super) {
    __extends(HelpScene, _super);
    function HelpScene(mc) {
        _super.call(this, mc);
    }
    HelpScene.prototype.bindProperties = function () {
    };
    HelpScene.prototype.selectBtn = function (nom) {
        if (nom == 0) {
            if (this.mc["anim"].currentFrame == 0) {
                this.mc["anim"].gotoAndStop(this.mc["anim"].totalFrames - 1);
            }
            else {
                this.mc["anim"].gotoAndStop(this.mc["anim"].currentFrame - 1);
            }
        }
        else {
            if (this.mc["anim"].currentFrame == this.mc["anim"].totalFrames - 1)
                this.mc["anim"].gotoAndStop(0);
            else
                this.mc["anim"].gotoAndStop(this.mc["anim"].currentFrame + 1);
        }
    };
    HelpScene.prototype.showhelp = function () {
        this.addChild(this.mc);
    };
    HelpScene.prototype.hideHelp = function () {
        this.removeChild(this.mc);
    };
    return HelpScene;
}(SceneSlot));
var GambleScene = (function (_super) {
    __extends(GambleScene, _super);
    function GambleScene() {
        _super.apply(this, arguments);
        this.cards = new Array();
    }
    GambleScene.prototype.createCards = function (cardClass) {
        this.mc.addChild(this.dealer = new cardClass());
        this.mc.swapChildren(this.dealer, this.mc["dealer"]);
        this.dealer.x = this.mc["dealer_card"].x;
        this.dealer.y = this.mc["dealer_card"].y;
        for (var i = 1; i <= 4; i++) {
            var c = new cardClass();
            c.indexCard = i;
            this.mc.addChild(c);
            c.x = this.mc["card" + i].x;
            c.y = this.mc["card" + i].y;
            this.cards.push(c);
        }
    };
    GambleScene.prototype.clear = function () {
        for (var i = 0; i < 4; i++) {
            this.cards[i].setCard("B");
        }
        this.pick_mc.visible = false;
    };
    GambleScene.prototype.showAllCard = function () {
        var ar = this.resultcards.split("&");
        for (var i = 0; i < this.cards.length; i++) {
            var c = ar[i + 1].split("_");
            this.cards[i].setCard(c[1], c[0]);
        }
    };
    GambleScene.prototype.generateCardDealer = function () {
        var _this = this;
        this.dealer.setCard("B");
        var cmd = new GambleStartGame();
        cmd.addEventListener(ServerResponseEvent.RESPONSE, function (e) { _this.onResponseStart(e); });
        cmd.execute();
    };
    GambleScene.prototype.onResponseStart = function (e) {
        soundManager.playSound(SoundManager.SOUND_CARD_OPEN);
        this.dealer.setCardOnStr(e.data.CombinationAux);
    };
    GambleScene.prototype.setLastGamble = function (value) {
        var ar = value.split("&");
        var c = ar[0].split("_");
        var c2 = ar[ar.length - 1].split("_");
        this.setSelectValue(parseInt(c2[1].charAt(c2[1].length - 2)));
        this.dealer.setCard(c[1], c[0]);
        ar[ar.length - 1] = c2[0] + '_' + c2[1].charAt(0);
        this.resultGamble(ar.join("&"));
    };
    GambleScene.prototype.resetGamble = function () {
        this.clear();
        if (this.modelSlot.lastAction.Action == ModelSlot.ID_GAMBLE_START)
            this.dealer.setCardOnStr(this.modelSlot.lastAction.CombinationAux);
        else
            this.generateCardDealer();
        this.updatePrize();
    };
    GambleScene.prototype.getSelectValue = function () {
        return "" + this.selectNom;
    };
    GambleScene.prototype.resultGamble = function (result) {
        var _this = this;
        this.resultcards = result;
        var ar = result.split("&");
        var c = ar[this.selectNom].split("_");
        this.cards[this.selectNom - 1].setCard(c[1], c[0]);
        soundManager.playSound(SoundManager.SOUND_CARD_OPEN);
        createjs.Tween.get(this).wait(1000).call(function () { _this.showAllCard(); });
        this.updatePrize();
    };
    GambleScene.prototype.setSelectValue = function (type) {
        this.selectNom = type;
    };
    GambleScene.prototype.updatePrize = function () {
    };
    GambleScene.prototype.useCompleteCallback = function (completeCallback) {
        return false;
    };
    return GambleScene;
}(SceneSlot));
var BonusScene = (function (_super) {
    __extends(BonusScene, _super);
    function BonusScene() {
        _super.apply(this, arguments);
        this.isHasShield = false;
        this.isLose = false;
        this.currentPrize = -1;
    }
    BonusScene.prototype.resetBonus = function (summ, isSb, completeCallback) {
        _super.prototype.resetBonus.call(this, summ, isSb, completeCallback);
        this.isLose = false;
        this.arBonuses = new Array();
        this.isAddBombForShild = false;
        this.isHasShield = mainSlot.slot.getIsShield();
    };
    BonusScene.prototype.getPrizes = function (s, count) {
        var mn = 1;
        if (s <= 5)
            mn = 100;
        else if (s < 10)
            mn = 10;
        var ar = new Array();
        var lost = s * mn;
        for (var i = 0; i < count - 1; i++) {
            var p = (0.2 + Math.random() * 0.7) * lost * 0.6;
            var r_p = Math.floor(p * this.getMn(p)) / (mn * this.getMn(p));
            ar.push(r_p);
            lost = lost - r_p * mn;
        }
        if (lost || ar.length < count) {
            if (s.toString().split(".").length == 2 && mn < 100) {
                lost *= 100 / mn;
                mn = 100;
            }
            ar.push(Math.round(lost) / (mn));
        }
        return ar;
    };
    BonusScene.prototype.getMn = function (v) {
        if (v < 1)
            return 100;
        return 1;
    };
    return BonusScene;
}(BScene));
var SuperbonusScene = (function (_super) {
    __extends(SuperbonusScene, _super);
    function SuperbonusScene() {
        _super.apply(this, arguments);
    }
    return SuperbonusScene;
}(BScene));
var TextMoneyMove = (function (_super) {
    __extends(TextMoneyMove, _super);
    function TextMoneyMove(tf) {
        _super.call(this);
        this.targetTF = tf;
    }
    TextMoneyMove.prototype.startMove = function (ar) {
        this.arTF = ar;
        soundManager.playSound(SoundManager.SOUND_MONEY_MOVE, true, 100);
        this.nextMove();
    };
    TextMoneyMove.prototype.nextMove = function () {
        var _this = this;
        if (this.intervalID != null)
            clearInterval(this.intervalID);
        if (this.sourceTF)
            this.sourceTF.visible = false;
        if (this.arTF.length > 0) {
            this.sourceTF = this.arTF.shift();
            this.moneyOnStep = this.sourceValue / 30;
            if (this.moneyOnStep < 3)
                this.moneyOnStep = this.sourceValue / 10;
            if (this.moneyOnStep < 1)
                this.moneyOnStep = 1;
            this.resultSum = parseFloat(this.targetTF.text) + this.sourceValue;
            this.intervalID = setInterval(function () { _this.stepMove(); }, 100);
        }
        else {
            soundManager.stopSound(SoundManager.SOUND_MONEY_MOVE);
            this.dispatchEvent(EVENT_COMPLETE);
        }
    };
    TextMoneyMove.prototype.stepMove = function () {
        var sourceMoney = this.sourceValue;
        var targetMoney = parseInt(this.targetTF.text);
        if (isNaN(sourceMoney))
            sourceMoney = 0;
        if (sourceMoney == 0) {
            this.targetTF.text = "" + Math.round(this.resultSum * 100) / 100;
            this.nextMove();
        }
        else {
            this.targetTF.text = "" + Math.round((targetMoney + this.moneyOnStep) * 100) / 100;
            sourceMoney -= this.moneyOnStep;
            if (sourceMoney < 0)
                sourceMoney = 0;
            this.sourceTF.text = "" + Math.round(sourceMoney * 100) / 100;
        }
    };
    Object.defineProperty(TextMoneyMove.prototype, "sourceValue", {
        get: function () {
            var sourceMoney = parseFloat(this.sourceTF.text);
            if (isNaN(sourceMoney))
                sourceMoney = 0;
            return sourceMoney;
        },
        enumerable: true,
        configurable: true
    });
    return TextMoneyMove;
}(createjs.EventDispatcher));
var Card = (function (_super) {
    __extends(Card, _super);
    function Card() {
        _super.apply(this, arguments);
    }
    Card.prototype.Card = function (suit, value) {
        if (suit === void 0) { suit = null; }
        if (value === void 0) { value = null; }
        this.suits = this.getSiutsFormat();
        this.setCard(suit, value);
    };
    Card.prototype.getSiutsFormat = function () {
        return ["S", "C", "D", "H"];
    };
    Card.prototype.setCard = function (suit, value) {
        var _this = this;
        if (value === void 0) { value = null; }
        this.suit = suit;
        this.value = value;
        if (this.mc && this.mc.parent) {
            this.mc.off("mousedown", function (e) { _this.onUpBtn(e); });
            this.mc.off("touchstart", function (e) { _this.onUpBtn(e); });
            this.removeChild(this.mc);
        }
        this.mc = this.getCard(this.suit);
        this.mc.interactive = true;
        this.mc.on("mousedown", function (e) { _this.onUpBtn(e); });
        this.mc.on("touchstart", function (e) { _this.onUpBtn(e); });
        if (this.value) {
            var index = parseInt(this.value) - 2;
            this.mc["num"].gotoAndStop(index);
        }
        this.addChild(this.mc);
    };
    Card.prototype.onUpBtn = function (e) {
        mainSlot.panel.outClickBtn(new PanelEvent(PanelEvent.SELECT_LINE, e.target.parent.indexCard));
    };
    Card.prototype.setCardOnStr = function (suitValue) {
        var ar = suitValue.split("_");
        this.setCard(ar[1], ar[0]);
    };
    Card.prototype.getCard = function (suit) {
        return new PIXI.Sprite();
    };
    Card.prototype.getRandomCard = function (startValue) {
        if (startValue === void 0) { startValue = 0; }
        var suit = this.suits[Math.round(Math.random() * 3)];
        var value = 1 + startValue + Math.round(Math.random() * (13 - startValue));
        return "" + value + "_" + suit;
    };
    Card.prototype.getSuitValue = function () {
        return "" + this.value + "_" + this.suit;
    };
    return Card;
}(PIXI.Sprite));
var CardDefault = (function (_super) {
    __extends(CardDefault, _super);
    function CardDefault() {
        _super.apply(this, arguments);
    }
    CardDefault.prototype.getCard = function (suit) {
        switch (suit) {
            case "S":
                var card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                var suit_1 = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["piki_icon_big.png"]);
                suit_1.position.x = 45;
                suit_1.position.y = 111;
                card.addChild(suit_1);
                card["suit"] = suit_1;
                var num = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "clubs_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;
                return card;
            case "C":
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                suit_1 = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["tref_icon_big.png"]);
                suit_1.position.x = 45;
                suit_1.position.y = 111;
                card.addChild(suit_1);
                card["suit"] = suit_1;
                num = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "clubs_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;
                return card;
            case "D":
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                suit_1 = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["bybi_icon_big.png"]);
                suit_1.position.x = 45;
                suit_1.position.y = 111;
                card.addChild(suit_1);
                card["suit"] = suit_1;
                num = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "diamonds_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;
                return card;
            case "H":
            case "(":
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                suit_1 = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["chervi_icon_big.png"]);
                suit_1.position.x = 45;
                suit_1.position.y = 111;
                card.addChild(suit_1);
                card["suit"] = suit_1;
                num = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "diamonds_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;
                return card;
            default:
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_back.png"]);
                return card;
        }
    };
    return CardDefault;
}(Card));
var Rolls = (function (_super) {
    __extends(Rolls, _super);
    function Rolls(rollVO) {
        var _this = this;
        _super.call(this);
        this.arRoll = new Array();
        this.rollVO = rollVO;
        for (var i = 0; i < rollVO.count_roll; i++) {
            var r = new Roll(i, rollVO);
            r.on(Roll.COMPLETE_ROLL, function () { _this.onComplete(); });
            r.x = rollVO.step_x * i;
            this.arRoll.push(r);
            this.addChild(r);
        }
    }
    Rolls.prototype.setCombs = function (comb) {
        if (this.arRoll[0].isHasCombination) {
            soundManager.playSound(SoundManager.SOUND_ROUTESTART, false, 3);
        }
        this.counter = 0;
        for (var i = 0; i < comb.length; i++) {
            this.arRoll[i].setComb(comb[i]);
        }
    };
    Rolls.prototype.showWinBonus = function (idItem) {
        for (var i = 0; i < this.arRoll.length; i++) {
            this.arRoll[i].showWinBonus(idItem);
        }
    };
    Rolls.prototype.onComplete = function () {
        soundManager.stopSound(SoundManager.SOUND_ROUTESTART);
        this.counter++;
        if (this.counter == this.rollVO.count_roll) {
            this.emit(Rolls.COMPLETE_ROLLS);
        }
    };
    Rolls.COMPLETE_ROLLS = "complete_rolls";
    return Rolls;
}(PIXI.Sprite));
var Roll = (function (_super) {
    __extends(Roll, _super);
    function Roll(nomRoll, rollVO) {
        _super.call(this);
        this.container = new PIXI.Sprite();
        this.cacheIcons = new Object();
        this.nomRoll = nomRoll;
        this.rollVO = rollVO;
        var shape = new PIXI.Graphics();
        shape.beginFill(0xff0000);
        shape.drawRect(0, 0, rollVO.step_x, rollVO.height_mask ? rollVO.height_mask : rollVO.step_y * rollVO.count_row);
        shape.endFill();
        this.addChild(shape);
        this.addChild(this.container);
        this.container.mask = shape;
    }
    Object.defineProperty(Roll.prototype, "isHasCombination", {
        get: function () {
            return this.currentComb != null;
        },
        enumerable: true,
        configurable: true
    });
    Roll.prototype.setComb = function (comb) {
        if (this.currentComb != null) {
            this.targetComb = comb;
            this.createLine(Roll.ICON_ROUTE + this.nomRoll * this.rollVO.diffIconRoute);
            this.currentComb = comb;
        }
        else {
            this.setContentIcons(comb);
            this.currentComb = comb;
            this.completeRoll();
        }
    };
    Roll.prototype.showWinBonus = function (idItem) {
        for (var i = 0; i < this.container.children.length; i++) {
            var ic = this.container.getChildAt(i);
            if (ic.nom == idItem)
                ic.showAnimationWin();
        }
    };
    Roll.prototype.clear = function () {
        while (this.container.children.length > 0) {
            var ic = this.container.getChildAt(0);
            if (!this.cacheIcons[ic.nom])
                this.cacheIcons[ic.nom] = new Array();
            this.cacheIcons[ic.nom].push(ic);
            this.container.removeChildAt(0);
        }
        this.container.y = 0;
    };
    Roll.prototype.getIcon = function (ind) {
        var ic;
        if (this.cacheIcons[ind] && this.cacheIcons[ind].length) {
            ic = this.cacheIcons[ind].pop();
        }
        else {
            ic = new IconRoll(ind);
        }
        ic.restart();
        return ic;
    };
    Roll.prototype.createLine = function (count) {
        var _this = this;
        var ar = this.targetComb.concat();
        for (var i = 0; i < count; i++) {
            ar.push(this.rollVO.getRandomIndex());
        }
        ar = ar.concat(this.currentComb);
        this.setContentIcons(ar);
        this.container.y = -this.rollVO.step_y * (ar.length - this.rollVO.count_row);
        var t = count / Roll.TIME_ON_ICON;
        createjs.Tween.get(this.container, { override: true }).to({ y: 0 }, t * 1000)
            .call(function () { _this.completeRoll(); });
        createjs.Tween.get(this).wait((t - 0.15) * 1000).call(function () { _this.playSound(); });
    };
    Roll.prototype.playSound = function () {
        soundManager.playSound(SoundManager.SOUND_ROUTESTOP, false);
    };
    Roll.prototype.completeRoll = function () {
        for (var i = 0; i < this.rollVO.count_row; i++) {
            this.container.getChildAt(i).showNormalIcon();
        }
        this.emit(Roll.COMPLETE_ROLL);
    };
    Roll.prototype.setContentIcons = function (ar) {
        this.clear();
        for (var i = 0; i < ar.length; i++) {
            var ic = this.getIcon(ar[i]);
            this.container.addChild(ic);
            ic.y = i * this.rollVO.step_y;
        }
    };
    Roll.COMPLETE_ROLL = "complete_roll";
    Roll.ICON_ROUTE = 20;
    Roll.TIME_ON_ICON = 15;
    return Roll;
}(PIXI.Sprite));
var IconRoll = (function (_super) {
    __extends(IconRoll, _super);
    function IconRoll(nom) {
        _super.call(this);
        this.isAnimate = false;
        this.isBlur = false;
        this.nom = nom;
        this.ic = this.getIcon(nom);
        this.ic_blur = this.getIconBlur(nom);
        this.addChild(this.ic);
    }
    IconRoll.prototype.restart = function () {
        if (this.animMc && this.isAnimate)
            this.removeChild(this.animMc);
        this.isAnimate = false;
        this.isBlur = true;
        this.addChild(this.ic_blur);
        this.removeChild(this.ic);
    };
    IconRoll.prototype.getIcon = function (nom) {
        return new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_MAIN_SCENE].textures["icon_" + nom + ".png"]);
    };
    IconRoll.prototype.getIconBlur = function (nom) {
        return new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_MAIN_SCENE].textures["icon_blur_" + nom + ".png"]);
    };
    IconRoll.prototype.showAnimationWin = function () {
        while (this.children.length) {
            this.removeChildAt(0);
        }
        if (!this.animMc) {
            this.animMc = this.getAnimMc();
            this.animMc.loop = true;
            this.animMc.animationSpeed = 0.1;
        }
        this.animMc.gotoAndPlay(0);
        this.isAnimate = true;
        this.addChild(this.animMc);
    };
    IconRoll.prototype.showNormalIcon = function () {
        if (this.isBlur == true)
            this.removeChild(this.ic_blur);
        this.addChild(this.ic);
    };
    IconRoll.prototype.getAnimMc = function () {
        return new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_MAIN_SCENE, "icon_seif_open_", 4));
    };
    return IconRoll;
}(PIXI.Sprite));
var AnimWin = (function (_super) {
    __extends(AnimWin, _super);
    function AnimWin() {
        _super.call(this);
        this.init();
    }
    AnimWin.prototype.init = function () {
        this.viewTablePart = new Array();
        var animWinEnity;
        var baseTexture = PIXI.loader.resources["mainback"].texture.baseTexture;
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 5; i++) {
                animWinEnity = new AnimWinEnity();
                animWinEnity.position.x = 20 + (i * (195 + 20));
                animWinEnity.position.y = 20 + (j * 195);
                this.viewTablePart.push(animWinEnity);
                this.addChild(animWinEnity);
                animWinEnity.init();
            }
        }
    };
    AnimWin.prototype.show = function () {
    };
    AnimWin.prototype.clear = function () {
    };
    return AnimWin;
}(PIXI.Sprite));
var AnimWinEnity = (function (_super) {
    __extends(AnimWinEnity, _super);
    function AnimWinEnity() {
        _super.call(this);
        this.temp_id = 0;
        this.visible = false;
        this.aktiv = false;
    }
    AnimWinEnity.prototype.init = function () {
    };
    AnimWinEnity.prototype.show = function () {
        if (this.aktiv)
            return;
        var id = 5;
        if (!this['anim_' + id]) {
            var animIconVO = mainSlot.slot.getMainScene().getAnimIconVOForId(id);
            this['anim_' + id] = new PIXI.extras.MovieClip(animIconVO.textures);
            this['anim_' + id].animationSpeed = animIconVO.anim_speed;
            this['anim_' + id].loop = true;
        }
        this['anim_' + id].play();
        this.addChild(this['anim_' + id]);
        this.temp_id = id;
        this.visible = true;
        this.aktiv = true;
    };
    AnimWinEnity.prototype.clear = function () {
        if (this.temp_id != 0)
            this['anim_' + this.temp_id].gotoAndStop(0);
        while (this.children.length) {
            this.removeChildAt(0);
        }
        this.visible = false;
        this.aktiv = false;
    };
    return AnimWinEnity;
}(PIXI.Sprite));
var ConstantsRollIcon = (function () {
    function ConstantsRollIcon() {
    }
    ConstantsRollIcon.ID_10 = 5;
    ConstantsRollIcon.ID_J = 3;
    ConstantsRollIcon.ID_Q = 7;
    ConstantsRollIcon.ID_K = 8;
    ConstantsRollIcon.ID_A = 2;
    ConstantsRollIcon.ID_ICON_1 = 4;
    ConstantsRollIcon.ID_ICON_2 = 9;
    ConstantsRollIcon.ID_ICON_3 = 6;
    ConstantsRollIcon.ID_ICON_4 = 1;
    return ConstantsRollIcon;
}());
var LinesWin = (function (_super) {
    __extends(LinesWin, _super);
    function LinesWin(LineClass) {
        _super.call(this);
        this.lines = new Array(9);
        this.step = 0;
        this.classLine = LineClass;
    }
    LinesWin.prototype.showLines = function (lines, isAnimate) {
        this.isAnimate = isAnimate;
        this.clear();
        this.step = 0;
        for (var i = 0; i < lines.length; i++) {
            this.viewLines.push(this.getline(lines[i]));
        }
        this.showNextLine();
    };
    LinesWin.prototype.showNextLine = function () {
        if (this.viewLines.length > this.step) {
            this.addChild(this.viewLines[this.step]);
            this.viewLines[this.step].showLine(this.isAnimate);
        }
        else {
            this.emit(LinesWin.END_BLINK);
        }
    };
    LinesWin.prototype.getline = function (ind) {
        var _this = this;
        if (!this.lines[ind - 1]) {
            this.lines[ind - 1] = new LinesEnity(this.classLine, ind);
            this.lines[ind - 1].on(LinesWin.END_BLINK, function () { _this.onEndBlink(); });
        }
        return this.lines[ind - 1];
    };
    LinesWin.prototype.onEndBlink = function () {
        this.step++;
        this.showNextLine();
    };
    LinesWin.prototype.clear = function () {
        if (this.viewLines != null) {
            for (var i = 0; i < this.viewLines.length; i++) {
                this.viewLines[i].parent.removeChild(this.viewLines[i]);
            }
        }
        this.viewLines = new Array();
    };
    LinesWin.END_BLINK = "end_blinc";
    return LinesWin;
}(PIXI.Sprite));
var LinesEnity = (function (_super) {
    __extends(LinesEnity, _super);
    function LinesEnity(classLine, index) {
        _super.call(this);
        this.countBlinc = 0;
        this.index = index;
        this.line = new PIXI.extras.MovieClip(mainSlot.getTexturesForName("gnome/images/line_mc.json", "line_", 9));
        this.addChild(this.line);
        this.line.gotoAndStop(this.getFrame(index) - 1);
        this.line.cacheAsBitmap = true;
    }
    LinesEnity.prototype.showLine = function (isAnimate) {
        this.countBlinc = isAnimate ? LinesEnity.BLINK_COUNT : 1;
        this.showBlinkLines();
        if (isAnimate)
            soundManager.playSound(SoundManager.SOUND_ADDLINE, false);
    };
    LinesEnity.prototype.showBlinkLines = function () {
        var _this = this;
        this.countBlinc--;
        if (this.countBlinc > 0) {
            var t = (this.countBlinc / LinesEnity.BLINK_COUNT) * LinesEnity.BLINK_INTERVAL / 2;
            createjs.Tween.get(this, { override: true }).to({ alpha: 0 }, 1000 * t)
                .call(function () { _this.hideBlinkLines(); });
        }
        else {
            this.emit(LinesWin.END_BLINK);
        }
    };
    LinesEnity.prototype.hideBlinkLines = function () {
        var _this = this;
        var t = (this.countBlinc / LinesEnity.BLINK_COUNT) * LinesEnity.BLINK_INTERVAL / 2;
        createjs.Tween.get(this, { override: true }).to({ alpha: 1 }, 1000 * t)
            .call(function () { _this.showBlinkLines(); });
    };
    LinesEnity.prototype.getFrame = function (fr) {
        return fr;
    };
    LinesEnity.BLINK_INTERVAL = 0.25;
    LinesEnity.BLINK_COUNT = 10;
    return LinesEnity;
}(PIXI.Sprite));
var AnimationItemVO = (function () {
    function AnimationItemVO(data) {
        this.an = null;
        this.anRandom = null;
        this.timeHide = null;
        this.randomTime = null;
        this.completeAnim = null;
        this.startAnim = null;
        this.completeStop = null;
        this.dispatchComplete = null;
        this.completeFrame = null;
        for (var s in data) {
            if (this.hasOwnProperty(s))
                this[s] = data[s];
        }
    }
    AnimationItemVO.prototype.getAnimName = function () {
        if (this.an)
            return this.an;
        else if (this.anRandom)
            return this.anRandom[Math.round(Math.random() * (this.anRandom.length - 1))];
        return null;
    };
    return AnimationItemVO;
}());
var AnimationItem = (function (_super) {
    __extends(AnimationItem, _super);
    function AnimationItem(mc, nameAn) {
        var _this = this;
        _super.call(this);
        this.objFrameCallback = new Object();
        this.mc = mc;
        this.nameAn = nameAn;
        this.on("added", function () { _this.onAddToStage(); });
        this.on("removed ", function () { _this.onRemoveFromStage(); });
        this.addChild(mc);
        this.mc.stop();
        this.rand = Math.random();
    }
    AnimationItem.prototype.onAddToStage = function () {
        this.mc.gotoAndPlay(1);
        if (this.info.startAnim != null) {
            this.info.startAnim(this.nameAn, this.mc);
        }
    };
    AnimationItem.prototype.onRemoveFromStage = function () {
        this.mc.stop();
        if (this.timeoutId)
            clearTimeout(this.timeoutId);
    };
    AnimationItem.prototype.setModeAnimation = function (info) {
        var _this = this;
        this.info = info;
        if (this.info.completeFrame != null)
            this.addFrameScript(this.info.completeFrame, function () { _this.nextAnimation(); });
    };
    AnimationItem.prototype.completeAnim = function () {
        var _this = this;
        if (this.info) {
            if (this.info.timeHide) {
                this.mc.stop();
                this.alpha = 0;
                var r = this.info.randomTime ? this.info.randomTime : 1;
                this.timeoutId = setTimeout(function () { _this.mc.gotoAndPlay(1); _this.alpha = 1; }, this.info.timeHide * Math.random() * r);
            }
            if (this.info.completeAnim != null) {
                this.info.completeAnim(this.name, this.mc);
            }
            if (this.info.completeStop)
                this.mc.stop();
        }
        this.emit(EVENT_COMPLETE);
    };
    AnimationItem.prototype.nextAnimation = function () {
        this.emit(AnimationItem.NEXT_ANIMATION);
    };
    AnimationItem.prototype.addFrameScript = function (fr, frameCallback) {
        var _this = this;
        this.objFrameCallback[fr] = frameCallback;
        if (!this.mc.listeners("tick"))
            this.mc.on("tick", function () { _this.onTick(); });
    };
    AnimationItem.prototype.onTick = function () {
        if (this.objFrameCallback[this.mc.currentFrame] != null) {
            this.objFrameCallback[this.mc.currentFrame]();
        }
    };
    AnimationItem.NEXT_ANIMATION = "next_animation";
    return AnimationItem;
}(PIXI.Sprite));
var AnimationVO = (function () {
    function AnimationVO() {
        this.nextAnim = -1;
        this.noReset = false;
    }
    AnimationVO.prototype.setCompleteTime = function (completeTime, randomTime, nextAnim) {
        this.completeTime = completeTime;
        this.randomTime = randomTime;
        this.nextAnim = nextAnim;
        this.eventComplete = AnimationVO.COMPLETE_TIME;
    };
    AnimationVO.prototype.setCompletAnimation = function (nameAnim, nextAnim) {
        this.nameCompleteAnimation = nameAnim;
        this.nextAnim = nextAnim;
        this.eventComplete = AnimationVO.COMPLETE_ANIMATION;
    };
    AnimationVO.COMPLETE_TIME = "complete_time";
    AnimationVO.COMPLETE_ANIMATION = "complete_animation";
    return AnimationVO;
}());
var AnimEnity = (function (_super) {
    __extends(AnimEnity, _super);
    function AnimEnity() {
        _super.call(this);
        this.animsCach = new Object();
        this.isPlayAnimation = false;
        this.cashMc = new Object();
        this.addChild(this.container = new PIXI.Sprite());
        this.rand = Math.random();
    }
    AnimEnity.prototype.createMc = function (nameMc) {
        return null;
    };
    AnimEnity.prototype.getMC = function (nameMc) {
        if (this.cashMc[nameMc] == null) {
            this.cashMc[nameMc] = this.createMc(nameMc);
        }
        return this.cashMc[nameMc];
    };
    AnimEnity.prototype.setAnimsOnNames = function (ar, mc) {
        this.anims = new Array();
        for (var i = 0; i < ar.length; i++) {
            var str = ar[i];
            var an = new AnimationItem(mc[str], str);
            an.name = str;
            this.anims.push(an);
        }
    };
    AnimEnity.prototype.showAnim = function (animInfo) {
        if (!animInfo)
            return;
        this.reset();
        this.animInfo = animInfo;
        this.currentNom = 0;
        this.playCurrentAnim();
    };
    AnimEnity.prototype.playCurrentAnim = function () {
        var _this = this;
        this.curAnims = this.animInfo[this.currentNom];
        var anArs = new Array();
        for (var i = 0; i < this.curAnims.anims.length; i++) {
            var an = this.getAnimByName(this.curAnims.anims[i].getAnimName());
            an.setModeAnimation(this.curAnims.anims[i]);
            this.container.addChild(an);
            if (an.info.dispatchComplete)
                an.on(EVENT_COMPLETE, function (e) { _this.onCompleteAnimation(e); });
            if (an.info.completeFrame)
                an.on(AnimationItem.NEXT_ANIMATION, function (e) { _this.onCompleteAnimation(e); });
            anArs.push(an);
        }
        if (this.curAnims.eventComplete == AnimationVO.COMPLETE_TIME) {
            this.timeoutID = setTimeout(function () { _this.onCompleteAnimation(null); }, this.curAnims.completeTime * (this.curAnims.randomTime + Math.random() * (1 - this.curAnims.randomTime)));
        }
        else if (this.curAnims.eventComplete == AnimationVO.COMPLETE_ANIMATION) {
            var nameCompleteAnimation;
            if (this.curAnims.nameCompleteAnimation.indexOf("@rand_") != -1) {
                var n = parseInt(this.curAnims.nameCompleteAnimation.split("_")[1]);
                nameCompleteAnimation = anArs[n].nameAn;
            }
            else
                nameCompleteAnimation = this.curAnims.nameCompleteAnimation;
            var anCompl = this.getAnimByName(nameCompleteAnimation);
            anCompl.on(EVENT_COMPLETE, function (e) { _this.onCompleteAnimation(e); });
        }
    };
    AnimEnity.prototype.onCompleteAnimation = function (e) {
        if (e != null) {
            if (e.currentTarget.info.dispatchComplete != null) {
                this.emit(EVENT_COMPLETE, e);
                this.isPlayAnimation = false;
            }
        }
        if (this.curAnims != null && this.curAnims.nextAnim > -1) {
            this.currentNom = this.curAnims.nextAnim;
            if (!this.animInfo[this.currentNom].noReset)
                this.reset();
            this.playCurrentAnim();
        }
    };
    AnimEnity.prototype.reset = function () {
        while (this.container.children.length) {
            this.container.removeChildAt(0);
        }
    };
    AnimEnity.prototype.getAnimByName = function (nameAnim) {
        if (this.animsCach[nameAnim] == null) {
            this.animsCach[nameAnim] = new AnimationItem(this.getMC(nameAnim), nameAnim);
        }
        return this.animsCach[nameAnim];
    };
    AnimEnity.prototype.removeAnimByName = function (nameAnim) {
        var an = this.getAnimByName(nameAnim);
        if (an.parent)
            an.parent.removeChild(an);
    };
    AnimEnity.prototype.generateAnim = function (count) {
        var ar = new Array();
        for (var i = 0; i < count; i++) {
            var animationVO = new AnimationVO();
            animationVO.anims = new Array();
            ar.push(animationVO);
        }
        return ar;
    };
    return AnimEnity;
}(PIXI.Sprite));
var PanelInfo = (function (_super) {
    __extends(PanelInfo, _super);
    function PanelInfo(mc) {
        _super.call(this);
        this.dictMethod = new Object();
        this.mc = mc;
        for (var i = 0; i < mc.children.length; i++) {
            mc.getChildAt(i).visible = false;
        }
        this.mc["msg_txt"].text = '';
    }
    PanelInfo.prototype.setMode = function (mode, value) {
        if (value === void 0) { value = ""; }
        clearInterval(this.intervalID);
        this.currentMode = mode;
        this.curValue = value;
        if (this.curView)
            this.curView.visible = false;
        if (this.dictMethod[mode]) {
            this.dictMethod[mode](value);
            this.curView.visible = true;
        }
    };
    return PanelInfo;
}(PIXI.utils.EventEmitter));
var PanelInfoMain = (function (_super) {
    __extends(PanelInfoMain, _super);
    function PanelInfoMain(mc) {
        var _this = this;
        _super.call(this, mc);
        this.dictMethod[PanelInfoMain.MODE_ANIM] = function (value) { _this.showAnimation(value); };
        this.dictMethod[PanelInfoMain.MODE_WIN] = function (value) { _this.showWin(value); };
        this.dictMethod[PanelInfoMain.MODE_TAKE] = function (value) { _this.showTake(value); };
    }
    PanelInfoMain.prototype.showAnimation = function (value) {
        var _this = this;
        this.counter = 1;
        this.curView = this.mc["anim"];
        this.curView["play_to_txt"].text = "PLAY " + mainSlot.model.bets[0] + " TO\n" + mainSlot.model.bets[mainSlot.model.bets.length - 1] * mainSlot.model.lineMax + " CREDITS";
        this.showNextAnimation();
        this.intervalID = setInterval(function () { _this.showNextAnimation(); }, 2000);
    };
    PanelInfoMain.prototype.showNextAnimation = function () {
        this.counter = 1;
    };
    PanelInfoMain.prototype.showWin = function (value) {
        var _this = this;
        this.counter = 1;
        this.intervalID = setInterval(function () { _this.showNextMsgWin(); }, 1500);
        this.showNextMsgWin();
    };
    PanelInfoMain.prototype.showNextMsgWin = function () {
        if (this.counter == 1)
            this.showMsg("WIN " + this.curValue, 25);
        else
            this.showMsg("TAKE OR RISK", 20);
        this.counter++;
        if (this.counter > 2)
            this.counter = 1;
    };
    PanelInfoMain.prototype.showTake = function (value) {
        if (value === void 0) { value = null; }
        this.showMsg("TAKE...");
    };
    PanelInfoMain.prototype.showMsg = function (msg, size) {
        if (size === void 0) { size = 0; }
        this.curView = this.mc["msg_txt"];
        this.mc["msg_txt"].text = msg;
    };
    PanelInfoMain.MODE_ANIM = "anim";
    PanelInfoMain.MODE_WIN = "win";
    PanelInfoMain.MODE_TAKE = "take";
    PanelInfoMain.MODE_RISK = "risk";
    return PanelInfoMain;
}(PanelInfo));
var PanelInfoGamble = (function (_super) {
    __extends(PanelInfoGamble, _super);
    function PanelInfoGamble(mc, m) {
        var _this = this;
        if (m === void 0) { m = 1; }
        _super.call(this, mc);
        this.m = m;
        this.dictMethod[PanelInfoGamble.MODE_DOUBLE] = function (value) { _this.showDouble(value); };
        this.dictMethod[PanelInfoGamble.MODE_MSG] = function (value) { _this.showMsg(value); };
    }
    PanelInfoGamble.prototype.showDouble = function (value) {
        var _this = this;
        this.counter = 1;
        this.showNextDouble();
        this.intervalID = setInterval(function () { _this.showNextDouble(); }, 1000);
    };
    PanelInfoGamble.prototype.showNextDouble = function () {
        if (this.curView)
            this.curView.visible = false;
        if (this.counter == 1) {
            this.curView = this.mc["double_to"];
            this.curView["windouble_txt"].text = 'DOUBLE TO ' + this.curValue + "?";
        }
        else {
            this.showMsgText("TAKE OR RISK", 20);
        }
        this.curView.visible = true;
        this.counter++;
        if (this.counter > 2)
            this.counter = 1;
    };
    PanelInfoGamble.prototype.showMsg = function (value) {
        if (value === void 0) { value = null; }
        this.showMsgText(value, 25);
    };
    PanelInfoGamble.prototype.showMsgText = function (msg, size) {
        if (size === void 0) { size = 0; }
        this.curView = this.mc["msg_txt"];
        this.mc["msg_txt"].text = msg;
    };
    PanelInfoGamble.MODE_DOUBLE = "double";
    PanelInfoGamble.MODE_MSG = "msg";
    return PanelInfoGamble;
}(PanelInfo));
//# sourceMappingURL=slot_enity.js.map