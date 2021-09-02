import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "../Ctrl/GameCtrl";
import { Camp } from "../Other/GameData";
import SoldiersParent from "../Other/SoldiersParent";
import SoundMgr from "../Other/SoundMgr";
import warItemBut from "../Other/warItemBut";
import UIParent from "./UIParent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends UIParent {

    @property(cc.Node)
    playerInsPos: cc.Node = null;
    @property(cc.Node)
    playerParent: cc.Node = null;
    @property(cc.Node)
    warButParent: cc.Node = null;
    @property(cc.Node)
    warButItem: cc.Node = null;
    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Node)
    downNode: cc.Node = null;

    start() {
    }
    ShowUI() {
        super.ShowUI();
        this.warButItem.active = false
        this.InitWarBut()
        let allY = this.topNode.y - this.downNode.y
        let itemY = allY / 16
        let allYList = []
        for (let index = 0; index < 15; index++) {
            allYList.push(this.topNode.y - (itemY * index))
        }
        GameCtrl.getInstance().setRoadYList(allYList)
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
        let soldierPre = GameCtrl.getInstance().getSoldierPre(idx)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        obj.active = true
        obj.parent = this.playerParent;
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(p2);
        let sold = obj.getComponent(SoldiersParent)
        sold.init(Camp.bule, idx);
        GameCtrl.getInstance().addPlayer(sold);
    }
    onClickClose() {
        this.HideUI()
    }
}
