import { Animation2D, Color, Effects, TimerAdmin } from "../../Effects/lwg";
import { OpenType, UIBase, UIMgr } from "../../Frame/Core";

export default class UIPickEgg extends UIBase {

    _openType = OpenType.Attach;
    LiKeChuDaoBtn: Laya.Image;
    CloseBtn: Laya.Image;
    onInit() {
        this.LiKeChuDaoBtn = this.vars("LiKeChuDaoBtn");
        this.CloseBtn = this.vars("CloseBtn");

        this.btnEv("LiKeChuDaoBtn", () => {
            UIMgr.show("UIRank");
            this.hide();
        })

        this.btnEv("CloseBtn", () => {
            this.hide();
        })
        this.effcets();
    }
    effcets(): void {

        let delay1 = 30;
        let delay2 = 80;
        TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
            Effects._Glitter._blinkStar(this.vars('EStar1'), new Laya.Point(0, 0), [150, 150], [Effects._SkinUrl.星星6], [[100, 30, 30, 1], [255, 255, 255, 1]], [80, 130], null, null, [0.03, 0.06], [0, 0]);
        }, true)
        TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
            Effects._Glitter._blinkStar(this.vars('EStar2'), new Laya.Point(0, 0), [150, 150], [Effects._SkinUrl.星星6], [[30, 30, 30, 1], [255, 255, 255, 1]], [80, 130], null, null, [0.03, 0.06], [0, 0]);
        }, true)
        TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
            Effects._Glitter._blinkStar(this.vars('EStar3'), new Laya.Point(0, 0), [100, 100], [Effects._SkinUrl.星星6], [[30, 30, 30, 1], [255, 255, 255, 1]], [60, 110], null, null, [0.03, 0.06], [0, 0]);
        }, true)
        TimerAdmin._frameRandomLoop(delay1, delay2, this, () => {
            Effects._Glitter._blinkStar(this.vars('EStar4'), new Laya.Point(0, 0), [100, 100], [Effects._SkinUrl.星星6], [[100, 30, 30, 1], [255, 255, 255, 1]], [60, 110], null, null, [0.03, 0.06], [0, 0]);
        }, true)
        TimerAdmin._frameRandomLoop(15, 50, this, () => {
            Effects._Aperture._continuous(this.vars('ESquare'), null, 250, 250, null, [Effects._SkinUrl.光圈1], [[100, 100, 100, 1], [255, 255, 255, 1]], null, [1.1, 2], [0.035, 0.06]);
        }, true)
        this.vars('ESquare').alpha = 0.5;
        TimerAdmin._frameLoop(120, this, () => {
            Animation2D.bomb_LeftRight(this.vars('LiKeChuDaoBtn'), 1.22, 250);
        }, true)
        TimerAdmin._frameLoop(350, this, () => {
            Animation2D.move_Simple(this.vars('Liuguang'), -62.5, 0, 795, 52, 600, 0, () => {
                Color._changeOnce(this.vars('Word1'), [255, 0, 100, 1], 20, () => {
                    Animation2D.swell_shrink(this.vars('Word2'), 1.0, 1.1, 250, 0, () => {
                        Animation2D.swell_shrink(this.vars('Word3'), 1.0, 1.1, 250, 0);
                    });
                });
            });
        }, true)
    }
}