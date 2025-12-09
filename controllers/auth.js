const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user'); 

// 사용자가 보낸 정보로 계정을 생성 (회원가입)
exports.join = async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        // 시퀄라이즈의 findOne 사용
        const exUser = await User.findOne({ where: { email } });
        
        if (exUser) { // 이미 존재하는 이메일이면
            return res.redirect('/join?error=exist');
        }
        
        const hash = await bcrypt.hash(password, 12);
        
        // [수정] db.execute INSERT 대신 시퀄라이즈의 create 사용
        await User.create({
            email,
            nick,
            password: hash,
        });
        
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

// 로그인 로직
exports.login = (req, res, next) => {
    passport.authenticate('local', (authErr, user, info) => {
        if (authErr) {
            console.error(authErr);
            return next(authErr);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

// 로그아웃 로직
exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};