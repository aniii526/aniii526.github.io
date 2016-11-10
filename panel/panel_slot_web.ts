class PanelSlotWeb extends PIXI.Sprite implements IPanel {
    protected nameBtns: Array<BtnInfo>;
    protected linesBtn: Array<BtnInfo>;

    protected indexlines: Array<number> = [1, 3, 5, 7, 9];
    protected dictBtn: Object = new Object();
    protected dictNewBtn: Object = new Object();
    protected comboBtns: ComboBtns;
    protected mute_btn: BtnMute;

    //под вопросом
    protected containerGame: PIXI.Sprite;
    protected loader: PIXI.loaders.Loader;

    protected txt_fon: PIXI.Sprite;
    protected fon: PIXI.Sprite;
    protected preloader: PIXI.extras.MovieClip;

    protected _txt_info: PIXI.Text;
    protected _txt_total_bet: PIXI.Text;
    protected _txt_total_win: PIXI.Text;
    protected _txt_balance: PIXI.Text;
    protected _txt_bet: PIXI.Text;
    protected styleLabelIndex: PIXI.TextStyle = {
        fontSize: '28px',
        fontFamily: 'heliosblackcregular',
        fill: '#FF8E00',
        letterSpacing: 1
    };

    protected wnd_settings: PIXI.Sprite;


    protected dictBtnType: Object = function (): Object {
        var map: Object = {
            "fullscr_btn": PanelEvent.FULL_SCREEN,
            "info_btn": PanelEvent.HELP,
            "select_btn": PanelEvent.SELECT_GAME,
            "auto_btn": PanelEvent.AUTO,
            "betone_btn": PanelEvent.BETONE,
            "maxbet_btn": PanelEvent.MAXBET,
            "start_btn": PanelEvent.START,
            "mute_btn": PanelEvent.MUTE
        }

        return map;
    } ();

    protected dictNewBtnType: Object = function (): Object {
        var map: Object = {
            "start_spin": PanelEvent.START_SPIN,
            "gamble_bet": PanelEvent.GAMBLE_BET,
            "auto_stop": PanelEvent.AUTO_STOP,
            "btn_home": PanelEvent.AUTO_STOP,
            "btn_menu": PanelEvent.AUTO_STOP
        }

        return map;
    } ();

    public static nameResoursPanel: string;
    public static nameResoursPreloader: string;

    constructor() {
        super();
        PanelSlotWeb.nameResoursPanel = './panel/web_panel.json';
        //PanelSlotWeb.nameResoursPreloader = './panel/preloader/preloader.json';

        this.init();
    }
	//TO DO добавить лоадер
	public hideLoader(): void {
       //if (this.preloader)
       //     this.preloader.visible = false;
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
    }

    public uniqueShow(): void {
        if (this.mute_btn)
            this.mute_btn.visible = true;

        for (var s in this.dictBtn) {
            this.dictBtn[s].visible = true;
        }
    }

    // метод создан для переопределения в случае с мобильной панелью
    public init(): void {
        this.loader = PIXI.loader.add(PanelSlotWeb.nameResoursPanel);
        this.loader.once("complete", this.completeLoad, this);
        this.loader.load();
    }

    protected completeLoad() {
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

        //this.anchor.set(0.5, 0);

        mainSlot.atlasPanel = PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures;

        this.preloader = new PIXI.extras.MovieClip(mainSlot.getTexturesForName(PanelSlotWeb.nameResoursPanel, "preloader_mc", 24));
        this.preloader.animationSpeed = 0.5;
        this.preloader.anchor.set(0.5, 0.5);
        this.preloader.position.x = Constants.ASSETS_WIDTH / 2;
        this.preloader.position.y = Constants.ASSETS_HEIGHT / 2;
        this.preloader.play();
        //this.addChild(this.preloader);

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
        this.mute_btn.on(BtnMute.EXCHANGE_MUTE, () => { this.onMute() });
        this.mute_btn.visible = false;
        this.addChild(this.mute_btn);

        //контейнер окна которое будет вызываться.
        this.wnd_settings = new PIXI.Sprite();
        this.wnd_settings.position.x = 0;
        this.wnd_settings.position.y = 0;
        // не знаю, необходимо ли сейчас и работает вообще, но пусть пока будет
        //this.wnd_settings.cacheAsBitmap = true;
        //this.wnd_settings.visible = false;
        this.addChild(this.wnd_settings);

        //Кнопки все кроме линий
        this.createBtnsOnName(this.nameBtns, true);

        //Кнопки линий
        this.setComboBtns(this.linesBtn);

        this._txt_info = new PIXI.Text();
        //this.txt_info.text = 'TXT_INFO';
        this._txt_info.text = '111';
        this._txt_info.style = this.styleLabelIndex;
        this._txt_info.position.x = 220;
        this._txt_info.position.y = 760;
        this._txt_info.anchor.set(0.5, 0);
        this._txt_info.visible = false;
        this.addChild(this._txt_info);

        this._txt_total_bet = new PIXI.Text();
        //this.txt_total_bet.text = 'TXT_TOTAL_BET';
        this._txt_total_bet.text = '111';
        this._txt_total_bet.style = this.styleLabelIndex;
        this._txt_total_bet.position.x = 520;
        this._txt_total_bet.position.y = 760;
        this._txt_total_bet.anchor.set(0.5, 0);
        this._txt_total_bet.visible = false;
        this.addChild(this._txt_total_bet);

        this._txt_total_win = new PIXI.Text();
        //this.txt_total_win.text = 'TXT_TOTAL_WIN';
        this._txt_total_win.text = '111';
        this._txt_total_win.style = this.styleLabelIndex;
        this._txt_total_win.position.x = 682;
        this._txt_total_win.position.y = 760;
        this._txt_total_win.anchor.set(0.5, 0);
        this._txt_total_win.visible = false;
        this.addChild(this._txt_total_win);

        this._txt_balance = new PIXI.Text();
        //this.txt_balance.text = 'TXT_BALANCE';
        this._txt_balance.text = '111';
        this._txt_balance.style = this.styleLabelIndex;
        this._txt_balance.position.x = 845;
        this._txt_balance.position.y = 760;
        this._txt_balance.anchor.set(0.5, 0);
        this._txt_balance.visible = false;
        this.addChild(this._txt_balance);

        this._txt_bet = new PIXI.Text();
        //this.txt_bet.text = 'TXT_BET';
        this._txt_bet.text = '111';
        this._txt_bet.style = this.styleLabelIndex;
        this._txt_bet.position.x = 975;
        this._txt_bet.position.y = 760;
        this._txt_bet.anchor.set(0.5, 0);
        this._txt_bet.visible = false;
        this.addChild(this._txt_bet);

        // если на экране нихера не видно, значит я закомментил тебя)
        this.emit(EVENT_ONLOAD);
    }

    protected createBtnsOnName(ar: Array<BtnInfo>, isAddListener: boolean): Array<BtnPanel> {
        var btns: Array<BtnPanel> = new Array<BtnPanel>();
        for (var i: number = 0; i < ar.length; i++) {
            var btnAnimate: BtnPanel = new BtnPanel(ar[i].skin, ar[i].name, ar[i].down_state);
            this.dictBtn[ar[i].name] = btnAnimate;
            btns.push(btnAnimate);
            if (isAddListener) {
                btnAnimate.on(BtnPanel.CLICK_BTN, (nameBtn: string) => { this.onBtn(nameBtn) });

            }
            btnAnimate.position.x = ar[i].x;
            btnAnimate.position.y = ar[i].y;
            btnAnimate.visible = false;
            this.wnd_settings.addChild(btnAnimate);
        }
        return btns;
    }

    protected setComboBtns(ar: Array<BtnInfo>): void {
        var arComboBtns: Array<BtnPanel> = this.createBtnsOnName(ar, false);
        for (var i: number = 0; i < ar.length; i++)
            arComboBtns[i].setLabel("" + this.indexlines[i]);

        this.comboBtns = new ComboBtns(arComboBtns);
        this.comboBtns.on(ComboBtns.EXCHANGE_SELECT, (e: PIXI.interaction.InteractionEvent) => { this.onSelectLine(e) });
        this.comboBtns.selectBtnOnData(1, false);
    }

    protected getNameEventByBtn(nameBtn: string): string {
        return this.dictBtnType[nameBtn];
    }
    protected getNameBtnByTypeEvent(nameEvent: string): string {
        for (var s in this.dictBtnType) {
            if (this.dictBtnType[s] == nameEvent)
                return s;
        }
        return null;
    }

    protected onMute(): void {
        this.emit(PanelEvent.PANEL_EVENT, new PanelEvent(PanelEvent.MUTE, this.mute_btn.isMute ? 0 : 1));
    }

    protected onBtn(nameBtn:string): void {
        this.onActionBtn(nameBtn);
    }

    protected onSelectLine(e: PIXI.interaction.InteractionEvent): void {
        this.emit(PanelEvent.PANEL_EVENT, new PanelEvent(PanelEvent.SELECT_LINE, this.comboBtns.selectIndex));
    }

    protected onActionBtn(nameBtn: string): void {
        this.emit(PanelEvent.PANEL_EVENT, new PanelEvent(this.getNameEventByBtn(nameBtn)));
    }

    public getContainer(): PIXI.Sprite {
        return this.containerGame;
    }

    public setModeComboBet(nom: number): void {
        this.comboBtns.selectBtnOnData(nom, false);
    }
    public blockBtnByType(nameBtn: string, isBlock: boolean): void {
        var nb: string = this.getNameBtnByTypeEvent(nameBtn);

        if (nb != null && this.dictBtn[nb] != null)
            this.dictBtn[nb].enabled = !isBlock;
    }
    public blockLineBtn(nom: number, isBlock: boolean): void {
        if (this.dictBtn && this.dictBtn[this.linesBtn[nom].name])
            this.dictBtn[this.linesBtn[nom].name].enabled = !isBlock;
    }
    public blockAll(): void {
        for (var s in this.dictBtn)
            this.dictBtn[s].enabled = false;
        this.blockComboBtns();
    }

    public unBlockAll(): void {
        for (var s in this.dictBtn)
            this.dictBtn[s].enabled = true;
        this.comboBtns.enabled = true;
    }

    public blockComboBtns(): void {
        this.comboBtns.enabled = false;
    }

    public setModeSelector(value: boolean): void {
        this.comboBtns.modeSelector = value;
    }
    public setLabelBtn(typeBtn: String, str: String): void {
    }
    public setTotalBet(value: Number): void {
    }

    public setStateAuto(value: boolean): void {
        if (this.dictBtn["auto_btn"] != null)
            this.dictBtn["auto_btn"].setActivNoActiv(value);
    }

    public setTxtInfo(value: string): void {
        if (this._txt_info)
            this._txt_info.text = value;
    }

    public setTxtTotalBet(value: string): void {
        if (this._txt_total_bet)
            this._txt_total_bet.text = value;
    }

    public setTxtTotalWin(value: string): void {
        if (this._txt_total_win)
            this._txt_total_win.text = value;
    }

    public setTxtBalance(value: string): void {
        if (this._txt_balance)
            this._txt_balance.text = value;
    }

    public setTxtBet(value: string): void {
        if (this._txt_bet)
            this._txt_bet.text = value;
    }

    public setAllBtnNoActiv(value: boolean): void {
        this.comboBtns.activ = value;
    }

    public hideBtnByType(nameBtn: string, isHide: boolean): void {
        var nb: string = this.getNameNewBtnByTypeEvent(nameBtn);

        if (nb != null && this.dictNewBtn[nb] != null)
            this.dictNewBtn[nb].visible = !isHide;
           // this.dictNewBtn[nb].visibled(!isHide);
    }

    protected getNameEventByNewBtn(nameBtn: string): string {
        return this.dictNewBtnType[nameBtn];
    }
    protected getNameNewBtnByTypeEvent(nameEvent: string): string {
        for (var s in this.dictNewBtnType) {
            if (this.dictNewBtnType[s] == nameEvent)
                return s;
        }
        return null;
    }

    public showAll(): void {
        for (var s in this.dictNewBtn)
            this.dictNewBtn[s].visible = true;
    }
    public hideAll(): void {
        for (var s in this.dictNewBtn)
            this.dictNewBtn[s].visible = false;
    }

    public showhelp(): void {
    }
    public hidehelp(): void {
    }
}

