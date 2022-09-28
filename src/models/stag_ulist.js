module.exports = (sequelize, DataTypes) => {
    const stag_ulist = sequelize.define("stag_ulist", {
        personid: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        given_name: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        family_name: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        gender: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        odk_pin: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        person_uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
            validate: {
                notEmpty: true
            }
        }
    });

    return stag_ulist;
};