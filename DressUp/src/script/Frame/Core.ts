import Util from "./Util";
import { Formula, LC } from "../Game/Formula";

let _G = window["G"];
if (!_G)
{
    _G = {};
    window["G"] = _G;
}
export let G = _G;

let _F = window["F"];
if (!_F)
{
    _F = {};
    window["F"] = _F;
}
export let F = _F;

export module Core
{
    export module Event
    {
        export class Mgr
        {
            static I: Mgr;

            dispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();

            init(segment)
            {
                Mgr.notify("preloadStep", segment);
                GameMgr.autoLoadNext();
            }

            static reg(type: any, caller: any, listener: Function)
            {
                if (!caller)
                {
                    console.error("caller must exist!");
                }
                Mgr.I.dispatcher.on(type.toString(), caller, listener);
            }

            static notify(type: any, args?: any)
            {
                Mgr.I.dispatcher.event(type.toString(), args);
            }

            static off(type: any, caller: any, listener: Function)
            {
                Mgr.I.dispatcher.off(type.toString(), caller, listener);
            }

            static offAll(type: any)
            {
                Mgr.I.dispatcher.offAll(type.toString());
            }

            static offCaller(caller: any)
            {
                Mgr.I.dispatcher.offAllCaller(caller);
            }
        }
    }

    export module Tween
    {
        export class Tweener
        {
            static _internalId = 0;
            static get internalId()
            {
                return ++(Tweener._internalId);
            }

            _factor: number;
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

            constructor()
            {
                this.id = Tweener.internalId;
                this.inParams = [];
                this.outParams = [];
            }

            set factor(v: number)
            {
                if (this.update)
                {
                    this._factor = v;
                    this.update.runWith(this);
                }
            }

            get factor()
            {
                return this._factor;
            }

            beforeRun()
            {
                this.pause = false;
                for (let v of this.inParams)
                {
                    v.length = 0;
                }
                for (let v of this.outParams)
                {
                    v.length = 0;
                }
                this.delayCounter = 0;
            }

            // 重置后播放
            play()
            {
                this.beforeRun();
                this.counter = 0;
                this.factor = 0;
                this.dir = true;
            }

            // 非loop才可以
            reverse(fromNow = false)
            {
                if (this.loopDir == 0)
                {
                    this.beforeRun();
                    if (fromNow)
                    {
                        this.counter = this.duration * this.factor;
                    } else
                    {
                        this.counter = this.duration;
                        this.factor = 1;
                    }
                    this.dir = false;
                }
            }

            // 结束并回收，如果非循环未播放完毕，结束回调也不会触发
            discard()
            {
                this.hasClear = true;
                if (this.complete)
                {
                    this.complete.recover();
                    this.complete = null;
                }
                if (this.update)
                {
                    this.update.recover();
                    this.update = null;
                }
            }

            stop()
            {
                this.pause = true;
            }

            _conf(duration: number, update: Laya.Handler, complete: Laya.Handler, loopDir: number, auto: boolean, ignoreTime: boolean, ease: Function, delay: number)
            {
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

            _step(dt: number)
            {
                if (this.pause || this.hasClear) { return; }
                if (this.delayCounter < this.delay)
                {
                    this.delayCounter += dt;
                    return;
                }
                if (this.dir)
                {
                    this.counter += dt;
                    let ratio = Util.clamp(this.counter / this.duration, 0, 1);
                    if (ratio == 1)
                    {
                        this.factor = 1;
                    } else
                    {
                        this.factor = this.ease(this.counter, 0, 1, this.duration);
                    }

                    if (this.factor == 1)
                    {
                        if (this.loopDir == 0)
                        {
                            this.pause = true;
                            this.complete && this.complete.run();
                            this.autoClear && this.discard();
                        } else if (this.loopDir == 1)
                        {
                            this.dir = true;
                            this.counter = 0;
                            this.delayCounter = 0;
                        } else if (this.loopDir == 2)
                        {
                            this.dir = false;
                            this.counter = this.duration;
                            this.delayCounter = 0;
                        }
                    }
                } else
                {
                    this.counter -= dt;
                    let ratio = Util.clamp(this.counter / this.duration, 0, 1);
                    if (ratio == 0)
                    {
                        this.factor = 0;
                    } else
                    {
                        this.factor = this.ease(this.counter, 0, 1, this.duration);
                    }

                    if (this.factor == 0)
                    {
                        if (this.loopDir == 0)
                        {
                            this.pause = true;
                            this.complete && this.complete.run();
                            this.autoClear && this.discard();
                        } else if (this.loopDir == 1)
                        {
                            console.error("unvalid tween");
                        } else if (this.loopDir == 2)
                        {
                            this.dir = true;
                            this.counter = 0;
                            this.delayCounter = 0;
                        }
                    }
                }
            }

            getPG(groupName: string, group: number)
            {
                let params = this[groupName] as Array<Array<number>>;
                let rs = params[group];
                if (!rs)
                {
                    rs = [];
                    params[group] = rs;
                }
                return rs;
            }
        }

        export class Mgr
        {
            static I: Mgr;

            idle: Array<Tweener> = [];
            busy: { [index: number]: Tweener } = {};
            pause: boolean;
            clearCounter = 0;

            init(segment)
            {
                Laya.timer.frameLoop(1, this, this._update);
                EventMgr.reg("pause", this, this.gamePause);
                this.pause = false;

                EventMgr.notify("preloadStep", segment);
                GameMgr.autoLoadNext();
            }

            gamePause(state)
            {
                this.pause = state;
            }

            _update()
            {
                let busy = this.busy;
                for (let id in busy)
                {
                    let t = busy[id];
                    if (!this.pause || t.ignoreTime)
                    {
                        t._step(Laya.timer.delta);
                    }
                }
                this.clearCounter += 1;
                if (this.clearCounter == 10)
                {
                    this.clearCounter = 0;
                    for (let id in busy)
                    {
                        let t = busy[id];
                        if (t.hasClear)
                        {
                            delete busy[id];
                            this.idle.push(t);
                        }
                    }
                }
            }

            doTween(duration: number, update: Laya.Handler, complete: Laya.Handler, loopDir: number, auto: boolean, ignoreTime: boolean, ease: Function, delay: number)
            {
                let t = this.idle.pop() || new Tweener();
                t._conf(duration, update, complete, loopDir, auto, ignoreTime, ease, delay);
                this.busy[t.id] = t;
                return t;
            }

            static tweenTiny(duration: number, caller: any, update: Function, complete?: Function, ignoreTime = false, ease = Laya.Ease.linearNone, delay = 0)
            {
                let t = Mgr.I.doTween(duration, Laya.Handler.create(caller, update, null, false), complete && Laya.Handler.create(caller, complete, null, false),
                    0, true, ignoreTime, ease, delay
                );
                t.play();
            }

            static tweenCust(duration: number, caller: any, update: Function, complete?: Function, ignoreTime = false, ease = Laya.Ease.linearNone, delay = 0)
            {
                return Mgr.I.doTween(duration, Laya.Handler.create(caller, update, null, false), complete && Laya.Handler.create(caller, complete, null, false),
                    0, false, ignoreTime, ease, delay
                );
            }

            //1：正循环，2：正负循环
            static tweenLoop(duration: number, caller: any, update: Function, loopDir = 1, delay = 0, ease = Laya.Ease.linearNone, ignoreTime = false)
            {
                return Mgr.I.doTween(duration, Laya.Handler.create(caller, update, null, false), null, loopDir, false, ignoreTime, ease, delay);
            }

            static _getFactor(t: Tweener)
            {
                return Number(t.factor.toFixed(4));
            }

            static lerp_Num(start: number, end: number, t: Tweener, group = 0)
            {
                let inParams = t.getPG("inParams", group);
                if (inParams.length == 0)
                {
                    inParams[0] = start;
                    inParams[1] = end;
                }
                let outParams = t.getPG("outParams", group);
                outParams[0] = inParams[0] + (inParams[1] - inParams[0]) * Mgr._getFactor(t);
            }

            static lerp_Vec2(start: Laya.Point, end: Laya.Point, t: Tweener, group = 0)
            {
                let inParams = t.getPG("inParams", group);
                if (inParams.length == 0)
                {
                    inParams[0] = start.x;
                    inParams[1] = end.x - start.x;
                    inParams[2] = start.y;
                    inParams[3] = end.y - start.y;
                }
                let outParams = t.getPG("outParams", group);
                let f = Mgr._getFactor(t);
                outParams[0] = inParams[0] + inParams[1] * f;
                outParams[1] = inParams[2] + inParams[3] * f;
            }

            // static lerp_Vec3(start: Laya.Vector3, end: Laya.Vector3, t: Tweener, group = 0)
            // {
            //     let inParams = t.getPG("inParams", group);
            //     if (inParams.length == 0)
            //     {
            //         inParams[0] = start.x;
            //         inParams[1] = end.x - start.x;
            //         inParams[2] = start.y;
            //         inParams[3] = end.y - start.y;
            //         inParams[4] = start.z;
            //         inParams[5] = end.z - start.z;
            //     }
            //     let outParams = t.getPG("outParams", group);
            //     let f = Mgr._getFactor(t);
            //     outParams[0] = inParams[0] + inParams[1] * f;
            //     outParams[1] = inParams[2] + inParams[3] * f;
            //     outParams[2] = inParams[4] + inParams[5] * f;
            // }

