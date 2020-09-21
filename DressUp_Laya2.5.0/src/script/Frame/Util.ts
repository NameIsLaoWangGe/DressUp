
import { LC, Formula } from "../Game/Formula";
//import { TJ } from "../../TJ";

export default class Util {
    static calcBorder(camera: Laya.Camera) {
        let w = Laya.Browser.width;
        let h = Laya.Browser.height;
        let camH = camera.orthographicVerticalSize;
        let camW = w / h * camH;
        return { w: camW, h: camH, hw: camW * 0.5, hh: camH * 0.5 };
    }

    static randomInRange_i(x: number, y: number, s = null): number {
        let rs;
        if (x == y) {
            rs = x;
        } else if (y > x) {
            let v = (y - x) * (s == null ? Math.random() : s) + x;
            rs = v.toFixed();
        } else {
            throw `x > y`;
        }
        return Number(rs);
    }

    static lim = 1e-5;
    // 浮点数比较，相等返回true
    static near(a: number, b: number) {
        return Math.abs(a - b) < Util.lim;
    }

    static randomInRange_f(x: number, y: number, s = null): number {
        let rs;
        let g = y - x;
        if (g < 0) {
            throw `x > y`;
        } else {
            if (g < Util.lim) {
                rs = x;
            } else {
                rs = g * (s == null ? Math.random() : s) + x;
            }
        }
        return Number(rs);
    }

    static setVec2(targ: any, vecFeild: string, x?: number, y?: number) {
        let v = targ[vecFeild] as Laya.Vector2;
        v.setValue((x != null) ? x : v.x, (y != null) ? y : v.y);
        targ[vecFeild] = v;
    }

    static setVec3(targ: any, vecFeild: string, x?: number, y?: number, z?: number) {
        let v = targ[vecFeild] as Laya.Vector3;
        v.setValue((x != null) ? x : v.x, (y != null) ? y : v.y, (z != null) ? z : v.z);
        targ[vecFeild] = v;
    }

    static setVec4(targ: any, vecFeild: string, x?: number, y?: number, z?: number, w?: number) {
        let v = targ[vecFeild] as Laya.Vector4;
        v.setValue((x != null) ? x : v.x, (y != null) ? y : v.y, (z != null) ? z : v.z, (w != null) ? w : v.w);
        targ[vecFeild] = v;
    }

    static setQuat(targ: any, quatField: string, x?: number, y?: number, z?: number, w?: number) {
        let v = targ[quatField] as Laya.Quaternion;
        (x != null) && (v.x = x);
        (y != null) && (v.y = y);
        (z != null) && (v.z = z);
        (w != null) && (v.w = w);
        targ[quatField] = v;
    }

    static clamp(v: number, min: number, max: number): number {
        let rs;
        if (v < min) {
            rs = min;
        } else if (v > max) {
            rs = max;
        } else {
            rs = v;
        }
        return rs;
    }

    static shakeByFactor(num: number, bitNum: number) {
        let rs = 0;
        let a = num;
        let t = Math.floor(a);
        rs += t;
        for (let i = 1; i < bitNum; i++) {
            a = (a - t) * 10;
            t = Math.floor(a);
            rs += t;
        }
        return (rs & 1) == 0 ? 1 : -1;
    }

    static deg2rad = Math.PI / 180;
    static rad2deg = 180 / Math.PI;

    static rgb2hsv_arr(arr, o) {
        Util.rgb2hsv(arr[0], arr[1], arr[2], o);
    }

    static rgb2hsv(r, g, b, o_hsv: { h: number, s: number, v: number }) {
        let h, s, v;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);

