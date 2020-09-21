import ListItem from "./ListItem";
import SkinItem from "./SkinItem";
import ClothData from "../../ClothData";
import GameDataController from "../../GameDataController";

export default class DressList extends ListItem
{
    List: Laya.List;
    Data: ClothData[];


    onAwake()
    {
        console.log("DressList OnAwake");
        this.init();
        this.refresh();
        this.List.dataSource = this.Data;
        this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
    }
    init()
    {
        super.init();
    }
    onWrapItem(cell: Laya.Box, index: number)
    {
        cell.getComponent(SkinItem).fell(this.Data[index]);
    }
    show()
    {
        console.log("DressList Onshow");
        this.refresh();
        this.List.dataSource = this.Data;
    }
    refresh()
    {
        this.Data = GameDataController.DressData;
        this.List.refresh();
    }
    hide()
    {
        super.hide();
        console.log("DressListHide",this.List.visible);
    }
}