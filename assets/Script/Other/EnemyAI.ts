// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameCtrl from "../Ctrl/GameCtrl";
import LevelCtrl from "../Ctrl/LevelCtrl";
import { Camp, GameState, TowerID } from "./GameData";
import SoldiersParent from "./SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyAI extends cc.Component {

    @property(cc.Node)
    playerInsPos: cc.Node = null;
    @property(cc.Node)
    playerCollectPos: cc.Node = null;
    @property(cc.Node)
    playerParent: cc.Node = null;
    @property({ type: cc.ProgressBar, tooltip: "血条进度条💩" })
    hpPro: cc.ProgressBar = null;
    // LIFE-CYCLE CALLBACKS:
    private _levelData: any = null
    private _createData: any[] = []
    private _soldierIndex: number = 0
    // onLoad () {}

    start() {

    }

    initLevel() {
        this._levelData = LevelCtrl.getInstance().getNowLevelData()
        this._createData = this._levelData.soldierWar
        this._soldierIndex = 0
        //this.startShot();
        this.createPathSoldier()
        this.CreateTower()
        this.createSoldierAI()
    }

    clearData() {
        //this.stopShot()
        this.hpPro.progress = 1;
        this._soldierIndex = 0
    }

    getCreateSoldierData(): any {
        let data = this._createData[this._soldierIndex]
        if (data) {
            this._soldierIndex++
            return data
        } else {
            this._soldierIndex = 0
            return this._createData[0]
        }
    }

    // startShot() {
    //     this.schedule(this.createBing, Math.random() * 3 + 0.5)
    // }

    // stopShot() {
    //     this.unschedule(this.createBing)
    // }

    createBing() {
        this.CreateArms(Math.floor(Math.random() * 7 + 1))
    }

    createSoldierAI() {
        let data = this.getCreateSoldierData()
        cc.log(data, "生产配置")
        this.unscheduleAllCallbacks()
        this.scheduleOnce(() => {
            this.CreateArms(data.soldierID)
        }, data.createTime)
    }

    CreateArms(idx: number) {
        if (GameCtrl.getInstance().getGameState() == GameState.gameOver) return
        let soldierPre = GameCtrl.getInstance().getSoldierPre(idx)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        this.playerParent.addChild(obj)
        obj.active = true
        obj.x = GameCtrl.getInstance().getPathMax().x
        let sold = obj.getComponent(SoldiersParent)
        sold.init(Camp.red, idx, 7, true)
        GameCtrl.getInstance().addEnemy(sold);
        this.createSoldierAI()
    }

    CreateArmsNotMove(idx: number, roadIndex: number = 7, isMove: boolean = true, posX: number = GameCtrl.getInstance().getPathMax().x) {
        let soldierPre = GameCtrl.getInstance().getSoldierPre(idx)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        this.playerParent.addChild(obj)
        obj.active = true
        obj.x = posX
        let sold = obj.getComponent(SoldiersParent)
        sold.init(Camp.red, idx, roadIndex, isMove)
        GameCtrl.getInstance().addEnemy(sold);
    }

    CreateTower() {
        let soldierPre = GameCtrl.getInstance().getSoldierPre(TowerID)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        obj.active = true
        obj.parent = this.playerParent;
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(cc.v2(p2.x + 100, p2.y));
        let sold = obj.getComponent(SoldiersParent)
        sold.initHpPro(this.hpPro)
        sold.init(Camp.red, TowerID, 7);
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
            let nowX = pathX * (i + 1) + min.x
            for (let key in rowList) {
                let list = rowList[key];
                let chaNum = Math.floor((15 - list.length) / 2)
                for (let j = 0; j < list.length; j++) {
                    let soldierID = list[j];
                    let x = rowIndex * 80 + nowX
                    this.CreateArmsNotMove(soldierID, j + chaNum, false, x)
                }
                rowIndex++
            }
        }
    }
    // update (dt) {}
}
