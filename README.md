# dsh-plugin-quick-restart

[English](./README.md) | [简体中文](./README.zh.md)

Quick Restart button in Settings menu for DeepSeek Harness Web GUI.

## Features

- ⚡ **One-Click Restart**: Restart the running DeepSeek Harness server in-place from the Web GUI Settings menu.
- 🛡️ **Risk Protection**: Built-in modal confirmation to prevent accidental clicks.
- 🔄 **Auto Reconnect**: Seamlessly re-binds port and automatically reconnects in 1-2 seconds.
- 🌐 **i18n Ready**: Full Chinese and English localization.

## Installation

```bash
dsh plugin --profile web add dsh-plugin-quick-restart
```

Or install from (Recommended. No need to download):

```bash
dsh plugin --profile web add https://github.com/feir3413/dsh-plugin-quick-restart/releases/download/v1.0.0/dsh-plugin-quick-restart-1.0.0.tgz
```

Or install from git:

```bash
dsh plugin --profile web add https://github.com/feir3413/dsh-plugin-quick-restart.git
```

## License

MIT
