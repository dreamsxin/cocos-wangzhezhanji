

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    colorSpeed: number = 1;
    isClick: boolean = false;
    start() {
        this.colorSpeed = 600
        this.scheduleOnce(() => {
            this.isClick = true;
        }, Math.random())
    }
    update(deltaTime) {
        if (!this.isClick) return;
        if (this.node.opacity >= 255) {
            this.colorSpeed = -Math.abs(this.colorSpeed);
        } else if (this.node.opacity <= 0) {
            this.colorSpeed = Math.abs(this.colorSpeed);
        }
        this.node.opacity += this.colorSpeed * deltaTime;
    }
}
