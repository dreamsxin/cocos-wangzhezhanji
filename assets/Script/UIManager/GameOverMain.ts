// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameEvent } from "../Config/GameEventConfig";
import RoleCtrl from "../Ctrl/RoleCtrl";
import GameEventManager from "../Manager/GameEventManager";
import { Camp } from "../Other/GameData";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverMain extends UIParent {

    @property(cc.Label)
    label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    ShowUI(fun = () => { }, data: any) {
        super.ShowUI();
        if (data.winData == Camp.bule) {
            this.label.node.color = cc.Color.RED
            this.label.string = "你输了!"
        } else {
            this.label.node.color = cc.Color.GREEN
            this.label.string = "你赢了!"
            let rewardList = data.levelData.rewardList
            if (rewardList) {
                for (let index = 0; index < rewardList.length; index++) {
                    let itemInfo = rewardList[index];
                    let goldCount = RoleCtrl.getInstance().getItemCount(itemInfo.itemId)
                    goldCount += itemInfo.itemCount
                    RoleCtrl.getInstance().setItemCount(itemInfo.itemId, goldCount)
                    this.label.string = "获得奖励:" + itemInfo.itemId
                }
            }
        }
    }

    onClickClose() {
        this.HideUI()
        this.sendEvent(GameEvent.CloseGameMain)
    }

    onClickAgain() {
        this.HideUI()
        this.sendEvent(GameEvent.AgainGameMain)
    }

    onClickNext() {
        this.HideUI()
        this.sendEvent(GameEvent.NextGameMain)
    }

    sendEvent(eventId, data: any = null) {
        GameEventManager.getInstance().dispathcGameEvent(eventId, data);
    }
}
