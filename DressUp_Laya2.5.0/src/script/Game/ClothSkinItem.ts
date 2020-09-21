import { UIMgr } from "../Frame/Core";
import ClothData from "./ClothData";
import GameDataController from "./GameDataController";
import UIRecommend from "./UI/UIRecommend";


export default class ClothSkinItem extends Laya.Script {
    IconParent:Laya.Box;
    Icon:Laya.Image;
    isHave:Laya.Image;
    ClothItem:Laya.Box;
    HeightMax:number=85;
    WidthMax:number=85;
    Datas: ClothData[] = [];
    str={};
    ADBtn:Laya.Image;


    onAwake()
    {
        this.ClothItem=this.owner as Laya.Box;
        this.IconParent=this.ClothItem.getChildByName("IconParent") as Laya.Box;
        this.Icon=this.IconParent.getChildByName("Icon")as Laya.Image;
        this.isHave=this.ClothItem.getChildByName("isHave") as Laya.Image;
    }
    fell(mes:ClothData[],index:number)
    {
        this.Datas=mes;
        this.isHave.visible=GameDataController.ClothDataRefresh[this.Datas[index].ID]==0;
        this.Icon.skin=this.Datas[index].GetPath1();
        let imageHeight: number = parseFloat(this.Icon.height.toString());
        let imagewidth: number = parseFloat(this.Icon.width.toString());
        this.IconParent.width = 107;
        this.IconParent.height = 107;
        let pr = 0;
        if (imagewidth > imageHeight)//宽大于高
        {
            pr = this.WidthMax / imagewidth
        }
        else
        {
            pr = this.HeightMax / imageHeight;
        }
        this.Icon.scaleX = pr;
        this.Icon.scaleY = pr;
        this.Icon.centerX = 0;
        this.Icon.centerY = 0;
        this.Datas.forEach((v, i) =>
        {
            let nv = GameDataController.ClothDataRefresh[this.Datas[i].ID]//0 解锁 1未解锁
            this.str[this.Datas[i].ID] = nv;
        });
        GameDataController.ClothdatapackSet(this.Datas[0].GetType2, this.str)
    }
    
    
}