import { BuildingInfo, BuildingType } from "../Config/ManorConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ManorCtrl {
    private static _instance: ManorCtrl = null;

    private _buildingInfoList: { [key: string]: BuildingInfo } = null
    // LIFE-CYCLE CALLBACKS:

    public static getInstance() {
        if (!this._instance) {
            this._instance = new ManorCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    private _init() {

    }

    setBuildingInfo(info: BuildingInfo) {
        this._saveLocalData(info.buildingName, info)
    }

    getBuildingInfo(type: BuildingType) {
        if (!this._buildingInfoList[type]) {
            let data: BuildingInfo = this._getLocalData(type)
            if (!data) {
                data = new BuildingInfo()
                data.buildingName = type
                data.buildingLevel = 1
            }
            this._buildingInfoList[type] = data
        }
        return this._buildingInfoList[type]
    }

    getBuitdingUpLevel(type: BuildingType) {
        let info = this.getBuildingInfo(type)
        return info.buildingLevel * 100
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
