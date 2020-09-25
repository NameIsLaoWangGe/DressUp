import { OpenType, UIBase, UIMgr } from "../../Frame/Core";

export default class UIWeddingEgg extends UIBase{
    _openType=OpenType.Attach;
    QianWangBtn:Laya.Image;
    WeddingCloseBtn:Laya.Image;
    onInit()
    {
        this.QianWangBtn=this.vars("QianWangBtn");
        this.WeddingCloseBtn=this.vars("WeddingCloseBtn");

        this.btnEv("QianWangBtn",()=>{
            UIMgr.show("UIPickEgg");
            UIMgr.show("UIActive");
            this.hide();
            
        })

        this.btnEv("WeddingCloseBtn",()=>{
            this.hide();
            UIMgr.show("UIPickEgg");
        })
    }
}