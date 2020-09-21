import { Core, UIBase, TweenMgr, DataMgr, EventMgr, GameMgr, UIMgr, SceneMgr, ObjPool } from "../../Frame/Core";

import Util from "../../Frame/Util";
import ADManager, { TaT } from "../../Admanager";
import GameDataController from "../GameDataController";
import ClothChange from "../ClothChange";
import BagListController from "./Bag/BagListController";
import RecordManager from "../../RecordManager";
import UIPick from "./UIPick";
import UIPickReward from "./UIPickReward";
import UICombine from "./UICombine";


export default class UIReady extends UIBase {
    static Instance: UIReady;
    ClothOpenBtn: Laya.Image;//打开装扮栏
    ADBG: Laya.Label;
    BtnBar: Laya.Box;//导航栏
    ShowView: Laya.Box;//装扮栏

    clothisopen = true;

    Ubag: Core.Tween.Tweener;
    Dbag: Core.Tween.Tweener;
    Rbtn: Core.Tween.Tweener;
    Lbtn: Core.Tween.Tweener;
    btnU: Core.Tween.Tweener;
    btnD: Core.Tween.Tweener;
    FRS: Core.Tween.Tweener;
    FRB: Core.Tween.Tweener;

    FRD: Core.Tween.Tweener;
    FRU: Core.Tween.Tweener;
    // FRL:Core.Tween.Tweener;
    // FRR:Core.Tween.Tweener;


    windowwidth: number;
    windowheight: number;
    FemaleRoot: Laya.Box;

    ClockBtn: Laya.Image;//闹钟
    scaleDelta: number = 0;

    scaleDelta1: number = 0;//分享
    isToOne: boolean = true;
    //BlindBox:Laya.Image;
    Wing: Laya.Image;//翅膀彩蛋按钮

    newmap: Map<string, number> = new Map<string, number>()

    BagAll: Laya.Box;

    ClothReceive: Laya.Image;//重置
    //Area:Laya.Image;
    BG: Laya.Image;
    oldY: number = 0;
    oldX: number = 0;
    isLeftMove: boolean = false;

    FenxiangBtn: Laya.Image;
    MusicBtn: Laya.Image;
    isMusicing: boolean = false;

    oldTime: number = 0;

    str = {};
    str1 = {};
    str2 = {};
    str3 = {};

    Pick: Laya.Image;
    UIPickReward1: Laya.Image;
    LiKeChuDaoBtn: Laya.Image;
    CloseBtn: Laya.Image;
    isPicking: boolean = false;

    UIWedding: Laya.Image;
    QianWangBtn: Laya.Image;
    WeddingCloseBtn: Laya.Image;

    UIWeddingShare: Laya.Image;
    WeddingBackBtn: Laya.Image;
    ShareBtn: Laya.Image;

    UICombine: Laya.Image;
    ConfirmBtn: Laya.Image;

