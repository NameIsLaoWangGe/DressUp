import GameDataController, { ClothPackgeData } from "./GameDataController";
import ClothData from "./ClothData";
import { EventMgr } from "../Frame/Core";
import { clothtype } from "./ClothChange";
import { LC } from "./Formula";
import PickJsonData from "./PickJsonData";

export default class ConfigData extends Laya.Script
{
    pic=new PickJsonData();
    LoadJson()
    {
        
        this.LoadJson2();
        this.pic.LoadPickJson();
    }
    LoadJson2()
    {
        console.log("===========>");
        let pack1 = new ClothPackgeData();//七日签到
        let pack2 = new ClothPackgeData();//抽屉特殊皮肤
        let pack3 = new ClothPackgeData();//特殊彩蛋皮肤
        let pack4 = new ClothPackgeData();
        


        this.ClothJson.forEach((v) =>
        {
            let temp = new ClothData();//数据初始化
            if (v["ID"])
            {
                temp.ID = parseInt(v["ID"]);
            }
            if (v["Name"])
            {
                temp.Name = v["Name"];
            }
            if (v["NeedItems"])
            {
                temp.NeedItems = v["NeedItems"];
            }
            if (v["Gender"])
            {
                temp.Gender = parseInt(v["Gender"]);
            }
            if (v["Type"])
            {
                temp.Type = parseInt(v["Type"]);
            }
            if (v["Level"])
            {
                temp.Level = parseInt(v["Level"]);
            }
            if (v["Position"])
            {
                temp.Position = v["Position"];
            }
            if (v["Position2"])
            {
                temp.Position2 = v["Position2"];
            }
            if (v["Label1"])
            {
                temp.Label1 = v["Label1"];
            }
            if (v["Label2"])
            {
                temp.Label2 = v["Label2"];
            }
            if (v["Sort1"])
            {
                temp.Sort1 = parseInt(v["Sort1"]);
            }
            if (v["Sort2"])
            {
                temp.Sort2 = parseInt(v["Sort2"]);
            }
            if (v["Price"])
            {
                temp.Price = parseInt(v["Price"]);
            }
            if (v["IconPath1"])
            {
                temp.IconPath1 = v["IconPath1"];
            }
            if (v["IconPath2"])
            {
                temp.IconPath2 = v["IconPath2"];
            }
            if (v["Star"])
            {
                temp.Star = parseInt(v["Star"]);
            }
            if (v["Type2"])
            {
                temp.Type2 = v["Type2"];
            }
            if (v["num"])
            {
                temp.num = parseInt(v["num"]);
            }
            if (temp.ID == 10000 || temp.ID == 10001 || temp.ID == 10002)
            {
                //普通部位

            }
            else
            {
                switch (temp.Type)
                {
                    case clothtype.Hair:
                        GameDataController.HairData.push(temp);
                        break;
                    case clothtype.Dress:
                        GameDataController.DressData.push(temp);
                        break;
                    case clothtype.Shirt:
                        GameDataController.ShirtData.push(temp);
                        break;
                    case clothtype.Trousers:
                        GameDataController.TrousersData.push(temp);
                        break;
                    case clothtype.Socks:
                        GameDataController.SocksData.push(temp);
                        break;
                    case clothtype.Shose:
                        GameDataController.ShoseData.push(temp);
                        break;
                    case clothtype.Ornament:
                        GameDataController.OrnamentData.push(temp);
                        break;
                    case clothtype.Pet:
                        GameDataController.PetData.push(temp);
                        break;
                }
            }
            if (temp.Type2 != null)//添加套装属性 pack1:七日签到  pack2:抽屉特殊皮肤 
            {
                let a = temp.Type2;
                let arr = a.split("_");
                if (arr[0] == "1")
                {
                    if (arr[1] == "1")
                    {
                        pack1.cloths1.push(temp);
                    }
                    if (arr[1] == "2")
                    {
                        pack1.cloths2.push(temp);

                    }
                    if (arr[1] == "3")
                    {
                        pack1.cloths3.push(temp);

                    }
                    if (arr[1] == "4")
                    {
                        pack1.cloths4.push(temp);

                    }
                }
                else if (arr[0] == "2")
                {
                    if (arr[1] == "1")
                    {
                        pack2.cloths1.push(temp);
                    }
                    if (arr[1] == "2")
                    {
                        pack2.cloths2.push(temp);

                    }
                    if (arr[1] == "3")
                    {
                        pack2.cloths3.push(temp);

                    }
                    if (arr[1] == "4")
                    {
                        pack2.cloths4.push(temp);
                    }
                }
                else if (arr[0] == "3")
                {
                    if (arr[1] == "1")
                    {
                        pack3.cloths1.push(temp);
                    }
                    if (arr[1] == "2")
                    {
                        pack3.cloths2.push(temp);

                    }
                    if (arr[1] == "3")
                    {
                        pack3.cloths3.push(temp);

                    }
                    if (arr[1] == "4")
                    {
                        pack3.cloths4.push(temp);
                    }
                }
                else if (arr[0] == "4")
                {
                    if (arr[1] == "1")
                    {
                        pack4.cloths1.push(temp);
                    }
                    if (arr[1] == "2")
                    {
                        pack4.cloths2.push(temp);

                    }
                    if (arr[1] == "3")
                    {
                        pack4.cloths3.push(temp);

                    }
                    if (arr[1] == "4")
                    {
                        pack4.cloths4.push(temp);
                    }
                }
            }
            GameDataController.ClothPackge1 = pack1;//七日签到
            GameDataController.ClothPackge2 = pack2;//抽屉特殊皮肤
            GameDataController.ClothPackge3 = pack3;//睡衣
            GameDataController.ClothPackge4 = pack4;//每日推荐

            GameDataController._clothData.set(temp.ID, temp);

            GameDataController.ClothDataAsy[temp.ID] = temp.Price == 0 ? 0 : 1;
        });

        let firstuse = Laya.LocalStorage.getItem("firstuse");//第一次初始化
        if (firstuse)
        {
            if (firstuse == "0")//非彩蛋版本 第一次添加
            {
                Laya.LocalStorage.setJSON("ClothData", GameDataController.ClothDataAsy);
                Laya.LocalStorage.setItem("firstuse", "1");
                // for (let i = 1; i < 7; i++) {
                //     GameDataController.BgdatapackSet(i,1);
                    
                // }
            }
            else
            {
                let Update = {};
                let oldClothData = Laya.LocalStorage.getJSON("ClothData");
                let newClothData = GameDataController.ClothDataAsy;
                for (let k in newClothData)
                {
                    let value = GameDataController.ClothDataRefresh[k];
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
                Laya.LocalStorage.setJSON("ClothData", Update);
            }
           
        }
        else
        {
            Laya.LocalStorage.setJSON("ClothData", GameDataController.ClothDataAsy);
            Laya.LocalStorage.setItem("firstuse", "1");
        }
        console.log("===========》");
        console.log("_ClothData", GameDataController._ClothData);
        GameDataController._ClothData.forEach((v) =>
        {
            if (v.GetPath1())
            {
                Laya.loader.load(v.GetPath1());
            }
        })
        EventMgr.notify("sgl1");
        
    }

    ClothJson = [
        {
            ID: "10000",
            Name: "基础上衣",
            Gender: "2",
            Type: "3",
            Position: "7,227.5,0",
            Label1: "Label_1:100",
            Label2: "Label_1:100",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "10000",
        }
        , {
            ID: "10001",
            Name: "基础裙子",
            Gender: "2",
            Type: "4",
            Position: "7,53,0",
            Label1: "Label_1:100",
            Label2: "Label_1:100",
            Sort1: "3",
            Sort2: "3",
            IconPath1: "10001",
        }
        , {
            ID: "10002",
            Name: "基础发型",
            Gender: "2",
            Type: "0",
            Position: "10.5,317.1,0",
            Label1: "Label_1:100",
            Label2: "Label_1:100",
            Sort1: "4",
            Sort2: "3",
            IconPath1: "11101",
        }
        , {
            ID: "13202",
            Name: "珍珠",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "7",
            Position: "13.8,263,0",
            Label1: "Label_1:4000",
            Label2: "Label_2:2000",
            Sort1: "6",
            Sort2: "2",
            IconPath1: "13202",
        }
        , {
            ID: "10101",
            Name: "阳光",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "0",
            Position: "17.8,315.1,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "7",
            Sort2: "2",
            Icon: "icon_10101",
            IconPath1: "10101",
        }
        , {
            ID: "10102",
            Name: "轻柔",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "3",
            Position: "19.6,192,0",
            Label1: "Label_1:2000",
            Label2: "Label_2:1000",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "10102",
        }
        , {
            ID: "10103",
            Name: "舒适",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "4",
            Position: "3.3,32.5,0",
            Label1: "Label_1:2000",
            Label2: "Label_2:1000",
            Sort1: "6",
            Sort2: "6",
            Icon: "10103_icon",
            IconPath1: "10103_1",
            IconPath2: "10103_2",
            Position2: "64.9,-33.4,0",
        }
        , {
            ID: "10104",
            Name: "黑丝",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "5",
            Position: "23,-220.7,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "2",
            Sort2: "2",
            IconPath1: "10104",
        }
        , {
            ID: "10105",
            Name: "可爱皮鞋",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "6",
            Position: "25.7,-359.6,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "10105",
        }
        , {
            ID: "10106",
            Name: "小圆帽",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "7",
            Position: "23,396,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "9",
            Sort2: "-20",
            IconPath1: "10106_1",
            IconPath2: "10106_2",
            Position2: "21.4,373.5,0",
        }
        , {
            ID: "10201",
            Name: "海风",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "7",
            Position: "3.4,-34.6,0",
            Label1: "Label_4:500",
            Label2: "Label_5:250",
            Sort1: "6",
            Sort2: "1",
            Icon: "10201_icon",
            IconPath1: "10201_1",
            IconPath2: "10201_2",
            Position2: "17.1,-49.4,0",
        }
        , {
            ID: "10202",
            Name: "诱惑",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "3",
            Position: "36.9,163.5,0",
            Label1: "Label_4:2000",
            Label2: "Label_5:1000",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "10202",
        }
        , {
            ID: "10203",
            Name: "轻纱",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "4",
            Position: "3.4,51.8,0",
            Label1: "Label_4:2000",
            Label2: "Label_5:1000",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "10203",
        }
        , {
            ID: "20101",
            Name: "布偶",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "1",
            Position: "15.1,113,0",
            Label1: "Label_1:6000",
            Label2: "Label_2:3000",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "20101",
        }
        , {
            ID: "20102",
            Name: "粉色",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "5",
            Position: "23.7,-288.4,0",
            Label1: "Label_1:800",
            Label2: "Label_2:400",
            Sort1: "2",
            Sort2: "2",
            IconPath1: "20102",
        }
        , {
            ID: "20103",
            Name: "红色皮鞋",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "6",
            Position: "30.1,-347.2,0",
            Label1: "Label_1:800",
            Label2: "Label_2:400",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "20103",
        }
        , {
            ID: "20201",
            Name: "青春",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "0",
            Position: "23.29,363.2,0",
            Label1: "Label_2:1000",
            Label2: "Label_1:500",
            Sort1: "3",
            Sort2: "2",
            Icon: "icon_20201",
            IconPath1: "20201",
        }
        , {
            ID: "20202",
            Name: "校服",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "3",
            Position: "7.6,152.5,0",
            Label1: "Label_2:2500",
            Label2: "Label_1:1250",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "20202",
        }
        , {
            ID: "20203",
            Name: "校服短裙",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "4",
            Position: "7.6,52,0",
            Label1: "Label_2:2500",
            Label2: "Label_1:1250",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "20203",
        }
        , {
            ID: "20204",
            Name: "黑色长袜",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "5",
            Position: "28.33,-278.5,0",
            Label1: "Label_2:800",
            Label2: "Label_1:400",
            Sort1: "2",
            Sort2: "2",
            IconPath1: "20204",
        }
        , {
            ID: "20205",
            Name: "小皮鞋",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "6",
            Position: "23,-365,0",
            Label1: "Label_2:800",
            Label2: "Label_1:400",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "20205",
        }
        , {
            ID: "30102",
            Name: "甜蜜",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_1_3",
            Type: "1",
            Position: "1.3,102.3,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Sort2: "1",
            Icon: "30102_icon",
            IconPath1: "30102_1",
            IconPath2: "30102_2",
            Position2: "59.4,105.5,0",
        }
        , {
            ID: "30103",
            Name: "粉色条纹",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_1_4",
            Type: "5",
            Position: "24.2,-243.3,0",
            Label1: "Label_1:1100",
            Label2: "Label_2:550",
            Sort1: "2",
            Sort2: "2",
            IconPath1: "30103",
        }
        , {
            ID: "30104",
            Name: "粉色皮鞋",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_1_5",
            Type: "6",
            Position: "24.1,-361.8,0",
            Label1: "Label_1:1100",
            Label2: "Label_2:550",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "30104",
        }
        , {
            ID: "30105",
            Name: "发卡",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_1_1",
            Type: "7",
            Position: "16.8,386.2,0",
            Label1: "Label_1:1500",
            Label2: "Label_2:750",
            Sort1: "8",
            Sort2: "2",
            IconPath1: "30105",
        }
        , {
            ID: "30201",
            Name: "清凉",
            Price: "0",
            Star: "1",
            Gender: "2",
            Type: "0",
            Position: "12.6,358.2,0",
            Label1: "Label_6:1500",
            Label2: "Label_1:750",
            Sort1: "3",
            Sort2: "2",
            Icon: "icon_30201",
            IconPath1: "30201",
        }
        , {
            ID: "30202",
            Name: "水手服",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "3",
            Position: "18.30,207.2,0",
            Label1: "Label_6:3000",
            Label2: "Label_1:1500",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "30202",
        }
        , {
            ID: "30203",
            Name: "水手裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "4",
            Position: "6.4,63.2,0",
            Label1: "Label_6:3000",
            Label2: "Label_1:1500",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "30203",
        }
        , {
            ID: "30205",
            Name: "海边",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "6",
            Position: "20.9,-362.5,0",
            Label1: "Label_6:1100",
            Label2: "Label_1:550",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "30205",
        }
        , {
            ID: "40101",
            Name: "披肩长发",
            Price: "1",
            Star: "1",
            Gender: "2",
            Type: "0",
            Position: "15.6,351,0",
            Label1: "Label_3:2000",
            Label2: "Label_5:1000",
            Sort1: "3",
            Sort2: "1",
            Icon: "icon_40101",
            IconPath1: "40101_1",
            IconPath2: "40101_2",
            Position2: "33.32,179.5,0",
        }
        , {
            ID: "40102",
            Name: "公主",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "1",
            Position: "24.3,15.5,0",
            Label1: "Label_3:8000",
            Label2: "Label_5:4000",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "40102",
        }
        , {
            ID: "40104",
            Name: "高跟鞋",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "6",
            Position: "46.7,-329.8,0",
            Label1: "Label_3:1300",
            Label2: "Label_5:650",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "40104",
        }
        , {
            ID: "40105",
            Name: "诱惑",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "7",
            Position: "51.5,415.2,0",
            Label1: "Label_3:2000",
            Label2: "Label_5:1000",
            Sort1: "8",
            Sort2: "5",
            IconPath1: "40105_1",
            IconPath2: "40105_2",
            Position2: "31.5,285.4,0",
        }
        , {
            ID: "40201",
            Name: "成熟",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_1_2",
            Type: "0",
            Position: "21.4,345.06,0",
            Label1: "Label_4:2000",
            Label2: "Label_2:1000",
            Sort1: "3",
            Sort2: "2",
            Icon: "icon_40201",
            IconPath1: "40201",
        }
        , {
            ID: "40202",
            Name: "端庄",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "3",
            Position: "3.4,151.5,0",
            Label1: "Label_4:3500",
            Label2: "Label_2:1750",
            Sort1: "4",
            Sort2: "1",
            Icon: "40202_icon",
            IconPath1: "40202_1",
            IconPath2: "40202_2",
            Position2: "17.1,262,0",
        }
        , {
            ID: "40203",
            Name: "性感",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "4",
            Position: "17.10,-89.6,0",
            Label1: "Label_4:3500",
            Label2: "Label_2:1750",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "40203",
        }
        , {
            ID: "40204",
            Name: "稳重",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "6",
            Position: "23.9,-355.5,0",
            Label1: "Label_4:1300",
            Label2: "Label_2:650",
            Sort1: "5",
            Sort2: "2",
            IconPath1: "40204",
        }
        , {
            ID: "50101",
            Name: "紫色",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "0",
            Position: "9.8,340.6,0",
            Label1: "Label_1:2500",
            Label2: "Label_5:1250",
            Sort1: "3",
            Sort2: "2",
            Icon: "icon_50101",
            IconPath1: "50101",
        }
        , {
            ID: "50102",
            Name: "女仆",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "1",
            Position: "12.2,105.95,0",
            Label1: "Label_1:9000",
            Label2: "Label_5:4500",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "50102",
        }
        , {
            ID: "50103",
            Name: "碎边袜",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "5",
            Position: "23.8,-307.3,0",
            Label1: "Label_1:1600",
            Label2: "Label_5:800",
            Sort1: "2",
            Sort2: "2",
            IconPath1: "50103",
        }
        , {
            ID: "50104",
            Name: "紫色皮鞋",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "6",
            Position: "24.2,-362.4,0",
            Label1: "Label_1:1300",
            Label2: "Label_5:650",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "50104",
        }
        , {
            ID: "50201",
            Name: "天真",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "0",
            Position: "7.4,317.5,0",
            Label1: "Label_3:2500",
            Label2: "Label_2:1250",
            Sort1: "5",
            Sort2: "2",
            Icon: "icon_50201",
            IconPath1: "50201",
        }
        , {
            ID: "50202",
            Name: "公主裙2",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "1",
            Position: "8.2,73.46,0",
            Label1: "Label_3:9000",
            Label2: "Label_2:4500",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "50202",
        }
        , {
            ID: "50203",
            Name: "优雅",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "6",
            Position: "27.1,-324.9,0",
            Label1: "Label_3:1300",
            Label2: "Label_2:650",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "50203",
        }
        , {
            ID: "50204",
            Name: "花帽",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "7",
            Position: "32.4,368.3,0",
            Label1: "Label_3:2500",
            Label2: "Label_2:1250",
            Sort1: "8",
            Sort2: "2",
            IconPath1: "50204",
        }
        // , {
        //     ID: "10301",
        //     Name: "飘逸",
        //     Price: "1",
        //     Star: "3",
        //     Gender: "2",
        //     Type: "0",
        //     Type2:"4_1_1",
        //     Position: "17.1,354,0",
        //     Label1: "Label_4:2500",
        //     Label2: "Label_3:1250",
        //     Sort1: "4",
        //     Sort2: "1",
        //     Icon: "icon_10301",
        //     IconPath1: "10301_1",
        //     IconPath2: "10301_2",
        //     Position2: "47.2,182.2,0",
        // }
        // , {
        //     ID: "10303",
        //     Name: "红色诱惑",
        //     Price: "1",
        //     Star: "3",
        //     Gender: "2",
        //     Type: "3",
        //     Type2:"4_1_2",
        //     Position: "23,144.5,0",
        //     Label1: "Label_4:4000",
        //     Label2: "Label_3:2000",
        //     Sort1: "3",
        //     Sort2: "1",
        //     IconPath1: "10303_1",
        //     IconPath2: "10303_2",
        //     Position2: "-15.8,-39,0",
        // }
        // , {
        //     ID: "10304",
        //     Name: "红色性感",
        //     Price: "1",
        //     Star: "3",
        //     Gender: "2",
        //     Type: "4",
        //     Type2:"4_1_3",
        //     Position: "27.4,-132.1,0",
        //     Label1: "Label_4:4000",
        //     Label2: "Label_3:2000",
        //     Sort1: "4",
        //     Sort2: "1",
        //     Icon: "10304_icon",
        //     IconPath1: "10304_1",
        //     IconPath2: "10304_2",
        //     Position2: "26.4,-115,0",
        // }
        // , {
        //     ID: "10305",
        //     Name: "红色皮鞋",
        //     Price: "1",
        //     Star: "3",
        //     Gender: "2",
        //     Type: "6",
        //     Type2:"4_1_4",
        //     Position: "13.8,-373.6,0",
        //     Label1: "Label_4:1300",
        //     Label2: "Label_3:650",
        //     Sort1: "7",
        //     Sort2: "2",
        //     Icon: "10305_icon",
        //     IconPath1: "10305_1",
        // }
        , {
            ID: "10401",
            Name: "灰白",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "4",
            Type2: "1_1_2",
            Type: "0",
            Position: "23.29,363.2,0",
            Label1: "Label_3:1500",
            Label2: "Label_5:750",
            Sort1: "3",
            Sort2: "2",
            Icon: "icon_10401",
            IconPath1: "10301",
        }
        , {
            ID: "10402",
            Name: "可爱连衣裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "4",
            Type2: "1_1_3",
            Type: "1",
            Position: "7.7,87.5,0",
            Label1: "Label_3:3000",
            Label2: "Label_5:1500",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "10302",
        }
        , {
            ID: "10403",
            Name: "大白兔",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "4",
            Type2: "1_1_4",
            Type: "6",
            Position: "23.29,-370,0",
            Label1: "Label_3:3000",
            Label2: "Label_5:1500",
            Sort1: "5",
            Sort2: "2",
            IconPath1: "10303",
        }
        , {
            ID: "10405",
            Name: "发卡",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "4",
            Type2: "1_1_1",
            Type: "7",
            Position: "15.1,393.2,0",
            Label1: "Label_3:1300",
            Label2: "Label_5:650",
            Sort1: "8",
            Sort2: "2",
            IconPath1: "10305",
        }
        , {
            ID: "20301",
            Name: "海军制服",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "3",
            Position: "7.98,166,0",
            Label1: "Label_2:2500",
            Label2: "Label_3:1250",
            Sort1: "4",
            Sort2: "1",
            IconPath1: "20301",
            Position2: "17.1,262,0",
        }
        , {
            ID: "20302",
            Name: "海军下装",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "4",
            Position: "5.7,56.6,0",
            Label1: "Label_2:2500",
            Label2: "Label_3:1250",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "20302",
        }
        , {
            ID: "20303",
            Name: "海皮鞋",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "6",
            Position: "21.40,-216,0",
            Label1: "Label_2:1200",
            Label2: "Label_3:600",
            Sort1: "3",
            Sort2: "2",
            IconPath1: "20303",
        }
        , {
            ID: "20304",
            Name: "军帽",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "7",
            Position: "13.8,404.4,0",
            Label1: "Label_2:3000",
            Label2: "Label_3:1500",
            Sort1: "7",
            Sort2: "2",
            IconPath1: "20304",
        }
        , {
            ID: "30301",
            Name: "麻花辫",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "0",
            Position: "26.93,351.5,0",
            Label1: "Label_3:1500",
            Label2: "Label_5:750",
            Sort1: "3",
            Sort2: "1",
            Icon: "30301_icon",
            IconPath1: "30301_1",
            IconPath2: "30301_2",
            Position2: "97,260,0",
        }
        , {
            ID: "30302",
            Name: "披肩斗篷",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "3",
            Position: "18.1,143,0",
            Label1: "Label_3:3000",
            Label2: "Label_5:1500",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "30302",
        }
        , {
            ID: "30303",
            Name: "武士服",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "4",
            Position: "6.6,41,0",
            Label1: "Label_3:3000",
            Label2: "Label_5:1500",
            Sort1: "5",
            Sort2: "2",
            IconPath1: "30303",
        }
        , {
            ID: "30304",
            Name: "黑丝",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "5",
            Position: "23.30,-199.83,0",
            Label1: "Label_3:1300",
            Label2: "Label_5:650",
            Sort1: "2",
            Sort2: "2",
            IconPath1: "30305",
        }
        , {
            ID: "30305",
            Name: "重甲",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "6",
            Position: "26.8,-286.8,0",
            Label1: "Label_3:1300",
            Label2: "Label_5:650",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "30306",
        }
        , {
            ID: "40301",
            Name: "灵逸",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "6",
            Type2: "2_2_2",
            Type: "0",
            Position: "10.5,308,0",
            Label1: "Label_1:2000",
            Label2: "Label_5:1000",
            Sort1: "3",
            Sort2: "1",
            Icon: "40301_icon",
            IconPath1: "40301_1",
            IconPath2: "40301_2",
            Position2: "11.5,222,0",
        }
        , {
            ID: "40302",
            Name: "彩带上衣",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "6",
            Type2: "2_2_3",
            Type: "3",
            Position: "35.3,110.5,0",
            Label1: "Label_1:3500",
            Label2: "Label_5:1750",
            Sort1: "4",
            IconPath1: "40302",
        }
        , {
            ID: "40303",
            Name: "碎边红裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "6",
            Type2: "2_2_4",
            Type: "4",
            Position: "0,7,0",
            Label1: "Label_1:3500",
            Label2: "Label_5:1750",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "40303",
        }
        , {
            ID: "40304",
            Name: "可爱筒袜",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "6",
            Type2: "2_2_5",
            Type: "5",
            Position: "25.4,-293.5,0",
            Label1: "Label_1:1300",
            Label2: "Label_5:650",
            Sort1: "2",
            Sort2: "2",
            IconPath1: "40304",
        }
        , {
            ID: "40305",
            Name: "铮亮",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "6",
            Type2: "2_2_6",
            Type: "6",
            Position: "23.29,-367,0",
            Label1: "Label_1:1300",
            Label2: "Label_5:650",
            Sort1: "5",
            Sort2: "2",
            IconPath1: "40305",
        }
        , {
            ID: "40306",
            Name: "蝴蝶",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "6",
            Type2: "2_2_1",
            Type: "7",
            Position: "37.5,395.2,0",
            Label1: "Label_1:5000",
            Label2: "Label_5:2500",
            Sort1: "1",
            Sort2: "2",
            IconPath1: "40306",
        }
        , {
            ID: "50301",
            Name: "温柔",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "0",
            Position: "10.5,358,0",
            Label1: "Label_2:2500",
            Label2: "Label_5:1250",
            Sort1: "3",
            Sort2: "2",
            Icon: "50301_icon",
            IconPath1: "50301",
        }
        , {
            ID: "50302",
            Name: "和服",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "1",
            Position: "70.9,53.2,0",
            Label1: "Label_2:9000",
            Label2: "Label_5:4500",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "50302",
        }
        , {
            ID: "50303",
            Name: "木屐",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "6",
            Position: "37.5,-335.1,0",
            Label1: "Label_2:1300",
            Label2: "Label_5:650",
            Sort1: "-9",
            Sort2: "4",
            IconPath1: "50303_1",
            IconPath2: "50303_2",
            Position2: "37.5,-335.1,0",
        }
        , {
            ID: "50304",
            Name: "向阳花",
            Price: "1",
            Star: "2",
            Gender: "2",
            Type: "7",
            Position: "-30.3,340.3,0",
            Label1: "Label_2:2500",
            Label2: "Label_5:1250",
            Sort1: "7",
            Sort2: "2",
            IconPath1: "50304",
         },
        {
            ID: "50404",
            Name: "翅膀",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "7",
            Position: "15.0,226.0,0",
            Label1: "Label_2:3000",
            Label2: "Label_3:1500",
            Sort1: "-9",
            IconPath1: "50404",
        },
        {
            ID: "60101",
            Name: "睡衣头发",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "3_1_1",
            Type: "0",
            Position: "28.0,331.0,0",
            Label1: "Label_4:2000",
            Label2: "Label_2:1000",
            Sort1: "3",
            Sort2: "2",
            Icon: "icon_60101",
            IconPath1: "60101",
        },
        {
            ID: "60102",
            Name: "睡衣裙子",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "3_1_2",
            Type: "1",
            Position: "17.0,62.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Sort2: "1",
            Icon: "60102_icon",
            IconPath1: "60102",
        },
        {
            ID: "60103",
            Name: "睡衣拖鞋",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "3_1_3",
            Type: "6",
            Position: "23.0,-366.0,0",
            Label1: "Label_1:1100",
            Label2: "Label_2:550",
            Sort1: "4",
            Sort2: "2",
            IconPath1: "60103",  
        },
        {
            ID: "70101",
            Name: "淡黄裙子",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "1",
            Position: "11.0,123.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Icon: "70101_icon",
            IconPath1: "70101",
        },
        {
            ID: "70102",
            Name: "皮短裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "4",
            Position: "6.0,62.0,0",
            Label1: "Label_6:3000",
            Label2: "Label_1:1500",
            Sort1: "3",
            IconPath1: "70102",
        },
        {
            ID: "70103",
            Name: "修身诱惑",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "1",
            Position: "5.0,127.0,0",
            Label1: "Label_1:2000",
            Label2: "Label_2:1000",
            Sort1: "3",
            IconPath1: "70103",
        },
        {
            ID: "70104",
            Name: "亚麻短裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "4",
            Position: "4.0,39.0,0",
            Label1: "Label_6:3000",
            Label2: "Label_1:1500",
            Sort1: "2",
            IconPath1: "70104",
        },
        {
            ID: "70105",
            Name: "民国上衣",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "3",
            Position: "26.0,150.0,0",
            Label1: "Label_1:2000",
            Label2: "Label_2:1000",
            Sort1: "4",
            Sort2: "1",
            IconPath1: "70105",
        },
        {
            ID: "70106",
            Name: "青花瓷长裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "1",
            Position: "8.0,114.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Icon: "70106_icon",
            IconPath1: "70106",
        },
        {
            ID: "70107",
            Name: "丝瓜长裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "1",
            Position: "8.0,143.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Icon: "70107_icon",
            IconPath1: "70107",
        },
        {
            ID: "70108",
            Name: "情趣",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "3",
            Position: "5.0,224.0,0",
            Label1: "Label_1:2000",
            Label2: "Label_2:1000",
            Sort1: "3",
            IconPath1: "70108",
        },
        {
            ID: "70109",
            Name: "薰衣草",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "0",
            Position: "37.0,327.1,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "7",
            Icon: "icon_70109",
            IconPath1: "70109",
        },
        {
            ID: "70110",
            Name: "淡粉红",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "0",
            Position: "18.0,344.1,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "7",
            Sort2: "2",
            Icon: "icon_70110",
            IconPath1: "70110",
        },
        {
            ID: "70111",
            Name: "青春韩版",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "3",
            Position: "18.0,210.0,0",
            Label1: "Label_1:2000",
            Label2: "Label_2:1000",
            Sort1: "3",
            IconPath1: "70111",
        }, 
        {
            ID: "40401",
            Name: "罗丽叶发型",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "0",
            Position: "30.0,354.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Icon: "40401_icon",
            IconPath1: "40401",
        },
        {
            ID: "40402",
            Name: "罗丽叶裙子",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "1",
            Position: "15.0,101.0,0",
            Position2: "24.1,-2.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Sort2:"1",
            Icon: "40402_icon",
            IconPath1: "40402_1",
            IconPath2: "40402_2",
        },
        {
            ID: "40403",
            Name: "罗丽叶鞋子",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "6",
            Position: "24.1,-359.0,0",
            Label1: "Label_1:1100",
            Sort1: "4",
            IconPath1: "40403",
        },
        {
            ID: "40501",
            Name: "婚纱头发",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_3_1",
            Type: "0",
            Position: "31.0,329.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Icon: "40501_icon",
            IconPath1: "40501",
        },
        {
            ID: "40502",
            Name: "婚纱裙子",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_3_2",
            Type: "1",
            Position: "91.0,-77.0,0",
            Label1: "Label_1:7000",
            Sort1: "9",
            Icon: "40502_icon",
            IconPath1: "40502",
        },
        {
            ID: "40503",
            Name: "婚纱头饰",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "7",
            Type2: "2_3_3",
            Position: "41.0,123.0,0",
            Label1: "Label_3:2000",
            Label2: "Label_5:1000",
            Sort1: "8",
            Sort2: "5",
            IconPath1: "40503_1",
            IconPath2: "40503_2",
            Position2: "24.0,390.0,0",
        },
        {
            ID: "40504",
            Name: "婚纱鞋子",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type2: "2_3_4",
            Type: "6",
            Position: "25.1,-350.0,0",
            Label1: "Label_1:1100",
            Sort1: "2",
            IconPath1: "40504",
        },
        {
            ID: "40601",
            Name: "白雪公主发型",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "0", 
            Position: "14.0,343.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Icon: "40601_icon",
            IconPath1: "40601",
        },
        {
            ID: "40602",
            Name: "白雪公主裙子",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "1",
            Position: "9.0,156.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "4",
            Icon: "40602_icon",
            IconPath1: "40602",
        },
        {
            ID: "40603",
            Name: "白雪公主长袜",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "5",
            Position: "22,-208.0,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "2",
            IconPath1: "40603",
        },
        {
            ID: "40604",
            Name: "白雪公主鞋子",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "6",
            Position: "23.0,-359.0,0",
            Label1: "Label_1:500",
            Label2: "Label_2:250",
            Sort1: "4",
            IconPath1: "40604",
        },
        {
            ID: "40605",
            Name: "粉红魔杖",
            Price: "1",
            Star: "3",
            Gender: "2",
            Type: "7",
            Position: "-11.0,170.0,0",
            Label1: "Label_1:4000",
            Label2: "Label_2:2000",
            Sort1: "-6",
            IconPath1: "40605",
        },
        {
            ID: "70202",
            Name: "泳衣",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "1",
            Position: "6.0,135.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "5",
            Icon: "70202_icon",
            IconPath1: "70202",
        },
        {
            ID: "70201",
            Name: "汉服长裙",
            Price: "1",
            Star: "3",
            Gender: "2",
            num: "5",
            Type: "1",
            Position: "26.0,-31.0,0",
            Label1: "Label_1:7000",
            Label2: "Label_2:3500",
            Sort1: "5",
            Icon: "70201_icon",
            IconPath1: "70201",
        },  
    ]
}

