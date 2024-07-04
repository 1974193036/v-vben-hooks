<script setup>
import { ref } from 'vue'
import { getBasicColumns, getBasicData } from './table'
import { BasicTable } from './BasicTable'

const border = ref(true)
const loading = ref(false)
const striped = ref(true)
const pagination = ref(true)

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

let __setLoading, __getSelectRows, __getSelectRowKeys, __setSelectedRowKeys, __clearSelectedRowKeys, __setPagination
function register(tableAction) {
  // console.log('tableAction', tableAction)
  const { setLoading, getSelectRows, getSelectRowKeys, setSelectedRowKeys, clearSelectedRowKeys, setPagination } = tableAction
  __setLoading = setLoading
  __getSelectRows = getSelectRows
  __getSelectRowKeys = getSelectRowKeys
  __setSelectedRowKeys = setSelectedRowKeys
  __clearSelectedRowKeys = clearSelectedRowKeys
  __setPagination = setPagination
}
</script>

<template>
  <div style="margin: 50px 200px;">
    <a-space style="margin:5px 0">
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
    <a-space style="margin:5px 0">
      <a-button type="primary" @click="() => __setLoading(true)">
        手动开启loading
      </a-button>
      <a-button type="primary" @click="() => console.log(__getSelectRowKeys())">
        手动获取选中行的keys
      </a-button>
      <a-button type="primary" @click="() => console.log(__getSelectRows())">
        手动获取选中行的数据
      </a-button>
      <a-button type="primary" @click="() => __setSelectedRowKeys(['1', '2'])">
        手动设置选中行的keys
      </a-button>
      <a-button type="primary" @click="() => __clearSelectedRowKeys()">
        手动清空选中行
      </a-button>
    </a-space>
    <a-space style="margin:5px 0">
      <a-button type="primary" @click="() => __setPagination({ current: 1 })">
        手动设置分页信息-回到第一页
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
      :row-selection="{
        type: 'checkbox',
      }"
      row-key="id"
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
