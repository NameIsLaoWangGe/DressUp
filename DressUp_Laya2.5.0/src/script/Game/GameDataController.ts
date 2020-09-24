import { UIMgr } from "../Frame/Core";
import ClothData from "./ClothData"
import { PickData } from "./PickJsonData";
import BagListController from "./UI/Bag/BagListController";
import { Tools } from "./UI/Tools";
import UIReady from "./UI/UIReady";

export default class GameDataController extends Laya.Script {
    public static get _ClothData(): Map<number, ClothData> {
        return this._clothData;
    }
    static _clothData: Map<number, ClothData> = new Map();

    static HairData: ClothData[] = [];
    static DressData: ClothData[] = [];
    static ShirtData: ClothData[] = [];
    static TrousersData: ClothData[] = [];
    static SocksData: ClothData[] = [];
    static ShoseData: ClothData[] = [];
    static OrnamentData: ClothData[] = [];
    static PetData: ClothData[] = [];

    static PickData: PickData[] = [];

    static ClothPackge1: ClothPackgeData;//七日签到
    static ClothPackge2: ClothPackgeData;//抽屉特殊皮肤
    static ClothPackge3: ClothPackgeData;//睡衣
    static ClothPackge4: ClothPackgeData;//每日推荐 

    static ClothDataAsy = {}//初始化表

    static windowWidth: number;

    static GetFirstLoginTime() {

        let time = Laya.LocalStorage.getItem("Get")
        if (time) {

        }
        else {
            Laya.LocalStorage.setItem("Get", "1562730819957");
            time = Laya.LocalStorage.getItem("Get");
        }
        return parseFloat(time);
    }
    static setFirstLoginTime()//获取第一天登陆时间
    {
        let time = Date.now();
        Laya.LocalStorage.setItem("Get", time + "");
    }

    static ClothdatapackSet(k: string, v: any)//用于存取套装信息 
    {
        Laya.LocalStorage.setJSON(k, v);
    }
    static ClothdatapackGet(k: string): any {
        return Laya.LocalStorage.getJSON(k);
    }
    static ClothdatapackRemove(k: string): any {
        return Laya.LocalStorage.removeItem(k);
    }

    //0 解锁 1未解锁
    static set ClothDataRefresh(v: any)//用于存取信息的表 传入装扮ID来获取装扮是否解锁 0解锁 1未解锁
    {
        Laya.LocalStorage.setJSON("ClothData", v);
    }

    static get ClothDataRefresh(): any {
        let a = Laya.LocalStorage.getJSON("ClothData");
        return a;
    }

    static ClothAlllockNum(strs: any): number //遍历当前套装 返回未解锁个数
    {
        let num = Object.keys(strs).length;//总个数
        console.log(Object.keys(strs).length);
        for (let i in strs) {
            if (strs[i] == 1)//未解锁
            {

            }
            else//解锁
            {
                num--;
            }
        }
        return num;
    }

    static ClothAllLockArr(strs: any)//遍历当前套装 返回未解锁ID数组
    {

        let num = Object.keys(strs).length;//总个数
        console.log(Object.keys(strs).length);
        let temp = [];
        for (let i in strs) {
            if (strs[i] == 1)//未解锁
            {

                temp.push(i);
            }
            else//解锁
            {

            }
        }
        console.log(temp);
        return temp;
    }

