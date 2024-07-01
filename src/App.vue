<script setup>
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
    colProps: {
      span: 8,
    },
    componentProps: ({ schema, formModel }) => {
      console.log('form:', schema)
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
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    colProps: {
      span: 8,
    },
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
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
    },
  },
]

function handleSubmit(values) {
  console.log('values', values)
}
function handleReset() {
  console.log('reset')
}
</script>

<template>
  <div style="margin: 50px 200px;">
    <BasicForm
      :label-width="200"
      :schemas="schemas"
      :action-col-options="{ span: 24 }"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </div>
</template>
