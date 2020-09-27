import { OpenType, UIBase, UIMgr } from "../../Frame/Core";

export default class UIChangE extends UIBase
{
    _openType=OpenType.Attach;

    EnterBtn:Laya.Image;
    BackBtn:Laya.Image;
    onInit()
    {
        this.EnterBtn=this.vars("EnterBtn");
        this.BackBtn=this.vars("BackBtn");
        this.btnEv("EnterBtn",()=>{
            UIMgr.show("UIXiaoHM")
            UIMgr.show("UISpinning");
            this.hide();
        })
        this.btnEv("BackBtn",()=>{
            this.hide();
            UIMgr.show("UIXiaoHM");
        })
    }
}