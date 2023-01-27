import { NextApiRequest, NextApiResponse } from "next";
import Data from "../../../lib/data";
import bcrypt from "bcryptjs"
import { StoredUserType } from "../../../types/user";
import jwt from "jsonwebtoken";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { email, firstname, lastname, password, birthday } = req.body;

        if (!email || !firstname || !lastname || !password || !birthday) {
            res.statusCode = 400;
            return res.send("필수 데이터가 없습니다");
        }

        const userExist = Data.user.exist({ email });
        if (userExist) {
            res.statusCode = 409;
            res.send("이미 가입된 이메일 입니다");
        }
        // 비밀번호 암호화
        const hashedPassword = bcrypt.hashSync(password, 8);
        const users = Data.user.getList();
        let userId;
        if (users.length === 0)  {
            userId = 1;
        } else {
            userId = users[users.length - 1].id + 1
        }
        const newUser: StoredUserType = {
            id: userId,
            email,
            firstname,
            lastname,
            password: hashedPassword,
            birthday,
            profileImage: "/static/image/user/default_user_profile_image.jpg",
        };
        
        Data.user.write([...users, newUser]);
        // Cookie Expire Time Set
        var expires = new Date();
        const koreaTimeDiff = 9 * 60 * 60 * 1000; // 한국 시간은 UTC보다 9시간 빠름(9시간의 밀리세컨드 표현)
        expires.setTime(expires.getTime() + koreaTimeDiff + 30 * 60 * 1000);

        const token = jwt.sign(String(newUser.id), process.env.JWT_SECRET!);
        res.setHeader("Set-Cookie",
            `access_token=${token}; path=/; expires=${expires.toUTCString()}); httponly`);

        // StoredUserType 의 password 속성을 partial 로 만든 타입을 만듭니다 
        // 타입 에러 없이 delete 속성을 사용하기 위해
        const newUserWithoutPassword: Partial<Pick<StoredUserType,"password">> = newUser;

        delete newUserWithoutPassword.password;
        res.statusCode = 200;
        return res.end(JSON.stringify(newUser));   
    }
    res.statusCode = 405;

    return res.end();
};