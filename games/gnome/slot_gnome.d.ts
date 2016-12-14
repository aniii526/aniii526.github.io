declare class SlotGnome extends SlotEnity implements ISlotEnity {
    protected loader: PIXI.loaders.Loader;
    constructor();
    getPathViewJS(): string;
    getResourseImg(callback: () => void): void;
    getStateSlotManager(): StateSlotManager;
    getSettingRoll(): RollVO;
    initGame(): void;
    getHelpScene(): IHelpScene;
    getGambleScene(): IGambleScene;
    getBonusScene(): IBonusScene;
    getSuperbonusScene(): IBonusScene;
    getMainScene(): IMainScene;
    getIsShield(): boolean;
}
declare class MainSceneGnome extends MainScene implements IMainScene {
    private tween;
    private infoPanel;
    private index_bets;
    private index_lines;
    private total_bet_stat;
    private info_stat_txt;
    private credit_stat;
    private bet_txt;
    private line_txt;
    private credit_txt;
    private bet1_txt;
    private bet2_txt;
    private soundsManifest;
    constructor();
    protected initDisplay(): void;
    private completeShowLines();
    private exchangeMode(value);
    private updateBalance(value);
    private updateBetLine(type);
    private updateShield();
    protected getNumBonus(): number;
}
declare class HelpSceneGnome extends HelpScene implements IHelpScene {
    constructor();
}
declare class GambleSceneGnome extends GambleScene implements IGambleScene {
    private infoPanel;
    private total_bet_stat;
    private info_stat_txt;
    private credit_stat;
    private bet_txt;
    private prize_txt;
    private win_txt;
    constructor();
    protected initDisplay(): void;
    private exchangeMode(value);
    private showMsgDouble();
    setSelectValue(type: number): void;
    resetGamble(): void;
    protected updatePrize(): void;
}
declare class AnimBonus extends AnimEnity {
    static MODE_WAIT: string;
    static MODE_LOSE: string;
    static MODE_WIN: string;
    static b: PIXI.extras.MovieClip;
    static getMcLib(nameMc: string): PIXI.extras.MovieClip;
    private mc;
    private animName;
    private curMode;
    private isHasShield;
    prize_txt: PIXI.Text;
    private prize;
    constructor();
    protected createMc(nameMc: string): PIXI.extras.MovieClip;
    reset(): void;
    setMode(value: string, isHasShield: boolean, valuePrize?: number): void;
    private startAnim(nameAnim, mcAnim);
    private getWithShield(str);
}
declare class AnimSuperbonus extends AnimEnity {
    static MODE_WAIT: string;
    static MODE_LOSE: string;
    static MODE_WIN: string;
    private animName;
    private curMode;
    private prize;
    prize_txt: PIXI.Text;
    static b: PIXI.extras.MovieClip;
    static getMcLib(nameMc: string): PIXI.extras.MovieClip;
    constructor(mc: PIXI.extras.MovieClip);
    protected createMc(nameMc: string): PIXI.extras.MovieClip;
    reset(): void;
    setMode(value: string, valuePrize?: number): void;
    private completeAnim(nameAnim, mcAnim);
}
declare class BonusSceneGnome extends BonusScene implements IBonusScene {
    private animBonus;
    private anims;
    private arTextPrizes;
    private X_ANIM;
    constructor();
    private onCompleteAnimation();
    resetBonus(summ: number, isSb: boolean, completeCallback: Function): void;
    private setPositionGnome(pos);
    selectBonus(nom: number): void;
    private setBombForShield(isRand?);
}
declare class SuperbonusSceneGnome extends SuperbonusScene implements IBonusScene {
    private arBtn;
    private anim;
    private anims;
    prizeTxt: PIXI.Text;
    constructor();
    private onCompleteAnimation();
    resetBonus(summ: number, isSb: boolean, completeCallback: Function): void;
    selectBonus(nom: number): void;
}
declare var slotGnome: SlotGnome;
