const Sequelize = require('sequelize');

class TeamMember extends Sequelize.Model {
    static initiate(sequelize) {
        TeamMember.init({
            userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            },
            teamId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'TeamMember',
        tableName: 'teammember',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        });
    }
}

module.exports = TeamMember;