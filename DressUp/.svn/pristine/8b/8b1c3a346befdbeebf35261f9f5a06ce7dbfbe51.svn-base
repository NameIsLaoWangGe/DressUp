import ListItem from "./ListItem";
import SkinItem from "./SkinItem";
import ClothData from "../../ClothData";
import GameDataController from "../../GameDataController";

export default class ShoesList extends ListItem
{
    List: Laya.List;
    Data: ClothData[];


    onAwake()
    {
        super.onAwake();
        this.refresh();
        this.List.dataSource = this.Data;
        this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);

    }
    onWrapItem(cell: Laya.Box, index: number)
    {
        cell.getComponent(SkinItem).fell(this.Data[index]);
    }
    show()
    {
        this.refresh();
        this.List.dataSource = this.Data;
    }
    refresh()
    {
        this.Data = GameDataController.ShoseData;
        this.List.refresh();
    }
    hide()
    {
        super.hide();

    }
}