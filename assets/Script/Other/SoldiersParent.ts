// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SoldierBasic } from "../Config/BarracksConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "../Ctrl/GameCtrl";
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
    @property({ type: cc.Label, tooltip: "名字🦵" })
    soldierNameLabel: cc.Label = null;

    nowHp: number = 0;
    nowAttackTime: number = 0;
    armsState: ArmsState = ArmsState.default;
    camp: Camp = Camp.bule;
    enemy: SoldiersParent = null;
    soldierData: SoldierBasic
    controlTime: number = 0
    roadIndex: number = 0

    init(_camp: Camp, soldierID: number) {
        cc.log("初始化", _camp, soldierID)
        let data: SoldierBasic = BarracksCtrl.getInstance().getBarracksConfigItem(soldierID);
        this.soldierData = data
        this.nowHp = this.getHP();
        this.camp = _camp
        if (_camp == Camp.red) {
            this.node.scaleX = -1
            this.soldierNameLabel.node.scaleX = -1
        }
        if (this.soldierNameLabel) {
            this.soldierNameLabel.string = data.soldierName
        }
        this.armsState = ArmsState.move;
    }

    //小兵受伤逻辑
    hurt(attackValue: number, sunderArmorNum: number = 0) {
        if (this.armsState == ArmsState.die) return
        let phylacticValue = this.getPhylactic() * (1 - sunderArmorNum)
        let nowHurtValue = attackValue * (1 - (phylacticValue / (100 + phylacticValue)));
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
            cc.tween(this.node)
                .to(0.5, { opacity: 0 })
                .call(() => {
                    this.node.destroy();
                })
                .start()
        }
    }

    update(dt) {
        if (this.controlTime > 0) {
            this.controlTime -= dt
            return
        }
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
            this.node.x += dt * this.getMoveSpeed();
        } else {
            this.node.x -= dt * this.getMoveSpeed();
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
        if (this.nowAttackTime >= this.getAttackInterval()) {
            this.nowAttackTime = 0;
            //攻击一次
            enemyCamp.hurt(this.getAttack());
        }
    }

    heal(hp) {
        this.nowHp += hp;
        let maxHP = this.getHP()
        this.nowHp = this.nowHp > maxHP ? maxHP : this.nowHp
        this.hpPro.progress = this.nowHp / maxHP;
    }

    isSmallHP() {
        return this.nowHp != this.getHP()
    }

    control(controlTime) {
        if (controlTime > this.controlTime) {
            this.controlTime = controlTime
        }
    }

    getAttack(): number {
        return this.soldierData.Attack * (1 + GameCtrl.getInstance().getBannerBuff(this.camp))
    }

    getHP(): number {
        return this.soldierData.HP * (1 + GameCtrl.getInstance().getBannerBuff(this.camp))
    }

    getPhylactic(): number {
        return this.soldierData.Phylactic
    }

    getMoveSpeed(): number {
        return this.soldierData.moveSpeed
    }

    getAttackInterval(): number {
        return this.soldierData.attackInterval
    }

    getAttackRange(): number {
        return this.soldierData.attackRange
    }

    getSoldierID(): number {
        return this.soldierData.soldierID
    }

    getSkillRange(): number {
        return this.soldierData.skillRange
    }

    getBuffValue() {
        return this.soldierData.buffValue
    }

    updataHPUI() {
        let maxHP = this.getHP()
        this.nowHp = this.nowHp > maxHP ? maxHP : this.nowHp
        this.hpPro.progress = this.nowHp / maxHP;
    }


}
