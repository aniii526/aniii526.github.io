class SlotEnity extends PIXI.Sprite {

    private currentScene: IScene;
    protected mainScene: IMainScene;
    protected gamble: IGambleScene;
    protected help: IHelpScene;
    protected bonus: IBonusScene;
    protected superbonus: IBonusScene;

    public static NAME_ATLAS_ICON: string;
    public static NAME_ATLAS_ICON_ANIM: string;

    public static NAME_ATLAS_BONUS_SCENE: string;
    public static NAME_ATLAS_GAMBLE_SCENE: string;
    public static NAME_ATLAS_HELP_SCENE: string;
    public static NAME_ATLAS_MAIN_SCENE: string; 
    public static NAME_ATLAS_SUPER_BONUS_SCENE: string;
    public static NAME_ATLAS_RECT: string;

    public static NAME_ATLAS_ICON_6: string;
    public static NAME_ATLAS_ICON_7: string;
    public static NAME_ATLAS_ICON_8: string;
    public static NAME_ATLAS_ICON_9: string;
    public static NAME_ATLAS_ICONS: string;

    // для прелоадера.
    protected currProcNumLoadedObj: number = 0;
    protected tempNumLoadedObj: number = 0;

    constructor() {
        super();
    }

    public showScene(scene: IScene): void {
        if (this.currentScene != null)
            this.removeChild(this.currentScene);
        this.addChild(scene);
        this.currentScene = scene;
    }

    public removeScene(scene: IScene): void {
        if (this.currentScene != null)
            this.removeChild(this.currentScene);
        this.showScene(this.mainScene);
    }

    public getIsShield(): boolean {
        return false;
    }

    public showHelp(): void {
        this.getHelpScene().tryInitDisplay();
        this.addChild(this.getHelpScene());
    }
    public hideHelp(): void {
        this.removeChild(this.getHelpScene());
    }

    public getHelpScene(): IHelpScene {
        return null;
    }
}

//-------------------------------------------------------------------------------------------

class SceneSlot extends PIXI.Sprite {
    protected mc: PIXI.Sprite;
    protected modelSlot: ModelSlot;

    constructor(mc: PIXI.Sprite) {
        super();
        this.mc = mc;
        this.addChild(mc);
        this.modelSlot = mainSlot.model;

        createjs.Tween.get(this).wait(1).call(() => { this.initDisplay(); });
    }

    protected initDisplay(): void {

    }

    public tryInitDisplay(): void {

    }
}

//-------------------------------------------------------------------------------------------

class BScene extends SceneSlot {
    private completeCallback: Function;
    protected isWin: boolean;
    protected summ: number;
    protected selectID: number;
    protected tmm: TextMoneyMove;
    private timeoutComplete: number;
    protected arSelected: Array<number>;

    protected isBlockSelectedBtn: Boolean = true;


    constructor(mc: PIXI.Sprite) {
        super(mc);
    }

    protected initTM(): void {
        this.tmm = new TextMoneyMove(this.mc["win_txt"]);
        this.tmm.addEventListener(EVENT_COMPLETE, () => { this.onCompleteMoveText() });
    }

    protected getWinTxt(): createjs.Text {
        return this.mc["win_txt"];
    }

    protected bindProperties(): void {

    }

    protected onCompleteMoveText(): void {
        createjs.Tween.get(this).wait(this.timeoutComplete).call(() => { this.completeCallback(); });
    }

    public resetBonus(summ: number, isSb: boolean, completeCallback: Function): void {
        this.summ = summ;
        this.isWin = isSb;
        this.completeCallback = completeCallback;
        this.arSelected = new Array();
    }
    public selectBonus(nom: number): void {
        this.arSelected.push(nom);
        mainSlot.panel.blockComboBtns();
    }

    protected nextAction(): void {
        this.reBlockBtn();
    }

    protected completeBonus(arText: Array<PIXI.Text>, time: number = 1000): void {
        this.timeoutComplete = time;
        if (arText)
            createjs.Tween.get(this).wait(300).call(() => {
                this.tmm.startMove(arText);
            });
        else
            createjs.Tween.get(this).wait(this.timeoutComplete).call(() => { this.completeCallback(); });
    }

    protected reBlockBtn(): void {
        if (this.isBlockSelectedBtn)
            mainSlot.panel.reBlock(this.arSelected);
        else
            mainSlot.panel.reBlock();
    }
}

//-------------------------------------------------------------------------------------------

class MainScene extends SceneSlot {
    protected rolls: Rolls;
    protected lines: LinesWin;
    protected animlayers: AnimWin;
    private fon: PIXI.Graphics;
    protected callbackCompleteRoll: Function;
    protected callbackCompleteLines: Function;

    protected tmm: TextMoneyMove;

    constructor(mc: PIXI.Sprite) {
        super(mc);
       this.tmm = new TextMoneyMove(mainSlot.panel.panel.getTFBalance());
    }

    protected addRoll(px: number, py: number): void {
        this.mc.addChild(this.rolls = new Rolls(this.modelSlot.settingRoll));
        this.rolls.on(Rolls.COMPLETE_ROLLS, () => { this.onCompleteRolls(); });
        this.rolls.x = px;
        this.rolls.y = py;
    }
    protected onCompleteRolls(): void {
        if (this.callbackCompleteRoll != null)
            this.callbackCompleteRoll();
    }
    //TODO
    //буду решать что тут сделать, пусть пока так LineClass с типом any
    protected addWinLine(px: number, py: number, LineClass: any): void {
        this.fon = new PIXI.Graphics();
        this.fon.beginFill(0x000000, 0.5);
        this.fon.drawRect(0, 0, 1095, 625);
        this.fon.endFill();
        this.fon.x = 53;
        this.fon.y = 112;
        this.fon.visible = false;
        this.addChild(this.fon);

        this.lines = new LinesWin(LineClass)
        this.addChild(this.lines);
        this.lines.on(LinesWin.END_BLINK, (e) => { this.onCompleteShowLine() });
        this.lines.on(LinesWin.SHOW_LINE, (indexLine: number) => { this.onShowLine(indexLine) });
        this.lines.x = px;
        this.lines.y = py;

        this.animlayers = new AnimWin(this.rolls);
        this.animlayers.x = 53;
        this.animlayers.y = 112;
        this.addChild(this.animlayers);
    }

    protected onCompleteShowLine(): void {
        if (this.callbackCompleteLines != null)
            this.callbackCompleteLines();
    }

    private onShowLine(indexLine: number): void {
        if (this.callbackCompleteLines != null)
            this.animlayers.showAnimIcon(indexLine);
    }

    public showRollCombination(comb: Array<Array<number>>, callbackCompleteRoll: Function): void {
        this.callbackCompleteRoll = callbackCompleteRoll;
        this.rolls.setCombs(comb);
    }

    public startSpin(): void {
        this.rolls.startSpin();
    }

    public showWinLines(ar: Array<number>, isAnimate: boolean = true, callbackCompleteLines: Function = null): void {
        this.callbackCompleteLines = callbackCompleteLines;
        // старая версия
        /*if (ar != null && ar.length)
            this.lines.showLines(ar, isAnimate);
        else
            this.lines.clear();*/

        // новая версия
        if (ar != null && ar.length) {
            this.lines.showLines(ar, isAnimate);
            if (this.callbackCompleteLines) {
                this.fon.visible = true;
                //this.animlayers.show();
            }
        }
        else {
            this.fon.visible = false;
            this.lines.clear();
            this.animlayers.clear();
        }
    }

    public showWinBonus(): void {
        this.rolls.showWinBonus(this.getNumBonus());
    }
    protected getNumBonus(): number {
        if (this.getContIndex(1) >= 3)
            return 1;
        else
            return 2;
    }

    protected getContIndex(ind: number): number {
        if (this.modelSlot.lastAction)
            return this.modelSlot.lastAction.getCountIndex(ind);
        else
            return 0;
    }

    public showWin(value: number): void {

    }

}

//TO DO надо править сильно этот класс, в нем уже создавать объект мувиклип и переключать его, а не сам контейнер.
class HelpScene extends SceneSlot {

