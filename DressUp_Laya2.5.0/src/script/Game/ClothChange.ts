import GameDataController, { ClothPackgeData } from "./GameDataController";
import ClothData from "./ClothData";
import { Core, UIMgr } from "../Frame/Core";
import Util from "../Frame/Util";
import UIReady from "./UI/UIReady";
import RecommendChange from "./RecommendChange";
import RecordManager from "../RecordManager";
export enum clothtype {
    Hair,
    Dress,
    Coat,
    Shirt,
    Trousers,
    Socks,
    Shose,
    Ornament,
    Pet
}
export default class ClothChange extends Laya.Script {
    FemaleRoot: Laya.Image;

    Hair: Laya.Image;
    Hair1: Laya.Image;

    Ornament: Laya.Image;
    Ornament1: Laya.Image;

    Shirt: Laya.Image;
    Shirt1: Laya.Image;

    Trousers: Laya.Image;
    Trousers1: Laya.Image;

    Dress: Laya.Image;
    Dress1: Laya.Image;

    Socks: Laya.Image;
    Socks1: Laya.Image;

    Shose: Laya.Image;
    Shose1: Laya.Image;

    Coat: Laya.Image;
    Coat1: Laya.Image;

    Pet: Laya.Image;
    Man: Laya.Image;

    static Instance: ClothChange;

    scaleDelta: number = 0;

    Star: Laya.Box;
    stars: Laya.Image[] = [];

    onAwake() {

        ClothChange.Instance = this;
        this.FemaleRoot = this.owner as Laya.Image;

        this.Hair = this.FemaleRoot.getChildByName("Hair") as Laya.Image;
        this.Hair1 = this.FemaleRoot.getChildByName("Hair1") as Laya.Image;

        this.Ornament = this.FemaleRoot.getChildByName("Ornament") as Laya.Image;
        this.Ornament1 = this.FemaleRoot.getChildByName("Ornament1") as Laya.Image;

        this.Shirt = this.FemaleRoot.getChildByName("Shirt") as Laya.Image;
        this.Shirt1 = this.FemaleRoot.getChildByName("Shirt1") as Laya.Image;

        this.Trousers = this.FemaleRoot.getChildByName("Trousers") as Laya.Image;
        this.Trousers1 = this.FemaleRoot.getChildByName("Trousers1") as Laya.Image;

        this.Dress = this.FemaleRoot.getChildByName("Dress") as Laya.Image;
        this.Dress1 = this.FemaleRoot.getChildByName("Dress1") as Laya.Image;

        this.Socks = this.FemaleRoot.getChildByName("Socks") as Laya.Image;
        this.Socks1 = this.FemaleRoot.getChildByName("Socks1") as Laya.Image;

        this.Shose = this.FemaleRoot.getChildByName("Shose") as Laya.Image;
        this.Shose1 = this.FemaleRoot.getChildByName("Shose1") as Laya.Image;

        this.Coat = this.FemaleRoot.getChildByName("Coat") as Laya.Image;
        this.Coat1 = this.FemaleRoot.getChildByName("Coat1") as Laya.Image;

        this.Pet = this.FemaleRoot.getChildByName("Pet") as Laya.Image;

        this.Man = this.FemaleRoot.getChildByName("Man") as Laya.Image;
        this.Man.visible = false;

        for (let i = 0; i < 8; i++) {
            this._ClothChange(0, i);
        }

        this.Star = this.FemaleRoot.getChildByName("Star") as Laya.Box;

    }
    _ClothChange(itemID: number, type: number)//将点击的装扮穿上
    {

        switch (type) {
            case clothtype.Hair:
                this.HairChange(itemID);
                break;
            case clothtype.Dress:
                this.DressChange(itemID);
                break;
            case clothtype.Coat:
                this.CoatChange(itemID);
                break;
            case clothtype.Shirt:
                this.ShirtChange(itemID);
                break;
            case clothtype.Trousers:
                this.TrousersChange(itemID);
                break;
            case clothtype.Socks:
                this.SocksChange(itemID);
                break;
            case clothtype.Shose:
                this.ShoseChange(itemID);
                break;
            case clothtype.Ornament:
                this.OrnamentChange(itemID);
                break;
            case clothtype.Pet:
                this.PetChange(itemID);
                break;
        }

        if (this.nowclothData.Hair == 40501 && this.nowclothData.Dress == 40502 && this.nowclothData.Ornament == 40503 && this.nowclothData.Shose == 40504) {
            (UIMgr.get("UIReady") as UIReady).Pick.disabled=true;
            RecordManager.startAutoRecord();
            this.Man.visible = true;
            let t = this.Man;
            Laya.Tween.to(t, {
                x: 94, update: new Laya.Handler(this, () => {
                    this.Man.x = t.x;
                })
            }, 4000, Laya.Ease.linearNone);
            Laya.timer.once(6000, this, () => {
                UIMgr.show("UIWeddingShare");
                (UIMgr.get("UIReady") as UIReady).Pick.disabled=false;
                // Laya.timer.once(500,this,RecordManager.stopAutoRecord)
                // //RecordManager.stopAutoRecord();
            });
        }
        else {
            this.Man.x = -310;
            this.Man.visible = false;
        }
    }

