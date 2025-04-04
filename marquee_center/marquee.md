### MarqueeManager 使用說明

`MarqueeManager` 是一個 JavaScript 類，用於創建和管理跑馬燈效果的訊息顯示區域。你可以透過程式控制其外觀和行為，例如透明度、邊框、字型大小等。以下是詳細的使用方法。

#### 1. 初始化

要使用 `MarqueeManager`，需要在 HTML 中定義一個容器元素（例如 `<div id="msgDiv">`），然後在 JavaScript 中實例化它。

##### 語法：

```javascript
const marquee = new MarqueeManager(containerId, options);
```

- **containerId**: 容器的 HTML 元素 ID（字串），例如 `'msgDiv'`。
- **options**: 可選的配置對象，包含以下屬性（若未提供，使用預設值）：
  - `borders`: 邊框顯示選項（陣列），預設 `['bottom']`。
    - 可選值：`['all']`（全邊框）、`[]`（無邊框）、或 `['left']`、`['top']`、`['right']`、`['bottom']` 的任意組合。
  - `width`: 邊框寬度（像素），預設 `2`。
  - `color`: 邊框顏色（CSS 顏色值），預設 `'blue'`。
  - `moveSpeed`: 動畫速度（秒），預設 `1`。
  - `fontSize`: 字型大小（像素），預設 `48`。
  - `opacity`: 背景透明度（0 到 1），預設 `0`（完全透明）。

##### 範例：

```javascript
const marquee = new MarqueeManager('msgDiv', {
    moveSpeed: 1,
    fontSize: 50,
    borders: ['bottom'],
    width: 2,
    color: 'blue',
    opacity: 0,
    onButtonClick: (id, button) => console.log(`訊息 ID ${id} 的按鈕 '${button}' 被按下`)
});
```

---

#### 2. 添加訊息

透過 `addMessage` 方法添加跑馬燈訊息。

##### 語法：

```javascript
const messageId = marquee.addMessage(messageDict);
```

- **messageDict**: 訊息配置對象，包含以下屬性：
  - `id`: 訊息的唯一識別符（字串，可選，若未提供自動生成）。
  - `text`: 訊息文字（字串），預設空字串。
  - `seconds`: 訊息停留時間（秒），預設 `2`。
  - `button`: 按鈕類型（字串），預設空字串（無按鈕）。
    - 可選值：`'Enter'`（單一按鈕）、`'YesNo'`（是/否按鈕）、`'YesNoCan'`（是/否/取消按鈕）。
  - `onClick`: 點擊訊息時的回調函數（可選）。
- **返回值**: 訊息的 ID（字串）。

##### 範例：

```javascript
const id1 = marquee.addMessage({ id: 'msg1', text: '第一則訊息', seconds: 3 });
const id2 = marquee.addMessage({ text: '第二則訊息', button: 'YesNo' });
```

---

#### 3. 移除訊息

透過 `removeMessage` 方法移除特定訊息。

##### 語法：

```javascript
marquee.removeMessage(id);
```

- **id**: 要移除的訊息 ID（字串）。

##### 範例：

```javascript
marquee.removeMessage('msg1');
```

---

#### 4. 更新訊息

透過 `updateMessage` 方法修改現有訊息。

##### 語法：

```javascript
marquee.updateMessage(id, newMessageDict);
```

- **id**: 要更新的訊息 ID（字串）。
- **newMessageDict**: 新的訊息配置對象，屬性與 `addMessage` 相同，未提供的屬性保持不變。

##### 範例：

```javascript
marquee.updateMessage('msg1', { text: '第一則訊息已修改', seconds: 4 });
```

---

#### 5. 控制透明度

透過 `setOpacity` 方法調整 `#msgDiv` 的背景透明度。

##### 語法：

```javascript
marquee.setOpacity(opacity);
```

- **opacity**: 透明度值（0 到 1 之間的數字）。
  - `0`: 完全透明。
  - `0.5`: 半透明。
  - `1`: 不透明。

##### 範例：

```javascript
marquee.setOpacity(0);   // 透明
marquee.setOpacity(0.5); // 半透明
marquee.setOpacity(1);   // 不透明
```

---

#### 6. 控制邊框