    protected visiblePart: Array<PartHelp>;
    protected indexXY: Array<PointVO>;
    protected textLeftPoint: Array<PointVO>;
    protected textRightPoint: Array<PointVO>;
    protected indexGroupTextures: Array<Array<number>> = [[1, 2, 3], [4, 5], [6], [7], [8], [9]];
    protected groupTexturesPoints: Array<Array<PointVO>>;
    protected groupTextLeft: Array<string>;

    protected styleLabel: PIXI.TextStyle = {
        fontSize: '30px',
        fontFamily: 'heliosblackcregular',
        fill: '#FFFFFF',
        letterSpacing: 1
    };

    constructor(mc: PIXI.Sprite) {
        super(mc);
    }

    public tryInitDisplay(): void {
        if (!this.visiblePart)
            this.initParts();
        this.updateParts();

    }

    protected initParts(): void {
        this.indexXY = [
            new PointVO(668, 557),
            new PointVO(228, 563),
            new PointVO(72, 356),
            new PointVO(420, 356),
            new PointVO(785, 356),
            new PointVO(666, 154)
        ];
        this.groupTexturesPoints = [
            [new PointVO(-43, 21), new PointVO(28, 25), new PointVO(0, 0)],
            [new PointVO(0, 0), new PointVO(31, 21)],
            [new PointVO(0, 0, 150)],
            [new PointVO(0, 0, 150)],
            [new PointVO(0, 0, 150)],
            [new PointVO(0, 0, 150)]
        ];

        this.groupTextLeft = [
            "5x\n4x\n3x\n",
            "5x\n4x\n3x\n",
            "5x\n4x\n3x\n2x",
            "5x\n4x\n3x\n2x",
            "5x\n4x\n3x\n2x",
            "\n5x\n4x\n3x\n"
        ];

        this.textLeftPoint = [
            new PointVO(-10, 0),
            new PointVO(-7, -2),
            new PointVO(0, 0),
            new PointVO(0, 0),
            new PointVO(0, 0),
            new PointVO(0, -2)
        ];

        this.textRightPoint = [
            new PointVO(-10, 2),
            new PointVO(-10, 2),
            new PointVO(0, 5),
            new PointVO(0, 5),
            new PointVO(0, 5),
            new PointVO(-5, 5)
        ];

        let sprite: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["help_plt3.png"]);
        sprite.x = 210;
        sprite.y = 154;
        this.addChild(sprite);

        let sprite_1: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["help_plt2.png"]);
        sprite_1.x = 745;
        sprite_1.y = 146;
        this.addChild(sprite_1);

        let sprite_2: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["help_plt1.png"]);
        sprite_2.x = 138;
        sprite_2.y = 348;
        this.addChild(sprite_2);

        let sprite_3: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["help_plt1.png"]);
        sprite_3.x = 500;
        sprite_3.y = 348;
        this.addChild(sprite_3);

        let sprite_4: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["help_plt1.png"]);
        sprite_4.x = 860;
        sprite_4.y = 348;
        this.addChild(sprite_4);

        let sprite_5: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["help_plt2.png"]);
        sprite_5.x = 294;
        sprite_5.y = 535;
        this.addChild(sprite_5);

        let sprite_6: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["help_plt2.png"]);
        sprite_6.x = 724;
        sprite_6.y = 535;
        this.addChild(sprite_6);

        let tempIndex: number;
        var part: PartHelp;
        this.visiblePart = [];
        for (var i: number = 0; i < this.indexGroupTextures.length; i++) {
            //tempIndex = this.indexGroup[i];
            part = new PartHelp(); part
            part.x = this.indexXY[i].pointX;
            part.y = this.indexXY[i].pointY;
            for (var j: number = 0; j < this.indexGroupTextures[i].length; j++) {
                part.createSpriteForID(this.indexGroupTextures[i][j], this.groupTexturesPoints[i][j], this.textLeftPoint[i], this.textRightPoint[i]);
            }
            this.addChild(part);
            part.updateLeftText(this.groupTextLeft[i]);

            this.visiblePart.push(part);
        }
        part = null;

        let sp: PIXI.Sprite;
        let value50: number = 50 / 195;
        let value60: number = 60 / 195;
        // < 9 стоит специально, последний элемент не нужен в этой последовательности
        for (var i: number = 1; i < 9; i++) {
            sp = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_" + i + ".png"]);
            if (i < 6) {
                sp.x = 618 - 50 * (i - 1);
                sp.scale.x = sp.scale.y = value50;
                sp.y = 218;
            }
            else {
                sp.x = 618 - (60 * (i-2) + 25);
                sp.scale.x = sp.scale.y = value60;
                sp.y = 211;
            }
            this.addChild(sp);
        }

        let textTitle = new PIXI.Text();
        textTitle.text = 'SUBSTITUTES FOR';
        textTitle.style = this.styleLabel;
        textTitle.position.x = 451;
        textTitle.position.y = 192;
        textTitle.anchor.set(0.5, 0.5);
        this.addChild(textTitle);
    }

    protected updateParts(): void {
        let payTableVO: PayTableVO = mainSlot.model.payTableVO;
        let part: PartHelp;
        let str: string;
        let value: number;
        let ar: Array<number>;
        for (var i: number = 0; i < this.visiblePart.length; i++) {

            part = this.visiblePart[i];
            
            for (var j: number = 0; j < this.indexGroupTextures[i].length; j++) {

                if( j === 0 || j === 4)
                    str = '\n';
                else
                    str = '';
                ar = payTableVO["id_" + this.indexGroupTextures[i][0]];
                for (var k: number = 0; k < ar.length; k++) {
                    // новое округление от Сережки
                    value = this.rounding(ar[k] * mainSlot.model.amountBet );
                    //value = ar[k] * mainSlot.model.amountBet;
                    str += value + '\n';
                }
                part.updateRightText(str);
            }
        }
    }

    private rounding(value: number): number {
        if (value > 10)
            return Math.round(value);

        if (value > 1)
            return Math.round(value * 10) / 10;

        if (value > 0.1)
            return Math.round(value * 100) / 100;

        if (value > 0.01)
            return Math.round(value * 1000) / 1000;

        return 0;
    }

    protected bindProperties(): void {

    }

    public selectBtn(nom: number): void {
    }

    public showhelp(): void {
        this.addChild(this.mc);
    }

    public hideHelp(): void {
        this.removeChild(this.mc);
    }
}

class PointVO {
    public pointX: number;
    public pointY: number;
    public scale: number = 100;
    constructor(pointX: number, pointY: number, scale?: number) {
        this.pointX = pointX;
        this.pointY = pointY;
        if (scale)
            this.scale = scale;
    }
}

class PartHelp extends PIXI.Sprite {
    protected styleLabelLeft: PIXI.TextStyle = {
        fontSize: '30px',
        fontFamily: 'heliosblackcregular',
        fill: '#FFFFFF',
        letterSpacing: 1
    };

    protected styleLabelRight: PIXI.TextStyle = {
        fontSize: '30px',
        fontFamily: 'heliosblackcregular',
        fill: '#FFCC33',
        letterSpacing: 1
    };

    private textLeft: PIXI.Text;
    private textRight: PIXI.Text;
    private sprite: PIXI.Sprite;
    constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.textLeft = new PIXI.Text();
        this.textLeft.text = '1';
        this.textLeft.style = this.styleLabelLeft;
        this.textLeft.position.x = 165;
        this.textLeft.position.y = 75;
        this.textLeft.anchor.set(0.5, 0.5);
        this.addChild(this.textLeft);

        this.textRight = new PIXI.Text();
        this.textRight.text = '1';
        this.textRight.style = this.styleLabelRight;
        this.textRight.position.x = 250;
        this.textRight.position.y = 70;
        this.textRight.anchor.set(0.5, 0.5);
        this.addChild(this.textRight);
    }

    public createSpriteForID(id: number, point: PointVO, pointTextL: PointVO, pointTextR: PointVO): void {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_" + id + ".png"]);
        this.sprite.scale.x = this.sprite.scale.y = point.scale / 195; // 195 ширина картинки изначальная
        this.sprite.x = point.pointX;
        this.sprite.y = point.pointY;
        this.addChild(this.sprite);

        this.textLeft.position.x += pointTextL.pointX;
        this.textLeft.position.y += pointTextL.pointY;

        this.textRight.position.x += pointTextR.pointX;
        this.textRight.position.y += pointTextR.pointY;
    }

    public updateLeftText(text: string): void {
        this.textLeft.text = text;
    }

    public updateRightText(text: string): void {
        this.textRight.text = text;
    }
}

