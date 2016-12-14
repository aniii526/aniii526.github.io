class SlotSmithers extends SlotEnity implements ISlotEnity {

    protected loader: PIXI.loaders.Loader;

    constructor() {
        super();
        SlotEnity.NAME_ATLAS_GAMBLE_SCENE = 'games/gnome/images/gamble_card2.json';
        SlotEnity.NAME_ATLAS_ICONS = 'games/smithers/images/img_v2/game/iconsss.json';

        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    }

    public getResourseImg(callback: () => void): void {
        this.loader = PIXI.loader
            .add('mainback', 'games/smithers/images/img_v2/game/mainback_Smithers.jpg?2')
            .add('double', 'games/smithers/images/img_v2/gamble/double.jpg?1')
            .add('help_bg', 'games/smithers/images/img_v2/help/help.jpg?1')

            .add('mainback_number', 'games/gnome/images/img_v2/game/mainback_number.png?1')
            .add('games/gnome/images/line_mc.json')
            .add('games/gnome/images/gamble_card2.json')

            .add(SlotEnity.NAME_ATLAS_ICONS);
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
        rollVO.step_y = 195;
        rollVO.step_x = 215;
        rollVO.width_mask = 195;
        return rollVO;
    }

    public initGame(): void {
        mainSlot.panel.setBlockTypeBtn(ModelSlot.MODE_SUPERBONUS, new ModePanelShow([PanelEvent.AUTO, PanelEvent.BETONE, PanelEvent.MAXBET, PanelEvent.START], [1, 2, 3]));
    }

    public getHelpScene(): IHelpScene {
        if (this.help == null)
            this.help = new HelpSceneSmithers();
        return this.help;
    }

    public getGambleScene(): IGambleScene {
        if (this.gamble == null)
            this.gamble = new GambleSceneSmithers();
        return this.gamble;
    }

    public getMainScene(): IMainScene {
        if (this.mainScene == null)
            this.mainScene = new MainSceneSmithers();
        return this.mainScene;
    }

    public getIsShield(): boolean {
        return mainSlot.model.shield;
    }
}

//-------------------------------------------------------------------------------------------

class MainSceneSmithers extends MainScene implements IMainScene {
    private tween: createjs.Tween;
    private infoPanel: PanelInfoMain;

    private index_bets: number;
    private index_lines: number;

    private soundsManifest: Array<Object> =
    [
        { src: "games/gnome/sounds/addline.ogg?1473506394550", id: "addline" },
        { src: "games/gnome/sounds/card_dealer_open.ogg?1473506394550", id: "card_dealer_open" },
        { src: "games/gnome/sounds/cardwin.ogg?1473506394550", id: "cardwin" },
        { src: "games/gnome/sounds/key_press.ogg?1473506394550", id: "key_press" },
        { src: "games/gnome/sounds/money_move.ogg?1473506394550", id: "money_move" },
        { src: "games/gnome/sounds/route1time.ogg?1473506394551", id: "route1time" },
        { src: "games/gnome/sounds/routestop.ogg?1473506394551", id: "routestop" },
    ];


    constructor() {
        super(new PIXI.Sprite());

        let mainback: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["mainback"].texture);
        mainback.x = -300;
        mainback.cacheAsBitmap = true;
        this.mc.addChild(mainback);