    ClothReceive() {
        for (let i = 0; i < 8; i++) {
            this._ClothChange(0, i);
        }

    }
    PhotosIndex: number = 0;
    GetPhotosData() {
        GameDataController.PhotosData();


    }
    mes: {
        Hair: number,
        Dress: number,
        Coat: number,
        Shirt: number,
        Trousers: number,
        Socks: number,
        Shose: number,
        Ornament: number
    }[] = [];
    arr = {};
    Share()//拍照
    {
        console.log("拍照");
        UIMgr.tip("拍照成功！");
        let item = GameDataController.PhotosData;
        if (item) {
            this.mes = item;

            for (let index = 0; index < this.mes.length; index++) {
                if (this.mes[index].Hair == this.nowclothData.Hair && this.mes[index].Dress == this.nowclothData.Dress && this.mes[index].Coat == this.nowclothData.Coat && this.mes[index].Shirt == this.nowclothData.Shirt && this.mes[index].Trousers == this.nowclothData.Trousers && this.mes[index].Socks == this.nowclothData.Socks && this.mes[index].Shose == this.nowclothData.Shose && this.mes[index].Ornament == this.nowclothData.Ornament) {
                    console.log("重复了......................");
                    return;
                }
            }
        }
        this.mes.push(this.nowclothData);
        GameDataController.PhotosData = this.mes;
        console.log(GameDataController.PhotosData);
    }

    nowclothData = {
        Hair: 0,
        Dress: 0,
        Coat: 0,
        Shirt: 0,
        Trousers: 0,
        Socks: 0,
        Shose: 0,
        Ornament: 0,
        Pet: 0,
    }
    HairChange(itemID: number)//头发
    {
        this.Hair.visible = this.Hair1.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Hair == itemID) {
            itemID = 10002;
        }
        this.nowclothData.Hair = itemID;
        this.Hair.visible = this.Hair1.visible = true;
        let clothdata = GameDataController._clothData.get(itemID);
        //console.log(clothdata);

        this.Hair.zOrder = clothdata.Sort1;
        this.Hair1.zOrder = clothdata.Sort2;

        this.Hair.skin = clothdata.GetPath1();
        this.Hair1.skin = clothdata.GetPath2();

        this.Hair.centerX = clothdata.GetPosition1().x;
        this.Hair.centerY = clothdata.GetPosition1().y;

        console.log("头发的坐标：" + this.Hair.centerX)
        console.log("头发的坐标：" + this.Hair.centerY)

