﻿class SlotGnome extends SlotEnity implements ISlotEnity {

    protected loader: PIXI.loaders.Loader;

    constructor() {
        super();
        SlotEnity.NAME_ATLAS_ICON = 'gnome/images/icon_mc.json';
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    }

    public getPathViewJS(): string {
        return "gnome/gnome.js";
    }
    

    public getResourseImg(callback: () => void): void {
        this.loader = PIXI.loader.add('fon_main_scene', 'gnome/images/fon_main_scene.png?1').add('gnome/images/line_mc.json').add('gnome/images/icon_mc.json');
        this.loader.once("complete", callback, this);
        this.loader.load();
    }

    public getStateSlotManager(): StateSlotManager {
        return new StateSlotManagerDefault();
    }

    public getSettingRoll(): RollVO {
        var rollVO: RollVO = new RollVO();
        rollVO.count_roll = 5;
        rollVO.count_icon = 9;
        rollVO.count_row = 3;
        rollVO.step_y = 120;
        rollVO.step_x = 140;
        return rollVO;
    }

    public initGame(): void {
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    }

    public getHelpScene(): IHelpScene {
        if (this.help == null)
            this.help = new HelpSceneGnome();
        return this.help;
    }

    public getGambleScene(): IGambleScene {
        if (this.gamble == null)
            this.gamble = new GambleSceneGnome();
        return this.gamble;
    }

    public getBonusScene(): IBonusScene {
        if (this.bonus == null)
            this.bonus = new BonusSceneGnome();
        return this.bonus;
    }

    public getSuperbonusScene(): IBonusScene {
        if (this.superbonus == null)
            this.superbonus = new SuperbonusSceneGnome();
        return this.superbonus;
    }

    public getMainScene(): IMainScene {
        if (this.mainScene == null)
            this.mainScene = new MainSceneGnome();
        return this.mainScene;
    }
}

//-------------------------------------------------------------------------------------------

class MainSceneGnome extends MainScene implements IMainScene {
    private tween: createjs.Tween;
    private infoPanel: PanelInfoMain;

    private total_bet_stat: PIXI.Text;
    private info_stat_txt: PIXI.Text;
    private credit_stat: PIXI.Text;

    private bet_txt: PIXI.Text;
    private line_txt: PIXI.Text;
    private credit_txt: PIXI.Text;
    private bet1_txt: PIXI.Text;
    private bet2_txt: PIXI.Text;

    private bet_txt_x: number;
    private line_txt_x: number;
    private credit_txt_x: number;
    private bet1_txt_x: number;
    private bet2_txt_x: number;

