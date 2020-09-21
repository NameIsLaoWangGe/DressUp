import ClothData from "../ClothData";
import { UIBase, OpenType,UIMgr } from "../../Frame/Core";
import GameDataController from "../GameDataController";
import ADManager, { TaT } from "../../Admanager";
import BagListController from "./Bag/BagListController";
export default class UITest extends UIBase{
    _openType = OpenType.Attach;


    BackBtn:Laya.Image;

    ADBtn:Laya.Image;
    Data:ClothData[]=[];
    str={};

    Num:number=0;
    Now:number=0;
    Need:number=0;

    first:Laya.Image;
    second:Laya.Image;
    third:Laya.Image;

    onInit()
    {
        this.first=this.vars("first") as Laya.Image;
        this.second=this.vars("second") as Laya.Image;
        this.third=this.vars("third") as Laya.Image;
        this.ADBtn=this.vars("ADBtn")as Laya.Image;

        this.Refresh();

        this.btnEv("BackBtn",()=>{
            this.hide();
        })
        this.btnEv("ADBtn",()=>{
            this.ADBtnClick();
        })
    }
    onShow()
    {
        ADManager.TAPoint(TaT.PageEnter,"shuiyipage");
        ADManager.TAPoint(TaT.BtnShow,"ADshuiyi_click");
        this.Refresh();
    }
    onHide()
    {
        ADManager.TAPoint(TaT.PageLeave,"shuiyipage");
        this.hide();
    }
    Refresh()
    {
        for (let index = 0; index < GameDataController.ClothPackge3.cloths1.length; index++) {
            this.Data[index]=GameDataController.ClothPackge3.cloths1[index];
        }

        this.Data.forEach((v,i)=>{
            let nv=GameDataController.ClothDataRefresh[this.Data[i].ID]
            this.str[this.Data[i].ID]=nv;
        });

        this.Num=GameDataController.ClothAlllockNum(this.str);
        this.Now=this.Data.length-this.Num;
        this.Need=this.Data.length;
        this.ADBtn.visible=this.Num>0;
        this.ShowADClickCount(this.Now);
    }
    ADBtnClick()
    {
        console.log("点击了广告")
        console.log(this.Now+"xxxxxxxxxxxxxx");

        ADManager.TAPoint(TaT.BtnClick,"ADshuiyi_click");

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
    ShowADClickCount(count:number)
    {
        switch (count) {
            case 0:
                this.first.skin="Egg2/tiao1.png";
                this.second.skin="Egg2/tiao1.png";
                this.third.skin="Egg2/tiao1.png";
                break;
            case 1:
                this.first.skin="Egg2/tiao2.png";
                this.second.skin="Egg2/tiao1.png";
                this.third.skin="Egg2/tiao1.png";
                break;
            case 2:
                this.first.skin="Egg2/tiao2.png";
                this.second.skin="Egg2/tiao2.png";
                this.third.skin="Egg2/tiao1.png";
                break;
            case 3:
                this.first.skin="Egg2/tiao2.png";
                this.second.skin="Egg2/tiao2.png";
                this.third.skin="Egg2/tiao2.png";
                break;
            default:
                break;
        }
    }
}