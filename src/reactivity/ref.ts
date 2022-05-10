import { hasChange, isObject } from "../share";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";


class RefImpl {
  private _value: any;
  deps: any;
  private _rawValue: any;
  constructor (val) {
    this.deps = new Set()
    this._rawValue = val
    this._value = convert(val)
  }

  get value () {
    if (isTracking()) {
      trackEffect(this.deps)
    }
    return this._value
  }

  set value (newValue) {
    if (hasChange(newValue, this._rawValue)) {
      this._value = convert(newValue)
      triggerEffect(this.deps)
    }
  }
}


function convert(val) {
  return isObject(val) ? reactive(val) :val
}



export function ref(raw) {
  return new RefImpl(raw)
}