        let mainback_number: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["mainback_number"].texture);
        mainback_number.x = -36;
        mainback_number.y = 108;
        mainback_number.cacheAsBitmap = true;
        this.mc.addChild(mainback_number);

        //this.addRoll(72, 123);
        this.addRoll(72, 132);

        // перенес это внутрь LinesEnity файла slot_enity
        //let line_mc = new PIXI.extras.MovieClip(mainSlot.getTexturesForName('gnome/images/line_mc.json', "line_mc00", 30));

        this.addWinLine(-36, 108, null);

        //я не хочу пока загружать музончик
        soundManager.loadSounds(this.soundsManifest);
    }

    protected initDisplay(): void {

        let styleLabelIndex: PIXI.TextStyle = {
            align: 'left',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#FFFF00',
            letterSpacing: 1
        };

        // надо собрать панель самостоятельно начало
        /*let mInfo: PIXI.Sprite = new PIXI.Sprite();
        //mInfo.position.x = 1300;
        //mInfo.position.y = 500;
        this.mc.addChild(mInfo);
        this.mc["mInfo"] = mInfo;

        let anim: PIXI.Sprite = new PIXI.Sprite();
        mInfo.addChild(anim);
        mInfo["anim"] = anim;

        let play_to_txt: PIXI.Text = new PIXI.Text();
        play_to_txt.text = 'PLAY 1 TO 225 CREDITS';
        play_to_txt.style = styleLabelIndex;
        play_to_txt.style.fill = '#FFFF00';
        play_to_txt.anchor.set(0.5, 0);
        anim.addChild(play_to_txt);
        anim["play_to_txt"] = play_to_txt;

        let msg_txt: PIXI.Text = new PIXI.Text();
        msg_txt.text = '9999';
        msg_txt.style = styleLabelIndex;
        msg_txt.style.fill = '#FFFF00';
        msg_txt.anchor.set(0.5, 0);
        msg_txt.position.y = msg_txt.position.y + msg_txt.height / 2;
        mInfo.addChild(msg_txt);
        mInfo["msg_txt"] = msg_txt;
        // надо собрать панель самостоятельно конец*/

        //this.infoPanel = new PanelInfoMain(/*this.mc["mInfo"] as PIXI.Sprite*/);

        mainSlot.panel.panel.setTxtInfo('PLEASE PRESS START');

        mainSlot.bindSetter(this.modelSlot, "balance", (value: number) => { this.updateBalance(value) });
        mainSlot.bindSetter(this.modelSlot, "typeBet", (value: number) => { this.updateBetLine(value) });
        mainSlot.bindSetter(this.modelSlot, "modeLine", (value: number) => { this.updateBetLine(value) });
        //TODO я не знаю необходим этот функционал или нет
        //mainSlot.bindSetter(mainSlot.slot, "modeLine", (value: boolean) => { this.updateShield(value) });
        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", (value: string) => { this.exchangeMode(value) });

        // вот таким чудным образом я выделяю кнопку в начале.
        mainSlot.panel.panel.setModeComboBet(0);
    }

    public getAnimIconVOForId(id: number): AnimIconVO {

        let animIconVO: AnimIconVO = new AnimIconVO();
        animIconVO.anim_speed = 2 / 60;
        switch (id) {
            //10
            case 1:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_1_", 2);
                animIconVO.loop = true;
                //animIconVO.textures.push(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_1_1.png"]);
                break;
            //J
            case 2:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_2_", 2);
                animIconVO.loop = true;
                //animIconVO.textures.push(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_2_1.png"]);
                break;
            //Q
            case 3:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_3_", 2);
                animIconVO.loop = true;
                //animIconVO.textures.push(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_3_1.png"]);
                break;
            //K
            case 4:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_4_", 2);
                animIconVO.loop = true;
                //animIconVO.textures.push(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_4_1.png"]);
                break;
            //A
            case 5:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_5_", 2);
                animIconVO.loop = true;
                //animIconVO.textures.push(PIXI.loader.resources[SlotEnity.NAME_ATLAS_ICONS].textures["icon_5_1.png"]);
                break;
            //6 
            case 6:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_6_", 20);
                animIconVO.loop = false;
                animIconVO.anim_speed = 10 / 60;
                break;
            //7
            case 7:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_7_", 20);
                animIconVO.loop = false;
                animIconVO.anim_speed = 10 / 60;
                break;
            //8
            case 8:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_8_", 20);
                animIconVO.loop = false;
                animIconVO.anim_speed = 10 / 60;
                break;
            //9
            case 9:
                animIconVO.textures = mainSlot.getTexturesForName(SlotEnity.NAME_ATLAS_ICONS, "icon_9_", 20);
                animIconVO.loop = false;
                animIconVO.anim_speed = 10 / 60;
                break;
        }


        return animIconVO;
    }

    private completeShowLines(): void {

    }

    protected onCompleteRolls(): void {
        super.onCompleteRolls();
        /*if (this.callbackCompleteRoll != null)
            this.callbackCompleteRoll();*/
    }

    //TODO В НОВОЙ ПАНЕЛИ ПЕРЕДЕЛАТЬ ЭТОТ МЕТОД
    private exchangeMode(value: string): void {
        if (value == ModelSlot.MODE_READY) {
            //this.info_stat_txt.text = "LINES";
            this.updateBetLine(1);
            //this.infoPanel.setMode(PanelInfoMain.MODE_ANIM);

        }
        else if (value == ModelSlot.MODE_ROUTE_WIN && this.modelSlot.lastAction.Action == ModelSlot.ID_WIN_ROUTE) {
            //this.infoPanel.setMode(PanelInfoMain.MODE_WIN, "" + this.modelSlot.lastAction.Summ);
            //this.info_stat_txt.text = "WIN";
            mainSlot.panel.panel.setTxtTotalWin("" + this.modelSlot.lastAction.Summ);
            mainSlot.panel.panel.setTxtInfo('WIN ' + this.modelSlot.lastAction.Summ);
        } else if (value == ModelSlot.MODE_DEBIT) {
            //this.infoPanel.setMode(PanelInfoMain.MODE_TAKE);
        }

    }

    private updateBalance(value: number): void {
        mainSlot.panel.panel.setTxtBalance("" + value);
    }

    private updateBetLine(type: number): void {
        mainSlot.panel.panel.setTxtTotalBet("" + this.modelSlot.totalBet);
        mainSlot.panel.panel.setTxtTotalWin("0");
        mainSlot.panel.panel.setTxtBet("" + this.modelSlot.amountBet);


        this.index_bets = this.modelSlot.typeBet;
        this.index_lines = this.modelSlot.modeLine;
        this.updateShield();
    }

    //TODO возможно на главном экране щит и не нужен, но мб я ошибаюсь
    private updateShield(): void {
        if (this.index_bets >= 2 && this.index_lines >= 5) {
            //this.mc["shield_mc"].visible = true;
            this.modelSlot.shield = true;
        }
        else {
            //this.mc["shield_mc"].visible = false;
            this.modelSlot.shield = false;
        }
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

class HelpSceneSmithers extends HelpScene implements IHelpScene {
    constructor() {
        super(new PIXI.Sprite()); //help_bg
        //PIXI.loader.resources["help_scene_1"].texture

        let help_bg: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["help_bg"].texture);
        help_bg.x = 53;
        help_bg.y = 111;
        help_bg.cacheAsBitmap = true;
        this.mc.addChild(help_bg);

    }
}

