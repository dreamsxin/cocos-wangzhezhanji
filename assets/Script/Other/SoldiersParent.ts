// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SoldierBasic } from "../Config/BarracksConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "./GameCtrl";
import { ArmsState, Camp } from "./GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoldiersParent extends cc.Component {

    // @property({ type: cc.Integer, tooltip: "血条🩸" })
    // HP: number = 100;
    // @property({ type: cc.Integer, tooltip: "攻击力💪" })
    // Attack: number = 60;
    // @property({ type: cc.Integer, tooltip: "防御力🛡" })
    // Phylactic: number = 20;
    // @property({ type: cc.Integer, tooltip: "移动速度🦵" })
    // moveSpeed: number = 100;
    // @property({ type: cc.Integer, tooltip: "攻击间隔🦵" })
    // attackInterval: number = 1;
    // @property({ type: cc.Integer, tooltip: "攻击间隔🦵" })
    // attackRange: number = 80;
    @property({ type: cc.ProgressBar, tooltip: "血条进度条💩" })
    hpPro: cc.ProgressBar = null;

    nowHp: number = 0;
    nowAttackTime: number = 0;
    armsState: ArmsState = ArmsState.move;
    camp: Camp = Camp.bule;
    enemy: SoldiersParent = null;
    soldierData: SoldierBasic

    init(_camp: Camp, soldierID: number) {
        this.nowHp = this.soldierData.HP;
        this.camp = _camp
        if (_camp == Camp.red) {
            this.node.scaleX = -1
        }
        let data: SoldierBasic = BarracksCtrl.getInstance().getBarracksConfigItem(soldierID);
        this.soldierData = data
    }

    //小兵受伤逻辑
    hurt(attackValue: number) {
        if (this.armsState == ArmsState.die) return
        let nowHurtValue = attackValue * (1 - (this.soldierData.Phylactic / (100 + this.soldierData.Phylactic)));
        nowHurtValue = nowHurtValue < attackValue * 0.05 ? attackValue * 0.05 : nowHurtValue;
        this.nowHp -= nowHurtValue;
        this.hpPro.progress = this.nowHp / this.soldierData.HP;
        if (this.nowHp < 0) {
            this.armsState = ArmsState.die;
            if (this.camp == Camp.bule) {
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
        if (GameCtrl.getInstance().getSold(this, this.camp)) {
            this.armsState = ArmsState.attack
            return
        }
        if (this.camp == 0) {
            this.node.x += dt * this.soldierData.moveSpeed;
        } else {
            this.node.x -= dt * this.soldierData.moveSpeed;
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
            //攻击一次
            enemyCamp.hurt(this.soldierData.Attack);
        }
    }

    heal(hp) {
        this.nowHp += hp;
        this.nowHp = this.nowHp > this.soldierData.HP ? this.soldierData.HP : this.nowHp
        this.hpPro.progress = this.nowHp / this.soldierData.HP;
    }

    isSmallHP() {
        return this.nowHp != this.soldierData.HP
    }

}
