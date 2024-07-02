<script setup>
import { computed, reactive, ref, unref, useAttrs } from 'vue'
import { cloneDeep } from 'lodash-es'
import { basicProps } from './props'
import { dateItemType } from './help'
import FormItem from './components/FormItem.vue'
import { deepMerge } from '@/utils/deepMerge'
import { dateUtil } from '@/utils/dateUtil'

defineOptions({ name: 'BasicForm' })

const props = defineProps(basicProps)
const emit = defineEmits([
  'advanced-change',
  'reset',
  'submit',
  'register',
  'field-value-change',
])

console.log('props', props)

const attrs = useAttrs()
console.log('attrs', attrs)

const propsRef = ref({})
const schemaRef = ref(null)
const defaultValueRef = ref({})
const formElRef = ref() // a-form的实例对象
const formModel = reactive({}) // 表单绑定的值

const getProps = computed(() => {
  return { ...props, ...unref(propsRef) }
})
function setProps(props) {
  propsRef.value = deepMerge(unref(propsRef) || {}, props)
}

const getBindValue = computed(() => {
  return { ...attrs, ...props, ...unref(getProps) }
})
console.log('getBindValue', getBindValue)

const prefixCls = 'v-basic-form'
const getFormClass = computed(() => {
  return [
    prefixCls,
    {
      [`${prefixCls}--compact`]: unref(getProps).compact,
    },
  ]
})

const getRow = computed(() => {
  const { baseRowStyle = {}, rowProps } = unref(getProps)
  return {
    style: baseRowStyle,
    ...rowProps,
  }
})

const formActionType = {
  getFieldsValue: () => {},
  setFieldsValue: () => {},
  resetFields: () => {},
  updateSchema: () => {},
  resetSchema: () => {},
  setProps: () => {},
  removeSchemaByField: () => {},
  appendSchemaByField: () => {},
  clearValidate: () => {},
  validateFields: () => {},
  validate: () => {},
  submit: () => {},
  scrollToField: () => {},
}

const getSchema = computed(() => {
  const schemas = unref(schemaRef) || unref(getProps).schemas

  for (const schema of schemas) {
    // 处理 date
    const { defaultValue, component, componentProps = {} } = schema
    if (defaultValue && dateItemType.includes(component)) {
      const opt = {
        schema,
        tableAction: props.tableAction || {},
        formModel,
        formActionType,
      }
      const valueFormat = typeof componentProps === 'function'
        ? componentProps(opt).valueFormat
        : componentProps.valueFormat

      if (!Array.isArray(defaultValue)) {
        schema.defaultValue = valueFormat
          ? dateUtil(defaultValue).format(valueFormat)
          : dateUtil(defaultValue)
      }
      else {
        const def = []
        defaultValue.forEach((item) => {
          def.push(valueFormat ? dateUtil(item).format(valueFormat) : dateUtil(item))
        })
        schema.defaultValue = def
      }
    }
  }

  if (unref(getProps).showAdvancedButton)
    return cloneDeep(schemas.filter(schema => schema.component !== 'Divider'))
  else
    return cloneDeep(schemas)
})

function setFormModel(key, value, schema) {
  formModel[key] = value
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('field-value-change', key, value)
  if (schema && schema.itemProps && !schema.itemProps.autoLink) {
    // TODO: 这里如果是autoLink=false手动关联的情况下才会再次触发此函数
    // validateFields([key]).catch((_) => {})
  }
}

function handleEnterPress() {
  console.log('表单值', formModel)
}

function test() {
  // formModel.sex = '男'
  // schemaRef.value = [
  //   {
  //     field: 'code1',
  //     component: 'Input',
  //     label: 'code1',
  //     colProps: { span: 24 },
  //   },
  //   {
  //     field: 'code2',
  //     component: 'Input',
  //     label: 'code2',
  //     colProps: { span: 24 },
  //   },
  // ]
  // defaultValueRef.value = {}
  setProps({
    labelWidth: 200,
  })
}
</script>

<template>
  <a-button @click="test">
    test
  </a-button>
  {{ getProps }}
  <a-form
    v-bind="getBindValue"
    ref="formElRef"
    :class="getFormClass"
    :model="formModel"
    autocomplete="off"
    @keypress.enter="handleEnterPress"
  >
    <a-row v-bind="getRow">
      <template v-for="schema in getSchema" :key="schema.field">
        <!-- 表单项 -->
        <FormItem
          :form-action-type="formActionType"
          :schema="schema"
          :form-props="getProps"
          :all-default-values="defaultValueRef"
          :form-model="formModel"
          :set-form-model="setFormModel"
          :is-advanced="true"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data">
            <slot :name="item" v-bind="data || {}" />
          </template>
          <!-- 相当于 -->
          <!-- <template #code1="data">
            <slot name="code1" v-bind="data || {a: 1}" />
          </template>
          <template #code2="data">
            <slot name="code2" v-bind="data || {a: 2}" />
          </template> -->
        </FormItem>

        <!-- 按钮区域 -->
        <!-- TODO -->
      </template>
    </a-row>
  </a-form>
</template>
