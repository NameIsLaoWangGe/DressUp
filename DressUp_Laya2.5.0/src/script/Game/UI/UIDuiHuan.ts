import ADManager from "../../Admanager";
import { Core, OpenType, UIBase, UIMgr } from "../../Frame/Core";
import RecordManager from "../../RecordManager";
import GameDataController from "../GameDataController";
import RecommendChange from "../RecommendChange";
import BagListController from "./Bag/BagListController";

export default class UIDuiHuan extends UIBase{

    _openType=OpenType.Attach;
    DuiHuanBox:Laya.Box;
    InputText:Laya.Label;
    SureBtn:Laya.Image;
    BackBtn:Laya.Image;

    GetBox:Laya.Box;
    Guang:Laya.Image;
    ADBtn:Laya.Image;
    Icon:Laya.Image;
    CloseBtn:Laya.Image;
    ShareBtn:Laya.Image;

    str={
        "111":40601,
        "222":40602,
        "333":40603,
        "444":40604,
        "555":40605,
        "123":70201,
        "321":70202,
    }

    onInit()
    {
        this.DuiHuanBox=this.vars("DuiHuanBox") as Laya.Box;
        this.InputText=this.vars("InputText") as Laya.Label;
        this.SureBtn=this.DuiHuanBox.getChildByName("SureBtn") as Laya.Image;
        this.btnEv("SureBtn",this.SureBtnClick);
        this.BackBtn=this.DuiHuanBox.getChildByName("BackBtn") as Laya.Image;
        this.BackBtn.on(Laya.Event.CLICK,this,()=>{
            this.hide();
        })

        this.GetBox=this.vars("GetBox") as Laya.Box;
        this.Guang=this.GetBox.getChildByName("Guang") as Laya.Image;
        this.ADBtn=this.GetBox.getChildByName("ADBtn") as Laya.Image;
        this.Icon=this.GetBox.getChildByName("Icon") as Laya.Image;
        this.CloseBtn=this.GetBox.getChildByName("CloseBtn") as Laya.Image;
        this.ShareBtn=this.GetBox.getChildByName("ShareBtn")as Laya.Image;
        this.btnEv("CloseBtn",()=>{
            this.hide();
        })
        this.btnEv("ADBtn",this.ADBtnClick);
        this.ShareBtn.on(Laya.Event.CLICK,this,this.ShareBtnClick);


    }
    onShow()
    {
        RecordManager.startAutoRecord();//开始录屏

        Laya.timer.once(3000,this,()=>{
            this.BackBtn.visible=true;
        })
        this.GetBox.visible=false;
        this.CloseBtn.visible=false;
        this.InputText.text="";
        this.ADBtn.visible=true;
        this.ShareBtn.visible=false;
    }
    onHide()
    {
        RecordManager.stopAutoRecord();//停止录屏
        this.DuiHuanBox.visible=true;
        this.GetBox.visible=false;
        this.CloseBtn.visible=false;
        this.BackBtn.visible=false;
    }

    SureBtnClick()
    {
        for(let k in this.str)
        {
            if(this.InputText.text==k)
            {
                let t=this.str[k];
                if(GameDataController.ClothDataRefresh[t]==1)
                {
                    this.DuiHuanBox.visible=false;
                    this.GetBoxShow();
                }
                else{
                    UIMgr.tip("已经获取该装扮了，不能重复获取哦！")
                }
            }
            if(this.str[this.InputText.text]==null)
            {
                UIMgr.tip("兑换码输入错误！")
            }
        }
    }
    ADBtnClick()
    {
        ADManager.ShowReward(()=>{
            this.GetAward();
        },()=>{
            UIMgr.show("UITip",this.GetAward);
        })
    }
    GetAward()
    {
        let dataall = GameDataController.ClothDataRefresh;
        dataall[this.str[this.InputText.text]] = 0;//解锁
        GameDataController.ClothDataRefresh = dataall;
        BagListController.Instance.showList();
        BagListController.Instance.refresh();
        UIMgr.tip("成功解一件新的装扮!");
        this.ADBtn.visible=false;
        Laya.timer.once(1000,this,()=>{
            this.ShareBtn.visible=true;
        })
    }

    GetBoxShow()
    {
        this.GetBox.visible=true;
        Laya.timer.loop(10,this,this.GuangRot);
        //this.Icon.skin="DuiHuanMa/"+this.str[this.InputText.text]+".png";
        this.Icon.skin = "https://h5.tomatojoy.cn/wx/mhdmx/zijie/1.0.8/Cloth/DuiHuanMa/" + this.str[this.InputText.text] + ".png";
        Laya.timer.once(3000,this,()=>{
            RecordManager.stopAutoRecord();//停止录屏
            this.CloseBtn.visible=true;
        });
    }

    ShareBtnClick()
    {
        RecordManager._share(()=>{
            UIMgr.tip("视频分享成功！");
        },()=>{
            UIMgr.tip("视频分享失败...");
        })
    }

    GuangRot()
    {
        this.Guang.rotation+=2;
    }
}