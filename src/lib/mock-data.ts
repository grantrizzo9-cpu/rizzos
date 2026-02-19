export const earningsData = [
  { date: 'Mon', earnings: 40.00 },
  { date: 'Tue', earnings: 42.50 },
  { date: 'Wed', earnings: 42.50 },
  { date: 'Thu', earnings: 48.75 },
  { date: 'Fri', earnings: 55.00 },
  { date: 'Sat', earnings: 60.10 },
  { date: 'Sun', earnings: 62.30 },
];

export const referralsData = [
  { month: 'Jan', referrals: 4 },
  { month: 'Feb', referrals: 3 },
  { month: 'Mar', referrals: 5 },
  { month: 'Apr', referrals: 4 },
  { month: 'May', referrals: 6 },
  { month: 'Jun', referrals: 8 },
];

export const recentReferrals = [
    { id: 'ref_1', email: 'customer1@example.com', plan: 'Pro', status: 'Active', commission: 6.99 },
    { id: 'ref_2', email: 'customer2@example.com', plan: 'Starter', status: 'Active', commission: 2.09 },
    { id: 'ref_3', email: 'customer3@example.com', plan: 'Enterprise', status: 'Trial', commission: 0.00 },
    { id: 'ref_4', email: 'customer4@example.com', plan: 'Pro', status: 'Canceled', commission: 0.00 },
    { id: 'ref_5', email: 'customer5@example.com', plan: 'Pro', status: 'Active', commission: 6.99 },
];

export const payoutHistory = [
    { id: 'pay_1', date: '2024-07-28', amount: 60.10, transactionId: 'TXN123456789', status: 'Completed' },
    { id: 'pay_2', date: '2024-07-27', amount: 55.00, transactionId: 'TXN123456788', status: 'Completed' },
    { id: 'pay_3', date: '2024-07-26', amount: 48.75, transactionId: 'TXN123456787', status: 'Completed' },
    { id: 'pay_4', date: '2024-07-25', amount: 42.50, transactionId: 'TXN123456786', status: 'Completed' },
    { id: 'pay_5', date: '2024-07-24', amount: 42.50, transactionId: 'TXN123456785', status: 'Completed' },
];
