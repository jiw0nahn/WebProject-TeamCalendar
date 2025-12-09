const Sequelize = require('sequelize');

class TeamMember extends Sequelize.Model {
    static initiate(sequelize) {
        TeamMember.init({}, {
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