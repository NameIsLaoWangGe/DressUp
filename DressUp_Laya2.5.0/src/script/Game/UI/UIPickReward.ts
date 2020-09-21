import ADManager from "../../Admanager";
import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import ClothData from "../ClothData";
import GameDataController from "../GameDataController";
import BagListController from "./Bag/BagListController";

export default class UIPickReward extends UIBase{
    _openType = OpenType.Attach;

    ADBtn:Laya.Image;
    CloseBtn:Laya.Image;
    Data:ClothData[]=[];
    str={};

    onInit()
    {
        this.ADBtn=this.vars("ADBtn")as Laya.Image;
        this.btnEv("ADBtn",this.ADBtnClick);
        this.CloseBtn=this.vars("CloseBtn")as Laya.Image;
        this.btnEv("CloseBtn",()=>{
            this.hide();
        })
    }

    onShow()
    {
        this.Data=GameDataController.ClothPackge1.cloths1;
        this.Data.forEach((v,i)=>{
            let nv=GameDataController.ClothDataRefresh[this.Data[i].ID];
            this.str[this.Data[i].ID]=nv;
        })
        console.log(this.Data);
    }

    ADBtnClick()
    {
        ADManager.ShowReward(()=>{
            this.GetAward();
        },()=>{
            UIMgr.show("UITip",()=>{
                this.GetAward();
            })
        })
    }

    GetAward()
    {
        for(let k in this.str)
        {
            console.log(this.str[k]);
            if(this.str[k]==1)
            {
                let dataall=GameDataController.ClothDataRefresh;
                dataall[k]=0;
                GameDataController.ClothDataRefresh=dataall;
                Laya.LocalStorage.setJSON(this.Data[0].GetType2,this.str);
                BagListController.Instance.refresh();
                UIMgr.tip("恭喜获得一套新衣服");
            }
        }
        this.hide();
    }
}