    static ClothCanUse(Id: number) {
        if (this._clothData.has(Id)) {
            let data = this._clothData.get(Id);
            // console.log(data.GetType2);
            if (data.GetType2)//是否存在服装信息
            {

                let str = this.ClothdatapackGet(data.GetType2);
                // console.log(str);
                if (str != null) {
                    if ((data.GetType2.split('_'))[0] == "1")//签到获得
                    {
                        let str = this.ClothDataRefresh[Id];
                        // console.log(str);
                        if (str != null) {
                            if (GameDataController.ClothDataRefresh[Id] == 1) {
                                //console.log("当前衣服未解锁", Id);
                                return false;
                            }
                            else {
                                // console.log("当前衣服已解锁", Id);
                                return true;
                            }
                        }
                    }
                    else if ((data.GetType2.split('_'))[0] == "2")//抽屉特殊皮肤
                    {
                        let num = GameDataController.ClothAlllockNum(str);
                        if (num > 0)//判断剩余解锁数量
                        {
                            //console.log("衣服套装未开放", Id);
                            return false;
                        }
                        else {
                            //console.log("衣服套装已开放", Id);
                            return true;
                        }
                    }
                    else if ((data.GetType2.split('_'))[0] == "3")//睡衣
                    {
                        let str = this.ClothDataRefresh[Id];
                        // console.log(str);
                        if (str != null) {
                            if (GameDataController.ClothDataRefresh[Id] == 1) {
                                //console.log("当前衣服未解锁", Id);
                                return false;
                            }
                            else {
                                // console.log("当前衣服已解锁", Id);
                                return true;
                            }
                        }
                    }
                    else if ((data.GetType2.split('_'))[0] == "4")//每日推荐获得
                    {
                        let str = this.ClothDataRefresh[Id];
                        // console.log(str);
                        if (str != null) {
                            if (GameDataController.ClothDataRefresh[Id] == 1) {
                                //console.log("当前衣服未解锁", Id);
                                return false;
                            }
                            else {
                                // console.log("当前衣服已解锁", Id);
                                return true;
                            }
                        }
                    }
                    else {//特殊获得
                        return true;
                    }

                }
                else {
                    console.log("无当前衣服套装", Id);
                    return false;//套装信息未存储
                }
            }
            else {
                //不存在此套装 判断是否解锁
                let str = this.ClothDataRefresh[Id];
                // console.log(str);
                if (str != null) {
                    if (GameDataController.ClothDataRefresh[Id] == 1) {
                        //console.log("当前衣服未解锁", Id);
                        return false;
                    }
                    else {
                        // console.log("当前衣服已解锁", Id);
                        return true;
                    }
                }
                else {
                    // console.log("不存在当前衣服1", Id);
                    return false;
                }
            }
        }
        else {
            // console.log("不存在当前衣服2", Id);
            return false;
        }
    }
    static GetFirstToNow() {
        let FirstDay = this.GetFirstLoginTime();//获取第一次的日期
        let NowDay = Date.now();//获取当前日期
        let FirstDayTo1 = Math.ceil((NowDay - FirstDay) / (24 * 60 * 60 * 1000));//获取两天之前差的天数
        console.log("两天之间的天数", FirstDayTo1);
        return FirstDayTo1;
    }



    static set PhotosData(v: any) {
        Laya.LocalStorage.setJSON("PhotosData", v);

    }
    static get PhotosData(): any {
        let a = Laya.LocalStorage.getJSON("PhotosData");
        if (a) {

        }
        else {
            Laya.LocalStorage.setJSON("PhotosData", null);
        }
        return a;
    }

    static set PhotosIDarr(v: any) {
        Laya.LocalStorage.setJSON("PhotosIDarr", v);
    }
    static get PhotosIDarr(): any {
        let a = Laya.LocalStorage.getJSON("PhotosIDarr");
        if (a) {

        }
        else {
            Laya.LocalStorage.setJSON("PhotosIDarr", null);
        }
        return a;
    }

    static SetLastTime()//最后一次签到的时间
    {
        let item = Date.now();
        Laya.LocalStorage.setItem("LastTime", item + "");
    }

    static GetLastTime() {
        let time = Laya.LocalStorage.getItem("LastTime")

        if (time != null) {

        }
        else {
            Laya.LocalStorage.setItem("LastTime", "1562730819957");
            time = Laya.LocalStorage.getItem("LastTime");
        }
        return parseFloat(time);
    }
    static IsNewDay() {
        let oldtime = this.GetLastTime();
        let olddate = new Date(oldtime);
        let oy = olddate.getFullYear();
        let om = olddate.getMonth();
        let od = olddate.getDate();
        let curTime = Date.now();
        let nowDate = new Date();
        let ny = nowDate.getFullYear();
        let nm = nowDate.getMonth();
        let nd = nowDate.getDate();
        return (curTime > oldtime) && (ny > oy || nm > om || nd > od);
    }

