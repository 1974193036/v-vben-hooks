import { Tag } from 'ant-design-vue'

const statusMap = {
  0: '关闭',
  1: '运行中',
  2: '上线',
  3: '错误',
}

export function getBasicColumns() {
  return [
    {
      title: '规则名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 100,
      helpMessage: ['这是ID', '这是ID2', '这是ID3'],
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: 280,
      helpMessage: <div style="color: red">这个是jsx渲染出来的描述</div>,
    },
    {
      title: '服务调用次数',
      dataIndex: 'callNo',
      width: 150,
      sorter: (a, b) => a.callNo - b.callNo,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      // format: statusMap // 根据映射表，直接展示文字
      format: (text) => {
        return h(Tag, {
          color: text === '2' ? 'success' : text === '0' ? 'error' : 'default',
        }, {
          default: () => statusMap[text],
        })
      },
    },
    {
      title: '上次调度时间',
      dataIndex: 'updatedAt',
      width: 200,
      format: 'date|YYYY-MM-DD HH:mm:ss', // 时间戳13位转换日期格式
      sorter: (a, b) => a.updatedAt - b.updatedAt,
    },
  ]
}

export function getBasicData() {
  return (() => {
    const arr= []
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: `${index}. John Brown`,
        desc: `${index}-这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述这是描述`,
        callNo: `${index}`,
        status: Math.floor(Math.random() * 4),
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        updatedAt: new Date(),
      })
    }
    return arr
  })()
}