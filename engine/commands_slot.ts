class Command extends createjs.EventDispatcher {
    public data: Object;
    private static cache: Array<Command> = [];

    protected _complete: boolean;
    public get complete(): boolean { return this._complete; }
    protected _executing: boolean;
    public get executing(): boolean { return this._executing; }

    protected type: string;

    constructor(type: string) {
        super();
        this.type = type;
    }

    public execute(): void {
        if (this.executing || this.complete)
            return;

        this._executing = true;

        if (Command.cache.indexOf(this) == -1) {
            Command.cache.push(this);
        }
        this.execInternal();
    }
    protected reset(): void {
        this._complete = false;
    }
    protected execInternal(): void {
    }
    protected notifyComplete(): void {
        this._executing = false;

        if (!this.complete) {
            var index: number = Command.cache.indexOf(this);
            if (index > -1) {
                Command.cache.splice(index, 1);
            }
            this._complete = true;

            this.dispatchEvent(EVENT_COMPLETE);
        }
    }
    public terminate(): void {
        this.notifyComplete();
    }
}

//-------------------------------------------------------------------------------------------

class QueueCommand extends Command {
    public static COMMAND_COMPLETE: string = "commandComplete";

    public queue: Array<Command> = [];

    private _completedCommand: Command;
    public get completedCommand(): Command { return this._completedCommand; }

    protected _runningCommand: Command = null;
    public get runningCommand(): Command { return this._runningCommand; }

    protected total: number;
    protected dispatchProgress: boolean = true;


    public add(c: Command): Command {
        this.queue[this.queue.length] = c;
        this._complete = false;
        return c;
    }

    public addList(arr: Array<Command>): void {
        this.queue = this.queue.concat(arr);
        this._complete = false;
    }

    protected execInternal(): void {
        this.total = this.queue.length;

        this.run();
    }

    protected run(): void {
        if (this.complete)
            return;

        if (this.queue.length > 0) {
            if (!this._runningCommand) {
                var c: Command = this.queue.shift();
                this._runningCommand = c;
                c.addEventListener(EVENT_COMPLETE, () => { this.onCommandComplete(); });
                c.execute();
            }
        }
        else {
            if (!this._runningCommand)
                this.notifyComplete();
        }
    }

    protected onCommandComplete(): void {
        this._completedCommand = this._runningCommand;
        this._runningCommand.removeEventListener(EVENT_COMPLETE, this.onCommandComplete);
        this._runningCommand = null;

        this.dispatchEvent(QueueCommand.COMMAND_COMPLETE);
        // if (this.dispatchProgress)
        //     this.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, total - queue.length, total));

        this.run();
    }

    protected reset(): void {
        this.queue = [];
        super.reset();
    }

    public terminate(): void {
        this.reset();
        if (this.runningCommand != null) {
            this.runningCommand.removeEventListener(EVENT_COMPLETE, this.onCommandComplete);
            this.runningCommand.terminate();
        }
        super.terminate();
    }


    public removeCommand(cmd: Command): void {
        this.queue.splice(this.queue.indexOf(cmd), 1);
        this.total--;
        cmd.terminate();
    }

}

//-------------------------------------------------------------------------------------------

class GetTokenCommand extends Command {
    constructor() {
        super("GetTokenCommand");
    }
    protected execInternal(): void {

        console.log(mainSlot.model.Token == null);
        console.log(!mainSlot.testServer);

        if (mainSlot.model.Token == null && !mainSlot.testServer) {
            //this.sendToPath("http://192.168.10.125:9055/ExternalService.svc/GetToken?UserId=" + mainSlot.model.userid);
            //this.sendToPath("https://partners.1xbet.org/1xSlotsTest/GetToken?UserId=" + mainSlot.model.userid);
            
            this.sendToPath("https://192.168.12.9:4275/ExternalService.svc/GetToken?UserId=" + mainSlot.model.userid);
            //mainSlot.model.Token = "66398a0a-e72c-46c8-ad79-37c8331b5ec3";
            this.notifyComplete();
        }
        else
            this.notifyComplete();
    }

    private sendToPath(url: string): void {
        $.get(url, (data, status) => {
            mainSlot.model.Token = data;
            this.notifyComplete();
        });
    }
}

//-------------------------------------------------------------------------------------------

class ConnectCommand extends Command {
    
    protected param: Object = new Object();

    constructor(type: string) {
        super(type);
        //this.type = type;
    }

    protected execInternal(): void {

        this.param["IdPartner"] = mainSlot.model.partnerid;
        this.param["Hash"] = this.getHash();
        this.sendData();
    }

    protected getHash(): string {
        return "no hash";
    }

    protected sendData(): void {
        var path = mainSlot.model.path_server + "" + this.type;
        this.sendToPath(path);
    }

