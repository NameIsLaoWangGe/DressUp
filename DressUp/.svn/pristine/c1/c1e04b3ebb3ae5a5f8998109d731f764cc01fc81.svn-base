import GameDataController from "./GameDataController";
import { clothtype } from "./ClothChange";

export default class PhotosChange extends Laya.Script
{
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

    nophoto: Laya.Image;
    onAwake()
    {
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

        this.nophoto = this.FemaleRoot.getChildByName("nophoto") as Laya.Image;

        for (let i = 0; i < 8; i++)
        {
            this._ClothChange(0, i);
        }
    }
    _ClothChange(itemID: number, type: number)
    {
        switch (type)
        {
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
        }
    }

    ClothReceive()
    {
        for (let i = 0; i < 8; i++)
        {
            this._ClothChange(0, i);
        }

    }
    photoindex: number = 0;
    photoMax: number = 0;
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
    CanShowPhoto: boolean;
    InitMes()
    {
        let item = GameDataController.PhotosData;
        console.log("PhotosChange==》item", item);
        if (item)
        {
            this.mes = item;
        }
        console.log("PhotosChange==mes", this.mes);
        if (this.mes.length <= 0)
        {
            this.CanShowPhoto = false;
            this.nophoto.visible = true;
            console.log("PhotosChange==》是否可以展示photo", !this.nophoto.visible);
           
            return;
        }
        else
        {
            this.CanShowPhoto = true;
            this.nophoto.visible = false;
            this.photoMax = (this.mes.length - 1);
            console.log("PhotosChange==》是否可以展示photo", !this.nophoto.visible);
        }
        this.ChangeAllCloth();
    }

    ChangeAllCloth()
    {
        this.HairChange(this.mes[this.photoindex].Hair); 
        this.CoatChange(this.mes[this.photoindex].Coat);
        this.ShirtChange(this.mes[this.photoindex].Shirt);
        this.TrousersChange(this.mes[this.photoindex].Trousers);
        this.SocksChange(this.mes[this.photoindex].Socks);
        this.ShoseChange(this.mes[this.photoindex].Shose);
        this.OrnamentChange(this.mes[this.photoindex].Ornament);
        this.DressChange(this.mes[this.photoindex].Dress);
    }


    ChangeNextPhoto()
    {
        if (this.CanShowPhoto == false) return;
        this.photoindex++;
        if (this.photoindex > this.photoMax)
        {
            this.photoindex = 0;
        }
        this.ChangeAllCloth();
    }

    ChangeLastPhoto()
    {
        if (this.CanShowPhoto == false) return;
        this.photoindex--;
        if (this.photoindex < 0)
        {
            this.photoindex = this.photoMax;
        }
        this.ChangeAllCloth();
    }
    HairChange(itemID: number)//头发
    {

        this.Hair.visible = this.Hair1.visible = false;
        if (itemID == null || itemID == 0)
        {
            itemID = 10002;
        }
        this.Hair.visible = this.Hair1.visible = true;
        let clothdata = GameDataController._clothData.get(itemID);
        //console.log(clothdata);
        this.Hair.skin = clothdata.GetPath1();
        this.Hair1.skin = clothdata.GetPath2();

        this.Hair.centerX = clothdata.GetPosition1().x;
        this.Hair.centerY = clothdata.GetPosition1().y;
        this.Hair1.centerX = clothdata.GetPosition2().x;
        this.Hair1.centerY = clothdata.GetPosition2().y;

        this.Hair.zOrder = clothdata.Sort1;
        this.Hair1.zOrder = clothdata.Sort2;
    }
    OrnamentChange(itemID: number)//装饰
    {

        this.Ornament.visible = this.Ornament1.visible = false;
        if (itemID == null || itemID == 0)
        {
            itemID = 0;
            return;
        }
        // console.log(itemID);
        //console.log(this.nowclothData.Ornament);
        this.Ornament.visible = this.Ornament1.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Ornament.skin = clothdata.GetPath1();
        this.Ornament1.skin = clothdata.GetPath2();

        this.Ornament.centerX = clothdata.GetPosition1().x;
        this.Ornament.centerY = clothdata.GetPosition1().y;
        this.Ornament1.centerX = clothdata.GetPosition2().x;
        this.Ornament1.centerY = clothdata.GetPosition2().y;

        this.Ornament.zOrder = clothdata.Sort1;
        this.Ornament1.zOrder = clothdata.Sort2;
    }
    ShirtChange(itemID: number)//上衣
    {
        this.Shirt.visible = this.Shirt1.visible = false;
        if (itemID == null || itemID == 0 )
        {
            itemID = 10000;
        }
        else
        {
            this.DressClose();
            this.UpDownOpen();
        }
        this.Shirt.visible = this.Shirt1.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Shirt.skin = clothdata.GetPath1();
        this.Shirt1.skin = clothdata.GetPath2();

        this.Shirt.centerX = clothdata.GetPosition1().x;
        this.Shirt.centerY = clothdata.GetPosition1().y;
        this.Shirt1.centerX = clothdata.GetPosition2().x;
        this.Shirt1.centerY = clothdata.GetPosition2().y;

        this.Shirt.zOrder = clothdata.Sort1;
        this.Shirt1.zOrder = clothdata.Sort2;
    }
    TrousersChange(itemID: number)//裤子
    {
        this.Trousers.visible = this.Trousers1.visible = false;
        if (itemID == null || itemID == 0 )
        {
            itemID = 10001;
        }
        else
        {
            this.DressClose();
            this.UpDownOpen();
        }
        this.Trousers.visible = this.Trousers1.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);
        this.Trousers.visible = this.Trousers1.visible = true;

