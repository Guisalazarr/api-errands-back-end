import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export class JwtService {
    public createToken(data: any): string {
        return jwt.sign(data, process.env.JWT_SECRET!);
    }

    public verifyToken(token: string): boolean {
        try {
            jwt.verify(token, process.env.JWT_SECRET!);
            return true;
        } catch {
            return false;
        }
    }
}
