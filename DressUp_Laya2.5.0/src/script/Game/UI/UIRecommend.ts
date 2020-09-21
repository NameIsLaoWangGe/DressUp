import ADManager, { TaT } from "../../Admanager";
import { UIBase, OpenType, UIMgr } from "../../Frame/Core";
import ClothData from "../ClothData";
import ClothSkinItem from "../ClothSkinItem";
import GameDataController, { ClothPackgeData } from "../GameDataController";
import RecommendChange from "../RecommendChange";
import BagListController from "./Bag/BagListController";

export default class UIRecommend extends UIBase {
    _openType = OpenType.Attach;
    FemaleRoot: Laya.Box;
    _RecommendChange:RecommendChange;
    CloseBtn:Laya.Image;
    ClothList:Laya.List;
    Data:ClothData[]=[];
    ADBtn:Laya.Image;
    TaskPre:Laya.Label;
    Now:string;
    Need:string;
    Num:number=0;
    str={};

    count:number=0;


    data:ClothData[][]=[];
    //data: ClothData[][] = [];
    onInit()
    {
        this.FemaleRoot=this.vars("FemaleRoot");
        this._RecommendChange=this.FemaleRoot.getComponent(RecommendChange);

        this.ADBtn=this.vars("ADBtn")as Laya.Image;
        this.TaskPre=this.ADBtn.getChildByName("TaskPre")as Laya.Label;

        this.btnEv("CloseBtn",()=>{
            this.hide();
            //BagListController.Instance.showList();
        })
        this.ClothList = this.vars("ClothList");
        this.ClothList.hScrollBarSkin="";
        this.Refresh();

        this.Data.forEach((v,i)=>{
            this._RecommendChange._ClothChange(this.Data[i].ID,this.Data[i].Type);
    })
        this.ClothList.renderHandler=new Laya.Handler(this,this.onWarpItem);
        this.ClothList.refresh();

        this.btnEv("ADBtn",()=>{
            console.log("播放了广告");
            this.ADBtnClick();
        })
    }
    onWarpItem(cell:Laya.Box,index:number)
    {
        cell.getComponent(ClothSkinItem).fell(this.Data,index);
    }

    onShow()
    {
        ADManager.TAPoint(TaT.PageEnter,"tuijianpage");
        ADManager.TAPoint(TaT.BtnShow,"ADchuanda_click");
        this.Refresh();
    }
    Refresh()
    {
        
        for (let index = 0; index < GameDataController.ClothPackge4.cloths1.length; index++) {
            this.Data[index]=GameDataController.ClothPackge4.cloths1[index];
        }
        
        this.ClothList.refresh();
        this.ClothList.array=this.Data;

        this.Data.forEach((v,i)=>{
            let nv=GameDataController.ClothDataRefresh[this.Data[i].ID];
            this.str[this.Data[i].ID]=nv;
        });

        this.Num = GameDataController.ClothAlllockNum(this.str);//获取未解锁数量
        this.Now = (this.Data.length - this.Num) + "";
        this.Need = (this.Data.length) + "";
        this.TaskPre.text = this.Now + " / " + this.Need
        this.ADBtn.visible = this.Num > 0;
        
    }
    onHide()
    {
        ADManager.TAPoint(TaT.PageLeave,"tuijianpage");
        this.hide();   
    }
    ADBtnClick()
    {   
        //this.ClothList.refresh();
        ADManager.TAPoint(TaT.BtnClick,"ADchuanda_click");
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
             if(this.str[k]==1)
             {
                let dataall = GameDataController.ClothDataRefresh;
                dataall[k] = 0;//解锁
                GameDataController.ClothDataRefresh = dataall;
                Laya.LocalStorage.setJSON(this.Data[0].GetType2,this.str);
                this.Refresh();
                BagListController.Instance.refresh();
                console.log("获取一件装扮");
                UIMgr.tip("恭喜获得新衣服");
                return;
             }
         }
     }   
}