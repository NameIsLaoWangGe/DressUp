import { OpenType, UIBase } from "../../Frame/Core";
/**任务模块*/
export module Task {
    /**任务种类集合*/
    export let _taskData = {
        arr0: [
            {
                name: 'PK3次',
                taskType: 'PK',
                condition: 3,
                resCondition: 0,
                rewardType: 'ticket',
                rewardNum: 1,
            },
            {
                name: '观看一个视频',
                taskType: 'ads',
                condition: 1,
                resCondition: 0,
                rewardType: 'ticket',
                rewardNum: 1,
            },
            {
                name: '观看两个视频',
                taskType: 'ads',
                condition: 2,
                resCondition: 0,
                rewardType: 'ticket',
                rewardNum: 1,
            },
            {
                name: '观看3个视频',
                taskType: 'ads',
                condition: 3,
                resCondition: 0,
                rewardType: 'ticket',
                rewardNum: 1,
            },
        ],

        get arr(): string {
            return
        },
        set arr(v: string) {
        }
    }
    /**任种类切换页*/
    export let _TaskTap: Laya.Tab;
    /**假如还有一个任务切换页_OtherTap*/
    export let _OtherTap: Laya.Tab;
    /**任务列表*/
    export let _TaskList: Laya.List;

    /**每日任务数据集合*/
    export let everydayTask: Array<any>;
    /**非每日任务集合*/
    export let perpetualTask: Array<any>;

    /**今日日期*/
    export let todayData = {
        /**获取存储的日期*/
        get date(): number {
            return Laya.LocalStorage.getItem('Task_todayData') ? Number(Laya.LocalStorage.getItem('Task_todayData')) : null;
        },
        /**设置存储的日期*/
        set date(date: number) {
            Laya.LocalStorage.setItem('Task_todayData', date.toString());
        }
    };
    0
    /**
    * 通过名称获取任务的一个属性值
    * @param ClassName 任务类型名称
    * @param name 任务名称
    * @param property 任务属性
    * */
    export function getTaskProperty(ClassName: string, name: string, property: string): any {
        let pro = null;
        let arr = getTaskClassArr(ClassName);
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
     * @param goodsClass 任务类型
     * @param ClassName 任务名称
     * @param property 设置或者增加任务属性名称
     * @param value 需要设置或者增加的属性值
     * */
    export function setTaskProperty(ClassName: string, name: string, property: string, value: any): void {
        let arr = getTaskClassArr(ClassName);
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
    export function getTaskClassArr(ClassName: string): Array<any> {
        let arr = [];
        switch (ClassName) {
            case TaskClass.everyday:
                arr = everydayTask;
                break;
            case TaskClass.perpetual:
                arr = perpetualTask;
                break;
            default:
                break;
        }
        return arr;
    }

    /**
     * 通过resCondition/condition，做任务并且完成了这次任务，然后检总进度是否完成,并且设置成完成状态,返回0表示任务没有完成，1代表刚好完成奖励未领取，-1代表任务完成了也领取了奖励
     * @param calssName 任务种类
     * @param name 任务名称
     * @param number 做几次任务，不传则默认为1次
     */
    export function doDetectionTask(calssName: string, name: string, number?: number): number {
        if (!number) {
            number = 1;
        }
        let resCondition = Task.getTaskProperty(calssName, name, Task.TaskProperty.resCondition);
        let condition = Task.getTaskProperty(calssName, name, Task.TaskProperty.condition);
        if (Task.getTaskProperty(calssName, name, Task.TaskProperty.get) !== -1) {
            if (condition <= resCondition + number) {
                Task.setTaskProperty(calssName, name, Task.TaskProperty.resCondition, condition);
                Task.setTaskProperty(calssName, name, Task.TaskProperty.get, 1);
                if (_TaskList) {
                    _TaskList.refresh();
                }
                return 1;
            } else {
                Task.setTaskProperty(calssName, name, Task.TaskProperty.resCondition, resCondition + number);
                if (_TaskList) {
                    _TaskList.refresh();
                }
                return 0;
            }
        } else {
            return -1;
        }
    }

    /**任务属性列表，数据表中的任务应该有哪些属性,name和have是必须有的属性,可以无限增加*/
    export enum TaskProperty {
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
    export enum TaskClass {
        /**每日任务*/
        everyday = 'Task_Everyday',
        /**永久性任务*/
        perpetual = 'Task_Perpetual',
    }

    /**事件名称*/
    export enum EventType {
        /**领取奖励*/
        getAward = 'getAward',
        /**每次点击广告获得金币*/
        adsGetAward_Every = 'adsGetAward_Every',
        /**试用皮肤*/
        useSkins = 'useSkins',
        /**胜利*/
        victory = 'victory',
        /**看广告的次数*/
        adsTime = 'adsTime',
        /**看广告的次数*/
        victoryBox = 'victoryBox',
    }
    /**获得方式列举,方式可以添加*/
    export enum TaskType {
        /**看广告*/
        ads = 'ads',
        /**胜利次数*/
        victory = 'victory',
        /**使用皮肤次数*/
        useSkins = 'useSkins',
        /**开宝箱次数*/
        treasureBox = 'treasureBox',
    }

    /**任务类型名称*/
    export enum TaskName {
        "观看广告获得金币" = "观看广告获得金币",
        "每日服务10位客人" = "每日服务10位客人",
        "每日观看两个广告" = "每日观看两个广告",
        "每日使用5种皮肤" = "每日使用5种皮肤",
        "每日开启10个宝箱" = "每日开启10个宝箱"
    }

    /**在loding界面或者开始界面执行一次！*/
    export function initTask(): void {
        //如果上个日期等于今天的日期，那么从存储中获取，如果不相等则直接从数据表中获取
        if (todayData.date !== (new Date).getDate()) {
            Task.everydayTask = Laya.loader.getRes('GameData/Task/everydayTask.json')['RECORDS'];
            console.log('不是同一天，每日任务重制！');
            todayData.date = (new Date).getDate();
        } else {
            // Task.everydayTask = Tools.dataCompare('GameData/Task/everydayTask.json', TaskClass.everyday, TaskProperty.name);
            console.log('是同一天！，继续每日任务');
        }
    }
}

export default class UIShop extends UIBase {
    _openType = OpenType.Attach;
    BackBtn: Laya.Image;
    ShopList: Laya.List;
    onInit(): void {
        console.log(Task._taskData.arr);
        this.btnEv("BackBtn", () => {
            this.hide();
        });

        // this.ShopList = this.vars('ShopList') as Laya.List;
        // this.ShopList.selectEnable = true;
        // this.ShopList.vScrollBarSkin = "";
        // // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
        // // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
        // this.ShopList.selectHandler = new Laya.Handler(this, (index: number) => {
        //     console.log(index);
        // });
        // this.ShopList.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
        //     console.log(cell);
        // });
    }


}