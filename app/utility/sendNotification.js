import firebase from 'firebase/compat/app';

export async function sendPushNotification(
  token,
  title,
  body,
  toUser,
  userID,
  post,
  comment
) {
  if (toUser !== userID && toUser) {
    const db = firebase.firestore();
    const message = {
      to: `${token}`,
      sound: 'default',
      title: title,
      body: body,
      data: {
        data: 'new message',
        experienceId: '@heartedinc/Hearted',
      },
      _displayInForeground: true,
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    let query;

    query = db
      .collection('users')
      .doc(toUser)
      .collection('notifications')
      .add({
        timestamp: new Date(),
        body: body,
        userID: userID,
        post: post ? post : null,
        comment: comment ? comment : null,
      });

    return query;
  }
}

export default {
  sendPushNotification,
};
