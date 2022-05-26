cc.Class({
    extends: cc.Component,

    properties: {
        anim_node: cc.Node,
        anim_slot: null,
        index: 0,

        narrator: cc.Node,
        narrator_timeout: null,

        sfx1: cc.Node,
        sfx2: cc.Node,
        sfx3: cc.Node,
        sfx4: cc.Node,
        sfx1_timeout: null,
        sfx2_timeout: null,
        sfx3_timeout: null,
        sfx4_timeout: null,

        skip_btn: cc.Node,
        skip_btn_click_slot: null,
        skipAll_btn: cc.Node,
        skipAll_btn_click_slot: null
    },

    onLoad () {
        var anim = this.anim_node.getComponent(cc.Animation);
        anim.on('finished', this.anim_slot = function () {
            this.showEntrance();
        }.bind(this), this);
        
        this.skip_btn.on('mouseup', this.skip_btn_click_slot = function () {
            this.showEntrance();
        }.bind(this), this);
        this.skipAll_btn.on('mouseup', this.skipAll_btn_click_slot = function () {
            var anim = this.anim_node.getComponent(cc.Animation);
            anim.stop();
            this.anim_node.getComponent(cc.AudioSource).stop();
            this.node.parent.emit('nodeFinished', 'entrance');
        }.bind(this), this);

        g_wrestlers = g_wrestlers.sort(function (a, b) {
            return (b.name == g_character.name) ? 5 : ((a.name == g_character.name) ? -5 : (parseInt(Math.random()*2) == 1 ? 5 : -5));
        });
        this.index = 0;
        this.showEntrance();
    },

    onDisable () {
        var anim = this.anim_node.getComponent(cc.Animation);
        anim.stop();
        anim.off('finished', this.anim_slot, this);

        this.anim_node.getComponent(cc.AudioSource).stop();

        clearTimeout(this.sfx1_timeout);
        clearTimeout(this.sfx2_timeout);
        clearTimeout(this.sfx3_timeout);
        clearTimeout(this.sfx4_timeout);
        clearTimeout(this.narrator_timeout);
    },

    onDestroy () {
        this.skip_btn.off('mouseup', this.skip_btn_click_slot, this);
        this.skipAll_btn.off('mouseup', this.skipAll_btn_click_slot, this);
    },

    showEntrance: function () {
        clearTimeout(this.sfx1_timeout);
        clearTimeout(this.sfx2_timeout);
        clearTimeout(this.sfx3_timeout);
        clearTimeout(this.sfx4_timeout);
        clearTimeout(this.narrator_timeout);
        var anim = this.anim_node.getComponent(cc.Animation);
        anim.stop();
        this.anim_node.getComponent(cc.AudioSource).stop();
        this.sfx1.getComponent(cc.AudioSource).stop();
        this.sfx2.getComponent(cc.AudioSource).stop();
        this.sfx3.getComponent(cc.AudioSource).stop();
        this.narrator.getComponent(cc.AudioSource).stop();

        if ( this.index == g_wrestlers.length ) {
            this.node.parent.emit('nodeFinished', 'entrance');
        } else {
            var character = g_wrestlers[this.index];
            this.anim_node.getComponent(cc.AudioSource).clip = g_assets['character/ent_music/' + character.name];
            this.anim_node.getComponent(cc.AudioSource).play();
            anim.play(character.name);

            /* this.narrator_timeout = setTimeout(function () {
                this.narrator.getComponent(cc.AudioSource).clip = g_assets['match_scene/introducing'];
                this.narrator.getComponent(cc.AudioSource).play();
                this.narrator_timeout = setTimeout(function () {
                    this.narrator.getComponent(cc.AudioSource).clip = g_assets['character/narrator/' + character.name];
                    this.narrator.getComponent(cc.AudioSource).play();
                    this.narrator_timeout = setTimeout(function () {
                        this.narrator.getComponent(cc.AudioSource).clip = g_assets['match_scene/makingway'];
                        this.narrator.getComponent(cc.AudioSource).play();
                    }.bind(this), ( character.name == "Perry Saturn" || character.name == "Raven" || character.name == "Mad Mike" ) ? 18000 : 15000);
                }.bind(this), ( character.name == "Perry Saturn" || character.name == "Raven" || character.name == "Mad Mike" ) ? 7000 : 4500);
            }.bind(this), 0); */
            
            
            if ( character.name == "Perry Saturn" || character.name == "Raven" || character.name == "Mad Mike" ) {
                this.sfx1_timeout = setTimeout(function () {
                    this.sfx1.getComponent(cc.AudioSource).play();
                }.bind(this), 3 * 1000);
                this.sfx2_timeout = setTimeout(function () {
                    this.sfx2.getComponent(cc.AudioSource).play();
                }.bind(this), 8 * 1000);
                this.sfx3_timeout = setTimeout(function () {
                    this.sfx3.getComponent(cc.AudioSource).play();
                }.bind(this), 37 * 1000);
                /* this.sfx4_timeout = setTimeout(function () {
                    this.sfx4.getComponent(cc.AudioSource).play();
                }.bind(this), 10000); */
            }
            ++ this.index;
        }
    }
});
