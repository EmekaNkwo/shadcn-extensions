# Contributing to ShadUI Extension

🎉 Thanks for your interest in contributing! Contributions are what make this project grow and improve.

---

## 🛠 How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/EmekaNkwo/shadcn-extensions.git
cd shadcn-extensions
pnpm install
```

### 2. Create a Branch

Use a descriptive branch name:

```bash
git checkout -b your-branch-name
```

### 3. Make Changes

Follow existing code style.

Keep components small, composable, and aligned with ShadCN conventions.

Run tests before committing:

```bash
pnpm run test
```

### 4. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org)

```bash
git add .
git commit -m "feat: add chat component"
git push origin your-branch-name
```

### 5. Create a Pull Request

Open a pull request from your branch to the `master` branch.

Development Workflow

### 1. Install Dependencies

```bash
pnpm install
```

### 2 . Build

```bash
pnpm run build
```

### 3. Run Playground

We recommend testing components in a local Vite/Next.js playground.

```bash
pnpm run dev
```

✅ Code Standards

TypeScript first: ensure proper typings.

Tailwind + ShadCN: use ShadCN style imports (e.g. @/components/ui/button).

Keep it modular: each new feature in src/packages/feature-name.
