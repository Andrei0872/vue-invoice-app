import { getMsUntilNextEvent, formatDateFromMs } from '../../../src/utils/date';

describe('utils/date', () => {
  // 1 Nov 2021, 22:30:15
  // 1---6---11---16---21---26---1
  const startDate = new Date(2021, 10, 1);
  startDate.setHours(22);
  startDate.setMinutes(30);
  startDate.setSeconds(15);
  
  /** @type {Date} */
  let crtDate;
  
  const intervalOfDays = 5;

  const getResult = () => formatDateFromMs(getMsUntilNextEvent(startDate, intervalOfDays, crtDate));

  describe('Finding the remaining MS until the next event', () => {
    beforeEach(() => crtDate = new Date(startDate.getTime()));

    it('should determine the days', () => {      
      crtDate.setDate(3);
      expect(getResult().days).toBe(3/* 6 - 3 */);
      
      crtDate.setDate(5);
      expect(getResult().days).toBe(1/* 6 - 5 */);

      crtDate.setDate(17);
      expect(getResult().days).toBe(4/* 21 - 17 */);

      crtDate.setDate(22);
      expect(getResult().days).toBe(4/* 26 - 22 */);

      crtDate.setDate(27);
      expect(getResult().days).toBe(4/* 1 dec - 27 nov */);
    });

    it.only('should determine days and hours', () => {
      crtDate.setDate(17);
      expect(getResult()).toEqual(expect.objectContaining({ days: 4 /* 21 - 4 */, hours: 0 }));
      
      crtDate.setDate(17);
      crtDate.setHours(21);
      // 21 nov 22:30 - 17 nov 21:30
      expect(getResult()).toEqual(expect.objectContaining({ days: 4, hours: 1 }));

      crtDate.setDate(17);
      crtDate.setHours(23);
      // 21 nov 22:30 - 17 nov 23:30
      expect(getResult()).toEqual(expect.objectContaining({ days: 3, hours: 23 }));
    });
  });
});