import { spawn } from "node:child_process";

export const name = "quick-restart";
export const inject = ["connection"];

export function apply(ctx) {
	const connection = ctx.get("connection");
	if (connection && typeof connection.handle === "function") {
		connection.handle("/api/plugin/quick-restart", async (endpoint, payload) => {
			if (endpoint === "restart") {
				const realExec = process.execPath;
				const realArgs = [...process.argv.slice(1)];
				const parentPid = process.pid;
				const launcherScript = `
const { spawn } = require('node:child_process');
const parentPid = ${parentPid};
function isRunning(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}
const start = Date.now();
const interval = setInterval(() => {
	if (!isRunning(parentPid) || Date.now() - start > 5000) {
		clearInterval(interval);
		setTimeout(() => {
			const child = spawn(${JSON.stringify(realExec)}, ${JSON.stringify(realArgs)}, {
				cwd: ${JSON.stringify(process.cwd())},
				detached: true,
				stdio: 'inherit',
				env: process.env
			});
			child.unref();
			process.exit(0);
		}, 300);
	}
}, 100);
`;
				const launcher = spawn(process.execPath, ["-e", launcherScript], {
					detached: true,
					stdio: "ignore",
					windowsHide: true
				});
				launcher.unref();
				setTimeout(() => {
					process.exit(0);
				}, 200);
				return { ok: true, value: { restarting: true } };
			}
			return { ok: false, error: { code: "not-found", message: "unknown endpoint" } };
		}, { authority: "loopback" });
	}
}
