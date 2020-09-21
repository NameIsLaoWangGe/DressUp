import Util from "../../Frame/Util";
import { PickData } from "../PickJsonData";

export default class RankItem extends Laya.Script
{
    Name:Laya.Label;
    WinCount:Laya.Label;
    RankNum:Laya.Label;
    Datas:PickData[]=[];
    Top1:Laya.Image;
    Top2:Laya.Image;
    Top3:Laya.Image;
    BG_yellow:Laya.Image;
    BG_white:Laya.Image;
    IconParent:Laya.Box;
    hairBox:Laya.Box;
    onAwake()
    {
        let item=this.owner as Laya.Box;
        this.Name=item.getChildByName("Name")as Laya.Label;
        this.WinCount=item.getChildByName("WinCount") as Laya.Label;
        this.RankNum=item.getChildByName("RankNum") as Laya.Label;
        this.Top1=item.getChildByName("Top1") as Laya.Image;
        this.Top2=item.getChildByName("Top2") as Laya.Image;
        this.Top3=item.getChildByName("Top3") as Laya.Image;
        this.BG_white=item.getChildByName("BG_white") as Laya.Image;
        this.BG_yellow=item.getChildByName("BG_Yellow")as Laya.Image;
        this.IconParent=item.getChildByName("IconParent") as Laya.Box;
        this.hairBox=this.IconParent.getChildByName("hairBox") as Laya.Box;

    }

    fell(mess:PickData[],index:number)
    {   
        this.Datas=mess;
        this.Name.text=this.Datas[index].Name;
        this.WinCount.text="胜场:"+this.Datas[index].Num.toString();
        this.RankNum.text=(index+1).toString();

        //初始化
        this.RankNum.visible=true;
        this.Top1.visible=false;
        this.Top2.visible=false;
        this.Top3.visible=false;
        this.BG_white.visible=true;
        this.BG_yellow.visible=false;
        for (let i = 0; i < this.hairBox.numChildren; i++) {
            let c=this.hairBox.getChildAt(i)as Laya.Image;
            c.visible=false;  
        }

        if(this.Datas[index].Name=="我")
        {
            this.BG_white.visible=false;
            this.BG_yellow.visible=true;
        }

        this.Top1.visible=index==0;
        this.Top2.visible=index==1;
        this.Top3.visible=index==2;

        if(this.Top1.visible||this.Top2.visible||this.Top3.visible)
        {
            this.RankNum.visible=false;
        }

        let a=Util.randomInRange_i(0,this.hairBox.numChildren-1);
        let b= this.hairBox.getChildAt(a)as Laya.Image;
        b.visible=true;
    }
}