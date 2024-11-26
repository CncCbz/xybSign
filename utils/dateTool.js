const DateLevel = {
  YEAR: 0,
  MONTH: 1,
  DAY: 2,
};

const currentDate = (delimiter, level) => {
  const date = new Date();

  switch (level) {
    case DateLevel.YEAR:
      return date.getFullYear().toString();
    case DateLevel.MONTH:
      return `${date.getFullYear()}${delimiter}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    case DateLevel.DAY:
      return `${date.getFullYear()}${delimiter}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${delimiter}${date
          .getDate()
          .toString()
          .padStart(2, '0')}`;
    default:
      throw new Error('无效的日期级别');
  }
};

module.exports = {
  DateLevel,
  currentDate,
};
