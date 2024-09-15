function authMiddleware (req, res, next) {
    if (req.session.userId) {
        return next();
    }

    res.status(401).json({ message: "Session unauthorized" });
}

export default authMiddleware;