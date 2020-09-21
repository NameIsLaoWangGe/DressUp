import ClothData from "../ClothData";
import { UIBase, OpenType } from "../../Frame/Core";
import GameDataController from "../GameDataController";
import SignBtn from "./SignBtn";
import ADManager, { TaT } from "../../Admanager";

export default class UISign extends UIBase
{
    _openType = OpenType.Attach;
    Data: ClothData[] = [];

    str = {};

    BtnBar: Laya.Image[] = [];
    SkinBtnBar: Laya.Box;

    CloseBtn: Laya.Image;
    func:Function=null;
    onInit()
    {
        this.btnEv("CloseBtn", () =>
        {
            this.hide();
        }
        )
        this.SkinBtnBar = this.vars("SkinBtnBar");
        for (let index = 0; index < this.SkinBtnBar.numChildren; index++)
        {
            this.SkinBtnBar.getChildAt(index).addComponent(SignBtn);
            this.BtnBar.push(this.SkinBtnBar.getChildAt(index) as Laya.Image);
        }
        //初始化天数

    }
    onShow(arg:Function)
    {
        ADManager.TAPoint(TaT.PageEnter,"signpage");

        this.func=arg;
        this.Data = GameDataController.ClothPackge1.cloths1;
        this.Data.forEach((V: ClothData, i: number) =>
        {
            let item = this.BtnBar[i].getComponent(SignBtn) as SignBtn;
            item.Fell(V,i);
        })
        this.Refresh();
    }


    onRefresh()
    {

    }

    
    Refresh()
    {
        this.Data.forEach((v, i) =>
        {
            let nv = GameDataController.ClothDataRefresh[this.Data[i].ID]
            this.str[this.Data[i].ID] = nv;
            let item = this.BtnBar[i].getComponent(SignBtn) as SignBtn;
            item.Fell(v,i);
        });
        GameDataController.ClothdatapackSet(this.Data[0].GetType2, this.str)//更新套装信息
    }


    onHide()
    {
        ADManager.TAPoint(TaT.PageLeave,"signpage");
        this.hide();      
    }
}

