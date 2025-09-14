module.exports = (sequelize, DataTypes) => {
const Role = sequelize.define('Role', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
name: { type: DataTypes.STRING, unique: true, allowNull: false },
description: { type: DataTypes.TEXT }
});
return Role;
};