import { Expo } from 'expo-server-sdk';
import Defaulted from './api.js';

let datesToSendNotifications = ['2024-08-13', '2024-08-04', '2024-02-04'];
let loanData;

// My own code to test for the date when to send the notification
function isToday(date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

// Create a new Expo SDK client
let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true // set to true if using the FCM v1 API
});

// Create the messages that you want to send to clients
const expoPushToken = 'ExponentPushToken[3N7XdKKQNo-bhjOdA0sNjR]';

const notificationObject = {
  sound: 'default',
  title: 'Loan is due',
  body: 'This is a test notification',
  data: { someData: 'goes here' },
};

let somePushTokens = [expoPushToken];
let messages = [];

// Main function to handle notification sending
async function sendNotifications() {
  // Fetch loan data
  loanData = await Defaulted();

  console.log(loanData);

  // Add due dates to the datesToSendNotifications array
  for (let loan of loanData) {
    datesToSendNotifications.push(loan?.dueOn);
  }

  // Construct messages to send if the date is today
  for (let pushToken of somePushTokens) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Dates to send notifications
    for (let date of datesToSendNotifications) {
      let newDate = new Date(date);
      if (isToday(newDate)) {
        messages.push({
          to: pushToken,
          sound: notificationObject.sound,
          title: notificationObject.title,
          body: `working`,
          data: notificationObject.data,
        });
      }
    }
  }

  if (messages.length > 0) {
    // The Expo push notification service accepts batches of notifications
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    // Send the chunks to the Expo push notification service
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }

    // Handle receipts
    let receiptIds = [];
    for (let ticket of tickets) {
      if (ticket.status === 'ok') {
        receiptIds.push(ticket.id);
      } else if (ticket.status === 'error') {
        console.error(`Error in ticket: ${ticket.message}`);
        if (ticket.details && ticket.details.error) {
          console.error(`The error code is ${ticket.details.error}`);
        }
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(`Error sending notification: ${message}`);
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// Call the main function to send notifications
sendNotifications();
