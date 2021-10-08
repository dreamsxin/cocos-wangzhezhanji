import BarracksCtrl from "../Ctrl/BarracksCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarConfigListItem extends cc.Component {

    @property(cc.Sprite)
    handSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Node)
    selectNode: cc.Node = null;
    @property(cc.Node)
    unloadNode: cc.Node = null;
    @property(cc.Node)
    cancelNode: cc.Node = null;
    @property(cc.Node)
    butParent: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    private _fun: Function
    private _skillID: number = 0
    private _itemIndex: number = 0;
    // onLoad () {}

    start() {

    }

    Init(skillID: number, fun: Function, itemIndex: number) {
        this._fun = fun
        this._itemIndex = itemIndex
        this.resetUI(skillID)
        this.setButtonActive(false)
    }

    onClickSele() {
        if (this._fun) {
            this._fun(this._itemIndex, 0)
        }
    }

    onClickUnload() {
        SkillCtrl.getInstance().setSkillConfigList(0, this._itemIndex)
        this.setButtonActive(false)
        if (this._fun) {
            this._fun(this._itemIndex, this._skillID)
        }
        this._setSkillID(0)
        this.resetUI(0)
        this.selectNode.active = false
    }

    //取消
    onClickCancel() {
        this.setButtonActive(false)
    }

    selectUI(index: number) {
        if (this.selectNode.active && this._itemIndex == index) {
            this.selectNode.active = false
            this.butParent.active = this._skillID != 0
            // this.unloadNode.active = this._soldierID != 0
            // this.cancelNode.active = this._soldierID != 0
        } else {
            this.butParent.active = false
            // this.unloadNode.active = false
            this.selectNode.active = this._itemIndex == index
        }
        return this.selectNode.active
    }

    _setSkillID(skillID: number) {
        this._skillID = skillID
    }

    getSoldierID() {
        return this._skillID
    }

    resetUI(skillID: number) {
        this._setSkillID(skillID)
        let data = SkillCtrl.getInstance().getSkillConfigItem(skillID);
        this.nameLabel.string = data ? data.skillName : ""
    }

    setButtonActive(isShow) {
        // this.unloadNode.active = isShow
        this.selectNode.active = isShow
        // this.cancelNode.active = isShow
        this.butParent.active = isShow
    }
    // isShowSelectUI(soldierID: number, isShow: boolean) {
    //     if (soldierID == this._soldierData.soldierID) {
    //         this.selectNode.active = isShow
    //     }
    // }
}
