import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../../shared/intefaces";
import {MaterialInstance, MaterializeService} from "../../../shared/services/materialize.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy,AfterViewInit {
  @Input() orders:Order[]
  @ViewChild('modal') modalRef:ElementRef
  modal:MaterialInstance
  selectedOrder: Order;
  constructor() { }

  calculatePrice(order: Order):number {
    return order.list.reduce((acc,item) => {
      return acc += item.cost * item.quantity
    },0)
  }
  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterializeService.initModal(this.modalRef)
  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }
}
