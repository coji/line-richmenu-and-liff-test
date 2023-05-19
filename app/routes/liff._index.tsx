import { useLiff } from '~/hooks/liff'

// LIFF エンドポイント。URL パス/パラメータに基づいてリダイレクトされるので何も表示しない
export default function LiffIndexPage() {
  useLiff()
  return <div></div>
}
