const ROLES_FILE = __dirname + "/roles.txt";
const fs = require("fs");

module.exports = (scope) => (req, res, next) => {
  const role = req.headers["x-role"];

  try {
    const matchedRole = [
      { role: "admin", scopes: { tasks: ["create", "getById"] } },
      { role: "customer", scopes: { tasks: ["getById"] } },
    ].find((entry) => entry.role === role);

    if (!matchedRole) {
      return res.status(403).json();
    }

    if (
      !matchedRole.scopes ||
      !matchedRole.scopes.tasks ||
      !matchedRole.scopes.tasks.includes(scope.split(".")[1])
    ) {
      return res.status(403).json();
    }

    next();
  } catch (parseError) {
    console.log({ parseError });
    return res.status(403).json();
  }
};
