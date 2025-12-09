const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
        },
        nick: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        }, {
        sequelize,
        timestamps: true, // createdAt, updatedAt 자동 생성
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false, // 삭제 시 진짜 삭제 (true면 복구 가능하게 숨김 처리)
        charset: 'utf8',
        collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        // 1. 내가 만든 팀들 (Owner)
        db.User.hasMany(db.Team, { foreignKey: 'ownerId', sourceKey: 'id' });
        // 2. 내가 속한 팀들 (Member) - 다대다 관계
        db.User.belongsToMany(db.Team, { through: db.TeamMember });
        // 3. 내 할 일들 (Assignee)
        db.User.hasMany(db.Todo, { foreignKey: 'assigneeId', sourceKey: 'id' });
    }
}

module.exports = User;