class PanelSlotMob extends PanelSlotWeb {
    // метод создан для переопределения в случае с мобильной панелью
    protected start_spin: PIXI.Sprite;
    protected gamble_bet: PIXI.Sprite;
    protected auto_stop: PIXI.Sprite;

    protected btn_home: PIXI.Sprite;
    protected btn_menu: PIXI.Sprite;

    private openWndSettings: boolean = false;
    private openWndSettingsForCloseInfo: boolean = false;

    protected btn_back_info: PIXI.Sprite;
    protected btn_select_info: PIXI.Sprite;

    public init(): void {
        PanelSlotWeb.nameResoursPanel = './panel/mob_panel.json';
        //PanelSlotWeb.nameResoursPanel = './panel/web_panel.json';

        super.init();
    }

    public uniqueShow(): void {
        if (this.start_spin)
            this.start_spin.visible = true;

        /*if (this.gamble_bet)
            this.gamble_bet.visible = true;*/

        /*if (this.auto_stop)
            this.auto_stop.visible = true;*/

        if (this.btn_home)
            this.btn_home.visible = true;

        if (this.btn_menu)
            this.btn_menu.visible = true;

        for (var s in this.dictBtn) {
            this.dictBtn[s].visible = true;
        }

        if (this.wnd_settings)
            this.wnd_settings.visible = false;

    }

