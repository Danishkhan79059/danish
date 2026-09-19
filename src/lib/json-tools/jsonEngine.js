/**
 * Core JSON Processing Engine
 * 100% Client-side. Zero server communication.
 */

// Preset Sample Datasets
export const SAMPLE_JSONS = {
  simple: {
    title: "Simple JSON",
    desc: "Standard flat user profile",
    data: {
      id: "usr_94821",
      name: "Danish Khan",
      username: "danishk",
      email: "danish@example.com",
      role: "Full-Stack Engineer",
      skills: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
      yearsExperience: 3,
      isActive: true,
      verified: true,
      lastLogin: "2026-03-19T10:15:30.000Z",
    },
  },
};

/**
 * Format raw JSON string with specified indentation
 * @param {string} rawString
 * @param {string|number} indent - 2, 4, or '\t'
 * @returns {{ success: boolean, result?: string, error?: string, line?: number, col?: number, parsed?: any }}
 */
export function formatJson(rawString, indent = 2) {
  if (!rawString || !rawString.trim()) {
    return { success: false, error: "Please enter JSON to format." };
  }

  try {
    const parsed = JSON.parse(rawString);
    const spaceVal = indent === "tab" || indent === "\t" ? "\t" : Number(indent) || 2;
    const formatted = JSON.stringify(parsed, null, spaceVal);
    return {
      success: true,
      result: formatted,
      parsed,
    };
  } catch (err) {
    const errorDetails = parseJsonError(err, rawString);
    return {
      success: false,
      error: errorDetails.message,
      line: errorDetails.line,
      col: errorDetails.col,
    };
  }
}

/**
 * Minify raw JSON string to compact representation
 * @param {string} rawString
 * @returns {{ success: boolean, result?: string, error?: string, line?: number, col?: number, parsed?: any }}
 */
export function minifyJson(rawString) {
  if (!rawString || !rawString.trim()) {
    return { success: false, error: "Please enter JSON to minify." };
  }

  try {
    const parsed = JSON.parse(rawString);
    const minified = JSON.stringify(parsed);
    return {
      success: true,
      result: minified,
      parsed,
    };
  } catch (err) {
    const errorDetails = parseJsonError(err, rawString);
    return {
      success: false,
      error: errorDetails.message,
      line: errorDetails.line,
      col: errorDetails.col,
    };
  }
}

/**
 * Validate raw JSON without reformatting
 * @param {string} rawString
 * @returns {{ isValid: boolean, message: string, line?: number, col?: number, parsed?: any }}
 */
export function validateJson(rawString) {
  if (!rawString || !rawString.trim()) {
    return { isValid: false, message: "Input is empty. Enter JSON to validate." };
  }

  try {
    const parsed = JSON.parse(rawString);
    return {
      isValid: true,
      message: "Valid JSON! Structure is properly formed.",
      parsed,
    };
  } catch (err) {
    const errorDetails = parseJsonError(err, rawString);
    return {
      isValid: false,
      message: errorDetails.message,
      line: errorDetails.line,
      col: errorDetails.col,
    };
  }
}

/**
 * Extract line, column and human-friendly message from JSON parsing error
 * @param {Error} err
 * @param {string} text
 */
export function parseJsonError(err, text) {
  const errMsg = err.message || "Invalid JSON";

  // 1. Direct line & column patterns (Firefox / Safari / Node 20+)
  // e.g., "at line 8 column 14" or "line 3, column 5"
  const lineColMatch = errMsg.match(/line\s+(\d+)\s+(?:column|col)\s+(\d+)/i);
  if (lineColMatch) {
    return {
      message: errMsg,
      line: parseInt(lineColMatch[1], 10),
      col: parseInt(lineColMatch[2], 10),
    };
  }

  // 2. Position pattern (V8 / Chrome)
  // e.g., "Unexpected token } in JSON at position 142" or "at position 48"
  const posMatch = errMsg.match(/at\s+position\s+(\d+)/i);
  if (posMatch && typeof text === "string") {
    const position = parseInt(posMatch[1], 10);
    const posDetails = calculateLineAndColumn(text, position);
    return {
      message: errMsg,
      line: posDetails.line,
      col: posDetails.col,
      position,
    };
  }

  return {
    message: errMsg,
    line: null,
    col: null,
  };
}

/**
 * Calculate 1-indexed Line and Column from a string byte/char offset
 * @param {string} text
 * @param {number} position
 */
export function calculateLineAndColumn(text, position) {
  if (!text || position <= 0) {
    return { line: 1, col: 1 };
  }

  const boundedPos = Math.min(position, text.length);
  const upToPos = text.slice(0, boundedPos);
  const lines = upToPos.split("\n");
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;

  return { line, col };
}

/**
 * Calculate structural statistics from parsed JSON
 * @param {any} value
 * @param {string} [rawText=""]
 */
export function computeJsonStats(value, rawText = "") {
  let objectCount = 0;
  let arrayCount = 0;
  let keyCount = 0;
  let maxDepth = 0;

  function traverse(node, currentDepth) {
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }

    if (node === null || typeof node !== "object") {
      return;
    }

    if (Array.isArray(node)) {
      arrayCount++;
      for (let i = 0; i < node.length; i++) {
        traverse(node[i], currentDepth + 1);
      }
    } else {
      objectCount++;
      const keys = Object.keys(node);
      keyCount += keys.length;
      for (const key of keys) {
        traverse(node[key], currentDepth + 1);
      }
    }
  }

  traverse(value, value !== null && typeof value === "object" ? 1 : 0);

  const textToMeasure = rawText || (value !== undefined ? JSON.stringify(value) : "");
  const charCount = textToMeasure.length;
  const byteSize = typeof Blob !== "undefined" ? new Blob([textToMeasure]).size : textToMeasure.length;

  return {
    characters: charCount,
    sizeBytes: byteSize,
    sizeFormatted: formatBytes(byteSize),
    objectCount,
    arrayCount,
    keyCount,
    maxDepth,
  };
}

/**
 * Format bytes into human readable B / KB / MB
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
