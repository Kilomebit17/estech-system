import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../../shared/intefaces";

@Injectable()
export class OrderService {
  public list: OrderPosition[] = []
  public price: number = 0

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id

    })

    const candidate = this.list.find(p => p._id === orderPosition._id)
    if (candidate) {
      candidate.quantity += orderPosition.quantity
    } else {
      this.list.push(orderPosition)
    }

    this.calculatePrice()
  }
  private calculatePrice() {
    this.price = this.list.reduce((acc,item) => {
      return acc += item.quantity * item.cost
    },0)
  }
  remove(position:OrderPosition) {
    const idx = this.list.findIndex(p => p._id === position._id)
    this.list.splice(idx, 1)
    this.calculatePrice()
  }

  clear() {
    this.list = []
    this.price = 0
  }
}
