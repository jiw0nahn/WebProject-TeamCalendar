exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입' });
};

exports.renderMain = (req, res) => {
    res.render('main', { title: '메인 페이지' });
};