            // static lerp_Vec4(start: Laya.Vector4, end: Laya.Vector4, t: Tweener, group = 0)
            // {
            //     let inParams = t.getPG("inParams", group);
            //     if (inParams.length == 0)
            //     {
            //         inParams[0] = start.x;
            //         inParams[1] = end.x - start.x;
            //         inParams[2] = start.y;
            //         inParams[3] = end.y - start.y;
            //         inParams[4] = start.z;
            //         inParams[5] = end.z - start.z;
            //         inParams[6] = start.w;
            //         inParams[7] = end.w - start.w;
            //     }
            //     let outParams = t.getPG("outParams", group);
            //     let f = Mgr._getFactor(t);
            //     outParams[0] = inParams[0] + inParams[1] * f;
            //     outParams[1] = inParams[2] + inParams[3] * f;
            //     outParams[2] = inParams[4] + inParams[5] * f;
            //     outParams[3] = inParams[6] + inParams[7] * f;
            // }

            // static lerp_Quat(start: Laya.Quaternion, end: Laya.Quaternion, t: Tweener, group = 0)
            // {
            //     let inParams = t.getPG("inParams", group);
            //     if (inParams.length == 0)
            //     {
            //         inParams[0] = start.x;
            //         inParams[1] = start.y;
            //         inParams[2] = start.z;
            //         inParams[3] = start.w;
            //         inParams[4] = end.x;
            //         inParams[5] = end.y;
            //         inParams[6] = end.z;
            //         inParams[7] = end.w;
            //     }
            //     let f = Mgr._getFactor(t);
            //     let ax = inParams[0], ay = inParams[1], az = inParams[2], aw = inParams[3], bx = inParams[4], by = inParams[5], bz = inParams[6], bw = inParams[7];
            //     let omega, cosom, sinom, scale0, scale1;
            //     cosom = ax * bx + ay * by + az * bz + aw * bw;
            //     if (cosom < 0.0)
            //     {
            //         cosom = -cosom;
            //         bx = -bx;
            //         by = -by;
            //         bz = -bz;
            //         bw = -bw;
            //     }
            //     if ((1.0 - cosom) > 0.000001)
            //     {
            //         omega = Math.acos(cosom);
            //         sinom = Math.sin(omega);
            //         scale0 = Math.sin((1.0 - f) * omega) / sinom;
            //         scale1 = Math.sin(f * omega) / sinom;
            //     } else
            //     {
            //         scale0 = 1.0 - f;
            //         scale1 = f;
            //     }
            //     let outParams = t.getPG("outParams", group);
            //     outParams[0] = scale0 * ax + scale1 * bx;
            //     outParams[1] = scale0 * ay + scale1 * by;
            //     outParams[2] = scale0 * az + scale1 * bz;
            //     outParams[3] = scale0 * aw + scale1 * bw;
            // }
        }
    }

    export module Resource
    {
        export class Mgr
        {
            static I: Mgr;

            willLoad: string;
            poolSign: string;

            init(segment)
            {
                // let lastValue = null;
                // let onPrg = Laya.Handler.create(null, (v) => {
                //     let delta = lastValue == null ? v : (v - lastValue);
                //     EventMgr.notify("preloadStep", delta * segment);
                //     lastValue = v;
                // }, null, false);
                // let onCpl = Laya.Handler.create(null, () => {
                //     onPrg.recover();

                // });
                GameMgr.autoLoadNext();
                //Laya.loader.create(Formula.preloadList, onCpl, onPrg);
            }

            doGetLh(keyName: string)
            {
                this.willLoad = keyName;
                this.poolSign = "LH_" + keyName;
                let lh = Laya.Pool.getItemByCreateFun(this.poolSign, this.createFun, this);
                lh.active = true;
                return lh;
            }

            createFun()
            {
                let inst = Laya.Loader.getRes(`res3d/${this.willLoad}.lh`).clone();
                inst["_orgName"] = this.poolSign;
                return inst;
            }

            //1.即使给sp3d添加了com，只要本身没有被加入scene3d，则com上的原生事件就不会触发
            //2.Laya.Pool是否回收，对sp3d和绑定的com完全无影响，所以需要自己去控制清理操作
            //3.一个激活active的sp3d直接从其父节点移除时会触发com的ondisable，从父节点移除后，sp3d已经不在scene3d中，所以原生事件也不再触发
            //4.和unity一样，只有第一次加入scene3d会触发com上的awake和start，移除后再添加只会触发onenable
            static getLh(keyName: string)
            {
                return Mgr.I.doGetLh(keyName) as Laya.Sprite ;
            }

            static recycleLh(inst: Laya.Sprite , clearComs = false)
            {
                clearComs && inst["_destroyAllComponent"].call(inst);
                inst.removeSelf();
                inst.active = false;
                Laya.Pool.recover(inst["_orgName"], inst);
            }
        }

        export abstract class BaseObj
        {
            // static _cls: string;     //必须
            _isInit = false;
            _clsName: string;
            _mid: number;
            _isRecycle: boolean;

            obj: Laya.Sprite ;

            abstract onInit();
            abstract onRecover(args?: any);

            get trans()
            {
                return this.obj.transform;
            }

            // 有保护，多次执行只会执行一次
            recycle()
            {
                if (!this._isRecycle)
                {
                    this._isRecycle = true;
                    Laya.timer.clearAll(this);
                    this.onRecycle();
                    ObjPool._recycle(this);
                }
            }

            // 如果需要，在onRecover中useUpdate
            useUpdate()
            {
                Laya.timer.frameLoop(1, this, this.onUpdate);
            }

            onUpdate() { }

            onRecycle()
            {
                this.obj && ResourceMgr.recycleLh(this.obj);
            }
        }

        export class ObjPool
        {
            static map = {};

            static _id = 0;
            static get interId()
            {
                ObjPool._id += 1;
                return ObjPool._id;
            }

            static get(cls: any, args?: any)
            {
                let clsName = cls["_cls"];
                if (!clsName)
                {
                    console.error("_cls not implement");
                    return;
                }
                let branch = ObjPool.map[clsName];
                if (!branch)
                {
                    ObjPool.map[clsName] = branch = {};
                }

                let item = Laya.Pool.getItemByClass(clsName, cls) as BaseObj;
                if (!item._isInit)
                {
                    item._clsName = clsName;
                    item._mid = ObjPool.interId;
                    item.onInit();
                    item._isInit = true;
                }

                branch[item._mid] = item;
                item._isRecycle = false;
                item.onRecover(args);
                return item;
            }

            static _recycle(obj: BaseObj)
            {
                let branch = ObjPool.map[obj._clsName];
                delete branch[obj._mid];
                Laya.Pool.recover(obj._clsName, obj);
            }

            // 会对所有BaseObj调用recycle，所以不需要在某个obj的onRecyle中调用其他对象的recycle
            static recycleAll()
            {
                for (let clsName in ObjPool.map)
                {
                    let branch = ObjPool.map[clsName];
                    for (let id in branch)
                    {
                        branch[id].recycle();
                    }
                    branch = {};
                }
            }
        }
    }

    export module Data
    {
        export class Mgr
        {
            static I: Mgr;

            playerData = {};

            init(segment)
            {
                // local storage
                let keysInfo = Formula.playerLocalKeys;
                let gameId = this.doGetValue("gameId");
                Formula.fstPlay = gameId != keysInfo.gameId;
                if (Formula.fstPlay)
                {
                    Laya.LocalStorage.clear();
                    for (let k in keysInfo)
                    {
                        this.doSetValue(k, this.getDf(keysInfo[k]));
                    }
                } else
                {
                    let version = this.doGetValue("version");
                    let compare = keysInfo.version;
                    if (version < compare)
                    {
                        this.doSetValue("version", compare);
                        for (let k in keysInfo)
                        {
                            let localVal = this.doGetValue(k);
                            if (localVal == null)
                            {
                                this.doSetValue(k, this.getDf(keysInfo[k]));
                            } else
                            {
                                this.playerData[k] = localVal;
                            }
                        }
                    } else
                    {
                        for (let k in keysInfo)
                        {
                            this.playerData[k] = this.doGetValue(k);
                        }
                    }
                }
                (Formula.maxEnergy > 0) && new Energy(Formula.recoverEnergyTs, Formula.maxEnergy);

                // local config
                let orgLC = LC;
                let pathList = [];
                let keyList = [];
                for (let k in orgLC)
                {
                    pathList.push(`config/${orgLC[k]._file}.json`);
                    keyList.push(k);
                }

                let lastValue = null;
                let onPrg = Laya.Handler.create(null, (v) =>
                {
                    let delta = lastValue == null ? v : (v - lastValue);
                    EventMgr.notify("preloadStep", delta * segment);
                    lastValue = v;
                }, null, false);
                let onCpl = Laya.Handler.create(null, (res) =>
                {
                    for (let i = 0, len = pathList.length; i < len; i++)
                    {
                        let jsonObj = Laya.Loader.getRes(pathList[i].url);
                        let dataSt = orgLC[keyList[i]];
                        dataSt.arr = jsonObj;
                        if (jsonObj[0].id)
                        {
                            for (let v of jsonObj)
                            {
                                dataSt.map[v.id] = v;
                            }
                        }
                    }
                    onPrg.recover();
                    GameMgr.autoLoadNext();
                });
                Laya.loader.create(pathList, onCpl, onPrg);
            }

            getDf(value: any)
            {
                if (value == "__ts__")
                {
                    return Date.now();
                } else if (typeof (value) == "function")
                {
                    return value();
                } else
                {
                    return value;
                }
            }

            doGetValue(key: string)
            {
                let v = Laya.LocalStorage.getItem(key);
                if (v === "")
                {
                    return "";
                } else
                {
                    return JSON.parse(v);
                }
            }

