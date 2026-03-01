import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

export enum VehicleStatus {
    AVAILABLE = 'available',
    MAINTENANCE = 'maintenance',
    IN_USE = 'in_use'
}

@Table({
    timestamps: true,
    tableName: 'vehicles'
})
export class Vehicle extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    licensePlate!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    make!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    model!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    year!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    vin!: string;

    @Default(VehicleStatus.AVAILABLE)
    @Column({
        type: DataType.ENUM(...Object.values(VehicleStatus)),
        allowNull: false
    })
    status!: VehicleStatus;
}
