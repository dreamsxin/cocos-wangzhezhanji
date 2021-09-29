// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SkillCtrl from "../Ctrl/SkillCtrl";
import { SkillType } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class smallAttackSkill extends cc.Component {
    // 落雷
    start() {
        this.initButtonClick()
    }

    initButtonClick() {
        this.node.on('click', this.onClickSkill, this)
    }

    onClickSkill() {
        SkillCtrl.getInstance().openSkill(SkillType.smallAttackSkill, (sold: SoldiersParent) => {
            sold.hurt(900)
        })
    }

    // update (dt) {}
}
