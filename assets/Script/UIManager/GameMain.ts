import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "../Other/GameCtrl";
import { camp } from "../Other/GameData";
import gonbing from "../Other/gonbing";
import SoldiersParent from "../Other/SoldiersParent";
import SoundMgr from "../Other/SoundMgr";
import UIParent from "./UIParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends UIParent {

    @property(cc.Prefab)
    xiaoBingObj: cc.Prefab = null;
    @property(cc.Node)
    oneXiaobingBut: cc.Node = null;
    @property(cc.Node)
    playerInsPos: cc.Node = null;
    @property(cc.Node)
    playerParent: cc.Node = null;

    playerList: gonbing[] = [];
    emenyList: gonbing[] = [];
    start() {
        this.AddButtonClick();
        cc.log("ttttttt", BarracksCtrl.getInstance().getBarracksConfig(1))
    }
    AddButtonClick() {
        this.oneXiaobingBut.on('click', (event) => {
            this.CreateArms(0);
            SoundMgr.getInstance().playFx("buttonClick");
        }, this)
    }
    CreateArms(idx) {
        let obj = cc.instantiate(this.xiaoBingObj);
        obj.parent = this.playerParent;
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(p2);
        let sold = obj.getComponent(SoldiersParent)
        sold.init(camp.bule);
        GameCtrl.getInstance().addPlayer(sold);
    }
}
