import ADManager from "../../Admanager";
import { Core, OpenType, TweenMgr, UIBase, UIMgr } from "../../Frame/Core";
import RecordManager from "../../RecordManager";
import ClothData from "../ClothData";
import GameDataController from "../GameDataController";
import BagListController from "./Bag/BagListController";
import { Tools } from "./Tools";

export default class UISpinning extends UIBase
{
    arr = [];
    data: ClothData;
    Datas:ClothData[];//嫦娥
    str={};

    _openType = OpenType.Attach;


    /****************/
    Prop1: Laya.Box;
    Prop2: Laya.Box;
    Prop3: Laya.Box;
    Prop4: Laya.Box;

    Prop1Pos: number[] = [95, 526];
    Prop2Pos: number[] = [248, 376];
    Prop3Pos: number[] = [439, 385];
    Prop4Pos: number[] = [625, 431];
    TargetPos: number[] = [372, 772];

    prop1tween: Core.Tween.Tweener;
    prop2tween: Core.Tween.Tweener;
    prop3tween: Core.Tween.Tweener;
    prop4tween: Core.Tween.Tweener;

    MakeBtn: Laya.Image;
    BackBtn:Laya.Image;

    onInit()
    {
        this.Prop1 = this.vars("Prop1");
        this.Prop2 = this.vars("Prop2");
        this.Prop3 = this.vars("Prop3");
        this.Prop4 = this.vars("Prop4");

        this.MakeBtn = this.vars("MakeBtn");
        this.BackBtn=this.vars("BackBtn");
        //制作按钮
        this.btnEv("MakeBtn", () =>
        {
            ADManager.ShowReward(() =>
            {
                this.FirstStageShow();
            })
        })
        this.btnEv("BackBtn",()=>{
            this.hide();
        })

        this.btnEv("Prop1", () =>
        {
            this.Prop1Click();
        });
        this.btnEv("Prop2", () =>
        {
            this.Prop2Click();
        });
        this.btnEv("Prop3", () =>
        {
            this.Prop3Click();
        });
        this.btnEv("Prop4", () =>
        {
            this.Prop4Click();
        });


        this.FirstStageInit();
        this.SecondStageInit();
    }
    //气泡品类  
    //1 4 免费   2 3 看广告领取
    //合成数量  任何一个都可以合唱
    //气泡1点击

    //合成内容  按权重  普通 1分  特殊2分   3分以及3分以上可以升级为嫦娥  3分以下可以升级为其他未解锁
    ClickNum: number = 0;
    Prop1Click()
    {
        this.ClickNum += 1;
        this.Prop1Move();
    }
    //气泡2点击
    Prop2Click()
    {
        ADManager.ShowReward(() =>
        {
            this.ClickNum += 2;
            this.Prop2Move();
        });
    }
    //气泡3点击
    Prop3Click()
    {
        ADManager.ShowReward(() =>
        {
            this.ClickNum += 2;
            this.Prop3Move();
        })
    }
    //气泡4点击
    Prop4Click()
    {
        this.ClickNum += 1;
        this.Prop4Move();
    }