    private sendToPath(urlPath: string): void {
        var dataReq: string = JSON.stringify(this.param);

       /* $.ajaxSetup({
            contentType: "application/json; charset=utf-8"
        });
        $.post(urlPath, this.param);*/
       
       $.ajax({
            url: urlPath,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            headers: { 'Content-Type': 'application/json' },
           // processData: true,
            success: (msg) => { this.processData(msg);},
            error: function (result) {
                //alert('Service call failed: ' + result.status + '' + result.statusText);
            },

            data: dataReq
        });
    }

    protected processData(response: Object): void {
        if (!(this instanceof GetAsyncResponse) && response["TokenAsync"] != null && response["Timeout"] != null)
        {
            var cmd: GetAsyncResponse = new GetAsyncResponse(response["TokenAsync"], response["Timeout"]);
            cmd.addEventListener(ServerResponseEvent.RESPONSE, (e: ServerResponseEvent) => { this.onCompleteAsync(e);});
            setTimeout(() => { cmd.execute() }, response["Timeout"]);
        }
        else
		{

            if (response["Token"] != null)
                mainSlot.model.Token = response["Token"];
            if (response["Balance"] != null)
                mainSlot.model.balance = response["Balance"];
            if (response["Error"]!= null && mainSlot.model.setError(response["Error"], response["Msg"]))
                return;

            this.completeConnect(response);
        }
    }

    private onCompleteAsync(e:ServerResponseEvent):void
	{
        this.processData(e.data);
    }


    protected completeConnect(obj: Object): void {
        this.dispatchEvent(new ServerResponseEvent(obj));
        this.notifyComplete();
    }
}

//-------------------------------------------------------------------------------------------

class ServerResponseEvent extends createjs.Event {
    public static RESPONSE: string = "response";
    public data: any;

    constructor(data: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(ServerResponseEvent.RESPONSE, bubbles, cancelable);
        this.data = data;
    }
}

//-------------------------------------------------------------------------------------------

class AuthorizationGame extends ConnectCommand {
    constructor() {
        super("AuthorizationGame");
    }

    protected execInternal(): void {
        if (mainSlot.testServer) {
            var str: string = '{"Error":0,"Msg":"Не завершенная игра","Action":"7","Balance":100973.74,"CombinationSpin":"3;3;6;8;8&5;1;1;9;1&2;8;8;9;9","Currency":"USD","GameId":22,"Round":1825,"Summ":0,"SummAux":0,"Token":"bc52a2e3-77a8-44ef-823d-f46246b06bee"} ';
            //var str: string = '{"Error":16,"Msg":"Не завершенная игра","Action":"31","Balance":100973.74,"CombinationSpin":"3;3;6;8;8&5;1;1;9;1&2;8;8;9;9","Currency":"USD","GameId":22,"Round":1825,"Summ":0,"SummAux":0,"Token":"bc52a2e3-77a8-44ef-823d-f46246b06bee"} ';
            var obj: Object = JSON.parse(str);
            this.processData(obj);
            return;
        }
        this.param["IdGame"] = mainSlot.model.gameId;
        this.param["UserId"] = mainSlot.model.userid;
        super.execInternal();
    }

    protected getHash(): string {
        this.param["Token"] = mainSlot.model.Token;
        return $["md5"]("AuthorizationGame/" + mainSlot.model.userid + mainSlot.model.Token + mainSlot.model.KeyHash);
    }

    protected completeConnect(obj: Object): void {
        if (obj["Error"]) {

        }

        if (obj["Action"]) {
            var action: ActionVO = new ActionVO(obj);
            mainSlot.model.lastAction = action;
            if (action.CombinationSpin)
                mainSlot.model.combination = action.parseCombinationRoll();
            if (action.Highlight)
                mainSlot.model.highlight = action.parseCombinationHighlight();
            if (action.Summ)
                mainSlot.model.currentWin = action.Summ;
            if (action.SummInput)
                mainSlot.model.summInput = action.SummInput;

            /*this.panel.blockAll();
            this.panel.hideAll();*/
        }
        super.completeConnect(obj);
    }
}

//-------------------------------------------------------------------------------------------

class BalanceGame extends ConnectCommand {
    constructor() {
        super("BalanceGame");
    }

    protected getHash(): string {
        this.param["Token"] = mainSlot.model.Token;
        var str: string = "BalanceGame/" + mainSlot.model.Token + mainSlot.model.KeyHash;
        return $["md5"](str);
    }
}

//-------------------------------------------------------------------------------------------

class DebitGame extends ConnectCommand {
    public action: ActionVO;
    constructor() {
        super("DebitGame");
    }

