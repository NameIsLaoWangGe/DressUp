
import Util from "../../Frame/Util";
import Tweener from "../../Tweener";
import { UIBase, TweenMgr, OpenType } from "../../Frame/Core";


export default class UISubMoneyEf extends UIBase {
    _openType = OpenType.Attach;
    //飞金币界面
    moveFinish() {
        this.hide();
        console.log("paowan");
    };
    tweenAlphaFinish(fun = null) {
        let json = Laya.loader.getRes("Prefab/CoinPref.prefab").json;
        let pref = new Laya.Prefab();
        pref.json = json;
        let bound = 480;
        let parent = this.owner;
        let icon = this.vars("icon");
        let iconX = icon.x;
        let iconY = icon.y;
        let createNum = 30;
        for (let i = 0; i < createNum; i++) {
            let inst = pref.create();
            parent.addChild(inst);
            inst.x = Util.randomInRange_f(260, 560);
            inst.y = Util.randomInRange_f(340, 840);
            TweenMgr.tweenTiny(100, this, (t: Tweener) => {
                inst.scale(t.factor, t.factor);
            }, () => {
                TweenMgr.tweenTiny(400, this, (t: Tweener) => {
                    let inParams = t.getPG("inParams", 0);
                    if (inParams.length == 0) {
                        inParams[0] = inst.x;
                        inParams[1] = iconX - inst.x;
                        inParams[2] = inst.y;
                        inParams[3] = iconY - inst.y;
                    }
                    inst.x = inParams[0] + inParams[1] * t.factor;
                    inst.y = inParams[2] + inParams[3] * t.factor;
                    if (t.factor >= 1)  {
                        (inst as Laya.Image).destroy();
                    }
                }, (i == createNum - 1) ? ()=>{
                    fun();
                    this.moveFinish();
                } : null, false, Laya.Ease.linearNone, 550);
            }, false, Laya.Ease.linearNone, Util.randomInRange_f(0, 15) * i);
        }
    }
    onShow(arg=null) {
        this.tweenAlphaFinish(arg);
    }


}