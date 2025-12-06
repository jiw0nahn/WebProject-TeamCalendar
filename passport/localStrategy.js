const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require(process.cwd() + '/models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
    }, async (email, password, done) => {
        try {
            // 해당 이메일을 가진 user 있는지 db 조회
            const [rows] = await db.execute('SELECT * FROM users WHERE email=?', [email]);
            if (rows.length > 0) {
                // 입력한 비번과 저장된 비번 비교
                const result = await bcrypt.compare(password, rows[0].password);
                if (result) {
                    done(null, rows[0]); // 일치 시 로그인
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
};