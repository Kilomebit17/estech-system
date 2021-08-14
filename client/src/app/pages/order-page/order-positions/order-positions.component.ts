import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PositionsService} from "../../../shared/services/positions.service";
import {Observable} from "rxjs";
import {Position} from "../../../shared/intefaces";
import {map, switchMap} from "rxjs/operators";
import {OrderService} from "../order.service";
import {MaterializeService} from "../../../shared/services/materialize.service";

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  public positions$: Observable<Position[]>
  public categoryId:string
  constructor(private route: ActivatedRoute,
              private positionService: PositionsService,
              private orderService:OrderService) {
  }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            this.categoryId = params['id']
            return this.positionService.fetch(params['id'])
          }
        ),
        map((pos:Position[]) => pos.map(p => {
          p.quantity = 1
          return p
        }))
      )
  }

  addToOrder(position: Position) {
    MaterializeService.toast(`added x${position.quantity}`)
    this.orderService.add(position)
  }


}
