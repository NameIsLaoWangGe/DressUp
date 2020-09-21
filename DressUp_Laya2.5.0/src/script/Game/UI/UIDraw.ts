import ADManager from "../../Admanager";
import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import Util from "../../Frame/Util";
import RecordManager from "../../RecordManager";
import ClothData from "../ClothData";
import GameDataController from "../GameDataController";
import BagListController from "./Bag/BagListController";
import { Tools } from "./Tools";


export default class UIDraw extends UIBase
{
    _openType=OpenType.Attach;

        public UIBox:Laya.Box;
		public SliderBox:Laya.Box;
		public Board:Laya.Box;
		public imgBg:Laya.Sprite;
        public imgRubber:Laya.Image;
        public Colorfen:Laya.Image;
        public Colorlan:Laya.Image;
		public imgGou:Laya.Image;
		public DrawBox:Laya.Box;
		public btnClear:Laya.Button;
        public btnNext:Laya.Button;
        public BackBtn:Laya.Image;
        drawBoard:Laya.Sprite
        sliderDownPos:Laya.Point
        sliderLastPos:Laya.Point
        nowCaseClue = []
        nowClueID = 1
        lastPos = null
        offsetLen = 10
        lineWidth = 12
        drawMinX = 0
        drawMaxX = 0
        drawMinY = 0
        drawMaxY = 0
        boardDrawY = 0
        isTouchOnDraw = false
        isOnBoardAnim = false
        isBoardUp = false
        nowColorID = 0
        lineArr = []
        isSliderClick = true
        colorArr = [
            "#303030",
            "#b7b7b7",
            "#FF69B4",
            "#FF00FF",
            // "#2e4480",
            "#00BFFF",
            "#00FF00",
            "#f1e168",
            // "#dba454",
            // "#c05148",
            // "#977049",
            // "#4f301b"
        ]
        paintInited = false;

        numPdaye:number=0;
        numPxiaoye:number=0;
        numPlangong:number=0;

        //随机
        trySkinCount:number;

        GetBox:Laya.Box;
        Guang:Laya.Image;
        ADBtn:Laya.Image;
        Icon:Laya.Image;
        CloseBtn:Laya.Image;
        ShareBtn:Laya.Image;

        arr=[];
        data:ClothData;

