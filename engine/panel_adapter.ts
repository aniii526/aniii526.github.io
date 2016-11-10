class PanelAdapter extends PIXI.utils.EventEmitter {

    public panel: IPanel;
    private indexlines: Array<number> = [1, 3, 5, 7, 9];
    protected dictBlockBtns: Object = new Object();
    private lastArBlockCombo: Array<number>;
    public ishelp: boolean = false;
    private modelSlot: ModelSlot;
    //индекс активной кнопки из числа линий, до того как пользователь перешел в окно хелп. 
    public indexActivLine: number;


    constructor() {
        super();
        this.modelSlot = mainSlot.model;
    }

    public setPanel(panel: IPanel): void {
        this.panel = panel;
        this.panel.x = 300;
        mainSlot.mainStage.addChild(this.panel);
        this.setBlocks();
    }

    public get panelMc(): PIXI.Sprite {
        return this["panel"] as PIXI.Sprite;
    }
	
	public hidePanelLoader(): void {
        this.panel.hideLoader();
    }

    private setBlocks(): void{
       

        var linesBtn: Array<number> = [0, 1, 2, 3, 4];

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
    }

    public initPanel() { 
        // не может      
        //this.panel.addEventListener(PanelEvent.PANEL_EVENT, (e: PanelEvent) => { this.onPanelEvent(e); });
        this.panel.on(PanelEvent.PANEL_EVENT, (e: PanelEvent) => { this.onPanelEvent(e); });

        mainSlot.bindSetter(this.modelSlot.stateSlotManager, "currentMode", (value: string) => { this.blockMode(value) });
        mainSlot.bindSetter(this.modelSlot, "modeLine", (value: number) => { this.updateBetLine(value) });
        mainSlot.bindSetter(this.modelSlot, "typeBet", (value: number) => { this.updateBetLine(value) });
    }

    public setBlockTypeBtn(mode: string, m: ModePanelShow): void {
        this.dictBlockBtns[mode] = m;
    }

    public updateBetLine(type: number): void {
        this.panel.setTotalBet(this.modelSlot.maxBet);
    }


    private blockMode(mode: string): void {
        this.blockOnMode(mode);
        this.panel.setModeSelector(mode == ModelSlot.MODE_READY);

        /*if (mode == ModelSlot.MODE_ROUTE_WIN || mode == ModelSlot.MODE_GAMBLE) {
            this.panel.setLabelBtn(PanelEvent.START, "TAKE\nWIN");
        }
        else {
            this.panel.setLabelBtn(PanelEvent.START, "START");
        }*/
    }

    public outClickBtn(e: PanelEvent): void {
        this.onPanelEvent(e);
    }

    private onPanelEvent(e?: PanelEvent): void {
        soundManager.playSound(SoundManager.SOUND_KEY_PRESS);
        if (this.ishelp) {
            switch (e.eventBtn) {
                case PanelEvent.START:
                    mainSlot.slot.hideHelp();
                     this.ishelp = false;
                     this.reBlock(this.lastArBlockCombo);
                     //возвращаю активной скин кнопке, после выхода из хелпа.
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
                // if (AppSettings.backUrl)
                //     navigateToURL(new URLRequest(AppSettings.backUrl), "_self");
				if (this.modelSlot.BackUrl)
                    window.top.location.href = this.modelSlot.BackUrl;
                break;
            case PanelEvent.AUTO:
                this.modelSlot.isAutoMode = !this.modelSlot.isAutoMode;
                //this.panel.setStateAuto(this.modelSlot.isAutoMode);
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
    }
    public showhelp(): void {
        if (this.ishelp)
            return;
        this.blockAll();
        this.blockLineBtn(0, false);
        this.blockLineBtn(4, false);
        this.blockBtnByType(PanelEvent.START, false);
        mainSlot.slot.showHelp();
        this.ishelp = true;

         // это дерьмо позволяет изменять менять цвет линиий с активной на неактивную и не затрагивать её состояние. 
        this.panel.setAllBtnNoActiv(false);
    }

    // выделить кнопку
    public setModeComboBet(nom: number): void {
        this.panel.setModeComboBet(nom);
    }
    // блокировать кнопку
    public blockBtnByType(nameBtn: string, isBlock: boolean = true): void {
        this.panel.blockBtnByType(nameBtn, isBlock);
    }
    // скрывать кнопку
    public hideBtnByType(nameBtn: string, isHide: boolean = true): void {
        this.panel.hideBtnByType(nameBtn, isHide);
    }
    // блокировать комбокнопку
    public blockLineBtn(nom: number, isBlock: boolean = true): void {
        this.panel.blockLineBtn(nom, isBlock);
    }
    public blockAll(): void {
        this.panel.blockAll();
    }
    public hideAll(): void {
        this.panel.hideAll();
    }
    public blockComboBtns(): void {
        this.panel.blockComboBtns();
    }

    public reBlock(arBlockCombo: Array<number> = null): void {
        this.lastArBlockCombo = arBlockCombo;
        if (this.ishelp)
            return;

        this.blockOnMode(this.modelSlot.stateSlotManager.currentMode);

        if (arBlockCombo != null) {
            for (var i: number = 0; i < arBlockCombo.length; i++)
                this.blockLineBtn(arBlockCombo[i]);
        }
    }

    // возвращает кнопку по количеству линий
    public getNomBtnLine(countLine: number): number {
        return this.indexlines.indexOf(countLine);
    }
    // возвращает количество линий на данной кнопке
    public getIndexline(ind: number): number {
        return this.indexlines[ind];
    }

    // пишу текст в текстовое поле.
    public setTextToPanelInfoTxt(txt: string): void {
        this.panel.setTxtInfo(txt);
    }

    private blockOnMode(mode: string): void {
        var m: ModePanelShow = this.dictBlockBtns[mode];
        if (m != null) {
            this.panel.unBlockAll();

            if (m.buttons) {
                for (var i: number = 0; i < m.buttons.length; i++)
                    this.blockBtnByType(m.buttons[i]);
            }

            for (var i: number = 0; i < m.lines.length; i++)
                this.blockLineBtn(m.lines[i]);


            this.panel.showAll();
            if (m.buttonsNew) {
                for (var i: number = 0; i < m.buttonsNew.length; i++)
                    this.hideBtnByType(m.buttonsNew[i]);
            }

            // это дерьмо позволяет изменять менять цвет линиий с активной на неактивную и не затрагивать её состояние. 
            if (mode == ModelSlot.MODE_GAMBLE)
                this.panel.setAllBtnNoActiv(false);

            this.setTextToPanelInfoTxt(m.txt_info);
        }
    }

    public resize(w: number, h: number): void {

        let scale: number = Math.min(w / Constants.ASSETS_WIDTH, h / Constants.ASSETS_HEIGHT);

        this.panel.scale.x = this.panel.scale.y = scale;
        //((Constants.ASSETS_WIDTH - 1200 / 2) * scale) - смещает панель в право, так как кнопки в мобильной панели будут смещены в отрицательную сторону
        this.panel.x = (w - Constants.ASSETS_WIDTH * scale) / 2 + (((Constants.ASSETS_WIDTH - 1200) / 2) * scale);
        this.panel.y = (h - Constants.ASSETS_HEIGHT * scale) / 2;
    }
}

class Constants {
    public static ASSETS_WIDTH: number = 1200;
    public static ASSETS_HEIGHT: number = 900;

    public static PIXEL_RATIO: number = 1;

    public static SCREEN_SCALE: number = 1;
    public static DPI: number = -1;
}

//-------------------------------------------------------------------------------------------

class ModePanelShow {
    public buttons: Array<string>;
    public lines: Array<number>;
    public txt_info: string;
    public buttonsNew: Array<string>;

    constructor(buttons: Array<string>, lines: Array<number>, txt_info: string = '', buttonsNew?: Array<string>) {
        this.buttons = buttons;
        this.lines = lines;
        this.txt_info = txt_info;
        this.buttonsNew = buttonsNew;
    }
}

//-------------------------------------------------------------------------------------------

class PanelEvent extends PIXI.interaction.InteractionData {
    public static FULL_SCREEN: string = "fullString";
    public static HELP: string = "help";
    public static SELECT_GAME: string = "selectGame";
    public static AUTO: string = "auto";
    public static BETONE: string = "betone";
    public static MAXBET: string = "maxbet";
    public static START: string = "start";
    public static MUTE: string = "mute";
    public static SELECT_LINE: string = "select_line";

    //пытаюсь всунуть новые кнопки в старый функционал.
    public static START_SPIN: string = "start_spin";
    public static GAMBLE_BET: string = "gamble_bet";
    public static AUTO_STOP: string = "auto_stop";
    public static BTN_HOME: string = "btn_home";
    public static BTN_MENU: string = "btn_menu";

    public static PANEL_EVENT: string = "panel_event";

    public eventBtn: string;
    public line: number;

    constructor(eventBtn: string, line: number = 0) {
        super();
        this.eventBtn = eventBtn;
        this.line = line;
    }
}

//-------------------------------------------------------------------------------------------

interface IPanel extends PIXI.Sprite {
    getContainer(): PIXI.Sprite;
    setModeComboBet(nom: number): void;
    blockBtnByType(nameBtn: string, isBlock: boolean): void;
    blockLineBtn(nom: number, isBlock: boolean): void;
    blockAll(): void;
    unBlockAll(): void;
    blockComboBtns(): void;
    setModeSelector(value: Boolean): void;
    setLabelBtn(typeBtn: String, str: String): void;
    setTotalBet(value: Number): void;
    hideLoader(): void;
    setStateAuto(value: boolean): void;
    setTxtInfo(value: string): void;
    setTxtTotalBet(value: string): void; 
    setTxtTotalWin(value: string): void; 
    setTxtBalance(value: string): void; 
    setTxtBet(value: string): void;
    setAllBtnNoActiv(value: boolean): void;
    hideBtnByType(nameBtn: string, isHide: boolean): void;
    showAll(): void; 
    hideAll(): void; 
    showhelp(): void;
    hidehelp(): void;
}

