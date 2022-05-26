cc.Class({
    extends: cc.Component,

    properties: {
        order: cc.Node,
        avatar: cc.Node,
        name_label: cc.Node
    },

    setCharacter: function (index, character) {
        this.order.getComponent(cc.Label).string = index;
        this.avatar.getComponent(cc.Sprite).spriteFrame = g_assets['character/pose/' + character];
        this.name_label.getComponent(cc.Label).string = character;
        if ( character == g_character.name ) {
            this.order.color = new cc.Color(255, 0, 0);
            this.name_label.color = new cc.Color(255, 0, 0);
        } else {
            this.order.color = new cc.Color(255, 255, 255);
            this.name_label.color = new cc.Color(255, 255, 255);
        }
    }
});