    DuihuanBtn: Laya.Image;
    Notice: Laya.Image;
    Combine: Laya.Image;
    Draw: Laya.Image;
    CharmValue: Laya.Label;
    ShopBtn: Laya.Image;
    onInit() {
        ADManager.TAPoint(TaT.PageEnter, "mainpage");

        //UIMgr.show("UIRecommend");//每日推荐
        //this.CheckPickReward();
        //UIMgr.show("UIPickReward");
        this.CharmValue = this.vars("CharmValue") as Laya.Label;
        this.CharmValue.text = "魅力值:0";

        this.Draw = this.vars("Draw") as Laya.Image;
        this.btnEv("Draw", () => {
            UIMgr.show("UIDraw");
        })
        this.btnEv("Combine", () => {
            this.UICombine.visible = true;
            RecordManager.startAutoRecord();
        })

        this.Notice = this.vars("Notice") as Laya.Image;
        this.btnEv("Notice", () => {
            UIMgr.show("UINotice");
        })

        // this.ShopBtn = this.vars("ShopBtn") as Laya.Image;
     
        // this.btnEv("ShopBtn", () => {
        //     UIMgr.show("UIShop")
        // })

        this.DuihuanBtn = this.vars("DuihuanBtn") as Laya.Image;
        this.btnEv("DuihuanBtn", () => {
            UIMgr.show("UIDuiHuan")
        })

        this.UICombine = this.vars("UICombine") as Laya.Image;
        this.ConfirmBtn = this.vars("ConfirmBtn") as Laya.Image;
        this.btnEv("ConfirmBtn", () => {
            UIMgr.show("UICombine");
            Laya.timer.once(1000, this, () => {
                // GameDataController.TodayHeCheng = "1";
                // GameDataController.SetLastTime();
                this.UICombine.visible = false;
            })
        })

        this.UIWedding = this.vars("UIWedding") as Laya.Image;
        if (GameDataController.ClothDataRefresh[40501] == "1" && GameDataController.ClothDataRefresh[40502] == "1" && GameDataController.ClothDataRefresh[40503] == "1") {
            this.UIWedding.visible = true;
        }
        else {
            this.UIWedding.visible = false;
        }

        this.QianWangBtn = this.vars("QianWangBtn") as Laya.Image;
        this.WeddingCloseBtn = this.vars("WeddingCloseBtn") as Laya.Image;
        this.btnEv("QianWangBtn", () => {
            UIMgr.show("UIActive");
            this.UIWedding.visible = false;
            this.UIPickReward1.visible = true;
        });
        this.btnEv("WeddingCloseBtn", () => {
            this.UIWedding.visible = false;
            this.UIPickReward1.visible = true;
        })


        this.UIPickReward1 = this.vars("UIPickReward1") as Laya.Image;
        if (!this.UIWedding.visible) {
            this.UIPickReward1.visible = true;
        } else {
            this.UIPickReward1.visible = false;
        }
        this.LiKeChuDaoBtn = this.vars("LiKeChuDaoBtn") as Laya.Image;
        this.CloseBtn = this.vars("CloseBtn") as Laya.Image;
        this.btnEv("LiKeChuDaoBtn", () => {
            UIMgr.show("UIRank");
            this.UIPickReward1.visible = false;
        })

        this.btnEv("CloseBtn", () => {
            this.UIPickReward1.visible = false;
        })

        this.UIWeddingShare = this.vars("UIWeddingShare") as Laya.Image;
        this.UIWeddingShare.visible = false;
        this.WeddingBackBtn = this.vars("WeddingBackBtn") as Laya.Image;
        this.ShareBtn = this.vars("ShareBtn") as Laya.Image;
        this.btnEv("WeddingBackBtn", () => {
            this.UIWeddingShare.visible = false;
        })
        this.btnEv("ShareBtn", () => {
            //RecordManager.stopAutoRecord();
            ADManager.TAPoint(TaT.BtnClick, "jiehun_click");
            RecordManager._share(() => {
                UIMgr.tip("分享成功");
                //this.ClearLoop();
                this.UIWeddingShare.visible = false;
            }, () => {
            });
        })

        this.BG = this.vars("BG") as Laya.Image;
        this.BG.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDownListen)
        this.BG.on(Laya.Event.MOUSE_UP, this, this.onMouseUpListen)
        this.BG.on(Laya.Event.MOUSE_OUT, this, this.onMouseOutListen);

        this.BG.on(Laya.Event.CLICK, this, this.refreshClock);


        this.Wing = this.vars("Wing") as Laya.Image;
        Laya.timer.frameLoop(1, this, () => {
            this.scaleDelta += 0.02;
            var scaleValue: number = Math.sin(this.scaleDelta);
            this.Wing.scale(scaleValue, 1);
        })
        this.Wing.on(Laya.Event.CLICK, this, () => {
            UIMgr.show("UIWing");
            this.Wing.visible = false;
        });
        this.windowheight = Laya.Browser.height;
        this.windowwidth = Laya.Browser.width;


