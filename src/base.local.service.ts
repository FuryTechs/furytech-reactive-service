import { Storage } from '@ionic/storage';

import { BaseService } from './base.service';

export abstract class BaseLocalService<T> extends BaseService<T> {

    protected storage: LocalForage;

    constructor(typeName: string, private ionicStorage: Storage) {
        super(typeName);
    }

    public async getStoredKeys() {
        return await this.storage.keys();
    }

    public generateKey(key: any): string {
        return key;
    }

    protected async initialize() {
        this.storage = (await this.ionicStorage.ready()).createInstance({
            storeName: this.INSTANCE_NAME,
            description: `Store for ${this.INSTANCE_NAME} entities`
        });
    }
}
