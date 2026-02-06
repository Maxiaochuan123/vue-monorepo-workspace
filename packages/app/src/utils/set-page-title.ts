export default function setPageTitle(name?: string): void {
  window.document.title = name ? `${name}` : '我的 H5'
}
