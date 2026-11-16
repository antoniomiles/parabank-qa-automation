import { randomUUID } from 'node:crypto';

export function newCustomer() {
  return {
    firstName: 'Practice', lastName: 'Automation',
    address: '123 Test Street', city: 'Bogota', state: 'DC', zipCode: '110111',
    phoneNumber: '5550101234', ssn: '000001234',
    username: `qa${randomUUID().replaceAll('-', '').slice(0, 18)}`,
    password: 'PracticeOnly42!',
  };
}
export type Customer = ReturnType<typeof newCustomer>;
