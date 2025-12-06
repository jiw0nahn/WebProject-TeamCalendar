const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require(process.cwd() + '/models');

// 사용자가 보낸 정보로 계정을 생성
exports.join = async (req, res, next) => {
    const {email, nick, password} = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email=?', [email]);
        if (rows.length > 0) { // 이미 존재하는 계정이라면
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호를 해싱하여 DB 관리자도 원래 비밀번호 무엇인지 알 수 없게 함
        // 이후, 새로운 유저 정보 insert
        await db.execute('INSERT INTO users (email, nick, password) VALUES (?, ?, ?)', [email, nick, hash]);
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

// 로그인 시 사용자가 입력한 ID와 PW가 맞는지 확인하고 세션을 만들어 주는 함수
exports.login = (req, res, next) => {
    // passport 인증 라이브러리를 사용하여 DB에 저장된 user로 로그인
    passport.authenticate('local', (authErr, user, info) => {
        if (authErr) {
            console.error(authErr);
            return next(authErr);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        // 로그인 성공 시
        return req.login(user, (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};