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
        // let icon = new Laya.Image(BubbleCon.iconStr)
        let icon= new Laya.Image("Relation/jianying.png");
        //bg.sizeGrid = "sizeGrid=0,17,0,32";
        icon.x = 9;
        icon.y = 0;
        icon.width = 106;
        icon.height = 142;
        this.addChild(icon)

        let mark=new Laya.Image("DX/Duihua/touxiang.png");
        mark.x=54
        mark.y=49;
        mark.anchorX=0.5;
        mark.anchorY=0.5
        icon.mask=mark;
        


        let bg = new Laya.Image("DX/Duihua/pipao.png")
        //bg.sizeGrid = "sizeGrid=0,17,0,32";
        bg.x = 116;
        bg.y = 0;
        bg.width = 540;
        bg.height = this.height;
        bg.sizeGrid = "15,11,11,26";

        this.addChild(bg)

        let proBg = new Laya.Image("main/queding.png")
        this.addChild(proBg)
        proBg.x = 602
        proBg.y = 71
        proBg.scaleX=0.5;
        proBg.scaleY=0.5;
        
        let txt = new Laya.HTMLDivElement()
        this.addChild(txt)
        txt.x = 147
        txt.y = 15
        txt.style.align="center";
        txt.style.valign="middle"
        txt.style.width = 500
        txt.style.height = 60
        txt.style.font = "SimHei"
        txt.style.fontSize = 30
        txt.style.color="#626262";
       
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
                y:140
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