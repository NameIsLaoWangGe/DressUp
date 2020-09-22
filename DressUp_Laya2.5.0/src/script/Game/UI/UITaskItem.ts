export default class UITaskItem extends Laya.Script {
    BtnAds: Laya.Image;
    BtnGet: Laya.Image;
    onAwake(): void {
        this.BtnAds = this.owner.getChildByName('BtnAds') as Laya.Image;
        this.BtnGet = this.owner.getChildByName('BtnGet') as Laya.Image;
        console.log(this.BtnAds)
        this.BtnAds.on(Laya.Event.MOUSE_UP, this, () => {
            console.log('看广告！');
        })
        this.BtnGet.on(Laya.Event.MOUSE_UP, this, () => {
            console.log('领取奖励！');
        })
    }
}