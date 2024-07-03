import { nextTick, toRaw, unref } from 'vue'
import { cloneDeep, get, isDef, isFunction, set } from 'lodash-es'
import { dateItemType, defaultValueComponents, handleInputNumberValue } from '../help'
import { dateUtil } from '@/utils/dateUtil'

function tryConstructArray(field, values) {
  const pattern = /^\[(.+)\]$/
  if (pattern.test(field)) {
    const match = field.match(pattern)
    if (match && match[1]) {
      const keys = match[1].split(',')
      if (!keys.length)
        return undefined

      const result = []
      keys.forEach((k, index) => {
        set(result, index, values[k.trim()])
      })

      return result.filter(Boolean).length ? result : undefined
    }
  }
}

function tryConstructObject(field, values) {
  const pattern = /^\{(.+)\}$/
  if (pattern.test(field)) {
    const match = field.match(pattern)
    if (match && match[1]) {
      const keys = match[1].split(',')
      if (!keys.length)
        return

      const result = {}
      keys.forEach((k) => {
        set(result, k.trim(), values[k.trim()])
      })

      return Object.values(result).filter(Boolean).length ? result : undefined
    }
  }
}

export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
}) {
  async function clearValidate(name) {
    // formElRef: a-form实例
    await unref(formElRef)?.clearValidate(name)
  }

  async function resetFields() {
    // resetFunc: 重置表单行为前执行自定义重置按钮逻辑
    // submitOnReset: 重置时是否提交表单
    const { resetFunc, submitOnReset } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())

    const formEl = unref(formElRef) // a-form实例
    if (!formEl)
      return

    Object.keys(formModel).forEach((key) => {
      const schema = unref(getSchema).find(item => item.field === key)
      formModel[key] = getDefaultValue(schema, defaultValueRef, key)
    })
    nextTick(() => clearValidate())

    emit('reset', toRaw(formModel))
    submitOnReset && handleSubmit()
  }

  // 获取表单fields
  const getAllFields = () =>
    unref(getSchema)
      .map(item => item.field)
      .filter(Boolean)

  async function validate(nameList) {
    let _nameList
    if (nameList === undefined)
      _nameList = getAllFields()

    else
      _nameList = nameList === Array.isArray(nameList) ? nameList : undefined

    const values = await unref(formElRef)?.validate(_nameList)
    return handleFormValues(values)
  }

  async function handleSubmit(e) {
    e && e.preventDefault()
    // submitFunc: 自定义提交按钮逻辑
    const { submitFunc } = unref(getProps)
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc()
      return
    }
    const formEl = unref(formElRef) // a-form实例
    if (!formEl)
      return
    try {
      // validate: 表单校验
      const values = await validate()
      emit('submit', values)
    }
    catch (error) {
      if (error?.outOfDate === false && error?.errorFields)
        return
      throw new Error(error)
    }
  }

  function getFieldsValue() {
    const formEl = unref(formElRef)
    if (!formEl)
      return {}
    return handleFormValues(toRaw(unref(formModel)))
  }

  async function setFieldsValue(values) {
    if (Object.keys(values).length === 0)
      return

    const fields = getAllFields()

    // key 支持 a.b.c 的嵌套写法
    const delimiter = '.'
    const nestKeyArray = fields.filter(item => String(item).includes(delimiter))

    const validKeys = []
    fields.forEach((key) => {
      const schema = unref(getSchema).find(item => item.field === key)
      let value = get(values, key)
      value = handleInputNumberValue(schema?.component, value)

      const { componentProps } = schema || {}
      let _props = componentProps
      if (typeof componentProps === 'function')
        // eslint-disable-next-line no-use-before-define
        _props = _props({ formModel: unref(formModel), formActionType })

      const constructValue = tryConstructArray(key, values) || tryConstructObject(key, values)
      const hasKey = Reflect.has(values, key)
      if (hasKey || !!constructValue) {
        const fieldValue = constructValue || value
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(fieldValue)) {
            const arr = []
            for (const ele of fieldValue)
              arr.push(ele ? dateUtil(ele) : null)

            unref(formModel)[key] = arr
          }
          else {
            unref(formModel)[key] = fieldValue
              ? _props?.valueFormat
                ? fieldValue
                : dateUtil(fieldValue)
              : null
          }
        }
        else {
          unref(formModel)[key] = fieldValue
        }
        if (_props?.onChange)
          _props?.onChange(fieldValue)

        validKeys.push(key)
      }
      else {
        nestKeyArray.forEach((nestKey) => {
          try {
            const value = nestKey.split('.').reduce((out, item) => out[item], values)
            if (isDef(value)) {
              unref(formModel)[nestKey] = unref(value)
              validKeys.push(nestKey)
            }
          }
          catch (e) {
            // key not exist
            if (isDef(defaultValueRef.value[nestKey]))
              unref(formModel)[nestKey] = cloneDeep(unref(defaultValueRef.value[nestKey]))
          }
        })
      }
    })
    // 给表单赋值后，再触发表单校验
    validateFields(validKeys).catch((_) => {})
  }

  function itemIsDateType(key) {
    return unref(getSchema).some((item) => {
      return item.field === key && item.component ? dateItemType.includes(item.component) : false
    })
  }

  async function validateFields(nameList) {
    const values = await unref(formElRef)?.validateFields(nameList)
    return handleFormValues(values)
  }

  const formActionType = {
    resetFields,
    submit: handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  }

  return {
    resetFields,
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  }
}

function getDefaultValue(
  schema,
  defaultValueRef,
  key,
) {
  let defaultValue = cloneDeep(defaultValueRef.value[key])
  const isInput = checkIsInput(schema)
  if (isInput)
    return defaultValue || ''

  if (!defaultValue && schema && checkIsRangeSlider(schema))
    defaultValue = [0, 0]

  return defaultValue
}

function checkIsRangeSlider(schema) {
  if (schema.component === 'Slider' && schema.componentProps && 'range' in schema.componentProps)
    return true
}

function checkIsInput(schema) {
  return schema?.component && defaultValueComponents.includes(schema.component)
}
