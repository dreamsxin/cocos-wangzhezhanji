
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    tipText: cc.Label = null;

    Init(value: string, fun = () => { }) {
        this.tipText.string = value;
        let y = this.node.y + 150;
        cc.tween(this.node)
            .to(1, { y: y })
            .to(1, { y: y })
            .to(1, { opacity: 0 })
            .call(() => {
                fun();
                this.node.destroy();
            })
            .start()
    }

}
