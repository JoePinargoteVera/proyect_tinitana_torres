import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { ClientService } from 'src/app/Service/client.service';
import { Client } from 'src/app/interface/iclient';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from 'src/app/Service/transaction.service';
import { Transaction } from 'src/app/interface/itransaction';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {

  loading: boolean = false
  filtro: String = ''
  edit:boolean = false
  addClient: boolean = true
  listClient: boolean = false
  errorMessage: string = ''
  succesMessage: string = ''
  clienteList!: Client[]
  transacciones!:any[]
  clienteAsignado: Client = {cedula: '',nombres: '',apellidos: '',email: '',estado: true}
  cliente: Client = {cedula: '',nombres: '',apellidos: '',email: '',estado: true}

  constructor(private clientService: ClientService, private transacService:TransactionService, private toastr: ToastrService) {
  }

  showAddClientForm() {

    this.addClient = true
    this.listClient = false
  }

  showListClients() {

    this.listClient = true
    this.addClient = false
    this.obtenerClientes()
  }

  obtenerClientes() {
    this.clientService.listarClientes().pipe(
      tap(data => {
        this.clienteList = data.data


      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()

  }

  buscarClientes() {
    this.clientService.buscarClientes(this.filtro).pipe(
      tap(data => {

        this.clienteList = data.data
      }),
      catchError(error => {
        this.errorMessage = error.error.message
        return this.errorMessage
      })
    ).subscribe()

  }

  crearCliente() {
    this.loading = true;
    this.clientService.crearCliente(this.cliente).pipe(
      tap(data => {
 
 
        this.loading = false;
        // this.cliente  = {}

        if (data.status == '422') {

          const errors = data.validationError;

          Object.keys(errors).forEach(key => {

            const errorMessage = errors[key][0]
            this.toastr.warning(errorMessage, 'Error')


          });
        } else if (data.status == '500') {
          this.toastr.error(data.error, 'Error');
        }else{
          this.toastr.success(data.message, 'Exito');
        }

      }),
      catchError(error => {
        this.loading = false;
        this.toastr.error(error.error.message, 'error');
        return error.error.message
      })
    ).subscribe()
  }

  verTransacciones(id:any){
    this.transacService.listarPorCliente(id).pipe(
      tap(data =>{
        this.transacciones = data.data
      }),
      catchError(error =>{
        return error.error.message
      })
    ).subscribe()
  }

  actualizarCliente(){

    this.clienteAsignado = this.cliente
    console.log(this.cliente);
    
    this.clientService.actualizarCliente(this.cliente).pipe(
      tap(data =>{
        console.log(data);
        
  
        if (data.status == '422') {
  
          const errors = data.validationError;
  
          Object.keys(errors).forEach(key => {
  
            const errorMessage = errors[key][0]
            this.toastr.error(errorMessage, 'Error')
  
  
          });
        } else if (data.status == '500' || data.status == '404') {
          this.toastr.error(data.message, 'Error');
        }else{
          this.toastr.success(data.message, 'Exito');
          this.obtenerClientes()
          this.edit = false
        }
      }),
      catchError(error=>{
        return error.error.message
      })
    ).subscribe()
    
  }

  asignarCliente(cliente:any){
    this.clienteAsignado = cliente
    this.cliente = cliente
    console.log(this.cliente, this.clienteAsignado);
    
  }

  editar(){
    this.edit = true
  }

  cancelarEditar(){
    console.log(this.clienteAsignado);
    
    // this.cliente = this.clienteAsignado
    this.cliente.telefono_dos = '096633225511'
    this.edit = false
  }

}
