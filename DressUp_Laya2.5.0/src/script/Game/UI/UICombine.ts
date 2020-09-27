import ADManager, { TaT } from "../../Admanager";
import { OpenType, ResourceMgr, UIBase, UIMgr } from "../../Frame/Core";
import Util from "../../Frame/Util";
import RecordManager from "../../RecordManager";
import ClothData from "../ClothData";
import GameDataController from "../GameDataController";
import BagListController from "./Bag/BagListController";
import { Tools } from "./Tools";
import UIActive from "./UIActive";
import UIReady from "./UIReady";
import UITip from "./UITip";

export default class UICombine extends UIBase{

    _openType=OpenType.Attach;

    First:Laya.Box;
    ConfirmBtn:Laya.Image;

    HeCheng:Laya.Box;
    // SuijiBtn:Laya.Image;
    CombineBtn:Laya.Image;
    Yanzhi:Laya.Image;
    Fu:Laya.Image;
    QiZhi:Laya.Image;
    Aiqing:Laya.Image;
    Shuidi:Laya.Image;
    FuHei:Laya.Image;
    Title:Laya.Image;
    HCCloseBtn:Laya.Image;
    Wan:Laya.Image;
    mask:Laya.Image;

    DanSheng:Laya.Box;
    StartBtn:Laya.Image;
    Guanghuan:Laya.Image;
    Role:Laya.Image;
    CloseBtn:Laya.Image;
    GetAwardBtn:Laya.Image;
    CheckBtn:Laya.Image;

    count:number=0;
    isWatchAD:boolean=true;
    str={};
    Datas:ClothData[];

    //嫦娥头发获取
    ClickNum:number=0;
    onInit()
    {

        this.First=this.vars("First") as Laya.Box;
        this.ConfirmBtn=this.vars("ConfirmBtn") as Laya.Image;
        this.ConfirmBtn.on(Laya.Event.CLICK,this,()=>{
            this.HeCheng.visible=true;
            this.First.visible=false;
        })

        this.HeCheng=this.vars("HeCheng") as Laya.Box;
        this.CombineBtn=this.HeCheng.getChildByName("CombineBtn") as Laya.Image;
        this.Yanzhi=this.HeCheng.getChildByName("Yanzhi") as Laya.Image;
        this.Fu=this.HeCheng.getChildByName("Fu") as Laya.Image;
        this.QiZhi=this.HeCheng.getChildByName("QiZhi") as Laya.Image;
        this.Aiqing=this.HeCheng.getChildByName("Aiqing") as Laya.Image;
        this.Shuidi=this.HeCheng.getChildByName("Shuidi") as Laya.Image;
        this.FuHei=this.HeCheng.getChildByName("FuHei") as Laya.Image;
        this.Title=this.HeCheng.getChildByName("Title") as Laya.Image;
        this.CombineBtn.on(Laya.Event.CLICK,this,this.DanShengShow)
        this.HCCloseBtn=this.HeCheng.getChildByName("HCCloseBtn") as Laya.Image;
        this.HCCloseBtn.on(Laya.Event.CLICK,this,()=>{
            RecordManager.stopAutoRecord();
            this.hide();
        })
        this.Wan=this.HeCheng.getChildByName("Wan") as Laya.Image;
        this.mask=this.vars("Mask") as Laya.Image;
        

        this.QiZhi.on(Laya.Event.CLICK,this,this.QiZhiClick);
        this.Yanzhi.on(Laya.Event.CLICK,this,this.YanzhiClick);
        this.Fu.on(Laya.Event.CLICK,this,this.FuClick);
        this.Aiqing.on(Laya.Event.CLICK,this,this.AiqingClick);
        this.FuHei.on(Laya.Event.CLICK,this,this.FuHeiClick);
        this.Title.on(Laya.Event.CLICK,this,this.TitleClick);


        this.DanSheng=this.vars("DanSheng") as Laya.Box;
        this.Guanghuan=this.DanSheng.getChildByName("Guanghuan")as Laya.Image;
        this.StartBtn=this.DanSheng.getChildByName("StartBtn") as Laya.Image;
        this.Role=this.DanSheng.getChildByName("Role")as Laya.Image;
        this.CloseBtn=this.DanSheng.getChildByName("CloseBtn")as Laya.Image;
        this.StartBtn.on(Laya.Event.CLICK,this,()=>{
            ADManager.TAPoint(TaT.BtnClick,"zaoren_click");
            RecordManager.stopAutoRecord();
            RecordManager._share(()=>{
                UIMgr.tip("视频分享成功！");
                this.hide();
            },()=>{
                UIMgr.tip("视频分享失败...");
                this.hide();
            })
        })
        this.CloseBtn.on(Laya.Event.CLICK,this,()=>{
            RecordManager.stopAutoRecord();
            this.hide();
        });
        this.CheckBtn=this.DanSheng.getChildByName("CheckBtn")as Laya.Image;
        this.GetAwardBtn=this.DanSheng.getChildByName("GetAwardBtn")as Laya.Image;

        this.CheckBtn.on(Laya.Event.CLICK,this,()=>{
            this.isWatchAD=!this.isWatchAD;
            (this.CheckBtn.getChildAt(0)as Laya.Image).visible=!(this.CheckBtn.getChildAt(0)as Laya.Image).visible;
            (this.GetAwardBtn.getChildAt(0) as Laya.Image).visible=this.isWatchAD;
            (this.GetAwardBtn.getChildAt(1) as Laya.Image).visible=!this.isWatchAD;
        })
        this.GetAwardBtn.on(Laya.Event.CLICK,this,this.GetAwardBtnClick);
    }
    onShow()
    {
        RecordManager.startAutoRecord();//UI开启 开始录屏    

        if(GameDataController.ClothDataRefresh[40201]==0&&GameDataController.ClothDataRefresh[40306]==0&&GameDataController.ClothDataRefresh[40504]==0)
        {
            this.GetAwardBtn.visible=false;
            this.CheckBtn.visible=false;
            this.StartBtn.x=236;
            this.StartBtn.y=1042;
        }

        this.First.visible=true;
        this.HeCheng.visible=false;
        this.Shuidi.visible=false;
        this.DanSheng.visible=false;

        this.isWatchAD=true;
        (this.CheckBtn.getChildAt(0)as Laya.Image).visible=true;
        (this.GetAwardBtn.getChildAt(0) as Laya.Image).visible=this.isWatchAD;
        (this.GetAwardBtn.getChildAt(1) as Laya.Image).visible=!this.isWatchAD;

        this.count=0;
        this.QiZhi.on(Laya.Event.CLICK,this,this.QiZhiClick);
        this.Yanzhi.on(Laya.Event.CLICK,this,this.YanzhiClick);
        this.Fu.on(Laya.Event.CLICK,this,this.FuClick);
        this.FuHei.on(Laya.Event.CLICK,this,this.FuHeiClick);
        this.Aiqing.on(Laya.Event.CLICK,this,this.AiqingClick);
        (this.Fu.getChildAt(0) as Laya.Image).visible=true;
        (this.QiZhi.getChildAt(0) as Laya.Image).visible=true;
        (this.Aiqing.getChildAt(0) as Laya.Image).visible=true;
        (this.FuHei.getChildAt(0) as Laya.Image).visible=true;
        this.FuHei.x=343;
        this.FuHei.y=203;

        this.GetAwardBtn.visible=true;
        this.CheckBtn.visible=true;
        this.StartBtn.x=393;
        this.StartBtn.y=1042;

        Laya.timer.once(3000,this,()=>{
            this.HCCloseBtn.visible=true;
        })

        
        // this.SuijiBtn.on(Laya.Event.CLICK,this,this.SuijiBtnClick);
        ADManager.TAPoint(TaT.BtnShow,"zaoren_click");
    }
    onHide()
    {
        this.Shuidi.visible=false;
        this.DanSheng.visible=false;
        this.CloseBtn.visible=false;
        Laya.timer.clear(this,this.GuangHuanRot);
        this.HCCloseBtn.visible=false;

        this.mask.centerY=100;
    }

