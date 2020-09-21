
export module Tools
{
    

    /**
   * 为一个节点创建一个扇形遮罩
   * @param parent 被遮罩的节点，也是父节点
   * @param startAngle 扇形的初始角度
   * @param endAngle 扇形结束角度
  */
    export function taskCircleCountdown(parent: Laya.Image, startAngle, endAngle): Laya.DrawPieCmd
    {
        // 父节点cacheAs模式必须为"bitmap"
        parent.cacheAs = "bitmap";
        //新建一个sprite作为绘制扇形节点
        if (parent.numChildren > 0)
        {
            let drawPieSpt = parent.getChildAt(0) as Laya.Sprite;
            //drawPieSpt.blendMode = "destination-out";
            // 加入父节点
            // 绘制扇形，位置在中心位置，大小略大于父节点，保证完全遮住
            console.log("endAngle",endAngle);
            let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
            return drawPie;
        }
        else
        {
            let drawPieSpt = new Laya.Sprite();
            //设置叠加模式
            //drawPieSpt.blendMode = "destination-out";
            // 加入父节点
            parent.addChild(drawPieSpt);
            // 绘制扇形，位置在中心位置，大小略大于父节点，保证完全遮住
            let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
            return drawPie;
        }


    }

    /**
     * 从一个数组中随机取出几个元素，如果刚好是数组长度，则等于是乱序,此方法不会改变原数组
     * @param arr 数组
     * @param num 取出几个元素默认为1个
     */
    export function arrayRandomGetOut(arr: Array<any>, num?: number): any {
        if (!num) {
            num = 1;
        }
        let arrCopy = Tools.array_Copy(arr);
        let arr0 = [];
        if (num > arrCopy.length) {
            return '数组长度小于取出的数！';
        } else {
            for (let index = 0; index < num; index++) {
                let ran = Math.round(Math.random() * (arrCopy.length - 1));
                let a1 = arrCopy[ran];
                arrCopy.splice(ran, 1);
                arr0.push(a1);
            }
            return arr0;
        }
    }
     /**
     * 普通数组复制 
     * @param arr1 被复制的数组
     */
    export function array_Copy(arr1): Array<any> {
        var arr = [];
        for (var i = 0; i < arr1.length; i++) {
            arr.push(arr1[i]);
        }
        return arr;
    }


}