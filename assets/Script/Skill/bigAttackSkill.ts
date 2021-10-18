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
        let list = GameCtrl.getInstance().getAllEnemySolierList()
        let skillInfo = SkillCtrl.getInstance().getSkillConfigItem(this._skillID)
        let attackNum = skillInfo.Attack + SkillCtrl.getInstance().getSkillLevel(this._skillID) * 50
        for (let index = 0; index < list.length; index++) {
            let soldier = list[index];
            soldier.hurt(attackNum)
        }
    }

    // update (dt) {}
}
