// validate the time format
export const validateTime = (time: string) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
  return regex.test(time);
};

// validate the booking date
export const validateBookingDate = (val: string) => {
  const bookingDate = new Date(val);
  const today = new Date();
  // Set time to midnight for today to compare only dates, not times
  today.setHours(0, 0, 0, 0);
  return bookingDate >= today;
};

export const validateStartTimeAndBookingDate = (values: {
  bookingDate: string;
  startTime: string;
}) => {
  const { bookingDate, startTime } = values;
  const currentDate = new Date();
  const bookingDateObj = new Date(bookingDate);

  // Parse the startTime into hours and minutes
  const [startHour, startMinute] = startTime.split(":").map(Number);

  // If booking is today, the start time should be at least the next available hour or minute
  if (bookingDateObj.toDateString() === currentDate.toDateString()) {
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    // First check if the start hour is greater than the current hour
    if (startHour < currentHour) {
      return false;
    }

    // If the start hour is the same as the current hour, ensure the start minute is greater
    if (startHour === currentHour && startMinute <= currentMinute) {
      return false;
    }
  }

  // If the booking is for tomorrow or later, any valid time is accepted
  return true;
};

// advanced validation
/* export const validateStartTimeAndBookingDate = (val: {
  bookingDate: string;
  startTime: string;
}) => {
  const { bookingDate, startTime } = val;
  const currentDate = new Date();
  const bookingDateObj = new Date(bookingDate);

  // Parse the startTime into hours and minutes
  const [startHour, startMinute] = startTime.split(":").map(Number);

  // Ensure that the minutes are either 00 or 30
  if (startMinute !== 0 && startMinute !== 30) {
    throw new AppError(
      "Invalid start time. Minutes must be 00 or 30.",
      httpStatus.BAD_REQUEST,
    );
  }

  // If booking is today, the start time should be at least the next available hour or half hour
  if (bookingDateObj.toDateString() === currentDate.toDateString()) {
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    // First check if the start time is the same as the current time
    if (startHour === currentHour && startMinute === currentMinute) {
      // Recommend the next available time
      if (currentMinute < 30) {
        throw new AppError(
          `Start time cannot be the current time. Please choose ${currentHour}:30.`,
          httpStatus.BAD_REQUEST,
        );
      } else {
        throw new AppError(
          `Start time cannot be the current time. Please choose ${currentHour + 1}:00.`,
          httpStatus.BAD_REQUEST,
        );
      }
    }

    // If the start hour is less than the current hour, throw an error
    if (startHour < currentHour) {
      throw new AppError(
        "Invalid start time. The start time must be in the future.",
        httpStatus.BAD_REQUEST,
      );
    }

    // If the start hour is the same as the current hour
    if (startHour === currentHour) {
      // Check if the start time is at least 30 minutes ahead in the same hour
      if (startMinute === 0 && currentMinute >= 30) {
        throw new AppError(
          `Start time is too close to the current time. Please choose ${currentHour + 1}:00.`,
          httpStatus.BAD_REQUEST,
        );
      }
      if (startMinute === 30 && currentMinute >= 30) {
        throw new AppError(
          `Start time is too close to the current time. Please choose ${currentHour + 1}:00.`,
          httpStatus.BAD_REQUEST,
        );
      }
    }
  }

  // If the booking is for tomorrow or later, any valid time with 00 or 30 minutes is accepted
  return true;
}; */
