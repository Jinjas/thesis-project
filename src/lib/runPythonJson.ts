import { spawn } from "child_process";

type PythonRunOptions = {
  timeoutMs?: number;
  maxStdoutBytes?: number;
};

const DEFAULT_TIMEOUT_MS = Number(process.env.PYTHON_EXEC_TIMEOUT_MS ?? 15000);
const DEFAULT_MAX_STDOUT_BYTES = Number(
  process.env.PYTHON_MAX_STDOUT_BYTES ?? 2_000_000,
);

export async function runPythonJson<T>(
  scriptPath: string,
  input: unknown,
  options: PythonRunOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxStdoutBytes = options.maxStdoutBytes ?? DEFAULT_MAX_STDOUT_BYTES;

  return new Promise<T>((resolve, reject) => {
    const python = spawn("python", [scriptPath]);
    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      python.kill("SIGKILL");
      reject(
        new Error(
          `Python script timed out after ${timeoutMs}ms: ${scriptPath}`,
        ),
      );
    }, timeoutMs);

    const finishWithError = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    };

    const finishWithSuccess = (data: T) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(data);
    };

    python.stdout?.on("data", (data) => {
      stdout += data.toString();
      if (Buffer.byteLength(stdout, "utf-8") > maxStdoutBytes) {
        python.kill("SIGKILL");
        finishWithError(
          new Error(
            `Python stdout exceeded ${maxStdoutBytes} bytes limit: ${scriptPath}`,
          ),
        );
      }
    });

    python.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("error", (error) => {
      finishWithError(error);
    });

    python.on("close", (code) => {
      if (settled) return;

      if (code !== 0) {
        finishWithError(new Error(`Python script failed: ${stderr}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout) as T;
        finishWithSuccess(parsed);
      } catch {
        finishWithError(
          new Error(`Python script returned invalid JSON: ${scriptPath}`),
        );
      }
    });

    python.stdin?.write(JSON.stringify(input));
    python.stdin?.end();
  });
}
