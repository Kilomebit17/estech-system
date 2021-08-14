import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../../shared/services/category.service";
import {Category} from "../../shared/intefaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {
  categories$:Observable<Category[]>
  constructor(private categoriesService:CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoriesService.fetch()
  }

}
