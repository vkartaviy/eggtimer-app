import notifier, { NotificationCallback } from 'node-notifier';
import { Notification } from 'node-notifier/notifiers/notificationcenter';
import { APP_TITLE } from './constants';

export default function notify(
  message: string,
  options?: Notification,
  callback?: NotificationCallback
): void {
  notifier.notify(
    {
      title: APP_TITLE,
      message,
      sound: 'Ping',
      ...options
    },
    callback
  );
}
