import Util from "../Frame/Util";


export default class BubbleConMy extends Laya.Box {

    isShow = true
    constructor() {
        super()
    }

    initShow() {
        this.anchorX = 1;
        this.width = 720
        this.height = 90
        this.x = 720
        this.y = 120 //this.parent["height"] / 2 - this.height / 2

        let icon = new Laya.Image("DX/icon/ZDS.jpg")
        //bg.sizeGrid = "sizeGrid=0,17,0,32";
        icon.x = 616;
        icon.y = 5;
        icon.width = 80;
        icon.height = 80;
       

        this.addChild(icon)
        let bg = new Laya.Image("DX/qipao_2.png")
        //bg.sizeGrid = "sizeGrid=0,17,0,32";
        bg.x = 467;
        bg.y = 0;
         bg.width = 133;
         bg.height = this.height;
         bg.sizeGrid = "0,17,0,32";

        this.addChild(bg)

     
        
        let txt = new Laya.HTMLDivElement()
        this.addChild(txt)
        txt.x = 476
        txt.y = 30
        txt.style.width = 106
        txt.style.height = 30
        txt.style.font = "Arial"
        txt.style.fontSize = 30
        txt.style.align="center"
        
        txt.innerHTML = ["哦哦","嗯","。。。","好的"][Util.randomInRange_i(0,3)];


        this.enterAnim()
    }

    enterAnim() {
        this.scaleX = 0.5
        this.scaleY = 0.5
        Laya.Tween.to(this,{
            scaleX:1,
            scaleY:1
        },500,Laya.Ease.backOut,Laya.Handler.create(this,()=>{
            // Laya.Tween.to(this,{
            //     y:100
            // },500,Laya.Ease.linearNone,Laya.Handler.create(this,()=>{
            //     this.isShow || (this.y = -300)
            // }),500)
        }))
    }

    hide() {
        this.isShow = false
        this.y = -300
    }
}