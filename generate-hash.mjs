import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash('YourNewPassword123', 10);

console.log(hash);