import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MaterializeService} from "../../services/materialize.service";
export interface  Links {
  url:string
  name:string
}
@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating') floatingRef:ElementRef
  @ViewChild('colorInput') coloInput:ElementRef
  public links:Links[] = [
    {url:"/overview",name:'Overview'},
    {url:"/analytics",name:'Analytics'},
    {url:"/history",name:'History'},
    {url:"/order",name:'Order'},
    {url:"/categories",name:'Categories'},
  ]

  constructor(private auth:AuthService,
              private router:Router) { }


  ngAfterViewInit() {
    MaterializeService.initializeFloatingButton(this.floatingRef)
  }

  logOut() {
    this.auth.logout()
    this.router.navigate(['/login'], {queryParams:{logout:true}})
  }


}
