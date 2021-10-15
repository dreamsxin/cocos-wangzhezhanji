
export default class ManorConfig {

}

export class BuildingInfo {
    buildingName: BuildingType = BuildingType.City   //建筑名字
    buildingLevel: number = 1   //建筑等级

}

export enum BuildingType {
    City = "City",              //游戏结束
}

