//import { TJ } from "../../../TJ";


export default class NativeAd extends Laya.Script
{
    //原生插屏广告
    private nativeAd: TJ.API.AdService.NativeItem;
    private defaultNode: Laya.Box = null;
    private nativetNode: Laya.Box = null;
    private icon: Laya.Image = null;
    private title: Laya.Text = null;
    private desc: Laya.Text = null;
    private contant: Laya.Image = null;

    private WatchAD: Laya.Image = null;
    onAwake()
    {
        this.defaultNode = this.owner.getChildByName("defaultNode") as Laya.Box;
        this.nativetNode = this.owner.getChildByName("nativeNode") as Laya.Box;
        this.icon = this.nativetNode.getChildByName("Icon") as Laya.Image;
        this.title = this.nativetNode.getChildByName("Title") as Laya.Text;
        this.desc = this.nativetNode.getChildByName("Des") as Laya.Text;

        this.WatchAD = this.owner.getChildByName("WatchAD") as Laya.Image;
        if (this.WatchAD)
        {
            this.WatchAD.on(Laya.Event.CLICK, this, this.Click);
        }
        this.nativetNode.on(Laya.Event.CLICK, this, this.Click);
        (this.owner as Laya.Box).visible = false;
    }
    Show()
    {
        let p=new TJ.API.AdService.Param();
        this.nativeAd = TJ.API.AdService.LoadNative(p);
        if (this.nativeAd != null)
        {
            (this.owner as Laya.Box).visible = true;
            if (this.nativeAd)
            {
                console.log("this.nativeAd = ", this.nativeAd);
                this.nativeAd.OnShow();
                this.icon.skin = this.nativeAd.iconUrl;
                this.title.text = this.nativeAd.title;
                this.desc.text = this.nativeAd.desc;
            }
        }
        else
        {
            (this.owner as Laya.Box).visible = false;
        }
    }

    Click()
    {
        if (this.nativeAd != null)
            this.nativeAd.OnClick();
    }

}