        if (Laya.LocalStorage.getItem("Get")) {
            console.log("获取到了");
            console.log(GameDataController.GetFirstToNow())
        }
        else {
            GameDataController.setFirstLoginTime();
            this.UICombine.visible = true;
            RecordManager.startAutoRecord();
        }


        this.btnEv("ClothOpenBtn", this.ClothOpenBtnClick);
        this.btnEv("ActiveBtn", this.ActiveClick);
        this.btnEv("ClothReceive", () => {
            ADManager.TAPoint(TaT.BtnClick, "chongzhi_click");
            ClothChange.Instance.ClothReceive();
            BagListController.Instance.ClothesPageChange(BagListController.Instance.SelectIndex)
        });
        this.btnEv("PhotoBtn", () => {
            UIMgr.show("UIPhotos");
            ADManager.TAPoint(TaT.BtnClick, "xiangce_click");
        });
        this.btnEv("Share", () => {
            ClothChange.Instance.Share();
            ADManager.TAPoint(TaT.BtnClick, "paizhao_click");
        });

        //xxxxxxxxxxxxxxxxxxxxxxx
        this.ClockBtn = this.vars("ClockBtn");
        this.refreshClock();
        this.btnEv("ClockBtn", () => {
            UIMgr.show("UITest");
        });
        //xxxxxxxxxxxxxxxxxxxxxxx
        this.ShowView = this.vars("ShowView");
        this.BtnBar = this.vars("BtnBar");
        this.ClothOpenBtn = this.vars("ClothOpenBtn");

        this.FemaleRoot = this.vars("FemaleRoot");

        this.BagAll = this.vars("BagALL");
        this.Ubag = TweenMgr.tweenCust(300, this, this.tweenbagUp, null, true, Laya.Ease.linearNone);
        this.Lbtn = TweenMgr.tweenCust(300, this, this.tweenbtnLeft, null, true, Laya.Ease.linearNone);
        this.btnU = TweenMgr.tweenCust(200, this, this.RoteUp, null, true, Laya.Ease.linearNone);
        this.FRS = TweenMgr.tweenCust(300, this, this.tweenFBTSmall, null, true, Laya.Ease.linearNone);

        this.Dbag = TweenMgr.tweenCust(300, this, this.tweenbagDown, null, true, Laya.Ease.backOut);
        this.Rbtn = TweenMgr.tweenCust(300, this, this.tweenbtnRight, null, true, Laya.Ease.backOut);
        this.btnD = TweenMgr.tweenCust(200, this, this.RoteDown, null, true, Laya.Ease.linearNone);
        this.FRB = TweenMgr.tweenCust(300, this, this.tweenFBTBig, null, true, Laya.Ease.backOut);

        this.FRD = TweenMgr.tweenCust(300, this, this.tweenFRToDown, null, true, Laya.Ease.backOut);
        this.FRU = TweenMgr.tweenCust(300, this, this.tweenFRToUp, null, true, Laya.Ease.backOut);
        // this.FRL = TweenMgr.tweenCust(300, this, this.tweenFRToLeft, null, true, Laya.Ease.backOut);
        // this.FRR = TweenMgr.tweenCust(300, this, this.tweenFRToRight, null, true, Laya.Ease.backOut);

        //每日签到
        //console.log("this.newmap", GameDataController.ClothDataAsy);
        if (GameDataController.IsNewDay()) {
            console.log("GameDataController.IsNewDay", GameDataController.TodaySign);
            GameDataController.TodaySign = "0";

            console.log("是新的一天")
            GameDataController.TodayHeCheng = "0";
        }

        let havesign = GameDataController.TodaySign;
        if (havesign) {
            if (havesign == "1") {

            }
            else {
                //UIMgr.show("UISign");
                Laya.LocalStorage.setItem("PickNum", "5");
                Laya.LocalStorage.setItem("TodayWinNum", "0");
            }
        }
        else {
            //UIMgr.show("UISign");
            Laya.LocalStorage.setItem("PickNum", "5");
            Laya.LocalStorage.setItem("TodayWinNum", "0");

            GameDataController.TodaySign = "0";
        }

