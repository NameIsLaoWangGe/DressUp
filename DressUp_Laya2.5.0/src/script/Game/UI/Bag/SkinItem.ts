import ClothData from "../../ClothData";
import ClothChange, { clothtype } from "../../ClothChange";
import BagListController from "./BagListController";
import GameDataController from "../../GameDataController";
import { UITop, UIMgr } from "../../../Frame/Core";
import ADManager, { TaT } from "../../../Admanager";
import { LC } from "../../Formula";
import PickClothChange from "../../PickClothChange";
import ZJADMgr, { ShieldLevel } from "../../../ZJADMgr";
import UIReady from "../UIReady";

export default class SkinItem extends Laya.Script {

    /*** 组件 ***/
    SkinChose: Laya.Box;
    BG: Laya.Image;
    Icon: Laya.Image;
    Lock: Laya.Image;//遮罩
    Star: Laya.Image;
    Select: Laya.Image;
    IconParent: Laya.Image;
    Adimage: Laya.Image;//广告按钮
    smallLock: Laya.Image;//小锁图标
    /*** 信息 ***/
    ID: number;
    type: number;
    skinname: string;
    type2: string;
    /***所属List**/
    HeightMax: number = 85;
    WidthtMax: number = 80;

    count: number = 2;

    onAwake() {

        console.log(ZJADMgr.ins.shieldLevel+"风险等级")

        this.SkinChose = this.owner as Laya.Box;
        this.BG = this.SkinChose.getChildByName("BG") as Laya.Image;

        this.IconParent = this.SkinChose.getChildByName("IconParent") as Laya.Image;

        this.Icon = this.IconParent.getChildByName("Icon") as Laya.Image;

        this.Lock = this.SkinChose.getChildByName("Lock") as Laya.Image;
        this.Adimage = this.Lock.getChildAt(1) as Laya.Image;
        this.smallLock = this.Lock.getChildAt(0) as Laya.Image;
        this.Icon.anchorX= this.Icon.anchorY=0.5;
        this.Star = this.SkinChose.getChildByName("Star") as Laya.Image;
        this.Select = this.SkinChose.getChildByName("Select") as Laya.Image;

        //this.SkinChose.on(Laya.Event.MOUSE_DOWN, this, this.onClickTest)
        //this.SkinChose.on(Laya.Event.CLICK, this, this.onClickTest)
        if(ZJADMgr.ins.shieldLevel==ShieldLevel.high)
        {
            this.SkinChose.on(Laya.Event.CLICK, this, this.onClickTest)
        }
        if(ZJADMgr.ins.shieldLevel==ShieldLevel.mid)
        {
            if(ZJADMgr.ins.CheckPlayVideo())// 0 false   1 true
            {
                this.SkinChose.on(Laya.Event.MOUSE_DOWN,this,this.onClickTest)
            }
            else
            {
                this.SkinChose.on(Laya.Event.CLICK, this, this.onClickTest)
            }
        }
        if(ZJADMgr.ins.shieldLevel==ShieldLevel.low)
        {
            this.SkinChose.on(Laya.Event.MOUSE_DOWN,this,this.onClickTest)
        }

    }
    fell(data: ClothData) {
        this.ID = data.ID;
        this.type = data.Type;
        this.skinname = data.Name;
        this.Select.visible = false;
        this.type2 = data.GetType2;
        this.Star.skin = "Btnbar/xing" + data.Star + ".png";
        console.log(data.ID + "" + data.Star);
        this.Lock.visible = !GameDataController.ClothCanUse(data.ID);

        

        // let t1 = this.type2.split('_')[0]
        // if (t1 == "1")
        // {
        // }
        // else
        // {
        //     this.Adimage.visible = GameDataController.ClothDataRefresh[data.ID] == 1;
        // }
        if (data.GetType2 != null || data.ID == 50404 || data.ID == 40601 || data.ID == 40602 || data.ID == 40603 || data.ID == 40604 || data.ID == 40605||data.ID==70201||data.ID==70202)//如果是套装则无法通过看广告获取 翅膀和白雪公主无法通过看广告获取
        // if(data.GetType2 != null || data.ID == 50404)
        {
            this.Adimage.visible = false;
            this.smallLock.visible = true;
        }
        else {
            this.Adimage.visible = true;
            this.smallLock.visible = false;
        }
        console.log(GameDataController.ClothDataRefresh[data.ID], data.ID);


        switch (this.type) {
            case clothtype.Hair:
                if (ClothChange.Instance.nowclothData.Hair == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Dress:
                if (ClothChange.Instance.nowclothData.Dress == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Coat:
                if (ClothChange.Instance.nowclothData.Coat == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Shirt:
                if (ClothChange.Instance.nowclothData.Shirt == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Trousers:
                if (ClothChange.Instance.nowclothData.Trousers == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Socks:

                if (ClothChange.Instance.nowclothData.Socks == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Shose:
                if (ClothChange.Instance.nowclothData.Shose == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Ornament:
                if (ClothChange.Instance.nowclothData.Ornament == this.ID) {
                    this.Select.visible = true;
                }
                break;
            case clothtype.Pet:
                if (ClothChange.Instance.nowclothData.Pet == this.ID) {
                    this.Select.visible = true;
                }
                break;
        }
        this.Icon.skin = data.GetPath1();
        let imageHeight: number = parseFloat(this.Icon.height.toString());
        let imagewidth: number = parseFloat(this.Icon.width.toString());
        this.IconParent.width = 100;
        this.IconParent.height = 100;
        let pr = 0;
        if (imagewidth > imageHeight)//宽大于高
        {
            pr = this.WidthtMax / imagewidth
        }
        else {
            pr = this.HeightMax / imageHeight;
        }
        this.Icon.scaleX = pr;
        this.Icon.scaleY = pr;
        this.Icon.centerX = 0;
        this.Icon.centerY = 0;
    }
   
    onClickTest() {
        ADManager.TAPoint(TaT.BtnClick, "ADhair" + this.ID + "_click")
        // this.count++;
        // console.log(this.count+"count")
        // if(this.count%2==1)
        // {

        // }

        if (this.Lock.visible)//当前上锁
        {
            if (this.Adimage.visible)//需要看广告
            {
                ADManager.ShowReward(() => {
                    this.Select.visible = true;
                    ClothChange.Instance._ClothChange(this.ID, this.type);
                    BagListController.Instance.getlist(this.type)._refresh();
                    let dataall = GameDataController.ClothDataRefresh;
                    dataall[this.ID] = 0;
                    GameDataController.ClothDataRefresh = dataall;
                    UIMgr.tip("恭喜获得一件装扮");

                    ClothChange.Instance.CharmValueChange();
                    (UIMgr.get("UIReady")as UIReady).CharmValueShow();
                }, () => {
                    UIMgr.show("UITip", () => {
                        this.Select.visible = true;
                        ClothChange.Instance._ClothChange(this.ID, this.type);
                        BagListController.Instance.getlist(this.type)._refresh();
                        let dataall = GameDataController.ClothDataRefresh;
                        dataall[this.ID] = 0;
                        GameDataController.ClothDataRefresh = dataall;
                        UIMgr.tip("恭喜获得一件装扮");

                        ClothChange.Instance.CharmValueChange();
                        (UIMgr.get("UIReady")as UIReady).CharmValueShow();
                    })
                })
            }
            else {
                UIMgr.tip("当前装扮未解锁");
            }
        }
        else {
            console.log("点击选择衣服-------", this.ID, "------", this.skinname);
            console.log("                                                     ");
            this.Select.visible = true;
            ClothChange.Instance._ClothChange(this.ID, this.type);
            BagListController.Instance.getlist(this.type)._refresh();

            ClothChange.Instance.CharmValueChange();
            (UIMgr.get("UIReady")as UIReady).CharmValueShow();
        }
    }
}