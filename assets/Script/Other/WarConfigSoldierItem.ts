// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SoldierBasic } from "../Config/BarracksConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WarConfigSoldierItem extends cc.Component {

    @property(cc.Sprite)
    handSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Node)
    selectNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    private _fun: Function
    private soldierData: SoldierBasic
    // onLoad () {}

    start() {

    }

    Init(soldierData: SoldierBasic, fun: Function) {
        this.soldierData = soldierData
        this._fun = fun
        this.nameLabel.string = soldierData.soldierName
    }

    onClickSele() {
        if (this._fun) {
            this._fun()
        }
    }
    // update (dt) {}
}
