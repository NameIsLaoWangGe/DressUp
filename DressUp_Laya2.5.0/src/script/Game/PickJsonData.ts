import GameDataController from "./GameDataController";

export default class PickJsonData extends Laya.Script{

    LoadPickJson()
    {
        this.PickJson.forEach((v)=>{
            let temp=new PickData();
            if(v["ID"])
            {
                temp.ID=parseInt(v["ID"]);
            }
            if (v["Name"])
            {
                temp.Name = v["Name"];
            }
            if(v["Num"])
            {
                temp.Num=parseInt(v["Num"]);
            }

            GameDataController.PickData.push(temp);
        })

        let temp1=new PickData();
        temp1.ID=16;
        temp1.Name="我";
        temp1.Num=parseInt(Laya.LocalStorage.getItem("TodayWinNum"))
        GameDataController.PickData.push(temp1);
    }




    PickJson=[
        {
            ID:"1",
            Name:"美少女 ",
            Num:"4",
        },
        {
            ID:"2",
            Name:"牛奶煮萝莉",
            Num:"4",
        },
        {
            ID:"3",
            Name:"凉巷少年与狸猫",
            Num:"2",
        },
        {
            ID:"4",
            Name:"亦凡加油",
            Num:"4",
        },
        {
            ID:"5",
            Name:"你好亦好",
            Num:"3",
        },
        {
            ID:"6",
            Name:"美人性情",
            Num:"3",
        },
        {
            ID:"7",
            Name:"迪士尼在逃公主",
            Num:"3",
        },
        {
            ID:"8",
            Name:"云淡风轻",
            Num:"2",
        },
        {
            ID:"9",
            Name:"南楼月下",
            Num:"2",
        },
        {
            ID:"10",
            Name:"梦里遇你",
            Num:"2",
        },
        {
            ID:"11",
            Name:"樱花钞",
            Num:"2",
        },
        {
            ID:"12",
            Name:"行星饭",
            Num:"1",
        },
        {
            ID:"13",
            Name:"烟雨江畔",
            Num:"1",
        },
        {
            ID:"14",
            Name:"纪离",
            Num:"1",
        },
        {
            ID:"15",
            Name:"谎言",
            Num:"1",
        }
    ]
}

export  class PickData extends Laya.Script{

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


    public set Num(v: number) 
    {
        this._Num = v;
    }
    public get Num(): number
    {
        return this._Num;
    }
    private _Num: number;
}