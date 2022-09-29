import { isFn, isObject } from "../../share/index";
import { createVnode } from "../vnode";

export function renderSlots(slots, name, arg) {
  const slot = slots[name]
  if (slot) { 
    if (isFn(slot)) {
      return createVnode('div', {}, slot(arg))
    }
  }
}