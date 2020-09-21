import { BaseState, UIMgr, GameMgr } from "../../Frame/Core";

export default class Game_Main extends BaseState{
    name = "Game_Main";

    onInit(){
    }
    
    onEnter(args?: any){
        UIMgr.show("UIMain");
        GameMgr.playMusic("bgm");
    }
    
    onExit(){
        
    }
}