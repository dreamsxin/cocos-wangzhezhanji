
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCtrl {
    private static _instance: GameCtrl = null;

    private _allEnemyList: SoldiersParent[] = [];
    private _allPlayerList: SoldiersParent[] = [];
    private _allSoldierPre: { name: string, soldier: cc.Node }[] = []
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public static getInstance() {
        if (!this._instance) {
            this._instance = new GameCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    private _init() {

    }

    addEnemy(sold: SoldiersParent) {
        this._allEnemyList.push(sold);
    }

    addPlayer(sold: SoldiersParent) {
        this._allPlayerList.push(sold);
    }

    setAllSoldierPre(data: { name: string, soldier: cc.Node }[]) {
        this._allSoldierPre = data
    }

    getSoldierPre(id): cc.Node {
        for (let index = 0; index < this._allSoldierPre.length; index++) {
            let element = this._allSoldierPre[index];
            cc.log(element.name)
            if (element.name == "Soldier" + id) {
                return element.soldier
            }
        }
        return null
    }

    dieEnemy(sold: SoldiersParent) {
        for (let index = 0; index < this._allEnemyList.length; index++) {
            if (this._allEnemyList[index] == sold) {
                this._allEnemyList.splice(index, 1)
                return
            }
        }
    }

    diePlayer(sold: SoldiersParent) {
        for (let index = 0; index < this._allPlayerList.length; index++) {
            if (this._allPlayerList[index] == sold) {
                this._allPlayerList.splice(index, 1)
                return
            }
        }
    }

    getSold(sold: SoldiersParent, _camp: Camp): SoldiersParent {
        if (_camp == Camp.bule) {
            return this.getEnemy(sold)
        } else {
            return this.getPlayer(sold)
        }
    }

    getRandSold(sold: SoldiersParent, _camp: Camp): SoldiersParent[] {
        if (_camp == Camp.bule) {
            return this.getAllEnemy(sold)
        } else {
            return this.getAllPlayer(sold)
        }
    }

    getTeamSold(sold: SoldiersParent, _camp: Camp): SoldiersParent {
        if (_camp == Camp.bule) {
            return this.getFewHPTeam(sold, this._allPlayerList)
        } else {
            return this.getFewHPTeam(sold, this._allEnemyList)
        }
    }

    getEnemy(sold: SoldiersParent): SoldiersParent {
        let enemy: SoldiersParent = null;
        if (!sold) return enemy
        let playerNodeX = sold.node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
        for (let index = 0; index < this._allEnemyList.length; index++) {
            if (this._allEnemyList[index].node) {
                let enemyNodeX = this._allEnemyList[index].node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
                if (Math.abs(playerNodeX - enemyNodeX) <= sold.getAttackRange()) {
                    if (enemy) {
                        if (Math.abs(playerNodeX - enemyNodeX) < Math.abs(playerNodeX - enemy.node.x)) {
                            enemy = this._allEnemyList[index];
                        }
                    } else {
                        enemy = this._allEnemyList[index];
                    }
                }
            }
        }
        return enemy
    }

    getPlayer(sold: SoldiersParent): SoldiersParent {
        let player: SoldiersParent = null;
        if (!sold) return player
        let enemyNodeX = sold.node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
        for (let index = 0; index < this._allPlayerList.length; index++) {
            if (this._allPlayerList[index].node) {
                let playerNodeX = this._allPlayerList[index].node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
                if (Math.abs(enemyNodeX - playerNodeX) <= sold.getAttackRange()) {
                    if (player) {
                        if (Math.abs(enemyNodeX - playerNodeX) < Math.abs(enemyNodeX - player.node.x)) {
                            player = this._allPlayerList[index];
                        }
                    } else {
                        player = this._allPlayerList[index];
                    }
                }
            }
        }
        return player
    }

    getPlayerBannerSoldierNum() {
        let num = 0;
        for (let index = 0; index < this._allPlayerList.length; index++) {
            const element = this._allPlayerList[index];
            if (element.getSoldierID() == 10) {
                num++
            }
        }
        return num
    }

    getAllEnemy(sold: SoldiersParent): SoldiersParent[] {
        let enemyList: SoldiersParent[] = [];
        if (!sold) return enemyList
        let playerNodeX = sold.node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
        for (let index = 0; index < this._allEnemyList.length; index++) {
            if (this._allEnemyList[index].node) {
                let enemyNodeX = this._allEnemyList[index].node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
                if (Math.abs(playerNodeX - enemyNodeX) <= sold.getSkillRange()) {
                    enemyList.push(this._allEnemyList[index])
                }
            }
        }
        enemyList.sort((a, b) => {
            return a.node.x - b.node.x
        })
        return enemyList
    }

    getAllPlayer(sold: SoldiersParent): SoldiersParent[] {
        let playerList: SoldiersParent[] = [];
        if (!sold) return playerList
        let playerNodeX = sold.node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
        for (let index = 0; index < this._allPlayerList.length; index++) {
            if (this._allPlayerList[index].node) {
                let enemyNodeX = this._allPlayerList[index].node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
                if (Math.abs(playerNodeX - enemyNodeX) <= sold.getSkillRange()) {
                    playerList.push(this._allPlayerList[index])
                }
            }
        }
        playerList.sort((a, b) => {
            return a.node.x - b.node.x
        })
        return playerList
    }

    getFewHPTeam(sold: SoldiersParent, soldierList: SoldiersParent[]): SoldiersParent {
        let playerList: SoldiersParent[] = [];
        if (!sold) return null
        let playerNodeX = sold.node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
        for (let index = 0; index < soldierList.length; index++) {
            if (soldierList[index].node) {
                let enemyNodeX = soldierList[index].node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
                if (Math.abs(playerNodeX - enemyNodeX) <= sold.getSkillRange()) {
                    if (soldierList[index].isSmallHP()) {
                        playerList.push(soldierList[index])
                    }
                }
            }
        }
        if (playerList.length <= 0) return null
        return playerList[Math.floor(Math.random() * playerList.length)]
    }

    getBannerBuff(_camp: Camp): number {
        let soldierList: SoldiersParent[] = null
        let num: number = 0;
        let buff = 0
        if (_camp == Camp.bule) {
            soldierList = this._allPlayerList
        } else {
            soldierList = this._allEnemyList
        }
        for (let index = 0; index < soldierList.length; index++) {
            let element = soldierList[index];
            if (element.getSoldierID() == 10) {
                num++
                buff = element.getBuffValue()
            }
        }
        return num * buff
    }
    // update (dt) {}
}
