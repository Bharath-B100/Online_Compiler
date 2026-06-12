const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TEMP_DIR = path.join(__dirname, '..', 'temp');
const TIMEOUT_MS = 10000; // 10 seconds

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Generate unique ID for each execution to prevent race conditions
const uniqueId = () => crypto.randomBytes(8).toString('hex');

/**
 * Language configurations
 */
const LANGUAGE_CONFIG = {
  javascript: {
    ext: 'js',
    getCommand: (file) => ['node', [file]],
  },
  python: {
    ext: 'py',
    getCommand: (file) => ['python', [file]],
  },
  typescript: {
    ext: 'ts',
    getCommand: (file) => ['npx', ['--yes', 'ts-node', '--transpile-only', file]],
  },
  java: {
    ext: 'java',
    className: 'Main',
    getCompileCommand: (file, dir) => ['javac', ['-d', dir, file]],
    getCommand: (dir) => ['java', ['-cp', dir, 'Main']],
  },
  c: {
    ext: 'c',
    getCompileCommand: (file, outFile) => ['gcc', [file, '-o', outFile, '-lm']],
    getCommand: (outFile) => [outFile, []],
  },
  cpp: {
    ext: 'cpp',
    getCompileCommand: (file, outFile) => ['g++', [file, '-o', outFile, '-std=c++17']],
    getCommand: (outFile) => [outFile, []],
  },
  go: {
    ext: 'go',
    getCommand: (file) => ['go', ['run', file]],
  },
  php: {
    ext: 'php',
    getCommand: (file) => ['php', [file]],
  },
  ruby: {
    ext: 'rb',
    getCommand: (file) => ['ruby', [file]],
  },
};

/**
 * Execute a command with spawn and collect output
 */
function executeCommand(cmd, args, options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    let child;
    try {
      child = spawn(cmd, args, {
        timeout: TIMEOUT_MS,
        ...options,
        shell: process.platform === 'win32', // Required for Windows PATH resolution
      });
    } catch (spawnErr) {
      return resolve({
        success: false,
        stdout: '',
        stderr: spawnErr.message,
        exitCode: -1,
        executionTime: 0,
      });
    }

    // Pipe stdin if provided
    if (options.stdinData) {
      child.stdin.write(options.stdinData);
      child.stdin.end();
    }

    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, TIMEOUT_MS);

    child.on('close', (code) => {
      clearTimeout(timer);
      const executionTime = Date.now() - startTime;
      if (timedOut) {
        return resolve({
          success: false,
          stdout,
          stderr: 'Execution timed out (10 second limit exceeded)',
          exitCode: -1,
          executionTime,
        });
      }
      resolve({
        success: code === 0,
        stdout,
        stderr,
        exitCode: code ?? -1,
        executionTime,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        stdout: '',
        stderr: err.message.includes('ENOENT')
          ? `'${cmd}' is not installed or not in PATH. Please install it to run ${cmd} code.`
          : err.message,
        exitCode: -1,
        executionTime: Date.now() - startTime,
      });
    });
  });
}

/**
 * Clean up temp files safely
 */
function cleanup(...files) {
  for (const f of files) {
    try {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    } catch (_) {}
  }
}

/**
 * Main runCode function
 */
