import { G, GameMgr } from "./Frame/Core";
import Game_Init from "./Game/State/Game_Init";
import Game_Ready from "./Game/State/Game_Ready";
import Game_Main from "./Game/State/Game_Main";
import Game_Settle from "./Game/State/Game_Settle";
import UIPreload from "./Game/UI/UIPreload";
import UIReady from "./Game/UI/UIReady";
import UIMain from "./Game/UI/UIMain";
import UISettle from "./Game/UI/UISettle";
import UISubTest7 from "./Game/UI/UISubTest7";
import UISubTest8 from "./Game/UI/UISubTest8";
import UISubMoneyEf from "./Game/UI/UISubMoneyEf";
import UIActive from "./Game/UI/UIActive";
import UISign from "./Game/UI/UISign";
import UIPhotos from "./Game/UI/UIPhotos";
import UITest from "./Game/UI/UITest";
import UIWing from "./Game/UI/UIWing";
import UITip from "./Game/UI/UITip";
import UIPick from "./Game/UI/UIPick";
import UIRank from "./Game/UI/UIRank"
import UIPickLoading from "./Game/UI/UIPickLoading";
import UIPickReward from "./Game/UI/UIPickReward";
import UICombine from "./Game/UI/UICombine";
import UIDuiHuan from "./Game/UI/UIDuiHuan";
import UINotice from "./Game/UI/UINotice";
import UIDraw from "./Game/UI/UIDraw";
import UITask from "./Game/UI/UITask";
import UIWeddingEgg from "./Game/UI/UIWeddingEgg";
import UIPickEgg from "./Game/UI/UIPickEgg";
import UIWeddingShare from "./Game/UI/UIWeddingShare";
import UISpinning from "./Game/UI/UISpinning";
import UIChangE from "./Game/UI/UIChangE";
import UIXiaoHM from "./Game/UI/UIXiaoHM";

G["Game_Init"] = Game_Init;
G["Game_Ready"] = Game_Ready;
G["Game_Main"] = Game_Main;
G["Game_Settle"] = Game_Settle;
//-------------------custom---------------------
G["UIPreload"] = UIPreload;
G["UIReady"] = UIReady;
G["UIMain"] = UIMain;
G["UISettle"] = UISettle;
G["UIActive"] = UIActive;
G["UISubMoneyEf"] = UISubMoneyEf;
G["UISign"] = UISign;
G["UIPhotos"] = UIPhotos;
G["UITest"]=UITest;
G["UIWing"]=UIWing;
G["UITip"]=UITip;
G["UIPick"]=UIPick;
G["UIRank"]=UIRank;
G["UIPickLoading"]=UIPickLoading;
G["UIPickReward"]=UIPickReward;
G["UICombine"]=UICombine;
G["UIDuiHuan"]=UIDuiHuan;
G["UINotice"]=UINotice;
G["UIDraw"]=UIDraw;
G["UITask"]=UITask;
G["UIWeddingEgg"]=UIWeddingEgg;
G["UIPickEgg"]=UIPickEgg;
G["UIWeddingShare"]=UIWeddingShare;
G["UISpinning"]=UISpinning;
G["UIChangE"]=UIChangE;
G["UIXiaoHM"]=UIXiaoHM;
export default class AppFacade extends Laya.View
{
    constructor()
    {
        super();
    }

    onOpened()
    {
        GameMgr.start();
    }
}