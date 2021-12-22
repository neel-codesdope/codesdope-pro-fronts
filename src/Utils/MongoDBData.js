import * as Realm from 'realm-web';
import { MONGODB_APP_ID, MONGODB_CONFIG } from '../Constants/Values';

const app = new Realm.App({ id: MONGODB_APP_ID });

export const getData = async function (db_name) {
    let requested_data = null;
    try {
        const user = await app.logIn(Realm.Credentials.apiKey(MONGODB_CONFIG.apiKey));
        const mongodb = app.currentUser.mongoClient(MONGODB_CONFIG.client);
        const dataDB = mongodb.db(MONGODB_CONFIG.databaseName).collection(MONGODB_CONFIG.collection);
        const bannerData = await dataDB.findOne({ name: db_name });
        requested_data = bannerData.data;
    } catch (e) {}
    return requested_data;
};