透過 `updateBorder` 方法動態調整邊框顯示。

##### 語法：

```javascript
marquee.updateBorder(borders, width, color);
```

- **borders**: 邊框顯示選項（陣列）。
  - `['all']`: 全邊框。
  - `[]`: 無邊框。
  - `['left']`, `['top']`, `['right']`, `['bottom']` 或其組合。
- **width**: 邊框寬度（像素，可選），預設 `2`。
- **color**: 邊框顏色（CSS 顏色值，可選），預設 `'blue'`。

##### 範例：

```javascript
marquee.updateBorder(['all']);           // 全邊框
marquee.updateBorder([]);               // 無邊框
marquee.updateBorder(['left', 'top']);  // 只顯示左邊和上邊
marquee.updateBorder(['bottom'], 4, 'red'); // 下邊框，4px 紅色
```

---

#### 7. 控制字型大小

透過 `setFontSize` 方法調整訊息的字型大小，並自動調整容器高度（字型大小 + 上下各 10px）。

##### 語法：

```javascript
marquee.setFontSize(newSize);
```

- **newSize**: 字型大小（像素）。

##### 範例：

```javascript
marquee.setFontSize(60); // 字型設為 60px，容器高度自動調整為 80px
```

---

#### 8. 控制動畫速度

透過 `setSpeed` 方法調整訊息進入和離開的動畫速度。

##### 語法：

```javascript
marquee.setSpeed(newSpeed);
```

- **newSpeed**: 動畫時間（秒）。

##### 範例：

```javascript
marquee.setSpeed(2); // 動畫速度設為 2 秒
```

---

#### 9. HTML 結構要求

確保 HTML 中有一個帶有指定 ID 的容器元素，並載入必要的 CSS 和 JS 檔案。

##### 範例 HTML：

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="ai_marquee4.css">
    <style>
        #msgDiv {
            width: 100%;
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            white-space: nowrap;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
    </style>
</head>
<body>
    <div id="msgDiv"></div>
    <script src="ai_marquee4.js"></script>
    <script>
        const marquee = new MarqueeManager('msgDiv', { fontSize: 50, opacity: 0 });
        marquee.addMessage({ text: '測試訊息', seconds: 3 });
    </script>
</body>
</html>
```

---

#### 10. 注意事項

- **透明度背景色**: 目前 `setOpacity` 使用灰色（`rgba(240, 240, 240, opacity)`）作為基礎色。若需自訂顏色，可修改 `setOpacity` 方法中的 RGB 值。
- **最大訊息數**: 預設最多 10 則訊息，超過時最早的訊息會被移除（可修改 `maxMessages` 屬性）。
- **按鈕回調**: 若訊息帶有按鈕，需在 `options.onButtonClick` 中定義回調函數，接收 `id` 和 `button` 參數。

---

### 完整範例

以下是一個結合所有功能的範例：

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="ai_marquee4.css">
    <style>
        #msgDiv {
            width: 100%;
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            white-space: nowrap;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
    </style>
</head>
<body>
    <div id="msgDiv"></div>

    <div style="padding: 20px;">
        <button onclick="marquee.setOpacity(0)">透明</button>
        <button onclick="marquee.setOpacity(0.5)">半透明</button>
        <button onclick="marquee.setOpacity(1)">不透明</button>
        <button onclick="marquee.updateBorder(['all'])">全邊框</button>
        <button onclick="marquee.updateBorder([])">無邊框</button>
        <button onclick="marquee.setFontSize(60)">字型 60px</button>
        <button onclick="marquee.setSpeed(2)">速度 2s</button>
    </div>

    <script src="ai_marquee4.js"></script>
    <script>
        const marquee = new MarqueeManager('msgDiv', {
            moveSpeed: 1,
            fontSize: 50,
            borders: ['bottom'],
            width: 2,
            color: 'blue',
            opacity: 0,
            onButtonClick: (id, button) => console.log(`ID: ${id}, Button: ${button}`)
        });

        marquee.addMessage({ id: 'msg1', text: '第一則訊息', seconds: 3 });
        marquee.addMessage({ id: 'msg2', text: '第二則訊息', button: 'YesNo' });
    </script>
</body>
</html>
```

---
