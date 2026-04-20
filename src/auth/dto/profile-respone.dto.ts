import { UserRole } from "../../enum/users.enum";

export class ProfileResponseDto {
  user_id: number;
  username: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
}