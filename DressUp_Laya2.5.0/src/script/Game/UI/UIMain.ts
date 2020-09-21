import { UIBase, UIMgr, EventMgr, Core, DataMgr, TweenMgr } from "../../Frame/Core";
import { Tools } from "./Tools";
import ProgressBar from "./ProgressBar";

export default class UIMain extends UIBase
{ 
    TouchArea: Laya.Image;
    onInit()    
    {
        this.TouchArea.on(Laya.Event.CLICK, this, () =>
        {
            this.Mouse_Click();

        })
        this.TouchArea.on(Laya.Event.MOUSE_MOVE, this, () =>
        {
            this.Mouse_Move();

        })
        this.TouchArea.on(Laya.Event.MOUSE_UP, this, () =>
        {
            this.Mouse_Up();

        })
        this.TouchArea.on(Laya.Event.MOUSE_DOWN, this, () =>
        {
            this.Mouse_Down();
            Laya.timer.loop(100, this, this.timeradd);
        })
        this.TouchArea.on(Laya.Event.MOUSE_OUT, this, () =>
        {
            this.Mouse_Up();
        })
    }
    timeradd()
    {

    }
    onShow()
    {
      
    }
    Mouse_Click()
    {

    }

    Mouse_Move()
    {
  
    }
    Mouse_Up()
    {
 

    }
    Mouse_Down()
    {

    }
    TimerUpdate()
    {

    }
    update()
    {
        
    }
    onHide()
    {
        // console.log(this.cr);
    }
    TimeControoler()
    {
       
    }

    TimeStart()
    {
        Laya.timer.loop(10, this, this.TimeControoler);
    }
    TimeStop()
    {
        Laya.timer.clear(this, this.TimeControoler);
    }
}