    private soundsManifest: Array<Object> =
    [
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


    constructor() {
        //TO DO надо разобраться с этими мувиками, где я их буду собирать, прямо тут или где то еще
        //super(new lib.main_scene());
        super(new PIXI.Sprite(PIXI.loader.resources["fon_main_scene"].texture));
        this.addRoll(60, 38);
        this.x = 3;

        // перенес это внутрь LinesEnity файла slot_enity
        //let line_mc = new PIXI.extras.MovieClip(mainSlot.getTexturesForName('gnome/images/line_mc.json', "line_mc00", 30));

        this.addWinLine(52, 65, null);
        //this.showWinLines([0,1,2,3,4,5,6,7,8], true, () => { this.completeShowLines() });

        soundManager.loadSounds(this.soundsManifest);
    }

    protected initDisplay(): void {
        console.log('initDisplay');

        let styleLabelIndex: PIXI.TextStyle = {
            align: 'left',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#D1CAA0',
            letterSpacing: 1
        };

        // статический текст вверху начало
        this.total_bet_stat = new PIXI.Text();
        this.total_bet_stat.text = 'TOTAL BET';
        this.total_bet_stat.style = styleLabelIndex;
        this.total_bet_stat.position.x = 12;
        this.total_bet_stat.position.y = 11;
        this.mc.addChild(this.total_bet_stat);

        this.info_stat_txt = new PIXI.Text();
        this.info_stat_txt.text = 'LINES';
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
        // статический текст вверху конец

        // динамические текстовые поля вверху начало
        this.bet_txt = new PIXI.Text();
        this.bet_txt.text = '9999';
        this.bet_txt.style = styleLabelIndex;
        this.bet_txt.style.align = 'right';
        this.bet_txt.position.x = 260;
        this.bet_txt.position.y = 11;
        this.bet_txt.anchor.set(1, 0);
        this.mc.addChild(this.bet_txt);

        this.line_txt = new PIXI.Text();
        this.line_txt.text = '9999';
        this.line_txt.style = styleLabelIndex;
        this.line_txt.style.align = 'right';
        this.line_txt.position.x = 540;
        this.line_txt.position.y = 11;
        this.line_txt.anchor.set(1, 0);
        this.mc.addChild(this.line_txt);

        this.credit_txt = new PIXI.Text();
        this.credit_txt.text = '9999';
        this.credit_txt.style = styleLabelIndex;
        this.credit_txt.style.align = 'right';
        this.credit_txt.position.x = 780;
        this.credit_txt.position.y = 11;
        this.credit_txt.anchor.set(1, 0);
        this.mc.addChild(this.credit_txt);
        // динамические текстовые поля вверху конец

        // динамические текстовые поля внизу начало
        this.bet1_txt = new PIXI.Text();
        this.bet1_txt.text = '9999';
        this.bet1_txt.style = styleLabelIndex;
        this.bet1_txt.style.fill = '#FFFF00';
        this.bet1_txt.position.x = 40;
        this.bet1_txt.position.y = 420;
        this.bet1_txt.anchor.set(0.5, 0);
        this.mc.addChild(this.bet1_txt);

        this.bet2_txt = new PIXI.Text();
        this.bet2_txt.text = '9999';
        this.bet2_txt.style = styleLabelIndex;
        this.bet2_txt.style.fill = '#FFFF00';
        this.bet2_txt.position.x = 760;
        this.bet2_txt.position.y = 420;
        this.bet2_txt.anchor.set(0.5, 0);
        this.mc.addChild(this.bet2_txt);
        // динамические текстовые поля внизу конец

        // надо собрать панель самостоятельно начало
        let mInfo: PIXI.Sprite = new PIXI.Sprite();
        mInfo.position.x = 390;
        mInfo.position.y = 430;
        this.mc.addChild(mInfo);
        this.mc["mInfo"] = mInfo;

        let anim: PIXI.Sprite = new PIXI.Sprite();
        mInfo.addChild(anim);
        mInfo["anim"] = anim;

        let play_to_stat: PIXI.Text = new PIXI.Text();
        play_to_stat.text = 'PLAY 1 TO 225 CREDITS';
        play_to_stat.style = styleLabelIndex;
        play_to_stat.style.fill = '#FFFF00';
        play_to_stat.anchor.set(0.5, 0);
        anim.addChild(play_to_stat);

        let msg_txt: PIXI.Text = new PIXI.Text();
        msg_txt.text = '9999';
        msg_txt.style = styleLabelIndex;
        msg_txt.style.fill = '#FFFF00';
        msg_txt.anchor.set(0.5, 0);
        mInfo.addChild(msg_txt);
        mInfo["msg_txt"] = msg_txt;
        // надо собрать панель самостоятельно конец

        this.infoPanel = new PanelInfoMain(this.mc["mInfo"] as PIXI.Sprite);

        mainSlot.bindSetter(this.modelSlot, "balance", (value: number) => { this.updateBalance(value) });
        mainSlot.bindSetter(this.modelSlot, "typeBet", (value: number) => { this.updateBetLine(value) });
        mainSlot.bindSetter(this.modelSlot, "modeLine", (value: number) => { this.updateBetLine(value) });
        //TODO я не знаю необходим этот функционал или нет
        //mainSlot.bindSetter(mainSlot.slot, "modeLine", (value: boolean) => { this.updateShield(value) });
        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", (value: string) => { this.exchangeMode(value) });
    }

    private completeShowLines(): void {

    }


    private exchangeMode(value:string):void
	{
        if (value == ModelSlot.MODE_READY) {
            this.info_stat_txt.text = "LINES";
            this.updateBetLine(1);
            this.infoPanel.setMode(PanelInfoMain.MODE_ANIM);

        }
        else if (value == ModelSlot.MODE_ROUTE_WIN && this.modelSlot.lastAction.Action == ModelSlot.ID_WIN_ROUTE) {
            this.infoPanel.setMode(PanelInfoMain.MODE_WIN, "" + this.modelSlot.lastAction.Summ);
            this.info_stat_txt.text = "WIN";
            this.line_txt.text = ""+this.modelSlot.lastAction.Summ;
        } else if (value == ModelSlot.MODE_DEBIT) {
            this.infoPanel.setMode(PanelInfoMain.MODE_TAKE);
        }

    }
   
    private updateBalance(value: number): void {
        this.credit_txt.text = "" + value;
    }

    private updateBetLine(type: number): void {
        this.bet_txt.text = "" + this.modelSlot.totalBet;
        this.line_txt.text = "" + this.modelSlot.modeLine;
        this.bet1_txt.text = "" + this.modelSlot.amountBet;
        this.bet2_txt.text = "" + this.modelSlot.amountBet
    }

    //TODO возможно на главном экране щит и не нужен, но мб я ошибаюсь
    private updateShield(value: boolean): void {
        this.mc["shield_mc"].visible = value;
    }

    protected getNumBonus(): number {
        var countInd: number = this.getContIndex(9);
        if (countInd >= 3)
            return 9;
        else
            return 1;
    }
}

//-------------------------------------------------------------------------------------------

class HelpSceneGnome extends HelpScene implements IHelpScene {
    constructor() {
        super(new lib.help_scene());
    }
}

//-------------------------------------------------------------------------------------------

class GambleSceneGnome extends GambleScene implements IGambleScene {

