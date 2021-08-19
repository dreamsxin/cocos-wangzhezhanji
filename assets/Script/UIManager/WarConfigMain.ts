import UIParent from "./UIParent";


const {ccclass, property} = cc._decorator;

@ccclass
export default class WarConfigMain extends UIParent {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