        // let havehecheng = GameDataController.TodayHeCheng;
        // if (havehecheng) {
        //     if (havehecheng == "1") {
        //         this.UICombine.visible = false;
        //     }
        //     else {
        //         this.UICombine.visible = true;
        //     }
        // }
        // else {
        //     this.UICombine.visible = true;
        //     GameDataController.TodayHeCheng = "0";
        // }





        this.MusicBtn = this.vars("MusicBtn") as Laya.Image;
        Laya.SoundManager.playSound("res/sounds/CCBGM.mp3", 0);
        Laya.timer.frameLoop(1, this, this.MusicRot);
        this.btnEv("MusicBtn", () => {
            this.isMusicing = !this.isMusicing;
            if (!this.isMusicing) {
                console.log("xxxxxxxxxxxxxxxxxx1");
                //this.isMusicing=true;
                Laya.SoundManager.playSound("res/sounds/CCBGM.mp3", 0);
                Laya.timer.frameLoop(1, this, this.MusicRot);
                let a = this.MusicBtn.getChildByName("No") as Laya.Image;
                a.visible = false;
            }
            else {
                console.log("xxxxxxxxxxxxxxxxxx2");
                //this.isMusicing=false;
                Laya.SoundManager.stopSound("res/sounds/CCBGM.mp3");
                Laya.timer.clear(this, this.MusicRot);
                let a = this.MusicBtn.getChildByName("No") as Laya.Image;
                a.visible = true;
            }
        })


        //this.FenxiangBtn=this.vars("FenxiangBtn")as Laya.Image;


        // this.btnEv("FenxiangBtn",()=>{
        //     //RecordManager.stopAutoRecord();
        //     ADManager.TAPoint(TaT.BtnClick,"fenxiang_click");
        //     RecordManager._share(()=>{
        //         UIMgr.tip("分享成功");
        //         this.FenxiangBtn.visible=false;
        //         this.ClearLoop();
        //     },()=>{
        //         UIMgr.tip("分享失败！")
        //     });
        //     // Laya.timer.once(5000,this,this.Record); 
        // })


        this.Pick = this.vars("Pick") as Laya.Image;

