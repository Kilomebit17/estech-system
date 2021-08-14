import {ElementRef} from "@angular/core";

declare let M
export interface MaterialInstance {
  open?():void
  close?():void
  destroy?():void
}
export interface MaterialDatepicker extends MaterialInstance {
  date?:Date
}
export class MaterializeService {
  static toast(message:string) {
    M.toast({html:message})
  }
  static initializeFloatingButton(ref:ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement)
  }
  static updateInput() {
    M.updateTextFields()
  }
  static initModal(ref:ElementRef):MaterialInstance {
    return M.Modal.init(ref.nativeElement)
  }
  static toolTips(ref:ElementRef):MaterialInstance {
    return M.Tooltip.init(ref.nativeElement)
  }
  static initDatePicker(ref:ElementRef,onClose: () => void):MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format:'dd.mm.yyyy',
      showClearBtn:true,
      onClose
    })
  }
}