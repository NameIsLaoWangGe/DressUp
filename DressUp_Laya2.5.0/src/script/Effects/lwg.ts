
/**综合模板*/
export module lwg {

    /**
    * 时间管理
    * 计时器的封装
   */
    export module TimerAdmin {
        /**
         * 普通无限循环，基于帧
         * @param delay 间隔帧数
         * @param caller 执行域
         * @param method 方法回调
         * @param immediately 是否立即执行一次，默认为false
         * @param args 
         * @param coverBefore 
         */
        export function _frameLoop(delay: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                method();
            }
            Laya.timer.frameLoop(delay, caller, () => {
                method();
            }, args, coverBefore);
        }

        /**
         * 在两个时间区间内中随机时间点触发的无限循环，基于帧
         * @param delay1 间隔帧数区间1
         * @param delay2 间隔帧数区间2
         * @param caller 执行域
         * @param method 方法回调
         * @param args 
         * @param coverBefore 
         */
        export function _frameRandomLoop(delay1: number, delay2: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                method();
            }
            var func = () => {
                let delay = Tools.randomOneInt(delay1, delay2);
                Laya.timer.frameOnce(delay, caller, () => {
                    method();
                    func()
                }, args, coverBefore)
            }
            func();
        }

        /**
         * 有一定次数的循环，基于帧
         * @param delay 时间间隔
         * @param num 次数
         * @param method 回调函数
         * @param immediately 是否立即执行一次，默认为false
         * @param args 
         * @param coverBefore 
         */
        export function _frameNumLoop(delay: number, num: number, caller, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                method();
            }
            let num0 = 0;
            Laya.timer.frameLoop(delay, caller, () => {
                num0++;
                if (num0 > num) {
                    Laya.timer.clearAll(caller);
                } else {
                    method();
                }
            }, args, coverBefore);
        }

        /**
         * 执行一次的计时器，基于帧
         * @param delay 延时
         * @param afterMethod 结束回调函数
         * @param beforeMethod 开始之前的函数
         * @param args 
         * @param coverBefore 
         */
        export function _frameOnce(delay: number, caller, afterMethod: Function, beforeMethod?: Function, args?: any[], coverBefore?: boolean): void {
            if (beforeMethod) {
                beforeMethod();
            }
            Laya.timer.frameOnce(delay, caller, () => {
                afterMethod();
            }, args, coverBefore)
        }


        /**
         * 普通无限循环，基于时间
         * @param delay 时间
         * @param caller 执行域
         * @param method 方法回调
         * @param immediately 是否立即执行一次，默认为false
         * @param args 
         * @param coverBefore 
         */
        export function _loop(delay: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                method();
            }
            Laya.timer.loop(delay, caller, () => {
                method();
            }, args, coverBefore);
        }

        /**
         * 在两个时间区间内中随机时间点触发的无限循环，基于时间
         * @param delay1 时间区间1
         * @param delay2 时间区间2
         * @param caller 执行域
         * @param method 方法回调
         * @param immediately 是否立即执行一次，默认为false
         * @param args 
         * @param coverBefore 
         */
        export function _randomLoop(delay1: number, delay2: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                method();
            }
            var func = () => {
                let delay = Tools.randomOneInt(delay1, delay2);
                Laya.timer.once(delay, caller, () => {
                    method();
                    func();
                }, args, coverBefore);
            }
            func();
        }

        /**
         * 有一定次数的循环，基于时间
         * @param delay 时间
         * @param num 次数
         * @param method 回调函数
         * @param immediately 是否立即执行一次，默认为false
         * @param args 
         * @param coverBefore 
         */
        export function _numLoop(delay: number, num: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                method();
            }
            let num0 = 0;
            Laya.timer.loop(delay, caller, () => {
                num0++;
                if (num0 >= num) {
                    Laya.timer.clearAll(caller);
                } else {
                    method();
                }
            }, args, coverBefore);
        }

        /**
        * 执行一次的计时器，基于时间
        * @param delay 延时
        * @param afterMethod 结束回调函数
        * @param beforeMethod 开始之前的函数
        * @param args 
        * @param coverBefore 
        */
        export function _once(delay: number, afterMethod: Function, beforeMethod?: Function, args?: any[], coverBefore?: boolean): void {
            if (beforeMethod) {
                beforeMethod();
            }
            let caller = {};
            Laya.timer.once(delay, caller, () => {
                afterMethod();
            }, args, coverBefore)
        }
    }

    /**滤镜模块,主要是为节点和场景等进行颜色变化设置*/
    export module Color {
        /**
         * RGB三个颜色值转换成16进制的字符串‘000000’，需要加上‘#’；
         * @param r 
         * @param g
         * @param b
          */
        export function RGBtoHexString(r, g, b) {
            return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
        }
        /**
         * 给一张图片染色,包括其子节点,也可以设置一个消失时间
         * @param node 节点
         * @param RGBA [R,G,B,A]
         * @param vanishtime 默认不会消失，一旦设置后，将会在这个时间延时后消失
         */
        export function _colour(node: Laya.Sprite, RGBA?: Array<number>, vanishtime?: number): Laya.ColorFilter {
            let cf = new Laya.ColorFilter();
            node.blendMode = 'null';
            if (!RGBA) {
                cf.color(255, 0, 0, 1)
            } else {
                cf.color(RGBA[0], RGBA[1], RGBA[2], RGBA[3])
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
                })
            }
            return cf;
        }

        /**
         * 颜色变化生命周期，在时间内改进行一次颜色渐变，之后回到原来的颜色，RGB颜色为匀速增加,基于帧率
         * @param node 节点
         * @param RGBA  [R,G,B,A],A必须输入
         * @param time time为时间， time*2为一个周期
         */
        export function _changeOnce(node, RGBA: Array<number>, time?: number, func?: Function): void {
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
                    if (speedA !== 0) A += speedA;
                    if (R >= RGBA[0]) {
                        caller.add = false;
                    }
                } else {
                    R -= speedR;
                    G -= speedG;
                    B -= speedB;
                    if (speedA !== 0) A -= speedA;
                    if (R <= 0) {
                        if (func) {
                            func();
                        }
                        Laya.timer.clearAll(caller);
                    }
                }
                cf.color(R, G, B, A);
                node.filters = [cf];
            })
        }

        /**
         * 颜色持续变化，不断的再一个颜色区间内变化，不会回到原来的颜色，除非手动清空其filters
         * @param node 节点
         * @param RGBA1 颜色区间1值[];A可以不输入
         * @param RGBA2 颜色区间2值[];A可以不输入
         * @param time 每次变化的时间
         */
        export function _changeConstant(node: Laya.Sprite, RGBA1: Array<number>, RGBA2: Array<number>, time: number): void {
            let cf: Laya.ColorFilter;
            let RGBA0 = [];
            if (!node.filters) {
                cf = new Laya.ColorFilter();
                cf.color(RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1);
                RGBA0 = [RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1];
                node.filters = [cf];
            } else {
                cf = node.filters[0];
                RGBA0 = [node.filters[0]['_alpha'][0], node.filters[0]['_alpha'][1], node.filters[0]['_alpha'][2], node.filters[0]['_alpha'][3] ? node.filters[0]['_alpha'][3] : 1];
            }
            // 随机出一条颜色值
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
                } else {
                    Laya.timer.clearAll(caller);
                }
                cf.color(RGBA0[0], RGBA0[1], RGBA0[2], RGBA0[3]);
                node.filters = [cf];
            })
        }
    }

    /**特效模块*/
    export module Effects {
        /**特效元素的图片地址，所有项目都可用*/
        export enum _SkinUrl {
            爱心1 = 'Frame/Effects/aixin1.png',
            爱心2 = "Frame/Effects/aixin2.png",
            爱心3 = "Frame/Effects/aixin3.png",
            花1 = "Frame/Effects/hua1.png",
            花2 = "Frame/Effects/hua2.png",
            花3 = "Frame/Effects/hua3.png",
            花4 = "Frame/Effects/hua4.png",
            星星1 = "Frame/Effects/star1.png",
            星星2 = "Frame/Effects/star2.png",
            星星3 = "Frame/Effects/star3.png",
            星星4 = "Frame/Effects/star4.png",
            星星5 = "Frame/Effects/star5.png",
            星星6 = "Frame/Effects/star6.png",
            星星7 = "Frame/Effects/star7.png",
            雪花1 = "Frame/Effects/xuehua1.png",
            叶子1 = "Frame/Effects/yezi1.png",
            圆形发光1 = "Frame/Effects/yuanfaguang.png",
            圆形1 = "Frame/Effects/yuan1.png",
            光圈1 = "Frame/Effects/guangquan1.png",
            光圈2 = "Frame/Effects/guangquan2.png",
        }

        /**
         * 光圈模块
         * */
        export module _Aperture {

            /**光圈模块的图片基类*/
            export class _ApertureImage extends Laya.Image {
                constructor(parent: Laya.Sprite, centerPoint: Laya.Point, width: number, height: number, rotation: Array<number>, urlArr: Array<string>, colorRGBA: Array<Array<number>>, zOder: number) {
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

            /**
             * 从中心点发出一个光圈，类似波浪，根据光圈不同的样式和节奏,通过控制宽高来控制放大多少
             * @param parent 父节点
             * @param centerPoint 发出位置
             * @param width 宽度，默认100
             * @param height 高度，默认100
             * @param rotation 角度区间[a,b],默认为随机
             * @param urlArr 图片数组，默认为框架中的图片
             * @param colorRGBA 颜色区间[[][]]
             * @param scale 最大放大区间[a,b]
             * @param zOder 层级，默认为0
             * @param speed 速度区间[a,b]，默认0.025，也表示了消失位置，和波浪的大小
             * @param accelerated 加速度,默认为0.0005
             */
            export function _continuous(parent: Laya.Sprite, centerPoint?: Laya.Point, width?: number, height?: number, rotation?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, zOder?: number, scale?: Array<number>, speed?: Array<number>, accelerated?: Array<number>): void {
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
                    } else if (moveCaller.scale) {
                        acc += _accelerated;
                        if (Img.scaleX > _scale) {
                            moveCaller.scale = false;
                            moveCaller.vanish = true;
                        }
                    } else if (moveCaller.vanish) {
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
                })
            }
        }

        /**粒子模块*/
        export module _Particle {
            export class _ParticleImgBase extends Laya.Image {
                /**
                 * 图片初始值设置
                 * Creates an instance of ImgBase.
                 * @param parent 父节点
                 * @param caller 执行域
                 * @param centerPoint 中心点
                 * @param sectionWH 以中心点为中心的宽高[w,h]
                 * @param distance 移动距离，区间[a,b]，随机移动一定的距离后消失;
                 * @param width 粒子的宽度区间[a,b]
                 * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
                 * @param rotation 角度区间[a,b]
                 * @param urlArr 图片地址集合，默认为框架中随机的样式
                 * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
                 * @param zOder 层级，默认为0
                 */
                constructor(parent: Laya.Sprite, centerPoint: Laya.Point, sectionWH: Array<number>, width: Array<number>, height: Array<number>, rotation: Array<number>, urlArr: Array<string>, colorRGBA: Array<Array<number>>, zOder: number) {
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

            /**
              * 发射一个垂直向下的粒子，类似于火星下落熄灭，水滴下落被蒸发,下雪，不是下雨状态
              * @param parent 父节点
              * @param caller 执行域
              * @param centerPoint 中心点
              * @param sectionWH 以中心点为中心的宽高[w,h]
              * @param width 粒子的宽度区间[a,b]
              * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
              * @param rotation 角度旋转[a,b]
              * @param urlArr 图片地址集合，默认为框架中随机的样式
              * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
              * @param zOder 层级，默认为0
              * @param distance 移动距离，区间[a,b]，在其中随机移动一定的距离后消失;
              * @param speed 吸入速度区间[a,b]
              * @param accelerated 加速度区间[a,b]
              */
            export function _fallingVertical(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: Array<number>, width?: Array<number>, height?: Array<number>, rotation?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, zOder?: number, distance?: Array<number>, speed?: Array<number>, accelerated?: Array<number>): Laya.Image {
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
                })
                return Img;
            }

            /**
             * 发射一个徐徐向上的粒子，类似于蒸汽上升，烟雾上升，光点上升，气球上升
             * @param parent 父节点
             * @param caller 执行域
             * @param centerPoint 中心点
             * @param radius 半径区间[a,b]
             * @param rotation 角度区间，默认为360
             * @param width 粒子的宽度区间[a,b]
             * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
             * @param urlArr 图片地址集合，默认为框架中随机的样式
             * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
             * @param speed  速度区间[a,b]
             * @param accelerated 加速度区间[a,b]
             * @param zOder 层级，默认为0
             */
            export function _slowlyUp(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: Array<number>, width?: Array<number>, height?: Array<number>, rotation?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, zOder?: number, distance?: Array<number>, speed?: Array<number>, accelerated?: Array<number>): Laya.Image {
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

                    } else {
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
                })
                return Img;
            }

            /**
               * 单个，四周，喷射，旋转爆炸
               * @param parent 父节点
               * @param caller 执行域
               * @param centerPoint 中心点
               * @param width 粒子的宽度区间[a,b]
               * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
               * @param rotation 旋转角度
               * @param angle 角度区间，默认为360
               * @param urlArr 图片地址集合，默认为框架中随机的样式
               * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
               * @param distance 移动距离区间[a,b]
               * @param rotationSpeed 旋转速度
               * @param speed  速度区间[a,b]
               * @param accelerated 加速度区间[a,b]
               * @param zOder 层级，默认为0
               */
            export function _spray(parent: Laya.Sprite, centerPoint?: Laya.Point, width?: Array<number>, height?: Array<number>, rotation?: Array<number>, angle?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, zOder?: number, distance?: Array<number>, rotationSpeed?: Array<null>, speed?: Array<number>, accelerated?: Array<number>): Laya.Image {
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
                    } else {
                        if (radius < distance1 && moveCaller.move) {

                        } else {
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
                })
                return Img;
            }

            /**
             * 单个，移动到目标位置，再次移动一点，然后消失
             * @param parent 父节点
             * @param caller 执行域
             * @param centerPoint 中心点
             * @param width 粒子的宽度区间[a,b]
             * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
             * @param rotation 旋转角度
             * @param angle 角度区间，默认为360
             * @param urlArr 图片地址集合，默认为框架中随机的样式
             * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
             * @param distance 移动距离区间[a,b]
             * @param rotationSpeed 旋转速度
             * @param speed  速度区间[a,b]
             * @param accelerated 加速度区间[a,b]
             * @param zOder 层级，默认为0
             */
            export function _moveToTargetToMove(parent: Laya.Sprite, centerPoint?: Laya.Point, width?: Array<number>, height?: Array<number>, rotation?: Array<number>, angle?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, zOder?: number, distance1?: Array<number>, distance2?: Array<number>, rotationSpeed?: Array<null>, speed?: Array<number>, accelerated?: Array<number>): Laya.Image {
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
                    } else if (moveCaller.move1) {
                        acc += accelerated0;
                        radius += speed0 + acc;
                        if (radius >= dis1) {
                            moveCaller.move1 = false;
                            moveCaller.stop = true;
                        }
                    } else if (moveCaller.stop) {
                        acc -= 0.3;
                        radius += 0.1;
                        if (acc <= 0) {
                            moveCaller.stop = false;
                            moveCaller.move2 = true;
                        }
                    } else if (moveCaller.move2) {
                        acc += accelerated0 / 2;
                        radius += speed0 + acc;
                        if (radius >= dis1 + dis2) {
                            moveCaller.move2 = false;
                            moveCaller.vinish = true;
                        }
                    } else if (moveCaller.vinish) {
                        radius += 0.5;
                        Img.alpha -= 0.05;
                        if (Img.alpha <= 0) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                    let point = Tools.point_GetRoundPos(angle0, radius, centerPoint0);
                    Img.pos(point.x, point.y);
                })
                return Img;
            }

            /**
             * 以同一个中心点，随机半径的圆形中，发射一个粒子，运动到中心点后消失
             * @param parent 父节点
             * @param caller 执行域
             * @param centerPoint 中心点
             * @param radius 半径区间[a,b]
             * @param rotation 角度区间，默认为360
             * @param width 粒子的宽度区间[a,b]
             * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
             * @param urlArr 图片地址集合，默认为框架中随机的样式
             * @param speed 吸入速度区间[a,b]
             * @param accelerated 加速度区间[a,b]
             * @param zOder 层级，默认为0
             */
            export function _AnnularInhalation(parent, centerPoint: Laya.Point, radius: Array<number>, rotation?: Array<number>, width?: Array<number>, height?: Array<number>, urlArr?: Array<string>, speed?: Array<number>, accelerated?: number, zOder?: number): Laya.Image {
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
                    } else {
                        acc += accelerated;
                        radius0 -= (speed0 + acc);
                    }
                    let point = Tools.point_GetRoundPos(angle, radius0, centerPoint);
                    Img.pos(point.x, point.y);
                    if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                        Img.removeSelf();
                        Laya.timer.clearAll(caller);
                    }
                })
                return Img;
            }
        }

        /**闪光*/
        export module _Glitter {
            export class _GlitterImage extends Laya.Image {
                constructor(parent: Laya.Sprite, centerPos: Laya.Point, radiusXY: Array<number>, urlArr: Array<string>, colorRGBA: Array<Array<number>>, width: Array<number>, height: Array<number>) {
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


            /**
             * 在一个点内的随机范围内，创建一个星星，闪烁后消失
             * @param parent 父节点
             * @param centerPos 中心点
             * @param radiusXY X,Y轴半径，默认问100
             * @param urlArr 图片地址[]，默认为星星图片
             * @param colorRGBA 上色区间[[][]]
             * @param width [a,b];
             * @param height [a,b]如果为null则为width;
             * @param scale  放大到区间 [a,b]
             * @param speed  闪烁速度区间[a,b],默认[0.01,0.02]
             * @param rotateSpeed 旋转速率区间[a,b],默认为正负5度
             */
            export function _blinkStar(parent: Laya.Sprite, centerPos?: Laya.Point, radiusXY?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, width?: Array<number>, height?: Array<number>, scale?: Array<number>, speed?: Array<number>, rotateSpeed?: Array<number>): Laya.Image {
                let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height);
                // 最大放大大小
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
                    } else if (moveCaller.scale) {
                        Img.rotation += _rotateSpeed;
                        Img.scaleX = Img.scaleY += _speed;
                        if (Img.scaleX > _scale) {
                            moveCaller.scale = false;
                            moveCaller.vanish = true;
                        }
                    } else if (moveCaller.vanish) {
                        Img.rotation -= _rotateSpeed;
                        Img.alpha -= 0.015;
                        Img.scaleX -= 0.01;
                        Img.scaleY -= 0.01;
                        if (Img.scaleX <= 0) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                }
                Laya.timer.frameLoop(1, moveCaller, ani);
                return Img;
            }

            /**
           * 渐隐渐出循环闪光
           * @param parent 父节点
           * @param caller 执行域，一般是当前执行的脚本，最后一并清理
           * @param x x位置
           * @param y y位置
           * @param width 宽
           * @param height 高
           * @param zOder 层级
           * @param url 图片地址
           * @param speed 闪烁速度
           * @param count 默认不限次数
           */
            export function _simpleInfinite(parent: Laya.Sprite, x: number, y: number, width: number, height: number, zOder: number, url?: string, speed?: number): Laya.Image {
                let Img = new Laya.Image();
                parent.addChild(Img);
                Img.pos(x, y);
                Img.width = width;
                Img.height = height;
                Img.pivotX = width / 2;
                Img.pivotY = height / 2;
                Img.skin = url ? url : _SkinUrl[24];
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
                            } else {
                                add = true;
                            }
                        }
                    } else {
                        Img.alpha += speed ? speed * 2 : 0.01 * 2;
                        if (Img.alpha >= 1) {
                            add = false;
                            caller['end'] = true;
                        }
                    }
                }
                Laya.timer.frameLoop(1, caller, func);
                return Img;
            }
        }

        /**循环模块*/
        export module _circulation {
            /**循环模块基类*/
            export class _circulationImage extends Laya.Image {
                constructor(parent: Laya.Sprite, urlArr: Array<string>, colorRGBA: Array<Array<number>>, width: Array<number>, height: Array<number>, zOder: number) {
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

            /**
             * 多点循环，在一组点中，以第一个点为起点，最后一个点为终点无限循环
             * @param {Laya.Sprite} parent 父节点
             * @param {Array<Array<number>>} [posArray] 坐标点集合[[x,y]]
             * @param {Array<string>} [urlArr] 皮肤结合
             * @param {Array<Array<number>>} [colorRGBA] 颜色区间[[ ][ ]]               
             * @param {Array<number>} [width] 宽度区间[a,b]
             * @param {Array<number>} [height] 高度区间[a,b]
             * @param {number} [zOder] 层级
             * @param {number} [speed] 速度
             */
            export function _corner(parent: Laya.Sprite, posArray: Array<Array<number>>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, width?: Array<number>, height?: Array<number>, zOder?: number, speed?: number): void {
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
                }
                func();
            }
        }
    }

    /**动画模块*/
    export module Animation2D {

        /**
          * 按中心点旋转动画
          * @param node 节点
          * @param Frotate 初始角度
          * @param Erotate 最终角度
          * @param time 花费时间
          * @param delayed 延时时间
          * @param func 回调函数
        */
        export function simple_Rotate(node, Frotate, Erotate, time, delayed?: number, func?: Function): void {
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

        /**
         * 上下翻转动画
         * @param node 节点
         * @param time 花费时间
         */
        export function upDown_Overturn(node, time, func?: Function): void {
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

        /**
         * 上下旋转动画
         * @param node 节点
         * @param time 花费时间
         * @param func 回调函数
         */
        export function leftRight_Overturn(node, time, func): void {
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

        /**
         * 左右抖动
         * @param node 节点
         * @param range 幅度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         * @param click 是否设置场景此时可点击,默认可以点击，为true
         */
        export function leftRight_Shake(node, range, time, delayed?: number, func?: Function, click?: boolean): void {
            if (!delayed) {
                delayed = 0;
            }
            if (!click) {
                Admin._clickLock.switch = true;
            }
            Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                // PalyAudio.playSound(Enum.AudioName.commonShake, 1);
                Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                    // PalyAudio.playSound(Enum.AudioName.commonShake, 1);
                    Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                        if (!click) {
                            Admin._clickLock.switch = false;
                        }
                    }))
                }))
            }), delayed);
        }

        /**
         * 上下抖动
         * @param node 节点
         * @param range 幅度
         * @param time 花费时间
         * @param delayed 延迟时间
         * @param func 回调函数
         */
        export function upDwon_Shake(node, range, time, delayed, func): void {
            Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }))
                }))
            }), delayed)
        }

        /**
         * 渐隐渐出
         * @param node 节点
         * @param alpha1 最初的透明度
         * @param alpha2 渐隐到的透明度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         * @param  场景可否点击
         */
        export function fadeOut(node, alpha1, alpha2, time, delayed?: number, func?: Function, stageClick?: boolean): void {
            node.alpha = alpha1;
            if (!delayed) {
                delayed = 0;
            }
            Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                if (func) {
                    func();
                }
            }), delayed)
        }

        /**
         * 渐出
         * @param node 节点
         * @param alpha1 最初的透明度
         * @param alpha2 渐隐到的透明度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         */
        export function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func): void {
            node.alpha = alpha1;
            Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
        * 渐出+移动，起始位置都是0，最终位置都是1
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstY 初始y位置
        * @param targetX x轴移动位置
        * @param targetY y轴移动位置
        * @param time 花费时间
        * @param delayed 延时
        * @param func 回调函数
        */
        export function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 0;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 渐隐+移动，起始位置都是1，最终位置都是0
         * @param node 节点
         * @param firstX 初始x位置
         * @param firstY 初始y位置
         * @param targetX x轴目标位置
         * @param targetY y轴目标位置
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
        */
        export function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 1;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
        * 渐出+移动+缩放，起始位置都是0，最终位置都是1
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstY 初始y位置
        * @param targetX x轴移动位置
        * @param targetY y轴移动位置
        * @param time 花费时间
        * @param delayed 延时
        * @param func 回调函数
        */
        export function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 0;
            node.targetX = 0;
            node.targetY = 0;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 移动+缩放,等比缩放
         * @param node 节点
         * @param fScale 初始大小
         * @param fX 初始x位置
         * @param fY 初始y位置
         * @param tX x轴目标位置
         * @param tY y轴目标位置
         * @param eScale 最终大小
         * @param time 花费时间
         * @param delayed 延时
         * @param ease 效果函数
         * @param func 回调函数
         */
        export function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed?: number, ease?: Function, func?: Function): void {
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

        /**
         *旋转+放大缩小 
         * @param target 目标节点
         * @param fRotate 初始角度
         * @param fScaleX 初始X缩放
         * @param fScaleY 初始Y缩放
         * @param eRotate 最终角度
         * @param eScaleX 最终X缩放
         * @param eScaleY 最终Y缩放
         * @param time 花费时间
         * @param delayed 延迟时间
         * @param func 回调函数
         */
        export function rotate_Scale(target: Laya.Sprite, fRotate, fScaleX, fScaleY, eRotate, eScaleX, eScaleY, time, delayed?: number, func?: Function): void {
            target.scaleX = fScaleX;
            target.scaleY = fScaleY;
            target.rotation = fRotate;
            Laya.Tween.to(target, { rotation: eRotate, scaleX: eScaleX, scaleY: eScaleY }, time, null, Laya.Handler.create(this, () => {
                if (func) {
                    func();
                }
                target.rotation = 0;
            }), delayed ? delayed : 0)
        }

        /**
         * 简单下落
         * @param node 节点
         * @param fY 初始Y位置
         * @param tY 目标Y位置
         * @param rotation 落地角度
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function drop_Simple(node, fY, tY, rotation, time, delayed, func): void {
            node.y = fY;
            Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed);
        }

        /**
          * 下落回弹动画 ，类似于连丝蜘蛛下落，下落=》低于目标位置=》回到目标位置
          * @param target 目标
          * @param fAlpha 初始透明度
          * @param firstY 初始位置
          * @param targetY 目标位置
          * @param extendY 延伸长度
          * @param time1 花费时间
          * @param delayed 延时时间
          * @param func 结束回调函数
          * */
        export function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed?: number, func?: Function): void {

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

        /**
         * 偏移下落,模仿抛物线
         * @param node 节点
         * @param targetY y目标位置
         * @param targetX x偏移量
         * @param rotation 落地角度
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func): void {
            // 第一阶段
            Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), 0);
            }), delayed);
        }

        /**
         * 上升
         * @param node 节点
         * @param initialY 初始y位置
         * @param initialR 初始角度
         * @param targetY 目标y位置
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func): void {
            node.y = initialY;
            node.rotation = initialR;
            Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed);
        }

        /**
         * 用于卡牌X轴方向的横向旋转
         * 两个面不一样的卡牌旋转动画，卡��正面有内容，卡牌背面没有内容，这个内容是一个子节点
         * @param node 节点
         * @param time 每次旋转1/2次花费时间
         * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
         * @param delayed 延时时间
         * @param func2 结束时回调函数
         */
        export function cardRotateX_TowFace(node: Laya.Sprite, time: number, func1?: Function, delayed?: number, func2?: Function): void {
            Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                // 所有子节点消失
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

        /**
        * 用于卡牌X轴方向的横向旋转
        * 两个面一样的卡牌旋转动画，正反面内容是一样的
        * @param node 节点
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param time 每次旋转1/2次花费时间
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateX_OneFace(node: Laya.Sprite, func1: Function, time: number, delayed: number, func2: Function): void {
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

        /**
        * 用于卡牌Y轴方向的纵向旋转
        * 两个面不一样的卡牌旋转动画，卡牌正面有内容，卡牌背面没有内容，这个内容是一个子节点
        * @param node 节点
        * @param time 每次旋转1/2次花费时间
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateY_TowFace(node: Laya.Sprite, time: number, func1?: Function, delayed?: number, func2?: Function): void {
            Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                // 所有子节点消失
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

        /**
        * 用于卡牌Y轴方向的纵向旋转
        * 两个面一样的卡牌旋转动画，正反面内容是一样的
        * @param node 节点
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param time 每次旋转1/2次花费时间
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateY_OneFace(node: Laya.Sprite, func1: Function, time: number, delayed?: number, func2?: Function): void {
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

        /**
         * 移动中变化一次角度属性，分为两个阶段，第一个阶段是移动并且变化角度，第二个阶段是到达目标位置，并且角度回归为0
         * @param node 节点
         * @param targetX 目标x位置
         * @param targetY 目标y位置
         * @param per 中间位置的百分比
         * @param rotation_per 第一阶段变化到多少角度
         * @param time 花费时间
         * @param func
         */
        export function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func): void {

            let targetPerX = targetX * per + node.x * (1 - per);
            let targetPerY = targetY * per + node.y * (1 - per);

            Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), 0);
        }

        /**
         * 左右拉伸的Q弹动画
         * @param node 节点
         * @param MaxScale 最大拉伸
         * @param time 拉伸需要的时间，然后持续衰减
         * @param delayed 延时
         * @param func 回调函数
         */
        export function bomb_LeftRight(node, MaxScale, time, func?: Function, delayed?: number): void {
            Laya.Tween.to(node, { scaleX: MaxScale }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleX: 0.85 }, time * 0.5, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: MaxScale * 0.9 }, time * 0.55, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0.95 }, time * 0.6, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.65, null, Laya.Handler.create(this, function () {
                                if (func) func();
                            }), 0);
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 类似气球弹出并且回弹，第一个阶段弹到空中，这个阶段可以给个角度，第二阶段落下变为原始状态，第三阶段再次放大一次，这次放大小一点，第四阶段回到原始状态，三、四个阶段是回弹一次，根据第一个阶段参数进行调整
         * @param node 节点
         * @param firstAlpha 初始透明度
         * @param  firstScale 最终大小，因为有些节点可能初始Scale并不是1
         * @param scale1 第一阶段放大比例
         * @param rotation 第一阶段角度 
         * @param time1 第一阶段花费时间
         * @param time2 第二阶段花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function bombs_Appear(node, firstAlpha, endScale, scale1, rotation1, time1, time2, delayed?: number, func?: Function): void {
            node.scale(0, 0);
            node.alpha = firstAlpha;
            Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, rotation: rotation1 }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale + (scale1 - endScale) * 0.2, scaleY: endScale + (scale1 - endScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed ? delayed : 0);
        }

        /**
         * 类似气球弹出并且回弹，所有子节点按顺序弹出来
         * @param node 节点
         * @param firstAlpha 初始透明度
         * @param endScale 初始大小
         * @param rotation1 第一阶段角度
         * @param scale1 第一阶段放大比例
         * @param time1 第一阶段花费时间
         * @param time2 第二阶段花费时间
         * @param interval 每个子节点的时间间隔
         * @param func 完成回调
         * @param audioType 音效类型
         */
        export function bombs_AppearAllChild(node: Laya.Sprite, firstAlpha, endScale, scale1, rotation1, time1, time2, interval?: number, func?: Function, audioType?: String): void {
            let de1 = 0;
            if (!interval) {
                interval = 100;
            }
            for (let index = 0; index < node.numChildren; index++) {
                let Child = node.getChildAt(index) as Laya.Sprite;
                Child.alpha = 0;
                Laya.timer.once(de1, this, () => {
                    Child.alpha = 1;
                    if (index !== node.numChildren - 1) {
                        func == null;
                    }
                    bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, time2, null, func);
                })
                de1 += interval;
            }
        }


        /**
         *  类似气球消失，所有子节点按顺序消失
          * @param node 节点
         * @param scale 收缩后的大小
         * @param alpha 收缩后的透明度
         * @param rotation 收缩后的角度 
         * @param time 每个子节点花费时间
         * @param interval 每个子节点时间间隔
         * @param func 完成后的回调
         */
        export function bombs_VanishAllChild(node, endScale, alpha, rotation, time, interval, func?: Function) {
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
                })
                de1 += interval;
            }
        }

        /**
         * 类似气球收缩消失
         * @param node 节点
         * @param scale 收缩后的大小
         * @param alpha 收缩后的透明度
         * @param rotation 收缩后的角度 
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function bombs_Vanish(node, scale, alpha, rotation, time, delayed?: number, func?: Function): void {
            Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                if (func) {
                    func()
                }
            }), delayed ? delayed : 0);
        }

        /**
         * 类似于心脏跳动的回弹效果
         * @param node 节点
         * @param firstScale 初始大小,也就是原始大小
         * @param scale1 需要放大的大小,
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function swell_shrink(node, firstScale, scale1, time, delayed?: number, func?: Function): void {
            // PalyAudio.playSound(Enum.AudioName.commonPopup, 1);
            if (!delayed) {
                delayed = 0;
            }
            Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 简单移动,初始位置可以为null
         * @param node 节点
         * @param fX 初始x位置
         * @param fY 初始y位置
         * @param targetX 目标x位置
         * @param targetY 目标y位置
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         * @param ease 动画类型
         */
        export function move_Simple(node, fX, fY, targetX, targetY, time, delayed?: number, func?: Function, ease?: Function,): void {
            node.x = fX;
            node.y = fY;
            Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                if (func) {
                    func()
                }
            }), delayed ? delayed : 0);
        }

        /**
        * X轴方向的移动伴随形变回弹效果，移动的过程中X轴会被挤压，然后回到原始状态
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstR 初始角度
        * @param scaleX x轴方向的挤压增量
        * @param scaleY y轴方向的挤压增量
        * @param targetX 目标X位置
        * @param time 花费时间
        * @param delayed 延时时间
        * @param func 完成后的回调
        */
        export function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func): void {
            node.alpha = 0;
            node.x = firstX;
            node.rotation = firstR;
            Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }


        /**
        * Y轴方向的移动伴随形变回弹效果，移动的过程中X轴会被挤压，然后回到原始状态
        * @param target 节点
        * @param firstY 初始Y位置
        * @param firstR 初始角度
        * @param scaleY y轴方向的挤压
        * @param scaleX x轴方向的挤压
        * @param targeY 目标Y位置
        * @param time 花费时间
        * @param delayed 延时时间
        * @param func 完成后的回调
        */
        export function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func): void {
            target.alpha = 0;
            if (firstY) {
                target.y = firstY;
            }
            target.rotation = firstR;
            Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
        * 简单的透明度渐变闪烁动画,闪一下消失
        * @param target 节点
        * @param minAlpha 最低到多少透明度
        * @param maXalpha 最高透明度
        * @param time 花费时间
        * @param delayed 延迟时间
        * @param func 完成后的回调
        */
        export function blink_FadeOut_v(target, minAlpha, maXalpha, time, delayed, func): void {
            target.alpha = minAlpha;
            Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
          * 简单的透明度渐变闪烁动画，闪烁后不消失
          * @param target 节点
          * @param minAlpha 最低到多少透明度
          * @param maXalpha 最高透明度
          * @param time 花费时间
          * @param delayed 延迟时间
          * @param func 完成后的回调
          */
        export function blink_FadeOut(target, minAlpha, maXalpha, time, delayed?: number, func?: Function): void {
            target.alpha = minAlpha;
            if (!delayed) {
                delayed = 0;
            }
            Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
          * 根据节点的锚点进行摇头动画，类似于不倒翁动画
          * @param target 节点
          * @param rotate 摇摆的幅度
          * @param time 花费时间
          * @param delayed 延迟时间
          * @param func 完成后的回调
          */
        export function shookHead_Simple(target, rotate, time, delayed?: number, func?: Function): void {
            let firstR = target.rotation;
            Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(target, { rotation: firstR - rotate * 2 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { rotation: firstR }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed ? delayed : 0);
        }

        /**
         * 提示框动画1,从渐隐出现+上移=》停留=》到渐隐消失+向下
         * @param target 节点
         * @param upNum 向上上升高度
         * @param time1 向上上升的时间
         * @param stopTime 停留时间
         * @param downNum 向下消失距离
         * @param time2 向下消失时间
         * @param func 结束回调
         */
        export function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func): void {
            target.alpha = 0;
            Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func()
                        }

                    }), 0);
                }), 0);
            }), 0);
        }


        /**
        * 放大缩小加上渐变
        * @param target 节点
        * @param fAlpha 初始透明度
        * @param fScaleX 初始X大小
        * @param fScaleY 初始Y大小
        * @param endScaleX 最终X大小
        * @param endScaleY 最终Y大小
        * @param eAlpha 最终透明度
        * @param time 花费时间
        * @param delayed 延迟时间
        * @param func 结束回调
        * @param ease 效果
        */
        export function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed?: number, func?: Function, ease?: Function): void {
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
                    func()
                }
            }), delayed);
        }

        /**
         * 旋转放大回弹动画，旋转放大角度增加=》原始大小和角度=，旋转放大角度增加=》原始大小和角度，有一个回来效果
         * @param target 目标
         * @param eAngle 延伸角度，就是回收前的多出的角度
         * @param eScale 延伸大小，就是回收前的放大的大小
         * @param time1 第一阶段花费时间
         * @param time2 第二阶段花费时间
         * @param delayed1 第一阶段延时时间
         * @param delayed2 第一阶段延时时间
         * @param func 结束回调函数
         * */
        export function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func): void {
            node.alpha = 0;
            node.scaleX = 0;
            node.scaleY = 0;
            Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                            node.rotation = 0;
                            if (func !== null) {
                                func()
                            }
                        }), 0);
                    }), delayed2);
                }), 0);
            }), delayed1);
        }
    }

    /**工具模块*/
    export module Tools {
        /**
        * RGB三个颜色值转换成16进制的字符串‘000000’，需要加上‘#’；
        * @param r 
        * @param g
        * @param b
         */
        export function color_RGBtoHexString(r, g, b) {
            return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
        }
        /**
       * 将数字格式化，例如1000 = 1k；
       * @param number 数字
       */
        export function format_FormatNumber(number: number): string {
            if (typeof (number) !== "number") {
                console.warn("要转化的数字并不为number");
                return number;
            }
            let backNum: string;
            if (number < 1000) {
                backNum = "" + number;
            } else if (number < 1000000) {
                backNum = "" + (number / 1000).toFixed(1) + "k";
            } else if (number < 10e8) {
                backNum = "" + (number / 1000000).toFixed(1) + "m";
            } else {
                backNum = "" + number;
            }
            return backNum;
        }

        /**
         * 字符串和数字相加返回字符串
         * */
        export function format_StrAddNum(str: string, num: number): string {
            return (Number(str) + num).toString();
        }
        /**
         * 数字和字符串相加返回数字
         * */
        export function format_NumAddStr(num: number, str: string): number {
            return Number(str) + num;
        }

        /**
         * 根据子节点的某个属性，获取相同属性的数组
         * @param node 节点
         * @param property 属性值
         * @param value 值
         * */
        export function node_GetChildArrByProperty(node: Laya.Node, property: string, value: any): Array<Laya.Node> {
            let childArr = [];
            for (let index = 0; index < node.numChildren; index++) {
                const element = node.getChildAt(index);
                if (element[property] == value) {
                    childArr.push(element);
                }
            }
            return childArr;
        }
        /**
         * 随机出数个子节点，返回这个子节点数组
         * @param node 节点
         * @param num 数量，默认为1
         */
        export function node_RandomChildren(node: Laya.Node, num?: number): Array<Laya.Node> {
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
        /**
         * 切换隐藏或显示子节点，当输入的名称数组是隐藏时，其他子节点则是显示
         * @param node 节点
         * @param childNameArr 子节点名称数组
         * @param bool 隐藏还是显示，true为显示，flase为隐藏
         */
        export function node_3DShowExcludedChild(node: Laya.MeshSprite3D, childNameArr: Array<string>, bool?: boolean): void {
            for (let i = 0; i < node.numChildren; i++) {
                let Child = node.getChildAt(i) as Laya.MeshSprite3D;
                for (let j = 0; j < childNameArr.length; j++) {
                    if (Child.name == childNameArr[j]) {
                        if (bool || bool == undefined) {
                            Child.active = true;
                        } else {
                            Child.active = false;
                        }
                    } else {
                        if (bool || bool == undefined) {
                            Child.active = false;
                        } else {
                            Child.active = true;
                        }
                    }
                }
            }
        }

        /**
         *2D隐藏或者打开所有子节点
         * @param node 节点
         * @param bool visible控制
        */
        export function node_2DChildrenVisible(node: Laya.Sprite, bool: boolean): void {
            for (let index = 0; index < node.numChildren; index++) {
                const element = node.getChildAt(index) as Laya.Sprite;
                if (bool) {
                    element.visible = true;
                } else {
                    element.visible = false;
                }
            }
        }

        /**
         *3D隐藏或者打开所有子节点
         * @param node 节点
         * @param bool visible控制
        */
        export function node_3DChildrenVisible(node: Laya.MeshSprite3D, bool: boolean): void {
            for (let index = 0; index < node.numChildren; index++) {
                const element = node.getChildAt(index) as Laya.MeshSprite3D;
                if (bool) {
                    element.active = true;
                } else {
                    element.active = false;
                }
            }
        }

        /**3D递归向下查找子节点*/
        export function node_3dFindChild(parent: any, name: string): Laya.MeshSprite3D {
            var item: Laya.MeshSprite3D = null;
            //寻找自身一级目录下的子物体有没有该名字的子物体
            item = parent.getChildByName(name) as Laya.MeshSprite3D;
            //如果有，返回他
            if (item != null) return item;
            var go: Laya.MeshSprite3D = null;
            //如果没有，就吧该父物体所有一级子物体下所有的二级子物体找一遍(以此类推)
            for (var i = 0; i < parent.numChildren; i++) {
                go = node_3dFindChild(parent.getChildAt(i) as Laya.MeshSprite3D, name);
                if (go != null)
                    return go;
            }
            return null;
        }

        /**2D递归向下查找子节点*/
        export function node_2dFindChild(parent: any, name: string): Laya.Sprite {
            var item: Laya.Sprite = null;
            //寻找自身一级目录下的子物体有没有该名字的子物体
            item = parent.getChildByName(name) as Laya.Sprite;
            //如果有，返回他
            if (item != null) return item;
            var go: Laya.Sprite = null;
            //如果没有，就吧该父物体所有一级子物体下所有的二级子物体找一遍(以此类推)
            for (var i = 0; i < parent.numChildren; i++) {
                go = node_2dFindChild(parent.getChildAt(i) as Laya.Sprite, name);
                if (go != null)
                    return go;
            }
            return null;
        }

        /**
         * 返回0或者1，用随机二分之一概率,返回后0是false，true是1，所以Boolen和number都可以判断
         * */
        export function randomOneHalf(): number {
            let number;
            number = Math.floor(Math.random() * 2);
            return number;
        }

        /**
         * 在某个区间内取一个整数
         * @param section1 区间1
         * @param section2 区间2，不输入则是0~section1
         */
        export function randomOneInt(section1, section2?: number): number {
            if (section2) {
                return Math.floor(Math.random() * (section2 - section1)) + section1;
            } else {
                return Math.floor(Math.random() * section1);
            }
        }

        /**
         * 返回一个数值区间内的数个随机数
         * @param section1 区间1
         * @param section2 区间2,不输入则是0~section1
         * @param count 数量默认是1个
         * @param intSet 是否是整数,默认是整数，为true
         */
        export function randomCountNumer(section1: number, section2?: number, count?: number, intSet?: boolean): Array<number> {
            let arr = [];
            if (!count) {
                count = 1;
            }
            if (section2) {
                while (count > arr.length) {
                    let num;
                    if (intSet || intSet == undefined) {
                        num = Math.floor(Math.random() * (section2 - section1)) + section1;
                    } else {
                        num = Math.random() * (section2 - section1) + section1;
                    }
                    arr.push(num);
                    Tools.arrayUnique_01(arr);
                };
                return arr;
            } else {
                while (count > arr.length) {
                    let num;
                    if (intSet || intSet == undefined) {
                        num = Math.floor(Math.random() * section1);
                    } else {
                        num = Math.random() * section1;
                    }
                    arr.push(num);
                    Tools.arrayUnique_01(arr);
                }
                return arr;
            }
        }

        /**
        * 返回一个数值区间内的1个随机数
        * @param section1 区间1
        * @param section2 区间2,不输入则是0~section1
        * @param intSet 是否是整数,默认是整数，为false
        */
        export function randomOneNumber(section1: number, section2?: number, intSet?: boolean): number {
            let chage: number;
            if (section1 > section2) {
                chage = section1;
                section1 = section2;
                section2 = chage;
            }
            if (section2) {
                let num;
                if (intSet) {
                    num = Math.floor(Math.random() * (section2 - section1)) + section1;
                } else {
                    num = Math.random() * (section2 - section1) + section1;
                }
                return num;
            } else {
                let num;
                if (intSet) {
                    num = Math.floor(Math.random() * section1);
                } else {
                    num = Math.random() * section1;
                }
                return num;
            }
        }


        /**返回两个二维物体的距离*/
        export function d2_twoObjectsLen(obj1: Laya.Sprite, obj2: Laya.Sprite): number {
            let point = new Laya.Point(obj1.x, obj1.y);
            let len = point.distance(obj2.x, obj2.y);
            return len;
        }

        /**
          * 在Laya2维世界中
          * 求向量的夹角在坐标系中的角度
          * @param x 坐标x
          * @param y 坐标y
          * */
        export function d2_Vector_Angle(x, y): number {
            let radian: number = Math.atan2(x, y) //弧度  0.6435011087932844
            let angle: number = 90 - radian * (180 / Math.PI); //角度  36.86989764584402;
            if (angle <= 0) {
                angle = 270 + (90 + angle);
            }
            return angle - 90;
        };

        /**
         * 在Laya2维世界中
         * 通过一个角度，返回一个单位向量
         * @param x 坐标x
         * @param y 坐标y
         * */
        export function d2_angle_Vector(angle): Laya.Point {
            angle -= 90;
            let radian = (90 - angle) / (180 / Math.PI);
            let p = new Laya.Point(Math.sin(radian), Math.cos(radian));
            p.normalize();
            return p;
        };

        /**
         * 返回两个三维物体的世界空间的距离
         * @param obj1 物体1
         * @param obj2 物体2
         */
        export function d3_twoObjectsLen(obj1: Laya.MeshSprite3D, obj2: Laya.MeshSprite3D): number {
            let obj1V3: Laya.Vector3 = obj1.transform.position;
            let obj2V3: Laya.Vector3 = obj2.transform.position;
            let p = new Laya.Vector3();
            // 向量相减后计算长度
            Laya.Vector3.subtract(obj1V3, obj2V3, p);
            let lenp = Laya.Vector3.scalarLength(p);
            return lenp;
        }

        /**
         * 返回两个3维向量之间的距离
        * @param v1 物体1
        * @param v2 物体2
        */
        export function d3_twoPositionLen(v1: Laya.Vector3, v2: Laya.Vector3): number {
            let p = d3_twoSubV3(v1, v2);
            let lenp = Laya.Vector3.scalarLength(p);
            return lenp;
        }

        /**
          * 返回相同坐标系中两个三维向量的相减向量（obj1-obj2）
          * @param V3_01 向量1
          * @param V3_02 向量2
          * @param normalizing 是否是单位向量,默认为不是
          */
        export function d3_twoSubV3(V3_01: Laya.Vector3, V3_02: Laya.Vector3, normalizing?: boolean): Laya.Vector3 {
            let p = new Laya.Vector3();
            // 向量相减后计算长度
            Laya.Vector3.subtract(V3_01, V3_02, p);
            if (normalizing) {
                let p1: Laya.Vector3 = new Laya.Vector3();
                Laya.Vector3.normalize(p, p1);
                return p1;
            } else {
                return p;
            }
        }

        /**
          * 3D世界中，制约一个物体不会超过和另一个点的最长距离,如果超过或者等于则设置这个球面坐标，并且返回这个坐标
          * @param originV3 原点的位置
          * @param obj 物体
          * @param length 长度
         */
        export function d3_maximumDistanceLimi(originV3: Laya.Vector3, obj: Laya.Sprite3D, length: number): Laya.Vector3 {
            // 两个向量相减等于手臂到手的向量
            let subP = new Laya.Vector3();
            let objP = obj.transform.position;
            Laya.Vector3.subtract(objP, originV3, subP);
            // 向量的长度
            let lenP = Laya.Vector3.scalarLength(subP);
            if (lenP >= length) {
                // 归一化向量
                let normalizP = new Laya.Vector3();
                Laya.Vector3.normalize(subP, normalizP);
                // 坐标
                let x = originV3.x + normalizP.x * length;
                let y = originV3.y + normalizP.y * length;
                let z = originV3.z + normalizP.z * length;
                let p = new Laya.Vector3(x, y, z);
                obj.transform.position = p;
                return p;
            }
        }

        /**
         * 射线检测，返回射线扫描结果，可以筛选结果
         * @param camera 摄像机
         * @param scene3D 当前场景
         * @param vector2 触摸点
         * @param filtrateName 找出指定触摸的模型的信息，如果不传则返回全部信息数组；
         */
        export function d3_rayScanning(camera: Laya.Camera, scene3D: Laya.Scene3D, vector2: Laya.Vector2, filtrateName?: string): any {
            /**射线*/
            let _ray: Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            /**射线扫描结果*/
            let outs: Array<Laya.HitResult> = new Array<Laya.HitResult>();
            //产生射线
            //射线碰撞到挡屏，用来设置手的初始位置，挡屏的属性isTrigger 要勾上，这样只检测碰撞，不产生碰撞反应
            camera.viewportPointToRay(vector2, _ray);
            scene3D.physicsSimulation.rayCastAll(_ray, outs);
            //找到挡屏的位置，把手的位置放在投屏位置的上方，也就是触摸点的上方
            if (outs.length != 0 && filtrateName) {
                let outsChaild = null;
                for (var i = 0; i < outs.length; i++) {
                    //找到挡屏
                    let hitResult = outs[i].collider.owner;
                    if (hitResult.name === filtrateName) {
                        // 开启移动
                        outsChaild = outs[i];
                    }
                }
                return outsChaild;
            } else {
                return outs;
            }
        }

        /**
         * 将3D坐标转换成屏幕坐标
         * @param v3 3D世界的坐标
         * @param camera 摄像机
        */
        export function d3_TransitionScreenPointfor(v3: Laya.Vector3, camera: Laya.Camera): Laya.Vector2 {
            let ScreenV4 = new Laya.Vector4();
            camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
            let point: Laya.Vector2 = new Laya.Vector2();
            point.x = ScreenV4.x;
            point.y = ScreenV4.y;
            return point;
        }

        /**
          * 播放动画。
          * @param Sp3D 节点
          * @param name 如果为null则播放默认动画，否则按名字播放动画片段。
          * @param normalizedTime 归一化的播放起始时间。
          * @param layerIndex 层索引。
          */
        export function d3_animatorPlay(Sp3D: Laya.Sprite3D, aniName?: string, normalizedTime?: number, layerIndex?: number): Laya.Animator {
            let sp3DAni = Sp3D.getComponent(Laya.Animator) as Laya.Animator;
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

        /**
         * 返回一个向量相对于一个点的反向向量，或者反向向量的单位向量，可用于一个物体被另一个物体击退
         * @param type 二维还是三维
         * @param Vecoter1 固定点
         * @param Vecoter2 反弹物体向量
         * @param normalizing 是否归一成单位向量
         */
        export function dAll_reverseVector(type: string, Vecoter1: any, Vecoter2: any, normalizing: boolean): Laya.Vector3 {
            let p;
            if (type === '2d') {
                p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
                if (normalizing) {
                    p.normalize();
                }
                return p;

            } else if (type === '3d') {
                p = new Laya.Vector3(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y, Vecoter1.z - Vecoter2.z);
                if (normalizing) {
                    let returnP = new Laya.Vector3();
                    Laya.Vector3.normalize(p, returnP);
                    return returnP;
                } else {
                    return p;
                }
            }
        }

        export function sk_indexControl(sk: Laya.Skeleton, name: string): void {
            sk.play(name, true);//从初始位置开始继续播放
            sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
        }

        /**绘制类*/
        export module Draw {

            /**
              * 为一个节点绘制一个扇形遮罩
              * 想要遮罩的形状发生变化，必须先将父节点的cacheAs改回“none”，接着改变其角度，再次将cacheAs改为“bitmap”，必须在同一帧内进行，因为是同一帧，所以在当前帧最后或者下一帧前表现出来，帧内时间不会表现任何状态，这是个思路，帧内做任何变化都不会显示，只要帧结尾改回来就行。
              * @param parent 被遮罩的节点，也是父节点
              * @param startAngle 扇形的初始角度
              * @param endAngle 扇形结束角度
             */
            export function drawPieMask(parent, startAngle, endAngle): Laya.DrawPieCmd {
                // 父节点cacheAs模式必须为"bitmap"
                parent.cacheAs = "bitmap";
                //新建一个sprite作为绘制扇形节点
                let drawPieSpt = new Laya.Sprite();
                //设置叠加模式
                drawPieSpt.blendMode = "destination-out";
                // 加入父节点
                parent.addChild(drawPieSpt);
                // 绘制扇形，位置在中心位置，大小略大于父节点，保证完全遮住
                let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                return drawPie;
            }

            /**
             * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个，清除直接删除node中的子节点即可
             * 圆角矩形的中心点在节点的中间
             * @param node 节点
             * @param x x位置
             * @param y y位置
             * @param radius 半径
             * @param eliminate 是否清除其他遮罩，默认为true
             */
            export function reverseRoundMask(node, x: number, y: number, radius: number, eliminate?: boolean): void {
                if (eliminate == undefined || eliminate == true) {
                    node_RemoveAllChildren(node);
                }
                let interactionArea = new Laya.Sprite();
                interactionArea.name = 'reverseRoundMask';
                //设置叠加模式
                interactionArea.blendMode = "destination-out";//利用叠加模式创建反向遮罩
                node.cacheAs = "bitmap";
                node.addChild(interactionArea);
                // 画出圆形，可以画很多个圆形
                interactionArea.graphics.drawCircle(0, 0, radius, "#000000");
                interactionArea.pos(x, y);
            }


            /**
             * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个，清除直接删除node中的子节点即可
             * 圆角矩形的中心点在节点的中间
             * @param node 节点
             * @param x x位置
             * @param y y位置
             * @param width 宽
             * @param height 高
             * @param round 圆角角度
             * @param eliminate 是否清除其他遮罩，默认为true
             */
            export function reverseRoundrectMask(node, x: number, y: number, width: number, height: number, round: number, eliminate?: boolean): void {
                if (eliminate == undefined || eliminate == true) {
                    node_RemoveAllChildren(node);
                }
                let interactionArea = new Laya.Sprite();
                interactionArea.name = 'reverseRoundrectMask';
                //设置叠加模式
                interactionArea.blendMode = "destination-out";//利用叠加模式创建反向遮罩
                node.cacheAs = "bitmap";
                node.addChild(interactionArea);
                // 画出圆形，可以画很多个圆形
                interactionArea.graphics.drawPath(0, 0, [["moveTo", 5, 0], ["lineTo", width - round, 0], ["arcTo", width, 0, width, round, round], ["lineTo", width, height - round], ["arcTo", width, height, width - round, height, round], ["lineTo", height - round, height], ["arcTo", 0, height, 0, height - round, round], ["lineTo", 0, round], ["arcTo", 0, 0, round, 0, round], ["closePath"]], { fillStyle: "#000000" });
                interactionArea.width = width;
                interactionArea.height = height;
                interactionArea.pivotX = width / 2;
                interactionArea.pivotY = height / 2;
                interactionArea.pos(x, y);
            }
        }

        /**
         * 对象数组按照对象的某个属性排序
         * @param array 对象数组
         * @param property 对象中一个相同的属性名称
         */
        export function objArrPropertySort(array: Array<any>, property: string): Array<any> {
            var compare = function (obj1, obj2) {
                var val1 = obj1[property];
                var val2 = obj2[property];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
            array.sort(compare);
            return array;
        }

        /**
         * 对比两个对象数组中的某个对象属性，返回相对第一个数组中有的这个property属性，第二个数组中没有这个属性的对象数组，例如两张数据表，通过名字查找，objArr2有8个不同的名字，objArr1也有（也可以没有）这个8个名字，并且objArr1还多了其他两个名字，那么返回objArr1中这两个个名字
         * @param objArr1 对象数组1
         * @param objArr2 对象数组2
         * @param property 需要对比的属性名称
        */
        export function objArr2DifferentPropertyObjArr1(objArr1: Array<any>, objArr2: Array<any>, property: string): Array<any> {
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

        /**
         * 返回两个数组对象中，有相同属性的对象集合
         * @param data1 对象数组1
         * @param data2 对象数组2
         * @param property 需要对比的属性名称
         */
        export function objArr1IdenticalPropertyObjArr2(data1: Array<any>, data2: Array<any>, property: string): Array<any> {
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

        /**
         * 对象数组去重，根据对象的某个属性值去重
         * @param arr 数组
         * @param property 属性
         * */
        export function objArrUnique(arr, property): void {
            for (var i = 0, len = arr.length; i < len; i++) {
                for (var j = i + 1, len = arr.length; j < len; j++) {
                    if (arr[i][property] === arr[j][property]) {
                        arr.splice(j, 1);
                        j--;        // 每删除一个数j的值就减1
                        len--;      // j值减小时len也要相应减1（减少循环次数，节省性能）   
                    }
                }
            }
            return arr;
        }

        /**
         * 根据一个对像的属性，从对象数组中返回某个属性的值数组
         * @param arr 
         * @param property 
         */
        export function objArrGetValue(objArr, property): Array<any> {
            let arr = [];
            for (let i = 0; i < objArr.length; i++) {
                if (objArr[i][property]) {
                    arr.push(objArr[i][property]);
                }
            }
            return arr;
        }

        /**
         * 对象数组的拷贝
         * @param ObjArray 需要拷贝的对象数组 
         */
        export function objArray_Copy(ObjArray): any {
            var sourceCopy = ObjArray instanceof Array ? [] : {};
            for (var item in ObjArray) {
                sourceCopy[item] = typeof ObjArray[item] === 'object' ? obj_Copy(ObjArray[item]) : ObjArray[item];
            }
            return sourceCopy;
        }

        /**
         * 对象的拷贝
         * @param obj 需要拷贝的对象
         */
        export function obj_Copy(obj) {
            var objCopy = {};
            for (const item in obj) {
                if (obj.hasOwnProperty(item)) {
                    const element = obj[item];
                    if (typeof element === 'object') {
                        // 其中有一种情况是对某个对象值为数组的拷贝
                        if (Array.isArray(element)) {
                            let arr1 = array_Copy(element);
                            objCopy[item] = arr1;
                        } else {
                            obj_Copy(element);
                        }
                    } else {
                        objCopy[item] = element;
                    }
                }
            }
            return objCopy;
        }

        /**
         * 往第一个数组中陆续添加第二个数组中的元素
         * @param array1 
         * @param array2
         */
        export function arrayAddToarray(array1, array2): Array<any> {
            for (let index = 0; index < array2.length; index++) {
                const element = array2[index];
                array1.push(element);
            }
            return array1;
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
        * 从一个数组中随机取出1个元素
        * @param arr 数组
        */
        export function arrayRandomGetOne(arr: Array<any>): any {
            let arrCopy = Tools.array_Copy(arr);
            let ran = Math.round(Math.random() * (arrCopy.length - 1));
            return arrCopy[ran];
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
         * 数组去重
         * @param arr 数组
        */
        export function arrayUnique_01(arr): Array<any> {
            for (var i = 0, len = arr.length; i < len; i++) {
                for (var j = i + 1, len = arr.length; j < len; j++) {
                    if (arr[i] === arr[j]) {
                        arr.splice(j, 1);
                        j--;        // 每删除一个数j的值就减1
                        len--;      // j值减小时len也要相���减1（减少循环次数，节省性能）   
                    }
                }
            }
            return arr;
        }

        /**数组去重*/
        export function arrayUnique_02(arr): Array<any> {
            arr = arr.sort();
            var arr1 = [arr[0]];
            for (var i = 1, len = arr.length; i < len; i++) {
                if (arr[i] !== arr[i - 1]) {
                    arr1.push(arr[i]);
                }
            }
            return arr1;
        }

        /**ES6数组去重,返回的数组是新数组，需接收*/
        export function arrayUnique_03(arr): Array<any> {
            return Array.from(new Set(arr));
        }

        /**
         * 返回从第一个数组中排除第二个数组中的元素，也就是第二个数组中没有第一个数组中的这些元素，如果第一个数组包含第二个数组，那么刚好等于是第一个数组排除第二个数组的元素
         * @param arr1 
         * @param arr2 
         */
        export function array1ExcludeArray2(arr1, arr2): Array<any> {

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

        /**
         * 找出几个数组中都有的元素，或者相互没有的元素，
         * 查找方法如下：如果某个元素的个数等于数组个数，这说明他们都有；
         * @param arrays 数组组成的数组
         * @param exclude 默认为false,false为返回都有的元素，true为返回排除这些相同元素，也就是相互没有的元素
         */
        export function array_ExcludeArrays(arrays: Array<Array<any>>, exclude?: boolean): Array<any> {
            // 避免三重for循环嵌套，一步一步做
            // 取出所有元素
            let arr0 = [];
            for (let i = 0; i < arrays.length; i++) {
                for (let j = 0; j < arrays[i].length; j++) {
                    arr0.push(arrays[i][j]);
                }
            }
            // 保留arr0，赋值一份
            let arr1 = Tools.array_Copy(arr0);
            // 去重排列出元素列表
            let arr2 = Tools.arrayUnique_01(arr1);

            // 列出记录数量的数组
            let arrNum = [];
            for (let k = 0; k < arr2.length; k++) {
                arrNum.push({
                    name: arr2[k],
                    num: 0,
                });
            }

            // 记录数量
            for (let l = 0; l < arr0.length; l++) {
                for (let m = 0; m < arrNum.length; m++) {
                    if (arr0[l] == arrNum[m]['name']) {
                        arrNum[m]['num']++;
                    }
                }
            }
            // 找出数量和arrays长度相同或者不相同的数组
            let arrAllHave = [];
            let arrDiffHave = [];
            for (let n = 0; n < arrNum.length; n++) {
                const element = arrNum[n];
                if (arrNum[n]['num'] == arrays.length) {
                    arrAllHave.push(arrNum[n]['name']);
                } else {
                    arrDiffHave.push(arrNum[n]['name']);
                }
            }
            if (!exclude) {
                return arrAllHave;
            } else {
                return arrDiffHave;
            }
        }

        /**
         * 二维坐标中一个点按照另一个点旋转一定的角度后，得到的点
         * @param x0 原点X
         * @param y0 原点Y
         * @param x1 旋转点X
         * @param y1 旋转点Y
         * @param angle 角度
         */
        export function point_DotRotatePoint(x0, y0, x1, y1, angle): Laya.Point {
            let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
            let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
            return new Laya.Point(x2, y2);
        }

        /**
         * 根据不同的角度和速度计算坐标,从而产生位移
         * @param angle 角度
         * @param speed 移动速度
         * */
        export function point_SpeedXYByAngle(angle: number, speed: number): Laya.Point {
            if (angle % 90 === 0 || !angle) {
                //debugger
            }
            const speedXY = { x: 0, y: 0 };
            speedXY.x = speed * Math.cos(angle * Math.PI / 180);
            speedXY.y = speed * Math.sin(angle * Math.PI / 180);
            return new Laya.Point(speedXY.x, speedXY.y);
        }
        /**
        * 求圆上的点的坐标，可以根据角度和半径作出圆形位移
        * @param angle 角度
        * @param radius 半径
        * @param centerPos 原点
        */
        export function point_GetRoundPos(angle: number, radius: number, centerPos: Laya.Point): Laya.Point {
            var center = centerPos; //圆心坐标
            var radius = radius; //半径
            var hudu = (2 * Math.PI / 360) * angle; //90度角的弧度

            var X = center.x + Math.sin(hudu) * radius; //求出90度角的x坐标
            var Y = center.y - Math.cos(hudu) * radius; //求出90度角的y坐标
            return new Laya.Point(X, Y);
        }

        /**
         * 返回在一个中心点周围的随机产生数个点的数组
         * @param centerPos 中心点坐标
         * @param radiusX X轴半径
         * @param radiusY Y轴半径
         * @param count 产生多少个随机点
         */
        export function point_RandomPointByCenter(centerPos: Laya.Point, radiusX: number, radiusY: number, count?: number): Array<Laya.Point> {
            if (!count) {
                count = 1;
            }
            let arr: Array<Laya.Point> = [];
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

        /**
         * 根据角度计算弧度
         * @param angle 角度
         */
        export function angle_GetRad(angle) {
            return angle / 180 * Math.PI;
        }

        /**
          * 获取本地存储数据并且和文件中数据表对比,对比后会上传
          * @param url 本地数据表地址
          * @param storageName 本地存储中的json名称
          * @param propertyName 数组中每个对象中同一个属性名，通过这个名称进行对比
          */
        export function jsonCompare(url: string, storageName: string, propertyName: string): Array<any> {
            // 第一步，先尝试从本地缓存获取数据，
            // 第二步，如果本地缓存有，那么需要和数据表中的数据进行对比，把缓存没有的新增对象复制进去
            // 第三步，如果本地缓存没有，那么直接从数据表获取
            let dataArr;
            if (Laya.LocalStorage.getJSON(storageName)) {
                dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName))[storageName];
                console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
                try {
                    let dataArr_0: Array<any> = Laya.loader.getRes(url)['RECORDS'];
                    // 如果本地数据条数大于json条数，说明json减东西了，不会对比，json只能增加不能删减
                    if (dataArr_0.length >= dataArr.length) {
                        let diffArray = Tools.objArr2DifferentPropertyObjArr1(dataArr_0, dataArr, propertyName);
                        console.log('两个数据的差值为：', diffArray);
                        Tools.arrayAddToarray(dataArr, diffArray);
                    } else {
                        console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                    }
                } catch (error) {
                    console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！')
                }
            } else {
                try {
                    dataArr = Laya.loader.getRes(url)['RECORDS'];
                } catch (error) {
                    console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！')
                }
            }
            let data = {};
            data[storageName] = dataArr;
            Laya.LocalStorage.setJSON(storageName, JSON.stringify(data));
            return dataArr;
        }
    }

}
export default lwg;
// 全局控制

export let TimerAdmin = lwg.TimerAdmin;
export let Color = lwg.Color;
export let Effects = lwg.Effects;
export let Animation2D = lwg.Animation2D;
export let Tools = lwg.Tools;
