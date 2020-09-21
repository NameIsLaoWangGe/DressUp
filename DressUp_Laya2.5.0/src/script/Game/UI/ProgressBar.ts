export default class ProgressBar extends Laya.Script
{

    _widthmax: number = 0;
    _widthmin: number = 0;
    _widthoffset: number = 0;
    Bg: Laya.Image;
    Pg: Laya.Image;
    mask:Laya.Sprite;
    onAwake()
    {
        this.Bg = this.owner as Laya.Image;
        console.log(this.Bg);
        this.Pg = this.Bg.getChildByName("Pg") as Laya.Image;
        this.mask=this.Pg['mask']
        // this.Pg.width=417;
        // this.Pg.height=42;
        this._widthmax = this.mask.width;
        this._widthmin = 0;
        this._widthoffset = this._widthmax - this._widthmin;
    }

    setvalue(value: number)
    {
        if (value >= 0 && value <= 1)
        {
            //改变数值
            this.mask.width = this._widthmin + this._widthoffset * value;
        }
        else if (value > 1)
        {
            this.mask.width = this._widthmax;
        }
        else
        {
            this.mask.width = this._widthmin;
        }

    }



}