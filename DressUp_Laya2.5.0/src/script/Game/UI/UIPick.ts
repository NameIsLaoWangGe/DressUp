import ADManager, { TaT } from "../../Admanager";
import { Core, TweenMgr, UIBase, UIMgr } from "../../Frame/Core";

import { OpenType } from "../../Frame/Core";
import Util from "../../Frame/Util";
import RecordManager from "../../RecordManager";
import ClothChange from "../ClothChange";
import GameDataController from "../GameDataController";
import PickClothChange from "../PickClothChange";
import PickClothChangeT from "../PickClothChangeT";
import UIRank from "./UIRank";
import UIReady from "./UIReady";

export default class UIPick extends UIBase {
    _openType = OpenType.Attach;
    FemaleRoot: Laya.Box;
    _PickClothChange: PickClothChange;
    _PickClothChangT: PickClothChangeT;
    FemaleRoot1: Laya.Box;
    loading: Laya.Image;
    //Prg:Laya.Image;
    BackBtn: Laya.Image;

    FRToLeft: Core.Tween.Tweener;
    FRToRight: Core.Tween.Tweener;

    Vote_other: Laya.Image;
    Vote_me: Laya.Image;
    otherPre: Laya.Label;
    myPre: Laya.Label

    otherCount: number = 0;
    myCount: number = 0;
    otherNum: number = 0;
    myNum: number = 0;

    WinMark: Laya.Image;
    LoseMark: Laya.Image;
    Light: Laya.Image;

    WinUI: Laya.Image;
    LoseUI: Laya.Image;
    ShareUI: Laya.Image;
    ShareBtn: Laya.Image;
    CloseBtn: Laya.Image;
    WinBox: Laya.Box;
    LoseBox: Laya.Box;
    ShareBox: Laya.Box;

    isWin: boolean = false;
    isLose: boolean = false;
    OkBtn: Laya.Image;
    NoBtn: Laya.Image;
    VoteNum: Laya.Label;
    ContinueBtn: Laya.Image;

    PickCount: number = 0;

    onInit() {
        this.FemaleRoot = this.vars("FemaleRoot") as Laya.Box;
        this._PickClothChange = this.FemaleRoot.getComponent(PickClothChange);


        this.FemaleRoot1 = this.vars("FemaleRoot1") as Laya.Box;
        this._PickClothChangT = this.FemaleRoot1.getComponent(PickClothChangeT);


        this.BackBtn = this.vars("BackBtn") as Laya.Image;
        this.BackBtn.visible = false;

        this.btnEv("BackBtn", () => {
            this.hide();
        })

        this.FRToLeft = TweenMgr.tweenCust(1000, this, this.tweenFRToLeft, null, true, Laya.Ease.backOut);
        this.FRToRight = TweenMgr.tweenCust(1000, this, this.tweenFRToRight, null, true, Laya.Ease.backOut);

        this.Vote_other = this.vars("Vote_other") as Laya.Image;
        this.otherPre = this.Vote_other.getChildByName("otherPre") as Laya.Label;
        this.Vote_me = this.vars("Vote_me") as Laya.Image;
        this.myPre = this.Vote_me.getChildByName("myPre") as Laya.Label;


        this.WinMark = this.vars("WinMark") as Laya.Image;
        this.LoseMark = this.vars("LoseMark") as Laya.Image;
        this.Light = this.vars("Light") as Laya.Image;

        this.WinUI = this.vars("WinUI") as Laya.Image;
        this.LoseUI = this.vars("LoseUI") as Laya.Image;
        this.WinBox = this.WinUI.getChildByName("WinBox") as Laya.Box;
        this.LoseBox = this.LoseUI.getChildByName("LoseBox") as Laya.Box;
        this.OkBtn = this.WinBox.getChildByName("OkBtn") as Laya.Image;
        this.NoBtn = this.WinBox.getChildByName("NoBtn") as Laya.Image;
        this.VoteNum = this.LoseBox.getChildByName("VoteNum") as Laya.Label;
        this.ContinueBtn = this.LoseBox.getChildByName("ContinueBtn") as Laya.Image;

        this.btnEv("OkBtn", this.OkBtnClick);
        this.btnEv("NoBtn", this.NoBtnClick);
        this.btnEv("ContinueBtn", this.ContinueBtnClick);

        this.ShareUI = this.vars("ShareUI") as Laya.Image;
        this.ShareUI.visible = false;
        this.ShareBox = this.ShareUI.getChildByName("ShareBox") as Laya.Box;
        this.ShareBtn = this.ShareBox.getChildByName("ShareBtn") as Laya.Image;
        this.CloseBtn = this.ShareBox.getChildByName("CloseBtn") as Laya.Image;

        this.btnEv("ShareBtn", this.ShareBtnClick);
        this.btnEv("CloseBtn", this.CloseBtnClick);
    }

    onShow() {
        ADManager.TAPoint(TaT.BtnShow, "fxpk_turn");
        ADManager.TAPoint(TaT.BtnShow, "nofx_turn");
        ADManager.TAPoint(TaT.BtnShow, "ADpkjiesuan_turn");
        ADManager.TAPoint(TaT.BtnShow, "pkpt_turn");

        this.FRToRight.play();
        this.FRToLeft.play();

        this._PickClothChange.ChangeAllCloth();

        this._PickClothChangT.ChangeAllCloth();

        
        
        Laya.timer.once(1000, this, this.PickFuc);
    }
    onHide() {

        this.otherPre.text = "0";
        this.myPre.text = "0";
        this.otherNum = 0;
        this.myNum = 0;

        this.WinMark.visible = false;
        this.LoseMark.visible = false;
        this.Light.visible = false;

        this.WinUI.visible = false;
        this.LoseUI.visible = false;

        this.isWin = false;
        this.isLose = false;

        this.FemaleRoot.centerX = 492;
        this.FemaleRoot1.centerX = -484;

        this.BackBtn.visible = false;

       

        Laya.timer.clear(this, this.PickFuc);
    }

