// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameCtrl from "../Ctrl/GameCtrl";
import LevelCtrl from "../Ctrl/LevelCtrl";
import { Camp } from "./GameData";
import SoldiersParent from "./SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyAI extends cc.Component {

    @property(cc.Node)
    playerInsPos: cc.Node = null;
    @property(cc.Node)
    playerParent: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    private _levelData: any
    // onLoad () {}

    start() {
        
    }

    initLevel() {
        this._levelData = LevelCtrl.getInstance().getNowLevelData()
        this.startShot();
        this.createPathSoldier()
    }

    startShot() {
        this.schedule(this.createBing, Math.random() * 3 + 0.5)
    }

    stopShot() {
        this.unschedule(this.createBing)
    }

    createBing() {
        this.CreateArms(Math.floor(Math.random() * 7 + 1))
    }

    CreateArms(idx) {
        if (GameCtrl.getInstance().getEnemyNum() >= 15) return
        let soldierPre = GameCtrl.getInstance().getSoldierPre(idx)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        obj.parent = this.playerParent;
        obj.active = true
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(p2);
        let sold = obj.getComponent(SoldiersParent)
        sold.init(Camp.red, idx)
        // sold.soldierData.Phylactic = 1000
        // sold.nowHp = 1000
        GameCtrl.getInstance().addEnemy(sold);
    }

    createPathSoldier() {

    }
    // update (dt) {}
}