        if (max == min) {
            h = g;
        } else if (Util.near(r, max)) {
            h = (g - b) / (max - min);
        } else if (Util.near(g, max)) {
            h = 2 + (b - r) / (max - min);
        } else {
            h = 4 + (r - g) / (max - min);
        }
        h *= 60;
        if (h < 0) {
            h += 360;
        }
        h = h / 360;
        s = (max - min) / max;
        v = max;
        o_hsv.h = h;
        o_hsv.s = s;
        o_hsv.v = v;
    }

    static hsv2rgb(hsv, o_color: number[]) {
        let R, G, B;
        let h = hsv.h, s = hsv.s, v = hsv.v;
        if (s == 0) {
            R = G = B = v;
        }
        else {
            h = h * 6;
            let i = Math.floor(h);
            let f = h - i;
            let a = v * (1 - s);
            let b = v * (1 - s * f);
            let c = v * (1 - s * (1 - f));
            switch (i) {
                case 0:
                    R = v; G = c; B = a;
                    break;
                case 1:
                    R = b; G = v; B = a;
                    break;
                case 2:
                    R = a; G = v; B = c;
                    break;
                case 3:
                    R = a; G = b; B = v;
                    break;
                case 4:
                    R = c; G = a; B = v;
                    break;
                case 5:
                    R = v; G = a; B = b;
                    break;
                default:
                    R = 1; G = 1; B = 1;
                    console.error("hsv transfer error!");
                    break;
            }
        }
        o_color[0] = R;
        o_color[1] = G;
        o_color[2] = B;
    }

    static getFixedRandom(s) {
        let m_w = s;
        let m_z = 987654321;
        let mask = 0xffffffff;
        return function () {
            m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
            m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
            let result = ((m_z << 16) + m_w) & mask;
            result /= 4294967296;
            return parseFloat((result + 0.5).toFixed(2));
        }
    }

    static breakMS(ts) {
        return Util.breakS(Math.round(ts / 1000));
    }

    static breakS(s) {
        let m = Math.floor(s / 60);
        s -= m * 60;
        let mt = ('0' + m).slice(-2);
        let st = ('0' + s).slice(-2);
        return `${mt}:${st}`;
    }

    static pieMask(baseQuad: Laya.Image, mask: Laya.Sprite, sa, ea) {
        mask.graphics.clear();
        let w = baseQuad.width;
        let h = baseQuad.height;
        let hw = w * 0.5;
        let hh = h * 0.5;
        let r = hw > hh ? hh : hw;
        mask.graphics.drawPie(hw, hh, r, sa - 90, ea - 90, "fff");
    }

    static precision(num, s) {
        let offset = num < 0 ? -0.5 : 0.5;
        if (s == 0) {
            return parseInt(Number(num) + offset + '');
        } else {
            let times = Math.pow(10, s);
            let des = num * times + offset;
            return parseInt(des + '') / times;
        }
    }

    static formatCrc(crc: number, fixNum = 2) {
        let textTemp;
        if (crc >= 1e27) {
            textTemp = (crc / 1e27).toFixed(fixNum) + "ae";
        } else if (crc >= 1e24) {
            textTemp = (crc / 1e24).toFixed(fixNum) + "ad";
        } else if (crc >= 1e21) {
            textTemp = (crc / 1e21).toFixed(fixNum) + "ac";
        } else if (crc >= 1e18) {
            textTemp = (crc / 1e18).toFixed(fixNum) + "ab";
        } else if (crc >= 1e15) {
            textTemp = (crc / 1e15).toFixed(fixNum) + "aa";
        } else if (crc >= 1e12) {
            textTemp = (crc / 1e12).toFixed(fixNum) + "t";
        } else if (crc >= 1e9) {
            textTemp = (crc / 1e9).toFixed(fixNum) + "b";
        } else if (crc >= 1e6) {
            textTemp = (crc / 1e6).toFixed(fixNum) + "m";
        } else if (crc >= 1e3) {
            textTemp = (crc / 1e3).toFixed(fixNum) + "k";
        } else {
            textTemp = Math.round(crc).toString();
        }
        return textTemp;
    }

    static normV2(x, y, o) {
        let m = Math.sqrt(x * x + y * y);
        let nx = x / m;
        let ny = y / m;
        if (Array.isArray(o)) {
            o[0] = nx;
            o[1] = ny;
        } else {
            o["x"] = nx;
            o["y"] = ny;
        }
        return m;
    }

    static genArcPoint(orgX, orgY, longAxis, shortAxis) {
        return [
            [orgX, orgY], [orgX + longAxis * (1 - 0.866), orgY + shortAxis * 0.5], [orgX + longAxis * 0.5, orgY + shortAxis * 0.866],
            [orgX + longAxis, orgY + shortAxis], [orgX + longAxis + longAxis * 0.5, orgY + shortAxis * 0.866], [orgX + longAxis + longAxis * 0.866, orgY + shortAxis * 0.5],
            [orgX + longAxis * 2, orgY], [orgX + longAxis + longAxis * 0.866, orgY - shortAxis * 0.5], [orgX + longAxis + longAxis * 0.5, orgY - shortAxis * 0.866],
            [orgX + longAxis, orgY - shortAxis], [orgX + longAxis * 0.5, orgY - shortAxis * 0.866], [orgX + longAxis * (1 - 0.866), orgY - shortAxis * 0.5],

            [orgX, orgY], [orgX - longAxis * (1 - 0.866), orgY + shortAxis * 0.5], [orgX - longAxis * 0.5, orgY + shortAxis * 0.866],
            [orgX - longAxis, orgY + shortAxis], [orgX - longAxis - longAxis * 0.5, orgY + shortAxis * 0.866], [orgX - longAxis - longAxis * 0.866, orgY + shortAxis * 0.5],
            [orgX - longAxis * 2, orgY], [orgX - longAxis - longAxis * 0.866, orgY - shortAxis * 0.5], [orgX - longAxis - longAxis * 0.5, orgY - shortAxis * 0.866],
            [orgX - longAxis, orgY - shortAxis], [orgX - longAxis * 0.5, orgY - shortAxis * 0.866], [orgX - longAxis * (1 - 0.866), orgY - shortAxis * 0.5],
        ];
    }

    static checkNewDay(oldTime: number) {
        if (oldTime == 0) {
            return true;
        }
        let oldDate = new Date(oldTime);
        let oy = oldDate.getFullYear();
        let om = oldDate.getMonth();
        let od = oldDate.getDate();
        let curTime = Date.now();
        let nowDate = new Date();
        let ny = nowDate.getFullYear();
        let nm = nowDate.getMonth();
        let nd = nowDate.getDate();
        return (curTime > oldTime) && (ny > oy || nm > om || nd > od);
    }

    static genConf(arr) {
        let rs = {};
        let map = rs["map"] = {};
        rs["arr"] = arr;
        for (let v of arr) {
            map[v.id] = v;
        }
        return rs;
    }

    static custBackOut(s = 1.70158) {
        return (t, b, c, d) => {
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        };
    }

    static vibrate() {
        TJ.API.Vibrate.Short();
    }

    static getWord(id: number) {
        return LC.LangConf.map[id][Formula.lang];
    }

    static setSkin(img, id: number) {
        if (TJ.Engine.RuntimeInfo.platform==TJ.Define.Platform.Android && Formula.lang != "cn") {
            img.skin = "langPic/" + Formula.lang + "/" + LC.LangConf.map[id].name + ".png";
        }
    }
}