class GambleScene extends SceneSlot {
    protected completeCallback: Function;
    protected dealer: Card;
    protected cards: Array<Card> = new Array<Card>();
    protected selectNom: number;
    protected resultcards: string;
    protected pick_mc: PIXI.Sprite;

    protected createCards(cardClass: new () => Card): void {
        this.mc.addChild(this.dealer = new cardClass());
        this.mc.swapChildren(this.dealer, this.mc["dealer"]);
        this.dealer.x = this.mc["dealer_card"].x;
        this.dealer.y = this.mc["dealer_card"].y;

        for (var i: number = 1; i <= 4; i++) {
            var c: Card = new cardClass();
            c.indexCard = i;
            this.mc.addChild(c);
            c.x = this.mc["card" + i].x;
            c.y = this.mc["card" + i].y;
            this.cards.push(c);
        }
    }

    protected clear(): void {
        for (var i: number = 0; i < 4; i++) {
            this.cards[i].setCard("B");
        }
        this.pick_mc.visible = false;
    }

    protected showAllCard(): void {
        var ar: Array<string> = this.resultcards.split("&");
        for (var i: number = 0; i < this.cards.length; i++) {
            var c: Array<string> = ar[i + 1].split("_");
            this.cards[i].setCard(c[1], c[0]);
        }
    }

    protected generateCardDealer(): void {
        this.dealer.setCard("B");

        var cmd: GambleStartGame = new GambleStartGame();
        cmd.addEventListener(ServerResponseEvent.RESPONSE, (e: ServerResponseEvent) => { this.onResponseStart(e) });
        cmd.execute();

    }
    private onResponseStart(e: ServerResponseEvent): void {
        soundManager.playSound(SoundManager.SOUND_CARD_OPEN);
        this.dealer.setCardOnStr((e.data as ActionVO).CombinationAux);
        mainSlot.panel.reBlock();
    }

    public setLastGamble(value: String): void {
        var ar: Array<string> = value.split("&");

        var c: Array<string> = ar[0].split("_");
        var c2: Array<string> = ar[ar.length - 1].split("_");
        this.setSelectValue(parseInt(c2[1].charAt(c2[1].length - 2)));
        this.dealer.setCard(c[1], c[0]);
        //ar.shift();
        //убираю к херам из H(4) цифру и скобки оставляя только букву;
        ar[ar.length - 1] = c2[0] + '_' + c2[1].charAt(0);
        this.resultGamble(ar.join("&"));
    }

    public resetGamble(): void {
        this.clear();
        mainSlot.panel.blockComboBtns();
        if (this.modelSlot.lastAction.Action == ModelSlot.ID_GAMBLE_START)
            this.dealer.setCardOnStr(this.modelSlot.lastAction.CombinationAux);
        else
            this.generateCardDealer();
        this.updatePrize();
    }

    public getSelectValue(): string {
        return "" + this.selectNom;
    }

    public resultGamble(result: string): void {
        this.resultcards = result;
        var ar: Array<string> = result.split("&");

        var c: Array<string> = ar[this.selectNom].split("_");
        this.cards[this.selectNom - 1].setCard(c[1], c[0]);
        soundManager.playSound(SoundManager.SOUND_CARD_OPEN);
        createjs.Tween.get(this).wait(1000).call(() => { this.showAllCard(); });
        this.updatePrize();
    }

    public setSelectValue(type: number): void {
        this.selectNom = type;
        //Это вроде не нужно
        //this.mc["pick_mc"].x = this.mc["card" + this.selectNom].x - 19;
        //this.mc["pick_mc"].visible = true;
    }


    protected updatePrize(): void {

    }


    public useCompleteCallback(completeCallback: Function): boolean {
        return false;
    }
}
class BonusScene extends BScene {
    protected arPrizes: Array<number>;
    protected arBonuses: Array<number>;
    protected isHasShield: boolean = false;
    protected isAddBombForShild: boolean;
    protected isLose: boolean = false;
    protected currentPrize: number = -1;

    public resetBonus(summ: number, isSb: boolean, completeCallback: Function): void {
        super.resetBonus(summ, isSb, completeCallback);

        this.isLose = false;
        this.arBonuses = new Array();
        this.isAddBombForShild = false;
        this.isHasShield = mainSlot.slot.getIsShield();
    }

    protected getPrizes(s: number, count: number): Array<number> {
        var mn: number = 1;

        if (s <= 5)
            mn = 100;
        else if (s < 10)
            mn = 10;

        var ar: Array<number> = new Array();

        var lost: number = s * mn;
        for (var i: number = 0; i < count - 1; i++) {
            var p: number = (0.2 + Math.random() * 0.7) * lost * 0.6;
            var r_p: number = Math.floor(p * this.getMn(p)) / (mn * this.getMn(p));

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
    }

    private getMn(v: Number): number {
        if (v < 1)
            return 100;

        return 1;
    }
}
class SuperbonusScene extends BScene { }

//-------------------------------------------------------------------------------------------

class TextMoneyMove extends createjs.EventDispatcher {
    private targetTF: PIXI.Text;
    private arTF: Array<PIXI.Text>;
    private sourceTF: PIXI.Text;

    private intervalID: number;
    private moneyOnStep: number;
    private resultSum: number;
    private tween: createjs.Tween;

    constructor(tf: PIXI.Text) {
        super();
        this.targetTF = tf;
    }

    public startMove(ar: Array<PIXI.Text>): void {
        this.arTF = ar;
        soundManager.playSound(SoundManager.SOUND_MONEY_MOVE, true, 100);
        this.nextMove();

    }
    private nextMove(): void {
        if (this.intervalID != null)
            clearInterval(this.intervalID);

        //TODO Это просто костылище, чтобы убрать отображение 0 после высчитывания из него суммы. 
        /*if (this.sourceTF)
            this.sourceTF.visible = false;*/

        if (this.arTF.length > 0) {

            this.sourceTF = this.arTF.shift();
            this.moneyOnStep = this.sourceValue / 30;
            if (this.moneyOnStep < 3)
                this.moneyOnStep = this.sourceValue / 10;
            if (this.moneyOnStep < 1)
                this.moneyOnStep = 1;

            this.resultSum = parseFloat(this.targetTF.text) + this.sourceValue;
            this.intervalID = setInterval(() => { this.stepMove() }, 100);
        }
        else {
            soundManager.stopSound(SoundManager.SOUND_MONEY_MOVE);
            this.dispatchEvent(EVENT_COMPLETE);
        }
    }

    private stepMove(): void {
        var sourceMoney: number = this.sourceValue;
        var targetMoney: number = parseInt(this.targetTF.text);

        if (isNaN(sourceMoney))
            sourceMoney = 0;
        if (sourceMoney == 0) {
            this.targetTF.text = "" + Math.round(this.resultSum * 100) / 100;
            this.nextMove();
        } else {
            this.targetTF.text = "" + Math.round((targetMoney + this.moneyOnStep) * 100) / 100;
            sourceMoney -= this.moneyOnStep;
            if (sourceMoney < 0)
                sourceMoney = 0;
            this.sourceTF.text = "" + Math.round(sourceMoney * 100) / 100;
        }
    }

    private get sourceValue(): number {
        var sourceMoney: number = parseFloat(this.sourceTF.text);
        if (isNaN(sourceMoney))
            sourceMoney = 0;
        return sourceMoney;
    }
}

//-------------------------------------------------------------------------------------------

class Card extends PIXI.Sprite {
    private mc: PIXI.Sprite;
    private suits: Array<string>;
    public suit: string;
    public value: string;
    public indexCard: number;

    public Card(suit: string = null, value: string = null) {
        this.suits = this.getSiutsFormat();
        this.setCard(suit, value);
        //this.setCard('2', 'S');
    }

    protected getSiutsFormat(): Array<string> {
        return ["S", "C", "D", "H"];
    }

