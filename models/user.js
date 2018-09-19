module.exports = function (sequelize, DataTypes) {

	var User = sequelize.define('User', {
		id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
		name: { type: DataTypes.STRING, notEmpty: true },
		username: { type: DataTypes.STRING, notEmpty: true },
		email: { type: DataTypes.STRING, validate: { isEmail: true } },
		password: { type: DataTypes.STRING, allowNull: false }
	});



	return User;

};



