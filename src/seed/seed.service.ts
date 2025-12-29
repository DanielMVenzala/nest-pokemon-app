import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    //Desestructuramos y traemos la data
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=251',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      //Cortamos la url por segmentos
      //[ 'https:', '', 'pokeapi.co', 'api', 'v2', 'pokemon', '1', '' ]
      //Así sabemos que la penúltima posición es el numero
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      // const pokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    //Si creamos la interfaz podemos acceder a las propiedades de la respuesta (seed/interfaces)
    //Con paste JSON as code
    return 'Seed executed';
  }
}
