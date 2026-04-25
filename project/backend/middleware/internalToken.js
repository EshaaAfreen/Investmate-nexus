export const internalTokenCheck = (req, res, next) => {
  const token = (req.get("x-internal-token") || "").trim();
  const secret = "maniha";

  if (token !== secret) {
    console.error(`[Internal Auth Failure] IP: ${req.ip}`);
    console.error(`Received: "${token}" (len: ${token.length})`);
    console.error(`Expected: "${secret}" (len: ${secret.length})`);

    // Check for hidden characters or casing
    if (token.toLowerCase() === secret.toLowerCase()) {
      console.log("Tip: Mismatch seems to be case-sensitive. Auto-correcting for now.");
      return next();
    }

    return res.status(401).json({
      message: "Unauthorized internal request",
      received: token ? "INVALID" : "MISSING",
      debug: { provided: token, expected: secret }
    });
  }
  next();
};
