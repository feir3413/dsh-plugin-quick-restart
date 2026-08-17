# dsh-plugin-quick-restart

[English](./README.md) | [简体中文](./README.zh.md)

为 DeepSeek Harness Web GUI 打造的设置菜单「快速重启」插件。

## 功能特性

- ⚡ **一键快速重启**：直接在 Web GUI 设置菜单右上角点击即可平滑重启正在运行的 DSH 服务。
- 🛡️ **防误触保护**：二次弹窗确认，避免误操作打断当前会话。
- 🔄 **自动重新连接**：智能让渡并释放本地端口，重启后前端页面 1-2 秒内自动恢复连接。
- 🌐 **双语支持**：完整支持简体中文与英文。

## 安装方法

通过 `dsh plugin` CLI 安装：

```bash
dsh plugin --profile web add dsh-plugin-quick-restart
```

或直接通过 Git 仓库安装：

```bash
dsh plugin --profile web add https://github.com/your-username/dsh-plugin-quick-restart.git
```

## 许可证

MIT
