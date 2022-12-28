import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
	// passing null as first time type, then changing to MongoClient
	connection: null as MongoClient,
	async connect(uri: string): Promise<void> {
		this.connection = await MongoClient.connect(uri);
	},
	async disconnect(): Promise<void> {
		await this.connection.close();
	},

	// to avoid unnecessary db open and closing db connections in production we'll use a getcollection to only retrieve a specific collection
	getCollection(name: string): Collection {
		return this.connection.db().collection(name);
	},
	// because mongo returns only an _id we need to return the full info to follow the interface requirements
	mapper(collectionInfo: any) {
		const { _id, ...accountWithoutId } = collectionInfo;

		return { ...accountWithoutId, id: _id };
	},
};
