class MainSlot {
    public testServer: boolean = false;

    //public mainCanvas: HTMLCanvasElement;
    //public mainStage: createjs.Stage;

    public model: ModelSlot;
    public panel: PanelAdapter;
    public slot: ISlotEnity;
    private lastSize: string;

    private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    public mainStage: PIXI.Container;
    private bunny: any;
    private fon: PIXI.Sprite;
    private ratio: number;
    private stats: Stats;
    private mc: PIXI.extras.MovieClip;

    //словарь в котором соотносятся текстуры с именами.
    public atlasPanel: PIXI.loaders.TextureDictionary;
    public isMobile: boolean = true;
    public pixelRatio: number = 1;

    constructor() {

    }

    public startSlot(gameId: number, partnerid: number, currency: string, userid: string, demo: number, token: string): void {
        //PIXI.

        
        this.model = new ModelSlot();
        this.model.gameId = gameId;
        this.model.partnerid = partnerid;
        this.model.currency = currency;
        this.model.userid = userid;
        this.model.demo = demo;
        this.model.Token = token;

        //мобильный браузер или нет
        this.isMobile = this.isMobileBrowser();

        soundManager = new SoundManager();

        //let size = [1280, 720];
        let size: number[] = (this.isMobile) ? [1180, 632] : [1024, 720];

        this.ratio = size[0] / size[1];

        this.renderer = PIXI.autoDetectRenderer(size[0], size[1], null);
        this.renderer.view.style.position = 'absolute';
        this.renderer.view.style.left = '50%';
        this.renderer.view.style.top = '50%';
        this.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
        this.renderer.backgroundColor = 0x02274A;
        //this.renderer
        document.body.children["viewporter"].appendChild(this.renderer.view);

        this.renderer.resolution = window.devicePixelRatio || 2;
        //чет не робит) 
        //this.pixelRatio = (window.devicePixelRatio ? window.devicePixelRatio : 1);

        this.mainStage = new PIXI.Container();

        

        if (!this.isMobile) {
            window.addEventListener('resize', () => { this.resize(); }, false);
            this.resize();
        } else {
            if (viewporter.ACTIVE) {
                window.addEventListener('viewportready', () => { this.onOrientationChanged(); }, false);
                window.addEventListener('viewportchange', () => { this.onOrientationChanged(); }, false);
            } else {
                window.addEventListener('orientationchange', () => { this.onOrientationChanged(); }, false);
            }

            this.onOrientationChanged();
        }

        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = "fixed";
        //this.stats.domElement.style.right = "0px";
        this.stats.domElement.style.top = "0px";
        document.body.appendChild(this.stats.domElement);

        this.animate();
        //this.resize();

        var qc: InitCommand = new InitCommand();
        qc.addEventListener(EVENT_COMPLETE, () => { this.completeInitCommad(); });
        qc.execute();
    }

