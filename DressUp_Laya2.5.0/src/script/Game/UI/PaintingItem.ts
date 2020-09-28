import { UIMgr } from "../../Frame/Core";
import GameDataController from "../GameDataController";
import { ManData } from "../ManConfigData";
import UICollection from "./UICollection";

export default class PaintingItem extends Laya.Script{

    painting:Laya.Image;
    paintingID:string;
    man:ManData;
    str={};
    event:Laya.Box;
    onAwake()
    {
        let item=this.owner as Laya.Box;
        this.painting=item.getChildByName("painting") as Laya.Image;
        this.event=item.getChildByName("event") as Laya.Box;
        this.event.on(Laya.Event.CLICK,this,this.itemClick)

        this.man=GameDataController.man;
        console.log(this.man)
        this.str=GameDataController.ManStarRefresh;
    }

    fell(data:string[],index:number)
    {
        this.paintingID=data[index];
        this.painting.skin="https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManPainting/"+ data[index]+".jpg";
    }
    itemClick()
    {
        GameDataController.paint=this.paintingID;
        UIMgr.show("UISure");
    }
}