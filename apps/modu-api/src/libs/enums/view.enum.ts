import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	FURNITURE = 'FURNITURE',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
