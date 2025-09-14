module.exports = (sequelize, DataTypes) => {
const RolePermission = sequelize.define('RolePermission', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});
return RolePermission;
};