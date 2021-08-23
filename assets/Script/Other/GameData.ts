
import UIManager from "../UIManager/UIManager";
import TipText from "./TipText";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameData {
    public static localData: LocalData = null;
    public static sizeType: number = 1;

    public static tipObj: cc.Prefab = null;
    public static isShowTipText: boolean = false;
    public static tipObj_parent: cc.Node = null;

    public static IsArrayHave(ary: any[], item: any): boolean {
        let index = ary.indexOf(item);
        return index > -1;
    }
    public static SaveData() {
        let localData = JSON.stringify(this.localData);
        cc.sys.localStorage.setItem("LocalData", localData);
    }
    public static createTipText(value: string, parent = this.tipObj_parent, fun = () => { }) {
        if (this.isShowTipText) return;
        this.isShowTipText = true;
        let obj = cc.instantiate(this.tipObj);
        obj.parent = parent;
        obj.x = 0;
        obj.y = 0;
        obj.getComponent(TipText).Init(value, () => {
            this.isShowTipText = false;
            fun();
        });
    }
    public static distance(p1, p2): number {
        let dx: number = p1.x - p2.x;
        let dy: number = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    public static PrefixInteger(num, length) {
        for (var len = (num + "").length; len < length; len = num.length) {
            num = "0" + num;
        }
        return num;
    }

    public static onChangeDateTime(time: number) {
        let leaveTime = 0
        let days = Math.floor(time / (24 * 3600))
        leaveTime = time % (24 * 3600)
        let hours = Math.floor(leaveTime / 3600)
        leaveTime = leaveTime % 3600
        let minutes = Math.floor(leaveTime / 60)
        leaveTime = leaveTime % 60
        let seconds = Math.floor(leaveTime)

        let h = days * 24 + hours > 9 ? days * 24 + hours : '0' + (days * 24 + hours)
        let m = minutes > 9 ? minutes : '0' + minutes
        let s = seconds > 9 ? seconds : '0' + seconds
        // this.serverLeave = days * 24 * 3600 + hours *  3600 + minutes * 60 + seconds
        return h + ':' + m + ':' + s
    }
    // 震动效果
    public static vibrationEffect() {
        if (cc.sys.os === cc.sys.OS_IOS) {
            //调用苹果的方法;
        }
        else if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "vibrate", "(I)V", 200);
        }
    }
}
export class LocalData {
    constructor() {
        this.level = 1
        this.coinValue = 0
    }
    public level: number
    public coinValue: number
}
export enum ArmsState {
    move, attack, die
}
export enum Camp {
    bule = 0, red = 1
}