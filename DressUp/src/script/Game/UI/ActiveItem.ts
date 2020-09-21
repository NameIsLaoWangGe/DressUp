import ClothData from "../ClothData";
import GameDataController from "../GameDataController";
import { Core, TweenMgr, UIMgr } from "../../Frame/Core";
import UIActive from "./UIActive";
import BagListController from "./Bag/BagListController";
import ADManager, { TaT } from "../../Admanager";

export default class ActiveItem extends Laya.Script
{

    Bg: Laya.Image;
    TaskPre: Laya.Label;
    Now: string;
    Need: string;
    IconAll: Laya.Image;
    ClothShow: Laya.Box;
    ADBtn: Laya.Image;
    Datas: ClothData[] = [];
    Icons: Laya.Image[] = [];
    Num: number = 0;

    MaxHeight = 85;
    MaxWeight = 85;

    str = {};

    FRS: Core.Tween.Tweener;

    IconParent: Laya.Box;

    PackName: Laya.Image;
    onAwake()
    {
        let item = this.owner as Laya.Box;
        this.Bg = item.getChildByName("Bg") as Laya.Image;
        this.IconParent = item.getChildByName("IconParent") as Laya.Box;
        this.IconAll = this.IconParent.getChildByName("IconAll") as Laya.Image;
        this.ClothShow = item.getChildByName("ClothShow") as Laya.Box;

        for (let i = 0; i < this.ClothShow.numChildren; i++)
        {
            this.Icons.push(this.ClothShow.getChildAt(i).getChildAt(0) as Laya.Image);
        }
        this.ADBtn = item.getChildByName("ADBtn") as Laya.Image;
        this.TaskPre = this.ADBtn.getChildByName("TaskPre") as Laya.Label;
        this.ADBtn.on(Laya.Event.CLICK, this, this.adclick);
        this.PackName = item.getChildByName("PackName") as Laya.Image;
    }
    //信息填充
    fell(mes: ClothData[], index: number)
    {
        // this.Datas.length=0;
        // this.Icons.length=0;

        let iconpath = "Active/taozhuang" + (index + 1) + ".png";
        let PackNamepath = "Active/Pack" + (index + 1) + ".png";

        this.Datas = mes;
        this.IconAll.skin = iconpath;
        this.PackName.skin = PackNamepath;
        console.log(this.Datas);
        this.Icons.forEach((v, i) =>
        {
            console.log("橱窗"+i+v);
            if (i < this.Datas.length)
            {
                v.visible = true;
                v.skin = this.Datas[i].GetPath1();

                let imageHeight: number = parseFloat(v.height.toString());
                let imagewidth: number = parseFloat(v.width.toString());
                let pr = 0;
                if (imagewidth > imageHeight)//宽大于高
                {
                    pr = this.MaxWeight / imagewidth
                }
                else
                {
                    pr = this.MaxHeight / imageHeight;
                }
                v.scaleX = pr;
                v.scaleY = pr;
                v.centerX = 0;
                v.centerY = 0;
            }
            else
            {
                v.visible = false;
            }
        });
        //截取套装获取信息
        this.Datas.forEach((v, i) =>
        {
            let nv = GameDataController.ClothDataRefresh[this.Datas[i].ID]//0 解锁 1未解锁
            this.str[this.Datas[i].ID] = nv;

            console.log(GameDataController.ClothDataRefresh[this.Datas[i].ID]);
        });
        
        console.log(this.str);
        GameDataController.ClothdatapackSet(this.Datas[0].GetType2, this.str)//更新套装信息
        console.log(this.Datas[0].GetType2, this.str);
        this.Num = GameDataController.ClothAlllockNum(this.str);//获取未解锁数量
        console.log("未解锁数量", this.Num);
        this.Now = (this.Datas.length - this.Num) + "";
        this.Need = (this.Datas.length) + "";
        this.TaskPre.text = this.Now + " / " + this.Need
        this.ADBtn.visible = this.Num > 0;

        if(this.ADBtn.visible)
        {
            if(this.Datas[0].GetType2=="2_1")
            {
                ADManager.TAPoint(TaT.BtnShow,"ADtz1_click");
                
            }else if(this.Datas[0].GetType2=="2_2")
            {
                ADManager.TAPoint(TaT.BtnShow,"ADtz2_click")
            }
            else if(this.Datas[0].GetType2=="2_3")
            {
                ADManager.TAPoint(TaT.BtnShow,"ADhunsha_click")
            }
        }
        
        

        for (let index = 0; index < this.ClothShow.numChildren; index++)
        {
            if (index >= this.Datas.length)
            {
                (this.ClothShow.getChildAt(index) as Laya.Image).visible = false;
            }
        }
    }
    //广告按钮点击
    adclick()
    {
        if(this.Datas[0].GetType2=="2_1")
        {
            ADManager.TAPoint(TaT.BtnClick,"ADtz1_click");
        }
        else if(this.Datas[0].GetType2=="2_2")
        {
            ADManager.TAPoint(TaT.BtnClick,"ADtz2_click");
        }
        else if(this.Datas[0].GetType2=="2_3")
        {
            ADManager.TAPoint(TaT.BtnClick,"ADhunsha_click");
        }
        

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
                console.log("GameDataController.ClothDataRefresh[k]", k, GameDataController.ClothDataRefresh[k]);
                let dataall = GameDataController.ClothDataRefresh;
                dataall[k] = 0;//解锁
                GameDataController.ClothDataRefresh = dataall;
                console.log(this.str, this.Datas[0].GetType2);
                Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
                (UIMgr.get("UIActive") as UIActive).Refresh();
                BagListController.Instance.showList();
                UIMgr.tip("恭喜获得新衣服");  
                return;
            }
        }
    }
}