// controllers/team.js
const { User, Team, TeamMember } = require('../models');

// 1. 팀 생성하기
exports.createTeam = async (req, res, next) => {
    try {
        const { name } = req.body;
        
        // 랜덤 초대 코드 생성 (6자리 문자열)
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // 팀 데이터 생성
        const newTeam = await Team.create({
        name,
        code: randomCode,
        ownerId: req.user.id,
        });

        // 나를 팀원(TeamMember)으로 추가
        await newTeam.addUsers(req.user.id);

        // 완료 후 메인으로
        return res.redirect(`/?teamId=${newTeam.id}`); // 방금 만든 팀으로 이동
    } catch (error) {
        console.error(error);
        next(error);
    }
    };

    // 2. 초대 코드로 팀 가입하기
    exports.joinTeam = async (req, res, next) => {
    try {
        const { code } = req.body;

        // 코드로 팀 찾기
        const team = await Team.findOne({ where: { code } });

        if (!team) {
        return res.send("<script>alert('존재하지 않는 코드입니다.'); location.href='/';</script>");
        }

        // 내가 이미 이 팀의 멤버인지 확인
        const alreadyMember = await team.hasUser(req.user.id);

        // 이미 가입된 팀일 때
        if (alreadyMember) {
        return res.send(`
            <script>
            alert('이미 가입된 팀입니다.');
            location.href = '/?teamId=${team.id}';
            </script>
        `);
        }

        // 팀원으로 추가
        await team.addUser(req.user.id);

        return res.redirect(`/?teamId=${team.id}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 팀별 개인 메모 수정하기
exports.updateMemo = async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const { memo } = req.body;

        // TeamMember 테이블에서 나와 팀의 연결 고리를 찾아서 메모 업데이트
        await TeamMember.update({ memo: memo }, {
        where: {
            userId: req.user.id,
            teamId: teamId,
        }
        });

        // 저장 후 다시 그 팀 화면으로 돌아가기
        return res.redirect(`/?teamId=${teamId}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
};