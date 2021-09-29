
export default class SkillConfig {

}
export class SkillBasic {
    skillID: number = 0      //id
    skillName: string = ""   //名字
    skillDes: string = ""    //描述
    Attack: number = 60;      //攻击力
    skillCD: number = 20;   //防御力
    scriptName: string = "";  //移动速度
    skillTime: number = 100;  //移动速度
    constructor(data: SkillBasic) {
        this.skillID = data.skillID
        this.skillName = data.skillName
        this.skillDes = data.skillDes
        this.Attack = data.Attack
        this.skillCD = data.skillCD
        this.scriptName = data.scriptName
        this.skillTime = data.skillTime
    }
}
export class SkillConFigList {
    conList: number[] = []    //战配表
}