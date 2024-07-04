import { cloneDeep, isFunction, isString } from 'lodash-es'
import { unref } from 'vue'

function isInTagName(e, tagName) {
  return e.composedPath?.().find(dom => dom.tagName === tagName)
}

const ROW_KEY = 'id'

function getKey(
  record,
  rowKey,
  autoCreateKey,
) {
  if (!rowKey || autoCreateKey)
    return record[ROW_KEY]

  if (isString(rowKey))
    return record[rowKey]

  if (isFunction(rowKey))
    return record[rowKey(record)]

  return null
}

export function useCustomRow(
  getProps,
  { setSelectedRowKeys, getSelectRowKeys, clearSelectedRowKeys, getAutoCreateKey, emit },
) {
  const customRow = (record, index) => {
    return {
      // 点击行
      onClick: (e) => {
        e?.stopPropagation()
        const isInButton = isInTagName(e, 'BUTTON')
        const isInLink = isInTagName(e, 'A')
        if (isInButton || isInLink)
          return

        function handleClick() {
          const { rowSelection, rowKey, clickToRowSelect } = unref(getProps)
          if (!rowSelection || !clickToRowSelect)
            return
          const keys = cloneDeep(getSelectRowKeys() || [])
          const key = getKey(record, rowKey, unref(getAutoCreateKey))
          if (key === null)
            return

          const isCheckbox = rowSelection.type === 'checkbox'
          if (isCheckbox) {
            // 找到tr
            const tr = isInTagName(e, 'TR')

            if (!tr)
              return
            // 找到Checkbox，检查是否为disabled
            const checkBox = tr.querySelector('input[type=checkbox]')
            if (!checkBox || checkBox.hasAttribute('disabled'))
              return
            if (!keys.includes(key)) {
              keys.push(key)
              setSelectedRowKeys(keys)
              return
            }
            const keyIndex = keys.findIndex(item => item === key)
            keys.splice(keyIndex, 1)
            setSelectedRowKeys(keys)
            return
          }

          const isRadio = rowSelection.type === 'radio'
          if (isRadio) {
            if (!keys.includes(key)) {
              if (keys.length)
                clearSelectedRowKeys()

              setSelectedRowKeys([key])
              return
            }
            clearSelectedRowKeys()
          }
        }
        handleClick()
        emit('row-click', record, index, e)
      },
      onDblclick: (event) => {
        emit('row-dbClick', record, index, event)
      },
    }
  }

  return { customRow }
}
