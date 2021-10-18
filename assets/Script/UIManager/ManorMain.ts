// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuildingType } from "../Config/ManorConfig";
import ManorCtrl from "../Ctrl/ManorCtrl";
import RoleCtrl, { CoinType } from "../Ctrl/RoleCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";
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
        btnInfo.push(this.getUPBtnInfo(BuildingType.City))

        let info1 = new BtnInfo()
        info1.btnName = "训练英雄"
        info1.fun = () => {
            this.uiManager.HideUIName("ButtonToolMain");
            this.upgradeSoldier(HeroID)
        }
        btnInfo.push(info1)

        btnToolInfo.btnInfo = btnInfo
        this.uiManager.ShowUIName("ButtonToolMain", () => { }, btnToolInfo);
    }

    onClickBarracks() {
        let btnToolInfo = new BtnToolInfo()
        btnToolInfo.pos = this.cityNode.convertToWorldSpaceAR(cc.Vec2.ZERO)
        let btnInfo: BtnInfo[] = []
        btnInfo.push(this.getUPBtnInfo(BuildingType.Barracks))

        let info1 = new BtnInfo()
        info1.btnName = "训练兵种"
        info1.fun = () => {
            this.uiManager.HideUIName("ButtonToolMain");
            this.upgradeSoldier(1)
        }
        btnInfo.push(info1)

        btnToolInfo.btnInfo = btnInfo
        this.uiManager.ShowUIName("ButtonToolMain", () => { }, btnToolInfo);
    }

    onClickTrainingCamp() {
        let btnToolInfo = new BtnToolInfo()
        btnToolInfo.pos = this.cityNode.convertToWorldSpaceAR(cc.Vec2.ZERO)
        let btnInfo: BtnInfo[] = []
        btnInfo.push(this.getUPBtnInfo(BuildingType.TrainingCamp))

        let info1 = new BtnInfo()
        info1.btnName = "训练技能"
        info1.fun = () => {
            this.uiManager.HideUIName("ButtonToolMain");
            this.upgradeSkill(1)
        }
        btnInfo.push(info1)

        btnToolInfo.btnInfo = btnInfo
        this.uiManager.ShowUIName("ButtonToolMain", () => { }, btnToolInfo);
    }

    getUPBtnInfo(build: BuildingType): BtnInfo {
        let info = new BtnInfo()
        info.btnName = "升级"
        info.fun = () => {
            this.uiManager.HideUIName("ButtonToolMain");
            this.upgradeBuilding(build)
        }
        return info
    }

    upgradeBuilding(buildingType: BuildingType) {
        let goldCount = RoleCtrl.getInstance().getItemCount(CoinType.GOLD)
        let buildingInfo = ManorCtrl.getInstance().getBuildingInfo(buildingType)
        let upCount = ManorCtrl.getInstance().getBuitdingUpLevel(buildingType)
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

    upgradeSoldier(soldierID: number) {
        let goldCount = RoleCtrl.getInstance().getItemCount(CoinType.GOLD)
        let soldierLevel = RoleCtrl.getInstance().getSoldierLevel(soldierID)
        let upCount = soldierLevel * 200
        if (goldCount >= upCount) {
            soldierLevel++
            goldCount -= upCount
            RoleCtrl.getInstance().setItemCount(CoinType.GOLD, goldCount)
            RoleCtrl.getInstance().setRoleData(soldierID, soldierLevel)
            GameData.createTipText("恭喜升级成功！")
        } else {
            GameData.createTipText("升级失败,你的金币不足" + upCount)
        }
    }

    upgradeSkill(skillID: number) {
        let goldCount = RoleCtrl.getInstance().getItemCount(CoinType.GOLD)
        let skillLevel = SkillCtrl.getInstance().getSkillLevel(skillID)
        let upCount = skillLevel * 200
        if (goldCount >= upCount) {
            skillLevel++
            goldCount -= upCount
            RoleCtrl.getInstance().setItemCount(CoinType.GOLD, goldCount)
            SkillCtrl.getInstance().setSkillLevel(skillID, skillLevel)
            GameData.createTipText("恭喜升级成功！")
        } else {
            GameData.createTipText("升级失败,你的金币不足" + upCount)
        }
    }
}
