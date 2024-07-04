<script setup>
import { ref } from 'vue'
import { getBasicColumns, getBasicData } from './table'
import { BasicTable } from './BasicTable'

const border = ref(true)
const loading = ref(false)
const striped = ref(true)
const pagination = ref(false)

const columns = getBasicColumns()
const data = getBasicData()

function toggleBorder() {
  border.value = !border.value
}

function toggleLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    pagination.value = { pageSize: 20 }
  }, 3000)
}

function toggleStriped() {
  striped.value = !striped.value
}

let __setLoading
function register(tableAction) {
  // console.log('tableAction', tableAction)
  const { setLoading } = tableAction
  __setLoading = setLoading
}
</script>

<template>
  <div style="margin: 50px 200px;">
    <a-space>
      <a-button type="primary" @click="toggleBorder">
        {{ !border ? '显示边框' : '隐藏边框' }}
      </a-button>
      <a-button type="primary" @click="toggleLoading">
        开启loading
      </a-button>
      <a-button type="primary" @click="toggleStriped">
        {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
      </a-button>

      <a-button type="primary" @click="() => __setLoading(true)">
        手动开启loading
      </a-button>
    </a-space>
    <BasicTable
      title="基础示例"
      title-help-message="温馨提醒"
      :columns="columns"
      :data-source="data"
      :bordered="border"
      :loading="loading"
      :striped="striped"
      :pagination="pagination"
      show-table-setting
      @register="register"
    >
      <template #toolbar>
        <a-space>
          <a-button type="primary" @click="toggleBorder">
            {{ !border ? '显示边框' : '隐藏边框' }}
          </a-button>
          <a-button type="primary" @click="toggleLoading">
            开启loading
          </a-button>
          <a-button type="primary" @click="toggleStriped">
            {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
          </a-button>
        </a-space>
      </template>
    </BasicTable>
  </div>
</template>
