export class Store<T> {
  static STORE_NAME = "chrisgregory";
  static STORAGE = window.sessionStorage;

  store: { [key: string]: T };

  constructor() {
    this.store = {};
    this.load();
  }

  get(key: string): T | undefined {
    return this.store[key];
  }

  set(key: string, value: T, save: boolean = false) {
    this.store[key] = value;
    if (save) {
      this.save();
    }
  }

  contains(key: string): boolean {
    return key in this.store;
  }

  delete(key: string) {
    delete this.store[key];
  }

  load() {
    const storeString = Store.STORAGE.getItem(Store.STORE_NAME);
    this.store = storeString === null ? {} : JSON.parse(storeString);
  }

  save() {
    const storeString = JSON.stringify(this.store);
    Store.STORAGE.setItem(Store.STORE_NAME, storeString);
  }

  dispose() {
    Store.STORAGE.removeItem(Store.STORE_NAME);
  }
}
