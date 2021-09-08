

import { LevelData } from "../Config/LevelConfig";
import LevelCtrl from "../Ctrl/LevelCtrl";
import BigLevelItem from "../Other/BigLevelItem";
import levelItem from "../Other/levelItem";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends UIParent {

    @property(cc.ScrollView)
    levelScrollView: cc.ScrollView = null;
    @property(cc.Node)
    levelItem: cc.Node = null;

    @property(cc.ScrollView)
    bigLevelScrollView: cc.ScrollView = null;
    @property(cc.Node)
    bigLevelItem: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    start() {
        
    }

    ShowUI() {
        super.ShowUI();
        this.seleteBigLevel(0)
        this.InitBigLevel()
    }

    seleteBigLevel(bigLevelIndex: number) {
        LevelCtrl.getInstance().setBigLevelIndex(bigLevelIndex)
        this.InitLevel(bigLevelIndex)
    }

    InitBigLevel() {
        let content = this.bigLevelScrollView.content
        content.removeAllChildren()
        this.bigLevelItem.active = false;

        let levelName = LevelCtrl.getInstance().getAllLevelName()
        for (let index = 0; index < levelName.length; index++) {
            let name = levelName[index];
            let obj = cc.instantiate(this.bigLevelItem)
            obj.active = true
            content.addChild(obj)
            let spr = obj.getComponent(BigLevelItem)
            spr.init(name, index, (biglevelIndex) => {
                this.seleteBigLevel(biglevelIndex)
            })
        }
    }

    InitLevel(bigLevelIndex: number) {
        let content = this.levelScrollView.content
        content.removeAllChildren()
        this.levelItem.active = false;

        let levelData = LevelCtrl.getInstance().getLevelConfigItem(bigLevelIndex)
        for (let index = 0; index < levelData.length; index++) {
            let level = levelData[index];
            let obj = cc.instantiate(this.levelItem)
            obj.active = true
            content.addChild(obj)
            let spr = obj.getComponent(levelItem)
            spr.init(level, index, () => {
                this.onClickClose()
                this.uiManager.HideUIName("HomeMain")
                this.uiManager.ShowUIName("GameMain");
            })
        }
    }

    InitUI(uiMain) {
        super.InitUI(uiMain);
    }

    onClickClose() {
        this.HideUI(() => { })
    }
}