        this.Trousers.skin = clothdata.GetPath1();
        this.Trousers1.skin = clothdata.GetPath2();
        // console.log(clothdata.GetPath1());
        // console.log(this.Trousers.skin);

        this.Trousers.centerX = clothdata.GetPosition1().x;
        this.Trousers.centerY = clothdata.GetPosition1().y;
        this.Trousers1.centerX = clothdata.GetPosition2().x;
        this.Trousers1.centerY = clothdata.GetPosition2().y;

        this.Trousers.zOrder = clothdata.Sort1;
        this.Trousers1.zOrder = clothdata.Sort2;
    }
    DressChange(itemID: number)//裙子
    {

        this.Dress.visible = this.Dress1.visible = false;
        if (itemID == null || itemID == 0 )
        {
            itemID = 0;
            this.UpDownOpen();
            return;
        }
        else
        {
            this.DressOpen();
        }
        this.Dress.visible = this.Dress1.visible = true;

        this.UpDownClose();

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Dress.skin = clothdata.GetPath1();
        this.Dress1.skin = clothdata.GetPath2();

        this.Dress.centerX = clothdata.GetPosition1().x;
        this.Dress.centerY = clothdata.GetPosition1().y;
        this.Dress1.centerX = clothdata.GetPosition2().x;
        this.Dress1.centerY = clothdata.GetPosition2().y;

        this.Dress.zOrder = clothdata.Sort1;
        this.Dress1.zOrder = clothdata.Sort2;

    }
    SocksChange(itemID: number)//袜子
    {
        this.Socks1.visible = this.Socks.visible = false;
        if (itemID == null || itemID == 0 )
        {
            itemID = 0;
            return;
        }
        this.Socks1.visible = this.Socks.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Socks.skin = clothdata.GetPath1();
        this.Socks1.skin = clothdata.GetPath2();

        this.Socks.centerX = clothdata.GetPosition1().x;
        this.Socks.centerY = clothdata.GetPosition1().y;
        this.Socks1.centerX = clothdata.GetPosition2().x;
        this.Socks1.centerY = clothdata.GetPosition2().y;

        this.Socks.zOrder = clothdata.Sort1;
        this.Socks1.zOrder = clothdata.Sort2;
    }
    ShoseChange(itemID: number)//鞋子
    {
        this.Shose.visible = this.Shose1.visible = false;

        if (itemID == null || itemID == 0 )
        {
            itemID = 0;
            return;
        }

        this.Shose.visible = this.Shose1.visible = true;

        let clothdata = GameDataController._ClothData.get(itemID);

        this.Shose.skin = clothdata.GetPath1();
        this.Shose1.skin = clothdata.GetPath2();

        this.Shose.centerX = clothdata.GetPosition1().x;
        this.Shose.centerY = clothdata.GetPosition1().y;
        this.Shose1.centerX = clothdata.GetPosition2().x;
        this.Shose1.centerY = clothdata.GetPosition2().y;

        this.Shose.zOrder = clothdata.Sort1;
        this.Shose1.zOrder = clothdata.Sort2;
    }
    CoatChange(itemID: number)//外套
    {
        this.Coat.visible = this.Coat1.visible = false;
        if (itemID == null || itemID == 0 )
        {
            itemID = 0;
            return;
        }
        this.Coat.visible = this.Coat1.visible = true;
        let clothdata = GameDataController._ClothData.get(itemID);

        this.Coat.skin = clothdata.GetPath1();
        this.Coat1.skin = clothdata.GetPath2();

        this.Coat.centerX = clothdata.GetPosition1().x;
        this.Coat.centerY = clothdata.GetPosition1().y;
        this.Coat1.centerX = clothdata.GetPosition2().x;
        this.Coat1.centerY = clothdata.GetPosition2().y;

        this.Coat.zOrder = clothdata.Sort1;
        this.Coat1.zOrder = clothdata.Sort2;
    }

    UpDownClose()
    {
        this.ShirtChange(0);
        this.TrousersChange(0);
        this.Shirt.visible = this.Shirt1.visible = false;
        this.Trousers.visible = this.Trousers1.visible = false;
    }

    UpDownOpen()
    {

        this.Shirt.visible = this.Shirt1.visible = true;
        this.Trousers.visible = this.Trousers1.visible = true;
    }
    DressOpen()
    {

        this.Dress.visible = this.Dress1.visible = true;
        //this.DressChange(0);
    }
    DressClose()
    {
        this.DressChange(0);
        this.Dress.visible = this.Dress1.visible = false;
    }



}