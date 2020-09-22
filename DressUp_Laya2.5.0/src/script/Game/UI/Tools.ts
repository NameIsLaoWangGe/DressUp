
export module Tools {

  /**
   * 为一个节点创建一个扇形遮罩
   * @param parent 被遮罩的节点，也是父节点
   * @param startAngle 扇形的初始角度
   * @param endAngle 扇形结束角度
  */
    export function taskCircleCountdown(parent: Laya.Image, startAngle, endAngle): Laya.DrawPieCmd {
        // 父节点cacheAs模式必须为"bitmap"
        parent.cacheAs = "bitmap";
        //新建一个sprite作为绘制扇形节点
        if (parent.numChildren > 0) {
            let drawPieSpt = parent.getChildAt(0) as Laya.Sprite;
            //drawPieSpt.blendMode = "destination-out";
            // 加入父节点
            // 绘制扇形，位置在中心位置，大小略大于父节点，保证完全遮住
            console.log("endAngle", endAngle);
            let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
            return drawPie;
        }
        else {
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
    /**
     * 对象的拷贝
     * @param source 需要拷贝的对象
     */
    export function obj_DeepCopy(source) {
        var sourceCopy = {};
        for (var item in source) sourceCopy[item] = typeof source[item] === 'object' ? obj_DeepCopy(source[item]) : source[item];
        return sourceCopy;
    }

    /**
     * 对象数组的拷贝
     * @param ObjArray 需要拷贝的对象数组 
     */
    export function objArray_Copy(source): any {
        var sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? obj_DeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    }
    /**
     * 对比两个对象数组中的对象属性，返回相对第一个数组中，第二个数组没有这个属性的对象
     * @param data1 对象数组1
     * @param data2 对象数组2
     * @param property 需要对比的属性名称
    */
    export function dataCompareDifferent(data1: Array<any>, data2: Array<any>, property: string): Array<any> {
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

    /**
       * 往第一个数组中陆续添加第二个数组中的元素
       * @param data1  
       * @param data2 
       */
    export function data1AddToData2(data1, data2): void {
        for (let index = 0; index < data2.length; index++) {
            const element = data2[index];
            data1.push(element);
        }
    }

    /**
      * 获取本地存储数据并且和文件中数据表对比,对比后会上传
      * @param arr 本地数据表
      * @param storageName 本地存储中的json名称
      * @param propertyName 数组中每个对象中同一个属性名，通过这个名称进行对比
      */
    export function dataCompare(arr: Array<any>, storageName: string, propertyName: string): Array<any> {
        // 第一步，先尝试从本地缓存获取数据，
        // 第二步，如果本地缓存有，那么需要和数据表中的数据进行对比，把缓存没有的新增对象复制进去
        // 第三步，如果本地缓存没有，那么直接从数据表获取
        let dataArr;
        if (Laya.LocalStorage.getJSON(storageName)) {
            dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName))[storageName];
            console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
            try {
                let dataArr_0: Array<any> = arr;
                // 如果本地数据条数大于json条数，说明json减东西了，不会对比，json只能增加不能删减
                if (dataArr_0.length >= dataArr.length) {
                    let diffArray = Tools.dataCompareDifferent(dataArr_0, dataArr, propertyName);
                    console.log('两个数据的差值为：', diffArray);
                    Tools.data1AddToData2(dataArr, diffArray);
                } else {
                    console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                }
            } catch (error) {
                console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！')
            }
        } else {
            try {
                dataArr = arr;
            } catch (error) {
                console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！')
            }
        }
        let data = {};
        data[storageName] = dataArr;
        Laya.LocalStorage.setJSON(storageName, JSON.stringify(data));
        return dataArr;
    }

    /**
     * 移除该节点的所有子节点，没有子节点则无操作
     * @param node 节点
      */
    export function node_RemoveAllChildren(node: Laya.Node): void {
        if (node.numChildren > 0) {
            node.removeChildren(0, node.numChildren - 1);
        }
    }

    /**
     * 切换显示或隐藏子节点，当输入的名称数组是显示时，其他子节点则是隐藏
     * @param node 节点
     * @param childNameArr 子节点名称数组
     * @param bool 隐藏还是显示，true为显示，flase为隐藏，默认为true
     */
    export function node_2DShowExcludedChild(node: Laya.Sprite, childNameArr: Array<string>, bool?: boolean): void {
        for (let i = 0; i < node.numChildren; i++) {
            let Child = node.getChildAt(i) as Laya.Sprite;
            for (let j = 0; j < childNameArr.length; j++) {
                if (Child.name == childNameArr[j]) {
                    if (bool || bool == undefined) {
                        Child.visible = true;
                    } else {
                        Child.visible = false;
                    }
                } else {
                    if (bool || bool == undefined) {
                        Child.visible = false;
                    } else {
                        Child.visible = true;
                    }
                }
            }
        }
    }
}