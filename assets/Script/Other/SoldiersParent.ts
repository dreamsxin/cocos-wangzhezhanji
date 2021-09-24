// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SoldierBasic } from "../Config/BarracksConfig";
import { GameEvent } from "../Config/GameEventConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "../Ctrl/GameCtrl";
import RoleCtrl from "../Ctrl/RoleCtrl";
import GameEventManager from "../Manager/GameEventManager";
import { ArmsState, Camp, soldierRatio, TowerID } from "./GameData";

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
    @property(cc.Node)
    magicNode: cc.Node = null;

    nowHp: number = 0;
    nowAttackTime: number = 0;
    armsState: ArmsState = ArmsState.default;
    camp: Camp = Camp.bule;
    enemy: SoldiersParent = null;
    soldierData: SoldierBasic
    controlTime: number = 0
    roadIndex: number = 0
    isMoveY: boolean = false
    isMove: boolean = true
    isGoOut: boolean = true
    // isTower: boolean = true  //关闭将不受旗手Buff加成
    moveRoadID: number = 0
    moveRoadY: number = 0
    soldierLevel: number = 0;

    init(_camp: Camp, soldierID: number, roadIndex: number, isMove: boolean = true) {
        //cc.log("初始化", _camp, soldierID)
        let data: SoldierBasic = BarracksCtrl.getInstance().getBarracksConfigItem(soldierID);
        this.soldierData = data
        this.isMove = isMove
        this.soldierLevel = RoleCtrl.getInstance().getSoldierLevel(data.soldierID)
        this.nowHp = this.getHP();
        this.hpPro.progress = 1
        this.camp = _camp

        if (this.soldierNameLabel) {
            this.soldierNameLabel.string = data.soldierName
        }
        this.armsState = ArmsState.move;
        this.roadIndex = roadIndex
        this.node.y = GameCtrl.getInstance().getRoadY(this.roadIndex)
        this.upDateZIndex()
        if (this.magicNode) {
            this.magicNode.active = GameCtrl.getInstance().getBannerBuff(this.camp) > 0
        }
        this.setSoldierUI()
    }

    initHpPro(hp: cc.ProgressBar) {
        this.hpPro = hp
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
                    if (this.getSoldierID() == 20) {
                        this.sendEvent(GameEvent.GameOver, this.camp)
                    }
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
        if (this.isMove) {
            switch (this.armsState) {
                case ArmsState.attack:
                    this.attack(dt);
                    break;
                case ArmsState.move:
                    this.move(dt);
                    break;
            }
        } else {
            this.attack(dt);
        }
    }

    //小兵移动逻辑
    move(dt) {
        if (!this.isGoOut) {
            this.node.x += dt * this.getMoveXSpeed();
            if (this.checkReturnStartPoint()) {
                this.isGoOut = true
                this.isMove = false
                this.setSoldierUI()
            }
            return
        }
        if (this.isMoveY) {
            if (this.moveRoadID < this.roadIndex) {
                this.node.y += dt * this.getMoveYSpeed();
                if (this.node.y > this.moveRoadY) {
                    this.node.y = this.moveRoadY
                    GameCtrl.getInstance().setSoldierRoad(this, this.moveRoadID, this.camp)
                    this.isMoveY = false
                }
            } else {
                this.node.y -= dt * this.getMoveYSpeed();
                if (this.node.y < this.moveRoadY) {
                    this.node.y = this.moveRoadY
                    GameCtrl.getInstance().setSoldierRoad(this, this.moveRoadID, this.camp)
                    this.isMoveY = false
                }
            }
            this.upDateZIndex()
            return
        }
        if (GameCtrl.getInstance().getSold(this, this.camp)) {
            this.armsState = ArmsState.attack
            return
        }
        let roadID = GameCtrl.getInstance().getPathIndex(this, this.camp)
        if (roadID == -1) {
            let isCollect = this.checkCollectSoldier()
            this.node.x += dt * this.getMoveXSpeed();
            if (isCollect) {
                this.updataCollectMoveX()
            }
            // if (this.camp == 0) {
            //     this.node.x += dt * this.getMoveXSpeed();
            // } else {
            //     this.node.x -= dt * this.getMoveXSpeed();
            // }
        } else {
            this.moveRoadID = roadID
            this.moveRoadY = GameCtrl.getInstance().getRoadY(this.moveRoadID)
            this.isMoveY = true
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
        this.healEffect()
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
        let attackNum = this.soldierData.Attack + (this.soldierLevel * soldierRatio * 0.01)//属性概率=初始属性+属性等级*属性系数（k）*1%
        return attackNum * (1 + GameCtrl.getInstance().getBannerBuff(this.camp))
    }

    getHP(): number {
        let hp = this.soldierData.HP + (this.soldierLevel * soldierRatio * 0.01)
        if (this.getIsTower()) {
            return hp * (1 + GameCtrl.getInstance().getBannerBuff(this.camp))
        } else {
            return hp
        }
    }

    getPhylactic(): number {
        let phylactic = this.soldierData.Phylactic + (this.soldierLevel * soldierRatio * 0.01)
        return phylactic
    }

    getMoveXSpeed(): number {
        return this.soldierData.moveSpeed * this.getCampCount() * this.getGoOutCount()
    }

    getMoveYSpeed(): number {
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

    getIsTower() {
        return this.getSoldierID() == TowerID
    }

    updataHPUI() {
        let maxHP = this.getHP()
        this.nowHp = this.nowHp > maxHP ? maxHP : this.nowHp
        this.hpPro.progress = this.nowHp / maxHP;
    }

    getWorldPos(): cc.Vec2 {
        return this.node.convertToWorldSpaceAR(cc.v2(0, 0))
    }

    upDateZIndex() {
        this.node.zIndex = this.node.y * -1
    }

    healEffect() {
        let posX = [20, -20, 0]
        for (let index = 0; index < posX.length; index++) {
            let obj = new cc.Node();
            obj.color = cc.Color.GREEN
            let text = obj.addComponent(cc.Label)
            text.string = "+"
            text.enableBold = true
            this.node.addChild(obj)
            let pos = this.hpPro.node.position
            obj.setPosition(cc.v2(pos.x + posX[index], pos.y + this.hpPro.node.height + 5))
            obj.opacity = 0
            cc.tween(obj)
                .delay(index * 0.3)
                .call(() => {
                    obj.opacity = 255
                })
                .by(0.5, { y: 20, opacity: 0 })
                .removeSelf()
                .start()
        }
    }

    setBannerEffect(isShow: boolean) {
        if (this.magicNode) {
            this.magicNode.active = isShow
        }
    }

    setSoldierUI() {
        let face = this.getCampCount()
        this.node.scaleX = face
        if (this.soldierNameLabel) this.soldierNameLabel.node.scaleX = face
        // if (this.camp == Camp.red) {
        //     this.node.scaleX = -1
        //     if (this.soldierNameLabel) this.soldierNameLabel.node.scaleX = -1
        // }
    }

    getCampCount() {
        return this.camp == Camp.bule ? 1 : -1
    }

    getGoOutCount() {
        return this.isGoOut ? 1 : -1
    }

    checkReturnStartPoint() {
        if (this.camp == Camp.bule) {
            return this.node.x <= GameCtrl.getInstance().getPathMin().x
        } else {
            return this.node.x >= GameCtrl.getInstance().getPathMax().x
        }
    }

    checkCollectSoldier() {
        if (GameCtrl.getInstance().getCollectSoldier()) {
            if (this.camp == Camp.bule) {
                if (this.node.x < GameCtrl.getInstance().getCollectMin().x) {
                    return true
                }
            } else {
                if (this.node.x > GameCtrl.getInstance().getCollectMax().x) {
                    return true
                }
            }
            return false
        } else {
            return false
        }
    }

    updataCollectMoveX() {
        if (this.camp == Camp.bule) {
            if (this.node.x > GameCtrl.getInstance().getCollectMin().x) {
                this.node.x = GameCtrl.getInstance().getCollectMin().x
            }
        } else {
            if (this.node.x < GameCtrl.getInstance().getCollectMax().x) {
                this.node.x = GameCtrl.getInstance().getCollectMax().x
            }
        }
    }

    setGoOut() {
        this.isMove = true
        this.isGoOut = true
    }

    setReturn() {
        this.isGoOut = false
    }

    sendEvent(eventId, data: any = null) {
        GameEventManager.getInstance().dispathcGameEvent(eventId, data);
    }
}
