export default class ClothData extends Laya.Script
{


    public set ID(v: number) 
    {
        this._ID = v;
    }


    public get ID(): number
    {
        return this._ID;
    }
    private _ID: number;




    public set Name(v: string)
    {
        this._Name = v;
    }


    public get Name(): string
    {
        return this._Name;
    }
    private _Name: string;



    public set Level(v: number)
    {
        this._Level = v;
    }
    public get Level(): number
    {
        return this._Level;
    }
    private _Level: number;


    public set Gender(v: number)
    {
        this._Gender = v;
    }
    public get Gender(): number
    {
        return this._Gender;
    }
    private _Gender: number;


    public set Type(v: number)
    {
        this._Type = v;
    }
    public get Type(): number
    {
        return this._Type;
    }
    private _Type: number;

    public set IconPath1(v: string)
    {
        this._IconPath1 = v;
    }
    public get IconPath1(): string
    {
        return this._IconPath1;
    }
    private _IconPath1: string;

    public set Position(v: string)
    {
        this._Position = v;
    }
    public get Position(): string
    {
        return this._Position;
    }
    private _Position: string;

    public set Sort1(v: number)
    {
        this._Sort1 = v-10;
    }
    public get Sort1(): number
    {
        return this._Sort1;
    }
    private _Sort1: number;

    public set IconPath2(v: string)
    {
        this._IconPath2 = v;
    }
    public get IconPath2(): string
    {
        return this._IconPath2;
    }
    private _IconPath2: string;

    public set Position2(v: string)
    {
        this._Position2 = v;
    }
    public get Position2(): string
    {
        return this._Position2;
    }
    private _Position2: string;


    public set Sort2(v: number)
    {
        this._Sort2 = v-10;
    }
    public get Sort2(): number
    {
        return this._Sort2;
    }
    private _Sort2: number;

    public set NeedItems(v: string)
    {
        this._NeedItems = v;
    }
    public get NeedItems(): string
    {
        return this._NeedItems;
    }
    private _NeedItems: string;


    public set Introduce(v: string)
    {
        this._Introduce = v;
    }
    public get Introduce(): string
    {
        return this._Introduce;
    }
    private _Introduce: string;


    public set Label1(v: string)
    {
        this._Label1 = v;
    }
    public get Label1(): string
    {
        return this._Label1;
    }
    private _Label1: string;


    public set Label2(v: string)
    {
        this._Label2 = v;
    }
    public get Label2(): string
    {
        return this._Label2;
    }
    private _Label2: string;

    public set Price(v: number)
    {
        this._Price = v;
    }
    public get Price(): number
    {
        return this._Price;
    }
    private _Price: number;

    public set num(v: number)
    {
        this._num = v;
    }
    public get num(): number
    {
        return this._num;
    }
    private _num: number;


    public set Type2(v: string)
    {
        this._Type2 = v;
    }
    public get Type2(): string
    {
        return this._Type2;
    }
    private _Type2: string;


    public set Star(v: number)
    {
        this._Star = v;
    }
    public get Star(): number
    {
        return this._Star;
    }
    private _Star: number;


    public GetKey(): number
    {
        return this.ID;
    }
    private _pos1: Laya.Point = new Laya.Point;
    private _pos2: Laya.Point = new Laya.Point;

    public GetPosition1()
    {

        let str = this.Position;
        if (str == null)
        {
            return this._pos1;
        }
        let a = str.split(',');
        this._pos1.x = parseFloat(a[0]);
        this._pos1.y = -parseFloat(a[1]);
        return this._pos1;
    }
    public GetPosition2()
    {
        let str = this.Position2;
        if (str == null)
        {
            return this._pos2;
        }
        let a = str.split(',');
        this._pos2.x = parseFloat(a[0]);
        this._pos2.y = -parseFloat(a[1]);
        return this._pos2;
    }
    public GetPath1()
    {
        if (this.IconPath1 == null)
        {
            return null;
        }
        let pathway = "";
        let filename = "";
        if (this.Type == 0)//头发
        {
            filename = "Hair";
        }
        if (this.Type == 1)//长裙
        {
            filename = "Dress";
        }
        if (this.Type == 2)//
        {
            filename = "";
        }
        if (this.Type == 3)//上衣
        {
            filename = "Up";
        }
        if (this.Type == 4)//下装
        {
            filename = "Down";
        }
        if (this.Type == 5)//袜子
        {
            filename = "Scoks";
        }
        if (this.Type == 6)//鞋子
        {
            filename = "Shoes";
        }
        if (this.Type == 7)//配饰
        {
            filename = "ACC"
        }
        if(this.Type==8)//宠物
        {
            filename="Pet";
        }
        //pathway = "Cloth/" + filename + "/" + this.IconPath1 + ".png";
        pathway = "https://h5.tomatojoy.cn/wx/mhdmx/zijie/1.0.8/Cloth/" + filename + "/" + this.IconPath1 + ".png";
        return pathway;
    }

    public GetPath2()
    {
        if (this.IconPath2 == null)
        {
            return null;
        }
        let pathway = "";
        let filename = "";
        if (this.Type == 0)//头发
        {
            filename = "Hair";
        }
        if (this.Type == 1)//长裙
        {
            filename = "Dress";
        }
        if (this.Type == 2)//
        {
            filename = "";
        }
        if (this.Type == 3)//上衣
        {
            filename = "Up";
        }
        if (this.Type == 4)//下装
        {
            filename = "Down";
        }
        if (this.Type == 5)//袜子
        {
            filename = "Scoks";
        }
        if (this.Type == 6)//鞋子
        {
            filename = "Shoes";
        }
        if (this.Type == 7)//配饰
        {
            filename = "ACC";
        }
        //pathway = "Cloth/" + filename + "/" + this.IconPath2 + ".png";
        pathway = "https://h5.tomatojoy.cn/wx/mhdmx/zijie/1.0.8/Cloth/" + filename + "/" + this.IconPath2 + ".png";
        return pathway;
    }
    
    public get GetType2()
    {
        if (this.Type2 != null)
        {
            return this.Type2.substring(0, 3);
        }
        else{
            return null;
        }
    }


}