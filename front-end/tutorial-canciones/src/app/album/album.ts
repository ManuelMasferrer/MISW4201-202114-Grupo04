export class Album {

    id: number;
    titulo: string;
    anio: number;
    descripcion: string;
    medio: Medio;
    usuario: number;
    interpretes: Array<string>;
    canciones: Array<Cancion>;
    generos: Array<string>;
    cancion_interpretes: Array<string>;
    cancion_generos: Array<any>;


    constructor(
        id: number,
        titulo: string,
        anio: number,
        descripcion: string,
        medio: Medio,
        usuario: number,
        interpretes: Array<string>,
        canciones: Array<Cancion>,
        generos: Array<string>,
        cancion_interpretes:Array<string>,
        cancion_generos: Array<any>
    ){
        this.id = id,
        this.titulo = titulo,
        this.anio = anio,
        this.descripcion = descripcion,
        this.medio = medio,
        this.usuario = usuario,
        this.interpretes = interpretes,
        this.canciones = canciones,
        this.generos = generos,
        this.cancion_interpretes = cancion_interpretes,
        this.cancion_generos = cancion_generos
    }
}

export class Medio{
    llave: string;
    valor: number

    constructor(
        llave: string,
        valor:number
    ){
        this.llave = llave,
        this.valor = valor
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

export class Cancion{
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete
    }
}
