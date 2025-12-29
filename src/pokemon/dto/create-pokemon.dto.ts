import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  //Se ponen las condiciones con el class-validator
  @IsPositive()
  @IsInt()
  @Min(1)
  no: number;

  @IsString()
  @MinLength(1)
  name: string;
}
