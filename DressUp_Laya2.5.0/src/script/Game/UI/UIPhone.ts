import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import Util from "../../Frame/Util";
import PickClothChange from "../PickClothChange";
import { Tools } from "./Tools";


export default class UIPhone extends UIBase
{
    info=[
        "你怎么回事，给你介绍的对象已经在餐厅等你了。别让别人等着急了，打扮一下赶紧出门吧。",
        "小囡啊，你张叔叔家的孩儿，那可是一表人才哦，名牌大学生~要不你去看看？~换身衣服，出门吧~",
        "你不是喜欢听歌嘛~这不你李阿姨家的儿子,正好演出在咱们这儿,你去招待一下吧,他一个人人生地不熟的,换身衣服,出门吧~",
        "你看看,都几点了,还不出门,人家都到了~快~搞快点搞快点~~",
        "你老妈昨天和我跳广场舞的时候,和我说了,你妈都着急死了,我这立马就给你物色了个对象,赶紧去看看吧~",
        "姑娘啊，我家大侄子，前几天聊得怎么样啊，要是合适，再聊聊看看咋样被？~人买好了2张电影票，要不要去看看去~",
    ]

    _openType=OpenType.Attach;
    _PhoneClothChange:PickClothChange;
    FemaleRoot: Laya.Box;
    Dialogue :Laya.Label;
    QianWang:Laya.Image;
    onInit()
    {
        this.FemaleRoot = this.vars("FemaleRoot") as Laya.Box;
        this._PhoneClothChange=this.FemaleRoot.getComponent(PickClothChange);
        this.Dialogue=this.vars("Dialogue")as Laya.Label;
         this.QianWang=this.vars("QianWang") as Laya.Image;
         this.btnEv("QianWang",()=>{
             UIMgr.show("UICollection");
             console.log(Laya.stage);
             console.log("xxxxxxxxxxxxxx")
             this.hide();
         })
    }
    onShow()
    {
        this._PhoneClothChange.ChangeAllCloth();
        this.RandomInfo()
        this.Dialogue.text=this.RandomInfo();
    }

    RandomInfo()
    {
        let t=Util.randomInRange_i(0,this.info.length-1);
        return this.info[t];
    }
}