    public setCard(suit: string, value: string = null): void {
        this.suit = suit;
        this.value = value;

        if (this.mc && this.mc.parent) {
            this.mc.off("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onUpBtn(e) });
            this.mc.off("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onUpBtn(e) });
            this.removeChild(this.mc);
        }

        this.mc = this.getCard(this.suit);
        this.mc.interactive = true;
        this.mc.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onUpBtn(e) });
        this.mc.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onUpBtn(e) });
        if (this.value) {

            let index = parseInt(this.value) - 2;
            this.mc["num"].gotoAndStop(index);
        }
        this.addChild(this.mc);
    }

    private onUpBtn(e: PIXI.interaction.InteractionEvent): void {
        if (mainSlot.panel.blockBtnCards == false)
        mainSlot.panel.outClickBtn(new PanelEvent(PanelEvent.SELECT_LINE, ((e.target as PIXI.Sprite).parent as Card).indexCard));
    }

    public setCardOnStr(suitValue: String): void {
        var ar: Array<string> = suitValue.split("_");
        this.setCard(ar[1], ar[0]);
    }

    //этот метод все равно не вызывается, просто возвращаемое значение сохранить необходимо 
    protected getCard(suit: string): PIXI.Sprite {
        return new PIXI.Sprite();
    }

    public getRandomCard(startValue: number = 0): string {
        var suit: string = this.suits[Math.round(Math.random() * 3)];

        var value: number = 1 + startValue + Math.round(Math.random() * (13 - startValue));
        return "" + value + "_" + suit;
    }
    public getSuitValue(): string {
        return "" + this.value + "_" + this.suit;
    }
}

/*class CardEvent extends PIXI.interaction.InteractionData {
    public static MOUSE_DOWN: string = "mousedown";
    public static TOUCH_START: string = "touchstart";
    
    public eventBtn: string;
    public line: number;

    constructor(eventBtn: string, line: number = 0) {
        super();
        this.eventBtn = eventBtn;
        this.line = line;
    }
}*/

//-------------------------------------------------------------------------------------------

class CardDefault extends Card {

    protected getCard(suit: string): PIXI.Sprite {
        switch (suit) {
            // пики
            case "S":
                let card: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                let suit: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["piki_icon_big.png"]);
                suit.position.x = 45;
                suit.position.y = 111;
                card.addChild(suit);
                card["suit"] = suit;

                let num: PIXI.extras.MovieClip = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "clubs_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;

                return card;

            // крести
            case "C":
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                suit = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["tref_icon_big.png"]);
                suit.position.x = 45;
                suit.position.y = 111;
                card.addChild(suit);
                card["suit"] = suit;

                num = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "clubs_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;

                return card;

            // буби
            case "D":
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                suit = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["bybi_icon_big.png"]);
                suit.position.x = 45;
                suit.position.y = 111;
                card.addChild(suit);
                card["suit"] = suit;

                num = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "diamonds_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;

                return card;

            // черви
            case "H":
            case "(": //супер уебищный костыль который должен спасти от бага который случился 1 раз за все время и больше не повторяется, когда с сервера мне не пришла последняя буква. 
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_face.png"]);
                suit = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["chervi_icon_big.png"]);
                suit.position.x = 45;
                suit.position.y = 111;
                card.addChild(suit);
                card["suit"] = suit;

                num = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_GAMBLE_SCENE, "diamonds_num", 13));
                num.position.x = 16;
                num.position.y = 23;
                num.anchor.set(0, 0);
                card.addChild(num);
                card["num"] = num;

                return card;

            // задник
            default:
                card = new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_GAMBLE_SCENE].textures["card_back.png"]);

                return card;
        }
    }

}

//-------------------------------------------------------------------------------------------

class Rolls extends PIXI.Sprite {
    public static COMPLETE_ROLLS: string = "complete_rolls";

    private arRoll: Array<Roll> = new Array<Roll>();
    private counter: number;
    private rollVO: RollVO;

    constructor(rollVO: RollVO) {
        super();
        this.rollVO = rollVO;

        for (var i: number = 0; i < rollVO.count_roll; i++) {
            var r: Roll = new Roll(i, rollVO);
            r.on(Roll.COMPLETE_ROLL, () => { this.onComplete(); });
            r.x = rollVO.step_x * i;
            this.arRoll.push(r);
            this.addChild(r);
        }
    }

    public setCombs(comb: Array<Array<number>>): void {
        if (this.arRoll[0].isHasCombination) {
            soundManager.playSound(SoundManager.SOUND_ROUTESTART, false, 3);
        }
        this.counter = 0;
        for (var i: number = 0; i < comb.length; i++) {
            this.arRoll[i].setComb(comb[i]);
        }
    }

    public startSpin(): void {
        /*for (var i: number = 0; i < this.arRoll.length; i++) {
            this.arRoll[i].startSpin();
        }*/

        setTimeout(function tick(arg: any[]) {
            arg[1].arRoll[arg[0]].startSpin();
        }, 50, [0, this]);

        setTimeout(function tick(arg: any[]) {
            arg[1].arRoll[arg[0]].startSpin();
        }, 100, [1, this]);

        setTimeout(function tick(arg: any[]) {
            arg[1].arRoll[arg[0]].startSpin();
        }, 150, [2, this]);

        setTimeout(function tick(arg: any[]) {
            arg[1].arRoll[arg[0]].startSpin();
        }, 200, [3, this]);

        setTimeout(function tick(arg: any[]) {
            arg[1].arRoll[arg[0]].startSpin();
        }, 250, [4, this]);
    }

    public showWinBonus(idItem: number): void {
        for (var i: number = 0; i < this.arRoll.length; i++) {
            this.arRoll[i].showWinBonus(idItem);
        }
    }

    private onComplete(): void {
        soundManager.stopSound(SoundManager.SOUND_ROUTESTART);
        this.counter++;
        if (this.counter == this.rollVO.count_roll) {
            this.emit(Rolls.COMPLETE_ROLLS);
        }
    }

    public hideRollForIndex(idItem: number, idChildren: number): void {
        //for (var i: number = 0; i < this.arRoll.length; i++) {
        if (idItem >= this.arRoll.length || idItem < 0) {
            console.log('idItem указывает на несуществующий элемент' );
            return;
        }

        this.arRoll[idItem].hide(idChildren);
    }

    public showRollForIndex(idItem: number): void {
        //for (var i: number = 0; i < this.arRoll.length; i++) {
        if (idItem >= this.arRoll.length || idItem < 0) {
            console.log('idItem указывает на несуществующий элемент');
            return;
        }
        /*(this.arRoll[idItem].getChildAt(1) as PIXI.Sprite).getChildAt(0).visible = true;
        (this.arRoll[idItem].getChildAt(1) as PIXI.Sprite).getChildAt(1).visible = true;
        (this.arRoll[idItem].getChildAt(1) as PIXI.Sprite).getChildAt(2).visible = true;
        */
        this.arRoll[idItem].showAll();
    }
}

//-------------------------------------------------------------------------------------------

class Roll extends PIXI.Sprite {
    public static COMPLETE_ROLL: string = "complete_roll";
    private static ICON_ROUTE: number = 10;
    private static TIME_ON_ICON: number = 15;

    private rollVO: RollVO;
    private container: PIXI.Sprite = new PIXI.Sprite();
    private currentComb: Array<number>;
    private targetComb: Array<number>;
    
    private nomRoll: number;
    private cacheIcons: Object = new Object();

    private pause: boolean = true;
    private speed: number = 0;
    private speed_max: number = 30;
    private speed_start: number = -20;

    private rollElement: Array<IconRoll>;
    private countYForDeleteElement: number;

    private currentState: number = 0;

    private static START_STATE: number = 1;
    private static ROTATION_STATE: number = 2;
    private static END_STATE: number = 3;

    private targetCombNew: Array<number>;


    constructor(nomRoll: number, rollVO: RollVO) {
        super();
        this.nomRoll = nomRoll;
        this.rollVO = rollVO;

        let shape: PIXI.Graphics = new PIXI.Graphics();
        shape.beginFill(0xff0000);
        shape.drawRect(0, 0, rollVO.step_x, rollVO.height_mask ? rollVO.height_mask : rollVO.step_y * rollVO.count_row);
        shape.endFill();
        this.addChild(shape);

        this.addChild(this.container);
        this.container.mask = shape;

        /*setTimeout(function () {
            console.log('16');
            setTimeout(arguments.callee, 16);
        }, 16);*/
        /*createjs.Ticker.addEventListener("tick", handleTick);
	      function handleTick(event) {
	           // Actions carried out each tick (aka frame)
	           if (!event.paused) {
	               // Actions carried out when the Ticker is not paused.
	           }
	       }*/

        this.rollElement = new Array<IconRoll>();

        this.targetCombNew = [];

        this.countYForDeleteElement = 682.5;

        PIXI.ticker.shared.add(this._onTickEvent, this);
    }

