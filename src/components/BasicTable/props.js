export const basicProps = {
  // 点击行是否选中 checkbox 或者 radio
  clickToRowSelect: {
    type: Boolean,
    default: true,
  },
  // 是否显示表格设置工具
  showTableSetting: {
    type: Boolean,
    default: true,
  },
  // 表格设置工具配置，
  tableSetting: {
    type: Object,
    default: () => ({
      // 是否显示刷新按钮
      redo: true,
      // 是否显示尺寸调整按钮
      size: true,
      // 是否显示字段调整按钮
      setting: true,
      // 是否显示全屏按钮
      fullScreen: true,
    }),
  },
  // 是否取消表格的默认padding
  inset: {
    type: Boolean,
    default: false,
  },
  // 是否自动生成 key
  autoCreateKey: {
    type: Boolean,
    default: true,
  },
  // 是否斑马纹
  striped: {
    type: Boolean,
    default: false,
  },
  // 请求接口
  api: {
    type: Function,
    default: null,
  },
  // 请求之前对参数进行处理
  beforeFetch: {
    type: Function,
    default: null,
  },
  // 请求之后对返回值进行处理
  afterFetch: {
    type: Function,
    default: null,
  },
  // 开启表单后，在请求之前处理搜索条件参数
  handleSearchInfoFn: {
    type: Function,
    default: null,
  },
  // 接口请求配置，可以配置请求的字段和响应的字段名
  fetchSetting: {
    type: Object,
    default: () => ({
      pageField: 'page',
      sizeField: 'pageSize',
      listField: 'responseEntity',
      totalField: 'count',
    }),
  },
  // 立即请求接口
  immediate: {
    type: Boolean,
    default: true,
  },
  // 额外的请求参数
  searchInfo: {
    type: Object,
    default: null,
  },
  // 是否使用搜索表单
  useSearchForm: {
    type: Boolean,
    default: false,
  },
  // 表单配置
  formConfig: {
    type: Object,
    default: null,
  },
  // 表格列信息
  columns: {
    type: Array,
    default: () => [],
  },
  // 是否显示序号列
  showIndexColumn: {
    type: Boolean,
    default: false,
  },
  // 表格右侧操作列配置
  actionColumn: {
    type: Object,
    default: null,
  },
  // 文本超过宽度是否显示...
  ellipsis: {
    type: Boolean,
    default: true,
  },
  // 切换页码是否重置勾选状态
  clearSelectOnPageChange: {
    type: Boolean,
    default: true,
  },
  // 选择列配置
  rowSelection: {
    type: Object,
    default: null,
  },
  // 表格标题
  title: {
    type: [String, Function],
    default: null,
  },
  // 表格标题右侧温馨提醒
  titleHelpMessage: {
    type: [String, Array],
    default: null,
  },
  // 表格数据，非 api 加载情况
  dataSource: {
    type: Array,
    default: null,
  },
  // 表格行 key 的取值，可以是字符串或一个函数
  rowKey: {
    type: [String, Function],
    default: '',
  },
  // 是否显示表格边框
  bordered: {
    type: Boolean,
    default: false,
  },
  // 分页信息配置，为 false 不显示分页
  pagination: {
    type: [Object, Boolean],
    default: null,
  },
  // loading
  loading: {
    type: Boolean,
    default: false,
  },
  // 表格是否可滚动，也可以指定滚动区域的宽、高
  scroll: {
    type: Object,
    default: null,
  },
  // 表格大小
  size: {
    type: String,
    default: 'middle',
  },
}
