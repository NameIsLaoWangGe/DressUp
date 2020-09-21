import ClothChange, { clothtype } from "./ClothChange";
import GameDataController from "./GameDataController";

export default class PickClothChange extends Laya.Script {
    
    FemaleRoot:Laya.Image;

    Hair:Laya.Image;
    Hair1:Laya.Image;

    Ornament:Laya.Image;
    Ornament1:Laya.Image;

    Shirt:Laya.Image;
    Shirt1:Laya.Image;

    Trousers:Laya.Image;
    Trousers1:Laya.Image;

    Dress:Laya.Image;
    Dress1:Laya.Image;

    Socks:Laya.Image;
    Socks1:Laya.Image;

    Shose:Laya.Image;
    Shose1:Laya.Image;

    Coat:Laya.Image;
    Coat1:Laya.Image;

    Shadow:Laya.Image;
    Body:Laya.Image;

    static Instance: PickClothChange;
    onAwake()
    {
        PickClothChange.Instance = this;

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

        for (let i = 0; i < 8; i++) {
           
           this._ClothChange(0,i); 
        }
    }

    ChangeAllCloth()
    {
        this.HairChange(ClothChange.Instance.nowclothData.Hair);
        this.CoatChange(ClothChange.Instance.nowclothData.Coat);
        this.ShirtChange(ClothChange.Instance.nowclothData.Shirt);
        this.TrousersChange(ClothChange.Instance.nowclothData.Trousers);
        this.SocksChange(ClothChange.Instance.nowclothData.Socks);
        this.ShoseChange(ClothChange.Instance.nowclothData.Shose);
        this.OrnamentChange(ClothChange.Instance.nowclothData.Ornament);
        this.DressChange(ClothChange.Instance.nowclothData.Dress);
        
    }
    
    _ClothChange(itemID:number,type:number)
    {
        switch(type)
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


    HairChange(itemID:number)
    {
        this.Hair.visible=this.Hair1.visible=false;
        if(itemID==null||itemID==0)
        {
            itemID=10002;
        }
        this.Hair.visible=this.Hair1.visible=true;
        let clothdata=GameDataController._clothData.get(itemID);

        this.Hair.zOrder=clothdata.Sort1;
        this.Hair1.zOrder=clothdata.Sort2;

        this.Hair.skin=clothdata.GetPath1();
        this.Hair1.skin=clothdata.GetPath2();

        this.Hair.centerX=clothdata.GetPosition1().x;
        this.Hair.centerY=clothdata.GetPosition1().y;
        this.Hair1.centerX=clothdata.GetPosition2().x;
        this.Hair1.centerY=clothdata.GetPosition2().y;

        
    }
    DressChange(itemID:number)
    {
        this.Dress.visible=this.Dress1.visible=false;
        if(itemID==null||itemID==0)
        {
            itemID=0;
            this.UpDownOpen();
            return;
        }
        else
        {
            this.DressOpen();
        }

        if(itemID==40502)
        {
            this.Shose.visible=this.Shose1.visible=false;
        }
        this.Dress.visible=this.Dress1.visible=true;

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
    CoatChange(itemID:number)//外套
    {
        this.Coat.visible = this.Coat1.visible = false;
        if (itemID == null || itemID == 0 )
        {
            itemID = 0;
            return;
        }
        this.Coat.visible = this.Coat1.visible = true;
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
    ShirtChange(itemID:number)//上衣
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

        this.Shirt.zOrder = clothdata.Sort1;
        this.Shirt1.zOrder = clothdata.Sort2;

        this.Shirt.skin = clothdata.GetPath1();
        this.Shirt1.skin = clothdata.GetPath2();

        this.Shirt.centerX = clothdata.GetPosition1().x;
        this.Shirt.centerY = clothdata.GetPosition1().y;
        this.Shirt1.centerX = clothdata.GetPosition2().x;
        this.Shirt1.centerY = clothdata.GetPosition2().y;

        
    }
    TrousersChange(itemID:number)//裤子
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

        this.Trousers.zOrder = clothdata.Sort1;
        this.Trousers1.zOrder = clothdata.Sort2;

        this.Trousers.skin = clothdata.GetPath1();
        this.Trousers1.skin = clothdata.GetPath2();

        this.Trousers.centerX = clothdata.GetPosition1().x;
        this.Trousers.centerY = clothdata.GetPosition1().y;
        this.Trousers1.centerX = clothdata.GetPosition2().x;
        this.Trousers1.centerY = clothdata.GetPosition2().y;

       
    }
    SocksChange(itemID:number)//袜子
    {
        this.Socks1.visible = this.Socks.visible = false;
        if (itemID == null || itemID == 0 )
        {
            itemID = 0;
            return;
        }
        this.Socks1.visible = this.Socks.visible = true;

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
    ShoseChange(itemID:number)//鞋子
    {
        this.Shose.visible = this.Shose1.visible = false;

        if (itemID == null || itemID == 0 )
        {
            itemID = 0;
            return;
        }

        this.Shose.visible = this.Shose1.visible = true;

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
    OrnamentChange(itemID:number)//装饰
    {
        this.Ornament.visible = this.Ornament1.visible = false;
        if (itemID == null || itemID == 0)
        {
            itemID = 0;
            return;
        }
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

        
    }
    UpDownOpen()
    {
        this.Shirt.visible = this.Shirt1.visible = true;
        this.Trousers.visible = this.Trousers1.visible = true;
    }
    UpDownClose()
    {
        this.ShirtChange(0);
        this.TrousersChange(0);
        this.Shirt.visible = this.Shirt1.visible = false;
        this.Trousers.visible = this.Trousers1.visible = false;
    }
    DressOpen()
    {
        this.Dress.visible = this.Dress1.visible = true;
    }
    DressClose()
    {
        this.DressChange(0);
        this.Dress.visible = this.Dress1.visible = false;
    }
}