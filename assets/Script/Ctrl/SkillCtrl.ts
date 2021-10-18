import { SkillBasic, SkillConFigList } from "../Config/SkillConfig";
import { SkillType } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillCtrl {
    private static _instance: SkillCtrl = null;
    private _skillConfig: any = null;
    private _skillSelectID: number = -1;
    private _skillTypes: SkillType = SkillType.noSkill
    private _skillFun: Function = () => { }
    private _skillInfo: { [key: number]: number } = []

    public static getInstance() {
        if (!this._instance) {
            this._instance = new SkillCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    private _init() {

    }

    clearData() {
        this.cancelSkill()
    }

    getIsOpenSkill() {
        return this._skillTypes != SkillType.noSkill
    }

    openSkill(skill: SkillType, fun: Function = () => { }) {
        this._skillTypes = skill
        this._skillFun = fun
    }

    cancelSkill() {
        this._skillTypes = SkillType.noSkill
    }

    useSkill(soldier: SoldiersParent) {
        if (this._skillFun) {
            this._skillFun(soldier)
        }
        this.cancelSkill()
    }

    setSkillConfig(data: any) {
        this._skillConfig = data;
    }

    getSkillConfigItem(id: number): SkillBasic {
        return this._skillConfig[id];
    }

    getSkillConfig() {
        return this._skillConfig
    }

    setSkillConfigList(skillID: number, skillConfigIndex: number) {
        let data = this.getSkillConfigList();
        data.conList[skillConfigIndex] = skillID;
        this._saveLocalData("SkillConfigList", data)
    }

    getSkillConfigList(): SkillConFigList {
        let data = this._getLocalData("SkillConfigList")
        if (!data) {
            data = new SkillConFigList()
            data.conList = [0, 0]
        }
        return data
    }

    setSkillConfigSelectID(id: number) {
        this._skillSelectID = id
    }

    getSkillConfigSelectID() {
        return this._skillSelectID
    }

    setSkillLevel(skillID: number, level: number) {
        this._skillInfo[skillID] = level
        this._saveLocalData("SkillLevel" + skillID, level)
    }

    getSkillLevel(skillID: number) {
        if (!this._skillInfo[skillID]) {
            let data = this._getLocalData("SkillLevel" + skillID)
            this._skillInfo[skillID] = data ? data : 1
        }
        return this._skillInfo[skillID]
    }

    checkIsInSkillConfig() {
        return this._skillSelectID >= 0
    }

    checkIsHaveConfigList(soldierID: number) {
        let list = this.getSkillConfigList()
        return list.conList.indexOf(soldierID)
    }

    private _saveLocalData(path: string, data: any) {
        let localData = JSON.stringify(data);
        cc.sys.localStorage.setItem(path, localData);
    }

    private _getLocalData(path: string): any {
        let localData = cc.sys.localStorage.getItem(path);
        if (localData) {
            let nowData = JSON.parse(localData);
            return nowData
        }
        return null
    }
}
