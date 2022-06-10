const MONTHS = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export {
  formatDate
};