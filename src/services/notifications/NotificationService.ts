import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  async getPermissions(): Promise<Notifications.PermissionStatus> {
    const response = await Notifications.getPermissionsAsync();
    return response.status;
  }

  async requestPermissions(): Promise<boolean> {
    const response = await Notifications.requestPermissionsAsync();
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("thoughtly-reminders", {
        name: "Thoughtly reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    return response.granted;
  }

  async scheduleReminder(content: string, reminderAt: string): Promise<string | null> {
    const granted = await this.requestPermissions();
    if (!granted) return null;
    const date = new Date(reminderAt);
    if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) return null;
    return Notifications.scheduleNotificationAsync({
      content: { title: "Don't forget", body: content },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: "thoughtly-reminders" },
    });
  }

  async cancelReminder(notificationId?: string | null): Promise<void> {
    if (notificationId) await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
