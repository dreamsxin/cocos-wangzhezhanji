import { SoldierBasic } from "../Config/BarracksConfig";
import { SkillBasic } from "../Config/SkillConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";
import { HeroID, TowerID } from "../Other/GameData";
import SkillConfigListItem from "../Other/SkillConfigListItem";
import SkillConfigSeletItem from "../Other/SkillConfigSeletItem";
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
    @property(cc.Node)
    skillItem: cc.Node = null;
    @property(cc.ScrollView)
    swContainer: cc.ScrollView = null;
    @property(cc.Node)
    seleteSoldierItem: cc.Node = null;
    @property(cc.Node)
    seleteSkillItem: cc.Node = null;
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
    @property(cc.Toggle)
    tabTtitles: cc.Toggle[] = [];

    // LIFE-CYCLE CALLBACKS:
    private _allSoldierItem: WarConfigSoldierItem[] = []
    private _allListItem: WarConfigListItem[] = []
    private _allSkillSeleteItem: SkillConfigSeletItem[] = []
    private _allSkillItem: SkillConfigListItem[] = []

    // onLoad () {}
    ShowUI() {
        super.ShowUI();
        // this.InitBarracks()
        // this.InitSeleteItem()
        BarracksCtrl.getInstance().setWarConfigSelectID(-1)
        this.tabTtitles[0].isChecked = true
        this._selTitleBtn(0)
    }

    InitUI(uiMain) {
        super.InitUI(uiMain);
        this.soldierItem.active = false
    }

    private _selTitleBtn(index: number) {
        if (index == 0) {
            this.InitBarracks()
            this.InitSeleteItem()
        } else if (index == 1) {
            this.InitSkillList()
            this.InitSkillSeleteItem()
        }
    }

    onClickRadioButton(toggle) {
        let index = this.tabTtitles.indexOf(toggle);
        this._selTitleBtn(index)
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

    ShowSkillUI(skillID: number) {
        let skill: SkillBasic = SkillCtrl.getInstance().getSkillConfigItem(skillID);
        this.nameLabel.string = skill.skillName
        this.attackLabel.string = skill.Attack + "";
    }

    InitBarracks() {
        let data = BarracksCtrl.getInstance().getarracksConfig();
        let content = this.swContainer.content
        content.removeAllChildren();
        this._allSoldierItem = []
        for (let key in data) {
            let soldierData: SoldierBasic = data[key]
            if (soldierData.soldierID == TowerID) return
            if (soldierData.soldierID == HeroID) return

            let item = cc.instantiate(this.soldierItem)
            item.active = true
            content.addChild(item)

            let spr = item.getComponent(WarConfigSoldierItem)
            this._allSoldierItem.push(spr)
            spr.Init(soldierData, (soldierID) => {
                this.ShowBasicUI(soldierData.soldierID)
                if (BarracksCtrl.getInstance().checkIsInWarConfig()) {
                    spr.selectUI(true)
                    let warConfigIndex = BarracksCtrl.getInstance().getWarConfigSelectID()
                    let indexOF = BarracksCtrl.getInstance().checkIsHaveConfigList(soldierID)
                    let soldierIDNow = this._allListItem[warConfigIndex].getSoldierID()
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
        this._allSoldierItem[0].onClickSele()
    }

    InitSeleteItem() {
        let data = BarracksCtrl.getInstance().getWarConfigList();
        let content = this.seleteSwContainer.content
        content.removeAllChildren();
        this._allListItem = []
        for (let index = 0; index < data.conList.length; index++) {
            let item = cc.instantiate(this.seleteSoldierItem)
            item.active = true
            content.addChild(item)

            let spr = item.getComponent(WarConfigListItem)
            this._allListItem.push(spr)
            spr.Init(data.conList[index], (itemIndex, soldierID) => {
                let isSelect = false
                for (let index = 0; index < this._allListItem.length; index++) {
                    const element = this._allListItem[index];
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
        for (let index = 0; index < this._allSoldierItem.length; index++) {
            this._allSoldierItem[index].isShowSelectUI(soldierID, isShow)
        }
    }

    setWarConfigItem(itemIndex: number, soldierID: number) {
        this._allListItem[itemIndex].resetUI(soldierID)
    }

    hideAllWarConfigSelectUI() {
        for (let index = 0; index < this._allListItem.length; index++) {
            this._allListItem[index].selectUI(-1)
        }
    }
    // setWarConfigSelect(soldierID: number, isShow: boolean) {
    //     for (let index = 0; index < this.allListItem.length; index++) {
    //         this.allListItem[index].isShowSelectUI(soldierID, isShow)
    //     }
    // }
    ////////////////<<<<<<<<<<<<<     上面是小兵    下面是技能
    // update (dt) {}
    InitSkillList() {
        let data = SkillCtrl.getInstance().getSkillConfig();
        let content = this.swContainer.content
        content.removeAllChildren();
        this._allSkillSeleteItem = []
        for (let key in data) {
            let skillData: SkillBasic = data[key]

            let item = cc.instantiate(this.skillItem)
            item.active = true
            content.addChild(item)

            let spr = item.getComponent(SkillConfigSeletItem)
            this._allSkillSeleteItem.push(spr)
            spr.Init(skillData, (skillID) => {
                this.ShowBasicUI(skillData.skillID)
                if (SkillCtrl.getInstance().checkIsInSkillConfig()) {
                    spr.selectUI(true)
                    let skillConfigIndex = SkillCtrl.getInstance().getSkillConfigSelectID()
                    let indexOF = SkillCtrl.getInstance().checkIsHaveConfigList(skillID)
                    let skillIDNow = this._allSkillItem[skillConfigIndex].getSoldierID()
                    cc.log(skillID, skillConfigIndex, skillIDNow)
                    if (indexOF >= 0) {
                        //交换
                        SkillCtrl.getInstance().setSkillConfigList(skillID, skillConfigIndex)
                        SkillCtrl.getInstance().setSkillConfigList(skillIDNow, indexOF)
                        this.setSkillConfigItem(skillConfigIndex, skillID)
                        this.setSkillConfigItem(indexOF, skillIDNow)
                    } else {
                        SkillCtrl.getInstance().setSkillConfigList(skillID, skillConfigIndex)
                        this.setSkillConfigItem(skillConfigIndex, skillID)
                        if (skillIDNow > 0) {
                            this.setSkillSelect(skillIDNow, false)
                        }
                    }
                }
            })
        }
        this._allSkillSeleteItem[0].onClickSele()
    }

    InitSkillSeleteItem() {
        let data = SkillCtrl.getInstance().getSkillConfigList();
        let content = this.seleteSwContainer.content
        content.removeAllChildren();
        this._allSkillItem = []
        for (let index = 0; index < data.conList.length; index++) {
            let item = cc.instantiate(this.seleteSkillItem)
            item.active = true
            content.addChild(item)

            let spr = item.getComponent(SkillConfigListItem)
            this._allSkillItem.push(spr)
            spr.Init(data.conList[index], (itemIndex, skillID) => {
                let isSelect = false
                for (let index = 0; index < this._allSkillItem.length; index++) {
                    const element = this._allSkillItem[index];
                    if (element.selectUI(itemIndex)) {
                        isSelect = true
                    }
                }
                if (isSelect) {
                    SkillCtrl.getInstance().setSkillConfigSelectID(itemIndex)
                } else {
                    SkillCtrl.getInstance().setSkillConfigSelectID(-1)
                }
                if (skillID > 0) {
                    this.setSkillSelect(skillID, false)
                    SkillCtrl.getInstance().setSkillConfigSelectID(-1)
                }
            }, index)
        }
    }

    setSkillSelect(skillID: number, isShow: boolean) {
        for (let index = 0; index < this._allSkillSeleteItem.length; index++) {
            this._allSkillSeleteItem[index].isShowSelectUI(skillID, isShow)
        }
    }

    setSkillConfigItem(itemIndex: number, skillID: number) {
        this._allSkillItem[itemIndex].resetUI(skillID)
    }

    hideAllSkillConfigSelectUI() {
        for (let index = 0; index < this._allSkillItem.length; index++) {
            this._allSkillItem[index].selectUI(-1)
        }
    }
}
