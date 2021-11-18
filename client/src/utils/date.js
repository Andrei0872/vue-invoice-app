export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = MINUTE * 60;
export const DAY = 24 * HOUR;

/**
 * 
 * @param {Date} startDate 
 * @param {number} intervalOfDays 
 * @param {Date} crtDate 
 */
export const getMsUntilNextEvent = (startDate, intervalOfDays, crtDate) => {
  const msPassedUntilCrtDate = crtDate.getTime() - startDate.getTime();
  const windowsCount = Math.ceil(msPassedUntilCrtDate / getNDaysAsMS(intervalOfDays));

  const nextDateWhenEventOccurs = new Date(startDate.getTime());
  nextDateWhenEventOccurs.setDate(nextDateWhenEventOccurs.getDate() + windowsCount * intervalOfDays);

  return nextDateWhenEventOccurs.getTime() - crtDate.getTime();
};

export const getNDaysAsMS = n => DAY * n;

export const formatDateFromMs = ms => {
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / HOUR);
  const minutes = Math.floor(((ms % DAY) % HOUR) / MINUTE);
  const seconds = Math.floor((((ms % DAY) % HOUR) % MINUTE) / SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};