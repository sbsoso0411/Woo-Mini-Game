cc.Class({
    extends: cc.Component,

    properties: {
        character_img: cc.Node
    },

    onLoad () {
        this.node.active = false;
    },

    onDisable () {
        var show_anim = this.node.getComponent(cc.Animation);
        show_anim.stop('show_silhouette');
    },

    setCharacter: function (character) {
        this.character_img.getComponent(cc.Sprite).spriteFrame = g_assets['character/pose/' + character.name];
    },

    show: function () {
        this.node.active = true;
        var show_anim = this.node.getComponent(cc.Animation);
        show_anim.play('show_silhouette');
    }
});
