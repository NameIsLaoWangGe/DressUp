import ListItem from "./ListItem";
import AccList from "./AccList";
import HairList from "./HairList";
import DressList from "./DressList";
import UpList from "./UpList";
import DownList from "./DownList";
import SockList from "./SockList";
import ShoesList from "./ShoesList";
import PetList from "./PetList";

import ClothChange from "../../ClothChange";
import ClothBtn from "./ClothBtn";
import ADManager, { TaT } from "../../../Admanager";
import { clothbag } from "../UIActive";
import { Core, TweenMgr } from "../../../Frame/Core";

export default class BagListController extends Laya.Script
{
    static Instance: BagListController;
    listtype = ListType.HairList;//默认打开头发
    Bag: Laya.Image;//背包总结点
    BtnBar: Laya.Box;//按钮合集
    ShowView: Laya.Panel;//展示界面

    hairList: Laya.List;
    dressList: Laya.List;
    shirtList: Laya.List;
    trousersList: Laya.List;
    socksList: Laya.List;
    shoesList: Laya.List;
    ornamentList: Laya.List;
    petList: Laya.List;

    Up: Laya.Image;
    Hair: Laya.Image;
    Down: Laya.Image;
    Shoes: Laya.Image;
    Dress: Laya.Image;
    Acc: Laya.Image;
    Sock: Laya.Image;
    Pet: Laya.Image;

    ListMap: Map<ListType, ListItem> = new Map<ListType, ListItem>();
    ListBtn: Laya.List;
    SelectIndex: number = 0;

    onAwake()
    {
     

        BagListController.Instance = this;
        this.Bag = this.owner as Laya.Image;

        this.BtnBar = this.Bag.getChildByName("BtnBar") as Laya.Box;
        this.ShowView = this.Bag.getChildByName("ShowView") as Laya.Panel;
        this.ListBtn = this.BtnBar.getChildByName("ListBtn") as Laya.List;

        this.hairList = this.ShowView.getChildByName("hair").getChildByName("hairList") as Laya.List;
        let _hairList = this.hairList.getComponent(HairList);

        this.dressList = this.ShowView.getChildByName("dress").getChildByName("dressList") as Laya.List;
        let _dressList = this.dressList.getComponent(DressList);

        this.shirtList = this.ShowView.getChildByName("shirt").getChildByName("shirtList") as Laya.List;
        let _shirtList = this.shirtList.getComponent(UpList);

        this.trousersList = this.ShowView.getChildByName("trousers").getChildByName("trousersList") as Laya.List;
        let _trousersList = this.trousersList.getComponent(DownList);

        this.socksList = this.ShowView.getChildByName("socks").getChildByName("socksList") as Laya.List;
        let _socksList = this.socksList.getComponent(SockList);

        this.shoesList = this.ShowView.getChildByName("shose").getChildByName("shoseList") as Laya.List;
        let _shoesList = this.shoesList.getComponent(ShoesList);

        this.ornamentList = this.ShowView.getChildByName("ornament").getChildByName("ornamentList") as Laya.List;
        let _ornamentList = this.ornamentList.getComponent(AccList);

        // this.petList=this.ShowView.getChildByName("pet").getChildByName("petList") as Laya.List;
        // let _petList=this.petList.getComponent(PetList);

        this.ListMap.set(ListType.HairList, _hairList);
        this.ListMap.set(ListType.DressList, _dressList);
        this.ListMap.set(ListType.ShirtList, _shirtList);
        this.ListMap.set(ListType.TrousersList, _trousersList);
        this.ListMap.set(ListType.SocksList, _socksList);
        this.ListMap.set(ListType.ShoesList, _shoesList);
        this.ListMap.set(ListType.OrnamentList, _ornamentList);
        //this.ListMap.set(ListType.PetList, _petList);

        console.log("BagListControllerOnawake", this.ListMap);


        this.Up = this.BtnBar.getChildByName("Up") as Laya.Image;
        this.Down = this.BtnBar.getChildByName("Down") as Laya.Image;
        this.Hair = this.BtnBar.getChildByName("Hair") as Laya.Image;
        this.Acc = this.BtnBar.getChildByName("Acc") as Laya.Image;
        this.Shoes = this.BtnBar.getChildByName("Shoes") as Laya.Image;
        this.Dress = this.BtnBar.getChildByName("Dress") as Laya.Image;
        this.Sock = this.BtnBar.getChildByName("Sock") as Laya.Image;
        //this.Pet=this.BtnBar.getChildByName("Pet") as Laya.Image;

        let ups = this.Up.addComponent(ClothBtn) as ClothBtn;
        let downs = this.Down.addComponent(ClothBtn) as ClothBtn;
        let hairs = this.Hair.addComponent(ClothBtn) as ClothBtn;
        let accs = this.Acc.addComponent(ClothBtn) as ClothBtn;
        let shoes = this.Shoes.addComponent(ClothBtn) as ClothBtn;
        let dresss = this.Dress.addComponent(ClothBtn) as ClothBtn;
        let socks = this.Sock.addComponent(ClothBtn) as ClothBtn;

        hairs.fell("", 0);
        dresss.fell("", 1);
        ups.fell("", 2);
        downs.fell("", 3);
        socks.fell("", 4);
        shoes.fell("", 5)
        accs.fell("", 6);

        this.CTT = TweenMgr.tweenCust(300, this, this.tweenbagLeft, null, true, Laya.Ease.backOut);
    }

