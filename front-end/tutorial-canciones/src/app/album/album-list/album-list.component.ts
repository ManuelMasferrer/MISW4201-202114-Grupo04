import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Album, Cancion, Genero } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  constructor(
    private albumService: AlbumService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) { }

  userId: number
  token: string
  albumes: Array<Album>
  mostrarAlbumes: Array<Album>
  albumSeleccionado: Album
  indiceSeleccionado: number
  selectedFilter:string='titulo';



  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getAlbumes();
    }



  }

  getAlbumes():void{
    this.albumService.getAlbumes(this.userId, this.token)
    .subscribe(albumes => {
      this.albumes = albumes
      this.mostrarAlbumes = albumes
      if(albumes.length>0){
        this.mostrarAlbumes.map((currentElement, index) => {
          this.albumService.getCancionesAlbum(index+1,this.token).subscribe(canciones => {
            currentElement.canciones = canciones
            currentElement.interpretes = this.getInterpretes(canciones)
            currentElement.generos = this.getGeneros(canciones)

          })

        })
        console.log(this.mostrarAlbumes)
        console.log(this.albumes)
        this.onSelect(this.mostrarAlbumes[0], 0)
        console.log(this.mostrarAlbumes[0])

      }
    },
    error => {
      console.log(error)
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })

  }

  onSelect(a: Album, index: number){
    this.indiceSeleccionado = index
    this.albumSeleccionado = a
    this.albumService.getCancionesAlbum(a.id, this.token)
    .subscribe(canciones => {
      this.albumSeleccionado.canciones = canciones
      this.albumSeleccionado.interpretes = this.getInterpretes(canciones)
      this.albumSeleccionado.generos = this.getGeneros(canciones)
      console.log(this.albumSeleccionado.generos)
    },
    error =>{
      this.showError("Ha ocurrido un error, " + error.message)
    })
  }

  getInterpretes(canciones: Array<Cancion>): Array<string>{
    var interpretes: Array<string> = []
    canciones.map( c => {
      if(!interpretes.includes(c.interprete)){
        interpretes.push(c.interprete)
      }
    })
    return interpretes
  }

  getGeneros(canciones: Array<any>): Array<string>{
    var generos: Array<string> = []
    canciones.map( c => {
      if(!generos.includes(c.genero.llave)){
        generos.push(c.genero.llave)
      }
    })
    return generos
  }

  hasInterprete(albu:Album, busqueda:string):Boolean{
    let resp:boolean = false;
    let interpreteString:string = albu.interpretes?.join(' ') || "";
      if(interpreteString.toLocaleLowerCase().includes(busqueda.toLowerCase())){
        resp=true
      }
      return resp
  }

  hasGenero(albu:Album, busqueda:string):Boolean{
    let resp:boolean = false;
    let interpreteString:string = albu.generos?.join(' ') || "";
      if(interpreteString.toLocaleLowerCase().includes(busqueda.toLowerCase())){
        resp=true
      }
      return resp
  }

  buscarAlbum(busqueda: string, filter = this.selectedFilter){

    let albumesBusqueda: Array<Album> = []
    this.albumes.map( albu => {
      if (filter==='genero'){
        if(this.hasGenero(albu,busqueda)){
          albumesBusqueda.push(albu)
        }
      }
      else if (filter==='interprete'){
        if(this.hasInterprete(albu,busqueda)){
          albumesBusqueda.push(albu)
        }
      }

      else{
        if(albu.titulo.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())){
          albumesBusqueda.push(albu)
        }
      }
    })
    this.mostrarAlbumes = albumesBusqueda.sort((a,b) => (a.titulo > b.titulo) ? 1 : ((b.titulo > a.titulo) ? -1 : 0))
  }

  irCrearAlbum(){
    this.routerPath.navigate([`/albumes/create/${this.userId}/${this.token}`])
  }

  eliminarAlbum(){
    this.albumService.eliminarAlbum(this.userId, this.token, this.albumSeleccionado.id)
    .subscribe(album => {
      this.ngOnInit();
      this.showSuccess();
    },
    error=> {
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
    this.ngOnInit()
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`El album fue eliminado`, "Eliminado exitosamente");
  }


  radioChangeHandler(event:any){
    this.selectedFilter=event.target.value;
    console.log(this.selectedFilter)

  }

}
