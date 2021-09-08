// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LevelData } from "../Config/LevelConfig";
import GameCtrl from "../Ctrl/GameCtrl";
import LevelCtrl from "../Ctrl/LevelCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;


    private _levelData: LevelData = null
    private _fun: Function = null
    private _levelIndex: number = 0
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(levelData: LevelData, levelIndex: number, fun: Function) {
        this._levelData = levelData
        this._fun = fun
        this._levelIndex = levelIndex
        this.nameLabel.string = "关卡：" + levelData.soldierLevel
    }

    start() {

    }

    onClickDan() {
        LevelCtrl.getInstance().setNowLevelData(this._levelData)
        LevelCtrl.getInstance().setLevelIndex(this._levelIndex)
        if (this._fun) {
            this._fun()
        }
    }
}
