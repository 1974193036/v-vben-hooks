import {
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TimePicker,
} from 'ant-design-vue'

const componentMap = new Map()

componentMap.set('Input', Input)
componentMap.set('InputGroup', Input.Group)
componentMap.set('InputPassword', Input.Password)
componentMap.set('InputSearch', Input.Search)
componentMap.set('InputTextArea', Input.TextArea)
componentMap.set('InputNumber', InputNumber)
componentMap.set('AutoComplete', AutoComplete)
componentMap.set('Select', Select)
componentMap.set('Switch', Switch)
componentMap.set('RadioGroup', Radio.Group)
componentMap.set('Checkbox', Checkbox)
componentMap.set('CheckboxGroup', Checkbox.Group)
componentMap.set('Cascader', Cascader)

componentMap.set('DatePicker', DatePicker)
componentMap.set('MonthPicker', DatePicker.MonthPicker)
componentMap.set('RangePicker', DatePicker.RangePicker)
componentMap.set('WeekPicker', DatePicker.WeekPicker)
componentMap.set('TimePicker', TimePicker)
componentMap.set('TimeRangePicker', TimePicker.TimeRangePicker)

componentMap.set('Divider', Divider)

export function add(compName, component) {
  componentMap.set(compName, component)
}

export function del(compName) {
  componentMap.delete(compName)
}

export { componentMap }
