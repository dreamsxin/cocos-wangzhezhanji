
import GameCtrl from "../Ctrl/GameCtrl";
import { ArmsState, Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends SoldiersParent {
    //医生
    // update(dt) {
    //     switch (this.armsState) {
    //         case ArmsState.attack:
    //             this.attack(dt);
    //             break;
    //         case ArmsState.move:
    //             this.move(dt);
    //             break;
    //     }
    // }
    //小兵移动逻辑
    move(dt) {
        // this.nowAttackTime += dt;
        // if (GameCtrl.getInstance().getTeamSold(this, this.camp) && this.nowAttackTime >= this.getAttackInterval()) {
        //     this.armsState = ArmsState.attack
        //     return
        // }
        // if (GameCtrl.getInstance().getSold(this, this.camp)) {
        //     this.armsState = ArmsState.attack
        //     return
        // }
        // if (this.camp == 0) {
        //     this.node.x += dt * this.getMoveSpeed();
        // } else {
        //     this.node.x -= dt * this.getMoveSpeed();
        // }
        //---------------------------------------------------------------------------
        this.nowAttackTime += dt;
        if (this.isMoveY) {
            if (this.moveRoadID < this.roadIndex) {
                this.node.y += dt * this.getMoveSpeed();
                if (this.node.y > this.moveRoadY) {
                    this.node.y = this.moveRoadY
                    GameCtrl.getInstance().setSoldierRoad(this, this.moveRoadID, this.camp)
                    this.isMoveY = false
                }
            } else {
                this.node.y -= dt * this.getMoveSpeed();
                if (this.node.y < this.moveRoadY) {
                    this.node.y = this.moveRoadY
                    GameCtrl.getInstance().setSoldierRoad(this, this.moveRoadID, this.camp)
                    this.isMoveY = false
                }
            }
            this.upDateZIndex()
            return
        }
        if (GameCtrl.getInstance().getTeamSold(this, this.camp) && this.nowAttackTime >= this.getAttackInterval()) {
            this.armsState = ArmsState.attack
            return
        }
        if (GameCtrl.getInstance().getSold(this, this.camp)) {
            this.armsState = ArmsState.attack
            return
        }
        let roadID = GameCtrl.getInstance().getPathIndex(this, this.camp)
        if (roadID == -1) {
            if (this.camp == 0) {
                this.node.x += dt * this.getMoveSpeed();
            } else {
                this.node.x -= dt * this.getMoveSpeed();
            }
        } else {
            this.moveRoadID = roadID
            this.moveRoadY = GameCtrl.getInstance().getRoadY(this.moveRoadID)
            this.isMoveY = true
        }
    }
    //医师加血逻辑
    attack(dt) {
        //给队友加血
        this.nowAttackTime += dt;
        let enemyList = GameCtrl.getInstance().getRandSold(this, this.camp)
        let teamSoldier = GameCtrl.getInstance().getTeamSold(this, this.camp)
        if (enemyList.length <= 0) {
            this.armsState = ArmsState.move
        }

        if (this.nowAttackTime >= this.getAttackInterval() && teamSoldier) {
            this.nowAttackTime = 0;
            //加血
            teamSoldier.heal(this.getAttack())
        }
    }
}