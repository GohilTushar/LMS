import cron from "node-cron";
import { findUserForCron } from "../service/userService.js";
import { getPendingLeaveRequests } from "../service/leaveService.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { sendEmail } from "../utils/mail.js";
import handlebars from "handlebars";

cron.schedule("0 11 */2 * *", async () => {
  
  const searchQuery={
    where: { status: "Pending" }
  }
  const leaveDetails = await getPendingLeaveRequests(searchQuery);

  const filePath = path.join(__dirname, "../views/reminderLeave.hbs");
  const template = fs.readFileSync(filePath, "utf8");
  const compiledTemplate = handlebars.compile(template);

  for (const leave of leaveDetails) {
    try {
      const faculty = await findUserForCron(leave.requestToId);
      const student = await findUserForCron(leave.userId);

      const emailTemplate = compiledTemplate({
        leaveTakerName: student.name,
        leaveTakerEmail: student.email,
        leaveGiverName: faculty.name,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
      });

      const mailOptions = {
        to: faculty.email,
        subject: "Leave Request Pending",
        html: emailTemplate,
      };

      await sendEmail(mailOptions);
    } catch (err) {
      console.log("Error sending email: ", err);
    }
  }
});

export default cron;

// 0 11 */2 * * every 2nd day 11 am morning
// */2 * * * * every 2 minute
