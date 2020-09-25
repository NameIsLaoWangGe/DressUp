import ADManager, { TaT } from "../../Admanager";
import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import RecordManager from "../../RecordManager";

export default class UIWeddingShare extends UIBase{

    _openType=OpenType.Attach;
    ShareBtn:Laya.Image;
    BackBtn:Laya.Image;
    onInit()
    {
        this.ShareBtn=this.vars("ShareBtn");
        this.BackBtn=this.vars("BackBtn");

        this.btnEv("ShareBtn",()=>{
            RecordManager.stopAutoRecord();
            ADManager.TAPoint(TaT.BtnClick, "jiehun_click");
            RecordManager._share(() => {
                UIMgr.tip("分享成功");
                this.hide();
            })
        })

        this.btnEv("BackBtn",()=>{
            this.hide();
        })
    }
}