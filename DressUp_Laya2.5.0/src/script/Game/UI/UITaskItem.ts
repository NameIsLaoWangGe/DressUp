import ADManager from "../../Admanager";
import { EventMgr, UIMgr } from "../../Frame/Core";
import UIMain from "./UIMain";
import { Scratchers, Task } from "./UITask";

export default class UITaskItem extends Laya.Script {
    BtnAds: Laya.Image;
    BtnGet: Laya.Image;
    onAwake(): void {
        this.BtnAds = this.owner.getChildByName('BtnAds') as Laya.Image;
        this.BtnAds.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            e.currentTarget.scale(1.1, 1.1);
        })
        this.BtnAds.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            e.currentTarget.scale(1.1, 1.1);
        })
        this.BtnAds.on(Laya.Event.MOUSE_UP, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                EventMgr.notify(Task.EventType.watchAds, [this.owner['_dataSource']['name']]);
            });

        })
        this.BtnAds.on(Laya.Event.MOUSE_OUT, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
        })

        this.BtnGet = this.owner.getChildByName('BtnGet') as Laya.Image;
        this.BtnGet.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            e.currentTarget.scale(1.1, 1.1);
        })
        this.BtnGet.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            e.currentTarget.scale(1.1, 1.1);
        })
        this.BtnGet.on(Laya.Event.MOUSE_UP, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
            if (this.owner['_dataSource']['get'] == 1) {
                EventMgr.notify(Scratchers.EventType.startScratcher, [this.owner['_dataSource']['name']]);
            } else if (this.owner['_dataSource']['get'] == 0) {
                UIMgr.tip('任务未完成！');
            }
        })
        this.BtnGet.on(Laya.Event.MOUSE_OUT, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
        })
    }
}