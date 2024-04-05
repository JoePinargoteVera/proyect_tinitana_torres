import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ClientService } from 'src/app/Service/client.service';
import { Client } from 'src/app/interface/iclient';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {

  filtro:String = ''
  addClient:boolean=true
  listClient:boolean=false
  errorMessage:string = ''
  succesMessage:string = ''
  clienteList!:Client[]
  cliente: Client = {
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    estado: false
  }

  constructor(private clientService:ClientService, ){}

  showAddClientForm(){

    this.addClient = true
    this.listClient = false
  }

  showListClients(){

    this.listClient = true
    this.addClient= false
    this.obtenerClientes()
  }

  obtenerClientes(){
    this.clientService.listarClientes().pipe(
      tap(data=>{      
        this.clienteList = data.data
        console.log(data);
        
      }),
      catchError(error=>{
        this.errorMessage = error.error.message
        return  this.errorMessage
      }) 
    ).subscribe()

  }

  buscarClientes(){
    this.clientService.buscarClientes(this.filtro).pipe(
      tap(data=>{

        this.clienteList = data.data
      }),
      catchError(error=>{
        this.errorMessage = error.error.message
        return  this.errorMessage
      }) 
    ).subscribe()

  }

  crearCliente(){
    this.clientService.crearCliente(this.cliente).pipe(
      tap(data=>{
        this.succesMessage = data.message
      }),
      catchError(error=>{
        this.errorMessage = error.error.message
        return  this.errorMessage
      }) 
    ).subscribe()
  }

}
