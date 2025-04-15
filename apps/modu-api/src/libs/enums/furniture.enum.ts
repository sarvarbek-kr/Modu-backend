import { registerEnumType } from '@nestjs/graphql';

export enum FurnitureType {
	HOME = 'HOME',
	OFFICE = 'OFFICE',
	OUTDOOR = 'OUTDOOR',
	COMMERCIAL = 'COMMERCIAL',
	ACCESSORIES = 'ACCESSORIES',
}
registerEnumType(FurnitureType, {
	name: 'FurnitureType',
});

export enum FurnitureStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(FurnitureStatus, {
	name: 'FurnitureStatus',
});

export enum FurnitureLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(FurnitureLocation, {
	name: 'FurnitureLocation',
});
