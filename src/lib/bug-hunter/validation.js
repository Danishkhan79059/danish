/**
 * SAFE VALIDATION ENGINE
 * Validates user code solutions for Bug Hunter challenges without executing
 * arbitrary user code on the server (eval/new Function free).
 */

/**
 * Normalizes code by stripping multi-line and single-line comments and trimming whitespace
 */
function normalizeCode(code = "") {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*/g, "")
    .trim();
}

/**
 * Validates a user code submission against the challenge specifications.
 * Returns { passed: boolean, results: Array<{ name, passed, expected, received, message }> }
 */
export function validateChallengeCode(challengeId, rawCode) {
  const code = rawCode || "";
  const cleanCode = normalizeCode(code);

  switch (challengeId) {
    // ==========================================
    // 🟢 BEGINNER
    // ==========================================
    case "undefined-variable": {
      const usesUsersPlural = /res\.json\(\s*users\s*\)/.test(cleanCode);
      const stillUsesSingular = /res\.json\(\s*user\s*\)/.test(cleanCode);
      const hasFindQuery = /User\.find\(/.test(cleanCode);

      const test1Passed = usesUsersPlural && !stillUsesSingular;
      const test2Passed = hasFindQuery;

      return {
        passed: test1Passed && test2Passed,
        results: [
          {
            name: "Route handler sends defined 'users' array",
            passed: test1Passed,
            expected: "res.json(users)",
            received: stillUsesSingular ? "res.json(user)" : test1Passed ? "res.json(users)" : "Invalid response syntax",
            message: stillUsesSingular
              ? "ReferenceError: user is not defined. The database results were stored in 'const users'."
              : test1Passed
              ? "Route correctly responds with the queried 'users' array."
              : "Expected res.json(users) to send the database records.",
          },
          {
            name: "Database query intact",
            passed: test2Passed,
            expected: "const users = await User.find()",
            received: test2Passed ? "User.find() present" : "Database query modified or removed",
            message: test2Passed
              ? "Database fetch query remains properly structured."
              : "Please keep the await User.find() query intact.",
          },
        ],
      };
    }

    case "wrong-array-method": {
      const hasExplicitReturn = /return\s+`@\$\{user\.username\}`/.test(cleanCode);
      const hasImplicitReturn = /\(user\)\s*=>\s*`@\$\{user\.username\}`/.test(cleanCode) ||
        /user\s*=>\s*`@\$\{user\.username\}`/.test(cleanCode);
      const stillHasEmptyBlock = /users\.map\(\s*\(?user\)?\s*=>\s*\{\s*`@\$\{user\.username\}`\s*;?\s*\}\s*\)/.test(cleanCode);

      const passed = (hasExplicitReturn || hasImplicitReturn) && !stillHasEmptyBlock;

      return {
        passed,
        results: [
          {
            name: "Returns formatted username strings",
            passed,
            expected: "['@danish', '@alex']",
            received: stillHasEmptyBlock ? "[undefined, undefined]" : passed ? "['@danish', '@alex']" : "undefined output",
            message: stillHasEmptyBlock
              ? "Array.map returned undefined for all elements. Arrow function with '{ }' requires an explicit 'return'."
              : passed
              ? "Transformed handles returned successfully!"
              : "Ensure the mapped string `@${user.username}` is returned.",
          },
          {
            name: "Non-empty string transformation",
            passed,
            expected: "user.username prefixed with '@'",
            received: passed ? "Prefix '@' applied" : "Missing return statement in map block",
            message: passed
              ? "Template literal returned properly for all entries."
              : "Use either 'return `@${user.username}`;' or implicit return '(user) => `@${user.username}`'.",
          },
        ],
      };
    }

    case "broken-function": {
      const hasReturnFinalPrice = /return\s+finalPrice/.test(cleanCode) ||
        /return\s+price\s*-\s*discountAmount/.test(cleanCode) ||
        /return\s+price\s*-\s*\(\s*price\s*\*\s*discountPercent\s*\)\s*\/\s*100/.test(cleanCode);

      return {
        passed: hasReturnFinalPrice,
        results: [
          {
            name: "Returns calculated discounted price",
            passed: hasReturnFinalPrice,
            expected: "80 (for price: 100, discountPercent: 20)",
            received: hasReturnFinalPrice ? "80" : "undefined",
            message: hasReturnFinalPrice
              ? "Discounted price computed and returned to caller."
              : "calculateDiscountedPrice() returned undefined. Did you forget the 'return' keyword?",
          },
          {
            name: "Explicit return statement present",
            passed: hasReturnFinalPrice,
            expected: "return finalPrice;",
            received: hasReturnFinalPrice ? "return statement found" : "No return statement",
            message: hasReturnFinalPrice
              ? "Return statement verified."
              : "Add 'return finalPrice;' before the closing brace.",
          },
        ],
      };
    }

    case "incorrect-condition": {
      const hasStrictEquality = /user\.role\s*===\s*["']admin["']/.test(cleanCode);
      const hasLooseEquality = /user\.role\s*==\s*["']admin["']/.test(cleanCode);
      const hasAccidentalAssignment = /if\s*\(\s*user\.role\s*=\s*["']admin["']\s*\)/.test(cleanCode);

      const passed = (hasStrictEquality || hasLooseEquality) && !hasAccidentalAssignment;

      return {
        passed,
        results: [
          {
            name: "Strict equality check for admin role",
            passed,
            expected: "user.role === 'admin'",
            received: hasAccidentalAssignment ? "user.role = 'admin' (Assignment)" : passed ? "Strict comparison" : "Invalid condition",
            message: hasAccidentalAssignment
              ? "Assignment '=' used inside if condition! This accidentally grants admin privileges to all users."
              : passed
              ? "Strict comparison prevents privilege escalation!"
              : "Check the role using 'user.role === \"admin\"'.",
          },
          {
            name: "Non-admin access properly rejected",
            passed,
            expected: "canAccessAdminPanel({ role: 'guest' }) === false",
            received: hasAccidentalAssignment ? "true (security breach)" : passed ? "false (access denied)" : "error",
            message: passed
              ? "Guest and regular users are safely blocked."
              : "Expected false when non-admin user is tested.",
          },
        ],
      };
    }

    // ==========================================
    // 🟡 INTERMEDIATE
    // ==========================================
    case "broken-express-api": {
      const hasReturnOnBadRequest = /return\s+res\.status\(400\)/.test(cleanCode) ||
        /return\s+res\.json\(/.test(cleanCode);
      const hasOldPatternWithoutReturn = /if\s*\(\s*!email\s*\|\|\s*!password\s*\)\s*\{\s*res\.status\(400\)/.test(cleanCode);

      const passed = hasReturnOnBadRequest && !hasOldPatternWithoutReturn;

      return {
        passed,
        results: [
          {
            name: "Early exit with return keyword on 400 response",
            passed,
            expected: "return res.status(400).json(...)",
            received: hasOldPatternWithoutReturn ? "res.status(400).json(...) without return" : passed ? "return res.status(400)..." : "Missing return",
            message: hasOldPatternWithoutReturn
              ? "ERR_HTTP_HEADERS_SENT: Without 'return', execution continues and attempts to send subsequent responses."
              : passed
              ? "Controller halts immediately upon validation failure."
              : "Prefix the 400 response with the 'return' keyword.",
          },
          {
            name: "No fallthrough to database when fields missing",
            passed,
            expected: "Database query skipped when payload invalid",
            received: passed ? "Execution short-circuited safely" : "Fallthrough to User.findOne()",
            message: passed
              ? "Early return safeguards database from queries with null parameters."
              : "Ensure invalid requests do not reach User.findOne().",
          },
        ],
      };
    }

    case "async-await-bug": {
      const hasAwaitedHash = /await\s+bcrypt\.hash\(/.test(cleanCode);
      const hasUnawaitedHash = /const\s+hashedPassword\s*=\s*bcrypt\.hash\(/.test(cleanCode);

      const passed = hasAwaitedHash && !hasUnawaitedHash;

      return {
        passed,
        results: [
          {
            name: "bcrypt.hash is properly awaited",
            passed,
            expected: "await bcrypt.hash(plainPassword, saltRounds)",
            received: hasUnawaitedHash ? "bcrypt.hash(...) (Pending Promise)" : passed ? "await bcrypt.hash(...)" : "Missing await",
            message: hasUnawaitedHash
              ? "bcrypt.hash returns a Promise. Storing it without 'await' saves '[object Promise]' instead of the hashed password."
              : passed
              ? "Password hash awaited and resolved before database insertion."
              : "Add 'await' before bcrypt.hash().",
          },
          {
            name: "Hashed string saved to database",
            passed,
            expected: "Resolved hash string passed to User.create()",
            received: passed ? "String hash stored" : "Pending Promise object passed",
            message: passed
              ? "Users can now authenticate with their resolved hashed passwords."
              : "Ensure User.create() receives the resolved hash string.",
          },
        ],
      };
    }

    case "react-useeffect-bug": {
      // Must have empty dependency array [] or [setNotifications]
      const hasEmptyDepArray = /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[\s*\]\s*\)/.test(cleanCode);
      const hasDepArray = /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[.*?\]\s*\)/.test(cleanCode);
      const stillHasNoDeps = /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*\)/.test(cleanCode) && !hasDepArray;

      const passed = (hasEmptyDepArray || hasDepArray) && !stillHasNoDeps;

      return {
        passed,
        results: [
          {
            name: "Dependency array provided to useEffect",
            passed,
            expected: "useEffect(() => { ... }, [])",
            received: stillHasNoDeps ? "useEffect(() => { ... }) (No dependency array)" : passed ? "Dependency array provided" : "Missing dependencies",
            message: stillHasNoDeps
              ? "Infinite loop! Without a dependency array, setNotifications() triggers a re-render which re-triggers useEffect indefinitely."
              : passed
              ? "Empty dependency array [] ensures fetch runs only once on mount."
              : "Pass [] as the second argument to useEffect.",
          },
          {
            name: "Browser CPU overload prevented",
            passed,
            expected: "Single network request on component mount",
            received: passed ? "1 request on mount" : "Infinite requests / CPU spike",
            message: passed
              ? "Component render lifecycle stabilized."
              : "Add [] to prevent infinite network calls.",
          },
        ],
      };
    }

    case "mongodb-query-bug": {
      const hasSetOperator = /\$set\s*:\s*\{[\s\S]*?bio\s*:\s*newBio[\s\S]*?\}/.test(cleanCode) ||
        /\{\s*\$set\s*:\s*\{\s*bio\s*:\s*newBio\s*\}\s*\}/.test(cleanCode);
      const hasRawBioUpdate = /db\.collection\(\s*["']users["']\s*\)\.updateOne\(\s*\{[\s\S]*?\}\s*,\s*\{\s*bio\s*:\s*newBio\s*\}\s*\)/.test(cleanCode);

      const passed = hasSetOperator && !hasRawBioUpdate;

      return {
        passed,
        results: [
          {
            name: "Uses MongoDB $set operator for atomic field update",
            passed,
            expected: "{ $set: { bio: newBio } }",
            received: hasRawBioUpdate ? "{ bio: newBio } (Destructive overwrite)" : passed ? "{ $set: { bio: newBio } }" : "Missing $set",
            message: hasRawBioUpdate
              ? "Passing { bio: newBio } directly causes MongoDB to overwrite other document fields (username, email)!"
              : passed
              ? "Atomic $set operator correctly updates only the specified field."
              : "Wrap the updated fields inside $set: { ... }.",
          },
          {
            name: "Preserves existing user document attributes",
            passed,
            expected: "Username, email, and timestamps retained",
            received: passed ? "Attributes preserved" : "Potential field loss on update",
            message: passed
              ? "User profile attributes remain intact."
              : "Use $set to prevent document replacement.",
          },
        ],
      };
    }

    // ==========================================
    // 🔴 ADVANCED
    // ==========================================
    case "auth-jwt-bug": {
      const stripsBearerSplit = /authHeader\.split\(\s*["']\s+["']\s*\)\[1\]/.test(cleanCode) ||
        /authHeader\.split\(\s*["'] ["']\s*\)\[1\]/.test(cleanCode);
      const stripsBearerReplace = /authHeader\.replace\(\s*["']Bearer\s+["']\s*,\s*["']["']\s*\)/.test(cleanCode) ||
        /authHeader\.replace\(\s*\/Bearer\\s\+\/\s*,\s*["']["']\s*\)/.test(cleanCode);
      const stillPassesRawHeader = /const\s+token\s*=\s*authHeader\s*;/.test(cleanCode);

      const passed = (stripsBearerSplit || stripsBearerReplace) && !stillPassesRawHeader;

      return {
        passed,
        results: [
          {
            name: "Strips 'Bearer ' prefix from Authorization header",
            passed,
            expected: "authHeader.split(' ')[1] or authHeader.replace('Bearer ', '')",
            received: stillPassesRawHeader ? "const token = authHeader (Raw header with 'Bearer ' prefix)" : passed ? "Clean token extracted" : "Invalid token extraction",
            message: stillPassesRawHeader
              ? "JsonWebTokenError: jwt malformed! The raw header contains 'Bearer <token>'. jwt.verify only accepts the raw signature."
              : passed
              ? "Token stripped of 'Bearer ' prefix and cleanly parsed."
              : "Extract the token using authHeader.split(' ')[1].",
          },
          {
            name: "Raw token passed to jwt.verify",
            passed,
            expected: "jwt.verify(token, process.env.JWT_SECRET)",
            received: passed ? "jwt.verify receives raw token" : "Token contains invalid prefix",
            message: passed
              ? "Authentication signature validated without parsing errors."
              : "Ensure the raw token without 'Bearer ' is verified.",
          },
        ],
      };
    }

    case "pagination-bug": {
      const usesZeroIndexedOffset = /\(\s*pageNum\s*-\s*1\s*\)\s*\*\s*limitNum/.test(cleanCode) ||
        /\(\s*page\s*-\s*1\s*\)\s*\*\s*limit/.test(cleanCode);
      const usesOneIndexedOffset = /const\s+skip\s*=\s*pageNum\s*\*\s*limitNum/.test(cleanCode) ||
        /const\s+skip\s*=\s*page\s*\*\s*limit/.test(cleanCode);

      const passed = usesZeroIndexedOffset && !usesOneIndexedOffset;

      return {
        passed,
        results: [
          {
            name: "Calculates zero-indexed offset for Page 1",
            passed,
            expected: "skip === 0 when page === 1",
            received: usesOneIndexedOffset ? "skip === 10 for page 1 (Skipped 1st batch!)" : passed ? "skip === 0 for page 1" : "Invalid skip formula",
            message: usesOneIndexedOffset
              ? "Page 1 skipped 10 items! Page 1 should start at index 0. Use (page - 1) * limit."
              : passed
              ? "Page 1 offset starts correctly at index 0."
              : "Formula should be (pageNum - 1) * limitNum.",
          },
          {
            name: "Pagination math formula verified",
            passed,
            expected: "const skip = (pageNum - 1) * limitNum;",
            received: passed ? "(pageNum - 1) * limitNum" : "Off-by-one error present",
            message: passed
              ? "Offset formula verified across all pages."
              : "Subtract 1 from the page index before multiplying by the limit.",
          },
        ],
      };
    }

    case "race-condition": {
      const usesSpreadCart = /setCart\(\s*\[\s*\.\.\.cart\s*,\s*item\s*\]\s*\)/.test(cleanCode) ||
        /setCart\(\s*\(\s*prevCart\s*\)\s*=>\s*\[\s*\.\.\.prevCart\s*,\s*item\s*\]\s*\)/.test(cleanCode) ||
        /setCart\(\s*\(?prev\)?\s*=>\s*\[\s*\.\.\.prev\s*,\s*item\s*\]\s*\)/.test(cleanCode) ||
        /setCart\(\s*cart\.concat\(\s*item\s*\)\s*\)/.test(cleanCode);
      const stillUsesPush = /cart\.push\(\s*item\s*\)/.test(cleanCode);

      const passed = usesSpreadCart && !stillUsesPush;

      return {
        passed,
        results: [
          {
            name: "Immutable state update with spread syntax",
            passed,
            expected: "setCart([...cart, item]) or setCart(prev => [...prev, item])",
            received: stillUsesPush ? "cart.push(item) (Direct array mutation)" : passed ? "Immutable new array created" : "Invalid state update",
            message: stillUsesPush
              ? "Direct state mutation! cart.push() mutates the array in-place. React skips re-rendering because Object.is(cart, cart) is true."
              : passed
              ? "State updated immutably, ensuring clean re-renders."
              : "Use setCart([...cart, item]) instead of cart.push().",
          },
          {
            name: "React state reference integrity",
            passed,
            expected: "New array memory reference passed to setCart",
            received: passed ? "New reference allocated" : "Same reference reused",
            message: passed
              ? "DOM updates immediately reflect the added cart item."
              : "Avoid mutating existing state objects directly.",
          },
        ],
      };
    }

    // ==========================================
    // ☠️ PRODUCTION INCIDENTS
    // ==========================================
    case "prod-slow-api-n1": {
      const usesPopulate = /\.populate\(\s*["']userId["']/.test(cleanCode);
      const hasNPlusOneLoop = /orders\.map\s*\(\s*async\s*\(?order\)?\s*=>[\s\S]*?User\.findById/.test(cleanCode);
      const removesPromiseAllLoop = !hasNPlusOneLoop;

      const passed = usesPopulate && removesPromiseAllLoop;

      return {
        passed,
        results: [
          {
            name: "Eliminates N+1 database query loop",
            passed: removesPromiseAllLoop,
            expected: "Zero User.findById queries inside orders.map loop",
            received: hasNPlusOneLoop ? "101 queries executed per request (Connection pool exhausted)" : "Loop removed",
            message: hasNPlusOneLoop
              ? "SEV-1 ALERT: 100 queries still running in parallel inside map loop. Connection pool exhausted!"
              : "N+1 query bottleneck successfully eliminated.",
          },
          {
            name: "Uses Mongoose .populate()",
            passed: usesPopulate,
            expected: "Order.find()...populate('userId', 'name email')",
            received: usesPopulate ? ".populate('userId', ...) applied" : "Missing .populate() query modifier",
            message: usesPopulate
              ? "Mongoose joins records with a single optimized batch query ($in)."
              : "Chain .populate('userId', 'name email') to Order.find().",
          },
          {
            name: "Response time drop verified",
            passed,
            expected: "API response time < 50ms (from 8,420ms)",
            received: passed ? "38ms (99.5% latency reduction)" : "8,421ms (504 Gateway Timeout)",
            message: passed
              ? "All 3,421 affected users recovered. Production incident resolved!"
              : "Database query overhead is still causing gateway timeouts.",
          },
        ],
      };
    }

    case "prod-memory-leak": {
      const handlesReqClose = /req\.on\(\s*["']close["']/.test(cleanCode);
      const removesListener = /logEmitter\.(off|removeListener)\(\s*["']newLog["']\s*,\s*onNewLog\s*\)/.test(cleanCode);

      const passed = handlesReqClose && removesListener;

      return {
        passed,
        results: [
          {
            name: "Registers connection close cleanup handler",
            passed: handlesReqClose,
            expected: "req.on('close', () => { ... })",
            received: handlesReqClose ? "req.on('close', ...) attached" : "No close event handler",
            message: handlesReqClose
              ? "HTTP disconnect event detected."
              : "Listen for client disconnect via req.on('close', ...).",
          },
          {
            name: "Removes event listener on disconnect",
            passed: removesListener,
            expected: "logEmitter.off('newLog', onNewLog) or removeListener",
            received: removesListener ? "Listener cleaned up on close" : "Listener retained in memory forever",
            message: removesListener
              ? "Event listener unbound upon client disconnect."
              : "Call logEmitter.off('newLog', onNewLog) inside the close handler.",
          },
          {
            name: "Process memory leak prevented",
            passed,
            expected: "Active listeners: 0 after client disconnect",
            received: passed ? "Heap usage stable at 120MB" : "Heap memory: 1.98 GB (Fatal OOM crash)",
            message: passed
              ? "Garbage collection freed request closures. CrashLoopBackOff resolved!"
              : "Memory leak persists. Node.js heap limit will be exceeded under traffic.",
          },
        ],
      };
    }

    case "prod-unhandled-rejection": {
      const hasTryCatch = /try\s*\{[\s\S]*?\}\s*catch\s*\(\s*error\s*\)\s*\{/.test(cleanCode) ||
        /try\s*\{[\s\S]*?\}\s*catch\s*\{/.test(cleanCode);
      const hasIdempotencyCheck = /PaymentRecord\.findOne\(/.test(cleanCode) &&
        /paymentIntent\.id/.test(cleanCode);
      const acknowledgesDuplicate = /res\.json\(\s*\{[\s\S]*?received:\s*true/.test(cleanCode);

      const passed = hasTryCatch && hasIdempotencyCheck;

      return {
        passed,
        results: [
          {
            name: "Idempotency check for duplicate webhook deliveries",
            passed: hasIdempotencyCheck,
            expected: "await PaymentRecord.findOne({ paymentIntentId: paymentIntent.id })",
            received: hasIdempotencyCheck ? "Duplicate check present" : "No idempotency check (Double charging)",
            message: hasIdempotencyCheck
              ? "Webhook verified against previously completed records."
              : "Check if PaymentRecord already exists before granting credits.",
          },
          {
            name: "Wrapped in try/catch block",
            passed: hasTryCatch,
            expected: "try { ... } catch (error) { ... }",
            received: hasTryCatch ? "try/catch implemented" : "Unhandled promise rejections crashing Node process",
            message: hasTryCatch
              ? "Server safely catches database errors and responds with HTTP error codes."
              : "Wrap webhook handling in try/catch to avoid unhandled rejections.",
          },
          {
            name: "Retry storm averted",
            passed,
            expected: "HTTP 200 returned for duplicates to stop Stripe retries",
            received: passed ? "HTTP 200 delivered" : "HTTP 500 triggering repeated retries",
            message: passed
              ? "Duplicate credits prevented for all 412 customers. Production incident resolved!"
              : "Ensure duplicate events return HTTP 200 without issuing duplicate credits.",
          },
        ],
      };
    }

    default:
      return {
        passed: false,
        results: [
          {
            name: "Unknown challenge validation",
            passed: false,
            expected: "Known challenge ID",
            received: challengeId,
            message: "Challenge validation logic not found.",
          },
        ],
      };
  }
}
