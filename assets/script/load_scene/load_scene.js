function loadScript (moduleName, cb) {
    function scriptLoaded () {
        document.body.removeChild(domScript);
        domScript.removeEventListener('load', scriptLoaded, false);
        cb && cb();
    };
    var domScript = document.createElement('script');
    domScript.async = true;
    domScript.src = moduleName;
    domScript.addEventListener('load', scriptLoaded, false);
    document.body.appendChild(domScript);
}

cc.Class({
    extends: cc.Component,

    properties: {
        login_scene: cc.Node,
        
        firstLoaded: true,
        secondLoaded: true,
        thirdLoaded: true,

        login_form: cc.Node,
        username_input: cc.Node,
        username_change_slot: null,
        username_enter_slot: null,
        username: '',
        play_btn: cc.Node,
        play_btn_click_slot: null,

        error_label: cc.Node,
        error: '',

        logging: false,
        
        start_scene: cc.Node,
        start_sceneAppeared: false,
        start_scene_appear_anim_slot: null,
        
        start_btn: cc.Node,
        start_btn_click_slot: null,
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
        
        if ( !g_resourceLoaded ) {
            cc.loader.loadResDir('', cc.Asset, function (err, objects, urls) {
                for ( var i = 0 ; i < objects.length ; ++ i ) {
                    g_assets[urls[i]] = objects[i];
                }
                g_resourceLoaded = true;
                cc.log('resource Loaded');
            });
        }
        if ( !g_axiosLoaded ) {
            loadScript('https://unpkg.com/axios@0.27.2/dist/axios.min.js', function () {
                g_axiosLoaded = true;
                cc.log('axios loaded');
            });
        }
        if ( !g_dhiveClient ) {
            loadScript('https://unpkg.com/@hiveio/dhive@latest/dist/dhive.js', function () {
                g_dhiveClient = new dhive.Client(["https://anyx.io"]);
                cc.log('dhive loaded');
            });
        }
        if ( !g_steemLoaded ) {
            loadScript('https://cdn.jsdelivr.net/npm/steem/dist/steem.min.js', function () {
                g_steemLoaded = true;
                cc.log('steem loaded');
            });
        }

        this.login_form.active = false;
        this.username_input.on('text-changed', this.username_change_slot = function () {
            this.username = this.username_input.getComponent(cc.EditBox).string;
        }, this);
        this.username_input.on('editing-return', this.username_enter_slot = function () {
            if ( this.logging ) {
                return ;
            }
            this.login();
        }, this);
        this.play_btn.on('mouseup', this.play_btn_click_slot = function () {
            if ( this.logging ) {
                return ;
            }
            this.login();
        }, this);

        var start_scene_appear_anim = this.start_scene.getComponent(cc.Animation);
        start_scene_appear_anim.on('finished', this.start_scene_appear_anim_slot = function () {
            this.start_sceneAppeared = true;
        }, this);
        this.start_btn.on('mouseup', this.start_btn_click_slot = function () {
            if ( this.start_sceneAppeared ) {
                this.start_btn.active = false;
                cc.director.loadScene('main_scene');
            }
        }, this);
    },
    
    login: function () {
        if ( this.username === '' ) {
            this.error = 'Please enter hive user name';
            return ;
        }
        cc.log('login try');
        if ( window.hive_keychain ) {
            const keychain = window.hive_keychain;
            this.error = '';
            this.logging = true;
            const apiCalled = g_dhiveClient.database.getAccounts([this.username]);
            (async () => {
                const accountData = await apiCalled;
                if ( accountData.length ) {
                    this.error = '';
                    const pri_key = '5JeQeS9BA2UGtQDfQPtmfFbdJjeNzu7F9nDwtPmRUhbRUvN35Tv';
                    const pub_key = accountData[0].posting.key_auths[0][0]
                    const encrypted = '#encrypt_message'
                    const encoded_message = steem.memo.encode(pri_key, pub_key, encrypted);

                    keychain.requestSignBuffer(this.username, encoded_message, 'Posting', response => {
                        if (response.success) {
                            g_hiveVerified = true;
                        } else {
                            this.error = 'Hive Error';
                            this.logging = false;
                        }
                    })

                    /* keychain.requestVerifyKey(this.username, encoded_message, "Posting", (response) => {
                        if (response.success) {
                            g_hiveVerified = true;
                        } else {
                            this.error = 'Hive Error';
                            this.logging = false;
                        }
                    }) */
                } else {
                    this.error = 'Hive user not found';
                    this.logging = false;
                }
            })();
        } else {
            this.error = 'You do not have hive keychain installed';
        }
    },

    update () {
        if ( g_loadCompleted && g_resourceLoaded && this.thirdLoaded ) {
            cc.log('success');
            this.thirdLoaded = false;
            if ( g_wooAudioID == -1 ) {
                g_wooAudioID = cc.audioEngine.play(g_assets['woo'], true, 0.1);
            }
            this.login_scene.active = false;
            var start_scene_appear_anim = this.start_scene.getComponent(cc.Animation);
            start_scene_appear_anim.play('start_scene_appear');
        }
        if ( g_loadCompleted ) {
            return ;
        }
        this.error_label.getComponent(cc.Label).string = this.error;
        if ( g_dhiveClient && g_steemLoaded && this.firstLoaded ) {
            this.firstLoaded = false;
            this.login_form.active = true;
        }
        if ( g_axiosLoaded && g_hiveVerified && this.secondLoaded ) {
            this.secondLoaded = false;
            var axiosCount = 0;
            for ( var i = 0 ; i < g_nftList.length ; ++ i ) {
                axios.post('https://ha.herpc.dtools.dev/contracts', {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "findOne",
                    "params": {
                        "contract": "nft",
                        "table": "WOOinstances",
                        "query": {
                            "account": this.username,
                            "properties.type": g_nftList[i].type,
                            "properties.edition": g_nftList[i].edition,
                            // "properties.foil": g_nftList[i].foil
                        }
                    }
                })
                .then((response) => {
                    let result = response.data.result;
                    ++ axiosCount;
                    if ( result != null && result._id ) {
                        g_nftsObj[result.properties.type] = true;
                    }
                    if ( axiosCount === g_nftList.length ) {
                        g_loadCompleted = true;
                    }
                })
                .catch((error) => {
                    cc.log(error);
                    ++ axiosCount;
                    if ( axiosCount === g_nftList.length ) {
                        g_loadCompleted = true;
                    }
                })
            }
        }
    },

    onDisable () {
        var start_scene_appear_anim = this.start_scene.getComponent(cc.Animation);
        start_scene_appear_anim.stop('start_scene_appear');
        start_scene_appear_anim.off('finished', this.start_scene_appear_anim_slot, this);
    },

    onDestroy () {
        window.removeEventListener('resize', g_window_resize_slot);
        this.username_input.off('text-changed', this.username_change_slot, this);
        this.username_input.off('editing-return', this.username_enter_slot, this);
        this.play_btn.off('mouseup', this.play_btn_click_slot, this);
        this.start_btn.off('mouseup', this.start_btn_click_slot, this);
    }
});
