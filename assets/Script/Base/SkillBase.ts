import SkillCtrl from "../Ctrl/SkillCtrl";
import GameUtils from "../GameUtils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillBase extends cc.Component {
    @property(cc.Label)
    skillName: cc.Label = null;

    skillID: number = 0

    resetData(skillID: number) {
        this.skillID = skillID
        let data = SkillCtrl.getInstance().getSkillConfigItem(skillID);
        GameUtils.getInstance().setString(this.skillName, data.skillName)
    }
}
