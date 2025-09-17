#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
const program = new Command();
// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function ensureShadcnInstalled(cwd, neededComponents) {
    const pkgPath = path.join(cwd, "package.json");
    if (!fs.existsSync(pkgPath)) {
        console.error("❌ No package.json found in this project.");
        process.exit(1);
    }
    const configPath = path.join(cwd, "components.json");
    // Run init if no components.json found
    if (!fs.existsSync(configPath)) {
        console.log("⚠️ ShadCN UI is not initialized.\n");
        console.log("Running: npx shadcn@latest init\n");
        await runCommand("npx", ["shadcn@latest", "init"], cwd);
    }
    // Reload config after init
    const componentsConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const installed = new Set(Object.keys(componentsConfig.dependencies || {}));
    // Filter missing components
    const toInstall = neededComponents.filter((c) => !installed.has(c));
    if (toInstall.length > 0) {
        console.log(`📦 Installing missing ShadCN components: ${toInstall.join(", ")}`);
        for (const c of toInstall) {
            await runCommand("npx", ["shadcn@latest", "add", c], cwd);
        }
    }
    else {
        console.log("✅ All required ShadCN components already installed.");
    }
}
function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd, stdio: "inherit", shell: true });
        child.on("close", (code) => {
            if (code !== 0)
                reject(new Error(`${command} ${args.join(" ")} failed`));
            else
                resolve();
        });
    });
}
async function ensureHooks(cwd) {
    const hooksDir = path.join(cwd, "src/hooks");
    const hookFile = path.join(hooksDir, "use-media-query.ts");
    if (!fs.existsSync(hookFile)) {
        await fs.ensureDir(hooksDir);
        const templatePath = path.join(__dirname, "../../src/hooks/use-media-query.ts");
        if (fs.existsSync(templatePath)) {
            await fs.copy(templatePath, hookFile, { overwrite: true });
            console.log("✅ Hook added: src/hooks/use-media-query.ts\n");
        }
        else {
            console.log("⚠️ No template found for use-media-query, skipping.\n");
        }
    }
    else {
        console.log("Updating existing hook: src/hooks/use-media-query.ts\n");
        const templatePath = path.join(__dirname, "../../src/hooks/use-media-query.ts");
        await fs.copy(templatePath, hookFile, { overwrite: true });
    }
}
program.name("shadui-extension").description("CLI for ShadUI Extensions");
program
    .command("add <component>")
    .description("Add or update a component scaffold (e.g., chat)")
    .action(async (component) => {
    const cwd = process.cwd();
    // Define required ShadCN components for each package
    const baseShadcnDeps = ["utils", "button", "label"];
    const shadcnDeps = {
        chat: [...baseShadcnDeps, "avatar", "scroll-area", "badge"],
    };
    // Ensure shadcn@latest init + missing deps installed
    await ensureShadcnInstalled(cwd, shadcnDeps[component] || []);
    // Ensure hooks exist
    if (component === "chat") {
        await ensureHooks(cwd);
    }
    // Copy templates from src/packages → user project
    const targetDir = path.join(cwd, "src/components", component);
    const templateDir = path.join(__dirname, "../../src/packages", component);
    if (!fs.existsSync(templateDir)) {
        console.log(`❌ Component '${component}' not found in templates.`);
        process.exit(1);
    }
    await fs.ensureDir(targetDir);
    // ✅ Overwrite existing files with latest version
    await fs.copy(templateDir, targetDir, { overwrite: true });
    console.log(`✅ ${component} updated in: src/components/${component}`);
});
program.parse(process.argv);
