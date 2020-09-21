import { OpenType, UIBase } from "../../Frame/Core";

export default class UINotice extends UIBase{

    _openType=OpenType.Attach;

    TextArea:Laya.Label;
    CLoseBtn:Laya.Image;

    onInit()
    {
        this.TextArea=this.vars("TextArea") as Laya.Label;
        this.CLoseBtn=this.vars("CloseBtn")as Laya.Image;

        this.TextArea.text="1: 兑换码功能和大家见面啦！\n"+
                                "    输入：111 获得白雪头发 \n"+
                                "    输入：222 获得白雪上衣 \n"+
                                "    输入：333 获得白雪长袜 \n"+
                                "    输入：444 获得白雪鞋子 \n"+
                                "    输入：555 获得白雪魔杖 \n"+
                                "    输入：123 获得汉服长裙 \n"+
                                "    输入：321 获得泳装 \n"+
                            "2: 新增绝版服装\n" ;
        this.TextArea.padding="10,10,10,50";
        this.TextArea.leading=10;

        this.btnEv("CloseBtn",()=>{
            this.hide();
        })
    }
}