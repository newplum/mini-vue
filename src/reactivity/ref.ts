import { hasChange, isObject } from "../share";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";


class RefImpl {
  private _value: any;
  deps: any;
  private _rawValue: any;
  private __v_isRef = true
  constructor (val) {
    this.deps = new Set()
    this._rawValue = val
    this._value = convert(val)
  }

  get value () {
    trackRefValue(this)
    return this._value
  }

  set value (newValue) {
    if (hasChange(newValue, this._rawValue)) {
      this._value = convert(newValue)
      this._rawValue = newValue
      triggerEffect(this.deps)
    }
  }
}


function convert(val) {
  return isObject(val) ? reactive(val) :val
}

function trackRefValue (ref) {
if (isTracking()) {
      trackEffect(ref.deps)
    }
}



export function ref(raw) {
  return new RefImpl(raw)
}


export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}