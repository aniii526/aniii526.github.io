declare class Command extends createjs.EventDispatcher {
    data: Object;
    private static cache;
    protected _complete: boolean;
    complete: boolean;
    protected _executing: boolean;
    executing: boolean;
    protected type: string;
    constructor(type: string);
    execute(): void;
    protected reset(): void;
    protected execInternal(): void;
    protected notifyComplete(): void;
    terminate(): void;
}
declare class QueueCommand extends Command {
    static COMMAND_COMPLETE: string;
    queue: Array<Command>;
    private _completedCommand;
    completedCommand: Command;
    protected _runningCommand: Command;
    runningCommand: Command;
    protected total: number;
    protected dispatchProgress: boolean;
    add(c: Command): Command;
    addList(arr: Array<Command>): void;
    protected execInternal(): void;
    protected run(): void;
    protected onCommandComplete(): void;
    protected reset(): void;
    terminate(): void;
    removeCommand(cmd: Command): void;
}
declare class GetTokenCommand extends Command {
    constructor();
    protected execInternal(): void;
    private sendToPath(url);
}
declare class ConnectCommand extends Command {
    protected param: Object;
    constructor(type: string);
    protected execInternal(): void;
    protected getHash(): string;
    protected sendData(): void;
    private sendToPath(urlPath);
    protected processData(response: Object): void;
    private onCompleteAsync(e);
    protected completeConnect(obj: Object): void;
}
declare class ServerResponseEvent extends createjs.Event {
    static RESPONSE: string;
    data: any;
    constructor(data?: any, bubbles?: boolean, cancelable?: boolean);
}
declare class AuthorizationGame extends ConnectCommand {
    constructor();
    protected execInternal(): void;
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class BalanceGame extends ConnectCommand {
    constructor();
    protected getHash(): string;
}
declare class DebitGame extends ConnectCommand {
    action: ActionVO;
    constructor();
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class CreditGame extends ConnectCommand {
    action: ActionVO;
    constructor(cntLine: number, summa: number);
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class GambleEndGame extends ConnectCommand {
    constructor(clickUser: string);
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class GambleGame extends ConnectCommand {
    action: ActionVO;
    constructor(comb: string);
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class GambleStartGame extends ConnectCommand {
    constructor();
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class GetAsyncResponse extends ConnectCommand {
    private counter;
    private timeout;
    constructor(tokenAsync: string, timeout: number);
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class GetGameInfo extends ConnectCommand {
    constructor();
    protected execInternal(): void;
    protected getHash(): string;
    protected completeConnect(obj: Object): void;
}
declare class LoadPanel extends Command {
    constructor();
    panelView: IPanel;
    protected execInternal(): void;
    private completeLoadPanelJS();
    private completeLoad();
}
declare class LoadSlot extends Command {
    constructor();
    protected execInternal(): void;
    private completeLoadSlotJS();
    private completeLoad();
}
declare class InitCommand extends QueueCommand {
    constructor();
    protected execInternal(): void;
}
