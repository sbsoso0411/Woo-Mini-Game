cc.Class({
    extends: cc.Component,

    properties: {
        back_img: cc.Node,
        pose_img: cc.Node,
        rank_label: cc.Node,
        name_label: cc.Node,
        outline_bar: cc.Node,
        health_bar: cc.Node,
        selected_mark: cc.Node,
        dead: cc.Node,
        shield: cc.Node,
        damage_label: cc.Node,

        anim_slot: null
    },

    onLoad () {
        this.selected_mark.active = false;
        this.shield.active = false;
    },

    onDisable () {
        var anim = this.node.getComponent(cc.Animation);
        anim.off('finished', this.anim_slot, this);
    },
    
    setDead: function (fast = false) {
        if ( fast ) {
            this.back_img.color = new cc.Color(100, 100, 100);
        } else {
            var anim = this.node.getComponent(cc.Animation);
            if ( this.anim_slot != null ) {
                anim.off('finished', this.anim_slot, this);
            }
            anim.on('finished', this.anim_slot = function () {
                this.back_img.color = new cc.Color(100, 100, 100);
                this.damage_label.opacity = 0.0;
                anim.off('finished', this.anim_slot, this);
            }, this);
            anim.play('eliminate');
        }
    },

    setShield: function (show) {
        this.shield.active = show;
    },

    playAnim: function () {
        this.damage_label.opacity = 0.0;
    },

    setDamage: function (damage) {
        this.damage_label.getComponent(cc.Label).string = -damage;
    },

    setRank: function (rank) {
        this.rank_label.getComponent(cc.Label).string = rank;
    },

    setCharacter: function (character) {
        this.dead.opacity = 0;
        this.back_img.color = new cc.Color(0, 0, 0);
        this.pose_img.getComponent(cc.Sprite).spriteFrame = g_assets['character/pose/' + character.name];
        this.name_label.getComponent(cc.Label).string = character.name;
        if ( character.name == g_character.name ) {
            this.selected_mark.active = true;
            this.name_label.color = new cc.Color(255, 0, 0);
        } else {
            this.selected_mark.active = false;
            this.name_label.color = new cc.Color(200, 200, 200);
        }
        var x_scale = character.health / g_wrestling_roster[character.name].health;
        if ( x_scale < 0.3 ) {
            this.outline_bar.color = new cc.Color(255, 0, 0);
            this.health_bar.color = new cc.Color(255, 0, 0);
        } else if ( x_scale < 0.7 ) {
            this.outline_bar.color = new cc.Color(255, 255, 0);
            this.health_bar.color = new cc.Color(255, 255, 0);
        } else {
            this.outline_bar.color = new cc.Color(0, 255, 0);
            this.health_bar.color = new cc.Color(0, 255, 0);
        }
        this.health_bar.setScale(x_scale, 1.0);
    }
});
