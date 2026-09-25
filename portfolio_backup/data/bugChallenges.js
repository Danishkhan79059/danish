/**
 * BUG CHALLENGES DATASET
 * 14 realistic debugging challenges across 4 difficulty tiers:
 * 🟢 Beginner (100 XP)
 * 🟡 Intermediate (250 XP)
 * 🔴 Advanced (500 XP)
 * ☠️ Production Bug (1000 XP)
 */

export const DIFFICULTY_TIERS = {
  BEGINNER: {
    id: "beginner",
    name: "Beginner",
    label: "🟢 Beginner",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    glowColor: "rgba(16, 185, 129, 0.15)",
    baseXP: 100,
    description: "Simple JavaScript bugs: wrong variables, syntax mistakes, conditions, and array methods.",
  },
  INTERMEDIATE: {
    id: "intermediate",
    name: "Intermediate",
    label: "🟡 Intermediate",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    glowColor: "rgba(245, 158, 11, 0.15)",
    baseXP: 250,
    description: "Realistic full-stack bugs: async/await, Express headers, React effects, and MongoDB queries.",
  },
  ADVANCED: {
    id: "advanced",
    name: "Advanced",
    label: "🔴 Advanced",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    glowColor: "rgba(244, 63, 94, 0.15)",
    baseXP: 500,
    description: "Complex system bugs: race conditions, auth/JWT logic, pagination math, and state mutation.",
  },
  PRODUCTION: {
    id: "production",
    name: "Production Bug",
    label: "☠️ Production Bug",
    badgeColor: "bg-red-100 text-red-800 border-red-300 animate-pulse",
    glowColor: "rgba(239, 68, 68, 0.2)",
    baseXP: 1000,
    description: "High-severity live incidents: N+1 queries, memory leaks, and unhandled webhook crashes.",
  },
};