    public hide(index: number) {
        // +1 так как произошло смещение из за нового вида вращения в начало добавляется фейковая строка
        this.rollElement[index+1].visible = false;
    }

    public showAll() {
        var lenght: number = this.rollElement.length;
        for (var i: number = 0; i < lenght; i++) {
            this.rollElement[i].visible = true;
        }
    }

    private _onTickEvent(deltaTime: number) {
        //console.log(16);
        if (this.pause == false) {

            var lenght: number = this.rollElement.length;
            for (var i: number = 0; i < lenght; i++) {
                this.rollElement[i].y += this.speed;
            }

            if (this.currentState == Roll.START_STATE) {
                this.speed += 1;
                if (this.speed > 0)
                    this.currentState = Roll.ROTATION_STATE;
            }

            if (this.currentState == Roll.ROTATION_STATE) {
                this.speed += 1;
                if (this.speed > this.speed_max)
                    this.speed = this.speed_max;

                if (this.rollElement[lenght - 1].y > this.countYForDeleteElement) {
                    //console.log("удалить и добавить новый");
                    this.deleteLastElement();
                    this.addNewElement(this.rollVO.getRandomIndex());
                }

            }

            if (this.currentState == Roll.END_STATE) {

                if (this.targetCombNew.length == 0) {
                    if (this.rollElement[0].y > -195) {
                        this.rollElement[0].y = -195;
                        this.rollElement[1].y = 0;
                        this.rollElement[2].y = 195;
                        this.rollElement[3].y = 390;
                        this.rollElement[4].y = 585;

                        this.pause = true;
                        this.playSound();
                        this.completeRoll();
                    }
                }

                if (this.rollElement[lenght - 1].y > this.countYForDeleteElement) {
                    //console.log("удалить и добавить новый");
                    this.deleteLastElement();

                    var index: number = this.targetCombNew.pop();
                    if (index != -1)
                        this.addNewElement(index);
                }
            }
        }
    }

    public deleteLastElement(): void {
        var ic: IconRoll = this.rollElement[this.rollElement.length - 1];
        if (!this.cacheIcons[ic.nom])
            this.cacheIcons[ic.nom] = new Array<IconRoll>();
        this.cacheIcons[ic.nom].push(ic);
        this.container.removeChild(ic);
        ic = null;
        this.rollElement[this.rollElement.length - 1] = null;
        this.rollElement.length--;
    }

    public addNewElement(index: number): void {
        var ic: IconRoll = this.getIcon(index);
        ic.y = -this.rollVO.step_y - (this.rollVO.step_y /2);
        this.container.addChild(ic);
        this.rollElement.unshift(ic);
    }

    public startSpin(): void {

        this.currentState = Roll.START_STATE;
        this.speed = this.speed_start;
        this.pause = false;
    }

    public get isHasCombination(): boolean {
        return this.currentComb != null;
    }

    public setComb(comb: Array<number>): void {
        //после прокрута
        if (this.currentComb != null) {
            //console.log(comb);
            this.currentState = Roll.END_STATE;
            this.speed = this.speed_max;

            this.targetComb = comb;
            this.createLine(Roll.ICON_ROUTE + this.nomRoll * (this.rollVO.diffIconRoute/2));
            this.targetCombNew = this.targetComb;
            // this.targetComb изменяется в this.createLine я это исправлю но позже.
            //console.log(this.targetComb);

            this.currentComb = comb;
        }
        //первый заход
        else {
            //вот тут первое определение
            var ar: Array<number> = comb.concat();
            ar.unshift(this.rollVO.getRandomIndex());
            ar.push(this.rollVO.getRandomIndex());
            this.setContentIcons(ar);
            this.currentComb = comb;
            this.completeRoll();
        }
    }

    // 
    public showWinBonus(idItem: number): void {
        for (var i: number = 0; i < this.container.children.length; i++) {
            var ic: IconRoll = this.container.getChildAt(i) as IconRoll;
            if (ic.nom == idItem)
                ic.showAnimationWin();
        }
    }

    private clear(): void {
        while (this.container.children.length > 0) {
            var ic: IconRoll = this.container.getChildAt(0) as IconRoll;
            if (!this.cacheIcons[ic.nom])
                this.cacheIcons[ic.nom] = new Array<IconRoll>();
            this.cacheIcons[ic.nom].push(ic);

            this.container.removeChildAt(0);
        }
    }

    private getIcon(ind: number): IconRoll {
        var ic: IconRoll;
        if (this.cacheIcons[ind] && this.cacheIcons[ind].length) {
            ic = this.cacheIcons[ind].pop();
        } else {
            ic = new IconRoll(ind);
        }
        ic.restart();
        return ic;
    }

    private createLine(count: number): void {
        var ar: Array<number> = this.targetComb.concat();
        ar.unshift(this.rollVO.getRandomIndex());
        for (var i: number = 0; i < count; i++) {
            ar.push(this.rollVO.getRandomIndex());
        }

        this.targetComb = null;
        this.targetComb = ar;



        //ar = ar.concat(this.currentComb);

        //this.setContentIcons(ar);

        //this.container.y = - this.rollVO.step_y * (ar.length - this.rollVO.count_row);

        /*var t: number = count / Roll.TIME_ON_ICON;

        createjs.Tween.get(this.container, { override: true }).to({ y: 0 }, t * 1000)
            .call(() => { this.completeRoll(); });
        // TweenMax.to(container, t, { y: 0, ease: Sine.easeOut, onComplete: completeRoll });
        createjs.Tween.get(this).wait((t - 0.15) * 1000).call(() => { this.playSound(); });*/
    }

    private playSound(): void {
        soundManager.playSound(SoundManager.SOUND_ROUTESTOP, false);
    }


    private completeRoll(): void {
        for (var i: number = 0; i < this.rollElement.length; i++) {
            this.rollElement[i].showNormalIcon();
        }
        this.emit(Roll.COMPLETE_ROLL);
    }

    private setContentIcons(ar: Array<number>): void {
        this.clear();
        var ic: IconRoll;
        for (var i: number = 0; i < ar.length; i++) {
            ic = this.getIcon(ar[i]);
            this.container.addChild(ic);
            //(i-1) появился из за нового вращения, которое заставляет делать меня дополнительные линии.
            ic.y = (i - 1) * this.rollVO.step_y;
            this.rollElement.push(ic);
        }
    }
}

//-------------------------------------------------------------------------------------------

class IconRoll extends PIXI.Sprite {
    private ic: PIXI.Sprite;
    private ic_blur: PIXI.Sprite;
    public nom: number;
    protected animMc: PIXI.extras.MovieClip;
    private isAnimate: boolean = false;

    private isBlur: boolean = false;

    constructor(nom: number) {
        super();
        this.nom = nom;
        this.ic = this.getIcon(nom);
        this.ic_blur = this.getIconBlur(nom);
        this.addChild(this.ic);
        //this.addChild(this.ic_blur);
    }

    public restart(): void {
        if (this.animMc && this.isAnimate)
            this.removeChild(this.animMc);
        this.isAnimate = false;

        this.isBlur = true;
        this.addChild(this.ic_blur);
        this.removeChild(this.ic);
    }

    protected getIcon(nom: number): PIXI.Sprite {
        return new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_" + nom + ".png"]);
    }

    protected getIconBlur(nom: number): PIXI.Sprite {
        //throw new Error("Не задана иконка");
        return new PIXI.Sprite(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_blur_" + nom + ".png"]);
    }

    public showAnimationWin(): void {
        while (this.children.length) {
            this.removeChildAt(0);
        }
        if (!this.animMc) {
            this.animMc = this.getAnimMc();
            this.animMc.loop = true;
            //TODO скорость анимации надо цеплять откуда то
            this.animMc.animationSpeed = 0.1;
        }
        this.animMc.gotoAndPlay(0);
        this.isAnimate = true;
        this.addChild(this.animMc);
    }

    public showNormalIcon(): void {

        if (this.isBlur == true)
            this.removeChild(this.ic_blur);

        this.addChild(this.ic);
    }

    //TO DO поправить эту функцию, сделать чтобы возвращалась правильная анимированная иконка.
    protected getAnimMc(): PIXI.extras.MovieClip {
        //return new PIXI.extras.MovieClip([PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICON_ANIM].textures["icon_blur_" + nom + ".png"]]);
        //TODO изменить имя анимации. в идеале везде переписать в переменную.
        return null;
    }
}

//-------------------------------------------------------------------------------------------

class AnimWin extends PIXI.Sprite {

