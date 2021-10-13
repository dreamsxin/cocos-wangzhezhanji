import buttonToolItem from "../Other/buttonToolItem";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

export class BtnInfo {
    btnName: string
    fun: Function
}

export class BtnToolInfo {
    btnInfo: BtnInfo[]
    pos: cc.Vec2
}

@ccclass
export default class ButtonToolMain extends UIParent {

    @property(cc.Node)
    btnItem: cc.Node = null;
    @property(cc.Node)
    btnParent: cc.Node = null;

    radius: number = 100

    ShowUI(fun = () => { }, data: BtnToolInfo) {
        super.ShowUI();
        let p1 = this.btnParent.convertToNodeSpaceAR(data.pos)
        this.btnParent.setPosition(p1)

        let len = data.btnInfo.length
        let angle = 360 / len
        for (let index = 0; index < data.btnInfo.length; index++) {
            let element = data.btnInfo[index];
            let obj = cc.instantiate(this.btnItem)
            this.btnParent.addChild(obj)
            let spr = obj.getComponent(buttonToolItem)
            spr.resetData(element)

            let x = this.radius * Math.cos(angle * index * Math.PI / 180)
            let y = this.radius * Math.sin(angle * index * Math.PI / 180)
            obj.setPosition(x, y)
        }
    }

    onClickClose() {
        this.HideUI()
    }

    // update (dt) {}
}