    protected completeLoad() {
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
        //я пытался высчитывать, но к сожалению не сраслось(((
        this.preloader.position.x = Math.round(1170 / 2);
        this.preloader.position.y = Math.round(623 / 2);
        this.preloader.play();
        this.addChild(this.preloader);

        this.containerGame = new PIXI.Sprite();
        this.addChild(this.containerGame);

        this.txt_fon = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["mainback_screen_mobile.png"]);
        this.txt_fon.position.x = 20;
        this.txt_fon.position.y = 719;
        this.txt_fon.cacheAsBitmap = true;
        this.txt_fon.visible = false;
        this.addChild(this.txt_fon);

        //контейнер окна которое будет вызываться.
        this.wnd_settings = new PIXI.Sprite();
        this.wnd_settings.position.x = 0;
        this.wnd_settings.position.y = 0;
        // не знаю, необходимо ли сейчас и работает вообще, но пусть пока будет
        //this.wnd_settings.cacheAsBitmap = true;
        this.wnd_settings.visible = false;
        this.addChild(this.wnd_settings);

        let for_wnd_for_click: PIXI.Graphics = new PIXI.Graphics();
        for_wnd_for_click.beginFill(0xFF3300);
        for_wnd_for_click.drawRect(0, 0, 1800, 900);
        for_wnd_for_click.endFill();
        for_wnd_for_click.x = -300;
        for_wnd_for_click.alpha = 0;
        for_wnd_for_click.cacheAsBitmap = true;
        for_wnd_for_click.interactive = true;
        for_wnd_for_click.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onBtnMenu() });
        for_wnd_for_click.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onBtnMenu() });
        this.wnd_settings.addChild(for_wnd_for_click);

        this.start_spin = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_start_mobile.png"]);
        this.start_spin.position.x = 1073;
        this.start_spin.position.y = 322;
        this.start_spin.cacheAsBitmap = true;
        this.start_spin.visible = false;
        this.start_spin.interactive = true;
        this.start_spin.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onStartSpin(e) });
        this.start_spin.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onStartSpin(e) });
        this.addChild(this.start_spin);
        this.dictNewBtn['start_spin'] = this.start_spin;

        this.gamble_bet = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_x2.png"]);
        this.gamble_bet.position.x = -74;
        this.gamble_bet.position.y = 322;
        this.gamble_bet.cacheAsBitmap = true;
        this.gamble_bet.visible = false;
        this.gamble_bet.interactive = true;
        this.gamble_bet.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onGambleBet() });
        this.gamble_bet.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onGambleBet() });
        this.addChild(this.gamble_bet);
        this.dictNewBtn['gamble_bet'] = this.gamble_bet;

        this.auto_stop = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_stop.png"]);
        this.auto_stop.position.x = 1073;
        this.auto_stop.position.y = 322;
        this.auto_stop.cacheAsBitmap = true;
        this.auto_stop.visible = false;
        this.auto_stop.interactive = true;
        this.auto_stop.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onBtnAuto() });
        this.auto_stop.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onBtnAuto() });
        this.addChild(this.auto_stop);


        //контейнер окна которое будет вызываться.
        let fon_wnd_settings = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["main_back_mobile.png"]);
        fon_wnd_settings.position.x = 65;
        fon_wnd_settings.position.y = 122;
        fon_wnd_settings.cacheAsBitmap = true;
        fon_wnd_settings.interactive = true;
        //this.wnd_settings.visible = false;
        this.wnd_settings.addChild(fon_wnd_settings);

        this.btn_home = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_home.png"]);
        this.btn_home.position.x = -60;
        this.btn_home.position.y = 660;
        this.btn_home.cacheAsBitmap = true;
        this.btn_home.visible = false;
        this.btn_home.interactive = true;
        this.btn_home.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onBtnHome() });
        this.btn_home.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onBtnHome() });
        this.addChild(this.btn_home);

        this.btn_menu = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_menu.png"]);
        this.btn_menu.position.x = 1096;
        this.btn_menu.position.y = 660;
        this.btn_menu.cacheAsBitmap = true;
        this.btn_menu.visible = false;
        this.btn_menu.interactive = true;
        this.btn_menu.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onBtnMenu() });
        this.btn_menu.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onBtnMenu() });
        this.addChild(this.btn_menu);

        //Кнопки все кроме линий
        var btns: BtnPanel[] = this.createBtnsOnName(this.nameBtns, true);

        //Кнопки линий
        this.setComboBtns(this.linesBtn);

        this._txt_info = new PIXI.Text();
        //this.txt_info.text = 'TXT_INFO';
        this._txt_info.text = '111';
        this._txt_info.style = this.styleLabelIndex;
        this._txt_info.position.x = 300;
        this._txt_info.position.y = 760;
        this._txt_info.anchor.set(0.5, 0);
        this._txt_info.visible = false;
        this.addChild(this._txt_info);

        this._txt_total_bet = new PIXI.Text();
        //this.txt_total_bet.text = 'TXT_TOTAL_BET';
        this._txt_total_bet.text = '111';
        this._txt_total_bet.style = this.styleLabelIndex;
        this._txt_total_bet.position.x = 610;
        this._txt_total_bet.position.y = 760;
        this._txt_total_bet.anchor.set(0.5, 0);
        this._txt_total_bet.visible = false;
        this.addChild(this._txt_total_bet);

        this._txt_total_win = new PIXI.Text();
        //this.txt_total_win.text = 'TXT_TOTAL_WIN';
        this._txt_total_win.text = '111';
        this._txt_total_win.style = this.styleLabelIndex;
        this._txt_total_win.position.x = 772;
        this._txt_total_win.position.y = 760;
        this._txt_total_win.anchor.set(0.5, 0);
        this._txt_total_win.visible = false;
        this.addChild(this._txt_total_win);

        this._txt_balance = new PIXI.Text();
        //this.txt_balance.text = 'TXT_BALANCE';
        this._txt_balance.text = '111';
        this._txt_balance.style = this.styleLabelIndex;
        this._txt_balance.position.x = 938;
        this._txt_balance.position.y = 760;
        this._txt_balance.anchor.set(0.5, 0);
        this._txt_balance.visible = false;
        this.addChild(this._txt_balance);

        this._txt_bet = new PIXI.Text();
        //this.txt_bet.text = 'TXT_BET';
        this._txt_bet.text = '111';
        this._txt_bet.style = this.styleLabelIndex;
        this._txt_bet.position.x = 1065;
        this._txt_bet.position.y = 760;
        this._txt_bet.anchor.set(0.5, 0);
        this._txt_bet.visible = false;
        this.addChild(this._txt_bet);

        let graphics: PIXI.Graphics = new PIXI.Graphics();
        graphics.beginFill(0x02274A);
        graphics.drawRect(-300, 820, 1800, 80);
        graphics.endFill();
        this.addChild(graphics);

        this.dictBtn["auto_btn"].on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.checkCloseWnd() });
        this.dictBtn["auto_btn"].on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.checkCloseWnd() });
        this.dictBtn["info_btn"].on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.checkCloseWnd() });
        this.dictBtn["info_btn"].on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.checkCloseWnd() });

        // если на экране нихера не видно, значит я закомментил тебя)
        this.emit(EVENT_ONLOAD);
    }

    public setAllBtnNoActiv(value: boolean): void {
        super.setAllBtnNoActiv(value);
    }

    public setStateAuto(value: boolean): void {
        super.setStateAuto(value);
        this.checkCloseWnd();
        if (this.auto_stop)
            this.auto_stop.visible = value;
    }

    private onBtnAuto(): void {
        this.checkCloseWnd();
        this.onActionBtn("auto_btn");
    }

    private onBtnMenu(): void {
        this.wnd_settings.visible = this.openWndSettings = !this.openWndSettings;
    }

    //перекидывать должно по урлу URL
    private onBtnHome(): void {
        this.onActionBtn("select_btn");
    }

    private onStartSpin(e: PIXI.interaction.InteractionEvent): void {

        this.checkCloseWnd();
        this.onActionBtn("start_btn");

        e.stopPropagation();
        e.stopped = true;
    }

    private onGambleBet(): void {
        this.checkCloseWnd();
        this.onActionBtn("betone_btn");
    }

    private checkCloseWnd(): void {
        if (this.openWndSettings)
            this.onBtnMenu();
    }

    public showhelp(): void {

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

        //добавить тут кнопки.
        if (!this.btn_back_info) {
            this.btn_back_info = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_back.png"]);
            this.btn_back_info.position.x = 1096;
            this.btn_back_info.position.y = 660;
            this.btn_back_info.cacheAsBitmap = true;
            this.btn_back_info.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onStartSpin(e) });
            this.btn_back_info.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onStartSpin(e) });
        }
        this.btn_back_info.interactive = true;
        this.addChild(this.btn_back_info);

        //добавить тут кнопки.
        if (!this.btn_select_info) {
            this.btn_select_info = new PIXI.Sprite(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_left.png"]);
            this.btn_select_info.position.x = 1073;
            this.btn_select_info.position.y = 322;
            this.btn_select_info.cacheAsBitmap = true;
            this.btn_select_info.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.helpnextpage(e) });
            this.btn_select_info.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.helpnextpage(e) });
        }
        this.btn_select_info.interactive = true;
        this.addChild(this.btn_select_info);
    }

    public helpnextpage(e: PIXI.interaction.InteractionEvent): void {
        this.comboBtns.selectBtnOnData(4);
        e.stopPropagation();
        e.stopped = true;
    }

    public hidehelp(): void {

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
    }
}

