class MainSlot {
    public testServer: boolean = false;
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

    public startSlot(gameId: number, partnerid: number, currency: string, userid: string, demo: number, token: string, BackUrl: string): void {
        //мобильный браузер или нет
        this.isMobile = this.isMobileBrowser();

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

        //this.renderer.resolution = window.devicePixelRatio || 2;
        //уродский хак, чтобы маска работала на мобильном устройстве
        if (this.renderer.maskManager as PIXI.MaskManager)
            (this.renderer.maskManager as PIXI.MaskManager).enableScissor = false;

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

    public getTexturesForName(atlasName: string, nameTextures: string, countTextures: number, nameResolution: string = '.png'): PIXI.Texture[] {
        let texrures: PIXI.Texture[] = [];
        let indexName: string = '';
        //console.log(nameTextures);
        for (var i: number = 1; i <= countTextures; i++) {
            indexName = i.toString();
            texrures.push(PIXI.loader.resources[atlasName].textures[nameTextures + indexName + nameResolution]);
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

        this.renderer.view.style.width = (w / this.pixelRatio) + 'px';
        this.renderer.view.style.height = (h / this.pixelRatio)  + 'px';
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


mainSlot = new MainSlot();
