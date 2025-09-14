module.exports = (sequelize, DataTypes) => {
const Permission = sequelize.define('Permission', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
name: { type: DataTypes.STRING, unique: true, allowNull: false },
description: { type: DataTypes.TEXT }
});
return Permission;
};