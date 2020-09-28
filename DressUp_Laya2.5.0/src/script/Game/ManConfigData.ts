import { LC } from "./Formula"
import GameDataController from "./GameDataController";

export default class ManConfigData extends Laya.Script{


    LoadManJson()
    {
        this.ManJson.forEach((v)=>{
            let  temp=new ManData();
            if(v["ID"])
            {
                temp.ID=parseInt(v["ID"]);
            }
            if(v["Name"])
            {
                temp.Name=v["Name"];
            }
            if(v["Charm"])
            {
                temp.Charm=parseInt(v["Charm"]);
            }
            if(v["Star"])
            {
                temp.Star=parseInt(v["Star"])
            }
            if(v["Level1"])
            {
                temp.Level1= v["Level1"].split(';')
            }
            if(v["Level2"])
            {
                temp.Level2= v["Level2"].split(';')
            }
            if(v["Level3"])
            {
                temp.Level3= v["Level3"].split(';')
            }
            if(v["Different1"])
            {
                temp.Different1=v["Different1"].split(";")
            }
            if(v["Different2"])
            {
                temp.Different2=v["Different2"].split(";")
            }
            if(v["Different3"])
            {
                temp.Different3=v["Different3"].split(";")
            }
            if(v["Icon"])
            {
                temp.Icon=v["Icon"].split(";")
            }
            if(v["Painting"])
            {
                temp.Painting=v["Painting"].split(";")
            }
            if(v["Lock"])
            {
                temp.Lock=parseInt(v["Lock"])
            }
            if(v["WatchAD"])
            {
                temp.WatchAD=parseInt(v["WatchAD"])
            }
            if(v["ADNum"])
            {
                temp.ADNum=parseInt(v["ADNum"])
            }
            if(v["Des"])
            {
                temp.Des=v["Des"]
            }
            if(v["Answer"])
            {
                temp.Answer=v["Answer"].split(";")
            }
            GameDataController.ManData.push(temp);
            GameDataController._manData.set(temp.ID,temp);
            GameDataController.ManDataAsy[temp.ID]=temp.Lock; //角色的状态表 {ID:解锁状态（0解锁 1未解锁）}
            GameDataController.ManStarAsy[temp.ID]=temp.Star; //角色的星级表 {ID:星级}
        })
        
        let ManFirst = Laya.LocalStorage.getItem("ManFirst");//第一次初始化
        if (ManFirst)
        {
            if (ManFirst == "0")//非彩蛋版本 第一次添加
            {
                Laya.LocalStorage.setJSON("ManData", GameDataController.ManDataAsy);
                Laya.LocalStorage.setJSON("ManStar",GameDataController.ManStarAsy);
                Laya.LocalStorage.setItem("ManFirst", "1");
            }
            else
            {
                let Update = {};
                let newManData = GameDataController.ManDataAsy;
                for (let k in newManData)
                {
                    let value = GameDataController.ManDataRefresh[k];
                    if (value != null)
                    {
                        Update[k] = value;
                    }
                    else
                    {
                        console.log("新ID", k)
                        Update[k] = 1;
                    }
                }
                Laya.LocalStorage.setJSON("ManData", Update);

                //星星
                let Update1={};
                let newManStar=GameDataController.ManStarAsy;
                for(let t in newManStar)
                {
                    let value=GameDataController.ManStarRefresh[t];
                    if(value!=null)
                    {
                        Update1[t]=value;
                    }
                    else
                    {
                        //新的角色是零星
                        Update1[t]=0;
                    }
                }
                Laya.LocalStorage.setJSON("ManStar",Update1);

            }
        }
        else
        {
            Laya.LocalStorage.setJSON("ManData", GameDataController.ManDataAsy);
            Laya.LocalStorage.setJSON("ManStar",GameDataController.ManStarAsy);
            Laya.LocalStorage.setItem("ManFirst", "1");
        }
        GameDataController._ManData.forEach((v) =>
        {
            v.Icon.forEach((i,j)=>{
                Laya.loader.load(v.GetIconPath(j));
            })
            v.Painting.forEach((i,j)=>{
                Laya.loader.load(v.GetPaintingPath(j));
            })
        })
    }


