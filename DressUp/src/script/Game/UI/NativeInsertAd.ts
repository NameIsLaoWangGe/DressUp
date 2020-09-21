import { UIMgr } from "../../Frame/Core";
//import { TJ } from "../../../TJ";



export default class NativeInsertAd extends Laya.Script
{

    public static Show(nad: TJ.API.AdService.NativeItem)
    {
        UIMgr.show("UISubTest7",nad);
    }
}
