<script setup>
import { reactive, ref, useAttrs } from 'vue'
import { basicProps } from './props'

defineOptions({ name: 'BasicForm' })

const props = defineProps(basicProps)
console.log('props', props)

const attrs = useAttrs()
console.log('attrs', attrs)

const getBindValue = { a: 1 }

// a-form的实例对象
const formElRef = ref()

// 表单绑定的值
const formModel = reactive({})

function handleEnterPress() {
  console.log('表单值', formModel)
}
</script>

<template>
  <a-form
    ref="formElRef"
    :model="formModel"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @keypress.enter="handleEnterPress"
  >
    {{ getBindValue }}
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
