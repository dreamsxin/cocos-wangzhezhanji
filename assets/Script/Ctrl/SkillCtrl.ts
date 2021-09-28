
const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillCtrl {
    private static _instance: SkillCtrl = null;

    public static getInstance() {
        if (!this._instance) {
            this._instance = new SkillCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    private _init() {

    }
}
