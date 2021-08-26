

import UIParent from "./UIParent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends UIParent {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    ShowUI() {
        super.ShowUI();
    }

    InitUI(uiMain) {
        super.InitUI(uiMain);
    }

    onClickClose() {
        this.HideUI(() => { })
    }
}
