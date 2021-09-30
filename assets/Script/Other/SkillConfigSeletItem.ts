// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SoldierBasic } from "../Config/BarracksConfig";
import { SkillBasic } from "../Config/SkillConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WarConfigSoldierItem extends cc.Component {

    @property(cc.Sprite)
    handSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Node)
    selectNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    private _fun: Function
    private _skillData: SkillBasic
    // onLoad () {}

    start() {

    }

    Init(skillData: SkillBasic, fun: Function) {
        this._skillData = skillData
        this._fun = fun
        this.nameLabel.string = skillData.skillName
        this.selectNode.active = SkillCtrl.getInstance().checkIsHaveConfigList(skillData.skillID) >= 0
    }

    onClickSele() {
        if (this._fun) {
            this._fun(this._skillData.skillID)
        }
    }

    selectUI(isSelect: boolean) {
        this.selectNode.active = isSelect
    }

    isShowSelectUI(skillID: number, isShow: boolean) {
        if (skillID == this._skillData.skillID) {
            this.selectNode.active = isShow
        }
    }
    // update (dt) {}
}
