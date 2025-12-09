const Sequelize = require('sequelize');

class Team extends Sequelize.Model {
    static initiate(sequelize) {
        Team.init({
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true, // 초대 코드 중복 방지
            },
            memo: {
            type: Sequelize.STRING(255), // 길면 TEXT로 변경 가능
            allowNull: true, // 메모는 비어있을 수도 있음
            },
        }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Team',
        tableName: 'teams',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // 1. 팀의 방장 (Owner)
        db.Team.belongsTo(db.User, { foreignKey: 'ownerId', targetKey: 'id' });
        // 2. 팀의 멤버들 (Members)
        db.Team.belongsToMany(db.User, {
            through: db.TeamMember,
            foreignKey: 'teamId', // 내 키
            otherKey: 'userId'    // 상대방 키
        });
        // 3. 팀의 할 일들
        db.Team.hasMany(db.Todo, { foreignKey: 'teamId', sourceKey: 'id' });
    }
}

module.exports = Team;