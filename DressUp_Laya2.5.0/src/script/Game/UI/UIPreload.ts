import { UIBase, OpenType, GameMgr, Core, EventMgr, DataMgr, UIMgr, TweenMgr } from "../../Frame/Core";
import { GameEvent, Formula } from "../Formula";
import ADManager, { TaT } from "../../Admanager";
import ConfigData from "../ConfigData";
import ProgressBar from "./ProgressBar";
import ZJADMgr from "../../ZJADMgr";
import GameDataController from "../GameDataController";
import { Task } from "./UITask";



export default class UIPreload extends UIBase
{
    
    _openType = OpenType.Once;
    _fadeIn = false;

    prg: Core.UI.ProgressBar;
    loading:Laya.Image;
    // constructor()
    // {
    //     super();
    //     Laya.loader.load(["loading/progressBar.png", "loading/progressBar$bar.png"], Laya.Handler.create(this, this.onLoadComplete));
    // }
    // //场景加载
    // NewScene3D: Laya.Scene3D;
    // //加载的主文件夹
    // static resRootPath = "res3d/p2/LayaScene_SampleScene/Conventional/"
    // //加载的资源列表
    // static resList1 = [

    // ]
    // static resRootPath2 = "res3d/p1/LayaScene_SampleScene/Conventional/"
    // //加载的资源列表
    // static resList2 = [

    // ]
    // //加载的总进度
    // AllLength: number = 0;


    // //加载Load1 资源创建
    // Load1(callback: Function)
    // {
    //     let self = this;
    //     let list = [];
    //     for (let item of UIPreload.resList1)
    //     {
    //         //存放所有的资源目录
    //         list.push(UIPreload.resRootPath + item + ".lh")
    //     }
    //     for (let item of UIPreload.resList2)
    //     {
    //         //存放所有的资源目录
    //         list.push(UIPreload.resRootPath2 + item + ".lh")
    //     }
    //     for (let item of list)
    //     {
    //         console.log("load -> " + item);
    //     }
    //     let onCpl = Laya.Handler.create(null, (res) =>
    //     {
    //         //成功回调
    //         console.log("load res=", res);
    //         if (callback != null) callback();
    //     })
    //     let progress = Laya.Handler.create(null, (value) =>
    //     {
    //         //进度条变化
    //         self.prg.setValue(value);
    //     })
    //     Laya.loader.create(list, onCpl, progress);
    // }
    // //加载Load2 资源获取
    // Load2(scene: Laya.Scene3D)
    // {
    //     console.log("Scene资源", scene);
    //     Laya.stage.getChildAt(0).destroy();
    //     Laya.stage.addChildAt(scene, 0);
    //     for (let item of UIPreload.resList1)
    //     {
    //         let a = Laya.loader.getRes(UIPreload.resRootPath + item + ".lh");
    //         //向场景中添加资源
    //         scene.addChild(a);
    //     }
    //     for (let item of UIPreload.resList2)
    //     {
    //         let a = Laya.loader.getRes(UIPreload.resRootPath2 + item + ".lh");
    //         //向场景中添加资源
    //         scene.addChild(a);
    //     }
    //     GameMgr.fsm.to("Game_Ready", 0);
    //     console.log(scene);
    // }

    // onLoadComplete()
    // {
    //     this.prg = new Laya.ProgressBar("loading/progressBar.png");
    //     Laya.timer.loop(100,this,this.onValueChange);
    // }

    StartLoading()
    {



    }
    onInit()
    { 
        new ZJADMgr();

        TJ.API.TA.log = true;
        Task.init();
        
        ADManager.TAPoint(TaT.PageEnter,"UIPreload");
        let cfg = new ConfigData();
        this.loading=this.vars("loading") as Laya.Image;
        //this.prg=this.vars("Prg")as Core.UI.ProgressBar;
        Laya.timer.loop(10,this,this.onValueChange);

        setTimeout(() =>
        {

            console.log("开始加载资源延迟5s");
            Laya.loader.create("Prefab/CoinPref.prefab")
            //cfg.LoadXml();
            cfg.LoadJson();

        }, 500);
        let callBack = () =>
        {
            GameMgr.fsm.to("Game_Ready", 0);
            ADManager.TAPoint(TaT.PageLeave,"UIPreload");
        }
        EventMgr.reg("sgl1", this, callBack);

        //初始化进度条 
        //this.prg = this.initPrg("Prg")

        //
        // //确定资源大小
        // //this.AllLength = UIPreload.resList1.length;
        // /*加载3D场景 
        // 因为作为预设加载时，光，相机有时会出现与Untiy观察不一致的状态，
        // 因此预先加载一个包含相机灯光的空场景*/
        // console.log("开始加载资源");


    }

    onValueChange()
    {
        if(this.loading.width>=443)
        {
            this.loading.width=443;
        }
        this.loading.width+=2;
    }
    onShow()
    {
        EventMgr.reg(GameEvent.preloadStep, this, this.onLoadStep);
        EventMgr.reg(GameEvent.preloadCpl, this, this.onLoadCpl);
        GameMgr.readyAll();

    }

    onHide()
    {
        EventMgr.offCaller(this);
    }

    onLoadStep(value)
    {
        //this.prg.addValue(value);
    }

    onLoadCpl()
    {
        ADManager.initShare();
    }





   


}