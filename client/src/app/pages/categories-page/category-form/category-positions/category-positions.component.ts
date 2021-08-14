import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../../shared/services/positions.service";
import {Position} from "../../../../shared/intefaces";
import {MaterialInstance, MaterializeService} from "../../../../shared/services/materialize.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-category-positions',
  templateUrl: './category-positions.component.html',
  styleUrls: ['./category-positions.component.css']
})
export class CategoryPositionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef

  positions: Position[] = []
  isLoading: boolean = false;
  modal: MaterialInstance
  form: FormGroup
  positionId = null

  constructor(private positionsService: PositionsService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })

    this.isLoading = true
    this.positionsService.fetch(this.categoryId).subscribe({
      next: (position) => {
        this.isLoading = false
        this.positions = position
      }
    })
  }

  ngAfterViewInit() {
    this.modal = MaterializeService.initModal(this.modalRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({name: position.name, cost: position.cost})
    this.modal.open()
    MaterializeService.updateInput()
  }

  onAddPosition() {
    this.positionId = null
    this.form.reset({name: null, cost: 1})
    MaterializeService.updateInput()
    this.modal.open()
  }

  onSubmit() {
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () => {
      this.form.enable()
      this.form.reset({name: '', cost: 1})
      this.modal.close()
    }
    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterializeService.toast('Position updated')
        },
        error => MaterializeService.toast(error.error.message),
        completed
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          this.positions.push(position)
          MaterializeService.toast('Position created')
        },
        error => MaterializeService.toast(error.error.message),
        completed
      )
    }

  }

  onCancel() {
    this.modal.close()
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()

    this.positionsService.delete(position).subscribe(
      response => {
        const idx = this.positions.findIndex(p => p._id === position._id)
        this.positions.splice(idx, 1)
        MaterializeService.toast(response.message)
      },
      error => {
        MaterializeService.toast(error.error.message)
      }
    )
  }

  onPositionChange() {
    this.modal.close()
  }


}
