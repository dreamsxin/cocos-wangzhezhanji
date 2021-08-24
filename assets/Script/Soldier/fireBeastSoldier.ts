
import GameCtrl from "../Ctrl/GameCtrl";
import { ArmsState, Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends SoldiersParent {
    //炎兽
    //小兵受伤逻辑
    hurt(attackValue: number) {
        if (this.armsState == ArmsState.die) return
        let nowHurtValue = attackValue * (1 - (this.getPhylactic() / (100 + this.getPhylactic())));
        nowHurtValue = nowHurtValue < attackValue * 0.05 ? attackValue * 0.05 : nowHurtValue;
        this.nowHp -= nowHurtValue;
        this.hpPro.progress = this.nowHp / this.getHP();
        if (this.nowHp < 0) {
            this.armsState = ArmsState.die;
            if (this.camp == Camp.bule) {
                GameCtrl.getInstance().diePlayer(this)
            } else {
                GameCtrl.getInstance().dieEnemy(this)
            }
            let enemyList = GameCtrl.getInstance().getRandSold(this, this.camp)
            if (enemyList.length > 0) {
                for (let index = 0; index < enemyList.length; index++) {
                    const element = enemyList[index];
                    element.hurt(this.getAttack() * 2)
                }
            }
            cc.tween(this.node)
                .to(0.5, { opacity: 0 })
                .call(() => {
                    this.node.destroy();
                })
                .start()
        }
    }
}
