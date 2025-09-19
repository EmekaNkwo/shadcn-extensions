#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import ora from "ora";

// 🔹 Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Config
const baseShadcnDeps = ["utils", "button", "label"];
const shadcnDeps: Record<string, string[]> = {
  chat: [...baseShadcnDeps, "avatar", "scroll-area", "badge", "textarea"],
  upload: [...baseShadcnDeps, "input", "avatar"],
  empty: [...baseShadcnDeps],
  carousel: [...baseShadcnDeps],
};

// 🔹 Detect package manager
function detectPackageManager(cwd: string): "pnpm" | "yarn" | "npm" {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

// 🔹 Utility: Run commands with spinner
async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  spinner?: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: spinner ? "pipe" : "inherit",
      shell: true,
    });

    if (spinner && child.stdout) {
      child.stdout.on("data", (data) => (spinner.text = data.toString()));
    }

    child.on("close", (code) => {
      if (code !== 0) {
        if (spinner) spinner.fail(`${command} ${args.join(" ")} failed`);
        reject(new Error(`${command} ${args.join(" ")} failed`));
      } else {
        if (spinner) spinner.succeed(`${command} ${args.join(" ")} done`);
        resolve();
      }
    });
  });
}

// 🔹 Ensure ShadCN installed + required deps
async function ensureShadcnInstalled(cwd: string, allNeededDeps: string[]) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) {
    ora().fail("❌ No package.json found in this project.");
    process.exit(1);
  }

  const configPath = path.join(cwd, "components.json");

  if (!fs.existsSync(configPath)) {
    const spinner = ora("Initializing ShadCN UI...").start();
    await runCommand("npx", ["shadcn@latest", "init"], cwd, spinner);
  }

  const componentsConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const installed = new Set(Object.keys(componentsConfig.dependencies || {}));

  const toInstall = allNeededDeps.filter((c) => !installed.has(c));

  if (toInstall.length > 0) {
    const spinner = ora(
      `Installing missing ShadCN components: ${toInstall.join(", ")}`
    ).start();
    await runCommand(
      "npx",
      ["shadcn@latest", "add", ...toInstall],
      cwd,
      spinner
    );
  } else {
    ora().succeed("✅ All required ShadCN components already installed.");
  }
}

// 🔹 Ensure hooks
async function ensureHooks(cwd: string) {
  const hooksDir = path.join(cwd, "src/hooks");
  const hookFile = path.join(hooksDir, "use-media-query.ts");
  const templatePath = path.join(
    __dirname,
    "../../src/hooks/use-media-query.ts"
  );

  if (!fs.existsSync(hookFile)) {
    await fs.ensureDir(hooksDir);
    if (fs.existsSync(templatePath)) {
      const spinner = ora("Adding hook: use-media-query.ts").start();
      await fs.copy(templatePath, hookFile, { overwrite: true });
      spinner.succeed("✅ Hook added: src/hooks/use-media-query.ts");
    }
  } else {
    const spinner = ora("Updating existing hook: use-media-query.ts").start();
    if (fs.existsSync(templatePath)) {
      await fs.copy(templatePath, hookFile, { overwrite: true });
    }
    spinner.succeed("Hook updated: src/hooks/use-media-query.ts");
  }
}

// 🔹 Install a component
async function installComponent(cwd: string, component: string) {
  if (component === "chat") {
    await ensureHooks(cwd);
  }

  if (component === "upload") {
    const pkgManager = detectPackageManager(cwd);
    const spinner = ora(
      `Installing react-dropzone using ${pkgManager}...`
    ).start();
    await runCommand(pkgManager, ["install", "react-dropzone"], cwd, spinner);
  }

  const targetDir = path.join(cwd, "src/components", component);
  const templateDir = path.join(__dirname, "../../src/packages", component);

  if (!fs.existsSync(templateDir)) {
    ora().warn(`⚠️ Component '${component}' not found in templates. Skipping.`);
    return;
  }

  await fs.ensureDir(targetDir);

  const spinner = ora(`Copying templates for ${component}...`).start();
  await fs.copy(templateDir, targetDir, { overwrite: true });
  spinner.succeed(`✅ ${component} updated in: src/components/${component}`);
}

// 🔹 CLI Setup
const program = new Command();
program.name("shadui-extension").description("CLI for ShadUI Extensions");

// Add multiple components
program
  .command("add <components...>")
  .description(
    "Add or update one or more components (e.g., chat upload carousel)"
  )
  .action(async (components: string[]) => {
    const cwd = process.cwd();

    try {
      const allDeps = components.flatMap((c) => shadcnDeps[c] || []);
      const uniqueDeps = [...new Set(allDeps)];

      await ensureShadcnInstalled(cwd, uniqueDeps);

      await Promise.all(components.map((c) => installComponent(cwd, c)));
    } catch (error: any) {
      ora().fail(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// List components
program
  .command("list")
  .description("List all available components")
  .action(() => {
    console.log(Object.keys(shadcnDeps).join("\n"));
  });

program.parse(process.argv);