    Prop1Move()
    {
        Laya.Tween.to(this.Prop1, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this,
            () =>
            {
                Laya.Tween.to(this.Prop1, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);
            })
        );
    }
    Prop2Move()
    {
        Laya.Tween.to(this.Prop2, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this,
            () =>
            {
                Laya.Tween.to(this.Prop2, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);

            })
        );
    }
    Prop3Move()
    {
        Laya.Tween.to(this.Prop3, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this,
            () =>
            {
                Laya.Tween.to(this.Prop3, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);
            })
        );
    }
    Prop4Move()
    {
        Laya.Tween.to(this.Prop4, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this,
            () =>
            {
                Laya.Tween.to(this.Prop4, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);
            })
        );
    }


    onShow()
    {

        this.FirstStage.visible = false;
        this.SecondStage.visible = false;
        this.PropReceive();


    }

    PropReceive()
    {


        this.Prop1.pos(this.Prop1Pos[0], this.Prop1Pos[1]);
        this.Prop1.scale(1, 1);

        this.Prop2.pos(this.Prop2Pos[0], this.Prop2Pos[1]);
        this.Prop2.scale(1, 1);

        this.Prop3.pos(this.Prop3Pos[0], this.Prop3Pos[1]);
        this.Prop3.scale(1, 1);

        this.Prop4.pos(this.Prop4Pos[0], this.Prop4Pos[1]);
        this.Prop4.scale(1, 1);


    }




    FirstStage: Laya.Image;
    FirstIcon: Laya.Image;
    FirstADBtn: Laya.Image;
    FirstCloseBtn: Laya.Image;

    //第一界面初始化
    FirstStageInit()
    {
        this.FirstIcon = this.vars("FirstIcon");
        this.FirstADBtn = this.vars("FirstADBtn");
        this.FirstStage = this.vars("FirstStage");
        this.FirstCloseBtn = this.vars("FirstCloseBtn");

        this.btnEv("FirstADBtn", () =>
        {
            this.FirstADClick();
        })
        this.btnEv("FirstCloseBtn", () =>
        {
            this.FirstCloseClick();
        })
    }

    FirstID: number;
    //第一界面展示
    FirstStageShow()
    {
        console.log("第一礼品展示");
        this.FirstStage.visible = true;
        this.FirstCloseBtn.visible = false;
        Laya.timer.once(2000, this, () =>
        {
            this.FirstCloseBtn.visible = true;
        })
        this.FirstStage.alpha = 0;
        Laya.Tween.to(this.FirstStage, { alpha: 1 }, 1000);



        
        let arr=GameDataController.Get_All_UnLock_Cloth();
        let t=Tools.arrayRandomGetOut(arr,1);
        let cloth:ClothData=GameDataController._clothData.get(parseInt(t));
        this.data=cloth;
        //第一套皮肤 随机选择 非嫦娥
        this.FirstID = 1234798;
        this.FirstIcon.skin = cloth.GetPath1();
    }
    //第一界面广告按钮
    FirstADClick()
    {
        ADManager.ShowReward(() =>
        {
            this.SecondStageShow();
            this.FirstClothGet();
        })
    }
    //第一界面退出按钮
    FirstCloseClick()
    {
        this.FirstClothGet();
        this.hide();
    }
    //获取第一界面皮肤  
    FirstClothGet()
    {
        let dataall=GameDataController.ClothDataRefresh;
        dataall[this.data.ID]=0;
        GameDataController.ClothDataRefresh=dataall;
        BagListController.Instance.showList();
        BagListController.Instance.refresh();
        UIMgr.tip("成功解一件新的装扮!");
    }


    SecondStage: Laya.Image;
    SecondIcon: Laya.Image;
    SecondADBtn: Laya.Image;
    SecondCloseBtn: Laya.Image;
    ShareBtn: Laya.Image;
    SecondID: number = 0;


    //第二界面初始化
    SecondStageInit()
    {
        this.SecondIcon = this.vars("SecondIcon");
        this.SecondADBtn = this.vars("SecondADBtn");
        this.SecondStage = this.vars("SecondStage");
        this.ShareBtn = this.vars("ShareBtn");
        this.SecondCloseBtn = this.vars("SecondCloseBtn");
        this.btnEv("SecondADBtn", () =>
        {
            this.SecondADClick();
        });
        this.btnEv("SecondCloseBtn", () =>
        {
            this.SecondCloseClick();
        });
        this.btnEv("ShareBtn", () =>
        {
            this.Share();
        });
    }

    Refresh()
    {
        this.Datas.forEach((v,i)=>{
            let nv = GameDataController.ClothDataRefresh[this.Datas[i].ID]
            this.str[this.Datas[i].ID] = nv;
        })
    }

    //第二界面展示
    SecondStageShow()   
    {
        console.log("第二礼品展示");
        console.log("积分", this.ClickNum >= 3 ? "嫦娥头发" : "普通视频皮肤")
        this.ShareBtn.visible = false;
        this.SecondCloseBtn.visible = false;
        Laya.timer.once(2000, this, () =>
        {
            this.SecondCloseBtn.visible = true;
        })
        this.SecondID = 1234789;
        //升级界面展示
        this.SecondStage.visible = true;
        this.SecondStage.alpha = 0;
        Laya.Tween.to(this.SecondStage, { alpha: 1 }, 1000);

        let skinPath = "";

        //换Icon 
        if (this.ClickNum >= 5&&GameDataController.ClothDataRefresh[71002]==1)
        {
              //给嫦娥衣服   71001
            this.Datas=GameDataController.ClothPackge3.cloths1;
            this.Refresh();
            let cloth:ClothData=this.Datas[1];
            this.data=cloth;
            skinPath =cloth.GetPath1();
        }
        else
        {
            //随机给升级套装
            let arr=GameDataController.Get_All_UnLock_Cloth();
            let t=Tools.arrayRandomGetOut(arr,1);
            let cloth:ClothData=GameDataController._clothData.get(parseInt(t));
            this.data=cloth;
            skinPath = cloth.GetPath1();
        }
        this.SecondIcon.skin = skinPath;

    }

    //第二界面看广告
    SecondADClick()
    {
        //获取衣服
        ADManager.ShowReward(() =>
        {
            let dataall=GameDataController.ClothDataRefresh;
            dataall[this.data.ID]=0;
            GameDataController.ClothDataRefresh=dataall;
            this.Refresh();
            Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
            BagListController.Instance.refresh();
            UIMgr.tip("成功解一件新的装扮!");
            this.ShareBtn.visible = true;
        })
    }
    //第二界面关闭
    SecondCloseClick()
    {
        this.hide();
    }

    Share()
    {
        RecordManager.stopAutoRecord
        RecordManager._share(() =>
        {
            UIMgr.tip("视频分享成功！");
        },()=>{
            UIMgr.tip("视频分享失败...");
        });
    }
}