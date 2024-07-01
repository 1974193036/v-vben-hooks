import beauty from '@shishuaiyun/eslint-config'

export default beauty({
  vue: true,
  typescript: false,
}, {
  rules: {
    'no-console': 'off',
  },
})
