cc.Class({
    extends: cc.Component,

    properties: {
        fighter_cardPrefab: {
            default: null,
            type: cc.Prefab
        },
        create_fighter_card_timeout: null,
        fighter_cards: null,
        
        characterSelected_slot: null,
        current_character: null,

        select_btn: cc.Node,
        select_btn_click_slot: null,

        selected_character_img: cc.Node,

        start_btn: cc.Node,
        start_btn_click_slot: null,

        review: cc.Node,
        review_anim_slot: null,
        woo_audio_interval: null,
        start_match_timeout: null,
        character_img: cc.Node,
        silhouettePrefab: {
            default: null,
            type: cc.Prefab
        },
        silhouettes: null,
        show_silhouette_timeout: null
    },

    resize: function () {
        var design_width = this.node.width, design_height = this.node.height, browser_width = window.innerWidth, browser_height = window.innerHeight;
        var recommendedHeight = browser_width * design_height / design_width;
        var scene = this.node.parent;
        scene.setScale(recommendedHeight<browser_height ? 1 : recommendedHeight/browser_height, recommendedHeight<browser_height ? browser_height/recommendedHeight : 1);
    },

    onLoad () {
        window.addEventListener('resize', g_window_resize_slot = function () {
            this.resize();
        }.bind(this));
        this.resize();

        g_character_stats = g_character_stats.sort(function (a, b) {
            return parseInt(Math.random()*2) == 0 ? 5 : -5;
        });

        this.create_fighter_card_timeout = Array(g_character_stats.length);
        this.fighter_cards = Array(g_character_stats.length);
        var index = 0;
        for ( var i = 0 ; i < g_character_stats.length ; ++ i ) {
            this.create_fighter_card_timeout[i] = setTimeout(function () {
                var character = g_character_stats[index];
                var fighter_card = cc.instantiate(this.fighter_cardPrefab);
                this.node.addChild(fighter_card);
                fighter_card.getComponent('fighter_card').setCharacter(character);
                this.fighter_cards[index] = fighter_card;

                var row = parseInt(index / 3), col = index % 3;
                fighter_card.setPosition(-515 + 150*col, 180 - 198*row);
                index ++;
            }.bind(this), 50 * i);
        }

        this.node.on('characterSelected', this.characterSelected_slot = function (character) {
            if ( this.start_btn.active == false ) {
                return ;
            }
            this.selected_character_img.active = true;
            for ( var i = 0 ; i < g_character_stats.length ; ++ i ) {
                this.fighter_cards[i].getComponent('fighter_card').setSelected(g_character_stats[i].name == character.name);
            }
            this.current_character = character;
            this.selected_character_img.getComponent(cc.Sprite).spriteFrame = g_assets['character/pose/' + character.name];
        }, this);

        this.select_btn.on('mouseup', this.select_btn_click_slot = function () {
        }, this);

        this.start_btn.on('mouseup', this.start_btn_click_slot = function () {
            if ( this.current_character != null ) {
                this.start_btn.active = false;
                
                this.review.active = true;
                this.character_img.getComponent(cc.Sprite).spriteFrame = g_assets['character/pose/' + this.current_character.name];
                var review_anim = this.review.getComponent(cc.Animation);
                review_anim.play('review');
            }
        }, this);

        var review_anim = this.review.getComponent(cc.Animation);
        review_anim.on('finished', this.review_anim_slot = function () {
            var opponents = [];
            for ( var i = 0 ; i < g_character_stats.length ; ++ i ) {
                if ( g_character_stats[i].name != this.current_character.name ) {
                    opponents.push(g_character_stats[i]);
                }
            }
            opponents = opponents.sort(function (a, b) {
                return parseInt(Math.random()*2) == 0 ? 5 : -5;
            });
            this.show_silhouette_timeout = Array(opponents.length);
            var index = 0;
            for ( var i = 0 ; i < opponents.length ; ++ i ) {
                this.show_silhouette_timeout[i] = setTimeout(function () {
                    var character = opponents[index];
                    this.silhouettes[index].getComponent('silhouette').setCharacter(character);
                    this.silhouettes[index].getComponent('silhouette').show();
                    index ++;
                }.bind(this), 100 * i);
            }

            this.woo_audio_interval = setInterval(function () {
                var volume = cc.audioEngine.getVolume(g_wooAudioID);
                cc.audioEngine.setVolume(g_wooAudioID, volume - 0.01);
            }, 300);

            this.start_match_timeout = setTimeout(function () {
                clearInterval(this.woo_audio_interval);
                cc.audioEngine.setVolume(g_wooAudioID, 0.0);
                g_wooTime = cc.audioEngine.getCurrentTime(g_wooAudioID);
                cc.audioEngine.stop(g_wooAudioID);
                g_wooAudioID = -1;

                g_wrestlers = [];
                g_wrestlers = JSON.parse(JSON.stringify(g_character_stats));
                for ( var i = 0 ; i < g_wrestlers.length ; ++ i ) {
                    if ( g_wrestlers[i].name == this.current_character.name ) {
                        g_character = {};
                        g_character = g_wrestlers[i];
                    }
                    g_wrestlers[i].dead = false;
                }
                g_rank = 0;
                cc.director.loadScene('match_scene');
            }.bind(this), 3000);
        }, this);

        var silhouette_pos = [[-480, -350], [-515, -100], [-430, 150], [-150, 140], [150, 140], [430, 150], [515, -100], [480, -350]];
        this.silhouettes = Array(g_character_stats.length - 1);
        for ( var i = 0 ; i < g_character_stats.length - 1 ; ++ i ) {
            var silhouette = cc.instantiate(this.silhouettePrefab);
            this.review.addChild(silhouette);
            this.silhouettes[i] = silhouette;
            silhouette.setPosition(silhouette_pos[i][0], silhouette_pos[i][1]);
        }

        this.selected_character_img.active = false;
        this.review.zIndex = 101;
        this.review.active = false;
    },

    onDisable () {
        var review_anim = this.review.getComponent(cc.Animation);
        review_anim.stop('review');
        review_anim.off('finished', this.review_anim_slot, this);
    },

    onDestroy () {
        window.removeEventListener('resize', g_window_resize_slot);
        for ( var i = 0 ; i < this.create_fighter_card_timeout.length ; ++ i ) {
            clearTimeout(this.create_fighter_card_timeout[i]);
        }
        this.node.off('characterSelected', this.characterSelected_slot, this);
        this.select_btn.off('mouseup', this.select_btn_click_slot, this);
        this.start_btn.off('mouseup', this.start_btn_click_slot, this);

        clearInterval(this.woo_audio_interval);
        clearTimeout(this.start_match_timeout);
        for ( var i = 0 ; i < this.show_silhouette_timeout.length ; ++ i ) {
            clearTimeout(this.show_silhouette_timeout[i]);
        }
    }
});
