
import { SoldierAttribute } from "../Config/BarracksConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BarracksCtrl {
    private static _instance: BarracksCtrl = null;

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
            let soldier = new SoldierAttribute()
            soldier.Attack = 100
            soldier.HP = 100
            soldier.Phylactic = 20
            soldier.moveSpeed = 10
            this._SetSoldierAttribute(soldierID, soldier)
        }
    }

    private _SetSoldierAttribute(soldierID: number, data: SoldierAttribute) {
        this._saveLocalData("Attribute" + soldierID, data)
    }

    GetSoldierAttribute(soldierID: number): SoldierAttribute {
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
}
