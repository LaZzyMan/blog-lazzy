import { format, parseISO } from 'date-fns';
import React from 'react';

function Date({ dateString }) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}

export default React.memo(Date);
