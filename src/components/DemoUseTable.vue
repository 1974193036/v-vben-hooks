<script setup>
import { BasicTable, useTable } from './BasicTable'
import { getBasicColumns, getBasicData, getBasicShortColumns } from './table'

const columns = getBasicColumns()
const data = getBasicData()

function getListApi(params) {
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 1,
        msg: '成功',
        responseEntity: data.slice(start, start + pageSize),
        count: data.length,
      })
    }, 400)
  })
}

function getFormConfig() {
  return {
    labelWidth: 80,
    actionColOptions: { span: 8 },
    schemas: [
      {
        field: 'name',
        label: '规则名称',
        component: 'Input',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'desc',
        label: '描述',
        component: 'Input',
        // slot: 'desc',
        colProps: {
          span: 8,
        },
      },
    ],
  }
}

const [
  register,
  {
    setLoading,
    getColumns,
    getDataSource,
    reload,
    getSelectRows,
    getSelectRowKeys,
    clearSelectedRowKeys,
    setSelectedRowKeys,
    setColumns,
    // form相关
    getForm,
  },
] = useTable({
  title: 'useTable示例',
  titleHelpMessage: '使用useTable调用表格内方法，不设置title就不显示标题',
  useSearchForm: true,
  api: getListApi,
  columns,
  formConfig: getFormConfig(),
  rowKey: 'id',
  rowSelection: {
    type: 'checkbox', // checkbox / radio
  },
})
</script>

<template>
  <div style="margin: 50px 200px;">
    <BasicTable @register="register">
      <template #toolbar>
        <div>
          <a-space style="margin:5px 0">
            <a-button type="primary" @click="() => setLoading(true)">
              手动开启loading
            </a-button>
            <a-button type="primary" @click="() => console.log(getSelectRowKeys())">
              手动获取选中行的keys
            </a-button>
            <a-button type="primary" @click="() => console.log(getSelectRows())">
              手动获取选中行的数据
            </a-button>
            <a-button type="primary" @click="() => setSelectedRowKeys(['1', '2'])">
              手动设置选中行的keys
            </a-button>
            <a-button type="primary" @click="() => clearSelectedRowKeys()">
              手动清空选中行
            </a-button>
          </a-space>
        </div>
        <div>
          <a-space style="margin:5px 0">
            <a-button type="primary" @click="() => console.log(getDataSource())">
              手动获取列表数据
            </a-button>
            <a-button type="primary" @click="() => reload({ page: 1 })">
              手动刷新列表数据
            </a-button>
            <a-button type="primary" @click="() => console.log(getColumns())">
              手动获取列表项
            </a-button>
            <a-button type="primary" @click="() => setColumns(getBasicShortColumns())">
              手动设置列表项
            </a-button>
          </a-space>
        </div>
        <div>
          <a-space style="margin:5px 0">
            <a-button type="primary" @click="() => console.log(getForm().getFieldsValue())">
              获取表单数据
            </a-button>
            <a-button type="primary" @click="() => getForm().setFieldsValue({ name: 'zs' })">
              设置表单数据
            </a-button>
          </a-space>
        </div>
      </template>
    </BasicTable>
  </div>
</template>
