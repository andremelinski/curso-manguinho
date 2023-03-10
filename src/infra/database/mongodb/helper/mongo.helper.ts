import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
	connection: null as MongoClient,
	uri: null as string,
	async connect(uri: string): Promise<void> {
		this.uri = uri;
		this.connection = await MongoClient.connect(uri);
	},
	async disconnect(): Promise<void> {
		await this.connection.close();
		this.connection = null;
	},

	// to avoid unnecessary db open and closing db connections in production we'll use a getcollection to only retrieve a specific collection
	async getCollection(name: string): Promise<Collection> {
		if (!this.connection) {
			await this.connect(this.uri);
		}
		return this.connection.db().collection(name);
	},
	// because mongo returns only an _id we need to return the full info to follow the interface requirements
	mapper(collectionInfo: any) {
		const { _id, ...userInfoWithoutId } = collectionInfo;

		return { ...userInfoWithoutId, id: _id.toString() };
	},
	mapCollection(collectionArr: any[]): any[] {
		return collectionArr.map((collection) => {
			return this.mapper(collection);
		});
	},
	// eslint-disable-next-line consistent-return
	async connectToCollections(collection: string): Promise<Collection> | undefined {
		const collectionSet = collection;
		const collectionArr = ['surveys', 'accounts', 'surveyResults'];

		if (collectionArr.find((el) => {
			return el === collectionSet;
		})) {
			const collectionConnected = await this.getCollection(collection);

			return collectionConnected;
		}
	},
};
