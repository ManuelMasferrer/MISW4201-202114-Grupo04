export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    es_favorita: boolean;
    albumes: Array<any>

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        es_favorita: boolean,
        albumes: Array<any>
    ){
        this.id = id
        this.titulo = titulo
        this.minutos = minutos
        this.segundos = segundos
        this.interprete = interprete
        this.es_favorita = es_favorita
        this.albumes = albumes
    }
}