class BtnInfo {
    public name: string;
    public skin: string;
    public x: number;
    public y: number;
    public down_state: string;

    constructor(name: string, skin: string, x: number, y: number, down_state: string='') {
        this.name = name;
        this.skin = skin;
        this.x = x;
        this.y = y;

        if (down_state) {
            this.down_state = down_state;
        }
    }
}

//-------------------------------------------------------------------------------------------

class BtnMute extends PIXI.Sprite {
    public static EXCHANGE_MUTE: string = "exchange_mute";
    private fon: PIXI.extras.MovieClip;
    private icon: PIXI.extras.MovieClip;
    public isMute: Boolean = false;

    constructor() {
        super();

        this.fon = new PIXI.extras.MovieClip([PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_sound_on.png"], PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures["btn_sound_off.png"]]);
        this.fon.interactive = true;
        this.fon.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onBtn() });
        this.fon.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onBtn() });
        this.addChild(this.fon);

        //дефолтная установка звука: "ЗВУК ВЫКЛЮЧЕН"
        this.setMute(false);
    }

    private onBtn(): void {
        this.setMute(!this.isMute);
        this.emit(BtnMute.EXCHANGE_MUTE);
    }

    private setMute(value: Boolean): void {
        this.isMute = value;
        this.fon.gotoAndStop(this.isMute ? 1 : 0);
    }
}

