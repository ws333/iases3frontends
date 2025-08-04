import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Get folder from command line arguments or use default
const defaultFolder = "packages/interface";
const targetFolder = process.argv[2] || defaultFolder;
const watchPath = path.join(__dirname + "/../", targetFolder);

// Validate that the path exists
if (!fs.existsSync(watchPath)) {
    console.error(`❌ Directory not found: ${watchPath}`);
    console.error(`Available options: packages or one of the subfolders, e.g. packages/browser-preview`);
    process.exit(1);
}

// Directories to ignore during watching
const ignoredFolders = ["dist", "node_modules"];

type FnWithArgs = (...args: unknown[]) => void;

// Debounce function to prevent multiple builds in quick succession
function debounce(func: FnWithArgs, wait: number): FnWithArgs {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: unknown[]): void => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func(...args);
        }, wait);
    };
}

// Function to run build command with real-time output
function runBuild() {
    console.log("\n🔨 Changes detected, rebuilding...");

    const startTime = Date.now();

    // Create environment variables that force color output
    const colorEnv = {
        ...process.env,
        FORCE_COLOR: "true",
        npm_config_color: "always",
    };

    // Run npm build from watchPath with real-time output and forced colors
    const buildProcess = spawn("npm", ["run", "build"], {
        stdio: "pipe",
        shell: true,
        env: colorEnv,
        cwd: watchPath,
    });

    // Handle spawn errors
    buildProcess.on("error", (error) => {
        console.error(`❌ Failed to start build process: ${error.message}`);
        console.error("Make sure npm is installed and available in your PATH");
    });

    // Pipe the output streams to console in real-time
    buildProcess.stdout?.on("data", (data) => {
        process.stdout.write(data.toString());
    });

    buildProcess.stderr?.on("data", (data) => {
        process.stderr.write(data.toString());
    });

    // When build is complete, log the result
    buildProcess.on("close", (code) => {
        const buildDuration = ((Date.now() - startTime) / 1000).toFixed(2);

        if (code !== 0) {
            console.error(`\n❌ Build failed after ${buildDuration}s with exit code ${code}`);
            return;
        }

        console.log(`\n✅ Build completed successfully in ${buildDuration}s`);
    });
}

// Check if directory should be ignored
function shouldIgnoreDir(dirPath: string): boolean {
    const dirName = path.basename(dirPath);
    return ignoredFolders.includes(dirName);
}

// Debounced build function (wait 500ms after last change)
const debouncedBuild = debounce(runBuild, 500);

// Recursively watch directories
function watchDir(dir: string) {
    fs.watch(dir, { recursive: false }, (eventType, filename) => {
        if (filename) {
            const fullPath = path.join(dir, filename);

            // Skip if this is a file/dir in an ignored directory
            if (shouldIgnoreDir(path.dirname(fullPath))) {
                return;
            }

            console.log(`📁 ${eventType}: ${fullPath}`);
            debouncedBuild();

            // Check if this is a directory that needs to be watched
            try {
                if (fs.statSync(fullPath).isDirectory() && !shouldIgnoreDir(fullPath)) {
                    watchDir(fullPath);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                // File might have been deleted, ignore error
            }
        }
    });

    // Watch existing subdirectories
    try {
        fs.readdirSync(dir).forEach((file) => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory() && !shouldIgnoreDir(fullPath)) {
                watchDir(fullPath);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }
}

// Start watching
console.log(`👀 Watching for changes in ${watchPath}/ directory...`);
console.log(`🚫 Ignoring directories: ${ignoredFolders.join(", ")}`);
console.log("Press Ctrl+C to stop watching");
watchDir(watchPath);
