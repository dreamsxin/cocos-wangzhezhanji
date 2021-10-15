
const { ccclass, property } = cc._decorator;

@ccclass
export default class ManorCtrl {
    private static _instance: ManorCtrl = null;

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
}