export const BUG_CHALLENGES = [
  // ==========================================
  // 🟢 BEGINNER (4 Challenges - 100 XP each)
  // ==========================================
  {
    id: "undefined-variable",
    title: "Undefined Variable in Express Endpoint",
    difficulty: "beginner",
    category: "JavaScript Basics",
    tags: ["Express", "Variables", "Node.js"],
    baseXP: 100,
    language: "javascript",
    summary: "The API endpoint sends an undefined variable instead of the retrieved database records.",
    description: `You have an Express.js route \`/api/users\` that queries all users from the database. 
However, frontend clients report receiving an empty or \`undefined\` response. 

Inspect the route handler and make sure the fetched database results are properly sent in the JSON response.`,
    expectedBehavior: "The endpoint must send `users` (the resolved database records) in `res.json()`.",
    brokenCode: `app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(user);
});`,
    hints: [
      {
        id: 1,
        text: "Check the variable names carefully inside the route handler.",
        penalty: 10,
      },
      {
        id: 2,
        text: "The database query stores results into 'const users', but res.json() references 'user' without an 's'.",
        penalty: 25,
      },
    ],
    solution: `app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});`,
    explanation: `The variable returned from \`await User.find()\` was declared as \`users\`, but the response was calling \`res.json(user)\`. 
In JavaScript, referencing \`user\` resulted in a \`ReferenceError: user is not defined\` or sent an undefined payload. 
Fixing the parameter to \`res.json(users)\` correctly returns the queried array.`,
    tests: [
      {
        name: "Route handler sends defined users variable",
        description: "Checks that res.json sends 'users' instead of 'user'",
        expected: "res.json(users)",
      },
      {
        name: "No undefined ReferenceError",
        description: "Ensures the response variable matches the declared constant",
        expected: "const users = await User.find() matches res.json(users)",
      },
    ],
  },
  {
    id: "wrong-array-method",
    title: "Missing Return in Array Map",
    difficulty: "beginner",
    category: "Array Methods",
    tags: ["Arrays", "ES6", "Transformation"],
    baseXP: 100,
    language: "javascript",
    summary: "Array.prototype.map produces an array of undefined values because the block body lacks a return statement.",
    description: `A function \`formatUsernames\` is supposed to take an array of user objects and return their handles prefixed with \`@\`.
Currently, it returns \`[undefined, undefined, undefined]\`.

Fix the callback function inside \`.map()\` so the transformed string is returned.`,
    expectedBehavior: "Return an array where each item is formatted as `@` followed by `user.username`.",
    brokenCode: `function formatUsernames(users) {
  return users.map((user) => {
    \`@\${user.username}\`;
  });
}`,
    hints: [
      {
        id: 1,
        text: "When using curly braces '{ }' in an arrow function, an explicit return is required.",
        penalty: 10,
      },
      {
        id: 2,
        text: "Either add 'return \`@\${user.username}\`;' or remove the curly braces for an implicit return.",
        penalty: 25,
      },
    ],
    solution: `function formatUsernames(users) {
  return users.map((user) => \`@\${user.username}\`);
}`,
    explanation: `In arrow functions, if you use a block body with curly brackets \`{ ... }\`, JavaScript does not implicitly return the expression. 
Without an explicit \`return\`, the function returns \`undefined\` for each item. 
Fix by using an implicit return \`(user) => \`@\${user.username}\`\` or adding \`return\` before the template literal.`,
    tests: [
      {
        name: "Returns formatted array of strings",
        description: "formatUsernames([{ username: 'danish' }]) should yield ['@danish']",
        expected: "['@danish', '@alex']",
      },
      {
        name: "No undefined elements",
        description: "Ensures map callback does not evaluate to undefined",
        expected: "No undefined elements in mapped array",
      },
    ],
  },
  {
    id: "broken-function",
    title: "Discount Calculator Missing Return",
    difficulty: "beginner",
    category: "Functions",
    tags: ["Functions", "Math", "Logic"],
    baseXP: 100,
    language: "javascript",
    summary: "The calculateDiscountedPrice function executes the calculation but yields undefined to callers.",
    description: `The checkout system calls \`calculateDiscountedPrice(price, discountPercent)\` to calculate the final price after applying a percentage discount.
However, invoices are displaying \`NaN\` or \`undefined\` because the function does not return the final calculated value.

Fix the function so it returns the discounted price.`,
    expectedBehavior: "The function must return `price - (price * discountPercent) / 100`.",
    brokenCode: `function calculateDiscountedPrice(price, discountPercent) {
  const discountAmount = (price * discountPercent) / 100;
  const finalPrice = price - discountAmount;
}`,
    hints: [
      {
        id: 1,
        text: "The function computes `finalPrice`, but what does it send back to the caller?",
        penalty: 10,
      },
      {
        id: 2,
        text: "Add `return finalPrice;` at the end of the function body.",
        penalty: 25,
      },
    ],
    solution: `function calculateDiscountedPrice(price, discountPercent) {
  const discountAmount = (price * discountPercent) / 100;
  const finalPrice = price - discountAmount;
  return finalPrice;
}`,
    explanation: `Functions in JavaScript return \`undefined\` by default if no \`return\` statement is provided. 
Although \`finalPrice\` was calculated correctly, the function completed without sending the value back. 
Adding \`return finalPrice;\` resolves the issue.`,
    tests: [
      {
        name: "Returns correct discounted price",
        description: "calculateDiscountedPrice(100, 20) should equal 80",
        expected: "80",
      },
      {
        name: "Return statement exists",
        description: "Function contains an explicit return statement",
        expected: "return finalPrice or return price - discountAmount",
      },
    ],
  },
  {
    id: "incorrect-condition",
    title: "Accidental Assignment in Permission Check",
    difficulty: "beginner",
    category: "Conditional Logic",
    tags: ["Conditionals", "Operators", "Security"],
    baseXP: 100,
    language: "javascript",
    summary: "A single equals sign '=' in an if-statement assigns the role instead of comparing it.",
    description: `A security check is supposed to verify if the requesting user has the \`admin\` role before granting access to sensitive dashboard controls.
Due to a typo, any regular user is granted access, and their user object is accidentally mutated!

Fix the condition so it performs a strict equality comparison.`,
    expectedBehavior: "Compare `user.role === 'admin'` without reassigning the property.",
    brokenCode: `function canAccessAdminPanel(user) {
  if (user.role = "admin") {
    return true;
  }
  return false;
}`,
    hints: [
      {
        id: 1,
        text: "Take a close look at the operator used inside the `if (...)` statement.",
        penalty: 10,
      },
      {
        id: 2,
        text: "A single '=' is an assignment. For strict comparison in JavaScript, use '==='.",
        penalty: 25,
      },
    ],
    solution: `function canAccessAdminPanel(user) {
  if (user.role === "admin") {
    return true;
  }
  return false;
}`,
    explanation: `In JavaScript, \`=\` is the assignment operator. \`user.role = "admin"\` mutates \`user.role\` to \`"admin"\` and evaluates to truthy \`"admin"\`, granting admin rights to everyone!
Replacing \`=\` with strict equality \`===\` correctly checks whether the user is an admin.`,
    tests: [
      {
        name: "Standard user access is denied",
        description: "canAccessAdminPanel({ role: 'guest' }) must return false",
        expected: "false",
      },
      {
        name: "Admin user access is approved",
        description: "canAccessAdminPanel({ role: 'admin' }) must return true",
        expected: "true",
      },
    ],
  },

  // ==========================================
  // 🟡 INTERMEDIATE (4 Challenges - 250 XP each)
  // ==========================================
  {
    id: "broken-express-api",
    title: "Headers Already Sent Error in Express",
    difficulty: "intermediate",
    category: "Node.js & Express",
    tags: ["Express", "HTTP", "Node.js"],
    baseXP: 250,
    language: "javascript",
    summary: "Missing return keyword before res.status(400).json() causes code execution to continue and throw 'Cannot set headers after they are sent to the client'.",
    description: `In this Express registration controller, when validation fails, the server sends a 400 Bad Request response. 
However, the server crashes with:
\`Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client\`

Find why execution continues past the error response and fix it.`,
    expectedBehavior: "Halt controller execution immediately when validation fails by returning the response.",
    brokenCode: `app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const newUser = await User.create({ email, password });
  return res.status(201).json(newUser);
});`,
    hints: [
      {
        id: 1,
        text: "Sending a response using `res.json()` does NOT automatically terminate the execution of the function.",
        penalty: 10,
      },
      {
        id: 2,
        text: "Notice that line 10 uses `return res.status(...)`, but line 5 is missing the `return` keyword.",
        penalty: 25,
      },
    ],
    solution: `app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const newUser = await User.create({ email, password });
  return res.status(201).json(newUser);
});`,
    explanation: `Calling \`res.json()\` sends the HTTP headers and body to the client, but JavaScript continues executing the remaining lines of the function unless you explicitly \`return\`. 
When execution hits the subsequent \`res.status(...)\`, Node.js throws \`ERR_HTTP_HEADERS_SENT\`. 
Adding \`return res.status(400).json(...)\` halts execution safely.`,
    tests: [
      {
        name: "Missing return keyword added to 400 check",
        description: "Ensures return res.status(400).json(...) is used",
        expected: "return res.status(400).json({ error: 'Email and password are required' })",
      },
      {
        name: "Prevents fall-through to database queries",
        description: "Validates handler exits early when fields are missing",
        expected: "Early exit on missing fields",
      },
    ],
  },
  {
    id: "async-await-bug",
    title: "Un-awaited Password Hash in Authentication",
    difficulty: "intermediate",
    category: "Asynchronous JavaScript",
    tags: ["Async/Await", "Promises", "Bcrypt", "Security"],
    baseXP: 250,
    language: "javascript",
    summary: "bcrypt.hash is an asynchronous function returning a Promise. Saving without 'await' stores '[object Promise]' in the database.",
    description: `During user registration, passwords must be securely hashed using \`bcrypt.hash\`.
However, users are unable to log in after registering. When inspecting MongoDB, the password field literally contains \`{}\` or \`[object Promise]\`!

Fix the password hashing logic so the actual hashed string is stored.`,
    expectedBehavior: "Wait for the Promise returned by `bcrypt.hash` to resolve before creating the user.",
    brokenCode: `async function registerUser(email, plainPassword) {
  const saltRounds = 10;
  const hashedPassword = bcrypt.hash(plainPassword, saltRounds);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
}`,
    hints: [
      {
        id: 1,
        text: "bcrypt.hash is an asynchronous operation that returns a Promise.",
        penalty: 10,
      },
      {
        id: 2,
        text: "Add the `await` keyword before `bcrypt.hash(plainPassword, saltRounds)`.",
        penalty: 25,
      },
    ],
    solution: `async function registerUser(email, plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
}`,
    explanation: `\`bcrypt.hash()\` returns a Promise. Without \`await\`, \`hashedPassword\` is assigned a pending Promise object instead of the hashed string. 
When saved to MongoDB, Mongoose casts the unresolved promise to a string or empty object. 
Adding \`await\` ensures the hash calculation finishes before passing it to \`User.create()\`.`,
    tests: [
      {
        name: "bcrypt.hash is properly awaited",
        description: "Checks that await is placed before bcrypt.hash",
        expected: "await bcrypt.hash(plainPassword, saltRounds)",
      },
      {
        name: "Resolves hash string before model insertion",
        description: "Ensures password field gets resolved string, not pending promise",
        expected: "Resolved string saved to database",
      },
    ],
  },
  {
    id: "react-useeffect-bug",
    title: "Infinite Loop in React useEffect",
    difficulty: "intermediate",
    category: "React Hooks",
    tags: ["React", "useEffect", "State", "Hooks"],
    baseXP: 250,
    language: "javascript",
    summary: "A useEffect hook with no dependency array updates state inside its body, triggering continuous re-renders.",
    description: `A React component fetches notifications on mount and stores them in state.
Users report that their browser tab freezes and CPU usage spikes to 100%. The server logs show thousands of requests per second from the same client!

Fix the \`useEffect\` hook to prevent this infinite re-render cycle.`,
    expectedBehavior: "Only fetch notifications once when the component mounts by providing an empty dependency array.",
    brokenCode: `function NotificationBadge() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      });
  });

  return <span className="badge">{notifications.length}</span>;
}`,
    hints: [
      {
        id: 1,
        text: "Look at the second argument passed to `useEffect(...)`.",
        penalty: 10,
      },
      {
        id: 2,
        text: "Without a dependency array `[]`, useEffect runs after EVERY render. Since `setNotifications` triggers a re-render, it creates an infinite loop. Add `[]` as the second argument.",
        penalty: 25,
      },
    ],
    solution: `function NotificationBadge() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      });
  }, []);

  return <span className="badge">{notifications.length}</span>;
}`,
    explanation: `When \`useEffect\` is called without a second argument (dependency array), it executes after *every single render*. 
Because the fetch callback calls \`setNotifications(data)\`, it triggers another render, which triggers \`useEffect\` again, causing an infinite loop. 
Supplying an empty dependency array \`[]\` ensures the effect runs only once on mount.`,
    tests: [
      {
        name: "Dependency array provided",
        description: "useEffect includes empty dependency array [] to prevent loops",
        expected: "useEffect(() => { ... }, [])",
      },
      {
        name: "Single execution on mount",
        description: "Effect only runs once instead of re-executing infinitely",
        expected: "Effect runs once on mount",
      },
    ],
  },
  {
    id: "mongodb-query-bug",
    title: "MongoDB Update Query Overwriting Document",
    difficulty: "intermediate",
    category: "Databases & MongoDB",
    tags: ["MongoDB", "Mongoose", "Database"],
    baseXP: 250,
    language: "javascript",
    summary: "Missing $set atomic operator in updateOne causes unintended field replacement or schema validation bypass.",
    description: `A profile update endpoint allows users to update their bio. 
However, after updating their bio, users complain that their username, email, and joinedDate have completely disappeared from their profile!

Fix the MongoDB \`updateOne\` query to only update the bio field without overwriting the rest of the document.`,
    expectedBehavior: "Use the `$set` operator in MongoDB `updateOne` to perform a partial field update.",
    brokenCode: `async function updateUserBio(userId, newBio) {
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { bio: newBio }
  );
  return result;
}`,
    hints: [
      {
        id: 1,
        text: "In native MongoDB driver, passing `{ bio: newBio }` without an operator attempts to replace the entire document content (or throws an update modifier error).",
        penalty: 10,
      },
      {
        id: 2,
        text: "Wrap the update fields inside the `{ $set: { bio: newBio } }` atomic operator.",
        penalty: 25,
      },
    ],
    solution: `async function updateUserBio(userId, newBio) {
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { bio: newBio } }
  );
  return result;
}`,
    explanation: `In standard MongoDB operations, update operations require atomic operators like \`$set\` to modify specific fields. 
Passing \`{ bio: newBio }\` directly without \`$set\` is either rejected by modern MongoDB drivers or replaces the document fields. 
Using \`{ $set: { bio: newBio } }\` cleanly updates only the specified property.`,
    tests: [
      {
        name: "Uses $set operator in update",
        description: "Checks that $set: { bio: newBio } is used",
        expected: "{ $set: { bio: newBio } }",
      },
      {
        name: "Preserves document schema integrity",
        description: "Ensures other fields like email and username are not wiped",
        expected: "Partial update executed safely",
      },
    ],
  },

  // ==========================================
  // 🔴 ADVANCED (3 Challenges - 500 XP each)
  // ==========================================
  {
    id: "auth-jwt-bug",
    title: "Broken JWT Authorization Header Parsing",
    difficulty: "advanced",
    category: "Security & Authentication",
    tags: ["JWT", "Auth", "Middleware", "Security"],
    baseXP: 500,
    language: "javascript",
    summary: "Auth middleware crashes with 'jwt malformed' because it fails to strip the 'Bearer ' prefix and handles missing headers incorrectly.",
    description: `In this authentication middleware, requests with \`Authorization: Bearer <token>\` are consistently rejected with 401 Unauthorized or crash with \`JsonWebTokenError: jwt malformed\`.

Inspect the authorization header extraction, strip the \`Bearer \` prefix properly, and verify the token.`,
    expectedBehavior: "Properly extract the token from `req.headers.authorization`, stripping `Bearer `, and verify it with `jwt.verify`.",
    brokenCode: `function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Bug: Passing the entire header including 'Bearer ' string directly to verify
  const token = authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}`,
    hints: [
      {
        id: 1,
        text: "Authorization headers are typically formatted as 'Bearer <actual_token>'. jwt.verify only accepts the raw token string.",
        penalty: 10,
      },
      {
        id: 2,
        text: "Extract the token using `authHeader.split(' ')[1]` or `authHeader.replace('Bearer ', '')`.",
        penalty: 25,
      },
    ],
    solution: `function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1] || authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}`,
    explanation: `Standard HTTP Authorization headers follow the schema \`Bearer <jwt_token>\`. 
If you pass the raw header value \`"Bearer eyJhbGci..."\` directly into \`jwt.verify()\`, the library attempts to parse \`"Bearer"\` as the header part of the JWT, immediately throwing \`jwt malformed\`. 
Splitting the header by space and taking the second element (\`authHeader.split(" ")[1]\`) isolates the signature.`,
    tests: [
      {
        name: "Extracts token by removing Bearer prefix",
        description: "Token is parsed using split(' ')[1] or replace('Bearer ', '')",
        expected: "authHeader.split(' ')[1]",
      },
      {
        name: "Passes valid token to jwt.verify",
        description: "Verified token passes successfully without malformed errors",
        expected: "jwt.verify receives raw token",
      },
    ],
  },
  {
    id: "pagination-bug",
    title: "Off-by-One Pagination Calculation",
    difficulty: "advanced",
    category: "Backend Logic",
    tags: ["Pagination", "MongoDB", "SQL", "APIs"],
    baseXP: 500,
    language: "javascript",
    summary: "The pagination skip offset multiplies page directly by limit, causing Page 1 to skip the first batch of results entirely.",
    description: `A product listing API provides pagination with query parameters \`?page=1&limit=10\`.
When customers visit Page 1, items 1 through 10 are missing! Instead, they see items 11 through 20. When visiting the last page, they get an empty list.

Fix the pagination offset calculation so that Page 1 starts at index 0.`,
    expectedBehavior: "Calculate offset as `(page - 1) * limit`, ensuring Page 1 has `skip = 0`.",
    brokenCode: `async function getPaginatedProducts(page = 1, limit = 10) {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Bug: Page 1 skips (1 * 10) = 10 items!
  const skip = pageNum * limitNum;

  const products = await Product.find()
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments();

  return {
    products,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
  };
}`,
    hints: [
      {
        id: 1,
        text: "What is `skip` when `pageNum` is 1? (1 * 10 = 10). Should Page 1 skip 10 items or 0 items?",
        penalty: 10,
      },
      {
        id: 2,
        text: "Calculate skip as `(pageNum - 1) * limitNum` so page 1 results in `0 * 10 = 0`.",
        penalty: 25,
      },
    ],
    solution: `async function getPaginatedProducts(page = 1, limit = 10) {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find()
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments();

  return {
    products,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
  };
}`,
    explanation: `Pagination in 1-indexed APIs requires offsetting by \`(page - 1) * limit\`. 
When calculating \`pageNum * limitNum\` for Page 1, \`skip\` evaluated to 10, accidentally discarding the newest 10 products from the first page. 
Using \`(pageNum - 1) * limitNum\` ensures Page 1 starts at offset 0, Page 2 starts at 10, etc.`,
    tests: [
      {
        name: "Page 1 yields skip offset of 0",
        description: "(1 - 1) * 10 = 0",
        expected: "skip === 0 for page 1",
      },
      {
        name: "Correct formula (pageNum - 1) * limitNum",
        description: "Subtracts 1 from page before multiplying by limit",
        expected: "(pageNum - 1) * limitNum",
      },
    ],
  },
  {
    id: "race-condition",
    title: "Direct State Mutation in React",
    difficulty: "advanced",
    category: "React Architecture",
    tags: ["React", "Immutability", "State Management"],
    baseXP: 500,
    language: "javascript",
    summary: "Mutating state array directly using push() avoids re-renders and causes race conditions when multiple items are added.",
    description: `A shopping cart component allows users to add items. 
Users report that clicking 'Add to Cart' doesn't update the cart badge or list until they refresh the page or click another unrelated button.

Fix the state update so it follows React's immutability principles and properly triggers a re-render.`,
    expectedBehavior: "Return a new array containing the existing items plus the new item using spread syntax or functional update.",
    brokenCode: `function useShoppingCart() {
  const [cart, setCart] = useState([]);

  const addItem = (item) => {
    // Bug: Mutating state directly and setting same reference
    cart.push(item);
    setCart(cart);
  };

  return { cart, addItem };
}`,
    hints: [
      {
        id: 1,
        text: "React checks whether state changed by comparing object references (Object.is). If you mutate the existing array and pass it to setState, React sees the same reference and skips rendering!",
        penalty: 10,
      },
      {
        id: 2,
        text: "Use the spread operator to create a brand new array: `setCart([...cart, item])` or `setCart(prev => [...prev, item])`.",
        penalty: 25,
      },
    ],
    solution: `function useShoppingCart() {
  const [cart, setCart] = useState([]);

  const addItem = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  return { cart, addItem };
}`,
    explanation: `In React, state must be treated as immutable. \`cart.push(item)\` mutates the existing array in-place. 
When \`setCart(cart)\` is called, React compares the previous state reference with the next state reference (\`Object.is(cart, cart)\`), finds them identical, and skips updating the DOM!
Creating a new array reference with \`[...prevCart, item]\` ensures React detects the update immediately.`,
    tests: [
      {
        name: "Immutability maintained with spread operator",
        description: "Creates new array reference without mutating original array",
        expected: "[...cart, item] or [...prevCart, item]",
      },
      {
        name: "No direct array.push on state",
        description: "Removes cart.push() mutation call",
        expected: "Direct push removed",
      },
    ],
  },

  // ==========================================
  // ☠️ PRODUCTION INCIDENTS (3 Challenges - 1000 XP each)
  // ==========================================
  {
    id: "prod-slow-api-n1",
    title: "N+1 Query Bottleneck in Orders API",
    difficulty: "production",
    category: "Database & Performance",
    tags: ["MongoDB", "Performance", "N+1 Problem", "Production Incident"],
    baseXP: 1000,
    language: "javascript",
    summary: "Fetching user data individually inside an orders map loop executes hundreds of synchronous DB queries, collapsing the database connection pool.",
    description: `🚨 LIVE PRODUCTION INCIDENT
API: /api/orders/recent
Error Rate: 42% (504 Gateway Timeouts)
Response Time: 8.4s
Users Affected: 3,421

The order dashboard endpoint is timing out under peak traffic. 
The developer wrote a \`map\` loop that executes a separate \`User.findById()\` query for every single order. 
With 100 orders, this executes 101 separate database roundtrips (the classic N+1 problem)!

Fix this by using Mongoose \`.populate("userId", "name email")\` on the original query, or batching with a single query, eliminating the inner loop database calls.`,
    expectedBehavior: "Populate `userId` directly on the `Order.find()` query or batch fetch to make only 1 or 2 queries instead of N+1.",
    incidentDetails: {
      endpoint: "/api/orders/recent",
      errorRate: "42.3%",
      responseTime: "8,420ms (p99: 14.2s)",
      affectedUsers: "3,421 users",
      status: "SEV-1 OUTAGE",
      logs: [
        `[14:22:01.102] ERROR: Pool connection timeout: maxPoolSize (100) exhausted.`,
        `[14:22:01.108] WARN: Query execution time for /api/orders/recent: 8421ms`,
        `[14:22:01.115] HTTP 504 GATEWAY TIMEOUT: Client closed connection after 5000ms`,
        `[14:22:01.130] DB STATS: 1,420 queries/sec for collection 'users' (User.findById)`,
      ],
      metrics: {
        cpuUsage: "94%",
        memoryUsage: "88%",
        dbConnections: "100/100 (Max)",
      },
    },
    brokenCode: `// INCIDENT SEV-1: /api/orders/recent
app.get("/api/orders/recent", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);

    // ☠️ CRITICAL BUG: N+1 query loop!
    // 100 separate database queries in parallel exhaust connection pool
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId).select("name email");
        return {
          ...order.toObject(),
          user,
        };
      })
    );

    res.json({ orders: ordersWithUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`,
    hints: [
      {
        id: 1,
        text: "Notice `Order.find()` at the top. Mongoose has a built-in `.populate()` method to join referenced collections in a single query.",
        penalty: 10,
      },
      {
        id: 2,
        text: "Chain `.populate('userId', 'name email')` onto `Order.find()` and remove the entire `Promise.all(orders.map(...))` loop.",
        penalty: 25,
      },
    ],
    solution: `// INCIDENT RESOLVED: Single batch query with .populate()
app.get("/api/orders/recent", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("userId", "name email");

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`,
    explanation: `The N+1 query problem occurs when an application executes 1 initial query plus N additional queries for each child record. 
Executing 100 individual \`User.findById()\` queries simultaneously exhausted the MongoDB connection pool and triggered 504 Gateway Timeouts.
By chaining \`.populate('userId', 'name email')\`, Mongoose executes a single optimized \`$in\` query behind the scenes, reducing response time from 8.4s to 45ms!`,
    tests: [
      {
        name: "Eliminates N+1 query map loop",
        description: "Removes Promise.all(orders.map(async ... User.findById))",
        expected: "Loop removed",
      },
      {
        name: "Uses Mongoose .populate()",
        description: "Applies .populate('userId', 'name email') to Order query",
        expected: ".populate('userId', 'name email')",
      },
      {
        name: "Response time drop verified",
        description: "Simulated load test drops response time from 8.4s to <50ms",
        expected: "Query count reduced from 101 to 2",
      },
    ],
  },
  {
    id: "prod-memory-leak",
    title: "Event Listener Memory Leak in Log Stream",
    difficulty: "production",
    category: "Node.js Runtime",
    tags: ["Memory Leak", "Node.js", "Streams", "Production Incident"],
    baseXP: 1000,
    language: "javascript",
    summary: "Registering global event listeners per SSE connection without removing them on client disconnect causes Node.js heap out of memory crashes.",
    description: `🚨 LIVE PRODUCTION INCIDENT
API: /api/logs/stream (Server-Sent Events)
Error: Fatal Error: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
Process Crashes: 18 restarts in the last hour
Pod Restarts: CrashLoopBackOff

A real-time log streaming endpoint listens to a global event emitter. 
Whenever a client connects, an event listener is added to \`logEmitter\`. 
However, when users close their browser tab, the listener remains attached forever, preventing garbage collection and leaking megabytes of memory on every connection!

Fix the memory leak by listening for the client disconnect event (\`req.on('close')\`) and removing the listener.`,
    expectedBehavior: "Register a cleanup callback on `req.on('close', ...)` to remove the listener with `logEmitter.off()` or `logEmitter.removeListener()`.",
    incidentDetails: {
      endpoint: "/api/logs/stream",
      errorRate: "35.8% (Process crashes)",
      responseTime: "Process killed (OOM)",
      affectedUsers: "2,190 developers",
      status: "SEV-1 CRITICAL CRASH",
      logs: [
        `[15:10:22.004] (node:42) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 418 data listeners added to [EventEmitter].`,
        `[15:10:45.912] FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`,
        `[15:10:46.100] Kubernetes pod worker-7f98b terminated with ExitCode 137 (OOMKilled)`,
      ],
      metrics: {
        cpuUsage: "100%",
        memoryUsage: "1.98 GB / 2.0 GB (Critical)",
        activeListeners: "1,248 listeners",
      },
    },
    brokenCode: `// INCIDENT SEV-1: Server-Sent Events Memory Leak
app.get("/api/logs/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onNewLog = (log) => {
    res.write(\`data: \${JSON.stringify(log)}\\n\\n\`);
  };

  // ☠️ CRITICAL BUG: Listener attached to global emitter
  // Client disconnects are never handled, listener stays in memory forever!
  logEmitter.on("newLog", onNewLog);
});`,
    hints: [
      {
        id: 1,
        text: "When an HTTP connection closes, Node.js emits a 'close' event on the 'req' object.",
        penalty: 10,
      },
      {
        id: 2,
        text: "Add `req.on('close', () => { logEmitter.off('newLog', onNewLog); });` to unbind the listener when the client disconnects.",
        penalty: 25,
      },
    ],
    solution: `// INCIDENT RESOLVED: Cleanup listener on request close
app.get("/api/logs/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onNewLog = (log) => {
    res.write(\`data: \${JSON.stringify(log)}\\n\\n\`);
  };

  logEmitter.on("newLog", onNewLog);

  // Clean up listener when connection drops
  req.on("close", () => {
    logEmitter.off("newLog", onNewLog);
  });
});`,
    explanation: `EventEmitters maintain strong references to callback functions in their internal listener registry. 
Because \`logEmitter\` is a long-lived global singleton, every connection registered a new \`onNewLog\` closure that retained the \`res\` object. 
When clients closed their tabs, the closures were never garbage-collected, leading to \`MaxListenersExceededWarning\` and eventual \`heap out of memory\` crashes.
Subscribing to \`req.on('close')\` and calling \`logEmitter.off()\` restores proper cleanup.`,
    tests: [
      {
        name: "Listens for connection close event",
        description: "Implements req.on('close', ...)",
        expected: "req.on('close', ...)",
      },
      {
        name: "Removes event listener on disconnect",
        description: "Calls logEmitter.off('newLog', onNewLog) or removeListener",
        expected: "logEmitter.off('newLog', onNewLog)",
      },
      {
        name: "Prevents memory leak",
        description: "Ensures emitter listener count resets when client disconnects",
        expected: "Zero leaked listeners",
      },
    ],
  },
  {
    id: "prod-unhandled-rejection",
    title: "Double-Charge in Stripe Webhook Handler",
    difficulty: "production",
    category: "Financial & Webhooks",
    tags: ["Stripe", "Webhooks", "Idempotency", "Production Incident"],
    baseXP: 1000,
    language: "javascript",
    summary: "Missing try/catch and idempotency check in payment webhook causes retry storms and duplicate user subscription credits.",
    description: `🚨 LIVE PRODUCTION INCIDENT
API: /api/webhooks/stripe
Error: UnhandledPromiseRejection: MongoServerError: E11000 duplicate key error
Duplicate Credits: 412 users received double credits
Stripe Retry Storm: Stripe received 500 error and retried 8 times

When Stripe sends a \`payment_intent.succeeded\` webhook, network hiccups or parallel delivery caused the webhook to be delivered twice. 
The handler lacked an idempotency check and try/catch block. 
When the second delivery arrived, the database crashed with unhandled rejection, returning HTTP 500, which made Stripe retry again, triggering an endless loop!

Fix the webhook handler by wrapping the logic in a \`try/catch\` block and checking if the payment has already been processed before granting credits.`,
    expectedBehavior: "Check if payment was already processed (`existingPayment`), acknowledge with 200, and wrap inside try/catch.",
    incidentDetails: {
      endpoint: "/api/webhooks/stripe",
      errorRate: "68.4% (Stripe Webhook Delivery Failures)",
      responseTime: "Unhandled Crash",
      affectedUsers: "412 paying customers",
      status: "SEV-1 REVENUE IMPACT",
      logs: [
        `[16:45:10.022] (node:104) UnhandledPromiseRejection: MongoServerError: duplicate key error`,
        `[16:45:10.035] POST /api/webhooks/stripe 500 Internal Server Error`,
        `[16:45:11.200] STRIPE WEBHOOK RETRY: Attempt 3 for event evt_1N4k12...`,
        `[16:45:11.250] CRITICAL: User 9821 credited $50 twice due to unacknowledged webhook!`,
      ],
      metrics: {
        revenueAtRisk: "$21,400",
        webhookRetryCount: "1,840 retries",
        dbConflicts: "412 duplicate key errors",
      },
    },
    brokenCode: `// INCIDENT SEV-1: Stripe Webhook Double Processing
app.post("/api/webhooks/stripe", async (req, res) => {
  const event = req.body;

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    // ☠️ CRITICAL BUG: No idempotency check and no try/catch!
    // If webhook retries, user is credited multiple times and DB throws unhandled 500
    await grantUserCredits(paymentIntent.customerId, paymentIntent.amount);
    await PaymentRecord.create({
      paymentIntentId: paymentIntent.id,
      status: "completed",
    });

    res.json({ received: true });
  }
});`,
    hints: [
      {
        id: 1,
        text: "Webhooks can be delivered more than once by providers like Stripe. You must check if `PaymentRecord.findOne({ paymentIntentId: paymentIntent.id })` already exists.",
        penalty: 10,
      },
      {
        id: 2,
        text: "If the payment was already processed, return `res.json({ received: true })` immediately. Also wrap the entire handler in a try/catch block to prevent 500 crashes.",
        penalty: 25,
      },
    ],
    solution: `// INCIDENT RESOLVED: Idempotency check + try/catch
app.post("/api/webhooks/stripe", async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Idempotency: Ignore duplicate deliveries
      const alreadyProcessed = await PaymentRecord.findOne({
        paymentIntentId: paymentIntent.id,
      });

      if (alreadyProcessed) {
        return res.json({ received: true, status: "already_processed" });
      }

      await grantUserCredits(paymentIntent.customerId, paymentIntent.amount);
      await PaymentRecord.create({
        paymentIntentId: paymentIntent.id,
        status: "completed",
      });

      return res.json({ received: true });
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
});`,
    explanation: `Stripe and other payment gateways guarantee *at-least-once* delivery, meaning webhooks can and will be sent multiple times due to retries or network blips.
Without an idempotency check, duplicate webhook deliveries cause duplicate balance credits and race conditions. 
By querying for \`PaymentRecord.findOne({ paymentIntentId })\` before crediting, subsequent duplicate webhooks are safely ignored and immediately acknowledged with HTTP 200.`,
    tests: [
      {
        name: "Idempotency check implemented",
        description: "Checks if PaymentRecord already exists before granting credits",
        expected: "PaymentRecord.findOne({ paymentIntentId: ... })",
      },
      {
        name: "Wrapped in try/catch block",
        description: "Prevents unhandled promise rejection crashes",
        expected: "try { ... } catch (error) { ... }",
      },
      {
        name: "Safe acknowledgement for duplicates",
        description: "Returns HTTP 200 for duplicate deliveries to stop retry storms",
        expected: "res.json({ received: true ... })",
      },
    ],
  },
];
