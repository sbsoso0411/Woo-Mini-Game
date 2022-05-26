cc.Class({
    extends: cc.Component,

    properties: {
        anim_node: cc.Node,
        card_anim_slot: null,
        cardLoaded: false,

        pose_img: cc.Node,
        award_img: cc.Node,
        rarity_img: cc.Node,
        name_img: cc.Node,
        cost_stat: cc.Node,
        health_stat: cc.Node,
        damage_stat: cc.Node,
        speed_stat: cc.Node,
        selected_mark: cc.Node,

        invalid_mark: cc.Node,
        buyBtn: cc.Node,

        mouseenter_slot: null,
        mouseleave_slot: null,
        mouseup_slot: null,
        buy_slot: null,

        character: null,
        valid: false
    },

    onLoad () {
        var card_anim = this.anim_node.getComponent(cc.Animation);
        this.node.on('mouseenter', this.mouseenter_slot = function () {
            if ( !this.cardLoaded || !this.valid ) {
                return ;
            }
            this.node.zIndex = 100;
            card_anim.stop('fighter_card_hover');
            card_anim.play('fighter_card_hover');
        }, this);
        this.node.on('mouseleave', this.mouseleave_slot = function () {
            if ( !this.cardLoaded || !this.valid ) {
                return ;
            }
            this.node.zIndex = 1;
            card_anim.stop('fighter_card_hover');
            this.anim_node.setScale(1.0, 1.0);
        }, this);
        this.node.on('mouseup', this.mouseup_slot = function () {
            if ( !this.cardLoaded || !this.valid ) {
                return ;
            }
            this.node.parent.emit('characterSelected', this.character); 
        }, this);

        this.buyBtn.on('mouseup', this.buy_slot = function () {
            window.open('https://packs.wrestlingorganization.online/');
        }, this);

        card_anim.on('finished', this.card_anim_slot = function () {
            this.cardLoaded = true;
        }, this);
        card_anim.play('fighter_card_appear');
    },

    onDisable () {
        var card_anim = this.anim_node.getComponent(cc.Animation);
        card_anim.stop('fighter_card_appear');
        card_anim.stop('fighter_card_hover');
        card_anim.off('finished', this.card_anim_slot, this);
    },

    onDestroy () {
        this.node.off('mouseenter', this.mouseenter_slot, this);
        this.node.off('mouseleave', this.mouseleave_slot, this);
        this.node.off('mouseup', this.mouseup_slot, this);
        this.buyBtn.off('mouseup', this.buy_slot, this);
    },

    setCharacter: function (character) {
        this.character = character;
        if ( g_nftsObj[g_nftTypes[character.name]] == true ) {
            this.valid = true;
        } else {
            this.valid = false;
        }
        this.invalid_mark.active = !this.valid;
        this.pose_img.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/pose_img/' + character.name];
        this.award_img.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/award_img/' + character.foils];
        this.rarity_img.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/rarity_img/' + character.rarity];
        this.name_img.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/name_img/' + character.name];

        this.cost_stat.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/num_img/cost' + character.cost];
        this.health_stat.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/num_img/' + character.health];
        this.damage_stat.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/num_img/' + character.damage];
        this.speed_stat.getComponent(cc.Sprite).spriteFrame = g_assets['fighter_card/num_img/speed' + character.speed];
    },

    setSelected: function (selected = false) {
        this.selected_mark.active = selected;
    }
});
