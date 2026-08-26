// Temporary validation: spawn dev server, then run the full smoke suite.
import { spawn } from "bun";

async function serverUp(): Promise<boolean> {
    try {
        const r = await fetch("http://localhost:8080/?hot=0");
        return r.ok;
    } catch {
        return false;
    }
}

const srv = (await serverUp())
    ? null
    : spawn(["bun", "run", "server.ts"], { stdout: "ignore", stderr: "ignore" });
if (srv) {
    for (let i = 0; i < 40; i++) {
        if (await serverUp()) break;
        await Bun.sleep(250);
    }
}

const smoke = spawn(["bun", "run", "tests/smoke.ts"], { stdio: ["inherit", "inherit", "inherit"] });
const code = await smoke.exited;
if (srv) srv.kill();
process.exit(code ?? 0);