            doSetValue(key, value)
            {
                if (value === "" || value === null)
                {
                    console.error("save data error, key is: ", key);
                }
                let curValue = this.playerData[key];
                let valid = curValue != value;
                if (valid)
                {
                    this.playerData[key] = value;
                    Laya.LocalStorage.setItem(key, JSON.stringify(value));
                }
                return valid;
            }

            doSetObjItem(key, itemKey, value)
            {
                let obj = this.playerData[key];
                let curValue = obj[itemKey];
                if (curValue != value)
                {
                    obj[itemKey] = value;
                    Laya.LocalStorage.setItem(key, JSON.stringify(obj));
                }
            }

            doDeltaNum(key, delta)
            {
                if (delta != 0)
                {
                    let curValue = this.playerData[key];
                    curValue += delta;
                    this.playerData[key] = curValue;
                    Laya.LocalStorage.setItem(key, JSON.stringify(curValue));
                }
            }

            doSetArray(key, value)
            {
                let curValue = this.playerData[key];
                if (value != curValue)
                {
                    curValue.length = 0;
                    for (let i = 0, len = value.length; i < len; i++)
                    {
                        curValue[i] = value[i];
                    }
                }
                Laya.LocalStorage.setItem(key, JSON.stringify(curValue));
            }

            doSetObj(key)
            {
                Laya.LocalStorage.setItem(key, JSON.stringify(this.playerData[key]));
            }

            static setValue(key: string, value: any)
            {
                return DataMgr.I.doSetValue(key, value);
            }

            static setObjItem(key: string, itemKey: string, value: any)
            {
                Mgr.I.doSetObjItem(key, itemKey, value);
            }

            static deltaNum(key: string, value: number)
            {
                Mgr.I.doDeltaNum(key, value);
            }

            static setArray(key: string, value: any[])
            {
                Mgr.I.doSetArray(key, value);
            }

            static setObject(key: string)
            {
                Mgr.I.doSetObj(key);
            }

            static getPlayerData(key?: string)
            {
                let data = Mgr.I.playerData;
                if (key)
                {
                    return data[key];
                } else
                {
                    return data;
                }
            }
        }

        class Energy
        {
            dataKey = "energy";
            tsKey = "energyTs";
            updateTs = 1000;
            itv: number;
            onceAdd: number;
            max: number;
            counter: number;
            lastCounter: number;

            constructor(itvTs, max, onceAdd = 1)
            {
                this.itv = itvTs;
                this.onceAdd = onceAdd;
                this.max = max;
                let now = Date.now();
                let times = Math.floor((now - this.energyTs) / itvTs);

                Mgr.setValue(this.dataKey, Util.clamp(this.value + times * onceAdd, 0, this.max));
                Mgr.setValue(this.tsKey, this.energyTs + itvTs * times);

                let elapse = (this.value < this.max) ? (now - this.energyTs) : 0;
                this.counter = itvTs - elapse;

                Laya.timer.loop(this.updateTs, this, this.scdUpdate);
            }

            get value()
            {
                return Mgr.getPlayerData(this.dataKey);
            }

            get energyTs()
            {
                return Mgr.getPlayerData(this.tsKey);
            }

            scdUpdate()
            {
                if (this.value < this.max)
                {
                    let now = Date.now();
                    let cutTs = this.lastCounter ? (now - this.lastCounter) : this.updateTs;
                    this.lastCounter = now;
                    this.counter -= cutTs;
                    if (this.counter > -80 && this.counter < 80)
                    {
                        this.counter = 0;
                    }

                    if (this.counter <= 0)
                    {
                        let exceed = -1 * this.counter;
                        let add = Math.floor(exceed / this.itv);
                        let elapse = exceed - add * this.itv;

                        this.counter = this.itv - elapse;
                        let _value = this.value + add + 1;
                        if (_value >= this.max)
                        {
                            _value = this.max;
                            this.lastCounter = null;
                        }
                        Mgr.setValue(this.dataKey, _value);
                        Mgr.setValue(this.tsKey, now - elapse);
                    }
                    EventMgr.notify("energyTick", this.counter);
                }
            }
        }
    }

    export module Scene
    {
        export class Mgr
        {
            static I: Mgr;

            root: Laya.Scene ;
            nodeMap: { [index: string]: Laya.Sprite  };
            amplitude: number;
            shakingNode: Laya.Sprite ;
            lastOffset = new Laya.Point();
            efxList = [];
            maxTimeMap = [];

            init(segment)
            {
                this.nodeMap = {};
                let sceneInfo = Formula.startScene;
                if (sceneInfo.path == "")
                {
                    //this.custCreate(sceneInfo.nodeConf);
                    EventMgr.notify("preloadStep", segment);
                    GameMgr.autoLoadNext();
                } else
                {
                    let onCpl = Laya.Handler.create(null, (scene: Laya.Scene ) =>
                    {
                        this.root = Laya.stage.addChildAt(scene, 0) as Laya.Scene ;
                        this.setMap(sceneInfo.nodeConf);
                        EventMgr.notify("preloadStep", segment);
                        GameMgr.autoLoadNext();
                    });
                    Laya.Scene .load(sceneInfo.path, onCpl);
                }
                Laya.timer.frameLoop(1, this, this.update);
            }

            setMap(nodeConf)
            {
                for (let v of nodeConf)
                {
                    if (typeof (v) == "string")
                    {
                        let node = this.nodeMap[v] = this.root.addChild(new Laya.Sprite()) as Laya.Sprite ;
                        node.name = v;
                    } else
                    {
                        let node: any = this.root;
                        let arr = v[0].split("/");
                        for (let name of arr)
                        {
                            node = node.getChildByName(name);
                        }
                        this.nodeMap[v[1]] = node;
                    }
                }
            }

            // custCreate(nodeConf)
            // {
            //     this.root = Laya.stage.addChildAt(new Laya.Scene (), 0) as Laya.Scene ;
            //     this.nodeMap["Camera"] = (this.root.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
            //     this.setMap(nodeConf);
            // }

            doCloseScene()
            {
                this.nodeMap = {};
                this.root && this.root.destroy(true);
                this.root = null;
            }

            doLoadScene(sceneInfo, onCpl: Function)
            {
                this.doCloseScene();
                if (sceneInfo.path == "")
                {
                    //this.custCreate(sceneInfo.nodeConf);
                    onCpl();
                } else
                {
                    Laya.Scene .load(sceneInfo.path, Laya.Handler.create(null, (scene: Laya.Scene ) =>
                    {
                        this.root = Laya.stage.addChildAt(scene, 0) as Laya.Scene ;
                        this.setMap(sceneInfo.nodeConf);
                        onCpl();
                    }));
                }
            }

            // doShakeNode(a, t, node)
            // {
            //     if (node)
            //     {
            //         this.amplitude = a;
            //         this.shakingNode = node;
            //         this.lastOffset.x = 0;
            //         this.lastOffset.y = 0;
            //         //this.lastOffset=(0, 0);
            //         TweenMgr.tweenTiny(t, this, this.tweenShake, null, true);
            //     }
            // }

            // tweenShake(t: Tween.Tweener)
            // {
            //     let offset = this.amplitude * (1 - t.factor);
            //     let dx = offset * Util.shakeByFactor(t.factor, 4);
            //     let dy = offset * Util.shakeByFactor(t.factor, 3);
            //     let x = dx + this.shakingNode.transform.localPosition.x - this.lastOffset.x;
            //     let y = dy + this.shakingNode.transform.localPosition.y - this.lastOffset.y;
            //     this.lastOffset.x = dx;
            //     this.lastOffset.y = dy;
            //     //this.lastOffset.setValue(dx, dy);
            //     Util.setVec3(this.shakingNode.transform, "localPosition", x, y);
            // }

            update()
            {
                let dt = Laya.timer.delta;
                if (this.efxList.length > 0)
                {
                    for (let i = 0; i < this.efxList.length; i++)
                    {
                        let info = this.efxList[i];
                        info[2] += dt;
                        if (info[2] >= info[1])
                        {
                            info[3] && info[3]();
                            ResourceMgr.recycleLh(info[0]);
                            this.efxList.splice(i, 1);
                            i--;
                        }
                    }
                }
            }

            doAddLittleEfx(name, x, y, z, parent, onCpl, joinPlay)
            {
                // let obj;
                // //let efx = ResourceMgr.getLh(name) as Laya.ShuriKenParticle ;
                // if (!parent || typeof (parent) == "string")
                // {
                //     parent = SceneMgr.getNode(parent);
                // }
                // if (efx.particleSystem.looping)
                // {
                //     efx.particleSystem.playOnAwake = true;
                // } else
                // {
                //     efx.particleSystem.playOnAwake = joinPlay;
                //     joinPlay && (obj = []);
                // }
                // (parent as Laya.Sprite ).addChild(efx);
                // Util.setVec3(efx.transform, "position", x, y, z);
                // if (efx.particleSystem.playOnAwake)
                // {
                //     efx.particleSystem.play();
                // }
                // if (obj)
                // {
                //     let max = this.maxTimeMap[name];
                //     if (!max)
                //     {
                //         let minTime = efx.particleSystem.startLifetimeConstantMin || 0;
                //         let maxTime = efx.particleSystem.startLifetimeConstantMax || 0;
                //         let comTime = efx.particleSystem.startLifetimeConstant || 0;
                //         let duration = efx.particleSystem.duration || 0;
                //         max = Math.max(duration, Math.max(comTime, Math.max(minTime, maxTime)));
                //         this.maxTimeMap[name] = max * 1000 + 100;
                //     }
                //     this.efxList.push([efx, max, 0, onCpl]);
                // }
                // return efx;
            }

            static loadScene(sceneInfo, onCpl: Function)
            {
                Mgr.I.doLoadScene(sceneInfo, onCpl);
            }

