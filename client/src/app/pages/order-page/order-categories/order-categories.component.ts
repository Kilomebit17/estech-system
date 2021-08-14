import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Category} from "../../../shared/intefaces";
import {CategoryService} from "../../../shared/services/category.service";

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit {
  categories$:Observable<Category[]>
  constructor(private categoryService:CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.fetch()
  }

}
