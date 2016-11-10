declare class SlotEnity extends PIXI.Sprite {
    private currentScene;
    protected mainScene: IMainScene;
    protected gamble: IGambleScene;
    protected help: IHelpScene;
    protected bonus: IBonusScene;
    protected superbonus: IBonusScene;
    static NAME_ATLAS_ICON: string;
    constructor();
    showScene(scene: IScene): void;
    removeScene(scene: IScene): void;
    getIsShield(): boolean;
    showHelp(): void;
    hideHelp(): void;
    getHelpScene(): IHelpScene;
}
declare class SceneSlot extends PIXI.Sprite {
    protected mc: PIXI.Sprite;
    protected modelSlot: ModelSlot;
    constructor(mc: PIXI.Sprite);
    protected initDisplay(): void;
}
declare class BScene extends SceneSlot {
    private completeCallback;
    protected isWin: boolean;
    protected summ: number;
    protected selectID: number;
    protected tmm: TextMoneyMove;
    private timeoutComplete;
    protected arSelected: Array<number>;
    protected isBlockSelectedBtn: Boolean;
    constructor(mc: PIXI.Sprite);
    protected getWinTxt(): createjs.Text;
    protected bindProperties(): void;
    protected onCompleteMoveText(): void;
    resetBonus(summ: number, isSb: boolean, completeCallback: Function): void;
    selectBonus(nom: number): void;
    protected nextAction(): void;
    protected completeBonus(arText: Array<PIXI.Text>, time?: number): void;
    protected reBlockBtn(): void;
}
declare class MainScene extends SceneSlot {
    protected rolls: Rolls;
    protected lines: LinesWin;
    protected callbackCompleteRoll: Function;
    protected callbackCompleteLines: Function;
    constructor(mc: PIXI.Sprite);
    protected addRoll(px: number, py: number): void;
    protected onCompleteRolls(): void;
    protected addWinLine(px: number, py: number, LineClass: any): void;
    protected onCompleteShowLine(): void;
    showRollCombination(comb: Array<Array<number>>, callbackCompleteRoll: Function): void;
    showWinLines(ar: Array<number>, isAnimate?: boolean, callbackCompleteLines?: Function): void;
    showWinBonus(): void;
    protected getNumBonus(): number;
    protected getContIndex(ind: number): number;
    showWin(value: number): void;
}
declare class HelpScene extends SceneSlot {
    constructor(mc: PIXI.Sprite);
    protected bindProperties(): void;
    selectBtn(nom: number): void;
    showhelp(): void;
    hideHelp(): void;
}
declare class GambleScene extends SceneSlot {
    protected completeCallback: Function;
    protected dealer: Card;
    protected cards: Array<Card>;
    protected selectNom: number;
    protected resultcards: string;
    protected pick_mc: PIXI.Sprite;
    protected createCards(cardClass: new () => Card): void;
    protected clear(): void;
    protected showAllCard(): void;
    protected generateCardDealer(): void;
    private onResponseStart(e);
    setLastGamble(value: String): void;
    resetGamble(): void;
    getSelectValue(): string;
    resultGamble(result: string): void;
    setSelectValue(type: number): void;
    protected updatePrize(): void;
    useCompleteCallback(completeCallback: Function): boolean;
}
declare class BonusScene extends BScene {
    protected arPrizes: Array<number>;
    protected arBonuses: Array<number>;
    protected isHasShield: boolean;
    protected isAddBombForShild: boolean;
    protected isLose: boolean;
    protected currentPrize: number;
    resetBonus(summ: number, isSb: boolean, completeCallback: Function): void;
    protected getPrizes(s: number, count: number): Array<number>;
    private getMn(v);
}
declare class SuperbonusScene extends BScene {
}
declare class TextMoneyMove extends createjs.EventDispatcher {
    private targetTF;
    private arTF;
    private sourceTF;
    private intervalID;
    private moneyOnStep;
    private resultSum;
    private tween;
    constructor(tf: PIXI.Text);
    startMove(ar: Array<PIXI.Text>): void;
    private nextMove();
    private stepMove();
    private sourceValue;
}
declare class Card extends PIXI.Sprite {
    private mc;
    private suits;
    suit: string;
    value: string;
    Card(suit?: string, value?: string): void;
    protected getSiutsFormat(): Array<string>;
    setCard(suit: string, value?: string): void;
    setCardOnStr(suitValue: String): void;
    protected getCard(suit: string): PIXI.Sprite;
    getRandomCard(startValue?: number): string;
    getSuitValue(): string;
}
declare class CardDefault extends Card {
    protected getCard(suit: string): PIXI.Sprite;
}
declare class Rolls extends PIXI.Sprite {
    static COMPLETE_ROLLS: string;
    private arRoll;
    private counter;
    private rollVO;
    constructor(rollVO: RollVO);
    setCombs(comb: Array<Array<number>>): void;
    showWinBonus(idItem: number): void;
    private onComplete();
}
declare class Roll extends PIXI.Sprite {
    static COMPLETE_ROLL: string;
    private static ICON_ROUTE;
    private static TIME_ON_ICON;
    private rollVO;
    private container;
    private currentComb;
    private targetComb;
    private nomRoll;
    private cacheIcons;
    constructor(nomRoll: number, rollVO: RollVO);
    isHasCombination: boolean;
    setComb(comb: Array<number>): void;
    showWinBonus(idItem: number): void;
    private clear();
    private getIcon(ind);
    private createLine(count);
    private playSound();
    private completeRoll();
    private setContentIcons(ar);
}
declare class IconRoll extends PIXI.Sprite {
    private ic;
    nom: number;
    protected animMc: PIXI.extras.MovieClip;
    private isAnimate;
    constructor(nom: number);
    restart(): void;
    protected getIcon(nom: number): PIXI.Sprite;
    showAnimationWin(): void;
    protected getAnimMc(): PIXI.extras.MovieClip;
}
declare class LinesWin extends PIXI.Sprite {
    static END_BLINK: string;
    private classLine;
    private viewLines;
    private lines;
    private isAnimate;
    private step;
    private g;
    constructor(LineClass: any);
    showLines(lines: Array<number>, isAnimate: boolean): void;
    private showNextLine();
    private getline(ind);
    private onEndBlink();
    clear(): void;
}
declare class LinesEnity extends PIXI.Sprite {
    private static BLINK_INTERVAL;
    private static BLINK_COUNT;
    private countBlinc;
    private index;
    private line;
    constructor(classLine: any, index: number);
    showLine(isAnimate: boolean): void;
    private showBlinkLines();
    private hideBlinkLines();
    private getFrame(fr);
}
declare class AnimationItemVO {
    an: string;
    anRandom: Array<string>;
    timeHide: number;
    randomTime: number;
    completeAnim: Function;
    startAnim: Function;
    completeStop: boolean;
    dispatchComplete: boolean;
    completeFrame: number;
    constructor(data: Object);
    getAnimName(): string;
}
declare class AnimationItem extends PIXI.Sprite {
    static NEXT_ANIMATION: string;
    private mc;
    info: AnimationItemVO;
    private timeoutId;
    nameAn: string;
    private objFrameCallback;
    private rand;
    constructor(mc: PIXI.extras.MovieClip, nameAn: string);
    private onAddToStage();
    private onRemoveFromStage();
    setModeAnimation(info: AnimationItemVO): void;
    private completeAnim();
    private nextAnimation();
    private addFrameScript(fr, frameCallback);
    private onTick();
}
declare class AnimationVO {
    static COMPLETE_TIME: string;
    static COMPLETE_ANIMATION: string;
    anims: Array<AnimationItemVO>;
    nextAnim: number;
    eventComplete: string;
    completeTime: number;
    randomTime: number;
    nameCompleteAnimation: string;
    noReset: boolean;
    setCompleteTime(completeTime: number, randomTime: number, nextAnim: number): void;
    setCompletAnimation(nameAnim: string, nextAnim: number): void;
}
declare class AnimEnity extends PIXI.Sprite {
    private anims;
    private animsCach;
    protected container: PIXI.Sprite;
    private currentNom;
    private animInfo;
    private curAnims;
    private timeoutID;
    isPlayAnimation: boolean;
    private cashMc;
    private rand;
    constructor();
    protected createMc(nameMc: string): PIXI.extras.MovieClip;
    protected getMC(nameMc: string): PIXI.extras.MovieClip;
    protected setAnimsOnNames(ar: Array<string>, mc: PIXI.extras.MovieClip): void;
    protected showAnim(animInfo: Array<AnimationVO>): void;
    private playCurrentAnim();
    protected onCompleteAnimation(e: createjs.Event): void;
    reset(): void;
    protected getAnimByName(nameAnim: string): AnimationItem;
    protected removeAnimByName(nameAnim: string): void;
    protected generateAnim(count: number): Array<AnimationVO>;
}
declare class PanelInfo extends PIXI.utils.EventEmitter {
    protected mc: PIXI.Sprite;
    protected currentMode: string;
    protected intervalID: number;
    protected dictMethod: Object;
    protected counter: number;
    protected curView: PIXI.Sprite;
    protected curValue: String;
    constructor(mc: PIXI.Sprite);
    setMode(mode: string, value?: string): void;
}
declare class PanelInfoMain extends PanelInfo {
    static MODE_ANIM: string;
    static MODE_WIN: string;
    static MODE_TAKE: string;
    static MODE_RISK: string;
    constructor(mc: PIXI.Sprite);
    private showAnimation(value);
    private showNextAnimation();
    private showWin(value);
    private showNextMsgWin();
    private showTake(value?);
    private showMsg(msg, size?);
}
declare class PanelInfoGamble extends PanelInfo {
    static MODE_DOUBLE: string;
    static MODE_MSG: string;
    private m;
    constructor(mc: PIXI.Sprite, m?: number);
    private showDouble(value);
    private showNextDouble();
    private showMsg(value?);
    private showMsgText(msg, size?);
}
interface ISlotEnity extends PIXI.Sprite {
    getPathViewJS(): string;
    getResourseImg(callback: () => void): void;
    showScene(scene: IScene): void;
    removeScene(scene: IScene): void;
    getStateSlotManager(): StateSlotManager;
    getSettingRoll(): RollVO;
    getHelpScene(): IHelpScene;
    getGambleScene(): IGambleScene;
    getBonusScene(): IBonusScene;
    getSuperbonusScene(): IBonusScene;
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
}
interface IHelpScene extends IScene {
    selectBtn(nom: number): void;
    showhelp(): void;
    hideHelp(): void;
}
interface IGambleScene extends IScene {
    setSelectValue(type: number): void;
    resultGamble(result: string): void;
    resetGamble(): void;
    setLastGamble(value: string): void;
    getSelectValue(): string;
    useCompleteCallback(completeCallback: Function): boolean;
}
interface IBonusScene extends IScene {
    resetBonus(summ: number, isSb: boolean, completeCallback: Function): void;
    selectBonus(nom: number): void;
}
