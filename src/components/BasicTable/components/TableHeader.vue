<script setup>
import TableSettingComponent from './settings/index.vue'
import Title from './Title.vue'

defineOptions({ name: 'BasicTableHeader' })

defineProps({
  title: {
    type: [String, Function],
  },
  titleHelpMessage: {
    type: [String, Array],
    default: '',
  },
  showTableSetting: {
    type: Boolean,
  },
  tableSetting: {
    type: Object,
  },
})

const prefixCls = 'v-basic-table-header'
</script>

<template>
  <div style="width: 100%">
    <div>
      <div v-if="!$slots.tableTitle && title">
        {{ title }}
        <Title v-if="titleHelpMessage" :text="titleHelpMessage" />
      </div>
      <div :class="`${prefixCls}__toolbar`">
        <slot name="toolbar" />
        <a-divider v-if="$slots.toolbar && showTableSetting" type="vertical" />
        <TableSettingComponent
          v-if="showTableSetting"
          :setting="tableSetting"
        />
      </div>
    </div>
  </div>
</template>
