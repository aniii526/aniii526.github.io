function GameBase(gameName,gameVersion,parent){
    
    if(UAGENT_CMOBILE){
        this.SetScrollToggleSetting(true);
        this.qo=true
    }

    var OnTouchMoveEvt=function(e,toggleScrollSetting,allowScrolling){
        if(toggleScrollSetting){
            if(!allowScrolling)
                if(UAGENT_IE)
                    window.scrollTo(0,0);
                else e.preventDefault ? e.preventDefault() : e.returnValue = false;
        }
        else
        {
            if(UAGENT_IE)
                window.scrollTo(0,0);
            else e.preventDefault ? e.preventDefault() : e.returnValue = false;

            if(UAGENT_IE&&window.attachEvent!=undefined)
                window.attachEvent("touchend",SetCorrextScrollPos,false);
            else window.addEventListener("touchend", SetCorrextScrollPos, false)
        }
    };

    var SetCorrextScrollPos=function(){
        window.scrollTo(0,1);
        if (window.detachEvent != undefined)
            window.detachEvent("touchend", SetCorrextScrollPos, false);
        else
            window.removeEventListener("touchend", SetCorrextScrollPos, false);
    };

    if(UAGENT_IE)
        window.addEventListener("scroll", function (event) {
            OnTouchMoveEvt(event, that.kG, that.qo)
        }, false);

    else if (UAGENT_IOS7 && UAGENT_IPHONE);

    else window.addEventListener("touchmove", function (event) {
        OnTouchMoveEvt(event, that.kG, that.qo)
    }, false);

    var onResize=function(event){
        if(that.ai==undefined)return;
        if(window.innerWidth>=960&& !gH||window.innerWidth>=960&& !orientationHasBeenSet){
            gH=true;
            callInitOrientationCheck(true);
            orientationHasBeenSet=true
        }else if(window.innerWidth<960&&gH||window.innerWidth<960&& !orientationHasBeenSet){
            gH=false;
            callInitOrientationCheck(false);
            orientationHasBeenSet=true}};
    if(UAGENT_FIREFOX||UAGENT_IE)
        window.addEventListener("resize",onResize,false);
    var callInitOrientationCheck=function(b){
        that.ai.initOrientationCheck(true,b)
    };
    return this
}


this.addOrientationListener=function(){
    if(Utils.OldGame(this.cp)){
        var supportsOrientationChange="onorientationchange"in window,orientationEvent=supportsOrientationChange?"orientationchange":"resize";
        window.addEventListener(orientationEvent,onOrientationChange,false)
    }
};
Orientation.ChangeOrientation=function(orientation){
    if(Orientation.GAME==undefined){
        var orientation=orientation;
        setTimeout(function(){
            Orientation.ChangeOrientation(orientation)},100);return}
    if(orientation=="pt")
        Orientation.ORIENTATIONOBJECT.bF=true;
    else Orientation.ORIENTATIONOBJECT.bF=false;
    Orientation.GAME.HandleOrientationChange();
    if(typeof ModalWin!="undefined")
        ModalWin.OnOrientationChange(Orientation.ORIENTATIONOBJECT.bF);
    if(typeof IDSplash!="undefined")IDSplash.OnOrientationChange(Orientation.ORIENTATIONOBJECT.bF)
};