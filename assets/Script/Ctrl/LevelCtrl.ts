

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelCtrl {
    private static _instance: LevelCtrl = null;
    private _levelConfig: any = null;
    private _nowLevelData: any = 0
    private _levelNameList: string[] = []
    private _levelDataList: any[][] = [];
    private _bigLevelIndex: number = 0;
    private _levelIndex: number = 0

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
        this._levelDataList = []
        this._levelNameList = []
        let bigLevelIndex = 0
        for (const key in data) {
            this._levelNameList.push(key)
            let levelDataList = data[key]
            let list = []
            for (let level in levelDataList) {
                list.push(levelDataList[level])
            }
            this._levelDataList[bigLevelIndex] = list
            bigLevelIndex++
        }
    }

    getLevelConfigItem(bigLevelIndex: number): any {
        return this._levelDataList[bigLevelIndex];
    }

    getNowLevelData(): any {
        return this._nowLevelData;
    }

    getAllLevel() {
        return this._levelDataList
    }

    getAllLevelName(){
        return this._levelNameList
    }

    setNowLevelData(data: any) {
        this._nowLevelData = data
    }

    setBigLevelIndex(index: number) {
        this._bigLevelIndex = index
    }

    setLevelIndex(index: number) {
        this._levelIndex = index
    }
}
