import { GameEvent } from "../Config/GameEventConfig";
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "../Ctrl/GameCtrl";
import EnemyAI from "../Other/EnemyAI";
import { Camp, GameState, HeroID, TowerID } from "../Other/GameData";
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
    playerCollectPos: cc.Node = null;
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
    @property(cc.Node)
    goOutBut: cc.Node = null;
    @property(cc.Node)
    returnBut: cc.Node = null;
    @property(EnemyAI)
    enemyAI: EnemyAI = null;
    @property({ type: cc.ProgressBar, tooltip: "血条进度条💩" })
    hpPro: cc.ProgressBar = null;

    private _heroSelf: SoldiersParent = null
    private _collectSoldierTime: number = 0

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
        this.InitLevelMinMax()
        this.startGame()
    }

    resetData() {
        GameCtrl.getInstance().clearData()
        this.playerParent.removeAllChildren()
        this.hpPro.progress = 1;
        this.enemyAI.clearData()
    }

    startGame() {
        this.resetData()
        this.enemyAI.initLevel()
        this.CreateTower()
        this.CreateHero()
        GameCtrl.getInstance().setGameState(GameState.playering)
    }

    InitLevelMinMax() {
        let leftNode = this.playerInsPos
        let rightNode = this.enemyAI.playerInsPos
        let p1 = leftNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        let p3 = rightNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let p4 = this.playerParent.convertToNodeSpaceAR(p3)
        GameCtrl.getInstance().setPathMinMax(p2, p4)
    }

    InitCollectMinMax() {
        let leftNode = this.playerCollectPos
        let rightNode = this.enemyAI.playerCollectPos
        let p1 = leftNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        let p3 = rightNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let p4 = this.playerParent.convertToNodeSpaceAR(p3)
        GameCtrl.getInstance().setCollectMinMax(p2, p4)
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
        if (GameCtrl.getInstance().getPlayerNum() >= 15) return
        let soldierPre = GameCtrl.getInstance().getSoldierPre(idx)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        obj.active = true
        obj.parent = this.playerParent;
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(p2);
        let sold = obj.getComponent(SoldiersParent)
        sold.init(Camp.bule, idx, 7);
        GameCtrl.getInstance().addPlayer(sold);
    }

    CreateTower() {
        let soldierPre = GameCtrl.getInstance().getSoldierPre(TowerID)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        obj.active = true
        obj.parent = this.playerParent;
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(cc.v2(p2.x - 100, p2.y));
        let sold = obj.getComponent(SoldiersParent)
        sold.initHpPro(this.hpPro)
        sold.init(Camp.bule, TowerID, 7, false);
        GameCtrl.getInstance().addPlayer(sold);
    }

    CreateHero() {
        let soldierPre = GameCtrl.getInstance().getSoldierPre(HeroID)
        if (!soldierPre) return
        let obj = cc.instantiate(soldierPre);
        obj.active = true
        obj.parent = this.playerParent;
        let p1 = this.playerInsPos.convertToWorldSpaceAR(cc.v2(0, 0))
        let p2 = this.playerParent.convertToNodeSpaceAR(p1)
        obj.setPosition(cc.v2(p2.x, p2.y));
        this._heroSelf = obj.getComponent(SoldiersParent)
        this._heroSelf.initHpPro(this.hpPro)
        this._heroSelf.init(Camp.bule, HeroID, 12, false);
        GameCtrl.getInstance().addPlayer(this._heroSelf);
    }

    onClickGoOut() {
        this._heroSelf.setGoOut()
    }

    onClickReturn() {
        this._heroSelf.setReturn()
    }

    onClickCollect() {
        GameCtrl.getInstance().setCollectSoldier(true)
        this._collectSoldierTime = 30;
        this.unschedule(this.collectSoldierDownTime)
        this.schedule(this.collectSoldierDownTime, 1)
    }

    onClickClose() {
        this.uiManager.ShowUIName("HomeMain");
        this.HideUI()
        this.resetData()
    }

    collectSoldierDownTime() {
        this._collectSoldierTime--
        if (this._collectSoldierTime <= 0) {
            GameCtrl.getInstance().setCollectSoldier(false)
        }
    }

    onDispathcGameEvent(eventId: GameEvent, eventData: any) {
        switch (eventId) {
            case GameEvent.GameOver:
                {
                    this.uiManager.ShowUIName("GameOverMain", () => { }, eventData);
                    GameCtrl.getInstance().setGameState(GameState.gameOver)
                    this.resetData()
                }
                break
            case GameEvent.CloseGameMain:
                this.onClickClose()
                break
            case GameEvent.AgainGameMain:
                this.startGame()
                break
            case GameEvent.NextGameMain:
                this.startGame()
                break
            default:
                super.onDispathcGameEvent(eventId, eventData);
                break;
        }

    }
}
