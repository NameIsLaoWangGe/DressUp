(function () {
    'use strict';

    class PromoOpen extends Laya.Script {
        constructor() {
            super(...arguments);
            this.target = null;
        }
        onClick() {
            this.target.active = this.target.visible = true;
        }
    }

    class ButtonScale extends Laya.Script {
        constructor() {
            super(...arguments);
            this.time = .1;
            this.ratio = 1.04;
            this.startScaleX = 1;
            this.startScaleY = 1;
            this.scaled = false;
        }
        onAwake() {
            this.owner.on(Laya.Event.MOUSE_DOWN, null, () => { this.ScaleBig(); });
            this.owner.on(Laya.Event.MOUSE_UP, null, () => { this.ScaleSmall(); });
            this.owner.on(Laya.Event.MOUSE_OUT, null, () => { this.ScaleSmall(); });
        }
        ScaleBig() {
            if (this.scaled)
                return;
            this.scaled = true;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX * this.ratio, scaleY: this.startScaleY * this.ratio }, this.time * 1000);
        }
        ScaleSmall() {
            if (!this.scaled)
                return;
            this.scaled = false;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX, scaleY: this.startScaleY }, this.time * 1000);
        }
    }

    class PromoItem extends Laya.Script {
        constructor() {
            super(...arguments);
            this.bgImage = null;
            this.iconImage = null;
            this.nameText = null;
            this.infoText = null;
            this.flag1 = null;
            this.flag2 = null;
            this.flag3 = null;
        }
        onAwake() {
            this.bgImage = this.owner.getChildByName("bg");
            this.iconImage = this.owner.getChildByName("icon");
            if (this.iconImage != null) {
                this.flag1 = this.iconImage.getChildByName("flag1");
                this.flag2 = this.iconImage.getChildByName("flag2");
                this.flag3 = this.iconImage.getChildByName("flag3");
            }
            this.nameText = this.owner.getChildByName("name");
            this.infoText = this.owner.getChildByName("info");
        }
        DoLoad() {
            if (this.data == null)
                return;
            if (this.iconImage != null)
                this.iconImage.skin = this.data.icon;
            if (this.nameText != null)
                this.nameText.text = this.data.title;
            this.SetFlag();
        }
        SetFlag() {
            if (this.flag1 != null)
                this.flag1.active = this.flag1.visible = false;
            if (this.flag2 != null)
                this.flag2.active = this.flag2.visible = false;
            if (this.flag3 != null)
                this.flag3.active = this.flag3.visible = false;
            switch (this.data.tag) {
                case 1:
                    if (this.flag1 != null)
                        this.flag1.active = this.flag1.visible = true;
                    break;
                case 2:
                    if (this.flag2 != null)
                        this.flag2.active = this.flag2.visible = true;
                    break;
                case 3:
                    if (this.flag3 != null)
                        this.flag3.active = this.flag3.visible = true;
                    break;
            }
        }
        OnShow() {
            this.data.ReportShow();
        }
        OnClick() {
            this.data.Click();
            if (this.onClick_ != null) {
                this.onClick_(this);
            }
        }
        onClick() {
            this.OnClick();
        }
    }

    class Behaviour extends Laya.Script {
        constructor() {
            super(...arguments);
            this.isAwake = false;
            this.isStart = false;
            this.isEnable = false;
            this.isDestroy = false;
        }
        OnAwake() { }
        OnStart() { }
        OnUpdate() { }
        OnEnable() { }
        OnDisable() { }
        OnDestroy() { }
        DoAwake() {
            if (!this.active)
                return;
            if (!this.isAwake) {
                this.isAwake = true;
                this.OnAwake();
            }
        }
        DoStart() {
            if (!this.active)
                return;
            if (!this.isStart) {
                this.isStart = true;
                this.OnStart();
            }
        }
        DoUpdate() {
            if (!this.active)
                return;
            if (this.isStart) {
                this.OnUpdate();
            }
        }
        DoEnable() {
            if (!this.active)
                return;
            if (!this.isEnable) {
                this.isEnable = true;
                this.OnEnable();
            }
        }
        DoDisable() {
            if (this.isEnable) {
                this.isEnable = false;
                this.OnDisable();
            }
        }
        DoDestroy() {
            if (!this.isDestroy) {
                this.isDestroy = true;
                this.OnDestroy();
            }
        }
        onAwake() {
            this.DoAwake();
        }
        onStart() {
            this.DoAwake();
            this.DoStart();
        }
        onUpdate() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
            this.DoUpdate();
        }
        onEnable() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
        }
        onDisable() {
            this.DoDisable();
        }
        onDestroy() {
            this.DoDestroy();
        }
        static SetActive(node, value) {
            if (node == null)
                return;
            node.active = value;
            if (node instanceof Laya.Box) {
                node.visible = value;
            }
        }
        static GetActive(node) {
            if (node == null)
                return false;
            if (!node.active)
                return false;
            if (node instanceof Laya.Box) {
                if (!node.visible)
                    return false;
            }
            return true;
        }
        get active() {
            return Behaviour.GetActive(this.owner);
        }
        set active(value) {
            Behaviour.SetActive(this.owner, value);
            if (value) {
                this.DoEnable();
            }
            else {
                this.DoDisable();
            }
        }
    }

    class P201 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoItem = null;
            this.shake = false;
            this.animTime = 0;
            this.refrTime = 0;
        }
        async OnAwake() {
            this.promoItem = this.owner.getComponent(PromoItem);
            TJ.Develop.Yun.Promo.Data.ReportAwake(P201.style);
            this.promoItem.style = P201.style;
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (P201.promoList == null) {
                let list = await TJ.Develop.Yun.Promo.List.Get(P201.style);
                if (P201.promoList == null)
                    P201.promoList = list;
            }
            if (P201.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P201.style);
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        OnEnable() {
            this.LoadAndShowIcon();
        }
        OnDisable() {
            if (P201.promoList != null) {
                P201.promoList.Unload(this.promoItem.data);
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            this.refrTime += deltaTime;
            if (this.refrTime > 5) {
                this.refrTime -= 5;
                this.LoadAndShowIcon();
            }
            if (!this.shake)
                return;
            this.animTime += deltaTime;
            this.animTime %= 2.5;
            if (this.animTime <= .75) {
                this.promoItem.owner.rotation = Math.sin(this.animTime * 6 * Math.PI) * 25 * (1 - this.animTime / .75);
            }
            else {
                this.promoItem.owner.rotation = 0;
            }
        }
        LoadIcon() {
            let data = P201.promoList.Load();
            if (data != null) {
                P201.promoList.Unload(this.promoItem.data);
                this.promoItem.data = data;
                this.promoItem.onClick_ = () => { this.LoadAndShowIcon(); };
                this.promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon() {
            if (this.LoadIcon() != null) {
                this.promoItem.OnShow();
            }
            else {
                if (this.promoItem.data == null) {
                    this.owner.destroy();
                }
            }
        }
    }
    P201.style = "P201";
    P201.promoList = null;

    class P202 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingTop = 10;
            this.paddingBottom = 10;
            this.line = 0;
            this.column = 0;
            this.toTop = false;
            this.showing = [];
        }
        async OnAwake() {
            this.scroll = this.owner.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            this.prefab = this.layout.getCell(0);
            let w = this.owner.width - this.paddingTop - this.paddingBottom;
            while (w >= this.prefab.width) {
                w = w - this.prefab.width - this.layout.spaceX;
                this.column++;
            }
            TJ.Develop.Yun.Promo.Data.ReportAwake(P202.style);
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P202.style);
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P202.style);
                this.line = Math.ceil(this.promoList.count / this.column);
                this.layout.repeatX = this.column;
                this.layout.repeatY = this.line;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        item.onAwake();
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P202.style;
                        }
                        Behaviour.SetActive(node, true);
                    }
                    else {
                        Behaviour.SetActive(node, false);
                    }
                }
                this.line = Math.ceil(this.itemList.length / this.column);
                let h = this.paddingTop + this.paddingBottom;
                h += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1);
                this.layout.height = h;
                if (this.scroll.height < this.layout.height) {
                    this.scroll.vScrollBarSkin = "";
                    this.scroll.vScrollBar.rollRatio = 0;
                }
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        async OnDisable() {
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P202.style);
            for (let item of this.itemList) {
                this.LoadIcon(item);
            }
        }
        get maxTop() {
            return 0;
        }
        get maxBottom() {
            let y = this.paddingTop + this.paddingBottom;
            y += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1) - this.scroll.height;
            return y;
        }
        get scrollValue() {
            if (this.scroll.vScrollBar != null) {
                return this.scroll.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.vScrollBar != null) {
                this.scroll.vScrollBar.value = v;
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.scroll.height < this.layout.height) {
                if (this.scrollValue <= this.maxTop) {
                    this.toTop = false;
                }
                else if (this.scrollValue >= this.maxBottom) {
                    this.toTop = true;
                }
                if (this.toTop) {
                    this.scrollValue -= 50 * deltaTime;
                }
                else {
                    this.scrollValue += 50 * deltaTime;
                }
            }
            else {
                this.scrollValue = this.maxTop;
            }
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
                promoItem.infoText.text = 1 + Math.floor(Math.random() * 40) / 10 + "w人在玩";
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let i = this.showing.indexOf(item);
                let node = item.owner;
                let d = Math.abs(-node.y - this.paddingTop - this.prefab.height / 2 + this.scrollValue + this.scroll.height / 2);
                if (d < this.scroll.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P202.style = "P202";

    class P103 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.layout = null;
        }
        async OnAwake() {
            this.layout = this.owner.getChildByName("layout");
            let close = this.owner.getChildByName("close");
            close.clickHandler = new Laya.Handler(null, () => { this.OnClose(); });
            TJ.Develop.Yun.Promo.Data.ReportAwake(P103.style);
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P103.style);
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P103.style);
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P103.style;
                        }
                        node.active = node.visible = true;
                    }
                    else {
                        node.active = node.visible = false;
                    }
                }
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        OnEnable() {
            for (let item of this.itemList) {
                item.OnShow();
            }
        }
        async OnDisable() {
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P103.style);
            for (let item of this.itemList) {
                this.LoadIcon(item);
            }
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        OnClose() {
            let node = this.owner;
            node.active = node.visible = false;
        }
    }
    P103.style = "P103";

    class P204 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingLeft = 20;
            this.paddingRight = 20;
            this.toLeft = false;
            this.showing = [];
        }
        async OnAwake() {
            this.scroll = this.owner.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            this.prefab = this.layout.getCell(0);
            TJ.Develop.Yun.Promo.Data.ReportAwake(P204.style);
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            let list = await TJ.Develop.Yun.Promo.List.Get(P204.style);
            if (this.promoList == null)
                this.promoList = list;
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P204.style);
                this.layout.repeatX = this.promoList.count;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P204.style;
                        }
                        node.active = node.visible = true;
                    }
                    else {
                        node.active = node.visible = false;
                    }
                }
                let w = this.paddingLeft + this.paddingRight;
                w += this.prefab.width * this.itemList.length + this.layout.spaceX * (this.itemList.length - 1);
                this.layout.width = w;
                if (this.scroll.width < this.layout.width) {
                    this.scroll.hScrollBarSkin = "";
                    this.scroll.hScrollBar.rollRatio = 0;
                }
                this.layout.width = w;
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        get maxLeft() {
            let x = 0;
            return x;
        }
        get maxRight() {
            let x = this.scroll.hScrollBar.max;
            return x;
        }
        get scrollValue() {
            if (this.scroll.hScrollBar != null) {
                return this.scroll.hScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.hScrollBar != null) {
                this.scroll.hScrollBar.value = v;
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.scroll.width < this.layout.width) {
                if (this.scrollValue >= this.maxRight) {
                    this.toLeft = true;
                }
                else if (this.scrollValue <= this.maxLeft) {
                    this.toLeft = false;
                }
                if (this.toLeft) {
                    this.scrollValue -= 50 * deltaTime;
                }
                else {
                    this.scrollValue += 50 * deltaTime;
                }
            }
            else {
                this.layout.x = this.maxLeft;
            }
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadIcon(item); };
                promoItem.DoLoad();
                let i = this.showing.indexOf(promoItem);
                if (i >= 0) {
                    this.showing.splice(i, 1);
                }
            }
            return data;
        }
        CheckShow() {
            let a = 0;
            for (let item of this.itemList) {
                let node = item.owner;
                let d = Math.abs(node.x - this.scrollValue - this.scroll.width / 2 + node.width / 2 + this.layout.spaceX);
                let i = this.showing.indexOf(item);
                if (d < this.scroll.width / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P204.style = "P204";

    class P205 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingTop = 10;
            this.paddingBottom = 10;
            this.move = null;
            this.show = null;
            this.hide = null;
            this.maxX = 620;
            this.line = 0;
            this.column = 0;
            this.targetX = 0;
            this.showing = [];
        }
        async OnAwake() {
            this.move = this.owner.getChildByName("move");
            let button = this.move.getChildByName("button");
            this.show = button.getChildByName("show");
            this.hide = button.getChildByName("hide");
            let board = this.move.getChildByName("board");
            this.scroll = board.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            this.prefab = this.layout.getCell(0);
            this.show.clickHandler = new Laya.Handler(null, () => { this.Show(); });
            this.hide.clickHandler = new Laya.Handler(null, () => { this.Hide(); });
            let w = this.scroll.width - this.paddingTop - this.paddingBottom;
            while (w >= this.prefab.width) {
                w = w - this.prefab.width - this.layout.spaceX;
                this.column++;
            }
            TJ.Develop.Yun.Promo.Data.ReportAwake(P205.style);
            if (this.show.parent.scaleX < 0)
                this.maxX = -this.maxX;
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                if (Laya.Browser.onIOS) {
                    this.active = false;
                    return;
                }
                return;
            }
            this.active = false;
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P205.style);
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P205.style);
                this.line = Math.ceil(this.promoList.count / this.column);
                this.layout.repeatX = this.column;
                this.layout.repeatY = this.line;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P205.style;
                        }
                        node.active = node.visible = true;
                    }
                    else {
                        node.active = node.visible = false;
                    }
                }
                this.line = Math.ceil(this.itemList.length / this.column);
                let h = this.paddingTop + this.paddingBottom;
                h += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1);
                this.layout.height = h;
                if (this.scroll.height < this.layout.height) {
                    this.scroll.vScrollBarSkin = "";
                    this.scroll.vScrollBar.rollRatio = 0;
                }
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        get scrollValue() {
            if (this.scroll.vScrollBar != null) {
                return this.scroll.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.vScrollBar != null) {
                this.scroll.vScrollBar.value = v;
            }
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        Show() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                let param = new TJ.API.Promo.Param();
                param.extraData = { "TJ_App": TJ.API.AppInfo.AppGuid() };
                TJ.API.Promo.Pop(param);
                return;
            }
            this.targetX = this.maxX;
            this.show.active = this.show.visible = false;
            this.hide.active = this.hide.visible = true;
            this.scrollValue = 0;
        }
        Hide() {
            this.targetX = 0;
            this.showing = [];
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.move.centerX != this.targetX) {
                let d = this.targetX - this.move.centerX;
                let s = 3000 * deltaTime;
                if (d > 0) {
                    d = Math.min(this.move.centerX + s, this.targetX);
                }
                else {
                    d = Math.max(this.move.centerX - s, this.targetX);
                }
                this.move.centerX = d;
                if (this.move.centerX == 0) {
                    this.show.active = this.show.visible = true;
                    this.hide.active = this.hide.visible = false;
                    window.setTimeout(async () => {
                        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P205.style);
                        for (let item of this.itemList) {
                            this.LoadIcon(item);
                        }
                    }, 0);
                }
            }
            else {
                if (this.move.centerX == this.maxX) {
                    this.CheckShow();
                }
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let i = this.showing.indexOf(item);
                let node = item.owner;
                let d = Math.abs(-node.y - this.paddingTop - this.prefab.height / 2 + this.scrollValue + this.scroll.height / 2);
                if (d < this.scroll.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P205.style = "P205";

    class P106 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.layout = null;
            this.showing = [];
        }
        async OnAwake() {
            this.scrollView = this.owner.getChildByName("scroll");
            this.layout = this.scrollView.getChildByName("layout");
            this.scrollView.vScrollBarSkin = "";
            let close = this.owner.getChildByName("close");
            close.clickHandler = new Laya.Handler(null, () => { this.OnClose(); });
            TJ.Develop.Yun.Promo.Data.ReportAwake(P106.style);
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            let list = await TJ.Develop.Yun.Promo.List.Get(P106.style);
            if (this.promoList == null)
                this.promoList = list;
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P106.style);
                this.layout.repeatY = this.promoList.count;
                let h = 0;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P106.style;
                        }
                        Behaviour.SetActive(node, true);
                    }
                    else {
                        Behaviour.SetActive(node, false);
                    }
                    if (i > 0) {
                        h += this.layout.spaceY;
                    }
                    h += node.height;
                }
                this.layout.height = h;
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        OnEnable() {
            this.scrollValue = 0;
        }
        async OnDisable() {
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P106.style);
            for (let item of this.itemList) {
                this.LoadIcon(item);
            }
        }
        OnUpdate() {
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadIcon(item); };
                promoItem.DoLoad();
                let i = this.showing.indexOf(promoItem);
                if (i >= 0) {
                    this.showing.splice(i, 1);
                }
            }
            return data;
        }
        get scrollValue() {
            if (this.scrollView.vScrollBar != null) {
                return this.scrollView.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scrollView.vScrollBar != null) {
                this.scrollView.vScrollBar.value = v;
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let node = item.owner;
                let d = Math.abs(node.y - this.scrollValue - this.scrollView.height / 2 + node.height / 2 + this.layout.spaceY);
                let i = this.showing.indexOf(item);
                if (d < this.scrollView.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
        OnClose() {
            let node = this.owner;
            node.active = node.visible = false;
        }
    }
    P106.style = "P106";

    class ListItem extends Laya.Script {
        onAwake() {
            this.init();
        }
        init() {
            console.log("ListItem Onawake");
            this.List = this.owner;
            this.List.vScrollBarSkin = "";
        }
        show() {
        }
        ;
        _show() {
            this.show();
        }
        refresh() {
        }
        ;
        _refresh() {
            this.refresh();
        }
        hide() {
            this.List.visible = false;
        }
        ;
        _hide() {
            this.hide();
        }
    }

    var GameEvent;
    (function (GameEvent) {
        GameEvent["preloadStep"] = "preloadStep";
        GameEvent["preloadCpl"] = "preloadCpl";
        GameEvent["pause"] = "pause";
        GameEvent["energyTick"] = "energyTick";
        GameEvent["showGRVTime"] = "showGRVTime";
        GameEvent["hideGRVTime"] = "hideGRVTime";
        GameEvent["debugExeCmd"] = "debugExeCmd";
        GameEvent["debugBtn1"] = "debugBtn1";
        GameEvent["debugBtn2"] = "debugBtn2";
        GameEvent["debugBtn3"] = "debugBtn3";
        GameEvent["debugBtn4"] = "debugBtn4";
        GameEvent["save"] = "save";
        GameEvent["renderNext"] = "renderNext";
        GameEvent["changeSkin"] = "changeSkin";
    })(GameEvent || (GameEvent = {}));
    class Formula {
        static get lang() {
            if (!Formula._lang) {
                Formula._lang = "cn";
                if (navigator) {
                    let lt = navigator.language;
                    if (lt == "zh-tw" || lt == "zh-hk") {
                        Formula._lang = "td";
                    }
                    else if (lt.indexOf("en") > 0) {
                        Formula._lang = "en";
                    }
                }
            }
            return Formula._lang;
        }
        static get isSubPkg() {
            return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt && Formula.subPkgInfo.length > 0;
        }
        static get banPromo() {
            return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt || TJ.Engine.RuntimeInfo.platform == TJ.Define.Platform.Android;
        }
        static get onTT() {
            return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt;
        }
        static get onWx() {
            return TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt;
        }
        static getSoundPath(name, type) {
            let suffix;
            if (type == 1) {
                suffix = TJ.Engine.RuntimeInfo.platform == TJ.Define.Platform.Android ? ".wav" : ".wav";
            }
            else {
                suffix = ".mp3";
            }
            this.debug && (suffix = ".mp3");
            return Formula._soundsPath + name + suffix;
        }
        static get preloadList() {
            return this._preloadList;
        }
        ;
    }
    Formula.debug = false;
    Formula.version = "";
    Formula.showGRV = false;
    Formula.subPkgInfo = [
        { name: "sp1", root: "res3d/p1/" },
        { name: "sp2", root: "res3d/p2/" },
    ];
    Formula._soundsPath = "res/sounds/";
    Formula.playerLocalKeys = {
        gameId: 0.0,
        version: 1.0,
        sound: 1,
        signTimes: 0,
        lastSignTs: 0,
        energy: () => { return Formula.maxEnergy; },
        energyTs: "__ts__",
        lv: 0,
        exp: 0,
        best: 0,
        skinId: 1,
        skinList: { 1: -1 },
        guide: 1,
        lastDay: 1,
        todayshow: 0,
        Money: 0,
        FurnitureLevel: 1,
        level: 0,
        newPlay: 0,
    };
    Formula.maxEnergy = 0;
    Formula.recoverEnergyTs = 0 * 1000;
    Formula.startScene = {
        path: "", nodeConf: [
            "Game",
        ]
    };
    Formula._preloadList = [];
    Formula.shareTopics = ["西瓜拼拼乐", "番茄小游戏", "抖音小游戏"];
    class ConfWrap {
        constructor(name) {
            this.map = {};
            this._file = name;
        }
    }
    let LC = {
        LangConf: new ConfWrap("lang"),
        SignConf: new ConfWrap("sign"),
        SkinConf: new ConfWrap("skin"),
    };

    class Util {
        static calcBorder(camera) {
            let w = Laya.Browser.width;
            let h = Laya.Browser.height;
            let camH = camera.orthographicVerticalSize;
            let camW = w / h * camH;
            return { w: camW, h: camH, hw: camW * 0.5, hh: camH * 0.5 };
        }
        static randomInRange_i(x, y, s = null) {
            let rs;
            if (x == y) {
                rs = x;
            }
            else if (y > x) {
                let v = (y - x) * (s == null ? Math.random() : s) + x;
                rs = v.toFixed();
            }
            else {
                throw `x > y`;
            }
            return Number(rs);
        }
        static near(a, b) {
            return Math.abs(a - b) < Util.lim;
        }
        static randomInRange_f(x, y, s = null) {
            let rs;
            let g = y - x;
            if (g < 0) {
                throw `x > y`;
            }
            else {
                if (g < Util.lim) {
                    rs = x;
                }
                else {
                    rs = g * (s == null ? Math.random() : s) + x;
                }
            }
            return Number(rs);
        }
        static setVec2(targ, vecFeild, x, y) {
            let v = targ[vecFeild];
            v.setValue((x != null) ? x : v.x, (y != null) ? y : v.y);
            targ[vecFeild] = v;
        }
        static setVec3(targ, vecFeild, x, y, z) {
            let v = targ[vecFeild];
            v.setValue((x != null) ? x : v.x, (y != null) ? y : v.y, (z != null) ? z : v.z);
            targ[vecFeild] = v;
        }
        static setVec4(targ, vecFeild, x, y, z, w) {
            let v = targ[vecFeild];
            v.setValue((x != null) ? x : v.x, (y != null) ? y : v.y, (z != null) ? z : v.z, (w != null) ? w : v.w);
            targ[vecFeild] = v;
        }
        static setQuat(targ, quatField, x, y, z, w) {
            let v = targ[quatField];
            (x != null) && (v.x = x);
            (y != null) && (v.y = y);
            (z != null) && (v.z = z);
            (w != null) && (v.w = w);
            targ[quatField] = v;
        }
        static clamp(v, min, max) {
            let rs;
            if (v < min) {
                rs = min;
            }
            else if (v > max) {
                rs = max;
            }
            else {
                rs = v;
            }
            return rs;
        }
        static shakeByFactor(num, bitNum) {
            let rs = 0;
            let a = num;
            let t = Math.floor(a);
            rs += t;
            for (let i = 1; i < bitNum; i++) {
                a = (a - t) * 10;
                t = Math.floor(a);
                rs += t;
            }
            return (rs & 1) == 0 ? 1 : -1;
        }
        static rgb2hsv_arr(arr, o) {
            Util.rgb2hsv(arr[0], arr[1], arr[2], o);
        }
        static rgb2hsv(r, g, b, o_hsv) {
            let h, s, v;
            let max = Math.max(r, g, b);
            let min = Math.min(r, g, b);
            if (max == min) {
                h = g;
            }
            else if (Util.near(r, max)) {
                h = (g - b) / (max - min);
            }
            else if (Util.near(g, max)) {
                h = 2 + (b - r) / (max - min);
            }
            else {
                h = 4 + (r - g) / (max - min);
            }
            h *= 60;
            if (h < 0) {
                h += 360;
            }
            h = h / 360;
            s = (max - min) / max;
            v = max;
            o_hsv.h = h;
            o_hsv.s = s;
            o_hsv.v = v;
        }
        static hsv2rgb(hsv, o_color) {
            let R, G, B;
            let h = hsv.h, s = hsv.s, v = hsv.v;
            if (s == 0) {
                R = G = B = v;
            }
            else {
                h = h * 6;
                let i = Math.floor(h);
                let f = h - i;
                let a = v * (1 - s);
                let b = v * (1 - s * f);
                let c = v * (1 - s * (1 - f));
                switch (i) {
                    case 0:
                        R = v;
                        G = c;
                        B = a;
                        break;
                    case 1:
                        R = b;
                        G = v;
                        B = a;
                        break;
                    case 2:
                        R = a;
                        G = v;
                        B = c;
                        break;
                    case 3:
                        R = a;
                        G = b;
                        B = v;
                        break;
                    case 4:
                        R = c;
                        G = a;
                        B = v;
                        break;
                    case 5:
                        R = v;
                        G = a;
                        B = b;
                        break;
                    default:
                        R = 1;
                        G = 1;
                        B = 1;
                        console.error("hsv transfer error!");
                        break;
                }
            }
            o_color[0] = R;
            o_color[1] = G;
            o_color[2] = B;
        }
        static getFixedRandom(s) {
            let m_w = s;
            let m_z = 987654321;
            let mask = 0xffffffff;
            return function () {
                m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
                m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
                let result = ((m_z << 16) + m_w) & mask;
                result /= 4294967296;
                return parseFloat((result + 0.5).toFixed(2));
            };
        }
        static breakMS(ts) {
            return Util.breakS(Math.round(ts / 1000));
        }
        static breakS(s) {
            let m = Math.floor(s / 60);
            s -= m * 60;
            let mt = ('0' + m).slice(-2);
            let st = ('0' + s).slice(-2);
            return `${mt}:${st}`;
        }
        static pieMask(baseQuad, mask, sa, ea) {
            mask.graphics.clear();
            let w = baseQuad.width;
            let h = baseQuad.height;
            let hw = w * 0.5;
            let hh = h * 0.5;
            let r = hw > hh ? hh : hw;
            mask.graphics.drawPie(hw, hh, r, sa - 90, ea - 90, "fff");
        }
        static precision(num, s) {
            let offset = num < 0 ? -0.5 : 0.5;
            if (s == 0) {
                return parseInt(Number(num) + offset + '');
            }
            else {
                let times = Math.pow(10, s);
                let des = num * times + offset;
                return parseInt(des + '') / times;
            }
        }
        static formatCrc(crc, fixNum = 2) {
            let textTemp;
            if (crc >= 1e27) {
                textTemp = (crc / 1e27).toFixed(fixNum) + "ae";
            }
            else if (crc >= 1e24) {
                textTemp = (crc / 1e24).toFixed(fixNum) + "ad";
            }
            else if (crc >= 1e21) {
                textTemp = (crc / 1e21).toFixed(fixNum) + "ac";
            }
            else if (crc >= 1e18) {
                textTemp = (crc / 1e18).toFixed(fixNum) + "ab";
            }
            else if (crc >= 1e15) {
                textTemp = (crc / 1e15).toFixed(fixNum) + "aa";
            }
            else if (crc >= 1e12) {
                textTemp = (crc / 1e12).toFixed(fixNum) + "t";
            }
            else if (crc >= 1e9) {
                textTemp = (crc / 1e9).toFixed(fixNum) + "b";
            }
            else if (crc >= 1e6) {
                textTemp = (crc / 1e6).toFixed(fixNum) + "m";
            }
            else if (crc >= 1e3) {
                textTemp = (crc / 1e3).toFixed(fixNum) + "k";
            }
            else {
                textTemp = Math.round(crc).toString();
            }
            return textTemp;
        }
        static normV2(x, y, o) {
            let m = Math.sqrt(x * x + y * y);
            let nx = x / m;
            let ny = y / m;
            if (Array.isArray(o)) {
                o[0] = nx;
                o[1] = ny;
            }
            else {
                o["x"] = nx;
                o["y"] = ny;
            }
            return m;
        }
        static genArcPoint(orgX, orgY, longAxis, shortAxis) {
            return [
                [orgX, orgY], [orgX + longAxis * (1 - 0.866), orgY + shortAxis * 0.5], [orgX + longAxis * 0.5, orgY + shortAxis * 0.866],
                [orgX + longAxis, orgY + shortAxis], [orgX + longAxis + longAxis * 0.5, orgY + shortAxis * 0.866], [orgX + longAxis + longAxis * 0.866, orgY + shortAxis * 0.5],
                [orgX + longAxis * 2, orgY], [orgX + longAxis + longAxis * 0.866, orgY - shortAxis * 0.5], [orgX + longAxis + longAxis * 0.5, orgY - shortAxis * 0.866],
                [orgX + longAxis, orgY - shortAxis], [orgX + longAxis * 0.5, orgY - shortAxis * 0.866], [orgX + longAxis * (1 - 0.866), orgY - shortAxis * 0.5],
                [orgX, orgY], [orgX - longAxis * (1 - 0.866), orgY + shortAxis * 0.5], [orgX - longAxis * 0.5, orgY + shortAxis * 0.866],
                [orgX - longAxis, orgY + shortAxis], [orgX - longAxis - longAxis * 0.5, orgY + shortAxis * 0.866], [orgX - longAxis - longAxis * 0.866, orgY + shortAxis * 0.5],
                [orgX - longAxis * 2, orgY], [orgX - longAxis - longAxis * 0.866, orgY - shortAxis * 0.5], [orgX - longAxis - longAxis * 0.5, orgY - shortAxis * 0.866],
                [orgX - longAxis, orgY - shortAxis], [orgX - longAxis * 0.5, orgY - shortAxis * 0.866], [orgX - longAxis * (1 - 0.866), orgY - shortAxis * 0.5],
            ];
        }
        static checkNewDay(oldTime) {
            if (oldTime == 0) {
                return true;
            }
            let oldDate = new Date(oldTime);
            let oy = oldDate.getFullYear();
            let om = oldDate.getMonth();
            let od = oldDate.getDate();
            let curTime = Date.now();
            let nowDate = new Date();
            let ny = nowDate.getFullYear();
            let nm = nowDate.getMonth();
            let nd = nowDate.getDate();
            return (curTime > oldTime) && (ny > oy || nm > om || nd > od);
        }
        static genConf(arr) {
            let rs = {};
            let map = rs["map"] = {};
            rs["arr"] = arr;
            for (let v of arr) {
                map[v.id] = v;
            }
            return rs;
        }
        static custBackOut(s = 1.70158) {
            return (t, b, c, d) => {
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            };
        }
        static vibrate() {
            TJ.API.Vibrate.Short();
        }
        static getWord(id) {
            return LC.LangConf.map[id][Formula.lang];
        }
        static setSkin(img, id) {
            if (TJ.Engine.RuntimeInfo.platform == TJ.Define.Platform.Android && Formula.lang != "cn") {
                img.skin = "langPic/" + Formula.lang + "/" + LC.LangConf.map[id].name + ".png";
            }
        }
    }
    Util.lim = 1e-5;
    Util.deg2rad = Math.PI / 180;
    Util.rad2deg = 180 / Math.PI;

    let _G = window["G"];
    if (!_G) {
        _G = {};
        window["G"] = _G;
    }
    let G = _G;
    let _F = window["F"];
    if (!_F) {
        _F = {};
        window["F"] = _F;
    }
    let F = _F;
    var Core;
    (function (Core) {
        let Event;
        (function (Event) {
            class Mgr {
                constructor() {
                    this.dispatcher = new Laya.EventDispatcher();
                }
                init(segment) {
                    Mgr.notify("preloadStep", segment);
                    GameMgr.autoLoadNext();
                }
                static reg(type, caller, listener) {
                    if (!caller) {
                        console.error("caller must exist!");
                    }
                    Mgr.I.dispatcher.on(type.toString(), caller, listener);
                }
                static notify(type, args) {
                    Mgr.I.dispatcher.event(type.toString(), args);
                }
                static off(type, caller, listener) {
                    Mgr.I.dispatcher.off(type.toString(), caller, listener);
                }
                static offAll(type) {
                    Mgr.I.dispatcher.offAll(type.toString());
                }
                static offCaller(caller) {
                    Mgr.I.dispatcher.offAllCaller(caller);
                }
            }
            Event.Mgr = Mgr;
        })(Event = Core.Event || (Core.Event = {}));
        let Tween;
        (function (Tween) {
            class Tweener {
                constructor() {
                    this.id = Tweener.internalId;
                    this.inParams = [];
                    this.outParams = [];
                }
                static get internalId() {
                    return ++(Tweener._internalId);
                }
                set factor(v) {
                    if (this.update) {
                        this._factor = v;
                        this.update.runWith(this);
                    }
                }
                get factor() {
                    return this._factor;
                }
                beforeRun() {
                    this.pause = false;
                    for (let v of this.inParams) {
                        v.length = 0;
                    }
                    for (let v of this.outParams) {
                        v.length = 0;
                    }
                    this.delayCounter = 0;
                }
                play() {
                    this.beforeRun();
                    this.counter = 0;
                    this.factor = 0;
                    this.dir = true;
                }
                reverse(fromNow = false) {
                    if (this.loopDir == 0) {
                        this.beforeRun();
                        if (fromNow) {
                            this.counter = this.duration * this.factor;
                        }
                        else {
                            this.counter = this.duration;
                            this.factor = 1;
                        }
                        this.dir = false;
                    }
                }
                discard() {
                    this.hasClear = true;
                    if (this.complete) {
                        this.complete.recover();
                        this.complete = null;
                    }
                    if (this.update) {
                        this.update.recover();
                        this.update = null;
                    }
                }
                stop() {
                    this.pause = true;
                }
                _conf(duration, update, complete, loopDir, auto, ignoreTime, ease, delay) {
                    this.duration = duration;
                    this.update = update;
                    this.complete = complete;
                    this.loopDir = loopDir;
                    this.autoClear = auto;
                    this.ignoreTime = ignoreTime;
                    this.ease = ease;
                    this.delay = delay;
                    this.hasClear = false;
                    this.pause = true;
                }
                _step(dt) {
                    if (this.pause || this.hasClear) {
                        return;
                    }
                    if (this.delayCounter < this.delay) {
                        this.delayCounter += dt;
                        return;
                    }
                    if (this.dir) {
                        this.counter += dt;
                        let ratio = Util.clamp(this.counter / this.duration, 0, 1);
                        if (ratio == 1) {
                            this.factor = 1;
                        }
                        else {
                            this.factor = this.ease(this.counter, 0, 1, this.duration);
                        }
                        if (this.factor == 1) {
                            if (this.loopDir == 0) {
                                this.pause = true;
                                this.complete && this.complete.run();
                                this.autoClear && this.discard();
                            }
                            else if (this.loopDir == 1) {
                                this.dir = true;
                                this.counter = 0;
                                this.delayCounter = 0;
                            }
                            else if (this.loopDir == 2) {
                                this.dir = false;
                                this.counter = this.duration;
                                this.delayCounter = 0;
                            }
                        }
                    }
                    else {
                        this.counter -= dt;
                        let ratio = Util.clamp(this.counter / this.duration, 0, 1);
                        if (ratio == 0) {
                            this.factor = 0;
                        }
                        else {
                            this.factor = this.ease(this.counter, 0, 1, this.duration);
                        }
                        if (this.factor == 0) {
                            if (this.loopDir == 0) {
                                this.pause = true;
                                this.complete && this.complete.run();
                                this.autoClear && this.discard();
                            }
                            else if (this.loopDir == 1) {
                                console.error("unvalid tween");
                            }
                            else if (this.loopDir == 2) {
                                this.dir = true;
                                this.counter = 0;
                                this.delayCounter = 0;
                            }
                        }
                    }
                }
                getPG(groupName, group) {
                    let params = this[groupName];
                    let rs = params[group];
                    if (!rs) {
                        rs = [];
                        params[group] = rs;
                    }
                    return rs;
                }
            }
            Tweener._internalId = 0;
            Tween.Tweener = Tweener;
            class Mgr {
                constructor() {
                    this.idle = [];
                    this.busy = {};
                    this.clearCounter = 0;
                }
                init(segment) {
                    Laya.timer.frameLoop(1, this, this._update);
                    EventMgr.reg("pause", this, this.gamePause);
                    this.pause = false;
                    EventMgr.notify("preloadStep", segment);
                    GameMgr.autoLoadNext();
                }
                gamePause(state) {
                    this.pause = state;
                }
                _update() {
                    let busy = this.busy;
                    for (let id in busy) {
                        let t = busy[id];
                        if (!this.pause || t.ignoreTime) {
                            t._step(Laya.timer.delta);
                        }
                    }
                    this.clearCounter += 1;
                    if (this.clearCounter == 10) {
                        this.clearCounter = 0;
                        for (let id in busy) {
                            let t = busy[id];
                            if (t.hasClear) {
                                delete busy[id];
                                this.idle.push(t);
                            }
                        }
                    }
                }
                doTween(duration, update, complete, loopDir, auto, ignoreTime, ease, delay) {
                    let t = this.idle.pop() || new Tweener();
                    t._conf(duration, update, complete, loopDir, auto, ignoreTime, ease, delay);
                    this.busy[t.id] = t;
                    return t;
                }
                static tweenTiny(duration, caller, update, complete, ignoreTime = false, ease = Laya.Ease.linearNone, delay = 0) {
                    let t = Mgr.I.doTween(duration, Laya.Handler.create(caller, update, null, false), complete && Laya.Handler.create(caller, complete, null, false), 0, true, ignoreTime, ease, delay);
                    t.play();
                }
                static tweenCust(duration, caller, update, complete, ignoreTime = false, ease = Laya.Ease.linearNone, delay = 0) {
                    return Mgr.I.doTween(duration, Laya.Handler.create(caller, update, null, false), complete && Laya.Handler.create(caller, complete, null, false), 0, false, ignoreTime, ease, delay);
                }
                static tweenLoop(duration, caller, update, loopDir = 1, delay = 0, ease = Laya.Ease.linearNone, ignoreTime = false) {
                    return Mgr.I.doTween(duration, Laya.Handler.create(caller, update, null, false), null, loopDir, false, ignoreTime, ease, delay);
                }
                static _getFactor(t) {
                    return Number(t.factor.toFixed(4));
                }
                static lerp_Num(start, end, t, group = 0) {
                    let inParams = t.getPG("inParams", group);
                    if (inParams.length == 0) {
                        inParams[0] = start;
                        inParams[1] = end;
                    }
                    let outParams = t.getPG("outParams", group);
                    outParams[0] = inParams[0] + (inParams[1] - inParams[0]) * Mgr._getFactor(t);
                }
                static lerp_Vec2(start, end, t, group = 0) {
                    let inParams = t.getPG("inParams", group);
                    if (inParams.length == 0) {
                        inParams[0] = start.x;
                        inParams[1] = end.x - start.x;
                        inParams[2] = start.y;
                        inParams[3] = end.y - start.y;
                    }
                    let outParams = t.getPG("outParams", group);
                    let f = Mgr._getFactor(t);
                    outParams[0] = inParams[0] + inParams[1] * f;
                    outParams[1] = inParams[2] + inParams[3] * f;
                }
            }
            Tween.Mgr = Mgr;
        })(Tween = Core.Tween || (Core.Tween = {}));
        let Resource;
        (function (Resource) {
            class Mgr {
                init(segment) {
                    GameMgr.autoLoadNext();
                }
                doGetLh(keyName) {
                    this.willLoad = keyName;
                    this.poolSign = "LH_" + keyName;
                    let lh = Laya.Pool.getItemByCreateFun(this.poolSign, this.createFun, this);
                    lh.active = true;
                    return lh;
                }
                createFun() {
                    let inst = Laya.Loader.getRes(`res3d/${this.willLoad}.lh`).clone();
                    inst["_orgName"] = this.poolSign;
                    return inst;
                }
                static getLh(keyName) {
                    return Mgr.I.doGetLh(keyName);
                }
                static recycleLh(inst, clearComs = false) {
                    clearComs && inst["_destroyAllComponent"].call(inst);
                    inst.removeSelf();
                    inst.active = false;
                    Laya.Pool.recover(inst["_orgName"], inst);
                }
            }
            Resource.Mgr = Mgr;
            class BaseObj {
                constructor() {
                    this._isInit = false;
                }
                get trans() {
                    return this.obj.transform;
                }
                recycle() {
                    if (!this._isRecycle) {
                        this._isRecycle = true;
                        Laya.timer.clearAll(this);
                        this.onRecycle();
                        ObjPool._recycle(this);
                    }
                }
                useUpdate() {
                    Laya.timer.frameLoop(1, this, this.onUpdate);
                }
                onUpdate() { }
                onRecycle() {
                    this.obj && ResourceMgr.recycleLh(this.obj);
                }
            }
            Resource.BaseObj = BaseObj;
            class ObjPool {
                static get interId() {
                    ObjPool._id += 1;
                    return ObjPool._id;
                }
                static get(cls, args) {
                    let clsName = cls["_cls"];
                    if (!clsName) {
                        console.error("_cls not implement");
                        return;
                    }
                    let branch = ObjPool.map[clsName];
                    if (!branch) {
                        ObjPool.map[clsName] = branch = {};
                    }
                    let item = Laya.Pool.getItemByClass(clsName, cls);
                    if (!item._isInit) {
                        item._clsName = clsName;
                        item._mid = ObjPool.interId;
                        item.onInit();
                        item._isInit = true;
                    }
                    branch[item._mid] = item;
                    item._isRecycle = false;
                    item.onRecover(args);
                    return item;
                }
                static _recycle(obj) {
                    let branch = ObjPool.map[obj._clsName];
                    delete branch[obj._mid];
                    Laya.Pool.recover(obj._clsName, obj);
                }
                static recycleAll() {
                    for (let clsName in ObjPool.map) {
                        let branch = ObjPool.map[clsName];
                        for (let id in branch) {
                            branch[id].recycle();
                        }
                        branch = {};
                    }
                }
            }
            ObjPool.map = {};
            ObjPool._id = 0;
            Resource.ObjPool = ObjPool;
        })(Resource = Core.Resource || (Core.Resource = {}));
        let Data;
        (function (Data) {
            class Mgr {
                constructor() {
                    this.playerData = {};
                }
                init(segment) {
                    let keysInfo = Formula.playerLocalKeys;
                    let gameId = this.doGetValue("gameId");
                    Formula.fstPlay = gameId != keysInfo.gameId;
                    if (Formula.fstPlay) {
                        Laya.LocalStorage.clear();
                        for (let k in keysInfo) {
                            this.doSetValue(k, this.getDf(keysInfo[k]));
                        }
                    }
                    else {
                        let version = this.doGetValue("version");
                        let compare = keysInfo.version;
                        if (version < compare) {
                            this.doSetValue("version", compare);
                            for (let k in keysInfo) {
                                let localVal = this.doGetValue(k);
                                if (localVal == null) {
                                    this.doSetValue(k, this.getDf(keysInfo[k]));
                                }
                                else {
                                    this.playerData[k] = localVal;
                                }
                            }
                        }
                        else {
                            for (let k in keysInfo) {
                                this.playerData[k] = this.doGetValue(k);
                            }
                        }
                    }
                    (Formula.maxEnergy > 0) && new Energy(Formula.recoverEnergyTs, Formula.maxEnergy);
                    let orgLC = LC;
                    let pathList = [];
                    let keyList = [];
                    for (let k in orgLC) {
                        pathList.push(`config/${orgLC[k]._file}.json`);
                        keyList.push(k);
                    }
                    let lastValue = null;
                    let onPrg = Laya.Handler.create(null, (v) => {
                        let delta = lastValue == null ? v : (v - lastValue);
                        EventMgr.notify("preloadStep", delta * segment);
                        lastValue = v;
                    }, null, false);
                    let onCpl = Laya.Handler.create(null, (res) => {
                        for (let i = 0, len = pathList.length; i < len; i++) {
                            let jsonObj = Laya.Loader.getRes(pathList[i].url);
                            let dataSt = orgLC[keyList[i]];
                            dataSt.arr = jsonObj;
                            if (jsonObj[0].id) {
                                for (let v of jsonObj) {
                                    dataSt.map[v.id] = v;
                                }
                            }
                        }
                        onPrg.recover();
                        GameMgr.autoLoadNext();
                    });
                    Laya.loader.create(pathList, onCpl, onPrg);
                }
                getDf(value) {
                    if (value == "__ts__") {
                        return Date.now();
                    }
                    else if (typeof (value) == "function") {
                        return value();
                    }
                    else {
                        return value;
                    }
                }
                doGetValue(key) {
                    let v = Laya.LocalStorage.getItem(key);
                    if (v === "") {
                        return "";
                    }
                    else {
                        return JSON.parse(v);
                    }
                }
                doSetValue(key, value) {
                    if (value === "" || value === null) {
                        console.error("save data error, key is: ", key);
                    }
                    let curValue = this.playerData[key];
                    let valid = curValue != value;
                    if (valid) {
                        this.playerData[key] = value;
                        Laya.LocalStorage.setItem(key, JSON.stringify(value));
                    }
                    return valid;
                }
                doSetObjItem(key, itemKey, value) {
                    let obj = this.playerData[key];
                    let curValue = obj[itemKey];
                    if (curValue != value) {
                        obj[itemKey] = value;
                        Laya.LocalStorage.setItem(key, JSON.stringify(obj));
                    }
                }
                doDeltaNum(key, delta) {
                    if (delta != 0) {
                        let curValue = this.playerData[key];
                        curValue += delta;
                        this.playerData[key] = curValue;
                        Laya.LocalStorage.setItem(key, JSON.stringify(curValue));
                    }
                }
                doSetArray(key, value) {
                    let curValue = this.playerData[key];
                    if (value != curValue) {
                        curValue.length = 0;
                        for (let i = 0, len = value.length; i < len; i++) {
                            curValue[i] = value[i];
                        }
                    }
                    Laya.LocalStorage.setItem(key, JSON.stringify(curValue));
                }
                doSetObj(key) {
                    Laya.LocalStorage.setItem(key, JSON.stringify(this.playerData[key]));
                }
                static setValue(key, value) {
                    return DataMgr.I.doSetValue(key, value);
                }
                static setObjItem(key, itemKey, value) {
                    Mgr.I.doSetObjItem(key, itemKey, value);
                }
                static deltaNum(key, value) {
                    Mgr.I.doDeltaNum(key, value);
                }
                static setArray(key, value) {
                    Mgr.I.doSetArray(key, value);
                }
                static setObject(key) {
                    Mgr.I.doSetObj(key);
                }
                static getPlayerData(key) {
                    let data = Mgr.I.playerData;
                    if (key) {
                        return data[key];
                    }
                    else {
                        return data;
                    }
                }
            }
            Data.Mgr = Mgr;
            class Energy {
                constructor(itvTs, max, onceAdd = 1) {
                    this.dataKey = "energy";
                    this.tsKey = "energyTs";
                    this.updateTs = 1000;
                    this.itv = itvTs;
                    this.onceAdd = onceAdd;
                    this.max = max;
                    let now = Date.now();
                    let times = Math.floor((now - this.energyTs) / itvTs);
                    Mgr.setValue(this.dataKey, Util.clamp(this.value + times * onceAdd, 0, this.max));
                    Mgr.setValue(this.tsKey, this.energyTs + itvTs * times);
                    let elapse = (this.value < this.max) ? (now - this.energyTs) : 0;
                    this.counter = itvTs - elapse;
                    Laya.timer.loop(this.updateTs, this, this.scdUpdate);
                }
                get value() {
                    return Mgr.getPlayerData(this.dataKey);
                }
                get energyTs() {
                    return Mgr.getPlayerData(this.tsKey);
                }
                scdUpdate() {
                    if (this.value < this.max) {
                        let now = Date.now();
                        let cutTs = this.lastCounter ? (now - this.lastCounter) : this.updateTs;
                        this.lastCounter = now;
                        this.counter -= cutTs;
                        if (this.counter > -80 && this.counter < 80) {
                            this.counter = 0;
                        }
                        if (this.counter <= 0) {
                            let exceed = -1 * this.counter;
                            let add = Math.floor(exceed / this.itv);
                            let elapse = exceed - add * this.itv;
                            this.counter = this.itv - elapse;
                            let _value = this.value + add + 1;
                            if (_value >= this.max) {
                                _value = this.max;
                                this.lastCounter = null;
                            }
                            Mgr.setValue(this.dataKey, _value);
                            Mgr.setValue(this.tsKey, now - elapse);
                        }
                        EventMgr.notify("energyTick", this.counter);
                    }
                }
            }
        })(Data = Core.Data || (Core.Data = {}));
        let Scene;
        (function (Scene) {
            class Mgr {
                constructor() {
                    this.lastOffset = new Laya.Point();
                    this.efxList = [];
                    this.maxTimeMap = [];
                }
                init(segment) {
                    this.nodeMap = {};
                    let sceneInfo = Formula.startScene;
                    if (sceneInfo.path == "") {
                        EventMgr.notify("preloadStep", segment);
                        GameMgr.autoLoadNext();
                    }
                    else {
                        let onCpl = Laya.Handler.create(null, (scene) => {
                            this.root = Laya.stage.addChildAt(scene, 0);
                            this.setMap(sceneInfo.nodeConf);
                            EventMgr.notify("preloadStep", segment);
                            GameMgr.autoLoadNext();
                        });
                        Laya.Scene.load(sceneInfo.path, onCpl);
                    }
                    Laya.timer.frameLoop(1, this, this.update);
                }
                setMap(nodeConf) {
                    for (let v of nodeConf) {
                        if (typeof (v) == "string") {
                            let node = this.nodeMap[v] = this.root.addChild(new Laya.Sprite());
                            node.name = v;
                        }
                        else {
                            let node = this.root;
                            let arr = v[0].split("/");
                            for (let name of arr) {
                                node = node.getChildByName(name);
                            }
                            this.nodeMap[v[1]] = node;
                        }
                    }
                }
                doCloseScene() {
                    this.nodeMap = {};
                    this.root && this.root.destroy(true);
                    this.root = null;
                }
                doLoadScene(sceneInfo, onCpl) {
                    this.doCloseScene();
                    if (sceneInfo.path == "") {
                        onCpl();
                    }
                    else {
                        Laya.Scene.load(sceneInfo.path, Laya.Handler.create(null, (scene) => {
                            this.root = Laya.stage.addChildAt(scene, 0);
                            this.setMap(sceneInfo.nodeConf);
                            onCpl();
                        }));
                    }
                }
                update() {
                    let dt = Laya.timer.delta;
                    if (this.efxList.length > 0) {
                        for (let i = 0; i < this.efxList.length; i++) {
                            let info = this.efxList[i];
                            info[2] += dt;
                            if (info[2] >= info[1]) {
                                info[3] && info[3]();
                                ResourceMgr.recycleLh(info[0]);
                                this.efxList.splice(i, 1);
                                i--;
                            }
                        }
                    }
                }
                doAddLittleEfx(name, x, y, z, parent, onCpl, joinPlay) {
                }
                static loadScene(sceneInfo, onCpl) {
                    Mgr.I.doLoadScene(sceneInfo, onCpl);
                }
                static shakeNode(a = 0.05, t = 200, node = Mgr.getNode("Camera")) {
                }
                static getNode(name) {
                    return name ? Mgr.I.nodeMap[name] : Mgr.I.root;
                }
                static addObj(src, parentName) {
                    Mgr.getNode(parentName).addChild(src);
                    return src;
                }
                static addEfx(name, x = 0, y = 0, z = 0, parent, onCpl, joinPlay = true) {
                    return Mgr.I.doAddLittleEfx(name, x, y, z, parent, onCpl, joinPlay);
                }
            }
            Scene.Mgr = Mgr;
        })(Scene = Core.Scene || (Core.Scene = {}));
        let UI;
        (function (UI) {
            let OpenType;
            (function (OpenType) {
                OpenType[OpenType["Once"] = 1] = "Once";
                OpenType[OpenType["Unique"] = 2] = "Unique";
                OpenType[OpenType["Attach"] = 3] = "Attach";
                OpenType[OpenType["Promo"] = 4] = "Promo";
                OpenType[OpenType["Top"] = 5] = "Top";
                OpenType[OpenType["Debug"] = 6] = "Debug";
            })(OpenType = UI.OpenType || (UI.OpenType = {}));
            class UIBase extends Laya.Script {
                constructor() {
                    super(...arguments);
                    this._openType = OpenType.Unique;
                    this._forceShowPromo = false;
                    this._fadeIn = true;
                    this._updateFuncs = [];
                }
                get obj() {
                    return this.owner;
                }
                get uiName() {
                    return this["constructor"]["UINAME"];
                }
                onInit() { }
                onShow(args) { }
                onHide() { }
                onRefresh() { }
                update() { }
                onAwake() {
                    this._taRecoard("Load");
                }
                onStart() {
                    this._taRecoard("Start");
                }
                onEnable() {
                    this._taRecoard("Enable");
                }
                onDisable() {
                    this._taRecoard("Disable");
                }
                onDestroy() {
                    this._taRecoard("Destroy");
                }
                _taRecoard(name) {
                    if (this._openType <= 3) {
                    }
                }
                _setLiving(state) {
                    this._living = this.obj.visible = this.obj.active = state;
                }
                onUpdate() {
                    for (let f of this._updateFuncs) {
                        f();
                    }
                    this.update();
                }
                vars(name) {
                    return this.owner[name];
                }
                btnEv(name, func, caller = this, sound = true, pressAnim = true) {
                    let btn = this.vars(name);
                    UIMgr.btnEv(btn, func, caller, sound, pressAnim);
                    return btn;
                }
                static btnZoom(e) {
                    if (!e.target["_inScale"]) {
                        e.target["_inScale"] = true;
                        e.target["_tScale"].play();
                    }
                }
                static btnShrink(e) {
                    if (e.target["_inScale"]) {
                        e.target["_inScale"] = false;
                        e.target["_tScale"].reverse(true);
                    }
                }
                initPrg(name, isH = false, dfValue = 0, moveFg = false) {
                    let prg = this.owner[name].addComponent(ProgressBar);
                    prg.isH = isH;
                    prg.RefreshHN();
                    prg.moveFg = moveFg;
                    prg.setValue(dfValue);
                    return prg;
                }
                initTab(name, onTabChange, onTabView, fst = 0, isCancel = false) {
                    let tab = this.owner[name].addComponent(PageTab);
                    tab.init(onTabChange, onTabView, fst, isCancel);
                    return tab;
                }
                initSmartNum(name, fmt, duration) {
                    let sn = this.owner[name].addComponent(SmartNumber);
                    sn.init(fmt, duration);
                    return sn;
                }
                floatLight(name, sx, ex, speed = 12) {
                    let node = this.owner[name];
                    let floatObj = node.getChildByName("FL");
                    floatObj.x = sx;
                    let state = 1;
                    let counter = 0;
                    let updateFunc = () => {
                        if (state == 0) {
                            counter += 0.02;
                            if (counter > 2) {
                                counter = 0;
                                state = 1;
                            }
                        }
                        else {
                            let x = floatObj.x + speed;
                            if (x > ex) {
                                x = sx;
                                state = 0;
                            }
                            floatObj.x = x;
                        }
                    };
                    this._updateFuncs.push(updateFunc);
                }
                rotateImgByName(name, speed = -1) {
                    this.rotateImgByObj(this.owner[name], speed);
                }
                rotateImgByObj(img, speed = -1) {
                    let updateFunc = () => {
                        img.rotation += speed;
                    };
                    this._updateFuncs.push(updateFunc);
                }
                fadeImgByName(name, maxSize = 1.5, speed = 0.008) {
                    this.fadeImgByObj(this.owner[name], maxSize, speed);
                }
                fadeImgByObj(img, maxSize = 1.5, speed = 0.008) {
                    let size = 1;
                    let alpha;
                    let updateFunc = () => {
                        size += speed;
                        alpha = 1 - (size - 1) / (maxSize - 1);
                        if (size >= maxSize) {
                            size = 1;
                            alpha = 1;
                        }
                        img.scale(size, size);
                        img.alpha = alpha;
                    };
                    this._updateFuncs.push(updateFunc);
                }
                zoomImgByName(name, speed = 0.005, range = 0.1) {
                    this.zoomImgByObj(this.owner[name], speed, range);
                }
                zoomImgByObj(img, speed = 0.005, range = 0.1) {
                    let state = 1;
                    let size = 1;
                    let maxSize = size + range;
                    let minSize = size - range;
                    let updateFunc = () => {
                        if (state == 1) {
                            size += speed;
                            if (size >= maxSize) {
                                size = maxSize;
                                state = 2;
                            }
                        }
                        else if (state == 2) {
                            size -= speed;
                            if (size <= minSize) {
                                size = minSize;
                                state = 1;
                            }
                        }
                        img.scale(size, size);
                    };
                    this._updateFuncs.push(updateFunc);
                }
                hide() {
                    UIMgr.hide(this.uiName);
                }
                createRenderScene3d(camPx, camPy, camRx, scale = 10, siblingIdx = -1) {
                    let s3d = new Laya.Scene();
                    if (siblingIdx != -1) {
                        this.obj.addChildAt(s3d, siblingIdx);
                    }
                    else {
                        this.obj.addChild(s3d);
                    }
                    let cam = s3d.addChild(new Laya.Camera(0, 0.1, 100));
                    cam.orthographic = true;
                    cam.orthographicVerticalSize = scale;
                    cam.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
                    cam.transform.localPosition.setValue(camPx, camPy, 0);
                    cam.transform.localRotationEulerX = camRx;
                    this["s3d"] = s3d;
                    this["cam"] = cam;
                }
            }
            UI.UIBase = UIBase;
            class Mgr {
                constructor() {
                    this.steps = 2;
                    this.uiMap = {};
                    this.openStack = [];
                    this.uiOffset = 0;
                }
                init(segment) {
                    this.segment = segment / this.steps;
                    Laya.Scene.close("sys/UIInit.scene");
                    this.checkNext();
                    Laya.Scene.open(`sys/UITop.scene`, false, null, Laya.Handler.create(null, (res) => {
                        this.uiTop = res.addComponent(UITop);
                        this.uiTop.onInit();
                        this.uiOffset += 1;
                        if (Formula.debug) {
                            Laya.Scene.open(`sys/UIDebug.scene`, false, null, Laya.Handler.create(null, (res) => {
                                this.uiDebug = res.addComponent(UIDebug);
                                this.uiDebug.onInit();
                                this.uiOffset += 1;
                                this.checkNext();
                            }));
                        }
                        else {
                            this.checkNext();
                        }
                    }));
                }
                checkNext() {
                    EventMgr.notify("preloadStep", this.segment);
                    this.steps--;
                    this.steps == 0 && GameMgr.autoLoadNext();
                }
                doShow(name, args) {
                    let ui = this.uiMap[name];
                    console.log("dasfadsf=>>>>>", `sys/${name}.scene`);
                    if (!ui) {
                        Laya.Scene.open(`sys/${name}.scene`, false, null, Laya.Handler.create(null, (res) => {
                            let cls = G[name];
                            cls["UINAME"] = name;
                            ui = res.addComponent(cls);
                            this.uiMap[name] = ui;
                            ui.onInit();
                            this._show(ui, args);
                        }));
                    }
                    else {
                        this._show(ui, args);
                    }
                }
                _show(ui, args) {
                    let isUnique = false;
                    if (ui._openType == OpenType.Once || ui._openType == OpenType.Unique) {
                        isUnique = true;
                        for (let openedUI of this.openStack) {
                            this._hide(openedUI);
                        }
                        this.openStack.length = 0;
                        this.openStack.push(ui);
                    }
                    else {
                        this.openStack.push(ui);
                    }
                    ui._setLiving(true);
                    let offset = this.uiOffset;
                    if (!this.uiRoot) {
                        this.uiRoot = Laya.stage.getChildAt(0);
                        offset = 0;
                    }
                    let pos = this.uiRoot.numChildren - 1 - offset;
                    this.uiRoot.setChildIndex(ui.owner, pos);
                    if (ui._fadeIn) {
                        TweenMgr.tweenTiny(250, null, (t) => {
                            ui.obj.alpha = t.factor;
                        }, null, true);
                    }
                    ui.onShow(args);
                }
                doHide(name) {
                    for (let i = 0, len = this.openStack.length; i < len; i++) {
                        let ui = this.openStack[i];
                        if (ui.uiName == name) {
                            this.openStack.splice(i, 1);
                            this._hide(ui);
                            break;
                        }
                    }
                }
                doRefreshCurShowing() {
                    for (let ui of this.openStack) {
                        ui.onRefresh();
                    }
                }
                _hide(ui) {
                    if (ui._openType == OpenType.Once) {
                        Laya.Scene.close(ui.obj.url);
                    }
                    else {
                        ui._setLiving(false);
                    }
                    ui.onHide();
                }
                static show(name, args) {
                    Mgr.I.doShow(name, args);
                }
                static hide(name) {
                    Mgr.I.doHide(name);
                }
                static refreshCurShowing() {
                    Mgr.I.doRefreshCurShowing();
                }
                static tip(cont, mode = 0) {
                    Mgr.I.uiTop.showTip(cont, mode);
                }
                static interim1(cb) {
                    Mgr.I.uiTop.showInterim1(cb);
                }
                static interim2(cb) {
                    Mgr.I.uiTop.showInterim2(cb);
                }
                static ctrlWait(state) {
                    Mgr.I.uiTop.ctrlWait(state);
                }
                static ctrlMask(state) {
                    Mgr.I.uiTop.ctrlMask(state);
                }
                static guide(targ) {
                    Mgr.I.uiTop.guide(targ);
                }
                static guideRect(x, y, w, h, sx, sy, ex, ey) {
                    Mgr.I.uiTop.guideRect(x, y, w, h, sx, sy, ex, ey);
                }
                static guideCircle(x, y, radius, sx, sy, ex, ey) {
                    Mgr.I.uiTop.guideCircle(x, y, radius, sx, sy, ex, ey);
                }
                static ctrlGuide(state) {
                    Mgr.I.uiTop.ctrlGuide(state);
                }
                static get(name) {
                    let ui = Mgr.I.uiMap[name];
                    if (ui && ui._living) {
                        return ui;
                    }
                    else {
                        return null;
                    }
                }
                static debugObj(targ) {
                    Mgr.I.uiDebug.bindObj(targ);
                }
                static btnEv(btn, func, caller, sound = true, pressAnim = true) {
                    btn.on(Laya.Event.CLICK, caller, () => {
                        sound && GameMgr.playSound("btn");
                        func.call(caller);
                    });
                    if (pressAnim) {
                        btn.on(Laya.Event.MOUSE_DOWN, UIBase, UIBase.btnZoom);
                        btn.on(Laya.Event.MOUSE_UP, UIBase, UIBase.btnShrink);
                        btn.on(Laya.Event.MOUSE_OUT, UIBase, UIBase.btnShrink);
                        btn["_tScale"] = TweenMgr.tweenCust(100, null, (t) => {
                            let v = 1 + t.factor * 0.04;
                            btn.scale(v, v);
                        }, null, true);
                    }
                }
                static showP(id, args) {
                }
                static hideP(id) {
                }
            }
            UI.Mgr = Mgr;
            class UIDebug extends UIBase {
                constructor() {
                    super(...arguments);
                    this._openType = OpenType.Debug;
                    this.sldList = [];
                }
                get ctrlTrans() {
                    return this.ctrlObj.transform;
                }
                onInit() {
                    this.obj.alpha = 0.5;
                    this.btnEv("BtnSwitch", this.onClick_BtnSwitch);
                    this.uiState = true;
                    this.onClick_BtnSwitch();
                    this.btnEv("BtnExecute", () => {
                        EventMgr.notify("debugExeCmd", this.vars("InputCmd").text);
                    });
                    for (let i = 1; i <= 4; i++) {
                        this.btnEv("Btn" + i, () => {
                            EventMgr.notify("debugBtn" + i);
                        });
                    }
                    this.transTab = this.initTab("RatioGroup", (idx, state) => {
                        this.changeTransOp(idx);
                    }, (child, state, childIdx) => {
                        child.getChildAt(0).skin = state ? "common/ratio2.png" : "common/ratio1.png";
                    });
                    let index = 0;
                    for (let v of ["SldX", "SldY", "SldZ"]) {
                        let sld = this.vars(v);
                        let item = {
                            id: index, sld: sld, sldT: sld.getChildByName("SldT"),
                            rangeT: sld.getChildByName("Range"),
                            min: 0, max: 100
                        };
                        this.sldList.push(item);
                        sld.on(Laya.Event.CHANGE, this, this.onSldChange, [item]);
                        index++;
                    }
                    this.vars("RangeInput").on(Laya.Event.ENTER, this, this.onInputCpl);
                    this.vars("VertionT").text = Formula.version;
                    this._setLiving(true);
                }
                onClick_BtnSwitch() {
                    this.uiState = !this.uiState;
                    this.vars("TransCtrl").visible = this.vars("InputCtrl").visible = this.vars("BtnCtrl").visible = this.uiState;
                }
                onInputCpl(ipt) {
                    UIDebug.OPRange[this.transTab.curIdx] = Number(ipt.text);
                    this.transTab.force(this.transTab.curIdx);
                }
                bindObj(targ) {
                    this.ctrlObj = targ;
                    this.syncTransUIInfo();
                }
                onSldChange(sldItem) {
                    if (this.ctrlObj) {
                        let real = sldItem.min + (sldItem.max - sldItem.min) * sldItem.sld.value / 100;
                        real = Util.precision(real, 2);
                        sldItem.sldT.text = real;
                        if (sldItem.id == 0) {
                            Util.setVec3(this.ctrlTrans, this.opName, real);
                        }
                        else if (sldItem.id == 1) {
                            Util.setVec3(this.ctrlTrans, this.opName, null, real);
                        }
                        else if (sldItem.id == 2) {
                            Util.setVec3(this.ctrlTrans, this.opName, null, null, real);
                        }
                    }
                }
                changeTransOp(idx) {
                    this.opName = UIDebug.OPName[idx];
                    this.range = UIDebug.OPRange[idx];
                    this.vars("RangeInput").text = this.range;
                    this.syncTransUIInfo();
                }
                syncTransUIInfo() {
                    if (this.ctrlObj) {
                        let vec = this.ctrlTrans[this.opName];
                        this.setSldItem(0, vec.x);
                        this.setSldItem(1, vec.y);
                        this.setSldItem(2, vec.z);
                    }
                }
                setSldItem(id, curVal) {
                    let item = this.sldList[id];
                    item.min = Util.precision(curVal - this.range, 2);
                    item.max = Util.precision(curVal + this.range, 2);
                    item.rangeT.text = `${item.min} ~ ${item.max}`;
                    if (item.sld.value == 50) {
                        this.onSldChange(item);
                    }
                    else {
                        item.sld.value = 50;
                    }
                }
            }
            UIDebug.OPName = ["localPosition", "localRotationEuler", "localScale"];
            UIDebug.OPRange = [10, 180, 2];
            UI.UIDebug = UIDebug;
            class UITop extends UIBase {
                constructor() {
                    super(...arguments);
                    this._openType = OpenType.Top;
                    this.cacheSize = new Laya.Point();
                    this.zeroSize = new Laya.Point(0, 0);
                    this.tipList = [];
                }
                onInit() {
                    (this.interim1 = this.vars("Interim1")).visible = false;
                    (this.interim2 = this.vars("Interim2")).visible = false;
                    (this.waitting = this.vars("Waitting")).visible = false;
                    (this.finger = this.vars("Finger")).visible = false;
                    (this.block = this.btnEv("Block", () => { }, null, false)).visible = false;
                    this.lt = this.vars("LT");
                    this.lb = this.vars("LB");
                    this.rt = this.vars("RT");
                    this.rb = this.vars("RB");
                    for (let i = 0; i < 3; i++) {
                        let item = this.vars("Tip" + i).addComponent(TipItem);
                        item.init(this.tipList);
                        this.tipList.push(item);
                    }
                    this.tRot = TweenMgr.tweenLoop(3000, this, this.tweenRot, 1);
                    this.w1 = this.vars("W1");
                    this.w2 = this.vars("W2");
                    this._setLiving(true);
                }
                showTip(cont, mode) {
                    let item = this.tipList.pop();
                    if (item) {
                        !mode ? item.showV(cont) : item.showH(cont);
                    }
                }
                showInterim1(cb) {
                    this.onCpl = cb;
                    this.interim1.visible = this.block.visible = true;
                    TweenMgr.tweenTiny(300, this, this.tweenAlpha, this.tweenAlphaCpl, true);
                }
                tweenAlpha(t) {
                    this.interim1.alpha = t.factor;
                }
                tweenAlphaCpl() {
                    if (this.onCpl) {
                        this.onCpl();
                        this.onCpl = null;
                    }
                    TweenMgr.tweenTiny(500, this, this.tweenAlpha2, this.tweenAlphaCpl2, true, Laya.Ease.linearNone, 200);
                }
                tweenAlpha2(t) {
                    this.interim1.alpha = 1 - t.factor;
                }
                tweenAlphaCpl2() {
                    this.interim1.visible = this.block.visible = false;
                }
                showInterim2(cb) {
                    this.onCpl = cb;
                    this.interim2.visible = this.block.visible = true;
                    this.cacheSize.x = Laya.stage.width * 0.6;
                    this.cacheSize.y = Laya.stage.height * 0.6;
                    TweenMgr.tweenTiny(300, this, this.tweenScale, this.tweenScaleCpl, true);
                }
                tweenScale(t) {
                    TweenMgr.lerp_Vec2(this.zeroSize, this.cacheSize, t);
                    let w = t.outParams[0][0];
                    let h = t.outParams[0][1];
                    this.lt.size(w, h);
                    this.lb.size(w, h);
                    this.rt.size(w, h);
                    this.rb.size(w, h);
                }
                tweenScaleCpl() {
                    if (this.onCpl) {
                        this.onCpl();
                        this.onCpl = null;
                    }
                    TweenMgr.tweenTiny(400, this, this.tweenScale2, this.tweenScaleCpl2, true, Laya.Ease.linearNone, 250);
                }
                tweenScale2(t) {
                    TweenMgr.lerp_Vec2(this.cacheSize, this.zeroSize, t);
                    let w = t.outParams[0][0];
                    let h = t.outParams[0][1];
                    this.lt.size(w, h);
                    this.lb.size(w, h);
                    this.rt.size(w, h);
                    this.rb.size(w, h);
                }
                tweenScaleCpl2() {
                    this.interim2.visible = this.block.visible = false;
                }
                ctrlWait(state) {
                    if (state) {
                        this.waitting.visible = this.block.visible = true;
                        this.tRot.play();
                    }
                    else {
                        TweenMgr.tweenTiny(200, this, this.tweenWaitAlpha, this.tweenWaitAlphaCpl, true, Laya.Ease.linearNone, 300);
                    }
                }
                tweenWaitAlpha(t) {
                    this.waitting.alpha = 1 - t.factor;
                }
                tweenWaitAlphaCpl() {
                    this.tRot.stop();
                    this.waitting.visible = this.block.visible = false;
                }
                tweenRot(t) {
                    this.w1.rotation = this.w2.rotation = t.factor * 360;
                }
                ctrlMask(state) {
                    this.block.visible = state;
                }
                _initGuide() {
                    let guideContainer = new Laya.Sprite();
                    Laya.stage.addChild(guideContainer);
                    guideContainer.cacheAs = "bitmap";
                    let maskArea = new Laya.Sprite();
                    guideContainer.addChild(maskArea);
                    maskArea.alpha = 0.5;
                    maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");
                    let interactionArea = new Laya.Sprite();
                    guideContainer.addChild(interactionArea);
                    interactionArea.blendMode = "destination-out";
                    let hitArea = new Laya.HitArea();
                    hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000");
                    guideContainer.hitArea = hitArea;
                    guideContainer.mouseEnabled = true;
                    this.guideContainer = guideContainer;
                    this.hitArea = hitArea;
                    this.interactionArea = interactionArea;
                }
                guideRect(x, y, w, h, sx, sy, ex, ey) {
                    this._before();
                    this.hitArea.unHit.clear();
                    this.hitArea.unHit.drawRect(x, y, w, h, "#000000");
                    this.interactionArea.graphics.clear();
                    this.interactionArea.graphics.drawRect(x, y, w, h, "#000000");
                    this.finger.visible = true;
                    this.finger.pos(sx, sy);
                    this._after(sx, sy, ex, ey);
                }
                guideCircle(x, y, radius, sx, sy, ex, ey) {
                    this._before();
                    this.hitArea.unHit.clear();
                    this.hitArea.unHit.drawCircle(x, y, radius, "#000000");
                    this.interactionArea.graphics.clear();
                    this.interactionArea.graphics.drawCircle(x, y, radius, "#000000");
                    this.finger.visible = true;
                    this.finger.pos(sx, sy);
                    this._after(sx, sy, ex, ey);
                }
                guide(targ) {
                    this._before();
                    let w = targ.width * 1.1;
                    let h = targ.height * 1.1;
                    let x = targ.x - w * targ.anchorX;
                    let y = targ.y - h * targ.anchorY;
                    let fingerX = targ.x + w * (targ.anchorX - 0.5);
                    let fingerY = targ.y + h * (targ.anchorY - 0.5);
                    this.hitArea.unHit.clear();
                    this.hitArea.unHit.drawRect(x, y, w, h, "#000000");
                    this.interactionArea.graphics.clear();
                    this.interactionArea.graphics.drawRect(x, y, w, h, "#000000");
                    this.finger.visible = true;
                    this.finger.pos(fingerX, fingerX);
                    this._after(fingerX, fingerY, fingerX + 8, fingerY + 8);
                }
                _before() {
                    if (!this.guideContainer) {
                        this._initGuide();
                    }
                    this.ctrlGuide(true);
                }
                _after(sx, sy, ex, ey) {
                    this.tFinger = TweenMgr.tweenLoop(500, null, (t) => {
                        TweenMgr.lerp_Num(sx, ex, t, 0);
                        TweenMgr.lerp_Num(sy, ey, t, 1);
                        this.finger.pos(t.outParams[0][0], t.outParams[1][0]);
                    }, 2);
                    this.tFinger.play();
                }
                ctrlGuide(state) {
                    if (this.guideContainer) {
                        this.finger.visible = this.guideContainer.visible = state;
                    }
                    if (this.tFinger) {
                        this.tFinger.discard();
                        this.tFinger = null;
                    }
                }
            }
            UI.UITop = UITop;
            class UIPromo extends UIBase {
                constructor() {
                    super(...arguments);
                    this._openType = OpenType.Promo;
                    this.p101List = [];
                }
                onInit() {
                    this._setLiving(true);
                    for (let i = 1; i <= 6; i++) {
                        let tmp = this.attachCom(`P101_${i}`, G["P101"]);
                        this.p101List.push(tmp);
                        tmp.shake = true;
                        tmp.autoRefresh = true;
                    }
                    this.p102 = this.attachCom("P102", G["P102"]);
                    this.p103 = this.attachCom("P103", G["P103"]);
                    this.p104 = this.attachCom("P104", G["P104"]);
                    this.p105 = this.attachCom("P105", G["P105"]);
                    this.p106 = this.attachCom("P106", G["P106"]);
                }
                hide() {
                    for (let v of this.p101List) {
                        v.hidePromo();
                    }
                    this.p102.hidePromo();
                    this.p103.hidePromo();
                    this.p104.hidePromo();
                    this.p105.hidePromo();
                    this.p106.hidePromo();
                }
                attachCom(name, com) {
                    let tmp = this.obj[name].addComponent(com);
                    tmp.onInit();
                    return tmp;
                }
                showP(id, args) {
                    if (Formula.banPromo) {
                        return;
                    }
                    if (id == 101) {
                        let showNum = args.length;
                        for (let i = 0; i < this.p101List.length; i++) {
                            let p101 = this.p101List[i];
                            if (i < showNum) {
                                p101.showPromo(args[i]);
                            }
                            else {
                                p101.hidePromo();
                            }
                        }
                    }
                    else {
                        this["p" + id].showPromo();
                    }
                }
                hideP(id) {
                    if (id == 101) {
                        for (let v of this.p101List) {
                            v.hidePromo();
                        }
                    }
                    else {
                        this["p" + id].hidePromo();
                    }
                }
            }
            UI.UIPromo = UIPromo;
            class TipItem extends Laya.Script {
                init(belong) {
                    this.belong = belong;
                    this.contentT = this.owner.getChildAt(0);
                    if (TipItem.initX === undefined) {
                        TipItem.initX = this.obj.x;
                        TipItem.initY = this.obj.y;
                    }
                    this.obj.visible = false;
                    this.tBg = TweenMgr.tweenCust(300, this, this.tweenAlpha, this.tweenAlphaCpl, true);
                    this.tVertPos = TweenMgr.tweenCust(450, this, this.tweenVertPos, this.tweenVertPosCpl, true, Laya.Ease.linearNone, 350);
                    this.tHorzPosIn = TweenMgr.tweenCust(300, this, this.tweenHorzPosIn, this.tweenHorzPosInCpl, true, Laya.Ease.backOut);
                    this.tHorzPosOut = TweenMgr.tweenCust(300, this, this.tweenHorzPosOut, this.clearSelf, true, Laya.Ease.backIn, 350);
                }
                get obj() {
                    return this.owner;
                }
                clearSelf() {
                    this.obj.visible = false;
                    this.belong.push(this);
                }
                tweenAlpha(t) {
                    this.obj.alpha = t.factor;
                }
                tweenAlphaCpl() {
                    if (this.moving == 0) {
                        this.moving = 1;
                        this.tVertPos.play();
                    }
                    else if (this.moving == 2) {
                        this.moving = 0;
                        this.clearSelf();
                    }
                }
                tweenVertPos(t) {
                    TweenMgr.lerp_Num(TipItem.MoveY[0], TipItem.MoveY[1], t);
                    this.obj.y = t.outParams[0][0];
                }
                tweenVertPosCpl() {
                    this.moving = 2;
                    this.tBg.reverse();
                }
                showV(cont) {
                    this.moving = 0;
                    this.contentT.text = cont;
                    this.obj.visible = true;
                    this.obj.pos(TipItem.initX, TipItem.MoveY[0]);
                    this.tBg.play();
                }
                tweenHorzPosIn(t) {
                    TweenMgr.lerp_Num(TipItem.MoveX[0], TipItem.initX, t);
                    this.obj.x = t.outParams[0][0];
                }
                tweenHorzPosInCpl() {
                    this.tHorzPosOut.play();
                }
                tweenHorzPosOut(t) {
                    TweenMgr.lerp_Num(TipItem.initX, TipItem.MoveX[1], t);
                    this.obj.x = t.outParams[0][0];
                }
                showH(cont) {
                    this.contentT.text = cont;
                    this.obj.alpha = 1;
                    this.obj.visible = true;
                    this.obj.pos(TipItem.MoveX[0], TipItem.initY);
                    this.tHorzPosIn.play();
                }
            }
            TipItem.MoveY = [200, 30];
            TipItem.MoveX = [1050, -350];
            class ProgressBar extends Laya.Script {
                get bg() {
                    return this.owner;
                }
                onAwake() {
                    this.fg = this.owner.getChildAt(0);
                    this.mask = this.fg["mask"];
                    this.flag = this.owner.getChildByName("Flag");
                    this.flag && (this.flagInitX = this.flag.x);
                    this.virtualV = 0;
                    this.hl = this.owner.getChildByName("HL");
                    if (this.hl) {
                        this.tHL = TweenMgr.tweenCust(200, this, this.tweenHL);
                        this.hl.alpha = 0;
                    }
                }
                RefreshHN() {
                    if (this.isH) {
                        this.width = this.mask.height;
                    }
                    else {
                        this.width = this.mask.width;
                    }
                }
                aspect() {
                    if (this.isH) {
                        let w = this._value * this.width;
                        if (w < 1)
                            w = 1;
                        if (this.moveFg) {
                            this.fg.height = w;
                        }
                        else {
                            this.mask.height = w;
                        }
                        if (this.flag) {
                            this.flag.x = this.flagInitX + w;
                        }
                    }
                    else {
                        let w = this._value * this.width;
                        if (w < 1)
                            w = 1;
                        if (this.moveFg) {
                            this.fg.width = w;
                        }
                        else {
                            this.mask.width = w;
                        }
                        if (this.flag) {
                            this.flag.x = this.flagInitX + w;
                        }
                    }
                }
                setValue(targetValue) {
                    this.virtualV = 0;
                    this._value = this.targV = Util.clamp(targetValue, 0, 1);
                    this.aspect();
                }
                addValue(delta, tween = false) {
                    if (tween) {
                        this.targV += delta;
                        let left = this.targV - Math.floor(this.targV);
                        if (delta > 0) {
                            if (1 - left < 1e-4) {
                                this.targV = 0;
                            }
                            else {
                                this.targV = left;
                            }
                        }
                        this.virtualV += delta;
                    }
                    else {
                        this._value = Util.clamp(this._value + delta, 0, 1);
                        this.aspect();
                    }
                }
                tweenHL(t) {
                    let v = t.factor;
                    if (v < 0.5) {
                        v *= 2;
                    }
                    else {
                        v = 1 - (v - 0.5) * 2;
                    }
                    this.hl.alpha = v;
                }
                onUpdate() {
                    if (this.virtualV > 0) {
                        let delta = 0.01;
                        let vv = this.virtualV - delta;
                        if (vv <= 0) {
                            delta = this.virtualV;
                            vv = 0;
                        }
                        this.virtualV = vv;
                        let _v = this._value + delta;
                        if ((_v >= 1) || (this.virtualV == 0 && this.targV == 0 && _v != 0)) {
                            _v = 0;
                            this.hl && this.tHL.play();
                        }
                        this._value = _v;
                        this.aspect();
                    }
                }
            }
            UI.ProgressBar = ProgressBar;
            class PageTab extends Laya.Script {
                get curIdx() {
                    return this._curIdx;
                }
                set curIdx(value) {
                    if (this.isCancel) {
                        if (this._curIdx == value) {
                            this.onTabView(this.owner.getChildAt(this._curIdx), false, this._curIdx);
                            this.onTabChange(this._curIdx, false);
                            this._curIdx = -1;
                        }
                        else {
                            this.doChangeTab(value);
                        }
                    }
                    else {
                        if (this._curIdx != value) {
                            this.doChangeTab(value);
                        }
                    }
                }
                doChangeTab(value) {
                    this._curIdx != -1 && this.onTabView(this.owner.getChildAt(this._curIdx), false, this._curIdx);
                    this._curIdx = value;
                    this.onTabView(this.owner.getChildAt(this._curIdx), true, this._curIdx);
                    this.onTabChange(this._curIdx, true);
                }
                init(onTabChange, onTabView, fst, isCancel) {
                    this.onTabChange = onTabChange;
                    this.onTabView = onTabView;
                    this.isCancel = isCancel;
                    this._curIdx = fst;
                    for (let i = 0; i < this.owner.numChildren; i++) {
                        let child = this.owner.getChildAt(i);
                        child.on(Laya.Event.CLICK, null, () => {
                            this.curIdx = i;
                        });
                        this.onTabView(child, i == fst, i);
                    }
                    if (fst != -1) {
                        this.onTabChange(fst, true);
                    }
                }
                force(idx) {
                    if (idx == -1 && this.isCancel) {
                        if (this._curIdx != -1) {
                            this.onTabView(this.owner.getChildAt(this._curIdx), false, this._curIdx);
                            this._curIdx = -1;
                        }
                    }
                    else {
                        if (this._curIdx == idx) {
                            this.onTabChange(idx, true);
                        }
                        else {
                            this.doChangeTab(idx);
                        }
                    }
                }
            }
            UI.PageTab = PageTab;
            class SmartNumber extends Laya.Script {
                set color(colorStr) {
                    this.nt.color = colorStr;
                }
                init(fmt = this.dfFmt, duration = 200) {
                    this.fmt = fmt;
                    this.nt = this.owner;
                    let hw = this.nt.width * 0.5;
                    let hh = this.nt.height * 0.5;
                    this.nt.pivot(hw, hh);
                    this.nt.pos(this.nt.x + hw, this.nt.y + hh);
                    this.tScale = TweenMgr.tweenCust(duration, this, this.tweenScale, this.tweenScaleCpl, true);
                }
                dfFmt(v) {
                    return v;
                }
                resetNum(num) {
                    this.counter = 0;
                    this.targV = this.curV = num;
                    this.nt.text = this.fmt(num);
                }
                setNum(num) {
                    this.targV = num;
                    this.tScale.play();
                }
                addNum(delta) {
                    this.targV += delta;
                    this.tScale.play();
                }
                setNumFrom(num, from) {
                    this.resetNum(from);
                    this.setNum(num);
                }
                tweenScale(t) {
                    let v;
                    if (t.factor < 0.5) {
                        v = 1 + 0.3 * t.factor / 0.5;
                    }
                    else {
                        v = 1.3 - (t.factor / 0.5 - 1) * 0.3;
                    }
                    this.nt.scale(v, v);
                }
                tweenScaleCpl() {
                    this.nt.scale(1, 1);
                }
                onUpdate() {
                    if (this.curV != this.targV) {
                        this.counter += Laya.timer.delta;
                        if (this.counter >= 30) {
                            this.counter = 0;
                            let gap = this.targV - this.curV;
                            let delta = Math.floor(gap / 5);
                            if (delta == 0) {
                                delta = gap > 0 ? 1 : -1;
                            }
                            this.curV += delta;
                            this.nt.text = this.fmt(this.curV);
                        }
                    }
                }
            }
            UI.SmartNumber = SmartNumber;
        })(UI = Core.UI || (Core.UI = {}));
        let SubPkg;
        (function (SubPkg) {
            class Mgr {
                init(segment) {
                    console.log("开始分包", Mgr.subPkgInfo);
                    if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                        this.pkgFlag = 0;
                        this.pkgInfo = Mgr.subPkgInfo;
                        this.segment = segment / this.pkgInfo.length;
                        this.loadPkg_wx();
                    }
                    else {
                        EventMgr.notify("preloadStep", segment);
                        EventMgr.notify("sgl");
                        GameMgr.autoLoadNext();
                    }
                }
                loadPkg_wx() {
                    if (this.pkgFlag == this.pkgInfo.length) {
                        EventMgr.notify("sgl");
                        GameMgr.autoLoadNext();
                    }
                    else {
                        let info = this.pkgInfo[this.pkgFlag];
                        let name = info.name;
                        let root = info.root;
                        console.log("开始分包 loadPkg_wx()", Mgr.subPkgInfo);
                        Laya.Browser.window.wx.loadSubpackage({
                            name: name,
                            success: (res) => {
                                console.log(`load ${name} suc`);
                                EventMgr.notify("preloadStep", this.segment);
                                Laya.MiniAdpter.subNativeFiles[name] = root;
                                Laya.MiniAdpter.nativefiles.push(root);
                                this.pkgFlag++;
                                this.loadPkg_wx();
                            },
                            fail: (res) => {
                                console.error(`load ${name} err: `, res);
                            },
                        });
                    }
                }
            }
            Mgr.subPkgInfo = [
                { name: "sp1", root: "res3d/p1" },
                { name: "sp2", root: "res3d/p2" },
            ];
            SubPkg.Mgr = Mgr;
        })(SubPkg = Core.SubPkg || (Core.SubPkg = {}));
        let Fsm;
        (function (Fsm) {
            class BaseState {
                constructor() {
                    this.inited = false;
                }
                tryEnter(args) {
                    if (!this.inited) {
                        this.inited = true;
                        this.onInit();
                    }
                    this.onEnter(args);
                }
            }
            Fsm.BaseState = BaseState;
            class StateMachine {
                constructor(host, tpls) {
                    this.isStart = false;
                    this.stateMap = {};
                    for (let i = 0; i < tpls.length; i++) {
                        let tpl = tpls[i];
                        let s = new tpl();
                        s.host = host;
                        s.fsm = this;
                        this.stateMap[s.name] = s;
                        i == 0 && (this.curState = s);
                    }
                }
                to(stateName, args) {
                    if (this.isStart && this.curState.name != stateName) {
                        let toState = this.stateMap[stateName];
                        if (toState) {
                            this.curState.onExit();
                            this.curState = toState;
                            this.curState.tryEnter(args);
                        }
                    }
                }
                start(args) {
                    this.isStart = true;
                    this.curState.tryEnter(args);
                }
            }
            Fsm.StateMachine = StateMachine;
        })(Fsm = Core.Fsm || (Core.Fsm = {}));
        let Game;
        (function (Game) {
            class Mgr {
                static start() {
                    for (let cls of Mgr.mgrs) {
                        cls["I"] = new cls();
                    }
                    Mgr.fsm = new StateMachine(this, [G["Game_Init"], G["Game_Ready"], G["Game_Main"], G["Game_Settle"]]);
                    Mgr.fsm.start();
                }
                static readyAll() {
                    Mgr.autoLoadNext();
                }
                static autoLoadNext() {
                    Mgr.curLoadPos += 1;
                    let mgrCls = Mgr.mgrs[Mgr.curLoadPos];
                    if (mgrCls) {
                        mgrCls["I"].init(Mgr.loadSeg[Mgr.curLoadPos]);
                    }
                    else {
                        Laya.timer.once(300, null, () => {
                            EventMgr.notify("preloadCpl");
                        });
                    }
                }
                static playSound(name) {
                    return Laya.SoundManager.playSound(Formula.getSoundPath(name, 1));
                }
                static playMusic(name) {
                    return Laya.SoundManager.playMusic(Formula.getSoundPath(name, 2));
                }
                static checkSign(loop = true, totalTimes = 7) {
                    let rs = 0;
                    let lastTime = DataMgr.getPlayerData("lastSignTs");
                    if (!lastTime) {
                        rs = 1;
                    }
                    else {
                        let signTimes = DataMgr.getPlayerData("signTimes");
                        let isNewDay = Util.checkNewDay(lastTime);
                        if (loop && isNewDay && signTimes == totalTimes) {
                            DataMgr.setValue("signTimes", 0);
                            signTimes = 0;
                        }
                        if (signTimes < totalTimes) {
                            rs = isNewDay ? 1 : 2;
                        }
                        else {
                            rs = 3;
                        }
                    }
                    return rs;
                }
                static signWithoutReward() {
                    DataMgr.setValue("lastSignTs", Date.now());
                    DataMgr.deltaNum("signTimes", 1);
                }
                static sign(crc, times = 1) {
                    let prg = DataMgr.getPlayerData("signTimes");
                    let confData = LC.SignConf.arr[prg];
                    let add = times * confData["reward"];
                    DataMgr.deltaNum(crc, add);
                    Mgr.signWithoutReward();
                    return add;
                }
            }
            Mgr.mgrs = [Event.Mgr, SubPkg.Mgr, Tween.Mgr, Resource.Mgr, Data.Mgr, UI.Mgr, Scene.Mgr];
            Mgr.loadSeg = [0.3, 0.02, 0.02, 0.4, 0.02, 0.1, 0.14];
            Mgr.curLoadPos = -1;
            Game.Mgr = Mgr;
        })(Game = Core.Game || (Core.Game = {}));
    })(Core || (Core = {}));
    let SubPkgMgr = Core.SubPkg.Mgr;
    let EventMgr = Core.Event.Mgr;
    let TweenMgr = Core.Tween.Mgr;
    let Tweener = Core.Tween.Tweener;
    let ResourceMgr = Core.Resource.Mgr;
    let DataMgr = Core.Data.Mgr;
    let SceneMgr = Core.Scene.Mgr;
    let UIMgr = Core.UI.Mgr;
    let UIBase = Core.UI.UIBase;
    let UIDebug = Core.UI.UIDebug;
    let UITop = Core.UI.UITop;
    let OpenType = Core.UI.OpenType;
    let GameMgr = Core.Game.Mgr;
    let StateMachine = Core.Fsm.StateMachine;
    let BaseState = Core.Fsm.BaseState;
    let BaseObj = Core.Resource.BaseObj;
    let ObjPool = Core.Resource.ObjPool;

    class RecordManager {
        constructor() {
            this.GRV = null;
            this.isRecordVideoing = false;
            this.isVideoRecord = false;
            this.videoRecordTimer = 0;
            this.isHasVideoRecord = false;
        }
        static Init() {
            RecordManager.grv = new TJ.Platform.AppRt.DevKit.TT.GameRecorderVideo();
        }
        static startAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.grv == null)
                RecordManager.Init();
            if (RecordManager.recording)
                return;
            RecordManager.autoRecording = true;
            console.log("******************开始录屏");
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (!RecordManager.autoRecording) {
                console.log("RecordManager.autoRecording", RecordManager.autoRecording);
                return false;
            }
            RecordManager.autoRecording = false;
            RecordManager._end(false);
            if (Date.now() - RecordManager.lastRecordTime > 6000) {
                return true;
            }
            if (Date.now() - RecordManager.lastRecordTime < 3000) {
                console.log("小于3秒");
                return false;
            }
            return true;
        }
        static startRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.autoRecording) {
                this.stopAutoRecord();
            }
            RecordManager.recording = true;
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("time:" + (Date.now() - RecordManager.lastRecordTime));
            if (Date.now() - RecordManager.lastRecordTime <= 3000) {
                return false;
            }
            RecordManager.recording = false;
            RecordManager._end(true);
            return true;
        }
        static _start() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180s  ？？？？？");
            RecordManager.grv.Start(180);
        }
        static _end(share) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180结束 ？？？？？");
            RecordManager.grv.Stop(share);
        }
        static _share(successedAc, failAc = null, completedAc = null) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************吊起分享 ？？？？？", RecordManager.grv, RecordManager.grv.videoPath);
            if (RecordManager.grv.videoPath) {
                let p = new TJ.Platform.AppRt.Extern.TT.ShareAppMessageParam();
                p.extra.videoTopics = ["#学生党#梦幻大明星百变造型#", "番茄小游戏", "抖音小游戏"];
                p.channel = "video";
                p.success = () => {
                    successedAc();
                };
                p.fail = () => {
                    failAc();
                };
                RecordManager.grv.Share(p);
            }
            else {
                UIMgr.tip("暂无录屏，玩一局游戏可以分享");
            }
        }
    }
    RecordManager.recording = false;
    RecordManager.autoRecording = false;

    var clothtype;
    (function (clothtype) {
        clothtype[clothtype["Hair"] = 0] = "Hair";
        clothtype[clothtype["Dress"] = 1] = "Dress";
        clothtype[clothtype["Coat"] = 2] = "Coat";
        clothtype[clothtype["Shirt"] = 3] = "Shirt";
        clothtype[clothtype["Trousers"] = 4] = "Trousers";
        clothtype[clothtype["Socks"] = 5] = "Socks";
        clothtype[clothtype["Shose"] = 6] = "Shose";
        clothtype[clothtype["Ornament"] = 7] = "Ornament";
        clothtype[clothtype["Pet"] = 8] = "Pet";
    })(clothtype || (clothtype = {}));
    class ClothChange extends Laya.Script {
        constructor() {
            super(...arguments);
            this.scaleDelta = 0;
            this.stars = [];
            this.PhotosIndex = 0;
            this.mes = [];
            this.arr = {};
            this.nowclothData = {
                Hair: 0,
                Dress: 0,
                Coat: 0,
                Shirt: 0,
                Trousers: 0,
                Socks: 0,
                Shose: 0,
                Ornament: 0,
                Pet: 0,
            };
        }
        onAwake() {
            ClothChange.Instance = this;
            this.FemaleRoot = this.owner;
            this.Hair = this.FemaleRoot.getChildByName("Hair");
            this.Hair1 = this.FemaleRoot.getChildByName("Hair1");
            this.Ornament = this.FemaleRoot.getChildByName("Ornament");
            this.Ornament1 = this.FemaleRoot.getChildByName("Ornament1");
            this.Shirt = this.FemaleRoot.getChildByName("Shirt");
            this.Shirt1 = this.FemaleRoot.getChildByName("Shirt1");
            this.Trousers = this.FemaleRoot.getChildByName("Trousers");
            this.Trousers1 = this.FemaleRoot.getChildByName("Trousers1");
            this.Dress = this.FemaleRoot.getChildByName("Dress");
            this.Dress1 = this.FemaleRoot.getChildByName("Dress1");
            this.Socks = this.FemaleRoot.getChildByName("Socks");
            this.Socks1 = this.FemaleRoot.getChildByName("Socks1");
            this.Shose = this.FemaleRoot.getChildByName("Shose");
            this.Shose1 = this.FemaleRoot.getChildByName("Shose1");
            this.Coat = this.FemaleRoot.getChildByName("Coat");
            this.Coat1 = this.FemaleRoot.getChildByName("Coat1");
            this.Pet = this.FemaleRoot.getChildByName("Pet");
            this.Man = this.FemaleRoot.getChildByName("Man");
            this.Man.visible = false;
            for (let i = 0; i < 8; i++) {
                this._ClothChange(0, i);
            }
            this.Star = this.FemaleRoot.getChildByName("Star");
        }
        _ClothChange(itemID, type) {
            switch (type) {
                case clothtype.Hair:
                    this.HairChange(itemID);
                    break;
                case clothtype.Dress:
                    this.DressChange(itemID);
                    break;
                case clothtype.Coat:
                    this.CoatChange(itemID);
                    break;
                case clothtype.Shirt:
                    this.ShirtChange(itemID);
                    break;
                case clothtype.Trousers:
                    this.TrousersChange(itemID);
                    break;
                case clothtype.Socks:
                    this.SocksChange(itemID);
                    break;
                case clothtype.Shose:
                    this.ShoseChange(itemID);
                    break;
                case clothtype.Ornament:
                    this.OrnamentChange(itemID);
                    break;
                case clothtype.Pet:
                    this.PetChange(itemID);
                    break;
            }
            if (this.nowclothData.Hair == 40501 && this.nowclothData.Dress == 40502 && this.nowclothData.Ornament == 40503 && this.nowclothData.Shose == 40504) {
                UIMgr.get("UIReady").Pick.disabled = true;
                RecordManager.startAutoRecord();
                this.Man.visible = true;
                let t = this.Man;
                Laya.Tween.to(t, {
                    x: 94, update: new Laya.Handler(this, () => {
                        this.Man.x = t.x;
                    })
                }, 4000, Laya.Ease.linearNone);
                Laya.timer.once(6000, this, () => {
                    UIMgr.show("UIWeddingShare");
                    UIMgr.get("UIReady").Pick.disabled = false;
                });
            }
            else {
                this.Man.x = -310;
                this.Man.visible = false;
            }
        }
        ClothReceive() {
            for (let i = 0; i < 8; i++) {
                this._ClothChange(0, i);
            }
        }
        GetPhotosData() {
            GameDataController.PhotosData();
        }
        Share() {
            console.log("拍照");
            UIMgr.tip("拍照成功！");
            let item = GameDataController.PhotosData;
            if (item) {
                this.mes = item;
                for (let index = 0; index < this.mes.length; index++) {
                    if (this.mes[index].Hair == this.nowclothData.Hair && this.mes[index].Dress == this.nowclothData.Dress && this.mes[index].Coat == this.nowclothData.Coat && this.mes[index].Shirt == this.nowclothData.Shirt && this.mes[index].Trousers == this.nowclothData.Trousers && this.mes[index].Socks == this.nowclothData.Socks && this.mes[index].Shose == this.nowclothData.Shose && this.mes[index].Ornament == this.nowclothData.Ornament) {
                        console.log("重复了......................");
                        return;
                    }
                }
            }
            this.mes.push(this.nowclothData);
            GameDataController.PhotosData = this.mes;
            console.log(GameDataController.PhotosData);
        }
        HairChange(itemID) {
            this.Hair.visible = this.Hair1.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Hair == itemID) {
                itemID = 10002;
            }
            this.nowclothData.Hair = itemID;
            this.Hair.visible = this.Hair1.visible = true;
            let clothdata = GameDataController._clothData.get(itemID);
            this.Hair.zOrder = clothdata.Sort1;
            this.Hair1.zOrder = clothdata.Sort2;
            this.Hair.skin = clothdata.GetPath1();
            this.Hair1.skin = clothdata.GetPath2();
            this.Hair.centerX = clothdata.GetPosition1().x;
            this.Hair.centerY = clothdata.GetPosition1().y;
            console.log("头发的坐标：" + this.Hair.centerX);
            console.log("头发的坐标：" + this.Hair.centerY);
            this.Hair1.centerX = clothdata.GetPosition2().x;
            this.Hair1.centerY = clothdata.GetPosition2().y;
        }
        OrnamentChange(itemID) {
            this.Ornament.visible = this.Ornament1.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Ornament == itemID) {
                itemID = 0;
                this.nowclothData.Ornament = itemID;
                return;
            }
            this.nowclothData.Ornament = itemID;
            this.Ornament.visible = this.Ornament1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Ornament.zOrder = clothdata.Sort1;
            this.Ornament1.zOrder = clothdata.Sort2;
            this.Ornament.skin = clothdata.GetPath1();
            this.Ornament1.skin = clothdata.GetPath2();
            this.Ornament.centerX = clothdata.GetPosition1().x;
            this.Ornament.centerY = clothdata.GetPosition1().y;
            this.Ornament1.centerX = clothdata.GetPosition2().x;
            this.Ornament1.centerY = clothdata.GetPosition2().y;
            if (itemID == 50404) {
                Laya.timer.frameLoop(1, this, this.onScaleChange);
                this.Star.visible = true;
                for (let i = 0; i < this.Star.numChildren; i++) {
                    this.stars[i] = this.Star.getChildByName("star" + i);
                }
                Laya.timer.frameLoop(1, this, () => {
                    var scaleValue = Math.sin(this.scaleDelta);
                    this.stars.forEach((v) => {
                        v.scale(scaleValue, scaleValue);
                    });
                });
            }
            else {
                Laya.timer.clear(this, this.onScaleChange);
                this.Ornament.scale(1, 1);
                this.Star.visible = false;
            }
        }
        ShirtChange(itemID) {
            this.Shirt.visible = this.Shirt1.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Shirt == itemID) {
                itemID = 10000;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.nowclothData.Shirt = itemID;
            this.Shirt.visible = this.Shirt1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shirt.zOrder = clothdata.Sort1;
            this.Shirt1.zOrder = clothdata.Sort2;
            this.Shirt.skin = clothdata.GetPath1();
            this.Shirt1.skin = clothdata.GetPath2();
            this.Shirt.centerX = clothdata.GetPosition1().x;
            this.Shirt.centerY = clothdata.GetPosition1().y;
            this.Shirt1.centerX = clothdata.GetPosition2().x;
            this.Shirt1.centerY = clothdata.GetPosition2().y;
        }
        TrousersChange(itemID) {
            this.Trousers.visible = this.Trousers1.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Trousers == itemID) {
                itemID = 10001;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.nowclothData.Trousers = itemID;
            this.Trousers.visible = this.Trousers1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Trousers.visible = this.Trousers1.visible = true;
            this.Trousers.zOrder = clothdata.Sort1;
            this.Trousers1.zOrder = clothdata.Sort2;
            this.Trousers.skin = clothdata.GetPath1();
            this.Trousers1.skin = clothdata.GetPath2();
            this.Trousers.centerX = clothdata.GetPosition1().x;
            this.Trousers.centerY = clothdata.GetPosition1().y;
            this.Trousers1.centerX = clothdata.GetPosition2().x;
            this.Trousers1.centerY = clothdata.GetPosition2().y;
        }
        DressChange(itemID) {
            this.Dress.visible = this.Dress1.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Dress == itemID) {
                itemID = 0;
                this.nowclothData.Dress = itemID;
                this.UpDownOpen();
                return;
            }
            else {
                this.DressOpen();
            }
            this.nowclothData.Dress = itemID;
            this.Dress.visible = this.Dress1.visible = true;
            this.UpDownClose();
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Dress.zOrder = clothdata.Sort1;
            this.Dress1.zOrder = clothdata.Sort2;
            this.Dress.skin = clothdata.GetPath1();
            this.Dress1.skin = clothdata.GetPath2();
            this.Dress.centerX = clothdata.GetPosition1().x;
            this.Dress.centerY = clothdata.GetPosition1().y;
            this.Dress1.centerX = clothdata.GetPosition2().x;
            this.Dress1.centerY = clothdata.GetPosition2().y;
        }
        SocksChange(itemID) {
            this.Socks1.visible = this.Socks.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Socks == itemID) {
                itemID = 0;
                this.nowclothData.Socks = itemID;
                return;
            }
            this.Socks1.visible = this.Socks.visible = true;
            this.nowclothData.Socks = itemID;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Socks.zOrder = clothdata.Sort1;
            this.Socks1.zOrder = clothdata.Sort2;
            this.Socks.skin = clothdata.GetPath1();
            this.Socks1.skin = clothdata.GetPath2();
            this.Socks.centerX = clothdata.GetPosition1().x;
            this.Socks.centerY = clothdata.GetPosition1().y;
            this.Socks1.centerX = clothdata.GetPosition2().x;
            this.Socks1.centerY = clothdata.GetPosition2().y;
        }
        ShoseChange(itemID) {
            this.Shose.visible = this.Shose1.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Shose == itemID) {
                itemID = 0;
                this.nowclothData.Shose = itemID;
                return;
            }
            this.Shose.visible = this.Shose1.visible = true;
            this.nowclothData.Shose = itemID;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shose.zOrder = clothdata.Sort1;
            this.Shose1.zOrder = clothdata.Sort2;
            this.Shose.skin = clothdata.GetPath1();
            this.Shose1.skin = clothdata.GetPath2();
            this.Shose.centerX = clothdata.GetPosition1().x;
            this.Shose.centerY = clothdata.GetPosition1().y;
            this.Shose1.centerX = clothdata.GetPosition2().x;
            this.Shose1.centerY = clothdata.GetPosition2().y;
        }
        CoatChange(itemID) {
            this.Coat.visible = this.Coat1.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Coat == itemID) {
                itemID = 0;
                this.nowclothData.Coat = itemID;
                return;
            }
            this.Coat.visible = this.Coat1.visible = true;
            this.nowclothData.Coat = itemID;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Coat.zOrder = clothdata.Sort1;
            this.Coat1.zOrder = clothdata.Sort2;
            this.Coat.skin = clothdata.GetPath1();
            this.Coat1.skin = clothdata.GetPath2();
            this.Coat.centerX = clothdata.GetPosition1().x;
            this.Coat.centerY = clothdata.GetPosition1().y;
            this.Coat1.centerX = clothdata.GetPosition2().x;
            this.Coat1.centerY = clothdata.GetPosition2().y;
        }
        PetChange(itemID) {
            this.Pet.visible = false;
            if (itemID == null || itemID == 0 || this.nowclothData.Pet == itemID) {
                itemID = 0;
                this.nowclothData.Pet = itemID;
                return;
            }
            this.Pet.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Pet.skin = clothdata.GetPath1();
            this.Pet.centerX = clothdata.GetPosition1().x;
            this.Pet.centerY = clothdata.GetPosition1().y;
            this.Pet.zOrder = clothdata.Sort1;
        }
        UpDownClose() {
            this.ShirtChange(0);
            this.TrousersChange(0);
            this.Shirt.visible = this.Shirt1.visible = false;
            this.Trousers.visible = this.Trousers1.visible = false;
        }
        UpDownOpen() {
            this.Shirt.visible = this.Shirt1.visible = true;
            this.Trousers.visible = this.Trousers1.visible = true;
        }
        DressOpen() {
            this.Dress.visible = this.Dress1.visible = true;
        }
        DressClose() {
            this.DressChange(0);
            this.Dress.visible = this.Dress1.visible = false;
        }
        onScaleChange() {
            this.scaleDelta += 0.02;
            var scaleValue = Math.sin(this.scaleDelta);
            this.Ornament.scale(scaleValue, 1);
        }
        CharmValueChange() {
            let hairCharmValue;
            if (this.nowclothData.Hair == 0) {
                hairCharmValue = 0;
            }
            else {
                if (GameDataController._ClothData.get(this.nowclothData.Hair).Star) {
                    hairCharmValue = GameDataController._ClothData.get(this.nowclothData.Hair).Star;
                }
                else {
                    hairCharmValue = 0;
                }
            }
            let dressCharmValue;
            if (this.nowclothData.Dress == 0) {
                dressCharmValue = 0;
            }
            else {
                if (GameDataController._ClothData.get(this.nowclothData.Dress).Star) {
                    dressCharmValue = GameDataController._ClothData.get(this.nowclothData.Dress).Star;
                }
                else {
                    dressCharmValue = 0;
                }
            }
            let coatCharmValue;
            if (this.nowclothData.Coat == 0) {
                coatCharmValue = 0;
            }
            else {
                if (coatCharmValue = GameDataController._ClothData.get(this.nowclothData.Coat).Star) {
                    coatCharmValue = GameDataController._ClothData.get(this.nowclothData.Coat).Star;
                }
                else {
                    coatCharmValue = 0;
                }
            }
            let shirtCharmValue;
            if (this.nowclothData.Shirt == 0) {
                shirtCharmValue = 0;
            }
            else {
                if (GameDataController._ClothData.get(this.nowclothData.Shirt).Star) {
                    shirtCharmValue = GameDataController._ClothData.get(this.nowclothData.Shirt).Star;
                }
                else {
                    shirtCharmValue = 0;
                }
            }
            let trousersCharmValue;
            if (this.nowclothData.Trousers == 0) {
                trousersCharmValue = 0;
            }
            else {
                if (GameDataController._ClothData.get(this.nowclothData.Trousers).Star) {
                    trousersCharmValue = GameDataController._ClothData.get(this.nowclothData.Trousers).Star;
                }
                else {
                    trousersCharmValue = 0;
                }
            }
            let socksCharmValue;
            if (this.nowclothData.Socks == 0) {
                socksCharmValue = 0;
            }
            else {
                if (GameDataController._ClothData.get(this.nowclothData.Socks).Star) {
                    socksCharmValue = GameDataController._ClothData.get(this.nowclothData.Socks).Star;
                }
                else {
                    socksCharmValue = 0;
                }
            }
            let shoseCharmValue;
            if (this.nowclothData.Shose == 0) {
                shoseCharmValue = 0;
            }
            else {
                if (GameDataController._ClothData.get(this.nowclothData.Shose).Star) {
                    shoseCharmValue = GameDataController._ClothData.get(this.nowclothData.Shose).Star;
                }
                else {
                    shoseCharmValue = 0;
                }
            }
            let ornamentCharmValue;
            if (this.nowclothData.Ornament == 0) {
                ornamentCharmValue = 0;
            }
            else {
                if (GameDataController._ClothData.get(this.nowclothData.Ornament).Star) {
                    ornamentCharmValue = GameDataController._ClothData.get(this.nowclothData.Ornament).Star;
                }
                else {
                    ornamentCharmValue = 0;
                }
            }
            if (!GameDataController.CharmValue) {
                GameDataController.CharmValue = "0";
            }
            let b = hairCharmValue + dressCharmValue + coatCharmValue + ornamentCharmValue + shirtCharmValue + shoseCharmValue + socksCharmValue + trousersCharmValue;
            GameDataController.CharmValue = b.toString();
        }
    }

    class ADManager {
        constructor() {
        }
        static ShowBanner() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                return;
            }
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.ShowBanner(p);
        }
        static CloseBanner() {
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.RemoveBanner(p);
        }
        static ShowNormal() {
            let p = new TJ.API.AdService.Param();
            TJ.API.AdService.ShowNormal(p);
        }
        static showNormal2() {
            TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
        }
        static ShowReward(rewardAction, fail = null) {
            if (rewardAction != null) {
                rewardAction();
            }
            return true;
            console.log("?????");
            let p = new TJ.ADS.Param();
            p.extraAd = true;
            let getReward = false;
            p.cbi.Add(TJ.Define.Event.Reward, () => {
                getReward = true;
                if (rewardAction != null)
                    rewardAction();
            });
            p.cbi.Add(TJ.Define.Event.Close, () => {
                if (!getReward) {
                    UIMgr.tip("观看完整广告才能获取奖励哦！");
                    UIMgr.show("UITip", rewardAction);
                }
            });
            p.cbi.Add(TJ.Define.Event.NoAds, () => {
                UIMgr.tip("暂时没有广告，过会儿再试试吧！");
            });
            TJ.ADS.Api.ShowReward(p);
        }
        static Event(param, value = null) {
            console.log("Param:>" + param + "Value:>" + value);
            let p = new TJ.GSA.Param();
            if (value == null) {
                p.id = param;
            }
            else {
                p.id = param + value;
            }
            console.log(p.id);
            TJ.GSA.Api.Event(p);
        }
        static initShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.onShareAppMessage(() => {
                    return {
                        title: this.shareContent,
                        imageUrl: this.shareImgUrl,
                        query: ""
                    };
                });
                this.wx.showShareMenu({
                    withShareTicket: true,
                    success: null,
                    fail: null,
                    complete: null
                });
            }
        }
        static lureShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.shareAppMessage({
                    title: this.shareContent,
                    imageUrl: this.shareImgUrl,
                    query: ""
                });
            }
        }
        static VibrateShort() {
            TJ.API.Vibrate.Short();
        }
        static Vibratelong() {
            TJ.API.Vibrate.Long();
        }
        static TAPoint(type, name) {
            let p = new TJ.API.TA.Param();
            p.id = name;
            switch (type) {
                case TaT.BtnShow:
                    TJ.API.TA.Event_Button_Show(p);
                    break;
                case TaT.BtnClick:
                    TJ.API.TA.Event_Button_Click(p);
                    break;
                case TaT.PageShow:
                    TJ.API.TA.Event_Page_Show(p);
                    break;
                case TaT.PageEnter:
                    TJ.API.TA.Event_Page_Enter(p);
                    break;
                case TaT.PageLeave:
                    TJ.API.TA.Event_Page_Leave(p);
                    break;
                case TaT.LevelStart:
                    TJ.API.TA.Event_Level_Start(p);
                    break;
                case TaT.LevelFail:
                    TJ.API.TA.Event_Level_Fail(p);
                    break;
                case TaT.LevelFinish:
                    TJ.API.TA.Event_Level_Finish(p);
                    break;
            }
        }
    }
    ADManager.wx = Laya.Browser.window.wx;
    ADManager.shareImgUrl = "http://image.tomatojoy.cn/bf7e3448ee1868f50a37d6518ada84d5";
    ADManager.shareContent = "快来试试制作美味的牛排吧！";
    var TaT;
    (function (TaT) {
        TaT[TaT["BtnShow"] = 0] = "BtnShow";
        TaT[TaT["BtnClick"] = 1] = "BtnClick";
        TaT[TaT["PageShow"] = 2] = "PageShow";
        TaT[TaT["PageEnter"] = 3] = "PageEnter";
        TaT[TaT["PageLeave"] = 4] = "PageLeave";
        TaT[TaT["LevelStart"] = 5] = "LevelStart";
        TaT[TaT["LevelFinish"] = 6] = "LevelFinish";
        TaT[TaT["LevelFail"] = 7] = "LevelFail";
    })(TaT || (TaT = {}));

    class shieldTime {
    }
    class ShieldScene {
    }
    class ConfigInfo {
    }
    class ipData {
    }
    class IPInfo {
    }
    var ShieldLevel;
    (function (ShieldLevel) {
        ShieldLevel[ShieldLevel["low"] = 0] = "low";
        ShieldLevel[ShieldLevel["mid"] = 1] = "mid";
        ShieldLevel[ShieldLevel["high"] = 2] = "high";
    })(ShieldLevel || (ShieldLevel = {}));
    class ZJADMgr {
        constructor() {
            this.tt = Laya.Browser.window.tt;
            this.shieldLevel = ShieldLevel.high;
            this.prk_init = "platform_init";
            this.prk_shareTimes = "platform_shareTimes";
            this.prk_shareTs = "platform_shareTs";
            this.shareItv = 1 * 3600 * 1000;
            this.shareMaxTimes = 5;
            this.shareImgUrl = "http://image.tomatojoy.cn/fkbxs01.jpg";
            this.shareContent = "消灭方块，人人有责！";
            this.shieldArea = false;
            this.shieldUser = false;
            this.shieldVersion = false;
            this.shieldtime = false;
            this.shareTimes = 0;
            this.lastShareTs = 0;
            this.configInited = false;
            this.ipInfoInited = false;
            this.inited = false;
            this.playVideoIndex = 0;
            ZJADMgr.ins = this;
            this.requestInfo();
        }
        async GameCfg() {
            let www = new TJ.Common.WWW("https://h5.tomatojoy.cn/res/" + TJ.API.AppInfo.AppGuid() + "/config/game.json");
            await www.Send();
            if (www.error == null && www.text != null) {
                this.onGameCfgSuccess(www.text);
                return;
            }
            else {
                let www = new TJ.Common.WWW("https://h5.tomatojoy.cn/res/" + TJ.API.AppInfo.AppGuid() + "/config/game.json");
                await www.Send();
                if (www.error == null && www.text != null) {
                    this.onGameCfgSuccess(www.text);
                    return;
                }
                else {
                    let www = new TJ.Common.WWW("https://h5.tomatojoy.cn/res/" + TJ.API.AppInfo.AppGuid() + "/config/game.json");
                    await www.Send();
                    if (www.error == null && www.text != null) {
                        this.onGameCfgSuccess(www.text);
                        return;
                    }
                }
            }
            return null;
        }
        async GetIP() {
            let www = new TJ.Common.WWW("https://api1.tomatojoy.cn/getIp");
            await www.Send();
            if (www.error == null && www.text != null) {
                this.onGetIpSuccess(www.text);
                return;
            }
            else {
                let www = new TJ.Common.WWW("https://api1.tomatojoy.cn/getIp");
                await www.Send();
                if (www.error == null && www.text != null) {
                    this.onGetIpSuccess(www.text);
                    return;
                }
                else {
                    let www = new TJ.Common.WWW("https://api1.tomatojoy.cn/getIp");
                    await www.Send();
                    if (www.error == null && www.text != null) {
                        this.onGetIpSuccess(www.text);
                        return;
                    }
                    else {
                        console.log(www.error);
                    }
                }
            }
            return null;
        }
        onGameCfgSuccess(config) {
            let _configinfo = JSON.parse(config);
            this.configinfo = _configinfo;
            this.configInited = true;
            if (this.ipInfoInited) {
                this.init();
            }
        }
        onGetIpSuccess(ipInfo) {
            let _iPInfo = JSON.parse(ipInfo);
            this.iPInfo = _iPInfo;
            this.ipInfoInited = true;
            if (this.configInited) {
                this.init();
            }
        }
        requestInfo() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                this.GameCfg();
                this.GetIP();
            }
        }
        init() {
            if (this.configinfo.shieldStatus) {
                if (TJ.API.AppInfo.VersionName() == this.configinfo.codeVer)
                    this.shieldVersion = true;
            }
            if (this.iPInfo != null) {
                if (this.iPInfo.code == 200) {
                    let m_cityName = this.iPInfo.data.city;
                    if (this.configinfo.shieldCity != "") {
                        if (this.configinfo.shieldCity == "all") {
                            this.shieldArea = true;
                        }
                        else {
                            this.shieldArea = false;
                            let shieldcities = this.configinfo.shieldCity.split(",");
                            for (var i = 0; i < shieldcities.length; i++) {
                                if (m_cityName.indexOf(shieldcities[i]) >= 0) {
                                    this.shieldArea = true;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        this.shieldArea = false;
                    }
                }
                else {
                    this.shieldArea = true;
                }
            }
            if (this.configinfo.shieldTime.status) {
                let timeLimit = this.configinfo.shieldTime.time.split("-");
                let date = new Date();
                if (date.getHours() >= Number(timeLimit[0]) && date.getHours() <= Number(timeLimit[1])) {
                    this.shieldtime = true;
                }
                else {
                    this.shieldtime = false;
                }
            }
            else {
                this.shieldtime = false;
            }
            let launchRes = this.tt.getLaunchOptionsSync();
            console.log(launchRes);
            if (this.configinfo.ShieldScene.status) {
                let timeLimit = this.configinfo.ShieldScene.Scene.split("|");
                this.shieldUser = timeLimit.indexOf(launchRes.scene) >= 0;
                console.log(this.shieldUser);
            }
            this.inited = true;
            if (this.onConFigInited != null)
                this.onConFigInited();
            let iswifi = false;
            this.tt.getNetworkType({
                success: (obj) => {
                    ADManager.TAPoint(TaT.BtnShow, "okpb_num");
                    if (obj.networkType == "wifi") {
                        if (ZJADMgr.ins.shieldArea) {
                            ADManager.TAPoint(TaT.BtnShow, "wifipb_num");
                            ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                        }
                        else {
                            ZJADMgr.ins.shieldLevel = ShieldLevel.low;
                        }
                    }
                    else {
                        ADManager.TAPoint(TaT.BtnShow, "llpb_num");
                        ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                    }
                    if (ZJADMgr.ins.shieldUser) {
                        ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                    }
                    if (ZJADMgr.ins.shieldVersion) {
                        ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                    }
                    if (ZJADMgr.ins.shieldtime) {
                        ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                    }
                    console.log("--------ZJADMgr.ins.shieldLevel-------");
                    console.log(ZJADMgr.ins.shieldLevel);
                },
                fail: null,
                complete: null
            });
            this.showVideo = this.configinfo.ADPoint;
        }
        CheckPlayVideo() {
            if (!this.inited)
                return false;
            if (this.shieldLevel == ShieldLevel.mid) {
                if (this.showVideo[this.playVideoIndex % this.showVideo.length] == '0') {
                    this.playVideoIndex++;
                    return false;
                }
                else {
                    this.playVideoIndex++;
                    return true;
                }
            }
            return false;
        }
    }

    class SkinItem extends Laya.Script {
        constructor() {
            super(...arguments);
            this.HeightMax = 85;
            this.WidthtMax = 80;
            this.count = 2;
        }
        onAwake() {
            console.log(ZJADMgr.ins.shieldLevel + "风险等级");
            this.SkinChose = this.owner;
            this.BG = this.SkinChose.getChildByName("BG");
            this.IconParent = this.SkinChose.getChildByName("IconParent");
            this.Icon = this.IconParent.getChildByName("Icon");
            this.Lock = this.SkinChose.getChildByName("Lock");
            this.Adimage = this.Lock.getChildAt(1);
            this.smallLock = this.Lock.getChildAt(0);
            this.Icon.anchorX = this.Icon.anchorY = 0.5;
            this.Star = this.SkinChose.getChildByName("Star");
            this.Select = this.SkinChose.getChildByName("Select");
            if (ZJADMgr.ins.shieldLevel == ShieldLevel.high) {
                this.SkinChose.on(Laya.Event.CLICK, this, this.onClickTest);
            }
            if (ZJADMgr.ins.shieldLevel == ShieldLevel.mid) {
                if (ZJADMgr.ins.CheckPlayVideo()) {
                    this.SkinChose.on(Laya.Event.MOUSE_DOWN, this, this.onClickTest);
                }
                else {
                    this.SkinChose.on(Laya.Event.CLICK, this, this.onClickTest);
                }
            }
            if (ZJADMgr.ins.shieldLevel == ShieldLevel.low) {
                this.SkinChose.on(Laya.Event.MOUSE_DOWN, this, this.onClickTest);
            }
        }
        fell(data) {
            this.ID = data.ID;
            this.type = data.Type;
            this.skinname = data.Name;
            this.Select.visible = false;
            this.type2 = data.GetType2;
            this.Star.skin = "Btnbar/xing" + data.Star + ".png";
            this.Lock.visible = !GameDataController.ClothCanUse(data.ID);
            if (data.GetType2 != null || data.ID == 50404 || data.ID == 40601 || data.ID == 40602 || data.ID == 40603 || data.ID == 40604 || data.ID == 40605 || data.ID == 70201 || data.ID == 70202 || data.ID == 72001 || data.ID == 72002 || data.ID == 72003 || data.ID == 72004) {
                this.Adimage.visible = false;
                this.smallLock.visible = true;
            }
            else {
                this.Adimage.visible = true;
                this.smallLock.visible = false;
            }
            switch (this.type) {
                case clothtype.Hair:
                    if (ClothChange.Instance.nowclothData.Hair == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Dress:
                    if (ClothChange.Instance.nowclothData.Dress == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Coat:
                    if (ClothChange.Instance.nowclothData.Coat == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Shirt:
                    if (ClothChange.Instance.nowclothData.Shirt == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Trousers:
                    if (ClothChange.Instance.nowclothData.Trousers == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Socks:
                    if (ClothChange.Instance.nowclothData.Socks == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Shose:
                    if (ClothChange.Instance.nowclothData.Shose == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Ornament:
                    if (ClothChange.Instance.nowclothData.Ornament == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
                case clothtype.Pet:
                    if (ClothChange.Instance.nowclothData.Pet == this.ID) {
                        this.Select.visible = true;
                    }
                    break;
            }
            this.Icon.skin = data.GetPath1();
            let imageHeight = parseFloat(this.Icon.height.toString());
            let imagewidth = parseFloat(this.Icon.width.toString());
            this.IconParent.width = 100;
            this.IconParent.height = 100;
            let pr = 0;
            if (imagewidth > imageHeight) {
                pr = this.WidthtMax / imagewidth;
            }
            else {
                pr = this.HeightMax / imageHeight;
            }
            this.Icon.scaleX = pr;
            this.Icon.scaleY = pr;
            this.Icon.centerX = 0;
            this.Icon.centerY = 0;
        }
        onClickTest() {
            ADManager.TAPoint(TaT.BtnClick, "ADhair" + this.ID + "_click");
            if (this.Lock.visible) {
                if (this.Adimage.visible) {
                    ADManager.ShowReward(() => {
                        this.Select.visible = true;
                        ClothChange.Instance._ClothChange(this.ID, this.type);
                        BagListController.Instance.getlist(this.type)._refresh();
                        let dataall = GameDataController.ClothDataRefresh;
                        dataall[this.ID] = 0;
                        GameDataController.ClothDataRefresh = dataall;
                        UIMgr.tip("恭喜获得一件装扮");
                        ClothChange.Instance.CharmValueChange();
                        UIMgr.get("UIReady").CharmValueShow();
                    }, () => {
                        UIMgr.show("UITip", () => {
                            this.Select.visible = true;
                            ClothChange.Instance._ClothChange(this.ID, this.type);
                            BagListController.Instance.getlist(this.type)._refresh();
                            let dataall = GameDataController.ClothDataRefresh;
                            dataall[this.ID] = 0;
                            GameDataController.ClothDataRefresh = dataall;
                            UIMgr.tip("恭喜获得一件装扮");
                            ClothChange.Instance.CharmValueChange();
                            UIMgr.get("UIReady").CharmValueShow();
                        });
                    });
                }
                else {
                    UIMgr.tip("当前装扮未解锁");
                }
            }
            else {
                console.log("点击选择衣服-------", this.ID, "------", this.skinname);
                console.log("                                                     ");
                this.Select.visible = true;
                ClothChange.Instance._ClothChange(this.ID, this.type);
                BagListController.Instance.getlist(this.type)._refresh();
                ClothChange.Instance.CharmValueChange();
                UIMgr.get("UIReady").CharmValueShow();
            }
        }
    }

    class AccList extends ListItem {
        onAwake() {
            super.onAwake();
            this._refresh();
            this.List.dataSource = this.Data;
            this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        onWrapItem(cell, index) {
            cell.getComponent(SkinItem).fell(this.Data[index]);
        }
        show() {
            this._refresh();
            this.List.dataSource = this.Data;
        }
        refresh() {
            this.Data = GameDataController.OrnamentData;
            this.List.refresh();
        }
        hide() {
            super.hide();
        }
    }

    class HairList extends ListItem {
        onAwake() {
            super.onAwake();
            this.refresh();
            this.List.dataSource = this.Data;
            this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        onWrapItem(cell, index) {
            cell.getComponent(SkinItem).fell(this.Data[index]);
        }
        show() {
            this.refresh();
            this.List.dataSource = this.Data;
        }
        refresh() {
            this.Data = GameDataController.HairData;
            this.List.refresh();
        }
        hide() {
            super.hide();
            console.log("hairList,hide", this.List.visible);
        }
    }

    class DressList extends ListItem {
        onAwake() {
            console.log("DressList OnAwake");
            this.init();
            this.refresh();
            this.List.dataSource = this.Data;
            this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        init() {
            super.init();
        }
        onWrapItem(cell, index) {
            cell.getComponent(SkinItem).fell(this.Data[index]);
        }
        show() {
            console.log("DressList Onshow");
            this.refresh();
            this.List.dataSource = this.Data;
        }
        refresh() {
            this.Data = GameDataController.DressData;
            this.List.refresh();
        }
        hide() {
            super.hide();
            console.log("DressListHide", this.List.visible);
        }
    }

    class UpList extends ListItem {
        onAwake() {
            super.onAwake();
            this._refresh();
            this.List.dataSource = this.Data;
            this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        onWrapItem(cell, index) {
            cell.getComponent(SkinItem).fell(this.Data[index]);
        }
        show() {
            this.refresh();
            this.List.dataSource = this.Data;
        }
        refresh() {
            this.Data = GameDataController.ShirtData;
            this.List.refresh();
            console.log("UpList刷新列表");
        }
        hide() {
            super.hide();
        }
    }

    class DownList extends ListItem {
        onAwake() {
            super.onAwake();
            this.refresh();
            this.List.dataSource = this.Data;
            this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        onWrapItem(cell, index) {
            cell.getComponent(SkinItem).fell(this.Data[index]);
        }
        show() {
            this._refresh();
            this.List.dataSource = this.Data;
        }
        refresh() {
            this.Data = GameDataController.TrousersData;
            this.List.refresh();
        }
        hide() {
            super.hide();
        }
    }

    class SockList extends ListItem {
        onAwake() {
            super.onAwake();
            this._refresh();
            this.List.dataSource = this.Data;
            this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        onWrapItem(cell, index) {
            cell.getComponent(SkinItem).fell(this.Data[index]);
        }
        show() {
            this._refresh();
            this.List.dataSource = this.Data;
        }
        refresh() {
            this.Data = GameDataController.SocksData;
            this.List.refresh();
        }
        hide() {
            super.hide();
        }
    }

    class ShoesList extends ListItem {
        onAwake() {
            super.onAwake();
            this.refresh();
            this.List.dataSource = this.Data;
            this.List.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        onWrapItem(cell, index) {
            cell.getComponent(SkinItem).fell(this.Data[index]);
        }
        show() {
            this.refresh();
            this.List.dataSource = this.Data;
        }
        refresh() {
            this.Data = GameDataController.ShoseData;
            this.List.refresh();
        }
        hide() {
            super.hide();
        }
    }

    class ClothBtn extends Laya.Script {
        onAwake() {
            this.Btn = this.owner.getChildAt(0);
            this.icon = this.owner.getChildAt(1);
            this.Btn.on(Laya.Event.CLICK, this, this.click);
        }
        fell(mes, index) {
            this.data = mes;
            this.Btn.skin = this.data + ".png";
            this.icon.skin = this.data + "1.png";
            this.index = index;
            this.icon.visible = false;
            this.ID = index;
            if (this.ID > 1) {
                this.ID += 1;
            }
            if (BagListController.Instance.SelectIndex == this.ID) {
                this.icon.visible = true;
            }
            else {
                this.icon.visible = false;
            }
        }
        click() {
            switch (this.index) {
                case 0:
                    BagListController.Instance.ClothesPageChange(0);
                    break;
                case 1:
                    BagListController.Instance.ClothesPageChange(1);
                    break;
                case 2:
                    BagListController.Instance.ClothesPageChange(3);
                    break;
                case 3:
                    BagListController.Instance.ClothesPageChange(4);
                    break;
                case 4:
                    BagListController.Instance.ClothesPageChange(5);
                    break;
                case 5:
                    BagListController.Instance.ClothesPageChange(6);
                    break;
                case 6:
                    BagListController.Instance.ClothesPageChange(7);
                    break;
                case 7:
                    BagListController.Instance.ClothesPageChange(8);
                    break;
            }
        }
    }

    class BagListController extends Laya.Script {
        constructor() {
            super(...arguments);
            this.listtype = ListType.HairList;
            this.ListMap = new Map();
            this.SelectIndex = 0;
            this.Data = ["Btnbar/hair",
                "Btnbar/dress",
                "Btnbar/shirt",
                "Btnbar/trousers",
                "Btnbar/socks",
                "Btnbar/shose",
                "Btnbar/ornament",
            ];
            this.listnameitem = ListType.HairList;
        }
        onAwake() {
            BagListController.Instance = this;
            this.Bag = this.owner;
            this.BtnBar = this.Bag.getChildByName("BtnBar");
            this.ShowView = this.Bag.getChildByName("ShowView");
            this.ListBtn = this.BtnBar.getChildByName("ListBtn");
            this.hairList = this.ShowView.getChildByName("hair").getChildByName("hairList");
            let _hairList = this.hairList.getComponent(HairList);
            this.dressList = this.ShowView.getChildByName("dress").getChildByName("dressList");
            let _dressList = this.dressList.getComponent(DressList);
            this.shirtList = this.ShowView.getChildByName("shirt").getChildByName("shirtList");
            let _shirtList = this.shirtList.getComponent(UpList);
            this.trousersList = this.ShowView.getChildByName("trousers").getChildByName("trousersList");
            let _trousersList = this.trousersList.getComponent(DownList);
            this.socksList = this.ShowView.getChildByName("socks").getChildByName("socksList");
            let _socksList = this.socksList.getComponent(SockList);
            this.shoesList = this.ShowView.getChildByName("shose").getChildByName("shoseList");
            let _shoesList = this.shoesList.getComponent(ShoesList);
            this.ornamentList = this.ShowView.getChildByName("ornament").getChildByName("ornamentList");
            let _ornamentList = this.ornamentList.getComponent(AccList);
            this.ListMap.set(ListType.HairList, _hairList);
            this.ListMap.set(ListType.DressList, _dressList);
            this.ListMap.set(ListType.ShirtList, _shirtList);
            this.ListMap.set(ListType.TrousersList, _trousersList);
            this.ListMap.set(ListType.SocksList, _socksList);
            this.ListMap.set(ListType.ShoesList, _shoesList);
            this.ListMap.set(ListType.OrnamentList, _ornamentList);
            console.log("BagListControllerOnawake", this.ListMap);
            this.Up = this.BtnBar.getChildByName("Up");
            this.Down = this.BtnBar.getChildByName("Down");
            this.Hair = this.BtnBar.getChildByName("Hair");
            this.Acc = this.BtnBar.getChildByName("Acc");
            this.Shoes = this.BtnBar.getChildByName("Shoes");
            this.Dress = this.BtnBar.getChildByName("Dress");
            this.Sock = this.BtnBar.getChildByName("Sock");
            this.BtnBarListFell();
        }
        BtnBarListFell() {
            this.ListBtn.hScrollBarSkin = "";
            this.ListBtn.array = this.Data;
            this.ListBtn.renderHandler = new Laya.Handler(this, this.onWrapItem);
        }
        onWrapItem(cell, index) {
            cell.getComponent(ClothBtn).fell(this.Data[index], index);
        }
        onStart() {
            this.ClothesPageChange(0);
        }
        btnev(img, fun) {
            img.on(Laya.Event.CLICK, this, fun);
        }
        ClothesPageChange(index) {
            this.SelectIndex = index;
            switch (index) {
                case ListType.HairList:
                    this.showList(ListType.HairList);
                    ADManager.TAPoint(TaT.BtnShow, "ADhair40101_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADhair50101_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADhair50201_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADhair10301_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADhair30301_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADhair50301_click");
                    break;
                case ListType.DressList:
                    this.showList(ListType.DressList);
                    ADManager.TAPoint(TaT.BtnShow, "ADdress40102_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADdress50102_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADdress50202_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADdress50302_click");
                    break;
                case ListType.ShoesList:
                    this.showList(ListType.ShoesList);
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes20205_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes30205_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes40104_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes40204_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes50104_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes50203_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes10305_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes20303_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes30305_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshoes50303_click");
                    break;
                case ListType.OrnamentList:
                    this.showList(ListType.OrnamentList);
                    ADManager.TAPoint(TaT.BtnShow, "ADring10201_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADring40105_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADring50204_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADring20304_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADring50304_click");
                    break;
                case ListType.SocksList:
                    this.showList(ListType.SocksList);
                    ADManager.TAPoint(TaT.BtnShow, "ADsocks20204_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADsocks50103_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADsocks30304_click");
                    break;
                case ListType.TrousersList:
                    this.showList(ListType.TrousersList);
                    ADManager.TAPoint(TaT.BtnShow, "ADpants10203_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADpants20203_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADpants30203_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADpants40203_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADpants10304_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADpants20302_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADpants30303_click");
                    break;
                case ListType.ShirtList:
                    this.showList(ListType.ShirtList);
                    ADManager.TAPoint(TaT.BtnShow, "ADshirt10202_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshirt20202_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshirt30202_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshirt40202_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshirt10303_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshirt20301_click");
                    ADManager.TAPoint(TaT.BtnShow, "ADshirt30302_click");
                    break;
                case ListType.PetList:
                    this.showList(ListType.PetList);
                    break;
            }
            this.ListBtn.refresh();
        }
        showList(listname = this.listnameitem) {
            this.listnameitem = listname;
            this.ListMap.forEach((v, k) => {
                if (k == listname) {
                    v.owner.parent.visible = true;
                    v._refresh();
                }
                else {
                    v.owner.parent.visible = false;
                }
            });
        }
        getlist(listnumber) {
            return this.ListMap.get(listnumber);
        }
        refresh() {
            this.ListMap.forEach((v, k) => {
                v._refresh();
            });
        }
    }
    var ListType;
    (function (ListType) {
        ListType[ListType["HairList"] = 0] = "HairList";
        ListType[ListType["DressList"] = 1] = "DressList";
        ListType[ListType["CoatList"] = 2] = "CoatList";
        ListType[ListType["ShirtList"] = 3] = "ShirtList";
        ListType[ListType["TrousersList"] = 4] = "TrousersList";
        ListType[ListType["SocksList"] = 5] = "SocksList";
        ListType[ListType["ShoesList"] = 6] = "ShoesList";
        ListType[ListType["OrnamentList"] = 7] = "OrnamentList";
        ListType[ListType["PetList"] = 8] = "PetList";
    })(ListType || (ListType = {}));

    var Tools;
    (function (Tools) {
        function taskCircleCountdown(parent, startAngle, endAngle) {
            parent.cacheAs = "bitmap";
            if (parent.numChildren > 0) {
                let drawPieSpt = parent.getChildAt(0);
                console.log("endAngle", endAngle);
                let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                return drawPie;
            }
            else {
                let drawPieSpt = new Laya.Sprite();
                parent.addChild(drawPieSpt);
                let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                return drawPie;
            }
        }
        Tools.taskCircleCountdown = taskCircleCountdown;
        function arrayRandomGetOut(arr, num) {
            if (!num) {
                num = 1;
            }
            let arrCopy = Tools.array_Copy(arr);
            let arr0 = [];
            if (num > arrCopy.length) {
                return '数组长度小于取出的数！';
            }
            else {
                for (let index = 0; index < num; index++) {
                    let ran = Math.round(Math.random() * (arrCopy.length - 1));
                    let a1 = arrCopy[ran];
                    arrCopy.splice(ran, 1);
                    arr0.push(a1);
                }
                return arr0;
            }
        }
        Tools.arrayRandomGetOut = arrayRandomGetOut;
        function array_Copy(arr1) {
            var arr = [];
            for (var i = 0; i < arr1.length; i++) {
                arr.push(arr1[i]);
            }
            return arr;
        }
        Tools.array_Copy = array_Copy;
        function obj_DeepCopy(source) {
            var sourceCopy = {};
            for (var item in source)
                sourceCopy[item] = typeof source[item] === 'object' ? obj_DeepCopy(source[item]) : source[item];
            return sourceCopy;
        }
        Tools.obj_DeepCopy = obj_DeepCopy;
        function objArray_Copy(source) {
            var sourceCopy = source instanceof Array ? [] : {};
            for (var item in source) {
                sourceCopy[item] = typeof source[item] === 'object' ? obj_DeepCopy(source[item]) : source[item];
            }
            return sourceCopy;
        }
        Tools.objArray_Copy = objArray_Copy;
        function dataCompareDifferent(data1, data2, property) {
            var result = [];
            for (var i = 0; i < data1.length; i++) {
                var obj1 = data1[i];
                var obj1Name = obj1[property];
                var isExist = false;
                for (var j = 0; j < data2.length; j++) {
                    var obj2 = data2[j];
                    var obj2Name = obj2[property];
                    if (obj2Name == obj1Name) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    result.push(obj1);
                }
            }
            return result;
        }
        Tools.dataCompareDifferent = dataCompareDifferent;
        function data1AddToData2(data1, data2) {
            for (let index = 0; index < data2.length; index++) {
                const element = data2[index];
                data1.push(element);
            }
        }
        Tools.data1AddToData2 = data1AddToData2;
        function dataCompare(arr, storageName, propertyName) {
            let dataArr;
            if (Laya.LocalStorage.getJSON(storageName)) {
                dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName))[storageName];
                console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
                try {
                    let dataArr_0 = arr;
                    if (dataArr_0.length >= dataArr.length) {
                        let diffArray = Tools.dataCompareDifferent(dataArr_0, dataArr, propertyName);
                        console.log('两个数据的差值为：', diffArray);
                        Tools.data1AddToData2(dataArr, diffArray);
                    }
                    else {
                        console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                    }
                }
                catch (error) {
                    console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！');
                }
            }
            else {
                try {
                    dataArr = arr;
                }
                catch (error) {
                    console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！');
                }
            }
            let data = {};
            data[storageName] = dataArr;
            Laya.LocalStorage.setJSON(storageName, JSON.stringify(data));
            return dataArr;
        }
        Tools.dataCompare = dataCompare;
        function node_RemoveAllChildren(node) {
            if (node.numChildren > 0) {
                node.removeChildren(0, node.numChildren - 1);
            }
        }
        Tools.node_RemoveAllChildren = node_RemoveAllChildren;
        function node_2DShowExcludedChild(node, childNameArr, bool) {
            for (let i = 0; i < node.numChildren; i++) {
                let Child = node.getChildAt(i);
                for (let j = 0; j < childNameArr.length; j++) {
                    if (Child.name == childNameArr[j]) {
                        if (bool || bool == undefined) {
                            Child.visible = true;
                        }
                        else {
                            Child.visible = false;
                        }
                    }
                    else {
                        if (bool || bool == undefined) {
                            Child.visible = false;
                        }
                        else {
                            Child.visible = true;
                        }
                    }
                }
            }
        }
        Tools.node_2DShowExcludedChild = node_2DShowExcludedChild;
    })(Tools || (Tools = {}));

    class GameDataController extends Laya.Script {
        static get _ClothData() {
            return this._clothData;
        }
        static GetFirstLoginTime() {
            let time = Laya.LocalStorage.getItem("Get");
            if (time) {
            }
            else {
                Laya.LocalStorage.setItem("Get", "1562730819957");
                time = Laya.LocalStorage.getItem("Get");
            }
            return parseFloat(time);
        }
        static setFirstLoginTime() {
            let time = Date.now();
            Laya.LocalStorage.setItem("Get", time + "");
        }
        static ClothdatapackSet(k, v) {
            Laya.LocalStorage.setJSON(k, v);
        }
        static ClothdatapackGet(k) {
            return Laya.LocalStorage.getJSON(k);
        }
        static ClothdatapackRemove(k) {
            return Laya.LocalStorage.removeItem(k);
        }
        static set ClothDataRefresh(v) {
            Laya.LocalStorage.setJSON("ClothData", v);
        }
        static get ClothDataRefresh() {
            let a = Laya.LocalStorage.getJSON("ClothData");
            return a;
        }
        static ClothAlllockNum(strs) {
            let num = Object.keys(strs).length;
            console.log(Object.keys(strs).length);
            for (let i in strs) {
                if (strs[i] == 1) {
                }
                else {
                    num--;
                }
            }
            return num;
        }
        static ClothAllLockArr(strs) {
            let num = Object.keys(strs).length;
            console.log(Object.keys(strs).length);
            let temp = [];
            for (let i in strs) {
                if (strs[i] == 1) {
                    temp.push(i);
                }
                else {
                }
            }
            console.log(temp);
            return temp;
        }
        static ClothCanUse(Id) {
            if (this._clothData.has(Id)) {
                let data = this._clothData.get(Id);
                if (data.GetType2) {
                    let str = this.ClothdatapackGet(data.GetType2);
                    if (str != null) {
                        if ((data.GetType2.split('_'))[0] == "1") {
                            let str = this.ClothDataRefresh[Id];
                            if (str != null) {
                                if (GameDataController.ClothDataRefresh[Id] == 1) {
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            }
                        }
                        else if ((data.GetType2.split('_'))[0] == "2") {
                            let num = GameDataController.ClothAlllockNum(str);
                            if (num > 0) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                        else if ((data.GetType2.split('_'))[0] == "3") {
                            let str = this.ClothDataRefresh[Id];
                            if (str != null) {
                                if (GameDataController.ClothDataRefresh[Id] == 1) {
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            }
                        }
                        else if ((data.GetType2.split('_'))[0] == "4") {
                            let str = this.ClothDataRefresh[Id];
                            if (str != null) {
                                if (GameDataController.ClothDataRefresh[Id] == 1) {
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            }
                        }
                        else {
                            return true;
                        }
                    }
                    else {
                        console.log("无当前衣服套装", Id);
                        return false;
                    }
                }
                else {
                    let str = this.ClothDataRefresh[Id];
                    if (str != null) {
                        if (GameDataController.ClothDataRefresh[Id] == 1) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        static GetFirstToNow() {
            let FirstDay = this.GetFirstLoginTime();
            let NowDay = Date.now();
            let FirstDayTo1 = Math.ceil((NowDay - FirstDay) / (24 * 60 * 60 * 1000));
            console.log("两天之间的天数", FirstDayTo1);
            return FirstDayTo1;
        }
        static set PhotosData(v) {
            Laya.LocalStorage.setJSON("PhotosData", v);
        }
        static get PhotosData() {
            let a = Laya.LocalStorage.getJSON("PhotosData");
            if (a) {
            }
            else {
                Laya.LocalStorage.setJSON("PhotosData", null);
            }
            return a;
        }
        static set PhotosIDarr(v) {
            Laya.LocalStorage.setJSON("PhotosIDarr", v);
        }
        static get PhotosIDarr() {
            let a = Laya.LocalStorage.getJSON("PhotosIDarr");
            if (a) {
            }
            else {
                Laya.LocalStorage.setJSON("PhotosIDarr", null);
            }
            return a;
        }
        static SetLastTime() {
            let item = Date.now();
            Laya.LocalStorage.setItem("LastTime", item + "");
        }
        static GetLastTime() {
            let time = Laya.LocalStorage.getItem("LastTime");
            if (time != null) {
            }
            else {
                Laya.LocalStorage.setItem("LastTime", "1562730819957");
                time = Laya.LocalStorage.getItem("LastTime");
            }
            return parseFloat(time);
        }
        static IsNewDay() {
            let oldtime = this.GetLastTime();
            let olddate = new Date(oldtime);
            let oy = olddate.getFullYear();
            let om = olddate.getMonth();
            let od = olddate.getDate();
            let curTime = Date.now();
            let nowDate = new Date();
            let ny = nowDate.getFullYear();
            let nm = nowDate.getMonth();
            let nd = nowDate.getDate();
            return (curTime > oldtime) && (ny > oy || nm > om || nd > od);
        }
        static set TodayHeCheng(v) {
            Laya.LocalStorage.setItem("TodayHeCheng", v);
        }
        static get TodayHeCheng() {
            return Laya.LocalStorage.getItem("TodayHeCheng");
        }
        static set TodaySign(v) {
            Laya.LocalStorage.setItem("TodaySign", v);
        }
        static get TodaySign() {
            return Laya.LocalStorage.getItem("TodaySign");
        }
        static set PickNum(v) {
            Laya.LocalStorage.setItem("PickNum", v);
        }
        static get PickNum() {
            return Laya.LocalStorage.getItem("PickNum");
        }
        static set TodayWinNum(v) {
            Laya.LocalStorage.setItem("TodayWinNum", v);
        }
        static get TodayWinNum() {
            return Laya.LocalStorage.getItem("TodayWinNum");
        }
        static set ShopCharmValue(v) {
            Laya.LocalStorage.setItem("ShopCharmValue", v);
        }
        static get ShopCharmValue() {
            return Laya.LocalStorage.getItem("ShopCharmValue");
        }
        static set CharmValue(v) {
            Laya.LocalStorage.setItem("CharmValue", v);
        }
        static get CharmValue() {
            return Laya.LocalStorage.getItem("CharmValue");
        }
        static Get_All_UnLock_Cloth() {
            let arr = [];
            for (let k in GameDataController.ClothDataAsy) {
                if (GameDataController.ClothDataAsy[k] == 1 && !GameDataController._ClothData.get(parseInt(k)).GetType2) {
                    if (!((k == "10000") || (k == "10001") || (k == "10002"))) {
                        arr.push(k);
                    }
                }
            }
            return arr;
        }
        static Get_All_UnLock_HighStarCloth() {
            let arr = [];
            for (let k in GameDataController.ClothDataAsy) {
                if (GameDataController.ClothDataAsy[k] == 1 && !GameDataController._ClothData.get(parseInt(k)).GetType2 && GameDataController._ClothData.get(parseInt(k)).Star == 3) {
                    if (!((k == "10000") || (k == "10001") || (k == "10002"))) {
                        arr.push(k);
                    }
                }
            }
            let t = Tools.arrayRandomGetOut(arr, 1);
            let cloth = GameDataController._ClothData.get(parseInt(t));
            return cloth;
        }
        static Get_All_UnLock_LowStarCloth() {
            let arr = [];
            for (let k in GameDataController.ClothDataAsy) {
                if (GameDataController.ClothDataAsy[k] == 1 && !GameDataController._ClothData.get(parseInt(k)).GetType2 && GameDataController._ClothData.get(parseInt(k)).Star == 1 || GameDataController._ClothData.get(parseInt(k)).Star == 2) {
                    if (!((k == "10000") || (k == "10001") || (k == "10002"))) {
                        arr.push(k);
                    }
                }
            }
            let t = Tools.arrayRandomGetOut(arr, 1);
            let cloth = GameDataController._ClothData.get(parseInt(t));
            return cloth;
        }
        static unlock(data) {
            let dataall = GameDataController.ClothDataRefresh;
            dataall[data.ID] = 0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.showList();
            BagListController.Instance.refresh();
        }
        static AddCharmValue(num) {
            if (!GameDataController.ShopCharmValue) {
                GameDataController.ShopCharmValue = num.toString();
            }
            else {
                let a = parseInt(GameDataController.ShopCharmValue);
                GameDataController.ShopCharmValue = (a + num).toString();
            }
        }
    }
    GameDataController._clothData = new Map();
    GameDataController.HairData = [];
    GameDataController.DressData = [];
    GameDataController.ShirtData = [];
    GameDataController.TrousersData = [];
    GameDataController.SocksData = [];
    GameDataController.ShoseData = [];
    GameDataController.OrnamentData = [];
    GameDataController.PetData = [];
    GameDataController.PickData = [];
    GameDataController.ClothDataAsy = {};
    class ClothPackgeData extends Laya.Script {
        constructor() {
            super(...arguments);
            this.cloths1 = [];
            this.cloths2 = [];
            this.cloths3 = [];
            this.cloths4 = [];
        }
    }

    class ActiveItem extends Laya.Script {
        constructor() {
            super(...arguments);
            this.Datas = [];
            this.Icons = [];
            this.Num = 0;
            this.MaxHeight = 85;
            this.MaxWeight = 85;
            this.str = {};
        }
        onAwake() {
            let item = this.owner;
            this.Bg = item.getChildByName("Bg");
            this.IconParent = item.getChildByName("IconParent");
            this.IconAll = this.IconParent.getChildByName("IconAll");
            this.ClothShow = item.getChildByName("ClothShow");
            for (let i = 0; i < this.ClothShow.numChildren; i++) {
                this.Icons.push(this.ClothShow.getChildAt(i).getChildAt(0));
            }
            this.ADBtn = item.getChildByName("ADBtn");
            this.TaskPre = this.ADBtn.getChildByName("TaskPre");
            this.ADBtn.on(Laya.Event.CLICK, this, this.adclick);
            this.PackName = item.getChildByName("PackName");
        }
        fell(mes, index) {
            let iconpath = "Active/taozhuang" + (index + 1) + ".png";
            let PackNamepath = "Active/Pack" + (index + 1) + ".png";
            this.Datas = mes;
            this.IconAll.skin = iconpath;
            this.PackName.skin = PackNamepath;
            console.log(this.Datas);
            this.Icons.forEach((v, i) => {
                console.log("橱窗" + i + v);
                if (i < this.Datas.length) {
                    v.visible = true;
                    v.skin = this.Datas[i].GetPath1();
                    let imageHeight = parseFloat(v.height.toString());
                    let imagewidth = parseFloat(v.width.toString());
                    let pr = 0;
                    if (imagewidth > imageHeight) {
                        pr = this.MaxWeight / imagewidth;
                    }
                    else {
                        pr = this.MaxHeight / imageHeight;
                    }
                    v.scaleX = pr;
                    v.scaleY = pr;
                    v.centerX = 0;
                    v.centerY = 0;
                }
                else {
                    v.visible = false;
                }
            });
            this.Datas.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[this.Datas[i].ID];
                this.str[this.Datas[i].ID] = nv;
                console.log(GameDataController.ClothDataRefresh[this.Datas[i].ID]);
            });
            console.log(this.str);
            GameDataController.ClothdatapackSet(this.Datas[0].GetType2, this.str);
            console.log(this.Datas[0].GetType2, this.str);
            this.Num = GameDataController.ClothAlllockNum(this.str);
            console.log("未解锁数量", this.Num);
            this.Now = (this.Datas.length - this.Num) + "";
            this.Need = (this.Datas.length) + "";
            this.TaskPre.text = this.Now + " / " + this.Need;
            this.ADBtn.visible = this.Num > 0;
            if (this.ADBtn.visible) {
                if (this.Datas[0].GetType2 == "2_1") {
                    ADManager.TAPoint(TaT.BtnShow, "ADtz1_click");
                }
                else if (this.Datas[0].GetType2 == "2_2") {
                    ADManager.TAPoint(TaT.BtnShow, "ADtz2_click");
                }
                else if (this.Datas[0].GetType2 == "2_3") {
                    ADManager.TAPoint(TaT.BtnShow, "ADhunsha_click");
                }
            }
            for (let index = 0; index < this.ClothShow.numChildren; index++) {
                if (index >= this.Datas.length) {
                    this.ClothShow.getChildAt(index).visible = false;
                }
            }
        }
        adclick() {
            if (this.Datas[0].GetType2 == "2_1") {
                ADManager.TAPoint(TaT.BtnClick, "ADtz1_click");
            }
            else if (this.Datas[0].GetType2 == "2_2") {
                ADManager.TAPoint(TaT.BtnClick, "ADtz2_click");
            }
            else if (this.Datas[0].GetType2 == "2_3") {
                ADManager.TAPoint(TaT.BtnClick, "ADhunsha_click");
            }
            ADManager.ShowReward(() => {
                this.GetAward();
            }, () => {
                UIMgr.show("UITip", () => {
                    this.GetAward();
                });
            });
        }
        GetAward() {
            for (let k in this.str) {
                if (this.str[k] == 1) {
                    console.log("GameDataController.ClothDataRefresh[k]", k, GameDataController.ClothDataRefresh[k]);
                    let dataall = GameDataController.ClothDataRefresh;
                    dataall[k] = 0;
                    GameDataController.ClothDataRefresh = dataall;
                    console.log(this.str, this.Datas[0].GetType2);
                    Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
                    UIMgr.get("UIActive").Refresh();
                    BagListController.Instance.showList();
                    UIMgr.tip("恭喜获得新衣服");
                    return;
                }
            }
        }
    }

    class Game_Init extends BaseState {
        constructor() {
            super(...arguments);
            this.name = "Game_Init";
        }
        onInit() {
            GameDataController.windowWidth = Laya.Browser.width;
            if (DataMgr.getPlayerData("newPlay") == 0) {
                ADManager.Event("NEW_LOAD_START");
            }
            else {
                ADManager.Event("OLD_LOAD_START");
            }
            Laya.MouseManager.multiTouchEnabled = false;
            UIMgr.show("UIPreload");
        }
        onEnter(args) {
        }
        onExit() {
        }
    }

    class Game_Ready extends BaseState {
        constructor() {
            super(...arguments);
            this.name = "Game_Ready";
        }
        onInit() {
        }
        onEnter() {
            UIMgr.show("UIReady");
        }
        onExit() {
        }
    }

    class Game_Main extends BaseState {
        constructor() {
            super(...arguments);
            this.name = "Game_Main";
        }
        onInit() {
        }
        onEnter(args) {
            UIMgr.show("UIMain");
            GameMgr.playMusic("bgm");
        }
        onExit() {
        }
    }

    class Game_Settle extends BaseState {
        constructor() {
            super(...arguments);
            this.name = "Game_Settle";
        }
        onInit() {
        }
        onEnter(args) {
            Laya.SoundManager.stopMusic();
            EventMgr.notify(GameEvent.save);
            EventMgr.notify(GameEvent.pause, false);
            UIMgr.interim1(() => {
                GameMgr.fsm.to("Game_Ready");
            });
        }
        onExit() {
        }
    }

    class ClothData extends Laya.Script {
        constructor() {
            super(...arguments);
            this._pos1 = new Laya.Point;
            this._pos2 = new Laya.Point;
        }
        set ID(v) {
            this._ID = v;
        }
        get ID() {
            return this._ID;
        }
        set Name(v) {
            this._Name = v;
        }
        get Name() {
            return this._Name;
        }
        set Level(v) {
            this._Level = v;
        }
        get Level() {
            return this._Level;
        }
        set Gender(v) {
            this._Gender = v;
        }
        get Gender() {
            return this._Gender;
        }
        set Type(v) {
            this._Type = v;
        }
        get Type() {
            return this._Type;
        }
        set IconPath1(v) {
            this._IconPath1 = v;
        }
        get IconPath1() {
            return this._IconPath1;
        }
        set Position(v) {
            this._Position = v;
        }
        get Position() {
            return this._Position;
        }
        set Sort1(v) {
            this._Sort1 = v - 10;
        }
        get Sort1() {
            return this._Sort1;
        }
        set IconPath2(v) {
            this._IconPath2 = v;
        }
        get IconPath2() {
            return this._IconPath2;
        }
        set Position2(v) {
            this._Position2 = v;
        }
        get Position2() {
            return this._Position2;
        }
        set Sort2(v) {
            this._Sort2 = v - 10;
        }
        get Sort2() {
            return this._Sort2;
        }
        set NeedItems(v) {
            this._NeedItems = v;
        }
        get NeedItems() {
            return this._NeedItems;
        }
        set Introduce(v) {
            this._Introduce = v;
        }
        get Introduce() {
            return this._Introduce;
        }
        set Label1(v) {
            this._Label1 = v;
        }
        get Label1() {
            return this._Label1;
        }
        set Label2(v) {
            this._Label2 = v;
        }
        get Label2() {
            return this._Label2;
        }
        set Price(v) {
            this._Price = v;
        }
        get Price() {
            return this._Price;
        }
        set num(v) {
            this._num = v;
        }
        get num() {
            return this._num;
        }
        set Type2(v) {
            this._Type2 = v;
        }
        get Type2() {
            return this._Type2;
        }
        set Star(v) {
            this._Star = v;
        }
        get Star() {
            return this._Star;
        }
        GetKey() {
            return this.ID;
        }
        GetPosition1() {
            let str = this.Position;
            if (str == null) {
                return this._pos1;
            }
            let a = str.split(',');
            this._pos1.x = parseFloat(a[0]);
            this._pos1.y = -parseFloat(a[1]);
            return this._pos1;
        }
        GetPosition2() {
            let str = this.Position2;
            if (str == null) {
                return this._pos2;
            }
            let a = str.split(',');
            this._pos2.x = parseFloat(a[0]);
            this._pos2.y = -parseFloat(a[1]);
            return this._pos2;
        }
        GetPath1() {
            if (this.IconPath1 == null) {
                return null;
            }
            let pathway = "";
            let filename = "";
            if (this.Type == 0) {
                filename = "Hair";
            }
            if (this.Type == 1) {
                filename = "Dress";
            }
            if (this.Type == 2) {
                filename = "";
            }
            if (this.Type == 3) {
                filename = "Up";
            }
            if (this.Type == 4) {
                filename = "Down";
            }
            if (this.Type == 5) {
                filename = "Scoks";
            }
            if (this.Type == 6) {
                filename = "Shoes";
            }
            if (this.Type == 7) {
                filename = "ACC";
            }
            if (this.Type == 8) {
                filename = "Pet";
            }
            pathway = "Cloth/" + filename + "/" + this.IconPath1 + ".png";
            return pathway;
        }
        GetPath2() {
            if (this.IconPath2 == null) {
                return null;
            }
            let pathway = "";
            let filename = "";
            if (this.Type == 0) {
                filename = "Hair";
            }
            if (this.Type == 1) {
                filename = "Dress";
            }
            if (this.Type == 2) {
                filename = "";
            }
            if (this.Type == 3) {
                filename = "Up";
            }
            if (this.Type == 4) {
                filename = "Down";
            }
            if (this.Type == 5) {
                filename = "Scoks";
            }
            if (this.Type == 6) {
                filename = "Shoes";
            }
            if (this.Type == 7) {
                filename = "ACC";
            }
            pathway = "Cloth/" + filename + "/" + this.IconPath2 + ".png";
            return pathway;
        }
        get GetType2() {
            if (this.Type2 != null) {
                return this.Type2.substring(0, 3);
            }
            else {
                return null;
            }
        }
    }

    class PickJsonData extends Laya.Script {
        constructor() {
            super(...arguments);
            this.PickJson = [
                {
                    ID: "1",
                    Name: "美少女 ",
                    Num: "4",
                },
                {
                    ID: "2",
                    Name: "牛奶煮萝莉",
                    Num: "4",
                },
                {
                    ID: "3",
                    Name: "凉巷少年与狸猫",
                    Num: "2",
                },
                {
                    ID: "4",
                    Name: "亦凡加油",
                    Num: "4",
                },
                {
                    ID: "5",
                    Name: "你好亦好",
                    Num: "3",
                },
                {
                    ID: "6",
                    Name: "美人性情",
                    Num: "3",
                },
                {
                    ID: "7",
                    Name: "迪士尼在逃公主",
                    Num: "3",
                },
                {
                    ID: "8",
                    Name: "云淡风轻",
                    Num: "2",
                },
                {
                    ID: "9",
                    Name: "南楼月下",
                    Num: "2",
                },
                {
                    ID: "10",
                    Name: "梦里遇你",
                    Num: "2",
                },
                {
                    ID: "11",
                    Name: "樱花钞",
                    Num: "2",
                },
                {
                    ID: "12",
                    Name: "行星饭",
                    Num: "1",
                },
                {
                    ID: "13",
                    Name: "烟雨江畔",
                    Num: "1",
                },
                {
                    ID: "14",
                    Name: "纪离",
                    Num: "1",
                },
                {
                    ID: "15",
                    Name: "谎言",
                    Num: "1",
                }
            ];
        }
        LoadPickJson() {
            this.PickJson.forEach((v) => {
                let temp = new PickData();
                if (v["ID"]) {
                    temp.ID = parseInt(v["ID"]);
                }
                if (v["Name"]) {
                    temp.Name = v["Name"];
                }
                if (v["Num"]) {
                    temp.Num = parseInt(v["Num"]);
                }
                GameDataController.PickData.push(temp);
            });
            let temp1 = new PickData();
            temp1.ID = 16;
            temp1.Name = "我";
            temp1.Num = parseInt(Laya.LocalStorage.getItem("TodayWinNum"));
            GameDataController.PickData.push(temp1);
        }
    }
    class PickData extends Laya.Script {
        set ID(v) {
            this._ID = v;
        }
        get ID() {
            return this._ID;
        }
        set Name(v) {
            this._Name = v;
        }
        get Name() {
            return this._Name;
        }
        set Num(v) {
            this._Num = v;
        }
        get Num() {
            return this._Num;
        }
    }

    class ConfigData extends Laya.Script {
        constructor() {
            super(...arguments);
            this.pic = new PickJsonData();
            this.ClothJson = [
                {
                    ID: "10000",
                    Name: "基础上衣",
                    Gender: "2",
                    Type: "3",
                    Position: "7,227.5,0",
                    Label1: "Label_1:100",
                    Label2: "Label_1:100",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "10000",
                },
                {
                    ID: "10001",
                    Name: "基础裙子",
                    Gender: "2",
                    Type: "4",
                    Position: "7,53,0",
                    Label1: "Label_1:100",
                    Label2: "Label_1:100",
                    Sort1: "3",
                    Sort2: "3",
                    IconPath1: "10001",
                },
                {
                    ID: "10002",
                    Name: "基础发型",
                    Gender: "2",
                    Type: "0",
                    Position: "10.5,317.1,0",
                    Label1: "Label_1:100",
                    Label2: "Label_1:100",
                    Sort1: "4",
                    Sort2: "3",
                    IconPath1: "11101",
                },
                {
                    ID: "13202",
                    Name: "珍珠",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "7",
                    Position: "13.8,263,0",
                    Label1: "Label_1:4000",
                    Label2: "Label_2:2000",
                    Sort1: "6",
                    Sort2: "2",
                    IconPath1: "13202",
                },
                {
                    ID: "10101",
                    Name: "阳光",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "0",
                    Position: "17.8,315.1,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "7",
                    Sort2: "2",
                    Icon: "icon_10101",
                    IconPath1: "10101",
                },
                {
                    ID: "10102",
                    Name: "轻柔",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "3",
                    Position: "19.6,192,0",
                    Label1: "Label_1:2000",
                    Label2: "Label_2:1000",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "10102",
                },
                {
                    ID: "10103",
                    Name: "舒适",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "4",
                    Position: "3.3,32.5,0",
                    Label1: "Label_1:2000",
                    Label2: "Label_2:1000",
                    Sort1: "6",
                    Sort2: "6",
                    Icon: "10103_icon",
                    IconPath1: "10103_1",
                    IconPath2: "10103_2",
                    Position2: "64.9,-33.4,0",
                },
                {
                    ID: "10104",
                    Name: "黑丝",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "5",
                    Position: "23,-220.7,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "2",
                    Sort2: "2",
                    IconPath1: "10104",
                },
                {
                    ID: "10105",
                    Name: "可爱皮鞋",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "6",
                    Position: "25.7,-359.6,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "10105",
                },
                {
                    ID: "10106",
                    Name: "小圆帽",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "7",
                    Position: "23,396,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "9",
                    Sort2: "-20",
                    IconPath1: "10106_1",
                    IconPath2: "10106_2",
                    Position2: "21.4,373.5,0",
                },
                {
                    ID: "10201",
                    Name: "海风",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Position: "3.4,-34.6,0",
                    Label1: "Label_4:500",
                    Label2: "Label_5:250",
                    Sort1: "6",
                    Sort2: "1",
                    Icon: "10201_icon",
                    IconPath1: "10201_1",
                    IconPath2: "10201_2",
                    Position2: "17.1,-49.4,0",
                },
                {
                    ID: "10202",
                    Name: "诱惑",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "3",
                    Position: "36.9,163.5,0",
                    Label1: "Label_4:2000",
                    Label2: "Label_5:1000",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "10202",
                },
                {
                    ID: "10203",
                    Name: "轻纱",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "4",
                    Position: "3.4,51.8,0",
                    Label1: "Label_4:2000",
                    Label2: "Label_5:1000",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "10203",
                },
                {
                    ID: "20101",
                    Name: "布偶",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "1",
                    Position: "15.1,113,0",
                    Label1: "Label_1:6000",
                    Label2: "Label_2:3000",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "20101",
                },
                {
                    ID: "20102",
                    Name: "粉色",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "5",
                    Position: "23.7,-288.4,0",
                    Label1: "Label_1:800",
                    Label2: "Label_2:400",
                    Sort1: "2",
                    Sort2: "2",
                    IconPath1: "20102",
                },
                {
                    ID: "20103",
                    Name: "红色皮鞋",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "6",
                    Position: "30.1,-347.2,0",
                    Label1: "Label_1:800",
                    Label2: "Label_2:400",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "20103",
                },
                {
                    ID: "20201",
                    Name: "青春",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "0",
                    Position: "23.29,363.2,0",
                    Label1: "Label_2:1000",
                    Label2: "Label_1:500",
                    Sort1: "3",
                    Sort2: "2",
                    Icon: "icon_20201",
                    IconPath1: "20201",
                },
                {
                    ID: "20202",
                    Name: "校服",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "3",
                    Position: "7.6,152.5,0",
                    Label1: "Label_2:2500",
                    Label2: "Label_1:1250",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "20202",
                },
                {
                    ID: "20203",
                    Name: "校服短裙",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "4",
                    Position: "7.6,52,0",
                    Label1: "Label_2:2500",
                    Label2: "Label_1:1250",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "20203",
                },
                {
                    ID: "20204",
                    Name: "黑色长袜",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "5",
                    Position: "28.33,-278.5,0",
                    Label1: "Label_2:800",
                    Label2: "Label_1:400",
                    Sort1: "2",
                    Sort2: "2",
                    IconPath1: "20204",
                },
                {
                    ID: "20205",
                    Name: "小皮鞋",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "6",
                    Position: "23,-365,0",
                    Label1: "Label_2:800",
                    Label2: "Label_1:400",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "20205",
                },
                {
                    ID: "30102",
                    Name: "甜蜜",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_1_3",
                    Type: "1",
                    Position: "1.3,102.3,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Sort2: "1",
                    Icon: "30102_icon",
                    IconPath1: "30102_1",
                    IconPath2: "30102_2",
                    Position2: "59.4,105.5,0",
                },
                {
                    ID: "30103",
                    Name: "粉色条纹",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_1_4",
                    Type: "5",
                    Position: "24.2,-243.3,0",
                    Label1: "Label_1:1100",
                    Label2: "Label_2:550",
                    Sort1: "2",
                    Sort2: "2",
                    IconPath1: "30103",
                },
                {
                    ID: "30104",
                    Name: "粉色皮鞋",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_1_5",
                    Type: "6",
                    Position: "24.1,-361.8,0",
                    Label1: "Label_1:1100",
                    Label2: "Label_2:550",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "30104",
                },
                {
                    ID: "30105",
                    Name: "发卡",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_1_1",
                    Type: "7",
                    Position: "16.8,386.2,0",
                    Label1: "Label_1:1500",
                    Label2: "Label_2:750",
                    Sort1: "8",
                    Sort2: "2",
                    IconPath1: "30105",
                },
                {
                    ID: "30201",
                    Name: "清凉",
                    Price: "0",
                    Star: "1",
                    Gender: "2",
                    Type: "0",
                    Position: "12.6,358.2,0",
                    Label1: "Label_6:1500",
                    Label2: "Label_1:750",
                    Sort1: "3",
                    Sort2: "2",
                    Icon: "icon_30201",
                    IconPath1: "30201",
                },
                {
                    ID: "30202",
                    Name: "水手服",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "3",
                    Position: "18.30,207.2,0",
                    Label1: "Label_6:3000",
                    Label2: "Label_1:1500",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "30202",
                },
                {
                    ID: "30203",
                    Name: "水手裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "4",
                    Position: "6.4,63.2,0",
                    Label1: "Label_6:3000",
                    Label2: "Label_1:1500",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "30203",
                },
                {
                    ID: "30205",
                    Name: "海边",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "6",
                    Position: "20.9,-362.5,0",
                    Label1: "Label_6:1100",
                    Label2: "Label_1:550",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "30205",
                },
                {
                    ID: "40101",
                    Name: "披肩长发",
                    Price: "1",
                    Star: "1",
                    Gender: "2",
                    Type: "0",
                    Position: "15.6,351,0",
                    Label1: "Label_3:2000",
                    Label2: "Label_5:1000",
                    Sort1: "3",
                    Sort2: "1",
                    Icon: "icon_40101",
                    IconPath1: "40101_1",
                    IconPath2: "40101_2",
                    Position2: "33.32,179.5,0",
                },
                {
                    ID: "40102",
                    Name: "公主",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "1",
                    Position: "24.3,15.5,0",
                    Label1: "Label_3:8000",
                    Label2: "Label_5:4000",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "40102",
                },
                {
                    ID: "40104",
                    Name: "高跟鞋",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "6",
                    Position: "46.7,-329.8,0",
                    Label1: "Label_3:1300",
                    Label2: "Label_5:650",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "40104",
                },
                {
                    ID: "40105",
                    Name: "诱惑",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Position: "51.5,415.2,0",
                    Label1: "Label_3:2000",
                    Label2: "Label_5:1000",
                    Sort1: "8",
                    Sort2: "5",
                    IconPath1: "40105_1",
                    IconPath2: "40105_2",
                    Position2: "31.5,285.4,0",
                },
                {
                    ID: "40201",
                    Name: "成熟",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_1_2",
                    Type: "0",
                    Position: "21.4,345.06,0",
                    Label1: "Label_4:2000",
                    Label2: "Label_2:1000",
                    Sort1: "3",
                    Sort2: "2",
                    Icon: "icon_40201",
                    IconPath1: "40201",
                },
                {
                    ID: "40202",
                    Name: "端庄",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "3",
                    Position: "3.4,151.5,0",
                    Label1: "Label_4:3500",
                    Label2: "Label_2:1750",
                    Sort1: "4",
                    Sort2: "1",
                    Icon: "40202_icon",
                    IconPath1: "40202_1",
                    IconPath2: "40202_2",
                    Position2: "17.1,262,0",
                },
                {
                    ID: "40203",
                    Name: "性感",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "4",
                    Position: "17.10,-89.6,0",
                    Label1: "Label_4:3500",
                    Label2: "Label_2:1750",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "40203",
                },
                {
                    ID: "40204",
                    Name: "稳重",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "6",
                    Position: "23.9,-355.5,0",
                    Label1: "Label_4:1300",
                    Label2: "Label_2:650",
                    Sort1: "5",
                    Sort2: "2",
                    IconPath1: "40204",
                },
                {
                    ID: "50101",
                    Name: "紫色",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "0",
                    Position: "9.8,340.6,0",
                    Label1: "Label_1:2500",
                    Label2: "Label_5:1250",
                    Sort1: "3",
                    Sort2: "2",
                    Icon: "icon_50101",
                    IconPath1: "50101",
                },
                {
                    ID: "50102",
                    Name: "女仆",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "1",
                    Position: "12.2,105.95,0",
                    Label1: "Label_1:9000",
                    Label2: "Label_5:4500",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "50102",
                },
                {
                    ID: "50103",
                    Name: "碎边袜",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "5",
                    Position: "23.8,-307.3,0",
                    Label1: "Label_1:1600",
                    Label2: "Label_5:800",
                    Sort1: "2",
                    Sort2: "2",
                    IconPath1: "50103",
                },
                {
                    ID: "50104",
                    Name: "紫色皮鞋",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "6",
                    Position: "24.2,-362.4,0",
                    Label1: "Label_1:1300",
                    Label2: "Label_5:650",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "50104",
                },
                {
                    ID: "50201",
                    Name: "天真",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "0",
                    Position: "7.4,317.5,0",
                    Label1: "Label_3:2500",
                    Label2: "Label_2:1250",
                    Sort1: "5",
                    Sort2: "2",
                    Icon: "icon_50201",
                    IconPath1: "50201",
                },
                {
                    ID: "50202",
                    Name: "公主裙2",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "1",
                    Position: "8.2,73.46,0",
                    Label1: "Label_3:9000",
                    Label2: "Label_2:4500",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "50202",
                },
                {
                    ID: "50203",
                    Name: "优雅",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "6",
                    Position: "27.1,-324.9,0",
                    Label1: "Label_3:1300",
                    Label2: "Label_2:650",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "50203",
                },
                {
                    ID: "50204",
                    Name: "花帽",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Position: "32.4,368.3,0",
                    Label1: "Label_3:2500",
                    Label2: "Label_2:1250",
                    Sort1: "8",
                    Sort2: "2",
                    IconPath1: "50204",
                },
                {
                    ID: "10401",
                    Name: "灰白",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "4",
                    Type2: "1_1_2",
                    Type: "0",
                    Position: "23.29,363.2,0",
                    Label1: "Label_3:1500",
                    Label2: "Label_5:750",
                    Sort1: "3",
                    Sort2: "2",
                    Icon: "icon_10401",
                    IconPath1: "10301",
                },
                {
                    ID: "10402",
                    Name: "可爱连衣裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "4",
                    Type2: "1_1_3",
                    Type: "1",
                    Position: "7.7,87.5,0",
                    Label1: "Label_3:3000",
                    Label2: "Label_5:1500",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "10302",
                },
                {
                    ID: "10403",
                    Name: "大白兔",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "4",
                    Type2: "1_1_4",
                    Type: "6",
                    Position: "23.29,-370,0",
                    Label1: "Label_3:3000",
                    Label2: "Label_5:1500",
                    Sort1: "5",
                    Sort2: "2",
                    IconPath1: "10303",
                },
                {
                    ID: "10405",
                    Name: "发卡",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "4",
                    Type2: "1_1_1",
                    Type: "7",
                    Position: "15.1,393.2,0",
                    Label1: "Label_3:1300",
                    Label2: "Label_5:650",
                    Sort1: "8",
                    Sort2: "2",
                    IconPath1: "10305",
                },
                {
                    ID: "20301",
                    Name: "海军制服",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "3",
                    Position: "7.98,166,0",
                    Label1: "Label_2:2500",
                    Label2: "Label_3:1250",
                    Sort1: "4",
                    Sort2: "1",
                    IconPath1: "20301",
                    Position2: "17.1,262,0",
                },
                {
                    ID: "20302",
                    Name: "海军下装",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "4",
                    Position: "5.7,56.6,0",
                    Label1: "Label_2:2500",
                    Label2: "Label_3:1250",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "20302",
                },
                {
                    ID: "20303",
                    Name: "海皮鞋",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "6",
                    Position: "21.40,-216,0",
                    Label1: "Label_2:1200",
                    Label2: "Label_3:600",
                    Sort1: "3",
                    Sort2: "2",
                    IconPath1: "20303",
                },
                {
                    ID: "20304",
                    Name: "军帽",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Position: "13.8,404.4,0",
                    Label1: "Label_2:3000",
                    Label2: "Label_3:1500",
                    Sort1: "7",
                    Sort2: "2",
                    IconPath1: "20304",
                },
                {
                    ID: "30301",
                    Name: "麻花辫",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "0",
                    Position: "26.93,351.5,0",
                    Label1: "Label_3:1500",
                    Label2: "Label_5:750",
                    Sort1: "3",
                    Sort2: "1",
                    Icon: "30301_icon",
                    IconPath1: "30301_1",
                    IconPath2: "30301_2",
                    Position2: "97,260,0",
                },
                {
                    ID: "30302",
                    Name: "披肩斗篷",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "3",
                    Position: "18.1,143,0",
                    Label1: "Label_3:3000",
                    Label2: "Label_5:1500",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "30302",
                },
                {
                    ID: "30303",
                    Name: "武士服",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "4",
                    Position: "6.6,41,0",
                    Label1: "Label_3:3000",
                    Label2: "Label_5:1500",
                    Sort1: "5",
                    Sort2: "2",
                    IconPath1: "30303",
                },
                {
                    ID: "30304",
                    Name: "黑丝",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "5",
                    Position: "23.30,-199.83,0",
                    Label1: "Label_3:1300",
                    Label2: "Label_5:650",
                    Sort1: "2",
                    Sort2: "2",
                    IconPath1: "30305",
                },
                {
                    ID: "30305",
                    Name: "重甲",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "6",
                    Position: "26.8,-286.8,0",
                    Label1: "Label_3:1300",
                    Label2: "Label_5:650",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "30306",
                },
                {
                    ID: "40301",
                    Name: "灵逸",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "6",
                    Type2: "2_2_2",
                    Type: "0",
                    Position: "10.5,308,0",
                    Label1: "Label_1:2000",
                    Label2: "Label_5:1000",
                    Sort1: "3",
                    Sort2: "1",
                    Icon: "40301_icon",
                    IconPath1: "40301_1",
                    IconPath2: "40301_2",
                    Position2: "11.5,222,0",
                },
                {
                    ID: "40302",
                    Name: "彩带上衣",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "6",
                    Type2: "2_2_3",
                    Type: "3",
                    Position: "35.3,110.5,0",
                    Label1: "Label_1:3500",
                    Label2: "Label_5:1750",
                    Sort1: "4",
                    IconPath1: "40302",
                },
                {
                    ID: "40303",
                    Name: "碎边红裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "6",
                    Type2: "2_2_4",
                    Type: "4",
                    Position: "0,7,0",
                    Label1: "Label_1:3500",
                    Label2: "Label_5:1750",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "40303",
                },
                {
                    ID: "40304",
                    Name: "可爱筒袜",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "6",
                    Type2: "2_2_5",
                    Type: "5",
                    Position: "25.4,-293.5,0",
                    Label1: "Label_1:1300",
                    Label2: "Label_5:650",
                    Sort1: "2",
                    Sort2: "2",
                    IconPath1: "40304",
                },
                {
                    ID: "40305",
                    Name: "铮亮",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "6",
                    Type2: "2_2_6",
                    Type: "6",
                    Position: "23.29,-367,0",
                    Label1: "Label_1:1300",
                    Label2: "Label_5:650",
                    Sort1: "5",
                    Sort2: "2",
                    IconPath1: "40305",
                },
                {
                    ID: "40306",
                    Name: "蝴蝶",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "6",
                    Type2: "2_2_1",
                    Type: "7",
                    Position: "37.5,395.2,0",
                    Label1: "Label_1:5000",
                    Label2: "Label_5:2500",
                    Sort1: "1",
                    Sort2: "2",
                    IconPath1: "40306",
                },
                {
                    ID: "50301",
                    Name: "温柔",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "0",
                    Position: "10.5,358,0",
                    Label1: "Label_2:2500",
                    Label2: "Label_5:1250",
                    Sort1: "3",
                    Sort2: "2",
                    Icon: "50301_icon",
                    IconPath1: "50301",
                },
                {
                    ID: "50302",
                    Name: "和服",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "1",
                    Position: "70.9,53.2,0",
                    Label1: "Label_2:9000",
                    Label2: "Label_5:4500",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "50302",
                },
                {
                    ID: "50303",
                    Name: "木屐",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "6",
                    Position: "37.5,-335.1,0",
                    Label1: "Label_2:1300",
                    Label2: "Label_5:650",
                    Sort1: "-9",
                    Sort2: "4",
                    IconPath1: "50303_1",
                    IconPath2: "50303_2",
                    Position2: "37.5,-335.1,0",
                },
                {
                    ID: "50304",
                    Name: "向阳花",
                    Price: "1",
                    Star: "2",
                    Gender: "2",
                    Type: "7",
                    Position: "-30.3,340.3,0",
                    Label1: "Label_2:2500",
                    Label2: "Label_5:1250",
                    Sort1: "7",
                    Sort2: "2",
                    IconPath1: "50304",
                },
                {
                    ID: "50404",
                    Name: "翅膀",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Position: "15.0,226.0,0",
                    Label1: "Label_2:3000",
                    Label2: "Label_3:1500",
                    Sort1: "-9",
                    IconPath1: "50404",
                },
                {
                    ID: "60101",
                    Name: "睡衣头发",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "0",
                    Position: "28.0,331.0,0",
                    Label1: "Label_4:2000",
                    Label2: "Label_2:1000",
                    Sort1: "3",
                    Sort2: "2",
                    Icon: "icon_60101",
                    IconPath1: "60101",
                },
                {
                    ID: "60102",
                    Name: "睡衣裙子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "17.0,62.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Sort2: "1",
                    Icon: "60102_icon",
                    IconPath1: "60102",
                },
                {
                    ID: "60103",
                    Name: "睡衣拖鞋",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "6",
                    Position: "23.0,-366.0,0",
                    Label1: "Label_1:1100",
                    Label2: "Label_2:550",
                    Sort1: "4",
                    Sort2: "2",
                    IconPath1: "60103",
                },
                {
                    ID: "70101",
                    Name: "淡黄裙子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "11.0,123.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Icon: "70101_icon",
                    IconPath1: "70101",
                },
                {
                    ID: "70102",
                    Name: "皮短裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "4",
                    Position: "6.0,62.0,0",
                    Label1: "Label_6:3000",
                    Label2: "Label_1:1500",
                    Sort1: "3",
                    IconPath1: "70102",
                },
                {
                    ID: "70103",
                    Name: "修身诱惑",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "1",
                    Position: "5.0,127.0,0",
                    Label1: "Label_1:2000",
                    Label2: "Label_2:1000",
                    Sort1: "3",
                    IconPath1: "70103",
                },
                {
                    ID: "70104",
                    Name: "亚麻短裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "4",
                    Position: "4.0,39.0,0",
                    Label1: "Label_6:3000",
                    Label2: "Label_1:1500",
                    Sort1: "2",
                    IconPath1: "70104",
                },
                {
                    ID: "70105",
                    Name: "民国上衣",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "3",
                    Position: "26.0,150.0,0",
                    Label1: "Label_1:2000",
                    Label2: "Label_2:1000",
                    Sort1: "4",
                    Sort2: "1",
                    IconPath1: "70105",
                },
                {
                    ID: "70106",
                    Name: "青花瓷长裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "8.0,114.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Icon: "70106_icon",
                    IconPath1: "70106",
                },
                {
                    ID: "70107",
                    Name: "丝瓜长裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "8.0,143.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Icon: "70107_icon",
                    IconPath1: "70107",
                },
                {
                    ID: "70108",
                    Name: "情趣",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "3",
                    Position: "5.0,224.0,0",
                    Label1: "Label_1:2000",
                    Label2: "Label_2:1000",
                    Sort1: "3",
                    IconPath1: "70108",
                },
                {
                    ID: "70109",
                    Name: "薰衣草",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "0",
                    Position: "37.0,327.1,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "7",
                    Icon: "icon_70109",
                    IconPath1: "70109",
                },
                {
                    ID: "70110",
                    Name: "淡粉红",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "0",
                    Position: "18.0,344.1,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "7",
                    Sort2: "2",
                    Icon: "icon_70110",
                    IconPath1: "70110",
                },
                {
                    ID: "70111",
                    Name: "青春韩版",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "3",
                    Position: "18.0,210.0,0",
                    Label1: "Label_1:2000",
                    Label2: "Label_2:1000",
                    Sort1: "3",
                    IconPath1: "70111",
                },
                {
                    ID: "40401",
                    Name: "罗丽叶发型",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "0",
                    Position: "30.0,354.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Icon: "40401_icon",
                    IconPath1: "40401",
                },
                {
                    ID: "40402",
                    Name: "罗丽叶裙子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "15.0,101.0,0",
                    Position2: "24.1,-2.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Sort2: "1",
                    Icon: "40402_icon",
                    IconPath1: "40402_1",
                    IconPath2: "40402_2",
                },
                {
                    ID: "40403",
                    Name: "罗丽叶鞋子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "6",
                    Position: "24.1,-359.0,0",
                    Label1: "Label_1:1100",
                    Sort1: "4",
                    IconPath1: "40403",
                },
                {
                    ID: "40501",
                    Name: "婚纱头发",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_3_1",
                    Type: "0",
                    Position: "31.0,329.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Icon: "40501_icon",
                    IconPath1: "40501",
                },
                {
                    ID: "40502",
                    Name: "婚纱裙子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_3_2",
                    Type: "1",
                    Position: "91.0,-77.0,0",
                    Label1: "Label_1:7000",
                    Sort1: "9",
                    Icon: "40502_icon",
                    IconPath1: "40502",
                },
                {
                    ID: "40503",
                    Name: "婚纱头饰",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Type2: "2_3_3",
                    Position: "41.0,123.0,0",
                    Label1: "Label_3:2000",
                    Label2: "Label_5:1000",
                    Sort1: "8",
                    Sort2: "5",
                    IconPath1: "40503_1",
                    IconPath2: "40503_2",
                    Position2: "24.0,390.0,0",
                },
                {
                    ID: "40504",
                    Name: "婚纱鞋子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type2: "2_3_4",
                    Type: "6",
                    Position: "25.1,-350.0,0",
                    Label1: "Label_1:1100",
                    Sort1: "2",
                    IconPath1: "40504",
                },
                {
                    ID: "40601",
                    Name: "白雪公主发型",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "0",
                    Position: "14.0,343.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Icon: "40601_icon",
                    IconPath1: "40601",
                },
                {
                    ID: "40602",
                    Name: "白雪公主裙子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "9.0,156.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "4",
                    Icon: "40602_icon",
                    IconPath1: "40602",
                },
                {
                    ID: "40603",
                    Name: "白雪公主长袜",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "5",
                    Position: "22,-208.0,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "2",
                    IconPath1: "40603",
                },
                {
                    ID: "40604",
                    Name: "白雪公主鞋子",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "6",
                    Position: "23.0,-359.0,0",
                    Label1: "Label_1:500",
                    Label2: "Label_2:250",
                    Sort1: "4",
                    IconPath1: "40604",
                },
                {
                    ID: "40605",
                    Name: "粉红魔杖",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Position: "-11.0,170.0,0",
                    Label1: "Label_1:4000",
                    Label2: "Label_2:2000",
                    Sort1: "-6",
                    IconPath1: "40605",
                },
                {
                    ID: "70202",
                    Name: "泳衣",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "6.0,135.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "5",
                    Icon: "70202_icon",
                    IconPath1: "70202",
                },
                {
                    ID: "70201",
                    Name: "汉服长裙",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "26.0,-31.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "5",
                    Icon: "70201_icon",
                    IconPath1: "70201",
                },
                {
                    ID: "71001",
                    Name: "嫦娥青丝",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "0",
                    Type2: "3_1_1",
                    Position: "34.0,218.0,0",
                    Position2: "69,126,0",
                    Label1: "Label_3:1500",
                    Label2: "Label_5:750",
                    Sort1: "6",
                    Sort2: "-10",
                    Icon: "71001_icon",
                    IconPath1: "71001_1",
                    IconPath2: "71001_2",
                },
                {
                    ID: "71002",
                    Name: "嫦娥霓裳",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Type2: "3_1_2",
                    Position: "17.0,-41.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "5",
                    Icon: "71002_icon",
                    IconPath1: "71002",
                },
                {
                    ID: "71003",
                    Name: "月兔",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "7",
                    Type2: "3_1_3",
                    Position: "-189.0,206.0,0",
                    Label1: "Label_1:4000",
                    Label2: "Label_2:2000",
                    Sort1: "-6",
                    IconPath1: "71003",
                },
                {
                    ID: "72001",
                    Name: "小红帽",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "0",
                    Position: "19.0,348.0,0",
                    Position2: "17,271,0",
                    Label1: "Label_3:1500",
                    Label2: "Label_5:750",
                    Sort1: "6",
                    Sort2: "1",
                    Icon: "72001_icon",
                    IconPath1: "72001_1",
                    IconPath2: "72001_2",
                },
                {
                    ID: "72002",
                    Name: "小红帽",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "1",
                    Position: "12.0,119.0,0",
                    Position2: "16.0,66.0,0",
                    Label1: "Label_1:7000",
                    Label2: "Label_2:3500",
                    Sort1: "5",
                    Sort2: "3",
                    Icon: "71002_icon",
                    IconPath1: "72002_1",
                    IconPath2: "72002_2",
                },
                {
                    ID: "72003",
                    Name: "小红帽",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    Type: "5",
                    Position: "23.8,-205.0,0",
                    Label1: "Label_1:1600",
                    Label2: "Label_5:800",
                    Sort1: "3",
                    IconPath1: "72003",
                },
                {
                    ID: "72004",
                    Name: "小红帽",
                    Price: "1",
                    Star: "3",
                    Gender: "2",
                    num: "5",
                    Type: "6",
                    Position: "27.0,-323.0,0",
                    Label1: "Label_1:1100",
                    Label2: "Label_2:550",
                    Sort1: "4",
                    IconPath1: "72004",
                }
            ];
        }
        LoadJson() {
            this.LoadJson2();
            this.pic.LoadPickJson();
        }
        LoadJson2() {
            console.log("===========>");
            let pack1 = new ClothPackgeData();
            let pack2 = new ClothPackgeData();
            let pack3 = new ClothPackgeData();
            let pack4 = new ClothPackgeData();
            this.ClothJson.forEach((v) => {
                let temp = new ClothData();
                if (v["ID"]) {
                    temp.ID = parseInt(v["ID"]);
                }
                if (v["Name"]) {
                    temp.Name = v["Name"];
                }
                if (v["NeedItems"]) {
                    temp.NeedItems = v["NeedItems"];
                }
                if (v["Gender"]) {
                    temp.Gender = parseInt(v["Gender"]);
                }
                if (v["Type"]) {
                    temp.Type = parseInt(v["Type"]);
                }
                if (v["Level"]) {
                    temp.Level = parseInt(v["Level"]);
                }
                if (v["Position"]) {
                    temp.Position = v["Position"];
                }
                if (v["Position2"]) {
                    temp.Position2 = v["Position2"];
                }
                if (v["Label1"]) {
                    temp.Label1 = v["Label1"];
                }
                if (v["Label2"]) {
                    temp.Label2 = v["Label2"];
                }
                if (v["Sort1"]) {
                    temp.Sort1 = parseInt(v["Sort1"]);
                }
                if (v["Sort2"]) {
                    temp.Sort2 = parseInt(v["Sort2"]);
                }
                if (v["Price"]) {
                    temp.Price = parseInt(v["Price"]);
                }
                if (v["IconPath1"]) {
                    temp.IconPath1 = v["IconPath1"];
                }
                if (v["IconPath2"]) {
                    temp.IconPath2 = v["IconPath2"];
                }
                if (v["Star"]) {
                    temp.Star = parseInt(v["Star"]);
                }
                if (v["Type2"]) {
                    temp.Type2 = v["Type2"];
                }
                if (v["num"]) {
                    temp.num = parseInt(v["num"]);
                }
                if (temp.ID == 10000 || temp.ID == 10001 || temp.ID == 10002) {
                }
                else {
                    switch (temp.Type) {
                        case clothtype.Hair:
                            GameDataController.HairData.push(temp);
                            break;
                        case clothtype.Dress:
                            GameDataController.DressData.push(temp);
                            break;
                        case clothtype.Shirt:
                            GameDataController.ShirtData.push(temp);
                            break;
                        case clothtype.Trousers:
                            GameDataController.TrousersData.push(temp);
                            break;
                        case clothtype.Socks:
                            GameDataController.SocksData.push(temp);
                            break;
                        case clothtype.Shose:
                            GameDataController.ShoseData.push(temp);
                            break;
                        case clothtype.Ornament:
                            GameDataController.OrnamentData.push(temp);
                            break;
                        case clothtype.Pet:
                            GameDataController.PetData.push(temp);
                            break;
                    }
                }
                if (temp.Type2 != null) {
                    let a = temp.Type2;
                    let arr = a.split("_");
                    if (arr[0] == "1") {
                        if (arr[1] == "1") {
                            pack1.cloths1.push(temp);
                        }
                        if (arr[1] == "2") {
                            pack1.cloths2.push(temp);
                        }
                        if (arr[1] == "3") {
                            pack1.cloths3.push(temp);
                        }
                        if (arr[1] == "4") {
                            pack1.cloths4.push(temp);
                        }
                    }
                    else if (arr[0] == "2") {
                        if (arr[1] == "1") {
                            pack2.cloths1.push(temp);
                        }
                        if (arr[1] == "2") {
                            pack2.cloths2.push(temp);
                        }
                        if (arr[1] == "3") {
                            pack2.cloths3.push(temp);
                        }
                        if (arr[1] == "4") {
                            pack2.cloths4.push(temp);
                        }
                    }
                    else if (arr[0] == "3") {
                        if (arr[1] == "1") {
                            pack3.cloths1.push(temp);
                        }
                        if (arr[1] == "2") {
                            pack3.cloths2.push(temp);
                        }
                        if (arr[1] == "3") {
                            pack3.cloths3.push(temp);
                        }
                        if (arr[1] == "4") {
                            pack3.cloths4.push(temp);
                        }
                    }
                    else if (arr[0] == "4") {
                        if (arr[1] == "1") {
                            pack4.cloths1.push(temp);
                        }
                        if (arr[1] == "2") {
                            pack4.cloths2.push(temp);
                        }
                        if (arr[1] == "3") {
                            pack4.cloths3.push(temp);
                        }
                        if (arr[1] == "4") {
                            pack4.cloths4.push(temp);
                        }
                    }
                }
                GameDataController.ClothPackge1 = pack1;
                GameDataController.ClothPackge2 = pack2;
                GameDataController.ClothPackge3 = pack3;
                GameDataController.ClothPackge4 = pack4;
                GameDataController._clothData.set(temp.ID, temp);
                GameDataController.ClothDataAsy[temp.ID] = temp.Price == 0 ? 0 : 1;
            });
            let firstuse = Laya.LocalStorage.getItem("firstuse");
            if (firstuse) {
                if (firstuse == "0") {
                    Laya.LocalStorage.setJSON("ClothData", GameDataController.ClothDataAsy);
                    Laya.LocalStorage.setItem("firstuse", "1");
                }
                else {
                    let Update = {};
                    let oldClothData = Laya.LocalStorage.getJSON("ClothData");
                    let newClothData = GameDataController.ClothDataAsy;
                    for (let k in newClothData) {
                        let value = GameDataController.ClothDataRefresh[k];
                        if (value != null) {
                            Update[k] = value;
                        }
                        else {
                            console.log("新ID", k);
                            Update[k] = 1;
                        }
                    }
                    Laya.LocalStorage.setJSON("ClothData", Update);
                }
            }
            else {
                Laya.LocalStorage.setJSON("ClothData", GameDataController.ClothDataAsy);
                Laya.LocalStorage.setItem("firstuse", "1");
            }
            console.log("===========》");
            console.log("_ClothData", GameDataController._ClothData);
            GameDataController._ClothData.forEach((v) => {
                if (v.GetPath1()) {
                    Laya.loader.load(v.GetPath1());
                }
            });
            EventMgr.notify("sgl1");
        }
    }

    var Task;
    (function (Task) {
        Task._taskPerpetualData = [
            {
                name: 'PK3次',
                taskType: 'PK',
                condition: 3,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
            {
                name: '观看一个视频',
                taskType: 'ads',
                condition: 1,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
            {
                name: '观看一个视频 ',
                taskType: 'ads',
                condition: 1,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
            {
                name: '观看一个视频  ',
                taskType: 'ads',
                condition: 1,
                resCondition: 0,
                rewardType: 'scratchTicket',
                rewardNum: 1,
                ticketNum: 0,
                get: 0,
            },
        ];
        Task._today = {
            get date() {
                return Laya.LocalStorage.getItem('Task_todayDate') ? Number(Laya.LocalStorage.getItem('Task_todayDate')) : null;
            },
            set date(d) {
                Laya.LocalStorage.setItem('Task_todayDate', d.toString());
            }
        };
        function getProperty(ClassName, name, property) {
            let pro = null;
            let arr = getClassArr(ClassName);
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                if (element['name'] === name) {
                    pro = element[property];
                    break;
                }
            }
            if (pro !== null) {
                return pro;
            }
            else {
                console.log(name + '找不到属性:' + property, pro);
                return null;
            }
        }
        Task.getProperty = getProperty;
        function setProperty(ClassName, name, property, value) {
            let arr = getClassArr(ClassName);
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                if (element['name'] === name) {
                    element[property] = value;
                    break;
                }
            }
            let data = {};
            data[ClassName] = arr;
            Laya.LocalStorage.setJSON(ClassName, JSON.stringify(data));
            if (Task._TaskList) {
                Task._TaskList.refresh();
            }
        }
        Task.setProperty = setProperty;
        function getClassArr(ClassName) {
            let arr = [];
            switch (ClassName) {
                case Classify.everyday:
                    arr = Task._everydayTask;
                    break;
                case Classify.perpetual:
                    arr = Task._perpetualTask;
                    break;
                default:
                    break;
            }
            return arr;
        }
        Task.getClassArr = getClassArr;
        function doDetection(calssName, name, number) {
            if (!number) {
                number = 1;
            }
            let resCondition = Task.getProperty(calssName, name, Task.Property.resCondition);
            let condition = Task.getProperty(calssName, name, Task.Property.condition);
            let num = -1;
            console.log(resCondition, condition);
            if (Task.getProperty(calssName, name, Task.Property.get) !== -1) {
                if (condition <= resCondition + number) {
                    Task.setProperty(calssName, name, Task.Property.resCondition, condition);
                    Task.setProperty(calssName, name, Task.Property.get, 1);
                    num = 1;
                }
                else {
                    Task.setProperty(calssName, name, Task.Property.resCondition, resCondition + number);
                    num = 0;
                }
            }
            if (Task._TaskList) {
                Task._TaskList.refresh();
            }
            return num;
        }
        Task.doDetection = doDetection;
        function getReward(Classify, name) {
            let data = {};
            let rewardType = getProperty(Classify, name, Property.rewardType);
            let rewardNum = getProperty(Classify, name, Property.rewardNum);
            let get = getProperty(Classify, name, Property.get);
            if (get == 1) {
                setProperty(Classify, name, Property.get, -1);
                if (Task._TaskList) {
                    Task._TaskList.refresh();
                }
                return data = {
                    rewardType: rewardType,
                    rewardNum: rewardNum,
                };
            }
            else {
                console.log('领取条件不足');
                return -1;
            }
        }
        Task.getReward = getReward;
        let Property;
        (function (Property) {
            Property["name"] = "name";
            Property["explain"] = "explain";
            Property["taskType"] = "taskType";
            Property["condition"] = "condition";
            Property["resCondition"] = "resCondition";
            Property["rewardType"] = "rewardType";
            Property["rewardNum"] = "rewardNum";
            Property["arrange"] = "arrange";
            Property["time"] = "time";
            Property["get"] = "get";
        })(Property = Task.Property || (Task.Property = {}));
        let Classify;
        (function (Classify) {
            Classify["everyday"] = "Task_Everyday";
            Classify["perpetual"] = "Task_Perpetual1";
        })(Classify = Task.Classify || (Task.Classify = {}));
        let RewardType;
        (function (RewardType) {
            RewardType["scratchTicket"] = "scratchTicket";
            RewardType["gold"] = "gold";
            RewardType["diamond"] = "diamond";
        })(RewardType = Task.RewardType || (Task.RewardType = {}));
        let EventType;
        (function (EventType) {
            EventType["getAward"] = "Task_getAward";
            EventType["adsGetAward_Every"] = "Task_adsGetAward_Every";
            EventType["useSkins"] = "Task_useSkins";
            EventType["victory"] = "Task_victory";
            EventType["watchAds"] = "Task_watchAds";
            EventType["victoryBox"] = "Task_victoryBox";
            EventType["PK"] = "Task_PK";
        })(EventType = Task.EventType || (Task.EventType = {}));
        let CompeletType;
        (function (CompeletType) {
            CompeletType["PK"] = "PK";
            CompeletType["ads"] = "ads";
            CompeletType["victory"] = "victory";
            CompeletType["useSkins"] = "useSkins";
            CompeletType["treasureBox"] = "treasureBox";
        })(CompeletType = Task.CompeletType || (Task.CompeletType = {}));
        let name;
        (function (name) {
            name["PK3\u6B21"] = "PK3\u6B21";
            name["\u89C2\u770B\u4E00\u4E2A\u89C6\u9891"] = "\u89C2\u770B\u4E00\u4E2A\u89C6\u9891";
            name["\u89C2\u770B\u4E24\u4E2A\u89C6\u9891"] = "\u89C2\u770B\u4E24\u4E2A\u89C6\u9891";
            name["\u89C2\u770B3\u4E2A\u89C6\u9891"] = "\u89C2\u770B3\u4E2A\u89C6\u9891";
        })(name = Task.name || (Task.name = {}));
        function init() {
            Task._perpetualTask = Tools.dataCompare(Tools.objArray_Copy(Task._taskPerpetualData), Classify.perpetual, Property.name);
            EventMgr.reg(EventType.PK, Task, () => {
                doDetection(Classify.perpetual, name.PK3次);
            });
        }
        Task.init = init;
        function refreshTask() {
            let data = {};
            data[Classify.perpetual] = Tools.objArray_Copy(Task._taskPerpetualData);
            Laya.LocalStorage.setJSON(Classify.perpetual, JSON.stringify(data));
            Task._TaskList.array = Task._perpetualTask = Tools.objArray_Copy(Task._taskPerpetualData);
            if (Task._TaskList) {
                Task._TaskList.refresh();
            }
        }
        Task.refreshTask = refreshTask;
        class UIabc {
        }
        Task.UIabc = UIabc;
    })(Task || (Task = {}));
    var Scratchers;
    (function (Scratchers) {
        Scratchers._scratchersArr = [];
        Scratchers._scratchersNum = {
            get num() {
                return Laya.LocalStorage.getItem('Scratchers_scratchersNum') ? Number(Laya.LocalStorage.getItem('Scratchers_scratchersNum')) : 0;
            },
            set num(number) {
                Laya.LocalStorage.setItem('Scratchers_scratchersNum', number.toString());
            }
        };
        let _RewardType;
        (function (_RewardType) {
            _RewardType["tedeng"] = "\u672A\u89E3\u9501\u9AD8\u661F\u7EA7\u8863\u670D\u4E00\u4EF6";
            _RewardType["yideng"] = "\u672A\u89E3\u9501\u5E95\u8863\u670D\u4E00\u4EF6";
            _RewardType["erdeng"] = "\u9B45\u529B\u503C10";
            _RewardType["zailai"] = "\u518D\u5F00\u4E00\u6B21";
            _RewardType["xiexie"] = "\u8C22\u8C22\u60E0\u987E";
        })(_RewardType = Scratchers._RewardType || (Scratchers._RewardType = {}));
        let _Word;
        (function (_Word) {
            _Word["tedeng"] = "tedeng";
            _Word["yideng"] = "yideng";
            _Word["erdeng"] = "erdeng";
            _Word["zailai"] = "zailai";
            _Word["xiexie"] = "xiexie";
        })(_Word = Scratchers._Word || (Scratchers._Word = {}));
        let EventType;
        (function (EventType) {
            EventType["startScratcher"] = "startScratcher";
            EventType["endScratcher"] = "endScratcher";
        })(EventType = Scratchers.EventType || (Scratchers.EventType = {}));
        function _randomReward() {
            let ran = Math.floor(Math.random() * 100);
            if (Scratchers._scratchersNum.num % 5 == 0 && Scratchers._scratchersNum.num !== 0) {
                return _Word.tedeng;
            }
            else {
                if (0 <= ran && ran < 2) {
                    return _Word.tedeng;
                }
                else if (2 <= ran && ran < 5) {
                    return _Word.yideng;
                }
                else if (5 <= ran && ran < 35) {
                    return _Word.erdeng;
                }
                else if (35 <= ran && ran < 65) {
                    return _Word.zailai;
                }
                else if (65 <= ran && ran < 100) {
                    return _Word.xiexie;
                }
                else {
                    console.log('概率计算错误');
                    return _Word.xiexie;
                }
            }
        }
        Scratchers._randomReward = _randomReward;
    })(Scratchers || (Scratchers = {}));
    class UITask extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.str = {};
        }
        onInit() {
            this.Scratchers = this.vars('Scratchers');
            this.ScratchersScrape = this.vars('ScratchersScrape');
            this.ScratchersAgainBtn = this.vars('ScratchersAgainBtn');
            this.GetReward = this.vars('GetReward');
            this.GetRewardCloseBtn = this.vars('GetRewardCloseBtn');
            this.ProbabilityBtn = this.vars('ProbabilityBtn');
            this.Probability = this.vars('Probability');
            this.GetRewardShareBtn = this.vars('GetRewardShareBtn');
            this.GetRewardADBtn = this.vars('GetRewardADBtn');
            Task._TaskList = this.vars('ShopList');
            this.Scratchers.visible = false;
            this.GetReward.visible = false;
            this.event();
            this.btnClick();
            this.Refresh();
        }
        Refresh() {
            this.datas = GameDataController.ClothPackge3.cloths1;
            this.datas.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[this.datas[i].ID];
                this.str[this.datas[i].ID] = nv;
            });
        }
        event() {
            EventMgr.reg(Task.EventType.watchAds, this, (name) => {
                Task.doDetection(Task.Classify.perpetual, name);
            });
            EventMgr.reg(Scratchers.EventType.startScratcher, this, (name) => {
                RecordManager.stopAutoRecord();
                RecordManager.startAutoRecord();
                Scratchers._scratchersNum.num++;
                Scratchers._presentReward = Scratchers._randomReward();
                Tools.node_2DShowExcludedChild(this.vars('PrizeLevel'), [Scratchers._presentReward]);
                this.Scratchers.visible = true;
                this.drawSwitch = true;
                Task.getReward(Task.Classify.perpetual, name);
            });
        }
        btnClick() {
            this.btnEv("BackBtn", () => {
                this.hide();
                EventMgr.offAll(this);
                Laya.timer.clearAll(this);
            });
            this.btnEv('refreshBtn', () => {
                ADManager.ShowReward(() => {
                    Task.refreshTask();
                });
            });
            this.btnEv('ProbabilityBtn', () => {
                this.Probability.visible = true;
            });
            this.btnEv('ProbabilityCloseBtn', () => {
                this.Probability.visible = false;
            });
            this.btnEv('ScratchersCloseBtn', this.closeScratchers);
            this.btnEv('ScratchersAgainBtn', () => {
                this.closeScratchers();
                EventMgr.notify(Scratchers.EventType.startScratcher);
            });
            this.btnEv('GetRewardCloseBtn', this.closeGetReward);
            this.btnEv('GetRewardADBtn', () => {
                ADManager.ShowReward(() => {
                    UIMgr.tip('衣服已获得！');
                    RecordManager.stopAutoRecord();
                    this.GetRewardShareBtn.visible = true;
                    this.GetRewardADBtn.visible = false;
                    if (this.rewordData) {
                        if (this.rewordData = this.datas[2]) {
                            if (GameDataController.ClothDataRefresh[this.datas[2].ID] == 1) {
                                let dataall = GameDataController.ClothDataRefresh;
                                dataall[this.datas[2].ID] = 0;
                                GameDataController.ClothDataRefresh = dataall;
                                this.Refresh();
                                Laya.LocalStorage.setJSON(this.datas[0].GetType2, this.str);
                                BagListController.Instance.refresh();
                                UIMgr.tip("恭喜获得新衣服");
                            }
                        }
                        else {
                            console.log(this.rewordData);
                            GameDataController.unlock(this.rewordData);
                        }
                    }
                });
            });
            this.btnEv('GetRewardShareBtn', () => {
                RecordManager._share(() => {
                    UIMgr.tip('分享成功！');
                    this.closeGetReward();
                });
            });
            this.scratchersClick();
        }
        closeScratchers() {
            this.Scratchers.visible = false;
            this.ScratchersAgainBtn.visible = false;
            this.drawSwitch = false;
            if (this.DrawSp) {
                Tools.node_RemoveAllChildren(this.ScratchersScrape);
                this.DrawSp = null;
                this.drawlength = null;
                this.drawFrontPos = null;
            }
        }
        openGetReward() {
            let Icon;
            var open = () => {
                this.GetReward.visible = true;
                Laya.timer.once(2000, this, () => {
                    this.GetRewardCloseBtn.visible = true;
                });
            };
            switch (Scratchers._presentReward) {
                case Scratchers._Word.tedeng:
                    Icon = this.GetReward.getChildByName('GetBox').getChildByName('Icon');
                    if (GameDataController.ClothDataRefresh[this.datas[2].ID] == 1) {
                        this.rewordData = this.datas[2];
                    }
                    else {
                        this.rewordData = GameDataController.Get_All_UnLock_HighStarCloth();
                    }
                    Icon.skin = this.rewordData.GetPath1();
                    open();
                    this.closeScratchers();
                    break;
                case Scratchers._Word.yideng:
                    Icon = this.GetReward.getChildByName('GetBox').getChildByName('Icon');
                    this.rewordData = GameDataController.Get_All_UnLock_LowStarCloth();
                    Icon.skin = this.rewordData.GetPath1();
                    this.closeScratchers();
                    open();
                    break;
                case Scratchers._Word.erdeng:
                    UIMgr.tip('增加10点魅力值');
                    this.closeScratchers();
                    this.rewordData = null;
                    GameDataController.AddCharmValue(10);
                    UIMgr.get("UIReady").CharmValueShow();
                    break;
                case Scratchers._Word.zailai:
                    this.ScratchersAgainBtn.visible = true;
                    this.rewordData = null;
                    break;
                case Scratchers._Word.xiexie:
                    UIMgr.tip('增加5点魅力值');
                    this.closeScratchers();
                    this.rewordData = null;
                    GameDataController.AddCharmValue(5);
                    UIMgr.get("UIReady").CharmValueShow();
                    break;
                default:
                    break;
            }
        }
        closeGetReward() {
            this.GetReward.visible = false;
            this.GetRewardCloseBtn.visible = false;
            this.GetRewardShareBtn.visible = false;
            this.GetRewardADBtn.visible = true;
        }
        scratchersClick() {
            this.ScratchersScrape.cacheAs = "bitmap";
            this.ScratchersScrape.on(Laya.Event.MOUSE_DOWN, this, (e) => {
                if (!this.DrawSp && this.drawSwitch) {
                    this.drawlength = 0;
                    this.DrawSp = new Laya.Image();
                    this.ScratchersScrape.addChild(this.DrawSp);
                    this.DrawSp.name = 'DrawSp';
                    this.DrawSp.pos(0, 0);
                    this.DrawSp = this.DrawSp;
                    this.DrawSp.blendMode = "destination-out";
                }
                this.drawFrontPos = this.ScratchersScrape.globalToLocal(new Laya.Point(e.stageX, e.stageY));
            });
            this.ScratchersScrape.on(Laya.Event.MOUSE_MOVE, this, (e) => {
                if (this.drawFrontPos && this.drawSwitch) {
                    let localPos = this.ScratchersScrape.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                    this.DrawSp.graphics.drawLine(this.drawFrontPos.x, this.drawFrontPos.y, localPos.x, localPos.y, "#000000", 60);
                    this.DrawSp.graphics.drawCircle(localPos.x, localPos.y, 30, "#000000");
                    this.drawlength += this.drawFrontPos.distance(localPos.x, localPos.x);
                    this.drawFrontPos = localPos;
                    if (this.drawlength > 28000) {
                        this.drawSwitch = false;
                        Laya.timer.once(1000, this, () => {
                            this.openGetReward();
                        });
                    }
                }
            });
            this.ScratchersScrape.on(Laya.Event.MOUSE_UP, this, () => {
                this.drawFrontPos = null;
            });
        }
        onShow() {
            Task._TaskList.selectEnable = true;
            Task._TaskList.vScrollBarSkin = "";
            Task._TaskList.array = Task._perpetualTask;
            Task._TaskList.selectHandler = new Laya.Handler(this, (index) => { });
            Task._TaskList.renderHandler = new Laya.Handler(this, (cell, index) => {
                let dataSource = cell.dataSource;
                let Name = cell.getChildByName('Name');
                Name.text = dataSource.name;
                let BtnGet = cell.getChildByName('BtnGet');
                if (dataSource.get == 0) {
                    BtnGet.skin = 'UITask/weiwancheng.png';
                }
                else if (dataSource.get == 1) {
                    BtnGet.skin = 'UITask/lingqu.png';
                }
                else if (dataSource.get == -1) {
                    BtnGet.skin = 'UITask/yilingqu.png';
                }
                let ProNum = cell.getChildByName('ProNum');
                ProNum.text = '(' + dataSource.resCondition + '/' + dataSource.condition + ')';
                let BtnAds = cell.getChildByName('BtnAds');
                if (dataSource.name == Task.name.PK3次) {
                    BtnAds.visible = false;
                    ProNum.x = 270;
                }
                else {
                    BtnAds.visible = true;
                    ProNum.x = 370;
                }
            });
        }
    }

    class UIPreload extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Once;
            this._fadeIn = false;
        }
        StartLoading() {
        }
        onInit() {
            new ZJADMgr();
            TJ.API.TA.log = true;
            Task.init();
            ADManager.TAPoint(TaT.PageEnter, "UIPreload");
            let cfg = new ConfigData();
            this.loading = this.vars("loading");
            Laya.timer.loop(10, this, this.onValueChange);
            setTimeout(() => {
                console.log("开始加载资源延迟5s");
                Laya.loader.create("Prefab/CoinPref.prefab");
                cfg.LoadJson();
            }, 500);
            let callBack = () => {
                GameMgr.fsm.to("Game_Ready", 0);
                ADManager.TAPoint(TaT.PageLeave, "UIPreload");
            };
            EventMgr.reg("sgl1", this, callBack);
        }
        onValueChange() {
            if (this.loading.width >= 443) {
                this.loading.width = 443;
            }
            this.loading.width += 2;
        }
        onShow() {
            EventMgr.reg(GameEvent.preloadStep, this, this.onLoadStep);
            EventMgr.reg(GameEvent.preloadCpl, this, this.onLoadCpl);
            GameMgr.readyAll();
        }
        onHide() {
            EventMgr.offCaller(this);
        }
        onLoadStep(value) {
        }
        onLoadCpl() {
            ADManager.initShare();
        }
    }

    var lwg;
    (function (lwg) {
        let TimerAdmin;
        (function (TimerAdmin) {
            function _frameLoop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                Laya.timer.frameLoop(delay, caller, () => {
                    method();
                }, args, coverBefore);
            }
            TimerAdmin._frameLoop = _frameLoop;
            function _frameRandomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                var func = () => {
                    let delay = Tools.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        method();
                        func();
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameRandomLoop = _frameRandomLoop;
            function _frameNumLoop(delay, num, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                let num0 = 0;
                Laya.timer.frameLoop(delay, caller, () => {
                    num0++;
                    if (num0 > num) {
                        Laya.timer.clearAll(caller);
                    }
                    else {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._frameNumLoop = _frameNumLoop;
            function _frameOnce(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                Laya.timer.frameOnce(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._frameOnce = _frameOnce;
            function _loop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                Laya.timer.loop(delay, caller, () => {
                    method();
                }, args, coverBefore);
            }
            TimerAdmin._loop = _loop;
            function _randomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                var func = () => {
                    let delay = Tools.randomOneInt(delay1, delay2);
                    Laya.timer.once(delay, caller, () => {
                        method();
                        func();
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._randomLoop = _randomLoop;
            function _numLoop(delay, num, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                let num0 = 0;
                Laya.timer.loop(delay, caller, () => {
                    num0++;
                    if (num0 >= num) {
                        Laya.timer.clearAll(caller);
                    }
                    else {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._numLoop = _numLoop;
            function _once(delay, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                let caller = {};
                Laya.timer.once(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._once = _once;
        })(TimerAdmin = lwg.TimerAdmin || (lwg.TimerAdmin = {}));
        let Color;
        (function (Color) {
            function RGBtoHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            Color.RGBtoHexString = RGBtoHexString;
            function _colour(node, RGBA, vanishtime) {
                let cf = new Laya.ColorFilter();
                node.blendMode = 'null';
                if (!RGBA) {
                    cf.color(255, 0, 0, 1);
                }
                else {
                    cf.color(RGBA[0], RGBA[1], RGBA[2], RGBA[3]);
                }
                node.filters = [cf];
                if (vanishtime) {
                    Laya.timer.once(vanishtime, this, () => {
                        for (let index = 0; index < node.filters.length; index++) {
                            if (node.filters[index] == cf) {
                                node.filters = [];
                                break;
                            }
                        }
                    });
                }
                return cf;
            }
            Color._colour = _colour;
            function _changeOnce(node, RGBA, time, func) {
                if (!node) {
                    return;
                }
                let cf = new Laya.ColorFilter();
                cf.color(0, 0, 0, 0);
                let speedR = RGBA[0] / time;
                let speedG = RGBA[1] / time;
                let speedB = RGBA[2] / time;
                let speedA = 0;
                if (RGBA[3]) {
                    speedA = RGBA[3] / time;
                }
                let caller = {
                    add: true,
                };
                let R = 0, G = 0, B = 0, A = 0;
                TimerAdmin._frameLoop(1, caller, () => {
                    if (R < RGBA[0] && caller.add) {
                        R += speedR;
                        G += speedG;
                        B += speedB;
                        if (speedA !== 0)
                            A += speedA;
                        if (R >= RGBA[0]) {
                            caller.add = false;
                        }
                    }
                    else {
                        R -= speedR;
                        G -= speedG;
                        B -= speedB;
                        if (speedA !== 0)
                            A -= speedA;
                        if (R <= 0) {
                            if (func) {
                                func();
                            }
                            Laya.timer.clearAll(caller);
                        }
                    }
                    cf.color(R, G, B, A);
                    node.filters = [cf];
                });
            }
            Color._changeOnce = _changeOnce;
            function _changeConstant(node, RGBA1, RGBA2, time) {
                let cf;
                let RGBA0 = [];
                if (!node.filters) {
                    cf = new Laya.ColorFilter();
                    cf.color(RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1);
                    RGBA0 = [RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1];
                    node.filters = [cf];
                }
                else {
                    cf = node.filters[0];
                    RGBA0 = [node.filters[0]['_alpha'][0], node.filters[0]['_alpha'][1], node.filters[0]['_alpha'][2], node.filters[0]['_alpha'][3] ? node.filters[0]['_alpha'][3] : 1];
                }
                let RGBA = [Tools.randomCountNumer(RGBA1[0], RGBA2[0])[0], Tools.randomCountNumer(RGBA1[1], RGBA2[1])[0], Tools.randomCountNumer(RGBA1[2], RGBA2[2])[0], Tools.randomCountNumer(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
                let speedR = (RGBA[0] - RGBA0[0]) / time;
                let speedG = (RGBA[1] - RGBA0[1]) / time;
                let speedB = (RGBA[2] - RGBA0[2]) / time;
                let speedA = 0;
                if (RGBA[3]) {
                    speedA = (RGBA[3] - RGBA0[3]) / time;
                }
                let caller = {};
                let time0 = 0;
                TimerAdmin._frameLoop(1, caller, () => {
                    time0++;
                    if (time0 <= time) {
                        RGBA0[0] += speedR;
                        RGBA0[1] += speedG;
                        RGBA0[2] += speedB;
                    }
                    else {
                        Laya.timer.clearAll(caller);
                    }
                    cf.color(RGBA0[0], RGBA0[1], RGBA0[2], RGBA0[3]);
                    node.filters = [cf];
                });
            }
            Color._changeConstant = _changeConstant;
        })(Color = lwg.Color || (lwg.Color = {}));
        let Effects;
        (function (Effects) {
            let _SkinUrl;
            (function (_SkinUrl) {
                _SkinUrl["\u7231\u5FC31"] = "Frame/Effects/aixin1.png";
                _SkinUrl["\u7231\u5FC32"] = "Frame/Effects/aixin2.png";
                _SkinUrl["\u7231\u5FC33"] = "Frame/Effects/aixin3.png";
                _SkinUrl["\u82B11"] = "Frame/Effects/hua1.png";
                _SkinUrl["\u82B12"] = "Frame/Effects/hua2.png";
                _SkinUrl["\u82B13"] = "Frame/Effects/hua3.png";
                _SkinUrl["\u82B14"] = "Frame/Effects/hua4.png";
                _SkinUrl["\u661F\u661F1"] = "Frame/Effects/star1.png";
                _SkinUrl["\u661F\u661F2"] = "Frame/Effects/star2.png";
                _SkinUrl["\u661F\u661F3"] = "Frame/Effects/star3.png";
                _SkinUrl["\u661F\u661F4"] = "Frame/Effects/star4.png";
                _SkinUrl["\u661F\u661F5"] = "Frame/Effects/star5.png";
                _SkinUrl["\u661F\u661F6"] = "Frame/Effects/star6.png";
                _SkinUrl["\u661F\u661F7"] = "Frame/Effects/star7.png";
                _SkinUrl["\u96EA\u82B11"] = "Frame/Effects/xuehua1.png";
                _SkinUrl["\u53F6\u5B501"] = "Frame/Effects/yezi1.png";
                _SkinUrl["\u5706\u5F62\u53D1\u51491"] = "Frame/Effects/yuanfaguang.png";
                _SkinUrl["\u5706\u5F621"] = "Frame/Effects/yuan1.png";
                _SkinUrl["\u5149\u57081"] = "Frame/Effects/guangquan1.png";
                _SkinUrl["\u5149\u57082"] = "Frame/Effects/guangquan2.png";
            })(_SkinUrl = Effects._SkinUrl || (Effects._SkinUrl = {}));
            let _Aperture;
            (function (_Aperture) {
                class _ApertureImage extends Laya.Image {
                    constructor(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOder) {
                        super();
                        parent.addChild(this);
                        centerPoint ? this.pos(centerPoint.x, centerPoint.y) : this.pos(0, 0);
                        this.width = width ? width : 100;
                        this.height = height ? height : 100;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.rotation = rotation ? Tools.randomOneNumber(rotation[0], rotation[1]) : Tools.randomOneNumber(360);
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.花3;
                        this.zOrder = zOder ? zOder : 0;
                        this.alpha = 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                    }
                }
                _Aperture._ApertureImage = _ApertureImage;
                function _continuous(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOder, scale, speed, accelerated) {
                    let Img = new _ApertureImage(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOder);
                    let _speed = speed ? Tools.randomOneNumber(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : 0.0005;
                    let _scale = scale ? Tools.randomOneNumber(scale[0], scale[1]) : 2;
                    let moveCaller = {
                        alpha: true,
                        scale: false,
                        vanish: false
                    };
                    Img['moveCaller'] = moveCaller;
                    let acc = 0;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            Img.alpha += 0.05;
                            acc = 0;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.scale = true;
                            }
                        }
                        else if (moveCaller.scale) {
                            acc += _accelerated;
                            if (Img.scaleX > _scale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        else if (moveCaller.vanish) {
                            acc -= _accelerated;
                            if (acc < 0) {
                                Img.alpha -= 0.015;
                                if (Img.alpha <= 0) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                            }
                        }
                        Img.scaleX = Img.scaleY += (_speed + acc);
                    });
                }
                _Aperture._continuous = _continuous;
            })(_Aperture = Effects._Aperture || (Effects._Aperture = {}));
            let _Particle;
            (function (_Particle) {
                class _ParticleImgBase extends Laya.Image {
                    constructor(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOder) {
                        super();
                        parent.addChild(this);
                        let sectionWidth = sectionWH ? Tools.randomOneNumber(sectionWH[0]) : Tools.randomOneNumber(200);
                        let sectionHeight = sectionWH ? Tools.randomOneNumber(sectionWH[1]) : Tools.randomOneNumber(50);
                        sectionWidth = Tools.randomOneHalf() == 0 ? sectionWidth : -sectionWidth;
                        sectionHeight = Tools.randomOneHalf() == 0 ? sectionHeight : -sectionHeight;
                        this.x = centerPoint ? centerPoint.x + sectionWidth : sectionWidth;
                        this.y = centerPoint ? centerPoint.y + sectionHeight : sectionHeight;
                        width = width ? width : [25, 50];
                        this.width = Tools.randomOneNumber(width[0], width[1]);
                        this.height = height ? Tools.randomOneNumber(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.圆形1;
                        this.rotation = rotation ? Tools.randomOneNumber(rotation[0], rotation[1]) : 0;
                        this.alpha = 0;
                        this.zOrder = zOder ? zOder : 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                    }
                }
                _Particle._ParticleImgBase = _ParticleImgBase;
                function _fallingVertical(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOder);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(4, 8);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance0 = 0;
                    let distance1 = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(100, 300);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.05;
                            distance0 = Img.y++;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 < distance1 && moveCaller.move) {
                            acc += accelerated0;
                            distance0 = Img.y += (speed0 + acc);
                            if (distance0 >= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            acc -= accelerated0 / 2;
                            Img.alpha -= 0.03;
                            Img.y += (speed0 + acc);
                            if (Img.alpha <= 0 || (speed0 + acc) <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingVertical = _fallingVertical;
                function _slowlyUp(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOder);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(1.5, 2);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.001, 0.005);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let fy = Img.y;
                    let distance0 = 0;
                    let distance1 = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(-250, -600);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.03;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 > distance1 && moveCaller.move) {
                        }
                        else {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.02;
                            Img.scaleX -= 0.005;
                            Img.scaleY -= 0.005;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        acc += accelerated0;
                        Img.y -= (speed0 + acc);
                        distance0 = fy - Img.y;
                    });
                    return Img;
                }
                _Particle._slowlyUp = _slowlyUp;
                function _spray(parent, centerPoint, width, height, rotation, angle, urlArr, colorRGBA, zOder, distance, rotationSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(3, 10);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let distance1 = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(100, 200);
                    let angle0 = angle ? Tools.randomOneNumber(angle[0], angle[1]) : Tools.randomOneNumber(0, 360);
                    let rotationSpeed0 = rotationSpeed ? Tools.randomOneNumber(rotationSpeed[0], rotationSpeed[1]) : Tools.randomOneNumber(0, 20);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else {
                            if (radius < distance1 && moveCaller.move) {
                            }
                            else {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                            if (moveCaller.vinish) {
                                Img.alpha -= 0.05;
                                if (Img.alpha <= 0.3) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                            }
                            acc += accelerated0;
                            radius += speed0 + acc;
                            let point = Tools.point_GetRoundPos(angle0, radius, centerPoint0);
                            Img.pos(point.x, point.y);
                        }
                    });
                    return Img;
                }
                _Particle._spray = _spray;
                function _moveToTargetToMove(parent, centerPoint, width, height, rotation, angle, urlArr, colorRGBA, zOder, distance1, distance2, rotationSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(5, 6);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move1: false,
                        stop: false,
                        move2: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let dis1 = distance1 ? Tools.randomOneNumber(distance1[0], distance1[1]) : Tools.randomOneNumber(100, 200);
                    let dis2 = distance2 ? Tools.randomOneNumber(distance2[0], distance2[1]) : Tools.randomOneNumber(100, 200);
                    let angle0 = angle ? Tools.randomOneNumber(angle[0], angle[1]) : Tools.randomOneNumber(0, 360);
                    Img.rotation = angle0 - 90;
                    let rotationSpeed0 = rotationSpeed ? Tools.randomOneNumber(rotationSpeed[0], rotationSpeed[1]) : Tools.randomOneNumber(0, 20);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move1 = true;
                            }
                        }
                        else if (moveCaller.move1) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            if (radius >= dis1) {
                                moveCaller.move1 = false;
                                moveCaller.stop = true;
                            }
                        }
                        else if (moveCaller.stop) {
                            acc -= 0.3;
                            radius += 0.1;
                            if (acc <= 0) {
                                moveCaller.stop = false;
                                moveCaller.move2 = true;
                            }
                        }
                        else if (moveCaller.move2) {
                            acc += accelerated0 / 2;
                            radius += speed0 + acc;
                            if (radius >= dis1 + dis2) {
                                moveCaller.move2 = false;
                                moveCaller.vinish = true;
                            }
                        }
                        else if (moveCaller.vinish) {
                            radius += 0.5;
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        let point = Tools.point_GetRoundPos(angle0, radius, centerPoint0);
                        Img.pos(point.x, point.y);
                    });
                    return Img;
                }
                _Particle._moveToTargetToMove = _moveToTargetToMove;
                function _AnnularInhalation(parent, centerPoint, radius, rotation, width, height, urlArr, speed, accelerated, zOder) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    width = width ? width : [25, 50];
                    Img.width = Tools.randomCountNumer(width[0], width[1])[0];
                    Img.height = height ? Tools.randomCountNumer(height[0], height[1])[0] : Img.width;
                    Img.pivotX = Img.width / 2;
                    Img.pivotY = Img.height / 2;
                    Img.skin = urlArr ? Tools.arrayRandomGetOut(urlArr)[0] : _SkinUrl[Tools.randomCountNumer(0, 12)[0]];
                    let radius0 = Tools.randomCountNumer(radius[0], radius[1])[0];
                    Img.alpha = 0;
                    let speed0 = speed ? Tools.randomCountNumer(speed[0], speed[1])[0] : Tools.randomCountNumer(5, 10)[0];
                    let angle = rotation ? Tools.randomCountNumer(rotation[0], rotation[1])[0] : Tools.randomCountNumer(0, 360)[0];
                    let caller = {};
                    let acc = 0;
                    accelerated = accelerated ? accelerated : 0.35;
                    TimerAdmin._frameLoop(1, caller, () => {
                        if (Img.alpha < 1) {
                            Img.alpha += 0.05;
                            acc += (accelerated / 5);
                            radius0 -= (speed0 / 2 + acc);
                        }
                        else {
                            acc += accelerated;
                            radius0 -= (speed0 + acc);
                        }
                        let point = Tools.point_GetRoundPos(angle, radius0, centerPoint);
                        Img.pos(point.x, point.y);
                        if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                            Img.removeSelf();
                            Laya.timer.clearAll(caller);
                        }
                    });
                    return Img;
                }
                _Particle._AnnularInhalation = _AnnularInhalation;
            })(_Particle = Effects._Particle || (Effects._Particle = {}));
            let _Glitter;
            (function (_Glitter) {
                class _GlitterImage extends Laya.Image {
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height) {
                        super();
                        parent.addChild(this);
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.星星1;
                        this.width = width ? Tools.randomOneNumber(width[0], width[1]) : 80;
                        this.height = height ? Tools.randomOneNumber(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let p = radiusXY ? Tools.point_RandomPointByCenter(centerPos, radiusXY[0], radiusXY[1], 1) : Tools.point_RandomPointByCenter(centerPos, 100, 100, 1);
                        this.pos(p[0].x, p[0].y);
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                        this.alpha = 0;
                    }
                }
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height);
                    Img.scaleX = 0;
                    Img.scaleY = 0;
                    let _scale = scale ? Tools.randomOneNumber(scale[0], scale[1]) : Tools.randomOneNumber(0.8, 1.2);
                    let _speed = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(0.01, 0.02);
                    let _rotateSpeed = rotateSpeed ? Tools.randomOneInt(rotateSpeed[0], rotateSpeed[1]) : Tools.randomOneInt(0, 5);
                    _rotateSpeed = Tools.randomOneHalf() == 0 ? -_rotateSpeed : _rotateSpeed;
                    let moveCaller = {
                        appear: true,
                        scale: false,
                        vanish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    var ani = () => {
                        if (moveCaller.appear) {
                            Img.alpha += 0.1;
                            Img.rotation += _rotateSpeed;
                            Img.scaleX = Img.scaleY += _speed;
                            if (Img.alpha >= 1) {
                                moveCaller.appear = false;
                                moveCaller.scale = true;
                            }
                        }
                        else if (moveCaller.scale) {
                            Img.rotation += _rotateSpeed;
                            Img.scaleX = Img.scaleY += _speed;
                            if (Img.scaleX > _scale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        else if (moveCaller.vanish) {
                            Img.rotation -= _rotateSpeed;
                            Img.alpha -= 0.015;
                            Img.scaleX -= 0.01;
                            Img.scaleY -= 0.01;
                            if (Img.scaleX <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, moveCaller, ani);
                    return Img;
                }
                _Glitter._blinkStar = _blinkStar;
                function _simpleInfinite(parent, x, y, width, height, zOder, url, speed) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    Img.pos(x, y);
                    Img.width = width;
                    Img.height = height;
                    Img.pivotX = width / 2;
                    Img.pivotY = height / 2;
                    Img.skin = url ? url : _SkinUrl.光圈1;
                    Img.alpha = 0;
                    Img.zOrder = zOder ? zOder : 0;
                    let add = true;
                    let caller = {};
                    let func = () => {
                        if (!add) {
                            Img.alpha -= speed ? speed : 0.01;
                            if (Img.alpha <= 0) {
                                if (caller['end']) {
                                    Laya.timer.clearAll(caller);
                                    Img.removeSelf();
                                }
                                else {
                                    add = true;
                                }
                            }
                        }
                        else {
                            Img.alpha += speed ? speed * 2 : 0.01 * 2;
                            if (Img.alpha >= 1) {
                                add = false;
                                caller['end'] = true;
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, caller, func);
                    return Img;
                }
                _Glitter._simpleInfinite = _simpleInfinite;
            })(_Glitter = Effects._Glitter || (Effects._Glitter = {}));
            let _circulation;
            (function (_circulation) {
                class _circulationImage extends Laya.Image {
                    constructor(parent, urlArr, colorRGBA, width, height, zOder) {
                        super();
                        parent.addChild(this);
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.圆形发光1;
                        this.width = width ? Tools.randomOneNumber(width[0], width[1]) : 80;
                        this.height = height ? Tools.randomOneNumber(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                        this.zOrder = zOder ? zOder : 0;
                        this.alpha = 0;
                        this.scaleX = 0;
                        this.scaleY = 0;
                    }
                }
                _circulation._circulationImage = _circulationImage;
                function _corner(parent, posArray, urlArr, colorRGBA, width, height, zOder, speed) {
                    if (posArray.length <= 1) {
                        return;
                    }
                    let Img = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOder);
                    Img.pos(posArray[0][0], posArray[0][1]);
                    Img.alpha = 1;
                    let moveCaller = {
                        num: 0,
                    };
                    Img['moveCaller'] = moveCaller;
                    let _speed = speed ? speed : 10;
                    let index = 0;
                    Img.scale(1, 1);
                    var func = () => {
                        let targetXY = [posArray[index][0], posArray[index][1]];
                        let distance = (new Laya.Point()).distance(targetXY[0], targetXY[1]);
                        let time = distance / _speed * 100;
                        if (index == posArray.length + 1) {
                            targetXY = [posArray[0][0], posArray[0][1]];
                        }
                        Animation2D.move_Simple(Img, Img.x, Img.y, targetXY[0], targetXY[1], time, 0, () => {
                            index++;
                            if (index == posArray.length) {
                                index = 0;
                            }
                            func();
                        });
                    };
                    func();
                }
                _circulation._corner = _corner;
            })(_circulation = Effects._circulation || (Effects._circulation = {}));
        })(Effects = lwg.Effects || (lwg.Effects = {}));
        let Animation2D;
        (function (Animation2D) {
            function simple_Rotate(node, Frotate, Erotate, time, delayed, func) {
                node.rotation = Frotate;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.simple_Rotate = simple_Rotate;
            function upDown_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null || func !== undefined) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation2D.upDown_Overturn = upDown_Overturn;
            function leftRight_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                            }), 0);
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation2D.leftRight_Overturn = leftRight_Overturn;
            function upDwon_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation2D.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func, stageClick) {
                node.alpha = alpha1;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.fadeOut_KickBack = fadeOut_KickBack;
            function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.move_FadeOut = move_FadeOut;
            function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 1;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.move_Fade_Out = move_Fade_Out;
            function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.targetX = 0;
                node.targetY = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.move_FadeOut_Scale_01 = move_FadeOut_Scale_01;
            function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed, ease, func) {
                node.scaleX = fScale;
                node.scaleY = fScale;
                node.x = fX;
                node.y = fY;
                Laya.Tween.to(node, { x: tX, y: tY, scaleX: eScale, scaleY: eScale }, time, ease ? null : ease, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move_Scale = move_Scale;
            function rotate_Scale(target, fRotate, fScaleX, fScaleY, eRotate, eScaleX, eScaleY, time, delayed, func) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                target.rotation = fRotate;
                Laya.Tween.to(target, { rotation: eRotate, scaleX: eScaleX, scaleY: eScaleY }, time, null, Laya.Handler.create(this, () => {
                    if (func) {
                        func();
                    }
                    target.rotation = 0;
                }), delayed ? delayed : 0);
            }
            Animation2D.rotate_Scale = rotate_Scale;
            function drop_Simple(node, fY, tY, rotation, time, delayed, func) {
                node.y = fY;
                Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.drop_Simple = drop_Simple;
            function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func) {
                target.alpha = fAlpha;
                target.y = firstY;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(target, { alpha: 1, y: targetY + extendY }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: targetY - extendY / 2 }, time1 / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { y: targetY }, time1 / 4, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Tools.node_2DChildrenVisible(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                            Tools.node_2DChildrenVisible(node, true);
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.cardRotateX_TowFace = cardRotateX_TowFace;
            function cardRotateX_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2 !== null) {
                            func2();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Tools.node_2DChildrenVisible(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                                Tools.node_2DChildrenVisible(node, true);
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.cardRotateY_TowFace = cardRotateY_TowFace;
            function cardRotateY_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2) {
                            func2();
                        }
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Animation2D.cardRotateY_OneFace = cardRotateY_OneFace;
            function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func) {
                let targetPerX = targetX * per + node.x * (1 - per);
                let targetPerY = targetY * per + node.y * (1 - per);
                Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }
            Animation2D.move_changeRotate = move_changeRotate;
            function bomb_LeftRight(node, MaxScale, time, func, delayed) {
                Laya.Tween.to(node, { scaleX: MaxScale }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0.85 }, time * 0.5, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: MaxScale * 0.9 }, time * 0.55, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 0.95 }, time * 0.6, null, Laya.Handler.create(this, function () {
                                Laya.Tween.to(node, { scaleX: 1 }, time * 0.65, null, Laya.Handler.create(this, function () {
                                    if (func)
                                        func();
                                }), 0);
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.bomb_LeftRight = bomb_LeftRight;
            function bombs_Appear(node, firstAlpha, endScale, scale1, rotation1, time1, time2, delayed, func) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, rotation: rotation1 }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: endScale + (scale1 - endScale) * 0.2, scaleY: endScale + (scale1 - endScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Animation2D.bombs_Appear = bombs_Appear;
            function bombs_AppearAllChild(node, firstAlpha, endScale, scale1, rotation1, time1, time2, interval, func, audioType) {
                let de1 = 0;
                if (!interval) {
                    interval = 100;
                }
                for (let index = 0; index < node.numChildren; index++) {
                    let Child = node.getChildAt(index);
                    Child.alpha = 0;
                    Laya.timer.once(de1, this, () => {
                        Child.alpha = 1;
                        if (index !== node.numChildren - 1) {
                            func == null;
                        }
                        bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, time2, null, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_AppearAllChild = bombs_AppearAllChild;
            function bombs_VanishAllChild(node, endScale, alpha, rotation, time, interval, func) {
                let de1 = 0;
                if (!interval) {
                    interval = 100;
                }
                for (let index = 0; index < node.numChildren; index++) {
                    let Child = node.getChildAt(index);
                    Laya.timer.once(de1, this, () => {
                        if (index !== node.numChildren - 1) {
                            func == null;
                        }
                        bombs_Vanish(node, endScale, alpha, rotation, time, 0, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_VanishAllChild = bombs_VanishAllChild;
            function bombs_Vanish(node, scale, alpha, rotation, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.bombs_Vanish = bombs_Vanish;
            function swell_shrink(node, firstScale, scale1, time, delayed, func) {
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.swell_shrink = swell_shrink;
            function move_Simple(node, fX, fY, targetX, targetY, time, delayed, func, ease) {
                node.x = fX;
                node.y = fY;
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move_Simple = move_Simple;
            function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.rotation = firstR;
                Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.move_Deform_X = move_Deform_X;
            function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func) {
                target.alpha = 0;
                if (firstY) {
                    target.y = firstY;
                }
                target.rotation = firstR;
                Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.move_Deform_Y = move_Deform_Y;
            function blink_FadeOut_v(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.blink_FadeOut_v = blink_FadeOut_v;
            function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.blink_FadeOut = blink_FadeOut;
            function shookHead_Simple(target, rotate, time, delayed, func) {
                let firstR = target.rotation;
                Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: firstR - rotate * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(target, { rotation: firstR }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Animation2D.shookHead_Simple = shookHead_Simple;
            function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
                target.alpha = 0;
                Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation2D.HintAni_01 = HintAni_01;
            function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed, func, ease) {
                if (!delayed) {
                    delayed = 0;
                }
                if (!delayed) {
                    ease = null;
                }
                target.alpha = fAlpha;
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, ease, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.scale_Alpha = scale_Alpha;
            function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func) {
                node.alpha = 0;
                node.scaleX = 0;
                node.scaleY = 0;
                Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                                node.rotation = 0;
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), delayed2);
                    }), 0);
                }), delayed1);
            }
            Animation2D.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Animation2D = lwg.Animation2D || (lwg.Animation2D = {}));
        let Tools;
        (function (Tools) {
            function color_RGBtoHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            Tools.color_RGBtoHexString = color_RGBtoHexString;
            function format_FormatNumber(number) {
                if (typeof (number) !== "number") {
                    console.warn("要转化的数字并不为number");
                    return number;
                }
                let backNum;
                if (number < 1000) {
                    backNum = "" + number;
                }
                else if (number < 1000000) {
                    backNum = "" + (number / 1000).toFixed(1) + "k";
                }
                else if (number < 10e8) {
                    backNum = "" + (number / 1000000).toFixed(1) + "m";
                }
                else {
                    backNum = "" + number;
                }
                return backNum;
            }
            Tools.format_FormatNumber = format_FormatNumber;
            function format_StrAddNum(str, num) {
                return (Number(str) + num).toString();
            }
            Tools.format_StrAddNum = format_StrAddNum;
            function format_NumAddStr(num, str) {
                return Number(str) + num;
            }
            Tools.format_NumAddStr = format_NumAddStr;
            function node_GetChildArrByProperty(node, property, value) {
                let childArr = [];
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index);
                    if (element[property] == value) {
                        childArr.push(element);
                    }
                }
                return childArr;
            }
            Tools.node_GetChildArrByProperty = node_GetChildArrByProperty;
            function node_RandomChildren(node, num) {
                let childArr = [];
                let indexArr = [];
                for (let i = 0; i < node.numChildren; i++) {
                    indexArr.push(i);
                }
                let randomIndex = Tools.arrayRandomGetOut(indexArr, num);
                for (let j = 0; j < randomIndex.length; j++) {
                    childArr.push(node.getChildAt(randomIndex[j]));
                }
                return childArr;
            }
            Tools.node_RandomChildren = node_RandomChildren;
            function node_RemoveAllChildren(node) {
                if (node.numChildren > 0) {
                    node.removeChildren(0, node.numChildren - 1);
                }
            }
            Tools.node_RemoveAllChildren = node_RemoveAllChildren;
            function node_2DShowExcludedChild(node, childNameArr, bool) {
                for (let i = 0; i < node.numChildren; i++) {
                    let Child = node.getChildAt(i);
                    for (let j = 0; j < childNameArr.length; j++) {
                        if (Child.name == childNameArr[j]) {
                            if (bool || bool == undefined) {
                                Child.visible = true;
                            }
                            else {
                                Child.visible = false;
                            }
                        }
                        else {
                            if (bool || bool == undefined) {
                                Child.visible = false;
                            }
                            else {
                                Child.visible = true;
                            }
                        }
                    }
                }
            }
            Tools.node_2DShowExcludedChild = node_2DShowExcludedChild;
            function node_3DShowExcludedChild(node, childNameArr, bool) {
                for (let i = 0; i < node.numChildren; i++) {
                    let Child = node.getChildAt(i);
                    for (let j = 0; j < childNameArr.length; j++) {
                        if (Child.name == childNameArr[j]) {
                            if (bool || bool == undefined) {
                                Child.active = true;
                            }
                            else {
                                Child.active = false;
                            }
                        }
                        else {
                            if (bool || bool == undefined) {
                                Child.active = false;
                            }
                            else {
                                Child.active = true;
                            }
                        }
                    }
                }
            }
            Tools.node_3DShowExcludedChild = node_3DShowExcludedChild;
            function node_2DChildrenVisible(node, bool) {
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index);
                    if (bool) {
                        element.visible = true;
                    }
                    else {
                        element.visible = false;
                    }
                }
            }
            Tools.node_2DChildrenVisible = node_2DChildrenVisible;
            function node_3DChildrenVisible(node, bool) {
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index);
                    if (bool) {
                        element.active = true;
                    }
                    else {
                        element.active = false;
                    }
                }
            }
            Tools.node_3DChildrenVisible = node_3DChildrenVisible;
            function node_3dFindChild(parent, name) {
                var item = null;
                item = parent.getChildByName(name);
                if (item != null)
                    return item;
                var go = null;
                for (var i = 0; i < parent.numChildren; i++) {
                    go = node_3dFindChild(parent.getChildAt(i), name);
                    if (go != null)
                        return go;
                }
                return null;
            }
            Tools.node_3dFindChild = node_3dFindChild;
            function node_2dFindChild(parent, name) {
                var item = null;
                item = parent.getChildByName(name);
                if (item != null)
                    return item;
                var go = null;
                for (var i = 0; i < parent.numChildren; i++) {
                    go = node_2dFindChild(parent.getChildAt(i), name);
                    if (go != null)
                        return go;
                }
                return null;
            }
            Tools.node_2dFindChild = node_2dFindChild;
            function randomOneHalf() {
                let number;
                number = Math.floor(Math.random() * 2);
                return number;
            }
            Tools.randomOneHalf = randomOneHalf;
            function randomOneInt(section1, section2) {
                if (section2) {
                    return Math.floor(Math.random() * (section2 - section1)) + section1;
                }
                else {
                    return Math.floor(Math.random() * section1);
                }
            }
            Tools.randomOneInt = randomOneInt;
            function randomCountNumer(section1, section2, count, intSet) {
                let arr = [];
                if (!count) {
                    count = 1;
                }
                if (section2) {
                    while (count > arr.length) {
                        let num;
                        if (intSet || intSet == undefined) {
                            num = Math.floor(Math.random() * (section2 - section1)) + section1;
                        }
                        else {
                            num = Math.random() * (section2 - section1) + section1;
                        }
                        arr.push(num);
                        Tools.arrayUnique_01(arr);
                    }
                    ;
                    return arr;
                }
                else {
                    while (count > arr.length) {
                        let num;
                        if (intSet || intSet == undefined) {
                            num = Math.floor(Math.random() * section1);
                        }
                        else {
                            num = Math.random() * section1;
                        }
                        arr.push(num);
                        Tools.arrayUnique_01(arr);
                    }
                    return arr;
                }
            }
            Tools.randomCountNumer = randomCountNumer;
            function randomOneNumber(section1, section2, intSet) {
                let chage;
                if (section1 > section2) {
                    chage = section1;
                    section1 = section2;
                    section2 = chage;
                }
                if (section2) {
                    let num;
                    if (intSet) {
                        num = Math.floor(Math.random() * (section2 - section1)) + section1;
                    }
                    else {
                        num = Math.random() * (section2 - section1) + section1;
                    }
                    return num;
                }
                else {
                    let num;
                    if (intSet) {
                        num = Math.floor(Math.random() * section1);
                    }
                    else {
                        num = Math.random() * section1;
                    }
                    return num;
                }
            }
            Tools.randomOneNumber = randomOneNumber;
            function d2_twoObjectsLen(obj1, obj2) {
                let point = new Laya.Point(obj1.x, obj1.y);
                let len = point.distance(obj2.x, obj2.y);
                return len;
            }
            Tools.d2_twoObjectsLen = d2_twoObjectsLen;
            function d2_Vector_Angle(x, y) {
                let radian = Math.atan2(x, y);
                let angle = 90 - radian * (180 / Math.PI);
                if (angle <= 0) {
                    angle = 270 + (90 + angle);
                }
                return angle - 90;
            }
            Tools.d2_Vector_Angle = d2_Vector_Angle;
            ;
            function d2_angle_Vector(angle) {
                angle -= 90;
                let radian = (90 - angle) / (180 / Math.PI);
                let p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                p.normalize();
                return p;
            }
            Tools.d2_angle_Vector = d2_angle_Vector;
            ;
            function d3_twoObjectsLen(obj1, obj2) {
                let obj1V3 = obj1.transform.position;
                let obj2V3 = obj2.transform.position;
                let p = new Laya.Vector3();
                Laya.Vector3.subtract(obj1V3, obj2V3, p);
                let lenp = Laya.Vector3.scalarLength(p);
                return lenp;
            }
            Tools.d3_twoObjectsLen = d3_twoObjectsLen;
            function d3_twoPositionLen(v1, v2) {
                let p = d3_twoSubV3(v1, v2);
                let lenp = Laya.Vector3.scalarLength(p);
                return lenp;
            }
            Tools.d3_twoPositionLen = d3_twoPositionLen;
            function d3_twoSubV3(V3_01, V3_02, normalizing) {
                let p = new Laya.Vector3();
                Laya.Vector3.subtract(V3_01, V3_02, p);
                if (normalizing) {
                    let p1 = new Laya.Vector3();
                    Laya.Vector3.normalize(p, p1);
                    return p1;
                }
                else {
                    return p;
                }
            }
            Tools.d3_twoSubV3 = d3_twoSubV3;
            function d3_maximumDistanceLimi(originV3, obj, length) {
                let subP = new Laya.Vector3();
                let objP = obj.transform.position;
                Laya.Vector3.subtract(objP, originV3, subP);
                let lenP = Laya.Vector3.scalarLength(subP);
                if (lenP >= length) {
                    let normalizP = new Laya.Vector3();
                    Laya.Vector3.normalize(subP, normalizP);
                    let x = originV3.x + normalizP.x * length;
                    let y = originV3.y + normalizP.y * length;
                    let z = originV3.z + normalizP.z * length;
                    let p = new Laya.Vector3(x, y, z);
                    obj.transform.position = p;
                    return p;
                }
            }
            Tools.d3_maximumDistanceLimi = d3_maximumDistanceLimi;
            function d3_rayScanning(camera, scene3D, vector2, filtrateName) {
                let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                let outs = new Array();
                camera.viewportPointToRay(vector2, _ray);
                scene3D.physicsSimulation.rayCastAll(_ray, outs);
                if (outs.length != 0 && filtrateName) {
                    let outsChaild = null;
                    for (var i = 0; i < outs.length; i++) {
                        let hitResult = outs[i].collider.owner;
                        if (hitResult.name === filtrateName) {
                            outsChaild = outs[i];
                        }
                    }
                    return outsChaild;
                }
                else {
                    return outs;
                }
            }
            Tools.d3_rayScanning = d3_rayScanning;
            function d3_TransitionScreenPointfor(v3, camera) {
                let ScreenV4 = new Laya.Vector4();
                camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
                let point = new Laya.Vector2();
                point.x = ScreenV4.x;
                point.y = ScreenV4.y;
                return point;
            }
            Tools.d3_TransitionScreenPointfor = d3_TransitionScreenPointfor;
            function d3_animatorPlay(Sp3D, aniName, normalizedTime, layerIndex) {
                let sp3DAni = Sp3D.getComponent(Laya.Animator);
                if (!sp3DAni) {
                    console.log(Sp3D.name, '没有动画组件');
                    return;
                }
                if (!layerIndex) {
                    layerIndex = 0;
                }
                sp3DAni.play(aniName, layerIndex, normalizedTime);
                return sp3DAni;
            }
            Tools.d3_animatorPlay = d3_animatorPlay;
            function dAll_reverseVector(type, Vecoter1, Vecoter2, normalizing) {
                let p;
                if (type === '2d') {
                    p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
                    if (normalizing) {
                        p.normalize();
                    }
                    return p;
                }
                else if (type === '3d') {
                    p = new Laya.Vector3(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y, Vecoter1.z - Vecoter2.z);
                    if (normalizing) {
                        let returnP = new Laya.Vector3();
                        Laya.Vector3.normalize(p, returnP);
                        return returnP;
                    }
                    else {
                        return p;
                    }
                }
            }
            Tools.dAll_reverseVector = dAll_reverseVector;
            function sk_indexControl(sk, name) {
                sk.play(name, true);
                sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
            }
            Tools.sk_indexControl = sk_indexControl;
            let Draw;
            (function (Draw) {
                function drawPieMask(parent, startAngle, endAngle) {
                    parent.cacheAs = "bitmap";
                    let drawPieSpt = new Laya.Sprite();
                    drawPieSpt.blendMode = "destination-out";
                    parent.addChild(drawPieSpt);
                    let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                    return drawPie;
                }
                Draw.drawPieMask = drawPieMask;
                function reverseRoundMask(node, x, y, radius, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        node_RemoveAllChildren(node);
                    }
                    let interactionArea = new Laya.Sprite();
                    interactionArea.name = 'reverseRoundMask';
                    interactionArea.blendMode = "destination-out";
                    node.cacheAs = "bitmap";
                    node.addChild(interactionArea);
                    interactionArea.graphics.drawCircle(0, 0, radius, "#000000");
                    interactionArea.pos(x, y);
                }
                Draw.reverseRoundMask = reverseRoundMask;
                function reverseRoundrectMask(node, x, y, width, height, round, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        node_RemoveAllChildren(node);
                    }
                    let interactionArea = new Laya.Sprite();
                    interactionArea.name = 'reverseRoundrectMask';
                    interactionArea.blendMode = "destination-out";
                    node.cacheAs = "bitmap";
                    node.addChild(interactionArea);
                    interactionArea.graphics.drawPath(0, 0, [["moveTo", 5, 0], ["lineTo", width - round, 0], ["arcTo", width, 0, width, round, round], ["lineTo", width, height - round], ["arcTo", width, height, width - round, height, round], ["lineTo", height - round, height], ["arcTo", 0, height, 0, height - round, round], ["lineTo", 0, round], ["arcTo", 0, 0, round, 0, round], ["closePath"]], { fillStyle: "#000000" });
                    interactionArea.width = width;
                    interactionArea.height = height;
                    interactionArea.pivotX = width / 2;
                    interactionArea.pivotY = height / 2;
                    interactionArea.pos(x, y);
                }
                Draw.reverseRoundrectMask = reverseRoundrectMask;
            })(Draw = Tools.Draw || (Tools.Draw = {}));
            function objArrPropertySort(array, property) {
                var compare = function (obj1, obj2) {
                    var val1 = obj1[property];
                    var val2 = obj2[property];
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }
                    if (val1 < val2) {
                        return -1;
                    }
                    else if (val1 > val2) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                };
                array.sort(compare);
                return array;
            }
            Tools.objArrPropertySort = objArrPropertySort;
            function objArr2DifferentPropertyObjArr1(objArr1, objArr2, property) {
                var result = [];
                for (var i = 0; i < objArr1.length; i++) {
                    var obj1 = objArr1[i];
                    var obj1Name = obj1[property];
                    var isExist = false;
                    for (var j = 0; j < objArr2.length; j++) {
                        var obj2 = objArr2[j];
                        var obj2Name = obj2[property];
                        if (obj2Name == obj1Name) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        result.push(obj1);
                    }
                }
                return result;
            }
            Tools.objArr2DifferentPropertyObjArr1 = objArr2DifferentPropertyObjArr1;
            function objArr1IdenticalPropertyObjArr2(data1, data2, property) {
                var result = [];
                for (var i = 0; i < data1.length; i++) {
                    var obj1 = data1[i];
                    var obj1Name = obj1[property];
                    var isExist = false;
                    for (var j = 0; j < data2.length; j++) {
                        var obj2 = data2[j];
                        var obj2Name = obj2[property];
                        if (obj2Name == name) {
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist) {
                        result.push(obj1);
                    }
                }
                return result;
            }
            Tools.objArr1IdenticalPropertyObjArr2 = objArr1IdenticalPropertyObjArr2;
            function objArrUnique(arr, property) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    for (var j = i + 1, len = arr.length; j < len; j++) {
                        if (arr[i][property] === arr[j][property]) {
                            arr.splice(j, 1);
                            j--;
                            len--;
                        }
                    }
                }
                return arr;
            }
            Tools.objArrUnique = objArrUnique;
            function objArrGetValue(objArr, property) {
                let arr = [];
                for (let i = 0; i < objArr.length; i++) {
                    if (objArr[i][property]) {
                        arr.push(objArr[i][property]);
                    }
                }
                return arr;
            }
            Tools.objArrGetValue = objArrGetValue;
            function objArray_Copy(ObjArray) {
                var sourceCopy = ObjArray instanceof Array ? [] : {};
                for (var item in ObjArray) {
                    sourceCopy[item] = typeof ObjArray[item] === 'object' ? obj_Copy(ObjArray[item]) : ObjArray[item];
                }
                return sourceCopy;
            }
            Tools.objArray_Copy = objArray_Copy;
            function obj_Copy(obj) {
                var objCopy = {};
                for (const item in obj) {
                    if (obj.hasOwnProperty(item)) {
                        const element = obj[item];
                        if (typeof element === 'object') {
                            if (Array.isArray(element)) {
                                let arr1 = array_Copy(element);
                                objCopy[item] = arr1;
                            }
                            else {
                                obj_Copy(element);
                            }
                        }
                        else {
                            objCopy[item] = element;
                        }
                    }
                }
                return objCopy;
            }
            Tools.obj_Copy = obj_Copy;
            function arrayAddToarray(array1, array2) {
                for (let index = 0; index < array2.length; index++) {
                    const element = array2[index];
                    array1.push(element);
                }
                return array1;
            }
            Tools.arrayAddToarray = arrayAddToarray;
            function arrayRandomGetOut(arr, num) {
                if (!num) {
                    num = 1;
                }
                let arrCopy = Tools.array_Copy(arr);
                let arr0 = [];
                if (num > arrCopy.length) {
                    return '数组长度小于取出的数！';
                }
                else {
                    for (let index = 0; index < num; index++) {
                        let ran = Math.round(Math.random() * (arrCopy.length - 1));
                        let a1 = arrCopy[ran];
                        arrCopy.splice(ran, 1);
                        arr0.push(a1);
                    }
                    return arr0;
                }
            }
            Tools.arrayRandomGetOut = arrayRandomGetOut;
            function arrayRandomGetOne(arr) {
                let arrCopy = Tools.array_Copy(arr);
                let ran = Math.round(Math.random() * (arrCopy.length - 1));
                return arrCopy[ran];
            }
            Tools.arrayRandomGetOne = arrayRandomGetOne;
            function array_Copy(arr1) {
                var arr = [];
                for (var i = 0; i < arr1.length; i++) {
                    arr.push(arr1[i]);
                }
                return arr;
            }
            Tools.array_Copy = array_Copy;
            function arrayUnique_01(arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    for (var j = i + 1, len = arr.length; j < len; j++) {
                        if (arr[i] === arr[j]) {
                            arr.splice(j, 1);
                            j--;
                            len--;
                        }
                    }
                }
                return arr;
            }
            Tools.arrayUnique_01 = arrayUnique_01;
            function arrayUnique_02(arr) {
                arr = arr.sort();
                var arr1 = [arr[0]];
                for (var i = 1, len = arr.length; i < len; i++) {
                    if (arr[i] !== arr[i - 1]) {
                        arr1.push(arr[i]);
                    }
                }
                return arr1;
            }
            Tools.arrayUnique_02 = arrayUnique_02;
            function arrayUnique_03(arr) {
                return Array.from(new Set(arr));
            }
            Tools.arrayUnique_03 = arrayUnique_03;
            function array1ExcludeArray2(arr1, arr2) {
                let arr1Capy = array_Copy(arr1);
                let arr2Capy = array_Copy(arr2);
                for (let i = 0; i < arr1Capy.length; i++) {
                    for (let j = 0; j < arr2Capy.length; j++) {
                        if (arr1Capy[i] === arr2Capy[j]) {
                            arr1Capy.splice(i, 1);
                            i--;
                        }
                    }
                }
                return arr1Capy;
            }
            Tools.array1ExcludeArray2 = array1ExcludeArray2;
            function array_ExcludeArrays(arrays, exclude) {
                let arr0 = [];
                for (let i = 0; i < arrays.length; i++) {
                    for (let j = 0; j < arrays[i].length; j++) {
                        arr0.push(arrays[i][j]);
                    }
                }
                let arr1 = Tools.array_Copy(arr0);
                let arr2 = Tools.arrayUnique_01(arr1);
                let arrNum = [];
                for (let k = 0; k < arr2.length; k++) {
                    arrNum.push({
                        name: arr2[k],
                        num: 0,
                    });
                }
                for (let l = 0; l < arr0.length; l++) {
                    for (let m = 0; m < arrNum.length; m++) {
                        if (arr0[l] == arrNum[m]['name']) {
                            arrNum[m]['num']++;
                        }
                    }
                }
                let arrAllHave = [];
                let arrDiffHave = [];
                for (let n = 0; n < arrNum.length; n++) {
                    const element = arrNum[n];
                    if (arrNum[n]['num'] == arrays.length) {
                        arrAllHave.push(arrNum[n]['name']);
                    }
                    else {
                        arrDiffHave.push(arrNum[n]['name']);
                    }
                }
                if (!exclude) {
                    return arrAllHave;
                }
                else {
                    return arrDiffHave;
                }
            }
            Tools.array_ExcludeArrays = array_ExcludeArrays;
            function point_DotRotatePoint(x0, y0, x1, y1, angle) {
                let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
                let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
                return new Laya.Point(x2, y2);
            }
            Tools.point_DotRotatePoint = point_DotRotatePoint;
            function point_SpeedXYByAngle(angle, speed) {
                if (angle % 90 === 0 || !angle) {
                }
                const speedXY = { x: 0, y: 0 };
                speedXY.x = speed * Math.cos(angle * Math.PI / 180);
                speedXY.y = speed * Math.sin(angle * Math.PI / 180);
                return new Laya.Point(speedXY.x, speedXY.y);
            }
            Tools.point_SpeedXYByAngle = point_SpeedXYByAngle;
            function point_GetRoundPos(angle, radius, centerPos) {
                var center = centerPos;
                var radius = radius;
                var hudu = (2 * Math.PI / 360) * angle;
                var X = center.x + Math.sin(hudu) * radius;
                var Y = center.y - Math.cos(hudu) * radius;
                return new Laya.Point(X, Y);
            }
            Tools.point_GetRoundPos = point_GetRoundPos;
            function point_RandomPointByCenter(centerPos, radiusX, radiusY, count) {
                if (!count) {
                    count = 1;
                }
                let arr = [];
                for (let index = 0; index < count; index++) {
                    let x0 = Tools.randomCountNumer(0, radiusX, 1, false);
                    let y0 = Tools.randomCountNumer(0, radiusY, 1, false);
                    let diffX = Tools.randomOneHalf() == 0 ? x0[0] : -x0[0];
                    let diffY = Tools.randomOneHalf() == 0 ? y0[0] : -y0[0];
                    let p = new Laya.Point(centerPos.x + diffX, centerPos.y + diffY);
                    arr.push(p);
                }
                return arr;
            }
            Tools.point_RandomPointByCenter = point_RandomPointByCenter;
            function angle_GetRad(angle) {
                return angle / 180 * Math.PI;
            }
            Tools.angle_GetRad = angle_GetRad;
            function jsonCompare(url, storageName, propertyName) {
                let dataArr;
                if (Laya.LocalStorage.getJSON(storageName)) {
                    dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName))[storageName];
                    console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
                    try {
                        let dataArr_0 = Laya.loader.getRes(url)['RECORDS'];
                        if (dataArr_0.length >= dataArr.length) {
                            let diffArray = Tools.objArr2DifferentPropertyObjArr1(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            Tools.arrayAddToarray(dataArr, diffArray);
                        }
                        else {
                            console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                        }
                    }
                    catch (error) {
                        console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                else {
                    try {
                        dataArr = Laya.loader.getRes(url)['RECORDS'];
                    }
                    catch (error) {
                        console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                let data = {};
                data[storageName] = dataArr;
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(data));
                return dataArr;
            }
            Tools.jsonCompare = jsonCompare;
        })(Tools = lwg.Tools || (lwg.Tools = {}));
    })(lwg || (lwg = {}));
    var lwg$1 = lwg;
    let TimerAdmin = lwg.TimerAdmin;
    let Color = lwg.Color;
    let Effects = lwg.Effects;
    let Animation2D = lwg.Animation2D;
    let Tools$1 = lwg.Tools;

    class UIReady extends UIBase {
        constructor() {
            super(...arguments);
            this.clothisopen = true;
            this.scaleDelta = 0;
            this.scaleDelta1 = 0;
            this.isToOne = true;
            this.newmap = new Map();
            this.oldY = 0;
            this.oldX = 0;
            this.isLeftMove = false;
            this.isMusicing = false;
            this.oldTime = 0;
            this.str = {};
            this.str1 = {};
            this.str2 = {};
            this.str3 = {};
            this.isPicking = false;
        }
        onInit() {
            ADManager.TAPoint(TaT.PageEnter, "mainpage");
            this.Spinning = this.vars("Spinning");
            this.btnEv("Spinning", () => {
                UIMgr.show("UISpinning");
            });
            this.Shop = this.vars("Shop");
            this.btnEv("Shop", () => {
                UIMgr.show("UITask");
            });
            this.Charm = this.vars("Charm");
            this.CharmValueShow();
            this.Draw = this.vars("Draw");
            this.AdDraw = this.Draw.getChildByName("AD");
            if (Laya.LocalStorage.getItem("DrawAd") == "1") {
                this.AdDraw.visible = true;
            }
            this.btnEv("Draw", () => {
                if (Laya.LocalStorage.getItem("DrawAd")) {
                    console.log("存在drawad");
                    if (Laya.LocalStorage.getItem("DrawAd") == "1") {
                        ADManager.ShowReward(() => {
                            UIMgr.show("UIDraw");
                        });
                    }
                }
                else {
                    console.log("不存在drawad");
                    Laya.LocalStorage.setItem("DrawAd", "1");
                    UIMgr.show("UIDraw");
                    this.AdDraw.visible = true;
                }
            });
            this.btnEv("Combine", () => {
                UIMgr.show("UICombine");
            });
            this.Notice = this.vars("Notice");
            this.btnEv("Notice", () => {
                UIMgr.show("UINotice");
            });
            this.DuihuanBtn = this.vars("DuihuanBtn");
            this.btnEv("DuihuanBtn", () => {
                UIMgr.show("UIDuiHuan");
            });
            UIMgr.show("UIChangE");
            this.BG = this.vars("BG");
            this.BG.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDownListen);
            this.BG.on(Laya.Event.MOUSE_UP, this, this.onMouseUpListen);
            this.BG.on(Laya.Event.MOUSE_OUT, this, this.onMouseOutListen);
            this.Wing = this.vars("Wing");
            Laya.timer.frameLoop(1, this, () => {
                this.scaleDelta += 0.02;
                var scaleValue = Math.sin(this.scaleDelta);
                this.Wing.scale(scaleValue, 1);
            });
            this.Wing.on(Laya.Event.CLICK, this, () => {
                UIMgr.show("UIWing");
                this.Wing.visible = false;
            });
            this.windowheight = Laya.Browser.height;
            this.windowwidth = Laya.Browser.width;
            if (Laya.LocalStorage.getItem("Get")) {
                console.log("获取到了");
                console.log(GameDataController.GetFirstToNow());
            }
            else {
                GameDataController.setFirstLoginTime();
                UIMgr.show("UICombine");
                RecordManager.startAutoRecord();
                GameDataController.ShopCharmValue = "0";
            }
            this.btnEv("ClothOpenBtn", this.ClothOpenBtnClick);
            this.btnEv("ActiveBtn", this.ActiveClick);
            this.btnEv("ClothReceive", () => {
                ADManager.TAPoint(TaT.BtnClick, "chongzhi_click");
                ClothChange.Instance.ClothReceive();
                BagListController.Instance.ClothesPageChange(BagListController.Instance.SelectIndex);
            });
            this.btnEv("PhotoBtn", () => {
                UIMgr.show("UIPhotos");
                ADManager.TAPoint(TaT.BtnClick, "xiangce_click");
            });
            this.btnEv("Share", () => {
                ClothChange.Instance.Share();
                ADManager.TAPoint(TaT.BtnClick, "paizhao_click");
            });
            this.ShowView = this.vars("ShowView");
            this.BtnBar = this.vars("BtnBar");
            this.ClothOpenBtn = this.vars("ClothOpenBtn");
            this.FemaleRoot = this.vars("FemaleRoot");
            this.BagAll = this.vars("BagALL");
            this.Ubag = TweenMgr.tweenCust(300, this, this.tweenbagUp, null, true, Laya.Ease.linearNone);
            this.Lbtn = TweenMgr.tweenCust(300, this, this.tweenbtnLeft, null, true, Laya.Ease.linearNone);
            this.btnU = TweenMgr.tweenCust(200, this, this.RoteUp, null, true, Laya.Ease.linearNone);
            this.FRS = TweenMgr.tweenCust(300, this, this.tweenFBTSmall, null, true, Laya.Ease.linearNone);
            this.Dbag = TweenMgr.tweenCust(300, this, this.tweenbagDown, null, true, Laya.Ease.backOut);
            this.Rbtn = TweenMgr.tweenCust(300, this, this.tweenbtnRight, null, true, Laya.Ease.backOut);
            this.btnD = TweenMgr.tweenCust(200, this, this.RoteDown, null, true, Laya.Ease.linearNone);
            this.FRB = TweenMgr.tweenCust(300, this, this.tweenFBTBig, null, true, Laya.Ease.backOut);
            this.FRD = TweenMgr.tweenCust(300, this, this.tweenFRToDown, null, true, Laya.Ease.backOut);
            this.FRU = TweenMgr.tweenCust(300, this, this.tweenFRToUp, null, true, Laya.Ease.backOut);
            if (GameDataController.IsNewDay()) {
                console.log("GameDataController.IsNewDay", GameDataController.TodaySign);
                GameDataController.TodaySign = "0";
                console.log("是新的一天");
                GameDataController.TodayHeCheng = "0";
            }
            let havesign = GameDataController.TodaySign;
            if (havesign) {
                if (havesign == "1") {
                }
                else {
                    Laya.LocalStorage.setItem("PickNum", "5");
                    Laya.LocalStorage.setItem("TodayWinNum", "0");
                }
            }
            else {
                Laya.LocalStorage.setItem("PickNum", "5");
                Laya.LocalStorage.setItem("TodayWinNum", "0");
                GameDataController.TodaySign = "0";
            }
            this.MusicBtn = this.vars("MusicBtn");
            Laya.SoundManager.playSound("res/sounds/CCBGM.mp3", 0);
            Laya.timer.frameLoop(1, this, this.MusicRot);
            this.btnEv("MusicBtn", () => {
                this.isMusicing = !this.isMusicing;
                if (!this.isMusicing) {
                    console.log("xxxxxxxxxxxxxxxxxx1");
                    Laya.SoundManager.playSound("res/sounds/CCBGM.mp3", 0);
                    Laya.timer.frameLoop(1, this, this.MusicRot);
                    let a = this.MusicBtn.getChildByName("No");
                    a.visible = false;
                }
                else {
                    console.log("xxxxxxxxxxxxxxxxxx2");
                    Laya.SoundManager.stopSound("res/sounds/CCBGM.mp3");
                    Laya.timer.clear(this, this.MusicRot);
                    let a = this.MusicBtn.getChildByName("No");
                    a.visible = true;
                }
            });
            this.Pick = this.vars("Pick");
            this.btnEv("Pick", () => {
                UIMgr.show("UIRank");
                this.isPicking = true;
                ADManager.TAPoint(TaT.BtnClick, "pk_main");
            });
            this.effcets();
            this.changeEffcets('open');
        }
        effcets() {
            TimerAdmin._frameRandomLoop(50, 100, this, () => {
                Effects._Particle._slowlyUp(this.vars('E1'), null, null, null, null, null, [Effects._SkinUrl.圆形发光1], [[255, 255, 100, 1], [150, 150, 100, 1]], 20);
            });
            TimerAdmin._frameRandomLoop(50, 100, this, () => {
                Effects._Particle._slowlyUp(this.vars('E2'), null, null, null, null, null, [Effects._SkinUrl.圆形发光1], [[255, 255, 100, 1], [150, 150, 100, 1]], 20);
            });
        }
        changeEffcets(type) {
            var open = () => {
                for (let index = 0; index < CEBox.numChildren; index++) {
                    const element = CEBox.getChildAt(index);
                    if (element.name.substring(0, 3) == 'Yun') {
                        let num = Number(element.name.substr(3, 1));
                        new function () {
                            let time = 25000;
                            var yunCirculation = () => {
                                Animation2D.move_Simple(element, Laya.stage.width + 200, element.y, -800, element.y, time * num, 0, () => {
                                    yunCirculation();
                                });
                            };
                            Animation2D.move_Simple(element, element.x, element.y, -800, element.y, time * num, 0, () => {
                                yunCirculation();
                            });
                        };
                    }
                }
                TimerAdmin._frameRandomLoop(200, 500, this, () => {
                    Effects._Glitter._simpleInfinite(YueLiang, 0, 0, 809, 849, 0, 'ce/yueliangguang.png');
                });
            };
            let CEBox = this.vars('ChangeEffect');
            let YueLiang = CEBox.getChildByName('YueLiang');
            if (type == 'already') {
                CEBox.visible = true;
            }
            else if (type == 'open') {
                CEBox.visible = true;
                CEBox.alpha = 0;
                open();
                Animation2D.fadeOut(CEBox, 0, 1, 5000, 0, () => {
                });
            }
            else if (type == 'close') {
                Animation2D.fadeOut(CEBox, 1, 0, 500, 0, () => {
                    CEBox.visible = false;
                });
            }
        }
        MusicRot() {
            this.MusicBtn.rotation += 2;
        }
        ActiveClick() {
            UIMgr.show("UIActive");
        }
        onShow() {
            this.Refresh();
            ADManager.TAPoint(TaT.BtnShow, "fenxiang_click");
            ADManager.TAPoint(TaT.BtnShow, "paizhao_click");
            ADManager.TAPoint(TaT.BtnShow, "chongzhi_click");
            ADManager.TAPoint(TaT.BtnShow, "fangda_click");
            ADManager.TAPoint(TaT.BtnShow, "xiangce_click");
            ADManager.TAPoint(TaT.BtnShow, "pk_main");
            ADManager.TAPoint(TaT.BtnShow, "jiehun_click");
            GameDataController.CharmValue = "0";
            this.CharmValueShow();
        }
        onHide() {
        }
        ClothOpenBtnClick() {
            if (this.clothisopen) {
                ADManager.TAPoint(TaT.BtnClick, "fangda_click");
                console.log("消失");
                this.Dbag.play();
                this.btnU.play();
                this.FRB.play();
                let a = Laya.LocalStorage.getJSON("ClothData");
            }
            else {
                console.log("展示");
                this.Ubag.play();
                this.btnD.play();
                this.FRS.play();
            }
            this.clothisopen = !this.clothisopen;
        }
        RoteDown(t) {
            let nbtm = this.ClothOpenBtn.rotation;
            TweenMgr.lerp_Num(nbtm, 180, t);
            this.ClothOpenBtn.rotation = t.outParams[0][0];
        }
        RoteUp(t) {
            let nbtm = this.ClothOpenBtn.rotation;
            TweenMgr.lerp_Num(nbtm, 0, t);
            this.ClothOpenBtn.rotation = t.outParams[0][0];
        }
        tweenbagUp(t) {
            let nbtm = this.BagAll.bottom;
            TweenMgr.lerp_Num(nbtm, -37, t);
            this.BagAll.bottom = t.outParams[0][0];
        }
        tweenbagDown(t) {
            let nbtm = this.BagAll.bottom;
            TweenMgr.lerp_Num(nbtm, -485, t);
            this.BagAll.bottom = t.outParams[0][0];
        }
        tweenbtnLeft(t) {
            let nX = this.BtnBar.x;
            TweenMgr.lerp_Num(nX, 75, t);
            this.BtnBar.x = t.outParams[0][0];
        }
        tweenbtnRight(t) {
            let nX = this.BtnBar.x;
            TweenMgr.lerp_Num(nX, GameDataController.windowWidth - 75, t);
            this.BtnBar.x = t.outParams[0][0];
        }
        tweenFBTSmall(t) {
            let nX = this.FemaleRoot.scaleX;
            TweenMgr.lerp_Num(nX, 0.8, t);
            this.FemaleRoot.scaleX = this.FemaleRoot.scaleY = t.outParams[0][0];
            this.BG.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDownListen);
        }
        tweenFBTBig(t) {
            let nX = this.FemaleRoot.scaleX;
            TweenMgr.lerp_Num(nX, 1.2, t);
            this.FemaleRoot.scaleX = this.FemaleRoot.scaleY = t.outParams[0][0];
            this.BG.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDownListen);
        }
        onClick_Btnshortcut() {
            UIMgr.show("UIMain");
        }
        onMouseMoveListen(e) {
            if (this.BG.mouseY > this.oldY) {
                if (this.BG.mouseY - this.oldY > 200) {
                    console.log("下滑");
                    this.FRD.play();
                    if (!this.Wing.visible && GameDataController.ClothDataRefresh[50404] == 1) {
                        this.Wing.visible = true;
                    }
                }
            }
            if (this.BG.mouseX < this.oldX) {
                if (this.oldX - this.BG.mouseX > 150) {
                    console.log("oldX" + this.oldX);
                    console.log(this.BG.mouseX);
                    console.log("左滑" + (this.oldX - this.BG.mouseX));
                }
            }
        }
        onMouseDownListen() {
            this.oldY = this.BG.mouseY;
            this.oldX = this.BG.mouseX;
            this.BG.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveListen);
        }
        onMouseUpListen() {
            console.log("鼠标抬起");
            this.BG.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveListen);
            this.FRU.play();
        }
        onMouseOutListen() {
            console.log("不在目标区域");
            this.FRU.play();
            this.BG.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveListen);
        }
        tweenFRToDown(t) {
            TweenMgr.lerp_Num(this.FemaleRoot.centerY, -60, t);
            this.FemaleRoot.centerY = t.outParams[0][0];
        }
        tweenFRToUp(t) {
            TweenMgr.lerp_Num(this.FemaleRoot.centerY, -193, t);
            this.FemaleRoot.centerY = t.outParams[0][0];
        }
        Refresh() {
            GameDataController.ClothPackge2.cloths1.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[GameDataController.ClothPackge2.cloths1[i].ID];
                this.str[GameDataController.ClothPackge2.cloths1[i].ID] = nv;
            });
            GameDataController.ClothdatapackSet(GameDataController.ClothPackge2.cloths1[0].GetType2, this.str);
            GameDataController.ClothPackge2.cloths2.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[GameDataController.ClothPackge2.cloths2[i].ID];
                this.str1[GameDataController.ClothPackge2.cloths2[i].ID] = nv;
            });
            GameDataController.ClothdatapackSet(GameDataController.ClothPackge2.cloths2[0].GetType2, this.str1);
            GameDataController.ClothPackge2.cloths3.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[GameDataController.ClothPackge2.cloths3[i].ID];
                this.str2[GameDataController.ClothPackge2.cloths3[i].ID] = nv;
            });
            GameDataController.ClothdatapackSet(GameDataController.ClothPackge2.cloths3[0].GetType2, this.str2);
        }
        CharmValueShow() {
            console.log("xxxxxxxxxxxxx");
            this.Charm.getChildByName("CharmValue").value = (parseInt(GameDataController.CharmValue) + parseInt(GameDataController.ShopCharmValue)).toString();
        }
    }

    class UIMain extends UIBase {
        onInit() {
            this.TouchArea.on(Laya.Event.CLICK, this, () => {
                this.Mouse_Click();
            });
            this.TouchArea.on(Laya.Event.MOUSE_MOVE, this, () => {
                this.Mouse_Move();
            });
            this.TouchArea.on(Laya.Event.MOUSE_UP, this, () => {
                this.Mouse_Up();
            });
            this.TouchArea.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.Mouse_Down();
                Laya.timer.loop(100, this, this.timeradd);
            });
            this.TouchArea.on(Laya.Event.MOUSE_OUT, this, () => {
                this.Mouse_Up();
            });
        }
        timeradd() {
        }
        onShow() {
        }
        Mouse_Click() {
        }
        Mouse_Move() {
        }
        Mouse_Up() {
        }
        Mouse_Down() {
        }
        TimerUpdate() {
        }
        update() {
        }
        onHide() {
        }
        TimeControoler() {
        }
        TimeStart() {
            Laya.timer.loop(10, this, this.TimeControoler);
        }
        TimeStop() {
            Laya.timer.clear(this, this.TimeControoler);
        }
    }

    class UISettle extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.DefaultTog = true;
        }
        onInit() {
            this.btnEv("BtnHome", () => {
                this.HomeBtn();
            });
        }
        TogClick() {
        }
        onShow() {
            GameMgr.playSound("success");
        }
        HomeBtn() {
            UIMgr.show("UISubMoneyEf", () => {
                UIMgr.show("UIReady");
                this.hide();
            });
        }
        SanBeiBtn() {
            ADManager.Event("ADV_RDA_CLICK_003");
            ADManager.ShowReward(() => {
                UIMgr.show("UISubMoneyEf", () => {
                    UIMgr.show("UIReady");
                    this.hide();
                });
            });
        }
        ShareBtnClick() {
            ADManager.Event("VID_RDA_CLICK_001");
            let sus = () => {
            };
            let fail = () => {
                UIMgr.tip("分享失败");
            };
            RecordManager._share(sus, fail);
        }
    }

    class UISubMoneyEf extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        moveFinish() {
            this.hide();
            console.log("paowan");
        }
        ;
        tweenAlphaFinish(fun = null) {
            let json = Laya.loader.getRes("Prefab/CoinPref.prefab").json;
            let pref = new Laya.Prefab();
            pref.json = json;
            let bound = 480;
            let parent = this.owner;
            let icon = this.vars("icon");
            let iconX = icon.x;
            let iconY = icon.y;
            let createNum = 30;
            for (let i = 0; i < createNum; i++) {
                let inst = pref.create();
                parent.addChild(inst);
                inst.x = Util.randomInRange_f(260, 560);
                inst.y = Util.randomInRange_f(340, 840);
                TweenMgr.tweenTiny(100, this, (t) => {
                    inst.scale(t.factor, t.factor);
                }, () => {
                    TweenMgr.tweenTiny(400, this, (t) => {
                        let inParams = t.getPG("inParams", 0);
                        if (inParams.length == 0) {
                            inParams[0] = inst.x;
                            inParams[1] = iconX - inst.x;
                            inParams[2] = inst.y;
                            inParams[3] = iconY - inst.y;
                        }
                        inst.x = inParams[0] + inParams[1] * t.factor;
                        inst.y = inParams[2] + inParams[3] * t.factor;
                        if (t.factor >= 1) {
                            inst.destroy();
                        }
                    }, (i == createNum - 1) ? () => {
                        fun();
                        this.moveFinish();
                    } : null, false, Laya.Ease.linearNone, 550);
                }, false, Laya.Ease.linearNone, Util.randomInRange_f(0, 15) * i);
            }
        }
        onShow(arg = null) {
            this.tweenAlphaFinish(arg);
        }
    }

    class UIActive extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.Data = [];
        }
        onInit() {
            this.ActiveList = this.vars("ActiveList");
            this.ActiveList.vScrollBarSkin = "";
            this.Refresh();
            this.ActiveList.renderHandler = new Laya.Handler(this, this.onWrapItem);
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
        }
        onWrapItem(cell, index) {
            cell.getComponent(ActiveItem).fell(this.Data[index], index);
        }
        onShow() {
            ADManager.TAPoint(TaT.PageEnter, "taozhuangpage");
            this.Refresh();
        }
        Refresh() {
            this.Data.length = 0;
            let data = [];
            if (GameDataController.ClothPackge2.cloths3.length > 0) {
                data.push(GameDataController.ClothPackge2.cloths3);
            }
            if (GameDataController.ClothPackge2.cloths1.length > 0) {
                data.push(GameDataController.ClothPackge2.cloths1);
            }
            if (GameDataController.ClothPackge2.cloths2.length > 0) {
                data.push(GameDataController.ClothPackge2.cloths2);
            }
            console.log(data);
            this.Data = data;
            this.ActiveList.array = this.Data;
            this.ActiveList.refresh();
            console.log("UIActive", this.Data);
        }
        onHide() {
            ADManager.TAPoint(TaT.PageLeave, "taozhuangpage");
            this.hide();
        }
    }
    class clothbag extends Laya.Script {
        constructor() {
            super(...arguments);
            this.cloths = [];
        }
    }

    class SignBtn extends Laya.Script {
        constructor() {
            super(...arguments);
            this.MaxHeight = 90;
            this.MaxWidth = 90;
            this.BtnID = 0;
            this.BtnIndex = 0;
            this.str = {};
        }
        onAwake() {
            let item = this.owner;
            this.ADBtn = item.getChildByName("ADBtn");
            this.Btn = item.getChildByName("Btn");
            this.Lock = item.getChildByName("Lock");
            this.Icon = item.getChildByName("icon");
            this.Btn.on(Laya.Event.CLICK, this, this.BtnClick);
            this.ADBtn.on(Laya.Event.CLICK, this, this.ADBtnClick);
        }
        Fell(mes, index) {
            this.BtnIndex = index;
            this.data = mes;
            this.Icon.skin = this.data.GetPath1();
            this.BtnID = this.data.ID;
            let imageHeight = parseFloat(this.Icon.height.toString());
            let imagewidth = parseFloat(this.Icon.width.toString());
            let pr = 0;
            if (imagewidth > imageHeight) {
                pr = this.MaxWidth / imagewidth;
            }
            else {
                pr = this.MaxHeight / imageHeight;
            }
            this.Icon.scaleX = pr;
            this.Icon.scaleY = pr;
            this.Icon.centerX = 0;
            this.Icon.centerY = 0;
            let days = GameDataController.GetFirstToNow();
            console.log("SignBtn,Fell,GameDataController.ClothDataRefresh", GameDataController.ClothDataRefresh[this.BtnID]);
            if (GameDataController.ClothDataRefresh[this.BtnID] == 1) {
                if (days - 1 > index) {
                    console.log("过期的");
                    this.ADSignBtnOn();
                }
                else if (days - 1 == index) {
                    console.log("当前天");
                    this.SignBtnOn();
                }
                else {
                    console.log("过后天");
                    this.BtnClose();
                }
            }
            else {
                console.log("SignBtn,Fell  this.BtnID已解锁 ", this.BtnID);
                this.BtnClose();
            }
        }
        Refresh() {
            let a = GameDataController.ClothDataRefresh[this.data.ID];
            this.Lock.visible = (a == 1);
        }
        BtnClick() {
            GameDataController.TodaySign = "1";
            GameDataController.SetLastTime();
            console.log("今日签到成功");
            let dataall = GameDataController.ClothDataRefresh;
            dataall[this.BtnID] = 0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.refresh();
            UIMgr.get("UISign").Refresh();
        }
        ADBtnClick() {
            console.log("补签", this.BtnIndex);
            ADManager.ShowReward(() => {
                this.GetAward();
            }, () => {
                UIMgr.show("UITip", () => {
                    this.GetAward();
                });
            });
        }
        GetAward() {
            GameDataController.SetLastTime();
            console.log("补签成功");
            let dataall = GameDataController.ClothDataRefresh;
            dataall[this.BtnID] = 0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.refresh();
            UIMgr.get("UISign").Refresh();
        }
        SignBtnOn() {
            let dataall = GameDataController.ClothDataRefresh;
            if (dataall[this.BtnID] == 0) {
                this.BtnClose();
            }
            else {
                this.ADBtn.visible = false;
                this.Btn.visible = true;
            }
        }
        ADSignBtnOn() {
            let dataall = GameDataController.ClothDataRefresh;
            if (dataall[this.BtnID] == 0) {
                this.BtnClose();
            }
            else {
                this.ADBtn.visible = true;
                this.Btn.visible = false;
            }
        }
        BtnClose() {
            this.ADBtn.visible = false;
            this.Btn.visible = false;
        }
    }

    class UISign extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.Data = [];
            this.str = {};
            this.BtnBar = [];
            this.func = null;
        }
        onInit() {
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
            this.SkinBtnBar = this.vars("SkinBtnBar");
            for (let index = 0; index < this.SkinBtnBar.numChildren; index++) {
                this.SkinBtnBar.getChildAt(index).addComponent(SignBtn);
                this.BtnBar.push(this.SkinBtnBar.getChildAt(index));
            }
        }
        onShow(arg) {
            ADManager.TAPoint(TaT.PageEnter, "signpage");
            this.func = arg;
            this.Data = GameDataController.ClothPackge1.cloths1;
            this.Data.forEach((V, i) => {
                let item = this.BtnBar[i].getComponent(SignBtn);
                item.Fell(V, i);
            });
            this.Refresh();
        }
        onRefresh() {
        }
        Refresh() {
            this.Data.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[this.Data[i].ID];
                this.str[this.Data[i].ID] = nv;
                let item = this.BtnBar[i].getComponent(SignBtn);
                item.Fell(v, i);
            });
            GameDataController.ClothdatapackSet(this.Data[0].GetType2, this.str);
        }
        onHide() {
            ADManager.TAPoint(TaT.PageLeave, "signpage");
            this.hide();
        }
    }

    class PhotosChange extends Laya.Script {
        constructor() {
            super(...arguments);
            this.photoindex = 0;
            this.photoMax = 0;
            this.mes = [];
        }
        onAwake() {
            this.FemaleRoot = this.owner;
            this.Hair = this.FemaleRoot.getChildByName("Hair");
            this.Hair1 = this.FemaleRoot.getChildByName("Hair1");
            this.Ornament = this.FemaleRoot.getChildByName("Ornament");
            this.Ornament1 = this.FemaleRoot.getChildByName("Ornament1");
            this.Shirt = this.FemaleRoot.getChildByName("Shirt");
            this.Shirt1 = this.FemaleRoot.getChildByName("Shirt1");
            this.Trousers = this.FemaleRoot.getChildByName("Trousers");
            this.Trousers1 = this.FemaleRoot.getChildByName("Trousers1");
            this.Dress = this.FemaleRoot.getChildByName("Dress");
            this.Dress1 = this.FemaleRoot.getChildByName("Dress1");
            this.Socks = this.FemaleRoot.getChildByName("Socks");
            this.Socks1 = this.FemaleRoot.getChildByName("Socks1");
            this.Shose = this.FemaleRoot.getChildByName("Shose");
            this.Shose1 = this.FemaleRoot.getChildByName("Shose1");
            this.Coat = this.FemaleRoot.getChildByName("Coat");
            this.Coat1 = this.FemaleRoot.getChildByName("Coat1");
            this.nophoto = this.FemaleRoot.getChildByName("nophoto");
            for (let i = 0; i < 8; i++) {
                this._ClothChange(0, i);
            }
        }
        _ClothChange(itemID, type) {
            switch (type) {
                case clothtype.Hair:
                    this.HairChange(itemID);
                    break;
                case clothtype.Dress:
                    this.DressChange(itemID);
                    break;
                case clothtype.Coat:
                    this.CoatChange(itemID);
                    break;
                case clothtype.Shirt:
                    this.ShirtChange(itemID);
                    break;
                case clothtype.Trousers:
                    this.TrousersChange(itemID);
                    break;
                case clothtype.Socks:
                    this.SocksChange(itemID);
                    break;
                case clothtype.Shose:
                    this.ShoseChange(itemID);
                    break;
                case clothtype.Ornament:
                    this.OrnamentChange(itemID);
                    break;
            }
        }
        ClothReceive() {
            for (let i = 0; i < 8; i++) {
                this._ClothChange(0, i);
            }
        }
        InitMes() {
            let item = GameDataController.PhotosData;
            console.log("PhotosChange==》item", item);
            if (item) {
                this.mes = item;
            }
            console.log("PhotosChange==mes", this.mes);
            if (this.mes.length <= 0) {
                this.CanShowPhoto = false;
                this.nophoto.visible = true;
                console.log("PhotosChange==》是否可以展示photo", !this.nophoto.visible);
                return;
            }
            else {
                this.CanShowPhoto = true;
                this.nophoto.visible = false;
                this.photoMax = (this.mes.length - 1);
                console.log("PhotosChange==》是否可以展示photo", !this.nophoto.visible);
            }
            this.ChangeAllCloth();
        }
        ChangeAllCloth() {
            this.HairChange(this.mes[this.photoindex].Hair);
            this.CoatChange(this.mes[this.photoindex].Coat);
            this.ShirtChange(this.mes[this.photoindex].Shirt);
            this.TrousersChange(this.mes[this.photoindex].Trousers);
            this.SocksChange(this.mes[this.photoindex].Socks);
            this.ShoseChange(this.mes[this.photoindex].Shose);
            this.OrnamentChange(this.mes[this.photoindex].Ornament);
            this.DressChange(this.mes[this.photoindex].Dress);
        }
        ChangeNextPhoto() {
            if (this.CanShowPhoto == false)
                return;
            this.photoindex++;
            if (this.photoindex > this.photoMax) {
                this.photoindex = 0;
            }
            this.ChangeAllCloth();
        }
        ChangeLastPhoto() {
            if (this.CanShowPhoto == false)
                return;
            this.photoindex--;
            if (this.photoindex < 0) {
                this.photoindex = this.photoMax;
            }
            this.ChangeAllCloth();
        }
        HairChange(itemID) {
            this.Hair.visible = this.Hair1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10002;
            }
            this.Hair.visible = this.Hair1.visible = true;
            let clothdata = GameDataController._clothData.get(itemID);
            this.Hair.skin = clothdata.GetPath1();
            this.Hair1.skin = clothdata.GetPath2();
            this.Hair.centerX = clothdata.GetPosition1().x;
            this.Hair.centerY = clothdata.GetPosition1().y;
            this.Hair1.centerX = clothdata.GetPosition2().x;
            this.Hair1.centerY = clothdata.GetPosition2().y;
            this.Hair.zOrder = clothdata.Sort1;
            this.Hair1.zOrder = clothdata.Sort2;
        }
        OrnamentChange(itemID) {
            this.Ornament.visible = this.Ornament1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Ornament.visible = this.Ornament1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Ornament.skin = clothdata.GetPath1();
            this.Ornament1.skin = clothdata.GetPath2();
            this.Ornament.centerX = clothdata.GetPosition1().x;
            this.Ornament.centerY = clothdata.GetPosition1().y;
            this.Ornament1.centerX = clothdata.GetPosition2().x;
            this.Ornament1.centerY = clothdata.GetPosition2().y;
            this.Ornament.zOrder = clothdata.Sort1;
            this.Ornament1.zOrder = clothdata.Sort2;
        }
        ShirtChange(itemID) {
            this.Shirt.visible = this.Shirt1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10000;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.Shirt.visible = this.Shirt1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shirt.skin = clothdata.GetPath1();
            this.Shirt1.skin = clothdata.GetPath2();
            this.Shirt.centerX = clothdata.GetPosition1().x;
            this.Shirt.centerY = clothdata.GetPosition1().y;
            this.Shirt1.centerX = clothdata.GetPosition2().x;
            this.Shirt1.centerY = clothdata.GetPosition2().y;
            this.Shirt.zOrder = clothdata.Sort1;
            this.Shirt1.zOrder = clothdata.Sort2;
        }
        TrousersChange(itemID) {
            this.Trousers.visible = this.Trousers1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10001;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.Trousers.visible = this.Trousers1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Trousers.visible = this.Trousers1.visible = true;
            this.Trousers.skin = clothdata.GetPath1();
            this.Trousers1.skin = clothdata.GetPath2();
            this.Trousers.centerX = clothdata.GetPosition1().x;
            this.Trousers.centerY = clothdata.GetPosition1().y;
            this.Trousers1.centerX = clothdata.GetPosition2().x;
            this.Trousers1.centerY = clothdata.GetPosition2().y;
            this.Trousers.zOrder = clothdata.Sort1;
            this.Trousers1.zOrder = clothdata.Sort2;
        }
        DressChange(itemID) {
            this.Dress.visible = this.Dress1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                this.UpDownOpen();
                return;
            }
            else {
                this.DressOpen();
            }
            this.Dress.visible = this.Dress1.visible = true;
            this.UpDownClose();
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Dress.skin = clothdata.GetPath1();
            this.Dress1.skin = clothdata.GetPath2();
            this.Dress.centerX = clothdata.GetPosition1().x;
            this.Dress.centerY = clothdata.GetPosition1().y;
            this.Dress1.centerX = clothdata.GetPosition2().x;
            this.Dress1.centerY = clothdata.GetPosition2().y;
            this.Dress.zOrder = clothdata.Sort1;
            this.Dress1.zOrder = clothdata.Sort2;
        }
        SocksChange(itemID) {
            this.Socks1.visible = this.Socks.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Socks1.visible = this.Socks.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Socks.skin = clothdata.GetPath1();
            this.Socks1.skin = clothdata.GetPath2();
            this.Socks.centerX = clothdata.GetPosition1().x;
            this.Socks.centerY = clothdata.GetPosition1().y;
            this.Socks1.centerX = clothdata.GetPosition2().x;
            this.Socks1.centerY = clothdata.GetPosition2().y;
            this.Socks.zOrder = clothdata.Sort1;
            this.Socks1.zOrder = clothdata.Sort2;
        }
        ShoseChange(itemID) {
            this.Shose.visible = this.Shose1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Shose.visible = this.Shose1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shose.skin = clothdata.GetPath1();
            this.Shose1.skin = clothdata.GetPath2();
            this.Shose.centerX = clothdata.GetPosition1().x;
            this.Shose.centerY = clothdata.GetPosition1().y;
            this.Shose1.centerX = clothdata.GetPosition2().x;
            this.Shose1.centerY = clothdata.GetPosition2().y;
            this.Shose.zOrder = clothdata.Sort1;
            this.Shose1.zOrder = clothdata.Sort2;
        }
        CoatChange(itemID) {
            this.Coat.visible = this.Coat1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Coat.visible = this.Coat1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Coat.skin = clothdata.GetPath1();
            this.Coat1.skin = clothdata.GetPath2();
            this.Coat.centerX = clothdata.GetPosition1().x;
            this.Coat.centerY = clothdata.GetPosition1().y;
            this.Coat1.centerX = clothdata.GetPosition2().x;
            this.Coat1.centerY = clothdata.GetPosition2().y;
            this.Coat.zOrder = clothdata.Sort1;
            this.Coat1.zOrder = clothdata.Sort2;
        }
        UpDownClose() {
            this.ShirtChange(0);
            this.TrousersChange(0);
            this.Shirt.visible = this.Shirt1.visible = false;
            this.Trousers.visible = this.Trousers1.visible = false;
        }
        UpDownOpen() {
            this.Shirt.visible = this.Shirt1.visible = true;
            this.Trousers.visible = this.Trousers1.visible = true;
        }
        DressOpen() {
            this.Dress.visible = this.Dress1.visible = true;
        }
        DressClose() {
            this.DressChange(0);
            this.Dress.visible = this.Dress1.visible = false;
        }
    }

    class UIPhotos extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.FemaleRoot = this.vars("FemaleRoot");
            this._PhotosChange = this.FemaleRoot.getComponent(PhotosChange);
            this.ChangeLeft = this.vars("ChangeLeft");
            this.ChangeRight = this.vars("ChangeRight");
            this.TweenskewY = this.vars("TweenskewY");
            this.btnEv("BackHome", this.TweenOff);
            this.btnEv("ChangeLeft", this.ChangeLastPhoto);
            this.btnEv("ChangeRight", this.ChangeNextPhoto);
        }
        onShow() {
            ADManager.TAPoint(TaT.PageEnter, "xiangcepage");
            this.TweenskewY.skewY = -90;
            this._PhotosChange.InitMes();
            this.TweenOn();
        }
        ChangeNextPhoto() {
            this._PhotosChange.ChangeNextPhoto();
        }
        ChangeLastPhoto() {
            this._PhotosChange.ChangeLastPhoto();
        }
        TweenOn() {
            let a = Laya.Tween.to(this.TweenskewY, { skewY: 0 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
            }), 0, true, true);
        }
        TweenOff() {
            let a = Laya.Tween.to(this.TweenskewY, { skewY: -90 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                this.hide();
            }), 0, true, true);
        }
        onHide() {
            ADManager.TAPoint(TaT.PageLeave, "xiangcepage");
            this.hide();
        }
    }

    class UITest extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.Data = [];
            this.str = {};
            this.Num = 0;
            this.Now = 0;
            this.Need = 0;
        }
        onInit() {
            this.first = this.vars("first");
            this.second = this.vars("second");
            this.third = this.vars("third");
            this.ADBtn = this.vars("ADBtn");
            this.Refresh();
            this.btnEv("BackBtn", () => {
                this.hide();
            });
            this.btnEv("ADBtn", () => {
                this.ADBtnClick();
            });
        }
        onShow() {
            ADManager.TAPoint(TaT.PageEnter, "shuiyipage");
            ADManager.TAPoint(TaT.BtnShow, "ADshuiyi_click");
            this.Refresh();
        }
        onHide() {
            ADManager.TAPoint(TaT.PageLeave, "shuiyipage");
            this.hide();
        }
        Refresh() {
            for (let index = 0; index < GameDataController.ClothPackge3.cloths1.length; index++) {
                this.Data[index] = GameDataController.ClothPackge3.cloths1[index];
            }
            this.Data.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[this.Data[i].ID];
                this.str[this.Data[i].ID] = nv;
            });
            this.Num = GameDataController.ClothAlllockNum(this.str);
            this.Now = this.Data.length - this.Num;
            this.Need = this.Data.length;
            this.ADBtn.visible = this.Num > 0;
            this.ShowADClickCount(this.Now);
        }
        ADBtnClick() {
            console.log("点击了广告");
            console.log(this.Now + "xxxxxxxxxxxxxx");
            ADManager.TAPoint(TaT.BtnClick, "ADshuiyi_click");
            ADManager.ShowReward(() => {
                this.GetAward();
            }, () => {
                UIMgr.show("UITip", () => {
                    this.GetAward();
                });
            });
        }
        GetAward() {
            for (let k in this.str) {
                if (this.str[k] == 1) {
                    let dataall = GameDataController.ClothDataRefresh;
                    dataall[k] = 0;
                    GameDataController.ClothDataRefresh = dataall;
                    Laya.LocalStorage.setJSON(this.Data[0].GetType2, this.str);
                    this.Refresh();
                    BagListController.Instance.refresh();
                    console.log("获取一件装扮");
                    UIMgr.tip("恭喜获得新衣服");
                    return;
                }
            }
        }
        ShowADClickCount(count) {
            switch (count) {
                case 0:
                    this.first.skin = "Egg2/tiao1.png";
                    this.second.skin = "Egg2/tiao1.png";
                    this.third.skin = "Egg2/tiao1.png";
                    break;
                case 1:
                    this.first.skin = "Egg2/tiao2.png";
                    this.second.skin = "Egg2/tiao1.png";
                    this.third.skin = "Egg2/tiao1.png";
                    break;
                case 2:
                    this.first.skin = "Egg2/tiao2.png";
                    this.second.skin = "Egg2/tiao2.png";
                    this.third.skin = "Egg2/tiao1.png";
                    break;
                case 3:
                    this.first.skin = "Egg2/tiao2.png";
                    this.second.skin = "Egg2/tiao2.png";
                    this.third.skin = "Egg2/tiao2.png";
                    break;
                default:
                    break;
            }
        }
    }

    class UIWing extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.CloseBtn = this.vars("CloseBtn");
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
            this.ADBtn = this.vars("ADBtn");
            this.btnEv("ADBtn", this.ADClick);
            this.BG = this.vars("BG");
            Laya.timer.frameLoop(1, this, () => {
                this.BG.rotation += 2;
            });
        }
        onShow() {
            ADManager.TAPoint(TaT.PageEnter, "chibangpage");
            ADManager.TAPoint(TaT.BtnShow, "ADwings_click");
        }
        onHide() {
            ADManager.TAPoint(TaT.PageLeave, "chibangpage");
            this.hide();
        }
        ADClick() {
            ADManager.TAPoint(TaT.BtnClick, "ADwings_click");
            ADManager.ShowReward(() => {
                this.Reward();
            }, () => {
                UIMgr.show("UITip", this.Reward);
            });
        }
        Reward() {
            let dataall = GameDataController.ClothDataRefresh;
            dataall[50404] = 0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.showList();
            UIMgr.tip("成功解锁翅膀!");
            this.hide();
        }
    }

    class UITip extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.func = null;
        }
        onInit() {
            this.CloseBtn = this.vars("CloseBtn");
            this.CloseBtn.visible = false;
            this.BG = this.vars("BG");
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
            this.ConfirmBtn = this.vars("ConfirmBtn");
            this.btnEv("ConfirmBtn", this.onConfirmBtnClick);
        }
        onRefresh() {
        }
        onShow(arg) {
            ADManager.TAPoint(TaT.BtnShow, "ADrewardbt_tishiAD");
            this.func = arg;
            this.CloseBtn.visible = false;
            Laya.timer.once(2000, this, () => {
                this.CloseBtn.visible = true;
            });
        }
        onHide() {
            this.hide();
        }
        onConfirmBtnClick() {
            ADManager.TAPoint(TaT.BtnClick, "ADrewardbt_tishiAD");
            ADManager.ShowReward(() => {
                this.func();
                this.hide();
            });
        }
    }

    class PickClothChange extends Laya.Script {
        onAwake() {
            PickClothChange.Instance = this;
            this.FemaleRoot = this.owner;
            this.Hair = this.FemaleRoot.getChildByName("Hair");
            this.Hair1 = this.FemaleRoot.getChildByName("Hair1");
            this.Ornament = this.FemaleRoot.getChildByName("Ornament");
            this.Ornament1 = this.FemaleRoot.getChildByName("Ornament1");
            this.Shirt = this.FemaleRoot.getChildByName("Shirt");
            this.Shirt1 = this.FemaleRoot.getChildByName("Shirt1");
            this.Trousers = this.FemaleRoot.getChildByName("Trousers");
            this.Trousers1 = this.FemaleRoot.getChildByName("Trousers1");
            this.Dress = this.FemaleRoot.getChildByName("Dress");
            this.Dress1 = this.FemaleRoot.getChildByName("Dress1");
            this.Socks = this.FemaleRoot.getChildByName("Socks");
            this.Socks1 = this.FemaleRoot.getChildByName("Socks1");
            this.Shose = this.FemaleRoot.getChildByName("Shose");
            this.Shose1 = this.FemaleRoot.getChildByName("Shose1");
            this.Coat = this.FemaleRoot.getChildByName("Coat");
            this.Coat1 = this.FemaleRoot.getChildByName("Coat1");
            for (let i = 0; i < 8; i++) {
                this._ClothChange(0, i);
            }
        }
        ChangeAllCloth() {
            this.HairChange(ClothChange.Instance.nowclothData.Hair);
            this.CoatChange(ClothChange.Instance.nowclothData.Coat);
            this.ShirtChange(ClothChange.Instance.nowclothData.Shirt);
            this.TrousersChange(ClothChange.Instance.nowclothData.Trousers);
            this.SocksChange(ClothChange.Instance.nowclothData.Socks);
            this.ShoseChange(ClothChange.Instance.nowclothData.Shose);
            this.OrnamentChange(ClothChange.Instance.nowclothData.Ornament);
            this.DressChange(ClothChange.Instance.nowclothData.Dress);
        }
        _ClothChange(itemID, type) {
            switch (type) {
                case clothtype.Hair:
                    this.HairChange(itemID);
                    break;
                case clothtype.Dress:
                    this.DressChange(itemID);
                    break;
                case clothtype.Coat:
                    this.CoatChange(itemID);
                    break;
                case clothtype.Shirt:
                    this.ShirtChange(itemID);
                    break;
                case clothtype.Trousers:
                    this.TrousersChange(itemID);
                    break;
                case clothtype.Socks:
                    this.SocksChange(itemID);
                    break;
                case clothtype.Shose:
                    this.ShoseChange(itemID);
                    break;
                case clothtype.Ornament:
                    this.OrnamentChange(itemID);
                    break;
            }
        }
        HairChange(itemID) {
            this.Hair.visible = this.Hair1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10002;
            }
            this.Hair.visible = this.Hair1.visible = true;
            let clothdata = GameDataController._clothData.get(itemID);
            this.Hair.zOrder = clothdata.Sort1;
            this.Hair1.zOrder = clothdata.Sort2;
            this.Hair.skin = clothdata.GetPath1();
            this.Hair1.skin = clothdata.GetPath2();
            this.Hair.centerX = clothdata.GetPosition1().x;
            this.Hair.centerY = clothdata.GetPosition1().y;
            this.Hair1.centerX = clothdata.GetPosition2().x;
            this.Hair1.centerY = clothdata.GetPosition2().y;
        }
        DressChange(itemID) {
            this.Dress.visible = this.Dress1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                this.UpDownOpen();
                return;
            }
            else {
                this.DressOpen();
            }
            if (itemID == 40502) {
                this.Shose.visible = this.Shose1.visible = false;
            }
            this.Dress.visible = this.Dress1.visible = true;
            this.UpDownClose();
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Dress.zOrder = clothdata.Sort1;
            this.Dress1.zOrder = clothdata.Sort2;
            this.Dress.skin = clothdata.GetPath1();
            this.Dress1.skin = clothdata.GetPath2();
            this.Dress.centerX = clothdata.GetPosition1().x;
            this.Dress.centerY = clothdata.GetPosition1().y;
            this.Dress1.centerX = clothdata.GetPosition2().x;
            this.Dress1.centerY = clothdata.GetPosition2().y;
        }
        CoatChange(itemID) {
            this.Coat.visible = this.Coat1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Coat.visible = this.Coat1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Coat.zOrder = clothdata.Sort1;
            this.Coat1.zOrder = clothdata.Sort2;
            this.Coat.skin = clothdata.GetPath1();
            this.Coat1.skin = clothdata.GetPath2();
            this.Coat.centerX = clothdata.GetPosition1().x;
            this.Coat.centerY = clothdata.GetPosition1().y;
            this.Coat1.centerX = clothdata.GetPosition2().x;
            this.Coat1.centerY = clothdata.GetPosition2().y;
        }
        ShirtChange(itemID) {
            this.Shirt.visible = this.Shirt1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10000;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.Shirt.visible = this.Shirt1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shirt.zOrder = clothdata.Sort1;
            this.Shirt1.zOrder = clothdata.Sort2;
            this.Shirt.skin = clothdata.GetPath1();
            this.Shirt1.skin = clothdata.GetPath2();
            this.Shirt.centerX = clothdata.GetPosition1().x;
            this.Shirt.centerY = clothdata.GetPosition1().y;
            this.Shirt1.centerX = clothdata.GetPosition2().x;
            this.Shirt1.centerY = clothdata.GetPosition2().y;
        }
        TrousersChange(itemID) {
            this.Trousers.visible = this.Trousers1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10001;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.Trousers.visible = this.Trousers1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Trousers.visible = this.Trousers1.visible = true;
            this.Trousers.zOrder = clothdata.Sort1;
            this.Trousers1.zOrder = clothdata.Sort2;
            this.Trousers.skin = clothdata.GetPath1();
            this.Trousers1.skin = clothdata.GetPath2();
            this.Trousers.centerX = clothdata.GetPosition1().x;
            this.Trousers.centerY = clothdata.GetPosition1().y;
            this.Trousers1.centerX = clothdata.GetPosition2().x;
            this.Trousers1.centerY = clothdata.GetPosition2().y;
        }
        SocksChange(itemID) {
            this.Socks1.visible = this.Socks.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Socks1.visible = this.Socks.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Socks.zOrder = clothdata.Sort1;
            this.Socks1.zOrder = clothdata.Sort2;
            this.Socks.skin = clothdata.GetPath1();
            this.Socks1.skin = clothdata.GetPath2();
            this.Socks.centerX = clothdata.GetPosition1().x;
            this.Socks.centerY = clothdata.GetPosition1().y;
            this.Socks1.centerX = clothdata.GetPosition2().x;
            this.Socks1.centerY = clothdata.GetPosition2().y;
        }
        ShoseChange(itemID) {
            this.Shose.visible = this.Shose1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Shose.visible = this.Shose1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shose.zOrder = clothdata.Sort1;
            this.Shose1.zOrder = clothdata.Sort2;
            this.Shose.skin = clothdata.GetPath1();
            this.Shose1.skin = clothdata.GetPath2();
            this.Shose.centerX = clothdata.GetPosition1().x;
            this.Shose.centerY = clothdata.GetPosition1().y;
            this.Shose1.centerX = clothdata.GetPosition2().x;
            this.Shose1.centerY = clothdata.GetPosition2().y;
        }
        OrnamentChange(itemID) {
            this.Ornament.visible = this.Ornament1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Ornament.visible = this.Ornament1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Ornament.zOrder = clothdata.Sort1;
            this.Ornament1.zOrder = clothdata.Sort2;
            this.Ornament.skin = clothdata.GetPath1();
            this.Ornament1.skin = clothdata.GetPath2();
            this.Ornament.centerX = clothdata.GetPosition1().x;
            this.Ornament.centerY = clothdata.GetPosition1().y;
            this.Ornament1.centerX = clothdata.GetPosition2().x;
            this.Ornament1.centerY = clothdata.GetPosition2().y;
        }
        UpDownOpen() {
            this.Shirt.visible = this.Shirt1.visible = true;
            this.Trousers.visible = this.Trousers1.visible = true;
        }
        UpDownClose() {
            this.ShirtChange(0);
            this.TrousersChange(0);
            this.Shirt.visible = this.Shirt1.visible = false;
            this.Trousers.visible = this.Trousers1.visible = false;
        }
        DressOpen() {
            this.Dress.visible = this.Dress1.visible = true;
        }
        DressClose() {
            this.DressChange(0);
            this.Dress.visible = this.Dress1.visible = false;
        }
    }

    class PickClothChangeT extends Laya.Script {
        onAwake() {
            PickClothChangeT.Instance = this;
            this.FemaleRoot = this.owner;
            this.Hair = this.FemaleRoot.getChildByName("Hair");
            this.Hair1 = this.FemaleRoot.getChildByName("Hair1");
            this.Ornament = this.FemaleRoot.getChildByName("Ornament");
            this.Ornament1 = this.FemaleRoot.getChildByName("Ornament1");
            this.Shirt = this.FemaleRoot.getChildByName("Shirt");
            this.Shirt1 = this.FemaleRoot.getChildByName("Shirt1");
            this.Trousers = this.FemaleRoot.getChildByName("Trousers");
            this.Trousers1 = this.FemaleRoot.getChildByName("Trousers1");
            this.Dress = this.FemaleRoot.getChildByName("Dress");
            this.Dress1 = this.FemaleRoot.getChildByName("Dress1");
            this.Socks = this.FemaleRoot.getChildByName("Socks");
            this.Socks1 = this.FemaleRoot.getChildByName("Socks1");
            this.Shose = this.FemaleRoot.getChildByName("Shose");
            this.Shose1 = this.FemaleRoot.getChildByName("Shose1");
            this.Coat = this.FemaleRoot.getChildByName("Coat");
            this.Coat1 = this.FemaleRoot.getChildByName("Coat1");
            for (let i = 0; i < 8; i++) {
                this._ClothChange(0, i);
            }
        }
        HairRandomFuc() {
            let a = GameDataController.HairData.length;
            let b = Util.randomInRange_i(0, a - 1);
            let c = GameDataController.HairData[b].ID;
            return c;
        }
        DressRandomFuc() {
            let a = GameDataController.DressData.length;
            let b = Util.randomInRange_i(0, a - 1);
            let c = GameDataController.DressData[b].ID;
            return c;
        }
        ShirtRandomFuc() {
            let a = GameDataController.ShirtData.length;
            let b = Util.randomInRange_i(0, a - 1);
            let c = GameDataController.ShirtData[b].ID;
            return c;
        }
        TrousersRandomFuc() {
            let a = GameDataController.TrousersData.length;
            let b = Util.randomInRange_i(0, a - 1);
            let c = GameDataController.TrousersData[b].ID;
            return c;
        }
        SocksRandomFuc() {
            let a = GameDataController.SocksData.length;
            let b = Util.randomInRange_i(0, a - 1);
            let c = GameDataController.SocksData[b].ID;
            return c;
        }
        ShoseRandomFuc() {
            let a = GameDataController.ShoseData.length;
            let b = Util.randomInRange_i(0, a - 1);
            let c = GameDataController.ShoseData[b].ID;
            return c;
        }
        OrnamentRandomFuc() {
            let a = GameDataController.OrnamentData.length;
            let b = Util.randomInRange_i(0, a - 1);
            let c = GameDataController.OrnamentData[b].ID;
            return c;
        }
        ChangeAllCloth() {
            this.HairChange(this.HairRandomFuc());
            this.OrnamentChange(this.OrnamentRandomFuc());
            this.CoatChange(0);
            this.ShirtChange(this.ShirtRandomFuc());
            this.SocksChange(this.SocksRandomFuc());
            this.TrousersChange(this.TrousersRandomFuc());
            this.DressChange(this.DressRandomFuc());
            this.ShoseChange(this.ShoseRandomFuc());
        }
        _ClothChange(itemID, type) {
            switch (type) {
                case clothtype.Hair:
                    this.HairChange(itemID);
                    break;
                case clothtype.Dress:
                    this.DressChange(itemID);
                    break;
                case clothtype.Coat:
                    this.CoatChange(itemID);
                    break;
                case clothtype.Shirt:
                    this.ShirtChange(itemID);
                    break;
                case clothtype.Trousers:
                    this.TrousersChange(itemID);
                    break;
                case clothtype.Socks:
                    this.SocksChange(itemID);
                    break;
                case clothtype.Shose:
                    this.ShoseChange(itemID);
                    break;
                case clothtype.Ornament:
                    this.OrnamentChange(itemID);
                    break;
            }
        }
        HairChange(itemID) {
            this.Hair.visible = this.Hair1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10002;
            }
            this.Hair.visible = this.Hair1.visible = true;
            let clothdata = GameDataController._clothData.get(itemID);
            this.Hair.zOrder = clothdata.Sort1;
            this.Hair1.zOrder = clothdata.Sort2;
            this.Hair.skin = clothdata.GetPath1();
            this.Hair1.skin = clothdata.GetPath2();
            this.Hair.centerX = clothdata.GetPosition1().x;
            this.Hair.centerY = clothdata.GetPosition1().y;
            this.Hair1.centerX = clothdata.GetPosition2().x;
            this.Hair1.centerY = clothdata.GetPosition2().y;
        }
        DressChange(itemID) {
            this.Dress.visible = this.Dress1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                this.UpDownOpen();
                return;
            }
            else {
                this.DressOpen();
            }
            if (itemID == 40502) {
                this.Shose.visible = this.Shose1.visible = false;
            }
            this.Dress.visible = this.Dress1.visible = true;
            this.UpDownClose();
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Dress.zOrder = clothdata.Sort1;
            this.Dress1.zOrder = clothdata.Sort2;
            this.Dress.skin = clothdata.GetPath1();
            this.Dress1.skin = clothdata.GetPath2();
            this.Dress.centerX = clothdata.GetPosition1().x;
            this.Dress.centerY = clothdata.GetPosition1().y;
            this.Dress1.centerX = clothdata.GetPosition2().x;
            this.Dress1.centerY = clothdata.GetPosition2().y;
        }
        CoatChange(itemID) {
            this.Coat.visible = this.Coat1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Coat.visible = this.Coat1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Coat.zOrder = clothdata.Sort1;
            this.Coat1.zOrder = clothdata.Sort2;
            this.Coat.skin = clothdata.GetPath1();
            this.Coat1.skin = clothdata.GetPath2();
            this.Coat.centerX = clothdata.GetPosition1().x;
            this.Coat.centerY = clothdata.GetPosition1().y;
            this.Coat1.centerX = clothdata.GetPosition2().x;
            this.Coat1.centerY = clothdata.GetPosition2().y;
        }
        ShirtChange(itemID) {
            this.Shirt.visible = this.Shirt1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10000;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.Shirt.visible = this.Shirt1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shirt.zOrder = clothdata.Sort1;
            this.Shirt1.zOrder = clothdata.Sort2;
            this.Shirt.skin = clothdata.GetPath1();
            this.Shirt1.skin = clothdata.GetPath2();
            this.Shirt.centerX = clothdata.GetPosition1().x;
            this.Shirt.centerY = clothdata.GetPosition1().y;
            this.Shirt1.centerX = clothdata.GetPosition2().x;
            this.Shirt1.centerY = clothdata.GetPosition2().y;
        }
        TrousersChange(itemID) {
            this.Trousers.visible = this.Trousers1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 10001;
            }
            else {
                this.DressClose();
                this.UpDownOpen();
            }
            this.Trousers.visible = this.Trousers1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Trousers.visible = this.Trousers1.visible = true;
            this.Trousers.zOrder = clothdata.Sort1;
            this.Trousers1.zOrder = clothdata.Sort2;
            this.Trousers.skin = clothdata.GetPath1();
            this.Trousers1.skin = clothdata.GetPath2();
            this.Trousers.centerX = clothdata.GetPosition1().x;
            this.Trousers.centerY = clothdata.GetPosition1().y;
            this.Trousers1.centerX = clothdata.GetPosition2().x;
            this.Trousers1.centerY = clothdata.GetPosition2().y;
        }
        SocksChange(itemID) {
            this.Socks1.visible = this.Socks.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Socks1.visible = this.Socks.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Socks.zOrder = clothdata.Sort1;
            this.Socks1.zOrder = clothdata.Sort2;
            this.Socks.skin = clothdata.GetPath1();
            this.Socks1.skin = clothdata.GetPath2();
            this.Socks.centerX = clothdata.GetPosition1().x;
            this.Socks.centerY = clothdata.GetPosition1().y;
            this.Socks1.centerX = clothdata.GetPosition2().x;
            this.Socks1.centerY = clothdata.GetPosition2().y;
        }
        ShoseChange(itemID) {
            this.Shose.visible = this.Shose1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Shose.visible = this.Shose1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            this.Shose.zOrder = clothdata.Sort1;
            this.Shose1.zOrder = clothdata.Sort2;
            this.Shose.skin = clothdata.GetPath1();
            this.Shose1.skin = clothdata.GetPath2();
            this.Shose.centerX = clothdata.GetPosition1().x;
            this.Shose.centerY = clothdata.GetPosition1().y;
            this.Shose1.centerX = clothdata.GetPosition2().x;
            this.Shose1.centerY = clothdata.GetPosition2().y;
        }
        OrnamentChange(itemID) {
            this.Ornament.visible = this.Ornament1.visible = false;
            if (itemID == null || itemID == 0) {
                itemID = 0;
                return;
            }
            this.Ornament.visible = this.Ornament1.visible = true;
            let clothdata = GameDataController._ClothData.get(itemID);
            console.log(clothdata);
            this.Ornament.zOrder = clothdata.Sort1;
            this.Ornament1.zOrder = clothdata.Sort2;
            this.Ornament.skin = clothdata.GetPath1();
            this.Ornament1.skin = clothdata.GetPath2();
            this.Ornament.centerX = clothdata.GetPosition1().x;
            this.Ornament.centerY = clothdata.GetPosition1().y;
            this.Ornament1.centerX = clothdata.GetPosition2().x;
            this.Ornament1.centerY = clothdata.GetPosition2().y;
        }
        UpDownOpen() {
            this.Shirt.visible = this.Shirt1.visible = true;
            this.Trousers.visible = this.Trousers1.visible = true;
        }
        UpDownClose() {
            this.ShirtChange(0);
            this.TrousersChange(0);
            this.Shirt.visible = this.Shirt1.visible = false;
            this.Trousers.visible = this.Trousers1.visible = false;
        }
        DressOpen() {
            this.Dress.visible = this.Dress1.visible = true;
        }
        DressClose() {
            this.DressChange(0);
            this.Dress.visible = this.Dress1.visible = false;
        }
    }

    class RankItem extends Laya.Script {
        constructor() {
            super(...arguments);
            this.Datas = [];
        }
        onAwake() {
            let item = this.owner;
            this.Name = item.getChildByName("Name");
            this.WinCount = item.getChildByName("WinCount");
            this.RankNum = item.getChildByName("RankNum");
            this.Top1 = item.getChildByName("Top1");
            this.Top2 = item.getChildByName("Top2");
            this.Top3 = item.getChildByName("Top3");
            this.BG_white = item.getChildByName("BG_white");
            this.BG_yellow = item.getChildByName("BG_Yellow");
            this.IconParent = item.getChildByName("IconParent");
            this.hairBox = this.IconParent.getChildByName("hairBox");
        }
        fell(mess, index) {
            this.Datas = mess;
            this.Name.text = this.Datas[index].Name;
            this.WinCount.text = "胜场:" + this.Datas[index].Num.toString();
            this.RankNum.text = (index + 1).toString();
            this.RankNum.visible = true;
            this.Top1.visible = false;
            this.Top2.visible = false;
            this.Top3.visible = false;
            this.BG_white.visible = true;
            this.BG_yellow.visible = false;
            for (let i = 0; i < this.hairBox.numChildren; i++) {
                let c = this.hairBox.getChildAt(i);
                c.visible = false;
            }
            if (this.Datas[index].Name == "我") {
                this.BG_white.visible = false;
                this.BG_yellow.visible = true;
            }
            this.Top1.visible = index == 0;
            this.Top2.visible = index == 1;
            this.Top3.visible = index == 2;
            if (this.Top1.visible || this.Top2.visible || this.Top3.visible) {
                this.RankNum.visible = false;
            }
            let a = Util.randomInRange_i(0, this.hairBox.numChildren - 1);
            let b = this.hairBox.getChildAt(a);
            b.visible = true;
        }
    }

    class UIRank extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.rankisopen = false;
            this.Data = [];
            this.isLookVideo = false;
        }
        onInit() {
            UIRank.ins = this;
            this.BackBtn = this.vars("BackBtn");
            this.Pick = this.vars("Pick");
            this.RankListBtn = this.vars("RankListBtn");
            this.FemaleRoot = this.vars("FemaleRoot");
            this.RankListBox = this.vars("RankListBox");
            this._PickClothChange = this.FemaleRoot.getComponent(PickClothChange);
            this.btnEv("BackBtn", () => {
                this.hide();
            });
            this.btnEv("RankListBtn", () => {
                ADManager.TAPoint(TaT.BtnClick, "phb_turn");
                this.ShowRankListBtnClick();
            });
            this.btnEv("Pick", () => {
                RecordManager.stopAutoRecord();
                RecordManager.startAutoRecord();
                if (parseInt(Laya.LocalStorage.getItem("PickNum")) == 0) {
                    this.ADClick();
                }
                else {
                    this.PickBtnClick();
                }
            });
            this.LRank = TweenMgr.tweenCust(300, this, this.tweenRankLeft, null, true, Laya.Ease.linearNone);
            this.RRank = TweenMgr.tweenCust(300, this, this.tweenRankRight, null, true, Laya.Ease.linearNone);
            this.FRL = TweenMgr.tweenCust(300, this, this.tweenFemaleRootLeft, null, true, Laya.Ease.linearNone);
            this.FRR = TweenMgr.tweenCust(300, this, this.tweenFemaleRootRight, null, true, Laya.Ease.linearNone);
            this.PickNumImage = this.vars("PickNumImage");
            this.PickNum = this.vars("PickNum");
            this.PickNum.text = Laya.LocalStorage.getItem("PickNum");
            this.ADImage = this.vars("ADImage");
            this.RankList = this.vars("RankList");
            this.RankList.vScrollBarSkin = "";
            this.Refresh();
            this.RankList.renderHandler = new Laya.Handler(this, this.onWrapItem);
            this.RankList.refresh();
        }
        onWrapItem(cell, index) {
            cell.getComponent(RankItem).fell(this.Data, index);
        }
        Refresh() {
            for (let index = 0; index < GameDataController.PickData.length; index++) {
                if (GameDataController.PickData[index].Name == "我") {
                    GameDataController.PickData[index].Num = parseInt(Laya.LocalStorage.getItem("TodayWinNum"));
                }
            }
            GameDataController.PickData.sort((a, b) => {
                return b.Num - a.Num;
            });
            for (let i = 0; i < GameDataController.PickData.length; i++) {
                this.Data[i] = GameDataController.PickData[i];
            }
            this.RankList.refresh();
            this.RankList.array = this.Data;
        }
        onShow() {
            ADManager.TAPoint(TaT.BtnShow, "meiripk_turn");
            ADManager.TAPoint(TaT.BtnShow, "ADpk_turn");
            ADManager.TAPoint(TaT.BtnShow, "phb_turn");
            this.isLookVideo = false;
            this._PickClothChange.ChangeAllCloth();
            if (Laya.LocalStorage.getItem("PickNum") == "0") {
                this.ADImage.visible = true;
                this.PickNumImage.visible = false;
            }
        }
        tweenRankLeft(t) {
            console.log(this.RankListBox);
            console.log("RankListBox.............");
            let nbtm = this.RankListBox.right;
            TweenMgr.lerp_Num(nbtm, 0, t);
            this.RankListBox.right = t.outParams[0][0];
        }
        tweenRankRight(t) {
            let nbtm = this.RankListBox.right;
            TweenMgr.lerp_Num(nbtm, -316, t);
            this.RankListBox.right = t.outParams[0][0];
        }
        tweenFemaleRootLeft(t) {
            let nbtm = this.FemaleRoot.centerX;
            TweenMgr.lerp_Num(nbtm, -119, t);
            this.FemaleRoot.centerX = t.outParams[0][0];
        }
        tweenFemaleRootRight(t) {
            let nbtm = this.FemaleRoot.centerX;
            TweenMgr.lerp_Num(nbtm, -19, t);
            this.FemaleRoot.centerX = t.outParams[0][0];
        }
        ShowRankListBtnClick() {
            this.rankisopen = !this.rankisopen;
            if (this.rankisopen) {
                this.LRank.play();
                this.FRL.play();
            }
            else {
                this.RRank.play();
                this.FRR.play();
            }
        }
        PickBtnClick() {
            ADManager.TAPoint(TaT.BtnClick, "meiripk_turn");
            GameDataController.TodaySign = "1";
            GameDataController.SetLastTime();
            let a = Laya.LocalStorage.getItem("PickNum");
            let b = parseInt(a);
            if (b > 0) {
                UIMgr.show("UIPickLoading");
                b--;
                Laya.LocalStorage.setItem("PickNum", b.toString());
                this.PickNum.text = b.toString();
                if (b <= 0) {
                    this.ADImage.visible = true;
                    this.PickNumImage.visible = false;
                }
            }
        }
        ADImageClick() {
            ADManager.TAPoint(TaT.BtnClick, "ADpk_turn");
            ADManager.ShowReward(() => {
                let a = Laya.LocalStorage.getItem("PickNum");
                let b = parseInt(a);
                b++;
                Laya.LocalStorage.setItem("PickNum", b.toString());
                this.PickNum.text = b.toString();
                this.isLookVideo = true;
                UIMgr.tip("PK次数+1");
            }, () => {
                UIMgr.show("UITip", () => {
                    let a = Laya.LocalStorage.getItem("PickNum");
                    let b = parseInt(a);
                    b++;
                    Laya.LocalStorage.setItem("PickNum", b.toString());
                    this.PickNum.text = b.toString();
                    this.isLookVideo = true;
                    UIMgr.tip("PK次数+1");
                });
            });
        }
        ADClick() {
            this.ADImage.visible = true;
            this.PickNumImage.visible = false;
            ADManager.TAPoint(TaT.BtnClick, "ADpk_turn");
            ADManager.ShowReward(() => {
                UIMgr.show("UIPickLoading");
                UIMgr.tip("PK次数+1");
                this.isLookVideo = true;
            });
        }
        onHide() {
            UIMgr.get("UIReady").isPicking = false;
            RecordManager.stopAutoRecord();
            console.log("关闭了UIRank");
        }
    }

    class UIPick extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.otherCount = 0;
            this.myCount = 0;
            this.otherNum = 0;
            this.myNum = 0;
            this.isWin = false;
            this.isLose = false;
            this.PickCount = 0;
        }
        onInit() {
            this.FemaleRoot = this.vars("FemaleRoot");
            this._PickClothChange = this.FemaleRoot.getComponent(PickClothChange);
            this.FemaleRoot1 = this.vars("FemaleRoot1");
            this._PickClothChangT = this.FemaleRoot1.getComponent(PickClothChangeT);
            this.BackBtn = this.vars("BackBtn");
            this.BackBtn.visible = false;
            this.btnEv("BackBtn", () => {
                this.hide();
            });
            this.FRToLeft = TweenMgr.tweenCust(1000, this, this.tweenFRToLeft, null, true, Laya.Ease.backOut);
            this.FRToRight = TweenMgr.tweenCust(1000, this, this.tweenFRToRight, null, true, Laya.Ease.backOut);
            this.Vote_other = this.vars("Vote_other");
            this.otherPre = this.Vote_other.getChildByName("otherPre");
            this.Vote_me = this.vars("Vote_me");
            this.myPre = this.Vote_me.getChildByName("myPre");
            this.WinMark = this.vars("WinMark");
            this.LoseMark = this.vars("LoseMark");
            this.Light = this.vars("Light");
            this.WinUI = this.vars("WinUI");
            this.LoseUI = this.vars("LoseUI");
            this.WinBox = this.WinUI.getChildByName("WinBox");
            this.LoseBox = this.LoseUI.getChildByName("LoseBox");
            this.OkBtn = this.WinBox.getChildByName("OkBtn");
            this.NoBtn = this.WinBox.getChildByName("NoBtn");
            this.VoteNum = this.LoseBox.getChildByName("VoteNum");
            this.ContinueBtn = this.LoseBox.getChildByName("ContinueBtn");
            this.btnEv("OkBtn", this.OkBtnClick);
            this.btnEv("NoBtn", this.NoBtnClick);
            this.btnEv("ContinueBtn", this.ContinueBtnClick);
            this.ShareUI = this.vars("ShareUI");
            this.ShareUI.visible = false;
            this.ShareBox = this.ShareUI.getChildByName("ShareBox");
            this.ShareBtn = this.ShareBox.getChildByName("ShareBtn");
            this.CloseBtn = this.ShareBox.getChildByName("CloseBtn");
            this.btnEv("ShareBtn", this.ShareBtnClick);
            this.btnEv("CloseBtn", this.CloseBtnClick);
        }
        onShow() {
            ADManager.TAPoint(TaT.BtnShow, "fxpk_turn");
            ADManager.TAPoint(TaT.BtnShow, "nofx_turn");
            ADManager.TAPoint(TaT.BtnShow, "ADpkjiesuan_turn");
            ADManager.TAPoint(TaT.BtnShow, "pkpt_turn");
            this.FRToRight.play();
            this.FRToLeft.play();
            this._PickClothChange.ChangeAllCloth();
            this._PickClothChangT.ChangeAllCloth();
            Laya.timer.once(1000, this, this.PickFuc);
        }
        onHide() {
            this.otherPre.text = "0";
            this.myPre.text = "0";
            this.otherNum = 0;
            this.myNum = 0;
            this.WinMark.visible = false;
            this.LoseMark.visible = false;
            this.Light.visible = false;
            this.WinUI.visible = false;
            this.LoseUI.visible = false;
            this.isWin = false;
            this.isLose = false;
            this.FemaleRoot.centerX = 492;
            this.FemaleRoot1.centerX = -484;
            this.BackBtn.visible = false;
            EventMgr.notify(Task.EventType.PK);
            Laya.timer.clear(this, this.PickFuc);
        }
        tweenFRToLeft(t) {
            TweenMgr.lerp_Num(this.FemaleRoot.centerX, 156, t);
            this.FemaleRoot.centerX = t.outParams[0][0];
        }
        tweenFRToRight(t) {
            TweenMgr.lerp_Num(this.FemaleRoot1.centerX, -147, t);
            this.FemaleRoot1.centerX = t.outParams[0][0];
        }
        PickFuc() {
            let i = Util.randomInRange_i(0, 10);
            console.log(i);
            if (UIRank.ins.isLookVideo) {
                this.WinVoteRadomFuc();
                console.log("必赢..........");
                return;
            }
            let a = parseInt(Laya.LocalStorage.getItem("PickNum"));
            if (a == 1 || a == 2 || a == 4) {
                this.WinVoteRadomFuc();
            }
            else {
                this.LoseVoteRadomFuc();
            }
        }
        WinVoteRadomFuc() {
            this.otherCount = Util.randomInRange_i(300, 400);
            this.myCount = Util.randomInRange_i(400, 600);
            Laya.timer.loop(3, this, this.otherPreAdd);
            Laya.timer.loop(3, this, this.myPreAdd);
        }
        LoseVoteRadomFuc() {
            this.otherCount = Util.randomInRange_i(400, 600);
            this.myCount = Util.randomInRange_i(300, 400);
            Laya.timer.loop(3, this, this.otherPreAdd);
            Laya.timer.loop(3, this, this.myPreAdd);
        }
        otherPreAdd() {
            this.otherNum += 1;
            this.otherPre.text = this.otherNum + "";
            if (this.otherNum >= this.otherCount) {
                Laya.timer.clear(this, this.otherPreAdd);
                Laya.timer.once(1000, this, this.checkLose);
            }
        }
        myPreAdd() {
            this.myNum += 1;
            this.myPre.text = this.myNum + "";
            if (this.myNum >= this.myCount) {
                Laya.timer.clear(this, this.myPreAdd);
                Laya.timer.once(1000, this, this.checkWin);
            }
        }
        checkWin() {
            if (this.myCount > this.otherCount) {
                this.isWin = true;
                this.Light.visible = true;
                this.WinMark.visible = true;
                this.BackBtn.visible = true;
            }
            if (this.isWin) {
                this.PickWin();
                Laya.timer.once(1000, this, () => {
                    this.WinUI.visible = true;
                });
            }
        }
        checkLose() {
            if (this.myCount < this.otherCount) {
                this.LoseMark.visible = true;
                this.isLose = true;
                this.BackBtn.visible = true;
            }
            if (this.isLose) {
                Laya.timer.once(1000, this, () => {
                    this.LoseUI.visible = true;
                    this.VoteNum.text = this.myPre.text;
                });
            }
        }
        OkBtnClick() {
            ADManager.TAPoint(TaT.BtnClick, "ADpkjiesuan_turn");
            ADManager.ShowReward(() => {
                this.PickWin();
            }, () => {
                UIMgr.show("UITip", () => {
                    this.PickWin();
                });
            });
            this.WinUI.visible = false;
            this.ShareUI.visible = true;
            RecordManager.stopAutoRecord();
        }
        NoBtnClick() {
            ADManager.TAPoint(TaT.BtnClick, "pkpt_turn");
            this.WinUI.visible = false;
            this.ShareUI.visible = true;
            RecordManager.stopAutoRecord();
        }
        ContinueBtnClick() {
            this.LoseUI.visible = false;
            this.hide();
        }
        PickWin() {
            let a = Laya.LocalStorage.getItem("TodayWinNum");
            let b = parseInt(a);
            b += 1;
            Laya.LocalStorage.setItem("TodayWinNum", b.toString());
            UIMgr.tip("今日胜场+1");
            UIMgr.get("UIRank").Refresh();
        }
        ShareBtnClick() {
            console.log("PK分享.........");
            ADManager.TAPoint(TaT.BtnClick, "fxpk_turn");
            RecordManager._share(() => {
                UIMgr.tip("分享成功");
                this.ShareUI.visible = false;
            }, () => {
            });
        }
        CloseBtnClick() {
            ADManager.TAPoint(TaT.BtnClick, "nofx_turn");
            this.ShareUI.visible = false;
            this.hide();
        }
    }

    class UIPickLoading extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.loading = this.vars("loading");
        }
        onShow() {
            Laya.timer.loop(10, this, this.onValueChange);
        }
        onValueChange() {
            if (this.loading.width >= 434) {
                this.loading.width = 434;
                Laya.timer.clear(this, this.onValueChange);
                Laya.timer.once(1000, this, () => {
                    this.hide();
                    UIMgr.show("UIPick");
                });
            }
            this.loading.width += 5;
        }
        onHide() {
            this.loading.width = 0;
        }
    }

    class UIPickReward extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.Data = [];
            this.str = {};
        }
        onInit() {
            this.ADBtn = this.vars("ADBtn");
            this.btnEv("ADBtn", this.ADBtnClick);
            this.CloseBtn = this.vars("CloseBtn");
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
        }
        onShow() {
            this.Data = GameDataController.ClothPackge1.cloths1;
            this.Data.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[this.Data[i].ID];
                this.str[this.Data[i].ID] = nv;
            });
            console.log(this.Data);
        }
        ADBtnClick() {
            ADManager.ShowReward(() => {
                this.GetAward();
            }, () => {
                UIMgr.show("UITip", () => {
                    this.GetAward();
                });
            });
        }
        GetAward() {
            for (let k in this.str) {
                console.log(this.str[k]);
                if (this.str[k] == 1) {
                    let dataall = GameDataController.ClothDataRefresh;
                    dataall[k] = 0;
                    GameDataController.ClothDataRefresh = dataall;
                    Laya.LocalStorage.setJSON(this.Data[0].GetType2, this.str);
                    BagListController.Instance.refresh();
                    UIMgr.tip("恭喜获得一套新衣服");
                }
            }
            this.hide();
        }
    }

    class UICombine extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.count = 0;
            this.isWatchAD = true;
            this.str = {};
            this.ClickNum = 0;
        }
        onInit() {
            this.First = this.vars("First");
            this.ConfirmBtn = this.vars("ConfirmBtn");
            this.ConfirmBtn.on(Laya.Event.CLICK, this, () => {
                this.HeCheng.visible = true;
                this.First.visible = false;
            });
            this.HeCheng = this.vars("HeCheng");
            this.CombineBtn = this.HeCheng.getChildByName("CombineBtn");
            this.Yanzhi = this.HeCheng.getChildByName("Yanzhi");
            this.Fu = this.HeCheng.getChildByName("Fu");
            this.QiZhi = this.HeCheng.getChildByName("QiZhi");
            this.Aiqing = this.HeCheng.getChildByName("Aiqing");
            this.Shuidi = this.HeCheng.getChildByName("Shuidi");
            this.FuHei = this.HeCheng.getChildByName("FuHei");
            this.Title = this.HeCheng.getChildByName("Title");
            this.CombineBtn.on(Laya.Event.CLICK, this, this.DanShengShow);
            this.HCCloseBtn = this.HeCheng.getChildByName("HCCloseBtn");
            this.HCCloseBtn.on(Laya.Event.CLICK, this, () => {
                RecordManager.stopAutoRecord();
                this.hide();
            });
            this.Wan = this.HeCheng.getChildByName("Wan");
            this.mask = this.vars("Mask");
            this.QiZhi.on(Laya.Event.CLICK, this, this.QiZhiClick);
            this.Yanzhi.on(Laya.Event.CLICK, this, this.YanzhiClick);
            this.Fu.on(Laya.Event.CLICK, this, this.FuClick);
            this.Aiqing.on(Laya.Event.CLICK, this, this.AiqingClick);
            this.FuHei.on(Laya.Event.CLICK, this, this.FuHeiClick);
            this.Title.on(Laya.Event.CLICK, this, this.TitleClick);
            this.DanSheng = this.vars("DanSheng");
            this.Guanghuan = this.DanSheng.getChildByName("Guanghuan");
            this.StartBtn = this.DanSheng.getChildByName("StartBtn");
            this.Role = this.DanSheng.getChildByName("Role");
            this.CloseBtn = this.DanSheng.getChildByName("CloseBtn");
            this.StartBtn.on(Laya.Event.CLICK, this, () => {
                ADManager.TAPoint(TaT.BtnClick, "zaoren_click");
                RecordManager.stopAutoRecord();
                RecordManager._share(() => {
                    UIMgr.tip("视频分享成功！");
                    this.hide();
                }, () => {
                    UIMgr.tip("视频分享失败...");
                    this.hide();
                });
            });
            this.CloseBtn.on(Laya.Event.CLICK, this, () => {
                RecordManager.stopAutoRecord();
                this.hide();
            });
            this.CheckBtn = this.DanSheng.getChildByName("CheckBtn");
            this.GetAwardBtn = this.DanSheng.getChildByName("GetAwardBtn");
            this.CheckBtn.on(Laya.Event.CLICK, this, () => {
                this.isWatchAD = !this.isWatchAD;
                this.CheckBtn.getChildAt(0).visible = !this.CheckBtn.getChildAt(0).visible;
                this.GetAwardBtn.getChildAt(0).visible = this.isWatchAD;
                this.GetAwardBtn.getChildAt(1).visible = !this.isWatchAD;
            });
            this.GetAwardBtn.on(Laya.Event.CLICK, this, this.GetAwardBtnClick);
        }
        onShow() {
            RecordManager.startAutoRecord();
            if (GameDataController.ClothDataRefresh[40201] == 0 && GameDataController.ClothDataRefresh[40306] == 0 && GameDataController.ClothDataRefresh[40504] == 0) {
                this.GetAwardBtn.visible = false;
                this.CheckBtn.visible = false;
                this.StartBtn.x = 236;
                this.StartBtn.y = 1042;
            }
            this.First.visible = true;
            this.HeCheng.visible = false;
            this.Shuidi.visible = false;
            this.DanSheng.visible = false;
            this.isWatchAD = true;
            this.CheckBtn.getChildAt(0).visible = true;
            this.GetAwardBtn.getChildAt(0).visible = this.isWatchAD;
            this.GetAwardBtn.getChildAt(1).visible = !this.isWatchAD;
            this.count = 0;
            this.QiZhi.on(Laya.Event.CLICK, this, this.QiZhiClick);
            this.Yanzhi.on(Laya.Event.CLICK, this, this.YanzhiClick);
            this.Fu.on(Laya.Event.CLICK, this, this.FuClick);
            this.FuHei.on(Laya.Event.CLICK, this, this.FuHeiClick);
            this.Aiqing.on(Laya.Event.CLICK, this, this.AiqingClick);
            this.Fu.getChildAt(0).visible = true;
            this.QiZhi.getChildAt(0).visible = true;
            this.Aiqing.getChildAt(0).visible = true;
            this.FuHei.getChildAt(0).visible = true;
            this.FuHei.x = 343;
            this.FuHei.y = 203;
            this.GetAwardBtn.visible = true;
            this.CheckBtn.visible = true;
            this.StartBtn.x = 393;
            this.StartBtn.y = 1042;
            Laya.timer.once(3000, this, () => {
                this.HCCloseBtn.visible = true;
            });
            ADManager.TAPoint(TaT.BtnShow, "zaoren_click");
        }
        onHide() {
            this.Shuidi.visible = false;
            this.DanSheng.visible = false;
            this.CloseBtn.visible = false;
            Laya.timer.clear(this, this.GuangHuanRot);
            this.HCCloseBtn.visible = false;
            this.mask.centerY = 100;
        }
        GuangHuanRot() {
            this.Guanghuan.rotation += 2;
        }
        QiZhiClick() {
            ADManager.ShowReward(() => {
                this.QiZhi.getChildAt(0).visible = false;
                this.owner["QiZhiAni"].play(0, false);
                this.count++;
                Laya.timer.frameOnce(35, this, () => {
                    this.mask.centerY -= 15;
                });
                this.QiZhi.off(Laya.Event.CLICK, this, this.QiZhiClick);
            });
        }
        YanzhiClick() {
            this.ClickNum += 1;
            this.owner["YanZhiAni"].play(0, false);
            this.count++;
            Laya.timer.frameOnce(35, this, () => {
                this.mask.centerY -= 15;
            });
            this.Yanzhi.off(Laya.Event.CLICK, this, this.YanzhiClick);
        }
        FuClick() {
            ADManager.ShowReward(() => {
                this.ClickNum += 1;
                this.Fu.getChildAt(0).visible = false;
                this.owner["FuAni"].play(0, false);
                this.count++;
                Laya.timer.frameOnce(35, this, () => {
                    this.mask.centerY -= 15;
                });
                this.Fu.off(Laya.Event.CLICK, this, this.FuClick);
            });
        }
        AiqingClick() {
            ADManager.ShowReward(() => {
                this.Aiqing.getChildAt(0).visible = false;
                this.owner["AiqingAni"].play(0, false);
                this.count++;
                Laya.timer.frameOnce(35, this, () => {
                    this.mask.centerY -= 15;
                });
                this.Aiqing.off(Laya.Event.CLICK, this, this.AiqingClick);
            });
        }
        FuHeiClick() {
            ADManager.ShowReward(() => {
                this.ClickNum += 1;
                this.FuHei.getChildAt(0).visible = false;
                this.owner["FuHeiAni"].play(0, false);
                this.count++;
                Laya.timer.frameOnce(35, this, () => {
                    this.mask.centerY -= 15;
                });
                this.FuHei.off(Laya.Event.CLICK, this, this.FuHeiClick);
            });
        }
        TitleClick() {
            this.FuHei.x = 353.5;
            this.FuHei.y = 902;
        }
        DanShengShow() {
            if (this.ClickNum == 3 && GameDataController.ClothDataRefresh[71001] == 1) {
                console.log("xxxxxxxxxxxx");
                this.Datas = GameDataController.ClothPackge3.cloths1;
                this.Refresh();
                ADManager.ShowReward(() => {
                    this.DanSheng.visible = true;
                    this.HeCheng.visible = false;
                    Laya.timer.loop(10, this, this.GuangHuanRot);
                    Laya.timer.once(3000, this, () => {
                        this.CloseBtn.visible = true;
                    });
                    this.Role.skin = "Cloth/Hair/71001_1.png";
                    this.Role.scaleX = 1;
                    this.Role.scaleY = 1;
                });
            }
            else if (this.count >= 3) {
                ADManager.ShowReward(() => {
                    this.DanSheng.visible = true;
                    this.RoleRandom();
                    Laya.timer.loop(10, this, this.GuangHuanRot);
                    Laya.timer.once(3000, this, () => {
                        this.CloseBtn.visible = true;
                    });
                    this.HeCheng.visible = false;
                });
            }
            else {
                UIMgr.tip("至少增加三种属性才能够合成哦");
            }
        }
        RoleRandom() {
            let r = Util.randomInRange_i(1, 3);
            this.Role.skin = "Active/taozhuang" + r + ".png";
            this.Role.scaleX = 1.7;
            this.Role.scaleY = 1.7;
            if (r == 1) {
                this.Datas = GameDataController.ClothPackge2.cloths3;
            }
            if (r == 2) {
                this.Datas = GameDataController.ClothPackge2.cloths1;
            }
            if (r == 3) {
                this.Datas = GameDataController.ClothPackge2.cloths2;
            }
            this.Refresh();
            if (GameDataController.ClothDataRefresh[this.Datas[this.Datas.length - 1].ID] == 0) {
                this.GetAwardBtn.visible = false;
                this.CheckBtn.visible = false;
                this.StartBtn.x = 236;
                this.StartBtn.y = 1042;
            }
            console.log(r);
            console.log(this.Datas[0].GetType2);
            console.log(this.str);
        }
        Refresh() {
            this.Datas.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[this.Datas[i].ID];
                this.str[this.Datas[i].ID] = nv;
            });
        }
        GetAwardBtnClick() {
            if (this.isWatchAD) {
                ADManager.ShowReward(() => {
                    this.GetAward();
                }, () => {
                    UIMgr.show("UITip", () => {
                        this.GetAward();
                    });
                });
            }
            else {
                this.hide();
            }
        }
        GetAward() {
            if (this.Datas[0].ID == 71001) {
                if (GameDataController.ClothDataRefresh[71001] == 1) {
                    let dataall = GameDataController.ClothDataRefresh;
                    dataall[71001] = 0;
                    GameDataController.ClothDataRefresh = dataall;
                    this.Refresh();
                    Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
                    BagListController.Instance.refresh();
                    UIMgr.tip("恭喜获得新衣服");
                }
                else {
                    UIMgr.tip("已经解锁了哦，不要重复解锁");
                }
            }
            else {
                for (let k in this.str) {
                    if (this.str[k] == 1) {
                        let dataall = GameDataController.ClothDataRefresh;
                        dataall[k] = 0;
                        GameDataController.ClothDataRefresh = dataall;
                        Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
                        this.Refresh();
                        UIMgr.get("UIReady").Refresh();
                        BagListController.Instance.refresh();
                        UIMgr.tip("恭喜解锁一套新衣服");
                    }
                    else {
                        UIMgr.tip("已经解锁了哦，不要重复解锁");
                    }
                }
            }
        }
    }

    class UIDuiHuan extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.str = {
                "111": 40601,
                "222": 40602,
                "333": 40603,
                "444": 40604,
                "555": 40605,
                "123": 70201,
                "321": 70202,
                "666": 72001,
                "777": 72002,
                "888": 72003,
                "999": 72004,
            };
        }
        onInit() {
            this.DuiHuanBox = this.vars("DuiHuanBox");
            this.InputText = this.vars("InputText");
            this.SureBtn = this.DuiHuanBox.getChildByName("SureBtn");
            this.btnEv("SureBtn", this.SureBtnClick);
            this.BackBtn = this.DuiHuanBox.getChildByName("BackBtn");
            this.BackBtn.on(Laya.Event.CLICK, this, () => {
                this.hide();
            });
            this.GetBox = this.vars("GetBox");
            this.Guang = this.GetBox.getChildByName("Guang");
            this.ADBtn = this.GetBox.getChildByName("ADBtn");
            this.Icon = this.GetBox.getChildByName("Icon");
            this.CloseBtn = this.GetBox.getChildByName("CloseBtn");
            this.ShareBtn = this.GetBox.getChildByName("ShareBtn");
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
            this.btnEv("ADBtn", this.ADBtnClick);
            this.ShareBtn.on(Laya.Event.CLICK, this, this.ShareBtnClick);
        }
        onShow() {
            RecordManager.startAutoRecord();
            Laya.timer.once(3000, this, () => {
                this.BackBtn.visible = true;
            });
            this.GetBox.visible = false;
            this.CloseBtn.visible = false;
            this.InputText.text = "";
            this.ADBtn.visible = true;
            this.ShareBtn.visible = false;
        }
        onHide() {
            RecordManager.stopAutoRecord();
            this.DuiHuanBox.visible = true;
            this.GetBox.visible = false;
            this.CloseBtn.visible = false;
            this.BackBtn.visible = false;
        }
        SureBtnClick() {
            for (let k in this.str) {
                if (this.InputText.text == k) {
                    let t = this.str[k];
                    if (GameDataController.ClothDataRefresh[t] == 1) {
                        this.DuiHuanBox.visible = false;
                        this.GetBoxShow();
                    }
                    else {
                        UIMgr.tip("已经获取该装扮了，不能重复获取哦！");
                    }
                }
                if (this.str[this.InputText.text] == null) {
                    UIMgr.tip("兑换码输入错误！");
                }
            }
        }
        ADBtnClick() {
            ADManager.ShowReward(() => {
                this.GetAward();
            }, () => {
                UIMgr.show("UITip", this.GetAward);
            });
        }
        GetAward() {
            let dataall = GameDataController.ClothDataRefresh;
            dataall[this.str[this.InputText.text]] = 0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.showList();
            BagListController.Instance.refresh();
            UIMgr.tip("成功解一件新的装扮!");
            this.ADBtn.visible = false;
            Laya.timer.once(1000, this, () => {
                this.ShareBtn.visible = true;
            });
        }
        GetBoxShow() {
            this.GetBox.visible = true;
            Laya.timer.loop(10, this, this.GuangRot);
            this.Icon.skin = "Cloth/DuiHuanMa/" + this.str[this.InputText.text] + ".png";
            Laya.timer.once(3000, this, () => {
                RecordManager.stopAutoRecord();
                this.CloseBtn.visible = true;
            });
        }
        ShareBtnClick() {
            RecordManager._share(() => {
                UIMgr.tip("视频分享成功！");
            }, () => {
                UIMgr.tip("视频分享失败...");
            });
        }
        GuangRot() {
            this.Guang.rotation += 2;
        }
    }

    class UINotice extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.TextArea = this.vars("TextArea");
            this.CLoseBtn = this.vars("CloseBtn");
            this.TextArea.text = "1: 兑换码功能和大家见面啦！\n" +
                "    输入：111 获得白雪头发 \n" +
                "    输入：222 获得白雪上衣 \n" +
                "    输入：333 获得白雪长袜 \n" +
                "    输入：444 获得白雪鞋子 \n" +
                "    输入：555 获得白雪魔杖 \n" +
                "    输入：123 获得汉服长裙 \n" +
                "    输入：321 获得泳装 \n" +
                "2: 新增绝版服装\n";
            this.TextArea.padding = "10,10,10,50";
            this.TextArea.leading = 10;
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
        }
    }

    class UIDraw extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
            this.nowCaseClue = [];
            this.nowClueID = 1;
            this.lastPos = null;
            this.offsetLen = 10;
            this.lineWidth = 12;
            this.drawMinX = 0;
            this.drawMaxX = 0;
            this.drawMinY = 0;
            this.drawMaxY = 0;
            this.boardDrawY = 0;
            this.isTouchOnDraw = false;
            this.isOnBoardAnim = false;
            this.isBoardUp = false;
            this.nowColorID = 0;
            this.lineArr = [];
            this.isSliderClick = true;
            this.colorArr = [
                "#303030",
                "#b7b7b7",
                "#FF69B4",
                "#FF00FF",
                "#00BFFF",
                "#00FF00",
                "#f1e168",
            ];
            this.paintInited = false;
            this.numPdaye = 0;
            this.numPxiaoye = 0;
            this.numPlangong = 0;
            this.arr = [];
            this.cncountlan = 0;
            this.cncountfen = 0;
        }
        onAwake() {
            for (let k in GameDataController.ClothDataAsy) {
                if (GameDataController.ClothDataAsy[k] == 1 && !GameDataController._ClothData.get(parseInt(k)).GetType2) {
                    if (!((k == "10000") || (k == "10001") || (k == "10002"))) {
                        this.arr.push(k);
                    }
                }
            }
            console.log(this.arr);
            console.log("xxxxxxxxxxxxx");
            this.Colorlan = this.vars("Colorlan");
            this.Colorfen = this.vars("Colorfen");
            this.UIBox = this.vars("UIBox");
            this.SliderBox = this.vars("SliderBox");
            this.Board = this.vars("Board");
            this.imgBg = this.vars("imgBg");
            this.imgRubber = this.vars("imgRubber");
            this.DrawBox = this.vars("DrawBox");
            this.imgGou = this.vars("imgGou");
            this.btnClear = this.vars("btnClear");
            this.Get = this.vars("Get");
            this.GetBox = this.Get.getChildByName("GetBox");
            this.Guang = this.GetBox.getChildByName("Guang");
            this.ADBtn = this.GetBox.getChildByName("ADBtn");
            this.Icon = this.GetBox.getChildByName("Icon");
            this.CloseBtn = this.GetBox.getChildByName("CloseBtn");
            this.ShareBtn = this.GetBox.getChildByName("ShareBtn");
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
            this.btnEv("ADBtn", this.ADBtnClick);
            this.ShareBtn.on(Laya.Event.CLICK, this, this.ShareBtnClick);
            this.btnNext = this.vars("btnNext");
            this.BackBtn = this.vars("BackBtn");
            this.Colorlan.on(Laya.Event.CLICK, this, this.onColorlan);
            this.Colorfen.on(Laya.Event.CLICK, this, this.onColorfen);
            this.btnClear.on(Laya.Event.CLICK, this, this.onClickClear);
            this.btnNext.on(Laya.Event.CLICK, this, this.onClickNext);
            this.BackBtn.on(Laya.Event.CLICK, this, () => {
                RecordManager.stopAutoRecord();
                this.hide();
            });
            this.SliderBox.on(Laya.Event.MOUSE_DOWN, this, this.onSliderDown);
            this.SliderBox.on(Laya.Event.MOUSE_MOVE, this, this.onSliderMove);
            this.SliderBox.on(Laya.Event.MOUSE_UP, this, this.onSliderUp);
            for (let i = 1; i <= 7; i++) {
                this.Board.getChildByName("imgColor" + i).on(Laya.Event.CLICK, this, this.onClickColor, [i - 1]);
            }
            this.imgRubber.on(Laya.Event.CLICK, this, this.onClickColor, [-1]);
            this.refreshShow();
            this.drawMinX = this.lineWidth / 2;
            this.drawMaxX = this.DrawBox.width - this.lineWidth / 2;
            this.drawMinY = this.lineWidth / 2;
            this.drawMaxY = this.DrawBox.height - this.lineWidth / 2;
            this.btnNext.visible = true;
            this.SliderBox.visible = false;
            this.boardDrawY = this.UIBox.height - this.Board.height;
            this.paintInited = true;
            this.onEventFailAgain();
            if (Number(Laya.LocalStorage.getItem("cncountlan") == "1")) {
                this.Colorlan.visible = false;
            }
            else {
                this.Colorlan.visible = true;
            }
            if (Number(Laya.LocalStorage.getItem("cncountfen") == "1")) {
                this.Colorfen.visible = false;
            }
            else {
                this.Colorfen.visible = true;
            }
            this.trySkinCount = Util.randomInRange_i(1, 3);
        }
        onShow() {
            RecordManager.startAutoRecord();
            Laya.timer.once(3000, this, () => {
                this.BackBtn.visible = true;
            });
            this.Get.visible = false;
            this.CloseBtn.visible = false;
            this.ADBtn.visible = true;
            this.ShareBtn.visible = false;
        }
        onHide() {
            RecordManager.stopAutoRecord();
            this.onClickClear();
            this.Get.visible = false;
            this.CloseBtn.visible = false;
            this.BackBtn.visible = false;
        }
        onClickNext() {
            console.log("确认完成");
            this.onClickClear();
            if (this.arr.length == 0) {
                UIMgr.tip("你已经解锁了全部的服饰哦~");
            }
            let t = Tools.arrayRandomGetOut(this.arr, 1);
            console.log(t);
            let cloth = GameDataController._ClothData.get(parseInt(t));
            this.data = cloth;
            this.GetBoxShow();
            console.log(this.data);
        }
        GetBoxShow() {
            this.Get.visible = true;
            Laya.timer.loop(10, this, this.GuangRot);
            this.Icon.skin = this.data.GetPath1();
            Laya.timer.once(3000, this, () => {
                RecordManager.stopAutoRecord();
                this.CloseBtn.visible = true;
            });
        }
        GuangRot() {
            this.Guang.rotation += 2;
        }
        ADBtnClick() {
            ADManager.ShowReward(() => {
                this.GetAward();
            }, () => {
                UIMgr.show("UITip", this.GetAward);
            });
        }
        GetAward() {
            let dataall = GameDataController.ClothDataRefresh;
            dataall[this.data.ID] = 0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.showList();
            BagListController.Instance.refresh();
            UIMgr.tip("成功解一件新的装扮!");
            this.ADBtn.visible = false;
            Laya.timer.once(1000, this, () => {
                this.ShareBtn.visible = true;
            });
        }
        ShareBtnClick() {
            RecordManager._share(() => {
                UIMgr.tip("视频分享成功！");
            }, () => {
                UIMgr.tip("视频分享失败...");
            });
        }
        onColorlan() {
            this.cncountlan = Number(Laya.LocalStorage.getItem("cncountlan"));
            ADManager.ShowReward(() => {
                console.log("看视频解锁蓝色");
                this.Colorlan.visible = false;
                this.cncountlan = 1;
                Laya.LocalStorage.setItem("cncountlan", this.cncountlan.toString());
            });
        }
        onColorfen() {
            this.cncountfen = Number(Laya.LocalStorage.getItem("cncountfen"));
            ADManager.ShowReward(() => {
                console.log("看视频解锁粉色");
                this.Colorfen.visible = false;
                this.cncountfen = 1;
                Laya.LocalStorage.setItem("cncountfen", this.cncountfen.toString());
            });
        }
        addDrawEvent() {
            this.DrawBox.on(Laya.Event.MOUSE_DOWN, this, this._onMouseDown);
            this.DrawBox.on(Laya.Event.MOUSE_MOVE, this, this._onMouseMove);
            this.DrawBox.on(Laya.Event.MOUSE_UP, this, this._onMouseUP);
        }
        removeDrawEvent() {
            this.DrawBox.off(Laya.Event.MOUSE_DOWN, this, this._onMouseDown);
            this.DrawBox.off(Laya.Event.MOUSE_MOVE, this, this._onMouseMove);
            this.DrawBox.off(Laya.Event.MOUSE_UP, this, this._onMouseUP);
        }
        upBoardAnim() {
            if (this.isOnBoardAnim) {
                return;
            }
            this.isOnBoardAnim = true;
            Laya.Tween.to(this.Board, {
                y: this.boardDrawY + 300
            }, 500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                this.isOnBoardAnim = false;
            }));
        }
        downBoardAnim() {
            if (this.isOnBoardAnim) {
                return;
            }
            this.isOnBoardAnim = true;
            Laya.Tween.to(this.Board, {
                y: this.boardDrawY + 300 + 100
            }, 500, Laya.Ease.backOut, Laya.Handler.create(this, () => {
                this.isOnBoardAnim = false;
            }));
        }
        onClickClear() {
            this.DrawBox.destroyChildren();
            this.lineArr = [];
        }
        onClickUp() {
            if (!this.isOnBoardAnim) {
                if (this.isBoardUp) {
                    this.downBoardAnim();
                }
                else {
                    this.upBoardAnim();
                }
                this.isBoardUp = !this.isBoardUp;
            }
        }
        onClickCatch(event) {
            event.stopPropagation();
        }
        onClickColor(ID) {
            this.nowColorID = ID;
            this.refreshShow();
        }
        refreshShow() {
            let node = this.imgRubber;
            if (this.nowColorID != -1) {
                node = this.Board.getChildByName("imgColor" + (this.nowColorID + 1));
            }
            this.imgGou.x = node.x + 30;
            this.imgGou.y = node.y + 35;
        }
        _onMouseDown(event) {
            this.isTouchOnDraw = true;
            this.mergeBoard();
            if (this.nowColorID != -1) {
                let board = new Laya.Sprite();
                board.width = this.DrawBox.width;
                board.height = this.DrawBox.height;
                board.cacheAs = "bitmap";
                this.DrawBox.addChild(board);
                this.lineArr.push(board);
            }
            this.lastPos = new Laya.Point(event.stageX - this.Board.x - this.DrawBox.x, event.stageY - this.Board.y - this.DrawBox.y);
            this.nowBoard.graphics.drawCircle(this.lastPos.x, this.lastPos.y, this.nowLineWidth / 2, this.nowColor);
        }
        _onMouseMove(event) {
            if (this.isTouchOnDraw) {
                let touchPos = new Laya.Point(event.stageX - this.Board.x - this.DrawBox.x, event.stageY - this.Board.y - this.DrawBox.y);
                this.drawLine(touchPos);
            }
        }
        _onMouseUP(event) {
            this.isTouchOnDraw = false;
        }
        onSliderDown(event) {
            event.stopPropagation();
            this.sliderDownPos = new Laya.Point(event.stageX, event.stageY);
            this.isSliderClick = true;
        }
        onSliderMove(event) {
        }
        onSliderUp(event) {
        }
        onEventFailAgain() {
            this.nowClueID = 1;
            this.SliderBox.visible = false;
            this.UIBox.visible = true;
            this.Board.y = this.boardDrawY;
            this.toWitness();
        }
        onEventPickAgain() {
            this.UIBox.visible = true;
        }
        drawLine(nowPos) {
            nowPos.x > this.drawMaxX && (nowPos.x = this.drawMaxX);
            nowPos.x < this.drawMinX && (nowPos.x = this.drawMinX);
            nowPos.y > this.drawMaxY && (nowPos.y = this.drawMaxY);
            nowPos.y < this.drawMinY && (nowPos.y = this.drawMinY);
            let offsetX = nowPos.x - this.lastPos.x;
            let offsetY = nowPos.y - this.lastPos.y;
            if (offsetX * offsetX + offsetY * offsetY >= this.offsetLen * this.offsetLen) {
                this.nowBoard.graphics.drawLine(this.lastPos.x, this.lastPos.y, nowPos.x, nowPos.y, this.nowColor, this.nowLineWidth);
                this.nowBoard.graphics.drawCircle(nowPos.x, nowPos.y, this.nowLineWidth / 2, this.nowColor);
                this.lastPos.x = nowPos.x;
                this.lastPos.y = nowPos.y;
            }
        }
        mergeBoard() {
            if (this.nowColorID != -1) {
                let num = this.lineArr.length;
                if (num > 3) {
                    let tex = this.DrawBox.drawToTexture(this.DrawBox.width, this.DrawBox.height, this.DrawBox.x, this.DrawBox.y);
                    let spr = new Laya.Sprite();
                    spr.width = this.DrawBox.width;
                    spr.height = this.DrawBox.height;
                    this.DrawBox.addChild(spr);
                    spr.texture = tex;
                    let lastBg = this.DrawBox.getChildByName("bg");
                    if (lastBg) {
                        lastBg.destroy();
                    }
                    spr.name = "bg";
                    spr.zOrder = -1;
                    while (num != 0) {
                        let d_board = this.lineArr.splice(0, 1)[0];
                        d_board.destroy();
                        num--;
                    }
                }
            }
            else {
                let tex = this.DrawBox.drawToTexture(this.DrawBox.width, this.DrawBox.height, this.DrawBox.x, this.DrawBox.y);
                let spr = new Laya.Sprite();
                spr.width = this.DrawBox.width;
                spr.height = this.DrawBox.height;
                spr.cacheAs = "bitmap";
                this.DrawBox.addChild(spr);
                spr.texture = tex;
                let lastBg = this.DrawBox.getChildByName("bg");
                if (lastBg) {
                    lastBg.destroy();
                }
                spr.name = "bg";
                spr.zOrder = -1;
                let num = this.lineArr.length;
                while (num != 0) {
                    let d_board = this.lineArr.splice(0, 1)[0];
                    d_board.destroy();
                    num--;
                }
                let board = new Laya.Sprite();
                board.width = this.DrawBox.width;
                board.height = this.DrawBox.height;
                board.blendMode = "destination-out";
                spr.addChild(board);
                this.lineArr.push(spr);
            }
        }
        toWitness() {
            this.addDrawEvent();
            this.btnClear.visible = true;
        }
        toPickSuspect() {
            this.btnClear.visible = false;
            this.SliderBox.visible = true;
            this.removeDrawEvent();
            this.downBoardAnim();
            Laya.timer.once(1000, this, () => {
            });
        }
        get nowBoard() {
            let board = this.lineArr[this.lineArr.length - 1];
            if (this.nowColorID == -1) {
                board = board.getChildAt(0);
            }
            return board;
        }
        get nowColor() {
            return this.nowColorID != -1 ? this.colorArr[this.nowColorID] : "#000000";
        }
        get nowLineWidth() {
            return this.nowColorID != -1 ? this.lineWidth : this.lineWidth * 3;
        }
        get nowBubbleInfo() {
            if (this.nowClueID > this.nowCaseClue.length) {
                this.nowClueID = this.nowCaseClue.length;
            }
            return {
                txt: this.nowCaseClue[this.nowClueID - 1],
                pro: this.nowClueID + "/" + this.nowCaseClue.length
            };
        }
    }

    class UIWeddingEgg extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.QianWangBtn = this.vars("QianWangBtn");
            this.WeddingCloseBtn = this.vars("WeddingCloseBtn");
            this.btnEv("QianWangBtn", () => {
                UIMgr.show("UIPickEgg");
                UIMgr.show("UIActive");
                this.hide();
            });
            this.btnEv("WeddingCloseBtn", () => {
                this.hide();
                UIMgr.show("UIPickEgg");
            });
            this.effcets();
        }
        effcets() {
            TimerAdmin._randomLoop(100, 200, this, () => {
                Effects._Particle._spray(this.vars('EParent2'), null, [35, 45], null, [0, 3], [0, 60], [Effects._SkinUrl.爱心2], [[100, 50, 50, 1], [255, 255, 50, 1]], 0, [100, 400], null, [1, 3], [0.02, 0.03]);
            });
            TimerAdmin._randomLoop(100, 200, this, () => {
                Effects._Particle._spray(this.vars('EParent1'), null, [35, 45], null, [0, 3], [0, -60], [Effects._SkinUrl.爱心2], [[100, 50, 50, 1], [255, 255, 50, 1]], 0, [100, 400], null, [1, 4], [0.02, 0.03]);
            });
            TimerAdmin._frameRandomLoop(12.5, 35, this, () => {
                Effects._Glitter._blinkStar(this.vars('Eblink1'), new Laya.Point(0, 0), [80, 60], [Effects._SkinUrl.星星7], [[100, 30, 30, 1], [255, 255, 255, 1]], [40, 100], null, null, [0.01, 0.03]);
            }, true);
            TimerAdmin._frameRandomLoop(12.5, 35, this, () => {
                Effects._Glitter._blinkStar(this.vars('Eblink2'), new Laya.Point(0, 0), [80, 60], [Effects._SkinUrl.星星7], [[100, 30, 30, 1], [255, 255, 255, 1]], [40, 100], null, null, [0.01, 0.03]);
            }, true);
            TimerAdmin._frameLoop(120, this, () => {
                Animation2D.bomb_LeftRight(this.vars('QianWangBtn'), 1.22, 250);
            }, true);
            TimerAdmin._frameRandomLoop(30, 80, this, () => {
                Effects._Aperture._continuous(this.vars('EParentAxin'), null, 480, 300, [0, 0], ['UIWedding/daxin.png'], [[100, 50, 50, 1], [255, 255, 255, 1]], null, [1.1, 1.1], [0.025, 0.03]);
            }, true);
            this.vars('EParentAxin').alpha = 0.5;
            TimerAdmin._frameLoop(250, this, () => {
                Animation2D.move_Simple(this.vars('liuguang1'), -54, 10, 700, 43, 600, 0, () => {
                    Color._changeOnce(this.vars('Word1'), [255, 0, 100, 1], 20);
                });
            }, true);
        }
    }

    class UIPickEgg extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.LiKeChuDaoBtn = this.vars("LiKeChuDaoBtn");
            this.CloseBtn = this.vars("CloseBtn");
            this.btnEv("LiKeChuDaoBtn", () => {
                UIMgr.show("UIRank");
                this.hide();
            });
            this.btnEv("CloseBtn", () => {
                this.hide();
            });
            this.effcets();
        }
        effcets() {
            let delay1 = 30;
            let delay2 = 80;
            TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
                Effects._Glitter._blinkStar(this.vars('EStar1'), new Laya.Point(0, 0), [150, 150], [Effects._SkinUrl.星星6], [[100, 30, 30, 1], [255, 255, 255, 1]], [80, 130], null, null, [0.03, 0.06], [0, 0]);
            }, true);
            TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
                Effects._Glitter._blinkStar(this.vars('EStar2'), new Laya.Point(0, 0), [150, 150], [Effects._SkinUrl.星星6], [[30, 30, 30, 1], [255, 255, 255, 1]], [80, 130], null, null, [0.03, 0.06], [0, 0]);
            }, true);
            TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
                Effects._Glitter._blinkStar(this.vars('EStar3'), new Laya.Point(0, 0), [100, 100], [Effects._SkinUrl.星星6], [[30, 30, 30, 1], [255, 255, 255, 1]], [60, 110], null, null, [0.03, 0.06], [0, 0]);
            }, true);
            TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
                Effects._Glitter._blinkStar(this.vars('EStar4'), new Laya.Point(0, 0), [100, 100], [Effects._SkinUrl.星星6], [[100, 30, 30, 1], [255, 255, 255, 1]], [60, 110], null, null, [0.03, 0.06], [0, 0]);
            }, true);
            TimerAdmin._frameRandomLoop(15, 50, this, () => {
                Effects._Aperture._continuous(this.vars('ESquare'), null, 250, 250, null, [Effects._SkinUrl.光圈1], [[100, 100, 100, 1], [255, 255, 255, 1]], null, [1.1, 2], [0.035, 0.06]);
            }, true);
            this.vars('ESquare').alpha = 0.5;
            TimerAdmin._frameLoop(120, this, () => {
                Animation2D.bomb_LeftRight(this.vars('LiKeChuDaoBtn'), 1.22, 250);
            }, true);
            TimerAdmin._frameLoop(300, this, () => {
                Animation2D.move_Simple(this.vars('Liuguang'), -62.5, 0, 795, 52, 600, 0, () => {
                    Color._changeOnce(this.vars('Word1'), [255, 0, 100, 1], 20, () => {
                        Animation2D.swell_shrink(this.vars('Word2'), 1.0, 1.1, 250, 0, () => {
                            Animation2D.swell_shrink(this.vars('Word3'), 1.0, 1.1, 250, 0);
                        });
                    });
                });
            }, true);
        }
    }

    class UIWeddingShare extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.ShareBtn = this.vars("ShareBtn");
            this.BackBtn = this.vars("BackBtn");
            this.btnEv("ShareBtn", () => {
                RecordManager.stopAutoRecord();
                ADManager.TAPoint(TaT.BtnClick, "jiehun_click");
                RecordManager._share(() => {
                    UIMgr.tip("分享成功");
                    this.hide();
                });
            });
            this.btnEv("BackBtn", () => {
                this.hide();
            });
        }
    }

    class UISpinning extends UIBase {
        constructor() {
            super(...arguments);
            this.arr = [];
            this.str = {};
            this._openType = OpenType.Attach;
            this.Prop1Pos = [95, 526];
            this.Prop2Pos = [248, 376];
            this.Prop3Pos = [439, 385];
            this.Prop4Pos = [625, 431];
            this.TargetPos = [372, 772];
            this.ClickNum = 0;
            this.SecondID = 0;
        }
        onInit() {
            this.Prop1 = this.vars("Prop1");
            this.Prop2 = this.vars("Prop2");
            this.Prop3 = this.vars("Prop3");
            this.Prop4 = this.vars("Prop4");
            this.MakeBtn = this.vars("MakeBtn");
            this.BackBtn = this.vars("BackBtn");
            this.btnEv("MakeBtn", () => {
                ADManager.ShowReward(() => {
                    this.FirstStageShow();
                });
            });
            this.btnEv("BackBtn", () => {
                this.hide();
            });
            this.btnEv("Prop1", () => {
                this.Prop1Click();
            });
            this.btnEv("Prop2", () => {
                this.Prop2Click();
            });
            this.btnEv("Prop3", () => {
                this.Prop3Click();
            });
            this.btnEv("Prop4", () => {
                this.Prop4Click();
            });
            this.FirstStageInit();
            this.SecondStageInit();
        }
        Prop1Click() {
            this.ClickNum += 1;
            this.Prop1Move();
        }
        Prop2Click() {
            ADManager.ShowReward(() => {
                this.ClickNum += 2;
                this.Prop2Move();
            });
        }
        Prop3Click() {
            ADManager.ShowReward(() => {
                this.ClickNum += 2;
                this.Prop3Move();
            });
        }
        Prop4Click() {
            this.ClickNum += 1;
            this.Prop4Move();
        }
        Prop1Move() {
            Laya.Tween.to(this.Prop1, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.Prop1, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);
            }));
        }
        Prop2Move() {
            Laya.Tween.to(this.Prop2, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.Prop2, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);
            }));
        }
        Prop3Move() {
            Laya.Tween.to(this.Prop3, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.Prop3, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);
            }));
        }
        Prop4Move() {
            Laya.Tween.to(this.Prop4, { x: this.TargetPos[0], y: this.TargetPos[1] }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.Prop4, { scaleX: 0, scaleY: 0 }, 400, Laya.Ease.linearIn);
            }));
        }
        onShow() {
            this.FirstStage.visible = false;
            this.SecondStage.visible = false;
            this.PropReceive();
        }
        PropReceive() {
            this.Prop1.pos(this.Prop1Pos[0], this.Prop1Pos[1]);
            this.Prop1.scale(1, 1);
            this.Prop2.pos(this.Prop2Pos[0], this.Prop2Pos[1]);
            this.Prop2.scale(1, 1);
            this.Prop3.pos(this.Prop3Pos[0], this.Prop3Pos[1]);
            this.Prop3.scale(1, 1);
            this.Prop4.pos(this.Prop4Pos[0], this.Prop4Pos[1]);
            this.Prop4.scale(1, 1);
        }
        FirstStageInit() {
            this.FirstIcon = this.vars("FirstIcon");
            this.FirstADBtn = this.vars("FirstADBtn");
            this.FirstStage = this.vars("FirstStage");
            this.FirstCloseBtn = this.vars("FirstCloseBtn");
            this.btnEv("FirstADBtn", () => {
                this.FirstADClick();
            });
            this.btnEv("FirstCloseBtn", () => {
                this.FirstCloseClick();
            });
        }
        FirstStageShow() {
            console.log("第一礼品展示");
            this.FirstStage.visible = true;
            this.FirstCloseBtn.visible = false;
            Laya.timer.once(2000, this, () => {
                this.FirstCloseBtn.visible = true;
            });
            this.FirstStage.alpha = 0;
            Laya.Tween.to(this.FirstStage, { alpha: 1 }, 1000);
            let arr = GameDataController.Get_All_UnLock_Cloth();
            let t = Tools.arrayRandomGetOut(arr, 1);
            let cloth = GameDataController._clothData.get(parseInt(t));
            this.data = cloth;
            this.FirstID = 1234798;
            this.FirstIcon.skin = cloth.GetPath1();
        }
        FirstADClick() {
            ADManager.ShowReward(() => {
                this.SecondStageShow();
                this.FirstClothGet();
            });
        }
        FirstCloseClick() {
            this.FirstClothGet();
            this.hide();
        }
        FirstClothGet() {
            let dataall = GameDataController.ClothDataRefresh;
            dataall[this.data.ID] = 0;
            GameDataController.ClothDataRefresh = dataall;
            BagListController.Instance.showList();
            BagListController.Instance.refresh();
            UIMgr.tip("成功解一件新的装扮!");
        }
        SecondStageInit() {
            this.SecondIcon = this.vars("SecondIcon");
            this.SecondADBtn = this.vars("SecondADBtn");
            this.SecondStage = this.vars("SecondStage");
            this.ShareBtn = this.vars("ShareBtn");
            this.SecondCloseBtn = this.vars("SecondCloseBtn");
            this.btnEv("SecondADBtn", () => {
                this.SecondADClick();
            });
            this.btnEv("SecondCloseBtn", () => {
                this.SecondCloseClick();
            });
            this.btnEv("ShareBtn", () => {
                this.Share();
            });
        }
        Refresh() {
            this.Datas.forEach((v, i) => {
                let nv = GameDataController.ClothDataRefresh[this.Datas[i].ID];
                this.str[this.Datas[i].ID] = nv;
            });
        }
        SecondStageShow() {
            console.log("第二礼品展示");
            console.log("积分", this.ClickNum >= 3 ? "嫦娥头发" : "普通视频皮肤");
            this.ShareBtn.visible = false;
            this.SecondCloseBtn.visible = false;
            Laya.timer.once(2000, this, () => {
                this.SecondCloseBtn.visible = true;
            });
            this.SecondID = 1234789;
            this.SecondStage.visible = true;
            this.SecondStage.alpha = 0;
            Laya.Tween.to(this.SecondStage, { alpha: 1 }, 1000);
            let skinPath = "";
            if (this.ClickNum >= 5 && GameDataController.ClothDataRefresh[71002] == 1) {
                this.Datas = GameDataController.ClothPackge3.cloths1;
                this.Refresh();
                let cloth = this.Datas[1];
                this.data = cloth;
                skinPath = cloth.GetPath1();
            }
            else {
                let arr = GameDataController.Get_All_UnLock_Cloth();
                let t = Tools.arrayRandomGetOut(arr, 1);
                let cloth = GameDataController._clothData.get(parseInt(t));
                this.data = cloth;
                skinPath = cloth.GetPath1();
            }
            this.SecondIcon.skin = skinPath;
        }
        SecondADClick() {
            ADManager.ShowReward(() => {
                let dataall = GameDataController.ClothDataRefresh;
                dataall[this.data.ID] = 0;
                GameDataController.ClothDataRefresh = dataall;
                this.Refresh();
                Laya.LocalStorage.setJSON(this.Datas[0].GetType2, this.str);
                BagListController.Instance.refresh();
                UIMgr.tip("成功解一件新的装扮!");
                this.ShareBtn.visible = true;
            });
        }
        SecondCloseClick() {
            this.hide();
        }
        Share() {
            RecordManager.stopAutoRecord;
            RecordManager._share(() => {
                UIMgr.tip("视频分享成功！");
            }, () => {
                UIMgr.tip("视频分享失败...");
            });
        }
    }

    class UIChangE extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.EnterBtn = this.vars("EnterBtn");
            this.BackBtn = this.vars("BackBtn");
            this.btnEv("EnterBtn", () => {
                UIMgr.show("UIXiaoHM");
                UIMgr.show("UISpinning");
                this.hide();
            });
            this.btnEv("BackBtn", () => {
                this.hide();
                UIMgr.show("UIXiaoHM");
            });
        }
    }

    class UIXiaoHM extends UIBase {
        constructor() {
            super(...arguments);
            this._openType = OpenType.Attach;
        }
        onInit() {
            this.BackBtn = this.vars("BackBtn");
            this.EnterBtn = this.vars("EnterBtn");
            this.btnEv("BackBtn", () => {
                this.hide();
                UIMgr.show("UIWeddingEgg");
            });
            this.btnEv("EnterBtn", () => {
                UIMgr.show("UIDuiHuan");
                UIMgr.show("UIWeddingEgg");
                this.hide();
            });
        }
    }

    G["Game_Init"] = Game_Init;
    G["Game_Ready"] = Game_Ready;
    G["Game_Main"] = Game_Main;
    G["Game_Settle"] = Game_Settle;
    G["UIPreload"] = UIPreload;
    G["UIReady"] = UIReady;
    G["UIMain"] = UIMain;
    G["UISettle"] = UISettle;
    G["UIActive"] = UIActive;
    G["UISubMoneyEf"] = UISubMoneyEf;
    G["UISign"] = UISign;
    G["UIPhotos"] = UIPhotos;
    G["UITest"] = UITest;
    G["UIWing"] = UIWing;
    G["UITip"] = UITip;
    G["UIPick"] = UIPick;
    G["UIRank"] = UIRank;
    G["UIPickLoading"] = UIPickLoading;
    G["UIPickReward"] = UIPickReward;
    G["UICombine"] = UICombine;
    G["UIDuiHuan"] = UIDuiHuan;
    G["UINotice"] = UINotice;
    G["UIDraw"] = UIDraw;
    G["UITask"] = UITask;
    G["UIWeddingEgg"] = UIWeddingEgg;
    G["UIPickEgg"] = UIPickEgg;
    G["UIWeddingShare"] = UIWeddingShare;
    G["UISpinning"] = UISpinning;
    G["UIChangE"] = UIChangE;
    G["UIXiaoHM"] = UIXiaoHM;
    class AppFacade extends Laya.View {
        constructor() {
            super();
        }
        onOpened() {
            GameMgr.start();
        }
    }

    class RoteOrScaler extends Laya.Script {
    }

    class UITaskItem extends Laya.Script {
        onAwake() {
            this.BtnAds = this.owner.getChildByName('BtnAds');
            this.BtnAds.on(Laya.Event.MOUSE_DOWN, this, (e) => {
                e.currentTarget.scale(1.1, 1.1);
            });
            this.BtnAds.on(Laya.Event.MOUSE_DOWN, this, (e) => {
                e.currentTarget.scale(1.1, 1.1);
            });
            this.BtnAds.on(Laya.Event.MOUSE_UP, this, (e) => {
                e.currentTarget.scale(1, 1);
                ADManager.ShowReward(() => {
                    EventMgr.notify(Task.EventType.watchAds, [this.owner['_dataSource']['name']]);
                });
            });
            this.BtnAds.on(Laya.Event.MOUSE_OUT, this, (e) => {
                e.currentTarget.scale(1, 1);
            });
            this.BtnGet = this.owner.getChildByName('BtnGet');
            this.BtnGet.on(Laya.Event.MOUSE_DOWN, this, (e) => {
                e.currentTarget.scale(1.1, 1.1);
            });
            this.BtnGet.on(Laya.Event.MOUSE_DOWN, this, (e) => {
                e.currentTarget.scale(1.1, 1.1);
            });
            this.BtnGet.on(Laya.Event.MOUSE_UP, this, (e) => {
                e.currentTarget.scale(1, 1);
                if (this.owner['_dataSource']['get'] == 1) {
                    EventMgr.notify(Scratchers.EventType.startScratcher, [this.owner['_dataSource']['name']]);
                }
                else if (this.owner['_dataSource']['get'] == 0) {
                    UIMgr.tip('任务未完成！');
                }
            });
            this.BtnGet.on(Laya.Event.MOUSE_OUT, this, (e) => {
                e.currentTarget.scale(1, 1);
            });
        }
    }

    class ProgressBar extends Laya.Script {
        constructor() {
            super(...arguments);
            this._widthmax = 0;
            this._widthmin = 0;
            this._widthoffset = 0;
        }
        onAwake() {
            this.Bg = this.owner;
            console.log(this.Bg);
            this.Pg = this.Bg.getChildByName("Pg");
            this.mask = this.Pg['mask'];
            this._widthmax = this.mask.width;
            this._widthmin = 0;
            this._widthoffset = this._widthmax - this._widthmin;
        }
        setvalue(value) {
            if (value >= 0 && value <= 1) {
                this.mask.width = this._widthmin + this._widthoffset * value;
            }
            else if (value > 1) {
                this.mask.width = this._widthmax;
            }
            else {
                this.mask.width = this._widthmin;
            }
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("TJ/Promo/script/PromoOpen.ts", PromoOpen);
            reg("TJ/Promo/script/ButtonScale.ts", ButtonScale);
            reg("TJ/Promo/script/PromoItem.ts", PromoItem);
            reg("TJ/Promo/script/P201.ts", P201);
            reg("TJ/Promo/script/P202.ts", P202);
            reg("TJ/Promo/script/P103.ts", P103);
            reg("TJ/Promo/script/P204.ts", P204);
            reg("TJ/Promo/script/P205.ts", P205);
            reg("TJ/Promo/script/P106.ts", P106);
            reg("script/Game/UI/ActiveItem.ts", ActiveItem);
            reg("script/AppFacade.ts", AppFacade);
            reg("script/Game/PhotosChange.ts", PhotosChange);
            reg("script/Game/PickClothChange.ts", PickClothChange);
            reg("script/Game/PickClothChangeT.ts", PickClothChangeT);
            reg("script/Game/UI/RankItem.ts", RankItem);
            reg("script/Game/ClothChange.ts", ClothChange);
            reg("script/Game/UI/Bag/SkinItem.ts", SkinItem);
            reg("script/Game/UI/Bag/HairList.ts", HairList);
            reg("script/Game/UI/Bag/DressList.ts", DressList);
            reg("script/Game/UI/Bag/AccList.ts", AccList);
            reg("script/Game/UI/Bag/ShoesList.ts", ShoesList);
            reg("script/Game/UI/Bag/SockList.ts", SockList);
            reg("script/Game/UI/Bag/UpList.ts", UpList);
            reg("script/Game/UI/Bag/DownList.ts", DownList);
            reg("script/Game/UI/Bag/ClothBtn.ts", ClothBtn);
            reg("script/Game/UI/Bag/BagListController.ts", BagListController);
            reg("script/RoteOrScaler.ts", RoteOrScaler);
            reg("script/Game/UI/UITaskItem.ts", UITaskItem);
            reg("script/Game/UI/ProgressBar.ts", ProgressBar);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "sys/UIInit.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
