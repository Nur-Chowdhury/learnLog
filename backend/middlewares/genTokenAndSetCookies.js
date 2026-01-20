import jwt from 'jsonwebtoken';

export const genTokenAndSetCookies = (res, userId, role) => {
    const token = jwt.sign({id: userId, role}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
}