import ADManager, { TaT } from "../../Admanager";
import { Core, OpenType, TweenMgr, UIBase, UIMgr } from "../../Frame/Core";
import RecordManager from "../../RecordManager";
import GameDataController from "../GameDataController";
import PickClothChange from "../PickClothChange";
import { PickData } from "../PickJsonData";
import RankItem from "./RankItem";
import UIReady from "./UIReady";

export default class UIRank extends UIBase {

    static ins: UIRank;
    _openType = OpenType.Attach;
    BackBtn: Laya.Image;
    Pick: Laya.Image;
    RankListBtn: Laya.Image;
    FemaleRoot: Laya.Box;
    RankListArea: Laya.Image;
    RankListBox: Laya.Box;
    _PickClothChange: PickClothChange;

    LRank: Core.Tween.Tweener;
    RRank: Core.Tween.Tweener;
    FRL: Core.Tween.Tweener;
    FRR: Core.Tween.Tweener;

    rankisopen: boolean = false;

    PickNum: Laya.Label;
    PickNumImage: Laya.Box;
    ADImage: Laya.Image;
    RankList: Laya.List;
    Data: PickData[] = [];


    isLookVideo: boolean = false;
    onInit() {
        UIRank.ins = this;

        this.BackBtn = this.vars("BackBtn") as Laya.Image;
        this.Pick = this.vars("Pick") as Laya.Image;
        this.RankListBtn = this.vars("RankListBtn") as Laya.Image;
        this.FemaleRoot = this.vars("FemaleRoot") as Laya.Box;
        //this.RankListArea=this.vars("RankListArea") as Laya.Image;
        this.RankListBox = this.vars("RankListBox") as Laya.Box;

        this._PickClothChange = this.FemaleRoot.getComponent(PickClothChange);

        this.btnEv("BackBtn", () => {
            this.hide();
        })
        this.btnEv("RankListBtn", () => {
            ADManager.TAPoint(TaT.BtnClick, "phb_turn");
            this.ShowRankListBtnClick();
        })
        this.btnEv("Pick", () => {
            RecordManager.stopAutoRecord();
            RecordManager.startAutoRecord();
            if (parseInt(Laya.LocalStorage.getItem("PickNum")) == 0) {
                this.ADClick();
            }
            else {
                this.PickBtnClick();
            }
        })

        this.LRank = TweenMgr.tweenCust(300, this, this.tweenRankLeft, null, true, Laya.Ease.linearNone);
        this.RRank = TweenMgr.tweenCust(300, this, this.tweenRankRight, null, true, Laya.Ease.linearNone);
        this.FRL = TweenMgr.tweenCust(300, this, this.tweenFemaleRootLeft, null, true, Laya.Ease.linearNone);
        this.FRR = TweenMgr.tweenCust(300, this, this.tweenFemaleRootRight, null, true, Laya.Ease.linearNone);

        this.PickNumImage = this.vars("PickNumImage") as Laya.Box;
        this.PickNum = this.vars("PickNum") as Laya.Label;
        this.PickNum.text = Laya.LocalStorage.getItem("PickNum");

        this.ADImage = this.vars("ADImage") as Laya.Image;
        //console.log(this.ADImage);
        //this.btnEv("ADImage",this.ADImageClick);


        this.RankList = this.vars("RankList") as Laya.List;
        this.RankList.vScrollBarSkin = "";
        this.Refresh();
        this.RankList.renderHandler = new Laya.Handler(this, this.onWrapItem);
        this.RankList.refresh();
    }

    onWrapItem(cell: Laya.Box, index: number) {
        cell.getComponent(RankItem).fell(this.Data, index);
    }

