const Schedule = require("../models/schedule");

const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      userId: req.params.userId,
    }).exec();

    if (!schedule) {
      return res.status(404).json("User has no schedule");
    }

    const sevenDaySchedule = get7DaySchedule(schedule.scheduledDates);

    return res.status(200).json(sevenDaySchedule);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      cause: error,
    });
  }
};

const calculateSchedule = async (req, res) => {
  try {
    let hasSchedule = await Schedule.findOne({
      userId: req.params.userId,
    }).exec();

    if (!hasSchedule) {
      hasSchedule = await Schedule.create({
        userId: req.params.userId,
      });
    }
    const userMessages = req.body.userMessages;
    const dates = extractDates(userMessages);
    const lastConversationDate = dates[dates.length - 1];
    const nextCheckInDate = generateNextCheckInDate(lastConversationDate);
    const today = new Date();

    if (new Date(nextCheckInDate) < today) {
      return res.status(200).json("No schedule for the next 7 days");
    }

    const scheduledDates = hasSchedule.scheduledDates;

    if (scheduledDates.includes(nextCheckInDate)) {
      return res.status(200).json(scheduledDates);
    }

    const schedule = await Schedule.findOneAndUpdate(
      { userId: req.params.userId },
      { $push: { scheduledDates: nextCheckInDate } },
      { new: true }
    );

    return res.status(200).json(schedule.scheduledDates);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      cause: error,
    });
  }
};

const generateNextCheckInDate = (date) => {
  const checkInDate = new Date(date.setDate(date.getDate() + 3));
  const checkInHour = Math.floor(Math.random() * (18 - 8 + 1) + 8);
  checkInDate.setHours(checkInHour, 0, 0);

  return new Date(checkInDate).toISOString();
};

const get7DaySchedule = (dates) => {
  let currentDate = new Date();
  let next7Days = new Date();
  next7Days.setDate(currentDate.getDate() + 7);

  return dates.filter((date) => {
    let dateToCheck = new Date(date);
    return dateToCheck >= currentDate && dateToCheck < next7Days;
  });
};

const checkIfDatesAreTheSame = (dates) => {
  for (let i = 0; i < dates.length - 1; i++) {
    if (dates[i].getDate() !== dates[i + 1].getDate()) {
      return false;
    }
  }

  return true;
};

const extractDates = (userMessages) => {
  const dates = [];

  for (let i = 0; i < userMessages.length; i++) {
    const date = new Date(userMessages[i].date);
    dates.push(date);
  }

  return dates;
};

module.exports = {
  getSchedule,
  calculateSchedule,
};
