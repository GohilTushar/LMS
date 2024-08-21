import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import User from "./user.model.js";
import UserLeave from "./userleave.model.js";

const LeaveRequest = sequelize.define(
  "LeaveRequest",
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
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    requestToId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    leaveType: {
      type: DataTypes.ENUM,
      values: ["First half", "Second half", "Full day"],
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["Pending", "Approved", "Rejected"],
    },
  },
  {
    timestamps: true,
  }
);

LeaveRequest.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "requestedBy",
});

LeaveRequest.belongsTo(User, {
  foreignKey: "requestToId",
  onDelete: "CASCADE",
  as: "requestedTo",
});

LeaveRequest.belongsTo(UserLeave, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export default LeaveRequest;
