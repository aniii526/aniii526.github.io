declare class ModelSlot {
    static MODE_ERROR: string;
    static MODE_DEBIT: string;
    static MODE_READY: string;
    static MODE_ROUTE: string;
    static MODE_ROUTE_WIN: string;
    static MODE_HELP: string;
    static MODE_GAMBLE: string;
    static MODE_GAMBLE_CHOICE: string;
    static MODE_GAMBLE_WIN: string;
    static MODE_GAMBLE_LOSE: string;
    static MODE_BONUS: string;
    static MODE_BONUS_CHOICE: string;
    static MODE_SUPERBONUS: string;
    static MODE_BONUS_SPEC: string;
    static ID_WIN_ROUTE: number;
    static ID_WIN_GAMBLE: number;
    static ID_LOSE: number;
    static ID_BONUS_WIN: number;
    static ID_BONUS_WIN_SB_NO: number;
    static ID_BONUS_WIN_SB: number;
    static ID_GAMBLE_START: number;
    static ID_BONUSSPEC_WIN: number;
    path_server: string;
    path_server_demo: string;
    Token: string;
    TokenAsync: string;
    KeyHash: string;
    gameId: number;
    partnerid: number;
    currency: string;
    userid: string;
    demo: number;
    BackUrl: string;
    settingRoll: RollVO;
    lastAction: ActionVO;
    bets: Array<number>;
    koeffs: Array<number>;
    combination: Array<Array<number>>;
    lineMax: number;
    balance: number;
    error: number;
    modeLine: number;
    typeBet: number;
    currentWin: number;
    summInput: number;
    isAutoMode: boolean;
    shield: boolean;
    stateSlotManager: StateSlotManager;
    init(): void;
    amountBet: number;
    totalBet: Number;
    maxBet: Number;
    setBet(type: number): void;
    compactBalance: string;
    getStepGamble(multipiler?: number): number;
    setError(code: number, msg: String): Boolean;
}
declare class BaseVO extends createjs.EventDispatcher {
    Balance: Number;
    Msg: String;
    Token: String;
    constructor();
    setData(obj: Object): void;
    protected setSpecialValue(pole: string, value: any): boolean;
}
declare class RollVO {
    count_icon: number;
    count_row: number;
    count_roll: number;
    step_x: number;
    step_y: number;
    width: number;
    height_mask: number;
    filterIcon: Array<number>;
    diffIconRoute: number;
    getRandomIndex(): number;
}
declare class ActionVO extends BaseVO {
    Action: number;
    Summ: number;
    SummAux: number;
    SummInput: number;
    CombinationSpin: string;
    CombinationAux: string;
    WinLines: Array<number>;
    Info: string;
    constructor(data: Object);
    parseCombinationRoll(): Array<Array<number>>;
    getCountIndex(ind: number): number;
    protected setSpecialValue(pole: string, value: any): boolean;
}
declare class StateSlotManager extends createjs.EventDispatcher {
    private current;
    currentMode: string;
    dictionaryStateSlot: Object;
    constructor();
    protected generateDictionary(): void;
    addStateSlot(mode: string, stateSlot: StateSlot): void;
    setCurrentModeSlot(mode: string, data?: Object): void;
    setModeOnActionID(action: ActionVO): void;
    getCurrent(): StateSlot;
}
declare class StateSlotManagerDefault extends StateSlotManager {
    protected generateDictionary(): void;
}
declare class StateSlot extends createjs.EventDispatcher {
    main: StateSlotManager;
    nameMode: String;
    data: Object;
    protected model: ModelSlot;
    protected slotGame: ISlotEnity;
    protected panel: PanelAdapter;
    constructor();
    exitStateSlot(newStateSlot: StateSlot): void;
    runStateSlot(oldStateSlot: StateSlot): void;
    downStart(): void;
    downGamble1(): void;
    downGamble2(): void;
    downSelectBtn(nom: number): void;
}
declare class StateSlotError extends StateSlot {
}
declare class StateSlotReady extends StateSlot {
    private isFirst;
    constructor();
    private autoStart(value);
    runStateSlot(oldStateSlot: StateSlot): void;
    downStart(): void;
    downGamble1(): void;
    downGamble2(): void;
    private getRandomCombination();
    downSelectBtn(nom: number): void;
}
declare class StateSlotDebit extends StateSlot {
    runStateSlot(oldStateSlot: StateSlot): void;
    private onDebitGame(e);
}
declare class StateSlotRoute extends StateSlot {
    private action;
    runStateSlot(oldStateSlot: StateSlot): void;
    private onSpinCommand(e);
    private completeSpinAnimation();
}
declare class StateSlotRouteWin extends StateSlot {
    private mainScene;
    private tween;
    runStateSlot(oldStateSlot: StateSlot): void;
    private completeShowLines();
    exitStateSlot(newStateSlot: StateSlot): void;
    downGamble1(): void;
    downGamble2(): void;
    protected goGamble(): void;
    downStart(): void;
    private clearTimeout();
}
declare class StateSlotGamble extends StateSlot {
    protected gamble: IGambleScene;
    downSelectBtn(nom: number): void;
    runStateSlot(oldStateSlot: StateSlot): void;
    exitStateSlot(newStateSlot: StateSlot): void;
    downStart(): void;
}
declare class StateSlotGambleChoice extends StateSlot {
    private action;
    runStateSlot(oldStateSlot: StateSlot): void;
    private onGamble(e);
}
declare class StateSlotGambleWin extends StateSlotGamble {
    runStateSlot(oldStateSlot: StateSlot): void;
    private completeCallback();
    private timeoutModeGamble();
}
declare class StateSlotGambleLoose extends StateSlotGamble {
    runStateSlot(oldStateSlot: StateSlot): void;
    private completeCallback();
    private timeoutModeReady();
}
declare class StateSlotBonus extends StateSlot {
    runStateSlot(oldStateSlot: StateSlot): void;
    private onCompleteSound(e);
    private showTimerBonus();
}
declare class StateSlotBonusChoice extends StateSlot {
    protected bonus: IBonusScene;
    runStateSlot(oldStateSlot: StateSlot): void;
    private isSuperbonus;
    private completeBonus();
    exitStateSlot(newStateSlot: StateSlot): void;
    downSelectBtn(nom: number): void;
}
declare class StateSlotSuperbonus extends StateSlot {
    protected bonus: IBonusScene;
    runStateSlot(oldStateSlot: StateSlot): void;
    exitStateSlot(newStateSlot: StateSlot): void;
    private completeBonus();
    private isWin;
    downSelectBtn(nom: number): void;
}
