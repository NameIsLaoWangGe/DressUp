import ADManager from "../../Admanager";
import { EventMgr } from "../../Frame/Core";
import { Task } from "./UITask";

export default class UITaskItem extends Laya.Script {
    BtnAds: Laya.Image;
    BtnGet: Laya.Image;
    onAwake(): void {
        this.BtnAds = this.owner.getChildByName('BtnAds') as Laya.Image;
        this.BtnAds.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            e.currentTarget.scale(1.1, 1.1);
        })
        this.BtnAds.on(Laya.Event.MOUSE_UP, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
            EventMgr.notify(Task.EventType.watchAds, [this.owner['_dataSource']['name']]);
            ADManager.ShowReward(() => {

            });
        })
        this.BtnAds.on(Laya.Event.MOUSE_OUT, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
        })


        this.BtnGet = this.owner.getChildByName('BtnGet') as Laya.Image;
        this.BtnGet.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            e.currentTarget.scale(1.1, 1.1);
        })
        this.BtnGet.on(Laya.Event.MOUSE_UP, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
            EventMgr.notify(Task.EventType.getAward, [this.owner['_dataSource']['name']])
        })
        this.BtnGet.on(Laya.Event.MOUSE_OUT, this, (e: Laya.Event) => {
            e.currentTarget.scale(1, 1);
        })
    }
}