//-------------------------------------------------------------------------------------------

class BtnPanel extends PIXI.Sprite {
    public static CLICK_BTN: string = "click_btn";

    public static STATE_UP: number = 0;
    public static STATE_DOWN: number = 1;
    public static STATE_DISABLED: number = 3;

    private skinName: string;
    public name: string;
    private _dataIndex: number;
    private _isModeCB: boolean = false;
    private state: number;
    private labelY: number; 
    private labelIndexY: number; 

    private fon: PIXI.extras.MovieClip;
    private labelIndex: PIXI.Text;
    private creatLabel: boolean = false;

    constructor(skinName: string, nameBtn: string, down_state: string) {
        super();

        this.name = nameBtn;

        let textures: PIXI.Texture[] = [];
        textures.push(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures[skinName]);
        if (down_state)
            textures.push(PIXI.loader.resources[PanelSlotWeb.nameResoursPanel].textures[down_state]);

        this.fon = new PIXI.extras.MovieClip(textures);
        this.fon.interactive = true;
        this.fon.on("mousedown", (e: PIXI.interaction.InteractionEvent) => { this.onUpBtn(e) });
        this.fon.on("touchstart", (e: PIXI.interaction.InteractionEvent) => { this.onUpBtn(e) });
        this.addChild(this.fon);

    }

