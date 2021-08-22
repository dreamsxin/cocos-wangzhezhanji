import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "../Other/GameCtrl";
import { camp } from "../Other/GameData";
import gonbing from "../Other/gonbing";
import SoldiersParent from "../Other/SoldiersParent";
import SoundMgr from "../Other/SoundMgr";
import warItemBut from "../Other/warItemBut";
import UIParent from "./UIParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends UIParent {

    @property(cc.Prefab)
    xiaoBingObj: cc.Prefab = null;
    @property(cc.Node)
    playerInsPos: cc.Node = null;
    @property(cc.Node)
    playerParent: cc.Node = null;
    @property(cc.Node)
    warButParent: cc.Node = null;
    @property(cc.Node)
    warButItem: cc.Node = null;

    playerList: gonbing[] = [];
    emenyList: gonbing[] = [];
    start() {
    }
    ShowUI() {
        super.ShowUI();
        this.warButItem.active = false
        this.InitWarBut()
    }
    InitWarBut() {
        this.warButParent.removeAllChildren()
        let data = BarracksCtrl.getInstance().getWarConfigList();
        for (let index = 0; index < data.conList.length; index++) {
            let item = cc.instantiate(this.warButItem)
            item.active = true
            this.warButParent.addChild(item)
            let spr = item.getComponent(warItemBut)
            spr.Init(data.conList[index], (a) => {
                if (a > 0) {
                    this.CreateArms(a)
                    SoundMgr.getInstance().playFx("buttonClick");
                }
            })
        }
    }
    CreateArms(idx) {
        let obj = cc.instantiate(this.xiaoBingObj);
        obj.parent = this.playerParent;
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(p2);
        let sold = obj.getComponent(SoldiersParent)
        sold.init(camp.bule, idx);
        GameCtrl.getInstance().addPlayer(sold);
    }
}
