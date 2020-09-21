import { BaseState, EventMgr, ObjPool, UIMgr, GameMgr } from "../../Frame/Core";
import { GameEvent } from "../Formula";

export default class Game_Settle extends BaseState{
    name = "Game_Settle";

    onInit(){

    }
    
    onEnter(args?: any){
        Laya.SoundManager.stopMusic();
        EventMgr.notify(GameEvent.save);
        EventMgr.notify(GameEvent.pause, false);
        UIMgr.interim1(()=>{
            GameMgr.fsm.to("Game_Ready");
        });
    }

    onExit(){
        
    }
}