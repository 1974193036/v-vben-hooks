<script setup>
import dayjs from 'dayjs'
import BasicForm from './components/BasicForm/index.vue'

const schemas = [
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '基础字段',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'field1',
    component: 'Input',
    label: ({ model }) => {
      return `字段1${model.field3 ? model.field3 : ''}`
    },
    helpMessage: ['Input组件', 'Input组件222'],
    colProps: {
      span: 8,
    },
    // dynamicDisabled({ values }) {
    //   return values.field4 === '男'
    // },
    componentProps: ({ formModel }) => {
      console.log('formModel:', formModel)
      return {
        placeholder: '自定义placeholder',
        onChange: (e) => {
          console.log(e)
        },
      }
    },
    renderComponentContent: () => {
      return {
        prefix: () => 'pSlot',
        suffix: () => 'sSlot',
      }
    },
    dynamicRules: ({ values }) => {
      return values.field2 ? [{ required: true, message: '字段1必填' }] : []
    },
  },
  {
    field: 'field2',
    component: 'Input',
    label: '带后缀',
    defaultValue: '111',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e) => {
        console.log(e)
      },
    },
    suffix: '天',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    // defaultValue: [dayjs().subtract(6, 'day'), dayjs()],
    defaultValue: dayjs(),
    colProps: {
      span: 8,
    },
    // componentProps: {
    //   valueFormat: 'YYYY/MM/DD',
    // },
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '男',
          value: '男',
          key: '男',
        },
        {
          label: '女',
          value: '女',
          key: '女',
        },
      ],
    },
    rules: [{ required: true, trigger: 'change' }],
  },
  // {
  //   field: 'code1',
  //   component: 'Input',
  //   label: 'code1',
  //   colProps: { span: 24 },
  //   slot: 'code1',
  //   ifShow() {
  //     return true
  //     // return values.field4 === '男'
  //   },
  //   dynamicDisabled({ values }) {
  //     return values.field4 === '男'
  //   },
  // },
  // {
  //   field: 'code2',
  //   component: 'Input',
  //   label: 'code2',
  //   colProps: { span: 24 },
  //   slot: 'code2',
  //   show() {
  //     return true
  //   },
  // },
]

function handleSubmit(values) {
  console.log('values', values)
}
function beforeResetForm() {
  console.log('重置表单行为前执行自定义重置按钮逻辑')
}
function handleReset() {
  console.log('reset')
}
let __resetFields, __getFieldsValue, __setFieldsValue, __setProps, __appendSchemaByField, __removeSchemaByField, __updateSchema, __resetSchema
function regiser(formActionType) {
  console.log(formActionType)
  const { resetFields, getFieldsValue, setFieldsValue, setProps, appendSchemaByField, removeSchemaByField, updateSchema, resetSchema } = formActionType
  __resetFields = resetFields
  __getFieldsValue = getFieldsValue
  __setFieldsValue = setFieldsValue
  __setProps = setProps
  __appendSchemaByField = appendSchemaByField
  __removeSchemaByField = removeSchemaByField
  __updateSchema = updateSchema
  __resetSchema = resetSchema
}
function resetForm() {
  __resetFields()
}
function getFormValues() {
  console.log(__getFieldsValue())
}
function setFormValues() {
  __setFieldsValue({
    field1: 'hello',
  })
}
</script>

<template>
  <div style="margin: 50px 200px;">
    <a-button @click="resetForm">
      手动重置表单
    </a-button>
    <a-button @click="getFormValues">
      手动获取表单值
    </a-button>
    <a-button @click="setFormValues">
      手动设置表单值
    </a-button>
    <a-button @click="__setProps({ labelWidth: 250 })">
      更改labelWidth
    </a-button>
    <a-button
      @click="__appendSchemaByField({
        field: 'field5',
        component: 'Input',
        label: '字段5',
        defaultValue: '111',
        colProps: {
          span: 8,
        },
      })"
    >
      增加schema
    </a-button>
    <a-button
      @click="__removeSchemaByField('field5')"
    >
      删除schema
    </a-button>
    <a-button
      @click="__updateSchema({
        field: 'field1',
        componentProps: { disabled: true },
      })"
    >
      更新schema
    </a-button>
    <a-button
      @click="__resetSchema([{
        field: 'field1',
        label: '字段1',
        component: 'Input',
      }, {
        field: 'field2',
        label: '字段2',
        component: 'Input',
      }])"
    >
      重置schema
    </a-button>
    <BasicForm
      :label-width="120"
      :schemas="schemas"
      :action-col-options="{ span: 16 }"
      :reset-func="beforeResetForm"
      @register="regiser"
      @submit="handleSubmit"
      @reset="handleReset"
    >
      <!-- <template #code1="{ model, field, disabled }">
        <h1>code1--{{ model }} - {{ field }} - {{ disabled }}</h1>
      </template>
      <template #code2="{ model, field, disabled }">
        <h1>code2--{{ model }} - {{ field }} - {{ disabled }}</h1>
      </template> -->

      <!-- <template #resetBefore>
        <a-button>resetBefore</a-button>
      </template>
      <template #submitBefore>
        <a-button>submitBefore</a-button>
      </template> -->
    </BasicForm>
  </div>
</template>
