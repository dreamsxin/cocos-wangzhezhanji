// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameCtrl from "../Ctrl/GameCtrl";
import { Camp } from "./GameData";
import SoldiersParent from "./SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    xiaoBingObj: cc.Prefab = null;
    @property(cc.Node)
    playerInsPos: cc.Node = null;
    @property(cc.Node)
    playerParent: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.startShot();
    }
    startShot() {
        this.schedule(this.createBing, Math.random() * 3 + 2)
    }
    endShot() {
        this.unschedule(this.createBing)
    }
    createBing() {
        this.CreateArms(1)
    }
    CreateArms(idx) {
        let soldierPre = GameCtrl.getInstance().getSoldierPre(idx)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        obj.parent = this.playerParent;
        obj.active = true
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(p2);
        let sold = obj.getComponent(SoldiersParent)
        sold.init(Camp.red,1)
        GameCtrl.getInstance().addEnemy(sold);
    }
    // update (dt) {}
}
