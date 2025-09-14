module.exports = (sequelize, DataTypes) => {
const UserRole = sequelize.define('UserRole', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
return UserRole;
};