    protected getHash(): string {
        this.param["Token"] = mainSlot.model.Token;
        var str: String = "DebitGame/" + mainSlot.model.Token + mainSlot.model.KeyHash;
        return $["md5"](str);
    }

    protected completeConnect(obj: Object): void {
        this.action = new ActionVO(obj);

        super.completeConnect(this.action);
    }
}

//-------------------------------------------------------------------------------------------

class CreditGame extends ConnectCommand {
    public action: ActionVO;

    constructor(cntLine: number, summa: number) {
        super("CreditGame");
        this.param["CntLineBet"] = cntLine;
        this.param["Summa"] = summa;
    }

    protected getHash(): string {
        this.param["Token"] = mainSlot.model.Token;
        var str: string = "CreditGame/" + mainSlot.model.Token + mainSlot.model.KeyHash;
        return $["md5"](str);
    }

    protected completeConnect(obj: Object): void {
        this.action = new ActionVO(obj);
        super.completeConnect(this.action);
    }
}

//-------------------------------------------------------------------------------------------

class GambleEndGame extends ConnectCommand {
    constructor(clickUser: string) {
        super("GambleEndGame");
        this.param["ClickUser"] = clickUser;
    }

    protected getHash(): string {
        this.param["Token"] = mainSlot.model.Token;
        var str: String = "GambleEndGame/" + mainSlot.model.Token + this.param["ClickUser"] + mainSlot.model.KeyHash;
        return $["md5"](str);
    }

    protected completeConnect(obj: Object): void {
        super.completeConnect(new ActionVO(obj));
    }
}

//-------------------------------------------------------------------------------------------

class GambleGame extends ConnectCommand {
    public action: ActionVO;

    constructor(comb: string) {
        super("GambleGame");
        this.param["CombinationBet"] = comb;
    }

    protected getHash(): string {
        this.param["Token"] = mainSlot.model.Token;
        var str: String = "GambleGame/" + mainSlot.model.Token + mainSlot.model.KeyHash;
        return $["md5"](str);
    }

    protected completeConnect(obj: Object): void {
        this.action = new ActionVO(obj);

        super.completeConnect(this.action);
    }
}

//-------------------------------------------------------------------------------------------

class GambleStartGame extends ConnectCommand {
    constructor() {
        super("GambleStartGame");
    }
    protected getHash(): string {
        this.param["Token"] = mainSlot.model.Token;
        var str: String = "GambleStartGame/" + mainSlot.model.Token + mainSlot.model.KeyHash;
        return $["md5"](str);
    }

    protected completeConnect(obj: Object): void {
        super.completeConnect(new ActionVO(obj));
    }
}

//-------------------------------------------------------------------------------------------

class GetAsyncResponse extends ConnectCommand {
    private counter: number = 0;
    private timeout: number;


    constructor(tokenAsync: string, timeout: number) {
        super("GetAsyncResponse");

        this.timeout = timeout;
        this.param["TokenAsync"] = tokenAsync;
    }

    protected getHash(): string {
        var str: String = "AsyncResponse/" + this.param["TokenAsync"] + mainSlot.model.KeyHash;
        return $["md5"](str);
    }

    protected completeConnect(obj: Object): void {
        if (obj["Error"] == 13) {
            this.counter++;
            if (this.counter < 26)
                createjs.Tween.get(this).wait(this.timeout).call(() => { this.sendData(); });
            else
                mainSlot.model.setError(14, "Превышено количество запросов ожидания");
        }
        else
            super.completeConnect(obj);
    }
}

//-------------------------------------------------------------------------------------------

class GetGameInfo extends ConnectCommand {
    constructor() {
        super("GetGameInfo");
    }

    protected execInternal(): void {
        if (mainSlot.testServer) {          
            var str: string = '{"Error":0,"Bets":[0.02,0.03,0.05,0.07,0.1,0.25,0.3,0.5,0.75,1,1.25,1.5],"Koeffs":[],"LineMax":9,"PayTable":["1:100,25,5","2:100,25,5","3:100,25,5","4:150,40,5","5:150,40,5","6:750,100,30,5","7:2000,400,40,5","8:5000,1000,100,10","9:2000,200,20"]}' ;
            var obj: Object = JSON.parse(str);
            this.processData(obj);
            return;
        }
        this.param["IdGame"] = mainSlot.model.gameId;
        this.param["IdPartner"] = mainSlot.model.partnerid;
        this.param["Currency"] = mainSlot.model.currency;

        super.execInternal();
    }

    protected getHash(): string {
        var str: string = "GetGameInfo/" + mainSlot.model.partnerid + mainSlot.model.currency + mainSlot.model.KeyHash;
        return $["md5"](str);
    }

