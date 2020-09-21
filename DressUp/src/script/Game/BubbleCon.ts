import BubbleConMy from "./BubbleConMy";

export default class BubbleCon extends Laya.Box {

    isShow = true
    constructor() {
        super()
    }
    static iconStr:string;
    bubbleRequest:BubbleConMy;
    initShow(info) {
        this.width = 700
        this.height = 90
        this.x = this.parent["width"] / 2 - this.width / 2
        this.y = 400 //this.parent["height"] / 2 - this.height / 2
        console.log(BubbleCon.iconStr);
        let icon = new Laya.Image(BubbleCon.iconStr)
        //bg.sizeGrid = "sizeGrid=0,17,0,32";
        icon.x = 29;
        icon.y = 5;
        icon.width = 80;
        icon.height = 80;
       

        this.addChild(icon)
        let bg = new Laya.Image("DX/qipao_1.png")
        //bg.sizeGrid = "sizeGrid=0,17,0,32";
        bg.x = 140;
        bg.y = 0;
        bg.width = 540;
        bg.height = this.height;
        bg.sizeGrid = "0,17,0,32";

        this.addChild(bg)

        let proBg = new Laya.Image("resUI/img_main_qipaojindu.png")
        this.addChild(proBg)
        proBg.x = 600
        proBg.y = 58
        
        let txt = new Laya.HTMLDivElement()
        this.addChild(txt)
        txt.x = 170
        txt.y = 32
        txt.style.width = 500
        txt.style.height = 60
        txt.style.font = "Arial"
        txt.style.fontSize = 30
       
        txt.innerHTML = info.txt

        let txtPro = new Laya.Label()
        this.addChild(txtPro)
        txtPro.font = "Arial"
        txtPro.fontSize = 36
        txtPro.color = "#ffffff"
        txtPro.align = "center"
        txtPro.valign = "middle"
        txtPro.bold = true
        txtPro.width = 60
        txtPro.height = 40
        txtPro.x = 624
        txtPro.y = 75
        txtPro.text = info.pro

        this.enterAnim()
        this.bubbleRequest = new BubbleConMy();
        this.addChild(this.bubbleRequest);
        
    }

    enterAnim() {
        this.scaleX = 0.5
        this.scaleY = 0.5
        Laya.Tween.to(this,{
            scaleX:1,
            scaleY:1
        },500,Laya.Ease.backOut,Laya.Handler.create(this,()=>{
            Laya.Tween.to(this,{
                y:120
            },500,Laya.Ease.linearNone,Laya.Handler.create(this,()=>{
                this.isShow || (this.y = -300)
                this.bubbleRequest.initShow();
            }),500)
        }))
    }

    hide() {
        this.isShow = false
        this.y = -300
    }
}