import ADManager from "../../../Admanager";
import { UIMgr } from "../../../Frame/Core";
import GameDataController from "../../GameDataController";
import { ManData } from "../../ManConfigData";
import UICollection from "../UICollection";

export default class CollectionItem extends Laya.Script{

    IconParent:Laya.Box;
    Icon:Laya.Image;
    
    name:Laya.Label;
    description:Laya.Label;
    Lock:Laya.Image;
    /* 魅力值解锁*/
    charm:Laya.Box;
    condition:Laya.Label;
    /* 广告解锁*/
    ad:Laya.Box;
    adNum:Laya.Label;

    StarBox:Laya.Box;
    WidthtMax:number=210;
    HeightMax:number=270;

    ID:number;
    Data:ManData;

    count:number=0;

    str={};
    event:Laya.Box;
    onAwake()
    {
        let item=this.owner as Laya.Box;
        this.event=item.getChildByName("event") as Laya.Box;
        this.IconParent=item.getChildByName("IconParent") as Laya.Box;
        this.Icon=this.IconParent.getChildByName("Icon") as Laya.Image;
        this.name=item.getChildByName("name") as Laya.Label;
        this.description=item.getChildByName("description") as Laya.Label;
        this.Lock=item.getChildByName("Lock") as Laya.Image;
        this.charm=this.Lock.getChildByName("charm") as Laya.Box;
        this.condition=this.charm.getChildByName("condition") as Laya.Label;
        this.ad=this.Lock.getChildByName("ad") as Laya.Box;
        this.adNum=this.ad.getChildByName("adNum") as Laya.Label
        this.StarBox=item.getChildByName("StarBox") as Laya.Box;

        this.event.on(Laya.Event.CLICK,this,this.itemClick);
    }

    fell(data:ManData)
    {
        this.Data=data;
        this.ID=data.ID;
        let star:number=GameDataController.ManStarRefresh[data.ID];
        if(star<=3)
        {
            this.Icon.skin=data.GetIconPath(star-1);
        }
        else
        {
            this.Icon.skin=data.GetIconPath(2);
        }
        
        //--------------------
        this.IconParent.centerX=0;
        this.IconParent.centerY=0
        this.IconParent.width=213;
        this.IconParent.height=274;
        this.Icon.left=0;
        this.Icon.right=0;
        this.Icon.top=0;
        this.Icon.bottom=0
        //------------------------
        this.name.text=data.Name;
        this.description.text=data.Des;
        this.Lock.visible=!GameDataController.ManCanUse(data.ID);
        if(data.WatchAD==0)
        {
            this.charm.visible=false;
            this.ad.visible=true;
            this.adNum.text=this.count+"/"+data.ADNum;
        }
        else
        {
            this.charm.visible=true;
            this.condition.text="魅力值:"+data.Charm +"解锁";
            this.ad.visible=false;
        } 
        this.StarShow(GameDataController.ManStarRefresh[data.ID]);
        this.Icon.centerX = 0;
        this.Icon.centerY = 0;

       this.str=GameDataController.ManDataRefresh;
    }
    
    StarShow(num:number)
    {
        switch(num)
        {
            case 0:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                break;
            case 1:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                break;
            case 2:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(1)as Laya.Image).visible=true;
                break;
            case 3:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(1)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(2)as Laya.Image).visible=true;
                break
            case 4:
                for (let index = 0; index < this.StarBox.numChildren; index++) {
                    (this.StarBox.getChildAt(index)as Laya.Image).visible=false;
                }
                (this.StarBox.getChildAt(0)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(1)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(2)as Laya.Image).visible=true;
                (this.StarBox.getChildAt(3)as Laya.Image).visible=true;
                break
        }
    }
    itemClick()
    {
        if(this.Lock.visible)//当前上锁
        {
            if(this.charm.visible)
            {
                if(Number(GameDataController.CharmValue)>=this.Data.Charm)
                {
                    // GameDataController.ManDataRefresh[this.Data.ID]==0;//解锁
                    this.str[this.Data.ID]=0;
                    GameDataController.ManDataRefresh=this.str;
                    (UIMgr.get("UICollection")as UICollection).onRefresh();
                    UIMgr.tip("恭喜解锁");
                    GameDataController.man=this.Data;
                    UIMgr.show("UIDraw");
                    (UIMgr.get("UICollection") as UICollection).onHide();
                }
                else
                {
                    UIMgr.tip("你的魅力值还不够哦")
                }
            }
            if(this.ad.visible)
            {
                ADManager.ShowReward(()=>{
                    this.count+=1;
                    this.adNum.text=this.count+"/"+this.Data.ADNum;
                    if(this.count>=this.Data.ADNum)
                    {
                        this.str[this.Data.ID]=0;
                        GameDataController.ManDataRefresh=this.str;
                        (UIMgr.get("UICollection")as UICollection).onRefresh();
                        UIMgr.tip("恭喜解锁");
                        GameDataController.man=this.Data;
                        UIMgr.show("UIDraw");
                        (UIMgr.get("UICollection") as UICollection).onHide();
                    }
                })
            }
        }
        else
        {
            GameDataController.man=this.Data;
            UIMgr.show("UIDraw");
            (UIMgr.get("UICollection") as UICollection).onHide();
        }
    }
}