    public isMobileBrowser = function () {
        if (window["orientation"] != undefined) {
            return true;
        }

        var check = false;
        /*(function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true;
        })(navigator.userAgent || navigator.vendor || window["opera"]);*/

        //поправил ip(hone|ad|od) - так как раньше ipad не отображался как мобильное устройство.
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|ad|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true;
        })(navigator.userAgent || navigator.vendor || window["opera"]);

        return check;
    };

    public onOrientationChanged() {
        this.resize();
    }

    private animate() {
        // start the timer for the next animation loop
        requestAnimationFrame(() => this.animate());

        // this is the main render call that makes pixi draw your container and its children.
        this.renderer.render(this.mainStage);

        this.stats.update();
    }

    public getTexturesForName(atlasName:string, nameTextures: string, countTextures: number): PIXI.Texture[] {
        let texrures: PIXI.Texture[] = [];
        let indexName: string = '';

        for (var i: number = 1; i <= countTextures; i++) {
            indexName = i.toString();
            if (indexName.length == 1) {
                indexName = "0" + indexName;
            }
            texrures.push(PIXI.loader.resources[atlasName].textures[nameTextures + indexName + ".png"]);
        }

        return texrures;
    }

    public resize() {
        let w: number;
        let h: number;
        if (document.documentElement.clientWidth / document.documentElement.clientHeight >= this.ratio) {
            w = Math.ceil(document.documentElement.clientHeight * this.ratio);
            h = Math.ceil(document.documentElement.clientHeight);
        } else {
            w = Math.ceil(document.documentElement.clientWidth);
            h = Math.ceil(document.documentElement.clientWidth / this.ratio);
        }

        //console.log(w, h);

        this.renderer.view.style.width = (w / this.pixelRatio) + 'px';
        this.renderer.view.style.height = (h / this.pixelRatio)  + 'px';
    }

    public completeInitCommad(): void {
        this.panel.panel.getContainer().addChild(this.slot);
        this.model.init();
    }

    public setSlot(slot: ISlotEnity): void {
        this.slot = slot;
    }

    /*public resize(): void {
        if (this.lastSize != this.getHashSize() && this.panel != null && this.panel.panel != null) {
            this.lastSize = this.getHashSize();
            this.mainCanvas.width = window.innerWidth;
            this.mainCanvas.height = window.innerHeight;
            this.panel.panel.resizePanel(window.innerWidth, window.innerHeight);
        }

        console.log("resize  " + window.innerWidth, window.innerHeight);
        console.log("canvas " + this.mainCanvas.width + "  " + this.mainCanvas.height);
    }*/

    private getHashSize(): string {
        return "" + window.innerWidth + window.innerHeight;
    }


    private tickHandler(): void {
        //console.log(createjs.Ticker.getMeasuredFPS());
    }

    public bindSetter(host, property, callback) {
        if (!host[property + "_bindings"]) {
            host[property + "_bindings"] = [];
            host["_" + property] = host[property];
            Object.defineProperty(host, property, {
                get: function () {
                    return host["_" + property];
                },
                set: function (newValue) {
                    host["_" + property] = newValue;
                    host[property + "_bindings"].forEach(function (callback) {
                        callback(newValue);
                    });
                }
            });
        }
        host[property + "_bindings"].push(callback);
        callback(host[property]);
    }

    public unbindSetter(host, property, callback) {
        var bindings = host[property + "_bindings"];
        if (bindings) {
            var index = bindings.indexOf(callback);
            if (index > -1) {
                bindings.splice(index, 1);
            }
        }
    }
}

//-------------------------------------------------------------------------------------------

class SoundManager {
    public static SOUND_BONUS: string = "bonus";
    public static SOUND_CARD_OPEN: string = "card_dealer_open";
    public static SOUND_CARDWIN: string = "cardwin";
    public static SOUND_KEY_PRESS: string = "key_press";
    public static SOUND_MONEY_MOVE: string = "money_move";
    public static SOUND_ROUTESTART: string = "route1time";
    public static SOUND_ROUTESTOP: string = "routestop";
    public static SOUND_ADDLINE: string = "addline";

    public volume: number = 0.5;
    private _isMute: boolean = false;
    private soundsList: Array<SoundEnity> = new Array<SoundEnity>();

    public loadSounds(sounds: Array<Object>): void {
        createjs.Sound.addEventListener("fileload", this.handleFileLoad);
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerSounds(sounds);
    }

    private handleFileLoad(event) {
        //console.log("Preloaded:", event.id, event.src);
    }


    public playSound(name_sound: string, isRemove: boolean = true, loop: number = 1, volume: number = -1): SoundEnity {
        if (this._isMute)
            volume = 0;
        if (volume < 0)
            volume = this.volume;

        if (isRemove) {
            this.stopSound(name_sound);
        }
        var s: SoundEnity = new SoundEnity(name_sound, loop, volume);
        s.addEventListener(SoundEnity.COMPLETE_SOUND, (e: createjs.Event) => { this.onCompleteSound(e) });
        this.soundsList.push(s);
        return s;
    }

