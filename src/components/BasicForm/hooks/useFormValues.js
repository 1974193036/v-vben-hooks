import { cloneDeep, isArray, isFunction, isNil, isObject, isString, set } from 'lodash-es'
import { unref } from 'vue'

/**
 * @desription deconstruct array-link key. This method will mutate the target.
 */
function tryDeconstructArray(key, value, target) {
  const pattern = /^\[(.+)\]$/
  if (pattern.test(key)) {
    const match = key.match(pattern)
    if (match && match[1]) {
      const keys = match[1].split(',')
      value = Array.isArray(value) ? value : [value]
      keys.forEach((k, index) => {
        set(target, k.trim(), value[index])
      })
      return true
    }
  }
}

/**
 * @desription deconstruct object-link key. This method will mutate the target.
 */
function tryDeconstructObject(key, value, target) {
  const pattern = /^\{(.+)\}$/
  if (pattern.test(key)) {
    const match = key.match(pattern)
    if (match && match[1]) {
      const keys = match[1].split(',')
      value = isObject(value) ? value : {}
      keys.forEach((k) => {
        set(target, k.trim(), value[k.trim()])
      })
      return true
    }
  }
}

export function useFormValues({ getProps, defaultValueRef, getSchema, formModel }) {
  function initDefault() {
    const schemas = unref(getSchema)
    const obj = {}
    schemas.forEach((item) => {
      const { defaultValue } = item

      if (!isNil(defaultValue)) {
        obj[item.field] = defaultValue

        if (formModel[item.field] === undefined)
          formModel[item.field] = defaultValue
      }
    })
    defaultValueRef.value = cloneDeep(obj)
  }

  // Processing form values
  function handleFormValues(values) {
    if (!isObject(values))
      return {}

    const res = {}
    for (const item of Object.entries(values)) {
      let [, value] = item
      const [key] = item

      if (!key || (isArray(value) && value.length === 0) || isFunction(value))
        continue

      const transformDateFunc = unref(getProps).transformDateFunc // date => date?.format?.('YYYY-MM-DD') ?? date
      // dayjs()
      if (isObject(value))
        value = transformDateFunc?.(value)

      // [dayjs(), dayjs()]
      if (isArray(value) && value[0]?.format && value[1]?.format)
        value = value.map(item => transformDateFunc?.(item))

      // Remove spaces
      if (isString(value))
        value = value.trim()

      if (!tryDeconstructArray(key, value, res) && !tryDeconstructObject(key, value, res)) {
        // 没有解构成功的，按原样赋值
        set(res, key, value)
      }
    }

    return res
  }

  return {
    handleFormValues,
    initDefault,
  }
}
