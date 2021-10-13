
import BarracksCtrl from "../Ctrl/BarracksCtrl";
import GameCtrl from "../Ctrl/GameCtrl";
import LevelCtrl from "../Ctrl/LevelCtrl";
import SkillCtrl from "../Ctrl/SkillCtrl";
import GameData, { HeroID, LocalData, TowerID } from "../Other/GameData";
import SoundMgr from "../Other/SoundMgr";
import UIParent from "./UIParent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
    @property(cc.ProgressBar)
    loadBar: cc.ProgressBar = null;
    @property(cc.Prefab)
    tipText: cc.Prefab = null;
    @property(cc.Node)
    panelParent: cc.Node = null;
    @property(cc.Node)
    tipParent: cc.Node = null;

    allUIPanel: UIParent[] = [];
    UIPlaneDictionary: { [key: string]: UIParent; } = {};
    isload: boolean = false
    isShow: boolean = false;
    public static share: UIManager;
    onLoad() {
        //cc.sys.localStorage.removeItem("LocalData")
        UIManager.share = this;
        let view = cc.view.getFrameSize()
        if (view.height / view.width < 1.7) {
            GameData.sizeType = view.height / (view.width * 1.7);
        }

        this.LoadUIPanel();

        GameData.tipObj = this.tipText;
        GameData.tipObj_parent = this.node;
    }
    start() {

        let localData = cc.sys.localStorage.getItem("LocalData");
        if (localData == null) {
            let newData: LocalData = new LocalData();
            GameData.localData = newData;
        } else {
            let nowData: LocalData = JSON.parse(localData);
            GameData.localData = nowData;
        }
        GameData.SaveData();
        this.loadSounds();
        this.LoadSoldierConfig();
        this.LoadLevelConfig()
        this.LoadSkillConfig()
        this.LoadAllSoldier();
        this.startPor();
    }
    LoadUIPanel() {
        let uiPath = [];
        let uiPanel = [
            "GameMain",
            "HomeMain",
            "WarConfigMain",
            "LevelMain",
            "GameOverMain",
            "ManorMain",
            "ButtonToolMain"
        ];
        for (let i = 0; i < uiPanel.length; i++) {
            uiPath[i] = "UIPanel/" + uiPanel[i];
        }
        cc.loader.loadResArray(uiPath, cc.Prefab, (completedCount: number, totalCount: number, item: any) => {
            //console.log(completedCount, totalCount, item);
        }, (msg: Error, res: any[]) => {
            //console.log(msg, res);
            for (let i = 0; i < res.length; i++) {
                let obj = cc.instantiate(res[i]);
                if (obj.name == "ButtonToolMain") {
                    obj.parent = this.tipParent
                }else{
                    obj.parent = this.panelParent;
                }
                let uiPlaneSpr = obj.getComponent(obj.name);
                this.UIPlaneDictionary[obj.name] = uiPlaneSpr;
                obj.active = false;
            }
            this.isload = true;


        })
    }
    LoadSoldierConfig() {
        cc.loader.loadRes("Config/barracksConfig.json", (err, object) => {
            if (err) {
                cc.log("加载错误码：", err)
                return
            }
            BarracksCtrl.getInstance().setBarracksConfig(object.json)
        })
    }
    LoadLevelConfig() {
        cc.loader.loadRes("Config/levelConfig.json", (err, object) => {
            if (err) {
                cc.log("加载错误码：", err)
                return
            }
            LevelCtrl.getInstance().setLevelConfig(object.json)
        })
    }
    LoadSkillConfig() {
        cc.loader.loadRes("Config/skillConfig.json", (err, object) => {
            if (err) {
                cc.log("加载错误码：", err)
                return
            }
            SkillCtrl.getInstance().setSkillConfig(object.json)
        })
    }
    LoadAllSoldier() {
        let soldierPath = [];
        for (let i = 0; i < 10; i++) {
            soldierPath[i] = "Soldier/Soldier" + (i + 1);
        }
        soldierPath.push("Soldier/Soldier" + HeroID)
        soldierPath.push("Soldier/Soldier" + TowerID)
        cc.loader.loadResArray(soldierPath, cc.Prefab, (completedCount: number, totalCount: number, item: any) => {
            //console.log(completedCount, totalCount, item);
        }, (msg: Error, res: any[]) => {
            //console.log(msg, res,soldierPath);
            let allSoldier: { name: string, soldier: cc.Node }[] = []
            for (let i = 0; i < res.length; i++) {
                let obj = cc.instantiate(res[i]);
                allSoldier.push({ name: obj.name, soldier: obj })
                obj.active = false;
            }
            GameCtrl.getInstance().setAllSoldierPre(allSoldier)
        })
    }
    startPor() {
        let count = 0;
        this.loadBar.progress = count;
        let callback = (event) => {
            if (count >= 0.9) {
                if (this.isload) {
                    count += 0.015;
                }
            } else {
                count += 0.015;
            }
            this.loadBar.progress = count;
            if (count >= 1) {
                this.isShow = true;
                this.unschedule(callback);
                this.loadBar.node.parent.active = false;
                for (let i in this.UIPlaneDictionary) {
                    this.UIPlaneDictionary[i].InitUI(this);
                }
                this.ShowUIName("HomeMain");
            }
        }
        this.schedule(callback, 0.02);
    }
    ShowUIName(uiName, fun = () => { }, data = null) {
        if (this.UIPlaneDictionary[uiName]) {
            this.UIPlaneDictionary[uiName].ShowUI(fun, data);
        } else {
            cc.log("空界面")
        }
    }
    HideUIName(uiName) {
        if (this.UIPlaneDictionary[uiName]) {
            this.UIPlaneDictionary[uiName].HideUI();
        } else {
            cc.log("空界面")
        }
    }
    GetUIPanl(uiName): any {
        return this.UIPlaneDictionary[uiName];
    }
    loadSounds() {
        cc.loader.loadResDir("music", cc.AudioClip, (err, clips) => {
            for (let i = 0; i < clips.length; i++) {
                SoundMgr.getInstance().addSound(clips[i].name, clips[i]);
            }
        });
    }
    updateGameFxData() {
        this.GetUIPanl("GameMain").UpdataFXData();
        this.GetUIPanl("HomeMain").UpdataFXData();
        this.GetUIPanl("FreeDrawMain").UpdataFXData();
    }
}