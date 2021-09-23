import { SoldierBasic } from "../Config/BarracksConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import { HeroID, TowerID } from "../Other/GameData";
import WarConfigListItem from "../Other/WarConfigListItem";
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
    @property(cc.Node)
    seleteSoldierItem: cc.Node = null;
    @property(cc.ScrollView)
    seleteSwContainer: cc.ScrollView = null;

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
    private allSoldierItem: WarConfigSoldierItem[] = []
    private allListItem: WarConfigListItem[] = []

    // onLoad () {}
    ShowUI() {
        super.ShowUI();
        this.InitBarracks()
        this.InitSeleteItem()
        BarracksCtrl.getInstance().setWarConfigSelectID(-1)
    }

    InitUI(uiMain) {
        super.InitUI(uiMain);
        this.soldierItem.active = false
    }

    onClickClose() {
        this.HideUI(() => { })
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
        this.allSoldierItem = []
        for (let key in data) {
            let soldierData: SoldierBasic = data[key]
            if (soldierData.soldierID == TowerID) return
            if (soldierData.soldierID == HeroID) return

            let item = cc.instantiate(this.soldierItem)
            item.active = true
            content.addChild(item)

            let spr = item.getComponent(WarConfigSoldierItem)
            this.allSoldierItem.push(spr)
            spr.Init(soldierData, (soldierID) => {
                this.ShowBasicUI(soldierData.soldierID)
                if (BarracksCtrl.getInstance().checkIsInWarConfig()) {
                    spr.selectUI(true)
                    let warConfigIndex = BarracksCtrl.getInstance().getWarConfigSelectID()
                    let indexOF = BarracksCtrl.getInstance().checkIsHaveConfigList(soldierID)
                    let soldierIDNow = this.allListItem[warConfigIndex].getSoldierID()
                    cc.log(soldierID, warConfigIndex, soldierIDNow)
                    if (indexOF >= 0) {
                        //交换
                        BarracksCtrl.getInstance().setWarConfigList(soldierID, warConfigIndex)
                        BarracksCtrl.getInstance().setWarConfigList(soldierIDNow, indexOF)
                        this.setWarConfigItem(warConfigIndex, soldierID)
                        this.setWarConfigItem(indexOF, soldierIDNow)
                    } else {
                        BarracksCtrl.getInstance().setWarConfigList(soldierID, warConfigIndex)
                        this.setWarConfigItem(warConfigIndex, soldierID)
                        if (soldierIDNow > 0) {
                            this.setBarracksSelect(soldierIDNow, false)
                        }
                    }
                }
            })
        }
        this.allSoldierItem[0].onClickSele()
    }

    InitSeleteItem() {
        let data = BarracksCtrl.getInstance().getWarConfigList();
        let content = this.seleteSwContainer.content
        content.removeAllChildren();
        this.allListItem = []
        for (let index = 0; index < data.conList.length; index++) {
            let item = cc.instantiate(this.seleteSoldierItem)
            item.active = true
            content.addChild(item)

            let spr = item.getComponent(WarConfigListItem)
            this.allListItem.push(spr)
            spr.Init(data.conList[index], (itemIndex, soldierID) => {
                let isSelect = false
                for (let index = 0; index < this.allListItem.length; index++) {
                    const element = this.allListItem[index];
                    if (element.selectUI(itemIndex)) {
                        isSelect = true
                    }
                }
                if (isSelect) {
                    BarracksCtrl.getInstance().setWarConfigSelectID(itemIndex)
                } else {
                    BarracksCtrl.getInstance().setWarConfigSelectID(-1)
                }
                if (soldierID > 0) {
                    this.setBarracksSelect(soldierID, false)
                    BarracksCtrl.getInstance().setWarConfigSelectID(-1)
                }
            }, index)
        }
    }

    setBarracksSelect(soldierID: number, isShow: boolean) {
        for (let index = 0; index < this.allSoldierItem.length; index++) {
            this.allSoldierItem[index].isShowSelectUI(soldierID, isShow)
        }
    }

    setWarConfigItem(itemIndex: number, soldierID: number) {
        this.allListItem[itemIndex].resetUI(soldierID)
    }

    hideAllWarConfigSelectUI() {
        for (let index = 0; index < this.allListItem.length; index++) {
            this.allListItem[index].selectUI(-1)
        }
    }
    // setWarConfigSelect(soldierID: number, isShow: boolean) {
    //     for (let index = 0; index < this.allListItem.length; index++) {
    //         this.allListItem[index].isShowSelectUI(soldierID, isShow)
    //     }
    // }
    // update (dt) {}
}
