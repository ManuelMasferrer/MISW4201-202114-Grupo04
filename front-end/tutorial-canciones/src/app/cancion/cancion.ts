export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    albumes: Array<any>;
    genero: Genero

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        albumes: Array<any>,
        genero: Genero
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete
        this.albumes = albumes
        this.genero = genero
    }
}

export class Genero{
  llave: string;
  valor: number
  constructor(
    llave: string,
    valor: number
  ){
    this.llave = llave,
    this.valor = valor
  }
}