    ManJson=[
        {
            ID:"1001",
            Name:"范成橙",
            Charm:"15", //魅力值
            Star:"1",//星级
            Level1:"我到了,我带着帽子;我穿着红色的西装套装;我打着黑色的领带", //关卡1
            Level2:"久等了,我穿的蓝色牛仔外套;灰色的帆布鞋;我穿着咖啡色的卫衣", //关卡2
            Level3:"我坐在沙发上等你,我是蓝色的头发;我穿着蓝色的衣服;哦,忘了说,还有白色的帆布鞋",//关卡3
            Different1:"1012;1011;1013;3011", //关卡1干扰项
            Different2:"1013;3014;2013;2011", //关卡2干扰项
            Different3:"4011;3014;3012;2013", //关卡3干扰项
            Icon:"1001;2003;3004",//每关的头像
            Painting:"1011;2013;3014", //每关的立绘
            Lock:"1", // 是否解锁  1未解锁  0解锁
            WatchAD:"1",//是否看广告   1不看 0看
            ADNum:"0", //看广告个数
            Des:"演艺明星范成橙",
            Answer:"1001;2003;3004",//每关的答案
        },
        {
            ID:"1003",
            Name:"吴毅帆",
            Charm:"15", //魅力值
            Star:"1",//星级
            Level1:"我穿着蓝色西装;我穿着白色的皮鞋;找得到我嘛,我穿的淡蓝色裤子", //关卡1
            Level2:"我喜欢音乐,带着红色的耳机;我背着吉他;我今天染的红色头发", //关卡2
            Level3:"我穿的黄色西装;太阳太大了,我带的墨镜;我穿的深灰色裤子",//关卡3
            Different1:"1013;4011;3012;2013", //关卡1干扰项
            Different2:"1011;3012;2011;2012", //关卡2干扰项
            Different3:"4011;2011;1012;1014", //关卡3干扰项
            Icon:"1003;2001;1004",
            Painting:"1013;2011;1014",
            Lock:"1", // 是否解锁  1未解锁  0解锁
            WatchAD:"1",//是否看广告   1不看 0看
            ADNum:"0", //看广告个数
            Des:"Young OG吴毅帆",
            Answer:"1003;2001;1004",
        },
        {
            ID:"2004",
            Name:"陆寒",
            Charm:"23", //魅力值
            Star:"1",//星级
            Level1:"今天我是可爱的小粉红哦,穿的粉色外套;穿的淡黄色卫衣;我带了帽子哦", //关卡1
            Level2:"我带了帽子;穿着新买的白色外套;穿着最爱的蓝色裤子", //关卡2
            Level3:"我染的红头发哦;我的笑容很迷人哦;我穿着红色外套",//关卡3
            Different1:"3011;1013;1012;2014", //关卡1干扰项
            Different2:"4011;3011;1012;2013", //关卡2干扰项
            Different3:"4011;4011;3011;2013", //关卡3干扰项
            Icon:"2004;1002;4001",
            Painting:"2014;1012;4011",
            Lock:"1", // 是否解锁  1未解锁  0解锁
            WatchAD:"1",//是否看广告   1不看 0看
            ADNum:"0", //看广告个数
            Des:"邻家小哥哥陆寒",
            Answer:"2004,1002,4001",
        },
        {
            ID:"3003",
            Name:"蔡旭鯤",
            Charm:"29", //魅力值
            Star:"1",//星级
            Level1:"我穿着咖啡色外套;我坐着,穿着白色帆布鞋;我穿着棕色T恤", //关卡1
            Level2:"我背着一把吉他,准备给你献上一曲;我带着紫色耳机;我穿着牛仔外套", //关卡2
            Level3:"我坐着在看书;我穿着玫红色外套;我穿着黑色的A锥",//关卡3
            Different1:"1012;3013;3014;2011", //关卡1干扰项
            Different2:"3012;3012;2012;2011", //关卡2干扰项
            Different3:"3011;2011;3012;1011", //关卡3干扰项
            Icon:"3003;2002;3001",
            Painting:"3013;2012;3011",
            Lock:"1", // 是否解锁  1未解锁  0解锁
            WatchAD:"1",//是否看广告   1不看 0看
            ADNum:"0", //看广告个数
            Des:"阳光男孩蔡旭鯤",
            Answer:"3003;2002;3001",
        },
        {
            ID:"3002",
            Name:"王易铂",
            Charm:"33", //魅力值
            Star:"1",//星级
            Level1:"我穿着白色A锥;我穿着淡蓝色长裤;我带着黑框眼镜", //关卡1
            Level2:"我今天染的红色头发;我喜欢音乐,带着红色的耳机;我背着吉他", //关卡2
            Level3:"我坐在沙发上等你,我是蓝色的头发;哦,忘了说,还有白色的A锥;我穿着蓝色的衣服",//关卡3
            Different1:"3012;2011;4011;1011", //关卡1干扰项
            Different2:"3011;4011;2011;1012", //关卡2干扰项
            Different3:"1011;2012;2013;3014", //关卡3干扰项
            Icon:"3002;2001;3004",
            Painting:"3012;2011;3014",
            Lock:"1", // 是否解锁  1未解锁  0解锁
            WatchAD:"1",//是否看广告   1不看 0看
            ADNum:"0", //看广告个数
            Des:"球鞋爱好者王易铂",
            Answer:"3002;2001;3004",
        },
        {
            ID:"5001",
            Name:"萧栈",
            Charm:"", //魅力值
            Star:"1",//星级
            Level1:"你是谁？;我就站在这,你是谁？;我。。。好吧,我穿着黑衣", //关卡1
            Level2:"可否愿意听我吹箫一曲;我。。。也许,就站在你面前", //关卡2
            Level3:"你终究还是来了,我就站在这;你,也许我们有缘吧,都穿的黑色鞋子;我留着黑色长发",//关卡3
            Different1:"5011;2011;3012;4011", //关卡1干扰项
            Different2:"1011;5011;2012;3011", //关卡2干扰项
            Different3:"4011;1012;3012;5011", //关卡3干扰项
            Icon:"5001;5001;5001",
            Painting:"5011;5011;5011",
            Lock:"1", // 是否解锁  1未解锁  0解锁
            WatchAD:"0",//是否看广告   1不看 0看
            ADNum:"3", //看广告个数
            Des:"风度翩翩古风萧栈",
            Answer:"5001;5001;5001",
        },
        {
            ID:"6001",
            Name:"四字哥哥",
            Charm:"", //魅力值
            Star:"1",//星级
            Level1:"嘿！走路小心点,踩到我白色的鞋了;撞到我了,把我的红色头巾都撞掉了", //关卡1
            Level2:"嗨,等你好久了,我穿着灰色西装;你是要我等多久？我都站了半天了", //关卡2
            Level3:"你。。。今天打扮的还不错,和我灰色西装很配;我穿着灰色长裤,这搭配,很满意;别站着了,快走吧,我带你出去玩",//关卡3
            Different1:"6011;1011;2012;3012", //关卡1干扰项
            Different2:"3012;6011;1013;2013", //关卡2干扰项
            Different3:"1012;3013;4011;6011", //关卡3干扰项
            Icon:"6001;6001;6001",
            Painting:"6011;6011;6011",
            Lock:"1", // 是否解锁  1未解锁  0解锁
            WatchAD:"0",//是否看广告   1不看 0看
            ADNum:"3", //看广告个数
            Des:"霸道公子四字哥哥",
            Answer:"6001;6001;6001",
        }
    ]
}

