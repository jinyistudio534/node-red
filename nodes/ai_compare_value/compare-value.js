module.exports = function(RED) {
    function CompareValueNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // 從節點設定中獲取要比對的欄位名稱
        this.field = config.field || "payload";

        // 使用節點的 context 儲存上一次的值
        this.context = this.context();
        this.previousValue = this.context.get("previousValue") || null;

        node.on("input", function(msg) {
            // 動態獲取要比對的欄位值
            let currentValue = RED.util.getObjectProperty(msg, node.field);

            // 如果當前值與上一次值不同，則輸出並更新儲存值
            if (currentValue !== node.previousValue) {
                node.send(msg); // 輸出整個 msg
                node.previousValue = currentValue;
                node.context.set("previousValue", currentValue); // 更新儲存值
            }
            // 如果值相同，什麼都不做（不輸出）
        });

        // 節點關閉時清理（可選）
        node.on("close", function() {
            node.context.set("previousValue", null); // 重置儲存值
        });
    }
    RED.nodes.registerType("compare-value", CompareValueNode);
};