        onAwake(): void {
            
            for(let k in GameDataController.ClothDataAsy)
            {
                if(GameDataController.ClothDataAsy[k]==1&&!GameDataController._ClothData.get(parseInt(k)).GetType2)
                {
                    if(!((k=="10000")||(k=="10001")||(k=="10002")))
                    {
                        this.arr.push(k);
                    } 
                }
            }
           
            console.log(this.arr)
            console.log("xxxxxxxxxxxxx")
          
            this.Colorlan = this.vars("Colorlan") ;
            this.Colorfen = this.vars("Colorfen");

            this.UIBox = this.vars("UIBox");
            this.SliderBox = this.vars("SliderBox");
            this.Board = this.vars("Board");
            this.imgBg = this.vars("imgBg");
            this.imgRubber = this.vars("imgRubber");
            this.DrawBox = this.vars("DrawBox");
            this.imgGou = this.vars("imgGou");
            this.btnClear = this.vars("btnClear");

            this.GetBox=this.vars("GetBox") as Laya.Box;
            this.Guang=this.GetBox.getChildByName("Guang") as Laya.Image;
            this.ADBtn=this.GetBox.getChildByName("ADBtn") as Laya.Image;
            this.Icon=this.GetBox.getChildByName("Icon") as Laya.Image;
            this.CloseBtn=this.GetBox.getChildByName("CloseBtn") as Laya.Image;
            this.ShareBtn=this.GetBox.getChildByName("ShareBtn")as Laya.Image;
            this.btnEv("CloseBtn",()=>{
                this.hide();
            })
            this.btnEv("ADBtn",this.ADBtnClick);
            this.ShareBtn.on(Laya.Event.CLICK,this,this.ShareBtnClick);

  
            this.btnNext = this.vars("btnNext"); 
            this.BackBtn=this.vars("BackBtn");

            this.Colorlan.on(Laya.Event.CLICK,this,this.onColorlan)
            this.Colorfen.on(Laya.Event.CLICK,this,this.onColorfen)

            this.btnClear.on(Laya.Event.CLICK,this,this.onClickClear)
            this.btnNext.on(Laya.Event.CLICK,this,this.onClickNext)

            this.BackBtn.on(Laya.Event.CLICK,this,()=>{
                RecordManager.stopAutoRecord();//停止录屏
                this.hide();
            })
            
            this.SliderBox.on(Laya.Event.MOUSE_DOWN,this,this.onSliderDown)
            this.SliderBox.on(Laya.Event.MOUSE_MOVE,this,this.onSliderMove)
            this.SliderBox.on(Laya.Event.MOUSE_UP,this,this.onSliderUp)
        
    
            for (let i = 1; i <= 7; i++) {
                this.Board.getChildByName("imgColor"+i).on(Laya.Event.CLICK,this,this.onClickColor,[i-1])
            }
            this.imgRubber.on(Laya.Event.CLICK,this,this.onClickColor,[-1])
            this.refreshShow()
    
            this.drawMinX = this.lineWidth / 2
            this.drawMaxX = this.DrawBox.width - this.lineWidth / 2
            this.drawMinY = this.lineWidth / 2
            this.drawMaxY = this.DrawBox.height - this.lineWidth / 2

            this.btnNext.visible = true
            this.SliderBox.visible = false
            this.boardDrawY = this.UIBox.height - this.Board.height //- 80
           
            this.paintInited = true;
            this.onEventFailAgain();

            if(Number(Laya.LocalStorage.getItem("cncountlan")=="1")){
                this.Colorlan.visible=false;
            }else{
                this.Colorlan.visible=true;
            }
            if(Number(Laya.LocalStorage.getItem("cncountfen")=="1")){
                this.Colorfen.visible=false;
            }else{
                this.Colorfen.visible=true;
            }

           
        
            this.trySkinCount = Util.randomInRange_i(1,3);
            
        }

        onShow()
        {
            RecordManager.startAutoRecord();//开始录屏
            Laya.timer.once(3000,this,()=>{
                this.BackBtn.visible=true;
            })
            this.GetBox.visible=false;
            this.CloseBtn.visible=false;
            this.ADBtn.visible=true;
            this.ShareBtn.visible=false;
        }
        onHide()
        {
            RecordManager.stopAutoRecord();//停止录屏
            this.onClickClear();//清除画板
            this.GetBox.visible=false;
            this.CloseBtn.visible=false;
            this.BackBtn.visible=false;
        }
     

        onClickNext(){
            console.log("确认完成");
            this.onClickClear();//清除画板
            if(this.arr.length==0)
            {
                UIMgr.tip("你已经解锁了全部的服饰哦~")
            }
            let t=Tools.arrayRandomGetOut(this.arr,1);
            console.log(t);
            let cloth:ClothData=GameDataController._ClothData.get(parseInt(t));
            this.data=cloth;
            this.GetBoxShow();
            console.log(this.data);
        }
        GetBoxShow()
        {
            this.GetBox.visible=true;
            Laya.timer.loop(10,this,this.GuangRot);
            this.Icon.skin= this.data.GetPath1();
            Laya.timer.once(3000,this,()=>{
                RecordManager.stopAutoRecord();//停止录屏
                this.CloseBtn.visible=true;
            })
        }
        GuangRot()
        {
            this.Guang.rotation+=2;
        }
        ADBtnClick()
        {
            ADManager.ShowReward(()=>{
                this.GetAward();
            },()=>{
                UIMgr.show("UITip",this.GetAward);
            })
        }
        GetAward()
        {
            let dataall = GameDataController.ClothDataRefresh;
            dataall[this.data.ID]=0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.showList();
            BagListController.Instance.refresh();
            UIMgr.tip("成功解一件新的装扮!");
            this.ADBtn.visible=false;
            Laya.timer.once(1000,this,()=>{
                this.ShareBtn.visible=true;
            })
        }
        ShareBtnClick()
        {
            RecordManager._share(()=>{
                UIMgr.tip("视频分享成功！");
            },()=>{
                UIMgr.tip("视频分享失败...");
            })
        }