    private viewTablePart: Array<AnimWinEnity>;
    protected rolls: Rolls;

    constructor(rolls: Rolls) {
        super();
        this.rolls = rolls;
        this.init();
    }

    public init(): void {
        // тут буду резать и создавать куски

        this.viewTablePart = new Array<AnimWinEnity>();

        //let sprite: PIXI.Sprite;
        let animWinEnity: AnimWinEnity;
        //let baseTexture: PIXI.BaseTexture = PIXI.loader.resources["mainback"].texture.baseTexture;
        for (let j: number = 0; j < 5; j++){
            for (let i: number = 0; i < 3; i++) {
                animWinEnity = new AnimWinEnity();
                animWinEnity.position.x = 20 + (j * (195 + 20));
                animWinEnity.position.y = 20 + (i * 195);
                this.viewTablePart.push(animWinEnity);
                this.addChild(animWinEnity);

                //animWinEnity.fon = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle((353 + 20) + (i * (195 + 20)), (112 + 20) + (j * 195), 195, 195)));
                animWinEnity.init();
            }
        }
    }

    public show(): void {

        //for (let j: number = 0; j < 5; j++) {
        //    for (let i: number = 0; i < 3; i++) {
        //        if (mainSlot.model.highlight[j][i] === 1) {
        //            this.viewTablePart[(j * 3) + i].show(mainSlot.model.combination[j][i]);
        //            this.rolls.hideRollForIndex(j,i);
        //        }
        //    }
        //}
        //console.log('show');
    }

    // index - индекс линии, на которой нужно показать анимацию
    public showAnimIcon(index: number): void {
        //console.log('showAnimIcon ' + index);
        //public id_1: Array<string>;
        var tempAr: Array<string> = mainSlot.model.highlight['id_' + index].slice(0);
        var str: string;
        var a: number;
        var b: number;
        for (let i: number = 0; i < tempAr.length; i++) {
            str = tempAr[i];
            a = +str.charAt(0);
            b = +str.charAt(2);
            this.viewTablePart[(b * 3) + a].show(mainSlot.model.combination[b][a]);
            this.rolls.hideRollForIndex(b, a);
        }
        //console.log(tempAr);
    }

    public clear(): void {
        for (let i: number = 0; i < 15; i++) {
            this.viewTablePart[i].clear();
            if(i<5)
            this.rolls.showRollForIndex(i);
        }
    }
}

class AnimWinEnity extends PIXI.Sprite {

    public fon: PIXI.Sprite;
    public border: PIXI.extras.MovieClip;

    private anim_1: PIXI.extras.MovieClip;
    private anim_2: PIXI.extras.MovieClip;
    private anim_3: PIXI.extras.MovieClip;
    private anim_4: PIXI.extras.MovieClip;
    private anim_5: PIXI.extras.MovieClip;
    private anim_6: PIXI.extras.MovieClip;
    private anim_7: PIXI.extras.MovieClip;
    private anim_8: PIXI.extras.MovieClip;
    private anim_9: PIXI.extras.MovieClip;

    private temp_id: number = 0;

    private aktiv: boolean;

    constructor() {
        super();
        this.visible = false;
        this.aktiv = false;
    }

    public init(): void {
        //this.addChild(this.fon);

        // границу
        //this.border = new PIXI.extras.MovieClip();
        //this.addChild(this.border);
    }

    public show(id: number): void {
        //console.log('show');
        if (this.aktiv) return;

        if (!this['anim_' + id]) {
            let animIconVO: AnimIconVO = mainSlot.slot.getMainScene().getAnimIconVOForId(id);

            this['anim_' + id] = new PIXI.extras.MovieClip(animIconVO.textures);
            this['anim_' + id].animationSpeed = animIconVO.anim_speed;
            this['anim_' + id].loop = animIconVO.loop;
        }
        this['anim_' + id].gotoAndPlay(0);
        this.addChild(this['anim_' + id]);

        this.temp_id = id;
        this.visible = true;
        this.aktiv = true;
    }

    public clear(): void {
        if (this.temp_id != 0)
            this['anim_' + this.temp_id].gotoAndStop(0);

        while (this.children.length) {
            this.removeChildAt(0);
        }
        this.visible = false;
        this.aktiv = false;
    }
}

//-------------------------------------------------------------------------------------------

class LinesWin extends PIXI.Sprite {
    public static END_BLINK: string = "end_blinc";
    public static SHOW_LINE: string = "show_line";

    private classLine: any;
    private viewLines: Array<LinesEnity>;
    private lines: Array<LinesEnity> = new Array<LinesEnity>(9);
    private isAnimate: boolean;
    private step: number = 0;
    private g: PIXI.extras.MovieClip;

    //TODO
    //буду решать что тут сделать, пусть пока так LineClass с типом any
    constructor(LineClass: any) {
        super();
        this.classLine = LineClass;
    }

    public showLines(lines: Array<number>, isAnimate: boolean): void {
        this.isAnimate = isAnimate;
        this.clear();
        this.step = 0;
        for (var i: number = 0; i < lines.length; i++) {
            this.viewLines.push(this.getline(lines[i]));
        }

        this.showNextLine();
    }

    private showNextLine(): void {
        if (this.viewLines.length > this.step) {
            this.addChild(this.viewLines[this.step]);
            this.viewLines[this.step].showLine(this.isAnimate);
            // надеюсь тут не будет проблем когда пользователь выиграет все 9 линий.
            if (this.viewLines[this.step])
                this.emit(LinesWin.SHOW_LINE, this.viewLines[this.step].index);
        }
        else {
            //this.dispatchEvent(LinesWin.END_BLINK)
            this.emit(LinesWin.END_BLINK);
        }
    }

    private getline(ind: number): LinesEnity {
        if (!this.lines[ind - 1]) {
            this.lines[ind - 1] = new LinesEnity(this.classLine, ind);
            //this.lines[ind - 1].addEventListener(LinesWin.END_BLINK, () => { this.onEndBlink(); });
            this.lines[ind - 1].on(LinesWin.END_BLINK, () => { this.onEndBlink(); });

        }
        return this.lines[ind - 1];
    }

    private onEndBlink(): void {
        this.step++;
        this.showNextLine();
    }

    public clear(): void {
        if (this.viewLines != null) {
            for (var i: number = 0; i < this.viewLines.length; i++) {
                this.viewLines[i].parent.removeChild(this.viewLines[i]);
            }
        }
        this.viewLines = new Array<LinesEnity>();
    }
}

//-------------------------------------------------------------------------------------------

class LinesEnity extends PIXI.Sprite {
    private static BLINK_INTERVAL: number = 0.25;
    private static BLINK_COUNT: number = 10;

    private countBlinc: number = 0;
    public index: number;
    private line: PIXI.extras.MovieClip;

    //TODO
    //буду решать что тут сделать, пусть пока так LineClass с типом any
    constructor(classLine: any, index: number) {
        super();
        this.index = index;

        //TODOatlas вернуть потом обратно 
        //this.line = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_MAIN_SCENE, "line", 9));
        this.line = new PIXI.extras.MovieClip(mainSlot.getTexturesForName("games/gnome/images/line_mc.json", "line_", 9));
        this.addChild(this.line);
        this.line.gotoAndStop(this.getFrame(index) - 1);
        //TODO убрал этот кэш, посмотрим нужен ли он вообще
        this.line.cacheAsBitmap = true;
    }

    public showLine(isAnimate: boolean): void {
        this.countBlinc = isAnimate ? LinesEnity.BLINK_COUNT : 1;
        this.showBlinkLines();

        if (isAnimate)
            soundManager.playSound(SoundManager.SOUND_ADDLINE, false);
    }

