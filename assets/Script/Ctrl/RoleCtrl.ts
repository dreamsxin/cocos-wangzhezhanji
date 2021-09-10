
const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleCtrl {
    private static _instance: RoleCtrl = null;
    private _roleData: RoleData = null

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

    getSoldierLevel(soldierID: number) {
        let data = this._roleData.soldierData
        return data[soldierID] ? data[soldierID] : 1
    }
}
export class RoleData {
    constructor() {
        this.soldierData = {}
    }
    public soldierData: { [soldierID: number]: number } = {};
}
