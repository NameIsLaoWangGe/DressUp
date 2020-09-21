import { UIMgr } from "./Frame/Core";



export default class ADManager
{
    constructor()
    {

    }


    public static ShowBanner()
    {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
        {
            return;
        }
        let p = new TJ.ADS.Param();
        p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
        TJ.ADS.Api.ShowBanner(p);
    }
    public static CloseBanner()
    {
        let p = new TJ.ADS.Param();
        p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
        TJ.ADS.Api.RemoveBanner(p);
    }

    public static ShowNormal()
    {
        let p = new TJ.API.AdService.Param()
        TJ.API.AdService.ShowNormal(p);
    }
    static showNormal2()
    {
        TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
    }
    public static ShowReward(rewardAction: Function,fail:Function=null)//展示激励广告，一般是视频
    {
        if (rewardAction != null)
        {
            rewardAction();
        }
        return true;
        console.log("?????");
        let p = new TJ.ADS.Param();
        p.extraAd = true;//视频结束后通常会追加一次插屏
        let getReward = false;

        p.cbi.Add(TJ.Define.Event.Reward, () =>
        {
            getReward = true;
            if (rewardAction != null)
                rewardAction();
        });

        p.cbi.Add(TJ.Define.Event.Close, () =>
        {
            if (!getReward)
            {
                UIMgr.tip("观看完整广告才能获取奖励哦！")
                UIMgr.show("UITip",rewardAction);
            }
        });
        p.cbi.Add(TJ.Define.Event.NoAds, () =>
        {
            UIMgr.tip("暂时没有广告，过会儿再试试吧！")
        });

        TJ.ADS.Api.ShowReward(p);
    }
    static Event(param: string, value: string = null)
    {
        console.log("Param:>" + param + "Value:>" + value);
        let p = new TJ.GSA.Param()
        if (value == null)
        {
            p.id = param;
        }
        else
        {
            p.id = param + value;
        }
        console.log(p.id)
        TJ.GSA.Api.Event(p);
    }

    static wx = Laya.Browser.window.wx;
   

    static shareImgUrl = "http://image.tomatojoy.cn/bf7e3448ee1868f50a37d6518ada84d5";
    static shareContent = "快来试试制作美味的牛排吧！";
    static initShare()
    {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt)
        {
            this.wx.onShareAppMessage(() =>
            {
                return {
                    title: this.shareContent,
                    imageUrl: this.shareImgUrl,
                    query: ""
                };
            });

            this.wx.showShareMenu({
                withShareTicket: true,
                success: null,
                fail: null,
                complete: null
            });
        }
    }
    static lureShare()
    {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt)
        {
            this.wx.shareAppMessage({
                title: this.shareContent,
                imageUrl: this.shareImgUrl,
                query: ""
            });
        }
    }
    static VibrateShort()
    {
        TJ.API.Vibrate.Short();
    }
    static Vibratelong()
    {
        TJ.API.Vibrate.Long();
    }
    public static TAPoint(type: TaT, name: string)
    {
        let p = new TJ.API.TA.Param();
        p.id = name;
        switch (type)
        {
            case TaT.BtnShow:
                TJ.API.TA.Event_Button_Show(p);
                break;
            case TaT.BtnClick:
                TJ.API.TA.Event_Button_Click(p);
                break;
            case TaT.PageShow:
                TJ.API.TA.Event_Page_Show(p);
                break;
            case TaT.PageEnter:
                TJ.API.TA.Event_Page_Enter(p);
                break;
            case TaT.PageLeave:
                TJ.API.TA.Event_Page_Leave(p);
                break;
            case TaT.LevelStart:
                TJ.API.TA.Event_Level_Start(p);
                break;
            case TaT.LevelFail:
                TJ.API.TA.Event_Level_Fail(p);
                break;
            case TaT.LevelFinish:
                TJ.API.TA.Event_Level_Finish(p);
                break;
        }
    }
}

export enum TaT
{
    BtnShow,
    BtnClick,
    PageShow,
    PageEnter,
    PageLeave,
    LevelStart,
    LevelFinish,
    LevelFail
}