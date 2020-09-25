import { Animation2D, Effects, TimerAdmin } from "../../Effects/lwg";
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
        // UIReady
        // TimerAdmin._frameRandomLoop(50, 100, this, () => {
        //     Effects._Particle._slowlyUp(this.vars('EffectParent2'), null, null, [35, 45], null, null, [Effects._SkinUrl.圆形发光1], [[255, 255, 100, 1], [150, 150, 100, 1]], 20);
        // })
        // TimerAdmin._frameRandomLoop(50, 100, this, () => {
        //     Effects._Particle._slowlyUp(this.vars('EffectParent1'), null, null, [20, 30], null, null, [Effects._SkinUrl.圆形发光1], [[255, 255, 100, 1], [150, 150, 1, 1]], 10);
        // })

        // TimerAdmin._frameLoop(100, this, () => {
        //     for (let index = 0; index < 20; index++) {
        //         Effects._Particle._spray(this.vars('EffectParent1'), null, [35, 45], null, null, [Effects._SkinUrl.星星1]);
        //     }
        // })

        // UIWedding
        TimerAdmin._randomLoop(100, 200, this, () => {
            Effects._Particle._spray(this.vars('EParent2'), null, [35, 45], null, [0, 3], [0, 60], [Effects._SkinUrl.爱心1], [[100, 50, 50, 1], [255, 255, 50, 1]], 0, [100, 400], null, [1, 3], [0.02, 0.03]);
        })

        TimerAdmin._randomLoop(100, 200, this, () => {
            Effects._Particle._spray(this.vars('EParent1'), null, [35, 45], null, [0, 3], [0, -60], [Effects._SkinUrl.爱心1], [[100, 50, 50, 1], [255, 255, 50, 1]], 0, [100, 400], null, [1, 4], [0.02, 0.03]);
        })
        // 星星闪烁动画左边
        TimerAdmin._frameRandomLoop(30, 70, this, () => {
            Effects._Glitter._blinkStar(this.vars('Eblink1'), new Laya.Point(0, 0), 100, 100, 'UIWedding/guang1.png', 80, 80);
        })

        // 星星闪烁动画右边
        TimerAdmin._frameRandomLoop(30, 80, this, () => {
            Effects._Glitter._blinkStar(this.vars('Eblink2'), new Laya.Point(0, 0), 100, 100,'UIWedding/guang1.png', 80, 80);
        })

        // TimerAdmin._frameLoop(100, this, () => {
        //     Effects._Particle._moveToTargetToMove(this.vars('parent1'))
        // })

        TimerAdmin._frameLoop(120, this, () => {
            Animation2D.bomb_LeftRight(this.vars('QianWangBtn'), 1.22, 250);
        }, true)

        // 爱心
        TimerAdmin._frameRandomLoop(30, 80, this, () => {
            Effects._Aperture.aureole_Continuous(this.vars('EParentAxin'), null, 987, 550, [0, 0], ['UIWedding/daxin.png']);
        })
    }
}