cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
        menu: 'TurnTable'
    },

    properties: {
        radius: {
            get () {
                return this._radius;
            },
            set (val) {
                if (this._radius !== val) {
                    this._radius = val;
                    if (CC_EDITOR) {
                        this.onTurnChange();
                    } 
                }
            }
        },
        _radius: '',
        target: cc.Node
    },
    
    onTurnChange(){
        if(this.target && this.target.children.length > 0){
            let len = this.target.children.length
            let angle = 360 / len
            for(let i = 0 ; i < len ;i++){
                let x = this.radius * Math.cos(angle * i * Math.PI / 180)
                let y = this.radius * Math.sin(angle * i * Math.PI/180)
                this.target.children[i].setPosition(x,y)
            }
        }
    }
    
    
});
