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

    HeCheng:Laya.Box;
    // SuijiBtn:Laya.Image;
    CombineBtn:Laya.Image;
    Yanzhi:Laya.Image;
    Caifu:Laya.Image;
    Zhihui:Laya.Image;
    Aiqing:Laya.Image;
    Shuidi:Laya.Image;
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
    onInit()
    {

        this.HeCheng=this.vars("HeCheng") as Laya.Box;
        // this.SuijiBtn=this.HeCheng.getChildByName("SuijiBtn") as Laya.Image;
        this.CombineBtn=this.HeCheng.getChildByName("CombineBtn") as Laya.Image;
        // this.SuijiBtn.on(Laya.Event.CLICK,this,this.SuijiBtnClick);

        this.Yanzhi=this.HeCheng.getChildByName("Yanzhi") as Laya.Image;
        this.Caifu=this.HeCheng.getChildByName("Caifu") as Laya.Image;
        this.Zhihui=this.HeCheng.getChildByName("Zhihui") as Laya.Image;
        this.Aiqing=this.HeCheng.getChildByName("Aiqing") as Laya.Image;
        this.Shuidi=this.HeCheng.getChildByName("Shuidi") as Laya.Image;
        this.CombineBtn.on(Laya.Event.CLICK,this,this.DanShengShow)
        this.HCCloseBtn=this.HeCheng.getChildByName("HCCloseBtn") as Laya.Image;
        this.HCCloseBtn.on(Laya.Event.CLICK,this,()=>{
            RecordManager.stopAutoRecord();
            this.hide();
        })
        this.Wan=this.HeCheng.getChildByName("Wan") as Laya.Image;
        this.mask=this.vars("Mask") as Laya.Image;
        

        this.Zhihui.on(Laya.Event.CLICK,this,this.ZhihuiClick);
        this.Yanzhi.on(Laya.Event.CLICK,this,this.YanzhiClick);
        this.Caifu.on(Laya.Event.CLICK,this,this.CaifuClick);
        this.Aiqing.on(Laya.Event.CLICK,this,this.AiqingClick);


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
        

        if(GameDataController.ClothDataRefresh[40201]==0&&GameDataController.ClothDataRefresh[40306]==0&&GameDataController.ClothDataRefresh[40504]==0)
        {
            this.GetAwardBtn.visible=false;
            this.CheckBtn.visible=false;
            this.StartBtn.x=236;
            this.StartBtn.y=1019;
        }

        this.HeCheng.visible=true;
        this.Shuidi.visible=false;
        this.DanSheng.visible=false;

        this.isWatchAD=true;
        (this.CheckBtn.getChildAt(0)as Laya.Image).visible=true;
        (this.GetAwardBtn.getChildAt(0) as Laya.Image).visible=this.isWatchAD;
        (this.GetAwardBtn.getChildAt(1) as Laya.Image).visible=!this.isWatchAD;

        this.count=0;
        this.Zhihui.on(Laya.Event.CLICK,this,this.ZhihuiClick);
        this.Yanzhi.on(Laya.Event.CLICK,this,this.YanzhiClick);
        this.Caifu.on(Laya.Event.CLICK,this,this.CaifuClick);
        this.Aiqing.on(Laya.Event.CLICK,this,this.AiqingClick);
        (this.Caifu.getChildAt(0) as Laya.Image).visible=true;
        (this.Zhihui.getChildAt(0) as Laya.Image).visible=true;
        (this.Aiqing.getChildAt(0) as Laya.Image).visible=true;

        this.GetAwardBtn.visible=true;
        this.CheckBtn.visible=true;
        this.StartBtn.x=393;
        this.StartBtn.y=1019;

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

    ZhihuiClick()
    {
        ADManager.ShowReward(()=>{
            (this.Zhihui.getChildAt(0) as Laya.Image).visible=false;
            (this.owner["ZhihuiAni"] as Laya.FrameAnimation).play(0,false);
            this.count++;
            Laya.timer.frameOnce(60,this,()=>{
                this.mask.centerY-=20;
            })
            this.Zhihui.off(Laya.Event.CLICK,this,this.ZhihuiClick);
        },()=>{
            UIMgr.show("UITip",()=>{
                (this.Zhihui.getChildAt(0) as Laya.Image).visible=false;
                (this.owner["ZhihuiAni"] as Laya.FrameAnimation).play(0,false);
                this.count++;
                Laya.timer.frameOnce(60,this,()=>{
                    this.mask.centerY-=20;
                })
                this.Zhihui.off(Laya.Event.CLICK,this,this.ZhihuiClick);
            });
        })
        
    }
    YanzhiClick()
    {
        (this.owner["YanZhiAni"] as Laya.FrameAnimation).play(0,false);
        this.count++;
        Laya.timer.frameOnce(60,this,()=>{
            this.mask.centerY-=20;
        })
        this.Yanzhi.off(Laya.Event.CLICK,this,this.YanzhiClick);
    }
    CaifuClick()
    {
        ADManager.ShowReward(()=>{
            (this.Caifu.getChildAt(0) as Laya.Image).visible=false;
            (this.owner["CaifuAni"] as Laya.FrameAnimation).play(0,false);
            this.count++;
            Laya.timer.frameOnce(55,this,()=>{
                this.mask.centerY-=20;
            })
            this.Caifu.off(Laya.Event.CLICK,this,this.CaifuClick);
        },()=>{
            UIMgr.show("UITip",()=>{
                (this.Caifu.getChildAt(0) as Laya.Image).visible=false;
                (this.owner["CaifuAni"] as Laya.FrameAnimation).play(0,false);
                this.count++;
                Laya.timer.frameOnce(55,this,()=>{
                    this.mask.centerY-=20;
                })
                this.Caifu.off(Laya.Event.CLICK,this,this.CaifuClick);
            })
        })
        
    }
    AiqingClick()
    {
        ADManager.ShowReward(()=>{
            (this.Aiqing.getChildAt(0) as Laya.Image).visible=false;
            (this.owner["AiqingAni"] as Laya.FrameAnimation).play(0,false);
            this.count++;
            Laya.timer.frameOnce(60,this,()=>{
                this.mask.centerY-=20;
            })
            this.Aiqing.off(Laya.Event.CLICK,this,this.AiqingClick);
        },()=>{
            UIMgr.show("UITip",()=>{
                (this.Aiqing.getChildAt(0) as Laya.Image).visible=false;
                (this.owner["AiqingAni"] as Laya.FrameAnimation).play(0,false);
                this.count++;
                Laya.timer.frameOnce(60,this,()=>{
                    this.mask.centerY-=20;
                })
                this.Aiqing.off(Laya.Event.CLICK,this,this.AiqingClick);
            })
        })
        
    }
    
    // SuijiBtnClick()
    // {
    //     (this.owner["ZhihuiAni"] as Laya.FrameAnimation).play(0,false);
    //     Laya.timer.once(2500,this,()=>{
    //         (this.owner["YanZhiAni"] as Laya.FrameAnimation).play(0,false);
    //     });
    //     Laya.timer.once(4500,this,()=>{
    //         (this.owner["CaifuAni"] as Laya.FrameAnimation).play(0,false);
    //     });
    //     Laya.timer.once(6500,this,()=>{
    //         (this.owner["AiqingAni"] as Laya.FrameAnimation).play(0,false);
    //     });
    //     this.SuijiBtn.off(Laya.Event.CLICK,this,this.SuijiBtnClick);
    // }

    DanShengShow()
    {
        console.log(this.count)
        if(this.count>=3)
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
            },()=>{
                UIMgr.show("UITip",()=>{
                    this.DanSheng.visible=true;
                    this.RoleRandom();
                    Laya.timer.loop(10,this,this.GuangHuanRot)
                    // RecordManager.stopAutoRecord();
                    Laya.timer.once(3000,this,()=>{
                    this.CloseBtn.visible=true;
            })
            this.HeCheng.visible=false;
                })
            })
            
        }
        else{
            UIMgr.tip("至少增加三种属性才能够合成哦")
        }
        
    }
    RoleRandom()
    {
        // let r:number=0;
        // let a1=GameDataController.ClothDataRefresh[40504];
        // let a2=GameDataController.ClothDataRefresh[40201];
        // let a3=GameDataController.ClothDataRefresh[40306];
        // if(a1==1&&a2==1&&a3==1)
        // {
        //     r=Util.randomInRange_i(1,3);
        //     console.log("1,2,3")
        // }
        // if(a1==0&&a2==1&&a3==1)
        // {
        //     r=Util.randomInRange_i(2,3);
        //     console.log("2和3")
        // }
        // if(a1==1&&a2==0&&a3==1)
        // {
        //     r=Tools.arrayRandomGetOut([1,3],1);
        //     console.log("1和3")
        // }
        // if(a1==1&&a2==1&&a3==0)
        // {
        //     r=Util.randomInRange_i(1,2);
        //     console.log("1和2")
        // }
        // if(a1==0&&a2==0&&a3==1)
        // {
        //     r=3;
        //     console.log("只有3")
        // }
        // if(a1==1&&a2==0&&a3==0)
        // {
        //     r=1;
        //     console.log("只有1")
        // }
        // if(a1==0&&a2==1&&a3==0)
        // {
        //     r=2;
        //     console.log("只有2")
        // }
        // if(a1==0&&a2==0&&a3==0)
        // {
        //     r=Util.randomInRange_i(1,3);
        // }
        
        let r=Util.randomInRange_i(1,3);
        this.Role.skin="Active/taozhuang" + r + ".png";
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
            this.StartBtn.y=1019;
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