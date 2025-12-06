// 로그인 성공 후 페이지 이동 시 로그인 맞는지 확인함
const passport = require('passport');
const local = require('./localStrategy');
const db = require(process.cwd() + '/models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 페이지 이동할 때마다 매번 실행. 세션의 user.id로 db에서 유저 정보를 찾음.
    passport.deserializeUser(async (id, done) => {
        try {
            const [rows] = await db.execute('SELECT id, email, nick FROM users WHERE id=?', [id]);
            if (rows.length > 0) {
                const user = rows[0];
                done(null, user); // req.user에 유저 정보 저장하여 모든 router가 사용 가능
            } else done(null);
        } catch (err) {
            console.error(err);
            done(err);
        }
    });

    local();
}