import GameTools from "./GameTools";
// import SpriteManager from "../Managers/SpriteManager";
// import ClientManager from "../Managers/ClientManager";
// import SensitiveWord from "../Config/SensitiveWordCofig";
// import LanguageConfig from "../Config/LanguageConfig";
// import ConfigManager from "../Scenes/ConfigManager";

export default class GameUtils {
    //-----------------------

    private _directionRadian: number[] = [Math.PI, -Math.PI * 3 / 4, -Math.PI / 2, -Math.PI / 4, 0, Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4];

    //-----------------------
    //-----------------------
    private static _instance: GameUtils = null;
    public static getInstance(): GameUtils {
        if (!this._instance) {
            this._instance = new GameUtils();
        }
        return this._instance;
    }

    public reset() {


    }

    public stopCCCNodeAllActions(cccNode: cc.Node, isChild: boolean = true) {
        if (!cccNode) {
            return;
        }
        cccNode.stopAllActions();
        cc.Tween.stopAllByTarget(cccNode)
        if (isChild) {
            let children = cccNode.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.stopCCCNodeAllActions(children[i], isChild);
            }
        }
    }

    public stopCCCNodeAllScheduleCallbacks(cccNode: cc.Node, isChild: boolean = true) {
        if (!cccNode) {
            return;
        }
        let comps = cccNode.getComponents(cc.Component);
        for (let i = 0; i < comps.length; i++) {
            let comp = comps[i];
            comp.unscheduleAllCallbacks();
        }
        if (isChild) {
            let children = cccNode.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.stopCCCNodeAllScheduleCallbacks(children[i], isChild);
            }
        }
    }

    public pauseCCCNodeAllActions(cccNode: cc.Node, isChild: boolean = true) {
        if (!cccNode) {
            return;
        }
        cccNode.pauseAllActions();
        if (isChild) {
            let children = cccNode.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.pauseCCCNodeAllActions(children[i], isChild);
            }
        }
    }

    public resumeCCCNodeAllActions(cccNode: cc.Node, isChild: boolean = true) {
        if (!cccNode) {
            return;
        }
        cccNode.resumeAllActions();
        if (isChild) {
            let children = cccNode.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.resumeCCCNodeAllActions(children[i], isChild);
            }
        }
    }

    public stopCCCNodeAnimation(cccNode: cc.Node, isChild: boolean = true) {
        if (!cccNode) {
            return;
        }
        let anim = cccNode.getComponent(cc.Animation);
        if (anim) {
            anim.stop();
        }
        if (isChild) {
            let children = cccNode.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.stopCCCNodeAnimation(children[i], isChild);
            }
        }
    }

    public stopCCCNodeAllActionsAndAnimations(cccNode: cc.Node, isChild: boolean = true) {
        this.stopCCCNodeAnimation(cccNode, isChild);
        this.stopCCCNodeAllActions(cccNode, isChild);
    }

    public setCCCNodeGray(node: cc.Node | cc.Component, isGray: boolean, isChild: boolean = true) {
        if (!node) {
            return;
        }

        let cccNode: cc.Node = null;
        if (node instanceof cc.Component) {
            cccNode = node.node;
        } else {
            cccNode = node;
        }
        if (!cccNode) {
            return;
        }

        let spr: cc.Sprite = cccNode.getComponent(cc.Sprite);
        if (spr) {
            this.setCCCSpriteGray(spr, isGray, false);
        }
        let label: cc.Label = cccNode.getComponent(cc.Label);
        if (label) {
            this.setCCCLabelGray(label, isGray, false);
        }
        let button: cc.Button = cccNode.getComponent(cc.Button);
        if (button) {
            this.setButtonGray(button, isGray, false);
        }

        if (isChild) {
            let children = cccNode.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.setCCCNodeGray(children[i], isGray, isChild);
            }
        }
    }

    public setCCCSpriteGray(sprite: cc.Sprite, isGray: boolean, isChild: boolean = true) {
        if (!sprite) {
            return;
        }
        // sprite.setState(isGray ? 1 : 0);//升级到2.1.2后 废弃了
        //以下为2.1.2版本
        let mat: cc.Material = null;
        if (isGray) {
            mat = cc.Material.getBuiltinMaterial('2d-gray-sprite');
        }
        else {
            mat = cc.Material.getBuiltinMaterial('2d-sprite');
        }
        sprite.setMaterial(0, mat);
        //---
        if (isChild) {
            let children = sprite.node.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.setCCCSpriteGray(children[i].getComponent(cc.Sprite), isGray, isChild);
            }
        }
    }

    public setCCCLabelGray(label: cc.Label, isGray: boolean, isChild: boolean = true) {
        if (!label) {
            return;
        }
        // sprite.setState(isGray ? 1 : 0);//升级到2.1.2后 废弃了
        //以下为2.1.2版本
        let mat: cc.Material = null;
        if (isGray) {
            mat = cc.Material.getBuiltinMaterial('2d-gray-sprite');
        }
        else {
            mat = cc.Material.getBuiltinMaterial('2d-sprite');
        }
        label.setMaterial(0, mat);
        //---
        if (isChild) {
            let children = label.node.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.setCCCLabelGray(children[i].getComponent(cc.Label), isGray, isChild);
            }
        }
    }

    public setCCCNodeColor(cccNode: cc.Node, color: cc.Color | string, isChild: boolean = true) {
        if (!cccNode) {
            return;
        }

        this._setColor(cccNode, color);
        if (isChild) {
            let children = cccNode.children;
            if (!children || children.length <= 0)
                return;
            for (let i = 0; i < children.length; i++) {
                this.setCCCNodeColor(children[i], color, isChild);
            }
        }
    }

    private _setColor(cccNode: cc.Node, color: cc.Color | string) {
        if (cccNode) {
            if (typeof color == "string") {
                cccNode.color = this.getColorRGBA(color);
            }
            else {
                cccNode.color = color;
            }
        }
    }

    public getColorRGBA(colorString: string): cc.Color {
        let colorValueList = [];
        if (!colorString) { //默认为白色
            colorString = "#ffffff";
        }
        if (colorString[0] != '#') {
            colorString = '#' + colorString;
        }
        if (colorString.length < 9) {
            colorString += "ff";
        }
        for (let i = 1; i < 9; i += 2) {
            colorValueList.push(parseInt("0x" + colorString.slice(i, i + 2)));
        }
        let color = cc.color(colorValueList[0], colorValueList[1], colorValueList[2], colorValueList[3]);
        return color;
    }

    public setLabelOutLineColor(label: cc.Label, color: cc.Color | string) {
        let labelOutLine = this.getComponent(label.node, cc.LabelOutline);
        if (labelOutLine) {
            if (typeof color == "string") {
                labelOutLine.color = this.getColorRGBA(color);
            }
            else {
                labelOutLine.color = color;
            }
        }
    }

    /*
     *敏感字替换
     */
    public sensitiveWord(text: string): string {
        let str = text;
        //todo
        return str;
    };

    // public checkSensitiveWord(text: string) {
    //     let swd = SensitiveWord.datas;
    //     for (const key in swd) {
    //         if (swd.hasOwnProperty(key)) {
    //             const wd = swd[key];
    //             if (text.indexOf(wd.SensitiveWord) != -1) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    public setString(label: cc.Label | cc.RichText | cc.EditBox, text: string | number) {
        // cc.log(new Error().stack);
        // cc.log(text);
        
        if (label) {
            label.string = text + "" || "";
        }
    }

    public getString(label: cc.Label | cc.RichText | cc.EditBox): string {
        if (label) {
            return label.string
        }
        return "";
    }

    // public setStringById(label: cc.Label | cc.RichText | cc.EditBox, textId: string, arg: string[]) {
    //     let text = this.getTextById(textId, arg);
    //     this.setString(label, text);
    // }

    public setEditBoxPlaceholderString(editBox: cc.EditBox, text: string) {
        if (editBox) {
            editBox.placeholder = text;
        }
    }

    // public setEditBoxPlaceholderStringById(editBox: cc.EditBox, textId: string, arg: string[]) {
    //     let text = this.getTextById(textId, arg);
    //     if (editBox) {
    //         editBox.placeholder = text;
    //     }
    // }

    public setFormatNumberString(label: cc.Label, num: number) {
        if (label) {
            let formatNumberString = this.getFormatNumberString(num);
            this.setString(label, formatNumberString);
        }
    }

    public getFormatNumberString(num: number) {
        //todo
        return "0";
    }

    public setProgress(node: cc.ProgressBar | cc.Slider, progress: number) {
        //原来条件是：node && node.progress ，node.progress为0，则为false
        if (node) {
            node.progress = progress;
        }
    }

    public setSpriteFrame(sprite: cc.Sprite, spriteFrame: cc.SpriteFrame) {
        // if (node && node.spriteFrame && spriteFrame) {
        if (sprite && spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }
    }

    public getSpriteAtlasByFrameName(spriteAtlas: cc.SpriteAtlas, spriteFrameName: string) {
        return spriteAtlas.getSpriteFrame(spriteFrameName);
    }

    // public async setSpriteFrameByName(sprite: cc.Sprite, spriteFrameName: string) {
    //     if (!sprite) {
    //         return;
    //     }
    //     if (spriteFrameName == "") {
    //         cc.warn("setSpriteFrameByName spriteFrameName is null");
    //         return;
    //     }

    //     let frame = await SpriteManager.getInstance().getSpriteFrame(spriteFrameName, ClientManager.getInstance().getCurGameType());
    //     if (sprite && cc.isValid(sprite) && cc.isValid(sprite.node)) {
    //         if (frame) {
    //             sprite.spriteFrame = frame;
    //         }
    //     }
    // }

    // public async setSpriteFrameBySpriteAtlas(sprite: cc.Sprite, spriteAtlasUrl: string, spriteFrameName: string) {
    //     let atlas = await SpriteManager.getInstance().getSpriteAtlas(spriteAtlasUrl, ClientManager.getInstance().getCurGameType());
    //     let frame = this.getSpriteAtlasByFrameName(atlas, spriteFrameName);
    //     if (sprite && cc.isValid(sprite) && cc.isValid(sprite.node)) {
    //         if (frame) {
    //             sprite.spriteFrame = frame;
    //         }
    //     }
    // }

    public setVisible(node: cc.Node | any, visible: boolean) {
        if (node) {
            if (node.node) {
                node.node.active = visible;
            } else {
                node.active = visible;
            }
        }
    }

    public setCCCNodeOpacity(node: cc.Node, value: number) {
        if (node) {
            node.opacity = value;
        }
    }

    public isVisible(node: cc.Node | any) {
        if (node) {
            if (node.node) {
                return node.node.active
            } else {
                return node.active;
            }
            return false;
        }
    }

    public setPosition(node: cc.Node | any, pos: cc.Vec2) {
        if (node && pos) {
            if (node.node) {
                node.node.setPosition(pos);
            } else {
                node.setPosition(pos);
            }
        }
    }

    public setRotation(node: cc.Node, rotation: number = 0) {
        if (node) {
            node.rotation = rotation;
        }
    }

    public setAngle(node: cc.Node, angle: number = 0) {
        if (node) {
            node.angle = angle;
        }
    }

    public getPosition(node: cc.Node) {
        if (node) {
            return node.getPosition();
        }
        return cc.v2(0, 0);
    }

    public getChildByName(node: cc.Node, name: string, component: { prototype: cc.Component } | string = null) {
        let temp = null;
        if (node) {
            temp = node.getChildByName(name);
            if (!temp) {
                let children = node.children;
                for (let i = 0; i < children.length; ++i) {
                    temp = this.getChildByName(children[i], name);
                    if (temp) {
                        if (component) {
                            return temp.getComponent(component);
                        }
                        return temp;
                    }
                }
            }
        }
        return temp;
    }

    public getAllChildrenAndPath(rootNode: cc.Node, table: any, rootPath: string) {
        let path = rootPath || rootNode.name;
        let childrenTable = table || {};
        let children = rootNode.children;
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            let childPath = path + "/" + child.name;
            // //cc.log("getAllChildrenAndPath",childPath);
            childrenTable[childPath] = child;
            this.getAllChildrenAndPath(child, childrenTable, childPath);
        }
        return childrenTable;
    }

    public getAllChildren(rootNode: cc.Node, table: any) {
        let childrenTable = table || {};
        let children = rootNode.children;
        for (let i = 0; i < children.length; ++i) {
            let child = children[i];
            // //cc.log("getAllChildren",child.name);
            childrenTable[child.name] = child;
            this.getAllChildren(child, childrenTable);
        }
        return childrenTable;
    }

    public getComponent(node: cc.Node, name: any) {
        let temp = null;
        if (node && name) {
            temp = node.getComponent(name);
        }
        return temp;
    }

    public addComponent(node: cc.Node, name: any) {
        if (node && name) {
            let component = node.getComponent(name);
            if (component) {
                return component;
            }
            return node.addComponent(name);
        }
        return null;
    }

    public removeComponent(node: cc.Node, name: any) {
        if (node && name) {
            node.removeComponent(name);
        }
    }

    public getIsHaveComponent(compoentName: string) {
        return !!cc.js.getClassByName(compoentName);
    }

    public addChild(parent: cc.Node, child: cc.Node, pos: cc.Vec2 = null, zIndex: number = 0) {
        if (parent && child) {
            parent.addChild(child);
            if (pos) {
                this.setPosition(child, pos);
            }
            if (!GameTools.getInstance().isNull(zIndex)) {
                child.zIndex = zIndex;
            }
        }
    }

    public removeAllChildren(node: cc.Node) {
        if (node) {
            node.destroyAllChildren();
        }
    }

    public removeFromParent(node: cc.Node, clearup: boolean = true) {
        if (node) {
            node.removeFromParent(clearup);
        }
    }

    public getRadian(curPos: cc.Vec2, endPos: cc.Vec2) {
        // let ang = endPos.signAngle(curPos);
        let vec = cc.v2(curPos).subtract(cc.v2(endPos));
        return Math.atan2(vec.y, vec.x);
    }

    public getDegree(curPos: cc.Vec2, endPos: cc.Vec2) {
        let radian = this.getRadian(curPos, endPos);
        let degree = radian * 180 / Math.PI;
        return degree;
    }

    //弧度＝角度×π/180
    public getRadianFromDegree(degree: number) {
        let ra = degree * Math.PI / 180;
        return ra;
    }

    //角度＝弧度×180/π
    public getDegreeFromRadian(radian: number) {
        let degree = radian * 180 / Math.PI;
        return degree;
    }

    public transformRadian(radian: number, scaleX: number = 1, scaleY: number = 1) {
        radian = Math.floor(radian * 100) / 100;
        return Math.atan2(Math.sin(radian) * scaleY, Math.cos(radian) * scaleX);
    }

    public setContentSize(node: cc.Node, size: cc.Size) {
        if (node) {
            size = size || cc.size(0, 0);
            node.setContentSize(size);
            this.flushCCCNodeSize(node);
        }
    }

    public flushCCCNodeWidget(node: cc.Node) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            this.flushCCCNodeWidget(children[i]);
        }

        let widget = this.getComponent(node, cc.Widget);
        if (widget) {
            widget.enabled = false;
            widget.enabled = true;
        }
    }

    public flushCCCNodeLayout(node: cc.Node) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            this.flushCCCNodeLayout(children[i]);
        }

        let layout = this.getComponent(node, cc.Layout);
        if (layout) {
            layout.enabled = false;
            layout.enabled = true;
        }
    }

    public flushCCCNodeSize(node: cc.Node) {
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            this.flushCCCNodeSize(children[i]);
        }

        let layout = this.getComponent(node, cc.Layout);
        if (layout) {
            layout.enabled = false;
            layout.enabled = true;
        }
        let widget = this.getComponent(node, cc.Widget);
        if (widget) {
            widget.enabled = false;
            widget.enabled = true;
        }
    }

    public getContentSize(node: cc.Node) {
        if (node) {
            return node.getContentSize();
        }
        return cc.size(0, 0);
    }

    public setAnchorPoint(node: cc.Node, point: cc.Vec2) {
        if (node) {
            point = point || cc.v2(0.5, 0.5);
            node.setAnchorPoint(point);
        }
    }

    public getAnchorPoint(node: cc.Node) {
        if (node) {
            return node.getAnchorPoint();
        }
        return cc.v2(0.5, 0.5);
    }

    public setScale(node: cc.Node, scale: number) {
        if (node) {
            node.setScale(scale);
        }
    }


    public getScale(node: cc.Node) {
        if (node) {
            return node.scale;
        }
        return 1;
    }

    public setFontSize(label: cc.Label, size: number) {
        if (label) {
            label.fontSize = size;
        }
    }

    public getFontSize(label: cc.Label) {
        if (label) {
            return label.fontSize;
        }
        return 0;
    }

    public setButtonEnable(button: cc.Button, isEnable: boolean = true) {
        if (button) {
            button.interactable = isEnable;
        }
    }

    public setButtonGray(button: cc.Button, isGray: boolean = true, isChild: boolean = true) {
        if (button) {
            button.interactable = !isGray;
            button.enableAutoGrayEffect = true;

            if (isChild) {
                let children = button.node.children;
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    this.setCCCNodeGray(child, isGray, isChild);
                }
            }
        }
    }

    public setNodeCenter(node: cc.Node, isChild:boolean=true) {
        if (!node) {
            return;
        }
        let widget = node.getComponent(cc.Widget);
        if (!widget) {
            widget = node.addComponent(cc.Widget);
        }
        // cc.log("setNodeCenter node name",node.name);
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;

        // widget.isAlignHorizontalCenter = true;
        // widget.isAlignVerticalCenter = true;
        // widget.horizontalCenter = 0;
        // widget.verticalCenter = 0;

        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;

        // if (node.width > 0 && node.height > 0) {
        //     let drc = ConfigManager.getInstance().getDesignResoulutionInfo();
        //     node.width = node.width * drc.uiScaleX;
        //     node.height = node.height * drc.uiScaleY;
        // }

        widget.updateAlignment();

        if (isChild) {
            this._updateAllChildNodeWidget(node);
        }
    }

    private _updateAllChildNodeWidget(node: cc.Node) {
        if (!node) {
            return;
        }
        let widget = node.getComponent(cc.Widget);
        if (widget) {
            if (widget.enabled) {
                widget.updateAlignment();
            }
        }
        
        if (node.childrenCount == 0) {
            return;
        }
        let children = node.children;
        for (let i = 0; i < children.length; i++) {
            let childNode = children[i];
            this._updateAllChildNodeWidget(childNode);
        }
    }

    // public setBgSpriteScale(sprite: cc.Sprite) {
    //     if (!sprite) {
    //         return;
    //     }

    //     let drc = ConfigManager.getInstance().getDesignResoulutionInfo();
    //     sprite.node.scale = drc.uiMaxScale;
    // }

    public updateLayout(layout: cc.Layout) {
        let LayoutType = {
            None: 0,
            Horizontal: 1,  //横向
            Vertical: 2,    //纵向
            Grid: 3,        //网格
        }
        let ResizeMode = {
            None: 0,
            Container: 1,   //对容器大小进行缩放
        }
        let StartAxis = {
            Horizontal: 0,  //横向
            Vertical: 1,    //纵向
        }

        if (layout.resizeMode != ResizeMode.Container) {
            return;
        }

        let allChildrenList = [];
        for (let i = 0; i < layout.node.children.length; i++) {
            let childrenNode = layout.node.children[i];
            if (layout.node.children[i]) {
                childrenNode = layout.node.children[i];
            }
            if (childrenNode.active) {
                allChildrenList.push(childrenNode);
            }
        }
        let layoutType = layout.type;
        let layoutSize = this.getContentSize(layout.node);

        if (layoutType == LayoutType.Horizontal) {
            layoutSize.width = 0;
            let childrenLength = 0;
            for (let i = 0; i < allChildrenList.length; i++) {
                layoutSize.width += this.getContentSize(allChildrenList[i]).width;
                childrenLength++;
            }
            layoutSize.width += layout.paddingLeft;
            layoutSize.width += layout.paddingRight;
            if (childrenLength > 0) {
                layoutSize.width += (childrenLength - 1) * layout.spacingX;
            }
        }
        else if (layoutType == LayoutType.Vertical) {
            layoutSize.height = 0;
            let childrenLength = 0;
            for (let i = 0; i < allChildrenList.length; i++) {
                layoutSize.height += this.getContentSize(allChildrenList[i]).height;
                childrenLength++;
            }
            layoutSize.height += layout.paddingTop;
            layoutSize.height += layout.paddingBottom;
            if (childrenLength > 0) {
                layoutSize.height += (childrenLength - 1) * layout.spacingY;
            }
        }
        else if (layoutType == LayoutType.Grid) {
            if (layout.startAxis == StartAxis.Horizontal) {
                let layoutRowWidth = layout.paddingLeft + layout.paddingRight;
                let maxItemHeight = 0;
                let rowIndex = 0;
                layoutSize.height = 0;
                let oldMaxItemHeight = 0;
                for (let i = 0; i < allChildrenList.length; i++) {
                    let itemWidth = this.getContentSize(allChildrenList[i]).width;
                    layoutRowWidth += itemWidth;
                    let itemHeight = this.getContentSize(allChildrenList[i]).height;
                    if (itemHeight >= maxItemHeight) {
                        maxItemHeight = itemHeight;
                    }
                    if (layoutRowWidth == layoutSize.width) {
                        layoutRowWidth = 0;
                        layoutSize.height += maxItemHeight;
                        maxItemHeight = 0;
                        rowIndex++;
                    }
                    else if (layoutRowWidth >= layoutSize.width) {
                        layoutRowWidth = itemWidth + layout.spacingX;
                        layoutSize.height += oldMaxItemHeight;
                        rowIndex++;

                        if (i == allChildrenList.length - 1) {
                            layoutSize.height += maxItemHeight;
                            rowIndex++;
                        }
                        maxItemHeight = 0;
                    }
                    else {
                        if (i == allChildrenList.length - 1) {
                            layoutSize.height += maxItemHeight;
                            rowIndex++;
                        }
                        oldMaxItemHeight = maxItemHeight;
                        layoutRowWidth += layout.spacingX;
                    }
                }
                if (rowIndex > 0) {
                    layoutSize.height += (rowIndex - 1) * layout.spacingY;
                }
                layoutSize.height += layout.paddingTop;
                layoutSize.height += layout.paddingBottom;
            }
            else if (layout.startAxis == StartAxis.Vertical) {
                let layoutColHeight = layout.paddingTop + layout.paddingBottom;
                let maxItemWidth = 0;
                let oldMaxItemWidth = 0;
                let colIndex = 0;
                layoutSize.width = 0;
                for (let i = 0; i < allChildrenList.length; i++) {
                    let itemWidth = this.getContentSize(allChildrenList[i]).width;
                    let itemHeight = this.getContentSize(allChildrenList[i]).height;

                    layoutColHeight += itemHeight;
                    if (itemHeight >= maxItemWidth) {
                        maxItemWidth = itemWidth;
                    }
                    if (layoutColHeight == layoutSize.height) {
                        layoutColHeight = 0;
                        layoutSize.width += maxItemWidth;
                        maxItemWidth = 0;
                        colIndex++;
                    }
                    else if (layoutColHeight >= layoutSize.height) {
                        layoutColHeight = itemHeight + layout.spacingY;
                        layoutSize.width += oldMaxItemWidth;
                        colIndex++;

                        if (i == allChildrenList.length - 1) {
                            layoutSize.width += maxItemWidth;
                            colIndex++;
                        }
                        maxItemWidth = 0;
                    }
                    else {
                        if (i == allChildrenList.length - 1) {
                            layoutSize.width += maxItemWidth;
                            colIndex++;
                        }
                        oldMaxItemWidth = maxItemWidth;
                        layoutColHeight += layout.spacingY;
                    }
                }
                if (colIndex > 0) {
                    layoutSize.width += (colIndex - 1) * layout.spacingX;
                }
                layoutSize.width += layout.paddingTop;
                layoutSize.width += layout.paddingBottom;
            }
        }
        this.setContentSize(layout.node, layoutSize);
    }

    // public getTextById(textId: string, arg: string[]) {
    //     if (!textId) {
    //         //cc.log("game error textData 策划没配表，字段这空，让策划确认一下！！！",textId,arg);
    //         return "#######";
    //     }
    //     let text = LanguageConfig.datas[textId];
    //     if (!text) {
    //         //cc.log("game error textData 没有找到文字，让策划确认一下！！！",textId,arg);
    //         return "#######";
    //     }

    //     if (GameTools.getInstance().isNull(arg)) {
    //         arg = [];
    //     }
    //     //cc.log("getTextById",text,text,arg);
    //     return GameTools.getInstance().replaceString(text, arg);
    // }

    // //clone对象
    // public cloneObject(source:any):any{
    //     let copyTo = new Object();
    //     for (let  key in source) {
    //         if (source[key] !== undefined) {
    //             copyTo[key] = source[key];
    //         }
    //     }
    //     return copyTo;
    // }

    /**
     * setSeqNodesPosX
     */
    public setSeqNodesPosX(nodes: cc.Node[], sepW: number, posY: number) {
        if (!nodes || nodes.length <= 0) {
            return
        }
        sepW = sepW || 0
        posY = posY || 0

        let count = nodes.length
        let startPosX = -1 * sepW * Math.ceil((count - 1) / 2)
        if (count == 1) {
            startPosX = 0
        }
        else if (count % 2 == 0) {
            startPosX = startPosX + sepW / 2
        }

        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            node.setPosition(cc.v2(startPosX + (i * sepW), posY))
        }
    }

    public getSeqPosX(count: number, sepW: number, posY: number) {
        count = count || 0
        sepW = sepW || 0
        posY = posY || 0

        let startPosX = -1 * sepW * Math.ceil((count - 1) / 2)
        if (count == 1) {
            startPosX = 0
        }
        else if (count % 2 == 0) {
            startPosX = startPosX + sepW / 2
        }

        let poses: cc.Vec2[] = [];
        for (let i = 0; i < count; i++) {
            poses.push(cc.v2(startPosX + (i * sepW), posY));
        }

        return poses;
    }

    /**
     * setSeqNodesPosY
     */
    public setSeqNodesPosY(nodes: cc.Node[], sepH: number, posX: number) {
        if (!nodes || nodes.length <= 0) {
            return
        }
        sepH = sepH || 0
        posX = posX || 0

        let count = nodes.length
        let startPosY = sepH * Math.ceil((count - 1) / 2)
        if (count == 1) {
            startPosY = 0
        }
        else if (count % 2 == 0) {
            startPosY = startPosY - sepH / 2
        }

        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            node.setPosition(cc.v2(posX, startPosY - (i * sepH)))
        }
    }

    public getSeqPosY(count: number, sepH: number, posX: number) {
        count = count || 0
        sepH = sepH || 0
        posX = posX || 0

        let startPosY = sepH * Math.ceil((count - 1) / 2)
        if (count == 1) {
            startPosY = 0
        }
        else if (count % 2 == 0) {
            startPosY = startPosY - sepH / 2
        }

        let poses: cc.Vec2[] = [];
        for (let i = 0; i < count; i++) {
            poses.push(cc.v2(posX, startPosY - (i * sepH)));
        }

        return poses;
    }

    shakeNode(node: cc.Node, originPos: cc.Vec2, time: number = null, offset: number = null) {
        if (!node || !originPos) {
            return;
        }
        time = time || 0.5;
        let duration = 0.03;
        if (!offset) {
            offset = 6;
        }

        cc.Tween.stopAllByTarget(node);
        node.setPosition(originPos);

        //一个震动耗时4个duration左,复位,右,复位
        //同时左右和上下震动
        let times = Math.floor(time / (duration * 4));
        // let moveLeft = cc.tween().to(duration,{position:cc.v2(-offset, 0)});
        // let moveLReset = cc.tween().to(duration,{position:cc.v2(offset, 0)});
        // let moveRight = cc.tween().to(duration,{position:cc.v2(offset, 0)});
        // let moveRReset = cc.tween().to(duration,{position:cc.v2(-offset, 0)});
        // let horSeq = cc.tween().sequence(moveLeft,moveLReset,moveRight,moveRReset);

        let moveUp = cc.tween().by(duration, { position: cc.v2(0, offset) });
        let moveUReset = cc.tween().by(duration, { position: cc.v2(0, -offset) });
        let moveDown = cc.tween().by(duration, { position: cc.v2(0, -offset) });
        let moveDReset = cc.tween().by(duration, { position: cc.v2(0, offset) });
        let verSeq = cc.tween().sequence(moveUp, moveUReset, moveDown, moveDReset);

        // cc.tween(node).repeat(times, cc.tween().parallel(horSeq, verSeq)).call(()=>{
        cc.tween(node).repeat(times, cc.tween().then(verSeq)).call(() => {
            node.setPosition(originPos);
        }).start();
    }

}