    private setMode(newState: number): void {
        this.state = newState;

        //у меня нет визуального состояния дизейбла.
        //if (newState != BtnPanel.STATE_DISABLED)
        //this.fon.gotoAndStop(newState);
    }

    private onPressBtn(): void {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
    }

    private onUpBtn(e: PIXI.interaction.InteractionEvent): void {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
        this.emit(BtnPanel.CLICK_BTN, this.name);
    }

    private onOverBtn(): void {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
    }
    private onOutBtn(): void {
        if (this.state == BtnPanel.STATE_DISABLED)
            return;
    }

    public set dataIndex(value: number) {
        this._dataIndex = value;
    }

    public get dataIndex(): number {
        return this._dataIndex;
    }

    public get isModeCB(): boolean {
        return this._isModeCB;
    }

    public set isModeCB(value: boolean) {
        this._isModeCB = value;
    }

    public set enabled(value: Boolean) {
        this.setMode(value ? BtnPanel.STATE_UP : BtnPanel.STATE_DISABLED);
        this.alpha = value ? 1 : 0.5;
    }

    public setPosition(newState: number): void {
        if (newState)
            this.fon.gotoAndStop(BtnPanel.STATE_DOWN);
        else
            this.fon.gotoAndStop(BtnPanel.STATE_UP);
        this.setMode(newState);
    }