            static shakeNode(a = 0.05, t = 200, node = Mgr.getNode("Camera"))
            {
               // Mgr.I.doShakeNode(a, t, node);
            }

            static getNode(name?: string)
            {
                return name ? Mgr.I.nodeMap[name] : Mgr.I.root;
            }

            static addObj(src: Laya.Sprite , parentName?: string)
            {
                Mgr.getNode(parentName).addChild(src);
                return src;
            }

            //严格注意looping
            //parent可用string和sprite3d，默认是Scene 
            //onCpl只有单次efx有效
            //xyz是世界坐标
            //1.循环efx加入即播放，自行控制回收（joinPlay = true）
            //2.仅创建单次efx，但不播放（joinPlay = false）
            //3.单次efx加入即播放，会自动回收（joinPlay = true）
            static addEfx(name, x = 0, y = 0, z = 0, parent?: string | Laya.Sprite , onCpl?: Function, joinPlay = true)
            {
                return Mgr.I.doAddLittleEfx(name, x, y, z, parent, onCpl, joinPlay);
            }
        }
    }

    export module UI
    {
        export enum OpenType
        {
            Once = 1,       //1.once Unique 2.clear onDestroy
            Unique = 2,
            Attach = 3,
            Promo = 4,
            Top = 5,
            Debug = 6,
        }

        export class UIBase extends Laya.Script
        {
            _living: boolean;
            _openType = OpenType.Unique;
            _forceShowPromo = false;
            _fadeIn = true;
            _updateFuncs = [];
            //_screenPos: Laya.Vector3;

            get obj()
            {
                return this.owner as Laya.View;
            }

            get uiName()
            {
                return this["constructor"]["UINAME"];
            }

            onInit() { }
            onShow(args?: any) { }
            onHide() { }
            onRefresh() { }
            //UI千万不要直接用onUpdate，如果需要，使用update
            update() { }

            //原生事件绑定打点，子UI重写时记得super.xxx
            onAwake()
            {
                this._taRecoard("Load");
            }
            onStart()
            {
                this._taRecoard("Start");
            }
            onEnable()
            {
                this._taRecoard("Enable");
            }
            onDisable()
            {
                this._taRecoard("Disable");
            }
            onDestroy()
            {
                this._taRecoard("Destroy");
            }

            _taRecoard(name)
            {
                if (this._openType <= 3)
                {
                    // TJ.Develop.TA[`Event_LifeCycle_${name}`](this.uiName);
                }
            }

            _setLiving(state: boolean)
            {
                this._living = this.obj.visible = this.obj.active = state;
            }

            onUpdate()
            {
                for (let f of this._updateFuncs)
                {
                    f();
                }
                this.update();
            }

            vars(name: string)
            {
                return this.owner[name];
            }

            btnEv(name: string, func: Function, caller: any = this, sound = true, pressAnim = true)
            {
                let btn = this.vars(name) as Laya.Image;
                UIMgr.btnEv(btn, func, caller, sound, pressAnim);
                return btn;
            }

            static btnZoom(e)
            {
                if (!e.target["_inScale"])
                {
                    e.target["_inScale"] = true;
                    e.target["_tScale"].play();
                }
            }

            static btnShrink(e)
            {
                if (e.target["_inScale"])
                {
                    e.target["_inScale"] = false;
                    e.target["_tScale"].reverse(true);
                }
            }

            // background/foreground/foremask
            initPrg(name, isH: boolean = false, dfValue = 0, moveFg = false,)
            {
                let prg = (this.owner[name] as Laya.Sprite).addComponent(ProgressBar) as ProgressBar;
                prg.isH = isH;
                prg.RefreshHN();
                prg.moveFg = moveFg;
                prg.setValue(dfValue);
                return prg;
            }

            // tabBox/child1,child2,child3...
            initTab(name, onTabChange, onTabView, fst = 0, isCancel = false)
            {
                let tab = (this.owner[name] as Laya.Box).addComponent(PageTab);
                tab.init(onTabChange, onTabView, fst, isCancel);
                return tab;
            }

            initSmartNum(name, fmt?: Function, duration?: number)
            {
                let sn = (this.owner[name] as Laya.Text).addComponent(SmartNumber);
                sn.init(fmt, duration);
                return sn;
            }

            // sprite/_FL/mask
            floatLight(name, sx, ex, speed = 12)
            {
                let node = this.owner[name] as Laya.Sprite;
                let floatObj = node.getChildByName("FL") as Laya.Sprite;
                floatObj.x = sx;
                let state = 1;
                let counter = 0;
                let updateFunc = () =>
                {
                    if (state == 0)
                    {
                        counter += 0.02;
                        if (counter > 2)
                        {
                            counter = 0;
                            state = 1;
                        }
                    } else
                    {
                        let x = floatObj.x + speed;
                        if (x > ex)
                        {
                            x = sx;
                            state = 0;
                        }
                        floatObj.x = x;
                    }
                };
                this._updateFuncs.push(updateFunc);
            }

            rotateImgByName(name: string, speed = -1)
            {
                this.rotateImgByObj(this.owner[name], speed);
            }

            rotateImgByObj(img: Laya.Image, speed = -1)
            {
                let updateFunc = () =>
                {
                    img.rotation += speed;
                };
                this._updateFuncs.push(updateFunc);
            }

            fadeImgByName(name: string, maxSize = 1.5, speed = 0.008)
            {
                this.fadeImgByObj(this.owner[name], maxSize, speed);
            }

            fadeImgByObj(img: Laya.Image, maxSize = 1.5, speed = 0.008)
            {
                let size = 1;
                let alpha: number;
                let updateFunc = () =>
                {
                    size += speed;
                    alpha = 1 - (size - 1) / (maxSize - 1);
                    if (size >= maxSize)
                    {
                        size = 1;
                        alpha = 1;
                    }
                    img.scale(size, size);
                    img.alpha = alpha;
                };
                this._updateFuncs.push(updateFunc);
            }

            zoomImgByName(name: string, speed = 0.005, range = 0.1)
            {
                this.zoomImgByObj(this.owner[name], speed, range);
            }

            zoomImgByObj(img: Laya.Image, speed = 0.005, range = 0.1)
            {
                let state = 1;
                let size = 1;
                let maxSize = size + range;
                let minSize = size - range;
                let updateFunc = () =>
                {
                    if (state == 1)
                    {
                        size += speed;
                        if (size >= maxSize)
                        {
                            size = maxSize;
                            state = 2;
                        }
                    } else if (state == 2)
                    {
                        size -= speed;
                        if (size <= minSize)
                        {
                            size = minSize;
                            state = 1;
                        }
                    }
                    img.scale(size, size);
                };
                this._updateFuncs.push(updateFunc);
            }

            hide()
            {
                UIMgr.hide(this.uiName);
            }

            createRenderScene3d(camPx, camPy, camRx, scale = 10, siblingIdx = -1)
            {
                let s3d = new Laya.Scene ();
                if (siblingIdx != -1)
                {
                    this.obj.addChildAt(s3d, siblingIdx);
                } else
                {
                    this.obj.addChild(s3d);
                }
                let cam = s3d.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
                cam.orthographic = true;
                cam.orthographicVerticalSize = scale;
                cam.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
                cam.transform.localPosition.setValue(camPx, camPy, 0);
                cam.transform.localRotationEulerX = camRx;
                this["s3d"] = s3d;
                this["cam"] = cam;
            }

            // screenToScene3d(px: number, py: number, out Pos: Laya.Vector3)
            // {
            //     if (!this._screenPos)
            //     {
            //         this._screenPos = new Laya.Vector3();
            //     }
            //     this._screenPos.setValue(px, py, 0);
            //     this["cam"].convertScreenCoordToOrthographicCoord(this._screenPos, out Pos);
            // }
        }

        // 不管是Laya.Scene.open时候被是自动关闭的，还是Laya.Scene.close关闭的Scene/View，当重新通过Laya.Scene.open打开后，获得的都是是一个新的实例对象，没有任何component，id也是新分配的
        export class Mgr
        {
            static I: Mgr;

            segment: number;
            steps = 2;
            uiRoot: Laya.Sprite;
            uiMap: { [index: string]: UIBase } = {};
            openStack: UIBase[] = [];
            // uiPromo: UIPromo;
            uiTop: UITop;
            uiDebug: UIDebug;
            uiOffset = 0;

            init(segment)
            {
                this.segment = segment / this.steps;
                Laya.Scene.close("sys/UIInit.scene");
                // Laya.Scene.open("sys/UIPromo.scene", false, null, Laya.Handler.create(null, (res: Laya.View) =>
                // {
                //     this.uiPromo = res.addComponent(UIPromo);
                //     this.uiPromo.onInit();
                //     this.openStack.push(this.uiPromo);
                //     
                // }));
                this.checkNext();
                Laya.Scene.open(`sys/UITop.scene`, false, null, Laya.Handler.create(null, (res: Laya.View) =>
                {
                    this.uiTop = res.addComponent(UITop);
                    this.uiTop.onInit();
                    this.uiOffset += 1;

                    if (Formula.debug)
                    {
                        Laya.Scene.open(`sys/UIDebug.scene`, false, null, Laya.Handler.create(null, (res: Laya.View) =>
                        {
                            this.uiDebug = res.addComponent(UIDebug);
                            this.uiDebug.onInit();
                            this.uiOffset += 1;
                            this.checkNext();
                        }));
                    } else
                    {
                        this.checkNext();
                    }
                }));
            }

            checkNext()
            {
                EventMgr.notify("preloadStep", this.segment);
                this.steps--;
                this.steps == 0 && GameMgr.autoLoadNext();
            }

