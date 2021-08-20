import SoundMgr from "../Other/SoundMgr";
import UIManager from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIParent extends cc.Component {

    @property(cc.Node)
    uiAnimObj: cc.Node = null;
    uiManager: UIManager;
    firstOpenUI: boolean = true;
    //进度条加载完初始化
    InitUI(uiMain) {
        this.uiManager = uiMain;
    }
    //打开界面
    ShowUI(fun = () => { }) {
        if (this.uiAnimObj) {
            this.uiAnimObj.scale = 0;
            cc.tween(this.uiAnimObj)
                .to(0.25, { scale: 1.2 })
                .to(0.15, { scale: 0.9 })
                .to(0.1, { scale: 1 })
                .call(() => {
                    fun();
                })
                .start();
        }
        this.node.active = true;
        if (this.firstOpenUI) {
            this.firstOpenUI = false;
            this.FirstOpen();
        }
        this.UpdataFXData();
    }
    //隐藏界面
    HideUI(fun = () => { }) {
        if (this.uiAnimObj) {
            cc.tween(this.uiAnimObj)
                .to(0.1, { scale: 1.2 })
                .to(0.25, { scale: 0 })
                .call(() => {
                    this.node.active = false;
                    if (fun) {
                        fun();
                    }
                })
                .start();
        } else {
            this.node.active = false;
            if (fun) {
                fun();
            }
        }
        SoundMgr.getInstance().playFx("buttonClick");
    }
    //第一次打开界面
    FirstOpen() {

    }
    //FX成功调用一次
    FxSuccess() {

    }
    //打开界面更新返现数据
    UpdataFXData() {

    }
}
