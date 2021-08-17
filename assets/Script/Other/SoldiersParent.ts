// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArmsState, camp } from "./GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoldiersParent extends cc.Component {

    @property({ type: cc.Integer, tooltip: "血条🩸" })
    HP: number = 100;
    @property({ type: cc.Integer, tooltip: "攻击力💪" })
    Attack: number = 60;
    @property({ type: cc.Integer, tooltip: "防御力🛡" })
    Phylactic: number = 20;
    @property({ type: cc.Integer, tooltip: "移动速度🦵" })
    moveSpeed: number = 100;
    @property({ type: cc.Integer, tooltip: "攻击间隔🦵" })
    attackInterval: number = 1;
    @property({ type: cc.Integer, tooltip: "攻击间隔🦵" })
    attackRange: number = 80;
    @property({ type: cc.ProgressBar, tooltip: "血条进度条💩" })
    hpPro: cc.ProgressBar = null;

    nowHp: number = 0;
    nowAttackTime: number = 0;
    armsState: ArmsState = ArmsState.move;
    camp: camp = camp.bule;
    enemy: SoldiersParent = null;

    init(_camp: camp) {
        this.camp = _camp
        if (_camp == camp.red) {
            this.node.scaleX = -1
        }
    }

    hurt(attackValue: number){
        
    }
}
