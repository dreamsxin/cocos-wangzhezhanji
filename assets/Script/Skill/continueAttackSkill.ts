
import SkillBase from "../Base/SkillBase";
import GameCtrl from "../Ctrl/GameCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";
import { SkillType } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class smallAttackSkill extends SkillBase {
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
        let list = GameCtrl.getInstance().getAllEnemySolierList()
        let skillInfo = SkillCtrl.getInstance().getSkillConfigItem(this.skillID)
        let attackNum = skillInfo.Attack + SkillCtrl.getInstance().getSkillLevel(this.skillID) * 50
        for (let index = 0; index < list.length; index++) {
            let soldier = list[index];
            soldier.hurt(attackNum)
        }
        if (this._hurtTime <= 0) {
            this.unschedule(this.hurtDownTime)
        }
    }

    // update (dt) {}
}
