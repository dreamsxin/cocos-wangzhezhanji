
import SkillBase from "../Base/SkillBase";
import SkillCtrl from "../Ctrl/SkillCtrl";
import { SkillType } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class smallHealSkill extends SkillBase {
    // 小治愈术

    start() {
        this.initButtonClick()
    }

    initButtonClick() {
        this.node.on('click', this.onClickSkill, this)
    }

    onClickSkill() {
        SkillCtrl.getInstance().openSkill(SkillType.smallHealSkill, (sold: SoldiersParent) => {
            let skillInfo = SkillCtrl.getInstance().getSkillConfigItem(this.skillID)
            let healNum = skillInfo.Attack + SkillCtrl.getInstance().getSkillLevel(this.skillID) * 50
            sold.heal(healNum)
        })
    }

    // update (dt) {}
}
