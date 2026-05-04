import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { UserRole } from "../../enum/users.enum"

@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string | null ;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
