import { SkillType } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillCtrl {
    private static _instance: SkillCtrl = null;
    private _skillTypes: SkillType = SkillType.noSkill
    private _skillFun: Function = () => { }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new SkillCtrl();
            this._instance._init();
        }
        return this._instance;
    }

    private _init() {

    }

    clearData(){
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
}
