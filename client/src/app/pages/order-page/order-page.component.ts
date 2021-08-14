import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterializeService} from "../../shared/services/materialize.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../../shared/intefaces";
import {OrdersService} from "../../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef
  modal: MaterialInstance
  isRoot: boolean
  oSub: Subscription
  isDisabled: boolean = false

  constructor(private router: Router,
              public orderService: OrderService,
              private oService: OrdersService) {
  }


  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngAfterViewInit() {
    this.modal = MaterializeService.initModal(this.modalRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }


  onCompleteOrder() {
    this.modal.open()
  }


  onCloseModal() {
    this.modal.close()
  }

  removePosition(remove: OrderPosition) {
    this.orderService.remove(remove)
  }

  submit() {
    this.isDisabled = true
    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id
        return item
      })
    }
    this.oSub = this.oService.create(order).subscribe(
      newOrder => MaterializeService.toast(`Order №${newOrder.order} was added`),
      error => MaterializeService.toast(error.error.message),
      () => {
        this.modal.close()
        this.orderService.clear()
        this.isDisabled = false
      }
    )
  }
}
