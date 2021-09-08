// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    fun: Function = () => { }
    bigIndex: number = 0

    init(name: string, bigIndex: number, fun = (a) => { }) {
        this.fun = fun;
        this.bigIndex = bigIndex
        this.nameLabel.string = name
    }

    onClickToggle() {
        if (this.fun) {
            this.fun(this.bigIndex)
        }
    }

    // update (dt) {}
}