            doShow(name: string, args?: any)
            {
                let ui = this.uiMap[name];
                console.log("dasfadsf=>>>>>", `sys/${name}.scene`);
                if (!ui)
                {
                    Laya.Scene.open(`sys/${name}.scene`, false, null, Laya.Handler.create(null, (res: Laya.View) =>
                    {
                        let cls = G[name];
                        cls["UINAME"] = name;
                        ui = res.addComponent(cls) as UIBase;
                        this.uiMap[name] = ui;
                        ui.onInit();
                        this._show(ui, args);
                    }));
                } else
                {
                    this._show(ui, args);
                }
            }

            // 自动对之前的ui进行关闭，新ui显示到最前面，触发对应事件（show/hide）
            _show(ui: UIBase, args?: any)
            {
                let isUnique = false;
                if (ui._openType == OpenType.Once || ui._openType == OpenType.Unique)
                {
                    isUnique = true;
                    for (let openedUI of this.openStack)
                    {
                        // if (openedUI == this.uiPromo)
                        // {
                        //     this.uiPromo.hide();
                        // } else
                        // {
                        this._hide(openedUI);
                        // }
                    }
                    this.openStack.length = 0;
                    this.openStack.push(ui);
                    // this.uiPromo && this.openStack.push(this.uiPromo);
                } else
                {
                    this.openStack.push(ui);
                }
                ui._setLiving(true);

                let offset = this.uiOffset;
                if (!this.uiRoot)
                {
                    this.uiRoot = Laya.stage.getChildAt(0) as Laya.Sprite;
                    offset = 0;
                }

                // if (this.uiPromo && (isUnique || ui._forceShowPromo))
                // {
                //     let pos = this.uiRoot.numChildren - 1 - offset;
                //     this.uiRoot.setChildIndex(ui.owner, pos - 1);
                //     this.uiRoot.setChildIndex(this.uiPromo.obj, pos);
                // } else
                // {
                let pos = this.uiRoot.numChildren - 1 - offset;
                this.uiRoot.setChildIndex(ui.owner, pos);
                // }

                // console.log(`\t---------set ${ui._name} at index: ${pos}`);
                // for (let i = 0, len = this.uiRoot.numChildren; i < len; i++) {
                //     let uiObj = this.uiRoot.getChildAt(i);
                //     let uiCom = uiObj.getComponent(UIBase);
                //     if (uiCom) {
                //         console.log(`\tui layer:${uiObj["url"]}[${i}] -> ${uiCom._living}`);
                //     } else {
                //         console.log(`\tui layer:${uiObj["url"]}[${i}]`);
                //     }
                // }
                if (ui._fadeIn)
                {
                    TweenMgr.tweenTiny(250, null, (t: Tween.Tweener) =>
                    {
                        ui.obj.alpha = t.factor;
                    }, null, true);
                }
                ui.onShow(args);
            }

            doHide(name: string)
            {
                for (let i = 0, len = this.openStack.length; i < len; i++)
                {
                    let ui = this.openStack[i];
                    if (ui.uiName == name)
                    {
                        // this.openStack[i + 1] == this.uiPromo && this.uiPromo.hide();
                        this.openStack.splice(i, 1);
                        this._hide(ui);
                        break;
                    }
                }
            }

            doRefreshCurShowing()
            {
                for (let ui of this.openStack)
                {
                    ui.onRefresh();
                }
            }

            _hide(ui: UIBase)
            {
                if (ui._openType == OpenType.Once)
                {
                    Laya.Scene.close(ui.obj.url);
                } else
                {
                    ui._setLiving(false);
                }
                ui.onHide();
            }

            static show(name: string, args?: any)
            {
                Mgr.I.doShow(name, args);
            }

            static hide(name: string)
            {
                Mgr.I.doHide(name);
            }

            static refreshCurShowing()
            {
                Mgr.I.doRefreshCurShowing();
            }

            // 0: vert, 1: horz
            static tip(cont: string, mode = 0)
            {
                Mgr.I.uiTop.showTip(cont, mode);
            }

            static interim1(cb?: Function)
            {
                Mgr.I.uiTop.showInterim1(cb);
            }

            static interim2(cb?: Function)
            {
                Mgr.I.uiTop.showInterim2(cb);
            }

            static ctrlWait(state: boolean)
            {
                Mgr.I.uiTop.ctrlWait(state);
            }

            // 过场（waiting,interim1,interim2）会自动关闭
            static ctrlMask(state: boolean)
            {
                Mgr.I.uiTop.ctrlMask(state);
            }

            static guide(targ: Laya.Image)
            {
                Mgr.I.uiTop.guide(targ);
            }

            static guideRect(x, y, w, h, sx, sy, ex, ey)
            {
                Mgr.I.uiTop.guideRect(x, y, w, h, sx, sy, ex, ey);
            }

            static guideCircle(x, y, radius, sx, sy, ex, ey)
            {
                Mgr.I.uiTop.guideCircle(x, y, radius, sx, sy, ex, ey);
            }

            static ctrlGuide(state: boolean)
            {
                Mgr.I.uiTop.ctrlGuide(state);
            }

            static get(name: string)
            {
                let ui = Mgr.I.uiMap[name];
                if (ui && ui._living)
                {
                    return ui;
                } else
                {
                    return null;
                }
            }

            static debugObj(targ: Laya.Sprite )
            {
                Mgr.I.uiDebug.bindObj(targ);
            }

            static btnEv(btn: Laya.Image, func: Function, caller: any, sound = true, pressAnim = true)
            {
                btn.on(Laya.Event.CLICK, caller, () =>
                {
                    sound && GameMgr.playSound("btn");
                    func.call(caller);
                });
                if (pressAnim)
                {
                    btn.on(Laya.Event.MOUSE_DOWN, UIBase, UIBase.btnZoom);
                    btn.on(Laya.Event.MOUSE_UP, UIBase, UIBase.btnShrink);
                    btn.on(Laya.Event.MOUSE_OUT, UIBase, UIBase.btnShrink);
                    btn["_tScale"] = TweenMgr.tweenCust(100, null, (t: Tween.Tweener) =>
                    {
                        let v = 1 + t.factor * 0.04;
                        btn.scale(v, v);
                    }, null, true);
                }
            }

            // 101: 0 285 570
            static showP(id: number, args?)
            {
                //Mgr.I.uiPromo.showP(id, args);
            }

            // 101, 102, 104
            static hideP(id)
            {
                // Mgr.I.uiPromo.hideP(id);
            }
        }

        export class UIDebug extends UIBase
        {
            static OPName = ["localPosition", "localRotationEuler", "localScale"];
            static OPRange = [10, 180, 2];
            _openType = OpenType.Debug;

            uiState: boolean;
            ctrlObj: Laya.Sprite ;
            transTab: PageTab;
            opName: string;
            sldList = [];
            range: number;

            get ctrlTrans()
            {
                return this.ctrlObj.transform;
            }

            onInit()
            {
                this.obj.alpha = 0.5;
                this.btnEv("BtnSwitch", this.onClick_BtnSwitch);
                this.uiState = true;
                this.onClick_BtnSwitch();
                this.btnEv("BtnExecute", () =>
                {
                    EventMgr.notify("debugExeCmd", this.vars("InputCmd").text);
                });
                for (let i = 1; i <= 4; i++)
                {
                    this.btnEv("Btn" + i, () =>
                    {
                        EventMgr.notify("debugBtn" + i);
                    });
                }
                this.transTab = this.initTab("RatioGroup", (idx, state) =>
                {
                    this.changeTransOp(idx);
                }, (child, state, childIdx) =>
                {
                    child.getChildAt(0).skin = state ? "common/ratio2.png" : "common/ratio1.png";
                });
                let index = 0;
                for (let v of ["SldX", "SldY", "SldZ"])
                {
                    let sld = this.vars(v);
                    let item = {
                        id: index, sld: sld, sldT: sld.getChildByName("SldT"),
                        rangeT: sld.getChildByName("Range"),
                        min: 0, max: 100
                    };
                    this.sldList.push(item);
                    sld.on(Laya.Event.CHANGE, this, this.onSldChange, [item]);
                    index++;
                }
                this.vars("RangeInput").on(Laya.Event.ENTER, this, this.onInputCpl);
                (this.vars("VertionT") as Laya.Text).text = Formula.version;

                this._setLiving(true);
            }

            onClick_BtnSwitch()
            {
                this.uiState = !this.uiState;
                this.vars("TransCtrl").visible = this.vars("InputCtrl").visible = this.vars("BtnCtrl").visible = this.uiState;
            }

            onInputCpl(ipt: Laya.TextInput)
            {
                UIDebug.OPRange[this.transTab.curIdx] = Number(ipt.text);
                this.transTab.force(this.transTab.curIdx);
            }

            bindObj(targ: Laya.Sprite )
            {
                this.ctrlObj = targ;
                this.syncTransUIInfo();
            }

            // sld变化（手动修改value或者控件移动都会触发）
            onSldChange(sldItem)
            {
                if (this.ctrlObj)
                {
                    let real = sldItem.min + (sldItem.max - sldItem.min) * sldItem.sld.value / 100;
                    real = Util.precision(real, 2);
                    sldItem.sldT.text = real;
                    if (sldItem.id == 0)
                    {
                        Util.setVec3(this.ctrlTrans, this.opName, real);
                    } else if (sldItem.id == 1)
                    {
                        Util.setVec3(this.ctrlTrans, this.opName, null, real);
                    } else if (sldItem.id == 2)
                    {
                        Util.setVec3(this.ctrlTrans, this.opName, null, null, real);
                    }
                }
            }

