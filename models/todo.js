const Sequelize = require('sequelize');

class Todo extends Sequelize.Model {
    static initiate(sequelize) {
        Todo.init({
        title: {
        type: Sequelize.STRING(50),
        allowNull: false,
        },
        // 시작 시간
        start: {
            type: Sequelize.DATE, // 시간까지 저장하려면 DATE
            allowNull: false,
        },
        // 종료 시간
        end: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        // 진행 상태구분용
        color: { type: Sequelize.STRING(20), defaultValue: '#3788d8' },
        // 개인 일정이면 false, 팀 일정이면 true 구분 (또는 teamId 유무로 판단 가능)
        isAllDay: {
            type: Sequelize.BOOLEAN,
            defaultValue: true, // 기본은 하루 종일
        }
    }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Todo',
        tableName: 'todos',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // 담당자 연결
        db.Todo.belongsTo(db.User, { foreignKey: 'assigneeId', targetKey: 'id' });
        // 팀 연결 (팀 할 일인 경우, 개인 할 일이면 null)
        db.Todo.belongsTo(db.Team, { foreignKey: 'teamId', targetKey: 'id' });
    }
}

module.exports = Todo;