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

    // LIFE-CYCLE CALLBACKS:

    private _fun: Function
    private _soldierID: number = 0
    private _itemIndex: number = 0;
    // onLoad () {}

    start() {

    }

    Init(soldierID: number, fun: Function, itemIndex: number) {
        this._soldierID = soldierID
        this._fun = fun
        this._itemIndex = itemIndex
        let data = BarracksCtrl.getInstance().getBarracksConfigItem(soldierID);
        this.nameLabel.string = data ? data.soldierName : ""
    }

    onClickSele() {
        if (this._fun) {
            this._fun(this._itemIndex)
        }
    }
    selectUI(index: number) {
        cc.log(index)
        this.selectNode.active = this._itemIndex == index
    }
}
