// compare-value.js
module.exports = function(RED) {
    function CompareFuncNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.field = config.field || "payload";  // 要比較的欄位
        this.code = config.code || "return msg;"; // 自訂程式碼，預設直接返回 msg
        
        // 使用 context 儲存上一次的值
        this.context = this.context();
        this.previousValue = this.context.get("previousValue") || null;

        node.on("input", function(msg) {
            try {
                // 動態獲取要比對的欄位值
                let currentValue = RED.util.getObjectProperty(msg, node.field);

                // 如果當前值與上一次值不同
                if (currentValue !== node.previousValue) {
                    // 創建執行自訂程式碼的函數
                    const userFunction = new Function('msg', 'RED', node.code);
                    
                    // 執行自訂程式碼並獲取結果
                    let result = userFunction.call(null, msg, RED);
                    
                    // 更新儲存值
                    node.previousValue = currentValue;
                    node.context.set("previousValue", currentValue);
                    
                    // 如果自訂程式碼有返回值，則輸出
                    if (result !== undefined && result !== null) {
                        node.send(result);
                    }
                }
            } catch (err) {
                node.error("Error in custom code: " + err.message, msg);
            }
        });

        node.on("close", function() {
            node.context.set("previousValue", null);
        });
    }
    RED.nodes.registerType("compare-func", CompareFuncNode);
};