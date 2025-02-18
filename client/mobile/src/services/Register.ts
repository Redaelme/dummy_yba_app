/**
 *
 *  Extend this class to create a Register
 *
 */
export abstract class IRegister {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  isRegistered() {
    console.log(`${this.name} is Registered`);
  }
}

/**
 *
 * Register is a collection of object to make all parts of code to join in single places
 *
 * Object added to Register is object that implement IRegister
 *
 * use add(plugin: IRegister) to add new Register object
 *
 * use get(name: string) => IRegister to get Register object by specifing the key "name"
 *
 */

export class Register {
  private static availibleRegisters: any = {};

  static add(plugin: IRegister) {
    Register.availibleRegisters[plugin.name] = plugin;
    plugin.isRegistered();
  }

  static get(name: string) {
    return Register.availibleRegisters[name];
  }
}
