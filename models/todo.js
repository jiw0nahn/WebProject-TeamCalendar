const Sequelize = require('sequelize');

class Todo extends Sequelize.Model {
    static initiate(sequelize) {
        Todo.init({
        content: {
            type: Sequelize.STRING(200),
            allowNull: false,
        },
        status: {
            type: Sequelize.BOOLEAN, // TINYINT(1)은 보통 boolean으로 처리
            defaultValue: false, // 0: 대기
            allowNull: false,
        },
        targetDate: {
            type: Sequelize.DATEONLY, // 시간 없이 '날짜'만 저장 (YYYY-MM-DD)
            allowNull: false,
        },
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