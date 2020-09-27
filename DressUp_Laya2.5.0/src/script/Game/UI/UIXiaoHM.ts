import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import BagListController from "./Bag/BagListController";
import UISubMoneyEf from "./UISubMoneyEf";

export default class UIXiaoHM extends UIBase{

    _openType=OpenType.Attach;
    BackBtn:Laya.Image;
    EnterBtn:Laya.Image;
    onInit()
    {   
        this.BackBtn=this.vars("BackBtn");
        this.EnterBtn=this.vars("EnterBtn");

        this.btnEv("BackBtn",()=>{
            this.hide();
            UIMgr.show("UIWeddingEgg")
        })

        this.btnEv("EnterBtn",()=>{
            UIMgr.show("UIDuiHuan");
            UIMgr.show("UIWeddingEgg")
            this.hide();
        })
    }
}