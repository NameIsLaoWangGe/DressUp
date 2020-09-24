import ADManager from "../../Admanager";
import { OpenType, UIBase } from "../../Frame/Core";

export default class UIGet extends UIBase{
    _openType=OpenType.Attach;

    Guang:Laya.Image
    ADBtn:Laya.Image;
    Icon:Laya.Image;
    CloseBtn:Laya.Image;
    ShareBtn:Laya.Image;
    onInit()
    {
        this.Guang=this.vars("Guang");
        this.ADBtn=this.vars("ADBtn");
        this.Icon=this.vars("Icon");
        this.CloseBtn=this.vars("CloseBtn");
        this.ShareBtn=this.vars("ShareBtn");
        this.btnEv("CloseBtn",()=>{
            this.hide();
        })
        this.btnEv("ADBtn",this.ADBtnClick)
        this.btnEv("ShareBtn",this.ShareBtnClick)
    }
    onShow()
    {
        this.CloseBtn.visible=false;
        this.ADBtn.visible=true;
        this.ShareBtn.visible=false;
        Laya.timer.loop(10,this,this.GuangRot);
    }
    onHide()
    {
        this.CloseBtn.visible=false;
        
    }
    ADBtnClick()
    {
        ADManager.ShowReward(()=>{
            this.GetAward();
        })
    }
    ShareBtnClick()
    {

    }
    GuangRot()
    {
        this.Guang.rotation+=2;
    }
    GetAward()
    {
        
    }
}