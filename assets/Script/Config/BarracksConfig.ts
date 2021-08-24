
export default class BarrackConfig {

}
export class SoldierBasic {
    soldierID: number = 0      //id
    soldierName: string = ""   //名字
    soldierDes: string = ""    //描述
    HP: number = 100;         //血量
    Attack: number = 60;      //攻击力
    Phylactic: number = 20;   //防御力
    moveSpeed: number = 100;  //移动速度
    attackInterval: number = 1; //攻击间隔
    attackRange: number = 80;  //攻击范围
    skillRange: number = 0;    //技能范围
    crit: number = 0;           //暴击
    buffValue: number = 0;      //buff增益效果
    constructor(data: SoldierBasic) {
        this.soldierID = data.soldierID
        this.soldierName = data.soldierName
        this.soldierDes = data.soldierDes
        this.HP = data.HP
        this.Attack = data.Attack
        this.Phylactic = data.Phylactic
        this.moveSpeed = data.moveSpeed
        this.attackInterval = data.attackInterval
        this.attackRange = data.attackRange
        this.skillRange = data.skillRange
        this.crit = data.crit
        this.buffValue = data.buffValue
    }
}
export class SoldierAttribute {

}
export class WarConFigList {
    conList: number[] = []    //战配表
}