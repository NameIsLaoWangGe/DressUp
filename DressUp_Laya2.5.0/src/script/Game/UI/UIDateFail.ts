import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import UIDraw from "./UIDraw";

export default class UIDateFail extends UIBase{

    _openType=OpenType.Attach;
    BackBtn:Laya.Image;
    onInit()
    {
        this.BackBtn=this.vars("BackBtn");
        this.btnEv("BackBtn",()=>{
            this.hide();
            (UIMgr.get("UIDraw") as UIDraw).onHide();
        })
    }

    onShow()
    {
        (this.owner["failAni"] as Laya.FrameAnimation).play(0,true);
    }
    onHide()
    {
        
    }
}