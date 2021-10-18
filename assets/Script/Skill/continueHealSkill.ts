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
export default class continueHealSkill extends cc.Component {
    // 持续治愈术
    private _healMax: number = 3
    private _healTime: number = 0
    private _skillID: number = 0

    start() {
        this.initButtonClick()
    }

    resetData(skillID: number) {
        this._skillID = skillID
    }

    initButtonClick() {
        this.node.on('click', this.onClickSkill, this)
    }

    onClickSkill() {
        this._healTime = this._healMax
        this.unschedule(this.healDownTime)
        this.schedule(this.healDownTime, 1)
    }

    healDownTime() {
        this._healTime--
        let list = GameCtrl.getInstance().getAllPlayerSolierList()
        let skillInfo = SkillCtrl.getInstance().getSkillConfigItem(this._skillID)
        let healNum = skillInfo.Attack + SkillCtrl.getInstance().getSkillLevel(this._skillID) * 50
        for (let index = 0; index < list.length; index++) {
            let soldier = list[index];
            soldier.heal(healNum)
        }
        if (this._healTime <= 0) {
            this.unschedule(this.healDownTime)
        }
    }

    // update (dt) {}
}
