import { BaseState, GameMgr, DataMgr } from "../../Frame/Core";
import { UIMgr } from "../../Frame/Core";
import ADManager, { TaT } from "../../Admanager";
import GameDataController from "../GameDataController";

export default class Game_Init extends BaseState
{
    name = "Game_Init";





    onInit()
    {
        GameDataController.windowWidth = Laya.Browser.width;
        if (DataMgr.getPlayerData("newPlay") == 0)
        {
            ADManager.Event("NEW_LOAD_START");
        }
        else
        {
            ADManager.Event("OLD_LOAD_START");
        }
        Laya.MouseManager.multiTouchEnabled = false;
        UIMgr.show("UIPreload");
    }

    onEnter(args?: any)
    {
    }

    onExit()
    {

    }
}