        this.Hair1.centerX = clothdata.GetPosition2().x;
        this.Hair1.centerY = clothdata.GetPosition2().y;
        
    }
    OrnamentChange(itemID: number)//装饰
    {

        this.Ornament.visible = this.Ornament1.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Ornament == itemID) {
            itemID = 0;
            this.nowclothData.Ornament = itemID;
            return;
        }
        this.nowclothData.Ornament = itemID;
        this.Ornament.visible = this.Ornament1.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Ornament.zOrder = clothdata.Sort1;
        this.Ornament1.zOrder = clothdata.Sort2;

        this.Ornament.skin = clothdata.GetPath1();
        this.Ornament1.skin = clothdata.GetPath2();

        this.Ornament.centerX = clothdata.GetPosition1().x;
        this.Ornament.centerY = clothdata.GetPosition1().y;
        this.Ornament1.centerX = clothdata.GetPosition2().x;
        this.Ornament1.centerY = clothdata.GetPosition2().y;



        if (itemID == 50404) {
            Laya.timer.frameLoop(1, this, this.onScaleChange);//翅膀动

            //星星闪
            this.Star.visible = true;
            for (let i = 0; i < this.Star.numChildren; i++) {
                this.stars[i] = this.Star.getChildByName("star" + i) as Laya.Image;
            }
            Laya.timer.frameLoop(1, this, () => {
                //this.scaleDelta+=0.02;
                var scaleValue: number = Math.sin(this.scaleDelta);
                this.stars.forEach((v) => {
                    v.scale(scaleValue, scaleValue);
                })
            })
        }
        else {
            Laya.timer.clear(this, this.onScaleChange);
            this.Ornament.scale(1, 1);
            this.Star.visible = false;
        }
    }
    ShirtChange(itemID: number)//上衣
    {
        this.Shirt.visible = this.Shirt1.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Shirt == itemID) {
            itemID = 10000;
        }
        else {
            this.DressClose();
            this.UpDownOpen();
        }
        this.nowclothData.Shirt = itemID;
        this.Shirt.visible = this.Shirt1.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Shirt.zOrder = clothdata.Sort1;
        this.Shirt1.zOrder = clothdata.Sort2;

        this.Shirt.skin = clothdata.GetPath1();
        this.Shirt1.skin = clothdata.GetPath2();

        this.Shirt.centerX = clothdata.GetPosition1().x;
        this.Shirt.centerY = clothdata.GetPosition1().y;
        this.Shirt1.centerX = clothdata.GetPosition2().x;
        this.Shirt1.centerY = clothdata.GetPosition2().y;


    }
    TrousersChange(itemID: number)//裤子
    {
        this.Trousers.visible = this.Trousers1.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Trousers == itemID) {
            itemID = 10001;
        }
        else {
            this.DressClose();
            this.UpDownOpen();
        }

        this.nowclothData.Trousers = itemID;
        this.Trousers.visible = this.Trousers1.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);
        this.Trousers.visible = this.Trousers1.visible = true;

        this.Trousers.zOrder = clothdata.Sort1;
        this.Trousers1.zOrder = clothdata.Sort2;

        this.Trousers.skin = clothdata.GetPath1();
        this.Trousers1.skin = clothdata.GetPath2();
        // console.log(clothdata.GetPath1());
        // console.log(this.Trousers.skin);

        this.Trousers.centerX = clothdata.GetPosition1().x;
        this.Trousers.centerY = clothdata.GetPosition1().y;
        this.Trousers1.centerX = clothdata.GetPosition2().x;
        this.Trousers1.centerY = clothdata.GetPosition2().y;


    }
    DressChange(itemID: number)//裙子
    {
        this.Dress.visible = this.Dress1.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Dress == itemID) {
            itemID = 0;
            this.nowclothData.Dress = itemID;
            this.UpDownOpen();
            return;
        }
        else {
            this.DressOpen();
        }
        this.nowclothData.Dress = itemID;
        this.Dress.visible = this.Dress1.visible = true;

        this.UpDownClose();

        let clothdata = GameDataController._ClothData.get(itemID);


        this.Dress.zOrder = clothdata.Sort1;
        this.Dress1.zOrder = clothdata.Sort2;

        this.Dress.skin = clothdata.GetPath1();
        this.Dress1.skin = clothdata.GetPath2();

        this.Dress.centerX = clothdata.GetPosition1().x;
        this.Dress.centerY = clothdata.GetPosition1().y;
        this.Dress1.centerX = clothdata.GetPosition2().x;
        this.Dress1.centerY = clothdata.GetPosition2().y;


    }
    SocksChange(itemID: number)//袜子
    {
        this.Socks1.visible = this.Socks.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Socks == itemID) {
            itemID = 0;
            this.nowclothData.Socks = itemID;
            return;
        }
        this.Socks1.visible = this.Socks.visible = true;
        this.nowclothData.Socks = itemID;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Socks.zOrder = clothdata.Sort1;
        this.Socks1.zOrder = clothdata.Sort2;

        this.Socks.skin = clothdata.GetPath1();
        this.Socks1.skin = clothdata.GetPath2();

        this.Socks.centerX = clothdata.GetPosition1().x;
        this.Socks.centerY = clothdata.GetPosition1().y;
        this.Socks1.centerX = clothdata.GetPosition2().x;
        this.Socks1.centerY = clothdata.GetPosition2().y;


    }
    ShoseChange(itemID: number)//鞋子
    {
        this.Shose.visible = this.Shose1.visible = false;

        if (itemID == null || itemID == 0 || this.nowclothData.Shose == itemID) {
            itemID = 0;
            this.nowclothData.Shose = itemID;
            return;
        }

        this.Shose.visible = this.Shose1.visible = true;
        this.nowclothData.Shose = itemID;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Shose.zOrder = clothdata.Sort1;
        this.Shose1.zOrder = clothdata.Sort2;

        this.Shose.skin = clothdata.GetPath1();
        this.Shose1.skin = clothdata.GetPath2();

        this.Shose.centerX = clothdata.GetPosition1().x;
        this.Shose.centerY = clothdata.GetPosition1().y;
        this.Shose1.centerX = clothdata.GetPosition2().x;
        this.Shose1.centerY = clothdata.GetPosition2().y;


    }
    CoatChange(itemID: number)//外套
    {
        this.Coat.visible = this.Coat1.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Coat == itemID) {
            itemID = 0;
            this.nowclothData.Coat = itemID;
            return;
        }
        this.Coat.visible = this.Coat1.visible = true;
        this.nowclothData.Coat = itemID;
        let clothdata = GameDataController._ClothData.get(itemID);

        this.Coat.zOrder = clothdata.Sort1;
        this.Coat1.zOrder = clothdata.Sort2;

        this.Coat.skin = clothdata.GetPath1();
        this.Coat1.skin = clothdata.GetPath2();

        this.Coat.centerX = clothdata.GetPosition1().x;
        this.Coat.centerY = clothdata.GetPosition1().y;
        this.Coat1.centerX = clothdata.GetPosition2().x;
        this.Coat1.centerY = clothdata.GetPosition2().y;


    }
    PetChange(itemID: number)//宠物
    {
        this.Pet.visible = false;
        if (itemID == null || itemID == 0 || this.nowclothData.Pet == itemID) {
            itemID = 0;
            this.nowclothData.Pet = itemID;
            return;
        }
        this.Pet.visible = true;
        let clothdata = GameDataController._ClothData.get(itemID);
        this.Pet.skin = clothdata.GetPath1();
        this.Pet.centerX = clothdata.GetPosition1().x;
        this.Pet.centerY = clothdata.GetPosition1().y;
        this.Pet.zOrder = clothdata.Sort1;
    }

    UpDownClose() {
        this.ShirtChange(0);
        this.TrousersChange(0);
        this.Shirt.visible = this.Shirt1.visible = false;
        this.Trousers.visible = this.Trousers1.visible = false;
    }

    UpDownOpen() {

        this.Shirt.visible = this.Shirt1.visible = true;
        this.Trousers.visible = this.Trousers1.visible = true;
    }
    DressOpen() {

        this.Dress.visible = this.Dress1.visible = true;
        //this.DressChange(0);
    }
    DressClose() {
        this.DressChange(0);
        this.Dress.visible = this.Dress1.visible = false;
    }

    onScaleChange() {
        this.scaleDelta += 0.02;
        var scaleValue: number = Math.sin(this.scaleDelta);
        this.Ornament.scale(scaleValue, 1);
    }


    CharmValueChange()//魅力值
    {
        
        let hairCharmValue:number;//头发魅力值
        if(this.nowclothData.Hair==0)
        {
            hairCharmValue=0;
        }
        else{
            if(GameDataController._ClothData.get(this.nowclothData.Hair).Star)
            {
                hairCharmValue=GameDataController._ClothData.get(this.nowclothData.Hair).Star;
            }
            else{
                hairCharmValue=0;
            }
        }

        let dressCharmValue:number;//裙子魅力值
        if(this.nowclothData.Dress==0)
        {
            dressCharmValue=0;
        }
        else{
            if(GameDataController._ClothData.get(this.nowclothData.Dress).Star)
            {
                dressCharmValue=GameDataController._ClothData.get(this.nowclothData.Dress).Star;
            }
            else{
                dressCharmValue=0;
            }
        }

        let coatCharmValue:number;//外套魅力值
        if(this.nowclothData.Coat==0)
        {
            coatCharmValue=0;
        }
        else{
            if(coatCharmValue=GameDataController._ClothData.get(this.nowclothData.Coat).Star)
            {
                coatCharmValue=GameDataController._ClothData.get(this.nowclothData.Coat).Star;
            }
            else
            {
                coatCharmValue=0;
            }   
        }

        let shirtCharmValue:number;//shirt魅力值
        if(this.nowclothData.Shirt==0)
        {
            shirtCharmValue=0;
        }
        else{
            if(GameDataController._ClothData.get(this.nowclothData.Shirt).Star)
            {
                shirtCharmValue=GameDataController._ClothData.get(this.nowclothData.Shirt).Star;
            }
            else{
                shirtCharmValue=0;
            }
        }

        let trousersCharmValue:number;//下装魅力值
        if(this.nowclothData.Trousers==0)
        {
            trousersCharmValue=0;
        }
        else{
            if(GameDataController._ClothData.get(this.nowclothData.Trousers).Star)
            {
                trousersCharmValue=GameDataController._ClothData.get(this.nowclothData.Trousers).Star;
            }
            else{
                trousersCharmValue=0;
            }
        }

        let socksCharmValue:number;//袜子魅力值
        if(this.nowclothData.Socks==0)
        {
            socksCharmValue=0;
        }
        else{
            if(GameDataController._ClothData.get(this.nowclothData.Socks).Star)
            {
                socksCharmValue=GameDataController._ClothData.get(this.nowclothData.Socks).Star;
            }
            else{
                socksCharmValue=0;
            }
        }

        let shoseCharmValue:number;//鞋子魅力值
        if(this.nowclothData.Shose==0)
        {
            shoseCharmValue=0;
        }
        else{
            if(GameDataController._ClothData.get(this.nowclothData.Shose).Star)
            {
                shoseCharmValue=GameDataController._ClothData.get(this.nowclothData.Shose).Star;
            }
            else
            {
                shoseCharmValue=0;
            }
        }

        let ornamentCharmValue:number;//首饰魅力值
        if(this.nowclothData.Ornament==0)
        {
            ornamentCharmValue=0;
        }
        else{
            if(GameDataController._ClothData.get(this.nowclothData.Ornament).Star)
            {
                ornamentCharmValue=GameDataController._ClothData.get(this.nowclothData.Ornament).Star;
            }
            else{
                ornamentCharmValue=0;
            }
        }

        if(!GameDataController.CharmValue)
        {
            GameDataController.CharmValue="0";
        }
        let b=hairCharmValue+dressCharmValue+coatCharmValue+ornamentCharmValue+shirtCharmValue+shoseCharmValue+socksCharmValue+trousersCharmValue;
        GameDataController.CharmValue=b.toString();
    }
}