        cncountlan=0;
        onColorlan(){
            this.cncountlan = Number(Laya.LocalStorage.getItem("cncountlan"));
            ADManager.ShowReward(() => {
                console.log("看视频解锁蓝色");
                this.Colorlan.visible=false;
                this.cncountlan=1;
                Laya.LocalStorage.setItem("cncountlan",this.cncountlan.toString()); 
            })
        }
        cncountfen=0;
        onColorfen(){
            this.cncountfen = Number(Laya.LocalStorage.getItem("cncountfen"));
            ADManager.ShowReward(() => {
                console.log("看视频解锁粉色");
                this.Colorfen.visible=false;
                this.cncountfen=1;
                Laya.LocalStorage.setItem("cncountfen",this.cncountfen.toString()); 
            })
        }
    
        addDrawEvent() {
           
            this.DrawBox.on(Laya.Event.MOUSE_DOWN,this,this._onMouseDown)
            this.DrawBox.on(Laya.Event.MOUSE_MOVE,this,this._onMouseMove)
            this.DrawBox.on(Laya.Event.MOUSE_UP,this,this._onMouseUP)
        }
    
        removeDrawEvent() {
            this.DrawBox.off(Laya.Event.MOUSE_DOWN,this,this._onMouseDown)
            this.DrawBox.off(Laya.Event.MOUSE_MOVE,this,this._onMouseMove)
            this.DrawBox.off(Laya.Event.MOUSE_UP,this,this._onMouseUP)
        }
    
        upBoardAnim() {
            if (this.isOnBoardAnim) {
                return
            }
            this.isOnBoardAnim = true
            Laya.Tween.to(this.Board,{
                y:this.boardDrawY + 300
            },500,Laya.Ease.backOut,Laya.Handler.create(this,()=>{
                this.isOnBoardAnim = false
            }))
        }
    
        downBoardAnim() {
            if (this.isOnBoardAnim) {
                return
            }
            this.isOnBoardAnim = true
            Laya.Tween.to(this.Board,{
                y:this.boardDrawY + 300 + 100
            },500,Laya.Ease.backOut,Laya.Handler.create(this,()=>{
                this.isOnBoardAnim = false
            }))
        }
    
        //清除画板
        onClickClear() {
       
            this.DrawBox.destroyChildren()
            this.lineArr = []
        }

      

      
       
    
        onClickUp() {
  
            if (!this.isOnBoardAnim) {
                if (this.isBoardUp) {
                    this.downBoardAnim()
                } else {
                    this.upBoardAnim()
                }
                this.isBoardUp = !this.isBoardUp
            }
        }
    
        onClickCatch(event:Laya.Event) {
         
            event.stopPropagation()
        }
    
        onClickColor(ID) {
            this.nowColorID = ID
            this.refreshShow()
        }
    
        refreshShow() {
            let node:any = this.imgRubber
            if (this.nowColorID != -1) {
                node = this.Board.getChildByName("imgColor"+(this.nowColorID+1))
            }
            this.imgGou.x = node.x + 30
            this.imgGou.y = node.y + 35
        }
    
        
        _onMouseDown(event:Laya.Event) {
            this.isTouchOnDraw = true
            this.mergeBoard()
    
            if (this.nowColorID != -1) {
                let board = new Laya.Sprite()
                board.width = this.DrawBox.width
                board.height = this.DrawBox.height
                board.cacheAs = "bitmap"
                this.DrawBox.addChild(board)
                this.lineArr.push(board)
            }
            this.lastPos = new Laya.Point(event.stageX-this.Board.x-this.DrawBox.x,event.stageY-this.Board.y-this.DrawBox.y)
            this.nowBoard.graphics.drawCircle(this.lastPos.x,this.lastPos.y,this.nowLineWidth/2,this.nowColor);
        }
    
        _onMouseMove(event:Laya.Event) {
            if (this.isTouchOnDraw) {
                let touchPos = new Laya.Point(event.stageX-this.Board.x-this.DrawBox.x,event.stageY-this.Board.y-this.DrawBox.y)
                this.drawLine(touchPos)
            }
        }
    