    public onCompleteSound(e: createjs.Event): void {
        var s: SoundEnity = e.currentTarget as SoundEnity;
        var ind: number = this.soundsList.indexOf(s);
        if (ind != -1) {
            this.soundsList.splice(ind, 1);
        }
    }

    public stopSound(name_sound: string): void {
        var ar: Array<SoundEnity> = new Array<SoundEnity>();
        for (var i: number = 0; i < this.soundsList.length; i++) {
            if (this.soundsList[i].name_sound == name_sound)
                ar.push(this.soundsList[i]);
        }

        for (i = 0; i < ar.length; i++) {
            ar[i].completeSound();
        }
    }

    public stopAllSound(): void {
        while (this.soundsList.length) {
            this.soundsList[0].completeSound();
        }
    }

    set isMute(value: boolean) {
        this._isMute = value;
        if (this._isMute)
            this.stopAllSound();
    }
    get isMute(): boolean {
        return this._isMute;
    }
}

//-------------------------------------------------------------------------------------------

class SoundEnity extends createjs.EventDispatcher {
    public static COMPLETE_SOUND: string = "complete_sound";
    public isPlayed: boolean;

    public name_sound: string;
    private volume: number;
    private loop: number;
    private sound: createjs.AbstractSoundInstance;

    constructor(name_sound: string, loop: number = 1, volume: number = 1) {
        super();
        this.name_sound = name_sound;
        this.volume = volume;
        this.loop = loop;

        this.startSound();
    }

    private startSound(): void {
        //console.log(this.name_sound + " startSound");
        //console.log(this.name_sound, 0, 0, this.loop, this.volume);
        this.isPlayed = true;

        this.sound = createjs.Sound.play(this.name_sound, "none", 0, 0, this.loop - 1, this.volume);
        this.sound.addEventListener(EVENT_COMPLETE, () => { this.onCompleteSound() });
    }
    private onCompleteSound(): void {
        //console.log(this.name_sound + " onCompleteSound");
        this.isPlayed = false;
        this.sound.removeEventListener(EVENT_COMPLETE, () => { this.onCompleteSound() });

        this.sound = null;
        this.dispatchEvent(SoundEnity.COMPLETE_SOUND);
    }


    public completeSound(): void {
        if (this.sound != null) {
            this.sound.stop();
            this.onCompleteSound();
        }
    }
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

EVENT_COMPLETE = "complete";
EVENT_ONLOAD = "onload";
EVENT_CLICK = "click";
EVENT_MOUSEDOWN = "mousedown ";
EVENT_PRESSUP = "pressup";
EVENT_ROLLOVER = "rollover";
EVENT_ROLLOUT = "rollout ";

mainSlot = new MainSlot();


loadJS = function (path: string, callback: () => void): void {
    console.log("loadjs -> " + path);
    var js_load = document.createElement("script");
    js_load.type = "text/javascript";
    js_load.src = path;
    js_load.onload = function (script) {
        console.log("loaded " + path);
        if (callback)
            callback.call(this);
    }
    document.getElementsByTagName('head')[0].appendChild(js_load);
}
loadJSManifest = function (path: string, callback: () => void): void {
    loadJS(path, () => {
        loadManifest(() => {
            callback();
        });
    });
}

loadManifest = function (callback: () => void): void {
    var loader = new createjs["LoadQueue"]();
    loader.addEventListener("fileload", (evt: any) => {
        if (evt.item.type == "image")
            images[evt.item.id] = evt.result;
    });
    loader.addEventListener("complete", () => {
        var ssMetadata = lib.ssMetadata;
        if (ssMetadata != null) {
            for (var i = 0; i < ssMetadata.length; i++) {
                var t = images[ssMetadata[i].name];
                var g = ssMetadata[i].frames;
                var sp = new createjs.SpriteSheet({ "images": [t], "frames": g });
                ss[ssMetadata[i].name] = sp;
            }
        }

        callback.call(this);
    });
    loader.loadManifest(lib.properties.manifest);
}

