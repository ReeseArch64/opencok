import argparse
import gzip
import hashlib
import json
import os
import pathlib
import platform
import shutil
import statistics
import subprocess
import tempfile
import time


ROOT = pathlib.Path(__file__).resolve().parents[2]
GZIP_SIZES = {}


def tree_rss(pid):
    total = 0
    try:
        for line in pathlib.Path(f"/proc/{pid}/status").read_text().splitlines():
            if line.startswith("VmRSS:"):
                total += int(line.split()[1]) * 1024
        children = pathlib.Path(f"/proc/{pid}/task/{pid}/children").read_text().split()
        total += sum(tree_rss(int(child)) for child in children)
    except (FileNotFoundError, ProcessLookupError):
        pass
    return total


def measure(command, cwd, output):
    with tempfile.TemporaryFile() as logs:
        started = time.perf_counter()
        child = subprocess.Popen(
            command, cwd=cwd, env={"PATH": os.environ["PATH"], "TZ": "UTC"},
            stdin=subprocess.DEVNULL, stdout=logs, stderr=logs,
        )
        peak = 0
        while True:
            peak = max(peak, tree_rss(child.pid))
            waited, status, usage = os.wait4(child.pid, os.WNOHANG)
            if waited:
                child.returncode = os.waitstatus_to_exitcode(status)
                kernel_peak = usage.ru_maxrss * 1024
                break
            time.sleep(0.005)
        elapsed = time.perf_counter() - started
        logs.seek(0)
        error = logs.read().decode(errors="replace") if child.returncode else None
    sizes = {"js": 0, "maps": 0, "assets": 0, "gzip": 0}
    for path in output.rglob("*"):
        if path.is_file():
            content = path.read_bytes()
            kind = "maps" if path.suffix == ".map" else "js" if path.suffix == ".js" else "assets"
            sizes[kind] += len(content)
            if kind != "maps":
                digest = hashlib.sha256(content).digest()
                if digest not in GZIP_SIZES:
                    GZIP_SIZES[digest] = len(gzip.compress(content, mtime=0))
                sizes["gzip"] += GZIP_SIZES[digest]
    return {
        "seconds": elapsed, "sampledTreeRssBytes": peak,
        "kernelMaxRssBytes": kernel_peak, "observedPeakRssBytes": max(peak, kernel_peak),
        "exitCode": child.returncode, "bytes": sizes, "error": error,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=pathlib.Path)
    parser.add_argument("--runs", type=int, default=5)
    parser.add_argument("--apps", nargs="+", choices=["api", "chat", "server", "web"], default=["api", "chat", "server", "web"])
    parser.add_argument("--candidates", nargs="+", choices=["bun-cli", "bun-api", "esbuild", "rolldown", "rollup-swc"], default=["bun-cli", "bun-api", "esbuild", "rolldown"])
    options = parser.parse_args()
    if options.runs < 5:
        parser.error("At least five measured runs are required")
    bun = shutil.which("bun")
    report = {
        "measuredAtUtc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "sourceCommit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
        "lockSha256": hashlib.sha256((ROOT / "bun.lock").read_bytes()).hexdigest(),
        "system": platform.platform(), "cpu": next(line.split(":", 1)[1].strip() for line in pathlib.Path("/proc/cpuinfo").read_text().splitlines() if line.startswith("model name")),
        "cpuCount": os.cpu_count(), "memoryBytes": os.sysconf("SC_PAGE_SIZE") * os.sysconf("SC_PHYS_PAGES"),
        "bun": subprocess.check_output([bun, "--version"], text=True).strip(),
        "versions": {
            name: json.loads((ROOT / "node_modules" / name / "package.json").read_text())["version"]
            for name in ["esbuild", "rolldown", "typescript", "rollup", "@swc/core", "@rollup/plugin-node-resolve", "@rollup/plugin-commonjs", "@rollup/plugin-json"]
        },
        "protocol": "Sequential fresh processes; clean output each run; one recorded first-use run, then five or more measured repetitions; OS/dependency caches retained; RSS process-tree sampled every 5ms plus kernel wait4 high-water floor; gzip level 9; no watch, installation, typecheck, Docker or resource copy in compilation timing",
        "scenarios": [],
    }
    with tempfile.TemporaryDirectory(prefix="opencok-build-pilot-") as temporary:
        output = pathlib.Path(temporary) / "dist"
        web_app = pathlib.Path(temporary) / "web-workspace" / "apps/web"
        if "web" in options.apps:
            subprocess.run([
                bun, "--no-env-file", str(ROOT / ".github/build-pilot/web-workspace.ts"),
                str(web_app.parents[1]),
            ], cwd=ROOT, env={"PATH": os.environ["PATH"]}, check=True, stdout=subprocess.DEVNULL)
            report["webFixturesSha256"] = hashlib.sha256((ROOT / ".github/build-pilot/web-assets.json").read_bytes()).hexdigest()
        for app in options.apps:
            for mode in ["minified", "diagnostic"]:
                for candidate in options.candidates:
                    scenario = {"app": app, "mode": mode, "candidate": candidate, "runs": []}
                    for iteration in range(options.runs + 1):
                        shutil.rmtree(output, ignore_errors=True)
                        output.mkdir()
                        if candidate == "bun-cli":
                            command = [bun, "--no-env-file", "build", "src/index.html" if app == "web" else "src/index.ts", "--target", "browser" if app == "web" else "bun", "--outdir", str(output if app == "web" else output / "src")]
                            command += ["--minify"] if mode == "minified" else ["--sourcemap=linked"]
                            cwd = web_app if app == "web" else ROOT / "apps" / app
                        else:
                            command = [bun, "--no-env-file", str(ROOT / ".github/build-pilot/build.ts"), candidate, app, mode, str(output)]
                            if app == "web":
                                command.append(str(web_app / "src/index.html"))
                            cwd = ROOT
                        result = measure(command, cwd, output)
                        if iteration == 0:
                            scenario["firstUse"] = result
                        else:
                            scenario["runs"].append(result)
                    successful = [run for run in scenario["runs"] if run["exitCode"] == 0]
                    if successful:
                        for field in ["seconds", "sampledTreeRssBytes", "observedPeakRssBytes"]:
                            values = [run[field] for run in successful]
                            scenario[field] = {"median": statistics.median(values), "min": min(values), "max": max(values)}
                    report["scenarios"].append(scenario)
                    options.output.parent.mkdir(parents=True, exist_ok=True)
                    options.output.write_text(json.dumps(report, indent=2) + "\n")
                    print(app, mode, candidate, scenario.get("seconds", "FAILED"), flush=True)


if __name__ == "__main__":
    main()
