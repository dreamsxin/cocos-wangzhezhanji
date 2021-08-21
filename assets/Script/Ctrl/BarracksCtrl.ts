
import { SoldierAttribute, SoldierBasic, WarConFigList } from "../Config/BarracksConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BarracksCtrl {
    private static _instance: BarracksCtrl = null;
    private _barracksConfig: any = null;
    private _warConfigSelectID: number = -1;
    //--------

    public static getInstance() {
        if (!this._instance) {
            this._instance = new BarracksCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    public static destroyInstance() {
        if (this._instance) {
            this._instance._destroy();
            delete this._instance;
            this._instance = null;
        }
    }

    private _init() { }

    private _destroy() { }

    //解锁新角色
    unlockNewSoldier(soldierID: number) {
        let data = this.GetSoldierAttribute(soldierID)
        if (!data) {
            let soldier = this.getBarracksConfigItem(soldierID)
            this._SetSoldierAttribute(soldierID, soldier)
        }
    }

    private _SetSoldierAttribute(soldierID: number, data: SoldierBasic) {
        this._saveLocalData("Attribute" + soldierID, data)
    }

    GetSoldierAttribute(soldierID: number): SoldierBasic {
        return this._getLocalData("Attribute" + soldierID)
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

    setBarracksConfig(data: any) {
        this._barracksConfig = data;
    }

    getBarracksConfigItem(id: number) {
        return this._barracksConfig[id];
    }

    getarracksConfig() {
        return this._barracksConfig
    }

    setWarConfigList(soldierID: number, warConfigIndex: number) {
        let data = this.getWarConfigList();
        data.conList[warConfigIndex] = soldierID;
        this._saveLocalData("WarConfigList", data)
    }

    getWarConfigList(): WarConFigList {
        let data = this._getLocalData("WarConfigList")
        if (!data) {
            data = new WarConFigList()
            data.conList = [0, 0, 0, 0, 0, 0]
        }
        return data
    }

    setWarConfigSelectID(id: number) {
        this._warConfigSelectID = id
    }

    getWarConfigSelectID() {
        return this._warConfigSelectID
    }

    checkIsInWarConfig() {
        return this._warConfigSelectID >= 0
    }

    checkIsHaveConfigList(soldierID: number) {
        let list = this.getWarConfigList()
        return list.conList.indexOf(soldierID)
    }
}
