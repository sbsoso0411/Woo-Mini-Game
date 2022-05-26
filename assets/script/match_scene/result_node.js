cc.Class({
    extends: cc.Component,

    properties: {
        winner_img: cc.Node,
        winner_name: cc.Node,

        rematch_btn: cc.Node,
        rematch_btn_click_slot: null,
        quit_btn: cc.Node,
        quit_btn_click_slot: null,

        eliminationPrefab: {
            type: cc.Prefab,
            default: null
        }
    },

    onEnable () {
        for ( var i = 0 ; i < g_elimination_order.length ; ++ i ) {
            var elimination = cc.instantiate(this.eliminationPrefab);
            this.node.addChild(elimination);
            elimination.getComponent('elimination_order').setCharacter(g_elimination_order.length - i, g_elimination_order[g_elimination_order.length - i - 1]);
            elimination.setPosition(515, 245 - i * 70);
        }

        this.rematch_btn.on('mouseup', this.rematch_btn_click_slot = function () {
            this.rematch_btn.active = false;
            cc.director.loadScene('main_scene');
        }, this);
        this.quit_btn.on('mouseup', this.quit_btn_click_slot = function () {
            this.quit_btn.active = false;
            cc.director.loadScene('load_scene');
        }, this);

        this.winner_img.getComponent(cc.Sprite).spriteFrame = g_assets['character/pose/' + g_winner.name];
        this.winner_name.getComponent(cc.Label).string = g_winner.name
        
        g_wooAudioID = cc.audioEngine.play(g_assets['woo'], true, 0.1);
        cc.audioEngine.setCurrentTime(g_wooAudioID, g_wooTime);
    },

    onDestroy () {
        this.rematch_btn.off('mouseup', this.rematch_btn_click_slot, this);
        this.quit_btn.off('mouseup', this.quit_btn_click_slot, this);
    }
});
