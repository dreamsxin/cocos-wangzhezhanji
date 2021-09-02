import BarracksCtrl from "../Ctrl/BarracksCtrl";


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

    // LIFE-CYCLE CALLBACKS:

    private _fun: Function
    private _soldierID: number = 0
    private _itemIndex: number = 0;
    // onLoad () {}

    start() {

    }

    Init(soldierID: number, fun: Function, itemIndex: number) {
        this._fun = fun
        this._itemIndex = itemIndex
        this.resetUI(soldierID)
        this.setButtonActive(false)
    }

    onClickSele() {
        if (this._fun) {
            this._fun(this._itemIndex, 0)
        }
    }

    onClickUnload() {
        BarracksCtrl.getInstance().setWarConfigList(0, this._itemIndex)
        this.setButtonActive(false)
        if (this._fun) {
            this._fun(this._itemIndex, this._soldierID)
        }
        this._setSoldierID(0)
        this.resetUI(0)
    }

    //取消
    onClickCancel() {
        this.setButtonActive(false)
    }

    selectUI(index: number) {
        if (this.selectNode.active && this._itemIndex == index) {
            this.selectNode.active = false
            this.unloadNode.active = this._soldierID != 0
        } else {
            this.unloadNode.active = false
            this.selectNode.active = this._itemIndex == index
        }
        return this.selectNode.active
    }

    _setSoldierID(soldierID: number) {
        this._soldierID = soldierID
    }

    getSoldierID() {
        return this._soldierID
    }

    resetUI(soldierID: number) {
        this._setSoldierID(soldierID)
        let data = BarracksCtrl.getInstance().getBarracksConfigItem(soldierID);
        this.nameLabel.string = data ? data.soldierName : ""
    }

    setButtonActive(isShow) {
        this.unloadNode.active = isShow
        this.selectNode.active = isShow
        this.cancelNode.active = isShow
    }
    // isShowSelectUI(soldierID: number, isShow: boolean) {
    //     if (soldierID == this._soldierData.soldierID) {
    //         this.selectNode.active = isShow
    //     }
    // }
}
