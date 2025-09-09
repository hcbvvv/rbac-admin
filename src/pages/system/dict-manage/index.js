/**
 * DictManage 页面模块入口
 */
export { default } from './DictManage'

// 导出子组件（如果需要在外部使用）
export { default as DictList } from './components/DictList'
export { default as DictDetail } from './components/DictDetail'
export { default as DictOptions } from './components/DictOptions'
export { default as DictModal } from './components/DictModal'
export { default as OptionModal } from './components/OptionModal'

// 导出自定义Hook
export { useDictManage } from './hooks/useDictManage'