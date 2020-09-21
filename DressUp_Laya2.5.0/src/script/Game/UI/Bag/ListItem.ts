import ClothData from "../../ClothData";

export default class ListItem extends Laya.Script
{
    List: Laya.List;
    Data: ClothData[];

    onAwake()
    {
        this.init();
    }
    init()
    {
        console.log("ListItem Onawake");
        this.List = this.owner as Laya.List;
        this.List.vScrollBarSkin = "";
    }
    show() 
    {

    };
    _show()
    {
        this.show();
    }
    refresh()
    {
       
    };
    _refresh()
    {
        this.refresh();
    }
    hide()
    {
        this.List.visible = false;
    };
    _hide()
    {
        this.hide();
    }
}