        this.btnEv("Pick", () => {
            UIMgr.show("UIRank");
            this.isPicking = true;
            ADManager.TAPoint(TaT.BtnClick, "pk_main");
        });
    }

    refreshClock() {
        var current: Date = new Date();
        var hour = current.getHours()
        Laya.timer.clear(this, this.ClockShake);
        if (hour >= 12 && hour <= 14) {
            this.ClockBtn.visible = true;
            Laya.timer.frameLoop(1, this, this.ClockShake)
        }
        else {
            this.ClockBtn.visible = false;
        }
    }

    ClockShake() {
        this.scaleDelta1 += 0.02;
        var scaleValue: number = Math.sin(this.scaleDelta1);
        this.ClockBtn.scale(scaleValue, scaleValue);
    }
    MusicRot() {
        this.MusicBtn.rotation += 2;
    }

    ActiveClick() {
        UIMgr.show("UIActive");
    }

    // Record()
    // {
    //     console.log("开始录屏。。。。。。。。。。");
    //     // RecordManager.stopAutoRecord();
    //     RecordManager.startAutoRecord();
    //     this.FenxiangBtn.visible=false;
    //     Laya.timer.once(25000,this,this.RecordLoop);
    // }


    // RecordLoop()
    // {
    //     console.log("结束录屏.................");  
    //     RecordManager.stopAutoRecord();
    //     //this.FenxiangBtn.visible=true;
    //     Laya.timer.once(5000,this,this.Record);
    // }
    // ClearaLL()
    // {
    //     RecordManager.stopAutoRecord();
    //     Laya.timer.clear(this,this.RecordLoop);
    //     Laya.timer.clear(this,this.Record);
    //     this.FenxiangBtn.visible=false;

    //     console.log("执行了ClearaLL");
    // }


    // ClearLoop()
    // {
    //     RecordManager.stopAutoRecord();
    //     Laya.timer.clear(this,this.RecordLoop);
    //     this.Record();
    //     console.log("执行了ClearLoop");
    // }

    // FenxiangBtnShake()
    // {
    //     Laya.timer.frameLoop(1,this,()=>{
    //         this.ControlYunDong();
    //         this.FenxiangBtn.scale(this.scaleDelta1,1);
    //     })
    // }

    // ControlYunDong()
    // {
    //     if(this.isToOne)
    //     {
    //         this.scaleDelta1+=0.02;
    //         if(this.scaleDelta1>=1)
    //         {
    //             this.isToOne=false;
    //         }
    //     }
    //     else{
    //         this.scaleDelta1-=0.02;
    //         if(this.scaleDelta1<=0)
    //         {
    //             this.isToOne=true;
    //         }
    //     }
    // }

    onShow() {


        // this.FenxiangBtnShake()
        ADManager.TAPoint(TaT.BtnShow, "fenxiang_click");
        ADManager.TAPoint(TaT.BtnShow, "paizhao_click");
        ADManager.TAPoint(TaT.BtnShow, "chongzhi_click");
        ADManager.TAPoint(TaT.BtnShow, "fangda_click");
        ADManager.TAPoint(TaT.BtnShow, "xiangce_click");
        ADManager.TAPoint(TaT.BtnShow, "pk_main");
        ADManager.TAPoint(TaT.BtnShow, "jiehun_click");
        //UIMgr.show("UISign");

    }

    onHide() {

    }
    ClothOpenBtnClick() {
        if (this.clothisopen) {
            ADManager.TAPoint(TaT.BtnClick, "fangda_click");
            console.log("消失");
            this.Dbag.play();
            //this.Rbtn.play();
            this.btnU.play();
            this.FRB.play();
            let a: Map<string, number> = Laya.LocalStorage.getJSON("ClothData");


        }
        else {
            console.log("展示");
            //this.Lbtn.play();
            this.Ubag.play();
            this.btnD.play();
            this.FRS.play();
        }
        this.clothisopen = !this.clothisopen;
    }
    RoteDown(t: Core.Tween.Tweener) {
        let nbtm: number = this.ClothOpenBtn.rotation;
        TweenMgr.lerp_Num(nbtm, 180, t);
        this.ClothOpenBtn.rotation = t.outParams[0][0];
    }
    RoteUp(t: Core.Tween.Tweener) {
        let nbtm: number = this.ClothOpenBtn.rotation;
        TweenMgr.lerp_Num(nbtm, 0, t);
        this.ClothOpenBtn.rotation = t.outParams[0][0];
    }


    tweenbagUp(t: Core.Tween.Tweener) {
        let nbtm: number = this.BagAll.bottom;
        TweenMgr.lerp_Num(nbtm, -37, t);
        this.BagAll.bottom = t.outParams[0][0];
    }
    tweenbagDown(t: Core.Tween.Tweener) {
        let nbtm: number = this.BagAll.bottom;
        TweenMgr.lerp_Num(nbtm, -485, t);
        this.BagAll.bottom = t.outParams[0][0];
    }
    tweenbtnLeft(t: Core.Tween.Tweener) {
        let nX: number = this.BtnBar.x;
        TweenMgr.lerp_Num(nX, 75, t);
        this.BtnBar.x = t.outParams[0][0];
    }
    tweenbtnRight(t: Core.Tween.Tweener) {
        let nX: number = this.BtnBar.x;
        TweenMgr.lerp_Num(nX, GameDataController.windowWidth - 75, t);
        this.BtnBar.x = t.outParams[0][0];
    }

    tweenFBTSmall(t: Core.Tween.Tweener) {
        let nX: number = this.FemaleRoot.scaleX;
        TweenMgr.lerp_Num(nX, 0.8, t);
        this.FemaleRoot.scaleX = this.FemaleRoot.scaleY = t.outParams[0][0];
        this.BG.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDownListen)

    }
    tweenFBTBig(t: Core.Tween.Tweener) {
        let nX: number = this.FemaleRoot.scaleX;
        TweenMgr.lerp_Num(nX, 1.2, t);
        this.FemaleRoot.scaleX = this.FemaleRoot.scaleY = t.outParams[0][0];
        this.BG.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDownListen)
    }
    onClick_Btnshortcut() {
        UIMgr.show("UIMain");
    }

    onMouseMoveListen(e: Laya.Event) {
        if (this.BG.mouseY > this.oldY) {
            if (this.BG.mouseY - this.oldY > 200) {
                console.log("下滑");
                this.FRD.play();
                if (!this.Wing.visible && GameDataController.ClothDataRefresh[50404] == 1) {
                    this.Wing.visible = true;
                }
            }
        }
        if (this.BG.mouseX < this.oldX) {
            if (this.oldX - this.BG.mouseX > 150) {
                console.log("oldX" + this.oldX);
                console.log(this.BG.mouseX);
                console.log("左滑" + (this.oldX - this.BG.mouseX));

            }
        }
    }
    onMouseDownListen() {
        this.oldY = this.BG.mouseY;
        this.oldX = this.BG.mouseX;
        this.BG.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveListen);
    }
    onMouseUpListen() {
        console.log("鼠标抬起");
        this.BG.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveListen);
        this.FRU.play();
        //this.FRR.play();

    }
    onMouseOutListen() {
        console.log("不在目标区域");
        this.FRU.play();
        //this.FRR.play();

        this.BG.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveListen);
    }

    tweenFRToDown(t: Core.Tween.Tweener) {
        TweenMgr.lerp_Num(this.FemaleRoot.centerY, -60, t);
        this.FemaleRoot.centerY = t.outParams[0][0];
    }
    tweenFRToUp(t: Core.Tween.Tweener) {
        TweenMgr.lerp_Num(this.FemaleRoot.centerY, -193, t);
        this.FemaleRoot.centerY = t.outParams[0][0];
    }
    // tweenFRToLeft(t:Core.Tween.Tweener)
    // {
    //     TweenMgr.lerp_Num(this.FemaleRoot.centerX,-100,t);
    //     this.FemaleRoot.centerX=t.outParams[0][0];
    // }
    // tweenFRToRight(t:Core.Tween.Tweener)
    // {
    //     TweenMgr.lerp_Num(this.FemaleRoot.centerX,-12,t);
    //     this.FemaleRoot.centerX=t.outParams[0][0];
    //     this.isLeftMove=true;
    // }

    Refresh() {
        //更新橱窗套装信息
        GameDataController.ClothPackge2.cloths1.forEach((v, i) => {
            let nv = GameDataController.ClothDataRefresh[GameDataController.ClothPackge2.cloths1[i].ID]
            this.str[GameDataController.ClothPackge2.cloths1[i].ID] = nv;
        });
        GameDataController.ClothdatapackSet(GameDataController.ClothPackge2.cloths1[0].GetType2, this.str)//第一套

        GameDataController.ClothPackge2.cloths2.forEach((v, i) => {
            let nv = GameDataController.ClothDataRefresh[GameDataController.ClothPackge2.cloths2[i].ID]
            this.str1[GameDataController.ClothPackge2.cloths2[i].ID] = nv;
        });
        GameDataController.ClothdatapackSet(GameDataController.ClothPackge2.cloths2[0].GetType2, this.str1)//第二套

        GameDataController.ClothPackge2.cloths3.forEach((v, i) => {
            let nv = GameDataController.ClothDataRefresh[GameDataController.ClothPackge2.cloths3[i].ID]
            this.str2[GameDataController.ClothPackge2.cloths3[i].ID] = nv;
        });
        GameDataController.ClothdatapackSet(GameDataController.ClothPackge2.cloths3[0].GetType2, this.str2)//第三套

    }
    CharmValueShow() {
        this.CharmValue.text = "魅力值:" + GameDataController.CharmValue;
    }
}