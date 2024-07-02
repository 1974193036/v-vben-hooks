import { nextTick, toRaw, unref } from 'vue'
import { cloneDeep, isFunction } from 'lodash-es'
import { defaultValueComponents } from '../help'

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

    // console.log(formModel)
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

  return {
    resetFields,
    handleSubmit,
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
