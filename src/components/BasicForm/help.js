import { isNumber } from 'lodash-es'

export const dateItemType = [
  'DatePicker',
  'MonthPicker',
  'WeekPicker',
  'TimePicker',
  'RangePicker',
  'DatePickerRange',
]

export function isSlotFormSchema(schema) {
  return 'slot' in schema
}

export function isComponentFormSchema(schema) {
  return !isSlotFormSchema(schema)
}

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component) {
  if (component.includes('Input') || component.includes('Complete'))
    return '请输入'

  if (component.includes('Picker'))
    return '请选择'

  if (
    component.includes('Select')
    || component.includes('Cascader')
    || component.includes('Checkbox')
    || component.includes('Radio')
    || component.includes('Switch')
  )
    return '请选择'

  return ''
}

export const defaultValueComponents = [
  'Input',
  'InputPassword',
  'InputNumber',
  'InputSearch',
  'InputTextArea',
]

export function setComponentRuleType(rule, component, valueFormat) {
  if (Reflect.has(rule, 'type'))
    return

  if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component))
    rule.type = valueFormat ? 'string' : 'object'

  else if (['RangePicker', 'DatePickerRange', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component))
    rule.type = 'array'

  else if (['InputNumber'].includes(component))
    rule.type = 'number'
}

export function handleInputNumberValue(component, val) {
  if (!component)
    return val

  if (defaultValueComponents.includes(component)) {
    if (component !== 'InputNumber')
      return ((val || val === 0) && isNumber(val)) ? `${val}` : val
  }

  return val
}