    public setActivNoActiv(value: Boolean): void {
        if (value)
            this.fon.gotoAndStop(BtnPanel.STATE_DOWN);
        else
            this.fon.gotoAndStop(BtnPanel.STATE_UP);
    }

    public setLabel(str: string): void {
        if (this.labelIndex != null) {
            this.labelIndex.text = str;
        }
    }

    public visibled(value: boolean) {
        this.visible = value;
    }
}

//-------------------------------------------------------------------------------------------

class ComboBtns extends PIXI.utils.EventEmitter {
    public static EXCHANGE_SELECT: string = "exchange_select";

    private btns: Array<BtnPanel>;
    private dataIndex: Array<number>;

    public selectIndex: number;
    public modeSelector: boolean = false;

    constructor(btns: Array<BtnPanel>) {
        super();
        this.btns = btns;

        for (var i: number = 0; i < btns.length; i++) {
            var btn: BtnPanel = btns[i];

            btn.isModeCB = true;
            btn.dataIndex = i;
            btn.on(BtnPanel.CLICK_BTN, (nameBtn: string) => { this.onBtn(nameBtn) });
        }
    }

    private onBtn(nameBtn: string): void {
        for (var i: number = 0; i < this.btns.length; i++) {
            if (this.btns[i].name == nameBtn) {
                this.selectBtnOnData(this.btns[i].dataIndex);
                return;
            }
        }
    }

    public selectBtnOnData(dataIndex: number, isDispatch: boolean = true): void {
        if (this.modeSelector) {
            for (var i: number = 0; i < this.btns.length; i++) {
                var an: BtnPanel = this.btns[i];

                //это условие необходимо чтобы когда на экране показывается экран 
                //помощи кнопки управления не красились в разные цвета
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
    }

    public set enabled(value: Boolean) {
        for (var i: number = 0; i < this.btns.length; i++) {
            this.btns[i].enabled = value;

        }
    }

    public set activ(value: Boolean) {
        for (var i: number = 0; i < this.btns.length; i++) {
            this.btns[i].setActivNoActiv(value);
        }
    }
}
