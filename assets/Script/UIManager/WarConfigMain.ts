import { SoldierBasic } from "../Config/BarracksConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import WarConfigSoldierItem from "../Other/WarConfigSoldierItem";
import UIParent from "./UIParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarConfigMain extends UIParent {

    @property(cc.Sprite)
    headSpr: cc.Sprite = null;
    @property(cc.Node)
    soldierItem: cc.Node = null;
    @property(cc.ScrollView)
    swContainer: cc.ScrollView = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    hpLabel: cc.Label = null;
    @property(cc.Label)
    attackLabel: cc.Label = null;
    @property(cc.Label)
    phylacticLabel: cc.Label = null;
    @property(cc.Label)
    critLabel: cc.Label = null;
    @property(cc.Label)
    desLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    private allItem: WarConfigSoldierItem[] = []

    // onLoad () {}
    ShowUI() {
        super.ShowUI();
        this.InitBarracks()
    }

    InitUI(uiMain) {
        super.InitUI(uiMain);
        this.soldierItem.active = false
    }

    ShowBasicUI(soldierID: number) {
        let soldier: SoldierBasic = BarracksCtrl.getInstance().getBarracksConfigItem(soldierID);
        this.nameLabel.string = soldier.soldierName
        this.hpLabel.string = soldier.HP + "";
        this.attackLabel.string = soldier.Attack + "";
        this.phylacticLabel.string = soldier.Phylactic + "";
        this.critLabel.string = soldier.crit + "";
        this.desLabel.string = soldier.soldierDes;
    }

    InitBarracks() {
        let data = BarracksCtrl.getInstance().getarracksConfig();
        let content = this.swContainer.content
        content.removeAllChildren();
        this.allItem = []
        for (let key in data) {
            let soldierData: SoldierBasic = data[key]

            let item = cc.instantiate(this.soldierItem)
            item.active = true
            content.addChild(item)

            let spr = item.getComponent(WarConfigSoldierItem)
            this.allItem.push(spr)
            spr.Init(soldierData, () => {
                this.ShowBasicUI(soldierData.soldierID)
            })
        }
        this.allItem[0].onClickSele()
    }
    // update (dt) {}
}
