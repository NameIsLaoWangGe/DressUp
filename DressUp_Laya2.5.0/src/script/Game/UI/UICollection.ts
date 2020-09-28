import { OpenType, UIBase } from "../../Frame/Core";
import GameDataController from "../GameDataController";
import { ManData } from "../ManConfigData";
import CollectionItem from "./Bag/CollectionItem";

export default class UICollection extends UIBase{

    _openType=OpenType.Attach;
    BackBtn:Laya.Image;
    manList:Laya.List;
    Data:ManData[];
    onInit()
    {
        this.BackBtn=this.vars("BackBtn") as Laya.Image;
        this.btnEv("BackBtn",()=>{
            this.hide();
        })
        this.manList=this.vars("manList");
        this.manList.vScrollBarSkin="";

        this.onRefresh();
        this.manList.renderHandler=new Laya.Handler(this,this.onWrapItem);
    }

    onWrapItem(cell:Laya.Box,index:number)
    {
        cell.getComponent(CollectionItem).fell(this.Data[index]);
    }

    onShow()
    {
        this.onRefresh();
    }
    onRefresh()
    {
        this.Data=GameDataController.ManData;
        console.log(this.Data);
        this.manList.array=this.Data;
        this.manList.refresh();
    }
    onHide()
    {
        this.hide();
    }

}