    Refresh() {
        for (let index = 0; index < GameDataController.PickData.length; index++) {
            if (GameDataController.PickData[index].Name == "我") {
                GameDataController.PickData[index].Num = parseInt(Laya.LocalStorage.getItem("TodayWinNum"));
            }
        }

        GameDataController.PickData.sort((a, b) => {
            return b.Num - a.Num;
        })

        for (let i = 0; i < GameDataController.PickData.length; i++) {

            this.Data[i] = GameDataController.PickData[i];
        }
        this.RankList.refresh();
        this.RankList.array = this.Data;
    }
    onShow() {
        //(UIMgr.get("UIReady")as UIReady).Record();

        ADManager.TAPoint(TaT.BtnShow, "meiripk_turn");
        ADManager.TAPoint(TaT.BtnShow, "ADpk_turn");
        ADManager.TAPoint(TaT.BtnShow, "phb_turn");

        this.isLookVideo = false;

        this._PickClothChange.ChangeAllCloth();

        if (Laya.LocalStorage.getItem("PickNum") == "0") {
            this.ADImage.visible = true;
            this.PickNumImage.visible = false;
        }

    }

    tweenRankLeft(t: Core.Tween.Tweener) {
        console.log(this.RankListBox)
        console.log("RankListBox.............")
        let nbtm: number = this.RankListBox.right;
        TweenMgr.lerp_Num(nbtm, 0, t);
        this.RankListBox.right = t.outParams[0][0];
    }
    tweenRankRight(t: Core.Tween.Tweener) {
        let nbtm: number = this.RankListBox.right;
        TweenMgr.lerp_Num(nbtm, -316, t);
        this.RankListBox.right = t.outParams[0][0];
    }
    tweenFemaleRootLeft(t: Core.Tween.Tweener) {
        let nbtm: number = this.FemaleRoot.centerX;
        TweenMgr.lerp_Num(nbtm, -119, t);
        this.FemaleRoot.centerX = t.outParams[0][0];
    }
    tweenFemaleRootRight(t: Core.Tween.Tweener) {
        let nbtm: number = this.FemaleRoot.centerX;
        TweenMgr.lerp_Num(nbtm, -19, t);
        this.FemaleRoot.centerX = t.outParams[0][0];
    }

    ShowRankListBtnClick() {
        this.rankisopen = !this.rankisopen;
        if (this.rankisopen) {
            this.LRank.play();
            this.FRL.play();
        }
        else {
            this.RRank.play();
            this.FRR.play();
        }

    }

    PickBtnClick() {
        ADManager.TAPoint(TaT.BtnClick, "meiripk_turn");

        GameDataController.TodaySign = "1";
        GameDataController.SetLastTime();
        let a = Laya.LocalStorage.getItem("PickNum");
        let b = parseInt(a);
        if (b > 0) {
            UIMgr.show("UIPickLoading");
            b--;
            Laya.LocalStorage.setItem("PickNum", b.toString());
            this.PickNum.text = b.toString();
            if (b <= 0) {
                this.ADImage.visible = true;
                this.PickNumImage.visible = false;
            }
        }
        // else{
        //     UIMgr.tip("没次数了！观看视频可获得PK次数哦！");
        // }
    }

    ADImageClick() {

        ADManager.TAPoint(TaT.BtnClick, "ADpk_turn");

        ADManager.ShowReward(() => {
            let a = Laya.LocalStorage.getItem("PickNum");
            let b = parseInt(a);
            b++;
            Laya.LocalStorage.setItem("PickNum", b.toString());
            this.PickNum.text = b.toString();
            this.isLookVideo = true;
            UIMgr.tip("PK次数+1");
        }, () => {
            UIMgr.show("UITip", () => {
                let a = Laya.LocalStorage.getItem("PickNum");
                let b = parseInt(a);
                b++;
                Laya.LocalStorage.setItem("PickNum", b.toString());
                this.PickNum.text = b.toString();
                this.isLookVideo = true;
                UIMgr.tip("PK次数+1");
            })
        })
    }

    ADClick() {
        this.ADImage.visible = true;
        this.PickNumImage.visible = false;
        ADManager.TAPoint(TaT.BtnClick, "ADpk_turn");
        ADManager.ShowReward(() => {
            UIMgr.show("UIPickLoading");
            UIMgr.tip("PK次数+1");
            this.isLookVideo = true;
        })
    }

    onHide() {
        (UIMgr.get("UIReady") as UIReady).isPicking = false;
        //(UIMgr.get("UIReady")as UIReady).ClearLoop();
        RecordManager.stopAutoRecord();
        console.log("关闭了UIRank")
    }
}