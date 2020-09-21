/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import PromoOpen from "./TJ/Promo/script/PromoOpen"
import ButtonScale from "./TJ/Promo/script/ButtonScale"
import PromoItem from "./TJ/Promo/script/PromoItem"
import P201 from "./TJ/Promo/script/P201"
import P202 from "./TJ/Promo/script/P202"
import P103 from "./TJ/Promo/script/P103"
import P204 from "./TJ/Promo/script/P204"
import P205 from "./TJ/Promo/script/P205"
import P106 from "./TJ/Promo/script/P106"
import ActiveItem from "./script/Game/UI/ActiveItem"
import AppFacade from "./script/AppFacade"
import PhotosChange from "./script/Game/PhotosChange"
import PickClothChange from "./script/Game/PickClothChange"
import PickClothChangeT from "./script/Game/PickClothChangeT"
import RankItem from "./script/Game/UI/RankItem"
import ClothChange from "./script/Game/ClothChange"
import SkinItem from "./script/Game/UI/Bag/SkinItem"
import HairList from "./script/Game/UI/Bag/HairList"
import DressList from "./script/Game/UI/Bag/DressList"
import AccList from "./script/Game/UI/Bag/AccList"
import ShoesList from "./script/Game/UI/Bag/ShoesList"
import SockList from "./script/Game/UI/Bag/SockList"
import UpList from "./script/Game/UI/Bag/UpList"
import DownList from "./script/Game/UI/Bag/DownList"
import ClothBtn from "./script/Game/UI/Bag/ClothBtn"
import BagListController from "./script/Game/UI/Bag/BagListController"
import UITask_GetAward from "./../../../../../../LayaAirIDE2.5.0/LayaAirIDE (1)/resources/app/out/vs/layaEditor/src/script/Game/UITask_GetAward"
import NativeAd from "./../../../../../../LayaAirIDE2.5.0/LayaAirIDE (1)/resources/app/out/vs/layaEditor/src/script/TJ/NativeAd"
import UITask from "./../../../../../../LayaAirIDE2.5.0/LayaAirIDE (1)/resources/app/out/vs/layaEditor/src/script/Game/UITask"
import ProgressBar from "./script/Game/UI/ProgressBar"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=720;
    static height:number=1280;
    static scaleMode:string="fixedauto";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="sys/UIShop.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=true;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("TJ/Promo/script/PromoOpen.ts",PromoOpen);
        reg("TJ/Promo/script/ButtonScale.ts",ButtonScale);
        reg("TJ/Promo/script/PromoItem.ts",PromoItem);
        reg("TJ/Promo/script/P201.ts",P201);
        reg("TJ/Promo/script/P202.ts",P202);
        reg("TJ/Promo/script/P103.ts",P103);
        reg("TJ/Promo/script/P204.ts",P204);
        reg("TJ/Promo/script/P205.ts",P205);
        reg("TJ/Promo/script/P106.ts",P106);
        reg("script/Game/UI/ActiveItem.ts",ActiveItem);
        reg("script/AppFacade.ts",AppFacade);
        reg("script/Game/PhotosChange.ts",PhotosChange);
        reg("script/Game/PickClothChange.ts",PickClothChange);
        reg("script/Game/PickClothChangeT.ts",PickClothChangeT);
        reg("script/Game/UI/RankItem.ts",RankItem);
        reg("script/Game/ClothChange.ts",ClothChange);
        reg("script/Game/UI/Bag/SkinItem.ts",SkinItem);
        reg("script/Game/UI/Bag/HairList.ts",HairList);
        reg("script/Game/UI/Bag/DressList.ts",DressList);
        reg("script/Game/UI/Bag/AccList.ts",AccList);
        reg("script/Game/UI/Bag/ShoesList.ts",ShoesList);
        reg("script/Game/UI/Bag/SockList.ts",SockList);
        reg("script/Game/UI/Bag/UpList.ts",UpList);
        reg("script/Game/UI/Bag/DownList.ts",DownList);
        reg("script/Game/UI/Bag/ClothBtn.ts",ClothBtn);
        reg("script/Game/UI/Bag/BagListController.ts",BagListController);
        reg("../../../../../../LayaAirIDE2.5.0/LayaAirIDE (1)/resources/app/out/vs/layaEditor/src/script/Game/UITask_GetAward.ts",UITask_GetAward);
        reg("../../../../../../LayaAirIDE2.5.0/LayaAirIDE (1)/resources/app/out/vs/layaEditor/src/script/TJ/NativeAd.ts",NativeAd);
        reg("../../../../../../LayaAirIDE2.5.0/LayaAirIDE (1)/resources/app/out/vs/layaEditor/src/script/Game/UITask.ts",UITask);
        reg("script/Game/UI/ProgressBar.ts",ProgressBar);
    }
}
GameConfig.init();