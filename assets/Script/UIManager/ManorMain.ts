// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BtnInfo, BtnToolInfo } from "./ButtonToolMain";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ManorMain extends UIParent {

    @property(cc.Node)
    cityNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    ShowUI() {
        super.ShowUI();
    }

    onClickCity() {
        let btnToolInfo = new BtnToolInfo()
        btnToolInfo.pos = this.cityNode.convertToWorldSpaceAR(cc.Vec2.ZERO)
        let btnInfo: BtnInfo[] = []
        let info = new BtnInfo()
        info.btnName = "升级"
        info.fun = () => {
            this.uiManager.HideUIName("ButtonToolMain");
        }
        btnInfo.push(info)
        btnToolInfo.btnInfo = btnInfo
        this.uiManager.ShowUIName("ButtonToolMain", () => { }, btnToolInfo);
    }
}