const runCode = async (language, code, stdin = '') => {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return { success: false, output: '', error: `Unsupported language: ${language}`, executionTime: 0 };
  }

  const id = uniqueId();

  // ── JavaScript ──────────────────────────────────────────────────────────
  if (language === 'javascript') {
    const file = path.join(TEMP_DIR, `code_${id}.js`);
    fs.writeFileSync(file, code);
    const [cmd, args] = config.getCommand(file);
    const result = await executeCommand(cmd, args, { stdinData: stdin });
    cleanup(file);
    return formatResult(result);
  }

  // ── Python ───────────────────────────────────────────────────────────────
  if (language === 'python') {
    const file = path.join(TEMP_DIR, `code_${id}.py`);
    fs.writeFileSync(file, code);
    const [cmd, args] = config.getCommand(file);
    const result = await executeCommand(cmd, args, { stdinData: stdin });
    cleanup(file);
    return formatResult(result);
  }

  // ── TypeScript ───────────────────────────────────────────────────────────
  if (language === 'typescript') {
    const file = path.join(TEMP_DIR, `code_${id}.ts`);
    fs.writeFileSync(file, code);
    const [cmd, args] = config.getCommand(file);
    const result = await executeCommand(cmd, args, { stdinData: stdin });
    cleanup(file);
    return formatResult(result);
  }

  // ── Go ───────────────────────────────────────────────────────────────────
  if (language === 'go') {
    const file = path.join(TEMP_DIR, `code_${id}.go`);
    fs.writeFileSync(file, code);
    const [cmd, args] = config.getCommand(file);
    const result = await executeCommand(cmd, args, { stdinData: stdin });
    cleanup(file);
    return formatResult(result);
  }

  // ── PHP ──────────────────────────────────────────────────────────────────
  if (language === 'php') {
    const file = path.join(TEMP_DIR, `code_${id}.php`);
    fs.writeFileSync(file, code);
    const [cmd, args] = config.getCommand(file);
    const result = await executeCommand(cmd, args, { stdinData: stdin });
    cleanup(file);
    return formatResult(result);
  }

  // ── Ruby ─────────────────────────────────────────────────────────────────
  if (language === 'ruby') {
    const file = path.join(TEMP_DIR, `code_${id}.rb`);
    fs.writeFileSync(file, code);
    const [cmd, args] = config.getCommand(file);
    const result = await executeCommand(cmd, args, { stdinData: stdin });
    cleanup(file);
    return formatResult(result);
  }

  // ── Java ─────────────────────────────────────────────────────────────────
  if (language === 'java') {
    const javaDir = path.join(TEMP_DIR, `java_${id}`);
    fs.mkdirSync(javaDir, { recursive: true });
    const file = path.join(javaDir, 'Main.java');
    fs.writeFileSync(file, code);

    // Compile
    const [compCmd, compArgs] = config.getCompileCommand(file, javaDir);
    const compResult = await executeCommand(compCmd, compArgs);
    if (!compResult.success) {
      cleanup(javaDir);
      try { fs.rmdirSync(javaDir, { recursive: true }); } catch (_) {}
      return {
        success: false,
        output: compResult.stderr || 'Compilation failed',
        error: compResult.stderr,
        executionTime: compResult.executionTime,
        exitCode: compResult.exitCode,
      };
    }

    // Run
    const [runCmd, runArgs] = config.getCommand(javaDir);
    const result = await executeCommand(runCmd, runArgs, { stdinData: stdin });
    try { fs.rmdirSync(javaDir, { recursive: true }); } catch (_) {}
    return formatResult(result);
  }

  // ── C / C++ ──────────────────────────────────────────────────────────────
  if (language === 'c' || language === 'cpp') {
    const srcExt = language === 'c' ? 'c' : 'cpp';
    const file = path.join(TEMP_DIR, `code_${id}.${srcExt}`);
    const outFile = path.join(TEMP_DIR, `out_${id}${process.platform === 'win32' ? '.exe' : ''}`);
    fs.writeFileSync(file, code);

    const [compCmd, compArgs] = config.getCompileCommand(file, outFile);
    const compResult = await executeCommand(compCmd, compArgs);
    cleanup(file);

    if (!compResult.success) {
      cleanup(outFile);
      return {
        success: false,
        output: compResult.stderr || 'Compilation failed',
        error: compResult.stderr,
        executionTime: compResult.executionTime,
        exitCode: compResult.exitCode,
      };
    }

    const [runCmd, runArgs] = config.getCommand(outFile);
    const result = await executeCommand(runCmd, runArgs, { stdinData: stdin });
    cleanup(outFile);
    return formatResult(result);
  }

  return { success: false, output: 'Unsupported language', error: 'Language not supported', executionTime: 0 };
};

function formatResult(result) {
  return {
    success: result.success,
    output: result.stdout,
    error: result.stderr || null,
    executionTime: result.executionTime,
    exitCode: result.exitCode,
  };
}

module.exports = runCode;