    GuangHuanRot()
    {
        this.Guanghuan.rotation+=2;
    }

    QiZhiClick()
    {
        ADManager.ShowReward(()=>{
            (this.QiZhi.getChildAt(0) as Laya.Image).visible=false;
            (this.owner["QiZhiAni"] as Laya.FrameAnimation).play(0,false);
            this.count++;
            Laya.timer.frameOnce(35,this,()=>{
                this.mask.centerY-=15;
            })
            this.QiZhi.off(Laya.Event.CLICK,this,this.QiZhiClick);
        })
    }
    YanzhiClick()
    {
        this.ClickNum += 1;
        (this.owner["YanZhiAni"] as Laya.FrameAnimation).play(0,false);
        this.count++;
        Laya.timer.frameOnce(35,this,()=>{
            this.mask.centerY-=15;
        })
        this.Yanzhi.off(Laya.Event.CLICK,this,this.YanzhiClick);
    }
    FuClick()
    {
        ADManager.ShowReward(()=>{
            this.ClickNum += 1;
            (this.Fu.getChildAt(0) as Laya.Image).visible=false;
            (this.owner["FuAni"] as Laya.FrameAnimation).play(0,false);
            this.count++;
            Laya.timer.frameOnce(35,this,()=>{
                this.mask.centerY-=15;
            })
            this.Fu.off(Laya.Event.CLICK,this,this.FuClick);
        })
    }
    AiqingClick()
    {
        ADManager.ShowReward(()=>{
            (this.Aiqing.getChildAt(0) as Laya.Image).visible=false;
            (this.owner["AiqingAni"] as Laya.FrameAnimation).play(0,false);
            this.count++;
            Laya.timer.frameOnce(35,this,()=>{
                this.mask.centerY-=15;
            })
            this.Aiqing.off(Laya.Event.CLICK,this,this.AiqingClick);
        })
        
    }
    FuHeiClick()
    {
        ADManager.ShowReward(()=>{
            this.ClickNum += 1;
            (this.FuHei.getChildAt(0) as Laya.Image).visible=false;
            (this.owner["FuHeiAni"] as Laya.FrameAnimation).play(0,false);
            this.count++;
            Laya.timer.frameOnce(35,this,()=>{
                this.mask.centerY-=15;
            })
            this.FuHei.off(Laya.Event.CLICK,this,this.FuHeiClick);
        })
    }
    TitleClick()
    {
        this.FuHei.x=353.5;
        this.FuHei.y=902;
    }


