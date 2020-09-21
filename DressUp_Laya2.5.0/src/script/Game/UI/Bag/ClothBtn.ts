import BagListController from "./BagListController";

export default class ClothBtn extends Laya.Script
{
    Btn: Laya.Image;
    icon: Laya.Image;
    data: string;
    index: number;
    ID: number;
    onAwake()
    {
        this.Btn = this.owner.getChildAt(0) as Laya.Image;
        this.icon = this.owner.getChildAt(1) as Laya.Image;
        this.Btn.on(Laya.Event.CLICK, this, this.click)
    }

    fell(mes: string, index: number)
    {
        this.data = mes;
        this.Btn.skin = this.data + ".png";
        this.icon.skin = this.data + "1.png";
        this.index = index;
        this.icon.visible = false;
        this.ID = index;
        if (this.ID > 1)
        {
            this.ID += 1;
        }
        if (BagListController.Instance.SelectIndex == this.ID )
        {
            this.icon.visible = true;
        }
        else
        {
            this.icon.visible = false;
        }
    }

    click()
    {
        switch (this.index)
        {
            case 0:
                BagListController.Instance.ClothesPageChange(0);
                break
            case 1:
                BagListController.Instance.ClothesPageChange(1);
                break
            case 2:
                BagListController.Instance.ClothesPageChange(3);
                break
            case 3:
                BagListController.Instance.ClothesPageChange(4);
                break
            case 4:
                BagListController.Instance.ClothesPageChange(5);
                break
            case 5:
                BagListController.Instance.ClothesPageChange(6);
                break
            case 6:
                BagListController.Instance.ClothesPageChange(7);
                break
            case 7:
                BagListController.Instance.ClothesPageChange(8);
                break
        }

    }
}
