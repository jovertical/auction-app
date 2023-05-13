export type Notification = {
  title: string;
  message: string;
  state?: 'success' | 'error' | 'warning' | 'info';
};
