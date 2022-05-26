cc.Class({
    extends: cc.Component,

    properties: {
        entrance_node: cc.Node,
        match_node: cc.Node,
        result_node: cc.Node,

        nodeFinished_slot: null
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

        this.node.on('nodeFinished', this.nodeFinished_slot = function (node_name) {
            if ( node_name == 'entrance' ) {
                this.entrance_node.active = false;
                this.match_node.active = true;
            } else if ( node_name == 'match_node' ) {
                this.match_node.active = false;
                this.result_node.active = true;
            }
        }, this);

        this.entrance_node.active = true;
        this.match_node.active = false;
        this.result_node.active = false;

        g_speedUp = false;
        g_skip = false;
        g_elimination_order = [];
    },

    onDestroy () {
        this.node.off('nodeFinished', this.nodeFinished_slot, this);
    }
});
