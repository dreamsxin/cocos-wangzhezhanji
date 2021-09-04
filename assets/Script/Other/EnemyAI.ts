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

    CreateArms(idx: number, roadIndex: number = 7, isMove: boolean = true, posX: number = GameCtrl.getInstance().getPathMax().x) {
        if (GameCtrl.getInstance().getEnemyNum() >= 15) return
        let soldierPre = GameCtrl.getInstance().getSoldierPre(idx)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        this.playerParent.addChild(obj)
        obj.active = true
        obj.x = posX
        let sold = obj.getComponent(SoldiersParent)
        sold.init(Camp.red, idx, roadIndex, isMove)
        // sold.soldierData.Phylactic = 1000
        // sold.nowHp = 1000
        GameCtrl.getInstance().addEnemy(sold);
    }

    createPathSoldier() {
        let soldierList: any[] = this._levelData.soldierList
        if (!soldierList) return
        let min = GameCtrl.getInstance().getPathMin()
        let max = GameCtrl.getInstance().getPathMax()
        let allNum = max.x - min.x
        let pathX = allNum / (soldierList.length + 1)
        for (let i = 0; i < soldierList.length; i++) {
            let rowList = soldierList[i];
            let rowIndex = 0
            let nowX = pathX * i + min.x
            for (let key in rowList) {
                let list = rowList[key];
                for (let j = 0; j < list.length; j++) {
                    let soldierID = list[j];
                    let x = rowIndex * 80 + nowX
                    this.CreateArms(soldierID, 7, false, x)
                }
                rowIndex++
            }
        }
    }
    // update (dt) {}
}
