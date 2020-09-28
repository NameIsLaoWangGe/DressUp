// import GameUI from "../GameUI";
// import SoundControl from "../SoundControl";
// import CamFollow from "../CamFollow";
import { OpenType, UIBase, UIMgr } from "../../Frame/Core";
import BubbleCon from "../BubbleCon";
import GameDataController from "../GameDataController";
import { ManData } from "../ManConfigData";
import PaintingItem from "./PaintingItem";


export default class UIDraw extends UIBase {

    _openType = OpenType.Attach;

    public Top:Laya.Image;
    public BackBtn:Laya.Image;

    public UIBox: Laya.Box;
    public Board: Laya.Box;
    public imgBg: Laya.Sprite;
    public imgRubber: Laya.Image;
    public imgGou: Laya.Image;
    public DrawBox: Laya.Box;
    public btnUp: Laya.Button;
    public btnClear: Laya.Button;
    public btnNext: Laya.Image;
    // public btnCatch:Laya.Button;
    // public TipBox:Laya.Box;
    public DrawingBG: Laya.Image;
    drawBoard: Laya.Sprite
    nowBubble: BubbleCon
    bubbleRoot: Laya.Box;
    sliderDownPos: Laya.Point
    sliderLastPos: Laya.Point
    nowCaseClue = []
    nowClueID = 1
    lastPos = null
    // lastRot = null
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
        "#FFB5C5",
        "#FF00FF",
        "#90EE90",
        "#00BFFF",
        "#E066FF",
        "#FF4500",
        "#9370DB",
        "#FF0000",
        "#000000",
    ]
    paintInited = false;
    man:ManData=new ManData();

    public SliderBox: Laya.Box;
    public PaintingList:Laya.List
    public Paint:Laya.Image;
    Datas=[];
    onInit()
    {
        
    }

    onWrapItem(cell:Laya.Box,index:number)
    {
        cell.getComponent(PaintingItem).fell(this.Datas,index)
    }
    Refresh()
    {
        this.man=GameDataController.man;
        switch(GameDataController.ManStarRefresh[this.man.ID])
        {
            case 1:
                this.Datas=this.man.Different1;
                break;
            case 2:
                this.Datas=this.man.Different2;
                break;
            case 3:
                this.Datas=this.man.Different3;
                break;
            case 4:
                this.Datas=this.man.Different3;
                break;
        }
        this.PaintingList.array=this.Datas;
        this.PaintingList.refresh();
        console.log(this.Datas)
    }
    


    onShow() {
        this.InitPaint();
    
        this.BackBtn=this.vars("BackBtn");
        this.btnEv("BackBtn",()=>{
            this.hide();
        })
        
        this.PaintingList=this.SliderBox.getChildByName("PaintingList") as Laya.List;
        this.PaintingList.hScrollBarSkin="";
        this.Refresh();
        this.PaintingList.renderHandler=new Laya.Handler(this,this.onWrapItem);
        this.PaintingList.selectHandler=new Laya.Handler(this,(index)=>{
                console.log(index)
        })
        this.PaintingList.selectedIndex

       
        this.enterAnim();
        this.Paint.skin= "https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManPainting/"+ this.Datas[0]+".jpg";
    }

    onHide()
    {
        this.hide();
        this.onClickClear();
        this.Datas=[];
        this.nowCaseClue=[];
        this.nowClueID = 1
        this.Top.y=-this.Top.height;
    }

    InitPaint() {

        this.Top=this.vars("Top");
        this.UIBox = this.vars("UIBox");
        
        this.SliderBox = this.vars("SliderBox");
        this.Paint=this.SliderBox.getChildByName("Paint") as Laya.Image;

        this.Board = this.vars("Board");
        this.imgBg = this.vars("imgBg");
        this.imgRubber = this.vars("imgRubber");
        this.DrawBox = this.vars("DrawBox");
        this.imgGou = this.vars("imgGou");
        this.btnClear = this.vars("btnClear");
        this.btnUp = this.vars("btnUp");//放大
        this.btnNext = this.vars("btnNext");
        this.bubbleRoot = this.vars("bubbleRoot");
        this.DrawingBG = this.vars("DrawingBG");

        this.btnClear.on(Laya.Event.CLICK, this, this.onClickClear)
        this.btnNext.on(Laya.Event.CLICK, this, this.onClickNext)
        this.btnUp.on(Laya.Event.CLICK, this, this.onClickUp)
        this.SliderBox.on(Laya.Event.MOUSE_DOWN, this, this.onSliderDown)
        // this.SliderBox.on(Laya.Event.MOUSE_MOVE, this, this.onSliderMove)
        this.SliderBox.on(Laya.Event.MOUSE_UP, this, this.onSliderUp)
        


        for (let i = 1; i <= 9; i++) {
            this.Board.getChildByName("imgColor" + i).on(Laya.Event.CLICK, this, this.onClickColor, [i - 1])//获取颜色点并绑定点击事件
        }
        this.imgRubber.on(Laya.Event.CLICK, this, this.onClickColor, [-1])//橡皮擦点击事件
        this.refreshShow()//刷新对勾位置

        this.drawMinX = this.lineWidth / 2
        this.drawMaxX = this.DrawBox.width - this.lineWidth / 2
        this.drawMinY = this.lineWidth / 2
        this.drawMaxY = this.DrawBox.height - this.lineWidth / 2

        this.btnUp.visible = false
        this.btnNext.visible = false
        this.SliderBox.visible = false
        // this.btnCatch.visible = false
        // this.TipBox.visible = false
        this.boardDrawY = this.UIBox.height - this.Board.height //- 80

        //this.initHTBox()
        this.paintInited = true;


    }

    addDrawEvent() {
        //console.error("addDrawEvent");
        this.DrawBox.on(Laya.Event.MOUSE_DOWN, this, this._onMouseDown)
        this.DrawBox.on(Laya.Event.MOUSE_MOVE, this, this._onMouseMove)
        this.DrawBox.on(Laya.Event.MOUSE_UP, this, this._onMouseUP)
    }

    removeDrawEvent() {
        this.DrawBox.off(Laya.Event.MOUSE_DOWN, this, this._onMouseDown)
        this.DrawBox.off(Laya.Event.MOUSE_MOVE, this, this._onMouseMove)
        this.DrawBox.off(Laya.Event.MOUSE_UP, this, this._onMouseUP)
    }

    enterAnim() {
        
        // let info = {
        //     "Clue1": "我有点害羞。",
        //     "Clue2": "我是黄色的头发。",
        //     "Clue3": "我穿着红色连衣裙。",
        //     "Description": "害羞的小王"
        // };
        // this.vars("GirlName").text = info["Description"];
        // let num = 1
        // while (true) {
        //     if (info["Clue" + num]) {
        //         this.nowCaseClue.push(info["Clue" + num])
        //         num++
        //     } else {
        //         break
        //     }
        // }
        this.nowCaseClue=this.CheckCurrentLevel(this.man);

        this.Board.y = this.UIBox.height + this.Board.height + 10
        console.log("this.Board.y:" + this.Board.y);
        console.log("this.boardDrawY:" + this.boardDrawY);
        Laya.Tween.to(this.Board, {
            y: this.boardDrawY
        }, 600, Laya.Ease.backOut, Laya.Handler.create(this, () => {
            this.toWitness()
            //this.initHTBox()
        }))
        Laya.Tween.to(this.Top,{
            y:0
        },500,Laya.Ease.backOut)
    }

    upBoardAnim() {
        if (this.isOnBoardAnim) {
            return
        }
        this.isOnBoardAnim = true
        this.btnUp.skin = "DX/Duihua/big.png"
        Laya.Tween.to(this.Board, {
            y: this.boardDrawY 
        }, 500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
            this.isOnBoardAnim = false
        }))
    }

    downBoardAnim() {
        if (this.isOnBoardAnim) {
            return
        }
        this.isOnBoardAnim = true
        this.btnUp.skin = "DX/Duihua/big.png"
        Laya.Tween.to(this.Board, {
            y: this.boardDrawY + 300 + 100
        }, 500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
            this.isOnBoardAnim = false
        }))

        Laya.Tween.to(this.Top,{
            y:this.Top.y-this.Top.height
        },500,Laya.Ease.backOut)
    }

    onClickClear() {
        // SoundControl.PlaySound("Button");
        this.DrawBox.destroyChildren()
        this.lineArr = []
    }

    onClickNext() {
        // SoundControl.PlaySound("Button");
        if (this.nowClueID == this.nowCaseClue.length) {
            this.toPickSuspect()
        } else {
            this.nowClueID++
            this.nowBubble.destroy()
            this.nowBubble = new BubbleCon()
            this.bubbleRoot.addChild(this.nowBubble)
            this.nowBubble.initShow(this.nowBubbleInfo)
        }
        this.btnNext.visible = false
    }

    onClickUp() {
        // SoundControl.PlaySound("Button");
        if (!this.isOnBoardAnim) {
            if (this.isBoardUp) {
                this.downBoardAnim()
            } else {
                this.upBoardAnim()
            }
            this.isBoardUp = !this.isBoardUp
        }
    }

    onClickCatch(event: Laya.Event) {
        // SoundControl.PlaySound("Button");
        //LayaControl.soundMgr.playSound("music/catch.mp3")
        event.stopPropagation()
        //GameMgr.ins.arrestSuspect()
    }

    onClickColor(ID) {
        this.nowColorID = ID
        this.refreshShow()
    }

    refreshShow() {//刷新imgGou 的位置
        let node: any = this.imgRubber
        if (this.nowColorID != -1) {
            node = this.Board.getChildByName("imgColor" + (this.nowColorID + 1))
        }
        this.imgGou.x = node.x +11;
        this.imgGou.y = node.y +10;
    }

    _onMouseDown(event: Laya.Event) {
        this.isTouchOnDraw = true;
        this.mergeBoard();

        if (!this.btnNext.visible) {
            this.btnNext.visible = true
            if (this.nowClueID == this.nowCaseClue.length) {
                this.btnNext["skin"] = "DX/Duihua/wancheng.png"//anniu_xia
            } else {
                this.btnNext["skin"] = "DX/Duihua/xiayiju.png"
            }
        }

        if (this.nowColorID != -1) {
            let board = new Laya.Sprite()
            board.width = this.DrawBox.width
            board.height = this.DrawBox.height
            board.cacheAs = "bitmap"
            this.DrawBox.addChild(board)
            this.lineArr.push(board)
        }
        this.lastPos = new Laya.Point(event.stageX - this.Board.x - this.DrawBox.x, event.stageY - this.Board.y - this.DrawBox.y)
        this.nowBoard.graphics.drawCircle(this.lastPos.x, this.lastPos.y, this.nowLineWidth / 2, this.nowColor);
    }

    _onMouseMove(event: Laya.Event) {
        if (this.isTouchOnDraw) {
            let touchPos = new Laya.Point(event.stageX - this.Board.x - this.DrawBox.x, event.stageY - this.Board.y - this.DrawBox.y)
            this.drawLine(touchPos)
        }
    }

    _onMouseUP(event: Laya.Event) {
        this.isTouchOnDraw = false
        // this.lastRot = null
    }

    oldX:number=0;
    onSliderDown(event: Laya.Event) {
        this.oldX=this.SliderBox.mouseX;
        this.SliderBox.on(Laya.Event.MOUSE_MOVE,this,this.onSliderMove);
        this.SliderBox.on(Laya.Event.CLICK, this, this.onSliderClick)
    }

    MovetoLeft:boolean=false;
    MovetoRight:boolean=false;
    onSliderMove(event: Laya.Event) {
        this.SliderBox.off(Laya.Event.CLICK, this, this.onSliderClick)
        if(this.oldX-this.SliderBox.mouseX>300)
        {
            this.Paint.alpha-=0.02;
            this.MovetoLeft=true;
            console.log(this.paintindex) 
        }
        if(this.SliderBox.mouseX-this.oldX>300)
        {
            this.Paint.alpha-=0.02;
            this.MovetoRight=true;
            console.log(this.paintindex)
        }
    }

    onSliderUp(event: Laya.Event) {
        this.SliderBox.off(Laya.Event.MOUSE_MOVE,this,this.onSliderMove);
        // this.SliderBox.on(Laya.Event.CLICK, this, this.onSliderClick)
        this.Paint.alpha=1;
        if(this.MovetoLeft)
        {
            console.log("左滑")
            this.ChangeNextPaint();
            this.MovetoLeft=false
        }
        if(this.MovetoRight)
        {
            console.log("右滑")
            this.ChangeLastPaint()
            this.MovetoRight=false;
        }
    }

    onSliderClick()
    {
        GameDataController.paint=this.Datas[this.paintindex]
        UIMgr.show("UISure");
    }
    paintindex:number=0
    ChangeNextPaint()
    {
        this.paintindex++;
        if(this.paintindex>this.Datas.length-1)
        {
            this.paintindex=this.Datas.length-1;
        }
        this.Paint.skin="https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManPainting/"+ this.Datas[this.paintindex]+".jpg";
    }
    ChangeLastPaint()
    {
        this.paintindex--;
        if(this.paintindex<0)
        {
            this.paintindex=0;
        }
        this.Paint.skin="https://h5.tomatojoy.cn/wx/dfxjj/zijie/1.0.0/Cloth/ManPainting/"+ this.Datas[this.paintindex]+".jpg";
    }




    onEventFailAgain() {
        this.nowClueID = 1
        this.btnUp.visible = false
        this.btnNext.visible = false
        this.SliderBox.visible = false
        // this.btnCatch.visible = false
        this.UIBox.visible = true

        this.Board.y = this.boardDrawY
        this.toWitness()
    }


    drawLine(nowPos) {
        //极限处理
        nowPos.x > this.drawMaxX && (nowPos.x = this.drawMaxX)
        nowPos.x < this.drawMinX && (nowPos.x = this.drawMinX)
        nowPos.y > this.drawMaxY && (nowPos.y = this.drawMaxY)
        nowPos.y < this.drawMinY && (nowPos.y = this.drawMinY)

        //画线
        let offsetX = nowPos.x - this.lastPos.x
        let offsetY = nowPos.y - this.lastPos.y
        if (offsetX * offsetX + offsetY * offsetY >= this.offsetLen * this.offsetLen) {
            this.nowBoard.graphics.drawLine(this.lastPos.x, this.lastPos.y, nowPos.x, nowPos.y, this.nowColor, this.nowLineWidth)
            // let nowRot =  Math.atan2(offsetY,offsetX) * 180 / Math.PI
            // if (this.lastRot != null && Math.abs(nowRot - this.lastRot) > 0 || this.nowColorID == -1 && Math.abs(nowRot - this.lastRot) >= 5) {
            //     this.nowBoard.graphics.drawCircle(nowPos.x,nowPos.y,this.nowLineWidth/2,this.nowColor);
            // }

            this.nowBoard.graphics.drawCircle(nowPos.x, nowPos.y, this.nowLineWidth / 2, this.nowColor);
            this.lastPos.x = nowPos.x
            this.lastPos.y = nowPos.y
            // this.lastRot = nowRot
        }
    }

    mergeBoard() //融合Board
    {
        if (this.nowColorID != -1) {
            let num = this.lineArr.length
            if (num > 3) {
                let tex = this.DrawBox.drawToTexture(this.DrawBox.width, this.DrawBox.height, this.DrawBox.x, this.DrawBox.y) as Laya.Texture
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
                while (num != 0) {
                    let d_board: any = this.lineArr.splice(0, 1)[0]
                    d_board.destroy()
                    num--
                }
            }
        }
        else {
            let tex = this.DrawBox.drawToTexture(this.DrawBox.width, this.DrawBox.height, this.DrawBox.x, this.DrawBox.y) as Laya.Texture
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
            while (num != 0) {
                let d_board: any = this.lineArr.splice(0, 1)[0]
                d_board.destroy();
                num--
            }
            let board = new Laya.Sprite()
            board.width = this.DrawBox.width
            board.height = this.DrawBox.height
            board.blendMode = "destination-out"//叠加模式
            spr.addChild(board)
            this.lineArr.push(spr)
        }
    }

    toWitness() {
        this.addDrawEvent()//添加滑动监听
        this.btnClear.visible = true
        this.btnUp.visible = false

        this.nowBubble && this.nowBubble.destroy()
        this.nowBubble = new BubbleCon()
        this.bubbleRoot.addChild(this.nowBubble)
        this.nowBubble.initShow(this.nowBubbleInfo)

        // LayaControl.soundMgr.playBGM(2)
    }

    toPickSuspect() //选择对象
    {
        this.btnNext.visible = false
        this.btnClear.visible = false
        this.btnUp.visible = true
        this.SliderBox.visible = true
        this.nowBubble.hide()//气泡移除
        this.removeDrawEvent()
        this.downBoardAnim() //画板滑下
        // this.tipAnim()
        this.DrawingBG.visible = false;
        // GameUI.ins.Boy.PlayAni("Stand");
        Laya.timer.once(1000, this, () => {
            // CamFollow.ins.ChangeToChoose();
        });
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
        return this.nowColorID != -1 ? this.lineWidth : this.lineWidth * 3
    }

    get nowBubbleInfo() {
        if (this.nowClueID > this.nowCaseClue.length) {
            this.nowClueID = this.nowCaseClue.length
        }
        return {
            txt: this.nowCaseClue[this.nowClueID - 1],
            pro: this.nowClueID + "/" + this.nowCaseClue.length
        }
    }

    CheckCurrentLevel(data:ManData)
    {
        let level=GameDataController.ManStarRefresh[data.ID];
        if(level==1)
        {
            return data.Level1;
        }
        if(level==2)
        {
            return data.Level2;
        }
        if(level==3)
        {
            return data.Level3;
        }
        else{
            return data.Level3;
        }
    }

}