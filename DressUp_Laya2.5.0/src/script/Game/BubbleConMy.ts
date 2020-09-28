import Util from "../Frame/Util";


export default class BubbleConMy extends Laya.Box {

    isShow = true
    constructor() {
        super()
    }

    initShow() {
        this.anchorX = 1;
        this.width = 720
        this.height = 120
        this.x = 720
        this.y = 120 //this.parent["height"] / 2 - this.height / 2

        let icon = new Laya.Image("DX/Duihua/touxiang-2.png")
        //bg.sizeGrid = "sizeGrid=0,17,0,32";
        icon.x = 613;
        icon.y = 18;
        icon.width = 85;
        icon.height = 85;
       

        this.addChild(icon)
        let bg = new Laya.Image("DX/Duihua/pipao.png")
        // bg.sizeGrid = "sizeGrid=14,8,15,36";
        bg.anchorX=0.5;
        bg.anchorY=0.5
        bg.scaleX=-1;
        bg.x = 397;
        bg.y = 60;
         bg.width = 434;
         bg.height = 90;
         bg.sizeGrid = "14,8,15,36";

        this.addChild(bg)

     
        
        let txt = new Laya.HTMLDivElement()
        this.addChild(txt)
        txt.x = 217
        txt.y = 45.5
        // txt.style.width = 106
        // txt.style.height = 30
        txt.style.wordWrap=false;
        txt.style.font = "SimHei"
        txt.style.fontSize = 30
        txt.style.align="center"
        txt.style.valign="middle"
        txt.style.color="#626262"
        
        txt.innerHTML = ["嗯。。。好的,我知道了","嘿嘿，好呀","嗯呢，我记下来了","等下等下,我找找笔,记下来","嗯呢，我画下来了","好的，我记住啦","慢点慢点，我记不住","哎呀知道了"][Util.randomInRange_i(0,7)];


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