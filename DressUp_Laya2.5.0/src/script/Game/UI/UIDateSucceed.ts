import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import GameDataController from "../GameDataController";
import { ManData } from "../ManConfigData";
import UIDraw from "./UIDraw";

export default class UIDateSucceed extends UIBase{

    _openType=OpenType.Attach;
    icon:Laya.Image;
    name:Laya.Label;
    StarBox:Laya.Box;
    BackBtn:Laya.Image;
    // data:ManData;
    onInit()
    {
        this.icon=this.vars("icon");
        this.name=this.vars("name");
        this.StarBox=this.vars("StarBox");
        this.BackBtn=this.vars("BackBtn");
        this.BackBtn.on(Laya.Event.CLICK,this,()=>{
            this.hide();
        })  
    }
    onShow()
    {
        let data=GameDataController.man;
        let star:number=GameDataController.ManStarRefresh[data.ID];
        if(star<=3)
        {
            this.icon.skin=data.GetIconPath(star-1);
        }
        else
        {
            this.icon.skin=data.GetIconPath(2);
        }
        this.icon.width=365;
        this.icon.height=502;
        this.icon.centerX=0;
        this.icon.centerY=0;
        this.name.text=data.Name;  
        this.StarShow(GameDataController.ManStarRefresh[data.ID]);
       
        (this.owner["SucceedAni"] as Laya.FrameAnimation).play(0,false);
    }
    onHide()
    {


    }

    StarShow(num:number)
    {
        switch(num)
        {
            case 0:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                break;
            case 1:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                break;
            case 2:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(1)as Laya.Image).visible=true;
                break;
            case 3:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(1)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(2)as Laya.Image).visible=true;
                break
            case 4:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(1)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(2)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(3)as Laya.Image).visible=true;
                break
        }
    }
}