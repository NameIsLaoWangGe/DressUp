import { BaseState, UIMgr, ObjPool, DataMgr, GameMgr } from "../../Frame/Core";


export default class Game_Ready extends BaseState
{
    name = "Game_Ready";

    onInit()
    {
      


    }

    onEnter()
    {
        UIMgr.show("UIReady");
    }

    onExit()
    {
    }
}
