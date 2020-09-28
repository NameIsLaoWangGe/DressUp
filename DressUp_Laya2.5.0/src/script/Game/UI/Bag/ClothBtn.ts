import BagListController from "./BagListController";

export default class ClothBtn extends Laya.Script
{
    Btn: Laya.Image;
    data: string;
    index: number;
    ID: number;
    onAwake()
    {
        this.Btn = this.owner.getChildAt(0) as Laya.Image;
        this.Btn.on(Laya.Event.CLICK, this, this.click)
    }

    fell(mes: string, index: number)
    {
        this.data = mes;
        this.index = index;
        this.ID = index;
        if (this.ID > 1)
        {
            this.ID += 1;
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

        BagListController.Instance.CTT.play();
    }
}
