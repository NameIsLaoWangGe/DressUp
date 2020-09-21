import { UIBase, OpenType, Core, UIMgr, DataMgr, GameMgr } from "../../Frame/Core";
import ADManager from "../../Admanager";
import RecordManager from "../../RecordManager";

export default class UISettle extends UIBase
{
  _openType = OpenType.Attach;


  BtnHome: Laya.Image;


  onInit()
  {

    this.btnEv("BtnHome", () =>
    {
      this.HomeBtn();
    });
  }
  DefaultTog: boolean = true;
  TogClick()
  {

  }
  onShow()
  {
    GameMgr.playSound("success");
  }
  HomeBtn()
  {
    UIMgr.show("UISubMoneyEf", () =>
    {
      UIMgr.show("UIReady");
      this.hide();
    })
  }
  SanBeiBtn()
  {
    ADManager.Event("ADV_RDA_CLICK_003");
    ADManager.ShowReward(() =>
    {
      UIMgr.show("UISubMoneyEf", () =>
      {
        UIMgr.show("UIReady");
        this.hide();
      })
    })
  }
  ShareBtnClick()
  {
    ADManager.Event("VID_RDA_CLICK_001")
    let sus = () =>
    {

    }
    let fail = () =>
    {
      UIMgr.tip("分享失败");
    }
    RecordManager._share(sus, fail);
  }
}