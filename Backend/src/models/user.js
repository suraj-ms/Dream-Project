module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
email: { type: DataTypes.STRING, unique: true, allowNull: false },
password: { type: DataTypes.STRING, allowNull: false },
name: { type: DataTypes.STRING },
});
return User;
};