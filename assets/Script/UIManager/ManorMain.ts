// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuildingType } from "../Config/ManorConfig";
import ManorCtrl from "../Ctrl/ManorCtrl";
import RoleCtrl, { CoinType } from "../Ctrl/RoleCtrl";
import GameData, { HeroID } from "../Other/GameData";
import { BtnInfo, BtnToolInfo } from "./ButtonToolMain";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ManorMain extends UIParent {

    @property(cc.Node)
    cityNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    ShowUI() {
        super.ShowUI();
        this.resetData()
    }

    resetData() {

    }

    onClickCity() {
        let btnToolInfo = new BtnToolInfo()
        btnToolInfo.pos = this.cityNode.convertToWorldSpaceAR(cc.Vec2.ZERO)
        let btnInfo: BtnInfo[] = []

        let info = new BtnInfo()
        info.btnName = "升级"
        info.fun = () => {
            this.uiManager.HideUIName("ButtonToolMain");
            let goldCount = RoleCtrl.getInstance().getItemCount(CoinType.GOLD)
            let buildingInfo = ManorCtrl.getInstance().getBuildingInfo(BuildingType.City)
            let upCount = ManorCtrl.getInstance().getBuitdingUpLevel(BuildingType.City)
            if (goldCount >= upCount) {
                buildingInfo.buildingLevel++
                goldCount -= upCount
                RoleCtrl.getInstance().setItemCount(CoinType.GOLD, goldCount)
                ManorCtrl.getInstance().setBuildingInfo(buildingInfo)
                GameData.createTipText("恭喜升级成功！")
            } else {
                GameData.createTipText("升级失败,你的金币不足" + upCount)
            }
        }
        btnInfo.push(info)

        let info1 = new BtnInfo()
        info1.btnName = "训练英雄"
        info1.fun = () => {
            this.uiManager.HideUIName("ButtonToolMain");
            let goldCount = RoleCtrl.getInstance().getItemCount(CoinType.GOLD)
            let heroLevel = RoleCtrl.getInstance().getSoldierLevel(HeroID)
            let upCount = heroLevel * 200
            if (goldCount >= upCount) {
                heroLevel++
                goldCount -= upCount
                RoleCtrl.getInstance().setItemCount(CoinType.GOLD, goldCount)
                RoleCtrl.getInstance().setRoleData(HeroID, heroLevel)
                GameData.createTipText("恭喜训练成功！")
            } else {
                GameData.createTipText("训练失败,你的金币不足" + upCount)
            }
        }
        btnInfo.push(info1)

        btnToolInfo.btnInfo = btnInfo
        this.uiManager.ShowUIName("ButtonToolMain", () => { }, btnToolInfo);
    }
}