    private infoPanel:PanelInfoGamble;

    constructor() {
        super(new lib.gamble_scene());
        //чтобы "1" Максова не торчала.
        this.mc["step_txt"].visible = false;
        this.createCards(CardDefault);
        
        this.addChild(this.pick_mc = this.mc["pick_mc"]);
    }

    protected initDisplay(): void {
        this.infoPanel = new PanelInfoGamble(this.mc["info_table"]);
        //this.mc["step_txt"].visible = false;

        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", (value: string) => { this.exchangeMode(value) });

        this.showMsgDouble();
    }
    private exchangeMode(value:string):void
	{
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
    }

    private showMsgDouble(): void {
        if (this.infoPanel != null)
            this.infoPanel.setMode(PanelInfoGamble.MODE_DOUBLE, "" + this.modelSlot.lastAction.Summ * 2);
    }	


    public setSelectValue(type: number): void {
        super.setSelectValue(type);
        this.pick_mc.x = this.mc["card" + type].x + 45;
        this.pick_mc.visible = true;
    }

    public resetGamble(): void {
        super.resetGamble();
        this.mc["bet_txt"].text = "" + this.modelSlot.totalBet;
        setTimeout(() => { this.mc["step_mc"].gotoAndStop("_" + this.modelSlot.getStepGamble(), 1); });
        this.showMsgDouble();
    }

    protected updatePrize(): void {
        this.mc["prize_txt"].text = "" + this.modelSlot.summInput;
        this.mc["win_txt"].text = "" + this.modelSlot.lastAction.Summ;

    }
}

//-------------------------------------------------------------------------------------------

class AnimBonus extends AnimEnity {
    public static MODE_WAIT: string = "wait";
    public static MODE_LOSE: string = "lose";
    public static MODE_WIN: string = "win";

    public static b: PIXI.extras.MovieClip;
    public static getMcLib(nameMc: string): PIXI.extras.MovieClip {
        if (AnimBonus.b == null) {
            AnimBonus.b = new lib.anim_bonus();

        }
        return Object.create(AnimBonus.b[nameMc]);
    }

    private mc: PIXI.extras.MovieClip;
    private animName: Array<string> = ["Stand", "shield1", "lose1", "waslose1", "shieldlose1", "open1", "win1", "waswin1"];
    private curMode: string;
    private isHasShield: boolean;
    public prize_txt: PIXI.Text;
    private prize: number;

