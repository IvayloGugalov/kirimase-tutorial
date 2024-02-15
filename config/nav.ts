import { SidebarLink } from '@/components/SidebarItems'
import { Cog, Globe, HomeIcon } from 'lucide-react'

type AdditionalLinks = {
  title: string
  links: SidebarLink[]
}

export const defaultLinks: SidebarLink[] = [
  { href: '/dashboard', title: 'Home', icon: HomeIcon },
  { href: '/account', title: 'Account', icon: Cog },
  { href: '/settings', title: 'Settings', icon: Cog },
]

export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'Entities',
    links: [
      {
        href: '/reviews',
        title: 'Reviews',
        icon: Globe,
      },
      {
        href: '/reservations',
        title: 'Reservations',
        icon: Globe,
      },
      {
        href: '/restaurants',
        title: 'Restaurants',
        icon: Globe,
      },
    ],
  },
]
