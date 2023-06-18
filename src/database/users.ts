import { Errand } from '../models/errand.models';
import { User } from '../models/user.models';

export const users = [new User('José', 'jose@teste.com', '1234')];

users[0].errand.push(new Errand('Mercado', 'Fazer compras'));
users[0].errand.push(new Errand('Lavar', 'Casa de praia'));