    constructor() {
        super();

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

    protected createMc(nameMc: string): PIXI.extras.MovieClip {
        return AnimBonus.getMcLib(nameMc);
    }

    public reset(): void {
        this.prize_txt.text = "";
        super.reset();
    }

    public setMode(value: string, isHasShield: boolean, valuePrize: number = 0): void {
        this.isHasShield = isHasShield;
        this.prize = valuePrize;

        var ar_anim: Array<AnimationVO>;
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
            ar_anim[0].anims.push(new AnimationItemVO({ an: this.getWithShield("win1"), startAnim: (nameAnim: string, mcAnim: PIXI.extras.MovieClip) => { this.startAnim(nameAnim, mcAnim); } }));
            if (isHasShield)
                ar_anim[0].anims.push(new AnimationItemVO({ an: "shield1" }));
            ar_anim[0].setCompletAnimation(this.getWithShield("win1"), 1);

            ar_anim[1].anims.push(new AnimationItemVO({ an: "waswin1", dispatchComplete: true, startAnim: (nameAnim: string, mcAnim: PIXI.extras.MovieClip) => { this.startAnim(nameAnim, mcAnim); } }));
        }
        this.showAnim(ar_anim);
    }

    private startAnim(nameAnim: string, mcAnim: PIXI.extras.MovieClip): void {
        if (nameAnim == "waswin1") {
            this.prize_txt.text = "" + this.prize;
        }
        if (nameAnim == this.getWithShield("win1")) {
            soundManager.playSound("b1_win");
        }
        if (nameAnim == this.getWithShield("&lose1")) {
            soundManager.playSound("b1_loss");
        }
    }

    private getWithShield(str: string): string {
        if (this.isHasShield)
            return str.replace("&", "shield");
        else
            return str.replace("&", "");
    }
}

class AnimSuperbonus extends AnimEnity {
    public static MODE_WAIT: string = "wait";
    public static MODE_LOSE: string = "lose";
    public static MODE_WIN: string = "win";

    private animName: Array<string> = ["superlose1", "superwin1", "superopen1"];
    private curMode: string;
    private prize: number;
    public prize_txt: PIXI.Text;

    public static b: PIXI.extras.MovieClip;
    public static getMcLib(nameMc: string): PIXI.extras.MovieClip {
        if (AnimSuperbonus.b == null) {
            AnimSuperbonus.b = new lib.anim_sbonus();

        }
        return Object.create(AnimSuperbonus.b[nameMc]);
    }

    constructor(mc: PIXI.extras.MovieClip) {
        super();
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

    protected createMc(nameMc: string): PIXI.extras.MovieClip {
        return AnimSuperbonus.getMcLib(nameMc);
    }

    public reset(): void {
        this.prize_txt.text = "";
        this.prize_txt.y = 47;
        super.reset();
    }

    public setMode(value: string, valuePrize: number = 0): void {
        this.curMode = value;
        this.prize = valuePrize;

        var ar_anim: Array<AnimationVO>;
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

            ar_anim[1].anims.push(new AnimationItemVO({ an: "superwin1", completeStop: true, dispatchComplete: true, completeAnim: (nameAnim: string, mcAnim: PIXI.extras.MovieClip) => { this.completeAnim(nameAnim, mcAnim) } }));

        }
        this.showAnim(ar_anim);
    }

    private completeAnim(nameAnim: string, mcAnim: PIXI.extras.MovieClip):void
	{
        this.prize_txt.text = "" + this.prize;
        createjs.Tween.get(this.prize_txt, { override: true }).to({ y: -34 }, 500);
    }
}

class BonusSceneGnome extends BonusScene implements IBonusScene {
    private animBonus: AnimBonus;
    private anims: Array<AnimBonus> = new Array<AnimBonus>();
    private arTextPrizes: Array<PIXI.Text>;
    private X_ANIM: number = 30;

    constructor() {
        super(new lib.bonus_scene());

        this.animBonus = new AnimBonus();
        this.mc.addChild(this.animBonus);
        setTimeout(() => {
            this.animBonus.x = this.X_ANIM;

            for (var i: number = 1; i <= 5; i++) {
                var an: AnimBonus = new AnimBonus();
                this.anims.push(an);
                //an.addEventListener(EVENT_COMPLETE, () => { this.onCompleteAnimation() });
                an.on(EVENT_COMPLETE, () => { this.onCompleteAnimation() });
                this.mc.addChild(an);
                an.x = (i - 1) * 129;
            }
        }, 1);
    }

    private onCompleteAnimation(): void {
        this.setPositionGnome(this.selectID + 1);

        if (this.isLose || this.arBonuses.length == 0) {
            this.completeBonus(this.arTextPrizes);
        } else {
            this.nextAction();
        }
    }

