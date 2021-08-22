// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SoldierBasic } from "../Config/BarracksConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class warItemBut extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _fun: Function
    private _soldierID: number = 0
    start() {

    }
    Init(soldierID: number, fun: Function) {
        this._soldierID=soldierID
        this._fun = fun
        let data: SoldierBasic = BarracksCtrl.getInstance().getBarracksConfigItem(soldierID);
        this.nameLabel.string = data ? data.soldierName : "无"

    }

    onClickCreate() {
        if (this._fun) {
            this._fun(this._soldierID)
        }
    }
    // update (dt) {}
}
