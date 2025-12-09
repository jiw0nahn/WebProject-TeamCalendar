const { User, Team, TeamMember, Todo } = require('../models');
const { Op } = require('sequelize');

exports.createEvent = async (req, res, next) => {
    try {
        const { title, start, end, teamId, assigneeId, color } = req.body;

        await Todo.create({
            title, start, end, color,
            teamId: teamId ? parseInt(teamId) : null, // 팀 ID가 있으면 팀 일정
            assigneeId: assigneeId ? parseInt(assigneeId) : req.user.id, // 담당자 지정 없으면 나
        });
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 일정 수정하기
exports.updateEvent = async (req, res, next) => {
    try {
        const { id, title, start, end, color, assigneeId } = req.body;
        await Todo.update({
            title, start, end, color,
            assigneeId: assigneeId ? parseInt(assigneeId) : null
        }, { where: { id: id } });
        res.send('ok'); // 성공 응답
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 일정 삭제하기
exports.deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.body;
        await Todo.destroy({ where: { id: id } });
        res.send('ok'); // 성공 응답
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입' });
};

    exports.renderMain = async (req, res, next) => {
    try {
        let teams = [];
        let currentTeam = null;
        let teamMembers = [];
        let calendarEvents = []; // 달력에 뿌릴 데이터
        let myTodos = [];        // 우측 사이드바용 데이터
        let myMemo = '';         // 메모용 데이터

        // 로그인한 상태라면, 내가 속한 팀 목록을 가져옴
        if (req.user) {
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [{
            model: Team,
            attributes: ['id', 'name', 'memo', 'code'], // 필요한 것만 가져오기
            through: { attributes: [] } // 중간 테이블 데이터는 필요 없음
            }],
        });
        teams = user.Teams; // 내 팀 리스트
        }

        // 사용자가 드롭다운에서 특정 팀을 선택했는지 확인 (쿼리스트링 ?teamId=1)
        const { teamId } = req.query;
        // 내가 속한 팀 ID들만 추출 (예: [1, 2, 5])
        const myTeamIds = teams.map(t => t.id);

        if (req.user) {
            // 달력 데이터 조회 (Calendar)
            let calendarWhere = {};

            if (teamId) {
                // [팀 선택]: 해당 팀의 '모든' 일정 (남의 것도 보임)
                calendarWhere = { teamId: teamId };
                
                // 팀 정보 및 멤버 조회
                currentTeam = await Team.findOne({ where: { id: teamId } });
                if (currentTeam) {
                    const memberRelations = await TeamMember.findAll({ where: { teamId: teamId } });
                    const userIds = memberRelations.map(r => r.userId);
                    teamMembers = await User.findAll({
                        where: { id: userIds },
                        attributes: ['id', 'nick', 'email'],
                        order: [['nick', 'ASC']]
                    });
                }
                const memberInfo = await TeamMember.findOne({
                    where: {
                        userId: req.user.id,
                        teamId: teamId
                    }
                });
                
                // 메모가 있으면 가져오고, 없으면 빈 문자열
                if (memberInfo) {
                    myMemo = memberInfo.memo || '';
                }
            } else {
                // 전체 보기: 내 팀들의 일정 중 '공통' 이거나 '내 거'
                // 만약 팀이 하나도 없으면 아무것도 안 보이게 처리
                if (myTeamIds.length > 0) {
                    calendarWhere = {
                        teamId: { [Op.in]: myTeamIds },
                        [Op.or]: [
                            { assigneeId: null },       // 담당자 없음 (공통)
                            { assigneeId: req.user.id } // 담당자 나
                        ]
                    };
                } else {
                    // 팀이 없으면 조회 결과 없음
                    calendarWhere = { id: -1 };
                }
            }

            calendarEvents = await Todo.findAll({
                where: calendarWhere,
                attributes: ['id', 'title', 'start', 'end', 'color', 'assigneeId']
            });

            // My Todo 데이터 조회 (Sidebar)
            let todoWhere = {};

            // 조건 1: 팀 범위 설정
            if (teamId) {
                // 팀을 선택했다면 그 팀 안에서만
                todoWhere.teamId = teamId;
            } else {
                // 전체 보기라면 내 모든 팀 안에서
                if (myTeamIds.length > 0) {
                    todoWhere.teamId = { [Op.in]: myTeamIds };
                } else {
                    todoWhere.teamId = -1; // 팀 없으면 조회 X
                }
            }

            // 조건 2: '공통 일정' 또는 '내 일정'만 필터링 (무조건 적용)
            todoWhere[Op.or] = [
                { assigneeId: null },
                { assigneeId: req.user.id }
            ];

            const rawTodos = await Todo.findAll({
                where: todoWhere,
                order: [['start', 'ASC']], // 날짜순 정렬
                include: [{
                        model: Team,
                        attributes: ['name'] // 팀 이름을 가져오기 위해 필수!
                    }]
            });

            // 데이터 가공
            myTodos = rawTodos.map(todo => {
                const date = new Date(todo.start);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return {
                    id: todo.id,
                    title: todo.title,
                    color: todo.color,
                    isDone: false,
                    teamName: todo.Team ? todo.Team.name : '개인', // 팀 이름 (없으면 개인)
                    dateStr: `${month}/${day}`
                };
            });
        }

        res.render('main', {
                title: '팀 캘린더',
                teams,
                currentTeam,
                teamMembers,
                events: JSON.stringify(calendarEvents),
                myTodos: myTodos,
                myMemo,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
};