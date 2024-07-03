<script setup>
import dayjs from 'dayjs'
import { BasicForm, useForm } from './BasicForm'

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
    componentProps: () => {
      // console.log('formModel:', formModel)
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
]
const [register, { setProps, setFieldsValue, getFieldsValue, resetFields }] = useForm({
  labelWidth: 120,
  schemas,
  size: 'small',
  actionColOptions: { span: 16 },
})

function handleReset() {
  console.log('reset')
}
function handleSubmit(values) {
  console.log(values)
}
function getFormValues() {
  console.log(getFieldsValue())
}
function setFormValues() {
  setFieldsValue({
    field1: 'hello',
  })
}
</script>

<template>
  <div style="margin: 50px 200px;">
    <a-space>
      <a-button @click="resetFields">
        手动重置表单
      </a-button>
      <a-button @click="getFormValues">
        手动获取表单值
      </a-button>
      <a-button @click="setFormValues">
        手动设置表单值
      </a-button>
      <a-button @click="setProps({ labelWidth: 250 })">
        更改labelWidth
      </a-button>
    </a-space>
    <a-card>
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
      />
    </a-card>
  </div>
</template>
