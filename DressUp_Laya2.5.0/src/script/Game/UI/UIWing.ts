import ADManager, { TaT } from "../../Admanager";
import { UIBase, OpenType, UIMgr } from "../../Frame/Core";
import GameDataController, { ClothPackgeData } from "../GameDataController";
import BagListController from "./Bag/BagListController";
export default class UIWing extends UIBase {
    _openType = OpenType.Attach;

    CloseBtn:Laya.Image;
    ADBtn:Laya.Image;
    BG:Laya.Image;
    onInit()
    {
        this.CloseBtn=this.vars("CloseBtn") as Laya.Image;
        this.btnEv("CloseBtn",()=>{
            this.hide();
        });
        this.ADBtn=this.vars("ADBtn")as Laya.Image;
        this.btnEv("ADBtn",this.ADClick);
        this.BG=this.vars("BG")as Laya.Image;
        Laya.timer.frameLoop(1, this, ()=>{
            this.BG.rotation+=2;
        });
    }
    onShow()
    {
        ADManager.TAPoint(TaT.PageEnter,"chibangpage");
        ADManager.TAPoint(TaT.BtnShow,"ADwings_click");
    }

    onHide()
    {
        ADManager.TAPoint(TaT.PageLeave,"chibangpage");
        this.hide();
    }
    ADClick()
    {
        ADManager.TAPoint(TaT.BtnClick,"ADwings_click");
        ADManager.ShowReward(()=>{
            this.Reward();
        },()=>{
            UIMgr.show("UITip",this.Reward);
        })  
    }

    Reward()
    {
        let dataall = GameDataController.ClothDataRefresh;
        dataall[50404] = 0;//解锁
        GameDataController.ClothDataRefresh = dataall;
        BagListController.Instance.showList();
        UIMgr.tip("成功解锁翅膀!");
        this.hide();
    }
}