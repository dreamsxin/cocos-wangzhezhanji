// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameCtrl from "../Ctrl/GameCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";
import { SkillType } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class smallAttackSkill extends cc.Component {
    // 落雷
    private _hurtMax: number = 5
    private _hurtTime: number = 0
    
    start() {
        this.initButtonClick()
    }

    initButtonClick() {
        this.node.on('click', this.onClickSkill, this)
    }

    onClickSkill() {
        this._hurtTime = this._hurtMax
        this.unschedule(this.hurtDownTime)
        this.schedule(this.hurtDownTime, 1)
    }

    hurtDownTime() {
        this._hurtTime--
        let list = GameCtrl.getInstance().getAllPlayerSolierList()
        for (let index = 0; index < list.length; index++) {
            let soldier = list[index];
            soldier.hurt(100)
        }
        if (this._hurtTime <= 0) {
            this.unschedule(this.hurtDownTime)
        }
    }

    // update (dt) {}
}
