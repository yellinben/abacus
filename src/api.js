import { service } from 'abacus-js';

export default class Api {
  static getNotebook() {
    return service.notebook;
  }

  static updateNotebook(notebook) {
    return service.saveAll();
  }

  static getSheets() {
    return service.sheets();
  }

  static getSheet(idOrTitle) {
    return service.getSheet(idOrTitle);
  }

  static createSheet(title = undefined) {
    return service.createSheet(title);
  }

  static updateSheet(sheet) {
    return service.saveSheet(sheet);
  }

  static removeSheet(sheet) {
    return service.removeSheet(sheet);
  }
}