        _onMouseUP(event:Laya.Event) {
            this.isTouchOnDraw = false

        }
    
        onSliderDown(event:Laya.Event) {
            event.stopPropagation()
            this.sliderDownPos = new Laya.Point(event.stageX,event.stageY)
            this.isSliderClick = true
           
        }
    
        onSliderMove(event:Laya.Event) {
            // CamFollow.ins._onMouseMove();
            // event.stopPropagation()
            // if (!this.sliderDownPos) {
            //     return
            // }
            // if (this.isSliderClick) {
            //     let offsetX = event.stageX - this.sliderDownPos.x
            //     let offsetY = event.stageY - this.sliderDownPos.y
            //     if (offsetX*offsetX + offsetY*offsetY > 4) {
            //         this.isSliderClick = false
            //     }
            // }
            
            // GameMgr.ins.pickSuspectMove(event.stageX-this.sliderLastPos.x)
            // this.sliderLastPos.x = event.stageX
            // this.sliderLastPos.y = event.stageY
        }
    
        onSliderUp(event:Laya.Event) {
            // CamFollow.ins._onMouseUp();
            // if (!this.sliderDownPos) {
            //     return
            // }
            // if (this.isSliderClick) {
            //     let offsetX = event.stageX - this.sliderDownPos.x
            //     let offsetY = event.stageY - this.sliderDownPos.y
            //     if (offsetX*offsetX + offsetY*offsetY > 4) {
            //         this.isSliderClick = false
            //     }
            // }
    
            // if (this.isSliderClick) {
            //     let isSuc = GameMgr.ins.clickSuspect(new Laya.Vector2(event.stageX,event.stageY))
            //     if (isSuc) {
            //         event.stopPropagation()
            //         this.btnCatch.visible = false
            //     }
            // }
            // this.sliderDownPos = null
        }
    
        onEventFailAgain() {
            this.nowClueID = 1

            this.SliderBox.visible = false
            this.UIBox.visible = true
    
            this.Board.y = this.boardDrawY
            this.toWitness()
        }
    
        onEventPickAgain() {

            this.UIBox.visible = true

        }
    
        drawLine(nowPos) {
            //极限处理
            nowPos.x > this.drawMaxX && (nowPos.x = this.drawMaxX)
            nowPos.x < this.drawMinX && (nowPos.x = this.drawMinX)
            nowPos.y > this.drawMaxY && (nowPos.y = this.drawMaxY)
            nowPos.y < this.drawMinY && (nowPos.y = this.drawMinY)
            
            //画线
            let offsetX = nowPos.x-this.lastPos.x
            let offsetY = nowPos.y-this.lastPos.y
            if (offsetX*offsetX + offsetY*offsetY >= this.offsetLen*this.offsetLen) {
                this.nowBoard.graphics.drawLine(this.lastPos.x,this.lastPos.y,nowPos.x,nowPos.y,this.nowColor,this.nowLineWidth)
                // let nowRot =  Math.atan2(offsetY,offsetX) * 180 / Math.PI
                // if (this.lastRot != null && Math.abs(nowRot - this.lastRot) > 0 || this.nowColorID == -1 && Math.abs(nowRot - this.lastRot) >= 5) {
                //     this.nowBoard.graphics.drawCircle(nowPos.x,nowPos.y,this.nowLineWidth/2,this.nowColor);
                // }
                this.nowBoard.graphics.drawCircle(nowPos.x,nowPos.y,this.nowLineWidth/2,this.nowColor);
                this.lastPos.x = nowPos.x
                this.lastPos.y = nowPos.y
                // this.lastRot = nowRot
            }
            //画圆
            // let offsetX = nowPos.x-this.lastPos.x
            // let offsetY = nowPos.y-this.lastPos.y
            // if (offsetX*offsetX + offsetY*offsetY >= this.offsetLen*this.offsetLen) {
            //     let drawPos = new Laya.Vector2(offsetX,offsetY)
            //     Laya.Vector2.normalize(drawPos,drawPos)
            //     Laya.Vector2.scale(drawPos,this.offsetLen,drawPos)
            //     drawPos.x += this.lastPos.x
            //     drawPos.y += this.lastPos.y
            //     this.nowBoard.graphics.drawCircle(drawPos.x,drawPos.y,8,"#ff0000");
            //     this.lastPos = drawPos
            //     console.log("超过距离--",nowPos,this.lastPos)
            //     this.drawLine(nowPos)
            // } else {
            //     console.log("未超过距离")
            // }
        }
    