    private showBlinkLines(): void {
        this.countBlinc--;
        if (this.countBlinc > 0) {
            var t: number = (this.countBlinc / LinesEnity.BLINK_COUNT) * LinesEnity.BLINK_INTERVAL / 2;
            createjs.Tween.get(this, { override: true }).to({ alpha: 0 }, 1000 * t)
                .call(() => { this.hideBlinkLines(); });
        } else {
            //this.dispatchEvent(LinesWin.END_BLINK)
            this.emit(LinesWin.END_BLINK);
        }
    }

    private hideBlinkLines(): void {
        var t: number = (this.countBlinc / LinesEnity.BLINK_COUNT) * LinesEnity.BLINK_INTERVAL / 2;
        createjs.Tween.get(this, { override: true }).to({ alpha: 1 }, 1000 * t)
            .call(() => { this.showBlinkLines(); });
    }

    private getFrame(fr: number): number {
        return fr;
    }

}

//-------------------------------------------------------------------------------------------

class AnimationItemVO {
    public an: string = null;
    public anRandom: Array<string> = null;
    public timeHide: number = null;  // скрывать после проигрывания на 
    public randomTime: number = null;  // Math.random() * randomTime * timeHide
    public completeAnim: Function = null; // метод вызываем при комплите
    public startAnim: Function = null; // метод вызываем при комплите
    public completeStop: boolean = null; // стоп при комплите
    public dispatchComplete: boolean = null; // диспатчить от всей анимации
    public completeFrame: number = null;  // завершить на данном фрейме

    constructor(data: Object) {
        for (var s in data) {
            if (this.hasOwnProperty(s))
                this[s] = data[s];
        }
    }

    public getAnimName(): string {
        if (this.an)
            return this.an;
        else if (this.anRandom)
            return this.anRandom[Math.round(Math.random() * (this.anRandom.length - 1))];

        return null;
    }
}

class AnimationItem extends PIXI.Sprite {
    public static NEXT_ANIMATION: string = "next_animation";
    private mc: PIXI.extras.MovieClip;
    public info: AnimationItemVO;
    private timeoutId: number;
    public nameAn: string;
    private objFrameCallback: Object = new Object();
    private rand: number;

    constructor(mc: PIXI.extras.MovieClip, nameAn: string) {
        super();
        this.mc = mc;
        this.nameAn = nameAn;
        //this.addChild(mc);


        //TODO надо посмотреть что тут за логика и как мне её перенести на pixi
        // потому что я просто переписал тут addEventListener на on, а в данном случае это не правильно
        //this.addEventListener("added", () => { this.onAddToStage() });
        //this.addEventListener("removed ", () => { this.onRemoveFromStage() });

        this.on("added", () => { this.onAddToStage() });
        this.on("removed ", () => { this.onRemoveFromStage() });

        this.addChild(mc);
        this.mc.stop();

        this.rand = Math.random();

        //this.mc.onComplete = () => { this.completeAnim() };
    }

    private onAddToStage(): void {
        //this.addFrameScript(this.mc.totalFrames - 1, () => { this.completeAnim() });

        this.mc.gotoAndPlay(1);
        if (this.info.startAnim != null) {
            this.info.startAnim(this.nameAn, this.mc);
        }
    }

    private onRemoveFromStage(): void {
        this.mc.stop();
        if (this.timeoutId)
            clearTimeout(this.timeoutId);
    }

    public setModeAnimation(info: AnimationItemVO): void {
        this.info = info;
        if (this.info.completeFrame != null)
            this.addFrameScript(this.info.completeFrame, () => { this.nextAnimation() });
    }

    private completeAnim(): void {
        if (this.info) {
            if (this.info.timeHide) {
                this.mc.stop();
                this.alpha = 0;
                var r: number = this.info.randomTime ? this.info.randomTime : 1;
                this.timeoutId = setTimeout(() => { this.mc.gotoAndPlay(1); this.alpha = 1; }, this.info.timeHide * Math.random() * r);
            }
            if (this.info.completeAnim != null) {
                this.info.completeAnim(this.name, this.mc);
            }
            if (this.info.completeStop)
                this.mc.stop();
        }

        this.emit(EVENT_COMPLETE);
    }

    private nextAnimation(): void {
        this.emit(AnimationItem.NEXT_ANIMATION);
    }
    private addFrameScript(fr: number, frameCallback: Function) {
        this.objFrameCallback[fr] = frameCallback;
        if (!this.mc.listeners("tick"))
            //this.mc.addEventListener("tick", () => { this.onTick() });
            this.mc.on("tick", () => { this.onTick() });

    }
    private onTick(): void {
        if (this.objFrameCallback[this.mc.currentFrame] != null) {
            this.objFrameCallback[this.mc.currentFrame]();
            //TODO дело в том, что в pixi нет такой функции и придется придумывать, как это обойти
            //this.mc.removeAllEventListeners("tick");
        }
    }

}
class AnimationVO {
    public static COMPLETE_TIME: string = "complete_time";
    public static COMPLETE_ANIMATION: string = "complete_animation";

    public anims: Array<AnimationItemVO>;
    public nextAnim: number = -1;
    public eventComplete: string; // COMPLETE_TIME, COMPLETE_ANIMATION
    public completeTime: number;
    public randomTime: number; // от random_time - completeTime
    public nameCompleteAnimation: string; // имя анимации по которой определяем завершение всей анимации
    public noReset: boolean = false; // стирать или нет предыдущее

    public setCompleteTime(completeTime: number, randomTime: number, nextAnim: number): void {
        this.completeTime = completeTime;
        this.randomTime = randomTime;
        this.nextAnim = nextAnim;

        this.eventComplete = AnimationVO.COMPLETE_TIME;
    }

    public setCompletAnimation(nameAnim: string, nextAnim: number): void {
        this.nameCompleteAnimation = nameAnim;
        this.nextAnim = nextAnim;
        this.eventComplete = AnimationVO.COMPLETE_ANIMATION;
    }
}

class AnimEnity extends PIXI.Sprite {
    private anims: Array<AnimationItem>;
    private animsCach: Object = new Object();
    protected container: PIXI.Sprite;
    private currentNom: number;
    private animInfo: Array<AnimationVO>;
    private curAnims: AnimationVO
    private timeoutID: number;
    public isPlayAnimation: boolean = false;
    private cashMc: Object = new Object();
    private rand: number;

    constructor() {
        super();
        this.addChild(this.container = new PIXI.Sprite());
        this.rand = Math.random();
    }

    protected createMc(nameMc: string): PIXI.extras.MovieClip {
        return null;
    }

    protected getMC(nameMc: string): PIXI.extras.MovieClip {
        if (this.cashMc[nameMc] == null) {
            this.cashMc[nameMc] = this.createMc(nameMc)
        }
        return this.cashMc[nameMc];
    }

    protected setAnimsOnNames(ar: Array<string>, mc: PIXI.extras.MovieClip): void {
        this.anims = new Array<AnimationItem>()
        for (var i: number = 0; i < ar.length; i++) {
            var str: string = ar[i];
            var an: AnimationItem = new AnimationItem(mc[str], str);
            an.name = str;
            this.anims.push(an);
        }
    }

    protected showAnim(animInfo: Array<AnimationVO>): void {
        if (!animInfo)
            return;
        this.reset();
        this.animInfo = animInfo;
        this.currentNom = 0;
        this.playCurrentAnim();
    }

