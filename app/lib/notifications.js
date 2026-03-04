import { LocalNotifications } from "@capacitor/local-notifications";

const NOTIF_IDS = { morning: 1001, evening: 1002 };

export async function requestAndScheduleNotifications() {
  const { display } = await LocalNotifications.requestPermissions();
  if (display !== "granted") return false;

  // Cancel any existing scheduled notifications before rescheduling
  await LocalNotifications.cancel({
    notifications: Object.values(NOTIF_IDS).map(id => ({ id })),
  });

  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIF_IDS.morning,
        title: "Gossip Morning Briefing",
        body: "Fresh Solana intelligence is ready. Tap to read.",
        schedule: { on: { hour: 7, minute: 30 }, allowWhileIdle: true, repeats: true },
        smallIcon: "ic_stat_gossip",
        iconColor: "#14F195",
      },
      {
        id: NOTIF_IDS.evening,
        title: "Gossip Evening Briefing",
        body: "Your evening Solana intel drop has landed.",
        schedule: { on: { hour: 19, minute: 30 }, allowWhileIdle: true, repeats: true },
        smallIcon: "ic_stat_gossip",
        iconColor: "#14F195",
      },
    ],
  });

  return true;
}

export async function cancelNotifications() {
  await LocalNotifications.cancel({
    notifications: Object.values(NOTIF_IDS).map(id => ({ id })),
  });
}
