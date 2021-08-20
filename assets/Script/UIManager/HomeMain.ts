import GameData from "../Other/GameData";
import SoundMgr from "../Other/SoundMgr";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeMain extends UIParent {


    @property(cc.Node)
    ronyutai: cc.Node = null;
    @property(cc.Node)
    jinjidating: cc.Node = null;
    @property(cc.Node)
    tanshuo: cc.Node = null;
    @property(cc.Node)
    zhuanyuan: cc.Node = null;
    @property(cc.Node)
    jiazu: cc.Node = null;

    start() {
        this.AddButtonClick();
    }
    ShowUI() {
        super.ShowUI();
        this.UpdataFXData();
    }
    InitUI(uiMain) {
        super.InitUI(uiMain);
    }

    AddButtonClick() {
        this.ronyutai.on('click', this.noClick, this)
        this.jinjidating.on('click', (event) => {
            this.uiManager.ShowUIName("GameMain");
            this.HideUI();
            SoundMgr.getInstance().playFx("buttonClick");
        }, this)
        this.tanshuo.on('click', this.noClick, this)
        this.zhuanyuan.on('click', this.noClick, this)
        this.jiazu.on('click', this.noClick, this)
    }
    noClick() {
        GameData.createTipText("该功能还未开发，尽请期待！");
        SoundMgr.getInstance().playFx("buttonClick");
    }

    onClickWarConfig() {
        this.uiManager.ShowUIName("WarConfigMain");
        SoundMgr.getInstance().playFx("buttonClick");
    }
    // update (dt) {}
}