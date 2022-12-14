import defaultSettings from '@/settings'

const title = defaultSettings.title || '后台管理项目'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
