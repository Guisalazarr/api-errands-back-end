import { Errand } from '../models/errand.models';
import { User } from '../models/user.models';

export const users = [
    new User('José', 'jose@teste.com', '1234'),
    new User('Pedro', 'pedro@teste.com', '2222'),
    new User('Maria', 'maria@teste.com', '3333'),
    new User('Ana', 'ana@teste.com', '5656'),
    new User('João', 'joao@teste.com', '3311'),
    new User('Janaina', 'janaina@teste.com', '4321'),
];

users[0].errand.push(new Errand('Mercado', 'Fazer compras'));
users[0].errand.push(new Errand('Lavar', 'Casa de praia'));
users[1].errand.push(new Errand('Cachorro', 'Levar para passear'));
users[1].errand.push(new Errand('Luz', 'Trocar a lampâda da cozinha'));