//-------------------------------------------------------------------------------------------

class GambleSceneSmithers extends GambleScene implements IGambleScene {

    //private infoPanel: PanelInfoGamble;

    private total_bet_stat: PIXI.Text;
    private info_stat_txt: PIXI.Text;
    private credit_stat: PIXI.Text;

    private bet_txt: PIXI.Text;
    private prize_txt: PIXI.Text;
    private win_txt: PIXI.Text;

    private step_txt: PIXI.Text;

    constructor() {
        super(new PIXI.Sprite());

        let mainback: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["mainback"].texture);
        mainback.x = -300;
        mainback.cacheAsBitmap = true;
        this.mc.addChild(mainback);

        let mainback_number: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["mainback_number"].texture);
        mainback_number.x = -36;
        mainback_number.y = 108;
        mainback_number.cacheAsBitmap = true;
        this.mc.addChild(mainback_number);

        let gamble_scene: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources["double"].texture);
        gamble_scene.x = 53;
        gamble_scene.y = 112;
        gamble_scene.cacheAsBitmap = true;
        this.mc.addChild(gamble_scene);

        let styleLabelIndex: PIXI.TextStyle = {
            align: 'left',
            fontSize: '30px',
            fontFamily: 'heliosblackcregular',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            letterSpacing: 1
        };

        // надо собрать карты самостоятельно начало
        let dealer_card: PIXI.Sprite = new PIXI.Sprite();
        dealer_card.position.x = 170;
        dealer_card.position.y = 330;
        this.mc.addChild(dealer_card);
        this.mc["dealer_card"] = dealer_card;

        // надо собрать карты самостоятельно начало
        let dealer: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources['games/gnome/images/gamble_card2.json'].textures["dealer_icon.png"]);
        dealer.position.x = 146;
        dealer.position.y = 310;
        this.mc.addChild(dealer);
        this.mc["dealer"] = dealer;

        let card: PIXI.Sprite;
        for (var i: number = 1; i <= 4; i++) {
            card = new PIXI.Sprite();
            card.position.x = 400 + 163 * (i - 1);
            card.position.y = 330;
            this.mc.addChild(card);
            this.mc["card" + i] = card;
        }
        card = null;

        // текущий шаг риска
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

    protected initDisplay(): void {

        let styleLabelIndex: PIXI.TextStyle = {
            align: 'left',
            fontSize: '17px',
            fontFamily: 'heliosblackcregular',
            fill: '#FFFF00',
            letterSpacing: 1
        };

        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", (value: string) => { this.exchangeMode(value) });

        this.showMsgDouble();
    }
    private exchangeMode(value: string): void {
        if (value == ModelSlot.MODE_GAMBLE_LOSE) {
            mainSlot.panel.panel.setTxtInfo("YOU LOSE");
        }
        else if (value == ModelSlot.MODE_GAMBLE_WIN) {
            mainSlot.panel.panel.setTxtInfo("YOU WIN");
        }
        else if (value == ModelSlot.MODE_DEBIT) {
            mainSlot.panel.panel.setTxtInfo("TAKE...");
        }
    }

    private showMsgDouble(): void {
        mainSlot.panel.panel.setTxtInfo("SELECT CARD OR START");
    }


    public setSelectValue(type: number): void {
        super.setSelectValue(type);
        this.pick_mc.x = this.mc["card" + type].x + 82;
        this.pick_mc.visible = true;
    }

    public resetGamble(): void {
        super.resetGamble();
        //this.bet_txt.text = "" + this.modelSlot.totalBet;
        mainSlot.panel.panel.setTxtTotalBet("" + this.modelSlot.totalBet);
        setTimeout(() => { this.mc['step_txt'].text = 'RISK STEP : ' + this.modelSlot.getStepGamble().toString(); });
        this.showMsgDouble();
    }

    protected updatePrize(): void {
        mainSlot.panel.panel.setTxtTotalWin("" + this.modelSlot.lastAction.Summ);
    }
}

