const AppError = require("./appError");

module.exports = (rawDate, next) => {
  const dateList = rawDate.split(" ");

  if (dateList.length !== 3) {
    return next(new AppError(400, "The format of date should be DD MMM YYYY"));
  }

  const months = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
  };

  const day = dateList[0];
  const month = months[dateList[1].toLowerCase()];
  const year = dateList[2];

  if (Number.isNaN(Number(day))) {
    return next(new AppError(400, "The format of date should be DD MMM YYYY"));
  }

  if (!month) {
    return next(new AppError(400, "The month entered by the user is invalid."));
  }

  if (!/^\d{4}$/.test(year)) {
    return next(new AppError(400, "The year entered by the user is invalid"));
  }

  const date = new Date(`${year}-${month}-${day}`);
  date.setHours(23, 59, 59, 999);

  return date;
};