export class ManData extends Laya.Script
{
    // ----------------------ID------------------//
    public set ID(v:number)
    {
        this._ID=v;
    }
    public get ID():number
    {
        return this._ID;
    }
    private _ID:number;
 // ----------------------名字-----------------//
    public set Name(v:string)
    {
        this._Name=v;
    }
    public get Name():string
    {
        return this._Name;
    }
    private _Name:string;
 // ----------------------魅力值------------------//
    public set Charm(v:number)
    {
        this._Charm=v;
    }
    public get Charm():number
    {
        return this._Charm;
    }
    private _Charm:number;
 // ----------------------星级------------------//
    public set Star(v:number)
    {
        this._Star=v;
    }
    public get Star():number
    {
        return this._Star;
    }
    private _Star:number;
 // ----------------------关卡1对话------------------//
    public set Level1(v:string[])
    {
        this._Level1=v;
    }
    public get Level1():string[]
    {
        return this._Level1;
    }
    private _Level1:string[];
 // ----------------------关卡2对话------------------//
    public set Level2(v:string[])
    {
        this._Level2=v;
    }
    public get Level2():string[]
    {
        return this._Level2;
    }
    private _Level2:string[];
 // ----------------------关卡3对话------------------//
    public set Level3(v:string[])
    {
        this._Level3=v;
    }
    public get Level3():string[]
    {
        return this._Level3;
    }
    private _Level3:string[];
    // ----------------------关卡1干扰项------------------//
    public set Different1(v:string[])
    {
        this._Different1=v;
    }
    public get Different1():string[]
    {
        return this._Different1;
    }
    private _Different1:string[];
    // ----------------------关卡2干扰项------------------//
    public set Different2(v:string[])
    {
        this._Different2=v;
    }
    public get Different2():string[]
    {
        return this._Different2;
    }
    private _Different2:string[];
    // ----------------------关卡3干扰项------------------//
    public set Different3(v:string[])
    {
        this._Different3=v;
    }
    public get Different3():string[]
    {
        return this._Different3;
    }
    private _Different3:string[];
 // ----------------------头像------------------//
    public set Icon(v:string[])
    {
        this._Icon=v;
    }
    public get Icon():string[]
    {
        return this._Icon;
    }
    private _Icon:string[];
 // ----------------------立绘------------------//
    public set Painting(v:string[])
    {
        this._Painting=v;
    }
    public get Painting():string[]
    {
        return this._Painting;
    }
    private _Painting:string[]
 // ----------------------是否解锁------------------//
    public set Lock(v:number)
    {
        this._Lock=v;
    }
    public get Lock():number
    {
        return this._Lock;
    }
    private _Lock:number
 // ----------------------是否看广告------------------//
    public set WatchAD(v:number)
    {
        this._WatchAD=v;
    }
    public get WatchAD():number
    {
        return this._WatchAD;
    }
    private _WatchAD:number;
 // ----------------------看广告数量------------------//
    public set ADNum(v:number)
    {
        this._ADNum=v;
    }
    public get ADNum():number
    {
        return this._ADNum;
    }
    private _ADNum:number;
 // ----------------------描述------------------//
    public set Des(v:string)
    {
        this._Des=v;
    }
    public get Des():string
    {
        return this._Des;
    }
    private _Des:string;
// ----------------------答案ID------------------//
    public set Answer(v:string[])
    {
        this._Answer=v;
    }
    public get Answer():string[]
    {
        return this._Answer;
    }
    private _Answer:string[];

    public GetIconPath(index:number) //获取男角色头像路径
    {
        if(this.Icon==null)
        {
            return null;
        }
        return "https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManIcon"+"/"+this.Icon[index]+".png";
    }

    public GetPaintingPath(index:number) //获取男角色立绘路径
    {
        if(this.Painting==null)
        {
            return null;
        }

        return "https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManPainting"+"/"+this.Painting[index]+".jpg";
    }

    public GetBG()
    {
        return "https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManPainting/bg.jpg";
    }
    public GetDesk()
    {
        return "https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManPainting/desk.png";
    }
}