////import { TJ } from "../../TJ";


export enum GameEvent {
    //-------------------internal---------------------
    preloadStep = "preloadStep",
    preloadCpl = "preloadCpl",
    pause = "pause",
    energyTick = "energyTick",

    showGRVTime = "showGRVTime",
    hideGRVTime = "hideGRVTime",
    //-------------------debug---------------------
    debugExeCmd = "debugExeCmd",
    debugBtn1 = "debugBtn1",
    debugBtn2 = "debugBtn2",
    debugBtn3 = "debugBtn3",
    debugBtn4 = "debugBtn4",
    //-------------------custom---------------------
    save = "save",
    renderNext = "renderNext",
    changeSkin = "changeSkin",
}

export class Formula {
    static debug = false;
    static version = "";
    static _lang: string;
    static get lang() {
        if(!Formula._lang){
            Formula._lang = "cn";
            if(navigator){
                let lt = navigator.language;
                if(lt == "zh-tw" || lt == "zh-hk"){
                    Formula._lang = "td";
                }else if(lt.indexOf("en") > 0){
                    Formula._lang = "en";
                }
            }
        }
        return Formula._lang;
    }
    static showGRV = false;

    static subPkgInfo = [
        {name: "sp1", root: "res3d/p1/"},
        {name: "sp2", root: "res3d/p2/"},
    ];
    static get isSubPkg(){
        return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt && Formula.subPkgInfo.length > 0;
    }

    static get banPromo(){
        return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt || TJ.Engine.RuntimeInfo.platform==TJ.Define.Platform.Android;
    }

    static get onTT(){
        return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt;
    }

    static get onWx(){
        return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt;
    }

    static _soundsPath = "res/sounds/";
    static getSoundPath(name: string, type: number){
        let suffix;
        if(type == 1){
            suffix = TJ.Engine.RuntimeInfo.platform==TJ.Define.Platform.Android ? ".wav" : ".wav";
        }else{
            suffix = ".mp3";
        }
        this.debug && (suffix = ".mp3");
        return Formula._soundsPath + name + suffix;
    }
    
    static fstPlay: boolean;

    static playerLocalKeys = {
        //-------------------internal---------------------
        gameId:  0.0,//TJ.API.AppInfo.AppGuid(),
        version: 1.0,//TJ.API.AppInfo.VersionName(),
        sound: 1,
        signTimes: 0,
        lastSignTs: 0,
        energy: () => { return Formula.maxEnergy; },
        energyTs: "__ts__",
        //-------------------custom---------------------
        lv: 0,
        exp: 0,
        best: 0,
        skinId: 1,
        skinList: {1: -1},
        guide:1,
        lastDay:1,
        todayshow:0,
        Money:0,
        FurnitureLevel:1,
        level:0,
        newPlay:0,
        // skinList: {1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1, 8: -1, 9: -1, 10: -1, 11: -1, 12: -1},
    }

    // 0表示不使用体力系统
    static maxEnergy = 0;
    static recoverEnergyTs = 0 * 1000;

    // 场景配置：
    // path：空字符串使用自定义场景，可以直接创建节点（Game），可以别名节点（["x", "xx"]），"x"支持"x1/x2/x3"查找
    // nodeConf eg: [
    //     ["a/b/c", "T1"],
    //     ["ddd", "T2"],
    //     "CustNode",
    // ]
    static startScene = {
        path: "", nodeConf: [
            "Game",
        ]
    };

    // 单一填充预加载资源
    // 1."res3d/xxx.lh"
    // 2."config/xxx.json"
    // 3.Formula.getSoundPath("xxx"),
    static _preloadList = [
        //"res3d/LayaScene_SampleScene/Conventional/SampleScene.ls",
        
    ];
    // 遍历填充预加载资源
 
    static get preloadList() {

        return this._preloadList;
    };

    static shareTopics = ["西瓜拼拼乐", "番茄小游戏", "抖音小游戏"];
}

/**
 * Table A（每个表可以包含字段id也可以不包含，如果有id（id唯一，id可以数字或字符串）则会有arr和map，如果没有id只会有arr）
 *      arr: [obj1, obj2...]
 *      map: {id: obj1, key1: val1...}
 */
class ConfWrap {
    _file: string;
    arr: object[];
    map = {};
    constructor(name: string) {
        this._file = name;
    }
}
export let LC = {
    LangConf: new ConfWrap("lang"),
    SignConf: new ConfWrap("sign"),
    SkinConf: new ConfWrap("skin"),
};