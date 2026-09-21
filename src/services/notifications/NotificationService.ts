import { Platform } from "react-native";

type NotificationPermissionStatus =
  | "granted"
  | "denied"
  | "undetermined";

class NotificationService {
  private async getNotifications() {
    // expo-notifications cannot be used in Expo Go on Android.
    if (Platform.OS === "android" && __DEV__) {
      return null;
    }

    const Notifications = await import("expo-notifications");
    return Notifications;
  }

  async getPermissions(): Promise<NotificationPermissionStatus> {
    const Notifications = await this.getNotifications();

    if (!Notifications) {
      return "denied";
    }

    const response = await Notifications.getPermissionsAsync();
    return response.status;
  }

  async requestPermissions(): Promise<boolean> {
    const Notifications = await this.getNotifications();

    if (!Notifications) {
      return false;
    }

    const response = await Notifications.requestPermissionsAsync();

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        "thoughtly-reminders",
        {
          name: "Thoughtly reminders",
          importance: Notifications.AndroidImportance.DEFAULT,
        }
      );
    }

    return response.granted;
  }

  async scheduleReminder(
    content: string,
    reminderAt: string
  ): Promise<string | null> {
    const Notifications = await this.getNotifications();

    if (!Notifications) {
      return null;
    }

    const granted = await this.requestPermissions();

    if (!granted) {
      return null;
    }

    const date = new Date(reminderAt);

    if (
      Number.isNaN(date.getTime()) ||
      date.getTime() <= Date.now()
    ) {
      return null;
    }

    return Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't forget",
        body: content,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: "thoughtly-reminders",
      },
    });
  }

  async cancelReminder(
    notificationId?: string | null
  ): Promise<void> {
    const Notifications = await this.getNotifications();

    if (!Notifications || !notificationId) {
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(
      notificationId
    );
  }

  async cancelAllReminders(): Promise<void> {
    const Notifications = await this.getNotifications();

    if (!Notifications) {
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const notificationService = new NotificationService();