        mergeBoard() {
            if (this.nowColorID != -1) {
                let num = this.lineArr.length
                if (num > 3) {
                    let tex = this.DrawBox.drawToTexture(this.DrawBox.width,this.DrawBox.height,this.DrawBox.x,this.DrawBox.y) as Laya.Texture
                    let spr = new Laya.Sprite()
                    spr.width = this.DrawBox.width
                    spr.height = this.DrawBox.height
                    this.DrawBox.addChild(spr)
                    spr.texture = tex
                    // spr.graphics.drawTexture(tex,0,0,this.DrawBox.width,this.DrawBox.height)
                    let lastBg = this.DrawBox.getChildByName("bg")
                    if (lastBg) {
                        lastBg.destroy()
                    }
                    spr.name = "bg"
                    spr.zOrder = -1
                    while(num != 0) {
                        let d_board:any = this.lineArr.splice(0,1)[0]
                        d_board.destroy()
                        num--
                    }
                }
            } else {
                let tex = this.DrawBox.drawToTexture(this.DrawBox.width,this.DrawBox.height,this.DrawBox.x,this.DrawBox.y) as Laya.Texture
                let spr = new Laya.Sprite()
                spr.width = this.DrawBox.width
                spr.height = this.DrawBox.height
                spr.cacheAs = "bitmap"
                this.DrawBox.addChild(spr)
                spr.texture = tex
    
                let lastBg = this.DrawBox.getChildByName("bg")
                if (lastBg) {
                    lastBg.destroy()
                }
                spr.name = "bg"
                spr.zOrder = -1
                let num = this.lineArr.length
                while(num != 0) {
                    let d_board:any = this.lineArr.splice(0,1)[0]
                    d_board.destroy()
                    num--
                }
                let board = new Laya.Sprite()
                board.width = this.DrawBox.width
                board.height = this.DrawBox.height
                board.blendMode = "destination-out"
                spr.addChild(board)
                this.lineArr.push(spr)
            }
        }
    
        toWitness() {
            this.addDrawEvent()
            this.btnClear.visible = true
            // this.btnUp.visible = false
            
            // this.nowBubble&&this.nowBubble.destroy()
            // this.nowBubble = new BubbleCon()
            // // this.bubbleRoot.addChild(this.nowBubble)
            // this.nowBubble.initShow(this.nowBubbleInfo)
    
            // LayaControl.soundMgr.playBGM(2)
        }
    
        toPickSuspect() {

            this.btnClear.visible = false
            // this.btnUp.visible = true
            this.SliderBox.visible = true

            this.removeDrawEvent()
            this.downBoardAnim()

           
            
            Laya.timer.once(1000,this,()=>{
                // CamFollow.ins.ChangeToChoose();
            });
           
            //GameMgr.ins.toPickSuspect()
        }
    

    
        get nowBoard() {
            //console.log(this.lineArr);
            let board = this.lineArr[this.lineArr.length - 1]
            if (this.nowColorID == -1) {
                board = board.getChildAt(0)
            }
            return board
        }
    
        get nowColor() {
            return this.nowColorID != -1 ? this.colorArr[this.nowColorID] : "#000000"
        }
    
        get nowLineWidth() {
            return this.nowColorID != -1 ? this.lineWidth : this.lineWidth*3
        }
    
        get nowBubbleInfo() {
            if (this.nowClueID > this.nowCaseClue.length) {
                this.nowClueID = this.nowCaseClue.length
            }
            return {
                txt:this.nowCaseClue[this.nowClueID-1],
                pro:this.nowClueID+"/"+this.nowCaseClue.length
            }
        }
}