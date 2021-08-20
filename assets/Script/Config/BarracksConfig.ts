
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
    crit: number = 0;           //暴击
}
export class SoldierAttribute {

}
export class WarConFigList {
    conList: number[] = []    //战配表
}