import GameCtrl from "../Other/GameCtrl";
import { ArmsState, Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends SoldiersParent {
    //法师
    //小兵攻击逻辑
    attack(dt) {
        let enemyList = GameCtrl.getInstance().getRandSold(this, this.camp)
        if (enemyList.length <= 0) {
            this.armsState = ArmsState.move
            return
        }
        this.nowAttackTime += dt;
        if (this.nowAttackTime >= this.soldierData.attackInterval) {
            this.nowAttackTime = 0;
            //攻击一次
            for (let index = 0; index < enemyList.length; index++) {
                const element = enemyList[index];
                element.hurt(this.soldierData.Attack);
            }
        }
    }
}
