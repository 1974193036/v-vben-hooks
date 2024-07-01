export const basicProps = {
  model: {
    type: Object,
    default: () => ({}),
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String],
    default: 0,
  },
  // label 标签的文本对齐方式
  labelAlign: {
    type: String,
    default: 'right',
  },
  // 表单配置规则
  schemas: {
    type: Array,
    default: () => [],
  },

  // mergeDynamicData: {
  //   type: Object as PropType<Recordable>,
  //   default: null,
  // },

  // 配置所有 Row 的 style 样式
  baseRowStyle: {
    type: Object,
  },
  // rowProps
  rowProps: Object,
  // 配置所有选子项的 ColProps
  baseColProps: {
    type: Object,
  },
  // label 标签布局
  labelCol: {
    type: Object,
  },
  // 输入控件 布局样式
  wrapperCol: {
    type: Object,
  },
  // 操作按钮外层 Col 组件配置，如果开启 showAdvancedButton，则不用设置
  actionColOptions: {
    type: Object,
  },
  // 自动设置表单内组件的 placeholder，自定义组件需自行实现
  autoSetPlaceHolder: {
    type: Boolean,
    default: true,
  },
  // 在INPUT组件上单击回车时，是否自动提交
  autoSubmitOnEnter: {
    type: Boolean,
    default: false,
  },
  // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
  autoFocusFirstItem: {
    type: Boolean,
    default: false,
  },
  // 重置时是否提交表单
  submitOnReset: {
    type: Boolean,
    default: false,
  },
  // 紧凑类型表单，减少 margin-bottom
  compact: {
    type: Boolean,
    default: false,
  },
  // 向表单内所有组件传递 size 参数,自定义组件需自行实现 size 接收
  size: {
    type: String,
    default: 'default', // 'default' | 'small' | 'large'
  },
  // 禁用表单
  disabled: {
    type: Boolean,
    default: false,
  },

  // emptySpan: {
  //   type: [Number, Object] as PropType<number | Recordable>,
  //   default: 0,
  // },

  // 是否显示收起展开按钮
  showAdvancedButton: {
    type: Boolean,
    default: false,
  },
  // 超过3行自动折叠
  autoAdvancedLine: {
    type: Number,
    default: 3,
  },
  // 不受折叠影响的行数
  alwaysShowLines: {
    type: Number,
    default: 2,
  },
  // 将表单内时间区域的值映射成 2 个字段
  // 如果表单内有时间区间组件，获取到的值是一个数组
  fieldMapToTime: {
    type: Array,
    default: () => [],
  },
  // 转化时间
  transformDateFunc: {
    type: Function,
    default: (date) => {
      return date?.format?.('YYYY-MM-DD') ?? date
    },
  },

  // rulesMessageJoinLabel: booleanType<boolean>(true),

  // 是否显示操作按钮(重置/提交)
  showActionButtonGroup: {
    type: Boolean,
    default: true,
  },
  // 显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true,
  },
  // 重置按钮配置
  resetButtonOptions: {
    type: Object,
  },
  // 显示确认按钮
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  // 确认按钮配置
  submitButtonOptions: {
    type: Object,
  },
  // 重置表单行为前执行自定义重置按钮逻辑
  resetFunc: {
    type: Function,
  },
  // 自定义提交按钮逻辑
  submitFunc: {
    type: Function,
  },

  // 以下为默认props
  // 隐藏所有表单项的必选标记
  hideRequiredMark: {
    type: Boolean,
    default: false,
  },
  // 表单布局
  layout: {
    type: String,
    default: 'horizontal', // 'horizontal' | 'vertical' | 'inline'
  },
  // 操作表格的函数，与 useTable 返回的操作函数一致
  tableAction: {
    type: Object,
  },
  // 配合 label 属性使用，表示是否显示 label 后面的冒号
  colon: {
    type: Boolean,
    default: false,
  },
}
