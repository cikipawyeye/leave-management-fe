import { Activity } from 'lucide-react'
import { HtmlHTMLAttributes } from 'react'

export default function AppLogoIcon(props: HtmlHTMLAttributes<Element>) {
  return (
    <div {...props}>
      <Activity />
    </div>
  )
}
