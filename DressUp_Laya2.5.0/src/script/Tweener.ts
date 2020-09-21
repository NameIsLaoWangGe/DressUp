import Util from "./Frame/Util";


export default class Tweener{
    static _internalId = 0;
    static get internalId(){
        return ++(Tweener._internalId); 
    }

    _factor: number= 0;
    id: number;
    inParams: Array<Array<any>>;
    outParams: Array<Array<any>>;
    
    duration: number;
    update: Laya.Handler;
    complete: Laya.Handler;
    //0：不循环，1：正循环，2：正负循环
    loopDir: number;
    ignoreTime: boolean;
    ease: Function;
    delay: number;
    autoClear: boolean;

    hasClear: boolean;
    counter: number;
    // 可以用于暂停和继续播放，也可以用于停止当前tween
    pause: boolean;
    dir: boolean;
    delayCounter: number;

    constructor(){
        this.id = Tweener.internalId;
        this.inParams = [];
        this.outParams = [];
    }

    set factor(v: number){
        this._factor = v;
        this.update.runWith(this);
    }

    get factor(){
        return this._factor;
    }

    beforeRun(){
        this.pause = false;
        for(let v of this.inParams){
            v.length = 0;
        }
        for(let v of this.outParams){
            v.length = 0;
        }
        this.delayCounter = 0;
    }

    // 重置后播放
    play(){
        this.beforeRun();
        this.counter = 0;
        this.factor = 0;
        this.dir = true;
    }

    // 非loop才可以
    reverse(fromNow = false){
        if(this.loopDir == 0){
            this.beforeRun();
            if(fromNow){
                this.counter = this.duration * this.factor;
            }else{
                this.counter = this.duration;
                this.factor = 1;
            }
            this.dir = false;
        }
    }

    // 结束并回收，如果非循环未播放完毕，结束回调也不会触发
    discard(){
        this.hasClear = true;
        if(this.complete){
            this.complete.recover();
            this.complete = null;
        }
        if(this.update){
            this.update.recover();
            this.update = null;
        }
    }

    stop(){
        this.pause = true;
    }

    _conf(duration: number, update: Laya.Handler, complete: Laya.Handler, loopDir: number, auto: boolean, ignoreTime: boolean, ease: Function, delay: number){
        this.duration = duration;
        this.update = update;
        this.complete = complete;
        this.loopDir = loopDir;
        this.autoClear = auto;
        this.ignoreTime = ignoreTime;
        this.ease = ease;
        this.delay = delay;
        this.hasClear = false;
        this.pause = true;
    }

    _step(dt: number){
        if(this.pause || this.hasClear){ return; }
        if(this.delayCounter < this.delay){
            this.delayCounter += dt;
            return;
        }
        if(this.dir){
            this.counter += dt;
            let ratio = Util.clamp(this.counter / this.duration, 0, 1);
            if(ratio == 1){
                this.factor = 1;
            }else{
                this.factor = this.ease(this.counter, 0, 1, this.duration);
            }

            if(this.factor == 1){
                if(this.loopDir == 0){
                    this.pause = true;
                    this.complete && this.complete.run();
                    this.autoClear && this.discard();
                }else if(this.loopDir == 1){
                    this.dir = true;
                    this.counter = 0;
                    this.delayCounter = 0;
                }else if(this.loopDir == 2){
                    this.dir = false;
                    this.counter = this.duration;
                    this.delayCounter = 0;
                }
            }
        }else{
            this.counter -= dt;
            let ratio = Util.clamp(this.counter / this.duration, 0, 1);
            if(ratio == 0){
                this.factor = 0;
            }else{
                this.factor = this.ease(this.counter, 0, 1, this.duration);
            }

            if(this.factor == 0){
                if(this.loopDir == 0){
                    this.pause = true;
                    this.complete && this.complete.run();
                    this.autoClear && this.discard();
                }else if(this.loopDir == 1){
                    console.error("unvalid tween");
                }else if(this.loopDir == 2){
                    this.dir = true;
                    this.counter = 0;
                    this.delayCounter = 0;
                }
            }
        }
    }

    getPG(groupName: string, group: number){
        let params = this[groupName] as Array<Array<number>>;
        let rs = params[group];
        if(!rs){
            rs = [];
            params[group] = rs;
        }
        return rs;
    }
}