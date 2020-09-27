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
import { Animation2D, Effects, TimerAdmin } from "../../Effects/lwg";


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

    DuihuanBtn: Laya.Image;
    Notice: Laya.Image;
    Combine: Laya.Image;
    Draw: Laya.Image;
    AdDraw: Laya.Image;
    Charm: Laya.Image;
    Shop: Laya.Image;
    Spinning: Laya.Image;
    onInit() {
        ADManager.TAPoint(TaT.PageEnter, "mainpage");


        this.Spinning = this.vars("Spinning") as Laya.Image;
        this.btnEv("Spinning", () => {
            UIMgr.show("UISpinning");
        })

        this.Shop = this.vars("Shop") as Laya.Image;
        this.btnEv("Shop", () => {
            UIMgr.show("UITask")
        })

        this.Charm = this.vars("Charm") as Laya.Image;
        this.CharmValueShow();

        this.Draw = this.vars("Draw") as Laya.Image;
        this.AdDraw = this.Draw.getChildByName("AD") as Laya.Image;
        if (Laya.LocalStorage.getItem("DrawAd") == "1") {
            this.AdDraw.visible = true;
        }

        this.btnEv("Draw", () => {
            if (Laya.LocalStorage.getItem("DrawAd")) {
                console.log("存在drawad")
                if (Laya.LocalStorage.getItem("DrawAd") == "1") {
                    ADManager.ShowReward(() => {
                        UIMgr.show("UIDraw");
                    })
                }
            }
            else {
                console.log("不存在drawad")
                Laya.LocalStorage.setItem("DrawAd", "1");
                UIMgr.show("UIDraw");
                this.AdDraw.visible = true;
            }
        })

        this.btnEv("Combine", () => {
            UIMgr.show("UICombine");
        })

        this.Notice = this.vars("Notice") as Laya.Image;
        this.btnEv("Notice", () => {
            UIMgr.show("UINotice");
        })

        this.DuihuanBtn = this.vars("DuihuanBtn") as Laya.Image;
        this.btnEv("DuihuanBtn", () => {
            UIMgr.show("UIDuiHuan")
        })

        UIMgr.show("UIChangE");
        // if (GameDataController.ClothDataRefresh[40501] == "1" && GameDataController.ClothDataRefresh[40502] == "1" && GameDataController.ClothDataRefresh[40503] == "1") {
        //     UIMgr.show("UIWeddingEgg");
        // }
        // else {
        //     UIMgr.show("UIPickEgg");
        // }

        this.BG = this.vars("BG") as Laya.Image;
        this.BG.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDownListen)
        this.BG.on(Laya.Event.MOUSE_UP, this, this.onMouseUpListen)
        this.BG.on(Laya.Event.MOUSE_OUT, this, this.onMouseOutListen);

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
        else { //如果是第一次登陆
            GameDataController.setFirstLoginTime();
            UIMgr.show("UICombine");
            RecordManager.startAutoRecord();
            GameDataController.ShopCharmValue = "0";
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

        this.Pick = this.vars("Pick") as Laya.Image;

        this.btnEv("Pick", () => {
            UIMgr.show("UIRank");
            this.isPicking = true;
            ADManager.TAPoint(TaT.BtnClick, "pk_main");
        });
        this.effcets();
        // this.changeEffcets('open');
    }

    effcets(): void {

        let CEBox = this.vars('ChangeEffect') as Laya.Box;

        TimerAdmin._frameRandomLoop(50, 100, this, () => {
            if (CEBox.visible) {
                return;
            }
            Effects._Particle._slowlyUp(this.vars('E1'), null, null, null, null, null, [Effects._SkinUrl.圆形发光1], [[255, 255, 100, 1], [150, 150, 100, 1]], 20);
        })
        TimerAdmin._frameRandomLoop(50, 100, this, () => {
            if (CEBox.visible) {
                return;
            }
            Effects._Particle._slowlyUp(this.vars('E2'), null, null, null, null, null, [Effects._SkinUrl.圆形发光1], [[255, 255, 100, 1], [150, 150, 100, 1]], 20);
        })

        let YueLiang = CEBox.getChildByName('YueLiang') as Laya.Image;
        let SnowParent = CEBox.getChildByName('SnowParent') as Laya.Image;
        TimerAdmin._frameRandomLoop(80, 220, this, () => {
            Effects._Glitter._simpleInfinite(YueLiang, 0, 0, 809, 849, 0, 'ce/yueliangguang.png');
        })
        TimerAdmin._frameRandomLoop(50, 140, this, () => {
            Effects._Particle._snow(SnowParent, new Laya.Point(Laya.stage.width / 2, 0), [Laya.stage.width / 2, 0], [20, 35], null, null, [Effects._SkinUrl.花4], [[180, 50, 50, 1], [255, 255, 100, 1]], null, [Laya.stage.width / 2 + 200, Laya.stage.width / 2 + 500]);
        })
    }


    /**
     * 嫦娥的动效
     * type=already打开界面时已经装扮好了，直接播放动效
     * type=open是三个装扮触发时播放;
     * type=close是三个装扮被拆开时播放;
     * @param type
     */
    changeEffcets(type): void {
        var open = () => {
            for (let index = 0; index < CEBox.numChildren; index++) {
                const element = CEBox.getChildAt(index) as Laya.Image;
                if (element.name.substring(0, 3) == 'Yun') {
                    let num = Number(element.name.substr(3, 1));
                    new function () {
                        let time = 25000;
                        var yunCirculation = () => {
                            Animation2D.move_Simple(element, Laya.stage.width + 200, element.y, -element.width - 50, element.y, time * num, 0, () => {
                                yunCirculation();
                            });
                        }
                        Animation2D.move_Simple(element, element.x, element.y, -element.width - 50, element.y, time * num, 0, () => {
                            yunCirculation();
                        });
                    }
                }
            }
        }

        let CEBox = this.vars('ChangeEffect') as Laya.Box;
        if (type == 'already') {
            CEBox.visible = true;
            open();
        } else if (type == 'open') {
            CEBox.visible = true;
            CEBox.alpha = 0;
            open();
            Animation2D.fadeOut(CEBox, 0, 1, 1000, 5000, () => {
            });
        } else if (type == 'close') {
            Animation2D.fadeOut(CEBox, 1, 0, 1000, 5000, () => {
                CEBox.visible = false;
            });
        }
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
        this.Refresh();

        // this.FenxiangBtnShake()
        ADManager.TAPoint(TaT.BtnShow, "fenxiang_click");
        ADManager.TAPoint(TaT.BtnShow, "paizhao_click");
        ADManager.TAPoint(TaT.BtnShow, "chongzhi_click");
        ADManager.TAPoint(TaT.BtnShow, "fangda_click");
        ADManager.TAPoint(TaT.BtnShow, "xiangce_click");
        ADManager.TAPoint(TaT.BtnShow, "pk_main");
        ADManager.TAPoint(TaT.BtnShow, "jiehun_click");
        //UIMgr.show("UISign");
        GameDataController.CharmValue = "0";
        this.CharmValueShow();
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
        console.log("xxxxxxxxxxxxx");
        (this.Charm.getChildByName("CharmValue") as Laya.FontClip).value = (parseInt(GameDataController.CharmValue) + parseInt(GameDataController.ShopCharmValue)).toString();
    }
}