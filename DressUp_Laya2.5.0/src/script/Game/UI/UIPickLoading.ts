import { OpenType, UIBase, UIMgr } from "../../Frame/Core";

export default class UIPickLoading extends UIBase
{
    _openType=OpenType.Attach;
    loading:Laya.Image;

    onInit()
    {
        this.loading=this.vars("loading") as Laya.Image;
    }

    onShow()
    {
        Laya.timer.loop(10,this,this.onValueChange);
    }

    onValueChange()
    {
        if(this.loading.width>=434)
        {
            this.loading.width=434;
            Laya.timer.clear(this,this.onValueChange);
            Laya.timer.once(1000,this,()=>{
                this.hide();
                UIMgr.show("UIPick");
            })
        }
        this.loading.width+=5;
    }
    onHide()
    {
        this.loading.width=0;
    }
}