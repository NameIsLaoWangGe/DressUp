import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import Util from "../../Frame/Util";
import PickClothChange from "../PickClothChange";

export default class UIRelation extends UIBase{


    info=[
        "你好，我是昨天与你见面的男生，今天复仇车联合电影上映了，要不，咱们一起去看吧？~",
        "那个，你今晚有空吗，朋友给了2张音乐会的门票，你愿意和我去看吗？",
        "我就在你家附近，吃了吗？要不一起吃个饭吧",
        "你好，那个，我...我就在你家楼下...我...我看你朋友圈说你发烧了,我带了退烧药,你下楼来拿一下吧",
        "晚上一起吃个饭,地址我发给你,记得准时,我不喜欢等人",
        "小姐姐啊,我在图书馆复习呢,有空来辅导一下我作业嘛?",
        "嗨,今晚我在缪斯小吧驻场,要不要来听一下",
        "走啊妹子,一起打篮球去啊,我一会来接你,赶紧的哦~",
        "那个,昨天你的伞落在我车里了,我这会给你送过去吧,你在哪儿,我来接你",
        "我听说附近有一家新开的店,要不要去试一试",
        "我新买的相机,咱们去郊游吧,我给你拍照",
        "我和朋友们准备去爬山,你要不要一起去",
        "去不去网吧开黑,差一个,就等你了,带你上分,走起!",
        "走呀,老同学,去唱歌去呀,你同桌小姐妹在这儿等你呢"
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
        this.QianWang=this.vars("QianWang")
        this.btnEv("QianWang",()=>{
            UIMgr.show("UICollection");
            this.hide();
        })
        this.Dialogue.text=this.RandomInfo();
    }
    onShow()
    {
        this._PhoneClothChange.ChangeAllCloth();
        this.RandomInfo();
        this.Dialogue.text=this.RandomInfo();
    }

    RandomInfo()
    {
        let t=Util.randomInRange_i(0,this.info.length-1);
        return this.info[t];
    }
}