import { Animation2D, Color, Effects, TimerAdmin } from "../../Effects/lwg";
import { OpenType, UIBase, UIMgr } from "../../Frame/Core";

export default class UIWeddingEgg extends UIBase {
    _openType = OpenType.Attach;
    QianWangBtn: Laya.Image;
    WeddingCloseBtn: Laya.Image;
    onInit() {
        this.QianWangBtn = this.vars("QianWangBtn");
        this.WeddingCloseBtn = this.vars("WeddingCloseBtn");

        this.btnEv("QianWangBtn", () => {
            UIMgr.show("UIPickEgg");
            UIMgr.show("UIActive");
            this.hide();

        })

        this.btnEv("WeddingCloseBtn", () => {
            this.hide();
            UIMgr.show("UIPickEgg");
        })
        this.effcets();
    }

    effcets(): void {
        TimerAdmin._randomLoop(100, 200, this, () => {
            Effects._Particle._spray(this.vars('EParent2'), null, [35, 45], null, [0, 3], [0, 60], [Effects._SkinUrl.爱心2], [[100, 50, 50, 1], [255, 255, 50, 1]], 0, [100, 400], null, [1, 3], [0.02, 0.03]);
        })

        TimerAdmin._randomLoop(100, 200, this, () => {
            Effects._Particle._spray(this.vars('EParent1'), null, [35, 45], null, [0, 3], [0, -60], [Effects._SkinUrl.爱心2], [[100, 50, 50, 1], [255, 255, 50, 1]], 0, [100, 400], null, [1, 4], [0.02, 0.03]);
        })
        // 星星闪烁动画左边
        TimerAdmin._frameRandomLoop(12.5, 35, this, () => {
            Effects._Glitter._blinkStar(this.vars('Eblink1'), new Laya.Point(0, 0), [80, 60], [Effects._SkinUrl.星星7], [[100, 30, 30, 1], [255, 255, 255, 1]], [40, 100], null, null, [0.01, 0.03]);
        }, true)
        // 星星闪烁动画右边
        TimerAdmin._frameRandomLoop(12.5, 35, this, () => {
            Effects._Glitter._blinkStar(this.vars('Eblink2'), new Laya.Point(0, 0), [80, 60], [Effects._SkinUrl.星星7], [[100, 30, 30, 1], [255, 255, 255, 1]], [40, 100], null, null, [0.01, 0.03]);
        }, true)

        TimerAdmin._frameLoop(120, this, () => {
            Animation2D.bomb_LeftRight(this.vars('QianWangBtn'), 1.22, 250);
        }, true)

        // 爱心
        TimerAdmin._frameRandomLoop(30, 80, this, () => {
            Effects._Aperture._continuous(this.vars('EParentAxin'), null, 480, 300, [0, 0], ['UIWedding/daxin.png'], [[100, 50, 50, 1], [255, 255, 255, 1]], null, [1.1, 1.1], [0.025, 0.03]);
        }, true)
        this.vars('EParentAxin').alpha = 0.5;

        TimerAdmin._frameLoop(250, this, () => {
            Animation2D.move_Simple(this.vars('liuguang1'), -54, 10, 700, 43, 600, 0, () => {
                Color._changeOnce(this.vars('Word1'), [255, 0, 100, 1], 20);
            });
        }, true)
    }
}