import admin from 'firebase-admin';
import ChartClient from './chartClient';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface ResponseFirebaseListUsers {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string | undefined;
  photoURL?: string | undefined;
  phoneNumber?: string | undefined;
  disabled: boolean;
  metadata: {
    lastSignInTime: string;
    creationTime: string;
    lastRefreshTime: string;
  };
  passwordHash: string;
  passwordSalt: string;
  customClaims?: any;
  tokensValidAfterTime: string;
  tenantId?: string | undefined;
  providerData: {
    uid: string;
    displayName?: string | undefined;
    email: string;
    photoURL?: string | undefined;
    providerId: string;
    phoneNumber?: string | undefined;
  }[];
}

const data = [
  // {
  //   Month: 'Jan 21',
  //   Sales: 2890,
  //   Profit: 2400
  // },
  // {
  //   Month: 'Feb 21',
  //   Sales: 1890,
  //   Profit: 1398
  // },
  // {
  //   Month: 'Jan 22',
  //   Sales: 3890,
  //   Profit: 2980
  // }
] as any;

export default async function Example() {
  const users = [] as ResponseFirebaseListUsers[];

  const serviceAccount = require('../../serviceAccountKey.json');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  await admin
    .auth()
    .listUsers(10)
    .then((listUsersResult) => {
      let userCount: any = {};

      listUsersResult.users.forEach((userRecord) => {
        const user = userRecord.toJSON() as ResponseFirebaseListUsers;

        users.push(user);

        const date = new Date(user.metadata.lastSignInTime);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        const formattedDate = `${month} ${year}`;

        userCount[formattedDate] = {
          Month: formattedDate,
          Count: userCount[month]['Count']++
        };
      });

      Object.keys(userCount).forEach((item) => {
        data.push({ Month: item, Count: userCount[item].Count });
      });
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
    });

  return <ChartClient data={data} />;
}
