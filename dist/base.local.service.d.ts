/// <reference types="localforage" />
import { Storage } from '@ionic/storage';
import { BaseService } from './base.service';
export declare abstract class BaseLocalService<T> extends BaseService<T> {
    private ionicStorage;
    protected storage: LocalForage;
    constructor(typeName: string, ionicStorage: Storage);
    getStoredKeys(): Promise<string[]>;
    generateKey(key: any): string;
    protected initialize(): Promise<void>;
}
