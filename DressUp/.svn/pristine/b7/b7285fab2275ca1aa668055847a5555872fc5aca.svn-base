import Tweener from "./Tweener";

export default class TweenMgr {
    static sg: TweenMgr;

    idle: Array<Tweener> = [];
    busy: { [index: number]: Tweener } = {};
    pause: boolean;
    clearCounter = 0;

    doStart(){
        Laya.timer.frameLoop(1, this, this._update);
        // EventMgr.register(GameEventType.Pause, this, this.gamePause);
        this.pause = false;
    }

    gamePause(state){
        this.pause = state;
    }

    _update() {
        let busy = this.busy;
        for (let id in busy) {
            let t = busy[id];
            if(!this.pause || t.ignoreTime){
                t._step(Laya.timer.delta);    
            }
        }
        this.clearCounter += 1;
        if (this.clearCounter == 10) {
            this.clearCounter = 0;
            for (let id in busy) {
                let t = busy[id];
                if (t.hasClear) {
                    delete busy[id];
                    this.idle.push(t);
                }
            }
        }
    }

    doTween(duration: number, update: Laya.Handler, complete: Laya.Handler, loopDir: number, auto: boolean, ignoreTime: boolean, ease: Function, delay: number) {
        let t = this.idle.pop() || new Tweener();
        t._conf(duration, update, complete, loopDir, auto, ignoreTime, ease, delay);
        this.busy[t.id] = t;
        return t;
    }

    static start(){
        TweenMgr.sg.doStart();
    }

    static tweenTiny(duration: number, caller: any, update: Function, complete?: Function, ignoreTime = false, ease = Laya.Ease.linearNone, delay = 0){
        console.log(TweenMgr.sg);
        let t = TweenMgr.sg.doTween(duration, Laya.Handler.create(caller, update, null, false), complete && Laya.Handler.create(caller, complete, null, false),
            0, true, ignoreTime, ease, delay
        );
        t.play();
    }

    static tweenCust(duration: number, caller: any, update: Function, complete?: Function, ignoreTime = false, ease = Laya.Ease.linearNone){
        return TweenMgr.sg.doTween(duration, Laya.Handler.create(caller, update, null, false), complete && Laya.Handler.create(caller, complete, null, false),
            0, false, ignoreTime, ease, 0
        );
    }

    static tweenLoop(duration: number, caller: any, update: Function, loopDir = 1, delay = 0, ease = Laya.Ease.linearNone, ignoreTime = false){
        return TweenMgr.sg.doTween(duration, Laya.Handler.create(caller, update, null, false), null, loopDir, false, ignoreTime, ease, delay);
    }

    static _getFactor(t: Tweener){
        return Number(t.factor.toFixed(4));
    }

    static lerp_Num(start: number, end: number, t: Tweener, group = 0) {
        let inParams = t.getPG("inParams", group);
        if(inParams.length == 0){
            inParams[0] = start;
            inParams[1] = end;
        }
        let outParams = t.getPG("outParams", group);
        outParams[0] = inParams[0] + (inParams[1] - inParams[0]) * TweenMgr._getFactor(t);
    }

    static lerp_Vec2(start: Laya.Vector2, end: Laya.Vector2, t: Tweener, group = 0) {
        let inParams = t.getPG("inParams", group);
        if(inParams.length == 0){
            inParams[0] = start.x;
            inParams[1] = end.x - start.x;
            inParams[2] = start.y;
            inParams[3] = end.y - start.y;
        }
        let outParams = t.getPG("outParams", group);
        let f = TweenMgr._getFactor(t);
        outParams[0] = inParams[0] + inParams[1] * f;
        outParams[1] = inParams[2] + inParams[3] * f;
    }

    static lerp_Vec3(start: Laya.Vector3, end: Laya.Vector3, t: Tweener, group = 0) {
        let inParams = t.getPG("inParams", group);
        if(inParams.length == 0){
            inParams[0] = start.x;
            inParams[1] = end.x - start.x;
            inParams[2] = start.y;
            inParams[3] = end.y - start.y;
            inParams[4] = start.z;
            inParams[5] = end.z - start.z;
        }
        let outParams = t.getPG("outParams", group);
        let f = TweenMgr._getFactor(t);
        outParams[0] = inParams[0] + inParams[1] * f;
        outParams[1] = inParams[2] + inParams[3] * f;
        outParams[2] = inParams[4] + inParams[5] * f;
    }

    static lerp_Vec4(start: Laya.Vector4, end: Laya.Vector4, t: Tweener, group = 0) {
        let inParams = t.getPG("inParams", group);
        if(inParams.length == 0){
            inParams[0] = start.x;
            inParams[1] = end.x - start.x;
            inParams[2] = start.y;
            inParams[3] = end.y - start.y;
            inParams[4] = start.z;
            inParams[5] = end.z - start.z;
            inParams[6] = start.w;
            inParams[7] = end.w - start.w;
        }
        let outParams = t.getPG("outParams", group);
        let f = TweenMgr._getFactor(t);
        outParams[0] = inParams[0] + inParams[1] * f;
        outParams[1] = inParams[2] + inParams[3] * f;
        outParams[2] = inParams[4] + inParams[5] * f;
        outParams[3] = inParams[6] + inParams[7] * f;
    }

    static lerp_Quat(start: Laya.Quaternion, end: Laya.Quaternion, t: Tweener, group = 0) {
        let inParams = t.getPG("inParams", group);
        if(inParams.length == 0){
            inParams[0] = start.x;
            inParams[1] = start.y;
            inParams[2] = start.z;
            inParams[3] = start.w;
            inParams[4] = end.x;
            inParams[5] = end.y;
            inParams[6] = end.z;
            inParams[7] = end.w;
        }
        let f = TweenMgr._getFactor(t);
        let ax = inParams[0], ay = inParams[1], az = inParams[2], aw = inParams[3], bx = inParams[4], by = inParams[5], bz = inParams[6], bw = inParams[7];
        let omega, cosom, sinom, scale0, scale1;
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        if ((1.0 - cosom) > 0.000001) {
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - f) * omega) / sinom;
            scale1 = Math.sin(f * omega) / sinom;
        } else {
            scale0 = 1.0 - f;
            scale1 = f;
        }
        let outParams = t.getPG("outParams", group);
        outParams[0] = scale0 * ax + scale1 * bx;
        outParams[1] = scale0 * ay + scale1 * by;
        outParams[2] = scale0 * az + scale1 * bz;
        outParams[3] = scale0 * aw + scale1 * bw;
    }
}
