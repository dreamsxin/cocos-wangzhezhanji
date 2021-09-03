

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelCtrl {
    private static _instance: LevelCtrl = null;
    private _levelConfig: any = null;
    private _nowLevel: number = 0

    public static getInstance() {
        if (!this._instance) {
            this._instance = new LevelCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    private _init() {

    }

    setLevelConfig(data) {
        this._levelConfig = data;
    }

    getLevelConfigItem(level: number): any {
        return this._levelConfig[level];
    }

    getNowLevelData(): any {
        return this._levelConfig[this._nowLevel];
    }

    getAllLevel() {
        return this._levelConfig
    }
}
