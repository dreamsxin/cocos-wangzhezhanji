// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SkillBase from "../Base/SkillBase";
import GameCtrl from "../Ctrl/GameCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";
import { SkillType } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class bigHealSkill extends SkillBase{
    // 大治愈术

    start() {
        this.initButtonClick()
    }

    initButtonClick() {
        this.node.on('click', this.onClickSkill, this)
    }

    onClickSkill() {
        let list = GameCtrl.getInstance().getAllPlayerSolierList()
        let skillInfo = SkillCtrl.getInstance().getSkillConfigItem(this.skillID)
        let healNum = skillInfo.Attack + SkillCtrl.getInstance().getSkillLevel(this.skillID) * 50
        for (let index = 0; index < list.length; index++) {
            let soldier = list[index];
            soldier.heal(healNum)
        }
    }

    // update (dt) {}
}