    protected completeConnect(obj: Object): void {
        mainSlot.model.bets = obj["Bets"];
        mainSlot.model.koeffs = obj["Koeffs"];
        mainSlot.model.lineMax = obj["LineMax"];
        mainSlot.model.payTable = obj["PayTable"];
        //тут парсю payTable в mainSlot.model.payTableVO c разбором, для показа.
        mainSlot.model.payTableVO = this.parsePayTable();
        super.completeConnect(obj);
    }

    private parsePayTable(): PayTableVO {
        var payTableVO: PayTableVO = new PayTableVO();
        var arT: Array<string> = mainSlot.model.payTable.slice(0);
        for (var i: number = 0; i < arT.length; i++) {
            payTableVO["id_" + arT[i].slice(0, 1)] = arT[i].substr(2).split(",");
        }
        var arr: Array<string>;
        for (i = 1; i <= arT.length; i++) {
            arr = payTableVO["id_" + i];
            for (var j = 0; j < arr.length; j++) {
                payTableVO["id_" + i][j] = +arr[j];
                payTableVO["id_" + i][j] = +payTableVO["id_" + i][j];
            }
        }
        //console.log(payTableVO);
        return payTableVO;
    }
}

class LoadPanel extends Command {
    constructor() {
        super("LoadPanel");
    }

    public panelView: IPanel;

    protected execInternal(): void {
        mainSlot.panel = new PanelAdapter();
        //Сделать нормальную зависимость.
        loadJS("panel/panel_slot_web.js", () => { this.completeLoadPanelJS() });
    }

    private completeLoadPanelJS(): void {
        //Сделать нормальную зависимость.
        this.panelView = (mainSlot.isMobile) ? new PanelSlotMob() : new PanelSlotWeb();
        this.panelView.on(EVENT_ONLOAD, () => { this.completeLoad() });
    }
    private completeLoad(): void {
        mainSlot.panel.setPanel(this.panelView);
        mainSlot.resize();
        this.notifyComplete();
    }
}
//TODO ТУТ ДОБАВЛЯТЬ НОВЫЕ ИГРЫ В СПИСОК
class LoadSlot extends Command {
    constructor() {
        super("LoadSlot");
    }

    protected execInternal(): void {
        //loadJS("gnome/slot_gnome.js", () => { this.completeLoadSlotJS(); });
        let id_game: string = mainSlot.model.gameId + '';

        //id_game = GameList.MAGIC;

        var url: string = '';

        switch (id_game) {
            case GameList.MAD_LUCK:
                url = "games/gnome/slot_gnome.js";
                break;
            case GameList.REVENGERS:
                url = "games/revengers/slot_revengers.js";
                break;
            case GameList.SMITHERS:
                url = "games/smithers/slot_smithers.js";
                break;
            case GameList.HORDE:
                url = "games/horde/slot_horde.js";
                break;
            case GameList.GRIM_GANG:
                url = "games/grimgang/slot_grimgang.js";
                break;
            case GameList.LORD_OF_LUCK:
                url = "games/lordofluck/slot_lordofluck.js";
                break;
            case GameList.ATLAS:
                url = "games/atlas/slot_atlas.js";
                break;
            case GameList.GUARDS:
                url = "games/guards/slot_guards.js";
                break;
            case GameList.PANDORA:
                url = "games/pandora/slot_pandora.js";
                break;
            case GameList.MARS:
                url = "games/mars/slot_mars.js";
                break;
            case GameList.MAGIC:
                url = "games/magic/slot_magic.js";
                break;
        }
        if (url !== '') {
            loadJS(url + "?8", () => { this.completeLoadSlotJS(); });
        }
    }
    private completeLoadSlotJS(): void {
        //TO DO тут я буду грузить ресурсы данного автомата вместо этого кода.
        //loadJSManifest(mainSlot.slot.getPathViewJS(), () => { this.completeLoad(); });
        mainSlot.slot.getResourseImg(() => { this.completeLoad(); });
    }
    private completeLoad(): void {
        this.notifyComplete();
    }
}

class GameList {
    public static MAD_LUCK: string = "101";
    public static REVENGERS: string = "104";
    public static SMITHERS: string = "107";
    public static HORDE: string = "110";
    public static GRIM_GANG: string = "113";
    public static LORD_OF_LUCK: string = "116";
    public static ATLAS: string = "119";
    public static GUARDS: string = "122";
    public static PANDORA: string = "125";
    public static MARS: string = "128";
    public static MAGIC: string = "131";
}

class InitCommand extends QueueCommand {
    constructor() {
        super("InitCommand");
    }
    protected execInternal(): void {
        this.add(new LoadPanel());
        this.add(new LoadSlot());
        this.add(new GetTokenCommand());
        this.add(new GetGameInfo());
        this.add(new AuthorizationGame());

        super.execInternal();
    }
}

