declare class MainSlot {
    testServer: boolean;
    model: ModelSlot;
    panel: PanelAdapter;
    slot: ISlotEnity;
    private lastSize;
    private renderer;
    mainStage: PIXI.Container;
    private bunny;
    private fon;
    private ratio;
    private stats;
    private mc;
    atlasPanel: PIXI.loaders.TextureDictionary;
    isMobile: boolean;
    pixelRatio: number;
    constructor();
    startSlot(gameId: number, partnerid: number, currency: string, userid: string, demo: number, token: string, BackUrl: string): void;
    isMobileBrowser: () => boolean;
    onOrientationChanged(): void;
    private animate();
    getTexturesForName(atlasName: string, nameTextures: string, countTextures: number): PIXI.Texture[];
    resize(): void;
    completeInitCommad(): void;
    setSlot(slot: ISlotEnity): void;
    private getHashSize();
    private tickHandler();
    bindSetter(host: any, property: any, callback: any): void;
    unbindSetter(host: any, property: any, callback: any): void;
}
declare class SoundManager {
    static SOUND_BONUS: string;
    static SOUND_CARD_OPEN: string;
    static SOUND_CARDWIN: string;
    static SOUND_KEY_PRESS: string;
    static SOUND_MONEY_MOVE: string;
    static SOUND_ROUTESTART: string;
    static SOUND_ROUTESTOP: string;
    static SOUND_ADDLINE: string;
    volume: number;
    private _isMute;
    private soundsList;
    loadSounds(sounds: Array<Object>): void;
    private handleFileLoad(event);
    playSound(name_sound: string, isRemove?: boolean, loop?: number, volume?: number): SoundEnity;
    onCompleteSound(e: createjs.Event): void;
    stopSound(name_sound: string): void;
    stopAllSound(): void;
    isMute: boolean;
}
declare class SoundEnity extends createjs.EventDispatcher {
    static COMPLETE_SOUND: string;
    isPlayed: boolean;
    name_sound: string;
    private volume;
    private loop;
    private sound;
    constructor(name_sound: string, loop?: number, volume?: number);
    private startSound();
    private onCompleteSound();
    completeSound(): void;
}