    DanShengShow()
    {  
        if(this.ClickNum==3&&GameDataController.ClothDataRefresh[71001]==1)
        {
            console.log("xxxxxxxxxxxx")
            this.Datas=GameDataController.ClothPackge3.cloths1;
            this.Refresh();
            ADManager.ShowReward(()=>{
                this.DanSheng.visible=true;
                this.HeCheng.visible=false;
                Laya.timer.loop(10,this,this.GuangHuanRot);
                Laya.timer.once(3000,this,()=>{
                    this.CloseBtn.visible=true;
                })
                // this.Role.skin="https://h5.tomatojoy.cn/wx/mhdmx/zijie/1.0.8/Cloth/Hair/71001_1.png";
                this.Role.skin="Cloth/Hair/71001_1.png";
                this.Role.scaleX=1;
                this.Role.scaleY=1;
            })                
        }
        else if(this.count>=3)
        {
            ADManager.ShowReward(()=>{
                this.DanSheng.visible=true;
                this.RoleRandom();
                Laya.timer.loop(10,this,this.GuangHuanRot)
                // RecordManager.stopAutoRecord();
                Laya.timer.once(3000,this,()=>{
                    this.CloseBtn.visible=true;
                })
                this.HeCheng.visible=false;
            })
            
        }
        else{
            UIMgr.tip("至少增加三种属性才能够合成哦")
        }
        
    }
    RoleRandom()
    {

        
        let r=Util.randomInRange_i(1,3);
        this.Role.skin="Active/taozhuang" + r + ".png";
        this.Role.scaleX=1.7;
        this.Role.scaleY=1.7;
        if(r==1)
        {
            this.Datas= GameDataController.ClothPackge2.cloths3;
        }
        if(r==2)
        {
            this.Datas=GameDataController.ClothPackge2.cloths1;
        }
        if(r==3)
        {
            this.Datas=GameDataController.ClothPackge2.cloths2;
        } 

        this.Refresh()

        if(GameDataController.ClothDataRefresh[this.Datas[this.Datas.length-1].ID]==0)
        {
            this.GetAwardBtn.visible=false;
            this.CheckBtn.visible=false;
            this.StartBtn.x=236;
            this.StartBtn.y=1042;
        }

        console.log(r)
        console.log(this.Datas[0].GetType2)
        console.log(this.str);
    }

    Refresh()
    {
        this.Datas.forEach((v,i)=>{
            let nv = GameDataController.ClothDataRefresh[this.Datas[i].ID]
            this.str[this.Datas[i].ID] = nv;
        })
    }

    GetAwardBtnClick()
    {
        if(this.isWatchAD)
        {
            ADManager.ShowReward(()=>{
                this.GetAward();
            },()=>{
                UIMgr.show("UITip",()=>{
                    this.GetAward();
                })
            })
        }
        else{
            this.hide();
        }
    }

    GetAward()
    {
        if(this.Datas[0].ID==71001) //嫦娥
        {
            if(GameDataController.ClothDataRefresh[71001]==1)
            {
                let dataall = GameDataController.ClothDataRefresh;
                dataall[71001] = 0;//解锁
                GameDataController.ClothDataRefresh = dataall;
                this.Refresh();
                Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
                BagListController.Instance.refresh();
                UIMgr.tip("恭喜获得新衣服");
            }
           else
           {
               UIMgr.tip("已经解锁了哦，不要重复解锁");
           }
        }
        else
        {
            for(let k in this.str)
            {
               if(this.str[k]==1)
               {
                    let dataall = GameDataController.ClothDataRefresh;
                    dataall[k] = 0;//解锁
                    GameDataController.ClothDataRefresh = dataall;
                    Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
                    this.Refresh();
                    (UIMgr.get("UIReady") as UIReady).Refresh();
                    BagListController.Instance.refresh();
                    UIMgr.tip("恭喜解锁一套新衣服"); 
               }
               else
               {
                    UIMgr.tip("已经解锁了哦，不要重复解锁"); 
               } 
            }
        }
    }
}