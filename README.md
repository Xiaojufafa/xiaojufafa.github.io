# 上班打卡 PWA

一个极简的工作打卡网页 App，可以部署到 GitHub Pages，然后在 iPhone Safari 中添加到主屏幕使用。

## 功能

- iPhone 原生风格界面
- 上班打卡、下班打卡
- 历史记录
- 默认本地离线存储
- 可选加密云端同步
- 支持离线访问
- 支持添加到 iPhone 主屏幕
- 支持深色模式
- 支持打卡成功震动反馈（设备和浏览器支持时）
- 支持导出 CSV

## 项目结构

```text
work-clock/
├── index.html
├── style.css
├── script.js
├── cloud-config.js
├── manifest.json
├── service-worker.js
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── README.md
```

## 本地预览

直接双击 `index.html` 可以预览界面，但 Service Worker 离线缓存通常需要通过本地服务器或 HTTPS 才能完整工作。

推荐用任意本地服务器预览，例如：

```bash
python3 -m http.server 8080
```

然后打开：

```text
http://localhost:8080
```

## 云端同步设置

云端同步是可选功能。`cloud-config.js` 为空时，应用仍然只保存在本机。

1. 在 Firebase 新建一个项目。
2. 添加一个 Web App，并复制 Firebase 配置。
3. 开启 Firestore Database。
4. 把配置填入 `cloud-config.js`：

```js
window.WORK_CLOCK_CLOUD_CONFIG = {
  firebase: {
    apiKey: '你的 apiKey',
    authDomain: '你的项目.firebaseapp.com',
    projectId: '你的项目 ID',
    appId: '你的 appId'
  },
  collectionName: 'workClockHistories'
};
```

5. 在 Firestore Rules 中加入规则：

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /workClockHistories/{backupId} {
      allow read: if true;
      allow create, update: if
        request.resource.data.app == 'work-clock' &&
        request.resource.data.version == 1 &&
        request.resource.data.encrypted.iv is string &&
        request.resource.data.encrypted.data is string;
      allow delete: if false;
    }
  }
}
```

6. 重新部署后，点击页面里的“生成”创建同步码。
7. 复制并保存同步码。另一台设备要同步同一份记录时，需要输入同一个同步码。
8. 点击“连接”，然后点击“同步云端”。

同一个同步码可以在不同设备之间同步记录。记录上传前会在浏览器里加密，建议使用不容易被猜到的同步码。

页面会显示同步位置，格式类似：

```text
Firebase: work-clock-5bb55 / workClockHistories / 生成的文档 ID
```

点击“查看数据”可以打开 Firebase Console 中对应的 Firestore 文档。文档里能看到 `app`、`version`、`clientUpdatedAt`、`updatedAt`、`encrypted` 等字段。真实打卡记录在 `encrypted.data` 中，是加密后的内容，所以看起来不是普通文字，这是正常的。

## 部署到 GitHub Pages

1. 注册或登录 GitHub。
2. 新建一个 Public 仓库，例如 `work-clock`。
3. 把本项目里的所有文件上传到仓库根目录。
4. 进入仓库 `Settings`。
5. 点击左侧 `Pages`。
6. `Build and deployment` 选择 `Deploy from a branch`。
7. `Branch` 选择 `main`，`Folder` 选择 `/(root)`。
8. 点击 `Save`。
9. 等待 GitHub Pages 自动部署完成。

部署完成后，网址通常类似：

```text
https://你的用户名.github.io/work-clock/
```

## 安装到 iPhone 主屏幕

1. 用 iPhone 的 Safari 打开 GitHub Pages 网址。
2. 点击底部分享按钮。
3. 选择“添加到主屏幕”。
4. 名称填写“工作打卡”。
5. 点击“添加”。

之后可以直接从桌面打开，体验接近普通 App。

## 数据保存在哪里

所有打卡记录保存在当前设备浏览器的 `localStorage` 中。

如果配置了 Firebase 并连接同步码，记录会加密后同步到 Firestore。
不会发送给 GitHub。

如果没有启用云端同步，清除 Safari 网站数据、换手机、或删除浏览器本地数据，历史记录可能会丢失。建议需要备份时使用页面里的“导出 CSV”。

## 更新版本

以后如果修改了 `index.html`、`style.css`、`script.js` 等文件，只需要重新上传覆盖 GitHub 仓库里的旧文件即可。

因为项目使用了 Service Worker 离线缓存，新版本发布后，已安装的 App 可能需要重新打开一次，或者点击页面底部出现的“立即更新”。
 
