import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import User from "./user.model.js";

const Otp = sequelize.define(
  "Otp",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "role",
      },
    },
  },
  {
    timestamps: true,
  }
);
Otp.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Otp.belongsTo(User, {
  foreignKey: "roleId",
  onDelete: "CASCADE",
});

export default Otp;
