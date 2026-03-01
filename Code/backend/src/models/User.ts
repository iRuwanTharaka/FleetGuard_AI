/**
 * Company: KITH travels
 * Product: Fleet guard
 * Description: User model definition.
 */
import { Table, Column, Model, DataType, Default, IsEmail, Length, BeforeSave, BeforeUpdate } from 'sequelize-typescript';
import bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    DRIVER = 'driver'
}

@Table({
    timestamps: true,
    tableName: 'users'
})
export class User extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;

    @IsEmail
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email!: string;

    @Length({ min: 6 })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    phone!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    licenseNumber!: string;

    @Default(UserRole.DRIVER)
    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false
    })
    role!: UserRole;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    isActive!: boolean;

    @BeforeSave
    @BeforeUpdate
    static async hashPassword(user: User) {
        if (user.changed('password')) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
            const salt = await bcrypt.genSalt(saltRounds);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }

    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}
