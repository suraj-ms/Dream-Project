module.exports = (sequelize, DataTypes) => {
const RefreshToken = sequelize.define('RefreshToken', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
token: { type: DataTypes.STRING, allowNull: false },
expiresAt: { type: DataTypes.DATE }
});
return RefreshToken;
};