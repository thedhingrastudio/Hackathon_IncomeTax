import { spawn } from "node:child_process";

const input = process.argv.slice(2);
const args = ["dev"];

for (let index = 0; index < input.length; index += 1) {
  const value = input[index];
  if (value === "--host") {
    args.push("-H", input[index + 1] ?? "0.0.0.0");
    index += 1;
  } else if (value !== "--strictPort") {
    args.push(value);
  }
}

const command = process.platform === "win32" ? "next.cmd" : "next";
const child = spawn(command, args, { env: process.env, stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
