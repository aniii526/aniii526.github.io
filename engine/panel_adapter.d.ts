declare class PanelAdapter extends PIXI.utils.EventEmitter {
    panel: IPanel;
    private indexlines;
    protected dictBlockBtns: Object;
    private lastArBlockCombo;
    private ishelp;
    private modelSlot;
    constructor();
    setPanel(panel: IPanel): void;
    panelMc: PIXI.Sprite;
    hidePanelLoader(): void;
    private setBlocks();
    initPanel(): void;
    setBlockTypeBtn(mode: string, m: ModePanelShow): void;
    updateBetLine(type: number): void;
    private blockMode(mode);
    outClickBtn(e: PanelEvent): void;
    private onPanelEvent(e?);
    showhelp(): void;
    setModeComboBet(nom: number): void;
    blockBtnByType(nameBtn: string, isBlock?: boolean): void;
    blockLineBtn(nom: number, isBlock?: boolean): void;
    blockAll(): void;
    blockComboBtns(): void;
    reBlock(arBlockCombo?: Array<number>): void;
    getNomBtnLine(countLine: number): number;
    getIndexline(ind: number): number;
    private blockOnMode(mode);
}
declare class ModePanelShow {
    buttons: Array<string>;
    lines: Array<number>;
    constructor(buttons: Array<string>, lines: Array<number>);
}
declare class PanelEvent extends PIXI.interaction.InteractionData {
    static FULL_SCREEN: string;
    static HELP: string;
    static SELECT_GAME: string;
    static AUTO: string;
    static BETONE: string;
    static MAXBET: string;
    static START: string;
    static MUTE: string;
    static SELECT_LINE: string;
    static PANEL_EVENT: string;
    eventBtn: string;
    line: number;
    constructor(eventBtn: string, line?: number);
}
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
}
