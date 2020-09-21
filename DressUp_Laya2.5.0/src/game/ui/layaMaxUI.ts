/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module game.ui.sys {
    export class UIAirdropUI extends Laya.View {
		public BtnClose:Laya.Image;
		public BtnRecv:Laya.Image;
		public RewardT:laya.display.Text;
		public Gift1:Laya.Box;
		public Gift2:Laya.Box;
		public Gift3:Laya.Box;
		public Gift4:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIAirdrop");
        }
    }
    REG("game.ui.sys.UIAirdropUI",UIAirdropUI);
    export class UIDebugUI extends Laya.View {
		public TransCtrl:Laya.Box;
		public RatioGroup:Laya.Box;
		public SldX:Laya.HSlider;
		public SldY:Laya.HSlider;
		public SldZ:Laya.HSlider;
		public RangeInput:Laya.TextInput;
		public InputCtrl:Laya.Box;
		public InputCmd:Laya.TextInput;
		public BtnExecute:Laya.Button;
		public BtnCtrl:Laya.Box;
		public Btn1:Laya.Image;
		public Btn2:Laya.Image;
		public Btn3:Laya.Image;
		public Btn4:Laya.Image;
		public BtnSwitch:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIDebug");
        }
    }
    REG("game.ui.sys.UIDebugUI",UIDebugUI);
    export class UIInitUI extends Laya.View {
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIInit");
        }
    }
    REG("game.ui.sys.UIInitUI",UIInitUI);
    export class UIMainUI extends Laya.View {
		public TouchArea:Laya.Image;
		public JoyB:Laya.Image;
		public JoyF:Laya.Image;
		public Prg:Laya.Image;
		public GoldT:laya.display.Text;
		public Rank:laya.display.Text;
		public OppoTip:Laya.Image;
		public OppoName:laya.display.Text;
		public OppoIcon:Laya.Image;
		public Bump:Laya.Image;
		public Left:Laya.Sprite;
		public Right:Laya.Sprite;
		public Bump1:Laya.Sprite;
		public Bump2:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIMain");
        }
    }
    REG("game.ui.sys.UIMainUI",UIMainUI);
    export class UINewCarUI extends Laya.View {
		public BtnClose:Laya.Image;
		public BtnRecv:Laya.Image;
		public RewardT:laya.display.Text;
		public Light:Laya.Image;
		public Icon:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UINewCar");
        }
    }
    REG("game.ui.sys.UINewCarUI",UINewCarUI);
    export class UIOutlineUI extends Laya.View {
		public BtnClose:Laya.Image;
		public BtnRecv:Laya.Image;
		public Light:Laya.Image;
		public GoldT:laya.display.Text;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIOutline");
        }
    }
    REG("game.ui.sys.UIOutlineUI",UIOutlineUI);
    export class UIPlayerUpUI extends Laya.View {
		public BtnClose:Laya.Image;
		public Light:Laya.Image;
		public BtnRecv:Laya.Image;
		public LvT:laya.display.Text;
		public RewardT:laya.display.Text;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIPlayerUp");
        }
    }
    REG("game.ui.sys.UIPlayerUpUI",UIPlayerUpUI);
    export class UIPreloadUI extends Laya.View {
		public Prg:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIPreload");
        }
    }
    REG("game.ui.sys.UIPreloadUI",UIPreloadUI);
    export class UIPromoUI extends Laya.View {
		public Btn1:Laya.Image;
		public Btn2:Laya.Image;
		public Btn3:Laya.Image;
		public Btn4:Laya.Image;
		public Btn5:Laya.Image;
		public Btn6:Laya.Image;
		public P101_1:Laya.Box;
		public P101_2:Laya.Box;
		public P101_3:Laya.Box;
		public P102:Laya.Box;
		public P103:Laya.Box;
		public P104:Laya.Box;
		public P105:Laya.Box;
		public P106:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIPromo");
        }
    }
    REG("game.ui.sys.UIPromoUI",UIPromoUI);
    export class UIReadyUI extends Laya.View {
		public Station:Laya.Sprite;
		public BtnStart:Laya.Image;
		public BtnSign:Laya.Image;
		public Red:Laya.Image;
		public Exp:Laya.Image;
		public Lv:laya.display.Text;
		public GoldT:laya.display.Text;
		public ProduceT:laya.display.Text;
		public BuffFlagBg:Laya.Image;
		public BuffFlag:Laya.Image;
		public DiamondT:laya.display.Text;
		public Bin:Laya.Image;
		public SV:Laya.List;
		public BtnQuick:Laya.Image;
		public QuickIcon:Laya.Image;
		public QuickT:laya.display.Text;
		public BtnShop:Laya.Image;
		public BtnBuff:Laya.Image;
		public BuffT:laya.display.Text;
		public BuffEfx:Laya.Box;
		public DragObj:Laya.Image;
		public Airdrop:Laya.Image;
		public BtnAirdrop:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIReady");
        }
    }
    REG("game.ui.sys.UIReadyUI",UIReadyUI);
    export class UISettleUI extends Laya.View {
		public Name1:laya.display.Text;
		public Icon1:Laya.Image;
		public Arrow1:Laya.Image;
		public Name2:laya.display.Text;
		public Icon2:Laya.Image;
		public Arrow2:Laya.Image;
		public Name3:laya.display.Text;
		public Icon3:Laya.Image;
		public Arrow3:Laya.Image;
		public Rank:laya.display.Text;
		public Name4:laya.display.Text;
		public Icon4:Laya.Image;
		public Arrow4:Laya.Image;
		public BtnRecv3:Laya.Image;
		public GoldT:laya.display.Text;
		public BtnRecv:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UISettle");
        }
    }
    REG("game.ui.sys.UISettleUI",UISettleUI);
    export class UIShopUI extends Laya.View {
		public BtnClose:Laya.Image;
		public SV:Laya.List;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIShop");
        }
    }
    REG("game.ui.sys.UIShopUI",UIShopUI);
    export class UISignUI extends Laya.View {
		public Bg:Laya.Image;
		public BtnClose:Laya.Image;
		public Day6:any;
		public SV:Laya.List;
		public BtnRecv:Laya.Button;
		public BtnRecvEx:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UISign");
        }
    }
    REG("game.ui.sys.UISignUI",UISignUI);
    export class UITopUI extends Laya.View {
		public TipBox:Laya.Box;
		public Tip0:Laya.Image;
		public Tip1:Laya.Image;
		public Tip2:Laya.Image;
		public Interim1:Laya.Image;
		public Interim2:Laya.Box;
		public LT:Laya.Image;
		public RT:Laya.Image;
		public LB:Laya.Image;
		public RB:Laya.Image;
		public Waitting:Laya.Image;
		public W1:Laya.Image;
		public W2:Laya.Image;
		public Block:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UITop");
        }
    }
    REG("game.ui.sys.UITopUI",UITopUI);
    export class UIUpgradeCarUI extends Laya.View {
		public BtnClose:Laya.Image;
		public Light:Laya.Image;
		public BtnRecv:Laya.Image;
		public Icon:Laya.Image;
		public OrgLv:laya.display.Text;
		public OrgIcon:Laya.Image;
		public Lv:laya.display.Text;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("sys/UIUpgradeCar");
        }
    }
    REG("game.ui.sys.UIUpgradeCarUI",UIUpgradeCarUI);
}