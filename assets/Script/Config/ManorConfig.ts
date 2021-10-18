
export default class ManorConfig {

}

export class BuildingInfo {
    buildingName: BuildingType = BuildingType.City   //建筑名字
    buildingLevel: number = 1   //建筑等级

}

export enum BuildingType {
    City = "City",              //城市
    Barracks = "Barracks",      //兵营
    TrainingCamp = "TrainingCamp", //训练营
}