    static set TodayHeCheng(v: string) {
        Laya.LocalStorage.setItem("TodayHeCheng", v);
    }
    static get TodayHeCheng(): string {
        return Laya.LocalStorage.getItem("TodayHeCheng");
    }

    static set TodaySign(v: string) {
        Laya.LocalStorage.setItem("TodaySign", v);
    }
    static get TodaySign(): string {
        return Laya.LocalStorage.getItem("TodaySign");
    }

    static set PickNum(v: string) {
        Laya.LocalStorage.setItem("PickNum", v);
    }
    static get PickNum(): string {
        return Laya.LocalStorage.getItem("PickNum");
    }

    static set TodayWinNum(v: string) {
        Laya.LocalStorage.setItem("TodayWinNum", v);
    }
    static get TodayWinNum(): string {
        return Laya.LocalStorage.getItem("TodayWinNum");
    }

    static set ShopCharmValue(v: string) { //商店魅力值
        Laya.LocalStorage.setItem("ShopCharmValue", v);
    }
    static get ShopCharmValue(): string {
        return Laya.LocalStorage.getItem("ShopCharmValue");
    }

    static set CharmValue(v: string) { //魅力值
        Laya.LocalStorage.setItem("CharmValue", v);
    }
    static get CharmValue(): string {
        return Laya.LocalStorage.getItem("CharmValue");
    }

    //未解锁的全部衣服
    static Get_All_UnLock_Cloth() {
        let arr = [];
        for (let k in GameDataController.ClothDataAsy) {
            if (GameDataController.ClothDataAsy[k] == 1 && !GameDataController._ClothData.get(parseInt(k)).GetType2) {
                if (!((k == "10000") || (k == "10001") || (k == "10002"))) {
                    arr.push(k);
                }
            }
        }
        return arr;
    }
    //未解锁的高星衣服
    static Get_All_UnLock_HighStarCloth() {
        let arr = [];
        for (let k in GameDataController.ClothDataAsy) {
            if (GameDataController.ClothDataAsy[k] == 1 && !GameDataController._ClothData.get(parseInt(k)).GetType2&&GameDataController._ClothData.get(parseInt(k)).Star==3) {
                if (!((k == "10000") || (k == "10001") || (k == "10002"))) {
                    arr.push(k);
                }
            }
        }
        let t=Tools.arrayRandomGetOut(arr,1);
        let cloth:ClothData=GameDataController._ClothData.get(parseInt(t));
        return cloth;
    }

    //未解锁的低星衣服
    static Get_All_UnLock_LowStarCloth() {
        let arr = [];
        for (let k in GameDataController.ClothDataAsy) {
            if (GameDataController.ClothDataAsy[k] == 1 && !GameDataController._ClothData.get(parseInt(k)).GetType2&&GameDataController._ClothData.get(parseInt(k)).Star==1||GameDataController._ClothData.get(parseInt(k)).Star==2) {
                if (!((k == "10000") || (k == "10001") || (k == "10002"))) {
                    arr.push(k);
                }
            }
        }
        let t=Tools.arrayRandomGetOut(arr,1);
        let cloth:ClothData=GameDataController._ClothData.get(parseInt(t));
        return cloth;
    }
    /**解锁*/
    static unlock(data): void {
            let dataall = GameDataController.ClothDataRefresh;
            dataall[data.ID]=0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.showList();
            BagListController.Instance.refresh();
    }
    //增加魅力值
    static  AddCharmValue(num:number)
    {
        if(!GameDataController.ShopCharmValue)
        {
            //GameDataController.ShopCharmValue="0";
            GameDataController.ShopCharmValue=num.toString();
        }
        else
        {
            let a=parseInt(GameDataController.ShopCharmValue);
            GameDataController.ShopCharmValue=(a+num).toString();
        }   
    }
}

export class ClothPackgeData extends Laya.Script//页面分级 一个页面包含多组数据
{
    cloths1: ClothData[] = [];//第一套
    cloths2: ClothData[] = [];//第二套
    cloths3: ClothData[] = [];//第三套
    cloths4: ClothData[] = [];//第四套
}
