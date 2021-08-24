
import GameCtrl from "../Ctrl/GameCtrl";
import { ArmsState, Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends SoldiersParent {
    //法师
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
    //法师攻击逻辑
    attack(dt) {
        let enemyList = GameCtrl.getInstance().getRandSold(this, this.camp)
        if (enemyList.length <= 0) {
            this.armsState = ArmsState.move
            return
        }
        this.nowAttackTime += dt;
        if (this.nowAttackTime >= this.getAttackInterval()) {
            this.nowAttackTime = 0;
            //范围攻击
            for (let index = 0; index < enemyList.length; index++) {
                const element = enemyList[index];
                element.hurt(this.getAttack());
            }
        }
    }
}
