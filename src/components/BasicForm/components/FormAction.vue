<script setup>
import { computed } from 'vue'
import { useFormContext } from '../hooks/useFormContext'

defineOptions({ name: 'BasicFormAction' })

const props = defineProps({
  showActionButtonGroup: { // 是否显示操作按钮(重置/提交)
    type: Boolean,
    default: true,
  },
  showResetButton: { // 是否显示重置按钮
    type: Boolean,
    default: true,
  },
  showSubmitButton: { // 是否显示确认按钮
    type: Boolean,
    default: true,
  },
  actionColOptions: { // 操作按钮外层 Col 组件配置，如果开启 showAdvancedButton，则不用设置
    type: Object,
    default: () => ({}),
  },
  resetButtonOptions: { // 重置按钮配置
    type: Object,
    default: () => ({}),
  },
  submitButtonOptions: { // 确认按钮配置
    type: Object,
    default: () => ({}),
  },
  showAdvancedButton: { // TODO: 是否显示收起展开按钮
    type: Boolean,
    default: false,
  },
  isAdvanced: { // TODO
    type: Boolean,
    default: false,
  },
  hideAdvanceBtn: { // TODO
    type: Boolean,
    default: false,
  },
  actionSpan: { // TODO
    type: Number,
    default: 6,
  },
})

const actionColOpt = computed(() => {
  const { actionColOptions } = props
  const actionColOpt = {
    style: { textAlign: 'right' },
    span: 4,
    ...actionColOptions, // actionColOptions示例: { span: 8, xxl: 18 },
  }
  return actionColOpt
})

const getSubmitBtnOptions = computed(() => {
  return Object.assign(
    {
      text: '查询',
    },
    props.submitButtonOptions,
  )
})

const getResetBtnOptions = computed(() => {
  return Object.assign(
    {
      text: '重置',
    },
    props.resetButtonOptions,
  )
})

const { resetAction, submitAction } = useFormContext()
</script>

<template>
  <a-col v-if="showActionButtonGroup" v-bind="actionColOpt">
    <div style="width: 100%" :style="{ textAlign: actionColOpt.style.textAlign }">
      <a-form-item>
        <slot name="resetBefore" />
        <a-button
          v-if="showResetButton"
          type="default"
          style="margin-right: 8px"
          v-bind="getResetBtnOptions"
          @click="resetAction"
        >
          {{ getResetBtnOptions.text }}
        </a-button>
        <slot name="submitBefore" />
        <a-button
          v-if="showSubmitButton"
          type="primary"
          v-bind="getSubmitBtnOptions"
          @click="submitAction"
        >
          {{ getSubmitBtnOptions.text }}
        </a-button>
      </a-form-item>
    </div>
  </a-col>
</template>
