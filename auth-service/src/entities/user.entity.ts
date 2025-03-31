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
@Index(
  "fulltext_search",
  ["email", "phone", "firstName", "lastName", "address"],
  {
    fulltext: true,
  }
)
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, type: "nvarchar", length: 255 })
  email!: string;

  @Column({ unique: true, type: "nvarchar", length: 255 })
  phone!: string;

  @Column({ type: "nvarchar", length: 255 })
  firstName!: string;

  @Column({ type: "nvarchar", length: 255 })
  lastName!: string;

  @Column({ type: "nvarchar", length: 255 })
  address!: string;

  @Column({ type: "nvarchar", length: 255 })
  password!: string;

  @Column({ type: "nvarchar", length: 255, nullable: true })
  url_Image!: string;

  @Column({
    type: "enum",
    enum: EnumRole,
    default: EnumRole.Waiter,
    nullable: true,
  })
  role!: EnumRole;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
