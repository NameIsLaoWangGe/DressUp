import ADManager, { TaT } from "../../Admanager";
import { UIBase, OpenType } from "../../Frame/Core";
export default class UITip extends UIBase {
    _openType = OpenType.Attach;
    CloseBtn:Laya.Image;
    ConfirmBtn:Laya.Image;
    func:Function=null;
    BG:Laya.Image;
    onInit()
    {

        this.CloseBtn=this.vars("CloseBtn")as Laya.Image;
        this.CloseBtn.visible=false;
        this.BG=this.vars("BG")as Laya.Image;

        this.btnEv("CloseBtn",()=>{
            this.hide();
        });
        
        this.ConfirmBtn=this.vars("ConfirmBtn")as Laya.Image;
        this.btnEv("ConfirmBtn",this.onConfirmBtnClick);
    }

    onRefresh()
    {

    }
    onShow(arg:Function)
    {
        ADManager.TAPoint(TaT.BtnShow,"ADrewardbt_tishiAD");

         this.func=arg;  
         this.CloseBtn.visible=false;
         Laya.timer.once(2000,this,()=>{
            this.CloseBtn.visible=true;
         }) 
    }
    onHide()
    {
        this.hide();
    }
    onConfirmBtnClick()
    {
        ADManager.TAPoint(TaT.BtnClick,"ADrewardbt_tishiAD");
        ADManager.ShowReward(()=>{
            this.func();
            this.hide();
        });
    }
}