import { OpenType, UIBase, UIMgr } from "../../Frame/Core";

export default class UIPickEgg extends UIBase{

    _openType=OpenType.Attach;
    LiKeChuDaoBtn:Laya.Image;
    CloseBtn:Laya.Image;
    onInit()
    {
        this.LiKeChuDaoBtn=this.vars("LiKeChuDaoBtn");
        this.CloseBtn=this.vars("CloseBtn");

        this.btnEv("LiKeChuDaoBtn",()=>{
            UIMgr.show("UIRank");
            this.hide();
        })

        this.btnEv("CloseBtn",()=>{
            this.hide();
        })
    }
}