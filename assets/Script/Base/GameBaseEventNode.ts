

import { GameEvent } from "../Config/GameEventConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameBaseEventNode extends cc.Component {

    onDispathcGameEvent (eventId:GameEvent, eventData:any) {
        
    }
}
