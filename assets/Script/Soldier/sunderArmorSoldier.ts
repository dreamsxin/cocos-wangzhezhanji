import GameCtrl from "../Other/GameCtrl";
import { ArmsState, Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends SoldiersParent {
    //破甲师
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
    //小兵攻击逻辑
    attack(dt) {
        let enemyCamp = GameCtrl.getInstance().getSold(this, this.camp)
        if (!enemyCamp) {
            this.armsState = ArmsState.move
            return
        }
        this.nowAttackTime += dt;
        if (this.nowAttackTime >= this.soldierData.attackInterval) {
            this.nowAttackTime = 0;
            //破甲
            enemyCamp.hurt(this.soldierData.Attack, 0.2);
        }
    }
}