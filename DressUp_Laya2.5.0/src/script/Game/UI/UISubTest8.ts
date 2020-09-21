import { UIBase, OpenType, UIMgr } from "../../Frame/Core";
import ADManager from "../../Admanager";
//import { TJ } from "../../../TJ";


export default class UISubTest8 extends UIBase
{
    _openType=OpenType.Attach;
    //原生插屏广告
    private nativeAd: TJ.API.AdService.NativeItem;
    private defaultNode: Laya.Box = null;
    private nativetNode: Laya.Box = null;
    private icon: Laya.Image = null;
    private title: Laya.Text = null;
    private desc: Laya.Text = null;
    private contant: Laya.Image = null;
    private NativeRoot: Laya.Box = null;
    private WatchAD: Laya.Image = null;
    private Close:Laya.Image=null;
    private Bg:Laya.Image=null;
    onInit()
    {
        console.log("normal  8=============");
        this.defaultNode = this.vars("defaultNode") as Laya.Box;
        this.nativetNode = this.vars("nativeNode") as Laya.Box;
        this.NativeRoot = this.vars("NativeRoot") as Laya.Box;
        this.Bg = this.vars("Bg") as Laya.Image;
        this.icon = this.vars("Icon") as Laya.Image;
        this.title = this.vars("Title") as Laya.Text;
        this.desc = this.vars("Des") as Laya.Text;
        this.WatchAD = this.vars("WatchAD") as Laya.Image;
        this.Close=this.vars("Close") as Laya.Image;
        this.contant=this.vars("Contant")as Laya.Image;
        this.btnEv("Close",this.CloseAll);
        if (this.WatchAD)
        {
            this.WatchAD.on(Laya.Event.CLICK, this, this.Click);
        }
        this.Bg.visible=false;
        this.nativetNode.on(Laya.Event.CLICK, this, this.Click);
        this.NativeRoot.visible=false;
    }
    onShow()
    {
        this.Show();
    }
    CloseAll()
    {
        this.hide();
    }
    Show()
    {
        console.log("展示原生插屏");
        let p=new TJ.API.AdService.Param();
        this.nativeAd = TJ.API.AdService.LoadNative(p);
        console.log("展示原生插屏? native=", this.nativeAd);
        if (this.nativeAd != null)
        {
            console.log("可以展示原生插屏? native=", this.nativeAd);
            this.NativeRoot.visible = true;
            this.Bg.visible=true;
            if (this.nativeAd)
            {
                console.log("原生插屏this.nativeAd = ", this.nativeAd);
                this.nativeAd.OnShow();
                this.icon.skin = this.nativeAd.iconUrl;
                this.title.text = this.nativeAd.title;
                this.desc.text = this.nativeAd.desc;
                this.contant.skin=this.nativeAd.imgUrl;
            }
        }
        else
        {
            console.log("展示原生插屏失败native");
            this.NativeRoot.visible = false;
            this.Bg.visible=false;
            this.CloseAll();
            ADManager.showNormal2();
           
        }
    }

    Click()
    {
        if (this.nativeAd != null){
            this.nativeAd.OnClick();
        }
        this.CloseAll();
    }

}