            // 切换tab
            changeTransOp(idx)
            {
                this.opName = UIDebug.OPName[idx];
                this.range = UIDebug.OPRange[idx];
                this.vars("RangeInput").text = this.range;
                this.syncTransUIInfo();
            }

            syncTransUIInfo()
            {
                if (this.ctrlObj)
                {
                    let vec = this.ctrlTrans[this.opName];
                    this.setSldItem(0, vec.x);
                    this.setSldItem(1, vec.y);
                    this.setSldItem(2, vec.z);
                }
            }

            setSldItem(id, curVal)
            {
                let item = this.sldList[id];
                item.min = Util.precision(curVal - this.range, 2);
                item.max = Util.precision(curVal + this.range, 2);
                item.rangeT.text = `${item.min} ~ ${item.max}`;
                if (item.sld.value == 50)
                {
                    this.onSldChange(item);
                } else
                {
                    item.sld.value = 50;
                }
            }
        }

        export class UITop extends UIBase
        {
            _openType = OpenType.Top;

            onCpl: Function;
            interim1: Laya.Sprite;
            interim2: Laya.Sprite;
            waitting: Laya.Sprite;
            block: Laya.Sprite;
            lt: Laya.Image;
            lb: Laya.Image;
            rt: Laya.Image;
            rb: Laya.Image;
            cacheSize = new Laya.Point();
            zeroSize = new Laya.Point(0, 0);
            tipList: TipItem[] = [];
            tRot: Tween.Tweener;
            w1: Laya.Image;
            w2: Laya.Image;
            finger: Laya.Image;
            guideContainer: Laya.Sprite;
            hitArea: Laya.HitArea;
            interactionArea: Laya.Sprite;
            tFinger: Tween.Tweener;

            onInit()
            {
                (this.interim1 = this.vars("Interim1")).visible = false;
                (this.interim2 = this.vars("Interim2")).visible = false;
                (this.waitting = this.vars("Waitting")).visible = false;
                (this.finger = this.vars("Finger")).visible = false;
                (this.block = this.btnEv("Block", () => { }, null, false)).visible = false;
                this.lt = this.vars("LT");
                this.lb = this.vars("LB");
                this.rt = this.vars("RT");
                this.rb = this.vars("RB");
                for (let i = 0; i < 3; i++)
                {
                    let item = this.vars("Tip" + i).addComponent(TipItem) as TipItem;
                    item.init(this.tipList);
                    this.tipList.push(item);
                }
                this.tRot = TweenMgr.tweenLoop(3000, this, this.tweenRot, 1);
                this.w1 = this.vars("W1");
                this.w2 = this.vars("W2");
                this._setLiving(true);
            }

            showTip(cont: string, mode)
            {
                let item = this.tipList.pop();
                if (item)
                {
                    !mode ? item.showV(cont) : item.showH(cont);
                }
            }

            showInterim1(cb?: Function)
            {
                this.onCpl = cb;
                this.interim1.visible = this.block.visible = true;
                TweenMgr.tweenTiny(300, this, this.tweenAlpha, this.tweenAlphaCpl, true);
            }

            tweenAlpha(t: Tween.Tweener)
            {
                this.interim1.alpha = t.factor;
            }

            tweenAlphaCpl()
            {
                if (this.onCpl)
                {
                    this.onCpl();
                    this.onCpl = null;
                }
                TweenMgr.tweenTiny(500, this, this.tweenAlpha2, this.tweenAlphaCpl2, true, Laya.Ease.linearNone, 200);
            }

            tweenAlpha2(t: Tween.Tweener)
            {
                this.interim1.alpha = 1 - t.factor;
            }

            tweenAlphaCpl2()
            {
                this.interim1.visible = this.block.visible = false;
            }

            showInterim2(cb?: Function)
            {
                this.onCpl = cb;
                this.interim2.visible = this.block.visible = true;
                this.cacheSize.x = Laya.stage.width * 0.6;
                this.cacheSize.y = Laya.stage.height * 0.6;
                //this.cacheSize.setValue(Laya.stage.width * 0.6, Laya.stage.height * 0.6);
                TweenMgr.tweenTiny(300, this, this.tweenScale, this.tweenScaleCpl, true);
            }

            tweenScale(t: Tween.Tweener)
            {
                TweenMgr.lerp_Vec2(this.zeroSize, this.cacheSize, t);
                let w = t.outParams[0][0];
                let h = t.outParams[0][1];
                this.lt.size(w, h);
                this.lb.size(w, h);
                this.rt.size(w, h);
                this.rb.size(w, h);
            }

            tweenScaleCpl()
            {
                if (this.onCpl)
                {
                    this.onCpl();
                    this.onCpl = null;
                }
                TweenMgr.tweenTiny(400, this, this.tweenScale2, this.tweenScaleCpl2, true, Laya.Ease.linearNone, 250);
            }

            tweenScale2(t: Tween.Tweener)
            {
                TweenMgr.lerp_Vec2(this.cacheSize, this.zeroSize, t);
                let w = t.outParams[0][0];
                let h = t.outParams[0][1];
                this.lt.size(w, h);
                this.lb.size(w, h);
                this.rt.size(w, h);
                this.rb.size(w, h);
            }

            tweenScaleCpl2()
            {
                this.interim2.visible = this.block.visible = false;
            }

            ctrlWait(state: boolean)
            {
                if (state)
                {
                    this.waitting.visible = this.block.visible = true;
                    this.tRot.play();
                } else
                {
                    TweenMgr.tweenTiny(200, this, this.tweenWaitAlpha, this.tweenWaitAlphaCpl, true, Laya.Ease.linearNone, 300);
                }
            }

            tweenWaitAlpha(t: Tween.Tweener)
            {
                this.waitting.alpha = 1 - t.factor;
            }

            tweenWaitAlphaCpl()
            {
                this.tRot.stop();
                this.waitting.visible = this.block.visible = false;
            }

            tweenRot(t: Tween.Tweener)
            {
                this.w1.rotation = this.w2.rotation = t.factor * 360;
            }

            ctrlMask(state: boolean)
            {
                this.block.visible = state;
            }

            _initGuide()
            {
                let guideContainer = new Laya.Sprite();
                Laya.stage.addChild(guideContainer);
                guideContainer.cacheAs = "bitmap";

                let maskArea = new Laya.Sprite();
                guideContainer.addChild(maskArea);
                maskArea.alpha = 0.5;
                maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");

                let interactionArea = new Laya.Sprite();
                guideContainer.addChild(interactionArea);
                interactionArea.blendMode = "destination-out";

                let hitArea = new Laya.HitArea();
                hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");
                guideContainer.hitArea = hitArea;
                guideContainer.mouseEnabled = true;

                this.guideContainer = guideContainer;
                this.hitArea = hitArea;
                this.interactionArea = interactionArea;
            }

            guideRect(x, y, w, h, sx, sy, ex, ey)
            {
                this._before();

                this.hitArea.unHit.clear();
                this.hitArea.unHit.drawRect(x, y, w, h, "#000000");
                this.interactionArea.graphics.clear();
                this.interactionArea.graphics.drawRect(x, y, w, h, "#000000");
                this.finger.visible = true;
                this.finger.pos(sx, sy);

                this._after(sx, sy, ex, ey);
            }

            guideCircle(x, y, radius, sx, sy, ex, ey)
            {
                this._before();

                this.hitArea.unHit.clear();
                this.hitArea.unHit.drawCircle(x, y, radius, "#000000");
                this.interactionArea.graphics.clear();
                this.interactionArea.graphics.drawCircle(x, y, radius, "#000000");
                this.finger.visible = true;
                this.finger.pos(sx, sy);

                this._after(sx, sy, ex, ey);
            }

            guide(targ: Laya.Image)
            {
                this._before();

                let w = targ.width * 1.1;
                let h = targ.height * 1.1;
                let x = targ.x - w * targ.anchorX;
                let y = targ.y - h * targ.anchorY;
                let fingerX = targ.x + w * (targ.anchorX - 0.5);
                let fingerY = targ.y + h * (targ.anchorY - 0.5);

                //---------
                this.hitArea.unHit.clear();
                this.hitArea.unHit.drawRect(x, y, w, h, "#000000");
                this.interactionArea.graphics.clear();
                this.interactionArea.graphics.drawRect(x, y, w, h, "#000000");
                this.finger.visible = true;
                this.finger.pos(fingerX, fingerX);
                //---------

                this._after(fingerX, fingerY, fingerX + 8, fingerY + 8);
            }

            _before()
            {
                if (!this.guideContainer)
                {
                    this._initGuide();
                }
                this.ctrlGuide(true);
            }

            _after(sx, sy, ex, ey)
            {
                this.tFinger = TweenMgr.tweenLoop(500, null, (t: Tween.Tweener) =>
                {
                    TweenMgr.lerp_Num(sx, ex, t, 0);
                    TweenMgr.lerp_Num(sy, ey, t, 1);
                    this.finger.pos(t.outParams[0][0], t.outParams[1][0]);
                }, 2);
                this.tFinger.play();
            }

            ctrlGuide(state: boolean)
            {
                if (this.guideContainer)
                {
                    this.finger.visible = this.guideContainer.visible = state;
                }
                if (this.tFinger)
                {
                    this.tFinger.discard();
                    this.tFinger = null;
                }
            }
        }

        export class UIPromo extends UIBase
        {
            _openType = OpenType.Promo;

            p101List = [];
            p102;
            p103;
            p104;
            p105;
            p106;

