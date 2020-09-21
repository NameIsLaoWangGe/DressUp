import { UIBase, OpenType } from "../../Frame/Core";
//import { TJ } from "../../../TJ";

export default class UISubTest7 extends UIBase{
    _openType = OpenType.Attach;
    _scalerIn=false;
    _fadeIn=false;


    //原生插屏广告
    public nativeAd: TJ.API.AdService.NativeItem;


    private defaultNode: Laya.Box = null;


    private nativeInsertNode: Laya.Box = null;


    private insertIcon: Laya.Image = null;


    private insertTitle: Laya.Text = null;


    private insertDes: Laya.Text = null;
    private insertContant: Laya.Image = null;
    private insertClose: Laya.Image = null;
    private event_param: string = "";

    private Chakan:Laya.Image;
    onInit()
    {
        this.defaultNode = this.vars("defaultNode") as Laya.Box;
        this.nativeInsertNode = this.vars("nativeInsertNode") as Laya.Box;
        this.insertIcon = this.vars("insertIcon") as Laya.Image;
        this.insertTitle = this.vars("insertTitle") as Laya.Text;
        this.insertDes = this.vars("insertDes") as Laya.Text;
        this.insertContant = this.vars("insertContant") as Laya.Image;
        this.insertClose = this.vars("insertClose") as Laya.Image;
        this.Chakan = this.vars("Chakan") as Laya.Image;
        this.nativeInsertNode.on(Laya.Event.CLICK,this,this.ClickNativeInsert);
        this.Chakan.on(Laya.Event.CLICK,this,this.ClickNativeInsert);
        this.insertClose.on(Laya.Event.CLICK,this,this.ClickClose);
        this.floatLight("Chakan",-61,168,10);
    }
    onShow(nad: TJ.API.AdService.NativeItem)
    {
        console.log("nad--------mes------------",nad);
        this.nativeAd=nad;

        this.Show();
    }
    Show()
    {
        this.ShowNativeInsert();
    }

    ShowNativeInsert()
    {
        (this.owner as Laya.Box).visible = true;
        this.defaultNode.visible = false;
        this.nativeInsertNode.visible = true;
        this.nativeAd.OnShow();
        this.insertIcon.skin = this.nativeAd.iconUrl;
        this.insertContant.skin = this.nativeAd.imgUrl;
        this.insertTitle.text = this.nativeAd.title;
        this.insertDes.text = this.nativeAd.desc;
    }


    ClickClose()
    {
        this.hide();
        // (this.owner as Laya.Box).visible = false;
    }
    //按钮事件 原生插屏广告按钮
    ClickNativeInsert()
    {
        var self = this;
        console.log("ClickNativeInsert");
        if (this.nativeInsertNode.visible)
        {
            this.nativeAd.OnClick();
        }
        this.ClickClose();
    }



    //统计事件
    Event(name: string)
    {
        console.log("event:" + name);
        let p = new TJ.GSA.Param()
        p.id = name;
        TJ.GSA.Api.Event(p);
    }
}