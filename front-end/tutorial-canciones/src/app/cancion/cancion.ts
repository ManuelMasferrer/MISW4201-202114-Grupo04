export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    albumes: Array<any>;
    genero: Genero;
    es_favorita: boolean;

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        albumes: Array<any>,
        es_favorita: boolean,
        genero: Genero
    ){
        this.id = id
        this.titulo = titulo
        this.minutos = minutos
        this.segundos = segundos
        this.interprete = interprete
        this.es_favorita = es_favorita
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
