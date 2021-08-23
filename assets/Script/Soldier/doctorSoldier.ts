import GameCtrl from "../Other/GameCtrl";
import { ArmsState, Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends SoldiersParent {
    //医生
    update(dt) {
        switch (this.armsState) {
            case ArmsState.attack:
                this.attack(dt);
                break;
            case ArmsState.move:
                this.move(dt);
                break;
        }
    }
    //小兵移动逻辑
    move(dt) {
        this.nowAttackTime += dt;
        if (GameCtrl.getInstance().getTeamSold(this, this.camp) && this.nowAttackTime >= this.soldierData.attackInterval) {
            this.armsState = ArmsState.attack
            return
        }
        if (this.camp == 0) {
            this.node.x += dt * this.soldierData.moveSpeed;
        } else {
            this.node.x -= dt * this.soldierData.moveSpeed;
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

        if (this.nowAttackTime >= this.soldierData.attackInterval && teamSoldier) {
            this.nowAttackTime = 0;
            //加血
            teamSoldier.heal(this.soldierData.Attack)
        }
    }
}