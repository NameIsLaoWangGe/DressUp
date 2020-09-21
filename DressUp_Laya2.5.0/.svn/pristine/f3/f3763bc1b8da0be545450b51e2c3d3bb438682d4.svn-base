import ClothData from "../ClothData";
import GameDataController from "../GameDataController";
import { UIMgr } from "../../Frame/Core";
import UIActive from "./UIActive";
import ADManager from "../../Admanager";
import BagListController from "./Bag/BagListController";
import UISign from "./UISign";
export default class SignBtn extends Laya.Script
{
    Btn: Laya.Image;//签到按钮
    ADBtn: Laya.Image;//补签按钮
    Icon: Laya.Image;
    Lock: Laya.Image;

    data: ClothData;

    MaxHeight: number = 90;
    MaxWidth: number = 90;

    BtnID: number = 0;
    BtnIndex: number = 0;

    str={};

    onAwake()
    {
        let item = this.owner as Laya.Image;
        this.ADBtn = item.getChildByName("ADBtn") as Laya.Image;
        this.Btn = item.getChildByName("Btn") as Laya.Image;
        this.Lock = item.getChildByName("Lock") as Laya.Image;
        this.Icon = item.getChildByName("icon") as Laya.Image;

        this.Btn.on(Laya.Event.CLICK, this, this.BtnClick);
        this.ADBtn.on(Laya.Event.CLICK, this, this.ADBtnClick);
    }

    Fell(mes: ClothData, index: number)
    {
        //初始化组件 
        this.BtnIndex = index;

        this.data = mes;
        this.Icon.skin = this.data.GetPath1();
        this.BtnID = this.data.ID;
        let imageHeight: number = parseFloat(this.Icon.height.toString());
        let imagewidth: number = parseFloat(this.Icon.width.toString());
        let pr = 0;
        if (imagewidth > imageHeight) //宽大于高
        {
            pr = this.MaxWidth / imagewidth;
        }
        else
        {
            pr = this.MaxHeight / imageHeight;
        }
        this.Icon.scaleX = pr;
        this.Icon.scaleY = pr;
        this.Icon.centerX = 0;
        this.Icon.centerY = 0;
        let days = GameDataController.GetFirstToNow();
        //刷新按钮显示 
        console.log("SignBtn,Fell,GameDataController.ClothDataRefresh", GameDataController.ClothDataRefresh[this.BtnID]);

        if (GameDataController.ClothDataRefresh[this.BtnID] == 1)//如果未解锁
        {
            if (days - 1 > index)//如果距第一次签到差一天以上
            {
                console.log("过期的");
                this.ADSignBtnOn();//补签

            }
            else if (days - 1 == index)
            {
                console.log("当前天");
                this.SignBtnOn();
            }
            else
            {
                console.log("过后天");
                this.BtnClose();
            }
        }
        else
        {
            console.log("SignBtn,Fell  this.BtnID已解锁 ", this.BtnID);
            this.BtnClose();
        }

    

    }
    Refresh()//刷新Lock  Btn    
    {
        let a = GameDataController.ClothDataRefresh[this.data.ID];
        this.Lock.visible = (a == 1);


    }
    BtnClick()
    {
        GameDataController.TodaySign = "1";
        GameDataController.SetLastTime();
        console.log("今日签到成功");
        let dataall = GameDataController.ClothDataRefresh;
        dataall[this.BtnID] = 0;
        GameDataController.ClothDataRefresh = dataall;
        BagListController.Instance.refresh();
        (UIMgr.get("UISign") as UISign).Refresh();
    }
    ADBtnClick()
    {
        console.log("补签", this.BtnIndex);
        ADManager.ShowReward(() =>
        {
            this.GetAward();
        },()=>{
            UIMgr.show("UITip",()=>{
                this.GetAward();
            })
        })
    }
    GetAward()
    {
        GameDataController.SetLastTime();
        console.log("补签成功");
        let dataall = GameDataController.ClothDataRefresh;
        dataall[this.BtnID] = 0;
        GameDataController.ClothDataRefresh = dataall; 
        BagListController.Instance.refresh();               
        (UIMgr.get("UISign") as UISign).Refresh();     
    }

    SignBtnOn()//当日领取按钮展示
    {
        let dataall = GameDataController.ClothDataRefresh;
        if (dataall[this.BtnID] == 0)
        {
            this.BtnClose();
        }
        else{
            this.ADBtn.visible = false;
            this.Btn.visible = true;
        }
    }
    ADSignBtnOn()//广告补签按钮展示
    {
        let dataall = GameDataController.ClothDataRefresh;
        if (dataall[this.BtnID] == 0)//如果已解锁
        {
            this.BtnClose();
        }
        else
        {
            //未解锁
            this.ADBtn.visible = true;
            this.Btn.visible = false;
        }
    }
    BtnClose()//还没到当前天数不显示按钮
    {
        this.ADBtn.visible = false;
        this.Btn.visible = false;
    }


}