            onInit()
            {
                this._setLiving(true);

                for (let i = 1; i <= 6; i++)
                {
                    let tmp = this.attachCom(`P101_${i}`, G["P101"]);
                    this.p101List.push(tmp);
                    tmp.shake = true;
                    tmp.autoRefresh = true;
                }
                this.p102 = this.attachCom("P102", G["P102"]);
                this.p103 = this.attachCom("P103", G["P103"]);
                this.p104 = this.attachCom("P104", G["P104"]);
                this.p105 = this.attachCom("P105", G["P105"]);
                this.p106 = this.attachCom("P106", G["P106"]);
            }

            hide()
            {
                for (let v of this.p101List)
                {
                    v.hidePromo();
                }
                this.p102.hidePromo();
                this.p103.hidePromo();
                this.p104.hidePromo();
                this.p105.hidePromo();
                this.p106.hidePromo();
            }

            attachCom(name, com)
            {
                let tmp = this.obj[name].addComponent(com);
                tmp.onInit();
                return tmp;
            }

            //0 285 570
            showP(id, args)
            {
                if (Formula.banPromo) { return; }
                if (id == 101)
                {
                    let showNum = args.length;
                    for (let i = 0; i < this.p101List.length; i++)
                    {
                        let p101 = this.p101List[i];
                        if (i < showNum)
                        {
                            p101.showPromo(args[i]);
                        } else
                        {
                            p101.hidePromo();
                        }
                    }
                } else
                {
                    this["p" + id].showPromo();
                }
            }

            // 101, 102, 104
            hideP(id)
            {
                if (id == 101)
                {
                    for (let v of this.p101List)
                    {
                        v.hidePromo();
                    }
                } else
                {
                    this["p" + id].hidePromo();
                }
            }
        }

        class TipItem extends Laya.Script
        {
            static initX: number;
            static initY: number;
            static MoveY = [200, 30];
            static MoveX = [1050, -350];
            belong: TipItem[];
            contentT: Laya.Text;
            tBg: Tween.Tweener;
            tVertPos: Tween.Tweener;
            tHorzPosIn: Tween.Tweener;
            tHorzPosOut: Tween.Tweener;
            // vert: 0:淡入 1:移动中 2:淡出
            moving: number;

            init(belong)
            {
                this.belong = belong;
                this.contentT = this.owner.getChildAt(0) as Laya.Text;
                if (TipItem.initX === undefined)
                {
                    TipItem.initX = this.obj.x;
                    TipItem.initY = this.obj.y;
                }
                this.obj.visible = false;
                this.tBg = TweenMgr.tweenCust(300, this, this.tweenAlpha, this.tweenAlphaCpl, true);
                this.tVertPos = TweenMgr.tweenCust(450, this, this.tweenVertPos, this.tweenVertPosCpl, true, Laya.Ease.linearNone, 350);
                this.tHorzPosIn = TweenMgr.tweenCust(300, this, this.tweenHorzPosIn, this.tweenHorzPosInCpl, true, Laya.Ease.backOut);
                this.tHorzPosOut = TweenMgr.tweenCust(300, this, this.tweenHorzPosOut, this.clearSelf, true, Laya.Ease.backIn, 350);
            }

            get obj()
            {
                return this.owner as Laya.Box;
            }

            clearSelf()
            {
                this.obj.visible = false;
                this.belong.push(this);
            }

            tweenAlpha(t: Tween.Tweener)
            {
                this.obj.alpha = t.factor;
            }

            tweenAlphaCpl()
            {
                if (this.moving == 0)
                {
                    this.moving = 1;
                    this.tVertPos.play();
                } else if (this.moving == 2)
                {
                    this.moving = 0;
                    this.clearSelf();
                }
            }

            tweenVertPos(t: Tween.Tweener)
            {
                TweenMgr.lerp_Num(TipItem.MoveY[0], TipItem.MoveY[1], t);
                this.obj.y = t.outParams[0][0];
            }

            tweenVertPosCpl()
            {
                this.moving = 2;
                this.tBg.reverse();
            }

            showV(cont)
            {
                this.moving = 0;
                this.contentT.text = cont;
                this.obj.visible = true;
                this.obj.pos(TipItem.initX, TipItem.MoveY[0]);
                this.tBg.play();
            }

            tweenHorzPosIn(t: Tween.Tweener)
            {
                TweenMgr.lerp_Num(TipItem.MoveX[0], TipItem.initX, t);
                this.obj.x = t.outParams[0][0];
            }

            tweenHorzPosInCpl()
            {
                this.tHorzPosOut.play();
            }

            tweenHorzPosOut(t: Tween.Tweener)
            {
                TweenMgr.lerp_Num(TipItem.initX, TipItem.MoveX[1], t);
                this.obj.x = t.outParams[0][0];
            }

            showH(cont)
            {
                this.contentT.text = cont;
                this.obj.alpha = 1;
                this.obj.visible = true;
                this.obj.pos(TipItem.MoveX[0], TipItem.initY);
                this.tHorzPosIn.play();
            }
        }

        export class ProgressBar extends Laya.Script
        {
            width: number;
            fg: Laya.Image;
            mask: Laya.Image;
            flag: Laya.Image;
            flagInitX: number;
            moveFg: boolean;
            hl: Laya.Image;
            _value: number;
            targV: number;
            virtualV: number;
            tHL: Tween.Tweener;

            isH: boolean;
            isBack: boolean;

            get bg()
            {
                return this.owner as Laya.Image;
            }

            onAwake()
            {
                this.fg = this.owner.getChildAt(0) as Laya.Image;
                this.mask = this.fg["mask"] as Laya.Image;

                this.flag = this.owner.getChildByName("Flag") as Laya.Image;
                this.flag && (this.flagInitX = this.flag.x);
                this.virtualV = 0;
                this.hl = this.owner.getChildByName("HL") as Laya.Image;
                if (this.hl)
                {
                    this.tHL = TweenMgr.tweenCust(200, this, this.tweenHL);
                    this.hl.alpha = 0;
                }
            }

            RefreshHN()
            {
                if (this.isH)
                {
                    this.width = this.mask.height;
                }
                else
                {
                    this.width = this.mask.width;
                }


            }

            aspect()
            {

                if (this.isH)
                {

                    let w = this._value * this.width;
                    if (w < 1) w = 1;
                    if (this.moveFg)
                    {
                        this.fg.height = w;
                    } else
                    {
                        this.mask.height = w;
                    }
                    if (this.flag)
                    {
                        this.flag.x = this.flagInitX + w;
                    }
                }
                else
                {
                    let w = this._value * this.width;
                    if (w < 1) w = 1;
                    if (this.moveFg)
                    {
                        this.fg.width = w;
                    } else
                    {
                        this.mask.width = w;
                    }
                    if (this.flag)
                    {
                        this.flag.x = this.flagInitX + w;
                    }
                }

            }

            setValue(targetValue: number)
            {
                this.virtualV = 0;
                this._value = this.targV = Util.clamp(targetValue, 0, 1);
                this.aspect();
            }

            addValue(delta: number, tween = false)
            {
                if (tween)
                {
                    this.targV += delta;
                    let left = this.targV - Math.floor(this.targV);
                    if (delta > 0)
                    {
                        if (1 - left < 1e-4)
                        {
                            this.targV = 0;
                        } else
                        {
                            this.targV = left;
                        }
                    }
                    this.virtualV += delta;
                } else
                {
                    this._value = Util.clamp(this._value + delta, 0, 1);
                    this.aspect();
                }
            }

            tweenHL(t: Tween.Tweener)
            {
                let v = t.factor;
                if (v < 0.5)
                {
                    v *= 2;
                } else
                {
                    v = 1 - (v - 0.5) * 2;
                }
                this.hl.alpha = v;
            }

            onUpdate()
            {
                if (this.virtualV > 0)
                {
                    let delta = 0.01;
                    let vv = this.virtualV - delta;
                    if (vv <= 0)
                    {
                        delta = this.virtualV;
                        vv = 0;
                    }
                    this.virtualV = vv;

                    let _v = this._value + delta;
                    if ((_v >= 1) || (this.virtualV == 0 && this.targV == 0 && _v != 0))
                    {
                        _v = 0;
                        this.hl && this.tHL.play();
                    }
                    this._value = _v;
                    this.aspect();
                }
            }
        }

        export class PageTab extends Laya.Script
        {
            onTabChange: (idx, state) => {};
            onTabView: (child, state, childIdx) => {};
            isCancel: boolean;
            _curIdx: number;

            get curIdx()
            {
                return this._curIdx;
            }

            set curIdx(value)
            {
                if (this.isCancel)
                {
                    if (this._curIdx == value)
                    {
                        this.onTabView(this.owner.getChildAt(this._curIdx), false, this._curIdx);
                        this.onTabChange(this._curIdx, false);
                        this._curIdx = -1;
                    } else
                    {
                        this.doChangeTab(value);
                    }
                } else
                {
                    if (this._curIdx != value)
                    {
                        this.doChangeTab(value);
                    }
                }
            }

            doChangeTab(value: number)
            {
                this._curIdx != -1 && this.onTabView(this.owner.getChildAt(this._curIdx), false, this._curIdx);
                this._curIdx = value;
                this.onTabView(this.owner.getChildAt(this._curIdx), true, this._curIdx);
                this.onTabChange(this._curIdx, true);
            }

            init(onTabChange, onTabView, fst, isCancel)
            {
                this.onTabChange = onTabChange;
                this.onTabView = onTabView;
                this.isCancel = isCancel;
                this._curIdx = fst;
                for (let i = 0; i < this.owner.numChildren; i++)
                {
                    let child = this.owner.getChildAt(i);
                    child.on(Laya.Event.CLICK, null, () =>
                    {
                        this.curIdx = i;
                    });
                    this.onTabView(child, i == fst, i);
                }
                if (fst != -1)
                {
                    this.onTabChange(fst, true);
                }
            }

