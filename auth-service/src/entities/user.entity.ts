import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { EnumRole } from "../types/EnumRole";

@Entity("users")
@Index(["email", "phone", "firstName", "lastName", "address"], {
  fulltext: true,
})
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, type: "varchar", length: 255 })
  @Index({ fulltext: true })
  email!: string;

  @Column({ unique: true, type: "varchar", length: 255 })
  @Index({ fulltext: true })
  phone!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 255 })
  @Index({ fulltext: true })
  firstName!: string;

  @Column({ type: "varchar", length: 255 })
  @Index({ fulltext: true })
  lastName!: string;

  @Column({ type: "varchar", length: 255 })
  @Index({ fulltext: true })
  address!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  url_Image!: string;

  @Column({
    type: "enum",
    enum: EnumRole,
    default: EnumRole.Waiter,
  })
  role!: EnumRole;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
