import PhotosChange from "../PhotosChange";
import { UIBase, OpenType } from "../../Frame/Core";
import ADManager, { TaT } from "../../Admanager";

export default class UIPhotos extends UIBase
{
    _openType = OpenType.Attach;
    FemaleRoot: Laya.Box;
    _PhotosChange: PhotosChange;
    ChangeLeft: Laya.Image;
    ChangeRight: Laya.Image;
    BackHome: Laya.Image;
    TweenskewY: Laya.Box;
    onInit()
    {
        this.FemaleRoot = this.vars("FemaleRoot");
        this._PhotosChange = this.FemaleRoot.getComponent(PhotosChange);
        this.ChangeLeft = this.vars("ChangeLeft");
        this.ChangeRight = this.vars("ChangeRight");

        this.TweenskewY = this.vars("TweenskewY")

        this.btnEv("BackHome", this.TweenOff);
        this.btnEv("ChangeLeft",this.ChangeLastPhoto);
        this.btnEv("ChangeRight",this.ChangeNextPhoto);

    }
    onShow()
    {
        ADManager.TAPoint(TaT.PageEnter,"xiangcepage")

        this.TweenskewY.skewY = -90;
        this._PhotosChange.InitMes();
        this.TweenOn();
    }

    ChangeNextPhoto()
    {
        this._PhotosChange.ChangeNextPhoto();

    }
    ChangeLastPhoto()
    {
        this._PhotosChange.ChangeLastPhoto();

    }

    TweenOn()
    {
        let a = Laya.Tween.to(this.TweenskewY, { skewY: 0 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () =>
        {

        }), 0, true, true)
    }
    TweenOff()
    {
        let a = Laya.Tween.to(this.TweenskewY, { skewY: -90 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () =>
        {
            this.hide();
        }), 0, true, true)
    }
    onHide()
    {
        ADManager.TAPoint(TaT.PageLeave,"xiangcepage");
        this.hide();
    }
}