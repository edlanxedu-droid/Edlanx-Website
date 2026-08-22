const path = require("path");
const { getSession } = require(path.join(process.cwd(), "lib", "auth"));

module.exports = async (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: "Not authenticated" });
  return res.status(200).json({ username: session.username });
};
