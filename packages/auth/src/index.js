import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export function createAccessToken(payload, secret) {
    return jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: "7d"
    });
}
export function verifyAccessToken(token, secret) {
    return jwt.verify(token, secret);
}
