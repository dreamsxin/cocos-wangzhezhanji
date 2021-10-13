import { BtnInfo } from "../UIManager/ButtonToolMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class buttonToolItem extends cc.Component {

    @property(cc.Label)
    btnName: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    private _fun: Function

    resetData(btnToolInfo: BtnInfo) {
        this._fun = btnToolInfo.fun
        this.btnName.string = btnToolInfo.btnName
    }

    onClickSelf() {
        if (this._fun) {
            this._fun()
        }
    }
}