    public resetBonus(summ: number, isSb: boolean, completeCallback: Function): void {
        super.resetBonus(summ, isSb, completeCallback);

        this.mc["bet_txt"].text = "" + this.modelSlot.totalBet;
        this.mc["credit_txt"].text = "" + this.modelSlot.balance;
        this.mc["win_txt"].text = "0";

        this.arTextPrizes = new Array();
        for (var i: number = 0; i < 5; i++) {
            this.anims[i].reset();
        }

        var countPrizes: number = isSb ? (this.isHasShield ? 4 : 5) : Math.round(Math.random() * 2) + 1;
        this.arPrizes = this.getPrizes(summ, countPrizes);
        this.setBombForShield();
        for (i = 0; i < this.arPrizes.length; i++) {
            this.arBonuses.push(1);
            this.setBombForShield();
        }
        this.setBombForShield(false);

        if (this.arBonuses.length < 5) {
            var count: number = 5 - this.arBonuses.length;
            for (var j: number = 0; j < count; j++) {
                this.arBonuses.push(0);
            }
        }

        this.selectID = -1;
        this.setPositionGnome(1);
    }

    private setPositionGnome(pos: number): void {
        this.animBonus.x = this.anims[pos - 1].x;
        this.animBonus.y = this.anims[pos - 1].y;
        this.animBonus.visible = true;
        this.animBonus.setMode(AnimBonus.MODE_WAIT, this.isHasShield);
    }

    public selectBonus(nom: number): void {
        super.selectBonus(nom);

        this.selectID = nom;

        var b: boolean = this.arBonuses.shift() == 1;
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
    }

    private setBombForShield(isRand: Boolean = true): void {
        if ((!isRand || Math.random() < 0.4) && !this.isAddBombForShild && this.isHasShield) {
            this.arBonuses.push(0);
            this.isAddBombForShild = true;
        }
    }
}

//-------------------------------------------------------------------------------------------

class SuperbonusSceneGnome extends SuperbonusScene implements IBonusScene {
    private arBtn: Array<number> = [0, 4];
    private anim: AnimBonus;
    private anims: Array<AnimSuperbonus> = new Array<AnimSuperbonus>();
    public prizeTxt: PIXI.Text;

    constructor() {
        super(new lib.superbonus_scene());

        for (var i: number = 1; i <= 2; i++) {
            var b: AnimSuperbonus = new AnimSuperbonus(this.mc["sb" + i]);
            b.x = 63 + 260 * (i - 1);
            b.y = 172;
            this.anims.push(b);
            this.addChild(b);
            //b.addEventListener(EVENT_COMPLETE, () => { this.onCompleteAnimation() });
            b.on(EVENT_COMPLETE, () => { this.onCompleteAnimation() });
        }

        this.addChild(this.anim = new AnimBonus());
        this.anim.x = 284;//this.mc["an_main"].x;
        this.anim.y = 11; //this.mc["an_main"].y;
    }

    private onCompleteAnimation(): void {
        if (!this.isWin)
            soundManager.playSound("sb_loss");
        this.completeBonus([this.prizeTxt])
    }

    public resetBonus(summ: number, isSb: boolean, completeCallback: Function): void {
        super.resetBonus(summ, isSb, completeCallback);

        this.mc["bet_txt"].text = "" + this.modelSlot.totalBet;
        this.mc["credit_txt"].text = "" + this.modelSlot.balance;
        this.mc["win_txt"].text = "" + this.modelSlot.currentWin;

        for (var i: number = 0; i < this.anims.length; i++) {
            this.anims[i].reset();
        }

        this.anim.setMode(AnimBonus.MODE_WAIT, mainSlot.slot.getIsShield());
    }
    public selectBonus(nom: number): void {
        super.selectBonus(nom);

        this.selectID = nom;
        var animPrize: AnimSuperbonus = this.anims[this.arBtn.indexOf(this.selectID)];
        animPrize.setMode(this.isWin ? AnimSuperbonus.MODE_WIN : AnimSuperbonus.MODE_LOSE, this.summ);
        this.prizeTxt = animPrize.prize_txt;
        this.anim.reset();
    }
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

//TO DO
var slotGnome: SlotGnome = new SlotGnome();
mainSlot.setSlot(slotGnome);

//loadJSManifest("gnome/gnome.js", () => { mainSlot.initSlot(slotGnome) });*/