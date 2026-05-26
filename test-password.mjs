import bcrypt from 'bcryptjs';

const hash =
  '$2a$10$52rmd6OaVESdR2TKdH2LjuKKWHJ.uF2Z3msf1as9uHe5M9rTqqnc6';

const result = await bcrypt.compare(
  'PUT_YOUR_PASSWORD_HERE',
  hash
);

console.log('Password Match:', result);