// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LevelData } from "../Config/LevelConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;


    private _levelData: LevelData = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(levelData: LevelData) {
        this._levelData = levelData
        this.nameLabel.string = "关卡：" + levelData.soldierLevel
    }

    start() {

    }

    onClickDan() {

    }
}
