

import { LevelData } from "../Config/LevelConfig";
import LevelCtrl from "../Ctrl/LevelCtrl";
import levelItem from "../Other/levelItem";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends UIParent {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    scrollViewItem: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    ShowUI() {
        super.ShowUI();
        this.InitScrollView()
    }

    InitScrollView() {
        let content = this.scrollView.content
        content.removeAllChildren()
        let levelData = LevelCtrl.getInstance().getAllLevel()
        cc.log(levelData)
        this.scrollViewItem.active = false;
        for (let key in levelData) {
            let data: LevelData = levelData[key]

            let obj = cc.instantiate(this.scrollViewItem)
            obj.active = true
            content.addChild(obj)
            let spr = obj.getComponent(levelItem)
            spr.init(data)
        }
    }

    InitUI(uiMain) {
        super.InitUI(uiMain);
    }

    onClickClose() {
        this.HideUI(() => { })
    }
}
