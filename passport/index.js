const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user'); // 모델 불러오기

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션에 user.id만 저장
    });

    passport.deserializeUser((id, done) => {
        // db.execute 대신 시퀄라이즈 문법 사용
        User.findOne({
        where: { id },
        // 실수 방지: 비밀번호는 실수로라도 조회되지 않게 제외하는 것이 좋음
        attributes: ['id', 'nick', 'email'],
        })
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local();
};