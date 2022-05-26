cc.Class({
    extends: cc.Component,

    properties: {
        stance_img: cc.Node,
        selected_mark: cc.Node,
        character: null
    },
    
    update () {
        if ( this.character != null ) {
            this.node.active = !this.character.dead;
        }
    },

    setIdleScale: function (scale) {
        this.stance_img.setScale(scale, Math.abs(scale));
    },

    setCharacter: function (character) {
        this.character = character;
        this.selected_mark.active = /* ( character.name == g_character.name ) */false;
        this.stance_img.getComponent(cc.Sprite).spriteFrame = g_assets['character/stance/' + character.name];
    }
});
