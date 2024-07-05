<script setup>
import { computed } from 'vue'
import Title from './Title.vue'

defineOptions({ name: 'TableHeaderCell' })

const props = defineProps({
  column: {
    type: Object,
    default: () => ({}),
  },
})

const prefixCls = 'v-basic-table-header-cell'

const getTitle = computed(() => {
  const column = props.column
  if (typeof column.customHeaderRender === 'function')
    return column.customHeaderRender(column)

  return column?.customTitle || column?.title
})

const getHelpMessage = computed(() => props.column.helpMessage)
</script>

<template>
  <div>
    <span class="default-header-cell">{{ getTitle }}</span>
    <Title v-if="getHelpMessage" :text="getHelpMessage" :class="`${prefixCls}__help`" />
  </div>
</template>
