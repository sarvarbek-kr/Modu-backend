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

export enum FurnitureCondition {
	NEW = 'NEW',
	USED = 'USED',
}
registerEnumType(FurnitureCondition, {
	name: 'FurnitureCondition',
});

export enum FurnitureColor {
	BROWN = 'BROWN',
	BEIGE = 'BEIGE',
	BLACK = 'BLACK',
	WHITE = 'WHITE',
	GRAY = 'GRAY',
	DARK_GRAY = 'DARK GRAY',
	LIGHT_WOOD = 'LIGHT WOOD',
	DARK_WOOD = 'DARK_WOOD',
	OLIVE_GREEN = 'OLIVE GREEN',
	NAVY_BLUE = 'NAVY BLUE',
	CREAM = 'CREAM',
	RUST = 'RUST',
	CHARCOAL = 'CHARCOAL',
	WALNUT = 'WALNUT',
	OAK = 'OAK',
}
registerEnumType(FurnitureColor, {
	name: 'FurnitureColor',
});

export enum FurnitureMaterial {
	WOOD = 'WOOD',
	METAL = 'METAL',
	LEATHER = 'LEATHER',
	GLASS = 'GLASS',
	PLASTIC = 'PLASTIC',
	FABRIC = 'FABRIC',
}
registerEnumType(FurnitureMaterial, {
	name: 'FurnitureMaterial',
});

export enum FurnitureBrand {
	IKEA = 'IKEA',
	ASHLEY = 'ASHLEY',
	WAYFAIR = 'WAYFAIR',
	LA_Z_BOY = 'LA-Z-BOY',
	WEST_ELM = 'WEST ELM',
	POTTERY_BARNY = 'POTTERY BARN',
	LG = 'LG',
	SAMSUNG = 'SAMSUNG',
	HAIER = 'HAIER',
	BOSCH = 'BOSCH',
}
registerEnumType(FurnitureBrand, {
	name: 'FurnitureBrand',
});