    tweenFRToLeft(t: Core.Tween.Tweener) {
        TweenMgr.lerp_Num(this.FemaleRoot.centerX, 156, t);
        this.FemaleRoot.centerX = t.outParams[0][0];
    }
    tweenFRToRight(t: Core.Tween.Tweener) {
        TweenMgr.lerp_Num(this.FemaleRoot1.centerX, -147, t);
        this.FemaleRoot1.centerX = t.outParams[0][0];
    }

    PickFuc() {
        let i: number = Util.randomInRange_i(0, 10);
        console.log(i);

        // if(ClothChange.Instance.nowclothData.Hair==10002&&ClothChange.Instance.nowclothData.Shirt==10000&&ClothChange.Instance.nowclothData.Trousers==10001)
        // {
        //     this.LoseVoteRadomFuc();
        //     console.log("必输..............");
        //     return;
        // }
        if (UIRank.ins.isLookVideo) {
            this.WinVoteRadomFuc();
            console.log("必赢..........");
            return;
        }

        let a = parseInt(Laya.LocalStorage.getItem("PickNum"));

        //this.PickCount++;
        if (a == 1 || a == 2 || a == 4) {
            this.WinVoteRadomFuc();
        }
        else {
            this.LoseVoteRadomFuc();
        }


        // if(i>3&&i<=8)
        // {
        //     this.WinVoteRadomFuc();
        // }
        // else{
        //     this.LoseVoteRadomFuc();
        // }
        //this.LoseVoteRadomFuc();
        //this.WinVoteRadomFuc();
    }

    WinVoteRadomFuc() {
        this.otherCount = Util.randomInRange_i(300, 400);
        this.myCount = Util.randomInRange_i(400, 600);

        Laya.timer.loop(3, this, this.otherPreAdd);
        Laya.timer.loop(3, this, this.myPreAdd);
    }
    LoseVoteRadomFuc() {
        this.otherCount = Util.randomInRange_i(400, 600);
        this.myCount = Util.randomInRange_i(300, 400);

        Laya.timer.loop(3, this, this.otherPreAdd);
        Laya.timer.loop(3, this, this.myPreAdd);
    }

    otherPreAdd() {
        this.otherNum += 1;
        this.otherPre.text = this.otherNum + "";
        if (this.otherNum >= this.otherCount) {
            Laya.timer.clear(this, this.otherPreAdd);
            Laya.timer.once(1000, this, this.checkLose);

        }
    }

    myPreAdd() {
        this.myNum += 1;
        this.myPre.text = this.myNum + "";
        if (this.myNum >= this.myCount) {
            Laya.timer.clear(this, this.myPreAdd);
            Laya.timer.once(1000, this, this.checkWin);
        }
    }
    checkWin() {
        if (this.myCount > this.otherCount) {
            this.isWin = true;
            this.Light.visible = true;
            this.WinMark.visible = true;
            this.BackBtn.visible = true;
        }

        if (this.isWin) {
            this.PickWin();
            Laya.timer.once(1000, this, () => {
                this.WinUI.visible = true;
            })

        }
    }
    checkLose() {
        if (this.myCount < this.otherCount) {
            this.LoseMark.visible = true;
            this.isLose = true;
            this.BackBtn.visible = true;
        }
        if (this.isLose) {
            Laya.timer.once(1000, this, () => {
                this.LoseUI.visible = true;
                this.VoteNum.text = this.myPre.text;
            })
        }
    }

    OkBtnClick() {
        ADManager.TAPoint(TaT.BtnClick, "ADpkjiesuan_turn");

        ADManager.ShowReward(() => {
            this.PickWin();
            //this.hide();

        }, () => {
            UIMgr.show("UITip", () => {
                this.PickWin();

                //this.hide();
            })
        })
        this.WinUI.visible = false;
        this.ShareUI.visible = true;
        RecordManager.stopAutoRecord();

    }
    NoBtnClick() {
        ADManager.TAPoint(TaT.BtnClick, "pkpt_turn");

        this.WinUI.visible = false;
        this.ShareUI.visible = true;
        RecordManager.stopAutoRecord();
        //this.hide();
    }
    ContinueBtnClick() {
        this.LoseUI.visible = false;
        this.hide();
    }

    PickWin() {
        let a = Laya.LocalStorage.getItem("TodayWinNum");
        let b = parseInt(a);
        b += 1;
        Laya.LocalStorage.setItem("TodayWinNum", b.toString());
        UIMgr.tip("今日胜场+1");
        (UIMgr.get("UIRank") as UIRank).Refresh();
    }

    ShareBtnClick() {
        console.log("PK分享.........");
        ADManager.TAPoint(TaT.BtnClick, "fxpk_turn");
        //RecordManager.stopAutoRecord();
        RecordManager._share(() => {
            UIMgr.tip("分享成功");
            //(UIMgr.get("UIReady") as UIReady).ClearLoop();
            this.ShareUI.visible=false;
        }, () => {
        });
    }


    CloseBtnClick() {
        ADManager.TAPoint(TaT.BtnClick, "nofx_turn");

        this.ShareUI.visible = false;
        this.hide();
    }
}