//-------------------------------------------------------------------------------------------

class BonusSceneSmithers extends BonusScene implements IBonusScene {
    private animBonus: AnimBonus;
    private anims: Array<AnimBonus> = new Array<AnimBonus>();
    private arTextPrizes: Array<PIXI.Text>;
    private X_ANIM: number = 30;

    private total_bet_stat: PIXI.Text;
    private info_stat_txt: PIXI.Text;
    private credit_stat: PIXI.Text;

    private bet_txt: PIXI.Text;
    private win_txt: PIXI.Text;
    private credit_txt: PIXI.Text;

    constructor() {
        super(new PIXI.Sprite(PIXI.loader.resources["bonus_scene"].texture));

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
        // динамические текстовые поля вверху конец

        setTimeout(() => {
            this.animBonus = new AnimBonus();
            this.mc.addChild(this.animBonus);
            this.animBonus.x = this.X_ANIM;

            var an: AnimBonus;
            for (var i: number = 1; i <= 5; i++) {
                an = new AnimBonus();
                this.anims.push(an);
                an.on(EVENT_COMPLETE, () => { this.onCompleteAnimation() });
                this.mc.addChild(an);
                an.x = (i - 1) * 129;
            }

            an = null;
        }, 1);
    }

    protected initDisplay(): void {

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

        this.bet_txt.text = "" + this.modelSlot.totalBet;
        this.win_txt.text = "0";
        this.credit_txt.text = "" + this.modelSlot.balance;

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

//TO DO
var slotSmithers: SlotSmithers = new SlotSmithers();
mainSlot.setSlot(slotSmithers);