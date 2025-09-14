const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');


const User = require('./user')(sequelize, DataTypes);
const Role = require('./role')(sequelize, DataTypes);
const Permission = require('./permission')(sequelize, DataTypes);
const RolePermission = require('./rolePermission')(sequelize, DataTypes);
const UserRole = require('./userRole')(sequelize, DataTypes);
const RefreshToken = require('./refreshToken')(sequelize, DataTypes);


// Associations
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });


Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });


RefreshToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(RefreshToken, { foreignKey: 'userId' });


module.exports = {
sequelize,
User,
Role,
Permission,
RolePermission,
UserRole,
RefreshToken,
};