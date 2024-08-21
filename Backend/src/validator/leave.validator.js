import { checkSchema, validationResult } from "express-validator";

const leaveSchema = checkSchema({
  startDate: {
    isDate: {
      errorMessage: "Start date must be a valid date",
    },
    custom: {
      options: (value, { req }) => {
        const startDate = new Date(value);
        const endDate = new Date(req.body.endDate);
        const today = new Date().setHours(0, 0, 0, 0);

        if (startDate < today)
          throw new Error("Start date cannot be in the past");

        if (startDate > endDate)
          throw new Error("Start date cannot be after end date");

        return true;
      },
    },
    exists: {
      errorMessage: "Start date is required",
    },
  },
  endDate: {
    isDate: {
      errorMessage: "End date must be a valid date",
    },
    custom: {
      options: (value, { req }) => {
        const endDate = new Date(value);
        const startDate = new Date(req.body.startDate);
        const today = new Date().setHours(0, 0, 0, 0);

        if (endDate < today) throw new Error("End date cannot be in the past");

        if (endDate < startDate)
          throw new Error("End date cannot be before start date");

        return true;
      },
    },
    exists: {
      errorMessage: "End date is required",
    },
  },
  leaveType: {
    isString: {
      errorMessage: "Leave type must be a string",
    },
    isIn: {
      options: [["First half", "Second half", "Full day"]],
      errorMessage:
        'Leave type must be one of "First half", "Second half", or "Full day"',
    },
    exists: {
      errorMessage: "Leave type is required",
    },
  },
  reason: {
    isString: {
      errorMessage: "Reason must be a string",
    },
    exists: {
      errorMessage: "Reason is required",
    },
  },
  requestToId: {
    isInt: {
      errorMessage: "Request ID must be an integer",
    },
    exists: {
      errorMessage: "Request ID is required",
    },
  },
  status: {
    isString: {
      errorMessage: "Status must be a string",
    },
    isIn: {
      options: [["Pending", "Approved", "Rejected"]],
      errorMessage:
        'Status must be one of "Pending", "Approved", or "Rejected"',
    },
    optional: {
      options: {
        nullable: true,
      },
      errorMessage: "Status is optional but must be valid if provided",
    },
    customSanitizer: {
      options: (value) => value || "Pending", // Default to 'Pending' if not provided
    },
  },
});

const handleValidationErrorsForLeave = [
  leaveSchema,
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json(err.errors[0].msg);
    }
    next();
  },
];

export { handleValidationErrorsForLeave };