            force(idx: number)
            {
                if (idx == -1 && this.isCancel)
                {
                    if (this._curIdx != -1)
                    {
                        this.onTabView(this.owner.getChildAt(this._curIdx), false, this._curIdx);
                        this._curIdx = -1;
                    }
                } else
                {
                    if (this._curIdx == idx)
                    {
                        this.onTabChange(idx, true);
                    } else
                    {
                        this.doChangeTab(idx);
                    }
                }
            }
        }

        export class SmartNumber extends Laya.Script
        {
            nt: Laya.Text;
            tScale: Tween.Tweener;
            curV: number;
            targV: number;
            counter: number;
            fmt: Function;

            set color(colorStr)
            {
                this.nt.color = colorStr;
            }

            init(fmt = this.dfFmt, duration = 200)
            {
                this.fmt = fmt;
                this.nt = this.owner as Laya.Text;
                let hw = this.nt.width * 0.5;
                let hh = this.nt.height * 0.5;
                this.nt.pivot(hw, hh);
                this.nt.pos(this.nt.x + hw, this.nt.y + hh);
                this.tScale = TweenMgr.tweenCust(duration, this, this.tweenScale, this.tweenScaleCpl, true);
            }

            dfFmt(v)
            {
                return v;
            }

            resetNum(num: number)
            {
                this.counter = 0;
                this.targV = this.curV = num;
                this.nt.text = this.fmt(num);
            }

            setNum(num: number)
            {
                this.targV = num;
                this.tScale.play();
            }

            addNum(delta: number)
            {
                this.targV += delta;
                this.tScale.play();
            }

            setNumFrom(num: number, from: number)
            {
                this.resetNum(from);
                this.setNum(num);
            }

            tweenScale(t: Tween.Tweener)
            {
                let v: number;
                if (t.factor < 0.5)
                {
                    v = 1 + 0.3 * t.factor / 0.5;
                } else
                {
                    v = 1.3 - (t.factor / 0.5 - 1) * 0.3;
                }
                this.nt.scale(v, v);
            }

            tweenScaleCpl()
            {
                this.nt.scale(1, 1);
            }

            onUpdate()
            {
                if (this.curV != this.targV)
                {
                    this.counter += Laya.timer.delta;
                    if (this.counter >= 30)
                    {
                        this.counter = 0;
                        let gap = this.targV - this.curV;
                        let delta = Math.floor(gap / 5);
                        if (delta == 0)
                        {
                            delta = gap > 0 ? 1 : -1;
                        }
                        this.curV += delta;
                        this.nt.text = this.fmt(this.curV);
                    }
                }
            }
        }
    }

    export module SubPkg
    {
        export class Mgr
        {
            static I: Mgr;

            pkgFlag: number;
            pkgInfo: { name: string, root: string }[];
            segment: number;

            static subPkgInfo = [
                { name: "sp1", root: "res3d/p1" },
                { name: "sp2", root: "res3d/p2" },
            ];
            init(segment)
            {
                console.log("开始分包", Mgr.subPkgInfo);
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt)
                {
                    this.pkgFlag = 0;
                    this.pkgInfo = Mgr.subPkgInfo;
                    this.segment = segment / this.pkgInfo.length;
                    this.loadPkg_wx();

                } else
                {
                    EventMgr.notify("preloadStep", segment);
                    EventMgr.notify("sgl");
                    GameMgr.autoLoadNext();
                }
            }
            loadPkg_wx()
            {
                if (this.pkgFlag == this.pkgInfo.length)
                {
                    EventMgr.notify("sgl");
                    GameMgr.autoLoadNext();
                } else
                {
                    let info = this.pkgInfo[this.pkgFlag];
                    let name = info.name;
                    let root = info.root;
                    console.log("开始分包 loadPkg_wx()", Mgr.subPkgInfo);
                    Laya.Browser.window.wx.loadSubpackage({
                        name: name,
                        success: (res) =>
                        {
                            console.log(`load ${name} suc`);
                            EventMgr.notify("preloadStep", this.segment);
                            Laya.MiniAdpter.subNativeFiles[name] = root;
                            Laya.MiniAdpter.nativefiles.push(root);
                            this.pkgFlag++;
                            this.loadPkg_wx();
                        },
                        fail: (res) =>
                        {
                            console.error(`load ${name} err: `, res);
                        },
                    });
                }
            }
        }
    }

    export module Fsm
    {
        export abstract class BaseState
        {
            host: any;
            fsm: StateMachine;
            inited = false;
            abstract name: string;

            abstract onInit();
            abstract onEnter(args?: any);
            abstract onExit();

            tryEnter(args?: any)
            {
                if (!this.inited)
                {
                    this.inited = true;
                    this.onInit();
                }
                this.onEnter(args);
            }
        }

        export class StateMachine
        {
            isStart: boolean;
            curState: BaseState;
            stateMap: { [index: string]: BaseState };

            constructor(host: any, tpls: { new(): BaseState }[])
            {
                this.isStart = false;
                this.stateMap = {};
                for (let i = 0; i < tpls.length; i++)
                {
                    let tpl = tpls[i];
                    let s = new tpl();
                    s.host = host;
                    s.fsm = this;
                    this.stateMap[s.name] = s;
                    i == 0 && (this.curState = s);
                }
            }

            to(stateName: string, args?: any)
            {
                if (this.isStart && this.curState.name != stateName)
                {
                    let toState = this.stateMap[stateName];
                    if (toState)
                    {
                        this.curState.onExit();
                        this.curState = toState;
                        this.curState.tryEnter(args);
                    }
                }
            }

            start(args?: any)
            {
                this.isStart = true;
                this.curState.tryEnter(args);
            }
        }
    }

    export module Game
    {
        export class Mgr
        {
            static fsm: Fsm.StateMachine;
            static mgrs = [Event.Mgr, SubPkg.Mgr, Tween.Mgr, Resource.Mgr, Data.Mgr, UI.Mgr, Scene.Mgr];
            static loadSeg = [0.3, 0.02, 0.02, 0.4, 0.02, 0.1, 0.14];
            static curLoadPos = -1;

            static start()
            {
                for (let cls of Mgr.mgrs)
                {
                    cls["I"] = new cls();
                }
                Mgr.fsm = new StateMachine(this, [G["Game_Init"], G["Game_Ready"], G["Game_Main"], G["Game_Settle"]]);
                Mgr.fsm.start();
            }

            static readyAll()
            {
                Mgr.autoLoadNext();
            }

            static autoLoadNext()
            {
                Mgr.curLoadPos += 1;
                let mgrCls = Mgr.mgrs[Mgr.curLoadPos];
                if (mgrCls)
                {
                    mgrCls["I"].init(Mgr.loadSeg[Mgr.curLoadPos]);
                } else
                {
                    Laya.timer.once(300, null, () =>
                    {
                        EventMgr.notify("preloadCpl");
                    });
                }
            }

            // 单次播放音效(小游戏:mp3/android:wav)
            static playSound(name: string)
            {
                // if (DataMgr.getPlayerData("sound"))
                // {
                return Laya.SoundManager.playSound(Formula.getSoundPath(name, 1));
                // }
            }

            // 循环播放背景音乐(mp3)
            static playMusic(name: string)
            {
                //if (DataMgr.getPlayerData("sound"))
                //{
                return Laya.SoundManager.playMusic(Formula.getSoundPath(name, 2));
                //}
            }

            // 1:可以签到 2:今日已领取 3:全部领完
            static checkSign(loop = true, totalTimes = 7)
            {
                let rs = 0;
                let lastTime: number = DataMgr.getPlayerData("lastSignTs");
                if (!lastTime)
                {
                    rs = 1;
                } else
                {
                    let signTimes = DataMgr.getPlayerData("signTimes");
                    let isNewDay = Util.checkNewDay(lastTime);
                    if (loop && isNewDay && signTimes == totalTimes)
                    {
                        DataMgr.setValue("signTimes", 0);
                        signTimes = 0;
                    }
                    if (signTimes < totalTimes)
                    {
                        rs = isNewDay ? 1 : 2;
                    } else
                    {
                        rs = 3;
                    }
                }
                return rs;
            }

            static signWithoutReward()
            {
                DataMgr.setValue("lastSignTs", Date.now());
                DataMgr.deltaNum("signTimes", 1);
            }

            static sign(crc: string, times = 1)
            {
                let prg = DataMgr.getPlayerData("signTimes");
                let confData = LC.SignConf.arr[prg];
                let add = times * confData["reward"];
                DataMgr.deltaNum(crc, add);
                Mgr.signWithoutReward();
                return add;
            }
        }
    }
}

export let SubPkgMgr = Core.SubPkg.Mgr;
export let EventMgr = Core.Event.Mgr;
export let TweenMgr = Core.Tween.Mgr;
export let Tweener = Core.Tween.Tweener;
export let ResourceMgr = Core.Resource.Mgr;
export let DataMgr = Core.Data.Mgr;
export let SceneMgr = Core.Scene.Mgr;
export let UIMgr = Core.UI.Mgr;
export let UIBase = Core.UI.UIBase;
export let UIDebug = Core.UI.UIDebug;
export let UITop = Core.UI.UITop;
export let OpenType = Core.UI.OpenType;
export let GameMgr = Core.Game.Mgr;
export let StateMachine = Core.Fsm.StateMachine;
export let BaseState = Core.Fsm.BaseState;
export let BaseObj = Core.Resource.BaseObj;
export let ObjPool = Core.Resource.ObjPool;