    // Data = ["Btnbar/hair",
    //     "Btnbar/dress",
    //     "Btnbar/shirt",
    //     "Btnbar/trousers",
    //     "Btnbar/socks",
    //     "Btnbar/shose",
    //     "Btnbar/ornament",
    //     //"Btnbar/pet"
    // ]

    // BtnBarListFell()
    // {
    //     this.ListBtn.hScrollBarSkin = "";
    //     this.ListBtn.array = this.Data;
    //     this.ListBtn.renderHandler = new Laya.Handler(this, this.onWrapItem);
    // }

    // onWrapItem(cell: Laya.Box, index: number)
    // {
    //     cell.getComponent(ClothBtn).fell(this.Data[index], index);
    // }

    onStart()
    {
      
        this.ClothesPageChange(0);
       
    }

    btnev(img: Laya.Image, fun: Function)
    {
        img.on(Laya.Event.CLICK, this, fun);
    }
    CTT: Core.Tween.Tweener;
    ClothesPageChange(index: number)
    {
        this.SelectIndex = index;

        switch (index)
        {
            case ListType.HairList:
                this.showList(ListType.HairList);
                ADManager.TAPoint(TaT.BtnShow, "ADhair40101_click");
                ADManager.TAPoint(TaT.BtnShow, "ADhair50101_click");
                ADManager.TAPoint(TaT.BtnShow, "ADhair50201_click");
                ADManager.TAPoint(TaT.BtnShow, "ADhair10301_click");
                ADManager.TAPoint(TaT.BtnShow, "ADhair30301_click");
                ADManager.TAPoint(TaT.BtnShow, "ADhair50301_click");
                break;
            case ListType.DressList:
                this.showList(ListType.DressList);
                ADManager.TAPoint(TaT.BtnShow, "ADdress40102_click");
                ADManager.TAPoint(TaT.BtnShow, "ADdress50102_click");
                ADManager.TAPoint(TaT.BtnShow, "ADdress50202_click");
                ADManager.TAPoint(TaT.BtnShow, "ADdress50302_click");
                break;
            case ListType.ShoesList:
                this.showList(ListType.ShoesList);
                ADManager.TAPoint(TaT.BtnShow, "ADshoes20205_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes30205_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes40104_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes40204_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes50104_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes50203_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes10305_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes20303_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes30305_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshoes50303_click");
                break;
            case ListType.OrnamentList:
                this.showList(ListType.OrnamentList);
                ADManager.TAPoint(TaT.BtnShow, "ADring10201_click");
                ADManager.TAPoint(TaT.BtnShow, "ADring40105_click");
                ADManager.TAPoint(TaT.BtnShow, "ADring50204_click");
                ADManager.TAPoint(TaT.BtnShow, "ADring20304_click");
                ADManager.TAPoint(TaT.BtnShow, "ADring50304_click");
                break;
            case ListType.SocksList:
                this.showList(ListType.SocksList);
                ADManager.TAPoint(TaT.BtnShow, "ADsocks20204_click");
                ADManager.TAPoint(TaT.BtnShow, "ADsocks50103_click");
                ADManager.TAPoint(TaT.BtnShow, "ADsocks30304_click");
                break;
            case ListType.TrousersList:
                this.showList(ListType.TrousersList);
                ADManager.TAPoint(TaT.BtnShow, "ADpants10203_click");
                ADManager.TAPoint(TaT.BtnShow, "ADpants20203_click");
                ADManager.TAPoint(TaT.BtnShow, "ADpants30203_click");
                ADManager.TAPoint(TaT.BtnShow, "ADpants40203_click");
                ADManager.TAPoint(TaT.BtnShow, "ADpants10304_click");
                ADManager.TAPoint(TaT.BtnShow, "ADpants20302_click");
                ADManager.TAPoint(TaT.BtnShow, "ADpants30303_click");
                break;
            case ListType.ShirtList:
                this.showList(ListType.ShirtList);
                ADManager.TAPoint(TaT.BtnShow, "ADshirt10202_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshirt20202_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshirt30202_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshirt40202_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshirt10303_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshirt20301_click");
                ADManager.TAPoint(TaT.BtnShow, "ADshirt30302_click");
                break;
            case ListType.PetList:
                this.showList(ListType.PetList);
                break;
        }

        //展示完做弹出逻辑
     
    }



    tweenbagLeft(t: Core.Tween.Tweener)
    {
        let nbtm: number = this.ShowView.right;
        console.log("往左滑动");
        TweenMgr.lerp_Num(nbtm, 197, t);
        this.ShowView.right = t.outParams[0][0];
    }





    listnameitem = ListType.HairList;
    showList(listname: ListType = this.listnameitem)
    {
        this.listnameitem = listname;
        this.ListMap.forEach((v, k) =>
        {
            if (k == listname)
            {
                (v.owner.parent as Laya.Box).visible = true;
                v._refresh();
            }
            else
            {
                (v.owner.parent as Laya.Box).visible = false;
            }
        });
    }
    getlist(listnumber: number): ListItem
    {
        return this.ListMap.get(listnumber);
    }
    refresh()
    {
        this.ListMap.forEach((v, k) =>
        {
            v._refresh();
        });
    }
}
export enum ListType
{
    HairList,
    DressList,
    CoatList,
    ShirtList,
    TrousersList,
    SocksList,
    ShoesList,
    OrnamentList,
    PetList
}

