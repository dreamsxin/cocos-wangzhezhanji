import GameCtrl from "./GameCtrl";
import { ArmsState, camp } from "./GameData";
import SoldiersParent from "./SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends SoldiersParent {

    start() {
        this.nowHp = this.HP;
    }
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
    init(camp) {
        super.init(camp);
    }
    //小兵移动逻辑
    move(dt) {
        if (GameCtrl.getInstance().getSold(this, this.camp)) {
            this.armsState = ArmsState.attack
            return
        }
        if (this.camp == 0) {
            this.node.x += dt * this.moveSpeed;
        } else {
            this.node.x -= dt * this.moveSpeed;
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
        if (this.nowAttackTime >= this.attackInterval) {
            this.nowAttackTime = 0;
            //攻击一次
            enemyCamp.hurt(this.Attack);
        }
    }
    //小兵受伤逻辑
    hurt(attackValue: number) {
        super.hurt(attackValue)
        if (this.armsState == ArmsState.die) return
        let nowHurtValue = attackValue * (1 - (this.Phylactic / (100 + this.Phylactic)));
        nowHurtValue = nowHurtValue < attackValue * 0.05 ? attackValue * 0.05 : nowHurtValue;
        this.nowHp -= nowHurtValue;
        this.hpPro.progress = this.nowHp / this.HP;
        if (this.nowHp < 0) {
            this.armsState = ArmsState.die;
            if (this.camp == camp.bule) {
                GameCtrl.getInstance().diePlayer(this)
            } else {
                GameCtrl.getInstance().dieEnemy(this)
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
