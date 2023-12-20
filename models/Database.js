import Model from './Model.js';

export default class DataBase extends Model {

  static table = "translate.vocabulary";
  static primary = ["id"];
}
