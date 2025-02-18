import { UserEntity } from './user.entity'; // Adjust the path if necessary

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string; // Adjust the type based on your model
        username: string;
        address: string;
      };
    }
  }
}
