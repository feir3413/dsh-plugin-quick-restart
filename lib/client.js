window.__ModuleLoader__.load({
	id: "dsh-plugin-quick-restart",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let _deepseek_ai_dsh_client_web_react = require("@deepseek-ai/dsh-client-web-react");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");

		const NS = "plugin.quick-restart";
		const zh = {
			"restart": "重启服务",
			"restart.confirm": "确定要立即重启 DeepSeek Harness 服务吗？重启期间连接将短暂中断并自动重连。",
			"restart.restarting": "正在重启...",
			"restart.error": "重启服务失败",
			"close": "关闭"
		};
		const en = {
			"restart": "Restart Server",
			"restart.confirm": "Are you sure you want to restart the DeepSeek Harness server now? The connection will temporarily reconnect.",
			"restart.restarting": "Restarting...",
			"restart.error": "Failed to restart server",
			"close": "Close"
		};

		function RestartAction({ controller, useSnapshot, t }) {
			const state = useSnapshot((snapshot) => snapshot);
			const [confirming, setConfirming] = (0, react.useState)(false);
			const isRestarting = state.restarting;

			return (0, react_jsx_runtime.jsxs)("div", {
				style: { display: "flex", alignItems: "center", gap: "8px" },
				children: [
					state.error === null ? null : (0, react_jsx_runtime.jsx)("span", {
						style: { color: "var(--dsw-alias-state-error-primary)", fontSize: "12px" },
						role: "alert",
						children: t("restart.error")
					}),
					(0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						size: "sm",
						disabled: isRestarting,
						onClick: () => setConfirming(true),
						children: [
							isRestarting ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 14 }) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline14, { size: 14 }),
							isRestarting ? t("restart.restarting") : t("restart")
						]
					}),
					(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: confirming,
						onClose: () => setConfirming(false),
						title: t("restart"),
						description: t("restart.confirm"),
						footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
							children: [
								(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setConfirming(false),
									children: t("close")
								}),
								(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "primary",
									size: "sm",
									onClick: () => {
										setConfirming(false);
										controller.restart();
									},
									children: t("restart")
								})
							]
						})
					})
				]
			});
		}

		class RestartStore {
			api;
			store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)({
				restarting: false,
				error: null
			});
			constructor(api) {
				this.api = api;
			}
			async restart() {
				const current = this.store.getSnapshot();
				if (current.restarting) return;
				this.store.update((state) => {
					state.restarting = true;
					state.error = null;
				});
				try {
					if (typeof this.api.host?.restart === "function") {
						const res = await this.api.host.restart({});
						if (!res.result.ok) throw new Error(res.result.error.message);
					} else {
						const res = await fetch("/api/plugin/quick-restart/restart", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ rpcId: "plugin-restart", method: "restart", payload: {} })
						});
						const data = await res.json();
						if (!data.result?.ok) throw new Error(data.result?.error?.message || "Restart failed");
					}
				} catch (err) {
					this.store.update((state) => {
						state.restarting = false;
						state.error = err instanceof Error ? err.message : String(err);
					});
				}
			}
		}

		const inject = ["slots", "locale", "connection"];

		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-plugin-quick-restart: dictionaries");
			const t = ctx.locale.bind(NS);
			const connection = ctx.get("connection");
			if (!connection.isLoopback) return;

			const restartController = new RestartStore(connection.api);
			const useSnapshot = (0, _deepseek_ai_dsh_client_web_react.bindSnapshotSelector)(restartController.store);

			ctx.slots.inject("settings.action", () => ctx.slots.register({
				name: "settings.action",
				id: "quick-restart",
				order: -10,
				locale: NS,
				inject: () => ({
					controller: restartController,
					useSnapshot,
					t
				})
			}, RestartAction));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
