import { PrismaClient } from '@prisma/client';
import * as _ from 'lodash';

enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const users = [
  {
    name: 'Raktim Admin',
    roles: [ROLE.ADMIN],
    email: 'raktim@rumsan.com',
  },
  {
    name: 'Raktim User',
    email: 'raktim@mailinator.com',
  },
];

const prisma = new PrismaClient();

async function main() {
  for await (const user of users) {
    const userAttrs = _.cloneDeep(user);
    await prisma.user.create({
      data: {
        ...userAttrs,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.log(error);
    await prisma.$disconnect();
  });
