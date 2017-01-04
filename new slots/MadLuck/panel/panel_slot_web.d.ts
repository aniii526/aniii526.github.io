declare class PanelSlotWeb extends PIXI.Sprite implements IPanel {
    protected nameBtns: Array<BtnInfo>;
    protected linesBtn: Array<BtnInfo>;
    protected indexlines: Array<number>;
    protected dictBtn: Object;
    protected comboBtns: ComboBtns;
    protected mute_btn: BtnMute;
    protected containerGame: PIXI.Sprite;
    protected loader: PIXI.loaders.Loader;
    protected fon: PIXI.Sprite;
    protected handler: PIXI.extras.MovieClip;
    protected preloader: PIXI.extras.MovieClip;
    protected dictBtnType: Object;
    static nameResoursPanel: string;
    constructor();
    hideLoader(): void;
    init(): void;
    protected completeLoad(): void;
    protected createBtnsOnName(ar: Array<BtnInfo>, isAddListener: boolean): Array<BtnPanel>;
    protected setComboBtns(ar: Array<BtnInfo>): void;
    protected getNameEventByBtn(nameBtn: string): string;
    protected getNameBtnByTypeEvent(nameEvent: string): string;
    protected onMute(): void;
    protected onBtn(nameBtn: string): void;
    protected onSelectLine(e: PIXI.interaction.InteractionEvent): void;
    protected onActionBtn(nameBtn: string): void;
    protected onHand(): void;
    getContainer(): PIXI.Sprite;
    setModeComboBet(nom: number): void;
    blockBtnByType(nameBtn: string, isBlock: boolean): void;
    blockLineBtn(nom: number, isBlock: boolean): void;
    blockAll(): void;
    unBlockAll(): void;
    blockComboBtns(): void;
    setModeSelector(value: boolean): void;
    setLabelBtn(typeBtn: String, str: String): void;
    setTotalBet(value: Number): void;
}
declare class PanelSlotMob extends PanelSlotWeb {
    init(): void;
    protected completeLoad(): void;
}
declare class BtnInfo {
    name: string;
    skin: string;
    x: number;
    y: number;
    text: string;
    style: PIXI.TextStyle;
    substrate: string;
    creatlabel: boolean;
    constructor(name: string, skin: string, x: number, y: number, text: string, style?: PIXI.TextStyle, substrate?: string, creatlabel?: boolean);
}
declare class BtnMute extends PIXI.Sprite {
    static EXCHANGE_MUTE: string;
    private fon;
    private icon;
    isMute: Boolean;
    constructor();
    private onBtn();
    private setMute(value);
}
declare class BtnPanel extends PIXI.Sprite {
    static CLICK_BTN: string;
    static STATE_UP: number;
    static STATE_DOWN: number;
    static STATE_OVER: number;
    static STATE_DISABLED: number;
    private skinName;
    name: string;
    private _dataIndex;
    private _isModeCB;
    private state;
    private labelY;
    private fon;
    private label;
    private style;
    private text;
    private substrate;
    private substrate_mc;
    private labelIndex;
    private creatLabel;
    constructor(skinName: string, nameBtn: string, text: string, style: PIXI.TextStyle, substrate: string, creatLabel: boolean);
    private setMode(newState);
    private onPressBtn();
    private onUpBtn(e);
    private onOverBtn();
    private onOutBtn();
    dataIndex: number;
    isModeCB: boolean;
    enabled: Boolean;
    setPosition(newState: number): void;
    setLabel(str: string): void;
}
declare class ComboBtns extends PIXI.utils.EventEmitter {
    static EXCHANGE_SELECT: string;
    private btns;
    private dataIndex;
    selectIndex: number;
    modeSelector: boolean;
    constructor(btns: Array<BtnPanel>);
    private onBtn(nameBtn);
    selectBtnOnData(dataIndex: number, isDispatch?: boolean): void;
    enabled: Boolean;
}
