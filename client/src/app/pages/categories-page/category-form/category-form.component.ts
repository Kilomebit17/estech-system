import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {of, Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../shared/services/category.service";
import {switchMap} from "rxjs/operators";
import {MaterializeService} from "../../../shared/services/materialize.service";
import {Category} from "../../../shared/intefaces";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],

})
export class CategoryFormComponent implements OnInit, OnDestroy {
  form: FormGroup
  isNew: boolean = true
  Sub: Subscription
  image: File
  imagePreview: string | ArrayBuffer = '';
  category: Category
  @ViewChild('fileInput') fileInputRef: ElementRef

  constructor(private route: ActivatedRoute,
              private categoryService: CategoryService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()
    this.Sub = this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false
            return this.categoryService.getById(params['id'])
          }
          return of(null)
        })
      )
      .subscribe({
        next: (category: Category) => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            MaterializeService.updateInput()
            this.imagePreview = category.imageSrc
          }
          this.form.enable()
        },
        error: err => {
          MaterializeService.toast(err.error.message)
        }
      })


  }

  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }

  uploadImg() {
    this.fileInputRef.nativeElement.click()
  }

  onFileSelect(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

  onSubmit() {
    this.form.disable()
    let obs$;

    if (this.isNew) {
      obs$ = this.categoryService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoryService.update(this.category._id + "", this.form.value.name, this.image)
    }
    obs$.subscribe(
      (category) => {
        this.category = category
        if (this.isNew) {
          MaterializeService.toast('Category is created')
        } else {
          MaterializeService.toast('The changes is saved')
        }
        this.form.enable()
      },
      (err) => {
        this.form.enable()
        MaterializeService.toast(err.error.message)
      }
    )
  }

  deleteCategory(_id: number) {
    this.Sub = this.categoryService.delete(_id + '')
      .subscribe(
        response => MaterializeService.toast(response.message),
        error => MaterializeService.toast(error.error.message),
        () => this.router.navigate(['/categories'])
      )
  }
}
