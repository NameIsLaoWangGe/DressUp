import ADManager from "../../Admanager";
import { EventMgr, OpenType, UIBase } from "../../Frame/Core";
import { Tools } from "./Tools";
/**任务模块*/
export module Task {
    /**数据表*/
    export let _taskPerpetualData =
        [
            {
                name: 'PK3次',
                taskType: 'PK',
                condition: 3,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
            {
                name: '观看一个视频',
                taskType: 'ads',
                condition: 1,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
            {
                name: '观看两个视频',
                taskType: 'ads',
                condition: 2,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
            {
                name: '观看3个视频',
                taskType: 'ads',
                condition: 3,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
        ]

    /**任务列表*/
    export let _TaskList: Laya.List;
    /**每日任务数据集合*/
    export let _everydayTask: Array<any>;
    /**非每日任务集合*/
    export let _perpetualTask: Array<any>;
    /**今日日期*/
    export let _today = {
        /**获取存储的日期*/
        get date(): number {
            return Laya.LocalStorage.getItem('Task_todayDate') ? Number(Laya.LocalStorage.getItem('Task_todayDate')) : null;
        },
        /**设置存储的日期*/
        set date(d: number) {
            Laya.LocalStorage.setItem('Task_todayDate', d.toString());
        }
    };

    /**
    * 通过名称获取任务的一个属性值
    * @param ClassName 任务类型名称
    * @param name 任务名称
    * @param property 任务属性
    * */
    export function getProperty(ClassName: string, name: string, property: string): any {
        let pro = null;
        let arr = getClassArr(ClassName);
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (element['name'] === name) {
                pro = element[property];
                break;
            }
        }
        if (pro !== null) {
            return pro;
        } else {
            console.log(name + '找不到属性:' + property, pro);
            return null;
        }
    }

    /**
     * 通过名称设置或者增加一个任务的一个属性值,并且刷新list列表
     * @param ClassName 任务类型
     * @param name 任务名称
     * @param property 设置或者增加任务属性名称
     * @param value 需要设置或者增加的属性值
     * */
    export function setProperty(ClassName: string, name: string, property: string, value: any): void {
        let arr = getClassArr(ClassName);
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (element['name'] === name) {
                element[property] = value;
                break;
            }
        }
        let data = {};
        data[ClassName] = arr;
        Laya.LocalStorage.setJSON(ClassName, JSON.stringify(data));
        if (_TaskList) {
            _TaskList.refresh();
        }
    }

    /**根据任务类型返回任务数组*/
    export function getClassArr(ClassName: string): Array<any> {
        let arr = [];
        switch (ClassName) {
            case Classify.everyday:
                arr = _everydayTask;
                break;
            case Classify.perpetual:
                arr = _perpetualTask;
                break;
            default:
                break;
        }
        return arr;
    }

    /**
     * 通过resCondition/condition，做任务并且完成了这次任务，然后检总进度是否完成,并且设置成完成状态,返回0表示任务没有完成，1代表刚好完成奖励未领取，-1代表任务完成了也领取了奖励,注意：完成了将不会继续做任务。
     * @param calssName 任务种类
     * @param name 任务名称
     * @param number 做几次任务，不传则默认为1次
     */
    export function doDetection(calssName: string, name: string, number?: number): number {
        if (!number) {
            number = 1;
        }
        let resCondition = Task.getProperty(calssName, name, Task.Property.resCondition);
        let condition = Task.getProperty(calssName, name, Task.Property.condition);
        let num = -1;
        console.log(resCondition, condition);
        if (Task.getProperty(calssName, name, Task.Property.get) !== -1) {
            if (condition <= resCondition + number) {
                Task.setProperty(calssName, name, Task.Property.resCondition, condition);
                Task.setProperty(calssName, name, Task.Property.get, 1);
                num = 1;
            } else {
                Task.setProperty(calssName, name, Task.Property.resCondition, resCondition + number);
                num = 0;
            }
        }
        if (_TaskList) {
            _TaskList.refresh();
        }
        return num;
    }

    /**
     * 领取奖励,返回奖励内容对象,{rewardType:'',num:number}奖励类型和数量，返回-1则说明无法领取奖励;
     * @param Classify 类型
     * @param name 任务名称
    */
    export function getReward(Classify: string, name: string): any {
        let data = {};
        let rewardType = getProperty(Classify, name, Property.rewardType);
        let rewardNum = getProperty(Classify, name, Property.rewardNum);
        let get = getProperty(Classify, name, Property.get);
        if (get == 1) {
            setProperty(Classify, name, Property.get, -1);
            return data = {
                rewardType: rewardType,
                rewardNum: rewardNum,
            }
        } else {
            console.log('领取条件不足');
            return -1;
        }
    }

    /**任务属性列表，数据表中的任务应该有哪些属性,name和have是必须有的属性,可以无限增加*/
    export enum Property {
        /**名称*/
        name = 'name',
        /**任务解释*/
        explain = 'explain',
        /**任务类型*/
        taskType = 'taskType',
        /**需要完成任务的总数*/
        condition = 'condition',
        /**根据获取途径，剩余需要条件的数量，会平凡改这个数量*/
        resCondition = 'resCondition',
        /**奖励类型*/
        rewardType = 'rewardType',
        /**奖励数量*/
        rewardNum = 'rewardNum',
        /**排列顺序*/
        arrange = 'arrange',
        /**剩余可完成次数,为零时将不可继续进行*/
        time = 'time',
        /**是否有可领取的奖励,有三种状态，1代表有奖励未领取，0表示任务没有完成，-1代表今天任务完成了也领取了奖励*/
        get = 'get',
    }

    /**任务中的任务大致类别,同时对应图片地址的文件夹*/
    export enum Classify {
        /**每日任务*/
        everyday = 'Task_Everyday',
        /**永久性任务*/
        perpetual = 'Task_Perpetual',
    }

    /**奖励类型*/
    export enum RewardType {
        /**刮刮券*/
        scratchTicket = 'scratchTicket',
        /**金币*/
        gold = 'gold',
        /**钻石*/
        diamond = 'diamond',
    }
    /**事件名称*/
    export enum EventType {
        /**领取奖励*/
        getAward = 'Task_getAward',
        /**每次点击广告获得金币*/
        adsGetAward_Every = 'Task_adsGetAward_Every',
        /**试用皮肤*/
        useSkins = 'Task_useSkins',
        /**胜利*/
        victory = 'Task_victory',
        /**看广告的次数*/
        watchAds = 'Task_watchAds',
        /**开宝箱的次数*/
        victoryBox = 'Task_victoryBox',
        /**PK*/
        PK = 'Task_PK',
    }
    /**完成方式列举,方式可以添加*/
    export enum CompeletType {
        /**看广告*/
        PK = 'PK',
        /**看广告*/
        ads = 'ads',
        /**胜利次数*/
        victory = 'victory',
        /**使用皮肤次数*/
        useSkins = 'useSkins',
        /**开宝箱次数*/
        treasureBox = 'treasureBox',
    }
    /**任务名称唯一*/
    export enum name {
        PK3次 = 'PK3次',
        观看一个视频 = '观看一个视频',
        观看两个视频 = '观看两个视频',
        观看3个视频 = '观看3个视频',
    }

    /**在loding界面或者开始界面执行一次！*/
    export function init(): void {
        Task._perpetualTask = Tools.dataCompare(Tools.objArray_Copy(_taskPerpetualData), Classify.perpetual, Property.name);
        EventMgr.reg(EventType.PK, Task, () => {
            doDetection(Classify.perpetual, name.PK3次);
        })
    }

    /**完全重制任务*/
    export function refreshTask(): void {
        let data = {};
        data[Classify.perpetual] = Tools.objArray_Copy(_taskPerpetualData);
        Laya.LocalStorage.setJSON(Classify.perpetual, JSON.stringify(data));
        Task._TaskList.array = _perpetualTask = Tools.objArray_Copy(_taskPerpetualData);
        if (_TaskList) {
            _TaskList.refresh();
        }
    }
}

export default class UITask extends UIBase {
    _openType = OpenType.Attach;
    onInit(): void {
        this.btnEv("BackBtn", () => {
            this.hide();
        });
        this.btnEv('refreshBtn', () => {
            Task.refreshTask();
        })
        EventMgr.reg(Task.EventType.watchAds, this, (name: string) => {
            Task.doDetection(Task.Classify.perpetual, name);
        })
        EventMgr.reg(Task.EventType.getAward, this, (name: string) => {
            // Task.getReward(Task.Classify.perpetual, name);
            ADManager.ShowReward(()=>{
            })
            console.log(Task.getReward(Task.Classify.perpetual, name));
        })
    }

    onShow(): void {
        Task._TaskList = this.vars('ShopList') as Laya.List;
        Task._TaskList.selectEnable = true;
        Task._TaskList.vScrollBarSkin = "";
        Task._TaskList.array = Task._perpetualTask;
        Task._TaskList.selectHandler = new Laya.Handler(this, (index: number) => { });
        Task._TaskList.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
            let dataSource = cell.dataSource;
            let Name = cell.getChildByName('Name') as Laya.Label;
            Name.text = dataSource.name;

            let BtnGet = cell.getChildByName('BtnGet') as Laya.Image;

            if (dataSource.get == 0) {
                BtnGet.skin = 'UITask/weiwancheng.png';
            } else if (dataSource.get == 1) {
                BtnGet.skin = 'UITask/lingqu.png';
            } else if (dataSource.get == -1) {
                BtnGet.skin = 'UITask/yilingqu.png';
            }

            let ProNum = cell.getChildByName('ProNum') as Laya.Label;
            ProNum.text = '(' + dataSource.resCondition + '/' + dataSource.condition + ')';

            let BtnAds = cell.getChildByName('BtnAds') as Laya.Image;
            if (dataSource.name == Task.name.PK3次) {
                BtnAds.visible = false;
                ProNum.x = 270;
            } else {
                BtnAds.visible = true;
                ProNum.x = 370;
            }
        });
    }
}