const express = require('express');
const router = express.Router();
const runCode = require('../utils/runCode');

const SUPPORTED_LANGUAGES = [
  'javascript', 'python', 'java', 'c', 'cpp',
  'typescript', 'go', 'php', 'ruby'
];

// Dangerous patterns — carefully scoped to avoid false positives
// (e.g. Python's str.format(), Java's String.format() are fine)
const DANGEROUS_PATTERNS = [
  { pattern: /import\s+subprocess/, msg: 'import subprocess is not allowed' },
  { pattern: /import\s+shutil/, msg: 'import shutil is not allowed' },
  { pattern: /Runtime\.getRuntime\(\)\.exec/, msg: 'Runtime.exec is not allowed' },
  { pattern: /new\s+ProcessBuilder/, msg: 'ProcessBuilder is not allowed' },
  { pattern: /rm\s+-rf/, msg: 'rm -rf is not allowed' },
  { pattern: /shutdown\s*\/[sr]/, msg: 'System shutdown commands are not allowed' },
  { pattern: /os\.system\s*\(/, msg: 'os.system() is not allowed' },
  { pattern: /os\.popen\s*\(/, msg: 'os.popen() is not allowed' },
  { pattern: /__import__\s*\(\s*['"]os['"]/, msg: '__import__("os") is not allowed' },
];

router.post('/', async (req, res) => {
  try {
    const { language, code, stdin = '' } = req.body;

    // Validate required fields
    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: 'Both "language" and "code" fields are required.'
      });
    }

    // Validate language
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: "${language}". Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
      });
    }

    // Validate code length
    if (code.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Code exceeds maximum length of 50,000 characters.'
      });
    }

    // Security check
    for (const { pattern, msg } of DANGEROUS_PATTERNS) {
      if (pattern.test(code)) {
        return res.status(400).json({
          success: false,
          error: `Security violation: ${msg}`
        });
      }
    }

    // Execute
    const result = await runCode(language, code, stdin);

    return res.status(result.success ? 200 : 400).json({
      success: result.success,
      output: result.output || '',
      error: result.error || null,
      executionTime: result.executionTime || 0,
      exitCode: result.exitCode ?? -1,
    });

  } catch (err) {
    console.error('Route execution error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during code execution.'
    });
  }
});

module.exports = router;
