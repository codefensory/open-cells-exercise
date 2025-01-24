import MakeLocalDB from './utils/makeLocalDB';

export interface Client {
  id: number;
  name: string;
  lastname: string;
  email: string;
  city: string;
}

interface UserAdmin {
  email: string;
  password: string;
}

interface Store {
  clients: Client[];
  userAdmin: UserAdmin;
}

let idIncrement = 20;

const initialStore: Store = {
  clients: [
    {
      id: 1,
      name: 'Juan',
      lastname: 'Pérez',
      email: 'juan.perez@email.com',
      city: 'Madrid',
    },
    {
      id: 2,
      name: 'María',
      lastname: 'García',
      email: 'maria.garcia@email.com',
      city: 'Barcelona',
    },
    {
      id: 3,
      name: 'Carlos',
      lastname: 'Rodríguez',
      email: 'carlos.rodriguez@email.com',
      city: 'Valencia',
    },
    {
      id: 4,
      name: 'Ana',
      lastname: 'Martínez',
      email: 'ana.martinez@email.com',
      city: 'Sevilla',
    },
    {
      id: 5,
      name: 'Luis',
      lastname: 'Sánchez',
      email: 'luis.sanchez@email.com',
      city: 'Bilbao',
    },
    {
      id: 6,
      name: 'Laura',
      lastname: 'Fernández',
      email: 'laura.fernandez@email.com',
      city: 'Zaragoza',
    },
    {
      id: 7,
      name: 'Pedro',
      lastname: 'López',
      email: 'pedro.lopez@email.com',
      city: 'Málaga',
    },
    {
      id: 8,
      name: 'Carmen',
      lastname: 'Ruiz',
      email: 'carmen.ruiz@email.com',
      city: 'Murcia',
    },
    {
      id: 9,
      name: 'Miguel',
      lastname: 'González',
      email: 'miguel.gonzalez@email.com',
      city: 'Alicante',
    },
    {
      id: 10,
      name: 'Isabel',
      lastname: 'Díaz',
      email: 'isabel.diaz@email.com',
      city: 'Valladolid',
    },
    {
      id: 11,
      name: 'Antonio',
      lastname: 'Moreno',
      email: 'antonio.moreno@email.com',
      city: 'Granada',
    },
    {
      id: 12,
      name: 'Sofia',
      lastname: 'Torres',
      email: 'sofia.torres@email.com',
      city: 'Córdoba',
    },
    {
      id: 13,
      name: 'Javier',
      lastname: 'Romero',
      email: 'javier.romero@email.com',
      city: 'Palma',
    },
    {
      id: 14,
      name: 'Elena',
      lastname: 'Navarro',
      email: 'elena.navarro@email.com',
      city: 'Las Palmas',
    },
    {
      id: 15,
      name: 'David',
      lastname: 'Serrano',
      email: 'david.serrano@email.com',
      city: 'Salamanca',
    },
    {
      id: 16,
      name: 'Raquel',
      lastname: 'Ortiz',
      email: 'raquel.ortiz@email.com',
      city: 'Toledo',
    },
    {
      id: 17,
      name: 'Alberto',
      lastname: 'Ramos',
      email: 'alberto.ramos@email.com',
      city: 'Burgos',
    },
    {
      id: 18,
      name: 'Cristina',
      lastname: 'Molina',
      email: 'cristina.molina@email.com',
      city: 'Santander',
    },
    {
      id: 19,
      name: 'Fernando',
      lastname: 'Castro',
      email: 'fernando.castro@email.com',
      city: 'Almería',
    },
    {
      id: 20,
      name: 'Lucía',
      lastname: 'Delgado',
      email: 'lucia.delgado@email.com',
      city: 'Cádiz',
    },
  ],
  userAdmin: {
    email: '258d8dc916db8cea2cafb6c3cd0cb0246efe061421dbd83ec3a350428cabda4f',
    password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  },
};

class LocalApi {
  private dbInMemory = new MakeLocalDB(initialStore, (get, set) => ({
    addClient: (client: Client) =>
      set(store => ({ ...store, clients: [...store.clients, client] })),
    getAdmin: () => get().userAdmin,
    getClients: () => get().clients,
  }));

  public async login(user: string, password: string) {
    const userAdmin = await this.dbInMemory.make({ delay: 500 }).getAdmin();

    if (user === userAdmin.email && password === userAdmin.password) {
      return true;
    } else {
      throw new Error('Usuario o contraseña incorrecto');
    }
  }

  public addClient(client: Omit<Client, 'id'>) {
    return this.dbInMemory.make({ delay: 500 }).addClient({ ...client, id: ++idIncrement });
  }

  public async getClients() {
    const result = [...(await this.dbInMemory.make({ delay: 500 }).getClients())];

    result.reverse();

    return result;
  }
}

export const localApi = new LocalApi();
