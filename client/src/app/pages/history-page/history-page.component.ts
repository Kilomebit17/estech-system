import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterializeService} from "../../shared/services/materialize.service";
import {OrdersService} from "../../shared/services/orders.service";
import {Filter, Order} from "../../shared/intefaces";

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {
  isFilter: boolean = false;
  @ViewChild('tooltip') toolTip: ElementRef
  tool: MaterialInstance
  loading: boolean = true
  offset: number = 0
  limit: number = STEP
  filter: Filter = {}

  orders: Order[] = []
  reloading: boolean = true;
  loadMoreOrders: boolean = false

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit(): void {
    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.ordersService.fetch(params).subscribe((orders) => {
      this.loadMoreOrders = this.orders.length < STEP
      this.loading = false
      this.reloading = false
      this.orders = this.orders.concat(orders)
    })
  }

  ngAfterViewInit() {
    this.tool = MaterializeService.toolTips(this.toolTip)
  }

  ngOnDestroy() {
    this.tool.destroy()
  }

  LoadMore() {
    this.loading = true
    this.offset += STEP
    this.fetch()
  }

  applyFilter(event: Filter) {
    this.orders = []
    this.offset = 0
    this.filter = event
    this.reloading = true
    this.fetch()
  }
}
