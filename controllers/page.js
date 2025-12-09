const { User, Team, TeamMember } = require('../models');

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입' });
};

    exports.renderMain = async (req, res, next) => {
    try {
        let teams = [];
        let currentTeam = null;
        let teamMembers = [];

        // 로그인한 상태라면, 내가 속한 팀 목록을 가져옴
        if (req.user) {
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [{
            model: Team,
            attributes: ['id', 'name', 'memo', 'code'], // 필요한 것만 가져오기
            }],
        });
        teams = user.Teams; // 내 팀 리스트
        }

        // 사용자가 드롭다운에서 특정 팀을 선택했는지 확인 (쿼리스트링 ?teamId=1)
        const { teamId } = req.query;

        if (teamId && req.user) {
            // (1) 팀 정보만 깔끔하게 가져옴
            currentTeam = await Team.findOne({ where: { id: teamId } });

            if (currentTeam) {
                    // (2) [수동 조회] 중간 테이블(TeamMember)에서 이 팀에 속한 userId들을 싹 긁어옴
                    const memberRelations = await TeamMember.findAll({
                        where: { teamId: teamId }
                    });

                    // userId만 추출 (예: [1, 5, 8])
                    const userIds = memberRelations.map(r => r.userId);

                    // (3) [수동 조회] 유저 테이블에서 그 ID를 가진 사람들을 찾아옴
                    if (userIds.length > 0) {
                        teamMembers = await User.findAll({
                            where: { id: userIds },
                            attributes: ['id', 'nick', 'email']
                        });
                    }
                    
                    console.log(`=== 수동 조회 성공: ${teamMembers.length}명 ===`);
                }
            }

        res.render('main', {
        title: '팀 캘린더',
        teams,         // 드롭다운에 넣을 팀 목록
        currentTeam,   // 현재 선택된 팀 (없으면 null -> 전체 보기)
        teamMembers,   // 현재 팀의 멤버들
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};