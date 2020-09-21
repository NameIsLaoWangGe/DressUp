import ClothData from "../ClothData";
import { UIBase, OpenType } from "../../Frame/Core";
import GameDataController, { ClothPackgeData } from "../GameDataController";
import ActiveItem from "./ActiveItem";
import ADManager, { TaT } from "../../Admanager";

export default class UIActive extends UIBase
{

    _openType = OpenType.Attach;

    ActiveList: Laya.List;
    Data: ClothData[][] = [];


    CloseBtn:Laya.Image;
    onInit()
    {
        this.ActiveList = this.vars("ActiveList");
        this.ActiveList.vScrollBarSkin = "";
        this.Refresh();

         
        this.ActiveList.renderHandler = new Laya.Handler(this, this.onWrapItem);
        this.btnEv("CloseBtn",()=>{
            this.hide();
        });
        
    }
    onWrapItem(cell: Laya.Box, index: number)
    {
       cell.getComponent(ActiveItem).fell(this.Data[index],index);
    }
    
    onShow()
    {
        ADManager.TAPoint(TaT.PageEnter,"taozhuangpage");

        this.Refresh();
    }
    Refresh()
    {
        this.Data.length = 0;
        let data: ClothData[][] = [];
        if (GameDataController.ClothPackge2.cloths3.length > 0)
        {
            data.push(GameDataController.ClothPackge2.cloths3);
        }
        if (GameDataController.ClothPackge2.cloths1.length > 0)
        {
            data.push(GameDataController.ClothPackge2.cloths1);
        }
        if (GameDataController.ClothPackge2.cloths2.length > 0)
        {
            data.push(GameDataController.ClothPackge2.cloths2);
        }
        // if (GameDataController.ClothPackge2.cloths3.length > 0)
        // {
        //     data.push(GameDataController.ClothPackge2.cloths3);
        // }
        // if (GameDataController.ClothPackge2.cloths4.length > 0)
        // {
        //     data.push(GameDataController.ClothPackge2.cloths4);
        // }
        console.log(data);
        this.Data = data;
        this.ActiveList.array = this.Data;
        this.ActiveList.refresh();
        //this.ActiveList.dataSource=this.Data;
        console.log("UIActive", this.Data);
    }
    onHide()
    {
        ADManager.TAPoint(TaT.PageLeave,"taozhuangpage");
        this.hide();
    }
}
export class clothbag extends Laya.Script
{
    cloths: ClothData[] = [];   
}

