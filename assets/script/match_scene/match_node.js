cc.Class({
    extends: cc.Component,

    properties: {
        round_cardPrefab: {
            default: null,
            type: cc.Prefab
        },
        round_card_list: null,
        
        idle_stancePrefab: {
            default: null,
            type: cc.Prefab
        },
        idle_stance_list: null,
        
        round: 0,
        round_display: cc.Node,
        round_text: cc.Node,
        round_anim_slot: null,

        aliveCount: 0,

        ref_node: cc.Node,

        box_node: cc.Node,
        stance1: cc.Node,
        stance2: cc.Node,
        attack:cc.Node,
        react:cc.Node,
        sound_hit: cc.Node,
        sound_miss: cc.Node,
        sound_timeout: null,
        
        review_timeout: null,
        playRound_timeout: null,
        startRound_timeout: null,
        round_card_select_turn_anim_timeout: null,
        round_card_select_target_anim_timeout: null,
        box_anim_timeout: null,
        continueMove_timeout: null,
        quitMatch_timeout: null,

        match_music: cc.Node,
        action_back: cc.Node,
        normal_btn: cc.Node,
        fast_btn: cc.Node,
        super_fast_btn: cc.Node,

        normal_btn_click_slot: null,
        fast_btn_click_slot: null,
        super_fast_btn_click_slot: null
    },

    onLoad () {
        this.round_card_list = Array(g_character_stats.length);
        for ( var i = 0 ; i < g_character_stats.length ; ++ i ) {
            var round_card = cc.instantiate(this.round_cardPrefab);
            this.node.addChild(round_card);
            this.round_card_list[i] = round_card;
            this.round_card_list[i].active = false;
        }

        var idle_stance_stats = [
            {x: 0, y: -200, scale: 0.4}, {x: -510, y: -250, scale: 0.45}, {x: -400, y: -200, scale: 0.4}, {x: -300, y: -180, scale: 0.35}, {x: -210, y: -130, scale: 0.3}
        ];
        this.idle_stance_list = Array(g_wrestlers.length);
        for ( var i = 0 ; i < g_wrestlers.length ; ++ i ) {
            var idle_stance = cc.instantiate(this.idle_stancePrefab);
            this.node.addChild(idle_stance);
            
            if ( i == 0 ) {
                var stat = JSON.parse(JSON.stringify(idle_stance_stats[0]));
                idle_stance.zIndex = g_wrestlers.length - i;
                idle_stance.setPosition(stat.x, stat.y);
                idle_stance.getComponent('idle_stance').setIdleScale(stat.scale);
                idle_stance.getComponent('idle_stance').setCharacter(g_wrestlers[i]);
                this.idle_stance_list[i] = idle_stance;
                continue;
            }
            
            var row = parseInt((i+1) / 2);
            var col = (i+1) % 2;
            var stat = JSON.parse(JSON.stringify(idle_stance_stats[row]));
            if ( col ) {
                stat.x = -stat.x;
                stat.scale = -stat.scale;
            }
            idle_stance.zIndex = g_wrestlers.length - i;
            idle_stance.setPosition(stat.x, stat.y);
            idle_stance.getComponent('idle_stance').setIdleScale(stat.scale);
            idle_stance.getComponent('idle_stance').setCharacter(g_wrestlers[i]);
            this.idle_stance_list[i] = idle_stance;
        }

        this.round_display.active = false;
        this.box_node.active = false;
        this.stance1.active = false;
        this.stance2.active = false;
        this.attack.active = false;
        this.react.active = false;

        this.round = 1;
        this.playRound();

        this.action_back.zIndex = this.normal_btn.zIndex = this.fast_btn.zIndex = this.super_fast_btn.zIndex = 100;
        this.normal_btn.on('mouseup', this.slow_btn_click_slot = function () {
            g_speedUp = false;
        }, this);
        this.fast_btn.on('mouseup', this.fast_btn_click_slot = function () {
            g_speedUp = true;
        }, this);
        this.super_fast_btn.on('mouseup', this.super_fast_btn_click_slot = function () {
            g_skip = true;
        }, this);

        this.match_music.getComponent(cc.AudioSource).clip = g_assets['match_scene/music/match_music'];
        this.match_music.getComponent(cc.AudioSource).loop = true;
        this.match_music.getComponent(cc.AudioSource).play();
    },

    onDisable () {
        this.match_music.getComponent(cc.AudioSource).stop();
    },

    onDestroy () {
        clearTimeout(this.review_timeout);
        clearTimeout(this.playRound_timeout);
        clearTimeout(this.startRound_timeout);
        clearTimeout(this.round_card_select_turn_anim_timeout);
        clearTimeout(this.round_card_select_target_anim_timeout);
        clearTimeout(this.box_anim_timeout);
        clearTimeout(this.sound_timeout);
        clearTimeout(this.continueMove_timeout);
        clearTimeout(this.quitMatch_timeout);

        this.normal_btn.off('mouseup', this.normal_btn_click_slot, this);
        this.fast_btn.off('mouseup', this.fast_btn_click_slot, this);
        this.super_fast_btn.off('mouseup', this.super_fast_btn_click_slot, this);
    },

    playRound: function () {
        var aliveCount = 0;
        for ( var i = 0 ; i < g_wrestlers.length ; ++ i ) {
            if ( !g_wrestlers[i].dead ) {
                g_winner = {};
                g_winner = g_wrestlers[i];
                ++ aliveCount;
            }
        }
        if ( aliveCount == 1 ) {
            this.quitMatch_timeout = setTimeout(function () {
                this.node.parent.emit('nodeFinished', 'match_node');
            }.bind(this), 500);
            return ;
        }

        if ( g_skip ) {
            g_wrestlers = g_wrestlers.sort(function (a, b) {
                return a.dead ? 5 : (b.dead ? -5 : (a.speed < b.speed ? 5 : (a.speed > b.speed ? -5 : (parseInt(Math.random()*2) == 1 ? 5 : -5))));
            });
            this.aliveCount = aliveCount;
            this.move(0);
            return ;
        }

        for ( var i = 0 ; i < g_wrestlers.length ; ++ i ) {
            this.idle_stance_list[i].active = true;
        }
        this.box_node.active = false;
        this.ref_node.active = false;
        this.review_timeout = setTimeout(function () {
            for ( var i = 0 ; i < g_wrestlers.length ; ++ i ) {
                this.idle_stance_list[i].active = false;
            }
            this.box_node.active = true;
            this.ref_node.active = true;
            if ( g_speedUp ) {
                this.round_display.active = true;
                this.round_text.getComponent(cc.Label).string = "Round " + this.round;
                this.box_node.active = true;
                g_wrestlers = g_wrestlers.sort(function (a, b) {
                    return a.dead ? 5 : (b.dead ? -5 : (a.speed < b.speed ? 5 : (a.speed > b.speed ? -5 : (parseInt(Math.random()*2) == 1 ? 5 : -5))));
                });
                for ( var i  = 0 ; i < g_wrestlers.length ; ++ i ) {
                    if ( !g_wrestlers[i].dead ) {
                        this.round_card_list[i].active = true;
                        this.round_card_list[i].getComponent('round_card').setRank(i + 1);
                        this.round_card_list[i].getComponent('round_card').setCharacter(g_wrestlers[i]);
                    } else {
                        this.round_card_list[i].active = false;
                    }
                }
                for ( var i = 0 ; i < aliveCount ; ++ i ) {
                    this.round_card_list[i].setPosition(aliveCount%2==0 ? (60-120*parseInt(aliveCount/2)+120*i) : (-120*parseInt(aliveCount/2)+120*i),325);
                }
                this.aliveCount = aliveCount;
                this.move(0);
                return ;
            }
            this.playRound_timeout = setTimeout(function () {
                this.round_display.active = true;
                this.round_text.getComponent(cc.Label).string = "Round " + this.round;
                var round_anim = this.round_display.getComponent(cc.Animation);
                round_anim.play("round_display");
                this.startRound_timeout = setTimeout(function () {
                    this.box_node.active = true;
                    g_wrestlers = g_wrestlers.sort(function (a, b) {
                        return a.dead ? 5 : (b.dead ? -5 : (a.speed < b.speed ? 5 : (a.speed > b.speed ? -5 : (parseInt(Math.random()*2) == 1 ? 5 : -5))));
                    });
                    for ( var i  = 0 ; i < g_wrestlers.length ; ++ i ) {
                        if ( !g_wrestlers[i].dead ) {
                            this.round_card_list[i].active = true;
                            this.round_card_list[i].getComponent('round_card').setRank(i + 1);
                            this.round_card_list[i].getComponent('round_card').setCharacter(g_wrestlers[i]);
                        } else {
                            this.round_card_list[i].active = false;
                        }
                    }
                    for ( var i = 0 ; i < aliveCount ; ++ i ) {
                        this.round_card_list[i].setPosition(aliveCount%2==0 ? (60-120*parseInt(aliveCount/2)+120*i) : (-120*parseInt(aliveCount/2)+120*i),325);
                    }
                    this.aliveCount = aliveCount;
                    this.move(0);
                }.bind(this), round_anim.defaultClip.duration * 1000 + 500);
            }.bind(this), 500);
        }.bind(this), g_speedUp ? 500 : 3000);
    },

    move: function (index) {
        if ( index == this.aliveCount ) {
            ++ this.round;
            this.playRound();
            return ;
        }
        if ( g_wrestlers[index].dead ) {
            this.move(++ index);
            return ;
        }

        if ( g_skip ) {
            var alive_wrestlerIndexes = [];
            for ( var i = 0 ; i < this.aliveCount ; ++ i ) {
                if ( !g_wrestlers[i].dead && i!=index ) {
                    alive_wrestlerIndexes.push(i);
                }
            }
            var random_target_index = alive_wrestlerIndexes[parseInt(Math.random()*alive_wrestlerIndexes.length)];

            var attackResult = g_wrestling_api_attack(g_wrestlers[index], g_wrestlers[random_target_index]);
            var connected = attackResult.connected;
            if ( connected ) {
                if ( g_wrestlers[random_target_index].health == 0 ) {
                    if ( !g_character.dead ) {
                        ++ g_rank;
                    }
                    g_elimination_order.push(g_wrestlers[random_target_index].name);
                    g_wrestlers[random_target_index].dead = true;
                }
                this.move(++ index);
            } else {
                this.move(++ index);
            }
            return ;
        }

        this.stance1.getComponent(cc.Sprite).spriteFrame = g_assets['character/stance/' + g_wrestlers[index].name];
        this.stance1.setPosition(-200, -200);
        this.stance1.setScale(0.4, 0.4);
        this.attack.getComponent(cc.Sprite).spriteFrame = g_assets['character/attack/' + g_wrestlers[index].name];
        var alive_wrestlerIndexes = [];
        for ( var i = 0 ; i < this.aliveCount ; ++ i ) {
            if ( !g_wrestlers[i].dead && i!=index ) {
                alive_wrestlerIndexes.push(i);
            }
        }
        var random_target_index = alive_wrestlerIndexes[parseInt(Math.random()*alive_wrestlerIndexes.length)];
        this.stance2.getComponent(cc.Sprite).spriteFrame = g_assets['character/stance/' + g_wrestlers[random_target_index].name];
        this.react.getComponent(cc.Sprite).spriteFrame = g_assets['character/react/' + g_wrestlers[random_target_index].name];

        var card_anim = this.round_card_list[index].getComponent(cc.Animation);

        if ( g_speedUp ) {
            this.stance1.active = true;
            this.stance1.opacity = 255;
            this.stance2.active = true;
            this.stance2.opacity = 255;
            var box_anim = this.box_node.getComponent(cc.Animation);
            
            var clips = box_anim.getClips();
            var attack_clip = clips[2];
            var missed_clip = clips[3];
            if ( g_wrestlers[index].name == 'Mad Mike' ) {
                attack_clip = clips[6];
                missed_clip = clips[7];
            }
            var attack_clip_duration = attack_clip.duration * 1000;
            var missed_clip_duration = missed_clip.duration * 1000;
        
            var attackResult = g_wrestling_api_attack(g_wrestlers[index], g_wrestlers[random_target_index]);
            var connected = attackResult.connected;

            var target_anim = this.round_card_list[random_target_index].getComponent(cc.Animation);
            this.ref_node.setScale(1, 1);
            if (g_wrestling_api_resists(g_wrestlers[random_target_index].style, g_wrestlers[index].style)) {
                cc.log(g_wrestlers[random_target_index].name + ' was resistent to ' + g_wrestlers[index].name);
                this.round_card_list[random_target_index].getComponent('round_card').setShield(true);
            }
            this.ref_node.setScale(1, 1);
            if ( connected ) {
                this.attack.active = true;
                this.react.active = true;
                if ( g_wrestlers[index].name == 'Mad Mike' ) {
                    box_anim.play('attack_mm_fast');
                    this.sound_timeout = setTimeout(function () {
                        this.sound_hit.getComponent(cc.AudioSource).play();
                        target_anim.play('get_damage_fast');
                        this.ref_node.setScale(-1, 1);
                    }.bind(this), 260);
                } else {
                    box_anim.play('attack_fast');
                    this.sound_timeout = setTimeout(function () {
                        this.sound_hit.getComponent(cc.AudioSource).play();
                        target_anim.play('get_damage_fast');
                        this.ref_node.setScale(-1, 1);
                    }.bind(this), 120);
                }
                this.continueMove_timeout = setTimeout(function () {
                    this.stance1.active = false;
                    this.stance2.active = false;
                    this.attack.active = false;
                    this.react.active = false;
                    this.round_card_list[random_target_index].getComponent('round_card').setShield(false);
                    this.round_card_list[random_target_index].getComponent('round_card').setCharacter(g_wrestlers[random_target_index]);
                    if ( g_wrestlers[random_target_index].health == 0 ) {
                        if ( !g_character.dead ) {
                            ++ g_rank;
                        }
                        g_elimination_order.push(g_wrestlers[random_target_index].name);
                        g_wrestlers[random_target_index].dead = true;
                        this.round_card_list[random_target_index].getComponent('round_card').setDead(true);
                    }
                    this.move(++ index);
                }.bind(this), attack_clip_duration);
            } else {
                this.attack.active = true;
                this.react.active = true;
                if ( g_wrestlers[index].name == 'Mad Mike' ) {
                    box_anim.play('missed_mm_fast');
                    this.sound_timeout = setTimeout(function () {
                        this.sound_miss.getComponent(cc.AudioSource).play();
                    }.bind(this), 260);
                } else {
                    box_anim.play('missed_fast');
                    this.sound_timeout = setTimeout(function () {
                        this.sound_miss.getComponent(cc.AudioSource).play();
                    }.bind(this), 120);
                }
                this.continueMove_timeout = setTimeout(function () {
                    this.stance1.active = false;
                    this.stance2.active = false;
                    this.attack.active = false;
                    this.react.active = false;
                    this.round_card_list[random_target_index].getComponent('round_card').setShield(false);
                    this.move(++ index);
                }.bind(this), missed_clip_duration);
            }
            return ;
        }
        
        var target_anim = this.round_card_list[random_target_index].getComponent(cc.Animation);
        var clips = card_anim.getClips();
        var select_turn_clip = clips[0];
        var select_turn_clip_duration = select_turn_clip.duration * 1000;
        var select_target_clip = clips[1];
        var select_target_clip_duration = select_target_clip.duration * 1000;

        card_anim.play('select_turn');
        this.round_card_list[index].getComponent('round_card').playAnim();
        this.round_card_select_turn_anim_timeout = setTimeout(function () {
            this.stance1.active = true;
            this.stance1.opacity = 255;
            this.ref_node.setScale(1, 1);
            target_anim.play('select_target');
            this.round_card_list[random_target_index].getComponent('round_card').playAnim();
            if (g_wrestling_api_resists(g_wrestlers[random_target_index].style, g_wrestlers[index].style)) {
                cc.log(g_wrestlers[random_target_index].name + ' was resistent to ' + g_wrestlers[index].name);
                this.round_card_list[random_target_index].getComponent('round_card').setShield(true);
            }
            this.round_card_select_target_anim_timeout = setTimeout(function () {
                this.stance2.active = true;
                this.stance2.opacity = 255;
                this.ref_node.setScale(-1, 1);
                this.box_anim_timeout = setTimeout(function () {
                    var box_anim = this.box_node.getComponent(cc.Animation);
                    var clips = box_anim.getClips();
                    var attack_clip = clips[0];
                    var missed_clip = clips[1];
                    if ( g_wrestlers[index].name == 'Mad Mike' ) {
                        attack_clip = clips[4];
                        missed_clip = clips[5];
                    }
                    var attack_clip_duration = attack_clip.duration * 1000;
                    var missed_clip_duration = missed_clip.duration * 1000;
                
                    var attackResult = g_wrestling_api_attack(g_wrestlers[index], g_wrestlers[random_target_index]);
                    var connected = attackResult.connected;
                    if ( connected ) {
                        this.attack.active = true;
                        this.react.active = true;
                        this.round_card_list[random_target_index].getComponent('round_card').setDamage(attackResult.damage);
                        if ( g_wrestlers[index].name == 'Mad Mike' ) {
                            box_anim.play('attack_mm');
                            this.sound_timeout = setTimeout(function () {
                                this.sound_hit.getComponent(cc.AudioSource).play();
                                target_anim.play('get_damage');
                            }.bind(this), 880);
                        } else {
                            box_anim.play('attack');
                            this.sound_timeout = setTimeout(function () {
                                this.sound_hit.getComponent(cc.AudioSource).play();
                                target_anim.play('get_damage');
                            }.bind(this), 400);
                        }
                        this.continueMove_timeout = setTimeout(function () {
                            this.stance1.active = false;
                            this.stance2.active = false;
                            this.attack.active = false;
                            this.react.active = false;
                            this.round_card_list[random_target_index].getComponent('round_card').setShield(false);
                            this.round_card_list[random_target_index].getComponent('round_card').setCharacter(g_wrestlers[random_target_index]);
                            if ( g_wrestlers[random_target_index].health == 0 ) {
                                if ( !g_character.dead ) {
                                    ++ g_rank;
                                }
                                g_elimination_order.push(g_wrestlers[random_target_index].name);
                                g_wrestlers[random_target_index].dead = true;
                                this.round_card_list[random_target_index].getComponent('round_card').setDead();
                            }
                            this.move(++ index);
                        }.bind(this), attack_clip_duration + 500);
                    } else {
                        this.attack.active = true;
                        this.react.active = true;
                        if ( g_wrestlers[index].name == 'Mad Mike' ) {
                            box_anim.play('missed_mm');
                            this.sound_timeout = setTimeout(function () {
                                this.sound_miss.getComponent(cc.AudioSource).play();
                            }.bind(this), 880);
                        } else {
                            box_anim.play('missed');
                            this.sound_timeout = setTimeout(function () {
                                this.sound_miss.getComponent(cc.AudioSource).play();
                            }.bind(this), 400);
                        }
                        this.continueMove_timeout = setTimeout(function () {
                            this.stance1.active = false;
                            this.stance2.active = false;
                            this.attack.active = false;
                            this.react.active = false;
                            this.round_card_list[random_target_index].getComponent('round_card').setShield(false);
                            this.move(++ index);
                        }.bind(this), missed_clip_duration + 500);
                    }
                }.bind(this), 500);
            }.bind(this), select_target_clip_duration + 500);
        }.bind(this), select_turn_clip_duration + 500);
    }
});
