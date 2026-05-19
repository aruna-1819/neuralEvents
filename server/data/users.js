import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const users = [
  {
    name: 'Admin User',
    email: 'admin@neuralevents.com',
    password: hashPassword('password123'),
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: hashPassword('password123'),
    role: 'user',
  },
];

export default users;
