
const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleCtrl {
    private static _instance: RoleCtrl = null;
    private _roleData: RoleData = null
    private _coinInfo: { [key: number]: number } = []

    public static getInstance() {
        if (!this._instance) {
            this._instance = new RoleCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    private _init() {

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

    setRoleData(soldierID: number, level: number) {
        let data = this.getRoleData()
        data[soldierID] = level
        this._saveLocalData("RoleData", data)
    }

    getRoleData() {
        if (!this._roleData) {
            let data = this._getLocalData("RoleData")
            this._roleData = data ? data : new RoleData()
        }
        return this._roleData
    }

    getSoldierLevel(soldierID: number) {
        let data = this.getRoleData()
        if (!data[soldierID]) {
            data[soldierID] = 1
        }
        return data[soldierID]
    }

    setItemCount(itemType: number, count: number) {
        this._saveLocalData("Item" + itemType, count)
    }

    getItemCount(itemType: number) {
        if (!this._coinInfo[itemType]) {
            let data = this._getLocalData("Item" + itemType)
            this._coinInfo[itemType] = data ? data : 0
        }
        return this._coinInfo[itemType]
    }
}

export class RoleData {
    constructor() {
        this.soldierData = {}
    }
    public soldierData: { [soldierID: number]: number } = {};
}

export enum CoinType {
    NULL = 0,        //无
    GOLD = 1,        //金币
}
