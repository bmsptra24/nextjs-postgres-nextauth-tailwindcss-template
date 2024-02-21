import { Card, Title, Text } from '@tremor/react';
import Search from './search';
import UsersTable from './table';
import admin from 'firebase-admin';

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

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const users = [] as User[];
  const search = searchParams.q ?? '';

  const serviceAccount = require('../serviceAccountKey.json');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  await admin
    .auth()
    .listUsers()
    .then((listUsersResult) => {
      let i = 0;
      listUsersResult.users.forEach((userRecord) => {
        const user = userRecord.toJSON() as ResponseFirebaseListUsers;
        if (
          user.displayName
            ?.toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        )
          users.push({
            id: i++,
            email: user?.email,
            name: user?.displayName as string,
            username: user?.uid
          });
      });
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
    });

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>A list of users from database.</Text>
      <Search />
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card>
    </main>
  );
}
