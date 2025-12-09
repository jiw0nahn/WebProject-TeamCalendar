const Sequelize = require('sequelize');
const User = require('./user');
const Team = require('./team');
const Todo = require('./todo');
const TeamMember = require('./teamMember');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; // config.json 경로 확인 필요
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Team = Team;
db.Todo = Todo;
db.TeamMember = TeamMember;

// 1. 모델 초기화
User.initiate(sequelize);
Team.initiate(sequelize);
Todo.initiate(sequelize);
TeamMember.initiate(sequelize);

// 2. 관계 설정
User.associate(db);
Team.associate(db);
Todo.associate(db);

module.exports = db;