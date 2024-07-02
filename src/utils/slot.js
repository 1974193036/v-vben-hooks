import { isFunction } from 'lodash-es'

export function getSlot(slots, slot = 'default', data, opts) {
  if (!slots || !Reflect.has(slots, slot))
    return null

  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn)
    return null
  const params = { ...data, ...opts }
  return slotFn(params)
}
