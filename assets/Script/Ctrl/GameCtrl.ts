
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LevelData } from "../Config/LevelConfig";
import { Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";
import LevelCtrl from "./LevelCtrl";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCtrl {
    private static _instance: GameCtrl = null;

    private _allEnemyList: SoldiersParent[] = [];
    private _allPlayerList: SoldiersParent[] = [];
    private _allSoldierPre: { name: string, soldier: cc.Node }[] = []
    private _levelData: LevelData = null
    private _playerPathList: { [key: number]: SoldiersParent[] } = {};
    private _enemyPathList: { [key: number]: SoldiersParent[] } = {};
    private _allRoadYList: number[] = []
    private _findWayRand: number = 80  //寻路范围
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
        if (!this._enemyPathList[sold.roadIndex]) {
            this._enemyPathList[sold.roadIndex] = []
        }
        this._enemyPathList[sold.roadIndex].push(sold)
    }

    addPlayer(sold: SoldiersParent) {
        this._allPlayerList.push(sold);
        if (!this._playerPathList[sold.roadIndex]) {
            this._playerPathList[sold.roadIndex] = []
        }
        this._playerPathList[sold.roadIndex].push(sold)
    }

    setSoldierRoad(sold: SoldiersParent, moveID: number) {
        let index = this._playerPathList[sold.roadIndex].indexOf(sold)
        if (index >= 0) {
            this._playerPathList[sold.roadIndex].splice(index, 1)
        }
        this._playerPathList[moveID].push(sold)
        sold.roadIndex = moveID
    }

    setAllSoldierPre(data: { name: string, soldier: cc.Node }[]) {
        this._allSoldierPre = data
    }

    getSoldierPre(id): cc.Node {
        for (let index = 0; index < this._allSoldierPre.length; index++) {
            let element = this._allSoldierPre[index];
            //cc.log(element.name)
            if (element.name == "Soldier" + id) {
                return element.soldier
            }
        }
        return null
    }

    dieEnemy(sold: SoldiersParent) {
        let index = this._allEnemyList.indexOf(sold)
        let index2 = this._enemyPathList[sold.roadIndex].indexOf(sold)
        if (index >= 0) {
            this._allEnemyList.splice(index, 1)
        }
        if (index2 >= 0) {
            this._enemyPathList[sold.roadIndex].splice(index2, 1)
        }
        // for (let index = 0; index < this._allEnemyList.length; index++) {
        //     if (this._allEnemyList[index] == sold) {
        //         this._allEnemyList.splice(index, 1)
        //         return
        //     }
        // }
    }

    diePlayer(sold: SoldiersParent) {
        let index = this._allPlayerList.indexOf(sold)
        let index2 = this._playerPathList[sold.roadIndex].indexOf(sold)
        if (index >= 0) {
            this._allPlayerList.splice(index, 1)
        }
        if (index2 >= 0) {
            this._playerPathList[sold.roadIndex].splice(index2, 1)
        }
        // for (let index = 0; index < this._allPlayerList.length; index++) {
        //     if (this._allPlayerList[index] == sold) {
        //         this._allPlayerList.splice(index, 1)
        //         return
        //     }
        // }
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
        let playerNodeX = sold.getWorldPos().x;
        for (let index = 0; index < this._allEnemyList.length; index++) {
            if (this._allEnemyList[index].node) {
                let enemyNodeX = this._allEnemyList[index].getWorldPos().x;
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
        let enemyNodeX = sold.getWorldPos().x;
        for (let index = 0; index < this._allPlayerList.length; index++) {
            if (this._allPlayerList[index].node) {
                let playerNodeX = this._allPlayerList[index].getWorldPos().x;
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
        let playerNodeX = sold.getWorldPos().x;
        for (let index = 0; index < this._allEnemyList.length; index++) {
            if (this._allEnemyList[index].node) {
                let enemyNodeX = this._allEnemyList[index].getWorldPos().x;
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
        let playerNodeX = sold.getWorldPos().x;
        for (let index = 0; index < this._allPlayerList.length; index++) {
            if (this._allPlayerList[index].node) {
                let enemyNodeX = this._allPlayerList[index].getWorldPos().x;
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
        let playerNodeX = sold.getWorldPos().x;
        for (let index = 0; index < soldierList.length; index++) {
            if (soldierList[index].node) {
                let enemyNodeX = soldierList[index].getWorldPos().x;
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

    setLevelData(levelData: LevelData) {
        this._levelData = levelData
    }

    getLevelDAta() {
        return this._levelData
    }

    setRoadYList(allYList: number[]) {
        this._allRoadYList = allYList
        for (let index = 0; index < 15; index++) {
            if (!this._playerPathList[index]) {
                this._playerPathList[index] = []
            }
        }
        for (let index = 0; index < 15; index++) {
            if (!this._enemyPathList[index]) {
                this._enemyPathList[index] = []
            }
        }
    }

    getRoadY(roadID: number): number {
        return this._allRoadYList[roadID]
    }

    getPathIndex(sold: SoldiersParent, _camp: Camp) {
        if (_camp = Camp.bule) {
            return this.getPlayerMoveY(sold)
        } else {
            return this.getEnemyMoveY(sold)
        }
    }

    getPlayerMoveY(sold: SoldiersParent): number {
        let soldierList = this._playerPathList[sold.roadIndex];
        let isHaveObs = false
        for (let index = 0; index < soldierList.length; index++) {
            let soldier = soldierList[index];
            if (sold != soldier) {
                let mySoldierX = sold.getWorldPos().x;
                let otherSoldier = soldier.getWorldPos().x;
                if (otherSoldier > mySoldierX && otherSoldier - mySoldierX < this._findWayRand) {
                    isHaveObs = true
                    break
                }
            }
        }
        if (!isHaveObs) {
            return -1
        }
        let allPathID = []
        for (let key in this._playerPathList) {
            if (sold.roadIndex.toString() != key) {
                isHaveObs = false
                let soldierList = this._playerPathList[key];
                for (let index = 0; index < soldierList.length; index++) {
                    let soldier = soldierList[index];
                    let mySoldierX = sold.getWorldPos().x;
                    let otherSoldier = soldier.getWorldPos().x;
                    if (otherSoldier > mySoldierX && otherSoldier - mySoldierX < this._findWayRand) {
                        isHaveObs = true
                        break
                    }
                }
                if (!isHaveObs) {
                    allPathID.push(Number(key))
                }
            }
        }
        let num = -1
        let roadID = -1
        for (let index = 0; index < allPathID.length; index++) {
            let nowPathID = allPathID[index]
            let nowNum = Math.abs(sold.roadIndex - nowPathID)
            if (num == -1) {
                num = nowNum
                roadID = nowPathID
            }
            if (num > nowNum) {
                num = nowNum
                roadID = nowPathID
            } else if (num == nowNum && Math.random() < 0.5) {
                num = nowNum
                roadID = nowPathID
            }
        }
        cc.log("num:", num, allPathID)

        return roadID
    }

    getEnemyMoveY(sold: SoldiersParent): number {
        let soldierList = this._enemyPathList[sold.roadIndex];
        let isHaveObs = false
        for (let index = 0; index < soldierList.length; index++) {
            let soldier = soldierList[index];
            if (sold != soldier) {
                let mySoldierX = sold.getWorldPos().x;
                let otherSoldier = soldier.getWorldPos().x;
                if (otherSoldier < mySoldierX && mySoldierX - otherSoldier < this._findWayRand) {
                    isHaveObs = true
                    break
                }
            }
        }
        if (!isHaveObs) {
            return -1
        }
        let allPathID = []
        for (let key in this._enemyPathList) {
            if (sold.roadIndex.toString() != key) {
                isHaveObs = false
                let soldierList = this._enemyPathList[key];
                for (let index = 0; index < soldierList.length; index++) {
                    let soldier = soldierList[index];
                    let mySoldierX = sold.getWorldPos().x;
                    let otherSoldier = soldier.getWorldPos().x;
                    if (otherSoldier < mySoldierX && mySoldierX - otherSoldier < this._findWayRand) {
                        isHaveObs = true
                        break
                    }
                }
                if (!isHaveObs) {
                    allPathID.push(Number(key))
                }
            }
        }
        let num = -1
        let roadID = -1
        for (let index = 0; index < allPathID.length; index++) {
            let nowPathID = allPathID[index]
            let nowNum = Math.abs(sold.roadIndex - nowPathID)
            if (num == -1) {
                num = nowNum
                roadID = nowPathID
            }
            if (num > nowNum) {
                num = nowNum
                roadID = nowPathID
            } else if (num == nowNum && Math.random() < 0.5) {
                num = nowNum
                roadID = nowPathID
            }
        }
        cc.log("num:", num, allPathID)

        return roadID
    }
    // update (dt) {}
}
