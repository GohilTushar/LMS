import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import User from "./user.model.js";

const UserLeave = sequelize.define(
  "UserLeave",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    totalLeave: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableLeave: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    usedLeave: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    acedemicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalWorkingDay: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    attendancePercentage: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

UserLeave.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export default UserLeave;
