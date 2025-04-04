class MarqueeManager {
    constructor(containerId, options = { 
        moveSpeed: 1,
        fontSize: 20,
        lineHeight: 1.2
    }) {
        this.container = document.getElementById(containerId);
        this.messages = []; // 儲存所有訊息
        this.activeMessages = []; // 目前畫面上顯示的訊息
        this.moveSpeed = options.moveSpeed || 1; // 移動速度
        this.fontSize = options.fontSize || 20; // 字體大小
        this.lineHeight = options.lineHeight || 1.2; // 行高倍數
        this.currentIndex = 0; // 當前訊息索引
        this.isAnimating = false; // 是否正在動畫中

        // 計算行距和最大行數
        const baseLineSpacing = this.fontSize * this.lineHeight;
        this.maxLines = Math.floor(this.container.offsetHeight / baseLineSpacing);
        const totalHeight = this.container.offsetHeight;
        const usedHeight = this.maxLines * this.fontSize;
        const remainingSpace = totalHeight - usedHeight;
        const spacingCount = this.maxLines - 1;
        const extraSpacing = spacingCount > 0 ? remainingSpace / spacingCount : 0;
        this.lineSpacing = this.fontSize + extraSpacing; // 實際行距
        this.defaultSeconds = 3; // 每條訊息停留時間（秒）
    }

    addMessage(messageDict, position = 'append') {
        const msgId = messageDict.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const msg = {
            id: msgId,
            text: messageDict.text || '',
            color: messageDict.color || 'black' // 預設黑色
        };
        
        if (position === 'insert') {
            this.messages.unshift(msg);
            if (this.messages.length > 1) {
                this.currentIndex = Math.min(this.currentIndex + 1, this.messages.length - 1);
            }
        } else {
            this.messages.push(msg);
        }
        
        if (!this.isAnimating) {
            this.render();
        }
        return msgId;
    }

    updateMessage(id, newMessageDict) {
        const msg = this.messages.find(msg => msg.id === id);
        if (msg) {
            msg.text = newMessageDict.text !== undefined ? newMessageDict.text : msg.text;
            msg.color = newMessageDict.color !== undefined ? newMessageDict.color : msg.color;
            const activeMsg = this.activeMessages.find(m => m.id === msg.id);
            if (activeMsg) {
                activeMsg.text = msg.text;
                activeMsg.color = msg.color;
            }
        }
    }

    removeMessage(id) {
        const index = this.messages.findIndex(msg => msg.id === id);
        if (index !== -1) {
            this.messages.splice(index, 1);
            if (index <= this.currentIndex) {
                this.currentIndex = Math.max(0, this.currentIndex - 1);
            }
        }
        this.activeMessages = this.activeMessages.filter(msg => msg.id !== id);

        if (this.messages.length <= this.maxLines) {
            this.currentIndex = 0;
            this.activeMessages = [];
            this.isAnimating = false;
            this.render();
        } else if (!this.isAnimating) {
            this.render();
        }
    }

    render() {
        if (this.isAnimating || this.messages.length === 0) return;
        this.isAnimating = true;

        // 如果畫面上沒有訊息，加入第一條到第1行
        if (this.activeMessages.length === 0 && this.messages.length > 0) {
            this.activeMessages.push({ 
                ...this.messages[this.currentIndex], 
                position: -this.lineSpacing // 從頂部外進入
            });
        }

        // 清空容器並渲染所有活躍訊息
        this.container.innerHTML = '';
        this.activeMessages.forEach((msg, index) => {
            const span = document.createElement('span');
            span.className = 'marquee';
            span.textContent = msg.text;
            span.dataset.id = msg.id;
            span.style.fontSize = `${this.fontSize}px`;
            span.style.lineHeight = `${this.lineHeight}`;
            span.style.color = msg.color;

            const startY = msg.position;
            const targetY = index * this.lineSpacing; // 按順序排列

            span.style.setProperty('--start-y', `${startY}px`);
            span.style.setProperty('--target-y', `${targetY}px`);
            span.style.top = `${startY}px`;
            span.style.animation = `moveToPosition ${this.moveSpeed}s linear forwards`;

            this.container.appendChild(span);
            
            msg.position = targetY; // 更新訊息位置
        });

        // 移除超出畫面的訊息
        this.activeMessages = this.activeMessages.filter(msg => msg.position < this.maxLines * this.lineSpacing);

        // 動畫結束後處理
        const delay = this.defaultSeconds + this.moveSpeed; // 停留3秒 + 移動時間
        setTimeout(() => {
            this.isAnimating = false;

            // 訊息數量小於等於 maxLines 時，最後一筆到第1行後停止
            if (this.messages.length <= this.maxLines) {
                if (this.currentIndex === this.messages.length - 1) {
                    return; // 停止動作
                }
            }

            // 加入新訊息並同步向下滾動
            let nextIndex = this.currentIndex + 1;
            if (nextIndex >= this.messages.length && this.messages.length > this.maxLines) {
                nextIndex = 0; // 循環回到第一筆
            }

            if (nextIndex < this.messages.length) {
                const nextMsg = this.messages[nextIndex];
                if (!this.activeMessages.some(msg => msg.id === nextMsg.id)) {
                    // 所有現有訊息準備向下滾動
                    this.activeMessages.forEach(msg => {
                        msg.position = msg.position; // 保持當前位置，等待同步動畫
                    });
                    // 加入新訊息到第1行
                    this.activeMessages.unshift({ 
                        ...nextMsg, 
                        position: -this.lineSpacing // 從頂部進入
                    });
                    this.currentIndex = nextIndex;
                }
            }

            // 如果畫面上有訊息或還有未顯示的訊息，繼續渲染
            if (this.activeMessages.length > 0 || this.currentIndex < this.messages.length - 1) {
                this.render();
            }
        }, delay * 1000);
    }

    setFontSize(newSize) {
        this.fontSize = newSize;
        const baseLineSpacing = this.fontSize * this.lineHeight;
        const newMaxLines = Math.floor(this.container.offsetHeight / baseLineSpacing);
        
        const totalHeight = this.container.offsetHeight;
        const usedHeight = newMaxLines * this.fontSize;
        const remainingSpace = totalHeight - usedHeight;
        const spacingCount = newMaxLines - 1;
        const extraSpacing = spacingCount > 0 ? remainingSpace / spacingCount : 0;
        this.lineSpacing = this.fontSize + extraSpacing;
        
        this.activeMessages.forEach(msg => {
            const lineIndex = Math.floor(msg.position / this.lineSpacing);
            if (lineIndex >= newMaxLines) {
                msg.position = -this.lineSpacing;
            } else {
                msg.position = lineIndex * this.lineSpacing;
            }
        });
        
        this.maxLines = newMaxLines;
        if (!this.isAnimating) this.render();
    }

    getMessageCount() {
        return this.messages.length;
    }

    hasMessage(id) {
        return this.messages.some(msg => msg.id === id);
    }
}