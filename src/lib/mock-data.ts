

export const payoutHistory = [
    { id: 'pay_1', date: '2024-07-28', amount: 60.10, transactionId: 'TXN123456789', status: 'Completed' },
    { id: 'pay_2', date: '2024-07-27', amount: 55.00, transactionId: 'TXN123456788', status: 'Completed' },
    { id: 'pay_3', date: '2024-07-26', amount: 48.75, transactionId: 'TXN123456787', status: 'Completed' },
    { id: 'pay_4', date: '2024-07-25', amount: 42.50, transactionId: 'TXN123456786', status: 'Completed' },
    { id: 'pay_5', date: '2024-07-24', amount: 42.50, transactionId: 'TXN123456785', status: 'Completed' },
];

export const platformReferrals = [
  // Referral for rentariz to make testing easier
  { referredUser: 'Initial Follower', email: 'initial.follower@example.com', affiliate: 'rentariz', plan: 'Pro', status: 'activated' },

  // Referrals for admin's affiliate username 'rizzosai'
  { referredUser: 'Alice', email: 'alice@example.com', affiliate: 'rizzosai', plan: 'Pro', status: 'activated' },
  { referredUser: 'Bob', email: 'bob@example.com', affiliate: 'rizzosai', plan: 'Pro', status: 'pending' },
  { referredUser: 'Charlie', email: 'charlie@example.com', affiliate: 'rizzosai', plan: 'Pro', status: 'activated' },
  
  // Referrals for a new mock affiliate 'power_affiliate' to demonstrate the 75% commission tier
  { referredUser: 'Dave', email: 'dave@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Eve', email: 'eve@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Frank', email: 'frank@example.com', affiliate: 'power_affiliate', plan: 'Premium', status: 'activated' },
  { referredUser: 'Grace', email: 'grace@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Heidi', email: 'heidi@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Ivan', email: 'ivan@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Judy', email: 'judy@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Mallory', email: 'mallory@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Nancy', email: 'nancy@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Oscar', email: 'oscar@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'activated' },
  { referredUser: 'Peggy', email: 'peggy@example.com', affiliate: 'power_affiliate', plan: 'Premium', status: 'activated' },
  { referredUser: 'Trent', email: 'trent@example.com', affiliate: 'power_affiliate', plan: 'Pro', status: 'pending' },
];
