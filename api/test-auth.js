const { verifyPassword, createSessionCookie } = require(" ../lib/auth\);

module.exports = async (req, res) => {
 try {
 const verified = verifyPassword(\EdlanxAdmin2026!\, \salt:hash\);
 const cookie = createSessionCookie({ id: 1, username: \admin\ });
 return res.status(200).json({ ok: true, verified, cookie });
 } catch (err) {
 return res.status(500).json({ error: err.message, stack: err.stack });
 }
};