    private playCurrentAnim(): void {
        this.curAnims = this.animInfo[this.currentNom];
        var anArs: Array<AnimationItem> = new Array<AnimationItem>();
        for (var i: number = 0; i < this.curAnims.anims.length; i++) {
            var an: AnimationItem = this.getAnimByName(this.curAnims.anims[i].getAnimName());

            an.setModeAnimation(this.curAnims.anims[i]);
            this.container.addChild(an);
            if (an.info.dispatchComplete)
                //an.addEventListener(EVENT_COMPLETE, (e: createjs.Event) => { this.onCompleteAnimation(e) });
                an.on(EVENT_COMPLETE, (e: createjs.Event) => { this.onCompleteAnimation(e) });
            if (an.info.completeFrame)
                //an.addEventListener(AnimationItem.NEXT_ANIMATION, (e: createjs.Event) => { this.onCompleteAnimation(e) });
                an.on(AnimationItem.NEXT_ANIMATION, (e: createjs.Event) => { this.onCompleteAnimation(e) });
            anArs.push(an);
        }

        if (this.curAnims.eventComplete == AnimationVO.COMPLETE_TIME) {
            this.timeoutID = setTimeout(() => { this.onCompleteAnimation(null) }, this.curAnims.completeTime * (this.curAnims.randomTime + Math.random() * (1 - this.curAnims.randomTime)));
        }
        else if (this.curAnims.eventComplete == AnimationVO.COMPLETE_ANIMATION) {
            var nameCompleteAnimation: string;
            if (this.curAnims.nameCompleteAnimation.indexOf("@rand_") != -1) {
                var n: number = parseInt(this.curAnims.nameCompleteAnimation.split("_")[1]);
                nameCompleteAnimation = anArs[n].nameAn;
            }
            else
                nameCompleteAnimation = this.curAnims.nameCompleteAnimation;

            var anCompl: AnimationItem = this.getAnimByName(nameCompleteAnimation);
            //anCompl.addEventListener(EVENT_COMPLETE, (e: createjs.Event) => { this.onCompleteAnimation(e) });
            anCompl.on(EVENT_COMPLETE, (e: createjs.Event) => { this.onCompleteAnimation(e) });
        }
    }

    protected onCompleteAnimation(e: createjs.Event): void {
        if (e != null) {
            //TODO проблема в том, что в pixi нет такого метода, необходимо продумать что там не так
            //(e.currentTarget as AnimationItem).removeAllEventListeners(e.type);
            if ((e.currentTarget as AnimationItem).info.dispatchComplete != null) {
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
    }

    public reset(): void {
        //if (timeoutID)
        //    clearTimeout(timeoutID);
        while (this.container.children.length) {
            this.container.removeChildAt(0);
        }
    }

    protected getAnimByName(nameAnim: string): AnimationItem {
        if (this.animsCach[nameAnim] == null) {
            this.animsCach[nameAnim] = new AnimationItem(this.getMC(nameAnim), nameAnim);
            //  an.name = nameAnim;
        }
        /*  for (var i: number = 0; i < this.anims.length; i++) {
              if (this.anims[i].name == nameAnim)
                  return this.anims[i];
          }*/
        return this.animsCach[nameAnim];
    }

    protected removeAnimByName(nameAnim: string): void {
        var an: AnimationItem = this.getAnimByName(nameAnim);
        if (an.parent)
            an.parent.removeChild(an);
    }

    protected generateAnim(count: number): Array<AnimationVO> {
        var ar: Array<AnimationVO> = new Array<AnimationVO>();
        for (var i: number = 0; i < count; i++) {
            var animationVO: AnimationVO = new AnimationVO();
            animationVO.anims = new Array<AnimationItemVO>();
            ar.push(animationVO);
        }
        return ar;
    }
}

class PanelInfo extends PIXI.utils.EventEmitter {
    protected mc: PIXI.Sprite;
    protected currentMode: string;
    protected intervalID: number;
    protected dictMethod: Object = new Object();
    protected counter: number;
    protected curView: PIXI.Sprite;
    protected curValue: String;

    constructor(mc: PIXI.Sprite) {
        super();
        this.mc = mc;

        //TODO вернуть обратно, как соберу эту панель самостоятельно
        for (var i: number = 0; i < mc.children.length; i++) {
            (mc.getChildAt(i) as PIXI.DisplayObject).visible = false;
        }

        this.mc["msg_txt"].text = '';
    }
    public setMode(mode: string, value: string = ""): void {
        clearInterval(this.intervalID);

        this.currentMode = mode;
        this.curValue = value;
        if (this.curView)
            this.curView.visible = false;
        if (this.dictMethod[mode]) {
            this.dictMethod[mode](value);
            this.curView.visible = true;
        }
    }
}

class PanelInfoMain extends PanelInfo {
    public static MODE_ANIM: string = "anim";
    public static MODE_WIN: string = "win";
    public static MODE_TAKE: string = "take";
    public static MODE_RISK: string = "risk";

    constructor(mc: PIXI.Sprite) {
        super(mc);

        this.dictMethod[PanelInfoMain.MODE_ANIM] = (value: string) => { this.showAnimation(value); }
        this.dictMethod[PanelInfoMain.MODE_WIN] = (value: string) => { this.showWin(value); }
        this.dictMethod[PanelInfoMain.MODE_TAKE] = (value: string) => { this.showTake(value); };
    }
    private showAnimation(value: string): void {
        this.counter = 1;
        this.curView = this.mc["anim"];
        this.curView["play_to_txt"].text = "PLAY " + mainSlot.model.bets[0] + " TO\n" + mainSlot.model.bets[mainSlot.model.bets.length - 1] * mainSlot.model.lineMax + " CREDITS";
        this.showNextAnimation();
        this.intervalID = setInterval(() => { this.showNextAnimation() }, 2000);
    }
    //TO DO я не понимаю какая тут должна воспроизводится анимация, если сюда вставляется только спрайт с текстом
    //убрал this.curView.gotoAndStop(this.counter);
    private showNextAnimation(): void {
        //this.curView.gotoAndStop(this.counter);
        //this.counter++;
        //if (this.counter > this.curView.totalFrames)
        this.counter = 1;
    }
    private showWin(value: string): void {
        this.counter = 1;
        this.intervalID = setInterval(() => { this.showNextMsgWin() }, 1500);
        this.showNextMsgWin();
    }
    private showNextMsgWin(): void {
        if (this.counter == 1)
            this.showMsg("WIN " + this.curValue, 25);
        else
            this.showMsg("TAKE OR RISK", 20);
        this.counter++;
        if (this.counter > 2)
            this.counter = 1;
    }
    private showTake(value: String = null): void {
        this.showMsg("TAKE...");
    }
    private showMsg(msg: String, size: number = 0): void {
        this.curView = this.mc["msg_txt"];
        this.mc["msg_txt"].text = msg;
    }
}

class PanelInfoGamble extends PanelInfo {
    public static MODE_DOUBLE: string = "double";
    public static MODE_MSG: string = "msg";

    private m: number;

    constructor(mc: PIXI.Sprite, m: number = 1) {
        super(mc);
        this.m = m;

        this.dictMethod[PanelInfoGamble.MODE_DOUBLE] = (value: string) => { this.showDouble(value) };
        this.dictMethod[PanelInfoGamble.MODE_MSG] = (value: string) => { this.showMsg(value) };
    }

    private showDouble(value: string): void {
        this.counter = 1;
        this.showNextDouble();
        this.intervalID = setInterval(() => { this.showNextDouble() }, 1000);
    }

    private showNextDouble(): void {
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
    }

    private showMsg(value: string = null): void {
        this.showMsgText(value, 25);
    }

    private showMsgText(msg: String, size: number = 0): void {
        this.curView = this.mc["msg_txt"];
        this.mc["msg_txt"].text = msg
    }

}

interface ISlotEnity extends PIXI.Sprite {
    getResourseImg(callback: () => void): void;
    showScene(scene: IScene): void;
    removeScene(scene: IScene): void;
    getStateSlotManager(): StateSlotManager;
    getSettingRoll(): RollVO;
    getHelpScene(): IHelpScene;
    getGambleScene(): IGambleScene;
    getMainScene(): IMainScene;
    getIsShield(): boolean;
    showHelp(): void;
    hideHelp(): void;
}
interface IScene extends PIXI.Sprite {
}
interface IMainScene extends IScene {
    showRollCombination(comb: Array<Array<number>>, callbackCompleteRoll: Function): void;
    showWinLines(ar: Array<number>, isAnimate?: boolean, completeShowLines?: Function): void;
    showWinBonus(): void;
    showWin(value: number): void;
    startSpin(): void;
    getAnimIconVOForId(value: number): AnimIconVO;
}
interface IHelpScene extends IScene {
    selectBtn(nom: number): void;
    showhelp(): void;
    hideHelp(): void;
    tryInitDisplay(): void;
}
interface IGambleScene extends IScene {
    setSelectValue(type: number): void;
    resultGamble(result: string): void;
    resetGamble(): void;
    setLastGamble(value: string): void;
    getSelectValue(): string;
    useCompleteCallback(completeCallback: Function): boolean
}
interface IBonusScene extends IScene {
    resetBonus(summ: number, isSb: boolean, completeCallback: Function): void;
    selectBonus(nom: number): void;
}
