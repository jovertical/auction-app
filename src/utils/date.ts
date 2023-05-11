import d from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

d.extend(relativeTime);

export const date = d;
