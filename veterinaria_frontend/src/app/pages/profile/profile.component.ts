import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceStorage } from 'src/app/Service/storage.service';
import { User } from 'src/app/interface/iuser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  errorMessage : String=''
  user!: User;

  constructor(private serviceStorage: ServiceStorage, private toastr: ToastrService){

  }
  ngOnInit(): void {
    
    this.user = this.serviceStorage.obtenerDato('user')
    
  }
}
